
import axios from "axios";
import React, { createContext, useContext } from "react";
import { useMainContext } from "./mainContext";

interface contextType{
    getAllColleges : ()=>Promise<Record<string, unknown>[]>
    getRegisteredColleges : ()=>Promise<Record<string, unknown>[]>
    // uploadImage accepts a File and returns the uploaded image URL
    uploadImage : (file: File)=>Promise<string>
    saveCollegeData: (data: { instituteCode?: string; name?: string; email: string; password: string; contactNumber?: string }) => Promise<Record<string, unknown>>
}
const CollegeContext = createContext<contextType|null>(null);
const CollegeProvider : React.FC<{children : React.ReactNode}> = ({children})=>{
    const { server } = useMainContext();
    
    const getAllColleges = async()=>{
        try{
            const res = await axios.get(`${server}/api/colleges`);
            // backend returns { data: [...] }
            return Array.isArray(res?.data?.data) ? res.data.data : [];
        }catch(err){
            console.error('getAllColleges failed', err);
            return [];
        }
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
            const res = await axios.post(`${server}/api/college-admins/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return res?.data?.url || '';
        }catch(err: unknown){
            console.error('Backend upload failed', err);
            let msg = String(err);
            try{
                const maybe = err as unknown;
                if (typeof maybe === 'object' && maybe !== null) {
                    //eslint-disable-next-line
                    if ('response' in maybe && (maybe as any).response && 'data' in (maybe as any).response) {
                        //eslint-disable-next-line
                        msg = (maybe as any).response.data;
                        //eslint-disable-next-line
                    } else if ('message' in maybe && typeof (maybe as any).message === 'string') {
                       //eslint-disable-next-line
                        msg = (maybe as any).message;
                    }
                }
            }catch{ /* fall back to String(err) */ }
            throw new Error(typeof msg === 'string' ? msg : 'Upload failed');
        }
    }
    const saveCollegeData = async(data : { instituteCode?: string; name?: string; email: string; password: string; contactNumber?: string })=>{
        try{
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const headers: Record<string,string> = {};
            if(token) headers.Authorization = `Bearer ${token}`;
            const res = await axios.post(`${server}/api/auth/college/register`, data, { headers });
            return res.data;
        }catch(err){
            console.error('saveCollegeData failed', err);
            // rethrow so callers can show an error
            throw err;
        }
    }
    const getRegisteredColleges = async()=>{
        try{
            // Use the admin-facing colleges endpoint which merges college-admin declared
            // courses with student-selected courses from shortlists.
            const res = await axios.get(`${server}/api/colleges`);
            // backend returns { data: [...] }
            return Array.isArray(res?.data?.data) ? res.data.data : [];
        }
        catch(err){
            console.error('getRegisteredColleges failed', err);
            return [];
        }
    }

    const value = {
        getAllColleges,
        getRegisteredColleges,
        uploadImage,
        saveCollegeData
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
