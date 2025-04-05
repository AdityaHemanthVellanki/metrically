'use client';

import { useState } from 'react';
import { KPIGeneratorForm } from '@/components/kpi-generator-form';
import { KPIResultsDisplay } from '@/components/kpi-results-display';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Clock, ChartBar } from 'lucide-react';
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
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generator">
              <ChartBar className="h-4 w-4 mr-2" />
              KPI Generator
            </TabsTrigger>
            <TabsTrigger value="examples" onClick={loadExampleSystems}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Example Systems
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <KPIGeneratorForm onKPIGenerated={handleKPIGenerated} />
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
                            {system.metrics && system.metrics.slice(0, 4).map((metric: string, i: number) => (
                              <li key={i}>{metric}</li>
                            ))}
                            {system.metrics && system.metrics.length > 4 && (
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
        </Tabs>
      )}
    </div>
  );
}
