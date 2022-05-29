
import {parkingUrls, userUrls} from '../configs/urls.js';

import fetch from 'node-fetch';



export class ParkController {
        async getAllParkings(request, response) {
        try {
            console.log(`GET ${parkingUrls.getAllParkings}`)
            const resFetch = await fetch(parkingUrls.getAllParkings,
                {
                    method: 'get',
                    headers: { "Content-type": "application/json" }
                });
            const resultado = await resFetch.json();
            response.status(resFetch.status).jsonp(resultado);
         } catch (err) {
            response.sendStatus(500);
        }
    }

    async addNewParking(request, response) {
        const bodySend = JSON.stringify(request.body);
        console.log(`POST ${parkingUrls.addNewParking} body: ${bodySend}`)
        try {
            const resFetch = await fetch(parkingUrls.addNewParking,
                {
                    method: 'post',
                    headers: { "Content-type": "application/json" },
                    body: bodySend
                });

            const resultado = await resFetch.json();
            response.status(resFetch.status).jsonp(resultado);

        } catch (err) {
            response.sendStatus(500);
        }
    }

    async getOneParking(request, response) {
        const parkingID = request.params.id;
        const urlParking = `${parkingUrls.getOneParking}${parkingID}`;
        console.log(`GET ${urlParking}`)
        try {
            const resFetch = await fetch(urlParking,
                {
                    method: 'get',
                    headers: { "Content-type": "application/json" }
                })
            const resultado = await resFetch.json();
            response.status(resFetch.status).jsonp(resultado);

        } catch (err) {
            response.sendStatus(500);
        }
    }


    async getOneParkingNonActive(request, response) {
        const parkingID = request.params.id;
        const urlParking = `${parkingUrls.getOneParking}${parkingID}/non-active`;
        console.log(`GET ${urlParking}`)
        try {
            const resFetch = await fetch(urlParking,
                {
                    method: 'get',
                    headers: { "Content-type": "application/json" }
                })
            const resultado = await resFetch.json();
            response.status(resFetch.status).jsonp(resultado);

        } catch (err) {
            response.sendStatus(500);
        }
    }

    async modifyParking(request, response) {
        const bodySend = JSON.stringify(request.body);
        const parkingID = request.params.id;
        const urlParking = `${parkingUrls.modifyParking}${parkingID}`;
        console.log(`PATCH ${urlParking} body: ${bodySend}`)
        try {
            const resFetch = await fetch(urlParking,
                {
                    method: 'patch',
                    headers: { "Content-type": "application/json" },
                    body: bodySend
                })
            const resultado = await resFetch.json();
            response.status(resFetch.status).jsonp(resultado);

        } catch (err) {
            response.sendStatus(500);
        }
    }

    async addCar(request, response) {
        //Check if the car belongs to an user
        let users
        const parkingID = request.params.id
        const carID = request.params.car_id
        try {
            console.log(`GET ${userUrls.getAllUsers}`)
            const resFetch = await fetch( userUrls.getAllUsers ,
                {
                    method: 'get',
                    headers: { "Content-type": "application/json" }
                })
            users = await resFetch.json();
            

        } catch (err) {
            console.log(err)
        }
        let userCode = "no-code"
        users.forEach(user => {
            if(user.cars_owned.includes(carID)){
             
                userCode = user._id
            }
        });

        //Add car to parking
        console.log(`PATCH ${parkingUrls.addCar}${parkingID}/add-car/${carID}/${userCode}`)
        try {
            const resFetch = await fetch(`${parkingUrls.addCar}${parkingID}/add-car/${carID}/${userCode}`,
                {
                    method: 'patch',
                    headers: { "Content-type": "application/json" }
                });

            const resultado = await resFetch.json();

            response.status(resFetch.status).jsonp(resultado);

        } catch (err) {
            console.log("error gateway: ", err)
            response.sendStatus(500);
        }
         //Register user entrance parking log 
        if(userCode != "no-code"){
            console.log(`PATCH ${userUrls.registerLogs}${userCode}/register-entrance-parking-log/${carID}`)
            try {
                const resFetch = await fetch(`${userUrls.registerLogs}${userCode}/register-entrance-parking-log/${carID}`,
                    {
                        method: 'patch',
                        headers: { "Content-type": "application/json" }
                    });
                const resultado = await resFetch.json();
                //response.status(resFetch.status).jsonp(resultado);
    
            } catch (err) {
                response.sendStatus(500);
            }
        }
        
       
        
    }

    async removeCar(request, response) {
        const bodySend = JSON.stringify(request.body);
        let hours, price
        const parkingID = request.params.id
        const carID = request.params.car_id 
        console.log(`PATCH ${parkingUrls.removeCar}${parkingID}/remove-car/${carID}`)
        try {
            const resFetch = await fetch(`${parkingUrls.removeCar}${parkingID}/remove-car/${carID}`,
                {
                    method: 'patch',
                    headers: { "Content-type": "application/json" },
                    body: bodySend
                });

            const resultado = await resFetch.json();
            hours = resultado.hours
            price = resultado.price
            response.status(resFetch.status).jsonp(resultado);
            
        } catch (err) {
            console.log("error gateway salida: ", err)
            response.sendStatus(500);
        }

 //register exit user log, check if the exit is from an users car
        const bodySendUserLog = JSON.stringify({
            hours: hours,
            price: price,
            parking: parkingID
        })
        if(request.body.userCode){
            console.log(`PATCH ${userUrls.registerLogs}${request.body.userCode}/register-exit-parking-log/${carID}`)
            try {
                const resFetch = await fetch(`${userUrls.registerLogs}${request.body.userCode}/register-exit-parking-log/${carID}`,
                    {
                        method: 'patch',
                        headers: { "Content-type": "application/json" },
                        body: bodySendUserLog
                    });
    
                //const resultado = await resFetch.json();
                //response.status(resFetch.status).jsonp(resultado);
    
            } catch (err) {
                response.sendStatus(500);
            }
        }
      
    }

    //Get current price of a stored car

    async getCurrentPrice(request, response) {
        const parkingID = request.params.id;
        const carID = request.params.car_id
        const urlParking = `${parkingUrls.currentPrice}${parkingID}/current-price/${carID}`;
        console.log(`GET ${urlParking}`)
        try {
            const resFetch = await fetch(urlParking,
                {
                    method: 'get',
                    headers: { "Content-type": "application/json" }
                })
            const resultado = await resFetch.json();
            response.status(resFetch.status).jsonp(resultado);

        } catch (err) {
            response.sendStatus(500);
        }
    }
}
