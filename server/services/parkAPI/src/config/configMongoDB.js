const mongoose = require("mongoose")



const urlDataBase = process.env.MONGODB_URI

mongoose.connect(
    urlDataBase,
    { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true});

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${urlDataBase}`);
});
mongoose.connection.on('error', err => {
    console.log('Mongoose error trying to conenect to: ', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose: disconnected');
});
