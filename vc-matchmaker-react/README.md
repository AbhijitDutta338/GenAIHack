# VC Matchmaker React Frontend

A modern React application for connecting venture capitalists with startups. This project was migrated from Next.js and now uses a FastAPI backend for all data operations.

## Architecture

- **Frontend**: React 18 with Create React App
- **Backend**: FastAPI (Python) - Located in `../vc-matchmaker-fastapi`
- **Authentication**: Demo authentication system with localStorage
- **State Management**: React Context API

## Prerequisites

Before running this application, you need to have the FastAPI backend running:

1. Navigate to the backend directory:
   ```bash
   cd ../vc-matchmaker-fastapi
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

The backend should be running at `http://localhost:8000`

## Installation

Install the React dependencies:

```bash
npm install
```

## Running the Application

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

**Important**: Make sure the FastAPI backend is running on port 8000 before starting the React app.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Demo Credentials

### Founder Account
- Email: `founder@vcmatchmaker.com` OR Username: `founder`
- Password: `founder`

### VC Account
- Email: `admin@vcmatchmaker.com` OR Username: `admin`
- Password: `auth`

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Default API URL is `http://localhost:8000` (FastAPI backend)

## Features

### For VCs
- Dashboard with portfolio metrics
- Holdings management with P&L tracking
- Dealflow pipeline management
- Startup matching with scoring
- Investment thesis configuration
- Valuation model weight configuration

### For Founders
- Multi-step company profile creation
- Dashboard with readiness scoring
- Metrics tracking (MRR, ARR, Growth, Runway)
- Investment preferences configuration

## Project Structure

```
src/
├── components/        # Reusable React components
├── contexts/          # React Context (Auth)
├── Data/             # JSON data files (legacy, now using API)
├── lib/              # Firebase configuration (optional)
├── Pages/            # Main page components
├── services/         # API service layer
│   ├── apiService.js      # Core API client
│   ├── authService.js     # Authentication service
│   ├── startupService.js  # Startup operations
│   └── vcService.js       # VC operations
└── App.js            # Main application component
```

## API Integration

All data now flows from the FastAPI backend. The frontend makes API calls using the centralized `apiService`:

```javascript
import apiService from './services/apiService';

// Get VC dashboard data
const data = await apiService.getVCDashboard();

// Login
const response = await apiService.login(email, password);
```

## Available Scripts

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Troubleshooting

### API Connection Errors

If you see "Failed to load dashboard data" errors:

1. Verify the FastAPI backend is running:
   ```bash
   curl http://localhost:8000/health
   ```

2. Check CORS configuration in `../vc-matchmaker-fastapi/main.py`

3. Verify the `REACT_APP_API_URL` in your `.env` file

### Port Conflicts

If port 3000 is already in use, React will prompt you to use a different port. If you change the port, update the CORS configuration in the FastAPI backend to include the new port.

## Migration Notes

This application was migrated from Next.js to Create React App:
- API routes moved to FastAPI backend
- `getServerSideProps` replaced with `useEffect` and API calls
- SWR hooks replaced with standard `fetch` API
- All hardcoded data extracted to JSON and served via API

## Learn More

- [React Documentation](https://reactjs.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
