const express = require("express")

const router = express.Router() 

const authRouter = require("./auth")
const profileRouter = require("./profile")
const requestRouter = require("./request")




router.use('/',authRouter)
router.use('/',profileRouter)
router.use('/',requestRouter)


module.exports = router

