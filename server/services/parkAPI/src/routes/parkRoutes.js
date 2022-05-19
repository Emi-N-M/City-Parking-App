'use strict'
module.exports = function (app) {
    const parkCtrl =
        require('../controllers/parkController.js');

    // Routes for API Restful parkAPI / AUTH
    app.route('/')
        .get(parkCtrl.readAllParkings);

    app.route('/')
        .post(parkCtrl.addParking);

    app.route('/:id')
        .get(parkCtrl.findParking);

    app.route('/:id')
        .patch(parkCtrl.modifyParking)

    app.route('/:id/add-car/:car_id')
        .patch(parkCtrl.addCar);

    app.route("/:id/remove-car/:car_id")
        .patch(parkCtrl.removeCar);

    
    app.route('/:id/remove-car-by-ticket/:ticket')
        .patch(parkCtrl.removeCarByTicket);

}