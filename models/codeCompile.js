const mongoose = require("mongoose");

const codeCompileSchema = new mongoose.Schema({

    username: {
        type: String,
        required:true 

    },
    roomId: {
        type:String,
        required:true 
    },
    compileTime: {
        type: Date,
        required:true 

    },
    status: {
        type:String,
        required:true 
    }
    

});



const CodeCompileData = mongoose.model("CodeCompileData", codeCompileSchema); 

module.exports = CodeCompileData;