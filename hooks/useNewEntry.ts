import { useAlert } from './useAlert';
import { useState, useContext, ChangeEvent } from "react";
import { EntriesContext } from "../context/entries";
import { UIContext } from "../context/ui";
import { MAX_FILE_SIZE } from '../utils/const';

export const useNewEntry = () => {
    
    const alertInvalidFile = useAlert();
    const alertMaxSize = useAlert();

    const [ inputValue, setInputValue ] = useState('')
    const [ touched, setTouched ] = useState(false)
    const [ imageFile, setImageFile ] = useState<File | null>(null);
    const { addNewEntry, uploadImage, updateEntry } = useContext(EntriesContext)
    const { setIsAddingEntry, isAddingEntry } = useContext(UIContext)
    const [ isLoading, setIsLoading] = useState(false);
  
        
    const onTextFieldChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)
  
    const onSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
  
      if( !file?.type.startsWith('image') ) {
        alertInvalidFile.toggleAlert();
        return;
      }

      if( file?.size > MAX_FILE_SIZE ) {
        alertMaxSize.toggleAlert();
        return;
      }
      console.log({file})
      setImageFile(file);
    } 
  
    const formatImageName = ( imgName: string ): string => {
      if( imgName.length > 20 ) {
        imgName = "..." + imgName.substring(imgName.length - 20);
      }
      return imgName;
    }
  
    const onSave = async() => {
      if (inputValue.length === 0) return;
      setIsLoading(true);

      const newEntry = await addNewEntry( inputValue );

      if ( !imageFile || !newEntry ) {
        finishAddingEntry();
        return;
      }

      try {
        console.log('Image file detected')
        const { _id } = newEntry;
        const image = await uploadImage( imageFile, _id );
        const finalEntry = {
          ...newEntry,
          image,
        }

        await updateEntry( finalEntry, false )
        finishAddingEntry();

      } catch (err) {
        console.log({err})
      } finally {
        finishAddingEntry();
      }
    }

  
    const finishAddingEntry = () => {
      setIsLoading(false);
      setIsAddingEntry( false );
      setTouched( false );
      setInputValue('');
      setImageFile(null);
    } 
  

   return {
        alertInvalidFile,
        alertMaxSize,
        imageFile,
        inputValue,
        isAddingEntry,
        isLoading,
        touched,

        // Methods
        finishAddingEntry,
        formatImageName,
        onSave,
        onSelectImage,
        onTextFieldChange,
        setIsAddingEntry,
        setTouched,
    }
}