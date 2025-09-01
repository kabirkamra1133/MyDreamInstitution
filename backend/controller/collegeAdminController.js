import CollegeAdmin from '../model/CollegeAdmin.js';
import College from '../model/College.js';
import Shortlist from '../model/Shortlist.js';
import bcrypt from 'bcryptjs';
const fileMetaFrom = (file) => ({
  url: file ? `/uploads/college-admins/${file.filename}` : undefined,
  filename: file ? file.filename : undefined,
  size: file ? file.size : undefined,
  uploadedAt: file ? new Date() : undefined
});

// List college admins (admin-only)
export const listCollegeAdmins = async (req, res) => {
  try {
    const admins = await CollegeAdmin.find().select('-password').lean();
    return res.json({ data: admins });
  } catch (err) {
    console.error('listCollegeAdmins error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Create a college admin (admin or college level)
export const createCollegeAdmin = async (req, res) => {
  try {
    // Only authenticated college accounts can create their single admin profile
    const user = req.user;
    if (!user || user.role !== 'college' ) return res.status(403).json({ error: 'Only college accounts can create their profile' });

    const collegeId = user.id;
    // Check if profile already exists
    const existingProfile = await CollegeAdmin.findOne({ college: collegeId });
    if (existingProfile) {
      return res.status(409).json({ error: 'Profile already exists. Use update endpoint.' });
    }

    const files = req.files || {};
    const body = req.body || {};

    // Parse nested JSON fields
    const parseMaybeJSON = (val, fallback) => {
      if (!val) return fallback;
      try { return typeof val === 'string' ? JSON.parse(val) : val; } catch { return fallback; }
    };
    const profile = parseMaybeJSON(body.profile, {});
    const courses = parseMaybeJSON(body.courses, []);

    let { name, email, password, contactNumber } = body;
    if (!email && profile?.contact?.email) email = profile.contact.email;
    if (!email) return res.status(400).json({ error: 'email is required' });
    if (!name) name = (email.split('@')[0]) || 'College Admin';

    const emailExists = await CollegeAdmin.findOne({ email });
    if (emailExists) return res.status(409).json({ error: 'Email already used' });

    const hashed = await bcrypt.hash(password || Math.random().toString(36).slice(2, 10), 10);

    const logoFile = files.logo && files.logo[0];
    const coverFile = files.coverPhoto && files.coverPhoto[0];
    const safeParseObj = (raw) => { try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return raw; } };
    const providedLogo = safeParseObj(body.logo);
    const providedCover = safeParseObj(body.coverPhoto);
    const logoMeta = logoFile ? fileMetaFrom(logoFile) : (providedLogo?.url ? { url: providedLogo.url, uploadedAt: new Date() } : undefined);
    const coverMeta = coverFile ? fileMetaFrom(coverFile) : (providedCover?.url ? { url: providedCover.url, uploadedAt: new Date() } : undefined);

    const doc = new CollegeAdmin({
      college: collegeId,
      name,
      email,
      password: hashed,
      contactNumber,
      logo: logoMeta,
      coverPhoto: coverMeta,
      gallery: [],
      profile: {
        description: profile.description || '',
        features: profile.features || [],
        address: profile.address || {},
        googleLocation: profile.googleLocation || '',
        contact: profile.contact || {},
        videos: profile.videos || []
      },
      courses: courses || []
    });

    await doc.save();
    return res.status(201).json({ message: 'College admin profile created', data: doc });
  } catch (err) {
    console.error('createCollegeAdmin error', err);
    if (err.code === 11000) return res.status(409).json({ error: 'Profile already exists (duplicate)' });
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get single college admin by id
export const getCollegeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await CollegeAdmin.findById(id).select('-password').lean();
    if (!admin) return res.status(404).json({ error: 'Not found' });
    return res.json({ data: admin });
  } catch (err) {
    console.error('getCollegeAdmin error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Update college admin
export const updateCollegeAdmin = async (req, res) => {
  try {
    const user = req.user;
    console.log("os",user);
    if (!user || user.role !== 'college') return res.status(403).json({ error: 'Only college accounts can update their profile' });
    const collegeId = user.id;

    const existing = await CollegeAdmin.findOne({ college: collegeId });
    if (!existing) return res.status(404).json({ error: 'Profile not found' });

    const body = req.body || {};
    const parseMaybeJSON = (val, fallback) => {
      if (!val) return fallback;
      try { return typeof val === 'string' ? JSON.parse(val) : val; } catch { return fallback; }
    };
    const profile = parseMaybeJSON(body.profile, {});
    const courses = parseMaybeJSON(body.courses, []);

    if (body.name) existing.name = body.name;
    if (body.contactNumber) existing.contactNumber = body.contactNumber;
    if (profile && Object.keys(profile).length) {
      existing.profile = {
        description: profile.description || '',
        features: profile.features || [],
        address: profile.address || {},
        googleLocation: profile.googleLocation || '',
        contact: profile.contact || {},
        videos: profile.videos || []
      };
    }
    if (Array.isArray(courses)) existing.courses = courses;
    // media updates (expect { logo: {url}, coverPhoto: {url} })
    const providedLogo = body.logo && (typeof body.logo === 'string' ? JSON.parse(body.logo) : body.logo);
    if (providedLogo?.url) existing.logo = { url: providedLogo.url, uploadedAt: new Date() };
    const providedCover = body.coverPhoto && (typeof body.coverPhoto === 'string' ? JSON.parse(body.coverPhoto) : body.coverPhoto);
    if (providedCover?.url) existing.coverPhoto = { url: providedCover.url, uploadedAt: new Date() };

    await existing.save();
    return res.json({ message: 'Profile updated', data: existing });
  } catch (err) {
    console.error('updateCollegeAdmin error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get current authenticated college's profile
export const getMyCollegeAdmin = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'college') return res.status(403).json({ error: 'Only college accounts can view this profile' });
    const doc = await CollegeAdmin.findOne({ college: user.id }).select('-password').lean();
    if (!doc) return res.status(404).json({ error: 'Profile not found' });
    return res.json(doc);
  } catch (err) {
    console.error('getMyCollegeAdmin error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Delete college admin
export const deleteCollegeAdmin = async (req, res) => {
  // TODO: implement delete logic
  return res.status(501).json({ message: 'Not implemented' });
};

// Get forwarded students for a specific college
export const getForwardedStudents = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'college') {
      return res.status(403).json({ error: 'Only college accounts can access this' });
    }
  console.log(user.id);
    // Get the college admin profile
    const collegeAdmin = await CollegeAdmin.findOne({ college: user.id });
    if (!collegeAdmin) {
      return res.status(405).json({ error: 'College admin profile not found' });
    }

    // Find all admin-forwarded shortlists for this college
    const forwardedStudents = await Shortlist.find({ 
      college: collegeAdmin._id, 
      isAdminForwarded: true 
    })
    .populate('student', '-password') // Get full student info
    .populate('college', 'name email') // Get college info
    .sort({ createdAt: -1 });

    const studentsData = forwardedStudents.map(shortlist => ({
      id: shortlist.student._id,
      name: `${shortlist.student.firstName} ${shortlist.student.lastName}`,
      email: shortlist.student.email,
      phone: shortlist.student.phone,
      dateOfBirth: shortlist.student.dateOfBirth,
      education: shortlist.student.education,
      interestedCourses: shortlist.interestedCourses,
      notes: shortlist.notes,
      forwardedAt: shortlist.createdAt,
      college: shortlist.college
    }));

    res.json({ students: studentsData });
  } catch (error) {
    console.error("Error fetching forwarded students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  listCollegeAdmins,
  createCollegeAdmin,
  getCollegeAdmin,
  updateCollegeAdmin,
  deleteCollegeAdmin,
  getMyCollegeAdmin,
  getForwardedStudents,
};
