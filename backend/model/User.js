import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstName :{type : String ,required:true},
    lastName: {type : String , required:true},
    phone :{type : Number , required:true},
    dateOfBirth :{type : Date , required:true},
    education :{type : String , required:true},
    email :{type : String , required : true},
    password :{type : String , required : true},
    createdAt : {type : Date, default : Date.now},
})
export default mongoose.model('Users',userSchema);