import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Handle client creation for different environments
let supabase: SupabaseClient | null = null

// Initialize Supabase client with proper error handling
const initSupabase = () => {
  try {
    // Use environment variables from .env.local in project root
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase URL or anon key is missing. Make sure .env.local is set up correctly.')
      return null
    }
    
    // Create a single supabase client for interacting with your database
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Error initializing Supabase client:', error)
    return null
  }
}

// Initialize client in browser environments only
if (typeof window !== 'undefined') {
  supabase = initSupabase()
}

// Export a function to get the client, which ensures it's only used when available
export function getSupabaseClient() {
  // If we're in a browser and the client doesn't exist yet, initialize it
  if (!supabase && typeof window !== 'undefined') {
    supabase = initSupabase()
  }
  return supabase
}

// For backward compatibility
export { supabase }
