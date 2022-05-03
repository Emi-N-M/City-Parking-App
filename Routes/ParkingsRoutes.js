const express = require("express")
const router = express.Router()
const ParkingModel = require("../Models/ParkingModel.js")
const path = require("path");

router.get("/",async(req, res) => { //Read all Parkings in DB
    res.sendFile(path.join(__dirname, '../Client/client-parkingAPI.html'));
})

/**
 * router.get("/",async(req, res) => { //Read all Parkings in DB
 *     try{
 *         const posts = await ParkingModel.find()
 *         res.json(posts)
 *     }catch (err){
 *         res.json({msg: err})
 *     }
 * })
 */


router.post("/", async(req,res) =>{     //Write new Parking in DB
    const parking = new ParkingModel({
        name: req.body.name,
        capacity: req.body.capacity,
        location: req.body.location,
        price_per_hour: req.body.price_per_hour,
        cars_stored: req.body.cars_stored
    })
    try {
        const savedParking = await parking.save()
        res.json(savedParking)
    }catch (err){
        res.json({msg: err})
    }
})

module.exports = router