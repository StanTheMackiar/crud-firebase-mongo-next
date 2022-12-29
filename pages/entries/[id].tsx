import { GetServerSideProps, NextPage } from 'next'

import { capitalize, Button, Card, CardMedia, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, IconButton, CircularProgress, Box, Fab } from '@mui/material'

import { Layout } from '../../components/layouts'
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { EntryStatus, Entry } from '../../interfaces';
import { dateFunctions } from '../../utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useEntries } from '../../hooks/useEntries';
import { AlertInvalidFile, AlertRemove, InputFile } from '../../components/ui';
import { useNewEntry } from '../../hooks/useNewEntry';

const validStatus: EntryStatus[] = ['pending', 'in-progress', 'finished']

interface Props {
    entry: Entry
}


export const EntryPage: NextPage<Props> = ({ entry }) => {

    const { isLoading, inputValue, isNotValid, onInputValueChange, onSave, onStatusChange, setTouched, status, onSelectImage, onDeleteEntry, imageFile, onDeleteImage, deleteEntryAlert, deleteImageAlert, invalidFileAlert } = useEntries({ entry })
    
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
                            <Box display="flex" justifyContent="space-between" sx={{
                                flexDirection: { xs: "column", md: "row" }
                            }}>
                                <InputFile 
                                    onSelectImage={onSelectImage} 
                                    imageFile={ imageFile }
                                    message={ `${entry.image ? "Update" : "Upload" } image* (max size: 1mb)` } 
                                />
                                <Fab 
                                    component="span" 
                                    size="small" 
                                    color="primary" 
                                    aria-label="delete-photo"
                                    onClick={ deleteImageAlert.toggleAlert }
                                >
                                    <DeleteIcon />
                                </Fab>
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
                                endIcon={!isLoading ? <SaveIcon /> : <CircularProgress size={20} color="inherit" />}
                                variant='contained'
                                fullWidth
                                onClick={ onSave }
                                disabled={ inputValue.length <= 0 || isLoading }
                            >
                                Save
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

            </Grid>
            

            {/* //TODO: colocar funcion para borrar */}
            <IconButton 
            sx={{
                position: 'fixed',
                bottom: 30,
                right: 30,
                color: 'white',
                backgroundColor: 'error.dark'
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
            entry: {
                ...entryRef.data(),
                _id: entryRef.id
            }
        }
    }
}


export default EntryPage