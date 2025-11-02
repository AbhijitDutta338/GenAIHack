# VC Matchmaker - Startup Guide

This guide will help you run both the FastAPI backend and React frontend together.

## Quick Start

### 1. Start the FastAPI Backend

Open a terminal and run:

```bash
cd vc-matchmaker-fastapi
python -m uvicorn main:app --reload
```

The backend will start at: **http://localhost:8000**

You can verify it's running by visiting:
- Health check: http://localhost:8000/health
- API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

### 2. Start the React Frontend

Open another terminal and run:

```bash
cd vc-matchmaker-react
npm start
```

The frontend will start at: **http://localhost:3000**

## Demo Credentials

### Login as Founder
- Email: `founder@vcmatchmaker.com` OR Username: `founder`
- Password: `founder`

### Login as VC/Admin
- Email: `admin@vcmatchmaker.com` OR Username: `admin`
- Password: `auth`

## Testing the Integration

Once both servers are running:

1. Open http://localhost:3000 in your browser
2. You should see the homepage
3. Click "Login" and use one of the demo credentials above
4. The dashboard should load data from the FastAPI backend

### Expected Behavior

- **VC Dashboard**: Shows portfolio metrics, holdings, dealflow pipeline
- **Founder Dashboard**: Shows company profile form or completed profile

### Troubleshooting

#### "Failed to load dashboard data" Error

This means the React app cannot connect to the FastAPI backend. Check:

1. FastAPI is running on port 8000:
   ```bash
   curl http://localhost:8000/health
   ```

2. No firewall blocking localhost connections

3. CORS is properly configured (it should be by default)

#### Backend Not Starting

Make sure you have the required Python packages:

```bash
cd vc-matchmaker-fastapi
pip install -r requirements.txt
```

Required packages:
- fastapi
- uvicorn
- pydantic

#### Frontend Errors

Make sure you have installed npm packages:

```bash
cd vc-matchmaker-react
npm install
```

## API Endpoints Available

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/user/{uid}` - Get user info

### VC Dashboard Data
- `GET /api/vc/dashboard` - Complete dashboard
- `GET /api/vc/metrics` - Key metrics
- `GET /api/vc/portfolio/holdings` - Portfolio holdings
- `GET /api/vc/dealflow` - Dealflow pipeline
- `GET /api/vc/alerts` - Recent alerts

### Founder Dashboard Data
- `GET /api/founder/dashboard` - Complete dashboard
- `GET /api/founder/form/steps` - Form configuration
- `GET /api/founder/options/industries` - Industry options
- `GET /api/founder/options/stages` - Stage options

### Categories
- `GET /api/categories` - All categories
- `GET /api/categories/industries` - Industries list
- `GET /api/categories/stages` - Funding stages
- `GET /api/categories/regions` - Regions list

## Architecture

```
┌─────────────────────────────────────┐
│   React Frontend (Port 3000)       │
│   - VCDashboard.js                  │
│   - FounderDashboard.js             │
│   - LoginPage.js                    │
└─────────────┬───────────────────────┘
              │ HTTP Requests
              │ (fetch API)
              ▼
┌─────────────────────────────────────┐
│   FastAPI Backend (Port 8000)      │
│   - CORS enabled                    │
│   - REST API endpoints              │
│   - Demo data storage               │
└─────────────────────────────────────┘
```

## Development Workflow

1. **Backend Changes**: The FastAPI server auto-reloads when you save changes to `main.py`
2. **Frontend Changes**: The React dev server hot-reloads when you save component files
3. **API Testing**: Use http://localhost:8000/docs for interactive API testing

## Next Steps

- Add database integration (PostgreSQL, MongoDB, etc.)
- Implement real authentication with JWT tokens
- Add more API endpoints for CRUD operations
- Deploy to production (Backend: Railway/Heroku, Frontend: Vercel/Netlify)

## Support

If you encounter issues:
1. Check both terminal windows for error messages
2. Verify both servers are running
3. Check browser console for network errors
4. Review the API docs at http://localhost:8000/docs
