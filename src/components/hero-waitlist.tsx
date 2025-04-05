"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, BarChart4, LineChart, PieChart, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"

export function HeroWaitlist() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const fullText = "Your metrics. Architected by AI."
  
  useEffect(() => {
    if (isTyping && typedText !== fullText) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 100)
      
      return () => clearTimeout(timeout)
    } else if (typedText === fullText) {
      setIsTyping(false)
    }
  }, [isTyping, typedText, fullText])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Insert the email into Supabase
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }])
      
      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - email already exists
          toast.success("You're already on our waitlist! We'll be in touch soon.")
        } else {
          console.error('Error submitting to waitlist:', error)
          toast.error("Something went wrong. Please try again.")
        }
      } else {
        toast.success("You've joined the waitlist! We'll notify you when Metrically launches.")
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setEmail("")
      setIsSubmitting(false)
    }
  }

  // Generate random floating particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }))
  
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Grid background with gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent"></div>
      </div>
      
      {/* Animated floating particles */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-indigo-400/20 dark:bg-indigo-300/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              filter: "blur(1px)"
            }}
            animate={{
              y: ["-20%", "20%"],
              x: ["-10%", "10%"],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay
            }}
          />
        ))}
      </div>
      
      {/* Animated chart icons */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <motion.div 
          className="absolute text-indigo-500/10 dark:text-indigo-400/10" 
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '10%', right: '15%' }}
        >
          <BarChart4 size={120} />
        </motion.div>
        <motion.div 
          className="absolute text-violet-500/10 dark:text-violet-400/10" 
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: '15%', left: '10%' }}
        >
          <LineChart size={100} />
        </motion.div>
        <motion.div 
          className="absolute text-sky-500/10 dark:text-sky-400/10" 
          animate={{
            y: [0, 25, 0],
            x: [0, 10, 0],
            rotate: [0, 20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '30%', left: '20%' }}
        >
          <PieChart size={80} />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-2 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400 rounded-full text-base font-medium backdrop-blur-sm border border-indigo-500/20 dark:border-indigo-400/20"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Coming Soon</span>
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 font-sans tracking-tight"
          >
            {typedText}
            <span className={isTyping ? "inline-block w-1 h-8 md:h-12 ml-1 bg-indigo-500 dark:bg-indigo-400 animate-blink" : ""}></span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Build your perfect startup metric system in seconds using fast automation.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-8 mb-10 max-w-xl mx-auto shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Join the waitlist</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">Be the first to know when Metrically launches</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-grow text-base py-6 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-medium rounded-full text-base py-6 px-8 shadow-md shadow-indigo-500/20 dark:shadow-indigo-400/10"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? "Joining..." : "Join now!"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
          

        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-black to-transparent"></div>
    </section>
  )
}
