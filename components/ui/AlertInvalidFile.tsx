
import { Button, Dialog, DialogActions, DialogTitle, Grid } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';


interface Props {
  toggleOpen: () => void,
  open: boolean,
  message: string,
}

export const AlertInvalidFile = ({ toggleOpen, open, message }: Props) => {

  return (
    <div>
      <Dialog
        open={open}
        onClose={ toggleOpen }
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
          <DialogActions sx={{p: 2, display: 'flex', justifyContent: 'center'}}>
            <Button onClick={ toggleOpen }>
              OK
            </Button>
          </DialogActions>
      </Dialog>
    </div>
  );
}
