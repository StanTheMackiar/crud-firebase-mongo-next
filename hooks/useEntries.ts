import { useRouter } from "next/router"
import { useContext, useState, useMemo, ChangeEvent } from "react"
import { EntriesContext } from "../context/entries"
import { Entry, EntryStatus } from "../interfaces"

interface Params {
    entry: Entry
}

export const useEntries = ({ entry }: Params ) => {

    const router = useRouter()
    const { updateEntry } = useContext( EntriesContext )

    const [inputValue, setInputValue] = useState( entry.description )
    const [status, setStatus] = useState<EntryStatus>( entry.status );
    const [touched, setTouched] = useState(false);

    const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched])

    
    const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)

    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => setStatus( e.target.value as EntryStatus );

    const onSave = () => {
        if ( inputValue.trim().length === 0 ) return;

        const updatedEntry: Entry = {
            ...entry,
            status,
            description: inputValue,
        }

        updateEntry( updatedEntry, true );
        router.push('/')
    }


   return {
        inputValue,
        isNotValid,
        status,

        onInputValueChange,
        onSave,
        onStatusChange,
        setTouched
    }
}