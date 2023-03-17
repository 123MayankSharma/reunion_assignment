const mongoose=require("mongoose")


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        min:4,
        max:15,
        unique:true,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    followers:{
        type:[],
        require:true
    },
    following:{
        type:[],
        require:true
    },
    password:{
        type:String,
        require:true,
        min:8
    }

},{timestamps:true})


module.exports=mongoose.model("Users",userSchema)
