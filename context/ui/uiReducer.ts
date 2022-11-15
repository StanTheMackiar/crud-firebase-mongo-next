import { UIState } from './';


type UIActionType = 
    | { type: 'UI - Open Sidebar' }
    | { type: 'UI - Close Sidebar' }
    | { type: 'UI - Toggle Adding Entry State', payload: boolean }
    | { type: 'UI - Toggle Dragging', payload: boolean }


export const uiReducer = ( state: UIState, action: UIActionType): UIState => {

   switch (action.type) {
       case 'UI - Open Sidebar':
           return {
               ...state,
               sidemenuOpen: true,
           }

       case 'UI - Close Sidebar':
           return {
               ...state,
               sidemenuOpen: false,
           }

        case 'UI - Toggle Adding Entry State':
            return {
                ...state,
                isAddingEntry: action.payload,
            }
        case 'UI - Toggle Dragging':
            return {
                ...state,
                isDragging: action.payload,
            }

       default:
           return state;
}
}

