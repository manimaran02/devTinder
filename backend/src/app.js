const express = require("express")
const connectDB = require("./config/database")
const brcypt = require('bcrypt')
const validator = require("validator")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const app = express()
const User = require("./models/user")

const {validateSignUpdata} = require("./utils/validate")
const { userAuth } = require("./middlewares/auth")

const port = 3000

app.use(express.json())
app.use(cookieParser())

app.post("/signup",async (req,res)=>{
   
    // const userObj = {
    //     firstName : "Manimaran",
    //     lastName : "AC",
    //     emailId : "manimaran123@gmail.com",
    //     password  : "Manimaran2000"
    // }

    
   

    try {
   validateSignUpdata(req)
  
    const {firstName ,lastName,emailId,password,skills} = req.body    

   const passwordHash = await brcypt.hash(password,10)

//    console.log(passwordHash)
    
   const user = new User({
    firstName ,
     lastName ,
     emailId ,
     password : passwordHash,
     skills
    })
   
console.log(req.body)

    await user.save()
    res.send("POST update")
   } catch (error) {
    res.status(400).send("Error : " + error.message)
   }

   
})


app.post("/login",async (req,res)=>{

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
             const isPasswordValid =await brcypt.compare(password,user.password)
            if (isPasswordValid){

                const token = await jwt.sign({_id : user._id},"ManimaranSDE@",{ expiresIn: "1d" })

                res.cookie("token",token,{expires : new Date(Date.now() + 7 * 36000000)})
                // console.log(token)
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

app.get("/profile",userAuth,async (req,res)=>{
    try {
        
     const user = req.user   
    
    // console.log(token)
    res.send(user)

    } catch (error) {

        res.status(400).send("Error : " + error.message)

    }
    
})

app.get("/feed",async (req,res)=>{

   try {
    const feed = await User.find({})
    res.send(feed)
   } catch (err) {
    
    res.status(404).send("No result foound" + err.message)

   } 
   

})


app.get("/user",async(req,res)=>{

    const emailId = req.body.emailId
    console.log(emailId)
        try {
        const user = await User.findOne({emailId : emailId})
        if(!user){
            res.status(404).send("No result is found")
        }
        res.send(user)
    } catch (err) {

        res.status(404).send("No result is found" , err.message)
    }
   
    
})


app.delete("/user",async(req,res)=>{
    const userId = req.body.userId

    try {
        await User.findByIdAndDelete({_id : userId})
        res.send("User deleted successfully")
    } catch (error) {
        res.status(400).send("Error occured")
    }
})

app.patch("/user/:userId",async (req,res)=>{
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



connectDB().then(()=>{
    console.log("Connected successfully")
    app.listen(port,()=>{
        console.log(`localhost:${port}`)
    })
}).catch((err)=>{
    console.error("Database is not connected properly")
})


