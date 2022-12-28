import { createContext } from 'react';
import { Entry } from '../../interfaces';


interface ContextProps {
    entries: Entry[];
    error: boolean,
    loader: boolean;

    addNewEntry: (description: string, file?: File) => Promise<void>,
    updateEntry: (entry: Entry, showSnackbar?: boolean) => Promise<void>,
    uploadImage: (imageFile: File) => Promise<void>,
    deleteEntry: (entry: Entry) => Promise<void>;
}


export const  EntriesContext = createContext({} as ContextProps);



