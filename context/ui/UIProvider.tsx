import { FC, PropsWithChildren, useReducer } from 'react'
import { UIContext,  uiReducer } from './';

export interface UIState {
    sidemenuOpen: boolean,
    isAddingEntry: boolean,
    isDragging: boolean,
}


const UI_INITIAL_STATE: UIState = {
    sidemenuOpen: false,
    isAddingEntry: false,
    isDragging: false,
}


export const UIProvider: FC<PropsWithChildren> = ({ children }) => {

   const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

   const openSideMenu = () => dispatch({ type: 'UI - Open Sidebar' });

   const closeSideMenu = () => dispatch({ type: 'UI - Close Sidebar' })

   const setIsAddingEntry = (value: boolean) => dispatch({ type:'UI - Toggle Adding Entry State', payload: value})

   const toggleDragging = (value: boolean) => dispatch({type: 'UI - Toggle Dragging', payload: value})
 
   return (
       <UIContext.Provider value={{
            ...state,

            closeSideMenu,
            openSideMenu,
            setIsAddingEntry,
            toggleDragging,
       }}>
          { children }
       </UIContext.Provider>
   )
};