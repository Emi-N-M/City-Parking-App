const express = require("express")
const User = require("../Models/UserModel.js")
const passport = require('passport')



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
            password: {hash:'', salt:''},
            cars_owned: req.body.cars_owned
        })
        console.log("gas")

        newUser.setDataPassword(req.body.password)

        await newUser.save()
        res.send(newUser)
        console.log("token: ", newUser.getJWT())
    } catch (err) {
        res.status(400).send(err)
    }
})


//Login
exports.authentication = (req, res, next) => {
    try{
        const username = req.body.username
        const password = req.body.password
        if(!(username && password)) throw "FILL_ALL_FIELDS"
    }catch(err){
        res.status(400).send(err)
    }


    //Import configPassport
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return res.status(404).json(err)
        }
        if (user) {
            const token = user.getJWT();
            res.status(200).json({token});
        } else {
            res.status(401) 
                .json(info)
        }
    })(req, res, next)
}


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