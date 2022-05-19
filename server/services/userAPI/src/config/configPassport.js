const passport = require('passport');
// npm install passport

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

passport.use(new LocalStrategy( 
    { usernameField: 'username'  },
    
    (username, password, done) => {
        User.findOne({ username: username }, (err, user) => { 
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Username incorrect.' }); 
            }
            if (!user.validPassword(password)) {
                 return done(null, false, { message: 'Password incorrect'}); 
            }
            return done(null, user); 
          });
    }
  ));
