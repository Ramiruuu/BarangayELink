import { Box, Button, Chip, Container, Divider, Grid, Link, Paper, Stack, Typography, useMediaQuery, useTheme, Avatar, IconButton } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useLandingData } from '../hooks/useLandingData'

// Import modern fonts
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'

// Icons
import {
  Description as DocumentIcon,
  Event as EventIcon,
  CardGiftcard as GiftIcon,
  NotificationsActive as NotificationIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
  VolunteerActivism as VolunteerIcon,
  Campaign as CampaignIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  KeyboardArrowDown as ArrowDownIcon,
  AutoAwesome as MagicIcon,
} from '@mui/icons-material'

const announcements = [
  { title: 'Barangay Assembly', date: 'June 30, 2024', description: 'Quarterly Barangay Assembly at Barangay Hall, 9:00 AM' },
  { title: 'Free Medical Mission', date: 'July 15, 2024', description: 'Free checkup, dental, and medicine distribution' },
  { title: 'Educational Assistance', date: 'Until July 30', description: 'Scholarship applications now open for qualified students' },
]

const stats = [
  { value: '2,847', label: 'Total Residents', icon: <PeopleIcon />, delay: 0 },
  { value: '712', label: 'Households', icon: <HomeIcon />, delay: 0.1 },
  { value: '8', label: 'Puroks', icon: <LocationIcon />, delay: 0.2 },
  { value: '99%', label: 'Digital Services', icon: <SpeedIcon />, delay: 0.3 },
]

const features = [
  {
    title: 'Document Requests',
    icon: <DocumentIcon />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'Request Barangay Clearance, Certificate of Indigency, Residency, and other official documents online without pila.',
    items: ['Barangay Clearance (₱20)', 'Certificate of Indigency (Free)', 'Certificate of Residency (Free)', 'Barangay ID (₱50)', 'Business Clearance (₱100)'],
  },
  {
    title: 'Barangay Events',
    icon: <EventIcon />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: 'Stay informed about barangay activities, medical missions, sports festivals, and community gatherings.',
    items: ['Barangay Assemblies', 'Medical Missions', 'Vaccination Drives', 'Clean-Up Drives', 'Sports Festival'],
  },
  {
    title: 'Assistance Programs',
    icon: <VolunteerIcon />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    description: 'Claim rice, medical, educational, and financial assistance programs for qualified residents.',
    items: ['Rice Assistance (Senior Citizens)', 'Educational Assistance (Students)', 'Medical Assistance (PWDs)', 'Financial Aid (4Ps)', 'Disaster Relief'],
  },
  {
    title: 'Real-time Updates',
    icon: <NotificationIcon />,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    description: 'Receive instant notifications about barangay announcements, emergency alerts, and important reminders.',
    items: ['Emergency Alerts', 'Weather Advisories', 'Event Reminders', 'Document Ready Notifications', 'Barangay News'],
  },
]

const steps = [
  { number: '01', title: 'Create Account', subtitle: 'Sign up with your email or phone number' },
  { number: '02', title: 'Verify Identity', subtitle: 'Confirm your residency in Barangay 28' },
  { number: '03', title: 'Request Services', subtitle: 'Apply for documents, events, or assistance' },
  { number: '04', title: 'Claim & Receive', subtitle: 'Get notified when your request is ready' },
]

const officials = [
  { name: 'Hon. Hilarion Nagar', role: 'Punong Barangay' },
  { name: 'Kagawad Maria R. Santos', role: 'Barangay Kagawad' },
  { name: 'Kagawad Jose P. Rizal', role: 'Barangay Kagawad' },
  { name: 'Kagawad Teresa M. Lopez', role: 'Barangay Kagawad' },
  { name: 'SK Chair Marc Caubanan', role: 'SK Chairman' },
  { name: 'Ms. Lourdes P. Cruz', role: 'Barangay Secretary' },
  { name: 'Mr. Ricardo M. Tan', role: 'Barangay Treasurer' },
]

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
}

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
}

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
}

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
}

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -8, transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] } }
}

// Fallback data if Supabase is not available
const defaultAnnouncements = [
  { title: 'Barangay Assembly', date: 'June 30, 2024', description: 'Quarterly Barangay Assembly at Barangay Hall, 9:00 AM' },
  { title: 'Free Medical Mission', date: 'July 15, 2024', description: 'Free checkup, dental, and medicine distribution' },
  { title: 'Educational Assistance', date: 'Until July 30', description: 'Scholarship applications now open for qualified students' },
]

const defaultStats = [
  { value: '2,847', label: 'Total Residents', icon: <PeopleIcon />, delay: 0 },
  { value: '712', label: 'Households', icon: <HomeIcon />, delay: 0.1 },
  { value: '8', label: 'Puroks', icon: <LocationIcon />, delay: 0.2 },
  { value: '99%', label: 'Digital Services', icon: <SpeedIcon />, delay: 0.3 },
]

const defaultOfficials = [
  { name: 'Hon. Hilarion Nagar', role: 'Punong Barangay' },
  { name: 'Kagawad Maria R. Santos', role: 'Barangay Kagawad' },
  { name: 'Kagawad Jose P. Rizal', role: 'Barangay Kagawad' },
  { name: 'Kagawad Teresa M. Lopez', role: 'Barangay Kagawad' },
  { name: 'SK Chair Marc Caubanan', role: 'SK Chairman' },
  { name: 'Ms. Lourdes P. Cruz', role: 'Barangay Secretary' },
  { name: 'Mr. Ricardo M. Tan', role: 'Barangay Treasurer' },
]

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:960px)')
  const [activeAnnouncement, setActiveAnnouncement] = useState(0)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  
  // Fetch data from Supabase
  const { announcements: dbAnnouncements, statistics: dbStats, officials: dbOfficials, assistancePrograms: dbPrograms, documents: dbDocuments, loading, error } = useLandingData()
  
  // Use database data if available, otherwise use fallback
  const announcements = dbAnnouncements.length > 0 ? dbAnnouncements.map(a => ({ title: a.title, date: a.date, description: a.description })) : defaultAnnouncements
  const stats = dbStats.length > 0 ? dbStats.map(s => ({ value: s.value, label: s.label, icon: <PeopleIcon />, delay: 0 })) : defaultStats
  const officials = dbOfficials.length > 0 ? dbOfficials : defaultOfficials

  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAnnouncement((prev) => (prev + 1) % announcements.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={{ 
      bgcolor: '#ffffff', 
      fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* Animated Gradient Background */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: 'radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.03) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(37, 99, 235, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Navigation Bar with Glass Effect */}
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
        bgcolor: 'rgba(255,255,255,0.9)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: { xs: 2, md: 2.5 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                BarangayELink
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Stack direction="row" spacing={2}>
                <Button 
                  component={RouterLink} 
                  to="/login" 
                  variant="text"
                  sx={{ 
                    color: '#4b5563',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    borderRadius: '12px',
                    px: 2.5,
                    '&:hover': { bgcolor: 'rgba(37,99,235,0.05)', color: '#2563eb' }
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/signup" 
                  variant="contained"
                  sx={{ 
                    bgcolor: '#2563eb',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    px: 3,
                    py: 0.75,
                    borderRadius: '40px',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                    '&:hover': { bgcolor: '#1d4ed8', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s'
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Hero Section with Parallax */}
      <Box sx={{ py: { xs: 6, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeLeft}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Chip 
                    label="✨ Official Barangay 28 Portal" 
                    sx={{ 
                      mb: 3,
                      bgcolor: 'rgba(37,99,235,0.1)',
                      color: '#2563eb',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: '28px',
                      borderRadius: '40px',
                      fontFamily: 'inherit'
                    }} 
                  />
                </motion.div>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: '#111827',
                    mb: 1.5,
                    lineHeight: 1.1,
                    fontFamily: '"Space Grotesk", sans-serif'
                  }}
                >
                  BarangayELink
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                    fontWeight: 400,
                    color: '#6b7280',
                    mb: 2,
                    letterSpacing: '-0.01em'
                  }}
                >
                  Barangay 28, Cagayan de Oro City
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    color: '#6b7280',
                    maxWidth: 560,
                    mb: 4,
                    lineHeight: 1.6
                  }}
                >
                  Your digital gateway to barangay services. Request documents, stay updated on events, and claim assistance programs - all in one place. No more long lines and waiting.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      component={RouterLink} 
                      to="/signup" 
                      variant="contained" 
                      size="large"
                      endIcon={<ArrowIcon />}
                      sx={{ 
                        bgcolor: '#2563eb',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        px: 4,
                        py: 1.25,
                        borderRadius: '40px',
                        boxShadow: '0 8px 20px rgba(37,99,235,0.3)',
                        '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 12px 28px rgba(37,99,235,0.4)' }
                      }}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      component={RouterLink} 
                      to="/login" 
                      variant="outlined" 
                      size="large"
                      sx={{ 
                        color: '#4b5563',
                        borderColor: '#e5e7eb',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        px: 4,
                        py: 1.25,
                        borderRadius: '40px',
                        '&:hover': { borderColor: '#2563eb', bgcolor: 'rgba(37,99,235,0.02)' }
                      }}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Stack>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeRight}
              >
                <Paper elevation={0} sx={{ 
                  p: 4, 
                  borderRadius: '32px', 
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(37,99,235,0.1)',
                  boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="subtitle2" sx={{ color: '#2563eb', mb: 2, fontWeight: 600, letterSpacing: '0.5px' }}>
                    LATEST ANNOUNCEMENT
                  </Typography>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeAnnouncement}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 1 }}>
                        {announcements[activeAnnouncement].date}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
                        {announcements[activeAnnouncement].title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.5 }}>
                        {announcements[activeAnnouncement].description}
                      </Typography>
                    </motion.div>
                  </AnimatePresence>
                  <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                    {announcements.map((_, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        style={{ flex: 1 }}
                      >
                        <Box
                          onClick={() => setActiveAnnouncement(index)}
                          sx={{
                            height: 4,
                            borderRadius: '4px',
                            bgcolor: index === activeAnnouncement ? '#2563eb' : '#e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      </motion.div>
                    ))}
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity, scale }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <IconButton sx={{ color: '#9ca3af' }}>
              <ArrowDownIcon />
            </IconButton>
          </Box>
        </motion.div>
      </Box>

      {/* Stats Section with Floating Animation */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                  <motion.div
                    variants={scaleUp}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper elevation={0} sx={{ 
                      p: { xs: 3, md: 4 }, 
                      textAlign: 'center',
                      borderRadius: '24px',
                      bgcolor: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                    }}>
                      <Box sx={{ 
                        color: '#2563eb', 
                        mb: 1.5,
                        display: 'inline-flex',
                        p: 1.5,
                        borderRadius: '16px',
                        bgcolor: 'rgba(37,99,235,0.1)'
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h3" sx={{ 
                        fontWeight: 700, 
                        color: '#111827', 
                        mb: 0.5, 
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        fontFamily: '"Space Grotesk", sans-serif'
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 400 }}>
                        {stat.label}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section with Hover Cards */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Typography variant="h3" sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              mb: 2, 
              color: '#111827',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontFamily: '"Space Grotesk", sans-serif'
            }}>
              Services for Barangay 28 Residents
            </Typography>
            <Typography variant="body1" sx={{ 
              textAlign: 'center', 
              color: '#6b7280', 
              maxWidth: 700, 
              mx: 'auto', 
              mb: 6,
              fontSize: '1.125rem',
              lineHeight: 1.6
            }}>
              Access essential barangay services anytime, anywhere. No more waiting in long lines.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid key={feature.title} size={{ xs: 12, sm: 6 }}>
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  variants={cardHover}
                  viewport={{ once: true }}
                >
                  <Paper elevation={0} sx={{
                    p: 4,
                    borderRadius: '24px',
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 100,
                      height: 100,
                      background: feature.gradient,
                      opacity: 0.05,
                      borderRadius: '0 0 0 100%',
                    }} />
                    <Box sx={{ 
                      width: 56,
                      height: 56,
                      borderRadius: '20px',
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      color: 'white'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5, color: '#111827' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: '#f0f0f0' }} />
                    <Stack spacing={1}>
                      {feature.items.map((item) => (
                        <Typography key={item} variant="body2" sx={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#2563eb' }} />
                          {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section with Timeline */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Typography variant="h3" sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              mb: 2, 
              color: '#111827',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontFamily: '"Space Grotesk", sans-serif'
            }}>
              How It Works
            </Typography>
            <Typography variant="body1" sx={{ 
              textAlign: 'center', 
              color: '#6b7280', 
              maxWidth: 600, 
              mx: 'auto', 
              mb: 6,
              fontSize: '1.125rem'
            }}>
              Get started with BarangayELink in 4 simple steps
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid key={step.number} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={scaleUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        borderRadius: '40px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(37,99,235,0.3)'
                      }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
                          {step.number}
                        </Typography>
                      </Box>
                    </motion.div>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.5 }}>
                      {step.subtitle}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Officials & Contact Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeLeft}
              >
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  mb: 1, 
                  color: '#111827',
                  fontSize: { xs: '1.75rem', md: '2rem' },
                  fontFamily: '"Space Grotesk", sans-serif'
                }}>
                  Barangay 28 Officials
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b7280', mb: 4, fontSize: '1rem' }}>
                  Serving the community with dedication and excellence
                </Typography>
                <Grid container spacing={2}>
                  {officials.map((official, index) => (
                    <Grid key={official.name} size={{ xs: 12, sm: 6 }}>
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleUp}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        <Paper elevation={0} sx={{ 
                          p: 2.5, 
                          borderRadius: '20px', 
                          bgcolor: '#f8fafc',
                          border: '1px solid #f0f0f0',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: 'rgba(37,99,235,0.1)', 
                              color: '#2563eb', 
                              width: 48, 
                              height: 48, 
                              fontWeight: 600 
                            }}>
                              {official.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>
                                {official.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                                {official.role}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeRight}
              >
                <Paper elevation={0} sx={{ 
                  p: 4, 
                  borderRadius: '24px', 
                  bgcolor: '#f8fafc',
                  border: '1px solid #f0f0f0',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(37,99,235,0.05)',
                  }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#111827' }}>
                    Barangay 28 Information
                  </Typography>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 16 }} /> ADDRESS
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4b5563' }}>
                        Barangay Hall, Barangay 28, Cagayan de Oro City
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 16 }} /> CONTACT
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4b5563' }}>
                        (088) 123-4567 | barangay28@cdo.gov.ph
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16 }} /> OFFICE HOURS
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4b5563' }}>
                        Monday - Friday: 8:00 AM - 5:00 PM
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4b5563' }}>
                        Saturday: 9:00 AM - 12:00 PM | Sunday: Closed
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        EMERGENCY HOTLINE: 0917 123 4567
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ my: 3, borderColor: '#e5e7eb' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
                    Follow Us
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#2563eb', bgcolor: 'rgba(37,99,235,0.1)' } }}>
                      <FacebookIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#2563eb', bgcolor: 'rgba(37,99,235,0.1)' } }}>
                      <TwitterIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#2563eb', bgcolor: 'rgba(37,99,235,0.1)' } }}>
                      <InstagramIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section with Particle Effect */}
      <Box sx={{ py: { xs: 8, md: 10 }, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                mb: 2, 
                color: '#ffffff',
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontFamily: '"Space Grotesk", sans-serif'
              }}>
                Ready to access barangay services?
              </Typography>
              <Typography variant="body1" sx={{ 
                mb: 4, 
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 600,
                mx: 'auto',
                fontSize: '1.125rem'
              }}>
                Join thousands of Barangay 28 residents already using BarangayELink.
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  size="large"
                  endIcon={<MagicIcon />}
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#2563eb',
                    px: 5,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '40px',
                    fontFamily: 'inherit',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-2px)' }
                  }}
                >
                  Create Your Account Now
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#ffffff', borderTop: '1px solid #eef2f6', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                © 2024 BarangayELink. All rights reserved.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', textAlign: { xs: 'left', md: 'center' } }}>
                Barangay 28, Cagayan de Oro City
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={3} sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Link href="#" underline="hover" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Privacy Policy
                </Link>
                <Link href="#" underline="hover" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Terms of Service
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}