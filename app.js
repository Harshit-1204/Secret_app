require('dotenv').config();
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRound = 10

const app = express()


app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine" ,"ejs")


mongoose.connect("mongodb://localhost:27017/UserDB",{useNewUrlParser : true,useUnifiedTopology : true})

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})





const User = mongoose.model("User" , userSchema)



app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register" , function(req,res){
    
    bcrypt.hash(req.body.password,saltRound,function(err,hash){
        const user = new User({
            email : req.body.username,
            password : hash
        })
        user.save(function(err){
            if(!err){
                res.render("secrets")
                console.log("succesfully Saved user")
            }
        })
    })
    
})

app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,foundUser){
        if(!err){
            bcrypt.compare(req.body.password,foundUser.password,function(err,result){
                if(result===true){
                    res.render("secrets")
                }
            })
            
        }
    })
})














app.listen(3000,function(){
    console.log("Server Started on port 3000")
})