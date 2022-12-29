
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';


interface Props {
  toggleOpen: () => void,
  open: boolean,
  onDelete: () => void,
  message: string,
}

export const AlertRemove = ({ toggleOpen, open, onDelete, message }: Props) => {

  return (
    <div>
      <Dialog
        open={open}
        onClose={toggleOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid container>
          <Grid item xs={12} textAlign='center' p={2}>
            <InfoIcon color="error" sx={{fontSize: 80}}/>
          </Grid>
          <Grid item xs={12} textAlign='center'>
            <DialogTitle>
              { message }
            </DialogTitle>
          </Grid>
        </Grid>
        <DialogContent>
          <DialogContentText textAlign='center'>
            {`You won't be able to revert this action!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{p:2}}>
          <Button onClick={ toggleOpen } autoFocus>
            Cancel
          </Button>
          <Button color="error" onClick={ onDelete } endIcon={ <DeleteIcon /> }>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
