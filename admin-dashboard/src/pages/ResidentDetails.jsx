import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Avatar, Grid, Button, Chip, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { residents } from '../data/mockData.js'

function TabPanel({ children, index, value }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null
}

export default function ResidentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const resident = useMemo(() => residents.find((item) => item.id === id), [id])

  if (!resident) {
    return <Typography>Resident not found.</Typography>
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main', fontSize: 40 }}>{resident.firstName[0]}{resident.lastName[0]}</Avatar>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h5">{resident.firstName} {resident.lastName}</Typography>
            <Typography color="text.secondary">{resident.email}</Typography>
            <Typography sx={{ mt: 1 }}>Contact: {resident.contact}</Typography>
            <Typography>Purok: {resident.purok}</Typography>
            <Typography>Address: {resident.address}</Typography>
            <Typography>Member since: {resident.memberSince}</Typography>
            <Chip label={resident.status} color={resident.status === 'Active' ? 'success' : 'default'} sx={{ mt: 1 }} />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={() => window.alert('Edit Resident')}>Edit Resident</Button>
              <Button variant="outlined" onClick={() => window.alert(resident.status === 'Active' ? 'Deactivate Resident' : 'Activate Resident')}>{resident.status === 'Active' ? 'Deactivate' : 'Activate'}</Button>
              <Button color="error" variant="outlined" onClick={() => window.alert('Delete Resident')}>Delete Resident</Button>
              <Button onClick={() => navigate('/admin/residents')}>Back to Residents</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
          <Tab label="Documents History" />
          <Tab label="Events History" />
          <Tab label="Giveaways History" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request #</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Fee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resident.documents.map((doc) => (
                  <TableRow key={doc.requestNumber}>
                    <TableCell>{doc.requestNumber}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.status}</TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>₱{doc.fee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resident.events.map((event) => (
                  <TableRow key={event.title}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.status}</TableCell>
                    <TableCell>{event.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Giveaway</TableCell>
                  <TableCell>Claim Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resident.giveaways.map((giveaway) => (
                  <TableRow key={giveaway.title}>
                    <TableCell>{giveaway.title}</TableCell>
                    <TableCell>{giveaway.claimDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  )
}
