import {parkingUrls} from '../configs/urls.js';

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
        const bodySend = JSON.stringify(request.body);
        console.log(`PATCH ${parkingUrls.addCar}${request.params.id}add-car/${request.params.car_id}`)
        try {
            const resFetch = await fetch(`${parkingUrls.addCar}${request.params.id}/add-car/${request.params.car_id}`,
                {
                    method: 'patch',
                    headers: { "Content-type": "application/json" },
                    body: bodySend
                });

            const resultado = await resFetch.json();
            response.status(resFetch.status).jsonp(resultado);

        } catch (err) {
            response.sendStatus(500);
        }
    }

    async removeCar(request, response) {
        const bodySend = JSON.stringify(request.body);
        console.log(`PATCH ${parkingUrls.removeCar}${request.params.id}/remove-car/${request.params.car_id}`)
        try {
            const resFetch = await fetch(`${parkingUrls.removeCar}${request.params.id}/remove-car/${request.params.car_id}`,
                {
                    method: 'patch',
                    headers: { "Content-type": "application/json" },
                    body: bodySend
                });

            const resultado = await resFetch.json();
            response.status(resFetch.status).jsonp(resultado);

        } catch (err) {
            response.sendStatus(500);
        }
    }

}
