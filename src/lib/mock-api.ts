// Mock data for development when the backend is not available

import { User, AuthResponse, KPIGenerationResponse } from './api-client';

// Mock user for authentication
export const mockUser: User = {
  email: 'demo@metrically.ai',
  full_name: 'Demo User',
  disabled: false
};

// Mock authentication response
export const mockAuthResponse: AuthResponse = {
  access_token: 'mock_jwt_token_for_development',
  token_type: 'bearer'
};

// Mock KPI generation response
export const mockKPIResponse: KPIGenerationResponse = {
  raw_response: 'Successfully generated KPIs for your SaaS startup.',
  tech_stack: 'PostgreSQL',
  metrics_count: 5,
  has_sql: true,
  has_visualizations: true,
  has_benchmarks: true
};

// Example KPI metrics
export const mockMetrics = [
  {
    name: 'Monthly Recurring Revenue (MRR)',
    description: 'The total predictable revenue generated from all subscriptions normalized to a monthly amount.',
    calculation: 'Sum of all monthly subscription values',
    importance: 'Critical for tracking business growth and financial health',
    sql: 'SELECT DATE_TRUNC(\'month\', subscription_date) as month, SUM(subscription_value) as mrr FROM subscriptions GROUP BY month ORDER BY month',
    visualization: 'line',
    benchmark: 'Industry average: 15-20% YoY growth'
  },
  {
    name: 'Customer Acquisition Cost (CAC)',
    description: 'The average cost to acquire a new customer.',
    calculation: 'Total marketing and sales costs divided by number of new customers acquired',
    importance: 'Essential for measuring marketing efficiency and profitability',
    sql: 'SELECT DATE_TRUNC(\'month\', acquisition_date) as month, SUM(marketing_cost + sales_cost) / COUNT(DISTINCT customer_id) as cac FROM customer_acquisition GROUP BY month ORDER BY month',
    visualization: 'bar',
    benchmark: 'SaaS benchmark: $1,000-$1,500 for enterprise, $300-$500 for mid-market'
  },
  {
    name: 'Customer Lifetime Value (CLV)',
    description: 'The total revenue a business can expect from a single customer account throughout their relationship.',
    calculation: 'Average revenue per customer × Average customer lifespan',
    importance: 'Critical for understanding long-term customer value and relationship profitability',
    sql: 'WITH customer_revenue AS (SELECT customer_id, SUM(payment_amount) as total_revenue, MAX(payment_date) - MIN(payment_date) as customer_lifespan FROM payments GROUP BY customer_id) SELECT AVG(total_revenue) as avg_revenue, AVG(customer_lifespan) as avg_lifespan, AVG(total_revenue) * AVG(customer_lifespan) as clv FROM customer_revenue',
    visualization: 'pie',
    benchmark: 'Healthy SaaS CLV:CAC ratio is 3:1 or higher'
  },
  {
    name: 'Churn Rate',
    description: 'The percentage rate at which customers cancel or don\'t renew subscriptions.',
    calculation: 'Number of customers who churned in a period / Total customers at the start of the period',
    importance: 'Key indicator of customer satisfaction and product stickiness',
    sql: 'SELECT DATE_TRUNC(\'month\', period_start) as month, COUNT(churned_customers) / COUNT(total_customers) * 100 as churn_rate FROM customer_retention GROUP BY month ORDER BY month',
    visualization: 'bar',
    benchmark: 'Good SaaS churn rate: <5% for enterprise, <10% for SMB'
  },
  {
    name: 'Net Promoter Score (NPS)',
    description: 'A measure of customer satisfaction and loyalty.',
    calculation: 'Percentage of promoters (9-10 score) minus percentage of detractors (0-6 score)',
    importance: 'Indicates customer satisfaction and likelihood to recommend product',
    sql: 'SELECT survey_date, (COUNT(CASE WHEN score BETWEEN 9 AND 10 THEN 1 END) - COUNT(CASE WHEN score BETWEEN 0 AND 6 THEN 1 END)) / COUNT(*) * 100 as nps FROM customer_surveys GROUP BY survey_date ORDER BY survey_date',
    visualization: 'gauge',
    benchmark: 'SaaS industry average NPS: 30-40'
  }
];

// Example systems
export const mockExampleSystems = [
  {
    title: 'SaaS Startup Metrics',
    description: 'Essential KPIs for early-stage SaaS companies',
    metrics: mockMetrics.slice(0, 3)
  },
  {
    title: 'E-commerce Performance Metrics',
    description: 'Key metrics for online retail businesses',
    metrics: [
      {
        name: 'Conversion Rate',
        description: 'Percentage of visitors who complete a purchase',
        calculation: 'Number of conversions / Number of total visitors × 100',
        importance: 'Primary indicator of store effectiveness',
        visualization: 'line'
      },
      {
        name: 'Average Order Value (AOV)',
        description: 'Average amount spent each time a customer places an order',
        calculation: 'Total revenue / Number of orders',
        importance: 'Key metric for pricing strategy and product decisions',
        visualization: 'bar'
      }
    ]
  }
];
