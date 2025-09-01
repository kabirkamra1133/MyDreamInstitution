import Shortlist from '../model/Shortlist.js';
import CollegeAdmin from '../model/CollegeAdmin.js';
import User from '../model/User.js';

// Helper to resolve student id from auth (placeholder: req.user?.id) or body
const getStudentId = (req) => {
  if (req.user && req.user.id) return req.user.id; // if auth middleware populated
  return req.body.student || req.query.student || null;
};

// Get current user's shortlists with populated college data
export const getMyShortlists = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID required' });
    }

    const shortlists = await Shortlist.find({ student: studentId })
      .populate({
        path: 'college',
        select: 'name profile logo'
      })
      .lean();

    return res.json({ shortlists });
  } catch (error) {
    console.error('getMyShortlists error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const listShortlisted = async (req, res) => {
  try {
    const studentId = getStudentId(req);
    if (!studentId) return res.status(400).json({ error: 'student id required' });
    const items = await Shortlist.find({ student: studentId }).populate({
      path: 'college',
      select: 'name email profile logo coverPhoto courses contactNumber'
    }).lean();
    return res.json({ data: items });
  } catch (err) {
    console.error('listShortlisted error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const addShortlist = async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { collegeId, notes, interestedCourses } = req.body;
    if (!studentId || !collegeId) return res.status(400).json({ error: 'student and collegeId required' });
    const existsCollege = await CollegeAdmin.findById(collegeId).lean();
    if (!existsCollege) return res.status(404).json({ error: 'College not found' });
    const update = { $setOnInsert: { notes } };
    if (Array.isArray(interestedCourses)) {
      // overwrite interestedCourses when provided
      update.$set = { interestedCourses };
    }
    const doc = await Shortlist.findOneAndUpdate(
      { student: studentId, college: collegeId },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    // populate for client verification
    const populated = await Shortlist.findById(doc._id).populate({ path: 'student', select: 'firstName lastName email' }).populate({ path: 'college', select: 'name' }).lean();

    // also compute aggregated course names for this college (for admin view)
    const agg = await Shortlist.aggregate([
      { $match: { college: doc.college } },
      { $unwind: { path: '$interestedCourses', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$college', courses: { $addToSet: '$interestedCourses.name' } } }
    ]);
    const aggregatedCourses = Array.isArray(agg) && agg.length ? (agg[0].courses || []).filter(Boolean) : [];

    return res.status(201).json({ message: 'Shortlisted', data: populated, aggregatedCourses });
  } catch (err) {
    if (err.code === 11000) return res.status(200).json({ message: 'Already shortlisted' });
    console.error('addShortlist error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const removeShortlist = async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { collegeId } = req.params;
    if (!studentId || !collegeId) return res.status(400).json({ error: 'student and collegeId required' });
    const deleted = await Shortlist.findOneAndDelete({ student: studentId, college: collegeId });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    return res.json({ message: 'Removed from shortlist' });
  } catch (err) {
    console.error('removeShortlist error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const toggleShortlist = async (req, res) => {
  try {
    const studentId = getStudentId(req);
  const { collegeId, interestedCourses } = req.body;
    if (!studentId || !collegeId) return res.status(400).json({ error: 'student and collegeId required' });
    const existing = await Shortlist.findOne({ student: studentId, college: collegeId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ message: 'Unshortlisted', shortlisted: false });
    }
  const created = await Shortlist.create({ student: studentId, college: collegeId, interestedCourses: Array.isArray(interestedCourses) ? interestedCourses : [] });
    const populated = await Shortlist.findById(created._id).populate({ path: 'student', select: 'firstName lastName email' }).populate({ path: 'college', select: 'name' }).lean();

    const agg = await Shortlist.aggregate([
      { $match: { college: created.college } },
      { $unwind: { path: '$interestedCourses', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$college', courses: { $addToSet: '$interestedCourses.name' } } }
    ]);
    const aggregatedCourses = Array.isArray(agg) && agg.length ? (agg[0].courses || []).filter(Boolean) : [];

    return res.status(201).json({ message: 'Shortlisted', shortlisted: true, data: populated, aggregatedCourses });
  } catch (err) {
    console.error('toggleShortlist error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// List all students who shortlisted a specific college admin profile
export const listStudentsForCollege = async (req, res) => {
  try {
    // If role is college-admin use their own id unless an id param explicitly provided and user is admin
    let { collegeAdminId } = req.params;
    if (!collegeAdminId) collegeAdminId = req.query.collegeAdminId;
    if (!collegeAdminId && req.user) {
      if (req.user.role === 'college-admin') {
        collegeAdminId = req.user.id;
      } else if (req.user.role === 'college') {
        // Map base College user to its CollegeAdmin profile (one-to-one via college field)
        const related = await CollegeAdmin.findOne({ college: req.user.id }).select('_id').lean();
        if (related) collegeAdminId = related._id.toString();
      }
    }
    if (!collegeAdminId) {
      // Instead of 400, return empty dataset for better UX fallback
      return res.json({ college: null, count: 0, students: [] });
    }

    const college = await CollegeAdmin.findById(collegeAdminId).select('name email').lean();
    if (!college) return res.json({ college: null, count: 0, students: [] });

    const items = await Shortlist.find({ college: collegeAdminId })
      .populate({ path: 'student', select: 'firstName lastName email education createdAt' })
      .sort({ createdAt: -1 })
      .lean();

    const students = items.map(it => ({
      id: it.student?._id,
      firstName: it.student?.firstName,
      lastName: it.student?.lastName,
      email: it.student?.email,
      education: it.student?.education,
      shortlistedAt: it.createdAt,
      interestedCourses: Array.isArray(it.interestedCourses) ? it.interestedCourses : []
    }));

    return res.json({ college, count: students.length, students });
  } catch (err) {
    console.error('listStudentsForCollege error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Aggregated stats across colleges (admin view)
export const listShortlistStats = async (req, res) => {
  try {
    const agg = await Shortlist.aggregate([
      { $group: { _id: '$college', count: { $sum: 1 }, latest: { $max: '$createdAt' } } },
      { $sort: { count: -1 } }
    ]);

    // Fetch college admin info
    const collegeIds = agg.map(a => a._id);
    const colleges = await CollegeAdmin.find({ _id: { $in: collegeIds } }).select('name email').lean();
    const collegeMap = Object.fromEntries(colleges.map(c => [c._id.toString(), c]));

    const data = agg.map(a => ({
      collegeAdminId: a._id,
      name: collegeMap[a._id.toString()]?.name || 'Unknown',
      email: collegeMap[a._id.toString()]?.email,
      count: a.count,
      latest: a.latest
    }));

    return res.json({ data });
  } catch (err) {
    console.error('listShortlistStats error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default { getMyShortlists, listShortlisted, addShortlist, removeShortlist, toggleShortlist, listStudentsForCollege, listShortlistStats };
