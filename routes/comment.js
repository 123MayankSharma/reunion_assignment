const express = require("express")
const router = express.Router()
const Post=require("../models/posts")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")

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
    jwt.verify(req.token,process.env.SECRET_KEY,async(err,authData)=>{
        if(err){
            console.log(err)
            res.status(400).send("could not verify token...")
        }else{
          try{
              if(!req.body.comment){
                  res.status(400).send("Please add Text to comment for commenting...")
            }else{
             const commentId=new mongoose.Types.ObjectId().toString()
             await Post.updateOne(
             {_id:req.params.id},
               {
                $push:{
                    comments:{
                    "CommentId":commentId,
                    "comment":req.body.comment,
                    "username":authData.user.username
                    }
                }})

                res.status(200).json({"CommentId":commentId})
              }
            }catch(err){
                res.status(500).send(err)
            }
        }
    })
})


module.exports=router
