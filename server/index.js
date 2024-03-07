const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config()

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
}

app.use(cors())
app.use(express.json())

app.get("/test" , (req , res)=>res.send("working"))

app.post("/api/register" , (req , res)=>{
    const {username , password} = req.body;
    res.json({requestData : {username , password}})
})


app.listen(3000)