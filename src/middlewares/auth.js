const jwt = require("jsonwebtoken")
const User= require("../models/user")


const userauth = async (req, res, next)=>{
  try{
    const {token}= req.cookies
    if(!token){
      throw new Error("token is not valid")
    }

    const decodedObj= await jwt.verify(token, "DEv@tinder222")
    const {_id} = decodedObj
    
  const user = await User.findById(_id)

     if(!user){
      throw new Error("user not found")
     }
     req.user = user
     next()
  }
  catch(err){
    res.status(400).send("error: " + err.message)
  }

}

module.exports = { userauth }