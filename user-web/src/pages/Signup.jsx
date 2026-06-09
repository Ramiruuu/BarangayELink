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
  InputAdornment,
  IconButton,
  Stack,
  CircularProgress,
} from '@mui/material'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

export default function Signup() {
  const { signup, signInWithGoogle, signInWithFacebook } = useAuth()
  const navigate = useNavigate()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [phoneMode, setPhoneMode] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationId, setVerificationId] = useState(null)
  const [codeSent, setCodeSent] = useState(false)
  const [phoneName, setPhoneName] = useState('')

  // Email/Password Signup
  const handleEmailSignup = async (event) => {
    event.preventDefault()
    
    if (!fullName.trim()) {
      toast.error('Please enter your full name', { icon: '❌' })
      return
    }
    if (!email.trim()) {
      toast.error('Please enter your email address', { icon: '❌' })
      return
    }
    if (!password) {
      toast.error('Please enter a password', { icon: '❌' })
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters', { icon: '🔒' })
      return
    }
    
    setSubmitting(true)
    toast.loading('Creating your account...', { id: 'signup' })
    
    try {
      await signup(fullName, email, password)
      toast.success('Account created successfully! Please check your email for verification.', { 
        id: 'signup',
        icon: '🎉',
        duration: 5000 
      })
      navigate('/login')
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already registered. Please sign in.', { id: 'signup', icon: '📧' })
      } else {
        toast.error(error.message || 'Unable to create account', { id: 'signup', icon: '⚠️' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Google Signup
  const handleGoogleSignup = async () => {
    setSubmitting(true)
    toast.loading('Connecting to Google...', { id: 'google', icon: '🔄' })
    
    try {
      await signInWithGoogle()
      toast.success('Successfully signed in with Google!', { 
        id: 'google', 
        icon: '✨',
        duration: 3000 
      })
      navigate('/app')
    } catch (error) {
      toast.error(error.message || 'Google signup failed', { id: 'google', icon: '⚠️' })
    } finally {
      setSubmitting(false)
    }
  }

  // Facebook Signup
  const handleFacebookSignup = async () => {
    setSubmitting(true)
    toast.loading('Connecting to Facebook...', { id: 'facebook', icon: '🔄' })
    
    try {
      await signInWithFacebook()
      toast.success('Successfully signed in with Facebook!', { 
        id: 'facebook', 
        icon: '✨',
        duration: 3000 
      })
      navigate('/app')
    } catch (error) {
      toast.error(error.message || 'Facebook signup failed', { id: 'facebook', icon: '⚠️' })
    } finally {
      setSubmitting(false)
    }
  }

  // Phone Signup - Send Code
  const handleSendCode = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number', { icon: '📱' })
      return
    }
    if (!phoneName.trim()) {
      toast.error('Please enter your full name', { icon: '👤' })
      return
    }
    
    setSubmitting(true)
    toast.loading('Sending verification code...', { id: 'phone' })
    
    try {
      const { auth } = await import('../firebase.js')
      const { RecaptchaVerifier, signInWithPhoneNumber } = await import('firebase/auth')
      
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      })
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha)
      setVerificationId(confirmationResult)
      setCodeSent(true)
      toast.success('Verification code sent! Check your phone.', { 
        id: 'phone', 
        icon: '📲',
        duration: 4000 
      })
    } catch (error) {
      toast.error(error.message || 'Failed to send verification code', { id: 'phone', icon: '⚠️' })
    } finally {
      setSubmitting(false)
    }
  }

  // Phone Signup - Verify Code
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter verification code', { icon: '🔢' })
      return
    }
    
    setSubmitting(true)
    toast.loading('Verifying your number...', { id: 'verify' })
    
    try {
      const result = await verificationId.confirm(verificationCode)
      const user = result.user
      
      const { completePhoneSignup } = useAuth()
      await completePhoneSignup(phoneName, phoneNumber, user.uid)
      
      toast.success('Phone account created successfully!', { 
        id: 'verify', 
        icon: '✅',
        duration: 3000 
      })
      navigate('/app')
    } catch (error) {
      toast.error('Invalid verification code. Please try again.', { id: 'verify', icon: '❌' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Box component="span" sx={{ fontSize: '48px' }}>🏛️</Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                Join BarangayELink
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                Create your account to access barangay services
              </Typography>
            </Box>

            {/* Email/Password Form (Top) */}
            {!phoneMode ? (
              <Box component="form" onSubmit={handleEmailSignup}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Full Name"
                    required
                    fullWidth
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '40px' } }}
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '40px' } }}
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                    helperText="Must be at least 6 characters"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '40px' } }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    startIcon={!submitting && <CheckCircleIcon />}
                    sx={{ py: 1.5, borderRadius: '40px', textTransform: 'none', fontWeight: 600, bgcolor: '#2563eb' }}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Create account'}
                  </Button>
                </Stack>
              </Box>
            ) : (
              /* Phone Mode */
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500, textAlign: 'center' }}>
                  <Box component="span" sx={{ fontSize: '24px', mr: 1 }}>📱</Box>
                  Sign up with phone number
                </Typography>
                <div id="recaptcha-container"></div>
                {!codeSent ? (
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={phoneName}
                      onChange={(e) => setPhoneName(e.target.value)}
                      disabled={submitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#9ca3af' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '40px' } }}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      placeholder="+63XXXXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={submitting}
                      helperText="Include country code (e.g., +639171234567)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: '#9ca3af' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '40px' } }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSendCode}
                      disabled={submitting || !phoneNumber || !phoneName}
                      sx={{ py: 1.5, borderRadius: '40px', textTransform: 'none', fontWeight: 600, bgcolor: '#2563eb' }}
                    >
                      {submitting ? <CircularProgress size={24} /> : 'Send Verification Code'}
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => setPhoneMode(false)}
                      sx={{ textTransform: 'none', color: '#6b7280' }}
                    >
                      ← Back to Email Signup
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Verification Code"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      disabled={submitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#9ca3af' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '40px' } }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleVerifyCode}
                      disabled={submitting || !verificationCode}
                      sx={{ py: 1.5, borderRadius: '40px', textTransform: 'none', fontWeight: 600, bgcolor: '#2563eb' }}
                    >
                      {submitting ? <CircularProgress size={24} /> : 'Verify & Create Account'}
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => {
                        setCodeSent(false)
                        setVerificationCode('')
                        setPhoneNumber('')
                        setPhoneName('')
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      ← Back
                    </Button>
                  </Stack>
                )}
              </Box>
            )}

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">OR</Typography>
            </Divider>

            {/* Social Login Buttons (Bottom) */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignup}
                disabled={submitting}
                sx={{ py: 1.5, borderRadius: '40px', textTransform: 'none', fontWeight: 500, borderColor: '#e5e7eb', color: '#374151', '&:hover': { borderColor: '#2563eb', bgcolor: 'rgba(37,99,235,0.02)' } }}
              >
                Continue with Google
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={handleFacebookSignup}
                disabled={submitting}
                sx={{ py: 1.5, borderRadius: '40px', textTransform: 'none', fontWeight: 500, borderColor: '#e5e7eb', color: '#374151', '&:hover': { borderColor: '#1877f2', bgcolor: 'rgba(24,119,242,0.02)' } }}
              >
                Continue with Facebook
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={() => {
                  setPhoneMode(true)
                  setCodeSent(false)
                  setPhoneNumber('')
                  setVerificationCode('')
                  setPhoneName('')
                }}
                disabled={submitting}
                sx={{ py: 1.5, borderRadius: '40px', textTransform: 'none', fontWeight: 500, borderColor: '#e5e7eb', color: '#374151', '&:hover': { borderColor: '#059669', bgcolor: 'rgba(5,150,105,0.02)' } }}
              >
                Continue with Phone
              </Button>
            </Stack>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" sx={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Sign in
                </Link>
              </Typography>
            </Box>

            {/* Terms */}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
              By continuing, you agree to BarangayELink's Terms of Service and Privacy Policy.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}