const express = require("express")
const router = express.Router()
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



router.get("/",verifyToken,async(req,res)=>{
    jwt.verify(req.token,process.env.SECRET_KEY,async(err,authData)=>{
        if(err){
            console.log(err)
            res.status(400).send("could not verify token...")
        }else{
            try{
            const user=await User.findOne({username:authData.user.username })
            res.status(200).json({"username":user.username,"followers":user.followers.length,"following":user.following.length})
            }catch(err){
                res.status(500).send(err)
            }
        }
    })



})


module.exports=router
