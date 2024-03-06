const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose');
<<<<<<< HEAD
=======
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
>>>>>>> 653548d (login register finished.)
require('dotenv').config()

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
}

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get("/test" , (req , res)=>res.send("working"))

app.post("/api/register" , (req , res)=>{
    const {username , password} = req.body;
    res.json({requestData : {username , password}})
})

app.get('/api/profile' , (req , res) =>{

    const {token} = req.cookies;
    
    //info is the payload of the token along with 
    //iat (issued at time)
    if(token){
        jwt.verify(token, secret, {}, (err,info) => {
            if (err) throw err;
            res.json(info);
          });
    }
    else{
        res.status(400).json({msg:"no token in cookie"})     
    }

    // res.json({token})
})
 
app.post('/api/logout' , (req , res)=>{
    res.cookie('token' , '' , {
        maxAge : 1,
    })
    res.json('cookie deleted')
})

app.listen(3000)