const express = require("express")
const authRouter = express.Router();
const bcrypt = require("bcrypt")
const {validateSignupData} = require("../utils/validation")
const  User = require("../models/user")
const jwt = require("jsonwebtoken")

authRouter.post("/signup", async (req, res)=>{
    try{

    validateSignupData(req)

    const  {firstName, lastName, emailId, password} =  req.body

   // encrypt the password
   
   const passwordHash = await bcrypt.hash(password, 10)
   console.log("passwordHash:", passwordHash)
    
    const user = new User({firstName, lastName, emailId, password: passwordHash})

    
    await user.save()
    console.log("user saved successfully")
    res.send("data send successfully")
    }catch(err){
        console.error("error while saving user", err)
        res.status(500).send("error:" + err.message)
    }
    
   
})

authRouter.post("/login", async (req, res)=>{
    try{
     const {emailId, password } = req.body;

     const user =  await User.findOne({emailId: emailId})

     if(!user){
        throw new Error("invalid credentials")
     }


    const isPasswordValid =  await user.validatePassword(password)

     if(isPasswordValid){
         
          const token = await user.getjwt()


        res.cookie("token", token, { expires: new Date(Date.now() + 900000)})
        res.send("Login successful")
     }
     else{
        throw new Error("invalid credentials")
     }
    }catch(err){
        res.status(400).send("error : " + err.message)
    }
})

authRouter.post("/logout", async(req, res)=>{
    res.cookie("token", null, { expires: new Date(Date.now())})
    res.send("Logout successful")
})

module.exports = authRouter