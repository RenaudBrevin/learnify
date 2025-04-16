import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pgebtdaqdtnopgjxtxwh.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZWJ0ZGFxZHRub3Bnanh0eHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTYxOTYsImV4cCI6MjA2MDM3MjE5Nn0.CwkY7Hw6S9m6ufuxLvULghdhUMMIZwdc84EkOXdrVM4";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
