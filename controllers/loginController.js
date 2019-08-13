const User = require('../models/user');
const bodyParser = require('body-parser');



module.exports = (app) => {
    
    app.get('/login', (req,res)=>{
        res.end('Login Page is coming soon..........!');
    })
}