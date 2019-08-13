const mongoose = require('mongoose');

//Connect to Mongo database
const dbcon = mongoose.connect('mongodb://localhost/contact_manager', {useNewUrlParser: true});
if(dbcon){
    console.log('Connection to database was successful!...');
}else{
    console.log('Connection error: ', error);
};