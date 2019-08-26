const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

module.exports = (app) => {
    //display the register page
    app.get('/', (req,res) => {
        res.render('index');
    });

    app.post('/register', [
        //Use express validator to check users details
        check('firstname', 'Firstname is required').not().isEmpty(),
        check('lastname', 'Lastname is required').not().isEmpty(),
        check('email', 'A vaild Email is required').isEmail(),
        check('password', 'Password must be a min of 7 characters').isLength({min:7})
        
    ], (req, res) => {
        //Destruction the form data into variables
        const {firstname, lastname, email, password} = req.body;
        //get errors if any
        const errorsObj = validationResult(req);
        
        if(!errorsObj.isEmpty()){
            res.render('index', {errorsObj, firstname, lastname, email, password});
            
        }else{     
            //Check if the email already exists
             User.findOne({email: email})
                .then((user) => {
                    if(user){
                    //user already exist
                    const userError = 'Email is already registered';
                    res.render('index', {userError, firstname, lastname, email, password});
                    }else{
                    //since there is no error and user does not exist then create user
                    let newUser = new User({
                        firstname:firstname,
                        lastname: lastname,
                        email:email,
                        password:password
                    });

                    //use bcrypt to hash the user password
                    bcrypt.genSalt(10, (err,salt) => {
                        bcrypt.hash(newUser.password, salt, (err,hash) => {
                            if(err){
                                console.log(err);
                                return;
                            }
                            //when there is no error with the hashing, replace the user password with the hash equivalent
                            newUser.password = hash;

                            //save the user details to mongodb
                            newUser.save((err) => {
                                if(err){
                                    console.log(err);
                                    return;
                                }else{
                                    //save was successful display success message and redirect
                                    req.flash('success_mesg', 'Registration Successful, pls login');
                                    //const success = 'Registration Successful, pls login';
                                    res.redirect('login');
                                }
                            });

                        });
                    }); 

                    }
                })   
         
         }
        
    });
    
}