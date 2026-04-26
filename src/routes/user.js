const express = require("express")
const userRouter= express.Router()
const {userauth}= require("../middlewares/auth")
const ConnectionRequestModel= require("../models/connectionRequest")
const User = require("../models/user")
const USER_SAFE_DATA = "firstName lastName email ProfileUrl"

userRouter.get("/user/request/received", userauth, async(req, res)=>{
    try{
        const LoggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: LoggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName"])


        res.json({
            message: "connction requests received",
            data: connectionRequests,
     })

    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

userRouter.get("/user/connection", userauth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const connectionsRequests = await ConnectionRequestModel.find({
            $or:[
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"])

        const data  = connectionsRequests.map((row)=>{
            if(row.fromUserId._id.toString()=== loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({data})

    }catch(error){
        res.status(400).json({message: error.message})
    }
})

userRouter.get("/feed", userauth, async(req, res)=>{
    try{
        const loggedInUser= req.user;
        
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 20 ? 20 : limit;


        const skip = (page-1)*limit;


        const connectionsRequests = await ConnectionRequestModel.find({
            $or:[{fromUserId: loggedInUser._id, }, {toUserId: loggedInUser._id}],
        }).select("fromUserId toUserId " )
        

        const hideUsersFromFeed =  new Set()
        connectionsRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })

        const users = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

         res.send(users)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})



module.exports = userRouter;