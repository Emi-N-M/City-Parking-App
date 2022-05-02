const path = require("path")
const mongoose = require('mongoose');
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const fs = require('fs')
const ParkingModel = require("./Models/ParkingModel.js")

require("dotenv").config()


//Connect to DB --dotenv
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
})
    .then(() =>
        console.log("Connected to DB"))
    .catch((error) =>
        console.log("ERROR DB: ", error))


//Middlewares
const parkingsRoute = require("./Routes/parkings.js")
app.use(bodyParser.json())
app.use("/parkings", parkingsRoute)


//HTTP Server
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'client-websocket.html')));

const httpServer = app.listen(5000, 'localhost', () => {
    console.log('HTTP server is listening on localhost:5000')
})


//WebSocket Server
const WebSocket = require("ws");
const server = new WebSocket.Server({port: "8080"});
console.log("WebSocket Server listening on localhost:8080");

//Read JSON file
const filename = 'Data/server_data.json'
const json_file = fs.readFileSync(filename)
const dataJSON = JSON.parse(json_file)

server.on('connection',
    wsClient => {
        console.log("New conection")
        wsClient.on('message', (msg) => {
            client_input = JSON.parse(msg)
            //console.log(dataJSON)

            for (const x in dataJSON) {
                if (dataJSON[x].parking == client_input.parking) {
                    dataJSON[x].cars.push(client_input.matricula)
                }
            }

            fs.writeFile(filename, JSON.stringify(dataJSON), function writeJSON(err) {
                if (err) return console.log(err);
            });

        })
    })