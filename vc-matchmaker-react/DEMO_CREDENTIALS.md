# Demo Credentials

## Demo Users

The application comes with two pre-configured demo users for testing:

### Founder Account
- **Email/Username**: `founder@vcmatchmaker.com` or `founder`
- **Password**: `founder`
- **User Type**: Founder
- **Profile**:
  - Company: TechStartup Inc.
  - Industry: SaaS
  - Stage: Series A
  - Location: San Francisco, CA
  - Funding Goal: $5M

### VC Account
- **Email/Username**: `admin@vcmatchmaker.com` or `admin`
- **Password**: `auth`
- **User Type**: VC (Venture Capitalist)
- **Profile**:
  - Firm: Innovation Ventures
  - Focus Stage: Series A-B
  - Ticket Size: $1M - $10M
  - Industries: SaaS, FinTech, HealthTech
  - Location: Palo Alto, CA
  - AUM: $250M
  - Portfolio: 45 companies

## How to Login

1. Start the backend server:
   ```bash
   cd vc-matchmaker-fastapi
   python -m uvicorn main:app --reload --port 8000
   ```

2. Start the React frontend:
   ```bash
   cd vc-matchmaker-react
   npm start
   ```

3. Navigate to the login page and use either:
   - Email address (e.g., `founder@vcmatchmaker.com`)
   - Username (e.g., `founder`)

## Authentication Flow

The application uses a simple backend API authentication:
- All authentication is handled through the FastAPI backend
- User credentials are stored in `vc-matchmaker-fastapi/Data/users.json`
- Session is maintained via localStorage tokens
- No Firebase or external authentication service is required

## Note

This is a **demo application** with hardcoded credentials. In a production environment:
- Implement proper password hashing (bcrypt)
- Use JWT tokens with expiration
- Add refresh tokens
- Implement proper session management
- Use environment variables for sensitive data
- Add rate limiting and security headers
