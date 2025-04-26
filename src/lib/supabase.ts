import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Create a singleton Supabase client
let supabaseInstance: SupabaseClient | null = null

// Hardcoded fallback values - will be used if environment variables fail
const FALLBACK_SUPABASE_URL = 'https://dyofwwhogtrvdgdxgkmp.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5b2Z3d2hvZ3RydmRnZHhna21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTEzNzEsImV4cCI6MjA1OTQyNzM3MX0.Hi-Wd--nfY49VEB5QzLSIMqdmt5-ht1Ov_KdFMfm6K4'

/**
 * Creates and returns a Supabase client instance
 * This function ensures we only create one instance of the client
 */
export function getSupabaseClient(): SupabaseClient | null {
  // If we already have an instance, return it
  if (supabaseInstance) {
    console.log('Using existing Supabase instance')
    return supabaseInstance
  }
  
  // Only create client in browser environment
  if (typeof window === 'undefined') {
    console.log('Not in browser environment, skipping Supabase initialization')
    return null
  }
  
  try {
    // Get environment variables with fallbacks to hardcoded values
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY
    
    console.log('Using Supabase URL:', supabaseUrl)
    console.log('Using Supabase Anon Key:', supabaseAnonKey ? '[REDACTED]' : 'MISSING')
    
    // Create the client directly with the values
    console.log('Creating new Supabase client...')
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test the connection by making a simple query
    supabaseInstance.from('waitlist').select('count').limit(1)
      .then(() => console.log('Supabase connection test successful'))
      .then(undefined, (err: any) => console.error('Supabase connection test failed:', err))
    
    console.log('Supabase client created successfully')
    return supabaseInstance
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return null
  }
}

// Export a singleton supabase client instance for use throughout the app
export const supabase = getSupabaseClient();
