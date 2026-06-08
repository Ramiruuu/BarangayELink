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

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await signup(fullName, email, password)
      toast.success('Account created successfully')
      navigate('/app')
    } catch (error) {
      toast.error(error.message || 'Unable to create account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Create your BarangayELink account
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign up and start requesting documents, events, and giveaways.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Full name"
              required
              fullWidth
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
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
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Sign in.
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}
