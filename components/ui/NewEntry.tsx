
import { Box, Button, TextField } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CircularProgress from '@mui/material/CircularProgress';
import AddPhoto from '@mui/icons-material/AddPhotoAlternate';
import { Fab } from "@mui/material";
import { Typography } from "@mui/material";
import { AlertInvalidFile } from ".";

import { useNewEntry } from "../../hooks/useNewEntry";

export const NewEntry = () => {

  const { formatImageName, onCancel, onSave, onSelectImage, onTextFieldChange, toggleOpen, openAlert, isAddingEntry, inputValue, setIsAddingEntry, touched, setTouched, imageFile, isLoading } = useNewEntry();

  return (
    <>
      <AlertInvalidFile open={ openAlert } toggleOpen={ toggleOpen } />

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
                      accept="image/png, .jpeg, .jpg, image/gif"
                      onChange={ onSelectImage }
                      style={{display: 'none'}}
                    />
                    <Fab component="span" size="small" color="primary" aria-label="add-photo">
                      <AddPhoto />
                    </Fab>
                    <Typography variant="caption">{ !imageFile ? "Upload image* (max size: 1mb)" : formatImageName(imageFile.name) }</Typography>
                  </Box>
                </label>

            <Box display="flex" justifyContent="space-between" gap={1}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                size="small"
                endIcon={!isLoading ? <SaveIcon /> : <CircularProgress size={20}  color='inherit'/>}
                onClick={onSave}
                disabled={inputValue.length <= 0 || isLoading }
              >
                Save
              </Button>
              <Button variant="outlined" color="secondary" size="small" onClick={ onCancel }>
                Cancel
              </Button>
            </Box>

          </>
        )}
      </Box>
    </>
  );
};
