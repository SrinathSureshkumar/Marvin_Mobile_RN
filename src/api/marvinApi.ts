import { DashboardResponse } from '../models/DashboardModels';
import { DASHBOARD_SAMPLE_DATA } from '../data/dashboardSample';
import { apiFetch } from '../services/apiClient'; 

const BASE_URL = 'http://127.0.0.1:3000';

const DASHBOARD_URL = `${BASE_URL}/api/get-payload-all-products`;

export const fetchDashboardData = async (): Promise<DashboardResponse> => {
  try {
    // ✅ USE apiFetch INSTEAD OF fetch
    const response = await apiFetch(DASHBOARD_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('⚠️ API failed, using sample data');
    return DASHBOARD_SAMPLE_DATA;
  }
};
