import { createContext } from 'react';


interface ContextProps {
    isAddingEntry: boolean,
    sidemenuOpen: boolean,
    isDragging: boolean,


    closeSideMenu?: () => void,
    openSideMenu?: () => void,
    setIsAddingEntry: (value: boolean) => void,
    toggleDragging: (value: boolean) => void,
}


export const UIContext = createContext({} as ContextProps);