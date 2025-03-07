const express = require("express")

const app = express()

const port = 3000

app.use("/",(req,res)=>{
    res.send("DevTinder Backend")
})

app.listen(port,()=>{
    console.log(`localhost:${port}`)
})