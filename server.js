const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const port = 3019

const app = express()
app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))
app.use(express.json())





//Connection to MongoDB

mongoose.connect("mongodb://127.0.0.1:27017/volunteers")
const db = mongoose.connection 
db.once("open",()=>{
    console.log("Mongodb connection successful")
})





//Schema

const userSchema = new mongoose.Schema({
    numid:Number,
    name:String,
    phonenumber:String,
    email:String,
    mechanic_experience:String,
    comments:String,
    timestamp: { type: Date, default: Date.now }
})

const Users = mongoose.model("data", userSchema)





//Directs user to first page when server starts

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "1index.html"))
})






//Data collection from volunteer sign-up form, sends an alert if it succeeds and refreshes the form 

app.post("/post",async (req,res)=>{
    const {numid, name, phonenumber, email, mechanic_experience, comments} = req.body
    const user = new Users ({
        numid,
        name,
        phonenumber,
        email,
        mechanic_experience,
        comments
    })
    await user.save()
    console.log(user)
    res.send('<script>alert("Form Submitted Successfully"); window.location.href="/";</script>')
})




//Gets the latest entry from monoDB to display on 5Welcome page 

app.get("/latest-entry", async (req, res) => {
    try {
        const latestRecord = await Users.find().sort({ timestamp: -1}).limit(1)
        res.json(latestRecord[0])
    } catch (error) {
        console.error("Latest entry fetch failure", error)
        res.status(500).json({ message: "Latest entry fetch failure" })
    }
})





//Notifies if server has started in terminal 

app.listen(port,()=>{
    console.log("Server started")
})