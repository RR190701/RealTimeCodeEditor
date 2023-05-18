const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required:true 

    },
    message: {
        type:String,
        required:true 
    },
    roomId: {
        type:String,
        required:true 
    }
    

});



const Message = mongoose.model("Message", userSchema); 

module.exports = Message;