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
        .get(parkCtrl.getParkingInfo);

    app.route('/:id/non-active')
        .get(parkCtrl.getParkingInfo_nonActive)

    app.route('/:id/current-price/:car_id')
        .get(parkCtrl.getCurrentPrice)    
    
    app.route('/:id')
        .patch(parkCtrl.modifyParking)

    app.route('/:id/add-car/:car_id/:user_code')
        .patch(parkCtrl.addCar);

    app.route("/:id/remove-car/:car_id")
        .patch(parkCtrl.removeCar);

   
}