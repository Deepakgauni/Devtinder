
const validator = require("validator");

const validateSignupData = (req)=>{
    const {firstName, lastName, emailId, password}= req.body; 

    if(!firstName || !lastName){
        throw new Error("name is not valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong")
    }
}

const validateEditProfileData = (req)=>{
    const allowdedFields = [ "firstName", "lastName", "age", "gender"]
    const isEditAllowed =Object.keys(req.body).every(field=>allowdedFields.includes(field))
    return isEditAllowed
}
module.exports = { validateSignupData, validateEditProfileData, }
    
