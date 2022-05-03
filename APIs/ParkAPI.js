const express = require("express")

const Park = require("../Models/ParkingModel.js")
const Car = require("../Models/CarModel.js")
const path = require("path");

//Read all Parkings in DB
exports.readAllParkings = (async(req, res) => { 
    const parks = await Park.find()
    res.send(parks)
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
      res.status(404).send({ error: "Parking is not found!" });
    }
  };


  //Add car to parking given _id and Matricula
  exports.addCar = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);
        const newCar = new Car({
            matricula: req.body.matricula
        })
        parking.cars_stored.push(newCar)
        parking.save();
        res.send({ data: parking });
      } catch {
        res.status(404).send({ error: "Parking is not found!" });
      }
  }
