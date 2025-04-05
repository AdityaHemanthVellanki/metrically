from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List
from ..services.azure_openai import generate_kpi_system, generate_sql_for_metric
from ..models.auth import get_current_user

router = APIRouter()

class KPIRequest(BaseModel):
    product_type: str
    company_stage: str
    tech_stack: str
    industry: Optional[str] = None

class MetricDetail(BaseModel):
    name: str
    description: str
    calculation: str
    importance: str

class SQLRequest(BaseModel):
    metric_name: str
    metric_calculation: str
    tech_stack: str

@router.post("/generate")
async def generate_kpi(request: KPIRequest, current_user: dict = Depends(get_current_user)):
    """
    Generate a KPI system based on the provided parameters.
    
    This endpoint creates a complete KPI system tailored to the company's 
    product type, stage, technology stack, and industry.
    """
    if not request.product_type or not request.company_stage or not request.tech_stack:
        raise HTTPException(status_code=400, detail="Missing required parameters")
    
    response = generate_kpi_system(
        product_type=request.product_type,
        company_stage=request.company_stage,
        tech_stack=request.tech_stack,
        industry=request.industry
    )
    
    if not response:
        raise HTTPException(status_code=500, detail="Failed to generate KPI system")
    
    return response

@router.post("/generate-sql")
async def generate_sql(request: SQLRequest, current_user: dict = Depends(get_current_user)):
    """
    Generate SQL for a specific metric.
    
    This endpoint creates SQL code tailored to the specific metric and technology stack.
    """
    sql = generate_sql_for_metric(
        metric_name=request.metric_name,
        metric_calculation=request.metric_calculation,
        tech_stack=request.tech_stack
    )
    
    return {"sql": sql}

@router.get("/example-systems")
async def get_example_systems():
    """
    Get example KPI systems for different types of products.
    
    This endpoint returns pre-generated examples to showcase the capabilities.
    """
    examples = [
        {
            "name": "SaaS Starter Pack",
            "product_type": "SaaS",
            "company_stage": "Seed",
            "metrics": [
                "MRR (Monthly Recurring Revenue)",
                "CAC (Customer Acquisition Cost)",
                "LTV (Lifetime Value)",
                "Churn Rate",
                "Activation Rate",
                "Feature Adoption"
            ]
        },
        {
            "name": "E-commerce Growth Kit",
            "product_type": "E-commerce",
            "company_stage": "Series A",
            "metrics": [
                "Average Order Value",
                "Conversion Rate",
                "Customer Retention Rate",
                "Return Rate",
                "Cart Abandonment Rate",
                "Revenue per Visitor"
            ]
        },
        {
            "name": "Mobile App Traction",
            "product_type": "Mobile App",
            "company_stage": "Pre-seed",
            "metrics": [
                "DAU/MAU Ratio",
                "Session Duration",
                "Retention D1/D7/D30",
                "Install to Sign-up Rate",
                "Push Notification Opt-in Rate",
                "Feature Engagement Depth"
            ]
        }
    ]
    
    return examples
