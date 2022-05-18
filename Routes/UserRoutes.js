const express = require("express")
const Router = express.Router()
const UserAPI = require("../APIs/UserAPI.js")

Router.get("/",UserAPI.readAllUsers)
Router.post("/register", UserAPI.addNewUser)
Router.post("/login", UserAPI.authentication)
Router.patch("/:id/add-car/", UserAPI.addCarToUser)
Router.get("/:id/owns-car", UserAPI.ownsCar)

module.exports = Router