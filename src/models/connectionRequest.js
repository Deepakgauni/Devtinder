const mongoose = require("mongoose")


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    status:{
        type: String,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: "{VALUE} is not a valid status",
        },

        required: true,
    },
},
{
    timestamps: true
}
)
connectionRequestSchema.pre("save", function(next){
    const connectionRequest= this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
         return next(new Error("cannot send connection request to yourself"))
    }
   
}

)


const ConnectionRequestModel= mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports= ConnectionRequestModel;