const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');

const User=require('../models/User');


const getUsername=async(req, res)=>
{
  try
  {
    const token=req.cookies.token;
    const decoded=jwt.verify(token, process.env.SECRET_KEY);
    const userid=decoded.id;

    const user=await User.findById(userid);
    if(!user)
    {
      return res.status(400).json({message: "User not found"})
    }

    const username=user.name;

    res.status(201).json({username});
  }
  catch(err)
  {
   console.error(err);
   res.status(500).json({message: "Server Error"})
  }
}


const createUserFunc=async (req, res)=>
{
    const {name, email, password}=req.body;

    const existingUser= await User.findOne({email});

    if(existingUser)
    {
        return res.status(400).json({message: 'User already exists'});
    }
    
    bcrypt.hash(password, 10, async function(err, hash){
        const data=await User.create({
            name,
            email,
            password: hash,
        });
        
        console.log("User created successfully");
        res.status(201).json({message: "User created successfully"});
    });
}

const LoginUser=async (req, res)=>
{
  const {email, password}=req.body;

  const user=await User.findOne({email});

  if(!user)
  {
    return res.status(404).json({message: "User doesn't exists. Create a new account."});
  }

  bcrypt.compare(password,user.password,function(err,result){
    if(result)
    {
       let token=jwt.sign({id: user._id}, process.env.SECRET_KEY);
       res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        maxAge: 100 * 365 * 24 * 60 * 60 * 1000, 
        path: '/',
       });
       return res.status(201).json({message: "Login Successful"});
    }
    else
    {
        return res.status(401).json({message: "User credentials are wrong."});
    }
  });
}

const LogoutFunc=(req, res)=>
{
 
 res.clearCookie('token',{
    httpOnly: true,
    secure: false,
 });
 res.status(201).json({message: "User Logged out"});
}

module.exports= {createUserFunc, LoginUser, LogoutFunc, getUsername};
