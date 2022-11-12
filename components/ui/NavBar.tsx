import { useContext } from 'react';

import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

import { UIContext } from '../../context/ui/UIContext';



export const NavBar = () => {

  const { openSideMenu } = useContext(UIContext)


  return (
    <AppBar position="sticky">
        <Toolbar>

            <IconButton 
              size="large" 
              edge="start"
              onClick={ openSideMenu }
            >
                <MenuOutlinedIcon sx={{color: 'white'}}/>
            </IconButton>

            <Typography variant='h6'>Open Jira</Typography>

        </Toolbar>
    </AppBar>
  )
}
