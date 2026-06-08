import { useMemo } from 'react'
import { Box, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import DescriptionIcon from '@mui/icons-material/Description'
import EventIcon from '@mui/icons-material/Event'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import BadgeIcon from '@mui/icons-material/Badge'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { useAuth } from '../context/AuthContext.jsx'

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Residents', path: '/admin/residents', icon: <PeopleIcon /> },
  { label: 'Document Requests', path: '/admin/requests', icon: <DescriptionIcon /> },
  { label: 'Events', path: '/admin/events', icon: <EventIcon /> },
  { label: 'Giveaways', path: '/admin/giveaways', icon: <CardGiftcardIcon /> },
  { label: 'Officials', path: '/admin/officials', icon: <BadgeIcon /> },
  { label: 'Reports', path: '/admin/reports', icon: <BarChartIcon /> },
  { label: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
]

export default function Sidebar({ collapsed, onToggleCollapsed }) {
  const navigate = useNavigate()
  const auth = useAuth()
  const initials = useMemo(() => auth.user?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'BE', [auth.user])

  const handleLogout = () => {
    auth.logout()
    navigate('/admin/login')
  }

  return (
    <Box sx={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: collapsed ? 88 : 260,
      bgcolor: 'background.paper',
      borderRight: 1,
      borderColor: 'divider',
      transition: 'width 0.25s ease',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10,
    }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
          <Box>
            <Typography fontWeight={700}>BarangayELink Admin</Typography>
            <Typography variant="caption" color="text.secondary">{initials}</Typography>
          </Box>
        )}
        <IconButton size="small" onClick={onToggleCollapsed}>
          <MenuOpenIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton key={item.path} component={NavLink} to={item.path} sx={{ px: collapsed ? 1.5 : 2 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
            {!collapsed && <ListItemText primary={item.label} />}
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleLogout} sx={{ px: collapsed ? 1.5 : 2 }}>
          <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Logout" />}
        </ListItemButton>
      </List>
    </Box>
  )
}
