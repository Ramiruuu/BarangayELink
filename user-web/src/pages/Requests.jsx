import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../supabase.js'

const schema = z.object({
  documentType: z.string().min(1, 'Select document type'),
  purpose: z.string().min(5, 'Provide a reason'),
})

const documentOptions = [
  'Barangay Clearance',
  'Police Clearance',
  'Business Permit',
  'Indigency Certificate',
]

export default function Requests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { documentType: '', purpose: '' },
  })

  const statusBadge = useMemo(
    () => ({
      Pending: 'warning.main',
      Approved: 'info.main',
      'Ready for Pickup': 'success.main',
      Claimed: 'secondary.main',
      Declined: 'error.main',
    }),
    [],
  )

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('document_requests')
        .select('*')
        .eq('user_id', user?.uid)
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Unable to load requests')
        console.error(error)
      } else {
        setRequests(data || [])
      }
      setLoading(false)
    }

    if (user) {
      loadRequests()
    }
  }, [user])

  const onSubmit = async (values) => {
    setCreating(true)
    const payload = {
      user_id: user.uid,
      document_type: values.documentType,
      purpose: values.purpose,
      status: 'Pending',
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('document_requests').insert(payload)
    if (error) {
      toast.error('Unable to submit request')
      console.error(error)
    } else {
      toast.success('Document request submitted')
      setRequests((prev) => [{ ...payload, id: Date.now() }, ...prev])
      reset()
    }
    setCreating(false)
  }

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Submit a document request
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Request clearances, permits, and official barangay documents online.
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2, maxWidth: 620 }}>
            <FormControl fullWidth>
              <InputLabel id="document-type-label">Document type</InputLabel>
              <Controller
                name="documentType"
                control={control}
                render={({ field }) => (
                  <Select labelId="document-type-label" label="Document type" {...field}>
                    {documentOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <Controller
              name="purpose"
              control={control}
              render={({ field }) => (
                <TextField label="Purpose" multiline minRows={3} fullWidth {...field} />
              )}
            />
            <Button type="submit" variant="contained" disabled={creating}>
              {creating ? 'Sending request…' : 'Submit request'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your document request history
          </Typography>
          {loading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Requested</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.document_type}</TableCell>
                        <TableCell>{request.purpose}</TableCell>
                        <TableCell sx={{ color: statusBadge[request.status] || 'text.primary' }}>
                          {request.status}
                        </TableCell>
                        <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ py: 4, textAlign: 'center' }}>
                        No requests submitted yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
