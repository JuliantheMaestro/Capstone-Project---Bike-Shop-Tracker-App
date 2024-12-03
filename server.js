const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const port = 3019

const app = express()
app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))
app.use(express.json())





//Connection to MongoDB

const connect = mongoose.connect("mongodb://127.0.0.1:27017/volunteers")

connect.then(() => {
    console.log("Mongodb connection successful")
})
.catch(() => {
    console.log("Database cannot be connected")
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






//Data collection from volunteer sign-up form, sends an alert if it succeeds 

app.post("/post",async (req,res)=>{
    const {numid, name, phonenumber, email, mechanic_experience, comments} = req.body

 // Check if the user already exists

     try {
            const existingUser = await Users.findOne({ name })

            if (existingUser) {
                return res.status(400).json({ message: "Name already exists, please choose a different name"})
            }

            const user = new Users ({
                numid,
                name,
                phonenumber,
                email,
                mechanic_experience,
                comments
            })


            const userData = await user.save()
            console.log(userData)
            res.status(200).json({ message: "Form Submitted Successfully" })
        } catch (error) {
            console.error("Failed to create user", error)
            res.status(500).json({ message: "Failed to create user. Please try again." })
        }
})





//User login

app.post ("/login", async (req, res) => {
    try {
        const { name, numid} = req.body

        const user = await Users.findOne({ $or: [{ name }, { numid }] })
        
        if (!user) {
           return res.status(404).json({ message: "User Name or ID cannot be found" })
        }
        res.status(200).json({ message: "Login Successful!", user})
    
    } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "An error occurred during login." })
    }
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