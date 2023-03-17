const express = require("express")
const router = express.Router()
const bcrypt=require("bcrypt")
const User=require("../models/user")
const jwt=require("jsonwebtoken")



router.post("/register",async(req,res)=>{
    try{
        if(!req.body.password||!req.body.username||!req.body.email){
            res.status(400).send("one of the input fields is missing...")
        }else{
        //generate hashed password
        const hashedPassword=await bcrypt.hash(req.body.password,10)
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        const user=await newUser.save()
        res.status(200).json(user)
      }
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.post("/",async (req,res)=>{
    try{
     if(!req.body.password||!req.body.email){
            return res.status(400).send("one of the input fields is missing...")
        }else{
          const user=await User.findOne({email:req.body.email})

        //if user is not found
        if(!user) return res.status(400).json({"Error":"Entered email or Password is Incorrect!"})

        //then, validate the password
        const validatePassword=await bcrypt.compare(req.body.password,user.password)

        //if password of user stored in db does not match password entered by client return client error

      if(validatePassword)
      {
          jwt.sign({user},process.env.SECRET_KEY,{expiresIn:'11000s'},(err,token)=>{
            if(err){
                return res.status(500).json({"error":"backend error..."})
            }
            return res.status(200).json({token})
        })
      }else{
          return res.status(400).json({"Error":"Email or Password is Incorrect"})
      }
    }

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
