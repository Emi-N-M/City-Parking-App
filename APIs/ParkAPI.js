const express = require("express")

const Park = require("../Models/ParkingModel.js")
const Car = require("../Models/CarModel.js")
const path = require("path");

//Read all Parkings in DB
exports.readAllParkings = (async(req, res) => { 
    const parkings = await Park.find()
    res.send(parkings)
})

//Write new Parking in DB
exports.addParking = (async(req,res) =>{     
    const parking = new Park({
        _id: req.body._id,
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
        //Parking full exception
        if(parking.capacity == parking.cars_stored.length) throw "PARKING_IS_FULL_EXCEPTION"

        const newCar = new Car({
            _id: req.body._id
        })
        console.log("includes: ", parking.cars_stored.includes(newCar))
        console.log("cars_stored : ", parking.cars_stored)
        console.log("newCar: ", newCar)

        //Car already added exception

        parking.cars_stored.forEach( function (item){
            if(item._id == newCar._id) throw "CAR_ALREADY_ADDED_EXCEPTION"
        })


        parking.cars_stored.push(newCar)
        parking.save();
        res.send({ data: parking });
      } catch(err) {
        res.status(400).send(err);
      }
  }

  //Remove car from parking given _id and Matricula
  exports.removeCar = async (req, res) => {

      try {
          const parking = await Park.findById(req.params.id)
          //Car not found exception
          parking.cars_stored.forEach( function (item, index){
              if(index == parking.cars_stored.length) throw "CAR_NOT_FOUND_EXCEPTION"
          })
          const parkingUpdate = await Park.findByIdAndUpdate(req.params.id,
            { $pull: { cars_stored:{ _id: req.params.car_id} } }
          )
        
          res.send({ data: parking });
        } catch (err){
          res.status(400).send(err);
        }
    }