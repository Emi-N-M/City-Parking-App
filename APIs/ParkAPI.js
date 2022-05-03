const express = require("express")

const Park = require("../Models/ParkingModel.js")
const path = require("path");

//Read all Parkings in DB
exports.readAllParkings = (async(req, res) => { 
    res.sendFile(path.join(__dirname, '../Client/client-parkingAPI.html'));
})

//Write new Parking in DB
exports.addParking = (async(req,res) =>{     
    const parking = new Park({
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

//Find parking by _id
exports.findParking = async (req, res) => {
    try {
      const parking = await Park.findById(req.params.id);
      res.send({ data: parking });
    } catch {
      res.status(404).send({ error: "Book is not found!" });
    }
  };
