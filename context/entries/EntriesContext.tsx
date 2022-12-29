import { createContext } from 'react';
import { Entry } from '../../interfaces';
import { UploadImageData } from '../../pages/api/storage/image';


interface ContextProps {
    entries: Entry[];
    error: boolean,
    loader: boolean;

    addNewEntry: (description: string, imageUrl?: string) => Promise<Entry | undefined>
    deleteEntry: (entry: Entry) => Promise<void>;
    deleteImage: (name: string) => Promise<UploadImageData | undefined>
    updateEntry: (entry: Entry, showSnackbar?: boolean) => Promise<void>,
    uploadImage: (image: File, userId: String) => Promise<string>,
}


export const  EntriesContext = createContext({} as ContextProps);



