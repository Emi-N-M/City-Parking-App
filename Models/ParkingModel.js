const { type } = require("express/lib/response")
const  mongoose = require("mongoose")


const locationSchema = mongoose.Schema({
    latitude: Number,
    longtitude: Number
})



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
    price_per_hour: Number,
    cars_stored: {
        type: [String]       //Max lenght = capacity
    }

})



module.exports = mongoose.model("parkings", ParkingSchema)