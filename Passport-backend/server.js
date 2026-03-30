const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./connectDB');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middlewares/authMiddleware');
const verifyadmin = require('./middlewares/adminMiddleware.js');
dotenv.config({quiet:true});
const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.listen(PORT,()=>{
    console.log("Server is listenening on PORT 8000");
});
connectDB();
// console.log('authRoutes:', require('./routes/authRoutes.js'));
// console.log('passportRoutes:', require('./routes/passportApplication.js'));

app.use('/api/auth',require('./routes/authRoutes.js'));
app.use("/api/passport",require("./routes/passportApplication.js"));
app.use('/api/admin',verifyToken,require('./routes/passportOfficeRoutes.js'));