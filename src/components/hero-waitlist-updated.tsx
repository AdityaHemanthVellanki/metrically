"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, BarChart4, LineChart, PieChart, Sparkles, Code2, LayoutDashboard } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function HeroWaitlist() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const fullText = "Your metrics. Architected by AI."

  useEffect(() => {
    if (isTyping && typedText !== fullText) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 100)
      
      return () => clearTimeout(timeout)
    }
    if (!isTyping && typedText === fullText) {
      setTimeout(() => setIsTyping(false), 500)
    }
  }, [isTyping, typedText, fullText])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 1200)
  }

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-black via-black/95 to-black/90">
      <div ref={heroRef} className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
          {typedText}
          <span className="blinking-cursor">|</span>
        </h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground mb-8 text-center max-w-2xl">
          AI-generated KPIs, dashboards, and insights for your SaaS. Gamified, interactive, and glassy by design.
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-grow text-base py-6 glass-input rounded-lg px-4 bg-black/60 border border-white/10 text-white focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-medium rounded-lg px-6 py-3 transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </div>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      </div>
      {/* Glow effect that follows mouse movement */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: '600px',
          height: '600px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle closest-side, rgba(106, 0, 255, 0.1), transparent)',
          filter: 'blur(40px)',
          opacity: 0.7,
          transition: 'opacity 0.2s ease'
        }} />

      <div className="relative z-10 w-full max-w-5xl px-4 py-24">
        <motion.div
          className="text-center"
        >
          <motion.div
            className="inline-block mb-4 bg-primary/10 rounded-full px-4 py-2 backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-semibold text-sm">
              Coming soon to streamline your startup metrics
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500 font-sans tracking-tight"
          >
            {typedText}
            <span className={isTyping ? "inline-block w-1 h-8 md:h-12 ml-1 bg-primary animate-blink" : ""}></span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground/90 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Build your perfect startup metric system in seconds using fast automation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-card p-8 mb-10 max-w-xl mx-auto rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-3 text-foreground">Join the waitlist</h3>
            <p className="text-muted-foreground mb-6 text-lg">Be the first to know when Metrically launches</p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-grow text-base py-6 glass-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required />
              <Button
                type="submit"
                className="raycast-button"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? "Joining..." : "Join now!"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="glass p-6 rounded-xl backdrop-blur-md">
              <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <BarChart4 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Smart KPI Generation</h3>
              <p className="text-muted-foreground text-sm">AI-powered metrics tailored to your business needs</p>
            </div>

            <div className="glass p-6 rounded-xl backdrop-blur-md">
              <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Auto-Generated SQL</h3>
              <p className="text-muted-foreground text-sm">Get ready-to-use SQL queries for your data stack</p>
            </div>

            <div className="glass p-6 rounded-xl backdrop-blur-md">
              <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Dashboard Layouts</h3>
              <p className="text-muted-foreground text-sm">Beautiful visualizations for your key metrics</p>
            </div>
          </motion.div>


        </></div>
    </div><div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div></>
    </section>
  )
}
