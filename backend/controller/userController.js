import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const getAllUsers = async(req,res)=>{
    try{
        const users = await User.find().select('-password');
        return res.json({ users });
    }
    catch(error){
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Deprecated: student registration and login moved to authController. Keep a simple verify endpoint
export const verifyToken = async(req,res)=>{
    const email = req.user?.email;
    return res.json({message:"Token valid", email, role: req.user?.role});
}

export default { getAllUsers, verifyToken };