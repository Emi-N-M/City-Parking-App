import { Router } from 'express';
const router = Router();

// import swaggerUI from 'swagger-ui-express'

// import swaggerDocument from ('../api-docs/openapi.json')
import userRouter from './user.js'
import parkRouter from './parking.js'

router
        //    .use('/api-docs', swaggerUI.serve, swaggerUI.setup(openAPIDoc) )
        .use('/users', userRouter)
        .use('/parkings', parkRouter)

export default router