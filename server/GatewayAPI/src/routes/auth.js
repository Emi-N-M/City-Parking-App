import { Router } from 'express';


import { UserController } from '../controllers/userController.js';

const userController = new UserController();
const router = Router();

// router.get('/',  );

router.post('/signup',userController.addNewUser );
router.post('/login', userController.obtainToken );



export default router;