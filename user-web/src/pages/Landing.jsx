import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  Avatar,
  IconButton,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLandingData } from '../hooks/useLandingData'

import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import {
  Description as DocumentIcon,
  Event as EventIcon,
  NotificationsActive as NotificationIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowIcon,
  VolunteerActivism as VolunteerIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  AutoAwesome as MagicIcon,
} from '@mui/icons-material'

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  blue900: '#1e3a8a',
  blue800: '#1e40af',
  blue700: '#1d4ed8',
  blue600: '#2563eb',
  blue500: '#3b82f6',
  blue400: '#60a5fa',
  blue100: '#dbeafe',
  blue50:  '#eff6ff',
  white:   '#ffffff',
  gray50:  '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray700: '#334155',
  gray900: '#0f172a',
}

// ─── Static fallback data ────────────────────────────────────────────────────
const defaultAnnouncements = [
  { title: 'Barangay Assembly', date: 'June 30, 2024', description: 'Quarterly Barangay Assembly at Barangay Hall, 9:00 AM.' },
  { title: 'Free Medical Mission', date: 'July 15, 2024', description: 'Free checkup, dental, and medicine distribution for residents.' },
  { title: 'Educational Assistance', date: 'Until July 30', description: 'Scholarship applications now open for qualified students.' },
]

const defaultStats = [
  { value: '2,847', label: 'Total Residents', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
  { value: '712',   label: 'Households',      icon: <HomeIcon    sx={{ fontSize: 20 }} /> },
  { value: '8',     label: 'Puroks',          icon: <LocationIcon sx={{ fontSize: 20 }} /> },
  { value: '99%',   label: 'Digital Services', icon: <SpeedIcon  sx={{ fontSize: 20 }} /> },
]

const features = [
  {
    title: 'Document Requests',
    icon: <DocumentIcon sx={{ fontSize: 22, color: C.white }} />,
    accentBg: C.blue600,
    description: 'Request Barangay Clearance, Certificate of Indigency, Residency, and other official documents online — no more pila.',
    items: ['Barangay Clearance (₱20)', 'Certificate of Indigency (Free)', 'Certificate of Residency (Free)', 'Barangay ID (₱50)', 'Business Clearance (₱100)'],
  },
  {
    title: 'Barangay Events',
    icon: <EventIcon sx={{ fontSize: 22, color: C.white }} />,
    accentBg: C.blue500,
    description: 'Stay informed about barangay activities, medical missions, sports festivals, and community gatherings.',
    items: ['Barangay Assemblies', 'Medical Missions', 'Vaccination Drives', 'Clean-Up Drives', 'Sports Festival'],
  },
  {
    title: 'Assistance Programs',
    icon: <VolunteerIcon sx={{ fontSize: 22, color: C.white }} />,
    accentBg: C.blue700,
    description: 'Claim rice, medical, educational, and financial assistance programs for qualified residents of Barangay 28.',
    items: ['Rice Assistance (Senior Citizens)', 'Educational Assistance (Students)', 'Medical Assistance (PWDs)', 'Financial Aid (4Ps)', 'Disaster Relief'],
  },
  {
    title: 'Real-time Updates',
    icon: <NotificationIcon sx={{ fontSize: 22, color: C.white }} />,
    accentBg: C.blue800,
    description: 'Receive instant notifications about barangay announcements, emergency alerts, and important reminders.',
    items: ['Emergency Alerts', 'Weather Advisories', 'Event Reminders', 'Document Ready Notifications', 'Barangay News'],
  },
]

const steps = [
  { number: '01', title: 'Create Account',   subtitle: 'Sign up with your email or phone number' },
  { number: '02', title: 'Verify Identity',  subtitle: 'Confirm your residency in Barangay 28' },
  { number: '03', title: 'Request Services', subtitle: 'Apply for documents, events, or assistance' },
  { number: '04', title: 'Claim & Receive',  subtitle: 'Get notified when your request is ready' },
]

const defaultOfficials = [
  { name: 'Hon. Hilarion Nagar',    role: 'Punong Barangay' },
  { name: 'Kgwd. Maria R. Santos',  role: 'Barangay Kagawad' },
  { name: 'Kgwd. Jose P. Rizal',    role: 'Barangay Kagawad' },
  { name: 'Kgwd. Teresa M. Lopez',  role: 'Barangay Kagawad' },
  { name: 'SK Chair Marc Caubanan', role: 'SK Chairman' },
  { name: 'Ms. Lourdes P. Cruz',    role: 'Barangay Secretary' },
  { name: 'Mr. Ricardo M. Tan',     role: 'Barangay Treasurer' },
]

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
}
const fadeLeft = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
}
const fadeRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
}
const scaleUp = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

// ─── Shared sx helpers ───────────────────────────────────────────────────────
const sectionLabel = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  color: C.blue600,
  mb: 1,
  textTransform: 'uppercase',
}

const sectionTitle = (fontSize = { xs: '1.6rem', md: '2.25rem' }) => ({
  fontWeight: 700,
  letterSpacing: '-0.025em',
  color: C.gray900,
  lineHeight: 1.15,
  mb: 1.5,
  fontSize,
})

const sectionSubtitle = {
  color: C.gray500,
  fontSize: { xs: '0.9rem', md: '1rem' },
  lineHeight: 1.7,
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Landing() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const isMobile  = useMediaQuery('(max-width:600px)')
  const isTablet  = useMediaQuery('(max-width:960px)')
  const [activeAnn, setActiveAnn] = useState(0)

  const {
    announcements: dbAnn,
    statistics:    dbStats,
    officials:     dbOfficials,
    loading,
  } = useLandingData()

  const announcements = dbAnn.length > 0
    ? dbAnn.map(a => ({ title: a.title, date: a.date, description: a.description }))
    : defaultAnnouncements
  const stats     = dbStats.length > 0
    ? dbStats.map((s, i) => ({ ...defaultStats[i % defaultStats.length], value: s.value, label: s.label }))
    : defaultStats
  const officials = dbOfficials.length > 0 ? dbOfficials : defaultOfficials

  useEffect(() => { if (user) navigate('/app', { replace: true }) }, [user, navigate])

  useEffect(() => {
    const id = setInterval(() => setActiveAnn(p => (p + 1) % announcements.length), 5000)
    return () => clearInterval(id)
  }, [announcements.length])

  return (
    <Box sx={{ bgcolor: C.white, fontFamily: '"Inter", system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${C.gray200}`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: { xs: 1.75, md: 2 },
          }}>
            {/* Logo */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <Typography sx={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: { xs: '1.1rem', md: '1.25rem' }, color: C.gray900 }}>
                Barangay<Box component="span" sx={{ color: C.blue600 }}>ELink</Box>
              </Typography>
            </motion.div>

            {/* Nav actions */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button
                  component={RouterLink} to="/login"
                  sx={{
                    color: C.gray700, textTransform: 'none', fontWeight: 500,
                    fontSize: '0.875rem', fontFamily: 'inherit',
                    px: 2, borderRadius: '8px',
                    '&:hover': { bgcolor: C.blue50, color: C.blue600 },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink} to="/signup"
                  variant="contained"
                  sx={{
                    bgcolor: C.blue600, textTransform: 'none', fontWeight: 600,
                    fontSize: '0.875rem', fontFamily: 'inherit',
                    px: { xs: 2, md: 3 }, py: 0.875,
                    borderRadius: '8px',
                    boxShadow: `0 1px 4px rgba(37,99,235,0.25)`,
                    '&:hover': { bgcolor: C.blue700, boxShadow: `0 4px 12px rgba(37,99,235,0.35)` },
                    transition: 'all 0.2s',
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 7, md: 11 }, bgcolor: C.white }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">

            {/* Left copy */}
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div initial="hidden" animate="visible" variants={fadeLeft}>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.75,
                  bgcolor: C.blue50, color: C.blue700,
                  fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em',
                  px: 1.5, py: 0.5, borderRadius: '6px',
                  border: `1px solid ${C.blue100}`,
                  mb: 2.5,
                }}>
                  ✦ Official Barangay 28 Portal
                </Box>

                <Typography sx={{ ...sectionTitle({ xs: '2.5rem', sm: '3rem', md: '3.75rem' }), mb: 1 }}>
                  BarangayELink
                </Typography>

                <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: C.blue600, fontWeight: 500, mb: 2 }}>
                  Barangay 28, Cagayan de Oro City
                </Typography>

                <Typography sx={{ ...sectionSubtitle, maxWidth: 520, mb: 4 }}>
                  Your digital gateway to barangay services. Request documents, stay updated on events,
                  and claim assistance programs — all in one place. No more long lines and waiting.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      component={RouterLink} to="/signup"
                      variant="contained" size="large" endIcon={<ArrowIcon />}
                      sx={{
                        bgcolor: C.blue600, textTransform: 'none', fontWeight: 600,
                        fontSize: '0.95rem', fontFamily: 'inherit',
                        px: 3.5, py: 1.25, borderRadius: '8px',
                        boxShadow: `0 4px 16px rgba(37,99,235,0.3)`,
                        '&:hover': { bgcolor: C.blue700 },
                        width: { xs: '100%', sm: 'auto' },
                      }}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      component={RouterLink} to="/login"
                      variant="outlined" size="large"
                      sx={{
                        color: C.gray700, borderColor: C.gray200,
                        textTransform: 'none', fontWeight: 500,
                        fontSize: '0.95rem', fontFamily: 'inherit',
                        px: 3.5, py: 1.25, borderRadius: '8px',
                        '&:hover': { borderColor: C.blue400, bgcolor: C.blue50, color: C.blue600 },
                        width: { xs: '100%', sm: 'auto' },
                      }}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right — announcement card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div initial="hidden" animate="visible" variants={fadeRight}>
                <Paper elevation={0} sx={{
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '16px',
                  border: `1px solid ${C.gray200}`,
                  bgcolor: C.white,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.06)`,
                }}>
                  <Typography sx={{ ...sectionLabel, mb: 2 }}>Latest Announcement</Typography>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeAnn}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.28 }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', color: C.blue600, fontWeight: 500, mb: 0.5 }}>
                        {announcements[activeAnn].date}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: C.gray900, mb: 0.75, fontSize: '1rem' }}>
                        {announcements[activeAnn].title}
                      </Typography>
                      <Typography sx={{ color: C.gray500, fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {announcements[activeAnn].description}
                      </Typography>
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress dots */}
                  <Stack direction="row" spacing={0.75} sx={{ mt: 3 }}>
                    {announcements.map((_, i) => (
                      <Box
                        key={i}
                        onClick={() => setActiveAnn(i)}
                        sx={{
                          flex: 1, height: '3px', borderRadius: '2px',
                          bgcolor: i === activeAnn ? C.blue600 : C.gray200,
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                        }}
                      />
                    ))}
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: C.blue600 }}>
        <Container maxWidth="lg">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {stats.map((stat) => (
                <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                  <motion.div variants={scaleUp}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 44, height: 44, borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: C.white, mb: 1.5,
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography sx={{
                        fontWeight: 700, color: C.white,
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        letterSpacing: '-0.03em', lineHeight: 1,
                        mb: 0.5,
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 400 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: C.gray50 }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
              <Typography sx={sectionLabel}>Services</Typography>
              <Typography sx={{ ...sectionTitle(), textAlign: 'center' }}>
                Built for Barangay 28 Residents
              </Typography>
              <Typography sx={{ ...sectionSubtitle, maxWidth: 560, mx: 'auto' }}>
                Access essential barangay services anytime, anywhere. No more waiting in long lines.
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Grid container spacing={3}>
              {features.map((feature) => (
                <Grid key={feature.title} size={{ xs: 12, sm: 6 }}>
                  <motion.div variants={scaleUp} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}>
                    <Paper elevation={0} sx={{
                      p: { xs: 3, md: 3.5 },
                      borderRadius: '16px',
                      height: '100%',
                      border: `1px solid ${C.gray200}`,
                      bgcolor: C.white,
                      transition: 'box-shadow 0.25s, border-color 0.25s',
                      '&:hover': {
                        borderColor: C.blue200,
                        boxShadow: `0 8px 32px rgba(37,99,235,0.08)`,
                      },
                    }}>
                      {/* Icon */}
                      <Box sx={{
                        width: 48, height: 48, borderRadius: '12px',
                        bgcolor: feature.accentBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 2.5,
                      }}>
                        {feature.icon}
                      </Box>

                      <Typography sx={{ fontWeight: 600, color: C.gray900, mb: 1, fontSize: '1rem' }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{ color: C.gray500, fontSize: '0.85rem', lineHeight: 1.65, mb: 2.5 }}>
                        {feature.description}
                      </Typography>

                      <Divider sx={{ borderColor: C.gray100, mb: 2 }} />

                      <Stack spacing={0.75}>
                        {feature.items.map((item) => (
                          <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: C.blue500, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.8rem', color: C.gray700 }}>{item}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: C.white }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
              <Typography sx={sectionLabel}>Process</Typography>
              <Typography sx={{ ...sectionTitle(), textAlign: 'center' }}>
                How It Works
              </Typography>
              <Typography sx={{ ...sectionSubtitle, maxWidth: 480, mx: 'auto' }}>
                Get started with BarangayELink in 4 simple steps.
              </Typography>
            </Box>
          </motion.div>

          {/* Steps — desktop: horizontal with connectors; mobile: vertical list */}
          {isMobile ? (
            <Stack spacing={3}>
              {steps.map((step, i) => (
                <motion.div key={step.number} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: '50%',
                      bgcolor: C.blue600, color: C.white,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                    }}>
                      {step.number}
                    </Box>
                    <Box sx={{ pt: 0.5 }}>
                      <Typography sx={{ fontWeight: 600, color: C.gray900, mb: 0.5, fontSize: '0.95rem' }}>
                        {step.title}
                      </Typography>
                      <Typography sx={{ color: C.gray500, fontSize: '0.825rem', lineHeight: 1.6 }}>
                        {step.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                  {i < steps.length - 1 && (
                    <Box sx={{ ml: 2.75, mt: 1, width: '1px', height: 28, bgcolor: C.gray200 }} />
                  )}
                </motion.div>
              ))}
            </Stack>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              {steps.map((step, i) => (
                <Box key={step.number} sx={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                  <motion.div
                    style={{ flex: 1, textAlign: 'center' }}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={scaleUp}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.2 }}>
                      <Box sx={{
                        width: 56, height: 56, borderRadius: '50%',
                        bgcolor: C.blue600, color: C.white,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.9rem', mx: 'auto', mb: 1.75,
                        boxShadow: `0 4px 14px rgba(37,99,235,0.3)`,
                      }}>
                        {step.number}
                      </Box>
                    </motion.div>
                    <Typography sx={{ fontWeight: 600, color: C.gray900, mb: 0.5, fontSize: '0.9rem' }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: C.gray500, fontSize: '0.8rem', lineHeight: 1.6, px: 1 }}>
                      {step.subtitle}
                    </Typography>
                  </motion.div>

                  {/* Connector line between steps */}
                  {i < steps.length - 1 && (
                    <Box sx={{ width: 40, height: '1px', bgcolor: C.gray200, mt: '28px', flexShrink: 0 }} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* ── Officials + Contact ─────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: C.gray50 }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }}>

            {/* Officials */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft}>
                <Typography sx={sectionLabel}>Officials</Typography>
                <Typography sx={{ ...sectionTitle({ xs: '1.5rem', md: '1.75rem' }), mb: 0.75 }}>
                  Barangay 28 Officials
                </Typography>
                <Typography sx={{ ...sectionSubtitle, mb: 3.5 }}>
                  Serving the community with dedication and excellence.
                </Typography>

                <Grid container spacing={1.5}>
                  {officials.map((official, i) => (
                    <Grid key={official.name} size={{ xs: 12, sm: 6 }}>
                      <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={scaleUp} transition={{ delay: i * 0.04 }}
                        whileHover={{ x: 3 }}
                      >
                        <Paper elevation={0} sx={{
                          p: 2, borderRadius: '12px',
                          border: `1px solid ${C.gray200}`, bgcolor: C.white,
                          display: 'flex', alignItems: 'center', gap: 1.5,
                          transition: 'border-color 0.2s',
                          '&:hover': { borderColor: C.blue300 },
                        }}>
                          <Avatar sx={{
                            bgcolor: C.blue50, color: C.blue700,
                            width: 40, height: 40, fontWeight: 600, fontSize: '0.9rem',
                            border: `1px solid ${C.blue100}`,
                          }}>
                            {official.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: C.gray900, fontSize: '0.85rem', lineHeight: 1.3 }}>
                              {official.name}
                            </Typography>
                            <Typography sx={{ color: C.gray400, fontSize: '0.75rem' }}>
                              {official.role}
                            </Typography>
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>

            {/* Contact */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight}>
                <Paper elevation={0} sx={{
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '16px',
                  border: `1px solid ${C.gray200}`,
                  bgcolor: C.white,
                  boxShadow: `0 4px 24px rgba(0,0,0,0.05)`,
                }}>
                  <Typography sx={{ fontWeight: 700, color: C.gray900, mb: 3, fontSize: '1.1rem' }}>
                    Barangay 28 Information
                  </Typography>

                  <Stack spacing={2.5}>
                    {[
                      {
                        icon: <LocationIcon sx={{ fontSize: 15 }} />,
                        label: 'Address',
                        value: 'Barangay Hall, Barangay 28, Cagayan de Oro City',
                      },
                      {
                        icon: <PhoneIcon sx={{ fontSize: 15 }} />,
                        label: 'Contact',
                        value: '(088) 123-4567 · barangay28@cdo.gov.ph',
                      },
                      {
                        icon: <AccessTimeIcon sx={{ fontSize: 15 }} />,
                        label: 'Office Hours',
                        value: 'Monday–Friday: 8:00 AM – 5:00 PM\nSaturday: 9:00 AM – 12:00 PM · Sunday: Closed',
                      },
                    ].map(({ icon, label, value }) => (
                      <Box key={label}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                          <Box sx={{ color: C.blue600 }}>{icon}</Box>
                          <Typography sx={{ ...sectionLabel, mb: 0 }}>{label}</Typography>
                        </Box>
                        <Typography sx={{ color: C.gray500, fontSize: '0.875rem', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  {/* Emergency */}
                  <Box sx={{
                    mt: 2.5, p: 1.5, borderRadius: '8px',
                    bgcolor: '#fef2f2', border: '1px solid #fecaca',
                    display: 'flex', alignItems: 'center', gap: 1,
                  }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#dc2626' }}>
                      🚨 Emergency Hotline: 0917 123 4567
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2.5, borderColor: C.gray100 }} />

                  <Typography sx={{ fontWeight: 600, color: C.gray700, fontSize: '0.8rem', mb: 1.5 }}>
                    Follow Us
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {[
                      { Icon: FacebookIcon,  label: 'Facebook' },
                      { Icon: TwitterIcon,   label: 'Twitter' },
                      { Icon: InstagramIcon, label: 'Instagram' },
                    ].map(({ Icon, label }) => (
                      <IconButton
                        key={label}
                        aria-label={label}
                        size="small"
                        sx={{
                          color: C.gray400,
                          border: `1px solid ${C.gray200}`,
                          borderRadius: '8px',
                          '&:hover': { color: C.blue600, bgcolor: C.blue50, borderColor: C.blue200 },
                          transition: 'all 0.2s',
                        }}
                      >
                        <Icon sx={{ fontSize: 18 }} />
                      </IconButton>
                    ))}
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── CTA Band ───────────────────────────────────────────────────────── */}
      <Box sx={{
        py: { xs: 8, md: 10 },
        bgcolor: C.blue600,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle top highlight strip */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          bgcolor: 'rgba(255,255,255,0.2)',
        }} />

        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{
                fontWeight: 700, color: C.white, mb: 1.5,
                fontSize: { xs: '1.6rem', md: '2.25rem' },
                letterSpacing: '-0.025em', lineHeight: 1.2,
              }}>
                Ready to access barangay services?
              </Typography>
              <Typography sx={{
                mb: 4, color: 'rgba(255,255,255,0.82)',
                maxWidth: 520, mx: 'auto',
                fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.7,
              }}>
                Join thousands of Barangay 28 residents already using BarangayELink.
              </Typography>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  component={RouterLink} to="/signup"
                  variant="contained" size="large"
                  endIcon={<MagicIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: C.white, color: C.blue700,
                    px: { xs: 4, md: 5 }, py: 1.5,
                    fontSize: '0.95rem', fontWeight: 700,
                    textTransform: 'none', borderRadius: '8px',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    '&:hover': { bgcolor: C.blue50 },
                  }}
                >
                  Create Your Account Now
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: C.white, borderTop: `1px solid ${C.gray200}`, py: { xs: 3, md: 3.5 } }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 1.5,
          }}>
            <Typography sx={{ fontSize: '0.8rem', color: C.gray400 }}>
              © 2024 BarangayELink · Barangay 28, Cagayan de Oro City
            </Typography>
            <Stack direction="row" spacing={3}>
              {['Privacy Policy', 'Terms of Service'].map((text) => (
                <Link
                  key={text} href="#"
                  underline="hover"
                  sx={{ color: C.gray400, fontSize: '0.8rem', '&:hover': { color: C.blue600 } }}
                >
                  {text}
                </Link>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}