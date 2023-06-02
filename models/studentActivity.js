const mongoose = require("mongoose");

const studentActivitySchema = new mongoose.Schema({
    roomId: {
        type:String,
        required:true 
    },
    username:{
        type:String
    },
    lastActiveTime: {
        type: Date
    },
    wordCount: {
        type:Number,
    }
    

});



const StudentActivity = mongoose.model("StudentActivity", studentActivitySchema); 

module.exports = StudentActivity;