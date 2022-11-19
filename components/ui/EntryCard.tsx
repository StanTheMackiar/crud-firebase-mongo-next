import { FC, DragEvent, useContext, useState } from 'react';

import { Box, Card, CardActionArea, CardActions, CardContent, IconButton, Typography } from '@mui/material';

import { Entry } from '../../interfaces';
import { UIContext } from '../../context/ui';
import { useRouter } from 'next/router';
import { dateFunctions } from '../../utils/';

import EditIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { EntriesContext } from '../../context/entries/EntriesContext';
import { AlertDialog } from '.';


interface Props {
    entry: Entry,
}


export const EntryCard:FC<Props> = ({ entry }) => {

    const { toggleDragging } = useContext(UIContext)
    const { deleteEntry } = useContext(EntriesContext)

    const [open, setOpen] = useState(false);

    const router = useRouter();

    const toggleOpen = () => {
        setOpen(prev => !prev);
      };

    const onDragStart = ( e: DragEvent ) => {
        e.dataTransfer?.setData('text', entry._id)
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
                <CardContent>
                    <Typography sx={{ whiteSpace: 'pre-line' }}>{entry.description}</Typography>
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
