const express = require("express")
const router = express.Router()
const ParkingModel = require("../Models/ParkingModel.js")

router.get("/",async(req, res) => { //Read all Parkings in DB
    try{
        const posts = await ParkingModel.find()
        res.json(posts)
    }catch (err){
        res.json({msg: err})
    }
})

router.post("/", async(req,res) =>{     //Write new Parking in DB
    const parking = new ParkingModel({
        name: req.body.name,
        capacity: req.body.capacity
    })
    try {
        const savedParking = await parking.save()
        res.json(savedParking)
    }catch (err){
        res.json({msg: err})
    }
})

module.exports = router