import {parkingUrls, userUrls} from '../configs/urls.js';

import fetch from 'node-fetch';

export class UserController {
    async addNewUser(request, response) {
        const bodySend = JSON.stringify(request.body);
        try {
            console.log(`GET ${userUrls.addNewUser}`)
            const resFetch = await fetch(userUrls.addNewUser,
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

    async obtainToken(request, response) {
        const bodySend = JSON.stringify(request.body);
        try {
            console.log(`POST ${userUrls.obtainToken}`)
            const resFetch = await fetch(userUrls.obtainToken,
                {
                    method: 'post',
                    headers: {"Content-type": "application/json"},
                    body: bodySend
                });
            const resultado = await resFetch.json()
            response.status(resFetch.status).jsonp(resultado)
        } catch (err) {
            response.sendStatus(500);
        }
    }

    async getOneUser(request, response) {
        const userID = request.params.id;
        const urlUser = `${userUrls.getOneUser}${userID}`
        try {
            console.log(`GET ${urlUser}`)
            const resFetch = await fetch( urlUser ,
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

    async getAllUsers (request, response) {

        try {
            console.log(`GET ${userUrls.getAllUsers}`)
            const resFetch = await fetch( userUrls.getAllUsers ,
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

    async addCar(request, response) {
        const userID = request.params.id;
        const car = request.params.car_id
        const urlUser = `${userUrls.getOneUser}${userID}`
        try {
            console.log(`PATCH ${urlUser}/add-car/${car}`)
            const resFetch = await fetch( `${urlUser}/add-car/${car}` ,
                {
                    method: 'patch',
                    headers: { "Content-type": "application/json" }
                })
            const resultado = await resFetch.json();
            response.status(resFetch.status).jsonp(resultado);

        } catch (err) {
            response.sendStatus(500);
        }
    }
}
