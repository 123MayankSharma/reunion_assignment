const express = require("express")
const router = express.Router()
const Post=require("../models/posts")
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
                const posts=await Post.find({created_by:authData.user.username}).select("_id title desc createdAt comments likeCount")

                const userPosts=posts.map((obj,idx)=>{
                    return {
                        id:obj._id,
                        title:obj.title,
                        desc:obj.desc,
                        comments:obj.comments,
                        likes:obj.likeCount,
                        created_at:obj.createdAt
                    }
                })
                res.status(200).json(userPosts)
            }catch(err){
                res.status(500).send(err)
            }
        }
    })



})

module.exports=router
