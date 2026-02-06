// src/constants/ProductType.ts

export enum ProductType {
    C4C = 'c4c',
    SSP = 'ssp',
    CXAI = 'cxai',
    CCV20 = 'ccv20',
    SCV2 = 'scv2',
    ALL = 'all',
  }
  
  export const ProductTypeConfig: Record<
    ProductType,
    {
      displayName: string;
      productKey: string;
    }
  > = {
    [ProductType.CCV20]: {
      displayName: 'CCV20',
      productKey: 'marvin_payload_ccv20',
    },
    [ProductType.C4C]: {
      displayName: 'C4C',
      productKey: 'marvin_payload_c4c',
    },
    [ProductType.SSP]: {
      displayName: 'SSP',
      productKey: 'marvin_payload_ssp',
    },
    [ProductType.CXAI]: {
      displayName: 'CXAI',
      productKey: 'marvin_payload_cxai',
    },
    [ProductType.SCV2]: {
      displayName: 'SCV2',
      productKey: 'marvin_payload_scv2',
    },
    [ProductType.ALL]: {
      displayName: 'ALL',
      productKey: 'all',
    },
  };
  
  /* Helper for dropdowns */
  export const PRODUCT_TYPES = Object.values(ProductType);
  