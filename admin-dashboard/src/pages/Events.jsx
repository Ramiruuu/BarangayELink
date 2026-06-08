import { useState } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import { events as initialEvents } from '../data/mockData.js'

const statusOptions = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled']

export default function Events() {
  const [events, setEvents] = useState(initialEvents)
  const [openForm, setOpenForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [viewRegistrants, setViewRegistrants] = useState(null)

  const [formState, setFormState] = useState({ title: '', description: '', startDate: '', endDate: '', location: '', maxSlots: 0, status: 'Upcoming', contactPerson: '', contactNumber: '' })

  const openCreate = () => {
    setSelectedEvent(null)
    setFormState({ title: '', description: '', startDate: '', endDate: '', location: '', maxSlots: 0, status: 'Upcoming', contactPerson: '', contactNumber: '' })
    setOpenForm(true)
  }

  const openEdit = (event) => {
    setSelectedEvent(event)
    setFormState({ ...event })
    setOpenForm(true)
  }

  const handleSave = () => {
    if (selectedEvent) {
      setEvents((prev) => prev.map((item) => (item.id === selectedEvent.id ? { ...item, ...formState } : item)))
    } else {
      setEvents((prev) => [...prev, { ...formState, id: `event-${prev.length + 1}`, registered: 0, registrants: [] }])
    }
    setOpenForm(false)
    window.alert('Event saved')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={openCreate}>+ Create New Event</Button>
      </Box>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <EventIcon color="primary" />
                  <Typography variant="h6">{event.title}</Typography>
                </Box>
                <Typography color="text.secondary">{event.description}</Typography>
                <Typography sx={{ mt: 1 }}>Date: {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}</Typography>
                <Typography>Location: {event.location}</Typography>
                <Typography>Registered: {event.registered}/{event.maxSlots}</Typography>
                <Typography>Status: {event.status}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button size="small" variant="outlined" onClick={() => openEdit(event)}>Edit</Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => window.alert('Delete event')}>Delete</Button>
                  <Button size="small" variant="contained" onClick={() => setViewRegistrants(event)}>View Registrants</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
        <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField label="Event Title" value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })} fullWidth required />
          <TextField label="Description" value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} multiline rows={3} fullWidth />
          <TextField label="Start Date & Time" type="datetime-local" value={formState.startDate} onChange={(e) => setFormState({ ...formState, startDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="End Date & Time" type="datetime-local" value={formState.endDate} onChange={(e) => setFormState({ ...formState, endDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Location" value={formState.location} onChange={(e) => setFormState({ ...formState, location: e.target.value })} fullWidth />
          <TextField label="Max Slots" type="number" value={formState.maxSlots} onChange={(e) => setFormState({ ...formState, maxSlots: Number(e.target.value) })} fullWidth />
          <TextField label="Contact Person" value={formState.contactPerson} onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })} fullWidth />
          <TextField label="Contact Number" value={formState.contactNumber} onChange={(e) => setFormState({ ...formState, contactNumber: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(viewRegistrants)} onClose={() => setViewRegistrants(null)} fullWidth maxWidth="lg">
        <DialogTitle>Registrants</DialogTitle>
        <DialogContent>
          <Typography>{viewRegistrants?.registrants.length || 0} residents registered</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Purok</TableCell>
                  <TableCell>Registration Date</TableCell>
                  <TableCell>Attendance Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(viewRegistrants?.registrants || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.purok}</TableCell>
                    <TableCell>{item.registrationDate}</TableCell>
                    <TableCell>{item.attendance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.alert('Export registrants list')}>Export registrants list</Button>
          <Button onClick={() => setViewRegistrants(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
