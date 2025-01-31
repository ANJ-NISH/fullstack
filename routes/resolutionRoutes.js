const express=require("express");
const protect=require('../middlewares/protectedMiddleware');
const router=express.Router();

const {createResolution, getResolutions, setResolutionStatus, getResolutionStatus, analyzeData, deleteResolution}=require('../controllers/resolutionController')


router.post('/createResolution',createResolution);

router.get('/getResolutions',getResolutions);

router.post('/setResolutionStatus/:id', setResolutionStatus);

router.get('/getResolutionStatus/:id', getResolutionStatus);

router.get('/analyzeData/:id', analyzeData);

router.delete('/deleteResolution/:rid', deleteResolution);

module.exports=router;