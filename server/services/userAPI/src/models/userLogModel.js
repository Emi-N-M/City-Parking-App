const  mongoose = require("mongoose")



const logSchema = mongoose.Schema({
    entrance_date: Date,
    exit_date: Date,
    hours: Number,
    car_id: String,
    price: Number,
    parking: String
})

const UserLogSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    logs: [logSchema]
})

module.exports = mongoose.model("users-log", UserLogSchema)
