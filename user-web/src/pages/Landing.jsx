import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect } from 'react'

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true })
    }
  }, [user, navigate])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 8 }}>
          <Stack direction="row" spacing={2}>
            <Button component={RouterLink} to="/login" variant="outlined" size="large">
              Login
            </Button>
            <Button component={RouterLink} to="/signup" variant="contained" size="large">
              Sign up
            </Button>
          </Stack>
        </Box>

        <Box sx={{ display: 'grid', gap: 3, alignItems: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Barangay 28 Services at Your Fingertips
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640 }}>
            BarangayELink helps residents request documents, join events, claim assistance programs, and stay informed on the go.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 2 }}>
            <Button component={RouterLink} to="/signup" variant="contained" size="large">
              Create account
            </Button>
            <Button component={RouterLink} to="/login" variant="outlined" size="large">
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
