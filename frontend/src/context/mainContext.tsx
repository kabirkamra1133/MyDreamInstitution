import { createContext, useContext } from "react"

interface contextType{
    server : string
}
const mainContext = createContext<contextType | undefined>(undefined);
const MainContextProvider:React.FC<{children:React.ReactNode}> = ({children})=>{
    const value = {
        server : "http://localhost:3000"
    }
    return <mainContext.Provider value={value}>
        {children}
    </mainContext.Provider>
}
//eslint-disable-next-line
export const useMainContext = () : contextType=>{
    const context = useContext(mainContext);

    if (!context) {
        throw new Error("useMainContext must be used within a MainContextProvider");
    }

    return context;
}
export default MainContextProvider;