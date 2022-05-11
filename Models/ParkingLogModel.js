const { type } = require("express/lib/response")
const  mongoose = require("mongoose")
const cars_storedSchema = require("./CarModel");


const logSchema = mongoose.Schema({
    entrance_date:{
        type: Date
    },
    exit_date: Date,
    car_id: String,
    price: Number
})

const ParkingLogSchema = mongoose.Schema({
    parking: {
        type: String,
        required: true,
        unique: true
    },
    logs: [logSchema]
})

module.exports = mongoose.model("parkings-log", ParkingLogSchema)
