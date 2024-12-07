require('dotenv').config()
console.log("CLIENT_ID:", process.env.CLIENT_ID)
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET)
console.log("REDIRECT_URI:", process.env.REDIRECT_URI)

const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const { google } = require("googleapis")
const { OAuth2 } = google.auth


const port = 3019
const app = express()

app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))
app.use(express.json())


console.log("Environment Variables Loaded: ", process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)


const oAuth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  )

  console.log("OAuth2 Client Initialized: ", {
    clientId: process.env.CLIENT_ID,
    redirectUri: process.env.REDIRECT_URI,
})


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
    timesLoggedIn: { type: Number, default: 0 },
    loginDates: [{ type: Date }],
    timestamp: { type: Date, default: Date.now }
})

const Users = mongoose.model("data", userSchema)





//Directs user to first page when server starts

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "BikeShopAdmin.html"))
})





//Checks if ID is unique and generates random 4 digit ID for the user

async function makeUniqueID() {
    let unique = false
    let numid

    while (!unique) {
            numid = Math.floor(1000 + Math.random() * 9000)
            const existingNumdID = await Users.findOne({ numid })

            if (!existingNumdID) {
                unique = true
            }
    }

    return numid 
}



//Data collection from volunteer sign-up form, sends an alert if it succeeds 

app.post("/post",async (req,res)=>{
    const { name, phonenumber, email, mechanic_experience, comments } = req.body

 // Check if the user already exists

     try {
            const existingUser = await Users.findOne({ name })

            if (existingUser) {
                return res.status(400).json({ message: "Name already exists, please choose a different name"})
            }


//Generates nonexisting numid

const numid = await makeUniqueID()





//Creates and saves the user
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


function getAuthUrl() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/calendar',
        redirect_uri: 'http://localhost:3019/auth/google/callback',
    })
    console.log("Authorization URL: ", authUrl)
    return authUrl
}


//User login

app.post ("/login", async (req, res) => {
    try {
        const { name, numid} = req.body

        const user = await Users.findOne({ $or: [{ name }, { numid }] })
        
        if (!user) {
           return res.status(404).json({ message: "User Name or ID cannot be found" })
        }


        user.timesLoggedIn = (user.timesLoggedIn || 0) + 1
        user.loginDates = [...user.loginDates || [], new Date()]
        await user.save()

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





 //Gets all user data for table

 app.get("/api/allnames", async (req, res) => {
    try {
        const users = await Users.find()
        res.json(users)

        } catch (error) {
            console.error("Error getting user data")
            res.status(500).json({ message: "Error getting user data" })
        }

    })


//Gets all login dates from backend

app.get("/api/user-logins/:id", async (req, res) => {
    try {
        const user = await Users.findOne({ numid: req.params.id })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user.loginDates)
    } catch (error) {
        console.error("Error fetching login dates:", error)
        res.status(500).json({ message: "Error fetching login dates" })
    }
})


async function setCredentialsFromAuthCode(authorizationCode) {
    try {
      const { tokens } = await oAuth2Client.getToken(authorizationCode)
      oAuth2Client.setCredentials(tokens)
  
      
      console.log("Credentials set successfully")
    } catch (error) {
      console.error("Error exchanging authorization code:", error)
    }
  }


  app.post("/sync-calendar", async (req, res) => {
    try {
        const users = await Users.find()

        if (!oAuth2Client.credentials.access_token) {
            const authUrl = getAuthUrl()
            return res.status(401).json({ message: "Authorization required", authUrl })
        }

        const calendar = google.calendar({ version: "v3", auth: oAuth2Client })

        for (const user of users) {
            if (user.loginDates && user.loginDates.length > 0) {
                for (const loginDate of user.loginDates) {
                    const event = {
                        summary: `Bike Shop Login - ${user.name}`,
                        description: `User logged into the system`,
                        start: {
                            dateTime: new Date(loginDate).toISOString(),
                            timeZone: "America/New_York",
                        },
                        end: {
                            dateTime: new Date(new Date(loginDate).getTime() + 15 * 60 * 1000).toISOString(),
                            timeZone: "America/New_York",
                        },
                    };

                    try {
                        await calendar.events.insert({
                            calendarId: "primary",
                            resource: event,
                        });
                    } catch (error) {
                        console.error(`Error adding event for ${user.name}:`, error)
                    }
                }
            }
        }

        res.status(200).json({ message: "Calendar updated successfully" })
    } catch (error) {
        console.error("Error syncing calendar:", error)
        res.status(500).json({ message: "Failed to sync calendar" })
    }
})


app.get("/auth/google/callback", async (req, res) => {
    const { code } = req.query

    try {
        const { tokens } = await oAuth2Client.getToken(code)
        oAuth2Client.setCredentials(tokens)

        console.log("Google Calendar credentials saved successfully")
        res.redirect("/")
    } catch (error) {
        console.error("Error during Google OAuth callback:", error)
        res.status(500).send("Failed to authenticate with Google")
    }
})


//Notifies if server has started in terminal 

app.listen(port, () => {
    console.log("Server started")
})