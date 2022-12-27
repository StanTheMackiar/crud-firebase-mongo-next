import { FC, useContext, useMemo, DragEvent } from 'react';

import { Box, List, Paper } from '@mui/material';
import { EntryStatus } from '../../interfaces';
import { EntryCard } from './';
import { EntriesContext } from '../../context/entries/EntriesContext';
import { UIContext } from '../../context/ui';

interface Props {
    status: EntryStatus,
}

export const EntryList:FC<Props> = ({ status }) => {

    const { entries, updateEntry } = useContext( EntriesContext );
    const { isDragging, toggleDragging } = useContext(UIContext)

    const entriesByStatus = useMemo(() => entries.filter( entry => entry.status === status ), [ entries, status ]);

    const allowDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }
    
    const onDropEntry = (e: DragEvent<HTMLDivElement>) => {
        const id = e.dataTransfer.getData('text')
        
        const entry = entries.find( entry => entry._id === id )!;
        entry.status = status;

        updateEntry(entry);
        toggleDragging( false )
    }

  return (
    <Box 
        component={'div'} 
        onDrop={ onDropEntry }
        onDragOver={ allowDrop }
        sx= { isDragging ? {
            m: '5px',
            borderRadius: '5px',
            backgroundColor: 'rgba(0,0,0,0.1);',
            border: '1px dashed'
        } : {
            m: '5px'
        }}
    >
        <Paper elevation={ 0 } sx={{ 
            height: 'calc(100vh - 250px)', 
            overflowY: 'auto', 
            backgroundColor: 'transparent', 
            p: 1 
            }}
        >
            
            <List sx={{ opacity: isDragging ? 0.3 : 1, transition: 'all .3s' }}>
               {
                entriesByStatus.map( entry => (
                    <EntryCard key={ entry._id } entry={ entry } status={ status } />
                ))
               }
            </List>

        </Paper>
    </Box>
  )
}
