import College from '../model/College.js';
import CollegeAdmin from '../model/CollegeAdmin.js';
import Shortlist from '../model/Shortlist.js';

export const getRegisteredColleges = async (req, res) => {
  try{
    const colleges = await College.find().select('-password -__v').lean();
    return res.json({data: colleges});
  }
  catch(err){
    console.error('getRegisteredColleges error', err);
    return res.status(500).json({error: 'Server error'});
  }
}
export const getAllColleges = async (req, res) => {
  try {
    // fetch college admins and include the referenced College document when available
    const admins = await CollegeAdmin.find().populate('college').lean();

    // Aggregate interested courses from shortlists so admin listing can show student-selected courses
    const agg = await Shortlist.aggregate([
      { $unwind: { path: '$interestedCourses', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$college', courses: { $addToSet: '$interestedCourses.name' } } }
    ]);
    const shortlistMap = Object.fromEntries(agg.map(x => [String(x._id), Array.isArray(x.courses) ? x.courses.filter(Boolean) : []]));

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
  // Merge courses declared by the college admin with courses students selected in shortlists
  courses: Array.from(new Set([...(Array.isArray(a.courses) ? a.courses.map(c => c.name) : []), ...(shortlistMap[a._id?.toString?.() || a._id] || [])])).filter(Boolean),
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
