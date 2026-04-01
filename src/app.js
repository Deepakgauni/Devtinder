const express = require("express")
 const connectDB = require("./config/database")
 const User = require("./models/user")
 const {validateSignupData} = require("./utils/validation")
 const bcrypt = require("bcrypt")
 const cookieParser = require("cookie-parser")
 const jwt = require("jsonwebtoken")
 const { userauth}= require("./middlewares/auth")

const app = express();
app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res)=>{
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


app.post("/login", async (req, res)=>{
    try{
     const {emailId, password } = req.body;

     const user =  await User.findOne({emailId: emailId})

     if(!user){
        throw new Error("invalid credentials")
     }
    const isPasswordValid =  await bcrypt.compare(password, user.password);

     if(isPasswordValid){
         
          const token = await jwt.sign({_id: user._id}, "DEv@tinder222")


        res.cookie("token", token)
        res.send("Login successful")
     }
     else{
        throw new Error("invalid credentials")
     }
    }catch(err){
        res.status(400).send("error : " + err.message)
    }
})

app.get("/profile", userauth, async (req, res)=>{
    try{
        const user = req.user
    res.send(user)
}
catch(err){
    res.status(400).send("error: " + err.message)
}

})


// get a user by email 

app.get("/user", async (req, res)=>{
    const userEmail = req.body.emailId

    try{
        const user = await User.find({emailId: userEmail})
         res.send(user)

    }catch(err){
        res.status(400).send("error while fetching user")
    }

})
     

// get  a all user 
  
    app.get("/feed", async (req, res)=>{
         try{
        const user = await User.find({})
         res.send(user)

    }catch(err){
        res.status(400).send("error while fetching user")
    }
    })

// delete  a user api
 

 app.delete("/user", async (req,res)=>{
    const userId = req.body.userId
      try{
        const user = await User.findByIdAndDelete(userId)
        
         res.send("user data deleted successfully")

    }catch(err){
        res.status(400).send("error while deleting user")
    }



 })
  

// update a user api
app.patch("/user", async (req, res)=>{
    const userId = req.body.userId
    const data = req.body

    try{

        // Api level validation
        const ALLOWED_UPDATES = ["firstName", "lastName", "age"]

        const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes((k)) 
    )
    if(!isUpdateAllowed){
        throw new Error("update is not allowed")
    }


        const user = await User.findByIdAndUpdate(userId, data, {runValidators: true})
        
         res.send("user data updated successfully")

    }catch(err){
        res.status(400).send("error while updating user")
    }


})

//
connectDB()
.then(()=>{
    console.log("database connected successfully")
    app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})

})
.catch((err)=>{
    console.error("database connection failed", err)
})


app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})

