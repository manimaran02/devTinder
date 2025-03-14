const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const valitor = require("validator")
const { default: isEmail } = require("validator/lib/isEmail")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 40

    },
    lastName : {
        type : String
    },
    emailId : { 
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(!isEmail(value)){
                throw new Error("Not an valid email : " +value)
            }
        }

    },
    password : {
        type : String
    },
    age : {
        type : Number
    },
    about : {
        type : String,
        default : "Welcome to dev Community"
    },
    skills : {
        type : [String]
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid gender")
            }

        }
    },
},{
    timestamps : true
})

userSchema.methods.getJWT = async function(){

    const token = await jwt.sign({_id :this._id},"ManimaranSDE@",{expiresIn : "1d"})
    return token

}

userSchema.methods.validatePassword =async function(passwordByUser){

    const isPasswordvalid = await bcrypt.compare(passwordByUser,this.password)
    
    return isPasswordvalid;

}

const UserModel = mongoose.model("User",userSchema)

module.exports = UserModel