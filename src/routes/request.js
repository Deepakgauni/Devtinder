const express = require("express")
const requestRouter= express.Router()
const {userauth}= require("../middlewares/auth")
const ConnectionRequestModel= require("../models/connectionRequest")
const User = require("../models/user")


requestRouter.post("/request/send/:status/:toUserId", userauth, async (req, res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignore"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "invalid status"})
        }
          
        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(400).json({message: "user not found"})
        }

        const existingRequest = await ConnectionRequestModel.findOne({
            $or:[
                { fromUserId, toUserId},
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if(existingRequest){
            return res.status(400).send({message : "connection request already exists"})
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save()
        res.json({
            message: 'connection request sent successfully',
            data,
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message });
    }
})

requestRouter.post("/request/review/:status/:requestId", userauth, async (req, res)=>{
    try{
        const loggedInUser= req.user;
        const {status, requestId} = req.params
        const allowedStatus = ["accepted", "rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "invalid status"})
        }

        const connectionRequest = await ConnectionRequestModel.findById(requestId)
        if(!connectionRequest){
            return res.status(400).json({message: "connection request not found"})
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save()
        res.json({
            message: "connection request updated successfully",
            data,
        })
    }
    catch(error){
        console.error(error)
        res.status(400).json({ message: error.message });
        
    }
})
module.exports= requestRouter