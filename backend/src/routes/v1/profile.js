const express = require("express")
const User = require("../../models/user")
const { userAuth } = require("../../middlewares/auth")

const profileRouter = express.Router()



profileRouter.get("/profile",userAuth,async (req,res)=>{
    try {
     
        
     const user = req.user   
    
    // console.log(token)
    res.send(user)

    } catch (error) {

        res.status(400).send("Error : " + error.message)

    }
    
})

profileRouter.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId
    const data = req.body
    try {

        const ALLOW_UPDATE = ["gender","age","skills"]

        const isUpdateAllowed = Object.keys(data).every((key)=>
            ALLOW_UPDATE.includes(key) 
        )

        if(!isUpdateAllowed){
            throw new Error("Update is not allowed")
        }
        

        if(data?.skills.length > 10){
            throw new Error("Skills maximum is 10")
           }
    
        await User.findByIdAndUpdate({_id : userId  },data,{runValidators : true})
        res.send("User update successfully")
    } catch (error) {
        res.status(400).send("Invalid data")
    }
})

profileRouter.get("/feed",async (req,res)=>{

    try {
     const feed = await User.find({})
     res.send(feed)
    } catch (err) {
     
     res.status(404).send("No result foound" + err.message)
 
    } 
    
 
 })
 
 
 profileRouter.get("/user",async(req,res)=>{
 
     const emailId = req.body.emailId
     console.log(emailId)
         try {
         const user = await User.findOne({emailId : emailId})
         console.log(user)
         if(!user){
             res.status(404).send("No result is found")
             return
         }
         res.send(user)
     } catch (err) {
 
         res.status(404).send("No result is found" , err.message)
     }
    
     
 })
 
 
 profileRouter.delete("/user",async(req,res)=>{
     const userId = req.body.userId
 
     try {
         await User.findByIdAndDelete({_id : userId})
         res.send("User deleted successfully")
     } catch (error) {
         res.status(400).send("Error occured")
     }
 })

module.exports = profileRouter