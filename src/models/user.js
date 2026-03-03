const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
    firstName:{
        type: String,
        minLength: 4,
    },
    lastName:{
          type: String,  
          

    },

    emailId:{
          type: String,
          unique: true,
          trim : true,
        
    },

    age:{
        type: Number,
        min: 18,
        max: 100,
    },

    gender:{
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("gender data is not valid")
            }
        }
    },

},

{
    timestamps: true
}
)

const User = mongoose.model("User", userSchema)
module.exports= User