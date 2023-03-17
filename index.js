const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const cors=require("cors")
const helmet=require("helmet")
const morgan=require("morgan")
const authenticationRoute=require("./routes/auth")
const followRoute=require("./routes/follow")
const unfollowRoute=require("./routes/unfollow")
const userProfileRoute=require("./routes/userProfile")
const addPostRoute=require("./routes/posts")
const likeRoute=require("./routes/like")
const unlikeRoute=require("./routes/unlike")
const commentRoute=require("./routes/comment")
const allPostsRoute=require("./routes/all_posts")


const app=express();

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(helmet())
//for request logging
app.use(morgan("common"))


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true
  })
  .then(() => {
    console.log("Mongo DB server Connected!");
  }).catch((err)=>{
    console.log(err);
  })


const PORT=process.env.PORT||8000
//route for login functionality
app.use("/api/authenticate",authenticationRoute)

//route for follow functionality
app.use("/api/follow",followRoute)

//route for unfollow functionality
app.use("/api/unfollow",unfollowRoute)

//route for getting user profile
app.use("/api/user",userProfileRoute)

//route for post related actions
app.use("/api/posts",addPostRoute)

//like action route
app.use("/api/like",likeRoute)

//unlike action route
app.use("/api/unlike",unlikeRoute)


//comment action route
app.use("/api/comment",commentRoute)


app.use("/api/all_posts",allPostsRoute)


app.listen(PORT,()=>{console.log("server running on port "+PORT)})




