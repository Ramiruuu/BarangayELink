import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Container, Typography, Button, Box, Alert, CircularProgress } from '@mui/material';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Testing...');

  useEffect(() => {
    // Test database connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('residents').select('count', { count: 'exact', head: true });
        if (error) throw error;
        setConnectionStatus('✅ Connected to Supabase!');
      } catch (error) {
        console.error('Connection error:', error);
        setConnectionStatus('❌ Error: ' + error.message);
      }
    };
    
    testConnection();

    // Check auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Barangay Link
      </Typography>
      
      <Alert severity={connectionStatus.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
        {connectionStatus}
      </Alert>
      
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="body1" gutterBottom>
          Auth Status: 
          <strong style={{ color: user ? 'green' : 'orange' }}>
            {user ? ` ✅ Logged in as ${user.email}` : ' ⏳ Not logged in'}
          </strong>
        </Typography>
        
        {user ? (
          <Button variant="outlined" color="error" onClick={() => supabase.auth.signOut()} sx={{ mt: 2 }}>
            Sign Out
          </Button>
        ) : (
          <Button variant="contained" sx={{ mt: 2 }}>
            Sign In (Coming in Phase 1)
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default App;