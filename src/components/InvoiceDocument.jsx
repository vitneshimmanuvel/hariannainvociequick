import React, { forwardRef } from 'react';
import payanaLogoImg from '../assets/payana-logo.png';
import workSignatureImg from '../assets/work-signature.png';
import signatureImg from '../assets/signature.png';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import { PresetSignature } from './PayanaLogo';

export const InvoiceDocument = forwardRef(function InvoiceDocument({ invoice }, ref) {
  if (!invoice) return null;

  const {
    invoiceNumber = 'PO-2025035',
    invoiceDate = '2025-11-06',
    companyName = 'PAYANA OVERSEAS SOLUTIONS PVT LTD',
    title = 'INVOICE',
    currency = '₹',
    client = {},
    payment = {},
    bank = {},
    companyContact = {},
  } = invoice;

  const getCurrencyHeader = (curr) => {
    if (!curr) return 'Amount';
    return `Amount (${curr})`;
  };

  const formatAmount = (val) => {
    if (val === undefined || val === null || val === '') return '0';
    const num = Number(val);
    if (isNaN(num)) return val;
    return num.toString();
  };

  return (
    <div className="invoice-document-wrapper">
      <div ref={ref} id="invoice-sheet" className="invoice-sheet">
        {/* Outer Solid 2.5px Black Framing Border */}
        <div className="invoice-inner-border">
          
          {/* 1. Header: Logo + Red Company Title + Underlined INVOICE + Horizontal Line */}
          <div className="header-section-wrapper">
            <div className="header-top-row">
              <img
                src={payanaLogoImg}
                alt="Payana Logo"
                className="payana-brand-logo"
              />
              <h1 className="payana-brand-name">{companyName}</h1>
            </div>
            <div className="invoice-title-row">
              <h2 className="invoice-main-title">{title}</h2>
            </div>
            {/* Solid Horizontal Line across page */}
            <div className="header-bottom-divider" />
          </div>

          {/* 2. Top Meta Row: Invoice # & Date */}
          <div className="invoice-meta-row">
            <div className="meta-left">
              <span>Invoice Number: {invoiceNumber}</span>
            </div>
            <div className="meta-right">
              <span>Date: {invoiceDate}</span>
            </div>
          </div>

          {/* 3. Client Information Section */}
          <div className="invoice-section client-section">
            <h3 className="section-title">CLIENT INFORMATION</h3>
            <div className="client-info-grid">
              <div className="info-row">
                <span className="info-label">FULL NAME</span>
                <span className="info-colon">:</span>
                <span className="info-value">{client.fullName || client.givenName || 'MOHAMED SHAFIQ'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">DATE OF BIRTH</span>
                <span className="info-colon">:</span>
                <span className="info-value">{client.dob || '10-05-2004'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">CONTACT #</span>
                <span className="info-colon">:</span>
                <span className="info-value">{client.contactNumber || '9080906300'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{client.idType || 'ID (Aadhaar)'}</span>
                <span className="info-colon">:</span>
                <span className="info-value">{client.idNumber || '704554898022'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">SERVICE OFFERED</span>
                <span className="info-colon">:</span>
                <span className="info-value">{client.serviceOffered || 'VISA'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">COUNTRY</span>
                <span className="info-colon">:</span>
                <span className="info-value">{client.country || 'SINGAPORE'}</span>
              </div>
            </div>
          </div>

          {/* 4. Payment Details Section */}
          <div className="invoice-section payment-section">
            <h3 className="section-title">PAYMENT DETAILS</h3>
            
            <table className="payment-table">
              <thead>
                <tr>
                  <th className="th-desc">Description</th>
                  <th className="th-amount">{getCurrencyHeader(currency)}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="tr-even">
                  <td>Application Fee</td>
                  <td>{currency} {formatAmount(payment.applicationFee ?? payment.serviceFee)}</td>
                </tr>
                <tr className="tr-odd">
                  <td>Tax ({payment.taxRate || 0}%)</td>
                  <td>{currency} {payment.taxAmount !== undefined ? Number(payment.taxAmount).toFixed(2) : '0.00'}</td>
                </tr>
                <tr className="total-row">
                  <td><strong>Total Amount</strong></td>
                  <td><strong>{currency} {formatAmount(payment.totalAmount)}</strong></td>
                </tr>
                <tr className="tr-even">
                  <td>Previously Paid Amount</td>
                  <td>{currency} {formatAmount(payment.previouslyPaid)}</td>
                </tr>
                <tr className="tr-odd">
                  <td>Paid Amount</td>
                  <td>{currency} {formatAmount(payment.paidAmount)}</td>
                </tr>
                <tr className="total-row">
                  <td><strong>Remaining Amount</strong></td>
                  <td><strong>{currency} {formatAmount(payment.remainingAmount)}</strong></td>
                </tr>
              </tbody>
            </table>

            {/* Disclaimer Box (Exact to image 1) */}
            <div className="disclaimer-box">
              {payment.disclaimer || 'You acknowledge and agree that this amount is strictly non-refundable under any circumstances.'}
            </div>
          </div>

          {/* 5. Footer Section: Bank Details (Left) + Multi-Pill Company Details (Right) */}
          <div className="footer-section">
            
            {/* Left Column: Bank Details & Large Signature */}
            <div className="left-footer">
              <div className="bank-details">
                <div className="bank-title">BANK DETAILS:</div>
                <div className="bank-info">Bank Name: {bank.bankName || 'HDFC'}</div>
                <div className="bank-info">Branch Address: {bank.branchAddress || 'Palayapalyam'}</div>
                <div className="bank-info">Account Name: {bank.accountName || 'Payana Overseas Solutions Pvt Ltd'}</div>
                <div className="bank-info">Account No: {bank.accountNo || '50200066482470'}</div>
                <div className="bank-info">IFSC Code: {bank.ifscCode || 'HDFC0009203'}</div>
                <div className="bank-info">GPay: {bank.gpay || '7806925669'}</div>
              </div>

              {/* Signature Section */}
              <div className="signature-section">
                <div className="signature-text">{bank.authorizedSignatureLabel || 'Authorized Signature'}</div>
                <div className="signature-img-container">
                  {bank.signatureType === 'drawn' && bank.signatureData ? (
                    <img src={bank.signatureData} alt="Signature" className="signature-img" />
                  ) : bank.signatureType === 'image' && bank.signatureData ? (
                    <img src={bank.signatureData} alt="Signature" className="signature-img" />
                  ) : bank.signatureType === 'none' ? (
                    <div className="signature-line" />
                  ) : (
                    <img
                      src={workSignatureImg || signatureImg}
                      alt="Authorized Signature"
                      className="signature-img"
                    />
                  )}
                </div>
                <div className="company-text">{bank.signatoryCompany || companyName}</div>
              </div>
            </div>

            {/* Right Column: Red Bordered Multi-Pill Company Details Card */}
            <div className="right-footer">
              <div className="company-details">
                <div className="company-title">{companyContact.badgeTitle || 'COMPANY DETAILS'}</div>
                
                <div className="company-info info-phone">
                  <span className="company-icon">
                    <Phone size={14} color="#0284C7" />
                  </span>
                  <span>{companyContact.phone || '90036 19777'}</span>
                </div>

                <div className="company-info info-mail">
                  <span className="company-icon">
                    <Mail size={14} color="#EA580C" />
                  </span>
                  <span>{companyContact.email || 'payanaaoverseas@gmail.com'}</span>
                </div>

                <div className="company-info info-globe">
                  <span className="company-icon">
                    <Globe size={14} color="#0D9488" />
                  </span>
                  <span>{companyContact.website || 'www.payana.com'}</span>
                </div>

                <div className="company-info info-location">
                  <span className="company-icon">
                    <MapPin size={14} color="#DC2626" />
                  </span>
                  <span>{companyContact.address || 'Perundurai Road, Erode'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
});
