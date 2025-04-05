'use client';

import { useState } from 'react';
import { KPIGeneratorForm } from '@/components/kpi-generator-form';
import { KPIResultsDisplay } from '@/components/kpi-results-display';
import { CustomAnalyticsGenerator } from '@/components/custom-analytics-generator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartBar, SparklesIcon } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [kpiResponse, setKpiResponse] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('kpi-generator');
  
  // Handler for when KPI system is generated
  const handleKPIGenerated = (response: any) => {
    setKpiResponse(response);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
      <p className="text-muted-foreground mb-4">Generate custom insights and KPIs for your business</p>
      
      {kpiResponse ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Generated KPI System</h2>
            <Button variant="outline" onClick={() => setKpiResponse(null)}>
              Return to Dashboard
            </Button>
          </div>
          
          <KPIResultsDisplay kpiResponse={kpiResponse} />
        </>
      ) : (
        <div className="w-full space-y-8">
          <Card className="p-4 border-primary/10 bg-primary/5">
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`p-4 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer ${activeTab === 'kpi-generator' ? 'bg-primary/5 border-primary' : ''}`}
                onClick={() => setActiveTab('kpi-generator')}
              >
                <ChartBar className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-medium mb-1">KPI Generator</h3>
                <p className="text-sm text-muted-foreground">Generate tailored KPIs for your startup</p>
              </Card>
              <Card 
                className={`p-4 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer ${activeTab === 'custom-analytics' ? 'bg-primary/5 border-primary' : ''}`}
                onClick={() => setActiveTab('custom-analytics')}
              >
                <SparklesIcon className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-medium mb-1">Custom Analytics</h3>
                <p className="text-sm text-muted-foreground">Create analytics from Google Analytics using natural language</p>
              </Card>
            </div>
          </Card>
        
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="kpi-generator" className="flex items-center">
                <ChartBar className="h-4 w-4 mr-2" />
                KPI Generator
              </TabsTrigger>
              <TabsTrigger value="custom-analytics" className="flex items-center">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Custom Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="kpi-generator">
              <div className="mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <ChartBar className="h-5 w-5 mr-2 text-primary" />
                  KPI Generator
                </h2>
              </div>
              <KPIGeneratorForm onKPIGenerated={handleKPIGenerated} />
            </TabsContent>
            
            <TabsContent value="custom-analytics">
              <CustomAnalyticsGenerator />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
