
import { Box, Button, TextField } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CircularProgress from '@mui/material/CircularProgress';
import { AlertInvalidFile } from ".";

import { useNewEntry } from "../../hooks/useNewEntry";
import { InputFile } from './';

export const NewEntry = () => {

  const { finishAddingEntry, onSave, onTextFieldChange, isAddingEntry, inputValue, setIsAddingEntry, touched, setTouched, isLoading, onSelectImage, imageFile, alertInvalidFile, alertMaxSize } = useNewEntry();

  return (
    <>
      <AlertInvalidFile open={ alertInvalidFile.isOpenAlert } toggleOpen={ alertInvalidFile.toggleAlert } message='Only image files are allowed!' />

      <AlertInvalidFile open={ alertMaxSize.isOpenAlert } toggleOpen={  alertMaxSize.toggleAlert } message='Only image files are allowed!' />

      <Box sx={{ marginBottom: 2, paddingX: 1 }}>
        {!isAddingEntry ? (
          <>
            <Button endIcon={<AddBoxIcon />} fullWidth variant="outlined" onClick={() => setIsAddingEntry( true )}>
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

            <Box marginBottom={2}>
              <InputFile onSelectImage={ onSelectImage } imageFile={ imageFile } message="Add image" isLoading={isLoading} size='small' />
            </Box>

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
