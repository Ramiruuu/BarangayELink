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

const fallbackItems = [
  {
    id: 'giveaway-1',
    title: 'Senior Citizen Support Pack',
    details: 'Food and hygiene assistance for senior citizens registered with Barangay 28.',
    requirements: 'Senior ID or barangay ID',
    available: 100,
  },
  {
    id: 'giveaway-2',
    title: 'Student Education Kit',
    details: 'School supplies and learning materials for eligible students.',
    requirements: 'Student ID',
    available: 80,
  },
]

export default function Giveaways() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(null)

  useEffect(() => {
    const loadGiveaways = async () => {
      setLoading(true)
      const [giveawayRes, claimRes] = await Promise.all([
        supabase.from('giveaways').select('*').order('title', { ascending: true }),
        supabase
          .from('giveaway_claims')
          .select('giveaway_id')
          .eq('user_id', user?.uid),
      ])

      if (giveawayRes.error) {
        console.warn('Giveaways table unavailable, using fallback data', giveawayRes.error)
        setItems(fallbackItems)
      } else {
        setItems(giveawayRes.data || fallbackItems)
      }

      if (!claimRes.error) {
        setClaims(claimRes.data.map((item) => item.giveaway_id))
      }

      setLoading(false)
    }

    if (user) {
      loadGiveaways()
    }
  }, [user])

  const claimedItems = useMemo(() => new Set(claims), [claims])

  const handleClaim = async (itemId) => {
    setClaiming(itemId)
    const payload = {
      user_id: user.uid,
      giveaway_id: itemId,
      claimed_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('giveaway_claims').insert(payload)
    if (error) {
      toast.error('Unable to claim giveaway')
      console.error(error)
    } else {
      toast.success('Giveaway claim recorded')
      setClaims((current) => [...current, itemId])
    }
    setClaiming(null)
  }

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Barangay assistance programs
          </Typography>
          <Typography color="text.secondary">
            Claim available giveaway packages for qualified residents.
          </Typography>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => {
            const isClaimed = claimedItems.has(item.id)
            return (
              <Grid item xs={12} md={6} key={item.id}>
                <Card>
                  <CardContent sx={{ display: 'grid', gap: 1 }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography color="text.secondary">{item.details}</Typography>
                    <Typography>
                      <strong>Requirements:</strong> {item.requirements}
                    </Typography>
                    <Typography>
                      <strong>Available:</strong> {item.available}
                    </Typography>
                    <Box sx={{ pt: 2 }}>
                      <Button
                        variant="contained"
                        disabled={isClaimed}
                        onClick={() => handleClaim(item.id)}
                      >
                        {isClaimed ? 'Already claimed' : claiming === item.id ? 'Claiming…' : 'Claim this item'}
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
