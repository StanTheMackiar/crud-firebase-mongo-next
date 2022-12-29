import { FC } from 'react'

import { Box, Fab } from '@mui/material'
import AddPhoto from '@mui/icons-material/AddPhotoAlternate';
import { Typography } from "@mui/material";
import { useNewEntry } from '../../hooks/useNewEntry';

interface Props {
    onSelectImage: ( ...args: any ) => any
    imageFile: File | null;
    message: string,
    isLoading: boolean,
}

export const InputFile: FC<Props> = ({ onSelectImage, imageFile, message, isLoading }) => {

    const { formatImageName } = useNewEntry();

   return (
    <label htmlFor="upload-image">
        <Box 
        display={ !isLoading ? "flex" : "none" } 
        flexDirection='row' 
        alignItems='center'
        justifyContent="center"
        gap={1} 
        mb={2}
        >
        <input
            id="upload-image"
            type="file"
            disabled={isLoading}
            accept="image/png, .jpeg, .jpg, image/gif"
            onChange={ onSelectImage }
            style={{display: 'none'}}
        />
        <Fab component="span" size="small" color="primary" aria-label="add-photo">
            <AddPhoto />
        </Fab>
        <Typography variant="caption">{ !imageFile ? message : formatImageName(imageFile.name) }</Typography>
        </Box>
    </label>
   )
}