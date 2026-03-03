const mongoose = require("mongoose")


const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://deepakgauni84_db_user:ALQ4AHraY1frrPNP@learningnodejs.ykfxd0q.mongodb.net/devTinder")
}

module.exports = connectDB

