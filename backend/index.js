import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import collegeAdminRoutes from './routes/collegeAdminRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
const app = express();
app.use(cors());
app.use(express.json());
// serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
configDotenv();
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.log('Error connecting to MongoDB:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/college-admins', collegeAdminRoutes);
app.use('/api/colleges', collegeRoutes);

// Error handler (must be after routes)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err && err.stack ? err.stack : err);
    // Multer file size / upload errors
    // Prefer specific status codes for upload size
    if (err && (err instanceof multer.MulterError || err.code === 'LIMIT_FILE_SIZE')) {
        return res.status(413).json({ error: 'File too large. Maximum allowed size is 5MB.' });
    }
    // other errors
    const message = (err && err.message) ? err.message : 'Server error';
    return res.status(500).json({ error: message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});