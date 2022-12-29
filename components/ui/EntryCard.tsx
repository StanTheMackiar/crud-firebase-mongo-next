import { FC, DragEvent, useContext, useState } from 'react';

import { Box, Card, CardMedia, CardActionArea, CardActions, CardContent, IconButton, Typography, capitalize } from '@mui/material';

import { Entry, EntryStatus } from '../../interfaces';
import { UIContext } from '../../context/ui';
import { useRouter } from 'next/router';
import { dateFunctions } from '../../utils/';

import EditIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { EntriesContext } from '../../context/entries/EntriesContext';
import { AlertDialog } from '.';


interface Props {
    entry: Entry,
    status: EntryStatus
}


export const EntryCard:FC<Props> = ({ entry, status }) => {

    const { toggleDragging } = useContext(UIContext)
    const { deleteEntry } = useContext(EntriesContext)
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const toggleOpen = () => {
        setOpen(prev => !prev);
      };

    const onDragStart = ( e: DragEvent ) => {
        e.dataTransfer?.setData('text', entry._id!)
        toggleDragging( true )
    }

    const onDragEnd = () => {
        toggleDragging( false )
    }

    const onEditEntry = () => {
        router.push(`/entries/${ entry._id }`)
    }

    const onDeleteEntry = () => {
        deleteEntry(entry)
        toggleOpen();
    }

  return (
    <>
        <Card
            sx={{ marginBottom: 1 }}
            elevation={1}
            draggable
            onDragStart={ onDragStart }
            onDragEnd={ onDragEnd }
        >  
            <CardActionArea>
                {
                    entry.image && 
                        <CardMedia 
                            component='img'
                            image={ entry.image }
                            sx={{ objectFit: 'contain' }}
                            alt={ 'Image for entry ID' + entry._id }
                        />
                }
                <CardContent>
                    <Typography sx={{ whiteSpace: 'pre-line', textDecoration: `${ status === 'finished' ? 'line-through' : 'none'}` }}>{ capitalize(entry.description) }</Typography>
                </CardContent>

                <CardActions sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 2}}>
                    <Typography variant='body2' color='gray'>{dateFunctions.getFormatDistanceToNow( entry.createdAt )}</Typography>
                    <Box component='div'>
                        <IconButton 
                            aria-label='edit'
                            size='small' 
                            onClick={ onEditEntry }
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton 
                            aria-label='delete'
                            size='small'
                            onClick={ toggleOpen }
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </CardActions>
            </CardActionArea>

        </Card>

        <AlertDialog 
            open={open} 
            toggleOpen={toggleOpen} 
            onDeleteEntry={onDeleteEntry}
        />
    </>
  )
}
