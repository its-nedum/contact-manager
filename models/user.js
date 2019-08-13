const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema for contacts
const ContactSchema = new Schema({
    firstName: String,
    lastName: String,
    phoneNo: Number
});

//Create schema for users
const UserSchema = new Schema({
    firstname:{
        type:  String,
        required: true
    },
    lastname: {
        type:  String,
        required: true
    },
    email:{
        type:  String,
        required: true
    },
    password:{
        type:  String,
        required: true
    },
    contacts: [ContactSchema]
});

//Create Model
const User = mongoose.model('user', UserSchema);

module.exports = User;