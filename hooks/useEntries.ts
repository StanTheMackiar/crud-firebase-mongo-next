import { useRouter } from "next/router"
import { useContext, useState, useMemo, ChangeEvent, useReducer, useRef } from "react"
import { EntriesContext } from "../context/entries"
import { Entry, EntryStatus } from "../interfaces"
import { useAlert } from "./useAlert"
import { MAX_FILE_SIZE } from '../utils/const';

interface Params {
    serverEntry: Entry
}

export const useEntries = ({ serverEntry }: Params ) => {

    const invalidFileAlert = useAlert();
    const invalidFileSizeAlert = useAlert();
    const deleteEntryAlert = useAlert();
    const deleteImageAlert = useAlert();
    
    const router = useRouter()
    const [ entry, setEntry ] = useState( serverEntry );
    const [ imageFile, setImageFile ] = useState<File | null>(null)
    const { updateEntry, uploadImage, deleteImage, deleteEntry } = useContext( EntriesContext )
    const [ isLoading, setIsLoading ] = useState(false);
    const [ inputValue, setInputValue ] = useState( entry.description )
    const [ status, setStatus ] = useState<EntryStatus>( entry.status );
    const [ touched, setTouched ] = useState(false);

    const tempImageUrl = useRef<string | null>(null)

    const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched])

    const onSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log({file})

        if( !file?.type.startsWith('image') ) {
            invalidFileAlert.toggleAlert();
            return;
        }

        if ( file?.size > MAX_FILE_SIZE ) {
            invalidFileSizeAlert.toggleAlert();
            return;
        }

        tempImageUrl.current = URL.createObjectURL(file)
        setEntry({
            ...entry,
            image: tempImageUrl.current,
        })
        setImageFile(file);
      } 
    
    const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)

    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => setStatus( e.target.value as EntryStatus );

    const onCancel = () => {
        router.push('/')
    }

    const onSave = async() => {
        if ( inputValue.trim().length === 0 ) return;

        setIsLoading(true);

        const updatedEntry: Entry = {
            ...entry,
            status,
            description: inputValue,
        }

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
            URL.revokeObjectURL(tempImageUrl.current!)
            setIsLoading(false);
        }
    }

    const onDeleteEntry = async() => {
        try {
            if (entry.image) await deleteImage( entry._id );
            await deleteEntry( entry );
            router.push("/");
        } catch (err) {
            console.log(err);
        }
    }

    const deleteTempImage = () => {
        setEntry({ ...entry, image: "" });
        setImageFile(null);
        tempImageUrl.current = null;
        URL.revokeObjectURL(tempImageUrl.current!)
    }

    const onDeleteImage = async() => {

        try {
            const entryWithoutImage = await deleteImage( serverEntry._id );
            if (entryWithoutImage) {
                await updateEntry(entryWithoutImage!, true);
                setEntry(entryWithoutImage);
            }
        } catch (err) {
            console.log(err);
        } finally {
            deleteImageAlert.toggleAlert();
        }
        
    }


   return {
        deleteEntryAlert,
        deleteImageAlert,
        deleteTempImage,
        entry,
        imageFile,
        inputValue,
        invalidFileAlert,
        invalidFileSizeAlert,
        isLoading,
        isNotValid,
        status,
        tempImageUrl,

        onCancel,
        onDeleteEntry,
        onDeleteImage,
        onInputValueChange,
        onSave,
        onSelectImage,
        onStatusChange,
        setTouched,
    }
}