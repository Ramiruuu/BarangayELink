import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../supabase.js'

const fallbackEvents = [
  {
    id: 'event-1',
    title: 'Barangay Health Fair',
    description: 'Free medical consults, vaccination updates, and wellness talks for residents.',
    start_date: '2026-07-20T09:00:00Z',
    location: 'Barangay Multi-Purpose Hall',
    status: 'Open',
    max_slots: 120,
  },
  {
    id: 'event-2',
    title: 'Business Permit Assistance',
    description: 'Guidance on applying for or renewing your business permit.',
    start_date: '2026-08-05T10:00:00Z',
    location: 'Barangay Office',
    status: 'Open',
    max_slots: 80,
  },
]

export default function Events() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(null)

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const [eventsRes, registrationRes] = await Promise.all([
        supabase.from('events').select('*').order('start_date', { ascending: true }),
        supabase
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user?.uid),
      ])

      if (eventsRes.error) {
        console.warn('Events table unavailable, using fallback data', eventsRes.error)
        setEvents(fallbackEvents)
      } else {
        setEvents(eventsRes.data || fallbackEvents)
      }

      if (!registrationRes.error) {
        setRegistrations(registrationRes.data.map((item) => item.event_id))
      }

      setLoading(false)
    }

    if (user) {
      loadEvents()
    }
  }, [user])

  const registeredEventIds = useMemo(() => new Set(registrations), [registrations])

  const handleRegister = async (eventId) => {
    setRegistering(eventId)
    const payload = {
      user_id: user.uid,
      event_id: eventId,
      registered_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('event_registrations').insert(payload)
    if (error) {
      toast.error('Unable to register for event')
      console.error(error)
    } else {
      toast.success('You are registered for this event')
      setRegistrations((current) => [...current, eventId])
    }
    setRegistering(null)
  }

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Upcoming barangay events
          </Typography>
          <Typography color="text.secondary">
            Browse resident events and register for programs supported by Barangay 28.
          </Typography>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => {
            const isRegistered = registeredEventIds.has(event.id)
            return (
              <Grid item xs={12} md={6} key={event.id}>
                <Card>
                  <CardContent sx={{ display: 'grid', gap: 1 }}>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography color="text.secondary">{event.description}</Typography>
                    <Typography sx={{ mt: 1 }}>
                      <strong>Date:</strong> {new Date(event.start_date).toLocaleString()}
                    </Typography>
                    <Typography>
                      <strong>Location:</strong> {event.location}
                    </Typography>
                    <Typography>
                      <strong>Status:</strong> {event.status}
                    </Typography>
                    <Box sx={{ pt: 2 }}>
                      <Button
                        variant="contained"
                        disabled={isRegistered || event.status !== 'Open'}
                        onClick={() => handleRegister(event.id)}
                      >
                        {isRegistered ? 'Registered' : registering === event.id ? 'Registering…' : 'Register'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}
