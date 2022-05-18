const { type } = require("express/lib/response")
const  mongoose = require("mongoose")
const cars_storedSchema = require("./CarModel");

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
    cars_owned:{
        type: [String]
    }
})


// --------------------------------------------------
// - Métodos associados ao Schema

// ------------------------------
// - setDadosPassword(password):    calcula o hash de uma dada password, e guarda

// -
const crypto = require('crypto');

UserSchema.methods.setDataPassword =  function(passwordInput) {
    const salt = crypto.randomBytes(16).toString('hex'); 
     this.password.salt = salt;
     this.password.hash = crypto.pbkdf2Sync(passwordInput, salt, 1000, 64,'sha512').toString('hex');


}; 

// --------
// - validarPassword(password)
UserSchema.methods.validPassword = function(passwordInput) {
    const hash =  crypto.pbkdf2Sync(passwordInput, this.password.salt, 1000, 64,'sha512').toString('hex');
    return this.password.hash === hash;
};

// --------
// - gerarJwt()
const jwt = require('jsonwebtoken');
UserSchema.methods.getJWT = function () {
    const validade = new Date();
    validade.setDate(validade.getDate() + 7); 
    return jwt.sign({ 
            _id: this._id, 
            username: this.username
            //email: this.email, 
            //nome: this.nome, 
            //exp: parseInt(validade.getTime() / 1000, 10), 
            }, process.env.ACCESS_TOKEN_SECRET ); 
};






module.exports = mongoose.model("users", UserSchema)
