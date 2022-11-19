import { useSnackbar } from 'notistack';
import { FC, PropsWithChildren, useEffect, useReducer, useState } from 'react'
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
   const { enqueueSnackbar } = useSnackbar()
   const [loader, setLoader] = useState(false);
   const [error, setError] = useState(false)

   const addNewEntry = async( description: string ) => {

        // const newEntry: Entry = {
        //     _id: uuidv4(),
        //     description,
        //     createdAt: Date.now(),
        //     status: 'pending'
        // }

        const { data } = await entriesApi.post<Entry>('/entries', { description })

        dispatch({ type: 'Entry - Add', payload: data })

        enqueueSnackbar('Entry added', {
          variant: 'success',
          autoHideDuration: 1500,
          anchorOrigin: {
               vertical: 'top',
               horizontal: 'right'
          }
        })

   }

   const updateEntry = async( { _id, description, status }: Entry, showSnackbar: boolean = false ) => {
        try {
             const { data } = await entriesApi.put<Entry>(`/entries/${ _id }`, { description, status });
             dispatch({type: 'Entry - Update-Entry', payload: data });


             if ( showSnackbar ) {
                  enqueueSnackbar('Entry updated', {
                    variant: 'success',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                         vertical: 'top',
                         horizontal: 'right'
                    }
                  })
             }
          
        } catch (error) {
            console.log({ error })
        }
   }

   const deleteEntry = async({ _id }: Entry) => {
          try {
               const { data } = await entriesApi.delete<Entry>(`/entries/${ _id }`);
               dispatch({ type: 'Entry - Delete-Entry', payload: data })

               enqueueSnackbar('Entry deleted', {
                    variant: 'info',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                         vertical: 'top',
                         horizontal: 'right'
                    }
               })

          } catch (error) {
               console.log(error)
          }
   }


   const refreshEntries = async() => {
     try {
        setLoader(true)  
        const { data } = await entriesApi.get<Entry[]>('/entries');
        dispatch( { type: "Entry - Refresh-Data", payload: data })
        setLoader(false)
     } catch (error) {
          console.log(error)
          setLoader(false)
          setError(true)
     }
        

   }

   useEffect(() => {
        refreshEntries();
   }, []);

   return (
       <EntriesContext.Provider value={{
         ...state,
         error,
         loader,
         addNewEntry,
         deleteEntry,
         updateEntry,
       }}>
          { children }
       </EntriesContext.Provider>
   )
};