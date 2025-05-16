/**
 * Authentication utility functions for Metrically
 */

import { supabase } from './supabase';

// Ensure supabase client is available
if (!supabase) {
  console.error('Supabase client is not initialized');
}

/**
 * Get the current auth token from Supabase
 * @returns The JWT token or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return null;
    }
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.error('Error getting auth token:', error);
      return null;
    }
    
    return data.session.access_token;
  } catch (error) {
    console.error('Error in getAuthToken:', error);
    return null;
  }
}

/**
 * Get the current user from Supabase
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return null;
    }
    
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Check if the user is authenticated
 * @returns True if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return token !== null;
}
