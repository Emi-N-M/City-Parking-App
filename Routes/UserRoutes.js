const express = require("express")
const Router = express.Router()
const UserAPI = require("../APIs/UserAPI.js")

Router.get("/",UserAPI.readAllUsers)
Router.post("/", UserAPI.addNewUser)
Router.patch("/:id/add-car", UserAPI.addCarToUser)
Router.get("/:id/owns-car", UserAPI.ownsCar)

module.exports = Router