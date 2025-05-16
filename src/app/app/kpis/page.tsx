"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AppNavbar } from "@/components/app-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart, Table, Expand, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPI {
  id: string;
  name: string;
  category: string;
  description: string;
  calculation: string;
  importance: string;
  benchmark: string;
  currentValue?: number;
  targetValue?: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  isExpanded: boolean;
}

export default function KPIPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [kpis, setKpis] = useState<KPI[]>([]);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    const fetchKPIs = async () => {
      try {
        // TODO: Replace with actual API call
        const mockKPIs: KPI[] = [
          {
            id: '1',
            name: 'Monthly Recurring Revenue (MRR)',
            category: 'Revenue',
            description: 'Total predictable revenue generated each month from active subscriptions.',
            calculation: 'SUM(monthly_subscription_fees)',
            importance: 'Critical for tracking revenue growth and business health.',
            benchmark: 'Industry average: 10-15% MoM growth for early-stage SaaS',
            currentValue: 12500,
            targetValue: 15000,
            trend: 'up',
            trendValue: '12%',
            isExpanded: false
          },
          {
            id: '2',
            name: 'Customer Acquisition Cost (CAC)',
            category: 'Growth',
            description: 'The cost associated with acquiring a new customer.',
            calculation: 'Total Sales & Marketing Expenses / Number of New Customers',
            importance: 'Helps evaluate the efficiency of your marketing spend.',
            benchmark: 'Ideal ratio of LTV:CAC is 3:1 or higher',
            currentValue: 450,
            targetValue: 400,
            trend: 'down',
            trendValue: '5%',
            isExpanded: false
          },
          {
            id: '3',
            name: 'Churn Rate',
            category: 'Retention',
            description: 'Percentage of customers who cancel their subscription in a given period.',
            calculation: '(Churned Customers / Total Customers at Start of Period) * 100',
            importance: 'Indicates customer satisfaction and product-market fit.',
            benchmark: 'Less than 5% monthly churn is considered good for SaaS',
            currentValue: 3.2,
            targetValue: 2.5,
            trend: 'up',
            trendValue: '0.5%',
            isExpanded: false
          },
          {
            id: '4',
            name: 'Daily Active Users (DAU)',
            category: 'Engagement',
            description: 'Number of unique users who engage with your product daily.',
            calculation: 'COUNT(DISTINCT user_id) WHERE date = CURRENT_DATE',
            importance: 'Measures daily active engagement with your product.',
            benchmark: 'Varies by industry, but 20-30% of MAU is a good target',
            currentValue: 1245,
            targetValue: 1500,
            trend: 'up',
            trendValue: '8%',
            isExpanded: false
          },
          {
            id: '5',
            name: 'Customer Lifetime Value (LTV)',
            category: 'Revenue',
            description: 'Average revenue generated per customer over their lifetime.',
            calculation: 'ARPU * (1 / Churn Rate)',
            importance: 'Helps determine the long-term value of acquiring a customer.',
            benchmark: 'LTV should be at least 3x CAC for a sustainable business',
            currentValue: 1350,
            targetValue: 1500,
            trend: 'up',
            trendValue: '7%',
            isExpanded: false
          },
          {
            id: '6',
            name: 'Net Promoter Score (NPS)',
            category: 'Satisfaction',
            description: 'Measures customer satisfaction and loyalty.',
            calculation: '% Promoters - % Detractors',
            importance: 'Indicates customer satisfaction and likelihood of referrals.',
            benchmark: 'Good NPS is typically above 30',
            currentValue: 42,
            targetValue: 50,
            trend: 'neutral',
            trendValue: '0',
            isExpanded: false
          },
        ];
        
        setKpis(mockKPIs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching KPIs:', error);
        setIsLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  const toggleExpand = (id: string) => {
    setKpis(kpis.map(kpi => 
      kpi.id === id ? { ...kpi, isExpanded: !kpi.isExpanded } : kpi
    ));
  };

  const filteredKPIs = activeTab === 'all' 
    ? kpis 
    : kpis.filter(kpi => kpi.category.toLowerCase() === activeTab);

  const categories = ['all', ...new Set(kpis.map(kpi => kpi.category.toLowerCase()))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#121212]">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading KPIs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      <AppNavbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your KPIs</h1>
            <p className="text-muted-foreground">Track and analyze your key performance indicators</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" /> Add KPI
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKPIs.map((kpi, index) => (
              <Card key={kpi.id} className="bg-card/50 backdrop-blur-sm border border-muted hover:border-primary/20 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-muted-foreground">#{index + 1}</span>
                        <CardTitle className="text-lg">{kpi.name}</CardTitle>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 
                          kpi.trend === 'down' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'} {kpi.trendValue}
                        </span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {kpi.currentValue?.toLocaleString()} / {kpi.targetValue?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleExpand(kpi.id)}
                    >
                      {kpi.isExpanded ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center mb-4">
                    <LineChart className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                  
                  <div className={cn(
                    "space-y-4 overflow-hidden transition-all duration-300",
                    kpi.isExpanded ? "max-h-96" : "max-h-0"
                  )}>
                    <div className="space-y-2">
                      <h4 className="font-medium">Description</h4>
                      <p className="text-sm text-muted-foreground">{kpi.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Calculation</h4>
                      <code className="block p-2 bg-muted/50 rounded text-xs font-mono overflow-x-auto">
                        {kpi.calculation}
                      </code>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Why It Matters</h4>
                      <p className="text-sm text-muted-foreground">{kpi.importance}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Benchmark</h4>
                      <p className="text-sm text-muted-foreground">{kpi.benchmark}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
