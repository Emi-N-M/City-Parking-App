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
        res.status(404).send(err)
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
        res.status(400).send(err)
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
            res.status(404).send(err);
        else
            res.status(400).send(err)
    }
};

//Find parking by _id read non-active parkings
exports.getParkingInfo_nonActive = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);
        if(!parking) throw "PARKING_NOT_FOUND_EXCEPTION"

        const parkingLog = await ParkLog.findOne({parking: req.params.id})
  
        let activeParkings = Array()
        if(parkingLog){
            parkingLog.logs.forEach((log, index) => {
                if(log.exit_date)
                    activeParkings.push(log)
            })
        }

        res.send({parking: parking, activeParkings: activeParkings});
    } catch(err) {
        if(err == "PARKING_NOT_FOUND_EXCEPTION") 
            res.status(404).send(err);
        else
            res.status(400).send(err)
    }
};


//Get the current price of an active parking
exports.getCurrentPrice = async (req, res) => {
    try {
        const parking = await Park.findById(req.params.id);
        if(!parking) throw "PARKING_NOT_FOUND_EXCEPTION"

        const  pricePaking = parking.price_per_hour
        const parkingLog = await ParkLog.findOne({parking: req.params.id})
        let price
    
        if(parkingLog){
            parkingLog.logs.forEach((log, index) => {
                if(!log.exit_date && log.car_id == req.params.car_i){
                    const date1 = log.entrance_date
                    const date2 = log.exit_date
                    const hours = Math.abs(date1 - date2) / 36e5;
                    price = (hours<1)? pricePaking:hours*pricePaking
                }
                
            })
            throw "ACTIVE_PARKING_NOT_FOUND_EXCEPTION"
        }

        res.send({price: price});
    } catch(err) {
        if(err == "PARKING_NOT_FOUND_EXCEPTION") 
            res.status(404).send(err);
        else
            res.status(400).send(err)
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
    if(err == "PARKING_NOT_FOUND_EXCEPTION") 
        res.status(404).send(err);
    
    else
        res.status(400).send(err)
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
        
      

        //Generate ticket
        let unique = false, newTicket = 0
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


        const log = {
            entrance_date: Date(),
            car_id: newCar,
            ticket: newTicket
        }
        
        parkingLog.logs.push(log)

        await parking.save();

        await parkingLog.save()


        //Send ticket too
        res.send({data: parking, ticket: newTicket});
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

    
        //Regist car exit on logs
        const parkingLog = await ParkLog.findOne({parking: req.params.id})

     
        parkingLog.logs.forEach((log, index) => {
            if(log.ticket == req.body.ticket){    //It HAS to find the log by the ticket, NOT the car_id. Otherwise it overwrites the previous logs of the same car
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

async function readAllUsersFromDB() {
    console.log("yo ya paso macho")
    let all_users_promise = new Promise(function(myResolve, myReject) {
        let req = new XMLHttpRequest();
        console.log("miramira")
        req.open('GET', `http://localhost:5001/`);
        req.onload = function() {
            if (req.status == 200) {
            myResolve(req.response);
                console.log("bombonmbom")
            } else {
            myReject("Users not Found");
            console.log("malmalmalmal")
            }
        };
        req.send();
        });
        single_park_promise.then(
            
        function(value) {console.log("a gas bro");},
        function(error) {console.log("cagaste");}
        );
}