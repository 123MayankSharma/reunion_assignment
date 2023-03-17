const express = require("express")
const router = express.Router()
const bcrypt=require("bcrypt")
const User=require("../models/user")
const jwt=require("jsonwebtoken")


const verifyToken=(req,res,next)=>{
    const bearerHeader=req.headers['authorization']
    if(typeof bearerHeader!== 'undefined'){
        const bearer=bearerHeader.split(" ")
        const token=bearer[1]
        req.token=token
        next()
    }else{
        res.status(400).send("Not able to verfy the user.")
    }
}

router.post("/register",async(req,res)=>{
    try{
        //generate hashed password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(req.body.password,salt)
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        const user=await newUser.save()
        res.status(200).json(user)
    }catch(err){
        res.status(500).send(err)
    }
})

router.post("/",async (req,res)=>{
    try{
    const user=await User.findOne({email:req.body.email})

    //if user is not found
    if(!user) res.status(400).json("Entered Username or Password is Incorrect!")

    //then, validate the password
    const validatePassword=bcrypt.compare(req.body.password,user.password)

    //if password of user stored in db does not match password entered by client return client error
    if(!validatePassword) res.status(400).json("Entered Username or Password is Incorrect!")

    jwt.sign({user},process.env.SECRET_KEY,{expiresIn:'11000s'},(err,token)=>{
            res.status(200).json({token})
    })



    }catch(err){
        res.status(500).json(err)
    }
})

/*
 *
 * jwt flow: on login attempt, after password verification jwt is generated and
 * sent to frontend and on every subsequent request to a protected resource the
 * token is extracted from the request and verified and then access is given to
 * protected resources.
 *
 *
*/




module.exports=router
