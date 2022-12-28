import { useSnackbar } from 'notistack';
import { FC, PropsWithChildren, useEffect, useReducer, useState } from 'react'
import { entriesApi } from '../../api';
import { Entry } from '../../interfaces';

import { EntriesContext,  entriesReducer } from './';
import { uploadImageApi } from '../../api/upload';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase/firebase';
import { toBase64 } from '../../utils';

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

   const uploadImage = async( image: File ) => {

          try { 
               const base64Image = await toBase64( image )
               await entriesApi.post('images/upload', { image: base64Image })
  
               enqueueSnackbar('Image successfully uploaded', {
                    variant: 'success',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                         vertical: 'top',
                         horizontal: 'right'
                    }
                  })
          } catch (error) {
               enqueueSnackbar('Upload image process failed :(', {
                    variant: 'error',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                         vertical: 'top',
                         horizontal: 'right'
                    }
               })
          }
   }

   const addNewEntry = async( description: string ) => {

        try {
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
        } catch (error) {
               console.log(error)
               enqueueSnackbar('Server error', {
                    variant: 'error',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                         vertical: 'top',
                         horizontal: 'right'
                    }
               })
        }  
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
            enqueueSnackbar('Server error', {
               variant: 'error',
               autoHideDuration: 1500,
               anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
               }
          })
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

               enqueueSnackbar('Server error', {
                    variant: 'error',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                         vertical: 'top',
                         horizontal: 'right'
                    }
               })
          }
   }


   const refreshEntries = async() => {
     try {
        setLoader(true)
        const { data } = await entriesApi.get<Entry[]>('/entries');
        dispatch({ type: "Entry - Refresh-Data", payload: data })
        setLoader(false)
     } catch (error) {
          console.log({error})
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
         uploadImage,
       }}>
          { children }
       </EntriesContext.Provider>
   )
};