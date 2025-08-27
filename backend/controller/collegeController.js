import CollegeAdmin from '../model/CollegeAdmin.js';



export const getAllColleges = async (req, res) => {
  try {
    // fetch college admins and include the referenced College document when available
    const admins = await CollegeAdmin.find().populate('college').lean();

    const data = admins.map(a => {
      // Prefer address from the admin profile if present, fallback to linked college address
      const rawAddr = (a.profile && a.profile.address) || (a.college && a.college.address) || '';
      let addressStr = '';
      let city = '';
      let state = '';
      if (!rawAddr) {
        addressStr = '';
      } else if (typeof rawAddr === 'string') {
        addressStr = rawAddr;
        const parts = addressStr.split(',').map(s => s.trim()).filter(Boolean);
        city = parts.length > 0 ? parts[0] : '';
        state = parts.length > 1 ? parts[1] : (parts[0] || '');
      } else if (typeof rawAddr === 'object') {
        addressStr = [rawAddr.line1, rawAddr.city, rawAddr.state, rawAddr.pincode, rawAddr.country].filter(Boolean).join(', ');
        city = rawAddr.city || '';
        state = rawAddr.state || '';
      }

      const course = (Array.isArray(a.courses) && a.courses.length) ? a.courses[0].name : 'Various Programs';

      return {
        // return the admin id as the primary id (frontend can use `collegeId` if it needs the linked college)
        id: a._id.toString(),
        collegeId: (a.college && a.college._id) ? a.college._id.toString() : null,
        name: a.name || (a.college && a.college.name) || 'Unnamed College',
        email: a.email || (a.college && a.college.email) || '',
        address: addressStr,
        city,
        state,
        contactNumber: a.contactNumber || (a.profile && a.profile.contact && a.profile.contact.primaryPhone) || (a.college && a.college.contactNumber) || '',
        logo: a.logo && a.logo.url ? a.logo.url : (a.college && a.college.logo) ? a.college.logo : null,
        coverPhoto: a.coverPhoto && a.coverPhoto.url ? a.coverPhoto.url : null,
        courses: Array.isArray(a.courses) ? a.courses.map(c => c.name) : [],
        createdAt: a.createdAt
      };
    });

    return res.json({ data });
  } catch (err) {
    console.error('getAllColleges error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default { getAllColleges };
