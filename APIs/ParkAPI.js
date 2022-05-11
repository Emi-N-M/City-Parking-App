const express = require("express")

const Park = require("../Models/ParkingModel.js")
const ParkLog = require("../Models/ParkingLogModel.js")
const Car = require("../Models/CarModel.js")
const { Console } = require("console")


//Read all Parkings in DB
exports.readAllParkings = (async (req, res) => {
    const parkings = await Park.find()
    res.send(parkings)
})

//Write new Parking in DB
exports.addParking = (async (req, res) => {
    try {
        const parking = new Park({
            _id: req.body._id,
            capacity: req.body.capacity,
            location: req.body.location,
            price_per_hour: req.body.price_per_hour,
            cars_stored: req.body.cars_stored
        })

        const savedParking = await parking.save()
        res.send(savedParking)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Find parking by _id
exports.findParking = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);

        res.send({data: parking});
    } catch {
        res.status(404).send({error: "Parking is not found!"});
    }
};


//Add car to parking given _id and Matricula
exports.addCar = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);
        //Parking full exception
        if (parking.capacity == parking.cars_stored.length) throw "PARKING_IS_FULL_EXCEPTION"

        const newCar = req.body.car_id
       
  
        //Car already added exception

        parking.cars_stored.forEach(function (item) {
            if (item == newCar) throw "CAR_ALREADY_ADDED_EXCEPTION"
        })

        //Add car
        parking.cars_stored.push(newCar)

        //Register log
        let parkingLog
        console.log("parkingLog: ", parkingLog)
        try {
            parkingLog = await ParkLog.findOne({parking: req.params.id} )
            console.log("parkingLog2: ", parkingLog)
            if (parkingLog == null) throw "PARKING_IS_YET_TO_BE_ADDED_ON_LOGS"
        } catch (error) {
            console.log(error)
            parkingLog = new ParkLog({
                parking: req.params.id,
            })      
        }
        console.log(1)
        const log = {
            entrance_date: Date(),
            car_id: newCar
        }
        console.log("parkingLog: ", parkingLog)
        console.log("log: ", log)
        console.log("parkingLog.logs: ", parkingLog.logs)
        
        parkingLog.logs.push(log)

        await parking.save();

        await parkingLog.save()

        console.log("Log: ", parkingLog)
        console.log("parking: ", parking)
        res.send({data: parking});
    } catch (err) {
        console.log("mis putisimos muertos macho")
        res.status(400).send(err);
    }
}

//Remove car from parking given _id and Matricula
exports.removeCar = async (req, res) => {

    try {
        const parking = await Park.findById(req.params.id)
        //Car not found exception
        parking.cars_stored.forEach(function (item, index) {
            if (index == parking.cars_stored.length) throw "CAR_NOT_FOUND_EXCEPTION"
        })
        const parkingUpdate = await Park.findByIdAndUpdate(req.params.id,
            {$pull: {cars_stored: {_id: req.params.car_id}}}
        )

        res.send({data: parking});
    } catch (err) {
        res.status(400).send(err);
    }
}