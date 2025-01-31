const express= require('express');
const mongoose=require('mongoose');
const cors=require('cors')
require('dotenv').config();
const cookieParser=require('cookie-parser');

const userRoutes=require('./routes/userRoutes');
const resolutionRoutes=require('./routes/resolutionRoutes');

const app=express();

const corsOptions = {
  origin: (callback) => {
    callback(null, '*');
  },
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


mongoose.connect(process.env.MONGO_URI
).then(()=> console.log("MongoDB connected successfully!"))
.catch((err)=> console.log("Some error occured: "+err));


app.use('/user', userRoutes);
app.use('/resolution', resolutionRoutes);


module.exports = app;
