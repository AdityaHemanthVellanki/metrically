'use client';

import { useState } from 'react';
import { KPIGeneratorForm } from '@/components/kpi-generator-form';
import { KPIResultsDisplay } from '@/components/kpi-results-display';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Clock, ChartBar, Settings } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [kpiResponse, setKpiResponse] = useState<any | null>(null);
  const [exampleSystems, setExampleSystems] = useState<any[]>([]);
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);
  
  // Handler for when KPI system is generated
  const handleKPIGenerated = (response: any) => {
    setKpiResponse(response);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Load example KPI systems
  const loadExampleSystems = async () => {
    if (exampleSystems.length > 0) return; // Don't reload if we already have them
    
    setIsLoadingExamples(true);
    try {
      const response = await apiClient.getExampleSystems();
      if (Array.isArray(response)) {
        setExampleSystems(response);
      } else {
        console.error('Invalid response format for example systems:', response);
      }
    } catch (error) {
      console.error('Error loading example systems:', error);
      toast.error('Failed to load example systems');
    } finally {
      setIsLoadingExamples(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Your KPI Dashboard</h1>
      <p className="text-muted-foreground mb-8">Generate, visualize, and track your company's key performance indicators</p>
      
      {kpiResponse ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Generated KPI System</h2>
            <Button variant="outline" onClick={() => setKpiResponse(null)}>
              Generate New System
            </Button>
          </div>
          
          <KPIResultsDisplay kpiResponse={kpiResponse} />
        </>
      ) : (
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="generator">
              <ChartBar className="h-4 w-4 mr-2" />
              KPI Generator
            </TabsTrigger>
            <TabsTrigger value="examples" onClick={loadExampleSystems}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Example Systems
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              API Configuration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-8">
            <KPIGeneratorForm onKPIGenerated={handleKPIGenerated} />
            
            <Card className="w-full">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Metrically uses Azure OpenAI to intelligently design KPI systems for your business
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">1. Enter Business Context</h3>
                  <p className="text-sm text-muted-foreground">
                    Tell us about your product, company stage, and technology stack
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">2. AI Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your input and designs a custom KPI system
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <ChartBar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">3. Get Your KPIs</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive a complete set of metrics, SQL queries, and dashboard visualizations
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>Example KPI Systems</CardTitle>
                <CardDescription>
                  Browse pre-built KPI systems for common business types
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingExamples ? (
                  <div className="text-center py-8">Loading example systems...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {exampleSystems.map((system, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-lg">{system.name}</CardTitle>
                          <CardDescription>
                            {system.product_type} • {system.company_stage}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
                            {system.metrics.slice(0, 4).map((metric: string, i: number) => (
                              <li key={i}>{metric}</li>
                            ))}
                            {system.metrics.length > 4 && (
                              <li>+ {system.metrics.length - 4} more</li>
                            )}
                          </ul>
                          <Button variant="secondary" className="w-full">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>
                    Configure your Azure OpenAI API connection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 border rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-2">Setup Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Create an Azure OpenAI resource in your Azure portal</li>
                      <li>Deploy a GPT-4 or similar model in your Azure OpenAI resource</li>
                      <li>Get your API key, endpoint, and deployment name</li>
                      <li>Set these values in your backend .env file</li>
                    </ol>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      File location: <code className="bg-muted p-1 rounded">api/.env</code>
                    </p>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      <code>
                        AZURE_OPENAI_API_KEY=your_api_key_here
                        {'\n'}AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
                        {'\n'}AZURE_OPENAI_API_VERSION=2023-05-15
                        {'\n'}AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
                      </code>
                    </pre>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Check API Status</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
