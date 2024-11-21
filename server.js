const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const port = 3019

const app = express()
app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/volunteers")
const db = mongoose.connection 
db.once("open",()=>{
    console.log("Mongodb connection successful")
})

const userSchema = new mongoose.Schema({
    numid:Number,
    name:String,
    phonenumber:String,
    email:String,
    mechanic_experience:String,
    comments:String
})

const Users = mongoose.model("data", userSchema)

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "1index.html"))
})

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

app.listen(port,()=>{
    console.log("Server started")
})