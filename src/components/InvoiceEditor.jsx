import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Building2, 
  PhoneCall, 
  Sparkles, 
  FilePlus, 
  Calculator, 
  PenTool, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DEFAULT_INVOICE, BLANK_INVOICE } from '../data/defaultInvoice';

export function InvoiceEditor({ invoice, onChange, onOpenSignatureModal }) {
  const [activeSection, setActiveSection] = useState('all'); // 'all', 'client', 'payment', 'bank', 'company'

  const updateField = (path, value) => {
    const keys = path.split('.');
    const updated = JSON.parse(JSON.stringify(invoice));
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    // Handle auto calculation if enabled
    if (path.startsWith('payment.') && updated.payment.autoCalculate) {
      const fee = Number(updated.payment.serviceFee) || 0;
      const rate = Number(updated.payment.taxRate) || 0;
      const taxAmt = (fee * rate) / 100;
      const total = fee + taxAmt;
      const prevPaid = Number(updated.payment.previouslyPaid) || 0;
      const paid = Number(updated.payment.paidAmount) || 0;
      const rem = Math.max(0, total - prevPaid - paid);

      updated.payment.taxAmount = taxAmt;
      updated.payment.totalAmount = total;
      updated.payment.remainingAmount = rem;
    }

    onChange(updated);
  };

  const handleAutoCalcToggle = (checked) => {
    const updated = { ...invoice, payment: { ...invoice.payment, autoCalculate: checked } };
    if (checked) {
      const fee = Number(updated.payment.serviceFee) || 0;
      const rate = Number(updated.payment.taxRate) || 0;
      const taxAmt = (fee * rate) / 100;
      const total = fee + taxAmt;
      const prevPaid = Number(updated.payment.previouslyPaid) || 0;
      const paid = Number(updated.payment.paidAmount) || 0;
      const rem = Math.max(0, total - prevPaid - paid);

      updated.payment.taxAmount = taxAmt;
      updated.payment.totalAmount = total;
      updated.payment.remainingAmount = rem;
    }
    onChange(updated);
  };

  return (
    <div className="editor-panel flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-200">
      {/* Quick Templates Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(DEFAULT_INVOICE)}
            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition"
            title="Load the exact Mohamed Shafiq invoice from your sample"
          >
            <Sparkles size={14} /> Load Sample Invoice
          </button>
          <button
            type="button"
            onClick={() => onChange(BLANK_INVOICE)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
          >
            <FilePlus size={14} /> Blank Invoice
          </button>
        </div>

        {/* Currency & Tax Calculation Selector */}
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
            <input
              type="checkbox"
              checked={invoice.payment.autoCalculate}
              onChange={(e) => handleAutoCalcToggle(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-600 text-red-600 focus:ring-red-500"
            />
            <Calculator size={13} className="text-red-400" />
            <span>Auto Calculate Math</span>
          </label>
        </div>
      </div>

      {/* Editor Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        
        {/* Section 1: Invoice Meta & Headers */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Building2 size={14} /> Header & Invoice Info
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                value={invoice.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Document Title</label>
              <input
                type="text"
                value={invoice.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
              <input
                type="text"
                value={invoice.invoiceDate}
                onChange={(e) => updateField('invoiceDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Client Information */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <User size={14} /> Client Information
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Given Name</label>
              <input
                type="text"
                value={invoice.client.givenName}
                onChange={(e) => updateField('client.givenName', e.target.value)}
                placeholder="e.g. MOHAMED SHAFIQ"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date of Birth</label>
              <input
                type="text"
                value={invoice.client.dob}
                onChange={(e) => updateField('client.dob', e.target.value)}
                placeholder="e.g. 10-05-2004"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Contact #</label>
              <input
                type="text"
                value={invoice.client.contactNumber}
                onChange={(e) => updateField('client.contactNumber', e.target.value)}
                placeholder="e.g. 9080906300"
                className="input-field"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-400">ID Label & Value</label>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                <input
                  type="text"
                  value={invoice.client.idType}
                  onChange={(e) => updateField('client.idType', e.target.value)}
                  placeholder="Label (e.g. ID (Aadhaar))"
                  className="input-field col-span-2 text-xs"
                />
                <input
                  type="text"
                  value={invoice.client.idNumber}
                  onChange={(e) => updateField('client.idNumber', e.target.value)}
                  placeholder="ID Number"
                  className="input-field col-span-3 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Service Offered</label>
              <input
                type="text"
                value={invoice.client.serviceOffered}
                onChange={(e) => updateField('client.serviceOffered', e.target.value)}
                placeholder="e.g. VISA"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Country</label>
              <input
                type="text"
                value={invoice.client.country}
                onChange={(e) => updateField('client.country', e.target.value)}
                placeholder="e.g. SINGAPORE"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Payment Details */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CreditCard size={14} /> Payment Details
            </span>
            <span className="text-[11px] text-slate-400">Currency: {invoice.currency}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Service Fee ({invoice.currency})</label>
              <input
                type="number"
                value={invoice.payment.serviceFee}
                onChange={(e) => updateField('payment.serviceFee', e.target.value)}
                className="input-field font-mono"
              />
            </div>
            <div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={invoice.payment.taxRate}
                    onChange={(e) => updateField('payment.taxRate', e.target.value)}
                    className="input-field font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tax Amount</label>
                  <input
                    type="number"
                    value={invoice.payment.taxAmount}
                    onChange={(e) => updateField('payment.taxAmount', e.target.value)}
                    disabled={invoice.payment.autoCalculate}
                    className="input-field font-mono disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Total Amount ({invoice.currency})</label>
              <input
                type="number"
                value={invoice.payment.totalAmount}
                onChange={(e) => updateField('payment.totalAmount', e.target.value)}
                disabled={invoice.payment.autoCalculate}
                className="input-field font-mono font-bold text-emerald-400 disabled:opacity-80"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Previously Paid ({invoice.currency})</label>
              <input
                type="number"
                value={invoice.payment.previouslyPaid}
                onChange={(e) => updateField('payment.previouslyPaid', e.target.value)}
                className="input-field font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Paid Amount ({invoice.currency})</label>
              <input
                type="number"
                value={invoice.payment.paidAmount}
                onChange={(e) => updateField('payment.paidAmount', e.target.value)}
                className="input-field font-mono font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Remaining Amount ({invoice.currency})</label>
              <input
                type="number"
                value={invoice.payment.remainingAmount}
                onChange={(e) => updateField('payment.remainingAmount', e.target.value)}
                disabled={invoice.payment.autoCalculate}
                className="input-field font-mono font-bold text-sky-400 disabled:opacity-80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Disclaimer Text</label>
            <textarea
              rows={2}
              value={invoice.payment.disclaimer}
              onChange={(e) => updateField('payment.disclaimer', e.target.value)}
              className="input-field text-xs resize-none"
            />
          </div>
        </div>

        {/* Section 4: Bank Details & Signature */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Building2 size={14} /> Bank & Authorized Signature
            </span>
            <button
              type="button"
              onClick={onOpenSignatureModal}
              className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition"
            >
              <PenTool size={12} /> Change Signature
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Bank Name</label>
              <input
                type="text"
                value={invoice.bank.bankName}
                onChange={(e) => updateField('bank.bankName', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Branch Address</label>
              <input
                type="text"
                value={invoice.bank.branchAddress}
                onChange={(e) => updateField('bank.branchAddress', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Account Name</label>
              <input
                type="text"
                value={invoice.bank.accountName}
                onChange={(e) => updateField('bank.accountName', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Account No</label>
              <input
                type="text"
                value={invoice.bank.accountNo}
                onChange={(e) => updateField('bank.accountNo', e.target.value)}
                className="input-field font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">IFSC Code</label>
              <input
                type="text"
                value={invoice.bank.ifscCode}
                onChange={(e) => updateField('bank.ifscCode', e.target.value)}
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">GPay Number</label>
              <input
                type="text"
                value={invoice.bank.gpay}
                onChange={(e) => updateField('bank.gpay', e.target.value)}
                className="input-field font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Signature Label</label>
              <input
                type="text"
                value={invoice.bank.authorizedSignatureLabel}
                onChange={(e) => updateField('bank.authorizedSignatureLabel', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Signatory Entity</label>
              <input
                type="text"
                value={invoice.bank.signatoryCompany}
                onChange={(e) => updateField('bank.signatoryCompany', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Company Contact Details */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <PhoneCall size={14} /> Company Contact Badge
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
              <input
                type="text"
                value={invoice.companyContact.phone}
                onChange={(e) => updateField('companyContact.phone', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
              <input
                type="text"
                value={invoice.companyContact.email}
                onChange={(e) => updateField('companyContact.email', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Website</label>
              <input
                type="text"
                value={invoice.companyContact.website}
                onChange={(e) => updateField('companyContact.website', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Address</label>
              <input
                type="text"
                value={invoice.companyContact.address}
                onChange={(e) => updateField('companyContact.address', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
