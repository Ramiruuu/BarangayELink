import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material'
import StatusBadge from './StatusBadge.jsx'

export default function ResidentTable({ residents, onView, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Purok</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Registered Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {residents.map((resident) => (
            <TableRow key={resident.id} hover>
              <TableCell>{`${resident.firstName} ${resident.lastName}`}</TableCell>
              <TableCell>{resident.email}</TableCell>
              <TableCell>{resident.contact}</TableCell>
              <TableCell>{resident.purok}</TableCell>
              <TableCell><StatusBadge status={resident.status} /></TableCell>
              <TableCell>{resident.registeredDate}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <Button size="small" variant="contained" onClick={() => onView(resident.id)}>View</Button>
                  <Button size="small" variant="outlined" onClick={() => onEdit(resident.id)}>Edit</Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => onDelete(resident.id)}>Delete</Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {residents.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>No residents found.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
