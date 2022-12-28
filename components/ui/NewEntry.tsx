import { useState , ChangeEvent, useContext, useEffect} from "react";

import { Box, Button, TextField } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddPhoto from '@mui/icons-material/AddPhotoAlternate';
import { EntriesContext } from "../../context/entries";
import { UIContext } from "../../context/ui";
import { Fab } from "@mui/material";
import { Typography } from "@mui/material";

export const NewEntry = () => {

  const [ inputValue, setInputValue ] = useState('')
  const [ touched, setTouched ] = useState(false)
  const [ selectedImage, setSelectedImage ] = useState("");
  const [ imageName, setImageName ] = useState("");
  const { addNewEntry } = useContext(EntriesContext)
  const { setIsAddingEntry, isAddingEntry } = useContext(UIContext)

  useEffect(() => {
    const name = getImageName(selectedImage);
    setImageName(name);
  }, [selectedImage]);

  const onTextFieldChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)

  const onSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(e.target.value)
  } 

  const getImageName = ( fakeImagePath: string ): string => {
    const splitPath = fakeImagePath.split("\\");
    const imgName = splitPath[2];
    return imgName;
  }

  console.log({selectedImage})

  const onSave = () => {

    if (inputValue.length === 0) return;

    addNewEntry( inputValue );
    setIsAddingEntry( false );
    setTouched( false );
    setInputValue('');
  }

  return (
    <Box sx={{ marginBottom: 2, paddingX: 1 }}>
      {!isAddingEntry ? (
        <>
          <Button startIcon={<AddBoxIcon />} fullWidth variant="outlined" onClick={() => setIsAddingEntry( true )}>
            Add new Entry
          </Button>
        </>
      ) : (
        <>
          <TextField
            fullWidth
            sx={{ marginTop: 2, marginBottom: 1 }}
            placeholder="Write here..."
            multiline
            autoFocus
            label="New entry"
            error={ inputValue.length <= 0 && touched}
            helperText={ inputValue.length <= 0 && touched && 'Please put a value' }
            value={ inputValue }
            onChange={ onTextFieldChange }
            onBlur={ () => setTouched( true )}
          />

              <label htmlFor="upload-image">
                <Box 
                  display="flex" 
                  flexDirection='row' 
                  alignItems='center'
                  justifyContent="center"
                  gap={1} 
                  mb={2}
                >
                  <input
                    id="upload-image"
                    type="file"
                    value={ selectedImage }
                    accept="image/png, .jpeg, .jpg, image/gif"
                    onChange={ onSelectImage }
                    style={{display: 'none'}}
                  />
                  <Fab component="span" size="small" color="primary" aria-label="add-photo">
                    <AddPhoto />
                  </Fab>
                  <Typography variant="caption">{ !imageName ? "Upload photo (optiona)" : imageName }</Typography>
                </Box>
              </label>

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              endIcon={<SaveIcon />}
              onClick={onSave}
              disabled={inputValue.length <= 0}
            >
              Save
            </Button>
            <Button variant="outlined" color="secondary" size="small" onClick={() => setIsAddingEntry( false )}>
              Cancel
            </Button>
          </Box>

        </>
      )}
    </Box>
  );
};
