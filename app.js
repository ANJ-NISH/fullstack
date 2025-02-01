const express= require('express');
const mongoose=require('mongoose');
const path = require('path');
const cors=require('cors')
require('dotenv').config();
const cookieParser=require('cookie-parser');

const userRoutes=require('./routes/userRoutes');
const resolutionRoutes=require('./routes/resolutionRoutes');

const app=express();

// app.options("*", cors());



// app.use(
//   cors({
//     origin: "http://localhost:5000", // Ensure this matches your frontend URL
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allow credentials (cookies, sessions, etc.)
//   })
// );



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'dist')));


mongoose.connect(process.env.MONGO_URI
).then(()=> console.log("MongoDB connected successfully!"))
.catch((err)=> console.log("Some error occured: "+err));


app.use('/user', userRoutes);
app.use('/resolution', resolutionRoutes);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.listen(5000, ()=> {console.log("Server is running on port 5000")})
