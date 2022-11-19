import { UIState } from './';


type UIActionType = 
    | { type: 'UI - Toggle Adding Entry State', payload: boolean }
    | { type: 'UI - Toggle Dragging', payload: boolean }


export const uiReducer = ( state: UIState, action: UIActionType): UIState => {

   switch (action.type) {
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

