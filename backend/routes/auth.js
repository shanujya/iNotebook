const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const jwt_secret = 'shanujyaisthebe$t';



//Route 1: Create a user using: POST "/api/auth/createuser". No login required
router.post('/createuser',[
    body('name','Enter a Valid name').isLength({ min: 3 }), // You can also send a CUSTOM ERR MSG
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
] ,  async(req,res)=>{
    
    // If there are errors,Return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try{
    // check whether the user with this email exists already
    let user = await User.findOne({email:req.body.email})
    if(user){
      return res.status(400).json({error:"sorry a user with this email already exists"})
    }

      // Using Password Hashing and Salt to secure our password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password,salt);

      //create a new user
      user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password:secPass,
    })
    
    const data = {
      user:{
        id:user.id
      }
    }

    // usin json web Token with id
    const authToken = jwt.sign(data,jwt_secret);

    //.then(user => res.json(user))
    //.catch(err=>{console.log(err)})
    //res.json({error:'please enter a unique value for email'})
    
    res.json({authToken})

    }
      catch(error){
      console.error(error.message);
      res.status(500).send("Internal Server Error")
    }
    
})

//Route 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password can not be blank').exists(),
] ,  async(req,res)=>{
      
  // If there are errors,Return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;

    try {
      //check whether User with this email & password exists already
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"Please try to login with a correct credentials"});
      }
      const passwordCompare = await bcrypt.compare(password,user.password); //compare password with user's password
      if(!passwordCompare){
        return res.status(400).json({error:"Please try to login with a correct credentials"});
      }

      const data = {
        user:{
          id:user.id
        }
      }
      // usin json web Token with id
      const authToken = jwt.sign(data,jwt_secret);
      res.json(authToken);

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
})
//Route 3: Get logged user details using: POST "/api/auth/getuser". login required
router.post('/getuser',fetchuser, async(req,res)=>{

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }

})

module.exports = router