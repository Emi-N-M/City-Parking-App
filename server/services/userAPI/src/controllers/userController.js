'use strict';

const passport = require('passport')
const mongoose = require('mongoose');
const e = require('cors');
const User = mongoose.model("users")
const UserLog = require("../models/userLogModel")



//Read all Users in DB
exports.read_all_users = (async (req, res) => {
    try{
    const users = await User.find()
    res.status(200).send(users)
    }catch(err){
        res.status(404).send({msg: err})
    }
})

//Register new user
exports.sign_up_user = (req, res) => {
    const rb = req.body
    const allFields = rb.username && rb.name
                       && rb.email && rb.password ;
    if (!allFields) {
        return res
                .status(400)
                .json({"message" : "all fields must be filled: username, name, email, password"})
    }

    const user = new User()
    user.username = rb.username
    user.name = rb.name
    user.email = rb.email
    user.password = {hash:'', salt:''}
    user.setDataPassword(rb.password)

    user.save( (err) => {
        if (err) {
            res.status(404).json(err)
        } else {
            const token = user.getJWT();
            res.status(201).json({accessToken: token});
        }
    })
}

//Login user
exports.login_user = (req, res) => {
    const rb = req.body
    const allFields = rb.username
        && rb.password;
    if (!allFields) {
        return res
            .status(400)
            .json({"message": "all fields must be filled"})
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(404).json(err)
        }
        if (user) {
            const token = user.getJWT();
            res.status(200).json({accessToken: token});
        } else {
            res.status(401) 
                .json(info)
        }
    })(req, res)
}

//Get one user info
exports.get_user =  async function (req, res) {
   try{
    const user = await User.findById(req.params.userid)
    if(!user) throw "USER_NOT_FOUND_EXCEPTION"
    res.status(200).send(user)
    }catch(err){
        res.status(400).send({msg: err})
    }
};

//See if has a car given car_id
exports.hasCar = async function (req,res) {
  try{  
    const user = await User.findById(req.params.userid)

    if(!user) throw "USER_NOT_FOUND_EXCEPTION"
    if(user.cars_owned.includes(req.params.car_id)){
        res.status(200).send({msg: `The car ${req.params.car_id} belongs to ${user.name}`})
    }else{
        res.status(404).send({msg: `The car ${req.params.car_id} doesn´t belong to ${user.name}`})

    }}catch(err){
        res.status(400).send({msg: err})
    }
}


//Add car to user´s owned cars
exports.addCar = async function (req, res) {
    try{
        const user = await User.findById(req.params.userid)
        if(user.cars_owned.includes(req.params.car_id)) throw "CAR_ALREADY_ADDED_EXCEPTION"
        user.cars_owned.push(req.params.car_id)
        await user.save()
        res.send({user: user})
    }catch(err){
        res.status(400).send({msg: err})
    }
};


//Register entrance user parking log
exports.registerEntranceParkingLog = async function (req, res) {
    try{
        //Find user register log
        let userLog

        try {
            userLog = await UserLog.findOne({user: req.params.userid} )
            if (userLog == null) throw "USER_IS_YET_TO_BE_ADDED_ON_LOGS"
        } catch (error) {
            console.log(error)
            userLog = new UserLog({
                user: req.params.userid,
            })      
        }
        
        //Log the entrance
        const newLog = {
            entrance_date: Date(),
            car_id: req.params.car_id
        }
        userLog.logs.push(newLog)
        await userLog.save()    
    }catch(err){
        res.status(400).send({msg: err})
    }
}

//Register exit user parking log
exports.registerExitParkingLog = async function (req, res) {
    try{
        //Find user register log
        const userLog = await UserLog.findOne({user: req.params.userid} )
       
    
        //Log the exit
        userLog.logs.forEach(log => {
            if (log.car_id == req.params.car_id && !log.exit_date) {
                log.exit_date = Date()
                log.price = req.body.price
                log.hours = req.body.hours,
                log.parking = req.body.parking

            }
        });
        await userLog.save()    
    }catch(err){
        res.status(400).send({msg: err})
    }
}