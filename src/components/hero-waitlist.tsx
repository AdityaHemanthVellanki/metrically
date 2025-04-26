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
    } else if (typedText === fullText) {
      setIsTyping(false)
    }
  }, [isTyping, typedText, fullText])
  
  // Track mouse movement for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    
    // Simulate a brief loading state
    setTimeout(() => {
      console.log('Email submitted:', email)
      toast.success("You've joined the waitlist! We'll notify you when Metrically launches.")
      setEmail("") // Clear the email input after successful submission
      setIsSubmitting(false)
    }, 800)
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
    <section 
      ref={heroRef}
      className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Grid background with gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
      </div>
      
      {/* Glow effects */}
      <div 
        className="absolute -z-10 rounded-full blur-[120px] opacity-30 transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
          width: '40%',
          height: '40%',
          left: `${mousePosition.x / 10}px`,
          top: `${mousePosition.y / 10}px`,
          transform: 'translate(-50%, -50%)',
        }}
      ></div>
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] z-0"></div>
      
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
            className="inline-block mb-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-primary/20 text-primary rounded-full text-base font-medium"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Instant, Actionable Insights</span>
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
              <h3 className="text-lg font-medium mb-2">Cohort Analysis</h3>
              <p className="text-muted-foreground text-sm">Track user behavior and retention patterns over time</p>
            </div>
            
            <div className="glass p-6 rounded-xl backdrop-blur-md">
              <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Dashboard Layouts</h3>
              <p className="text-muted-foreground text-sm">Beautiful visualizations for your key metrics</p>
            </div>
          </motion.div>
          

        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}
