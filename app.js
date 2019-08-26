const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const dbcon = require('./models/dbcon');
const passport = require('passport');

//Pages controller
const registerController = require('./controllers/registerController');
const loginController = require('./controllers/loginController');
const userController = require('./controllers/userController');


//Session, Messaging
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Set template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body-Parser
app.use(express.urlencoded({extended: false}));

//set up static files for our external css and js
app.use(express.static('./public'));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Express Messages Middleware
app.use(flash());

//Global variable for flash messages
app.use((req, res, next) => {
    res.locals.success_mesg = req.flash('success_mesg');
    res.locals.error_mesg = req.flash('error_mesg');
    //login error message from passport
    res.locals.error = req.flash('error');
    next();
});

//Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Call controllers
registerController(app);
loginController(app);
userController(app);


//Listen to port
app.listen(4242, () => {
    console.log('Server is runing on port 4242....');
})