"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, MessageCircle, CheckCircle, PlusCircle, X, Trash2, Settings2, 
  Sparkles, Code2, LayoutDashboard, BarChart3, LineChart, PieChart, Gauge,
  Database, Terminal, FileText, RefreshCw, RotateCw, Filter, Search, ChevronRight, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import './feature-fixes.css';

// Animation variants for sleek transitions
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Typing animation component for code generation
interface TypedTextProps {
  text: string;
  className?: string;
}

const TypedText: React.FC<TypedTextProps> = ({ text, className = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 25);
    
    return () => clearInterval(timer);
  }, [text]);
  
  return <span className={className}>{displayedText}<span className="animate-blink">|</span></span>;
};

// Custom cursor component for video-like demo effect
interface CursorProps {
  position: { x: number; y: number };
  clicking: boolean;
  visible: boolean;
}

const AnimatedCursor = ({ position, clicking, visible }: CursorProps) => {
  return (
    <motion.div 
      className="absolute pointer-events-none z-50"
      animate={{ 
        x: position.x, 
        y: position.y,
        scale: clicking ? 0.9 : 1
      }}
      transition={{ 
        type: "spring", 
        damping: 25, 
        stiffness: 300
      }}
      style={{ left: 0, top: 0 }}
    >
      <div className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2L18 12L10 14L8 22L6 2Z" fill="white" />
          <path d="M6 2L18 12L10 14L8 22L6 2Z" stroke="#000000" strokeWidth="1.5" />
        </svg>
        {clicking && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0.7 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-6 h-6 bg-primary/30 rounded-full"
            style={{ top: -3, left: -3 }}
          />
        )}
      </div>
    </motion.div>
  );
};

// Sample data for all simulations
const businessTypes = ["SaaS", "E-commerce", "Mobile App", "Marketplace", "Fintech"];

const kpiCategories = ["Growth", "Engagement", "Revenue", "Marketing", "Product"];

const databaseTypes = [
  { id: "postgres", name: "PostgreSQL", icon: <Database className="text-blue-400" /> },
  { id: "mysql", name: "MySQL", icon: <Database className="text-orange-400" /> },
  { id: "bigquery", name: "BigQuery", icon: <Database className="text-green-400" /> },
  { id: "snowflake", name: "Snowflake", icon: <Database className="text-cyan-400" /> }
];

export const kpiData = [
  {
    id: "1",
    name: "Monthly Active Users",
    value: "8,249",
    change: "+12.5%",
    trend: "up",
    category: "Growth",
    chartType: "line",
    description: "The number of unique users who engaged with your product in the past month.",
    importance: "Critical metric for understanding product engagement and growth trajectory.",
    calculation: "COUNT(DISTINCT user_id) WHERE activity_date > current_date - 30",
    benchmark: "Growth-stage B2B SaaS typically sees 10-15% MoM growth."
  },
  {
    id: "2",
    name: "Conversion Rate",
    value: "5.8%",
    change: "+0.7%",
    trend: "up",
    category: "Marketing",
    chartType: "bar",
    description: "Percentage of visitors who complete a desired action (signup, purchase).",
    importance: "Measures effectiveness of your user journey and acquisition channels.",
    calculation: "(Number of conversions / Total visitors) × 100",
    benchmark: "Average B2B SaaS conversion rates are 3-5%."
  },
  {
    id: "3",
    name: "Churn Rate",
    value: "2.4%",
    change: "-0.5%",
    trend: 'down' as const,
    category: "Retention",
    chartType: "gauge",
    description: "Percentage of customers who cancel their subscription in a given period.",
    importance: "Directly impacts revenue retention and customer lifetime value.",
    calculation: "(Customers lost in period / Total customers at start of period) × 100",
    benchmark: "Healthy SaaS churn rates are typically below 5% monthly."
  },
  {
    id: "4",
    name: "Customer Lifetime Value",
    value: "$1,842",
    change: "+$210",
    trend: "up",
    category: "Revenue",
    chartType: "line",
    description: "The total revenue expected from a customer throughout their relationship with your business.",
    importance: "Helps determine sustainable acquisition costs and overall business health.",
    calculation: "Average Purchase Value × Purchase Frequency × Average Customer Lifespan",
    benchmark: "LTV should be at least 3x CAC for a sustainable business model."
  }
];

// KPI Generator Feature in Raycast style
// SQL Generator Feature in Raycast style
const SqlGeneratorFeature = () => {
  const [selectedKpi, setSelectedKpi] = useState("mau");
  const [selectedDb, setSelectedDb] = useState("postgres");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSql, setGeneratedSql] = useState("");
  const [copied, setCopied] = useState(false);
  
  const sqlTemplates = {
    mau: `-- Monthly Active Users over time
SELECT
  DATE_TRUNC('month', event_date) AS month,
  COUNT(DISTINCT user_id) AS monthly_active_users
FROM user_events
WHERE event_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', event_date)
ORDER BY month;`,
    
    conversion: `-- Conversion Rate by Source
SELECT
  utm_source,
  COUNT(*) AS visits,
  COUNT(CASE WHEN converted = true THEN 1 END) AS conversions,
  ROUND((COUNT(CASE WHEN converted = true THEN 1 END) * 100.0 / COUNT(*)), 2) AS conversion_rate
FROM user_journeys
WHERE visit_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY utm_source
ORDER BY visits DESC;`,
    
    churn: `-- Monthly Churn Rate
WITH monthly_stats AS (
  SELECT
    DATE_TRUNC('month', date) AS month,
    COUNT(DISTINCT CASE WHEN status = 'active' AND DATE_TRUNC('month', start_date) < DATE_TRUNC('month', date) THEN user_id END) AS start_users,
    COUNT(DISTINCT CASE WHEN status = 'churned' AND DATE_TRUNC('month', churn_date) = DATE_TRUNC('month', date) THEN user_id END) AS churned_users
  FROM subscriptions
  WHERE date >= CURRENT_DATE - INTERVAL '12 months'
  GROUP BY DATE_TRUNC('month', date)
)
SELECT
  month,
  start_users,
  churned_users,
  ROUND((churned_users * 100.0 / NULLIF(start_users, 0)), 2) AS churn_rate
FROM monthly_stats
ORDER BY month;`
  };
  
  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedSql("");
    
    // Simulate typing effect by implementing it progressively
    const fullSql = sqlTemplates[selectedKpi as keyof typeof sqlTemplates];
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullSql.length) {
        setGeneratedSql(fullSql.substring(0, index));
        index += 3; // Increment by more characters for faster typing
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 10);
  };
  
  const handleCopy = () => {
    if (generatedSql) {
      navigator.clipboard.writeText(generatedSql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="backdrop-blur-xl bg-black/30 rounded-xl border border-white/10 overflow-hidden">
      <div className="border-b border-white/10 p-4">
        <h3 className="text-xl font-semibold mb-4">SQL Generator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">KPI</label>
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
            <label className="block text-sm text-muted-foreground mb-2">Database</label>
            <Select value={selectedDb} onValueChange={setSelectedDb}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Select database" />
              </SelectTrigger>
              <SelectContent>
                {databaseTypes.map(db => (
                  <SelectItem key={db.id} value={db.id}>
                    <div className="flex items-center gap-2">
                      {React.cloneElement(db.icon, { className: "h-4 w-4" })}
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
      </div>
      
      <div className="p-4">
        {generatedSql ? (
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
            
            <div className="font-mono text-xs rounded-md bg-black/40 p-3 overflow-x-auto border border-white/5 max-h-[300px] overflow-y-auto relative">
              <div className="absolute top-2 right-2 flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-white/20"></div>
                <div className="h-2 w-2 rounded-full bg-white/20"></div>
                <div className="h-2 w-2 rounded-full bg-green-500/70 animate-pulse"></div>
              </div>
              <pre className="text-green-400 pt-4">{generatedSql}</pre>
            </div>
          </motion.div>
        ) : (
          <div className="bg-black/20 border border-white/5 rounded-md p-8 text-center">
            <Code2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">Select a KPI and database, then click Generate SQL to create optimized queries</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Builder Feature in Raycast style
const DashboardBuilderFeature = () => {
  const [layout, setLayout] = useState("2x2");
  const [widgets, setWidgets] = useState(kpiData.slice(0, 3).map((kpi, index) => ({
    id: `widget${index + 1}`,
    title: kpi.name,
    value: kpi.value,
    change: kpi.change,
    trend: kpi.trend,
    chartType: kpi.chartType || "line",
    x: index % 2,
    y: Math.floor(index / 2),
    w: 1,
    h: 1
  })));
  
  // Dashboard layout settings
  const layouts = [
    { id: "2x2", name: "2×2 Grid", columns: 2 },
    { id: "3x2", name: "3×2 Grid", columns: 3 },
    { id: "1x3", name: "Single Row", columns: 3 }
  ];
  
  const selectedLayout = layouts.find(l => l.id === layout) || layouts[0];
  
  const handleAddWidget = () => {
    const newWidget = {
      id: `widget${widgets.length + 1}`,
      title: "New Widget",
      value: "0",
      change: "+0%",
      trend: 'up',
      chartType: "bar",
      x: widgets.length % selectedLayout.columns,
      y: Math.floor(widgets.length / selectedLayout.columns),
      w: 1,
      h: 1
    };
    
    setWidgets([...widgets, newWidget]);
  };
  
  return (
    <div className="feature-card">
      <div className="feature-card-header">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
          Dashboard Builder
        </h3>
        
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <label className="text-tiny text-white/60 mb-1 block">Layout</label>
            <Select value={layout} onValueChange={setLayout}>
              <SelectTrigger className="bg-black/30 border-white/10 h-8 text-xs">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10">
                {layouts.map(l => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-1 flex items-end">
            <Button 
              onClick={handleAddWidget}
              className="raycast-button h-8 w-full"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Add Widget</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="feature-card-content">
        <div className="bg-black/20 rounded-lg border border-white/5 overflow-hidden h-full min-h-[250px]">
          <div 
            className="grid gap-3 p-3 h-full"
            style={{ gridTemplateColumns: `repeat(${selectedLayout.columns}, 1fr)`, gridAutoRows: 'minmax(100px, auto)' }}
          >
            {widgets.map((widget, index) => (
              <motion.div 
                key={widget.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="dashboard-widget cursor-move hover:border-primary/20 border border-white/10"
                style={{
                  gridColumn: `span 1`,
                  gridRow: `span 1`,
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                whileDrag={{ zIndex: 10, boxShadow: "0 0 0 1px rgba(79, 70, 229, 0.4), 0 0 15px 2px rgba(79, 70, 229, 0.2)" }}
              >
                <div className="dashboard-widget-header">
                  <h5 className="text-xs font-medium truncate-text">{widget.title}</h5>
                  <div className="flex gap-1 flex-shrink-0">
                    {widget.chartType === 'bar' && <BarChart3 className="h-3 w-3 text-white/50" />}
                    {widget.chartType === 'line' && <LineChart className="h-3 w-3 text-white/50" />}
                    {widget.chartType === 'gauge' && <Gauge className="h-3 w-3 text-white/50" />}
                    <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full p-0 hover:bg-black/50">
                      <Trash2 className="h-2.5 w-2.5 text-white/50 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="dashboard-widget-content">
                  {widget.chartType === 'bar' && <BarChart3 className="h-8 w-8 text-primary/40" />}
                  {widget.chartType === 'line' && <LineChart className="h-8 w-8 text-primary/40" />}
                  {widget.chartType === 'gauge' && <Gauge className="h-8 w-8 text-primary/40" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <Button className="raycast-button h-8">
            <Settings2 className="mr-2 h-3.5 w-3.5" />
            Preview Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

const KpiGeneratorFeature = () => {
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState<string>("SaaS");
  const [kpiCategory, setKpiCategory] = useState<string>("Growth");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKpis, setGeneratedKpis] = useState(kpiData);
  
  // Simulate KPI generation with AI
  const handleGenerateKpis = () => {
    setIsGenerating(true);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setGeneratedKpis(kpiData.filter(kpi => 
        // Simulate filtering based on user selections
        (businessType === "SaaS" || businessType === "Mobile App")
      ));
      setIsLoading(false);
      setIsGenerating(false);
    }, 1500);
  };
  
  return (
    <div className="feature-card">
      {/* Top bar with controls */}
      <div className="feature-card-header">
        <h3 className="text-lg font-medium mb-2">KPI Generator</h3>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-tiny text-white/60 mb-1 block">Business Type</label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger className="bg-black/30 border-white/10 h-8 text-xs">   
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10">
                {businessTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-tiny text-white/60 mb-1 block">KPI Category</label>
            <Select value={kpiCategory} onValueChange={setKpiCategory}>
              <SelectTrigger className="bg-black/30 border-white/10 h-8 text-xs">   
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10">
                {kpiCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={handleGenerateKpis} 
              className="w-full raycast-button h-8"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RotateCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  <span className="text-xs">Generate KPIs</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPI catalog display area */}
      <div className="feature-card-content">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RotateCw className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
              <p className="text-xs text-white/50">Analyzing business data...</p>
            </div>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            {generatedKpis.map((kpi, index) => (
              <motion.div
                key={kpi.id}
                variants={fadeInUp}
                className={`kpi-card rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer ${activeKpi === kpi.id ? 'col-span-2' : ''}`}
                whileHover={{ y: -1 }}
                onClick={() => setActiveKpi(activeKpi === kpi.id ? null : kpi.id)}
              >
                <div className="kpi-card-content">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full">
                      <span className="text-micro font-medium">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-micro text-white/60 px-1 py-0.5 bg-black/20 rounded-sm truncate-text">{kpi.category}</span>
                        <span className={`text-micro px-1 py-0.5 rounded-full truncate-text ${kpi.trend === 'up' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {kpi.change}
                        </span>
                      </div>
                      <h4 className="font-medium text-xs mb-0.5 leading-tight truncate-text">{kpi.name}</h4>
                      <div className="text-sm font-bold">{kpi.value}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 bg-black/20 rounded-md px-1.5 py-1 inline-block">
                    <div className="flex items-center">
                      {kpi.chartType === "line" && <LineChart className="h-3 w-3 text-primary mr-1" />}
                      {kpi.chartType === "bar" && <BarChart3 className="h-3 w-3 text-primary mr-1" />}
                      {kpi.chartType === "gauge" && <Gauge className="h-3 w-3 text-primary mr-1" />}
                      <span className="text-micro text-white/70">{kpi.chartType.charAt(0).toUpperCase() + kpi.chartType.slice(1)}</span>
                    </div>
                  </div>
                  
                  {/* KPI details when expanded */}
                  {activeKpi === kpi.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="kpi-card-expanded mt-2 pt-2 border-t border-white/10"
                    >
                      <div className="mb-1.5">
                        <p className="text-tiny text-white/80 leading-tight">{kpi.description}</p>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div>
                          <h5 className="text-micro font-medium text-white/70 mb-0.5">Importance</h5>
                          <p className="text-tiny text-white/80 leading-tight">{kpi.importance}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-micro font-medium text-white/70 mb-0.5">Calculation</h5>
                          <div className="bg-black/30 rounded-md p-1 font-mono text-micro text-white/80 overflow-x-auto whitespace-pre-wrap">
                            {kpi.calculation}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-micro font-medium text-white/70 mb-0.5">Benchmark</h5>
                          <p className="text-tiny text-white/80 leading-tight">{kpi.benchmark}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SQL Generator Feature
export const SqlFeature = () => {
  const [generating, setGenerating] = useState(false);
  const [generatedSql, setGeneratedSql] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const fullSql = `SELECT 
  DATE_TRUNC('month', event_date) AS month,
  COUNT(DISTINCT user_id) AS monthly_active_users
FROM user_events
WHERE event_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', event_date)
ORDER BY month DESC;`;

  useEffect(() => {
    if (generating && typingIndex < fullSql.length) {
      const timer = setTimeout(() => {
        setGeneratedSql(fullSql.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 30); // typing speed
      return () => clearTimeout(timer);
    } else if (typingIndex >= fullSql.length && generating) {
      setTimeout(() => setGenerating(false), 500);
    }
  }, [generating, typingIndex]);

  const handleGenerate = () => {
    setGenerating(true);
    setTypingIndex(0);
    setGeneratedSql('');
  };

  return (
    <div className="p-4 glass-card backdrop-blur-lg backdrop-saturate-150 rounded-xl border border-white/10 shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-center">SQL Generator</h3>
      
      <div className="mb-4 p-4 bg-black/20 rounded-lg border border-white/5">
        <div className="text-sm mb-2 text-white/80">Generate SQL for:</div>
        <div className="glass-input p-2 rounded border border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-primary/30"></span>
            <span>Monthly Active Users over time</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleGenerate}
        disabled={generating}
        className="generate-button w-full raycast-button mb-4 py-2 px-4 rounded flex items-center justify-center backdrop-blur-md shadow-glow transition-all"
      >
        {generating ? (
          <>
            <span className="animate-spin mr-2">⟳</span>
            Generating SQL...
          </>
        ) : (
          <>
            <Code2 className="mr-2 h-4 w-4" />
            Generate SQL
          </>
        )}
      </button>
      
      {generatedSql && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="relative font-mono text-xs bg-black/40 p-3 rounded-md overflow-x-auto border border-green-500/20"
        >
          <div className="absolute top-2 right-2 flex gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-green-500/50"></div>
          </div>
          <pre className="text-green-400 pt-4">{generatedSql}</pre>
          {!generating && generatedSql && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center"
            >
              <span className="text-green-400/70 text-[10px]">Query generated successfully</span>
              <span className="text-[10px] text-white/50">12ms execution time</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Dashboard Builder Feature
export const DashboardFeature = () => {
  const [widgets] = useState([
    { id: "widget1", title: "Monthly Active Users", chartType: "line" },
    { id: "widget2", title: "Conversion Rate", chartType: "bar" },
    { id: "widget3", title: "Churn Rate", chartType: "gauge" }
  ]);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="p-4 glass-card backdrop-blur-lg backdrop-saturate-150 rounded-xl border border-white/10 shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-center">Dashboard Builder</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="p-2 bg-black/30 rounded border border-white/10 text-xs flex items-center gap-1">
            <LineChart className="h-3 w-3" /> Line
          </div>
          <div className="p-2 bg-black/30 rounded border border-white/10 text-xs flex items-center gap-1">
            <BarChart3 className="h-3 w-3" /> Bar
          </div>
          <div className="p-2 bg-black/30 rounded border border-white/10 text-xs flex items-center gap-1">
            <Gauge className="h-3 w-3" /> Gauge
          </div>
        </div>
        <div className="p-2 bg-primary/20 rounded border border-primary/30 text-xs flex items-center gap-1 text-primary">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span> Auto Layout
        </div>
      </div>
      
      <div className="relative bg-black/30 backdrop-blur-sm rounded-lg p-4 grid grid-cols-2 gap-3 border border-white/5">
        {widgets.map((widget, index) => (
          <motion.div 
            key={widget.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileDrag={{ 
              scale: 1.05,
              zIndex: 10,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)" 
            }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className="dashboard-widget glass-morphism bg-black/40 border border-white/5 rounded-md p-3 flex flex-col cursor-move hover:border-primary/30 transition-colors shadow-glow"
          >
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-xs font-medium truncate">{widget.title}</h5>
            </div>
            <div className="flex-1 flex items-center justify-center">
              {widget.chartType === 'bar' && <BarChart3 className="h-10 w-10 text-primary/40" />}
              {widget.chartType === 'line' && <LineChart className="h-10 w-10 text-primary/40" />}
              {widget.chartType === 'gauge' && <Gauge className="h-10 w-10 text-primary/40" />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Second instance of AnimatedCursor removed (duplicate)

// Insights Anomaly Detector Feature (Replacing SQL Generator)
const InsightsAnomalyFeature = () => {
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [timeframe, setTimeframe] = useState("last30days");
  const [anomalies, setAnomalies] = useState<Array<{date: string, value: number, expected: number, severity: string}>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sample anomaly data
  const sampleAnomalies = {
    revenue: [
      { date: "2025-03-27", value: 15200, expected: 12300, severity: "medium" },
      { date: "2025-04-02", value: 5400, expected: 11800, severity: "high" }
    ],
    conversion: [
      { date: "2025-03-21", value: 4.8, expected: 3.5, severity: "medium" },
      { date: "2025-03-29", value: 2.1, expected: 3.6, severity: "medium" }
    ],
    engagement: [
      { date: "2025-03-25", value: 8.7, expected: 5.2, severity: "high" },
      { date: "2025-04-01", value: 2.3, expected: 5.1, severity: "high" }
    ]
  };

  const handleDetectAnomalies = () => {
    setIsAnalyzing(true);
    setAnomalies([]);
    
    // Simulate analysis time
    setTimeout(() => {
      setAnomalies(sampleAnomalies[selectedMetric as keyof typeof sampleAnomalies] || []);
      setIsAnalyzing(false);
    }, 1500);
  };

  const formatValue = (value: number) => {
    if (selectedMetric === "revenue") return `$${value.toLocaleString()}`;
    if (selectedMetric === "conversion") return `${value}%`;
    return value.toString();
  };

  const getAnomalyColor = (severity: string) => {
    return severity === "high" ? "text-red-500" : "text-amber-500";
  };

  const getAnomalyIcon = (value: number, expected: number) => {
    return value > expected ? 
      <ArrowRight className="rotate-45 text-red-400" /> : 
      <ArrowRight className="-rotate-45 text-amber-400" />;
  };

  return (
    <div className="feature-card">
      <div className="feature-card-header">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5 text-primary" />
          Anomaly Detection
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-tiny text-white/60 mb-1 block">Metric</label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="bg-black/30 border-white/10 h-8 text-xs">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10">
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-tiny text-white/60 mb-1 block">Timeframe</label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="bg-black/30 border-white/10 h-8 text-xs">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10">
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={handleDetectAnomalies} 
              className="w-full raycast-button h-8"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                  <span className="text-xs">Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Detect Anomalies</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="feature-card-content">
        {anomalies.length > 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-2"
          >
            {anomalies.map((anomaly, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="anomaly-card"
              >
                <div className="anomaly-card-header">
                  <div className={`flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full ${getAnomalyColor(anomaly.severity)} bg-black/30 mr-2`}>
                    {getAnomalyIcon(anomaly.value, anomaly.expected)}
                  </div>
                  <div className="text-tiny text-white/70 truncate-text">{anomaly.date}</div>
                  <div className={`anomaly-badge bg-black/40 ${getAnomalyColor(anomaly.severity)}`}>
                    {anomaly.severity}
                  </div>
                </div>
                
                <div className="anomaly-card-content">
                  <div className="flex flex-col">
                    <div className="text-xs font-medium text-white">
                      {formatValue(anomaly.value)}
                    </div>
                    <div className="text-micro text-white/50">
                      expected: {formatValue(anomaly.expected)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : isAnalyzing ? (
          <div className="h-full flex items-center justify-center text-white/50">
            <div className="text-center">
              <div className="inline-block p-2 bg-black/30 rounded-full mb-2">
                <RotateCw className="h-5 w-5 animate-spin text-primary" />
              </div>
              <div className="text-xs">Analyzing data patterns...</div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/50">
            <div className="text-center">
              <div className="inline-block p-2 bg-black/30 rounded-full mb-2">
                <Search className="h-5 w-5 text-white/30" />
              </div>
              <div className="text-xs">Select metrics and timeframe to detect anomalies</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Combined Features Section with Grid Layout
export function FeaturesSimulations() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorClicking, setIsCursorClicking] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-play demonstration sequence
  useEffect(() => {
    const runDemo = () => {
      if (!isAutoPlaying || !containerRef.current) return;
      
      const container = containerRef.current.getBoundingClientRect();
      const sequence: Array<{
        position?: { x: number; y: number };
        duration: number;
        clicking?: boolean;
        finalAction?: () => void;
      }> = [];
      
      // Get all interactive elements
      const interactiveElements = containerRef.current.querySelectorAll('.raycast-button, .kpi-card, .dashboard-widget');
      
      if (interactiveElements.length > 0) {
        // Randomly select 3 elements to interact with
        const elementIndices = Array.from({length: interactiveElements.length}, (_, i) => i);
        const shuffled = elementIndices.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(3, interactiveElements.length));
        
        selected.forEach(idx => {
          const element = interactiveElements[idx] as HTMLElement;
          
          // Move to element
          sequence.push({
            position: { 
              x: element.getBoundingClientRect().left - container.left + element.offsetWidth/2, 
              y: element.getBoundingClientRect().top - container.top + element.offsetHeight/2 
            },
            duration: 1000,
            clicking: false
          });
          
          // Click on element
          sequence.push({
            position: { 
              x: element.getBoundingClientRect().left - container.left + element.offsetWidth/2, 
              y: element.getBoundingClientRect().top - container.top + element.offsetHeight/2 
            },
            duration: 500,
            clicking: true
          });
          
          // Move cursor slightly
          sequence.push({
            position: { 
              x: element.getBoundingClientRect().left - container.left + element.offsetWidth/2 + 30, 
              y: element.getBoundingClientRect().top - container.top + element.offsetHeight/2 + 20 
            },
            duration: 800,
            clicking: false
          });
        });
      }
      
      // Execute the sequence
      let totalDelay = 0;
      sequence.forEach((step) => {
        setTimeout(() => {
          if (step.position) {
            setCursorPos(step.position);
          }
          if (step.clicking !== undefined) {
            setIsCursorClicking(step.clicking);
          }
          if (step.finalAction) {
            step.finalAction();
          }
        }, totalDelay);
        
        totalDelay += step.duration;
      });
      
      // Restart demo after sequence completes with a pause
      timeoutRef.current = setTimeout(runDemo, totalDelay + 2000);
    };
    
    // Start the demo sequence
    timeoutRef.current = setTimeout(runDemo, 1000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAutoPlaying]);
  
  // Pause auto-play when user interacts
  const handleContainerInteraction = () => {
    setIsAutoPlaying(false);
    setIsCursorVisible(false);
    
    // Resume auto-play after inactivity
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
      setIsCursorVisible(true);
    }, 8000);
  };
  
  return (
    <div 
      className="relative overflow-hidden backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl bg-gradient-to-b from-black/70 to-black/50"
      ref={containerRef}
      onClick={handleContainerInteraction}
      onMouseMove={handleContainerInteraction}
    >
      <AnimatedCursor position={cursorPos} clicking={isCursorClicking} visible={isCursorVisible} />
      
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto max-w-5xl">
          {/* KPI Generator Feature */}
          <div className="feature-card md:col-span-1 raycast-glass rounded-lg border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden shadow-glow-sm">
            <KpiGeneratorFeature />
          </div>
          
          {/* Anomaly Insights Feature (Replaced SQL Generator) */}
          <div className="feature-card md:col-span-1 raycast-glass rounded-lg border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden shadow-glow-sm">
            <InsightsAnomalyFeature />
          </div>
          
          {/* Dashboard Builder Feature */}
          <div className="feature-card md:col-span-1 raycast-glass rounded-lg border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden shadow-glow-sm">
            <DashboardBuilderFeature />
          </div>
        </div>
      </div>
    </div>
  );
}
