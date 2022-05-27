import { Router } from 'express';

import { ParkController } from '../controllers/parkController.js';

const parkController = new ParkController();
const router = Router();




router.get('/', parkController.getAllParkings);
router.post('/', parkController.addNewParking);
router.get('/:id', parkController.getOneParking);
router.get('/:id/non-active', parkController.getOneParkingNonActive);
router.patch('/:id', parkController.modifyParking);
router.patch('/:id/add-car/:car_id', parkController.addCar);
router.patch('/:id/remove-car/:car_id', parkController.removeCar);
router.get('/:id/current-price/:car_id', parkController.getCurrentPrice);

//TODO current price route



export default router;