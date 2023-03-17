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



router.post("/:id",verifyToken,async(req,res)=>{
    let flag=null;
    jwt.verify(req.token,process.env.SECRET_KEY,async(err,authData)=>{
        if(err){
            console.log(err)
            res.status(400).send("could not verify token...")
        }else{
            try{
            const updatedFollower=await User.updateOne({
                _id: authData.user._id,
                following:{ $ne:req.params.id}},
                { $push: { following: req.params.id }
                })
            res.status(200).json(updatedFollower)
            }catch(err){
                res.status(500).send(err)
            }
        }
    })



})


module.exports=router
