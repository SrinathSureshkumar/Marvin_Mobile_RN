import { DashboardResponse } from '../models/DashboardModels';
import { DASHBOARD_SAMPLE_DATA } from '../data/dashboardSample';

const BASE_URL = "http://127.0.0.1:3000";
const DASHBOARD_URL = BASE_URL+"/api/get-payload-all-products";

export const fetchDashboardData = async (): Promise<DashboardResponse> => {
  try {
    const response = await fetch(DASHBOARD_URL);

    if (!response.ok) {
      throw new Error('API failed');
    }

    const json: DashboardResponse = await response.json();
    return json;
  } catch (error) {
    console.warn('API failed, using sample data');
    return DASHBOARD_SAMPLE_DATA;
  }
};
