'use client';

import { useState, useEffect } from 'react';
import { KPIGeneratorForm } from '@/components/kpi-generator-form';
import { KPIResultsDisplay } from '@/components/kpi-results-display';
import { CustomAnalyticsGenerator } from '@/components/custom-analytics-generator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChartBar, 
  SparklesIcon, 
  LayoutDashboard, 
  LineChart, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  RefreshCw,
  ArrowUpRight,
  LucideIcon,
  BarChart4,
  Laptop,
  ChevronDownIcon
} from 'lucide-react';

type KPIGenerationResponse = { [key: string]: any };

interface DashboardStat {
  id: number;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  chartData?: number[];
}

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  lastUpdated: string;
  chartType: 'line' | 'bar' | 'pie';
}

export default function DashboardPage() {
  const [kpiResponse, setKpiResponse] = useState<KPIGenerationResponse | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDemo, setShowDemo] = useState(false);
  
  // Sample stats for demo dashboard
  const stats: DashboardStat[] = [
    { 
      id: 1, 
      name: 'Monthly Recurring Revenue', 
      value: '$12,540', 
      change: '+12.3%', 
      trend: 'up',
      icon: DollarSign,
      chartData: [12, 15, 18, 14, 17, 21, 25]
    },
    { 
      id: 2, 
      name: 'Active Users', 
      value: '1,243', 
      change: '+7.1%', 
      trend: 'up',
      icon: Users,
      chartData: [820, 932, 901, 934, 1290, 1330, 1243]
    },
    { 
      id: 3, 
      name: 'Conversion Rate', 
      value: '3.2%', 
      change: '-0.4%', 
      trend: 'down',
      icon: TrendingUp,
      chartData: [3.6, 3.5, 3.4, 3.2, 3.1, 3.3, 3.2]
    },
    { 
      id: 4, 
      name: 'Avg. Session Duration', 
      value: '2m 45s', 
      change: '+18s', 
      trend: 'up',
      icon: Clock,
      chartData: [145, 150, 158, 152, 160, 165, 165]
    }
  ];

  // Sample dashboard cards
  const dashboardCards: DashboardCard[] = [
    {
      id: 'growth-metrics',
      title: 'Growth Metrics',
      description: 'Key metrics tracking company growth',
      icon: TrendingUp,
      lastUpdated: '2 days ago',
      chartType: 'line'
    },
    {
      id: 'user-engagement',
      title: 'User Engagement',
      description: 'Engagement metrics across platform',
      icon: Users,
      lastUpdated: '1 day ago',
      chartType: 'bar'
    },
    {
      id: 'revenue-breakdown',
      title: 'Revenue Breakdown',
      description: 'Revenue streams by product',
      icon: DollarSign,
      lastUpdated: 'Today',
      chartType: 'pie'
    },
    {
      id: 'tech-performance',
      title: 'Tech Performance',
      description: 'Server and app performance metrics',
      icon: Laptop,
      lastUpdated: '3 days ago',
      chartType: 'line'
    }
  ];
  
  useEffect(() => {
    // Simulate loading demo data
    const timer = setTimeout(() => {
      setShowDemo(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handler for when KPI system is generated
  const handleKPIGenerated = (response: KPIGenerationResponse) => {
    setKpiResponse(response);
    setActiveTab('kpi-results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for mini-sparkline chart
  const renderMiniChart = (data: number[], type: 'line' | 'bar') => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    return (
      <div className="h-10 flex items-end gap-[2px]">
        {data.map((value, idx) => {
          const height = range > 0 ? ((value - minValue) / range * 100) : 50;
          
          return type === 'line' ? (
            <div 
              key={idx} 
              className="relative h-full flex-1"
            >
              {idx > 0 && (
                <div 
                  className="absolute inset-0 border-t-2 border-primary/50" 
                  style={{
                    top: `${100 - height}%`,
                    transform: 'translateY(-50%)'
                  }}
                />
              )}
            </div>
          ) : (
            <div 
              key={idx} 
              className="w-[3px] flex-1 bg-primary/30 rounded-t-sm" 
              style={{height: `${Math.max(15, height)}%`}}
            />
          );
        })}
      </div>
    );
  };

  // Helper to get the right chart icon
  const getChartIcon = (type: 'line' | 'bar' | 'pie') => {
    switch (type) {
      case 'line': return <LineChart className="h-6 w-6 text-primary" />;
      case 'bar': return <BarChart2 className="h-6 w-6 text-primary" />;
      case 'pie': return <PieChart className="h-6 w-6 text-primary" />;
      default: return <BarChart4 className="h-6 w-6 text-primary" />;
    }
  };

  // Render placeholder chart for cards
  const renderPlaceholderChart = (type: 'line' | 'bar' | 'pie') => {
    if (type === 'pie') {
      return (
        <div className="aspect-square rounded-full bg-muted/30 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-primary/20" style={{clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)'}} />
            <div className="absolute inset-0 bg-primary/30" style={{clipPath: 'polygon(50% 50%, 0 0, 100% 0)'}} />
            <div className="absolute inset-0 bg-primary/10" style={{clipPath: 'polygon(50% 50%, 0 0, 0 100%)'}} />
          </div>
          <div className="h-1/3 w-1/3 bg-background rounded-full z-10" />
        </div>
      );
    }
    
    if (type === 'bar') {
      return (
        <div className="h-full w-full flex items-end justify-between gap-2 p-2">
          {[35, 50, 70, 60, 80, 40, 90].map((height, idx) => (
            <div 
              key={idx} 
              className="flex-1 bg-primary/20 rounded-t-sm" 
              style={{height: `${height}%`}}
            />
          ))}
        </div>
      );
    }
    
    // Line chart by default
    return (
      <div className="h-full w-full p-2 flex items-center">
        <svg className="h-full w-full" viewBox="0 0 100 40">
          <path
            d="M0,35 L10,30 L20,32 L30,20 L40,28 L50,15 L60,18 L70,10 L80,12 L90,5 L100,8"
            fill="none"
            stroke="hsl(var(--primary) / 0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M0,35 L10,30 L20,32 L30,20 L40,28 L50,15 L60,18 L70,10 L80,12 L90,5 L100,8"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="1 2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Metrically Dashboard
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'dashboard' ? 'Get insights into your business metrics' : 
               activeTab === 'kpi-generator' ? 'Generate custom KPIs for your business' : 
               activeTab === 'custom-analytics' ? 'Create custom analytics with natural language' :
               'Your generated KPI system'}
            </p>
          </div>
          
          <Card className="bg-gradient-to-r from-background/30 to-background/10 backdrop-blur-sm border-primary/20 w-full md:w-auto">
            <CardContent className="p-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 md:grid-cols-3">
                  <TabsTrigger value="dashboard" className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="kpi-generator" className="flex items-center">
                    <ChartBar className="h-4 w-4 mr-2" />
                    KPI Generator
                  </TabsTrigger>
                  <TabsTrigger value="custom-analytics" className="flex items-center">
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-sm overflow-hidden">
          {activeTab === 'kpi-results' && kpiResponse ? (
            <>
              <CardHeader className="flex flex-row justify-between items-center pb-3 border-b border-border/30">
                <div>
                  <CardTitle className="text-xl">Your Generated KPI System</CardTitle>
                  <CardDescription>AI-generated metrics based on your inputs</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
                  Return to Dashboard
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <KPIResultsDisplay kpiResponse={kpiResponse} />
              </CardContent>
            </>
          ) : activeTab === 'dashboard' ? (
            <div className="animate-in fade-in-50 duration-500">
              <CardHeader className="pb-3 border-b border-border/30">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    Overview
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </div>
                <CardDescription>Real-time metrics from your business</CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                {showDemo ? (
                  <div className="space-y-8">
                    {/* Top stats row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {stats.map((stat) => {
                        const StatIcon = stat.icon;
                        return (
                          <Card key={stat.id} className="overflow-hidden bg-background/80 backdrop-blur-sm border border-border/50 hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="text-xs font-medium text-muted-foreground">{stat.name}</div>
                                  <div className="text-2xl font-bold mt-1">{stat.value}</div>
                                </div>
                                <div className="bg-primary/10 p-2 rounded-md">
                                  <StatIcon className="h-5 w-5 text-primary" />
                                </div>
                              </div>
                              
                              <div className="mt-3 flex justify-between items-end">
                                <div className={`text-xs font-medium flex items-center gap-1 ${stat.trend === 'up' ? 'text-emerald-500' : stat.trend === 'down' ? 'text-rose-500' : 'text-muted-foreground'}`}>
                                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : stat.trend === 'down' ? <ArrowUpRight className="h-3 w-3 rotate-180" /> : null}
                                  {stat.change}
                                </div>
                                <div className="w-20 h-8 overflow-hidden">
                                  {renderMiniChart(stat.chartData || [], 'bar')}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    
                    <Separator className="my-8" />
                    
                    {/* Dashboard cards grid */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Your Dashboards</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dashboardCards.map((card, index) => (
                          <Card key={card.id} className="overflow-hidden border border-border/50 hover:shadow-md transition-shadow bg-background/80 backdrop-blur-sm">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base font-medium flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                  <div className="grid place-items-center h-6 w-6 bg-primary/10 rounded text-primary">
                                    {index + 1}
                                  </div>
                                  {card.title}
                                </span>
                                {getChartIcon(card.chartType)}
                              </CardTitle>
                              <CardDescription className="text-xs">{card.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                              <div className="h-32 w-full overflow-hidden border-y border-border/20 bg-card/30">
                                {renderPlaceholderChart(card.chartType)}
                              </div>
                            </CardContent>
                            <CardFooter className="p-3 flex justify-between items-center text-xs text-muted-foreground bg-muted/10">
                              <span>Updated {card.lastUpdated}</span>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                View
                                <ChevronDownIcon className="h-3 w-3 ml-1" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 grid place-items-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <LayoutDashboard className="h-10 w-10 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">Loading dashboard data...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>
          ) : activeTab === 'kpi-generator' ? (
            <>
              <CardHeader className="pb-3 border-b border-border/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ChartBar className="h-5 w-5 text-primary" />
                  KPI Generator
                </CardTitle>
                <CardDescription>Generate tailored KPIs for your business</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <KPIGeneratorForm onKPIGenerated={handleKPIGenerated} />
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="pb-3 border-b border-border/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-primary" />
                  Custom Analytics
                </CardTitle>
                <CardDescription>Create analytics from your data using natural language</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <CustomAnalyticsGenerator />
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
