/**
 * Azure OpenAI API Service for Metrically
 * 
 * This service provides a client-side interface for interacting with
 * the Azure OpenAI API through our backend endpoints.
 */

// Import auth functions
import { getAuthToken } from './auth';

export interface CompanyInfo {
  product_type: string;
  company_stage: string;
  tech_stack: string;
  industry?: string;
  business_model?: string;
  strategic_focus?: string[];
  custom_prompt?: string;
}

export interface SQLGenerationRequest {
  metric_name: string;
  metric_calculation: string;
  tech_stack: string;
}

export interface AIPromptRequest {
  prompt: string;
  system_message?: string;
  temperature?: number;
  max_tokens?: number;
  structured_output?: boolean;
  output_schema?: any;
}

export interface Metric {
  category: string;
  name: string;
  description: string;
  calculation: string;
  importance: string;
  sql_query: string;
  visualization: string;
  benchmark: string;
}

export interface Dashboard {
  name: string;
  description: string;
  included_metrics: string[];
}

export interface KPISystemResponse {
  success: boolean;
  content?: {
    metrics: Metric[];
    dashboard_recommendations: Dashboard[];
    summary: string;
  };
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SQLResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export interface CompletionResponse {
  success: boolean;
  content?: any;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIServiceStatus {
  service: string;
  available: boolean;
  deployment: string | null;
}

/**
 * Azure AI Service class for interacting with Azure OpenAI
 */
class AzureAIService {
  private apiBaseUrl: string;
  
  constructor() {
    // Use environment variable or default to localhost for development
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }
  
  /**
   * Check if the Azure OpenAI service is available
   */
  async checkStatus(): Promise<AIServiceStatus> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ai/status`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking AI service status:', error);
      return {
        service: 'Azure OpenAI',
        available: false,
        deployment: null
      };
    }
  }
  
  /**
   * Generate a KPI system based on company information
   */
  async generateKPISystem(
    companyInfo: CompanyInfo,
    outputFormat: 'structured' | 'markdown' = 'structured'
  ): Promise<KPISystemResponse> {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${this.apiBaseUrl}/ai/generate-kpi?output_format=${outputFormat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companyInfo)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate KPI system');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error generating KPI system:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate KPI system'
      };
    }
  }
  
  /**
   * Generate SQL for a specific metric
   */
  async generateSQL(request: SQLGenerationRequest): Promise<SQLResponse> {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${this.apiBaseUrl}/ai/generate-sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate SQL');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error generating SQL:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate SQL'
      };
    }
  }
  
  /**
   * Generate a completion using Azure OpenAI
   */
  async generateCompletion(request: AIPromptRequest): Promise<CompletionResponse> {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${this.apiBaseUrl}/ai/completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate completion');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error generating completion:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate completion'
      };
    }
  }
}

// Create a singleton instance
const azureAIService = new AzureAIService();

export default azureAIService;
