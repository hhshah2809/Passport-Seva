const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({quiet:true});
const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    }
    catch(error){
        console.log("something broke while connecting with database");
    }
}
module.exports = connectDB;