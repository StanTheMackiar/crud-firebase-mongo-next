
import { Box, Button, TextField } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CircularProgress from '@mui/material/CircularProgress';
import { AlertInvalidFile } from ".";

import { useNewEntry } from "../../hooks/useNewEntry";
import { InputFile } from './';

export const NewEntry = () => {

  const { finishAddingEntry, onSave, onTextFieldChange, isAddingEntry, inputValue, setIsAddingEntry, touched, setTouched, isLoading, onSelectImage, imageFile, isOpenAlert, toggleAlert } = useNewEntry();

  return (
    <>
      <AlertInvalidFile open={ isOpenAlert } toggleOpen={ toggleAlert } />

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

            <InputFile onSelectImage={ onSelectImage } imageFile={ imageFile } message="Upload image* (max size: 1mb)" />

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
              <Button variant="outlined" color="secondary" size="small" onClick={ finishAddingEntry }>
                Cancel
              </Button>
            </Box>

          </>
        )}
      </Box>
    </>
  );
};
