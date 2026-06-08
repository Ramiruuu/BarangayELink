import { useEffect, useMemo, useState } from 'react'
import { Box, Card, CardContent, CircularProgress, Grid, List, ListItem, ListItemText, Typography } from '@mui/material'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../supabase.js'

const fallbackMessages = [
  { id: 'note-1', title: 'Welcome to BarangayELink', body: 'You can now submit requests, join events, and claim assistance programs.' },
  { id: 'note-2', title: 'Document request received', body: 'Your Barangay Clearance request has been submitted for review.' },
]

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.uid)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Notifications table unavailable, using fallback items', error)
        setNotifications(fallbackMessages)
      } else {
        setNotifications(data || fallbackMessages)
      }
      setLoading(false)
    }

    if (user) {
      loadNotifications()
    }
  }, [user])

  const items = useMemo(() => notifications.slice(0, 10), [notifications])

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Notifications</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Stay informed about request updates, event confirmations, and program announcements.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {items.length > 0 ? (
              items.map((notification) => (
                <ListItem key={notification.id} divider>
                  <ListItemText primary={notification.title} secondary={notification.body} />
                </ListItem>
              ))
            ) : (
              <Typography color="text.secondary">No notifications yet.</Typography>
            )}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
