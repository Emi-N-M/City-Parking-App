const path = require("path")
const mongoose = require('mongoose');
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const fs = require('fs')
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
mongoose.connect(process.env.MONGODB_URI, function (err, db) {
    if (err) throw err;
    console.log("Connected to DB")
    database = db
})

//Middlewares
const parkingsRoute = require("./Routes/ParkingsRoutes.js")
app.use(bodyParser.json())
app.use("/parkings", parkingsRoute)
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './Client/client-websocket.html')));


//HTTP Server
const httpServer = app.listen(5000, 'localhost', () => {
    console.log('HTTP server is listening on localhost:5000')
})


//WebSocket Server
const WebSocket = require("ws");
const server = new WebSocket.Server({port: "8080"});
console.log("WebSocket Server listening on localhost:8080");

server.on('connection',
    wsClient => {
        console.log("New connection")
        wsClient.onmessage = (event) => {
            // Client request to read all parkings in database
            if (event.data == "READ_PARKING_DB_REQUEST") {

                database.db.collection("parkings_2").find({}).toArray(function (err, result) {
                    if (err) throw err;
                    wsClient.send(JSON.stringify(result))
                });
            }
        }


    })

