
import { Button, Dialog, DialogActions, DialogTitle, Grid } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';


interface Props {
  toggleOpen: () => void,
  open: boolean,
}

export const AlertInvalidFile = ({ toggleOpen, open }: Props) => {

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
            Only image files are allowed!
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
