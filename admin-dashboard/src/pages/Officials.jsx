import { useState } from 'react'
import { Box, Grid, Card, CardContent, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem } from '@mui/material'
import { officials as initialOfficials } from '../data/mockData.js'

const positions = ['Punong Barangay', 'Kagawad', 'SK Chairman', 'Barangay Secretary', 'Barangay Treasurer']

export default function Officials() {
  const [items, setItems] = useState(initialOfficials)
  const [openForm, setOpenForm] = useState(false)
  const [selectedOfficial, setSelectedOfficial] = useState(null)
  const [formState, setFormState] = useState({ fullName: '', position: 'Kagawad', committee: '', termStart: '2023', termEnd: '2025', contactNumber: '', email: '' })

  const openCreate = () => {
    setSelectedOfficial(null)
    setFormState({ fullName: '', position: 'Kagawad', committee: '', termStart: '2023', termEnd: '2025', contactNumber: '', email: '' })
    setOpenForm(true)
  }

  const openEdit = (official) => {
    setSelectedOfficial(official)
    setFormState({ fullName: official.name, position: official.position, committee: official.committee, termStart: official.term.split('-')[0], termEnd: official.term.split('-')[1], contactNumber: official.contact, email: official.email })
    setOpenForm(true)
  }

  const handleSave = () => {
    if (selectedOfficial) {
      setItems((prev) => prev.map((item) => (item.id === selectedOfficial.id ? { ...item, name: formState.fullName, position: formState.position, committee: formState.committee, term: `${formState.termStart}-${formState.termEnd}`, contact: formState.contactNumber, email: formState.email } : item)))
    } else {
      setItems((prev) => [...prev, { id: `official-${prev.length + 1}`, name: formState.fullName, position: formState.position, committee: formState.committee, term: `${formState.termStart}-${formState.termEnd}`, contact: formState.contactNumber, email: formState.email }])
    }
    setOpenForm(false)
    window.alert('Official saved')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={openCreate}>+ Add Official</Button>
      </Box>
      <Grid container spacing={2}>
        {items.map((official) => (
          <Grid item xs={12} md={4} key={official.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{official.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</Avatar>
                  <Box>
                    <Typography variant="h6">{official.name}</Typography>
                    <Typography color="text.secondary">{official.position}</Typography>
                  </Box>
                </Box>
                <Typography>Committee: {official.committee || 'N/A'}</Typography>
                <Typography>Term: {official.term}</Typography>
                <Typography>Contact: {official.contact}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button size="small" variant="outlined" onClick={() => openEdit(official)}>Edit</Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => window.alert('Delete official')}>Delete</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedOfficial ? 'Edit Official' : 'Add Official'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField label="Full Name" value={formState.fullName} onChange={(e) => setFormState({ ...formState, fullName: e.target.value })} fullWidth required />
          <TextField select label="Position" value={formState.position} onChange={(e) => setFormState({ ...formState, position: e.target.value })} fullWidth>
            {positions.map((position) => <MenuItem key={position} value={position}>{position}</MenuItem>)}
          </TextField>
          <TextField label="Committee" value={formState.committee} onChange={(e) => setFormState({ ...formState, committee: e.target.value })} helperText="For Kagawads" fullWidth />
          <TextField label="Term Start" type="number" value={formState.termStart} onChange={(e) => setFormState({ ...formState, termStart: e.target.value })} fullWidth />
          <TextField label="Term End" type="number" value={formState.termEnd} onChange={(e) => setFormState({ ...formState, termEnd: e.target.value })} fullWidth />
          <TextField label="Contact Number" value={formState.contactNumber} onChange={(e) => setFormState({ ...formState, contactNumber: e.target.value })} fullWidth />
          <TextField label="Email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
