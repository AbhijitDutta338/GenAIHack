import apiService from './apiService';

export const vcService = {
  // Get all VCs
  async getVCs() {
    return apiService.get('/vcs');
  },

  // Get VC by ID
  async getVC(id) {
    return apiService.get(`/vcs/${id}`);
  },

  // Create new VC profile
  async createVC(vcData) {
    return apiService.post('/vcs', vcData);
  },

  // Update VC profile
  async updateVC(id, vcData) {
    return apiService.put(`/vcs/${id}`, vcData);
  },

  // Get VC portfolio
  async getPortfolio(vcId) {
    return apiService.get(`/vcs/${vcId}/portfolio`);
  },

  // Get VC matches with startups
  async getMatches(vcId) {
    return apiService.get(`/vcs/${vcId}/matches`);
  }
};