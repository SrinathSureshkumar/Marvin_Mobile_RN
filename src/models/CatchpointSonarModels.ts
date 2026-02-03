export interface CatchpointRegion {
    id: number;
    name: string;
  }
  
  export interface CatchpointIncident {
    asn: string;
    asnName: string;
    addressList: string[];
    destinationAddressList: string[];
    predecesorAddressList: string[];
    outageIspDestinationAsns: string[];
    regions: CatchpointRegion[];
    locations: string[];
    severityScore: number;
    startDate: string;
    endDate: string;
    ongoing: boolean;
  }
  
  export interface CatchpointSonarPayload {
    datetime: number;
    message_type: string;
    responseBody: CatchpointIncident[];
  }
  
  export interface CatchpointSonarResponse {
    message_type: string;
    responseBody: CatchpointSonarPayload;
  }
  