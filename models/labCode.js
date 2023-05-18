const mongoose = require("mongoose");

const codeLabCodeSchema = new mongoose.Schema({

    code: {
        type: String,
        required:true 

    },
    roomId: {
        type:String,
        required:true 
    }
    

});



const LabCode = mongoose.model("LabCode", codeLabCodeSchema); 

module.exports = LabCode;