import { useState } from 'react'
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import DescriptionIcon from '@mui/icons-material/Description'
import EventIcon from '@mui/icons-material/Event'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import PersonIcon from '@mui/icons-material/Person'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { label: 'Home', path: '/app', icon: <HomeIcon fontSize="small" /> },
  { label: 'Requests', path: '/app/requests', icon: <DescriptionIcon fontSize="small" /> },
  { label: 'Events', path: '/app/events', icon: <EventIcon fontSize="small" /> },
  { label: 'Giveaways', path: '/app/giveaways', icon: <CardGiftcardIcon fontSize="small" /> },
  { label: 'Profile', path: '/app/profile', icon: <PersonIcon fontSize="small" /> },
  { label: 'Notifications', path: '/app/notifications', icon: <NotificationsIcon fontSize="small" /> },
]

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', color: '#000' }}>B</Avatar>
              <Box>
                <Typography variant="h6">BarangayELink</Typography>
                <Typography variant="caption" color="secondary.light">
                  Barangay 28 Services at Your Fingertips
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexWrap: 'wrap' }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color={location.pathname === item.path ? 'secondary' : 'inherit'}
                  startIcon={item.icon}
                  sx={{ textTransform: 'none' }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <IconButton color="inherit" onClick={handleMenuOpen} sx={{ display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>

            <Button onClick={handleLogout} color="inherit" sx={{ whiteSpace: 'nowrap' }}>
              Log out
            </Button>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={handleMenuClose}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {profile?.full_name || user?.email}
            </Typography>
            <Typography color="text.secondary">
              Access requests, events, assistance programs, and your profile in one place.
            </Typography>
          </Box>
        </Box>
        <Outlet />
      </Container>
    </Box>
  )
}
