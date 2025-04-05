import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Layers } from 'lucide-react';

// Sample data for basic cohort display
const sampleData = [
  { id: 1, name: 'New Users', count: 1850, change: '+12.5%', period: 'This month' },
  { id: 2, name: 'Active Users', count: 6250, change: '+8.2%', period: 'This month' },
  { id: 3, name: 'Revenue', count: '$48,500', change: '+15.3%', period: 'This month' },
  { id: 4, name: 'Conversion Rate', count: '8.7%', change: '+2.1%', period: 'This month' },
];

export function CohortAnalysis() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Layers className="h-5 w-5 mr-2 text-primary" />
          Simplified Cohort Analysis
        </h2>
        <div className="flex gap-4">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Basic metrics overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sampleData.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                  <h3 className="text-2xl font-bold mt-1">{item.count}</h3>
                </div>
                <div className={`text-sm font-medium ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{item.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simplified cohort data placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cohort Overview</CardTitle>
              <CardDescription>
                Simple metrics breakdown by user cohort
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium text-muted-foreground">Basic Cohort Analysis</h3>
            <p className="mt-2 text-muted-foreground">
              This is a simplified version without user retention tracking, automatic segment detection, 
              actionable insights, or behavioral trends features.
            </p>
            <Button className="mt-4" variant="outline">
              Configure Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
