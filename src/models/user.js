const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema(
    {
    firstName:{
        type: String,
        minLength: 4,
    },
    lastName:{
          type: String,  
          

    },

    password:{
         type: String,
         minLength: 10,
         maxLength: 100,
    },

    emailId:{
          type: String,
          unique: true,
          trim : true,
          validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is not valid" + value)
            }
          }
        
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