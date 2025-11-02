import apiService from './apiService';

export const startupService = {
  // Get all startups
  async getStartups() {
    return apiService.get('/startups');
  },

  // Get startup by ID
  async getStartup(id) {
    return apiService.get(`/startups/${id}`);
  },

  // Create new startup
  async createStartup(startupData) {
    return apiService.post('/startups', startupData);
  },

  // Update startup
  async updateStartup(id, startupData) {
    return apiService.put(`/startups/${id}`, startupData);
  },

  // Delete startup
  async deleteStartup(id) {
    return apiService.delete(`/startups/${id}`);
  },

  // Get startup matches with VCs
  async getMatches(startupId) {
    return apiService.get(`/startups/${startupId}/matches`);
  }
};