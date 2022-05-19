const  mongoose = require("mongoose")



const logSchema = mongoose.Schema({
    entrance_date: Date,
    exit_date: Date,
    car_id: String,
    //Price and Ticket only for non-user cars
    price: Number,
    ticket: Number //Unique inside one Parking -> implement restrictions in ParkAPI
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
