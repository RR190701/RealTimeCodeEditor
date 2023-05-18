const mongoose = require("mongoose");

const codeCopyPasteSchema = new mongoose.Schema({

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
    copiedData: {
        type:String,
        required:true 
    }
    

});



const CodeCopyPasteData = mongoose.model("CodeCopyPasteData", codeCopyPasteSchema); 

module.exports = CodeCopyPasteData;