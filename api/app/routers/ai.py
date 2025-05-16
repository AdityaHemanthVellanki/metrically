from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..services.enhanced_azure_openai import get_azure_openai_service, AzureOpenAIService
from ..models.auth import get_current_user

router = APIRouter()

class CompanyInfo(BaseModel):
    """Company information for KPI generation"""
    product_type: str
    company_stage: str
    tech_stack: str
    industry: Optional[str] = None
    business_model: Optional[str] = None
    strategic_focus: Optional[List[str]] = []
    custom_prompt: Optional[str] = None

class SQLGenerationRequest(BaseModel):
    """Request for SQL generation"""
    metric_name: str
    metric_calculation: str
    tech_stack: str

class AIPromptRequest(BaseModel):
    """Generic AI prompt request"""
    prompt: str
    system_message: Optional[str] = "You are a helpful assistant."
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000
    structured_output: Optional[bool] = False
    output_schema: Optional[Dict[str, Any]] = None

@router.get("/status")
async def check_ai_status():
    """Check if the Azure OpenAI service is available and configured"""
    service = get_azure_openai_service()
    is_available = service.is_available()
    
    return {
        "service": "Azure OpenAI",
        "available": is_available,
        "deployment": service.deployment_name if is_available else None
    }

@router.post("/generate-kpi")
async def generate_kpi_system(
    company_info: CompanyInfo,
    output_format: Optional[str] = "structured",
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a KPI system based on company information
    
    This endpoint creates a complete KPI system tailored to the company's profile,
    including metrics, SQL queries, visualizations, and benchmarks.
    """
    service = get_azure_openai_service()
    
    if not service.is_available():
        raise HTTPException(
            status_code=503,
            detail="Azure OpenAI service is not available. Please check your API configuration."
        )
    
    response = service.generate_kpi_system(
        company_info=company_info.dict(),
        output_format=output_format
    )
    
    if not response.get("success", False):
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate KPI system: {response.get('error', 'Unknown error')}"
        )
    
    return response

@router.post("/generate-sql")
async def generate_sql(
    request: SQLGenerationRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate SQL for a specific metric
    
    This endpoint creates SQL code tailored to the specific metric and technology stack.
    """
    service = get_azure_openai_service()
    
    if not service.is_available():
        raise HTTPException(
            status_code=503,
            detail="Azure OpenAI service is not available. Please check your API configuration."
        )
    
    response = service.generate_sql_query(
        metric_name=request.metric_name,
        metric_calculation=request.metric_calculation,
        tech_stack=request.tech_stack
    )
    
    if not response.get("success", False):
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate SQL: {response.get('error', 'Unknown error')}"
        )
    
    return response

@router.post("/completion")
async def generate_completion(
    request: AIPromptRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a completion using Azure OpenAI
    
    This endpoint provides direct access to the Azure OpenAI completion API
    with additional features like structured output.
    """
    service = get_azure_openai_service()
    
    if not service.is_available():
        raise HTTPException(
            status_code=503,
            detail="Azure OpenAI service is not available. Please check your API configuration."
        )
    
    response = service.generate_completion(
        prompt=request.prompt,
        system_message=request.system_message,
        temperature=request.temperature,
        max_tokens=request.max_tokens,
        structured_output=request.structured_output,
        output_schema=request.output_schema
    )
    
    if not response.get("success", False):
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate completion: {response.get('error', 'Unknown error')}"
        )
    
    return response
