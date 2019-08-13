const express = require('express');
const registerController = require('./controllers/registerController');
const loginController = require('./controllers/loginController');

//Session, Messaging and Validation
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Set template engine
app.set('view engine', 'ejs');

//set up static files
app.use(express.static('./public'));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});



//fire controllers
registerController(app);
loginController(app);


//Listen to port
app.listen(4242, () => {
    console.log('Server is runing on port 4242....');
})