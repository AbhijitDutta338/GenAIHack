// API Service for handling all HTTP requests to FastAPI backend
// Centralized service for all backend communication

class ApiService {
  constructor() {
    // FastAPI backend URL - defaults to localhost:8000
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ============================================================================
  // AUTHENTICATION API CALLS
  // ============================================================================

  async login(email, password) {
    // Backend expects 'username' field but accepts email or username
    return this.post('/api/auth/login', { username: email, password });
  }

  async getUser(uid) {
    return this.get(`/api/auth/user/${uid}`);
  }

  // ============================================================================
  // VC DASHBOARD API CALLS
  // ============================================================================

  async getVCDashboard() {
    return this.get('/api/vc/dashboard');
  }

  async getVCMetrics() {
    return this.get('/api/vc/metrics');
  }

  async getPortfolioSummary() {
    return this.get('/api/vc/portfolio/summary');
  }

  async getPortfolioHoldings() {
    return this.get('/api/vc/portfolio/holdings');
  }

  async getHoldingsData() {
    return this.get('/api/vc/holdings');
  }

  async getWeightedModels() {
    return this.get('/api/vc/weighted-models');
  }

  async getScoreGauges() {
    return this.get('/api/vc/score-gauges');
  }

  async getRecentAlerts() {
    return this.get('/api/vc/alerts');
  }

  async getStartupsToWatch() {
    return this.get('/api/vc/startups/watch');
  }

  async getDealflowStages() {
    return this.get('/api/vc/dealflow');
  }

  async getInvestmentThesis() {
    return this.get('/api/vc/investment-thesis');
  }

  async getModelWeights() {
    return this.get('/api/vc/model-weights');
  }

  async sourceStartupToDealFlow(startupData) {
    return this.post('/api/vc/dealflow/source', startupData);
  }

  async getDealflowStartup(startupId) {
    return this.get(`/api/vc/dealflow/startup/${startupId}`);
  }

  async generateDealNotes(startupId) {
    return this.post(`/api/vc/dealflow/startup/${startupId}/generate-notes`, {});
  }

  async ingestDocuments(startupId, documentData) {
    return this.post(`/api/vc/dealflow/startup/${startupId}/ingest-documents`, documentData);
  }

  // ============================================================================
  // FOUNDER DASHBOARD API CALLS
  // ============================================================================

  async getFounderDashboard() {
    return this.get('/api/founder/dashboard');
  }

  async getCompletedProfileSample() {
    return this.get('/api/founder/profile/sample');
  }

  async getFormSteps() {
    return this.get('/api/founder/form/steps');
  }

  async getFormStep(stepNumber) {
    return this.get(`/api/founder/form/steps/${stepNumber}`);
  }

  async getIndustryOptions() {
    return this.get('/api/founder/options/industries');
  }

  async getStageOptions() {
    return this.get('/api/founder/options/stages');
  }

  // ============================================================================
  // CATEGORIES API CALLS
  // ============================================================================

  async getCategories() {
    return this.get('/api/categories');
  }

  async getIndustries() {
    return this.get('/api/categories/industries');
  }

  async getStages() {
    return this.get('/api/categories/stages');
  }

  async getRegions() {
    return this.get('/api/categories/regions');
  }
}

export default new ApiService();