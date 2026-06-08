import { useMemo, useState } from 'react'
import { Box, Grid, Button, TextField, Tabs, Tab, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material'
import RequestTable from '../components/RequestTable.jsx'
import { documentRequests } from '../data/mockData.js'

const tabLabels = ['All', 'Pending', 'Approved', 'Ready for Pickup', 'Claimed', 'Declined']

export default function DocumentRequests() {
  const [tab, setTab] = useState(1)
  const [search, setSearch] = useState('')
  const [approveOpen, setApproveOpen] = useState(false)
  const [declineOpen, setDeclineOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')

  const filtered = useMemo(() => {
    return documentRequests.filter((request) => {
      const query = [request.requestNumber, request.residentName, request.documentType].join(' ').toLowerCase()
      const matchSearch = query.includes(search.toLowerCase())
      const matchTab = tabLabels[tab] === 'All' || request.status === tabLabels[tab]
      return matchSearch && matchTab
    })
  }, [search, tab])

  const openApprove = (request) => {
    setSelectedRequest(request)
    setNotes('')
    setApproveOpen(true)
  }

  const openDecline = (request) => {
    setSelectedRequest(request)
    setReason('')
    setDeclineOpen(true)
  }

  const handleApprove = () => {
    window.alert(`Approved ${selectedRequest.requestNumber}`)
    setApproveOpen(false)
  }

  const handleDecline = () => {
    if (!reason) return
    window.alert(`Declined ${selectedRequest.requestNumber}: ${reason}`)
    setDeclineOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Document Requests</Typography>
            <Typography color="text.secondary">Pending count: {documentRequests.filter((item) => item.status === 'Pending').length}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Request#, resident name, or document type" />
          </Grid>
        </Grid>
      </Paper>
      <Paper>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
          {tabLabels.map((label) => <Tab key={label} label={label} />)}
        </Tabs>
      </Paper>
      <RequestTable
        requests={filtered}
        onApprove={openApprove}
        onDecline={openDecline}
        onReady={(request) => window.alert(`Marked ready: ${request.requestNumber}`)}
        onClaimed={(request) => window.alert(`Marked claimed: ${request.requestNumber}`)}
        onView={(request) => window.alert(`View details for ${request.requestNumber}`)}
      />

      <Dialog open={approveOpen} onClose={() => setApproveOpen(false)} fullWidth>
        <DialogTitle>Approve Document Request</DialogTitle>
        <DialogContent>
          <Typography>Confirm approval for {selectedRequest?.requestNumber}?</Typography>
          <TextField fullWidth multiline rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} label="Notes (optional)" sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApprove}>Approve</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={declineOpen} onClose={() => setDeclineOpen(false)} fullWidth>
        <DialogTitle>Decline Document Request</DialogTitle>
        <DialogContent>
          <Typography>Reason for rejecting {selectedRequest?.requestNumber}</Typography>
          <TextField fullWidth multiline rows={3} value={reason} onChange={(e) => setReason(e.target.value)} label="Reason" sx={{ mt: 2 }} required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDecline}>Decline</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
