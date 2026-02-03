export interface CatchpointStackMapItem {
    tenant: string;
    imageName: string;
    displayName: string;
    imageBase64: string;
    dashboardLink: string;
    lastUpdateUTC: string;
  }
  
  export interface CatchpointStackMapResponse {
    message_type: string;
    responseBody: CatchpointStackMapItem[];
  }
  