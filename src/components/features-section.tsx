"use client"

import React, { useState, useRef, useEffect } from "react"
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
  LayoutDashboard, 
  Sparkles, 
  Lightbulb,
  LineChart,
  PieChart,
  Gauge,
  RotateCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ClipboardCopy,
  Plus,
  Trash2,
  Eye,
  Layers
} from "lucide-react"
import { InsightsAnomalyFeature } from "./features-simulations";

// Types for interactive components
type KPI = {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
  importance: string;
  calculation: string;
  benchmark: string;
}; 

// Import rich KPI data for interactive features
import { kpiData } from "@/components/features-simulations"

// Dashboard widget type
type DashboardWidget = {
  id: string;
  name: string;
  type: string;
};

// Chart types for dashboard widgets
const chartTypes = [
  { id: "bar", name: "Bar Chart", icon: <BarChart3 /> },
  { id: "line", name: "Line Chart", icon: <LineChart /> },
  { id: "pie", name: "Pie Chart", icon: <PieChart /> },
  { id: "gauge", name: "Gauge", icon: <Gauge /> },
];

// Layout options for dashboard
const dashboardLayouts = [
  { id: "balanced", name: "Balanced (3 columns)", columns: 3 },
  { id: "wide", name: "Wide (2 columns)", columns: 2 },
  { id: "single", name: "Single Column", columns: 1 },
];

// Enhanced KpiGeneratorFeature component
const KpiGeneratorFeature = () => {
  const [productType, setProductType] = useState("SaaS");
  const [companyStage, setCompanyStage] = useState("early");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKpis, setGeneratedKpis] = useState<KPI[]>([]);
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);

  // Simulate KPI generation
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedKpis(
        kpiData.map(kpi => ({
          ...kpi,
          trend: (['up', 'down', 'neutral'].includes(kpi.trend) ? kpi.trend : 'neutral') as 'up' | 'down' | 'neutral',
        }))
      );
      setIsGenerating(false);
    }, 1500);
  };

  // Toggle expand/collapse for a KPI
  const handleExpand = (id: string) => {
    setExpandedKpi(expandedKpi === id ? null : id);
  };

  return (
    <div className="glass-card p-6 rounded-xl h-full">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary/80" />
        KPI Generator
      </h3>
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-primary/90 to-indigo-600/90 hover:from-primary hover:to-indigo-600 text-white border-0 shadow-[0_0_15px_rgba(125,125,255,0.3)] hover:shadow-[0_0_25px_rgba(125,125,255,0.5)] transition-all duration-300 mb-6"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {generatedKpis.map((kpi, idx) => (
          <div
            key={kpi.id}
            className="relative bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-primary/40 transition group"
            onClick={() => handleExpand(kpi.id)}
          >
            <div className="absolute top-2 left-2 text-xs text-white/60 font-mono bg-black/30 px-2 py-1 rounded-full">
              {idx + 1}
            </div>
            <div className="w-16 h-16 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center mb-2">
              {/* Visualization placeholder */}
              <BarChart3 className="w-8 h-8 text-primary/60" />
            </div>
            <div className="font-semibold text-white text-lg mb-1 text-center">{kpi.name}</div>
            <div className="text-sm text-white/60 mb-2">{kpi.value}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                kpi.trend === 'up' ? 'bg-green-500/10 text-green-400' :
                kpi.trend === 'down' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-300')
              }>
                {kpi.trend === 'up' && <ArrowUpRight className="inline h-3 w-3 mr-1" />}
                {kpi.trend === 'down' && <ArrowDownRight className="inline h-3 w-3 mr-1" />}
                {kpi.trend === 'neutral' && <Minus className="inline h-3 w-3 mr-1" />}
                {kpi.change}
              </span>
            </div>
            <Button
              size="sm"
              className="w-full mt-auto bg-primary/80 hover:bg-primary text-white text-xs"
              onClick={e => {
                e.stopPropagation();
                setExpandedKpi(expandedKpi === kpi.id ? null : kpi.id);
              }}
            >
              {expandedKpi === kpi.id ? 'Hide Details' : 'View Details'}
            </Button>
            <AnimatePresence>
              {expandedKpi === kpi.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 bg-black/90 rounded-lg p-4 flex flex-col justify-center items-center z-10 border border-primary/30 shadow-lg"
                >
                  <div className="text-white font-bold text-lg mb-2">{kpi.name}</div>
                  <div className="text-white/80 mb-2 text-center">{kpi.description}</div>
                  <div className="w-full grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className="text-xs text-white/60">Calculation</div>
                      <div className="text-white/90 text-sm">{kpi.calculation}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60">Importance</div>
                      <div className="text-white/90 text-sm">{kpi.importance}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60">Benchmark</div>
                      <div className="text-white/90 text-sm">{kpi.benchmark}</div>
                    </div>
                  </div>
                  {/* Add additional buttons or actions here if needed */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// Cohort Analysis Feature
import { CohortAnalysis } from '@/components/cohort-analysis';

// Dashboard Builder Component
const DashboardBuilderFeature = () => {
  const [layout, setLayout] = useState("balanced"); // Default to 'balanced' layout
  // ... rest of DashboardBuilderFeature state and logic ...
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    { id: 'widget1', name: 'Widget 1', type: 'chart' },
    { id: 'widget2', name: 'Widget 2', type: 'chart' },
  ]);

  const selectedLayout = dashboardLayouts.find((l) => l.id === layout) || dashboardLayouts[0];

  const handleAddWidget = () => {
    const newWidget: DashboardWidget = {
      id: `widget${widgets.length + 1}`,
      name: "New Widget",
      type: "chart",
    };
    setWidgets([...widgets, newWidget]);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id));
  };

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
              {dashboardLayouts.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="pt-6">
          <Button onClick={handleAddWidget} size="sm" className="glass hover-scale">
            <Plus className="h-4 w-4 mr-1" />
            Add Widget
          </Button>
        </div>
      </div>
      <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 mb-4">
        <div
          className={`grid gap-3 auto-rows-[80px]`}
          style={{ gridTemplateColumns: `repeat(${selectedLayout.columns}, 1fr)` }}
        >
          {widgets.map((widget, index) => (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-black/40 border border-white/5 rounded-md p-3 flex flex-col cursor-move hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-xs font-medium truncate">{widget.name}</h5>
                <div className="flex gap-1">
                  <BarChart3 className="h-3 w-3 text-muted-foreground" />
                  <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-black/50" onClick={() => handleRemoveWidget(widget.id)}>
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-muted-foreground text-xs">[Visualization Placeholder]</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">Widget #{index + 1}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button className="raycast-button">
          <Eye className="mr-2 h-4 w-4" />
          Preview Dashboard
        </Button>
      </div>
    </div>
  );
};

// FeaturesSection component
const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("kpi");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const featuresRef = useRef<HTMLDivElement | null>(null);

  // Dashboard widgets state for the dashboard builder
  type WidgetType = { id: string; name: string; type: string };
  const [dashboardWidgets, setDashboardWidgets] = useState<WidgetType[]>([
    { id: 'widget1', name: 'Widget 1', type: 'chart' },
    { id: 'widget2', name: 'Widget 2', type: 'chart' },
  ]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  // Add widget handler
  function handleAddWidget(): void {
    const newWidget: WidgetType = {
      id: `widget${dashboardWidgets.length + 1}`,
      name: `Widget ${dashboardWidgets.length + 1}`,
      type: 'chart',
    };
    setDashboardWidgets([...dashboardWidgets, newWidget]);
  }
  // Remove widget handler
  function handleRemoveWidget(id: string) {
    setDashboardWidgets(dashboardWidgets.filter(widget => widget.id !== id));
    if (selectedWidget === id) setSelectedWidget(null);
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Interactive feature tabs
  const featureTabs = [
    { id: "kpi", label: "KPI Generator", icon: <Sparkles className="h-4 w-4" /> },
    { id: "anomaly", label: "Anomaly Insights", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "cohort", label: "Cohort Analysis", icon: <Layers className="h-4 w-4" /> },
    { id: "dashboard", label: "Dashboard Builder", icon: <LayoutDashboard className="h-4 w-4" /> },
  ];

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
        <Tabs defaultValue="kpi" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center">
            <TabsList className="bg-black/40 border border-white/10 backdrop-blur-md">
              {featureTabs.map((tab: { id: string; label: string; icon: React.ReactNode }) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className={typeof cn === 'function' ? cn(
                    "data-[state=active]:bg-primary/20 data-[state=active]:text-primary",
                    "transition-all duration-300 flex items-center gap-2"
                  ) : "data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-300 flex items-center gap-2"}
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
          <TabsContent value="anomaly" className="mt-6">
            <InsightsAnomalyFeature />
          </TabsContent>
          <TabsContent value="cohort" className="mt-6">
            <CohortAnalysis />
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
  );
};

export default FeaturesSection;
