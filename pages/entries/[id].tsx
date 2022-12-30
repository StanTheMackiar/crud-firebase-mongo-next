import { GetServerSideProps, NextPage } from 'next'

import { capitalize, Button, Card, CardMedia, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, IconButton, CircularProgress, Box, Tooltip } from '@mui/material'

import { Layout } from '../../components/layouts'
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';

import { EntryStatus, Entry } from '../../interfaces';
import { dateFunctions } from '../../utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useEntries } from '../../hooks/useEntries';
import { AlertInvalidFile, AlertRemove, InputFile } from '../../components/ui';

const validStatus: EntryStatus[] = ['pending', 'in-progress', 'finished']

interface Props {
    serverEntry: Entry
}


export const EntryPage: NextPage<Props> = ({ serverEntry }) => {

    const { entry, isLoading, inputValue, isNotValid, onInputValueChange, onSave, onStatusChange, setTouched, status, onSelectImage, onDeleteEntry, imageFile, onDeleteImage, onCancel, deleteEntryAlert, deleteImageAlert, invalidFileAlert, invalidFileSizeAlert, tempImageUrl, deleteTempImage } = useEntries({ serverEntry })
    
    return (

    <>
        <Layout title={ inputValue.substring(0,20) + '...'}>
            <Grid
                container
                justifyContent='center'
                sx={{ marginTop: 2}}
            >
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardHeader 
                            title={`Edit entry`}
                            subheader={`Created ${ dateFunctions.getFormatDistanceToNow(entry.createdAt)}`}
                        />
                        <CardContent>

                            {
                                entry.image && 

                                <Box>
                                    <CardMedia 
                                        component='img'
                                        image={ entry.image }
                                        sx={{ objectFit: 'contain', borderRadius: 2, marginBottom: 2 }}
                                        alt={ 'Image for entry ID' + entry._id }
                                    />
                                </Box>
                            }
                            <Box 
                            display="flex" 
                            justifyContent="space-around" 
                            flexDirection='row'
                            marginBottom={1}
                            >   
                                <InputFile 
                                    onSelectImage={onSelectImage} 
                                    imageFile={ imageFile }
                                    message={ `${entry.image ? "Update" : "Upload" } image` } 
                                    isLoading={isLoading}
                                />
                                {
                                    entry.image &&
                                        <IconButton 
                                            component="span" 
                                            color="primary" 
                                            sx={{
                                                display: `${isLoading ? 'none': 'flex'}`,
                                                color: 'white', 
                                                backgroundColor: 'primary.main',
                                                ':hover': {
                                                    backgroundColor: 'primary.dark'
                                                }
                                            }}
                                            aria-label="delete-photo"
                                            onClick={ !tempImageUrl.current ? deleteImageAlert.toggleAlert : deleteTempImage }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                }
                            </Box>

                            <TextField 
                                sx={{ marginTop: 2, marginBottom: 1}}
                                fullWidth
                                placeholder='Newdeescription'
                                autoFocus
                                multiline
                                label='New description'
                                value={inputValue}
                                onChange={ onInputValueChange }
                                helperText={ isNotValid && 'Enter a value'}
                                error={ isNotValid }
                                onBlur={ ()=> setTouched( true ) }
                            />

                            <FormControl>
                                <FormLabel>Status:</FormLabel>
                                <RadioGroup
                                    row
                                    value={ status }
                                    onChange={ onStatusChange }
                                >
                                    {
                                        validStatus.map( option => (
                                            <FormControlLabel 
                                                key={ option }
                                                value={ option }
                                                control={ <Radio/> }
                                                label={ capitalize(option) }
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>


                        </CardContent>
                        <CardActions>
                            <Button
                                variant='contained'
                                fullWidth
                                disableElevation
                                onClick={ onSave }
                                disabled={ inputValue.length <= 0 || isLoading }
                            >
                                {!isLoading ? <SaveIcon /> : <CircularProgress size={20} color="inherit" />}
                            </Button>
                            <Button
                                variant='outlined'
                                fullWidth
                                onClick={ onCancel }
                                disabled={ inputValue.length <= 0 || isLoading }
                            >
                                <ClearIcon />
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

            </Grid>
            
            <IconButton 
            sx={{
                position: 'fixed',
                bottom: 30,
                right: 30,
                color: 'white',
                backgroundColor: 'error.dark',
                ':hover': {
                    backgroundColor: '#740d1d'
                  }
            }}
            onClick={ deleteEntryAlert.toggleAlert }
            >
                <DeleteForeverIcon/>
            </IconButton>

        </Layout>


        <AlertRemove 
            open={ deleteImageAlert.isOpenAlert }
            toggleOpen={ deleteImageAlert.toggleAlert }
            onDelete={ onDeleteImage }
            message='Do you want remove the image on this entry?'
        />

        <AlertRemove 
            open={ deleteEntryAlert.isOpenAlert }
            toggleOpen={ deleteEntryAlert.toggleAlert }
            onDelete={ onDeleteEntry }
            message='Do you want delete this entry?'
        />

        <AlertInvalidFile 
            open={ invalidFileAlert.isOpenAlert }
            toggleOpen={ invalidFileAlert.toggleAlert }
            message="Only image files are allowed!"
        />

        <AlertInvalidFile 
            open={ invalidFileSizeAlert.isOpenAlert }
            toggleOpen={ invalidFileSizeAlert.toggleAlert }
            message="Image file max size  is 1mb!"
        />
    </>
  );
};



export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { id } = params as {id: string};

    const docRef = doc(db, 'Entries', `${id}`)
    const entryRef = await getDoc(docRef)

    if ( !entryRef.exists() ) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            serverEntry: {
                ...entryRef.data(),
                _id: entryRef.id
            }
        }
    }
}


export default EntryPage