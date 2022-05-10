const { type } = require("express/lib/response")
const  mongoose = require("mongoose")
const cars_storedSchema = require("./CarModel");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cars_owned:{
        type: [String]
    }
})

module.exports = mongoose.model("users", UserSchema)
