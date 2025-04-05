import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3Icon, 
  CodeIcon, 
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
import { apiClient } from '@/lib/api-client';
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
  const [isGeneratingSql, setIsGeneratingSql] = useState<{[key: string]: boolean}>({});
  
  // Extract metrics from the raw response
  const metrics = extractMetrics(kpiResponse.raw_response);
  
  // Handle SQL generation for a specific metric
  const handleGenerateSQL = async (metric: any) => {
    setIsGeneratingSql({...isGeneratingSql, [metric.name]: true});
    
    try {
      const result = await apiClient.generateSQL(
        metric.name,
        metric.calculation,
        kpiResponse.tech_stack
      );
      
      if ('error' in result) {
        toast.error(result.error);
      } else {
        // Update the metric with the SQL query
        metric.sql = result.sql;
        toast.success('SQL query generated!');
      }
    } catch (error) {
      console.error('Error generating SQL:', error);
      toast.error('Failed to generate SQL query');
    } finally {
      setIsGeneratingSql({...isGeneratingSql, [metric.name]: false});
    }
  };
  
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
              {kpiResponse.has_sql && <Badge>SQL Ready</Badge>}
              {kpiResponse.has_visualizations && <Badge>Visualizations</Badge>}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="metrics" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="metrics">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="sql">
                <CodeIcon className="h-4 w-4 mr-2" />
                SQL Queries
              </TabsTrigger>
              <TabsTrigger value="visualizations">
                <BarChart3Icon className="h-4 w-4 mr-2" />
                Visualizations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics" className="space-y-4">
              {metrics.map((metric, index) => (
                <Card key={index} className={`overflow-hidden transition-all duration-300 ${expandedMetric === metric.name ? 'shadow-md' : ''}`}>
                  <CardHeader className="p-4 cursor-pointer" onClick={() => toggleExpand(metric.name)}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        {metric.name}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        {expandedMetric === metric.name ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {expandedMetric === metric.name && (
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Description</h4>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Calculation</h4>
                          <p className="text-sm text-muted-foreground">{metric.calculation}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Why it matters</h4>
                          <p className="text-sm text-muted-foreground">{metric.importance}</p>
                        </div>
                      </div>
                      
                      {metric.benchmark && (
                        <div className="mt-4 p-2 bg-muted rounded-md flex items-center gap-2">
                          <TargetIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm">Benchmark: {metric.benchmark}</span>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="sql" className="space-y-4">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{metric.name} SQL Query</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    {metric.sql ? (
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                          <code>{metric.sql}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopy(metric.sql)}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Generate SQL query for {kpiResponse.tech_stack} database
                        </p>
                        <Button 
                          onClick={() => handleGenerateSQL(metric)}
                          disabled={isGeneratingSql[metric.name]}
                        >
                          {isGeneratingSql[metric.name] ? 'Generating...' : 'Generate SQL'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="visualizations" className="space-y-4">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-2">
                      {getChartIcon(metric.visualization)}
                      <CardTitle className="text-lg">
                        {metric.name}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Recommended visualization: {metric.visualization || 'Line Chart'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <div className="h-[200px] rounded-md border flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground text-center p-4">
                        {getChartIcon(metric.visualization || 'Line Chart')}
                        <span className="block mt-2">
                          Visualization preview will be displayed here when data is available
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
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
  const sections = rawResponse.split(/\d+\.\s+METRICS|METRICS:/i)[1]?.split(/\d+\.\s+SQL QUERIES|SQL QUERIES:/i)[0];
  
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
        visualization: "Line Chart", // Default
        sql: "" // Will be generated on demand
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
