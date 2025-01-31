const express= require('express');
const mongoose=require('mongoose');
const cors=require('cors')
require('dotenv').config();
const cookieParser=require('cookie-parser');

const userRoutes=require('./routes/userRoutes');
const resolutionRoutes=require('./routes/resolutionRoutes');

const app=express();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from specific frontend or dynamically allow the request's origin
    if (!origin || origin === 'https://resolutefront-4e7o.vercel.app') {
      callback(null, origin); // Accept the request's origin
    } else {
      callback(new Error('Not allowed by CORS')); // Reject other origins (if needed)
    }
  },
  credentials: true, // Allow cookies or other credentials
};

// Apply CORS middleware
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
