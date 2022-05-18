const passport = require('passport');
// npm install passport

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const user = require("../Models/UserModel.js")

passport.use(new LocalStrategy( 
    { usernameField: 'username'  },
    
    (username, password, done) => {
        user.findOne({ username: username }, (err, user) => { 
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Username incorrecto.' }); 
            }
            if (!user.validPassword(password)) {
                 return done(null, false, { message: 'Contraseña incorrecta!'}); 
            }
            return done(null, user); 
          });
    }
  ));
