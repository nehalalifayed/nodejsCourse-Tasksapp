const mongoose = require('mongoose');

const Task = mongoose.model('Task' ,{
    completed:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required:true, 
        ref: "User"
    }
});

module.exports = Task;