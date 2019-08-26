const bcrypt = require('bcryptjs');
const passport = require('passport');

const { check, validationResult } = require('express-validator');

//Passport Config
require('../config/passport')(passport);

module.exports = (app) => {
    
    app.get('/login', (req,res) => {
        res.render('login');
    });

    app.post('/login', (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    });
}