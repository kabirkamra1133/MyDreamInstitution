import { createContext, useContext } from "react";
interface studentContextType{
    getAllStudents : Promise<unknown[]>
} 
const studentContext = createContext<studentContextType | null>(null);
const StudentContextProvider : React.FC<{children : React.ReactNode}> = ({children})=>{
    const getAllStudents = async() =>{
        return [];
    }
    const value = {
        getAllStudents : getAllStudents()
    }
    return <studentContext.Provider value={value}>
        {children}
    </studentContext.Provider>
}   
export default StudentContextProvider;
//eslint-disable-next-line
export const useStudents = () : studentContextType =>{
        const context = useContext(studentContext);
        if(!context) throw new Error("This doesnt work");
        return context;
}