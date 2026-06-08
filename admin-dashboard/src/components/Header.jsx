import { useMemo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header({ mode, onToggleMode }) {
  const auth = useAuth()
  const initials = useMemo(() => {
    if (!auth.user?.name) return 'BE'
    return auth.user.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
  }, [auth.user])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box>
        <Typography variant="h6">Barangay 28 Administrator</Typography>
        <Typography variant="body2" color="text.secondary">
          Admin dashboard for Barangay officials and staff
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={onToggleMode} color="inherit">
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.default', border: 1, borderColor: 'divider', px: 2, py: 1, borderRadius: 2 }}>
          <AccountCircleIcon />
          <Typography>{initials}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
