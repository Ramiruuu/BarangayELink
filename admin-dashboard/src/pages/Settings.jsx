import { useState } from 'react'
import { Box, Tabs, Tab, Paper, Grid, TextField, Button, FormControlLabel, Switch, Typography } from '@mui/material'

export default function Settings() {
  const [tab, setTab] = useState(0)
  const [barangayInfo, setBarangayInfo] = useState({ barangayName: 'Barangay 28', city: 'Cagayan de Oro City', address: 'Barangay Hall, Barangay 28', contact: '088-XXX-XXXX', email: 'info@barangay28.gov.ph', officeHours: '8:00 AM - 5:00 PM' })
  const [documentFees, setDocumentFees] = useState({ clearance: 20, id: 50, business: 100, others: 0 })
  const [systemSettings, setSystemSettings] = useState({ residentRegistration: true, maintenanceMode: false, notifications: true })
  const [showOfficials, setShowOfficials] = useState(true)

  const handleSave = () => window.alert('Settings saved')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper>
        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
          <Tab label="Barangay Information" />
          <Tab label="Officials Display" />
          <Tab label="Document Fees" />
          <Tab label="System Settings" />
        </Tabs>
      </Paper>
      {tab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField label="Barangay Name" fullWidth value={barangayInfo.barangayName} onChange={(e) => setBarangayInfo({ ...barangayInfo, barangayName: e.target.value })} /></Grid>
            <Grid item xs={12} md={6}><TextField label="City" fullWidth value={barangayInfo.city} onChange={(e) => setBarangayInfo({ ...barangayInfo, city: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField label="Barangay Hall Address" fullWidth multiline rows={3} value={barangayInfo.address} onChange={(e) => setBarangayInfo({ ...barangayInfo, address: e.target.value })} /></Grid>
            <Grid item xs={12} md={4}><TextField label="Contact Number" fullWidth value={barangayInfo.contact} onChange={(e) => setBarangayInfo({ ...barangayInfo, contact: e.target.value })} /></Grid>
            <Grid item xs={12} md={4}><TextField label="Email Address" fullWidth value={barangayInfo.email} onChange={(e) => setBarangayInfo({ ...barangayInfo, email: e.target.value })} /></Grid>
            <Grid item xs={12} md={4}><TextField label="Office Hours" fullWidth value={barangayInfo.officeHours} onChange={(e) => setBarangayInfo({ ...barangayInfo, officeHours: e.target.value })} /></Grid>
          </Grid>
        </Paper>
      )}
      {tab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography>Officials can be shown or hidden on the public portal, and their display order can be managed in the officials page.</Typography>
          <FormControlLabel control={<Switch checked={showOfficials} onChange={(e) => setShowOfficials(e.target.checked)} />} label="Show officials on public portal" sx={{ mt: 2 }} />
        </Paper>
      )}
      {tab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}><TextField label="Barangay Clearance" fullWidth type="number" value={documentFees.clearance} onChange={(e) => setDocumentFees({ ...documentFees, clearance: Number(e.target.value) })} InputProps={{ startAdornment: '₱' }} /></Grid>
            <Grid item xs={12} md={3}><TextField label="Barangay ID" fullWidth type="number" value={documentFees.id} onChange={(e) => setDocumentFees({ ...documentFees, id: Number(e.target.value) })} InputProps={{ startAdornment: '₱' }} /></Grid>
            <Grid item xs={12} md={3}><TextField label="Business Clearance" fullWidth type="number" value={documentFees.business} onChange={(e) => setDocumentFees({ ...documentFees, business: Number(e.target.value) })} InputProps={{ startAdornment: '₱' }} /></Grid>
            <Grid item xs={12} md={3}><TextField label="Others" fullWidth type="number" value={documentFees.others} onChange={(e) => setDocumentFees({ ...documentFees, others: Number(e.target.value) })} InputProps={{ startAdornment: '₱' }} /></Grid>
          </Grid>
        </Paper>
      )}
      {tab === 3 && (
        <Paper sx={{ p: 3 }}>
          <FormControlLabel control={<Switch checked={systemSettings.residentRegistration} onChange={(e) => setSystemSettings({ ...systemSettings, residentRegistration: e.target.checked })} />} label="Enable resident registration" />
          <FormControlLabel control={<Switch checked={systemSettings.maintenanceMode} onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })} />} label="Maintenance mode" />
          <FormControlLabel control={<Switch checked={systemSettings.notifications} onChange={(e) => setSystemSettings({ ...systemSettings, notifications: e.target.checked })} />} label="Notification settings" />
        </Paper>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSave}>Save Settings</Button>
      </Box>
    </Box>
  )
}
