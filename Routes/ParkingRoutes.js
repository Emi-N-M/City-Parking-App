const express = require("express")

const Router = express.Router()
const ParkAPI = require("../APIs/ParkAPI.js")

Router.get("/", ParkAPI.readAllParkings);
Router.post("/", ParkAPI.addParking);
Router.get("/:id", ParkAPI.findParking);

module.exports = Router