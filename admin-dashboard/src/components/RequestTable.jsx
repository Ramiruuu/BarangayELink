import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography } from '@mui/material'
import StatusBadge from './StatusBadge.jsx'

export default function RequestTable({ requests, onView, onApprove, onDecline, onReady, onClaimed }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Request #</TableCell>
            <TableCell>Resident</TableCell>
            <TableCell>Document Type</TableCell>
            <TableCell>Fee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Requested Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} hover>
              <TableCell>{request.requestNumber}</TableCell>
              <TableCell>{request.residentName}</TableCell>
              <TableCell>{request.documentType}</TableCell>
              <TableCell>₱{request.fee}</TableCell>
              <TableCell><StatusBadge status={request.status} /></TableCell>
              <TableCell>{request.requestedDate}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {request.status === 'Pending' && (
                    <>
                      <Button size="small" color="success" variant="contained" onClick={() => onApprove(request)}>
                        Approve
                      </Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => onDecline(request)}>
                        Decline
                      </Button>
                    </>
                  )}
                  {request.status === 'Approved' && (
                    <Button size="small" variant="contained" onClick={() => onReady(request)}>
                      Mark as Ready
                    </Button>
                  )}
                  {request.status === 'Ready for Pickup' && (
                    <Button size="small" variant="contained" onClick={() => onClaimed(request)}>
                      Mark Claimed
                    </Button>
                  )}
                  <Button size="small" variant="outlined" onClick={() => onView(request)}>
                    View
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>No requests found.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
