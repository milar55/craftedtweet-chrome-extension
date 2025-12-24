import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Prefer values passed via Expo config `extra` (reliable in runtime), fallback to process.env.
const extra =
  (Constants.expoConfig?.extra as Record<string, unknown> | undefined) ??
  // Older manifest shape (dev client / older Expo Go)
  ((Constants as unknown as { manifest?: { extra?: Record<string, unknown> } }).manifest?.extra ??
    undefined);

const supabaseUrl =
  (extra?.supabaseUrl as string | undefined) ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  (extra?.supabaseAnonKey as string | undefined) ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase env missing. Ensure `.env` exists and restart Expo with `npx expo start -c`.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

