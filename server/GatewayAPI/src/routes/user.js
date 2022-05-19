import { Router } from 'express';


import { UserController } from '../controllers/userController.js';

const userController = new UserController();
const router = Router();

// router.get('/',  );

router.post('/signup',userController.addNewUser );
router.post('/login', userController.obtainToken );
router.get('/:id', userController.getOneUser)
router.get('/', userController.getAllUsers)


export default router;