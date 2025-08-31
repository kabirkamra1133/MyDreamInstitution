import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: { type: String },
  filename: { type: String },
  size: { type: Number },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  line1: String,
  city: String,
  state: String,
  pincode: String,
  country: String
}, { _id: false });

const contactSchema = new mongoose.Schema({
  primaryPhone: String,
  secondaryPhone: String,
  email: String,
  website: String
}, { _id: false });

const subCourseSchema = new mongoose.Schema({
  name: String,
  fee: { type: String },
  eligibility: { type: [String], default: [] }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  name: String,
  subCourses: { type: [subCourseSchema], default: [] }
}, { _id: false });

const collegeAdminSchema = new mongoose.Schema({
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  contactNumber: { type: String },
  role: { type: String, enum: ['college-admin'], default: 'college-admin' },
  permissions: { type: [String], default: [] },

  // Branding and media
  logo: { type: mediaSchema },
  coverPhoto: { type: mediaSchema },
  gallery: { type: [mediaSchema], default: [] },

  // Profile content
  profile: {
    description: { type: String },
    features: { type: [String], default: [] },
    address: { type: addressSchema },
    googleLocation: { type: String },
    contact: { type: contactSchema },
    videos: { type: [String], default: [] }
  },

  // Courses offered
  courses: { type: [courseSchema], default: [] },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('CollegeAdmin', collegeAdminSchema);
