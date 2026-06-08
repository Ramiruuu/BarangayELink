import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/app')
    } catch (error) {
      toast.error(error.message || 'Unable to login')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Sign in to BarangayELink
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Use your Barangay 28 account to request services and stay updated.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" variant="contained" size="large" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography>
            Don’t have an account?{' '}
            <Link component={RouterLink} to="/signup">
              Create one now.
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}
