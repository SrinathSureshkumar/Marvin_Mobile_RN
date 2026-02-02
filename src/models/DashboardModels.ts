export interface ARS {
    name: string;
    score: number;
    issueDomain: string;
    situationCode: string;
  }
  
  export interface Tenant {
    cid: string;
    tid: string;
    pType: string;
    cLive: string;
    ars: ARS[];
    cName: string;
  }
  
  export interface MarvinPayload {
    message_type: string;
    datetime: number;
    responseBody: Tenant[];
  }
  
  export interface DashboardResponse {
    message_type: string;
    responseBody: MarvinPayload[];
  }
  