from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .routers import kpi, auth
from .services.azure_openai import verify_api_key
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Metrically API",
    description="API for Metrically - Your KPIs. Architected by AI.",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/api-status")
async def api_status():
    """Check if Azure OpenAI API is configured"""
    is_configured = verify_api_key()
    return {"azure_openai_configured": is_configured}

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(kpi.router, prefix="/kpi", tags=["KPI Generation"])

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
    )
