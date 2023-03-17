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



router.post("/",verifyToken,async(req,res)=>{
    jwt.verify(req.token,process.env.SECRET_KEY,async(err,authData)=>{
        if(err){
            console.log(err)
            res.status(400).send("could not verify token...")
        }else{
            try{
                const post=new Post({
                    created_by:authData.user.username,
                    title:req.body.title,
                    desc:req.body.desc,
                    likeCount:0
                })
                const newPost=await post.save()
                res.status(200).json({"post_id":newPost._id,"title":newPost.title,"desc":newPost.desc,"created_at":newPost.createdAt})
            }catch(err){
                res.status(500).send(err)
            }
        }
    })



})

router.delete("/:id",verifyToken,async(req,res)=>{
    jwt.verify(req.token,process.env.SECRET_KEY,async(err,authData)=>{
        if(err){
            res.status(400).send("could not verify token...")
        }else{
            try{
                const deletedPost=await Post.deleteOne({_id:req.params.id})
                res.status(200).json(deletedPost)
            }catch(err){
                res.status(500).send(err)
            }
        }
})
})

router.get("/:id",verifyToken,async(req,res)=>{
    jwt.verify(req.token,process.env.SECRET_KEY,async(err,authData)=>{
        if(err){
            res.status(400).send("could not verify token...")
        }else{
            try{
                console.log(req.params.id)
                const post=await Post.findOne({_id:req.params.id})
                res.status(200).json(post)
            }catch(err){
                res.status(500).send(err)
            }
        }
})
})



module.exports=router
