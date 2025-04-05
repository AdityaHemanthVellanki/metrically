import os
from openai import AzureOpenAI
from dotenv import load_dotenv
import logging

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def get_azure_client():
    """
    Create and return an Azure OpenAI client instance.
    
    This function sets up the connection to Azure OpenAI API
    using environment variables.
    
    Returns:
        AzureOpenAI: A configured Azure OpenAI client
    """
    try:
        client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2023-05-15"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Azure OpenAI client: {str(e)}")
        return None

def verify_api_key():
    """
    Verify that the Azure OpenAI API key is configured and valid.
    
    Returns:
        bool: True if the API key is configured, False otherwise
    """
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    
    if not api_key or not endpoint:
        logger.warning("Azure OpenAI API key or endpoint not configured")
        return False
    
    # Simple check - we're not actually making an API call here
    # In production, you might want to make a simple API call to verify
    return True

def generate_kpi_system(product_type, company_stage, tech_stack, industry=None):
    """
    Generate a KPI system based on the provided parameters.
    
    Args:
        product_type (str): Type of product (e.g., 'SaaS', 'Mobile App')
        company_stage (str): Company stage (e.g., 'Seed', 'Series A')
        tech_stack (str): Technology stack (e.g., 'PostgreSQL', 'Firebase')
        industry (str, optional): Industry vertical. Defaults to None.
    
    Returns:
        dict: Generated KPI system with metrics, SQL, and dashboard suggestions
    """
    client = get_azure_client()
    if not client:
        logger.error("Failed to get Azure OpenAI client")
        return None
    
    deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4")
    
    try:
        prompt = create_kpi_prompt(product_type, company_stage, tech_stack, industry)
        
        # Call Azure OpenAI API
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are an expert KPI architect and data analyst for startups."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=2000,
            top_p=0.95
        )
        
        # Process and structure the response
        raw_response = response.choices[0].message.content
        structured_response = parse_kpi_response(raw_response, tech_stack)
        
        return structured_response
        
    except Exception as e:
        logger.error(f"Error generating KPI system: {str(e)}")
        return None

def create_kpi_prompt(product_type, company_stage, tech_stack, industry=None):
    """
    Create a prompt for the KPI system generation.
    
    Args:
        product_type (str): Type of product
        company_stage (str): Company stage
        tech_stack (str): Technology stack
        industry (str, optional): Industry vertical. Defaults to None.
    
    Returns:
        str: Formatted prompt for the AI
    """
    industry_context = f"in the {industry} industry" if industry else ""
    
    prompt = f"""
    As an expert KPI architect, create a complete KPI system for a {company_stage} stage startup 
    with a {product_type} product {industry_context}.
    
    They use {tech_stack} for their data.
    
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
    
    Format your response in a structured way that can be easily parsed. Use clear section headings.
    """
    
    return prompt

def parse_kpi_response(raw_response, tech_stack):
    """
    Parse the raw response from OpenAI into a structured format.
    
    In a real application, this would be more sophisticated with regex or LLM-based parsing.
    
    Args:
        raw_response (str): Raw text response from OpenAI
        tech_stack (str): Technology stack for context
    
    Returns:
        dict: Structured KPI response
    """
    # This is a simplified parsing - in production this would be more robust
    categories = ["METRICS", "SQL QUERIES", "DASHBOARD VISUALIZATION", "BENCHMARKS"]
    
    # For now, we're just returning the raw response with some minimal structure
    # In a real app, this would parse the text into distinct metrics with their properties
    return {
        "raw_response": raw_response,
        "tech_stack": tech_stack,
        "metrics_count": raw_response.lower().count("metric"),
        "has_sql": "sql" in raw_response.lower(),
        "has_visualizations": "visualization" in raw_response.lower() or "chart" in raw_response.lower(),
        "has_benchmarks": "benchmark" in raw_response.lower() or "target" in raw_response.lower()
    }

def generate_sql_for_metric(metric_name, metric_calculation, tech_stack):
    """
    Generate SQL for a specific metric based on the tech stack.
    
    Args:
        metric_name (str): Name of the metric
        metric_calculation (str): Description of how the metric is calculated
        tech_stack (str): Technology stack (e.g., 'PostgreSQL', 'Firebase')
    
    Returns:
        str: Generated SQL query
    """
    client = get_azure_client()
    if not client:
        return "-- Failed to generate SQL query - API connection error"
    
    deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4")
    
    prompt = f"""
    Create a SQL query for {tech_stack} that calculates the '{metric_name}' metric.
    
    Metric description: {metric_calculation}
    
    Assume standard table names based on the metric context (e.g., users, events, transactions).
    Keep the query concise but clear with comments explaining each part.
    
    Only return the SQL query, nothing else.
    """
    
    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are a SQL expert that creates clean, efficient queries."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error generating SQL: {str(e)}")
        return "-- Failed to generate SQL query due to an error"
