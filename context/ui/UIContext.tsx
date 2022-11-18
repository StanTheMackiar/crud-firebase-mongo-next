import { createContext } from 'react';


interface ContextProps {
    isAddingEntry: boolean,
    isDragging: boolean,


    setIsAddingEntry: (value: boolean) => void,
    toggleDragging: (value: boolean) => void,
}


export const UIContext = createContext({} as ContextProps);