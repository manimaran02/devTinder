const express = require("express")
const { validateSignUpdata } = require("../../utils/validate")
const User = require("../../models/user")
const bcrypt = require("bcrypt")
const validator = require('validator')


const authRouter = express.Router()


authRouter.post("/signup",async (req,res)=>{
   
    // const userObj = {
    //     firstName : "Manimaran",
    //     lastName : "AC",
    //     emailId : "manimaran123@gmail.com",
    //     password  : "Manimaran2000"
    // }

    
   

    try {
   validateSignUpdata(req)
  
    const {firstName ,lastName,emailId,password,skills} = req.body    

   const passwordHash = await bcrypt.hash(password,10)

    
   const user = new User({
    firstName ,
     lastName ,
     emailId ,
     password : passwordHash,
     skills
    })
   

    await user.save()
    res.send("POST update")
   } catch (error) {
    res.status(400).send("Error : " + error.message)
   }

   
})


authRouter.post("/login",async (req,res)=>{

    try {
      
        const {emailId , password} = req.body
        if(!validator.isEmail(emailId)){
            throw new Error("Email is not valid")
        }
        else{
            const user = await User.findOne({emailId : emailId})
            if(!user){
                throw new Error("Invalid Credential")
            }
             const isPasswordValid =await user.validatePassword(password)
            if (isPasswordValid){

                const token = await user.getJWT()

                res.cookie("token",token,{expires : new Date(Date.now() + 7 * 36000000)})

                console.log(token)
                res.send("Login successfully")
            }
            else{
                throw new Error("Invalid crendential")
            }
            // console.log(user[0].firstName)
            // res.send("Login")
        }
        

    } catch (error) {
        
        res.send("Error : " + error.message)

    }

})


module.exports = authRouter



