"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, BarChart3, Code2, LayoutDashboard, Sparkles, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Demo KPIs for the interactive preview
const demoKpis = [
  { name: "Monthly Active Users", value: "2.4k", change: "+12%" },
  { name: "Conversion Rate", value: "3.8%", change: "+2.1%" },
  { name: "Avg. Session Duration", value: "4:32", change: "+0:45" }
]

export function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [activePreview, setActivePreview] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const fullText = "Your KPIs. Architected by AI."
  
  useEffect(() => {
    if (isTyping && typedText !== fullText) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 100)
      
      return () => clearTimeout(timeout)
    } else if (typedText === fullText) {
      setIsTyping(false)
      
      // Auto-activate the first preview after typing is complete
      setTimeout(() => {
        setActivePreview(0)
      }, 500)
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
  
  // Auto-cycle through previews
  useEffect(() => {
    if (!isTyping) {
      const interval = setInterval(() => {
        setActivePreview(prev => prev === null ? 0 : (prev + 1) % 3)
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [isTyping])
  
  // Feature preview items
  const previewItems = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Smart KPI Generation",
      preview: (
        <div className="space-y-2">
          {demoKpis.map((kpi, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-black/20 backdrop-blur-md">
              <div className="bg-primary/10 p-1 rounded-md">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 text-left">{kpi.name}</div>
              <div className="font-mono font-medium">{kpi.value}</div>
              <div className="text-green-500 text-sm">{kpi.change}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      icon: <Code2 className="h-6 w-6 text-primary" />,
      title: "Auto-Generated SQL",
      preview: (
        <div className="font-mono text-xs text-left rounded-md bg-black/40 p-3 overflow-hidden">
          <pre className="text-green-400">
            {`-- Auto-generated SQL for Monthly Active Users
SELECT DATE_TRUNC('month', created_at) AS month,
       COUNT(DISTINCT user_id) AS monthly_active_users
FROM user_sessions
WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY 1
ORDER BY 1 DESC;`}
          </pre>
        </div>
      )
    },
    {
      icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
      title: "Dashboard Layouts",
      preview: (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/30 backdrop-blur-md rounded-md p-2 h-24 flex items-center justify-center">
            <div className="bg-primary/20 h-16 w-full rounded-md flex items-center justify-center">
              <BarChart3 className="h-10 w-10 text-primary/70" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-black/30 backdrop-blur-md rounded-md p-2 h-11"></div>
            <div className="bg-black/30 backdrop-blur-md rounded-md p-2 h-11"></div>
          </div>
        </div>
      )
    }
  ]
  
  return (
    <section 
      ref={heroRef}
      className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-black/95 to-black/90"></div>
      
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
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-3 py-1 bg-black/40 backdrop-blur-md border border-primary/20 text-primary rounded-full text-sm font-medium">
              AI-Powered KPI System for Startups
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
              {typedText}
              <span className={isTyping ? "inline-block w-1 h-8 md:h-12 ml-1 bg-primary animate-blink" : ""}></span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground/90 mb-8 max-w-3xl mx-auto">
              Metrically builds your startup&apos;s perfect KPI system in seconds—customized to your product, your stage, and your stack.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" className="w-full sm:w-auto raycast-button">
                Generate My KPI System
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto glass hover-scale">
                <Play className="mr-2 h-4 w-4" />
                See a Demo
              </Button>
            </div>
          </div>
          
          {/* Interactive feature preview */}
          <div className="glass-card p-6 rounded-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {previewItems.map((item, index) => (
                <button
                  key={index}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg transition-all duration-300",
                    activePreview === index 
                      ? "bg-primary/20 text-primary" 
                      : "bg-black/20 text-muted-foreground hover:bg-black/30"
                  )}
                  onClick={() => setActivePreview(index)}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </button>
              ))}
            </div>
            
            <div className="h-[200px] bg-black/20 backdrop-blur-md rounded-lg p-4 flex items-center justify-center">
              {activePreview !== null && (
                <div className="w-full max-w-lg transition-all duration-500 ease-in-out transform">
                  {previewItems[activePreview].preview}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}
