import { FC, PropsWithChildren, useReducer } from 'react'
import { UIContext,  uiReducer } from './';

export interface UIState {
    sidemenuOpen: boolean,


}


const UI_INITIAL_STATE: UIState = {
    sidemenuOpen: false,
}


export const UIProvider: FC<PropsWithChildren> = ({ children }) => {

   const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

   const openSideMenu = () => dispatch({ type: 'UI - Open Sidebar' });

   const closeSideMenu = () => dispatch({ type: 'UI - Close Sidebar' })

 
   return (
       <UIContext.Provider value={{
            ...state,

            closeSideMenu,
            openSideMenu,
       }}>
          { children }
       </UIContext.Provider>
   )
};