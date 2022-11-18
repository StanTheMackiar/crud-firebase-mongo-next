import { Card, CardHeader, Grid } from "@mui/material";
import { Layout } from '../components/layouts/Layout';
import { EntryList, NewEntry } from "../components/ui";


export default function HomePage() {

  return (
    <Layout title="Task List App">
      
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

    </Layout>
  )
}
