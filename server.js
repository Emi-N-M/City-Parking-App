
//FIRST SERVER WITH WEBSOCKETS  --  NOT WORKING


const path = require("path")
const mongoose = require('mongoose');
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const fs = require('fs')
var XMLHttpRequest = require('xhr2');
const jwt = require('jsonwebtoken')
const ParkingModel = require("./Models/ParkingModel.js")
app.use(express.json())
require("dotenv").config()



//HTTP Server
const HTTP_PORT = 5000
const httpServer = app.listen(HTTP_PORT, 'localhost', () => {
    console.log(`HTTP server is listening on localhost:${HTTP_PORT}`)
})


//WebSocket Server
const WS_PORT = 8080
const WebSocket = require("ws");
const {json} = require("express/lib/response");
const server = new WebSocket.Server({port: WS_PORT});
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
                                //TICKET
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

