import User from "../model/User.js";
import Shortlist from "../model/Shortlist.js";
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

// Get complete student information by ID with role-based access
export const getStudentInfo = async(req, res) => {
    try {
        const { studentId } = req.params;
        
        // Role-based access control
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
        
        // Fetch student basic info with all fields except password
        const student = await User.findById(studentId).select('-password');
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        // Ensure this is actually a student
        if (student.role !== 'student') {
            return res.status(400).json({ message: "Requested user is not a student" });
        }
        
        // Return complete student information
        res.json({ 
            success: true,
            student: {
                id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                fullName: `${student.firstName} ${student.lastName}`,
                email: student.email,
                phone: student.phone,
                dateOfBirth: student.dateOfBirth,
                education: student.education,
                role: student.role,
                createdAt: student.createdAt,
                // Include finalization fields if they exist
                mainCourse: student.mainCourse,
                subCourse: student.subCourse,
                collegeFinalized: student.collegeFinalized,
                courseFinalized: student.courseFinalized,
                counselor: student.counselor
            }
        });
    } catch (error) {
        console.error("Error fetching student info:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get detailed student information including course selections
export const getStudentDetails = async(req, res) => {
    try {
        const { studentId } = req.params;
        
        // Fetch student basic info
        const student = await User.findById(studentId).select('-password');
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        // Fetch student's shortlisted courses/colleges
        const shortlists = await Shortlist.find({ student: studentId })
            .populate('college'); // CollegeAdmin model
        
        // Combine data
        const studentDetails = {
            ...student.toObject(),
            courseSelections: shortlists.map(shortlist => ({
                college: {
                    _id: shortlist.college._id,
                    name: shortlist.college.name || 'Unknown College'
                },
                courses: shortlist.interestedCourses.map(course => `${course.parent} - ${course.name}`),
                applicationStatus: 'Applied',
                notes: shortlist.notes,
                addedAt: shortlist.createdAt
            }))
        };
        
        res.json(studentDetails);
    } catch (error) {
        console.error("Error fetching student details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Update student finalization status
export const finalizeStudent = async(req, res) => {
    try {
        const { studentId } = req.params;
        const { field, value } = req.body;
        
        if (!['college', 'course'].includes(field)) {
            return res.status(400).json({ message: "Invalid field. Must be 'college' or 'course'" });
        }
        
        const updateField = field === 'college' ? 'collegeFinalized' : 'courseFinalized';
        
        const updatedStudent = await User.findByIdAndUpdate(
            studentId,
            { [updateField]: value },
            { new: true }
        ).select('-password');
        
        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        res.json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error finalizing student:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Forward student information to college
export const forwardStudentToCollege = async(req, res) => {
    try {
        const { studentId, collegeId, courses, notes } = req.body;
        
        // Verify student exists
        const student = await User.findById(studentId).select('-password');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        // Check if this student-college combination already exists
        const existingShortlist = await Shortlist.findOne({
            student: studentId,
            college: collegeId
        });
        
        const adminNotes = `Admin forwarded: ${notes || 'No additional notes'}`;
        const coursesData = courses.map(course => ({ parent: 'Admin Forwarded', name: course }));
        
        if (existingShortlist) {
            // Update existing record to mark it as admin forwarded
            existingShortlist.isAdminForwarded = true;
            existingShortlist.notes = adminNotes;
            existingShortlist.interestedCourses = coursesData;
            await existingShortlist.save();
            
            res.json({ 
                message: "Student record updated and forwarded successfully", 
                forwarded: {
                    student: student,
                    college: collegeId,
                    courses: courses,
                    notes: notes
                },
                updated: true
            });
        } else {
            // Create new forwarded student record
            const forwardedStudent = new Shortlist({
                student: studentId,
                college: collegeId,
                interestedCourses: coursesData,
                notes: adminNotes,
                isAdminForwarded: true
            });
            
            await forwardedStudent.save();
            
            res.json({ 
                message: "Student forwarded successfully", 
                forwarded: {
                    student: student,
                    college: collegeId,
                    courses: courses,
                    notes: notes
                },
                updated: false
            });
        }
    } catch (error) {
        console.error("Error forwarding student:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Deprecated: student registration and login moved to authController. Keep a simple verify endpoint
export const verifyToken = async(req,res)=>{
    const email = req.user?.email;
    return res.json({message:"Token valid", email, role: req.user?.role});
}

export default { getAllUsers, getStudentDetails, getStudentInfo, finalizeStudent, forwardStudentToCollege, verifyToken };