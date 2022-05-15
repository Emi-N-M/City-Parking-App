const express = require("express")

const Park = require("../Models/ParkingModel.js")
const ParkLog = require("../Models/ParkingLogModel.js")
const UserAPI = require("../APIs/UserAPI.js")

const { Console } = require("console")
const { findOne } = require("../Models/CarModel.js")
const res = require("express/lib/response")


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

        try {
            parkingLog = await ParkLog.findOne({parking: req.params.id} )
            if (parkingLog == null) throw "PARKING_IS_YET_TO_BE_ADDED_ON_LOGS"
        } catch (error) {
            console.log(error)
            parkingLog = new ParkLog({
                parking: req.params.id,
            })      
        }
        
      

        //Generate ticket
        let unique = false
        while(!unique){
        let ticket = Math.floor(100000 + Math.random() * 900000); 
            unique = true
            parkingLog.logs.forEach((log, index) => {
                if(log.ticket == ticket){
                    unique = false
                    return
                }
            })
        }


        const log = {
            entrance_date: Date(),
            car_id: newCar,
            ticket: ticket
        }
        
        parkingLog.logs.push(log)

        await parking.save();

        await parkingLog.save()


        //Send ticket too
        res.send({data: parking});
    } catch (err) {
        res.status(400).send(err);
    }
}

//Remove car from parking given _id and Matricula
exports.removeCar = async (req, res) => {

    try {
        const parking = await Park.findById(req.params.id)
       
        const index = parking.cars_stored.indexOf(req.params.car_id)
        //Car not found exception 
        if (index !== -1) {
            parking.cars_stored.splice(index, 1);
           
        }else {
        throw "CAR_NOT_FOUND_EXCEPTION"
        }

        //Car is not from user exception
        if(() => {
                const users = UserAPI.readAllUsers
                users.forEach((user, index) =>{
                        if(user.cars_owned.includes(req.params.car_id)) return false    //Car is from an user
                    }
                )

                return true //Car is not found in users collection
            }){
            throw "CAR_IS_NOT_FROM_USER"
        }

        //Regist car exit on logs
        const parkingLog = await ParkLog.findOne({parking: req.params.id})
        
        console.log("Parking log: ", parkingLog) 
        //For user cars, find only first car log by car_id, starting from the end. 
        //Otherwise it overwrites the previous logs of the same car
        parkingLog.logs.forEach((log, i) => {
            let index = parkingLog.logs.length - i
            if(parkingLog.logs[index].car_id == req.params.car_id){   
                parkingLog.logs[index].exit_date = Date()
                return
            }
        })
       

        await parkingLog.save()
        await parking.save()   
        res.send({data: parking});
    } catch (err) {
        res.status(400).send(err);
    }
}

//Remove car by ticket

exports.removeCarByTicket = async (req, res) => {

    try {
        const parking = await Park.findById(req.params.id)
       
        const index = parking.cars_stored.indexOf(req.params.car_id)
        if (index !== -1) {
            parking.cars_stored.splice(index, 1);
           
        }else {
        //Car not found exception 
        throw "CAR_NOT_FOUND_EXCEPTION"
        }

        //Regist car exit on logs
        const parkingLog = await ParkLog.findOne({parking: req.params.id})
        
        console.log("Parking log: ", parkingLog)    
        parkingLog.logs.forEach((log, index) => {
            if(log.ticket == req.params.ticket){    //It HAS to find the log by the ticket, NOT the car_id. Otherwise it overwrites the previous logs of the same car
                console.log("log: ", log)
                log.exit_date = Date()
                //Calculate price
                const date1 = log.entrance_date
                const date2 = log.exit_date
                const hours = Math.abs(date1 - date2) / 36e5;
                console.log("Horas de parking: ", hours)
                const pricePaking = parking.price_per_hour
                console.log("Precio por hora del parking: ", pricePaking)
                const price = (hours<1)? pricePaking:hours*pricePaking
                console.log("Precio del estacionamiento: ", price)

                log.price = price
            }
        })
       

        await parkingLog.save()
        await parking.save()   
        res.send({data: parking});
    } catch (err) {
        res.status(400).send(err);
    }
}
