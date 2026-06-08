import { useState } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material'
import { giveaways as initialGiveaways } from '../data/mockData.js'

const eligibilityOptions = ['All Residents', 'Senior Citizens', 'PWD', '4Ps', 'Students']

export default function Giveaways() {
  const [items, setItems] = useState(initialGiveaways)
  const [openForm, setOpenForm] = useState(false)
  const [selectedGiveaway, setSelectedGiveaway] = useState(null)
  const [viewClaims, setViewClaims] = useState(null)
  const [formState, setFormState] = useState({ title: '', description: '', totalQuantity: 0, eligibility: 'All Residents', specificPuroks: '', startDate: '', endDate: '', location: '', requiredDocuments: '' })

  const openCreate = () => {
    setSelectedGiveaway(null)
    setFormState({ title: '', description: '', totalQuantity: 0, eligibility: 'All Residents', specificPuroks: '', startDate: '', endDate: '', location: '', requiredDocuments: '' })
    setOpenForm(true)
  }

  const openEdit = (item) => {
    setSelectedGiveaway(item)
    setFormState({
      title: item.title,
      description: item.description,
      totalQuantity: item.totalQuantity,
      eligibility: item.eligibility,
      specificPuroks: '',
      startDate: item.startDate,
      endDate: item.endDate,
      location: item.location,
      requiredDocuments: item.requiredDocuments.join(', '),
    })
    setOpenForm(true)
  }

  const handleSave = () => {
    if (selectedGiveaway) {
      setItems((prev) => prev.map((item) => (item.id === selectedGiveaway.id ? { ...item, ...formState, requiredDocuments: formState.requiredDocuments.split(',').map((doc) => doc.trim()) } : item)))
    } else {
      setItems((prev) => [...prev, { ...formState, id: `giveaway-${prev.length + 1}`, remainingQuantity: formState.totalQuantity, status: 'Upcoming', claims: [] }])
    }
    setOpenForm(false)
    window.alert('Giveaway saved')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={openCreate}>+ Create New Giveaway</Button>
      </Box>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>{item.description}</Typography>
                <Typography>Total / Remaining: {item.remainingQuantity}/{item.totalQuantity}</Typography>
                <Typography>Eligibility: {item.eligibility}</Typography>
                <Typography>Date: {item.startDate} - {item.endDate}</Typography>
                <Typography>Status: {item.status}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button size="small" variant="outlined" onClick={() => openEdit(item)}>Edit</Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => window.alert('Delete giveaway')}>Delete</Button>
                  <Button size="small" variant="contained" onClick={() => setViewClaims(item)}>View Claims</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
        <DialogTitle>{selectedGiveaway ? 'Edit Giveaway' : 'Create New Giveaway'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField label="Title" value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })} fullWidth required />
          <TextField label="Description" value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} multiline rows={3} fullWidth />
          <TextField label="Total Quantity" type="number" value={formState.totalQuantity} onChange={(e) => setFormState({ ...formState, totalQuantity: Number(e.target.value) })} fullWidth />
          <TextField select label="Eligibility" value={formState.eligibility} onChange={(e) => setFormState({ ...formState, eligibility: e.target.value })} fullWidth>
            {eligibilityOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </TextField>
          <TextField label="Specific Puroks" value={formState.specificPuroks} onChange={(e) => setFormState({ ...formState, specificPuroks: e.target.value })} helperText="Optional" fullWidth />
          <TextField label="Start Date" type="date" value={formState.startDate} onChange={(e) => setFormState({ ...formState, startDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="End Date" type="date" value={formState.endDate} onChange={(e) => setFormState({ ...formState, endDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Claiming Location" value={formState.location} onChange={(e) => setFormState({ ...formState, location: e.target.value })} fullWidth />
          <TextField label="Required Documents" value={formState.requiredDocuments} onChange={(e) => setFormState({ ...formState, requiredDocuments: e.target.value })} helperText="Separate values by comma" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(viewClaims)} onClose={() => setViewClaims(null)} fullWidth maxWidth="lg">
        <DialogTitle>Claims List</DialogTitle>
        <DialogContent>
          <Typography>{viewClaims?.claims.length || 0} claims</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Purok</TableCell>
                  <TableCell>Claim Date</TableCell>
                  <TableCell>Verified By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(viewClaims?.claims || []).map((claim, index) => (
                  <TableRow key={`${claim.name}-${index}`}>
                    <TableCell>{claim.name}</TableCell>
                    <TableCell>{claim.purok}</TableCell>
                    <TableCell>{claim.claimDate}</TableCell>
                    <TableCell>{claim.verifiedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.alert('Export claims list')}>Export claims list</Button>
          <Button onClick={() => setViewClaims(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
