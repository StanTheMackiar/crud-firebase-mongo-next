import { AppBar, Typography } from '@mui/material';
import NextLink from 'next/link';

export const NavBar = () => (

    <AppBar position="sticky">
            <NextLink href='/' style={{ textDecoration: 'none', color: 'white'}}>
                <Typography variant='h4' m={2} textAlign='center'>Task List</Typography>
            </NextLink>
    </AppBar>

)
