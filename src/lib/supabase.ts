import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Create a singleton Supabase client
let supabaseInstance: SupabaseClient | null = null

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
    // Get environment variables - use window.env if available, otherwise use process.env
    // This ensures environment variables are properly loaded in the browser
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('Supabase URL available:', !!supabaseUrl)
    console.log('Supabase Anon Key available:', !!supabaseAnonKey)
    
    // Validate environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL or anon key is missing. Check your .env.local file.')
      return null
    }
    
    // Create the client with hard-coded values for testing
    console.log('Creating new Supabase client with URL:', supabaseUrl)
    supabaseInstance = createClient(
      supabaseUrl,
      supabaseAnonKey
    )
    
    console.log('Supabase client created successfully')
    return supabaseInstance
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return null
  }
}

// For backward compatibility
export const supabase = null
