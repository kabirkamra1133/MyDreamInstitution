import axios from "axios";
import React, { createContext, useContext } from "react";
interface contextType{
    getAllColleges : ()=>Promise<unknown[]>
    // uploadImage accepts a File and returns the uploaded image URL
    uploadImage : (file: File)=>Promise<string>
}
const CollegeContext = createContext<contextType|null>(null);
const CollegeProvider : React.FC<{children : React.ReactNode}> = ({children})=>{
    const getAllColleges = async()=>{
        return [];
    }
    const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // match backend multer limit (5MB)
    const uploadImage = async(file: File) : Promise<string>=>{
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        // check file size and fail fast to avoid backend multer 500 HTML response
        if (file.size > MAX_UPLOAD_SIZE) {
            throw new Error('File too large. Maximum allowed size is 5MB. Please resize or choose a smaller file.');
        }
        const formData = new FormData();
        formData.append("file", file);

        if (cloudName) {
            // Try Cloudinary first
            try{
                formData.append("upload_preset", uploadPreset);
                const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                const res = await axios.post(url, formData);
                return res?.data?.secure_url || '';
            }catch(err){
                console.warn('Cloudinary upload failed, falling back to backend upload', err);
                // continue to backend fallback
            }
        } else {
            console.warn('VITE_CLOUDINARY_CLOUD_NAME not set, using backend upload fallback');
        }

        // Backend fallback: send file to local server which stores it under /uploads
        try{
            const res = await axios.post('/api/college-admins/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return res?.data?.url || '';
        }catch(err: unknown){
            console.error('Backend upload failed', err);
            let msg = String(err);
            try{
                const maybe = err as unknown;
                if (typeof maybe === 'object' && maybe !== null) {
                    
                    if ('response' in maybe && (maybe as any).response && 'data' in (maybe as any).response) {
                        msg = (maybe as any).response.data;
                    } else if ('message' in maybe && typeof (maybe as any).message === 'string') {
                   
                        msg = (maybe as any).message;
                    }
                }
            }catch(e){ /* fall back to String(err) */ }
            throw new Error(typeof msg === 'string' ? msg : 'Upload failed');
        }
    }
    
    const value = {
        getAllColleges,
        uploadImage
    }
    return <CollegeContext.Provider value={value}>
        {children}
    </CollegeContext.Provider>
}
export const useCollege  = () : contextType=>{
        const context  = useContext(CollegeContext);
        if(!context) throw Error("Something went wrong");
        return context;
}
export default CollegeProvider;
