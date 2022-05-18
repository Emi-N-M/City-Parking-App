const express = require("express")

const Router = express.Router()
const ParkAPI = require("../APIs/ParkAPI.js")

Router.get("/", ParkAPI.readAllParkings);
Router.post("/", ParkAPI.addParking);
Router.get("/:id", ParkAPI.findParking);
Router.patch("/:id/add-car/:car_id", ParkAPI.addCar)
Router.patch("/:id/remove-car/:car_id", ParkAPI.removeCar)
Router.patch("/:id/remove-car-by-ticket/:ticket", ParkAPI.removeCarByTicket)

module.exports = Router