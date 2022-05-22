'use strict';

const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model("users")



//Read all Users in DB
exports.read_all_users = (async (req, res) => {
    try{
    const users = await User.find()
    res.send(users)
    }catch(err){
        res.status(404).send(err)
    }
})

exports.sign_up_user = (req, res) => {
    const rb = req.body
    const allFields = rb.username && rb.name
                       && rb.email && rb.password ;
    if (!allFields) {
        return res
                .status(400)
                .json({"message" : "all fields must be filled"})
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
            res.status(201).json(token);
        }
    })
}

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
            res.status(200).json({token});
        } else {
            res.status(401) 
                .json(info)
        }
    })(req, res)
}

exports.get_user = function (req, res) {
    User.findById(req.params.userid, function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};

exports.addCar = async function (req, res) {
    try{
        //TODO: Add car already added exception
        const user = await User.findById(req.params.userid)
        user.cars_owned.push(req.params.car_id)
        await user.save()
        res.send({user: user})
    }catch(err){
        res.status(400).send(err)
    }
};