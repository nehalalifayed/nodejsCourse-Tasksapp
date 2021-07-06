const mongoose = require('mongoose')
    , validator = require('validator')
    , bcrypt = require('bcryptjs')
    , jwt = require('jsonwebtoken')

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
    },
    tokens: [{
        token: 
        {
            type:String,
            required:true
        }
    }]
});

// relationship between tasks assosiated with the user.
// virtual because tasks are not stored in the db as variable.
// don't forget to use populate function to populate tasks.  
userSchema.virtual('tasks' , {
    ref: "Task" , 
    localField: '_id',   // the users id
    foreignField:'author' // the field from tasks model
})

userSchema.methods.generateToken = async function ()
{
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()} , 'Thisisarandomkey');

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}
userSchema.pre('save' , async function(next){
    const user = this;
    if(user.isModified('password'))  // To hash the password again.
    user.password = await bcrypt.hash(user.password , 8);
    next();
})
const User = mongoose.model('User' , userSchema);


module.exports = User;