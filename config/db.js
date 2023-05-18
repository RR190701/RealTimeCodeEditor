const mongoose = require("mongoose");


//db configure
const connectDB = async() =>{
try {
  console.log(process.env.db_connection_URL);
  await mongoose.connect(process.env.db_connection_URL);
    console.log("mongoDB is connected");
}
catch(error){
  console.log("Database Connection Failed", error)
}
}

   
module.exports= connectDB; 