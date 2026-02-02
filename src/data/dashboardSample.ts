import { DashboardResponse } from '../models/DashboardModels';

export const DASHBOARD_SAMPLE_DATA: DashboardResponse = {
  message_type: 'marvin_payload_all_products',
  responseBody: [
    {
      message_type: 'marvin_payload',
      datetime: Date.now(),
      responseBody: [
        {
          cid: 'US East',
          tid: 'ocas-dynatrace-p1',
          pType: 'demo-cust',
          cLive: 'Live',
          cName: 'Ocas Dynatrace',
          ars: [
            { name: 'storefront', score: 50, issueDomain: '', situationCode: '' },
            { name: 'backoffice', score: 60, issueDomain: '', situationCode: '' },
          ],
        },
      ],
    },
  ],
};
