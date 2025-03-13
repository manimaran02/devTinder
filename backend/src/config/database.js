const mongoose = require("mongoose")

const connectDB = async()=>{

    await mongoose.connect("mongodb+srv://maddy_freak02:Mani2000@backendprojectnodeexpre.posotvj.mongodb.net/dev")
}


module.exports = connectDB

