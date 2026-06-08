import { useEffect, useState } from 'react'
import { Box, Card, CardContent, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../supabase.js'

export default function Profile() {
  const { user, profile } = useAuth()
  const [history, setHistory] = useState({ requests: [], events: [], claims: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true)
      const [requestRes, eventRes, claimRes] = await Promise.all([
        supabase
          .from('document_requests')
          .select('*')
          .eq('user_id', user?.uid)
          .order('created_at', { ascending: false }),
        supabase
          .from('event_registrations')
          .select('event_id, registered_at, events(title)')
          .eq('user_id', user?.uid),
        supabase
          .from('giveaway_claims')
          .select('giveaway_id, claimed_at, giveaways(title)')
          .eq('user_id', user?.uid),
      ])

      setHistory({
        requests: requestRes.error ? [] : requestRes.data || [],
        events: eventRes.error ? [] : eventRes.data || [],
        claims: claimRes.error ? [] : claimRes.data || [],
      })

      if (requestRes.error || eventRes.error || claimRes.error) {
        toast.error('Some profile history could not be loaded')
      }
      setLoading(false)
    }

    if (user) {
      loadHistory()
    }
  }, [user])

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Your profile</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Keep your Barangay 28 profile information up to date.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField label="Full name" value={profile?.full_name || ''} fullWidth disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email" value={user?.email || ''} fullWidth disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Phone" value={profile?.phone || 'Not provided'} fullWidth disabled />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Request and registration history
          </Typography>
          {loading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2">Requests</Typography>
                    <Typography variant="h4">{history.requests.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2">Event registrations</Typography>
                    <Typography variant="h4">{history.events.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2">Giveaway claims</Typography>
                    <Typography variant="h4">{history.claims.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
