const express = require("express")
 const connectDB = require("./config/database")
 const User = require("./models/user")
 const cookieParser = require("cookie-parser")
 const jwt = require("jsonwebtoken")
 const { userauth}= require("./middlewares/auth")
 

const app = express();
app.use(express.json())
app.use(cookieParser())

const authRouter=  require("./routes/auth")
const profileRouter= require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")






// get a user by email 


 app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)


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

