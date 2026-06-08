import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'

const drawerWidth = 260
const collapsedWidth = 88

export default function AdminLayout({ mode, onToggleMode }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <Box sx={{ flex: 1, ml: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`, transition: 'margin 0.25s ease' }}>
        <Header mode={mode} onToggleMode={onToggleMode} />
        <Box component="main" sx={{ p: 3, pt: 0, minHeight: 'calc(100vh - 88px)' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              BarangayELink Admin • Barangay 28, Cagayan de Oro City
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
              {location.pathname.includes('dashboard')
                ? 'Admin Dashboard'
                : location.pathname.includes('residents')
                ? 'Residents Management'
                : location.pathname.includes('requests')
                ? 'Document Requests'
                : location.pathname.includes('events')
                ? 'Events Management'
                : location.pathname.includes('giveaways')
                ? 'Giveaways Management'
                : location.pathname.includes('officials')
                ? 'Officials Management'
                : location.pathname.includes('reports')
                ? 'Reports'
                : location.pathname.includes('settings')
                ? 'Settings'
                : ''}
            </Typography>
          </Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
