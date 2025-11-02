# VC Matchmaker - Complete Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER (Browser)                              │
│                  http://localhost:3000                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ User Actions
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│               REACT FRONTEND (Port 3000)                        │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                    │
│  ├─ LoginPage.js        ──► authService.login()                │
│  ├─ VCDashboard.js      ──► apiService.getVCDashboard()        │
│  ├─ FounderDashboard.js ──► apiService.getFounderDashboard()   │
│  └─ AuthContext.js      ──► Manages user state                 │
│                                                                 │
│  Services Layer:                                                │
│  ├─ apiService.js       ──► Central API client                 │
│  ├─ authService.js      ──► Authentication wrapper             │
│  ├─ vcService.js        ──► VC-specific operations             │
│  └─ startupService.js   ──► Startup operations                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP Requests (fetch API)
                          │ GET, POST, PUT, DELETE
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│              FASTAPI BACKEND (Port 8000)                        │
├─────────────────────────────────────────────────────────────────┤
│  CORS Middleware:                                               │
│  ├─ Origin: localhost:3000 ✓                                    │
│  ├─ Methods: ALL ✓                                              │
│  └─ Headers: ALL ✓                                              │
│                                                                 │
│  API Endpoints:                                                 │
│  ├─ /api/auth/*           Authentication                        │
│  ├─ /api/vc/*             VC Dashboard Data                     │
│  ├─ /api/founder/*        Founder Dashboard Data                │
│  └─ /api/categories/*     Dropdown Options                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ Data Access
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                  DATA STORAGE (In-Memory)                       │
├─────────────────────────────────────────────────────────────────┤
│  VC_DASHBOARD_DATA:                                             │
│  ├─ keyMetrics         (funds, IRR, TVPI)                       │
│  ├─ portfolioHoldings  (9 companies)                            │
│  ├─ dealflowStages     (5 stages, multiple deals)              │
│  ├─ holdingsData       (P&L, weights)                           │
│  └─ alerts, startups to watch, etc.                             │
│                                                                 │
│  FOUNDER_DASHBOARD_DATA:                                        │
│  ├─ completedProfileSample                                      │
│  ├─ formSteps          (7 steps, 35+ fields)                    │
│  └─ industryOptions, stageOptions                               │
│                                                                 │
│  DEMO_USERS:                                                    │
│  ├─ FOUNDER            (founder / founder)                      │
│  └─ VC                 (admin / auth)                           │
│                                                                 │
│  CATEGORIES_DATA:                                               │
│  ├─ industries, stages, regions                                 │
│  └─ All dropdown options                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow Example: VC Dashboard Load

```
1. User visits http://localhost:3000 and logs in as "admin/auth"
   
2. React → authService.login(email, password)
   
3. authService → apiService.post('/api/auth/login', {...})
   
4. apiService → fetch('http://localhost:8000/api/auth/login')
   
5. FastAPI → Validates credentials against DEMO_USERS
   
6. FastAPI → Returns { success: true, user: {...} }
   
7. authService → Stores user in localStorage
   
8. User redirected to /vc-dashboard
   
9. VCDashboard.js → useEffect() triggers
   
10. VCDashboard → apiService.getVCDashboard()
   
11. apiService → fetch('http://localhost:8000/api/vc/dashboard')
   
12. FastAPI → CORS preflight (OPTIONS) → 200 OK
   
13. FastAPI → Returns VC_DASHBOARD_DATA → 200 OK
   
14. VCDashboard → setState(data)
   
15. React → Renders portfolio metrics, holdings, dealflow
   
16. User sees complete dashboard with live data!
```

## API Call Patterns

### Authentication Flow
```
Login Page
  └─► authService.login(email, password)
       └─► apiService.post('/api/auth/login', {email, password})
            └─► FastAPI: POST /api/auth/login
                 └─► Returns: {success: true, user: {...}}
                      └─► Store in localStorage
                           └─► Redirect to dashboard
```

### VC Dashboard Data Flow
```
VCDashboard Component Mount
  └─► useEffect(() => fetchData(), [])
       └─► apiService.getVCDashboard()
            └─► fetch('http://localhost:8000/api/vc/dashboard')
                 └─► FastAPI: GET /api/vc/dashboard
                      └─► Returns: VC_DASHBOARD_DATA (JSON)
                           └─► setState(dashboardData)
                                └─► Re-render with API data
```

### Founder Dashboard Data Flow
```
FounderDashboard Component Mount
  └─► useEffect(() => fetchData(), [])
       └─► apiService.getFounderDashboard()
            └─► fetch('http://localhost:8000/api/founder/dashboard')
                 └─► FastAPI: GET /api/founder/dashboard
                      └─► Returns: FOUNDER_DASHBOARD_DATA (JSON)
                           └─► setState(dashboardData)
                                └─► Render form steps dynamically
```

## Data Models

### VC Dashboard Data Structure
```json
{
  "keyMetrics": {
    "fundsDeployed": {"value": "₹285.0M", "subtext": "5.6%"},
    "cashAvailable": {"value": "₹215.0M"},
    "irr": {"value": "22.4%"},
    "tvpiDpi": {"value": "1.82"}
  },
  "portfolioHoldings": [
    {
      "name": "FinTechX",
      "stage": "Series A",
      "sector": "FinTech",
      "ownership": "12.0%",
      "moic": "1.52"
    }
  ],
  "dealflowStages": [
    {
      "name": "SOURCED",
      "count": 2,
      "deals": [...]
    }
  ]
}
```

### Founder Dashboard Data Structure
```json
{
  "completedProfileSample": {
    "companyName": "SampleCo AI",
    "readinessScore": 65,
    "metrics": {
      "mrr": "$19,791",
      "arr": "$148,651"
    }
  },
  "formSteps": [
    {
      "step": 1,
      "title": "Basic Company Information",
      "fields": [...]
    }
  ]
}
```

## CORS Configuration

```python
# FastAPI Backend CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],  # All headers allowed
)
```

## Error Handling

### Frontend Loading States
```javascript
// Loading state
if (loading) {
  return <div>Loading dashboard data...</div>;
}

// Error state
if (error) {
  return (
    <div>
      <h2>Error Loading Dashboard</h2>
      <p>{error}</p>
      <p>Make sure FastAPI is running on http://localhost:8000</p>
    </div>
  );
}

// Success state - render data
return <Dashboard data={dashboardData} />;
```

### Backend Error Responses
```python
# 401 Unauthorized
raise HTTPException(
    status_code=401, 
    detail="Invalid credentials"
)

# 404 Not Found
raise HTTPException(
    status_code=404, 
    detail="User not found"
)
```

## Performance Considerations

1. **Single API Call per Dashboard**: Each dashboard fetches all data in one request
2. **Caching**: Frontend could cache API responses to reduce backend load
3. **Loading States**: Show spinners while data loads for better UX
4. **Error Recovery**: Clear error messages help users troubleshoot

## Security Notes

⚠️ **Current Implementation (Demo)**:
- Demo credentials hardcoded
- No JWT tokens (using simple base64 encoding)
- No password hashing
- No rate limiting
- In-memory data (no persistence)

✅ **Production Requirements**:
- Implement JWT authentication
- Hash passwords with bcrypt
- Use environment variables for secrets
- Add rate limiting
- Connect to real database
- Implement HTTPS
- Add API key authentication
- Input validation and sanitization
