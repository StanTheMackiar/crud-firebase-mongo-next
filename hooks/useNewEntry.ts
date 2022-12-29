import { useState, useContext, ChangeEvent } from "react";
import { EntriesContext } from "../context/entries";
import { UIContext } from "../context/ui";

export const useNewEntry = () => {
    
    const [ inputValue, setInputValue ] = useState('')
    const [ touched, setTouched ] = useState(false)
    const [ imageFile, setImageFile ] = useState<File | null>(null);
    const { addNewEntry, uploadImage } = useContext(EntriesContext)
    const { setIsAddingEntry, isAddingEntry } = useContext(UIContext)
    const [ openAlert, setOpenAlert ] = useState(false);
    const [ isLoading, setIsLoading] = useState(false);
  
  
    const toggleOpen = () => setOpenAlert(prev => !prev);
        
    const onTextFieldChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)
  
    const onSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
  
      if( !file?.type.startsWith('image') ) {
        setOpenAlert(true);
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

      if( !imageFile ) {
        await addNewEntry(inputValue);
        finishAddingEntry();
        return;
      }

      try {
        console.log('Image file detected')
        const imageUrl = await uploadImage(imageFile);
        await addNewEntry(inputValue, imageUrl)
        finishAddingEntry();

      } catch (err) {
        console.log({err})
        finishAddingEntry();
      }

      finishAddingEntry();
    }

  
    const finishAddingEntry = () => {
      setIsLoading(false);
      setIsAddingEntry( false );
      setTouched( false );
      setInputValue('');
      setImageFile(null);
    } 
  

   return {
        imageFile,
        inputValue,
        isAddingEntry,
        isLoading,
        openAlert,
        touched,

        // Methods
        formatImageName,
        finishAddingEntry,
        onSave,
        onSelectImage,
        onTextFieldChange,
        setIsAddingEntry,
        setTouched,
        toggleOpen,
    }
}