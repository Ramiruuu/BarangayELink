import { useState } from 'react'
import { Avatar, Button, TextField, Paper, Typography, Box, Alert } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('admin@barangay28.gov.ph')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const success = auth.login({ email, password })
    if (success) {
      navigate('/admin/dashboard')
    } else {
      setError('Invalid admin credentials')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
      <Paper sx={{ width: 420, p: 4 }} elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">BarangayELink Admin</Typography>
          <Typography color="text.secondary">Barangay 28, Cagayan de Oro City</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField fullWidth label="Email" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Sign In
          </Button>
        </Box>
        <Typography variant="caption" display="block" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
          Authorized personnel only
        </Typography>
      </Paper>
    </Box>
  )
}
