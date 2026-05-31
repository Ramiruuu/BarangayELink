import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nigslnqsyfcacjeknwyh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pZ3NsbnFzeWZjYWNqZWtud3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzE2MzIsImV4cCI6MjA5NTgwNzYzMn0.D9iceNFDyUrYhNARzFOID_a0lbv-A91tMVg0yod-_JQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
