// API Configuration using environment variables
// This file contains configuration for Azure OpenAI but no hardcoded keys

export const API_CONFIG = {
  // Azure OpenAI API Configuration
  AZURE_OPENAI_API_KEY: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || '',
  AZURE_OPENAI_ENDPOINT: process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || 'https://openai-buildai.openai.azure.com/',
  AZURE_OPENAI_API_VERSION: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_VERSION || '2023-05-15',
  AZURE_OPENAI_DEPLOYMENT_NAME: process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
  
  // Backend API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Use environment variables instead of embedded keys
  USE_EMBEDDED_KEYS: false
};
