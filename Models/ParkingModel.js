const { type } = require("express/lib/response")
const  mongoose = require("mongoose")


const locationSchema = mongoose.Schema({
    latitude: Number,
    longtitude: Number
})
const price_per_hourSchema = mongoose.Schema({
    normal: Number,
    client: Number
})
const cars_storedSchema = require("./CarModel")

const ParkingSchema = mongoose.Schema({
    _id: {  //Name of the Parking
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    location:{
        type: locationSchema,
        required: true
    },
    price_per_hour: {
        type: price_per_hourSchema,
        required: true
    },
    cars_stored: {
        type: [cars_storedSchema.CarSchema]       //Max lenght = capacity
    }
    

})



module.exports = mongoose.model("parkings", ParkingSchema)