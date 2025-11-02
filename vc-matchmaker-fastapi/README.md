# VC Matchmaker FastAPI Backend

Backend API for the VC Matchmaker platform built with FastAPI.

## Features

- **CORS enabled** for React frontend communication
- RESTful API endpoints for VC and Founder dashboards
- Authentication endpoints
- Category and options endpoints
- Demo data for testing

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

The API will be available at: `http://localhost:8000`

### Alternative port:
```bash
uvicorn main:app --reload --port 8001
```

## API Documentation

Once the server is running, you can access:
- **Interactive API docs (Swagger)**: http://localhost:8000/docs
- **Alternative API docs (ReDoc)**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/user/{uid}` - Get user by UID

### VC Dashboard
- `GET /api/vc/dashboard` - Get complete dashboard data
- `GET /api/vc/metrics` - Get key metrics
- `GET /api/vc/portfolio/summary` - Get portfolio summary
- `GET /api/vc/portfolio/holdings` - Get holdings list
- `GET /api/vc/dealflow` - Get dealflow pipeline
- `GET /api/vc/alerts` - Get recent alerts
- And more...

### Founder Dashboard
- `GET /api/founder/dashboard` - Get complete dashboard data
- `GET /api/founder/form/steps` - Get all form steps
- `GET /api/founder/form/steps/{step_number}` - Get specific step
- `GET /api/founder/options/industries` - Get industry options
- `GET /api/founder/options/stages` - Get stage options

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/industries` - Get industries
- `GET /api/categories/stages` - Get funding stages
- `GET /api/categories/regions` - Get regions

## Demo Credentials

### Founder Account
- Email: `founder@vcmatchmaker.com`
- Username: `founder`
- Password: `founder`

### VC Account
- Email: `admin@vcmatchmaker.com`
- Username: `admin`
- Password: `auth`

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React dev server)
- `http://localhost:3001`
- `http://127.0.0.1:3000`

## Tech Stack

- **FastAPI** - Modern, fast web framework for building APIs
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server for running FastAPI applications
