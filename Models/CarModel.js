const { type } = require("express/lib/response")
const  mongoose = require("mongoose")

const CarSchema = mongoose.Schema({
    _id: {      //Matricula
        type: String,
        required: true,
    },
    entrance_date:{
        type: Date,
        default:  Date()
    }
})

module.exports = mongoose.model("cars", CarSchema)
