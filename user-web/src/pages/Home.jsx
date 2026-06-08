import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../supabase.js'

const stats = [
  { label: 'Document requests', action: '/requests' },
  { label: 'Event registrations', action: '/events' },
  { label: 'Giveaway claims', action: '/giveaways' },
]

export default function Home() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ requests: 0, events: 0, claims: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      try {
        const requestCount = await supabase
          .from('document_requests')
          .select('id', { head: true, count: 'exact' })
          .eq('user_id', user?.uid)

        const eventCount = await supabase
          .from('event_registrations')
          .select('id', { head: true, count: 'exact' })
          .eq('user_id', user?.uid)

        const claimCount = await supabase
          .from('giveaway_claims')
          .select('id', { head: true, count: 'exact' })
          .eq('user_id', user?.uid)

        setCounts({
          requests: requestCount.count || 0,
          events: eventCount.count || 0,
          claims: claimCount.count || 0,
        })
      } catch (error) {
        console.error(error)
        toast.error('Unable to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadStats()
    }
  }, [user])

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Card>
        <CardContent sx={{ display: 'grid', gap: 1 }}>
          <Typography variant="h5">Barangay 28 Resident Portal</Typography>
          <Typography color="text.secondary">
            Welcome to BarangayELink. Use the menu at the top to request documents, join events, claim assistance programs, and review your history.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} md={4} key={item.label}>
            <Card sx={{ minHeight: 180, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {item.label}
                </Typography>
                <Typography variant="h3">
                  {loading ? <CircularProgress size={28} /> : [counts.requests, counts.events, counts.claims][index]}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Track your progress and see updates in real time.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button component={RouterLink} to={item.action} variant="contained" fullWidth>
                  Go to {item.label}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
