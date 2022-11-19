import { Card, CardHeader, Grid, LinearProgress, Typography } from "@mui/material";
import { useContext } from "react";
import { Layout } from '../components/layouts/Layout';
import { EntryList, NewEntry } from "../components/ui";
import { EntriesContext } from '../context/entries/EntriesContext';


export default function HomePage() {

  const { loader, error } = useContext(EntriesContext)


  if (error) return (
    <Layout title="Task List App">

      <Typography variant="h6" textAlign='center' >The data base is not connected</Typography>

    </Layout>
  )


  return (
    <Layout title="Task List App">

      {
        loader 
        ? (
          <LinearProgress sx={{marginTop: 20}}/>
        ) : (

      <Grid container spacing={ 2 }>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: 'calc(100vh - 100px)' }}>
            <CardHeader title="Pending" />

            <NewEntry />
            <EntryList status='pending' />

          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: 'calc(100vh - 100px)' }}>
            <CardHeader title="In-progress"/>

            <EntryList status='in-progress' />

          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: 'calc(100vh - 100px)' }}>
            <CardHeader title="Finished"/>

            <EntryList status='finished' />

          </Card>
        </Grid>

      </Grid>

        )
      }
      

    </Layout>
  )
}
