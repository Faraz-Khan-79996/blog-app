const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose');
const User = require('./models/User')//usermodel
const Post = require('./models/Post');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path')
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
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json())
app.use(cookieParser())
//making uploads folder static and available on '/api/uploads' path
app.use('/api/uploads' , express.static(path.join(__dirname , 'uploads')))

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
            jwt.sign(payload, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token)
                res.status(200).json(payload)
            })
        }
        else {
            res.status(400).json({ msg: 'Password incorrect' })
        }
    } else {
        res.status(400).json({ msg: 'username does not exist!' })
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

app.get('/api/profile', (req, res) => {

    const { token } = req.cookies;

    //info is the payload of the token along with 
    //iat (issued at time)
    if (token) {
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) throw err;
            res.json(info);
        });
    }
    else {
        res.status(400).json({ msg: "no token in cookie" })
    }

    // res.json({token})
})

app.post('/api/logout', (req, res) => {
    res.cookie('token', '', {
        maxAge: 1,
    })
    res.json('cookie deleted')
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)

        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })
app.post('/api/post', upload.single('file'), async (req, res) => {
    //File is saved to ./uploads by the multer middleware

    const { token } = req.cookies;
    //we're sending the cookie when we create a post.
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        //create a Post document and save to database
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: `uploads/${req.file.originalname}`,
            // cover : path.normalize(req.file.path),
            author:info.id
        })
        // res.json({...req.file,...req.body})
        res.json(postDoc)
    })

})

//sends all the posts in the database.
app.get('/api/post', async (req, res) => {

    //taking out posts from the posts collection using 
    //Post model.
    const posts = await Post.find()
    .populate('author' , ['username'])
    .sort({createdAt:-1})//sort based on createdAt.
    .limit(30)
    //populate will attach the user doucement based on the object id
    //present in 'author' inside of 'Post'
    //only attach 'username' from users collection
    res.json(posts)
})

app.get('/api/post/:id' , async(req , res)=>{
    
    const {id} = req.params;

    try {
        //populate the author field with ONLY 'username'
        const postDoc = await Post.findById(id).populate('author' , ['username'])
    res.json(postDoc)
    } catch (error) {
        res.status(400).json({error , msg:"NOT FOUND"})
    }

})
app.listen(3000)
