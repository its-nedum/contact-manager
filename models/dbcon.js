const mongoose = require('mongoose');

//Connect to Mongo database
mongoose.connect('mongodb://localhost:27017/contact_manager', {useNewUrlParser: true})
    .then(() => console.log('Connection to database was successful!...'))
    .catch((error) => console.log('Connection error: ', error));


