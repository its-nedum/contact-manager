//Dashboard authentication
const {ensureAuthenticated} = require('../config/auth');

//CRUD Operations
const User = require('../models/user');
const { check, validationResult } = require('express-validator');

//Delete operation needs this line
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = (app) => {

    //Render dashboard
    app.get('/dashboard', ensureAuthenticated, (req, res) => {
        res.render('dashboard', {name: `${req.user.firstname} ${req.user.lastname}`});
    });

    //Process user's logout
    app.get('/logout', (req, res) =>{
        req.logout();
        req.flash('success_mesg', 'You have logged out');
        res.redirect('/login');
    });

    //Render the create page
    app.get('/create', ensureAuthenticated, (req, res) =>{
        res.render('create', {name: `${req.user.firstname} ${req.user.lastname}`});
    });

    //Create new contact
    app.post('/addUser',[
        check('firstname', 'Firstname is required').not().isEmpty(),
        check('lastname', 'Lastname is required').not().isEmpty(),
        check('telephone', 'A valid phone number is required').isMobilePhone(['en-NG'])
        ], (req,res) =>{
            //Destructure
            const {firstname, lastname, telephone} = req.body;

            const errorsObj = validationResult(req);
            
            if(!errorsObj.isEmpty()){
                res.render('create', {errorsObj, firstname,lastname,telephone});
            }else{
                //Find the user in database and update the contacts 
                const userEmail = req.user.email;
                User.findOne({email:userEmail})
                    .then((user)=>{
                        if(user){
                        //if user exists get the contacts field and push the contacts inside
                        user.contacts.push({firstName:firstname, lastName:lastname, phoneNo:telephone});
                        user.save((err) =>{
                            if(err){
                                throw err;
                            }else{
                                req.flash('success_mesg','Contact added successfully!');
                                res.redirect('create');
                            }
                        })
                        }
                    })
            }
    });

    //Render the Read page
    app.get('/read', ensureAuthenticated, (req, res) =>{
        const userEmail = req.user.email;
        User.findOne({email:userEmail})
            .then((record) =>{
                if(record.contacts.length < 1){
                    //If the user have not saved any contact yet
                    req.flash('error_mesg', "You haven't saved any contact(s) yet!");
                    res.render('read');
                }else{
                    //pass the user contacts object to the view
                    res.render('read', {myContacts:record.contacts});
                }
            })
        
    });

    //Render the single page with a single contact using the contact ID
    app.get('/single/:id', ensureAuthenticated, (req, res) =>{
        const userEmail = req.user.email;
        User.findOne({email:userEmail})
            .then((userRecord) =>{
                //locate the contacts array and assign it to userContacts
                const userContacts = userRecord.contacts;
                //find the particular contact from the userContact list using the contact's id
               const contact = userContacts.find( Onerecord => Onerecord._id == req.params.id);
               //send the result to the view
               res.render('single', {singleContact:contact});   
            });
        
    });

    //Render the update page with the user's contact details to be updated
    app.get('/edit/:id', ensureAuthenticated, (req, res) =>{
        const userEmail = req.user.email;
        User.findOne({email:userEmail})
            .then((userRecord) =>{
                //locate the contacts array and assign it to userContacts
                const userContacts = userRecord.contacts;
                //find the particular contact from the userContact list using the contact's id
               const contact = userContacts.find( Onerecord => Onerecord._id == req.params.id);
               //send the result to the view
               res.render('update', {singleContact:contact});   
            });
    });

    //Update user's contact
        app.post('/update/:id', ensureAuthenticated, [
            check('firstname', 'Firstname is required').not().isEmpty(),
            check('lastname', 'Lastname is required').not().isEmpty(),
            check('telephone', 'A valid phone number is required').isMobilePhone(['en-NG'])
            ], (req,res) =>{
                //Destructure
                const {firstname, lastname, telephone} = req.body;
    
                const errorsObj = validationResult(req);
                
                if(!errorsObj.isEmpty()){
                    res.render('update', {errorsObj, firstname,lastname,telephone});
                }else{
                    //Find the user in database and update the contacts 
                    const userEmail = req.user.email;
                   User.updateOne(
                    {   //query filter
                        email:userEmail,
                        'contacts._id': req.params.id,
                    },
                    {   //changes to be made
                        $set:{'contacts.$.firstName':firstname, 'contacts.$.lastName':lastname, 'contacts.$.phoneNo':telephone},
                        $currentDate: { lastModified: true }
                     },
                     (err) =>{
                         if(err){
                             console.log(err);
                             return;
                         }
                     }
                     );
                     req.flash('success_mesg', 'Contact updated successfully');
                     res.redirect('/edit/'+req.params.id);
                    }
                    
        });

                //Delete a contact
                app.post('/delete/:id', ensureAuthenticated, (req, res) =>{
                    
                    const userEmail = req.user.email;
                    const contactId = req.params.id;
                    const firstname = req.body.firstname;
                    const lastname = req.body.lastname;
                    const telephone = req.body.telephone;

                    //Find the user in database and delete the contact 
                   User.findOneAndUpdate(
                        {
                            email:userEmail, 
                            'contacts._id':new ObjectId(contactId),
                        },
                        { 
                            $pull : { contacts : {_id:contactId, firstName:firstname, lastName:lastname, phoneNo:telephone } } 
                        },
                        (err, result) =>{
                            if(err){
                                console.log(err);
                                return;
                            }else{
                                console.log(result);
                                console.log(contactId);
                                //res.send("Success!");
                                
                            }
                            
                        },   
                    )
               
                      
                })

                
}