
const express = require("express")
const cors = require("cors")


require("dotenv").config()

if(!process.env.PORT){
    throw new Error("Enviroment Variable PORT is empty")
}
const PORT = process.env.PORT

const DB = require("./src/config/configMongoDB")
const userModel = require("./src/models/userModel")
const userRoutes = require("./src/routes/userRoutes.js")


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cors())
/*
app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization' ) // 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
      next();
});
*/

const passport = require('passport');
require('./src/config/configPassport');

app.use(passport.initialize());

const jwt = require('express-jwt');
/*
const autenticacao = jwt({
    secret: process.env.ACCESS_TOKEN_SECRET,
    userProperty: 'payload',
    algorithms: ['HS256'] // ['rs256',"sha1", "HS256"]
});
*/

userRoutes(app)


app.listen(PORT, () => 
    console.log(`UserAPI Microservice running on http://localhost:${PORT}`))