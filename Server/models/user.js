const mongoose = require('mongoose')
    , validator = require('validator')
    , bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
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
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error ("Invalid email address!!");
            }
        }
    }
});

userSchema.pre('save' , async function(next){
    const user = this;
    if(user.isModified('password'))  // To hash the password again.
    user.password = await bcrypt.hash(user.password , 8);
    next();
})
const User = mongoose.model('User' , userSchema);


module.exports = User;