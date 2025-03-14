const express = require("express")
const { userAuth } = require("../../middlewares/auth")

const requestRouter = express.Router()


requestRouter.post("/ConnectionRequest",userAuth,async(req,res)=>{

    const user = req.user

    res.send("Connection Request "+user.firstName)


})


module.exports = requestRouter