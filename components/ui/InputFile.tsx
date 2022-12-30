import { FC } from 'react'

import { Box, Button, Fab, Tooltip } from '@mui/material'
import AddPhoto from '@mui/icons-material/AddPhotoAlternate';
import { Typography } from "@mui/material";
import { useNewEntry } from '../../hooks/useNewEntry';

interface Props {
    onSelectImage: ( ...args: any ) => any
    imageFile: File | null;
    message: string,
    isLoading: boolean,
    size?: "small" | "medium" | "large",
}

export const InputFile: FC<Props> = ({ onSelectImage, imageFile, message, isLoading, size = 'medium' }) => {

    const { formatImageName } = useNewEntry();

   return (
    <label htmlFor="upload-image">
        <Box 
            display={ !isLoading ? "flex" : "none" } 
            flexDirection='row' 
            alignItems='center'
            justifyContent="center"
            gap={1} 
        >
        <input
            id="upload-image"
            type="file"
            disabled={isLoading}
            accept="image/png, .jpeg, .jpg, image/gif"
            onChange={ onSelectImage }
            style={{display: 'none'}}
        />
        <Tooltip title='Max size: 1mb (optional)'>
            <Button
                variant='contained'
                startIcon={<AddPhoto />}
                disableElevation
                component="span"
                size={ size }
                aria-label="add-photo" 
            >
                { !imageFile ? message : formatImageName(imageFile.name) }
            </Button>
        </Tooltip>
        </Box>
    </label>
   )
}