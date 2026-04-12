const express = require("express")
const profileRouter= express.Router();
const {userauth}= require("../middlewares/auth")
const User = require("../models/user")
const{validateEditProfileData}= require("../utils/validation")

profileRouter.get("/profile/view", userauth, async (req, res)=>{
    try{
        const user = req.user
    res.send(user)
}
catch(err){
    res.status(400).send("error: " + err.message)
}

})


profileRouter.patch("/profile/edit", userauth, async(req, res)=>{
    try{
       if(!validateEditProfileData(req)){
        throw new Error("invalid fields for edit")
} 

    const logedInUser = req.user;
    console.log("logedInUser", logedInUser)


    Object.keys(req.body).forEach((key)=>(logedInUser[key]= req.body[key]))
    console.log(logedInUser)
    await logedInUser.save()
    res.send("profile updated successfully")


}catch(err){
        res.status(400).send("error:" + err.message)
    }

})


module.exports= profileRouter;