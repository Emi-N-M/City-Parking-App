const express = require("express")
const User = require("../Models/UserModel.js")
const Car = require("../Models/CarModel.js")


//Read all Users in DB
exports.readAllUsers = (async (req, res) => {
    const users = await User.find()
    res.send(users)
})

//Write new User in db
exports.addNewUser = (async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            cars_owned: req.body.cars_owned
        })
        const savedUser = await newUser.save()
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Add car to cars_owned in User
exports.addCarToUser = (async (req, res) => {
    try{
        const newCar = req.body.car_id
        const user = await User.findById(req.params.id)
        user.cars_owned.push(newCar)
        user.save()
        res.send(user)
    }catch (err) {
        res.status(400).send(err)
    }
})

//Check if User has car given car_id
exports.ownsCar = (async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        res.send(user.cars_owned.includes(req.body.car_id))
    }catch (err) {
        res.status(400).send(err)
    }
})