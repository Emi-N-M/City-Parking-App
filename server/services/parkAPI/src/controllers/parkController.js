'use strict';

const mongoose = require('mongoose')
const Park = mongoose.model("parkings")
const ParkLog = require("../models/parkLogModel")



//Read all Parkings in DB
exports.readAllParkings = (async (req, res) => {
    try{
    const parkings = await Park.find()
    res.send(parkings)
    }catch(err){
        res.status(404).send({msg: err})
    }
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
        res.status(400).send({msg: err})
    }
})

//Find parking by _id read active parkings
exports.getParkingInfo = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);
        if(!parking) throw "PARKING_NOT_FOUND_EXCEPTION"

        const parkingLog = await ParkLog.findOne({parking: req.params.id})
  
        let activeParkings = Array()
        if(parkingLog){
            parkingLog.logs.forEach((log, index) => {
                if(!log.exit_date)
                    activeParkings.push(log)
            })
        }

        res.send({parking: parking, activeParkings: activeParkings});
    } catch(err) {
        if(err == "PARKING_NOT_FOUND_EXCEPTION") 
            res.status(404).send({msg: err});
        else
            res.status(400).send({msg: err})
    }
};

//Find parking by _id read non-active parkings
exports.getParkingInfo_nonActive = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);
        if(!parking) throw "PARKING_NOT_FOUND_EXCEPTION"

        const parkingLog = await ParkLog.findOne({parking: req.params.id})
  
        let nonActiveParkings = Array()
        if(parkingLog){
            parkingLog.logs.forEach((log, index) => {
                if(log.exit_date)
                    nonActiveParkings.push(log)
            })
        }

        res.send({parking: parking, nonActiveParkings: nonActiveParkings});
    } catch(err) {
        if(err == "PARKING_NOT_FOUND_EXCEPTION") 
            res.status(404).send(err);
        else
            res.status(400).send({msg: err})
    }
};


//Get the current price of an active parking
exports.getCurrentPrice = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);
        if(!parking) throw "PARKING_NOT_FOUND_EXCEPTION"

        const  pricePaking = parking.price_per_hour
        const parkingLog = await ParkLog.findOne({parking: req.params.id})
        let price, hours
    
        if(parkingLog){
            parkingLog.logs.forEach((log, index) => {
                if(!log.exit_date && log.car_id == req.params.car_id){
                    const date1 = log.entrance_date
                    const date2 = Date.now()
                    hours = Math.abs(date1 - date2) / 36e5;
                    price = (hours<1)? pricePaking:hours*pricePaking

                }
                
            })
            //throw "ACTIVE_PARKING_NOT_FOUND_EXCEPTION"
        }

        res.send({price: price, hours: hours});
    } catch(err) {
        res.status(400).send({msg: err})
    }
};


//Modify parking by _id
exports.modifyParking = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);
        console.log("parking: ", parking)
        if(!parking) throw "PARKING_NOT_FOUND_EXCEPTION"
    
        //Modify capacity, location or price_per_hour, only if given
        parking.capacity =  (req.body.capacity)?req.body.capacity:parking.capacity,
        parking.location =  (req.body.location)?req.body.location:parking.location,
        parking.price_per_hour = (req.body.price_per_hour)?req.body.price_per_hour:parking.price_per_hour


        await parking.save()
        res.send(parking)
} catch (err){ 
        res.status(400).send({msg: err})
}
};

//Add car to parking given _id and Matricula
exports.addCar = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);
        //Parking full exception
        if (parking.capacity == parking.cars_stored.length) throw "PARKING_IS_FULL_EXCEPTION"

        const newCar = req.params.car_id
       
  
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

        
      
        //Check if the car belongs to an user
        let log, newTicket
        if(req.params.user_code == "no-code"){
    
            //Generate ticket
            let unique = false
            while(!unique){
            newTicket = Math.floor(100000 + Math.random() * 900000); 
                unique = true
                parkingLog.logs.forEach((log, index) => {
                    if(log.ticket == newTicket){
                        unique = false
                        return
                    }
                })
            }
            log = {
                entrance_date: Date(),
                car_id: newCar,
                ticket: newTicket
            }
        }else{
            
 
            log = {
                entrance_date: Date(),
                car_id: newCar,
                userCode: req.params.user_code
            }
        }

        
        parkingLog.logs.push(log)

        await parking.save();


        await parkingLog.save()

       

        //Send ticket too
        res.send({data: parking, ticket: newTicket});
    } catch (err) {
        res.status(400).send({msg: err});
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

    
        //Regist car exit on logs
        const parkingLog = await ParkLog.findOne({parking: req.params.id})

        //Check if car is from user
        const logId = (req.body.ticket) ? req.body.ticket : req.body.userCode
        if(!logId) throw "TICKET_OR_USERCODE_REQUIRED"

        console.log("logID: ", logId)
        let logFound = false, hours, price
        parkingLog.logs.forEach((log, index) => {

            //ticket and userCode are different data types so only one of the
            //conditions below is going to happen
            //(log.ticket == logId || log.userCode == logId)
            if(!log.exit_date && (log.ticket == logId || log.userCode == logId) && log.car_id == req.params.car_id){    //It HAS to find the log by the ticket/userCode, NOT the car_id. Otherwise it overwrites the previous logs of the same car
                logFound = true
                log.exit_date = Date()
                //Calculate price
                const date1 = log.entrance_date
                const date2 = log.exit_date
                hours = Math.abs(date1 - date2) / 36e5;
                const pricePaking = parking.price_per_hour
                price = (hours<1)? pricePaking:hours*pricePaking
                log.price = price
            }
        })
    
        if(!logFound) throw "PARKING_LOG_NOT_FOUND_EXCEPTION"
        await parkingLog.save()
        await parking.save()   
        res.send({data: parking, hours: hours, price: price});
    } catch (err) {
        res.status(400).send({msg: err});
    }
}

