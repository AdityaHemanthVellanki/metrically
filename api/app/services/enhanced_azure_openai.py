import os
import json
from openai import AzureOpenAI
from dotenv import load_dotenv
import logging
from typing import Dict, List, Any, Optional, Union

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class AzureOpenAIService:
    """
    Enhanced Azure OpenAI Service for Metrically
    
    This service provides a unified interface for interacting with Azure OpenAI
    with additional features like:
    - Structured response handling
    - Error management
    - Model selection
    - Context management
    """
    
    def __init__(self):
        """Initialize the Azure OpenAI service with configuration from environment variables"""
        self.api_key = os.getenv("AZURE_OPENAI_API_KEY")
        self.api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2023-05-15")
        self.endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4")
        self.client = self._initialize_client()
        
    def _initialize_client(self) -> Optional[AzureOpenAI]:
        """Initialize and return the Azure OpenAI client"""
        if not self.api_key or not self.endpoint:
            logger.warning("Azure OpenAI API key or endpoint not configured")
            return None
            
        try:
            client = AzureOpenAI(
                api_key=self.api_key,
                api_version=self.api_version,
                azure_endpoint=self.endpoint
            )
            return client
        except Exception as e:
            logger.error(f"Failed to initialize Azure OpenAI client: {str(e)}")
            return None
    
    def is_available(self) -> bool:
        """Check if the Azure OpenAI service is available and configured"""
        return self.client is not None
    
    def generate_completion(
        self, 
        prompt: str, 
        system_message: str = "You are a helpful assistant.",
        temperature: float = 0.7,
        max_tokens: int = 1000,
        model: Optional[str] = None,
        structured_output: bool = False,
        output_schema: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Generate a completion using Azure OpenAI
        
        Args:
            prompt: The user prompt to send to the model
            system_message: The system message to set the context
            temperature: Controls randomness (0-1)
            max_tokens: Maximum tokens in the response
            model: Override the default model
            structured_output: Whether to request structured JSON output
            output_schema: Schema definition for structured output
            
        Returns:
            Dictionary containing the response and metadata
        """
        if not self.client:
            return {"success": False, "error": "Azure OpenAI client not initialized"}
        
        deployment = model or self.deployment_name
        
        # Prepare messages
        messages = [
            {"role": "system", "content": system_message}
        ]
        
        # Add structured output instructions if requested
        if structured_output and output_schema:
            schema_str = json.dumps(output_schema, indent=2)
            structured_system_message = f"{system_message}\n\nYou MUST format your response as a JSON object that conforms to the following schema:\n{schema_str}\n\nDo not include any explanatory text outside the JSON structure."
            messages[0]["content"] = structured_system_message
        
        # Add user prompt
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = self.client.chat.completions.create(
                model=deployment,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                response_format={"type": "json_object"} if structured_output else None
            )
            
            content = response.choices[0].message.content
            
            # Parse JSON if structured output was requested
            if structured_output:
                try:
                    parsed_content = json.loads(content)
                    return {
                        "success": True,
                        "content": parsed_content,
                        "usage": {
                            "prompt_tokens": response.usage.prompt_tokens,
                            "completion_tokens": response.usage.completion_tokens,
                            "total_tokens": response.usage.total_tokens
                        }
                    }
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse JSON response: {str(e)}")
                    return {
                        "success": False,
                        "error": "Failed to parse structured output",
                        "raw_content": content
                    }
            
            # Return raw content for non-structured responses
            return {
                "success": True,
                "content": content,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating completion: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def generate_kpi_system(
        self,
        company_info: Dict[str, Any],
        output_format: str = "structured"
    ) -> Dict[str, Any]:
        """
        Generate a KPI system based on company information
        
        Args:
            company_info: Dictionary containing company information
                - product_type: Type of product
                - company_stage: Company stage
                - tech_stack: Technology stack
                - industry: Industry vertical
                - business_model: Business model
                - strategic_focus: Strategic focus areas
                - custom_prompt: Custom context about the company
            output_format: "structured" for JSON or "markdown" for text
            
        Returns:
            Dictionary containing the KPI system
        """
        # Extract company information
        product_type = company_info.get("product_type", "")
        company_stage = company_info.get("company_stage", "")
        tech_stack = company_info.get("tech_stack", "")
        industry = company_info.get("industry", "")
        business_model = company_info.get("business_model", "")
        strategic_focus = company_info.get("strategic_focus", [])
        custom_prompt = company_info.get("custom_prompt", "")
        
        # Create prompt
        prompt = self._create_kpi_prompt(
            product_type=product_type,
            company_stage=company_stage,
            tech_stack=tech_stack,
            industry=industry,
            business_model=business_model,
            strategic_focus=strategic_focus,
            custom_prompt=custom_prompt
        )
        
        # Define output schema for structured responses
        kpi_schema = {
            "type": "object",
            "properties": {
                "metrics": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "category": {"type": "string"},
                            "name": {"type": "string"},
                            "description": {"type": "string"},
                            "calculation": {"type": "string"},
                            "importance": {"type": "string"},
                            "sql_query": {"type": "string"},
                            "visualization": {"type": "string"},
                            "benchmark": {"type": "string"}
                        }
                    }
                },
                "dashboard_recommendations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "description": {"type": "string"},
                            "included_metrics": {"type": "array", "items": {"type": "string"}}
                        }
                    }
                },
                "summary": {"type": "string"}
            }
        }
        
        # Generate response
        if output_format == "structured":
            return self.generate_completion(
                prompt=prompt,
                system_message="You are an expert KPI architect and data analyst for startups.",
                temperature=0.5,
                max_tokens=2500,
                structured_output=True,
                output_schema=kpi_schema
            )
        else:
            return self.generate_completion(
                prompt=prompt,
                system_message="You are an expert KPI architect and data analyst for startups.",
                temperature=0.5,
                max_tokens=2500
            )
    
    def generate_sql_query(
        self,
        metric_name: str,
        metric_calculation: str,
        tech_stack: str
    ) -> Dict[str, Any]:
        """
        Generate SQL for a specific metric based on the tech stack
        
        Args:
            metric_name: Name of the metric
            metric_calculation: Description of how the metric is calculated
            tech_stack: Technology stack (e.g., 'PostgreSQL', 'Firebase')
            
        Returns:
            Dictionary containing the SQL query
        """
        prompt = f"""
        Create a SQL query for {tech_stack} that calculates the '{metric_name}' metric.
        
        Metric description: {metric_calculation}
        
        Assume standard table names based on the metric context (e.g., users, events, transactions).
        Keep the query concise but clear with comments explaining each part.
        
        Only return the SQL query, nothing else.
        """
        
        return self.generate_completion(
            prompt=prompt,
            system_message="You are a SQL expert that creates clean, efficient queries.",
            temperature=0.3,
            max_tokens=500
        )
    
    def _create_kpi_prompt(
        self,
        product_type: str,
        company_stage: str,
        tech_stack: str,
        industry: str = "",
        business_model: str = "",
        strategic_focus: List[str] = [],
        custom_prompt: str = ""
    ) -> str:
        """
        Create a detailed prompt for KPI system generation
        
        Args:
            product_type: Type of product
            company_stage: Company stage
            tech_stack: Technology stack
            industry: Industry vertical
            business_model: Business model
            strategic_focus: Strategic focus areas
            custom_prompt: Custom context about the company
            
        Returns:
            Formatted prompt for the AI
        """
        industry_context = f"in the {industry} industry" if industry else ""
        business_model_context = f"with a {business_model} business model" if business_model else ""
        
        # Format strategic focus areas
        focus_areas = ""
        if strategic_focus and len(strategic_focus) > 0:
            focus_list = ", ".join(strategic_focus[:-1])
            if len(strategic_focus) > 1:
                focus_list += f" and {strategic_focus[-1]}"
            else:
                focus_list = strategic_focus[0]
            focus_areas = f"\nTheir strategic focus areas are: {focus_list}."
        
        # Add custom context if provided
        custom_context = f"\n\nAdditional context about the company:\n{custom_prompt}" if custom_prompt else ""
        
        prompt = f"""
        Create a complete KPI system for a {company_stage} stage startup 
        with a {product_type} product {industry_context} {business_model_context}.
        
        They use {tech_stack} for their data.{focus_areas}{custom_context}
        
        Include the following in your response:
        
        1. METRICS: A list of 6-8 KEY metrics this startup should track, divided into these categories:
           - Acquisition metrics (how customers find them)
           - Activation metrics (initial product engagement)
           - Retention metrics (ongoing product engagement)
           - Revenue metrics (monetization)
           - Each metric should have a name, description, calculation formula, and why it matters.
        
        2. SQL QUERIES: For each metric, provide a SQL query tailored for {tech_stack} that would calculate this metric.
        
        3. DASHBOARD VISUALIZATION: For each metric, recommend a visualization type (line chart, bar chart, etc.) with explanation.
        
        4. BENCHMARKS: For each metric, provide industry benchmarks or targets that would indicate good performance.
        
        5. DASHBOARD RECOMMENDATIONS: Suggest 2-3 dashboards that group related metrics together.
        """
        
        return prompt

# Create a singleton instance
azure_openai_service = AzureOpenAIService()

def get_azure_openai_service() -> AzureOpenAIService:
    """Get the Azure OpenAI service instance"""
    return azure_openai_service
