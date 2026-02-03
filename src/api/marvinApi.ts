import { DashboardResponse } from '../models/DashboardModels';
import { DASHBOARD_SAMPLE_DATA } from '../data/dashboardSample';
import { apiFetch } from '../services/apiClient'; 
import { CatchpointStackMapResponse } from '../models/CatchpointStackMapModels';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'ios' ? 'http://127.0.0.1:3000' : 'http://10.0.2.2:3000';

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


const STACKMAP_URL = `${BASE_URL}/api/catchpoint-stackmap`;

export const fetchCatchpointStackMap =
  async (): Promise<CatchpointStackMapResponse> => {
    try {
      const response = await apiFetch(STACKMAP_URL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('⚠️ StackMap API failed');
      throw error;
    }
  };
