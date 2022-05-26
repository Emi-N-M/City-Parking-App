import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import path from 'path';

const PORT = 3000
import 'dotenv/config'

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: false }))

server.use(cors())
server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
  next();
});

import userRouter from './src/routes/user.js'
import parkRouter from './src/routes/parking.js'
import authRouter from './src/routes/auth.js'


server.use('/users', userRouter)
server.use('/parkings',authenticateToken, parkRouter)


//Auth
server.use('/', authRouter)

//GUI
server.get('/GUI',(req,res) => {
  res.sendFile('/home/emilio/WebstormProjects/city-parking-app/Client/login.html');
});

server.use('/GUI/parking-list',authenticateToken,(req,res) => {
  res.sendFile('/home/emilio/WebstormProjects/city-parking-app/Client/park_API.html');
});




function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    //req.user = user
    next()
  })

}

server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`));