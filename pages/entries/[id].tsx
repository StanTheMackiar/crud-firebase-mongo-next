import { FC } from 'react';
import { GetServerSideProps } from 'next'

import { capitalize, Button, Card, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, IconButton } from '@mui/material'

import { Layout } from '../../components/layouts'
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import { EntryStatus, Entry } from '../../interfaces';
import { dateFunctions } from '../../utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useEntries } from '../../hooks/useEntries';

const validStatus: EntryStatus[] = ['pending', 'in-progress', 'finished']

interface Props {
    entry: Entry
}


export const EntryPage: FC<Props> = ({ entry }) => {

    const { inputValue, isNotValid, onInputValueChange, onSave, onStatusChange, setTouched, status } = useEntries({ entry })

  return (
    
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
                        <TextField 
                            sx={{ marginTop: 2, marginBottom: 1}}
                            fullWidth
                            placeholder='New Entry'
                            autoFocus
                            multiline
                            label='New Entry'
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
                            startIcon={<SaveIcon />}
                            variant='contained'
                            fullWidth
                            onClick={ onSave }
                            disabled={ inputValue.length <= 0 }
                        >
                            Save
                        </Button>
                    </CardActions>
                </Card>
            </Grid>

        </Grid>

        <IconButton sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            color: 'white',
            backgroundColor: 'error.dark'
        }}>
            <DeleteIcon/>
        </IconButton>

    </Layout>


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