import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://lczbqviltkfcfulqfizy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjemJxdmlsdGtmY2Z1bHFmaXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjY1MzUsImV4cCI6MjA5NjUwMjUzNX0.DZHyf-LzBQoZFzRLrwDgYYhf7r9SSGuGqowby3tHJU0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});