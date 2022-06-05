'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: {
            hash: String,
            salt: String
        },
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true, 
        required: true
    },
    cars_owned:{
        type: [String]
    }
}, {collection: "users"})




//Authentication Methods
const crypto = require('crypto');

UserSchema.methods.setDataPassword =  function(passwordInput) {
    const salt = crypto.randomBytes(16).toString('hex'); 
     this.password.salt = salt;
     this.password.hash = crypto.pbkdf2Sync(passwordInput, salt, 1000, 64,'sha512').toString('hex');

}

//Validate password
UserSchema.methods.validPassword = function(passwordInput) {
    const hash =  crypto.pbkdf2Sync(passwordInput, this.password.salt, 1000, 64,'sha512').toString('hex');
    return this.password.hash === hash;
};


//Generate JWT
const jwt = require('jsonwebtoken');
UserSchema.methods.getJWT = function () {
    //const validade = new Date();
   // validade.setDate(validade.getDate() + 7);
    return jwt.sign({ 
            _id: this._id, 
            username: this.username,
            email: this.email, 
            nome: this.nome 
            //exp: parseInt(validade.getTime() / 1000, 10), 
            }, process.env.ACCESS_TOKEN_SECRET ); 
};


//Export user Schema
module.exports = mongoose.model("users", UserSchema)
