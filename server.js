const path = require("path")
const mongoose = require('mongoose');
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const fs = require('fs')
var XMLHttpRequest = require('xhr2');
const ParkingModel = require("./Models/ParkingModel.js")

require("dotenv").config()


/**
 * //Connect to DB --dotenv
 * mongoose.connect(process.env.MONGODB_URI, {
 *     useNewUrlParser: true,
 * })
 *     .then(() =>
 *         console.log("Connected to DB"))
 *     .catch((error) =>
 *         console.log("ERROR DB: ", error))
 *
 */

// Connect to DB
let database
mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true, //make this also true
}, function (err, db) {
    if (err) throw err;
    console.log("Connected to DB")
    database = db
})

//Middlewares
const ParkAPI = require("./APIs/ParkAPI.js")
const ParkingRoutes = require("./Routes/ParkingRoutes")
app.use(bodyParser.json())
app.use("/parkings", ParkingRoutes)


app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './Client/park_API.html')));

app.get('/entrada', (req, res) =>
    res.sendFile(path.join(__dirname, './Client/entrance_and_exit_registry.html')));


//HTTP Server
const httpServer = app.listen(5000, 'localhost', () => {
    console.log('HTTP server is listening on localhost:5000')
})


//WebSocket Server
const WebSocket = require("ws");
const {json} = require("express/lib/response");
const server = new WebSocket.Server({port: "8080"});
console.log("WebSocket Server listening on localhost:8080");


server.on('connection',
    wsClient => {
        console.log("New connection")
        wsClient.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)

                //Recives request from client to send parking data
                if (data.msg_type == "request") {
                    let all_parkings_promise = new Promise(function (myResolve, myReject) {
                        let req = new XMLHttpRequest();
                        req.open('GET', `http://localhost:5000/parkings`);
                        req.onload = function () {
                            if (req.status == 200) {
                                myResolve(req.response);

                            } else {
                                myReject("Collection not Found");
                            }
                        };
                        req.send();
                    });
                    all_parkings_promise.then(
                        function (value) {
                            wsClient.send(JSON.stringify({
                                msg_type: "reply",
                                content: value
                            }))
                        },
                        function (error) {
                            console.log(error);
                        }
                    );

                } else if (data.msg_type == "add_car") {
                    let add_car_promise = new Promise(function (myResolve, myReject) {
                        let req = new XMLHttpRequest();
                        const body = {
                            _id: data.car_id
                        }
                        req.open('PATCH', `http://localhost:5000/parkings/${data.parking}/add-car`);
                        req.onload = function () {
                            if (req.status == 200) {
                                myResolve(req.response);

                            } else {
                                myReject(req.response);

                            }
                        };
                        req.setRequestHeader('Content-type', 'application/json')
                        req.send(JSON.stringify(body));
                    });
                    add_car_promise.then(
                        function (value) {
                            const msg = {
                                msg_type: "operation_result",
                                result: `Se ha añadido el coche ${data.car_id} en el parking ${data.parking}`
                            }
                            wsClient.send(JSON.stringify(msg))

                        },
                        function (error) {
                            let msg
                            if (error == "PARKING_IS_FULL_EXCEPTION") {
                                msg = {
                                    msg_type: "operation_result",
                                    result: `El parking ${data.parking} no tiene sitios libres`
                                }
                            } else if (error == "CAR_ALREADY_ADDED_EXCEPTION") {
                                msg = {
                                    msg_type: "operation_result",
                                    result: `El coche ${data.car_id} ya está en el parking ${data.parking}`
                                }
                            } else {
                                msg = {
                                    msg_type: "operation_result",
                                    result: `Ha ocurrido un error inesperado :(`
                                }
                            }

                            wsClient.send(JSON.stringify(msg))
                        }
                    )
                    ;

                } else if (data.msg_type == "remove_car") {
                    let remove_car_promise = new Promise(function (myResolve, myReject) {
                        let req = new XMLHttpRequest();

                        req.open('PATCH', `http://localhost:5000/parkings/${data.parking}/remove-car/${data.car_id}`);
                        req.onload = function () {
                            if (req.status == 200) {
                                myResolve(req.response);

                            } else {
                                myReject(req.response);
                            }
                        };
                        req.setRequestHeader('Content-type', 'application/json')
                        req.send();
                    });
                    remove_car_promise.then(
                        function (value) {
                            const msg = {
                                msg_type: "operation_result",
                                result: `Se ha borrado el coche ${data.car_id} en el parking ${data.parking}`
                            }
                            wsClient.send(JSON.stringify(msg))
                        },

                        function (error) {
                            let msg
                            if (error == "CAR_NOT_FOUND_EXCEPTION") {
                                msg = {
                                    msg_type: "operation_result",
                                    result: `El coche ${data.car_id} no se encuentra en el parking ${data.parking}`
                                }
                            } else {
                                msg = {
                                    msg_type: "operation_result",
                                    result: `Ha ocurrido un error inesperado :(`
                                }
                            }

                            wsClient.send(JSON.stringify(msg))
                        }
                    );
                }
            } catch (err) {
                console.log("Error with the message from the client: ", err.message)

            }

        }


    })

