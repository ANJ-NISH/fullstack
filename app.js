const express= require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const cookieParser=require('cookie-parser');

const userRoutes=require('./routes/userRoutes');
const resolutionRoutes=require('./routes/resolutionRoutes');

const app=express();

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://resolutefront-4e7o.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end(); // End preflight request
});

app.use((req, res, next) => {
  // Allow requests from your frontend URL
  res.setHeader('Access-Control-Allow-Origin', 'https://resolutefront-4e7o.vercel.app');
  
  // Allow credentials (cookies, etc.)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Allow certain methods (optional)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  // Allow specific headers (optional)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next(); // Proceed to the next middleware or route handler
});



// app.use(cors({origin: 'https://resolutefront-4e7o.vercel.app', credentials: true,}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


mongoose.connect(process.env.MONGO_URI
).then(()=> console.log("MongoDB connected successfully!"))
.catch((err)=> console.log("Some error occured: "+err));


app.use('/user', userRoutes);
app.use('/resolution', resolutionRoutes);


module.exports = app;
