import { useMemo, useState } from 'react'
import { Box, Grid, TextField, MenuItem, Button, Paper, Typography, Pagination, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ResidentTable from '../components/ResidentTable.jsx'
import { residents } from '../data/mockData.js'

const purokOptions = ['All', 'Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7', 'Purok 8']
const statusOptions = ['All', 'Active', 'Inactive']

export default function Residents() {
  const [search, setSearch] = useState('')
  const [purok, setPurok] = useState('All')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const rowsPerPage = 10

  const filtered = useMemo(() => {
    return residents.filter((resident) => {
      const matchSearch = [resident.firstName, resident.lastName, resident.email, resident.contact].join(' ').toLowerCase().includes(search.toLowerCase())
      const matchPurok = purok === 'All' || resident.purok === purok
      const matchStatus = status === 'All' || resident.status === status
      return matchSearch && matchPurok && matchStatus
    })
  }, [search, purok, status])

  const pageCount = Math.ceil(filtered.length / rowsPerPage)
  const visible = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const handleExport = () => window.alert('Exporting residents...')
  const handleImport = () => window.alert('Import feature')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Residents of Barangay 28</Typography>
            <Typography color="text.secondary">Total count: {residents.length} residents</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => window.alert('Add new resident clicked')}>+ Add New Resident</Button>
            <Button variant="outlined" onClick={handleImport}>📥 Import CSV</Button>
            <Button variant="outlined" onClick={handleExport}>📤 Export CSV</Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField label="Search" value={search} fullWidth onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or contact" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select label="Filter by Purok" fullWidth value={purok} onChange={(e) => setPurok(e.target.value)}>
              {purokOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select label="Status" fullWidth value={status} onChange={(e) => setStatus(e.target.value)}>
              {statusOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
        <ResidentTable
          residents={visible}
          onView={(id) => navigate(`/admin/residents/${id}`)}
          onEdit={(id) => window.alert(`Edit resident ${id}`)}
          onDelete={(id) => window.alert(`Delete resident ${id}`)}
        />
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="primary" />
        </Stack>
      </Paper>
    </Box>
  )
}
