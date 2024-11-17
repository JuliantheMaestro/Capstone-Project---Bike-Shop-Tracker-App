const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const port = 3019

const app = express()
app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://127.0.0.1:27017/volunteers")
const db = mongoose.connection 
db.once("open",()=>{
    console.log("Mongodb connection successful")
})

const userSchema = new mongoose.Schema({
    name:String,
    phonenumber:String,
    email:String,
    mechanic_experience:String
})

const Users = mongoose.model("data", userSchema)

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "4volunteerSignUpPage.html"))
})

app.post("/post",async (req,res)=>{
    const {name, phonenumber, email, mechanic_experience} = req.body
    const user = new Users ({
        name,
        phonenumber,
        email,
        mechanic_experience
    })
    await user.save()
    console.log(user)
    res.send('<script>alert("Form Submitted Succesfully");</script>')
})

app.listen(port,()=>{
    console.log("Server started")
})