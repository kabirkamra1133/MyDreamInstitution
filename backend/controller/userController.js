import axios from "axios";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
const getAllUsers = async(req,res)=>{
    try{
        
        const res = await User.find();
        console.log(res);
    }
    catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const registerUser = async(req,res)=>{
    try{    
        const {firstName , lastName , 
    email,
    phone,
    password,
    dateOfBirth,
    education,} = req.body;
        if(!firstName || !lastName || !email || !phone || !password || !dateOfBirth || !education) return res.status(401).json({error:"Please fill all the fields"});
        const userexist =  await User.findOne({email});
        if(userexist) return res.status(400).json({error:"User already exists"});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({firstName,lastName,email,password:hashedPassword,dateOfBirth,phone,education});
        await user.save();
        res.status(200).json({message:"User registered successfully"});

    }catch(err){
        console.log("Error ", err);
    }
}
const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(404).json({error:"Please enter all fields"});
        const user = await User.findOne({email});
        const isCorrect = await bcrypt.compare(password,user.password);
        if(isCorrect==true) {
            const token = jwt.sign({email,password},process.env.JWT_SECRET);
            return res.status(200).json({message:"Successfully logged in!!",token},{token:token});
        }
        else return res.status(401).json({error:"Please enter valid information "});
    }
    catch(err){
        console.error("Error while logging user",err);
    }
}
const verifyToken = async(req,res)=>{
    const email = req.user.email;
    return res.json({message:"This will be done if user is logged in otherwise it wont",email});
}
export { getAllUsers, registerUser,loginUser , verifyToken };