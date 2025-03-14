const express = require("express")
const connectDB = require("./config/database")
const apiRoutes = require("./routes")
const cookieParser = require("cookie-parser")


const app = express()

const port = 3000

app.use(express.json())
app.use(cookieParser())


app.use('/api',apiRoutes)




connectDB().then(()=>{
    console.log("Connected successfully")
    app.listen(port,()=>{
        console.log(`localhost:${port}`)
    })
}).catch((err)=>{
    console.error("Database is not connected properly")
})


