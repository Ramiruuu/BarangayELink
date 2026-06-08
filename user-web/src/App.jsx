import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import MainLayout from './components/MainLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'
import Requests from './pages/Requests.jsx'
import Events from './pages/Events.jsx'
import Giveaways from './pages/Giveaways.jsx'
import Profile from './pages/Profile.jsx'
import Notifications from './pages/Notifications.jsx'
import './App.css'

function App() {
  return (
    <>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/app" element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="requests" element={<Requests />} />
                <Route path="events" element={<Events />} />
                <Route path="giveaways" element={<Giveaways />} />
                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<Notifications />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </>
  )
}

export default App
