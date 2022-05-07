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

//Alter parking details
exports.alterParking =  function (req, res) {
    Park.findById( req.params.id ).exec()
        .then( park => {
            if (!park){
                return res.status(404)
                    .json({"message": "Parking is not found!" });
            }
            if (req.body.name)
                park.name = req.body.name
            if (req.body.capacity)
                park.capacity = req.body.capacity
            if (req.body.location)
                park.location = req.body.location
            if (req.body.price_per_hour)
                park.price_per_hour = req.body.price_per_hour
            if (req.body.cars_stored)
                park.cars_stored = req.body.cars_stored

            park.save( () => {
                res.status(200)
                    .jsonp(park);
            }      );
        })
        .catch(err =>
            res.status(400).jsonp({
                error: {message: err.message}
            })
        );
}

//Add car to parking given _id and Matricula
exports.addCar = async (req, res) => {
try {

    const parking = await Park.findById(req.params.id);
    //console.log("Capacity: ", parking.capacity, " Cars: ", parking.cars_stored.length)
    //Parking full exception
    //Car already added exception
    const newCar = new Car({
        _id: req.body._id
    })
    parking.cars_stored.push(newCar)
    parking.save();
    res.send({ data: parking });
  } catch(err) {
    res.status(404).send({ error: "Parking is not found!" });
    console.log("add car error: ", err)
  }
}

//Remove car from parking given _id and Matricula
exports.removeCar = async (req, res) => {
//Car not found exception

  try {
      const parking = await Park.findByIdAndUpdate(req.params.id,
        { $pull: { cars_stored:{ _id: req.params.car_id} } }
      )

      res.send({ data: parking });
    } catch {
      res.status(404).send({ error: "Parking is not found!" });
    }
}