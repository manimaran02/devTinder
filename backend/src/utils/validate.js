const validator = require("validator")

const validateSignUpdata = (req)=>{

    const {firstName,lastName,emailId,password} = req.body
    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }
   else if(!validator.isEmail(emailId)){
    throw new Error("Email id is not valid")
   }

   else if(!validator.isStrongPassword(password)){
    throw new Error("Strong password is required")
   }

}


module.exports = {validateSignUpdata}