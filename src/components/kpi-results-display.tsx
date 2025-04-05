import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3Icon, 
  TargetIcon,
  CheckCircleIcon,
  CopyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LineChartIcon,
  BarChart2Icon,
  PieChartIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Helper function to determine chart icon based on visualization type
const getChartIcon = (type: string) => {
  type = type.toLowerCase();
  if (type.includes('line')) return <LineChartIcon className="h-4 w-4" />;
  if (type.includes('bar')) return <BarChart2Icon className="h-4 w-4" />;
  if (type.includes('pie') || type.includes('donut')) return <PieChartIcon className="h-4 w-4" />;
  return <BarChart3Icon className="h-4 w-4" />;
};

interface KPIResultsDisplayProps {
  kpiResponse: any;
}

export function KPIResultsDisplay({ kpiResponse }: KPIResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState('metrics');
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  
  // Extract metrics from the raw response
  const metrics = extractMetrics(kpiResponse.raw_response);
  
  // Handle copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };
  
  // Toggle expanded metric
  const toggleExpand = (metricName: string) => {
    if (expandedMetric === metricName) {
      setExpandedMetric(null);
    } else {
      setExpandedMetric(metricName);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl gradient-text">Your KPI System</CardTitle>
              <CardDescription>
                AI-generated KPI system for your {kpiResponse.tech_stack} stack
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{metrics.length} Metrics</Badge>
              {kpiResponse.has_visualizations && <Badge>Visualizations</Badge>}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <Card 
                key={index} 
                className={`overflow-hidden cursor-pointer transition-all duration-200 ${expandedMetric === metric.name ? 'shadow-lg border-primary' : 'hover:shadow-md'}`}
                onClick={() => toggleExpand(metric.name)}
              >
                {/* KPI header with number */}
                <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex items-center justify-center h-7 w-7 rounded-full text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-medium text-base">{metric.name}</h3>
                  </div>
                  {expandedMetric === metric.name ? 
                    <ChevronUpIcon className="h-5 w-5 text-primary" /> : 
                    <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />}
                </div>

                {expandedMetric === metric.name ? (
                  /* Expanded view with all details in one block */
                  <div className="p-4">
                    <p className="text-sm leading-relaxed mb-4">{metric.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1 text-primary/80">Calculation</h4>
                        <div className="bg-slate-50 p-3 rounded-md border">
                          <code className="text-sm whitespace-pre-wrap font-mono">{metric.calculation}</code>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1 text-primary/80">Why it matters</h4>
                        <p className="text-sm">{metric.importance}</p>
                      </div>
                      
                      {metric.benchmark && (
                        <div>
                          <h4 className="font-medium text-sm mb-1 flex items-center gap-1 text-primary/80">
                            <TargetIcon className="h-4 w-4" />
                            <span>Industry Benchmark</span>
                          </h4>
                          <p className="text-sm bg-slate-50 p-3 rounded-md border">{metric.benchmark}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Collapsed view with just a short hint to click */
                  <div className="p-4 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Click to view details</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Raw AI Response</CardTitle>
          <CardDescription>
            The complete response from the AI model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
            {kpiResponse.raw_response}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper to extract metrics from raw response (simplified for MVP)
const extractMetrics = (rawResponse: string) => {
  // In a production app, this would be much more robust
  const metrics: any[] = [];
  
  // Very simple parsing - this is just illustrative and should be more robust
  const sections = rawResponse.split(/\d+\.\s+METRICS|METRICS:/i)[1] || rawResponse;
  
  if (sections) {
    // Find all metrics with their descriptions
    const metricMatches = sections.match(/\*\*([^*]+)\*\*|([A-Z][^:]+):|([A-Z][a-zA-Z\s]+)\(/g) || [];
    
    metricMatches.forEach((metricName, index) => {
      // Clean up the metric name
      const name = metricName.replace(/\*\*/g, '').replace(':', '').trim();
      
      // Simple way to get the description - in production this would be more sophisticated
      const descStart = sections.indexOf(metricName) + metricName.length;
      const nextMetric = metricMatches[index + 1];
      const descEnd = nextMetric ? sections.indexOf(nextMetric) : sections.length;
      const description = sections.substring(descStart, descEnd).trim();
      
      metrics.push({
        name,
        description,
        calculation: "Extracted from AI response",
        importance: "Extracted from AI response",
        visualization: "Line Chart" // Default
      });
    });
  }
  
  return metrics.length > 0 ? metrics : [
    {
      name: "Monthly Recurring Revenue (MRR)",
      description: "The predictable revenue generated from subscriptions on a monthly basis.",
      calculation: "Sum of all monthly subscription revenue",
      importance: "Core financial metric that indicates business health and growth",
      visualization: "Line Chart",
      benchmark: "15-20% MoM growth for early-stage startups"
    },
    {
      name: "Customer Acquisition Cost (CAC)",
      description: "The cost to acquire a new customer",
      calculation: "Total marketing & sales spend / Number of new customers acquired",
      importance: "Indicates marketing efficiency and unit economics",
      visualization: "Bar Chart",
      benchmark: "Should recover CAC within 12 months"
    }
  ];
};
