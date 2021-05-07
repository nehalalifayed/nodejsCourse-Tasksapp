const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User' ,{
    name:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        minLength: 8,
        required: true,
        validate(value){
            if(value.toLowerCase().includes("password"))
            {
                throw new Error ("Password must not contain the word 'password'! ");
            }
        }
    },
    email:{
        type:String ,
        required:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error ("Invalid email address!!");
            }
        }
    }
});


module.exports = User;