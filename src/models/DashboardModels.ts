export interface ARS {
  name: string;
  score: number;
  issueDomain: string;
  situationCode: string;
}

export interface BriefItem {
  entityName: string;
  impactLevel: string;
  eventType: string;
  instanceAge: number;
  probID: string;
  displayName: string;
  brainMappingURL: string;
}

export interface Runbook {
  runbookId: string;
  runbookName: string;
  executed: boolean;
}

export interface SnowInfo {
  alertNum: string;
  alertUrl: string;
  incidentNum: string;
  incidentPriority: string;
  incidentUrl: string;
}

export interface Summary {
  slack_thread_link: string;
  tenant_link: string;
  tenant_id: string;
  customer_name: string;
  summary: string;
  update_time: string;
  thread_start_time: string;
}

export interface Tenant {
  sr: boolean;
  dea: boolean;
  deaData: boolean;
  cid: string;
  tid: string;
  cName: string;
  cLive: string;

  ars: ARS[];

  brief?: BriefItem[];
  assignee?: string[];
  availableRunbooks?: Runbook[];

  snowInfo?: SnowInfo;
  summary?: Summary;

  link?: string;

  maintenancesInRedis?: boolean;
  arsMaintenanceBool?: boolean;
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
