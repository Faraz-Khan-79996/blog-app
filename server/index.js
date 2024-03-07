const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose');
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()

//salt and secret. Sync
const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
}

//Due to the credentials : 'include' in fetch.
app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use(express.json())
app.use(cookieParser())

app.get("/test", (req, res) => res.send("working"))

app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, salt)
    try {
        const userDoc = await User.create({ username, password: hashedPassword })
        res.json(userDoc)
    } catch (e) {
        res.status(400).json(e)
    }
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username })

    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)

        const payload = {
            username,
            id: userDoc._id
        }
        if (passOk) {
            jwt.sign(payload, secret, {}, (err , token)=>{
                if (err) throw err;
                res.cookie('token' , token)
                res.status(200).json(payload)
            })
        }
        else {
            res.status(400).json({msg : 'Password incorrect'})
        }
    } else {
        res.status(400).json({msg : 'username does not exist!'})
    }

    // const {username,password} = req.body;
    // const userDoc = await User.findOne({username});
    // const passOk = bcrypt.compareSync(password, userDoc.password);
    // if (passOk) {
    //   // logged in
    //   jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
    //     if (err) throw err;
    //     res.cookie('token', token).json({
    //       id:userDoc._id,
    //       username,
    //     });
    //   });
    // } else {
    //   res.status(400).json('wrong credentials');
    // }

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