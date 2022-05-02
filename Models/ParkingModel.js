const  mongoose = require("mongoose")

const ParkingSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("Parkings", ParkingSchema)