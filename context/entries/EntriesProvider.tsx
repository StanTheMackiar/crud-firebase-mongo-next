import { FC, PropsWithChildren, useEffect, useReducer, useState } from 'react'

import { useSnackbar } from 'notistack';
import axios from 'axios';

import { entriesApi } from '../../api';
import { Entry } from '../../interfaces';
import { EntriesContext,  entriesReducer } from './';
import { toBase64 } from '../../utils';
import { UploadImageData } from '../../pages/api/storage/image';
import { controller } from '../../api/entriesApi';
import { DeleteImageData } from '../../pages/api/storage/image/[name]';

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

   const uploadImage = async( image: File, userId: String ) => {

          try { 
               const base64Image = await toBase64( image )
               console.log({base64Image})

               const abortTimeOut = setTimeout(() => controller.abort(), 20000)
               const { data } = await entriesApi.post<UploadImageData>('storage/image', { image: base64Image, userId } )
               clearTimeout(abortTimeOut)
         
               enqueueSnackbar('Image successfully uploaded', {
                    variant: 'success',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                         vertical: 'top',
                         horizontal: 'right'
                    }
                  })

               return data.url!

          } catch (err: any) {
               if(err.name === 'CanceledError') {
                    enqueueSnackbar('Time out exceeded', {
                         variant: 'error',
                         autoHideDuration: 1500,
                         anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'right'
                         }
                    })

                    throw new Error('Time out exceeded')
               }


               if(axios.isAxiosError(err)){
                    if ( err.response?.data === "Body exceeded 1mb limit" ) {
                         enqueueSnackbar("Image can't exceeded 1mb limit", {
                              variant: 'error',
                              autoHideDuration: 1500,
                              anchorOrigin: {
                                   vertical: 'top',
                                   horizontal: 'right'
                              }
                         })

                         throw new Error( err.response.data )
                    } 
               }

               enqueueSnackbar('Error uploading image', {
                    variant: 'error',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                         vertical: 'top',
                         horizontal: 'right'
                    }
               })
               throw new Error('Internal server error')
          }
   }

   const addNewEntry = async( description: string, imageUrl?: string ) => {
        try {
             const { data } = await entriesApi.post<Entry>('/entries', { description, imageUrl })

             dispatch({ type: 'Entry - Add', payload: data })

             enqueueSnackbar('Entry added', {
               variant: 'success',
               autoHideDuration: 1500,
               anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
               }
             })

             return data

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
               throw new Error('Server error')
        }  
   }

   const updateEntry = async( { _id, description, status, image }: Entry, showSnackbar: boolean = false ) => {

        try {

             const { data } = await entriesApi.put<Entry>(`/entries/${ _id }`, { description, status, image });
          

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

             return data

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

   const deleteImage = async( id: string ) => {

     const newState = state.entries.map(entry => entry._id === id ? { ...entry, image: "" } : entry ) 
     const entryWithoutImage = newState.find(entry => entry._id === id)

     console.log({newState})
     console.log({entryWithoutImage})

     try {
          await entriesApi.delete<DeleteImageData>(`/storage/image/${id}`)

          dispatch({type: 'Entry - Delete-Image', payload: newState });

          enqueueSnackbar('Image deleted successfully', {
               variant: 'info',
               autoHideDuration: 1500,
               anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
               }
          })

          return entryWithoutImage

     } catch (error) {
          console.log(error)
          enqueueSnackbar('Delete image failure', {
               variant: 'error',
               autoHideDuration: 1500,
               anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
               }
          })
     }
   }


   const refreshEntries = async( showLoader = true ) => {
     try {
        if(showLoader) setLoader(true)
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
         deleteImage,
         updateEntry,
         uploadImage,
       }}>
          { children }
       </EntriesContext.Provider>
   )
};