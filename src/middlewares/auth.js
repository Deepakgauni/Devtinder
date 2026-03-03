const adminauth = (req, res, next)=>{
     const token = "xyz"
  const isadminauhtorized = token === "xyz"
  if(!isadminauhtorized){
    res.status(403).send("admin not authorized")

  }
else{
    next()
}

}

module.exports = { adminauth}