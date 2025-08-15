import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { configDotenv } from 'dotenv';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
configDotenv();
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.log('Error connecting to MongoDB:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});