const express = require("express")
 const connectDB = require("./config/database")
 const User = require("./models/user")

const app = express();
app.use(express.json())

app.post("/signup", async (req, res)=>{
    const user = new User(req.body)

    try{
    await user.save()
    console.log("user saved successfully")
    res.send("data send successfully")
    }catch(err){
        console.error("error while saving user", err)
        res.status(500).send("error while saving user")
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

