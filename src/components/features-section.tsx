"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  Code2, 
  LayoutDashboard, 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  ArrowRight, 
  LineChart, 
  PieChart, 
  Gauge, 
  Layers, 
  Database, 
  Table, 
  Terminal, 
  Search, 
  Zap, 
  Play, 
  Pause, 
  RotateCw,
  Lightbulb,
  Braces,
  Maximize,
  Minimize,
  Plus,
  Trash2,
  Settings,
  Sliders,
  Eye,
  EyeOff
} from "lucide-react"

// Types for interactive components
type KPI = {
  id: string;
  name: string;
  value: string;// Enhanced KpiGeneratorFeature component
  const KpiGeneratorFeature = () => {
    const [productType, setProductType] = useState("SaaS")
    const [companyStage, setCompanyStage] = useState("early")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedKpis, setGeneratedKpis] = useState<KPI[]>([])
    const [selectedKpi, setSelectedKpi] = useState<string | null>(null)
    const [showAIChat, setShowAIChat] = useState(false)
    const [showModal, setShowModal] = useState<{ type: 'sql' | 'dashboard' | null, kpiId: string | null }>({ type: null, kpiId: null })
    const [activeTab, setActiveTab] = useState<'metrics' | 'sql' | 'visualization'>('metrics')
    const [aiMessage, setAiMessage] = useState("")
    const [typingMessage, setTypingMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    
    // Simulated chat replies
    const simulatedReplies = {
      kpiGeneral: "Based on your SaaS product in early stage, I recommend tracking these core metrics: Monthly Active Users (MAU), Customer Acquisition Cost (CAC), Churn Rate, and Monthly Recurring Revenue (MRR). These will give you the fundamental insights into growth, retention, and financial health.",
      kpiActivation: "For tracking activation rate in a SaaS product, I recommend defining a clear 'aha moment' - the action where users realize your product's value. Calculate: (Number of users who reached the 'aha moment' / Total new signups) × 100. For most SaaS, good activation is 30-40% within the first day.",
      kpiRetention: "Retention should be measured in cohorts by signup date. For early-stage SaaS, track both your 7-day and 30-day retention rates. A healthy 30-day retention for B2B SaaS starts at 80%, while B2C might be 40-60%. Implement user lifecycle emails to improve this metric."
    }
    
    // Simulate typewriter effect
    useEffect(() => {
      if (aiMessage && !isTyping) {
        setIsTyping(true)
        setTypingMessage("")
        
        let index = 0
        const timer = setInterval(() => {
          if (index < aiMessage.length) {
            setTypingMessage(prev => prev + aiMessage.charAt(index))
            index++
          } else {
            clearInterval(timer)
            setIsTyping(false)
          }
        }, 20)
        
        return () => clearInterval(timer)
      }
    }, [aiMessage])
    
    const handleGenerate = () => {
      setIsGenerating(true)
      // Simulate API call with delay
      setTimeout(() => {
        setGeneratedKpis(demoKpis)
        setIsGenerating(false)
      }, 1500)
    }
    
    const handleChatRequest = (question: string) => {
      setIsTyping(true)
      setTypingMessage("")
      
      setTimeout(() => {
        if (question.toLowerCase().includes("activation")) {
          setAiMessage(simulatedReplies.kpiActivation)
        } else if (question.toLowerCase().includes("retention")) {
          setAiMessage(simulatedReplies.kpiRetention)
        } else {
          setAiMessage(simulatedReplies.kpiGeneral)
        }
      }, 800)
    }
    
    return (
      <div className="command-panel relative overflow-hidden backdrop-blur-md border border-white/10 rounded-xl shadow-[0_0_15px_rgba(125,125,255,0.07)] p-6 h-full transition-all duration-300">
        {/* Command Panel Header */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-black/40 backdrop-blur-md rounded-t-xl border-b border-white/5 flex items-center px-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="text-xs text-center flex-1 text-white/60 font-mono">
            Metrically KPI Generator
          </div>
        </div>
        
        <div className="mt-8 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary/80" />
            Generate Your KPI System
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">Product Type</label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger className="bg-black/50 backdrop-blur-sm border border-white/10 focus:ring-primary/30 focus:border-primary/30 text-white/90">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 backdrop-blur-md border border-white/10 text-white">
                  <SelectItem value="SaaS">SaaS</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">Company Stage</label>
              <Select value={companyStage} onValueChange={setCompanyStage}>
                <SelectTrigger className="bg-black/50 backdrop-blur-sm border border-white/10 focus:ring-primary/30 focus:border-primary/30 text-white/90">
                  <SelectValue placeholder="Select company stage" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 backdrop-blur-md border border-white/10 text-white">
                  <SelectItem value="early">Early Stage</SelectItem>
                  <SelectItem value="growth">Growth Stage</SelectItem>
                  <SelectItem value="mature">Mature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-primary/90 to-indigo-600/90 hover:from-primary hover:to-indigo-600 text-white border-0 shadow-[0_0_15px_rgba(125,125,255,0.3)] hover:shadow-[0_0_25px_rgba(125,125,255,0.5)] transition-all duration-300 animate-pulse-glow"
          >
            {isGenerating ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Generating KPIs...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate KPI System
              </>
            )}
          </Button>
        </div>
        
        {generatedKpis.length > 0 && (
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm text-white/70 mb-2">Your Recommended KPIs:</h4>
              
              {/* Visualization Toggle Tabs */}
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-auto">
                <TabsList className="bg-black/40 border border-white/10 p-1 rounded-md">
                  <TabsTrigger value="metrics" className="text-xs px-2 py-1 data-[state=active]:bg-primary/30 data-[state=active]:text-white">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Metrics
                  </TabsTrigger>
                  <TabsTrigger value="sql" className="text-xs px-2 py-1 data-[state=active]:bg-primary/30 data-[state=active]:text-white">
                    <Code2 className="h-3 w-3 mr-1" />
                    SQL
                  </TabsTrigger>
                  <TabsTrigger value="visualization" className="text-xs px-2 py-1 data-[state=active]:bg-primary/30 data-[state=active]:text-white">
                    <LayoutDashboard className="h-3 w-3 mr-1" />
                    Dashboard
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <AnimatePresence>
              {activeTab === 'metrics' && (
                <>
                  {generatedKpis.map((kpi, index) => (
                    <motion.div
                      key={kpi.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-md backdrop-blur-md cursor-pointer transition-all",
                        selectedKpi === kpi.id 
                          ? "bg-primary/20 border border-primary/30 shadow-[0_0_10px_rgba(125,125,255,0.1)]" 
                          : "bg-black/20 hover:bg-black/30 border border-white/5 hover:border-white/10"
                      )}
                      onClick={() => setSelectedKpi(selectedKpi === kpi.id ? null : kpi.id)}
                    >
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-black/40 text-xs font-medium border border-white/5">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-sm text-white/90">{kpi.name}</div>
                      <div className="font-mono font-medium text-sm text-primary">{kpi.value}</div>
                      <div className={cn(
                        "text-xs flex items-center",
                        kpi.trend === 'up' ? "text-green-500" : 
                        kpi.trend === 'down' && kpi.id !== 'cac' && kpi.id !== 'churn' ? "text-red-500" :
                        kpi.trend === 'down' && (kpi.id === 'cac' || kpi.id === 'churn') ? "text-green-500" :
                        "text-primary"
                      )}>
                        {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                         kpi.trend === 'down' ? <ArrowDownRight className="h-3 w-3 mr-1" /> : null}
                        {kpi.change}
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform text-white/60",
                        selectedKpi === kpi.id ? "rotate-90" : ""
                      )} />
                    </motion.div>
                  ))}
                </>
              )}
              
              {activeTab === 'sql' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="code-editor rounded-md p-4 overflow-x-auto"
                >
                  <div className="flex justify-between text-white/60 text-xs mb-2">
                    <span>Generated SQL Query</span>
                    <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
                      <ClipboardCopy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="text-xs text-green-400">{demoSqlQueries.mau}</pre>
                </motion.div>
              )}
              
              {activeTab === 'visualization' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-black/30 backdrop-blur-md border border-white/10 rounded-md p-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video chart-placeholder rounded-md border border-white/5 flex items-center justify-center">
                      <BarChart3 className="h-10 w-10 text-primary/40" />
                    </div>
                    <div className="aspect-video chart-placeholder rounded-md border border-white/5 flex items-center justify-center">
                      <LineChart className="h-10 w-10 text-primary/40" />
                    </div>
                  </div>
                  <div className="mt-3 text-white/60 text-center text-xs">
                    Dashboard preview - Click on a KPI to visualize
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* KPI Detail Panel */}
            <AnimatePresence>
              {selectedKpi && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-3 overflow-hidden bg-black/20 backdrop-blur-md rounded-md border border-white/10 p-4"
                >
                  {generatedKpis.filter(k => k.id === selectedKpi).map(kpi => (
                    <div key={`detail-${kpi.id}`} className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                          Description
                        </h4>
                        <p className="text-xs text-white/70 mt-1">{kpi.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white flex items-center">
                          <Calculator className="h-4 w-4 mr-2 text-primary" />
                          How it's calculated
                        </h4>
                        <div className="text-xs font-mono bg-black/30 p-2 rounded mt-1 text-white/70">
                          {kpi.calculation}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white flex items-center">
                          <Target className="h-4 w-4 mr-2 text-primary" />
                          Benchmark
                        </h4>
                        <p className="text-xs text-white/70 mt-1">{kpi.benchmark}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          Why it matters
                        </h4>
                        <p className="text-xs text-white/70 mt-1">{kpi.importance}</p>
                      </div>
                      
                      <div className="flex justify-between pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-8 bg-black/30 border-white/10 hover:bg-black/50 text-white/80"
                          onClick={() => setShowModal({ type: 'dashboard', kpiId: kpi.id })}
                        >
                          <LayoutDashboard className="h-3 w-3 mr-1" />
                          View in Dashboard
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-8 bg-black/30 border-white/10 hover:bg-black/50 text-white/80"
                          onClick={() => setShowModal({ type: 'sql', kpiId: kpi.id })}
                        >
                          <Code2 className="h-3 w-3 mr-1" />
                          Generate SQL
                        </Button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Floating AI Chat Button */}
        <div className="absolute bottom-6 right-6">
          <Button
            onClick={() => setShowAIChat(!showAIChat)}
            className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-primary/90 to-indigo-600/90 hover:from-primary hover:to-indigo-600 border-0 shadow-[0_0_15px_rgba(125,125,255,0.3)] hover:shadow-[0_0_25px_rgba(125,125,255,0.5)] transition-all duration-300"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
        
        {/* AI Chat Panel */}
        <AnimatePresence>
          {showAIChat && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-20 right-6 w-80 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 shadow-[0_0_25px_rgba(125,125,255,0.1)] overflow-hidden z-10"
            >
              <div className="p-3 border-b border-white/10 flex justify-between items-center">
                <div className="text-xs font-medium text-white/90">Metrically AI Assistant</div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowAIChat(false)}>
                  <X className="h-3 w-3 text-white/60" />
                </Button>
              </div>
              <div className="p-3 max-h-60 overflow-y-auto text-xs text-white/80">
                <p className="font-medium text-primary mb-2">Ask me about metrics for your startup</p>
                {typingMessage && (
                  <div className="bg-primary/10 rounded p-3 mb-2 border border-primary/30">
                    <p className="text-white/90">{typingMessage}</p>
                    {isTyping && <span className="animate-blink">|</span>}
                  </div>
                )}
                <div className="space-y-2 mt-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 rounded bg-primary/10 border border-primary/20 text-xs text-white/90"
                    onClick={() => handleChatRequest("What metrics should my startup track?")}
                  >
                    What metrics should my startup track?
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 rounded bg-primary/10 border border-primary/20 text-xs text-white/90"
                    onClick={() => handleChatRequest("How do I track activation rate?")}
                  >
                    How do I track activation rate?
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 rounded bg-primary/10 border border-primary/20 text-xs text-white/90"
                    onClick={() => handleChatRequest("What's a good retention benchmark?")}
                  >
                    What's a good retention benchmark?
                  </Button>
                </div>
              </div>
              <div className="p-3 border-t border-white/10 flex gap-2">
                <Input 
                  className="flex-1 bg-black/50 border-white/10 text-white text-xs h-8" 
                  placeholder="Ask about metrics..." 
                />
                <Button size="sm" className="h-8 w-8 p-0 bg-primary">
                  <ArrowUp className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* SQL Modal */}
        <AnimatePresence>
          {showModal.type === 'sql' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal({ type: null, kpiId: null })} />
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="feature-modal w-full max-w-2xl max-h-[80vh] overflow-auto shadow-2xl p-6 z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Code2 className="mr-2 h-5 w-5 text-primary/80" />
                    Generated SQL Query
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => setShowModal({ type: null, kpiId: null })}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-white/70 mb-2">
                    The following SQL query was generated for tracking {generatedKpis.find(k => k.id === showModal.kpiId)?.name}:
                  </div>
                  <div className="code-editor p-4 rounded-md">
                    <div className="flex justify-between text-white/60 text-xs mb-3">
                      <div className="flex items-center">
                        <Database className="h-3 w-3 mr-1" />
                        <span>postgres</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <ClipboardCopy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      {demoSqlQueries[showModal.kpiId as keyof typeof demoSqlQueries] || demoSqlQueries.mau}
                    </pre>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-1 text-primary/80" />
                    Configure Data Source
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Select defaultValue="postgres">
                      <SelectTrigger className="bg-black/50 text-xs">
                        <SelectValue placeholder="Select database" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="postgres">PostgreSQL</SelectItem>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="bigquery">BigQuery</SelectItem>
                        <SelectItem value="snowflake">Snowflake</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="user_actions">
                      <SelectTrigger className="bg-black/50 text-xs">
                        <SelectValue placeholder="Select table" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user_actions">user_actions</SelectItem>
                        <SelectItem value="events">events</SelectItem>
                        <SelectItem value="sessions">sessions</SelectItem>
                        <SelectItem value="subscriptions">subscriptions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowModal({ type: null, kpiId: null })}>
                    Cancel
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Save Query
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Dashboard Modal */}
        <AnimatePresence>
          {showModal.type === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal({ type: null, kpiId: null })} />
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="feature-modal w-full max-w-3xl max-h-[80vh] overflow-auto shadow-2xl p-6 z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <LayoutDashboard className="mr-2 h-5 w-5 text-primary/80" />
                    Dashboard Preview
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => setShowModal({ type: null, kpiId: null })}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-black/30 rounded-md border border-white/10 p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/40 border border-white/5 rounded-md aspect-video p-3 relative">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Maximize className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                      <h5 className="text-xs font-medium text-white mb-2">
                        {generatedKpis.find(k => k.id === showModal.kpiId)?.name}
                      </h5>
                      <div className="h-full flex items-center justify-center">
                        {showModal.kpiId === 'mau' && (
                          <LineChart className="w-16 h-16 text-primary/50" />
                        )}
                        {showModal.kpiId === 'conversion' && (
                          <BarChart3 className="w-16 h-16 text-primary/50" />
                        )}
                        {showModal.kpiId === 'churn' && (
                          <PieChart className="w-16 h-16 text-primary/50" />
                        )}
                        {showModal.kpiId === 'cac' && (
                          <BarChart3 className="w-16 h-16 text-primary/50" />
                        )}
                      </div>
                    </div>
                    <div className="bg-black/40 border border-white/5 rounded-md aspect-video p-3 relative">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Maximize className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                      <h5 className="text-xs font-medium text-white mb-2">
                        {generatedKpis.find(k => k.id === showModal.kpiId)?.name} by Source
                      </h5>
                      <div className="h-full flex items-center justify-center">
                        <PieChart className="w-16 h-16 text-primary/50" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/40 border border-white/5 rounded-md p-3 relative">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Maximize className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                    <h5 className="text-xs font-medium text-white mb-2">
                      Historical {generatedKpis.find(k => k.id === showModal.kpiId)?.name} Trend
                    </h5>
                    <div className="h-32 chart-placeholder rounded flex items-center justify-center">
                      <LineChart className="w-16 h-16 text-primary/50" />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4"></div>
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description?: string;
  importance?: string;
  calculation?: string;
  benchmark?: string;
};

type Product = {
  name: string;
  stage: 'early' | 'growth' | 'mature';
  type: string;
  industry: string;
  businessModel: string;
};

type DashboardWidget = {
  id: string;
  title: string;
  chartType: string;
  kpiId: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

type DataSource = {
  id: string;
  name: string;
  type?: 'postgres' | 'mysql' | 'bigquery' | 'snowflake' | 'firebase' | 'supabase';
  icon: React.ReactNode;
  tables?: string[];
};

type ChartType = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

type DashboardLayout = {
  id: string;
  name: string;
  columns: number;
  rows?: number;
  description?: string;
};

// Demo data for interactive features
export const demoKpis: KPI[] = [
  {
    id: "mau",
    name: "Monthly Active Users",
    value: "2,547",
    change: "+12.5%",
    trend: "up",
    description: "The number of unique users who performed an action in your product in the last 30 days.",
    importance: "MAU is a core engagement metric that indicates your product's stickiness and reach.",
    calculation: "COUNT(DISTINCT user_id) WHERE action_date >= NOW() - INTERVAL '30 days'",
    benchmark: "Early-stage SaaS typically aims for 20-30% month-over-month growth."
  },
  {
    id: "conversion",
    name: "Conversion Rate",
    value: "3.8%",
    change: "+0.6%",
    trend: "up",
    description: "The percentage of visitors who complete a desired action (signup, purchase).",
    importance: "Conversion rate directly impacts your customer acquisition costs and growth efficiency.",
    calculation: "(Number of conversions / Total visitors) × 100",
    benchmark: "Average SaaS conversion rates range from 3-5% for B2B products."
  },
  {
    id: "churn",
    name: "Monthly Churn Rate",
    value: "2.1%",
    change: "-0.4%",
    trend: "down",
    description: "The percentage of customers who cancel their subscription in a given month.",
    importance: "Churn directly impacts your revenue retention and customer lifetime value.",
    calculation: "(Customers lost in period / Total customers at start of period) × 100",
    benchmark: "Healthy SaaS churn rates are typically below 5% monthly, with best-in-class below 2%."
  },
  {
    id: "cac",
    name: "Customer Acquisition Cost",
    value: "$125",
    change: "-$15",
    trend: "down",
    description: "The average cost to acquire a new customer, including marketing and sales expenses.",
    importance: "CAC is a critical metric for understanding the efficiency of your growth strategy.",
    calculation: "Total marketing & sales spend / Number of new customers acquired",
    benchmark: "Your CAC should ideally be recovered within 12 months of acquiring a customer."
  },
  { 
    id: 'session', 
    name: 'Avg. Session Duration', 
    value: '4:32', 
    change: '+0:45', 
    trend: 'up',
    description: 'Average time users spend during a single session',
    importance: 'Indicates engagement level and content quality',
    calculation: 'SUM(session_duration) / COUNT(sessions)',
    benchmark: '3-4 minutes is typical for SaaS applications'
  }
];

// Demo SQL queries for different KPIs
export const demoSqlQueries: Record<string, string> = {
  mau: `-- Monthly Active Users (PostgreSQL)
SELECT
  DATE_TRUNC('month', action_date) AS month,
  COUNT(DISTINCT user_id) AS monthly_active_users
FROM user_actions
WHERE 
  action_date >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', action_date)
ORDER BY month DESC;
`,
  conversion: `-- Conversion Rate by Signup Source (PostgreSQL)
SELECT
  source,
  COUNT(DISTINCT visitor_id) AS total_visitors,
  COUNT(DISTINCT CASE WHEN converted = TRUE THEN visitor_id END) AS conversions,
  ROUND(
    (COUNT(DISTINCT CASE WHEN converted = TRUE THEN visitor_id END)::numeric / 
     COUNT(DISTINCT visitor_id)::numeric) * 100, 2
  ) AS conversion_rate
FROM visitor_sessions
WHERE 
  session_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY source
ORDER BY conversion_rate DESC;
`,
  churn: `-- Monthly Churn Rate (PostgreSQL)
WITH monthly_customers AS (
  SELECT
    DATE_TRUNC('month', date) AS month,
    COUNT(DISTINCT customer_id) AS total_customers
  FROM subscriptions
  WHERE status = 'active'
  GROUP BY DATE_TRUNC('month', date)
),
churned_customers AS (
  SELECT
    DATE_TRUNC('month', churn_date) AS month,
    COUNT(DISTINCT customer_id) AS churned
  FROM subscription_events
  WHERE event_type = 'churn'
  GROUP BY DATE_TRUNC('month', churn_date)
)
SELECT
  mc.month,
  mc.total_customers,
  COALESCE(cc.churned, 0) AS churned_customers,
  ROUND((COALESCE(cc.churned, 0)::numeric / mc.total_customers::numeric) * 100, 2) AS churn_rate
FROM monthly_customers mc
LEFT JOIN churned_customers cc ON mc.month = cc.month
ORDER BY mc.month DESC;
`
};

// Data sources for SQL generation
export const dataSources: DataSource[] = [
  { id: "postgres", name: "PostgreSQL", type: 'postgres', icon: <Database className="h-4 w-4 text-blue-500" />, tables: ['users', 'sessions', 'events', 'conversions'] },
  { id: "mysql", name: "MySQL", type: 'mysql', icon: <Database className="h-4 w-4" /> },
  { id: "bigquery", name: "BigQuery", type: 'bigquery', icon: <Database className="h-4 w-4" /> },
  { id: "snowflake", name: "Snowflake", type: 'snowflake', icon: <Database className="h-4 w-4" /> },
  { id: "firebase", name: "Firebase", type: 'firebase', icon: <Zap className="h-4 w-4 text-amber-500" /> },
  { id: "supabase", name: "Supabase", type: 'supabase', icon: <Database className="h-4 w-4 text-emerald-500" />, tables: ['profiles', 'analytics', 'auth', 'subscriptions'] }
];

// Chart types for dashboard builder
export const chartTypes: ChartType[] = [
  { id: "bar", name: "Bar Chart", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "line", name: "Line Chart", icon: <LineChart className="h-4 w-4" /> },
  { id: "pie", name: "Pie Chart", icon: <PieChart className="h-4 w-4" /> },
  { id: "gauge", name: "Gauge", icon: <Gauge className="h-4 w-4" /> }
];

// Dashboard layouts
export const dashboardLayouts: DashboardLayout[] = [
  { id: "balanced", name: "Balanced", columns: 2, rows: 2, description: "Equal emphasis on all metrics" },
  { id: "focus", name: "Focus", columns: 1, rows: 3, description: "Highlight one metric at a time" },
  { id: "overview", name: "Overview", columns: 3, rows: 2, description: "See more metrics at once" },
  { id: "compact", name: "Compact", columns: 2, rows: 3 },
  { id: "widescreen", name: "Widescreen", columns: 4, rows: 2 }
];

// Feature types for the original feature cards
type Feature = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  categories: string[];
  preview: (props: FeaturePreviewProps) => React.ReactNode;
};

type FeaturePreviewProps = {
  isActive: boolean;
};

type FeatureCardProps = {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
};

type InteractiveFeature = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};











// Demo SQL query for preview
const demoSqlQuery = demoSqlQueries.mau;

// Features with interactive demos
const features: Feature[] = [
  {
    id: "kpi-generation",
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Smart KPI Generation",
    description: "Get the most important metrics for your startup, no guessing needed.",
    categories: ["all", "analytics"],
    preview: ({ isActive }: FeaturePreviewProps) => (
      <div className={cn(
        "rounded-md p-3 transition-all duration-300",
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <div className="space-y-3">
          {demoKpis.map((kpi, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-black/20 backdrop-blur-md">
              <div className="bg-primary/10 p-1 rounded-md">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">{kpi.name}</div>
              <div className="font-mono font-medium">{kpi.value}</div>
              <div className="text-green-500 text-sm">{kpi.change}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "auto-sql",
    icon: <Code2 className="h-10 w-10 text-primary" />,
    title: "Auto-Generated SQL",
    description: "Drop-in-ready queries tailored to your stack—Postgres, Firebase, or Supabase.",
    categories: ["all", "integrations"],
    preview: ({ isActive }: FeaturePreviewProps) => (
      <div className={cn(
        "font-mono text-xs rounded-md bg-black/40 p-3 overflow-hidden transition-all duration-300",
        isActive ? "opacity-100 max-h-[200px]" : "opacity-0 max-h-0"
      )}>
        <pre className="text-green-400">{demoSqlQueries.mau}</pre>
      </div>
    )
  },
  {
    id: "dashboard",
    icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
    title: "Dashboard Layouts",
    description: "Ready-to-use visualizations for Metabase, Looker, or your BI of choice.",
    categories: ["all", "dashboards"],
    preview: ({ isActive }: FeaturePreviewProps) => (
      <div className={cn(
        "transition-all duration-300",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
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
      </div>
    )
  },
  {
    id: "insights",
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "GPT-Powered Insights",
    description: "Understand why each KPI matters, with explainers and goal-setting suggestions.",
    categories: ["all", "analytics"],
    preview: ({ isActive }: FeaturePreviewProps) => (
      <div className={cn(
        "transition-all duration-300 space-y-2",
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <div className="bg-black/30 backdrop-blur-md rounded-md p-2 text-xs">
          Conversion rate is <span className="text-primary">3.2% below industry average</span> for SaaS startups.
        </div>
        <div className="bg-black/30 backdrop-blur-md rounded-md p-2 text-xs">
          Recommended goal: <span className="text-primary">Increase by 1.5%</span> in the next quarter.
        </div>
      </div>
    )
  }
]

// Interactive feature card component
function FeatureCard({ feature, isActive, onClick }: FeatureCardProps) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 border-0",
        "bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-md hover:backdrop-blur-lg",
        isActive 
          ? "ring-1 ring-primary/50 shadow-lg shadow-primary/5" 
          : "hover:shadow-md hover:shadow-primary/5",
        "cursor-pointer group"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="pb-2">
        <div className="mb-4 p-2 inline-flex rounded-lg bg-black/40 backdrop-blur-sm border border-primary/10 group-hover:border-primary/20 transition-colors duration-300">
          {feature.icon}
        </div>
        <CardTitle className="flex items-center justify-between">
          {feature.title}
          <ChevronRight className={cn(
            "h-5 w-5 text-primary/70 transition-transform duration-300",
            isActive ? "rotate-90" : "group-hover:translate-x-1"
          )} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-base text-muted-foreground/90">{feature.description}</CardDescription>
        
        <div className="min-h-[140px] pt-2">
          {feature.preview({ isActive })}
        </div>
      </CardContent>
    </Card>
  )
}

// Interactive feature components
const KpiGeneratorFeature = () => {
  const [productType, setProductType] = useState("SaaS")
  const [companyStage, setCompanyStage] = useState("early")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedKpis, setGeneratedKpis] = useState<KPI[]>([])
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null)
  
  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate API call with delay
    setTimeout(() => {
      setGeneratedKpis(demoKpis)
      setIsGenerating(false)
    }, 1500)
  }
  
  return (
    <div className="glass-card p-6 rounded-xl h-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Generate Your KPI System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Type</label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="Mobile App">Mobile App</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Marketplace">Marketplace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company Stage</label>
            <Select value={companyStage} onValueChange={setCompanyStage}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Select company stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="early">Early Stage</SelectItem>
                <SelectItem value="growth">Growth Stage</SelectItem>
                <SelectItem value="mature">Mature</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="w-full raycast-button"
        >
          {isGenerating ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Generating KPIs...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate KPI System
            </>
          )}
        </Button>
      </div>
      
      {generatedKpis.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Your Recommended KPIs:</h4>
          <AnimatePresence>
            {generatedKpis.map((kpi, index) => (
              <motion.div
                key={kpi.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md backdrop-blur-md cursor-pointer transition-all",
                  selectedKpi === kpi.id ? "bg-primary/20 border border-primary/30" : "bg-black/20 hover:bg-black/30 border border-white/5"
                )}
                onClick={() => setSelectedKpi(selectedKpi === kpi.id ? null : kpi.id)}
              >
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-black/40 text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 text-sm">{kpi.name}</div>
                <div className="font-mono font-medium text-sm">{kpi.value}</div>
                <div className={cn(
                  "text-xs",
                  kpi.trend === 'up' ? "text-green-500" : 
                  kpi.trend === 'down' && kpi.id !== 'cac' && kpi.id !== 'churn' ? "text-red-500" :
                  kpi.trend === 'down' && (kpi.id === 'cac' || kpi.id === 'churn') ? "text-green-500" :
                  "text-primary"
                )}>
                  {kpi.change}
                </div>
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform",
                  selectedKpi === kpi.id ? "rotate-90" : ""
                )} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {selectedKpi && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-4 rounded-md bg-black/30 border border-white/5 space-y-3"
            >
              {generatedKpis.find(k => k.id === selectedKpi)?.description && (
                <div>
                  <h5 className="text-xs font-medium text-primary mb-1">Description</h5>
                  <p className="text-xs text-muted-foreground">
                    {generatedKpis.find(k => k.id === selectedKpi)?.description}
                  </p>
                </div>
              )}
              
              {generatedKpis.find(k => k.id === selectedKpi)?.importance && (
                <div>
                  <h5 className="text-xs font-medium text-primary mb-1">Why It Matters</h5>
                  <p className="text-xs text-muted-foreground">
                    {generatedKpis.find(k => k.id === selectedKpi)?.importance}
                  </p>
                </div>
              )}
              
              {generatedKpis.find(k => k.id === selectedKpi)?.calculation && (
                <div>
                  <h5 className="text-xs font-medium text-primary mb-1">How It's Calculated</h5>
                  <p className="text-xs font-mono bg-black/40 p-2 rounded">
                    {generatedKpis.find(k => k.id === selectedKpi)?.calculation}
                  </p>
                </div>
              )}
              
              {generatedKpis.find(k => k.id === selectedKpi)?.benchmark && (
                <div>
                  <h5 className="text-xs font-medium text-primary mb-1">Benchmark</h5>
                  <p className="text-xs text-muted-foreground">
                    {generatedKpis.find(k => k.id === selectedKpi)?.benchmark}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

// SQL Generator Component
const SqlGeneratorFeature = () => {
  const [selectedKpi, setSelectedKpi] = useState("mau")
  const [selectedDb, setSelectedDb] = useState("postgres")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSql, setGeneratedSql] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  
  const handleGenerate = () => {
    setIsGenerating(true)
    setGeneratedSql(null)
    
    // Simulate API call with delay
    setTimeout(() => {
      setGeneratedSql(demoSqlQueries[selectedKpi as keyof typeof demoSqlQueries])
      setIsGenerating(false)
    }, 1200)
  }
  
  const handleCopy = () => {
    if (generatedSql) {
      navigator.clipboard.writeText(generatedSql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  return (
    <div className="glass-card p-6 rounded-xl h-full">
      <h3 className="text-xl font-semibold mb-4">Generate SQL Queries</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">KPI</label>
          <Select value={selectedKpi} onValueChange={setSelectedKpi}>
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select KPI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mau">Monthly Active Users</SelectItem>
              <SelectItem value="conversion">Conversion Rate</SelectItem>
              <SelectItem value="churn">Churn Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Database</label>
          <Select value={selectedDb} onValueChange={setSelectedDb}>
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select database" />
            </SelectTrigger>
            <SelectContent>
              {dataSources.map(db => (
                <SelectItem key={db.id} value={db.id}>
                  <div className="flex items-center gap-2">
                    {React.cloneElement(db.icon as React.ReactElement, { className: "h-4 w-4" })}
                    <span>{db.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating}
        className="w-full raycast-button mb-4"
      >
        {isGenerating ? (
          <>
            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
            Generating SQL...
          </>
        ) : (
          <>
            <Code2 className="mr-2 h-4 w-4" />
            Generate SQL
          </>
        )}
      </Button>
      
      {generatedSql && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm text-muted-foreground">Generated SQL:</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              className="h-8 px-2 text-xs"
            >
              {copied ? (
                <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
              ) : (
                <Code2 className="h-3.5 w-3.5 mr-1" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          
          <div className="font-mono text-xs rounded-md bg-black/40 p-3 overflow-x-auto max-h-[300px] overflow-y-auto">
            <pre className="text-green-400">{generatedSql}</pre>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Dashboard Builder Component
const DashboardBuilderFeature = () => {
  const [layout, setLayout] = useState("balanced")
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    { id: "widget1", title: "Monthly Active Users", chartType: "line", kpiId: "mau", x: 0, y: 0, w: 1, h: 1 },
    { id: "widget2", title: "Conversion Rate", chartType: "bar", kpiId: "conversion", x: 1, y: 0, w: 1, h: 1 },
    { id: "widget3", title: "Churn Rate", chartType: "gauge", kpiId: "churn", x: 0, y: 1, w: 1, h: 1 },
  ])
  
  const selectedLayout = dashboardLayouts.find(l => l.id === layout) || dashboardLayouts[0]
  
  const handleAddWidget = () => {
    const newWidget: DashboardWidget = {
      id: `widget${widgets.length + 1}`,
      title: "New Widget",
      chartType: "bar",
      kpiId: "mau",
      x: 0,
      y: widgets.length > 0 ? Math.max(...widgets.map(w => w.y)) + 1 : 0,
      w: 1,
      h: 1
    }
    
    setWidgets([...widgets, newWidget])
  }
  
  return (
    <div className="glass-card p-6 rounded-xl h-full">
      <h3 className="text-xl font-semibold mb-4">Design Your Dashboard</h3>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Layout</label>
          <Select value={layout} onValueChange={setLayout}>
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              {dashboardLayouts.map(l => (
                <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-6">
          <Button 
            onClick={handleAddWidget}
            size="sm"
            className="glass hover-scale"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Widget
          </Button>
        </div>
      </div>
      
      <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 mb-4">
        <div 
          className={`grid grid-cols-${selectedLayout.columns} gap-3 auto-rows-[80px]`}
          style={{ gridTemplateColumns: `repeat(${selectedLayout.columns}, 1fr)` }}
        >
          {widgets.map((widget, index) => (
            <motion.div 
              key={widget.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-black/40 border border-white/5 rounded-md p-3 flex flex-col cursor-move hover:border-primary/30 transition-colors"
              style={{
                gridColumn: `span ${widget.w}`,
                gridRow: `span ${widget.h}`,
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-xs font-medium truncate">{widget.title}</h5>
                <div className="flex gap-1">
                  {chartTypes.find(c => c.id === widget.chartType)?.icon && (
                    React.cloneElement(
                      chartTypes.find(c => c.id === widget.chartType)?.icon as React.ReactElement,
                      { className: "h-3 w-3 text-muted-foreground" }
                    )
                  )}
                  <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-black/50">
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                {widget.chartType === 'bar' && <BarChart3 className="h-10 w-10 text-primary/40" />}
                {widget.chartType === 'line' && <LineChart className="h-10 w-10 text-primary/40" />}
                {widget.chartType === 'pie' && <PieChart className="h-10 w-10 text-primary/40" />}
                {widget.chartType === 'gauge' && <Gauge className="h-10 w-10 text-primary/40" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button className="raycast-button">
          <Eye className="mr-2 h-4 w-4" />
          Preview Dashboard
        </Button>
      </div>
    </div>
  )
}

// Main Features Section
export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState("kpi")
  const featuresRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Track mouse movement for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Interactive feature tabs
  const featureTabs = [
    { id: "kpi", label: "KPI Generator", icon: <Sparkles className="h-4 w-4" /> },
    { id: "sql", label: "SQL Generator", icon: <Code2 className="h-4 w-4" /> },
    { id: "dashboard", label: "Dashboard Builder", icon: <LayoutDashboard className="h-4 w-4" /> }
  ]

  return (
    <section 
      id="features" 
      className="py-20 relative overflow-hidden"
      ref={featuresRef}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90 z-0"></div>
      
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-primary">
            Try Metrically Now
          </h2>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto">
            Experience how Metrically works with these interactive demos. Click on any feature to try it out.
          </p>
        </div>
        
        {/* Interactive feature tabs */}
        <Tabs defaultValue="kpi" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center">
            <TabsList className="bg-black/40 border border-white/10 backdrop-blur-md">
              {featureTabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className={cn(
                    "data-[state=active]:bg-primary/20 data-[state=active]:text-primary",
                    "transition-all duration-300 flex items-center gap-2"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <TabsContent value="kpi" className="mt-6">
            <KpiGeneratorFeature />
          </TabsContent>
          
          <TabsContent value="sql" className="mt-6">
            <SqlGeneratorFeature />
          </TabsContent>
          
          <TabsContent value="dashboard" className="mt-6">
            <DashboardBuilderFeature />
          </TabsContent>
        </Tabs>
        
        {/* Testimonial */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative backdrop-blur-md bg-black/40 border border-white/10 rounded-lg p-8 interactive-card">
            {/* Quote marks */}
            <div className="absolute top-4 left-4 text-6xl text-primary/20">"</div>
            <div className="absolute bottom-4 right-4 text-6xl text-primary/20">"</div>
            
            <blockquote className="relative z-10 text-lg text-center italic text-muted-foreground/90 px-8">
              Metrically has completely transformed how we track our product performance. We've uncovered insights we never would have found on our own.
            </blockquote>
            
            <div className="flex items-center justify-center mt-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 mr-3"></div>
              <div>
                <div className="font-medium">Sarah Chen</div>
                <div className="text-sm text-muted-foreground">CPO at Acme Inc</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
