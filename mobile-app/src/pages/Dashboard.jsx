import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { supabase } from '../supabase';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Paper
} from '@mui/material';

function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.uid)
          .single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Barangay Link
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Avatar
            sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
          >
            {profile?.first_name?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="h4" gutterBottom>
            Welcome, {profile?.first_name || 'Resident'}!
          </Typography>
          <Typography color="text.secondary" paragraph>
            You are now logged in to Barangay Link.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {auth.currentUser?.email}
          </Typography>
        </Paper>
      </Container>
    </>
  );
}

export default Dashboard;
