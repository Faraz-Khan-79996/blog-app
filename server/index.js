const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose');
const User = require('./models/User')
const bcrypt = require('bcrypt')
require('dotenv').config()

//salt and secret. Sync
const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
}

app.use(cors())
app.use(express.json())

app.get("/test" , (req , res)=>res.send("working"))

app.post("/api/register" , async (req , res)=>{
    const {username , password} = req.body;
    const hashedPassword = bcrypt.hashSync(password , salt)
    try {
        const userDoc = await User.create({username , password:hashedPassword})
        res.json(userDoc)   
    } catch (e) {
        res.status(400).json(e)
    }
})


app.listen(3000)