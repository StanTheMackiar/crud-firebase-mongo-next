import { useState , ChangeEvent, useContext} from "react";

import { Box, Button, TextField } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { EntriesContext } from "../../context/entries";
import { UIContext } from "../../context/ui";

export const NewEntry = () => {

  const [inputValue, setInputValue] = useState('')
  const [touched, setTouched] = useState(false)

  const { addNewEntry } = useContext(EntriesContext)
  const { setIsAddingEntry, isAddingEntry } = useContext(UIContext)


  const onTextFieldChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)

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
