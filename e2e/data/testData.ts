/**
 * Test data for HRPA appraisal tests
 */


export const testCredentials = {
    url:"http://192.168.72.44/NCTS-SIT/Login.aspx",
    username: 'icof-441',
    password: 'icoficof',
    verifiedUser: 'Lin Ai Juan',
  };


export const mainData = {
  specialOrderType: 'Unsold Order',
  division: 'Fatty Alcohol',
  salesEnquiryNumber: 'TestSEL',
  supplier: 'Musim Mas, PT',
  expectedFactoryLocation: 'KIM II',
  seller: 'Inter-Continental Oils & Fats Pte. Ltd.',
  buyerPONumber: 'PO98765',
  currency: 'USD',
  basis: 'CIP',
  tradedBy: 'Agus Salim',
  expectedApprovalStatus: 'Draft'
};


export const shippingData = {
  specialOrderType: 'Unsold Order',
  DeliveryMode: '20FT FCL',
  TotalNoUnit: '1',
  LoadingPortOfCountry: 'Indonesia',
  LoadingPort: 'Belawan',
  DischargePortOfCountry: 'United States of America',
  DischargePort: 'Chicago',
  FreightRemarks:"remarks -----"
};

export const shippingTCPCData = {
  specialOrderType: 'Unsold Order',
  DeliveryMode: '20FT FCL',
  TotalNoUnit: '1',
  LoadingPortOfCountry: 'Indonesia',
  LoadingPort: 'Belawan',
  DischargePortOfCountry: 'United States of America',
  DischargePort: 'Chicago',
  FreightRemarks:"remarks -----"
};


export const productDetails = {
  product: 'Mascol 24 Lauryl Myristyl Alcohol	',
  RSPOSCCSSupplyChainModel: 'Mass Balance',
  productSpecification: 'RE001-02 Rev. 3.00',
  deliveryUOM: 'MT',
  quantityUOM: '100',
  priceUOM: '100',
  MarkingRemark:"Customize remark",
  insulationType: '1 Layer Cartonboard'
}
