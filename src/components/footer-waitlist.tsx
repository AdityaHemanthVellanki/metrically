"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"

export function FooterWaitlist() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [year, setYear] = useState(2025) // Default static year for SSR

  // Update year on client-side only to avoid hydration mismatch
  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('Starting form submission in footer...')
      // Get the Supabase client
      const supabase = getSupabaseClient()
      
      if (!supabase) {
        console.error('Supabase client not available in footer')
        toast.error("Unable to connect to our database. Please try again later.")
        return
      }
      
      console.log('Supabase client obtained successfully in footer')
      
      // First, check if the waitlist table exists by querying it
      try {
        const { error: tableCheckError } = await supabase
          .from('waitlist')
          .select('count')
          .limit(1)
          
        if (tableCheckError) {
          console.error('Table check error in footer:', tableCheckError)
          // If the table doesn't exist, try to create it
          if (tableCheckError.code === '42P01') { // Table doesn't exist error code
            console.log('Table does not exist, creating it...')
            // Create table logic would go here - but this requires admin privileges
            // Instead, show a specific error
            toast.error("The waitlist database hasn't been set up yet. Please contact support.")
            return
          }
        }
        
        console.log('Table exists in footer, proceeding with insert')
      } catch (tableErr) {
        console.error('Error checking table in footer:', tableErr)
      }
      
      // Insert the email into Supabase
      console.log('Attempting to insert email in footer:', email)
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }])
      
      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - email already exists
          console.log('Email already exists in waitlist (footer)')
          toast.success("You're already on our waitlist! We'll be in touch soon.")
        } else {
          console.error('Error submitting to waitlist from footer:', error)
          toast.error(`Database error: ${error.message || 'Unknown error'}`)
        }
      } else {
        console.log('Email successfully added to waitlist from footer')
        toast.success("You've joined the waitlist! We'll notify you when Metrically launches.")
      }
    } catch (err) {
      console.error('Submission error in footer:', err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setEmail("")
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-slate-900 text-slate-200 pb-8 pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto mb-12">
          <h4 className="font-semibold mb-4 text-white text-center">Join Our Waitlist</h4>
          <p className="text-slate-300 mb-4 text-center">
            Be the first to know when we launch.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-800 border-slate-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join now!"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
          <p>© {year} Metrically. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
