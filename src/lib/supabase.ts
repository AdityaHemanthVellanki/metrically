import { createClient } from '@supabase/supabase-js'

// Use environment variables from .env.local in project root
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Handle client creation for different environments
let supabase: ReturnType<typeof createClient> | null = null

// Only create the client if we're in a browser environment or if both URL and key are available
if (typeof window !== 'undefined' || (supabaseUrl && supabaseAnonKey)) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or anon key is missing. Make sure .env.local is set up correctly.')
  }
  
  // Create a single supabase client for interacting with your database
  supabase = createClient(
    supabaseUrl || 'https://placeholder-for-build-time.supabase.co', // Fallback URL for build time
    supabaseAnonKey || 'placeholder-key-for-build-time' // Fallback key for build time
  )
}

// Export a function to get the client, which ensures it's only used when available
export function getSupabaseClient() {
  if (!supabase && typeof window !== 'undefined') {
    // Initialize client on demand in browser if it wasn't already
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  }
  return supabase
}

// For backward compatibility
export { supabase }
