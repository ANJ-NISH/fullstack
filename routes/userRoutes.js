const express=require('express');
const protect=require('../middlewares/protectedMiddleware');
const router=express.Router();


const {createUserFunc, LoginUser, LogoutFunc, getUsername}= require('../controllers/userController');


router.post('/createUser', createUserFunc);

router.post('/loginUser', LoginUser);

router.post('/logout',LogoutFunc);

router.get('/getusername',getUsername);


module.exports= router;