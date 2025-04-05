import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Flag, TrendingUp, TrendingDown, LineChart, Zap, Plus } from 'lucide-react';
import {
  LineChart as ReChartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for the feature flags
const mockFeatureFlags = [
  {
    id: 'ff-1',
    name: 'New User Onboarding Flow',
    status: 'active',
    dateAdded: '2025-03-15',
    impact: {
      userRetention: +12.5,
      conversionRate: +8.2,
      timeOnSite: +15.0,
    },
    rolloutPercentage: 100,
  },
  {
    id: 'ff-2',
    name: 'Redesigned Dashboard',
    status: 'testing',
    dateAdded: '2025-03-28',
    impact: {
      userRetention: +3.1,
      conversionRate: -1.2,
      timeOnSite: +22.7,
    },
    rolloutPercentage: 25,
  },
  {
    id: 'ff-3',
    name: 'Premium Features Tier',
    status: 'planned',
    dateAdded: '2025-04-10',
    impact: {
      userRetention: 0,
      conversionRate: 0,
      timeOnSite: 0,
    },
    rolloutPercentage: 0,
  },
];

// Mock time-series data for a feature impact
const featureTimeData = [
  { date: '2025-03-15', beforeFeature: 45, afterFeature: 45 },
  { date: '2025-03-16', beforeFeature: 46, afterFeature: 48 },
  { date: '2025-03-17', beforeFeature: 47, afterFeature: 52 },
  { date: '2025-03-18', beforeFeature: 48, afterFeature: 56 },
  { date: '2025-03-19', beforeFeature: 48, afterFeature: 58 },
  { date: '2025-03-20', beforeFeature: 49, afterFeature: 60 },
  { date: '2025-03-21', beforeFeature: 50, afterFeature: 61 },
  { date: '2025-03-22', beforeFeature: 51, afterFeature: 63 },
  { date: '2025-03-23', beforeFeature: 52, afterFeature: 64 },
  { date: '2025-03-24', beforeFeature: 52, afterFeature: 65 },
  { date: '2025-03-25', beforeFeature: 53, afterFeature: 67 },
];

export function FeatureFlagImpact() {
  const [selectedFeatureId, setSelectedFeatureId] = useState(mockFeatureFlags[0].id);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [showAddFeature, setShowAddFeature] = useState(false);

  const selectedFeature = mockFeatureFlags.find(feature => feature.id === selectedFeatureId) || mockFeatureFlags[0];

  const renderImpactBadge = (value: number) => {
    if (value > 0) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          <TrendingUp className="h-3 w-3 mr-1" />+{value}%
        </Badge>
      );
    } else if (value < 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          <TrendingDown className="h-3 w-3 mr-1" />{value}%
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          0%
        </Badge>
      );
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Active
          </Badge>
        );
      case 'testing':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Testing
          </Badge>
        );
      case 'planned':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            Planned
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const handleAddFeature = () => {
    // In a real app, this would add the new feature to the database
    alert(`New feature "${newFeatureName}" would be added here`);
    setNewFeatureName('');
    setShowAddFeature(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Flag className="h-5 w-5 mr-2 text-primary" />
          Feature Flag Impact Analysis
        </h2>
        <Button onClick={() => setShowAddFeature(!showAddFeature)} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Feature Flag
        </Button>
      </div>

      {showAddFeature && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Feature Flag</CardTitle>
            <CardDescription>
              Create a new feature flag to track its impact on your key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="feature-name">Feature Name</Label>
                <Input
                  id="feature-name"
                  placeholder="e.g., New Checkout Process"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="feature-status">Initial Status</Label>
                  <select
                    id="feature-status"
                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="testing">Testing</option>
                    <option value="active">Active</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rollout-percentage">Initial Rollout %</Label>
                  <Input
                    id="rollout-percentage"
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metrics-tracked">Metrics to Track</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200">
                    User Retention
                  </Badge>
                  <Badge className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200">
                    Conversion Rate
                  </Badge>
                  <Badge className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200">
                    Time on Site
                  </Badge>
                  <Badge className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Custom
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowAddFeature(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFeature}>
              Create Feature Flag
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Track the impact of your feature flags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFeatureFlags.map(feature => (
                  <div
                    key={feature.id}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      selectedFeatureId === feature.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedFeatureId(feature.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{feature.name}</h3>
                      {renderStatusBadge(feature.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Added on {feature.dateAdded}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Rollout: {feature.rolloutPercentage}%</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        disabled={feature.status === 'planned'}
                      >
                        <LineChart className="h-3 w-3 mr-1" />
                        View Data
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedFeature.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    {renderStatusBadge(selectedFeature.status)}
                    <span>•</span>
                    <span>{selectedFeature.rolloutPercentage}% Rollout</span>
                    <span>•</span>
                    <span>Added on {selectedFeature.dateAdded}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={selectedFeature.status === 'planned'}>
                    <Zap className="h-4 w-4 mr-2" />
                    Run A/B Test
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="impact">
                <TabsList className="mb-6">
                  <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="impact">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">User Retention Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                              {renderImpactBadge(selectedFeature.impact.userRetention)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Conversion Rate Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                              {renderImpactBadge(selectedFeature.impact.conversionRate)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Time on Site Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                              {renderImpactBadge(selectedFeature.impact.timeOnSite)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-4">Feature Impact Over Time</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReChartsLineChart
                            data={featureTimeData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="beforeFeature"
                              name="Projected Without Feature"
                              stroke="#8884d8"
                              strokeDasharray="5 5"
                            />
                            <Line
                              type="monotone"
                              dataKey="afterFeature"
                              name="Actual With Feature"
                              stroke="#82ca9d"
                            />
                          </ReChartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline">
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Feature Deployment Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-24 text-sm font-medium">2025-03-15</div>
                        <div className="flex-1">
                          <div className="font-medium">Feature flag created</div>
                          <div className="text-sm text-muted-foreground">Initial rollout: 10%</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-24 text-sm font-medium">2025-03-18</div>
                        <div className="flex-1">
                          <div className="font-medium">Increased rollout</div>
                          <div className="text-sm text-muted-foreground">Rollout increased to 25%</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-24 text-sm font-medium">2025-03-22</div>
                        <div className="flex-1">
                          <div className="font-medium">Initial impact analysis</div>
                          <div className="text-sm text-muted-foreground">Positive impact on user retention (+8.5%)</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-24 text-sm font-medium">2025-03-25</div>
                        <div className="flex-1">
                          <div className="font-medium">Full deployment</div>
                          <div className="text-sm text-muted-foreground">Rollout increased to 100%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Feature Settings</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="feature-rollout">Rollout Percentage</Label>
                        <div className="flex gap-4">
                          <Input
                            id="feature-rollout"
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            value={selectedFeature.rolloutPercentage}
                            disabled={selectedFeature.status === 'planned'}
                          />
                          <Button
                            variant="secondary"
                            disabled={selectedFeature.status === 'planned'}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="feature-status-update">Current Status</Label>
                        <div className="flex gap-4">
                          <select
                            id="feature-status-update"
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                            value={selectedFeature.status}
                          >
                            <option value="planned">Planned</option>
                            <option value="testing">Testing</option>
                            <option value="active">Active</option>
                          </select>
                          <Button variant="secondary">
                            Update
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2 mt-4">
                        <Label>Danger Zone</Label>
                        <div className="flex gap-4">
                          <Button variant="destructive">
                            Remove Feature Flag
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
