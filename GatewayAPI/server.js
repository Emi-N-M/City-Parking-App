import express from 'express'
import cors from 'cors'


const PORT = 3000

import indexRouter from './src/routes/index.js'
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

server.use('/', indexRouter)

// error handlers
//    Catch unauthorised errors
server.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res
        .status(401)
        .json({"message" : err.name + ": " + err.message});
  }
});


server.listen(PORT, () =>
    console.log(`servidor a executar em http://localhost:${PORT}`));