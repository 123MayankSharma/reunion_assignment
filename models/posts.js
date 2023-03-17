const mongoose=require("mongoose")


const postSchema=new mongoose.Schema({
    created_by:{
        type:String,
        min:4,
        max:15,
        require:true
    },
    title:{
        type:String,
        require:true,
        min:4,
        max:30,
    },
    desc:{
        type:String,
        require:true,
        min:4
    },
    comments:{
        type:[],
        require:true
    },

    likeCount:{
        type:Number,
        require:true
    },
    likes:{
        type:[],
        require:true
    }

},{timestamps:true})


module.exports=mongoose.model("Posts",postSchema)
