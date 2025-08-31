import mongoose from 'mongoose';

// Each entry represents one college shortlisted by a student (user)
// We enforce uniqueness on (student, college) pair.
const shortlistSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'CollegeAdmin', required: true, index: true },
  notes: { type: String },
  interestedCourses: { type: [{ parent: String, name: String, addedAt: { type: Date, default: Date.now } }], default: [] },
  createdAt: { type: Date, default: Date.now }
});

shortlistSchema.index({ student: 1, college: 1 }, { unique: true });

export default mongoose.model('Shortlist', shortlistSchema);
