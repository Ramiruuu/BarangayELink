import { useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { getAppTheme } from './theme.js'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Residents from './pages/Residents.jsx'
import ResidentDetails from './pages/ResidentDetails.jsx'
import DocumentRequests from './pages/DocumentRequests.jsx'
import Events from './pages/Events.jsx'
import Giveaways from './pages/Giveaways.jsx'
import Officials from './pages/Officials.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'

function RequireAuth({ children }) {
  const auth = useAuth()
  if (!auth.user) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

function App() {
  const [mode, setMode] = useState('light')
  const theme = useMemo(() => getAppTheme(mode), [mode])

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminLayout mode={mode} onToggleMode={toggleMode} />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="residents" element={<Residents />} />
              <Route path="residents/:id" element={<ResidentDetails />} />
              <Route path="requests" element={<DocumentRequests />} />
              <Route path="events" element={<Events />} />
              <Route path="giveaways" element={<Giveaways />} />
              <Route path="officials" element={<Officials />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
