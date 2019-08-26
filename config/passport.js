const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    //Local Strategy
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        
        //Match Email
        User.findOne({email: email})
            .then((user) => {
                if(!user){
                    return done(null, false, {message: 'Email is not registered'})
                }

                //Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Password incorrect'});
                }
            })

            })
            .catch((err) => {console.log(err)});
            
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}