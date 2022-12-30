import { useRef } from "react";

export const useFileInputRef = () => {
    
    const fileInput = useRef<HTMLInputElement>(null);

    return { fileInput }

}