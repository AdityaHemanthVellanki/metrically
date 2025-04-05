import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database, Copy, Save, Code, FileCode, Search, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const mockSavedQueries = [
  {
    id: 'q1',
    name: 'Monthly Active Users',
    description: 'Track MAU over the last 12 months',
    query: 'SELECT DATE_TRUNC(\'month\', created_at) as month, COUNT(DISTINCT user_id) as monthly_active_users\nFROM user_sessions\nWHERE created_at >= DATEADD(month, -12, CURRENT_DATE())\nGROUP BY 1\nORDER BY 1;',
    techStack: 'PostgreSQL',
    lastRun: '2025-04-01',
  },
  {
    id: 'q2',
    name: 'Conversion Rate by Channel',
    description: 'Compare conversion rates across acquisition channels',
    query: 'SELECT acquisition_channel,\n       COUNT(DISTINCT user_id) as total_users,\n       COUNT(DISTINCT CASE WHEN has_converted = true THEN user_id END) as converted_users,\n       COUNT(DISTINCT CASE WHEN has_converted = true THEN user_id END) / COUNT(DISTINCT user_id)::float as conversion_rate\nFROM users\nGROUP BY 1\nORDER BY 4 DESC;',
    techStack: 'PostgreSQL',
    lastRun: '2025-03-28',
  },
  {
    id: 'q3',
    name: 'Feature Usage Frequency',
    description: 'How often users engage with key features',
    query: 'SELECT feature_name,\n       COUNT(*) as total_uses,\n       COUNT(DISTINCT user_id) as unique_users,\n       COUNT(*) / COUNT(DISTINCT user_id) as avg_uses_per_user\nFROM feature_events\nWHERE created_at >= DATEADD(day, -30, CURRENT_DATE())\nGROUP BY 1\nORDER BY 2 DESC;',
    techStack: 'PostgreSQL',
    lastRun: '2025-04-02',
  },
];

const mockQueryHistory = [
  {
    id: 'h1',
    prompt: 'Show me daily active users for the last week',
    query: 'SELECT DATE_TRUNC(\'day\', created_at) as day, COUNT(DISTINCT user_id) as daily_active_users\nFROM user_sessions\nWHERE created_at >= DATEADD(day, -7, CURRENT_DATE())\nGROUP BY 1\nORDER BY 1;',
    runAt: '2025-04-04 14:23',
    status: 'success',
    executionTime: '1.4s',
  },
  {
    id: 'h2',
    prompt: 'Get the top 10 most active users in March',
    query: 'SELECT user_id, COUNT(*) as session_count\nFROM user_sessions\nWHERE created_at >= \'2025-03-01\' AND created_at < \'2025-04-01\'\nGROUP BY 1\nORDER BY 2 DESC\nLIMIT 10;',
    runAt: '2025-04-03 10:15',
    status: 'success',
    executionTime: '2.1s',
  },
  {
    id: 'h3',
    prompt: 'Calculate average time between sign up and first purchase',
    query: 'SELECT AVG(DATEDIFF(second, u.created_at, MIN(p.created_at)))/86400 as avg_days_to_purchase\nFROM users u\nJOIN purchases p ON u.id = p.user_id\nWHERE u.created_at >= DATEADD(month, -6, CURRENT_DATE())\nGROUP BY u.id;',
    runAt: '2025-04-02 16:42',
    status: 'error',
    executionTime: '0.7s',
    error: 'Syntax error near GROUP BY clause',
  },
];

export function SQLQueryGenerator() {
  const [queryPrompt, setQueryPrompt] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(mockSavedQueries[0]);
  const [activeTab, setActiveTab] = useState('generate');
  const [queryName, setQueryName] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [database, setDatabase] = useState('PostgreSQL');

  const handleGenerateQuery = () => {
    setIsGenerating(true);
    
    // Simulating API call delay
    setTimeout(() => {
      // Example logic to generate different queries based on prompt content
      let sqlQuery = '';
      
      if (queryPrompt.toLowerCase().includes('active user')) {
        sqlQuery = `SELECT DATE_TRUNC('day', created_at) as day,
       COUNT(DISTINCT user_id) as daily_active_users
FROM user_sessions
WHERE created_at >= DATEADD(day, -30, CURRENT_DATE())
GROUP BY 1
ORDER BY 1;`;
      } else if (queryPrompt.toLowerCase().includes('retention')) {
        sqlQuery = `WITH cohort AS (
  SELECT 
    user_id,
    DATE_TRUNC('week', created_at) as cohort_week,
    MIN(DATE_TRUNC('week', created_at)) OVER (PARTITION BY user_id) as first_week
  FROM user_sessions
  WHERE created_at >= DATEADD(week, -12, CURRENT_DATE())
)
SELECT 
  first_week,
  cohort_week,
  DATEDIFF(week, first_week, cohort_week) as week_number,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(DISTINCT CASE WHEN cohort_week = first_week THEN user_id END) as cohort_size,
  COUNT(DISTINCT user_id) / COUNT(DISTINCT CASE WHEN cohort_week = first_week THEN user_id END)::float as retention_rate
FROM cohort
GROUP BY 1, 2, 3
ORDER BY 1, 3;`;
      } else if (queryPrompt.toLowerCase().includes('conversion')) {
        sqlQuery = `SELECT 
  acquisition_channel,
  COUNT(DISTINCT user_id) as total_users,
  COUNT(DISTINCT CASE WHEN has_converted = true THEN user_id END) as converted_users,
  COUNT(DISTINCT CASE WHEN has_converted = true THEN user_id END) / COUNT(DISTINCT user_id)::float as conversion_rate
FROM users
WHERE created_at >= DATEADD(month, -3, CURRENT_DATE()) 
GROUP BY 1
ORDER BY 4 DESC;`;
      } else {
        sqlQuery = `-- Query generated based on: "${queryPrompt}"
SELECT 
  DATE_TRUNC('day', event_time) as date,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM events
WHERE event_time >= DATEADD(day, -30, CURRENT_DATE())
GROUP BY 1, 2
ORDER BY 1 DESC, 4 DESC;`;
      }
      
      setGeneratedQuery(sqlQuery);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(generatedQuery || selectedQuery.query);
    alert('Query copied to clipboard!');
  };

  const handleSaveQuery = () => {
    // In a real app, this would save to a database
    alert(`Query "${queryName}" saved successfully!`);
    setShowSaveForm(false);
    setQueryName('');
    setQueryDescription('');
  };

  const renderQueryCard = (query) => (
    <div
      key={query.id}
      className={`p-4 rounded-lg cursor-pointer border transition-all ${
        selectedQuery.id === query.id
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
      onClick={() => setSelectedQuery(query)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{query.name}</h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          {query.techStack}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2 truncate">
        {query.description}
      </p>
      <p className="text-xs text-muted-foreground">
        Last run: {query.lastRun}
      </p>
    </div>
  );

  const renderHistoryItem = (item) => (
    <div key={item.id} className="p-4 border rounded-lg mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-sm">{item.prompt}</p>
        <Badge
          variant="outline"
          className={`${
            item.status === 'success'
              ? 'bg-green-50 text-green-600 border-green-200'
              : 'bg-red-50 text-red-600 border-red-200'
          }`}
        >
          {item.status}
        </Badge>
      </div>
      <div className="bg-gray-50 rounded p-2 mb-2 text-xs font-mono overflow-x-auto">
        <code>{item.query}</code>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{item.runAt}</span>
        <span>Execution time: {item.executionTime}</span>
      </div>
      {item.error && (
        <div className="mt-2 text-xs text-red-500">
          Error: {item.error}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Database className="h-5 w-5 mr-2 text-primary" />
          SQL Query Generator
        </h2>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Generate SQL Queries</CardTitle>
              <CardDescription>
                Describe what data you want to analyze, and we'll generate the SQL for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="database-type">Your Database Type</Label>
                <select
                  id="database-type"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={database}
                  onChange={(e) => setDatabase(e.target.value)}
                >
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MySQL">MySQL</option>
                  <option value="BigQuery">BigQuery</option>
                  <option value="Snowflake">Snowflake</option>
                  <option value="Redshift">Redshift</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="query-prompt">Describe What You Want to Query</Label>
                <Textarea
                  id="query-prompt"
                  placeholder="e.g., Show me daily active users for the last 30 days"
                  value={queryPrompt}
                  onChange={(e) => setQueryPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              
              <Button
                onClick={handleGenerateQuery}
                disabled={!queryPrompt || isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate SQL Query'}
              </Button>
              
              <div className="p-4 border rounded space-y-2">
                <h3 className="font-medium text-sm">Try these examples:</h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-blue-600"
                      onClick={() => setQueryPrompt('Show me monthly active users over the last year')}
                    >
                      Monthly active users over the last year
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-blue-600"
                      onClick={() => setQueryPrompt('Calculate week-by-week user retention for the last 12 weeks')}
                    >
                      Week-by-week user retention
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-blue-600"
                      onClick={() => setQueryPrompt('Show conversion rates by acquisition channel')}
                    >
                      Conversion rates by acquisition channel
                    </Button>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                  <CardTitle>SQL Query</CardTitle>
                  <TabsList>
                    <TabsTrigger value="generate">
                      <Code className="h-4 w-4 mr-2" />
                      Generated
                    </TabsTrigger>
                    <TabsTrigger value="saved">
                      <Save className="h-4 w-4 mr-2" />
                      Saved
                    </TabsTrigger>
                    <TabsTrigger value="history">
                      <History className="h-4 w-4 mr-2" />
                      History
                    </TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="generate" className="space-y-4">
                {generatedQuery ? (
                  <>
                    <div className="relative">
                      <div className="absolute right-2 top-2 flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={handleCopyQuery}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowSaveForm(true)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                      <SyntaxHighlighter
                        language="sql"
                        style={vscDarkPlus}
                        className="rounded-md !mt-0 min-h-[300px]"
                      >
                        {generatedQuery}
                      </SyntaxHighlighter>
                    </div>
                    
                    {showSaveForm && (
                      <div className="border p-4 rounded-lg space-y-4 mt-4">
                        <h3 className="font-medium">Save Query</h3>
                        <div className="space-y-2">
                          <Label htmlFor="query-name">Query Name</Label>
                          <Input
                            id="query-name"
                            placeholder="e.g., Monthly Active Users"
                            value={queryName}
                            onChange={(e) => setQueryName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="query-description">Description (Optional)</Label>
                          <Textarea
                            id="query-description"
                            placeholder="What does this query show?"
                            value={queryDescription}
                            onChange={(e) => setQueryDescription(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowSaveForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveQuery}>
                            Save Query
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <FileCode className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Query Generated Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Enter a description of the data you want to analyze, and we'll
                      generate the SQL query for you.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="saved">
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search saved queries..."
                        className="pl-9"
                      />
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {mockSavedQueries.map(renderQueryCard)}
                    </div>
                  </div>
                  
                  <div className="md:col-span-3">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{selectedQuery.name}</h3>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCopyQuery}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedQuery.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground mb-2 space-x-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          {selectedQuery.techStack}
                        </Badge>
                        <span>•</span>
                        <span>Last run: {selectedQuery.lastRun}</span>
                      </div>
                    </div>
                    
                    <SyntaxHighlighter
                      language="sql"
                      style={vscDarkPlus}
                      className="rounded-md !mt-0 min-h-[300px]"
                    >
                      {selectedQuery.query}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="max-h-[500px] overflow-y-auto">
                  {mockQueryHistory.map(renderHistoryItem)}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
