import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Create a singleton Supabase client
let supabaseInstance: SupabaseClient | null = null

/**
 * Creates and returns a Supabase client instance
 * This function ensures we only create one instance of the client
 */
export function getSupabaseClient(): SupabaseClient | null {
  // If we already have an instance, return it
  if (supabaseInstance) return supabaseInstance
  
  // Only create client in browser environment
  if (typeof window === 'undefined') return null
  
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Validate environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL or anon key is missing. Check your .env.local file.')
      return null
    }
    
    // Create the client
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return null
  }
}

// For backward compatibility
export const supabase = null
