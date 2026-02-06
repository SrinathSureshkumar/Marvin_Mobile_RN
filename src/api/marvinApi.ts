import { Platform } from 'react-native';
import { apiFetch } from '../services/apiClient';

import { DashboardResponse } from '../models/DashboardModels';
import { CatchpointStackMapResponse } from '../models/CatchpointStackMapModels';
import { CatchpointSonarResponse } from '../models/CatchpointSonarModels';

import {
  ProductType,
  ProductTypeConfig,
} from '../constants/ProductType';
import { DASHBOARD_SAMPLE_DATA } from '../data/dashboardSample';

const BASE_URL =
  Platform.OS === 'ios'
    ? 'http://127.0.0.1:3000'
    : 'http://10.0.2.2:3000';

/* ---------------- DASHBOARD (ALL) ---------------- */
const DASHBOARD_ALL_URL =
  `${BASE_URL}/demo/api/get-payload-all-products`;

export const fetchDashboardData = async (): Promise<DashboardResponse> => {
  try {
    const response = await apiFetch(DASHBOARD_ALL_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('⚠️ API failed, using sample data');
    return DASHBOARD_SAMPLE_DATA;
  }
};

/* ---------------- DASHBOARD (BY PRODUCT) ---------------- */
export const fetchDashboardByProduct = async (
  product: ProductType
): Promise<DashboardResponse> => {
  const productKey =
    ProductTypeConfig[product].productKey;

  const url =
    `${BASE_URL}/demo/api/get-payload-by-product-key?key=${productKey}`;

  const response = await apiFetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

/* ---------------- STACKMAP ---------------- */
const STACKMAP_URL =
  `${BASE_URL}/demo/api/catchpoint-stackmap`;

export const fetchCatchpointStackMap = async (): Promise<CatchpointStackMapResponse> => {
  const response = await apiFetch(STACKMAP_URL);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

/* ---------------- SONAR ---------------- */
const ISP_URL =
  `${BASE_URL}/demo/api/catchpoint?key=CATCHPOINT_CCV20_INTERNETWEATHER_ISPINCIDENTS`;

const SERVICE_URL =
  `${BASE_URL}/demo/api/catchpoint?key=CATCHPOINT_CCV20_INTERNETWEATHER_SERVICEINCIDENTS`;

export type SonarType = 'ISP' | 'SERVICE';

export const fetchCatchpointSonar = async (
  type: SonarType
): Promise<CatchpointSonarResponse> => {
  const url = type === 'ISP' ? ISP_URL : SERVICE_URL;

  const response = await apiFetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};
