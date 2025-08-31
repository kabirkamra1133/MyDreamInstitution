import mongoose, { Mongoose } from 'mongoose';
import CollegeAdmin from './CollegeAdmin.js';
const collegeSchema = new mongoose.Schema({
  name : { type: String, required: true },
  instituteCode: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  contactNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'CollegeAdmin', default: null }
});

export default mongoose.model('College', collegeSchema);
