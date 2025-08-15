import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  address: { type: String },
  contactNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('College', collegeSchema);
