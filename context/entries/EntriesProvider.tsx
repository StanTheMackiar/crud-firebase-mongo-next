import { FC, PropsWithChildren, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Entry } from '../../interfaces';

import { EntriesContext,  entriesReducer } from './';

export interface EntriesState {
    entries: Entry[],
}


const Entries_INITIAL_STATE: EntriesState = {
    entries: [
        {
            _id: uuidv4(),
            description: 'Pendiente: Descripcion de una entrada 1',
            status: 'pending',
            createdAt: Date.now(),
        },
        {
            _id: uuidv4(),
            description: 'En progreso: Descripcion de una entrada 2',
            status: 'in-progress',
            createdAt: Date.now() - 1000000,
        },
        {
            _id: uuidv4(),
            description: 'Finalizada: Descripcion de una entrada 3',
            status: 'finished',
            createdAt: Date.now() - 100000,
        },
        
    ],
}


export const EntriesProvider: FC<PropsWithChildren> = ({ children }) => {

   const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE)


   const addNewEntry = ( description: string ) => {

        const newEntry: Entry = {
            _id: uuidv4(),
            description,
            createdAt: Date.now(),
            status: 'pending'
        }

        dispatch({ type: 'Entry - Add', payload: newEntry })

   }

   const updateEntry = ( entry: Entry ) => {

        dispatch({type: 'Entry - Update', payload: entry })
   }

   return (
       <EntriesContext.Provider value={{
         ...state,

         addNewEntry,
         updateEntry,
       }}>
          { children }
       </EntriesContext.Provider>
   )
};