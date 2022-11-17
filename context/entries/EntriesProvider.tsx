import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import { entriesApi } from '../../apis';
import { Entry } from '../../interfaces';

import { EntriesContext,  entriesReducer } from './';

export interface EntriesState {
    entries: Entry[],
}


const Entries_INITIAL_STATE: EntriesState = {
    entries: [],
}


export const EntriesProvider: FC<PropsWithChildren> = ({ children }) => {

   const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE)


   const addNewEntry = async( description: string ) => {

        // const newEntry: Entry = {
        //     _id: uuidv4(),
        //     description,
        //     createdAt: Date.now(),
        //     status: 'pending'
        // }

        const { data } = await entriesApi.post<Entry>('/entries', { description })

        dispatch({ type: 'Entry - Add', payload: data })

   }

   const updateEntry = async( { _id, description, status }: Entry ) => {
        try {
             const { data } = await entriesApi.put<Entry>(`/entries/${ _id }`, { description, status });
             dispatch({type: 'Entry - Update', payload: data });
          
        } catch (error) {
            console.log({ error })
        }


   }


   const refreshEntries = async() => {
        const { data } = await entriesApi.get<Entry[]>('/entries');
        dispatch( { type: "Entry - Refresh-Data", payload: data })

   }

   useEffect(() => {
        refreshEntries();
   }, []);

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