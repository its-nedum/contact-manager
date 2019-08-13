const User = require('../models/user');
const bodyParser = require('body-parser');
const dbcon = require('../models/dbcon');
const bcrypt = require('bcryptjs');


const urlencodedParser = bodyParser.urlencoded({extended: false});

const { check, validationResult } = require('express-validator');

module.exports = (app) => {
    //display the register page
    app.get('/', (req,res) => {
        res.render('index');
    });

    app.post('/register', urlencodedParser, [
        //Use express validator to check users details
        check('firstname', 'Firstname is required').isEmpty(),
        check('lastname', 'Lastname is required').isEmpty(),
        check('email', 'Email is invalid').isEmail(),
        check('email', 'Email is required').isEmpty(),
        check('password', 'Password is required').isEmpty()
    ], (req, res) => {
        //get errors if any
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            req.flash('error', 'Check all input fields and try again!');
            res.render('index');   
        }else{

        //Assign all the users detail to a variables
          const firstname = req.body.firstname;
          const lastname = req.body.lastname;
          const email = req.body.email;
          const password = req.body.password;
          
         //since there is no error, match user detail to our schema object
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
                            req.flash('success', 'Registration Successful, pls login');
                            res.redirect('/');
                          }
                      });

                  });
              }); 
         }
        
    });
    
}