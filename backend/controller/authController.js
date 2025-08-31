import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import College from '../model/College.js';
import Admin from '../model/Admin.js';

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Student registration (already existing register flow but placed here)
export const registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, dateOfBirth, education } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !dateOfBirth || !education)
      return res.status(400).json({ error: 'Please fill all the fields' });

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword, dateOfBirth, phone, education });
    await user.save();
    return res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Generic login helper
const doLogin = async (Model, identifier, passwordField = 'password') => {
  const entity = await Model.findOne({ email: identifier });
  if (!entity) return { error: 'Invalid credentials' };
  const isCorrect = await bcrypt.compare(passwordField, entity.password);
  // Note: called by controllers will pass correct password string; this function currently takes raw password in second arg
  return { entity, isCorrect };
};

// Student login
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Please enter all fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) return res.status(401).json({ error: 'Invalid credentials' });

    const token = createToken({ id: user._id, role: user.role, email: user.email });
    return res.status(200).json({ message: 'Logged in', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// College registration (optional) and login
export const registerCollege = async (req, res) => {
  try {
    const { instituteCode, email, password, name, contactNumber } = req.body;
    console.log({ instituteCode, email, password, name, contactNumber });
    // Validate required fields (name is required by the College model)
    if (!instituteCode || !email || !password || !name) {
      return res.status(400).json({ error: 'Please fill all required fields: instituteCode, name, email, password' });
    }

    const exists = await College.findOne({ email });
    if (exists) return res.status(400).json({ error: 'College already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const college = new College({ instituteCode, name, email, password: hashed, contactNumber });
    await college.save();
    return res.status(201).json({ message: 'College registered' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const loginCollege = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Pslease enter all fields' });
    const college = await College.findOne({ email });
    if (!college) return res.status(401).json({ error: 'Invalid credentials' });
    const isCorrect = await bcrypt.compare(password, college.password);
    if (!isCorrect) return res.status(401).json({ error: 'Invalid credentials' });
    const token = createToken({ id: college._id, role: 'college', email: college.email });
    return res.status(200).json({ message: 'College logged in', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Admin registration (optional) and login
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // if (!name || !email || !password) return res.status(400).json({ error: 'Please fill all required fields' });
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Admin already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashed });
    await admin.save();
    return res.status(201).json({ message: 'Admin registered' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Please enter all fields' });
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const isCorrect = await bcrypt.compare(password, admin.password);
    if (!isCorrect) return res.status(401).json({ error: 'Invalid credentials' });
    const token = createToken({ id: admin._id, role: 'admin', email: admin.email });
    return res.status(200).json({ message: 'Admin logged in', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
