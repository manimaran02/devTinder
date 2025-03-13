const User = require("../models/user")
const jwt = require("jsonwebtoken")

const userAuth = async (req,res,next)=>{
try {
        
    const {token} =  req.cookies
    const decode = await jwt.verify(token,"ManimaranSDE@")
    const user = await User.findById(decode._id)
    if(!user){
        throw new Error("User not exists")
    }

    req.user = user
    next()

    
} catch (error) {
    res.status(400).send("Error : " +error.message)
}
}

module.exports = {userAuth}