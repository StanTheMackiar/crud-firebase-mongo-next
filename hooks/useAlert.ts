import { useState } from "react";

export const useAlert = () => {

    const [ isOpenAlert, setIsOpenAlert ] = useState(false);

    const toggleAlert = () => setIsOpenAlert(prev => !prev) 
    
    return { isOpenAlert, toggleAlert }
    
}