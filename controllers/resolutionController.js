const mongoose=require("mongoose");
const jwt=require('jsonwebtoken');

const User=require('../models/User');
const Resolution=require('../models/Resolution');


const createResolution=async (req,res)=>
{
    try{
        const {category, description, startdate}=req.body;

        const token=req.cookies.token;
        const decoded=jwt.verify(token, process.env.SECRET_KEY);
        const userId=decoded.id;

        const user=await User.findById(userId);
    
        if(!user)
        {
            return res.status(404).json({message: "User not found"});
        }
    
        const moddate=new Date(startdate);
        const newresolve=new Resolution({
            user: user._id,
            category,
            description,
            startDate: moddate,
        });
    
        await newresolve.save();
    
        user.resolution.push(newresolve._id);

        await user.save();

        console.log("resolution taken");
    
        res.status(201).json({message: "New resolution created successfully", newresolve});
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}


const getResolutions=async(req,res)=>
{
  try
  {
     const token=req.cookies.token;
     const decoded=jwt.verify(token, process.env.SECRET_KEY);
     const userid=decoded.id;

     const user=await User.findById(userid);

     if(!user)
     {
        return res.status(404).json({message: "User not found"});
     }

     const resolution_arr=user.resolution;


     let ansarr=[];

     for(let resolve of resolution_arr)
     {
        const indi_resolution=await Resolution.findById(resolve);
        let resObj={id: resolve, category: indi_resolution.category,description: indi_resolution.description,startDate: indi_resolution.startDate};
        ansarr.push(resObj);
     }
     
     res.status(201).json({arr: ansarr});
  }
  catch(err)
  {
   console.error(err);
   res.status(500).json({message: "Server Error"})
  }
}

const setResolutionStatus=async(req,res)=>
{
    try
    {
        const {startDate, status}=req.body;

        const resolutionid=req.params.id;

        const resolution=await Resolution.findById(resolutionid);
        if(!resolution)
        {
            return res.status(404).json({message: "Resolution not found"});
        }

        const trackingarr=resolution.tracking;

        
        let flag=0;

        const timestamp=Date.parse(startDate);
        const modDate=new Date(timestamp);
        if(trackingarr.length)
        {
            for(let ele of trackingarr)
                {
                    
                    if(ele.date.getTime()===modDate.getTime())
                    {
                        ele.status=status;
                        flag=1;
                        break;
                    }
                }
        }
        
        if(flag===0)
        {
            resolution.tracking.push({date: modDate,status});
            await resolution.save();
        }
        else
        {
            resolution.tracking=trackingarr;
            await resolution.save();
        }
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message: "Server Error"});
    }
}

const getResolutionStatus=async(req,res) =>
{
  try
  {
    const date=req.query.startDate;
    const resolutionid=req.params.id;

    const timestamp=Date.parse(date);
    const modDate=new Date(timestamp);

    const resolution=await Resolution.findById(resolutionid);

    if(!resolution)
    {
        return res.status(400).json({message: "resolution not found"})
    }

    let trackingarr=resolution.tracking;

    if(trackingarr===null || trackingarr.length === 0)
    {
        
        return res.status(200).json(false);
    }
    let status;
    let flag=0;

    for(let arrele of trackingarr)
    {
       if(arrele.date.getTime()===modDate.getTime())
       {
        if(arrele.status==="YES")
        {
            status=true;
        }
        else
        {
            status=false;
        }
        flag=1;
        break;
       }
    }

    if(flag===0)
    {
        return res.status(200).json(false);  
    }
    res.status(200).json(status);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({message: "Server error"})
  }
}

const analyzeData=async(req,res)=>
{
    try
    {
      const resolutionid=req.params.id;

      const resolution=await Resolution.findById(resolutionid);

      if(!resolution)
      {
        return res.status(404).json({message: "resolution not found"});
      }

      const trackingarr=resolution.tracking;
      let statusarr=[];
      let datearr=[];

      if(trackingarr.length===0)
      {
        return res.status(201).json({statusarr,datearr});
      }

      for(let ele of trackingarr)
      {
        datearr.push(ele.date);
        if(ele.status==="YES")
        {
            statusarr.push(1);
        }
        else
        {
            statusarr.push(0);
        }
      }

      res.status(201).json({statusarr, datearr});

    }
    catch(err)
    {
      console.error(err);
      res.status(500).json({message: "Server error"})
    }
}

const deleteResolution=async(req,res)=>
{
 try
 {
   const resolutionid=req.params.rid;

   const resolution=await Resolution.findOneAndDelete({_id: resolutionid});

   if(!resolution)
   {
    res.status(400).json({message: "No such resolution exist"});
   }

   const token=req.cookies.token;
   const decoded=jwt.verify(token, process.env.SECRET_KEY);
   const userid=decoded.id;

   const user=await User.findById(userid);

   if(!user)
   {
    res.status(400).json({message: "No such User exist"});
   }

   let resolutionarr=user.resolution;

   let newresoloutionarr=resolutionarr.filter((indires)=> indires.toString()!==resolutionid);
;

   user.resolution=newresoloutionarr;

   await user.save();

   res.status(201).json({message: "deletion successful"})
 }
 catch(err)
 {
    console.error(err);
    res.status(500).json({message: "Server error"})
 }
}

module.exports={createResolution, getResolutions, setResolutionStatus, getResolutionStatus,analyzeData, deleteResolution};