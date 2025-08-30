// Test data for freight charge creation test

export const testCredentials = {
  url: 'http://192.168.72.44/NCTS-SIT/Login.aspx',
  userid: 'ICOF-441',
  password: 'icoficof',
  username: 'Lin Ai Juan'
};

export const freightChargeData = {
  // Navigation
  menuName: 'Freight',
  submenuName: 'New',
  
  // Form data
  shippingTermDoorToDoor: 'Door to Door',
  shippingTermPortToPort: 'Port to Port',
  shippingTermDoorToRamp: 'Door to Ramp',
  loadingPortCountry: 'Indonesia',
  loadingPort: 'Belawan',
  placeOfLoading: 'PT Musim Mas KIM II Warehouse',
  portOfDischarge: 'Chicago',
  countryOfDestination: 'United States of America',

  deliveryMode20FT: '20FT FCL',
  deliveryMode40FT: '40FT FCL',
  deliveryModeBulk: 'Bulk',
  freightRateUomFCL: '/FCL',
  freightRateUomMT: '/MT',
  
  // Freight Details
  freightIndication: 'Actual Freight Rates',
  shippingLine: 'American President Lines',
  finalDestinationCountry: 'China',
  finalDestination: 'Sinochem Orient Shanghai Petrochemical Terminal, Shanghai',
  finalDestinationAddress: 'No. 918 Li11',
  finalDestinationFullAddress: 'Sinochem Orient Shanghai Petrochemical Terminal Co.',
  transitTime: '100',
  cargoNature: 'N/A',
  carrier: '"Oil Partners", LLC',
  generalInformation: 'General Information testing',
  currency: 'USD',
  freightRate: '500',
  freightRateValidityFrom: '01-Jan-2025',
  freightRateValidityTo: '01-Dec-2025',
  freightRateUOM: '/MT',
  freeTimeDetention: '30',
  demurrage: '10',
  freeTimeCombined: '20',
  freightRatesSubjectedTo: 'Subject to LTHC, DF & Seal Fee (if any)',

  plantsRemarks: 'Plants Remarks testing ..........................',
  shippingRemarks: 'Shipping Remarks testing............',
  marketingRemarks: 'Marketing Remarks testing..........................',
  pendingStatus: 'Pending Release',
  releasedStatus: 'Released'
};