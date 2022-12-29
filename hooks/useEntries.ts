import axios from "axios"
import { useRouter } from "next/router"
import { useContext, useState, useMemo, ChangeEvent } from "react"
import { EntriesContext } from "../context/entries"
import { Entry, EntryStatus } from "../interfaces"

interface Params {
    entry: Entry
}

export const useEntries = ({ entry }: Params ) => {

    const router = useRouter()
    const [ imageFile, setImageFile ] = useState<File | null>(null)
    const [ openAlert, setOpenAlert ] = useState(false); 
    const { updateEntry, uploadImage, deleteImage } = useContext( EntriesContext )
    const [ isLoading, setIsLoading ] = useState(false);
    const [ inputValue, setInputValue ] = useState( entry.description )
    const [ status, setStatus ] = useState<EntryStatus>( entry.status );
    const [ touched, setTouched ] = useState(false);

    const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched])

    const onSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
    
        if( !file?.type.startsWith('image') ) {
          setOpenAlert(true);
          return;
        }
        console.log({file})
        setImageFile(file);
      } 
    
    const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)

    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => setStatus( e.target.value as EntryStatus );

    const onSave = async() => {
        if ( inputValue.trim().length === 0 ) return;

        setIsLoading(true);

        const updatedEntry: Entry = {
            ...entry,
            status,
            description: inputValue,
        }

        console.log({imageFile})
        if (!imageFile) {
            console.log('No se detecto imagen')
            await updateEntry( updatedEntry, true );
            setIsLoading(false);
            router.push('/');
            return;
        }   
        try {

            const imageUrl = await uploadImage(imageFile, updatedEntry._id);
            updatedEntry.image = imageUrl;
            console.log({updatedEntry})

            await updateEntry( updatedEntry, true );
            router.push('/');

        } catch (err) {
            console.log(err)

        } finally {
            setIsLoading(false);
        }
    }


   return {
        imageFile,
        inputValue,
        isLoading,
        isNotValid,
        openAlert,
        status,

        onInputValueChange,
        onSave,
        onStatusChange,
        onSelectImage,
        setTouched,
    }
}