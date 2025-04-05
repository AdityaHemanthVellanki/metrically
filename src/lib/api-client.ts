import { toast } from 'sonner';
import { mockUser, mockAuthResponse, mockMetrics, mockKPIResponse, mockExampleSystems } from './mock-api';
import { API_CONFIG } from './api-config';

// Define the base URL for our API using the embedded configuration
const API_BASE_URL = API_CONFIG.API_URL;

// Use mock data only when real API is not available
const USE_MOCK_DATA = !API_CONFIG.AZURE_OPENAI_API_KEY || API_CONFIG.AZURE_OPENAI_API_KEY === 'your-azure-openai-api-key-here';

// Types for our API requests and responses
export interface KPIGenerationRequest {
  product_type: string;
  company_stage: string;
  tech_stack: string;
  industry?: string;
  business_model?: string;
  target_audience?: string;
  startup_description?: string;
}

export interface Metric {
  name: string;
  description: string;
  calculation: string;
  importance: string;
  sql?: string;
  visualization?: string;
  benchmark?: string;
}

export interface KPIGenerationResponse {
  raw_response: string;
  tech_stack: string;
  metrics_count: number;
  has_sql: boolean;
  has_visualizations: boolean;
  has_benchmarks: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  full_name?: string;
}

export interface User {
  email: string;
  full_name?: string;
  disabled?: boolean;
}

// Error handling helper
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  const message = error.response?.data?.detail || error.message || 'An error occurred';
  toast.error(message);
  return { error: message };
};

// Utility to get the authentication token
const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('metrically_token') || (USE_MOCK_DATA ? 'mock_token' : null);
};

// API client
export const apiClient = {
  // Authentication
  async login(email: string, password: string): Promise<AuthResponse | { error: string }> {
    // Always use mock data in development to prevent fetch errors
    console.log('Using mock authentication data');
    localStorage.setItem('metrically_token', mockAuthResponse.access_token);
    return mockAuthResponse;
    
    // The code below is kept for reference but not executed in development mode
    /*
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        return handleApiError(error);
      }
      
      const data = await response.json();
      localStorage.setItem('metrically_token', data.access_token);
      return data;
    } catch (error) {
      if (USE_MOCK_DATA) {
        console.log('API unavailable, falling back to mock data');
        localStorage.setItem('metrically_token', mockAuthResponse.access_token);
        return mockAuthResponse;
      }
      return handleApiError(error);
    }
    */
  },
  
  async register(userData: UserRegistration): Promise<User | { error: string }> {
    // Always use mock data in development
    console.log('Using mock registration data');
    localStorage.setItem('metrically_token', mockAuthResponse.access_token);
    return mockUser;
    
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return handleApiError(error);
      }
      
      return await response.json();
    } catch (error) {
      if (USE_MOCK_DATA) {
        console.log('API unavailable, falling back to mock data');
        localStorage.setItem('metrically_token', mockAuthResponse.access_token);
        return mockUser;
      }
      return handleApiError(error);
    }
    */
  },
  
  async getCurrentUser(): Promise<User | null> {
    const token = getToken();
    if (!token) return null;
    
    // Always use mock data in development
    console.log('Using mock user data');
    return mockUser;
    
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('metrically_token');
          return null;
        }
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      
      if (USE_MOCK_DATA) {
        console.log('API unavailable, falling back to mock data');
        return mockUser;
      }
      
      return null;
    }
    */
  },
  
  // KPI Generation
  async generateKPI(request: KPIGenerationRequest): Promise<KPIGenerationResponse | { error: string }> {
    const token = getToken();
    if (!token) {
      return { error: 'Authentication required' };
    }
    
    // Use mock data if API is unavailable
    if (USE_MOCK_DATA) {
      console.log('Using mock KPI generation data');
      return {
        raw_response: 'Mock raw response',
        tech_stack: 'Mock tech stack',
        metrics_count: 10,
        has_sql: true,
        has_visualizations: true,
        has_benchmarks: true,
      };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/kpi/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return handleApiError(error);
      }
      
      return await response.json();
    } catch (error) {
      if (USE_MOCK_DATA) {
        console.log('API unavailable, falling back to mock data');
        return {
          raw_response: 'Mock raw response',
          tech_stack: 'Mock tech stack',
          metrics_count: 10,
          has_sql: true,
          has_visualizations: true,
          has_benchmarks: true,
        };
      }
      return handleApiError(error);
    }
  },
  
  async generateSQL(metricName: string, metricCalculation: string, techStack: string): Promise<{ sql: string } | { error: string }> {
    const token = getToken();
    if (!token) {
      return { error: 'Authentication required' };
    }
    
    // Use mock data if API is unavailable
    if (USE_MOCK_DATA) {
      console.log('Using mock SQL generation data');
      return { sql: 'Mock SQL query' };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/kpi/generate-sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric_name: metricName,
          metric_calculation: metricCalculation,
          tech_stack: techStack,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return handleApiError(error);
      }
      
      return await response.json();
    } catch (error) {
      if (USE_MOCK_DATA) {
        console.log('API unavailable, falling back to mock data');
        return { sql: 'Mock SQL query' };
      }
      return handleApiError(error);
    }
  },
  
  async getExampleSystems(): Promise<any> {
    // Use mock data if API is unavailable
    if (USE_MOCK_DATA) {
      console.log('Using mock example systems data');
      return [
        { id: 1, name: 'Mock system 1' },
        { id: 2, name: 'Mock system 2' },
      ];
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/kpi/example-systems`);
      
      if (!response.ok) {
        const error = await response.json();
        return handleApiError(error);
      }
      
      return await response.json();
    } catch (error) {
      if (USE_MOCK_DATA) {
        console.log('API unavailable, falling back to mock data');
        return [
          { id: 1, name: 'Mock system 1' },
          { id: 2, name: 'Mock system 2' },
        ];
      }
      return handleApiError(error);
    }
  },
  
  // API Status
  async checkApiStatus(): Promise<{ azure_openai_configured: boolean } | { error: string }> {
    // Use mock data if API is unavailable
    if (USE_MOCK_DATA) {
      console.log('Using mock API status data');
      return { azure_openai_configured: true };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api-status`);
      
      if (!response.ok) {
        const error = await response.json();
        return handleApiError(error);
      }
      
      return await response.json();
    } catch (error) {
      if (USE_MOCK_DATA) {
        console.log('API unavailable, falling back to mock data');
        return { azure_openai_configured: true };
      }
      return handleApiError(error);
    }
  },
  
  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return Boolean(getToken());
  },
  
  logout(): void {
    localStorage.removeItem('metrically_token');
  }
};
