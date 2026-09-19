export const DEFAULT_INVOICE = {
  id: 'po-2025035',
  invoiceNumber: 'PO-2025035',
  invoiceDate: '2025-11-06',
  companyName: 'PAYANA OVERSEAS SOLUTIONS PVT LTD',
  title: 'INVOICE',
  currency: '₹',
  
  // Client Info
  client: {
    givenName: 'MOHAMED SHAFIQ',
    dob: '10-05-2004',
    contactNumber: '9080906300',
    idType: 'ID (Aadhaar)',
    idNumber: '704554898022',
    serviceOffered: 'VISA',
    country: 'SINGAPORE',
  },

  // Payment Details
  payment: {
    serviceFee: 50000,
    taxRate: 0,
    taxAmount: 0.00,
    totalAmount: 50000,
    previouslyPaid: 0,
    paidAmount: 50000,
    remainingAmount: 50000,
    autoCalculate: false, // allows exact custom entry or dynamic calculation
    disclaimer: 'You acknowledge and agree that this amount is strictly non-refundable under any circumstances.',
  },

  // Bank Details
  bank: {
    bankName: 'HDFC',
    branchAddress: 'Palayapalyam',
    accountName: 'Payana Overseas Solutions Pvt Ltd',
    accountNo: '50200066482470',
    ifscCode: 'HDFC0009203',
    gpay: '7806925669',
    authorizedSignatureLabel: 'Authorized Signature',
    signatoryCompany: 'Payana Overseas Solutions',
    signatureType: 'preset', // 'preset', 'drawn', 'image', 'none'
    signatureData: null,
  },

  // Company Contact Details
  companyContact: {
    badgeTitle: 'COMPANY DETAILS',
    phone: '90036 19777',
    email: 'payanaaoverseas@gmail.com',
    website: 'www.payana.com',
    address: 'Perundurai Road, Erode',
  },
};

export const BLANK_INVOICE = {
  id: '',
  invoiceNumber: `PO-${new Date().getFullYear()}${String(Math.floor(Math.random() * 900) + 100)}`,
  invoiceDate: new Date().toISOString().split('T')[0],
  companyName: 'PAYANA OVERSEAS SOLUTIONS PVT LTD',
  title: 'INVOICE',
  currency: '₹',
  
  client: {
    givenName: '',
    dob: '',
    contactNumber: '',
    idType: 'ID (Aadhaar)',
    idNumber: '',
    serviceOffered: 'VISA',
    country: '',
  },

  payment: {
    serviceFee: 0,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 0,
    previouslyPaid: 0,
    paidAmount: 0,
    remainingAmount: 0,
    autoCalculate: true,
    disclaimer: 'You acknowledge and agree that this amount is strictly non-refundable under any circumstances.',
  },

  bank: {
    bankName: 'HDFC',
    branchAddress: 'Palayapalyam',
    accountName: 'Payana Overseas Solutions Pvt Ltd',
    accountNo: '50200066482470',
    ifscCode: 'HDFC0009203',
    gpay: '7806925669',
    authorizedSignatureLabel: 'Authorized Signature',
    signatoryCompany: 'Payana Overseas Solutions',
    signatureType: 'preset',
    signatureData: null,
  },

  companyContact: {
    badgeTitle: 'COMPANY DETAILS',
    phone: '90036 19777',
    email: 'payanaaoverseas@gmail.com',
    website: 'www.payana.com',
    address: 'Perundurai Road, Erode',
  },
};
