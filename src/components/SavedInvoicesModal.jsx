import React, { useState, useEffect } from 'react';
import { X, Search, Trash2, ArrowRight, RefreshCw, Database, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchAllInvoicesFromNeon, deleteInvoiceFromNeon } from '../services/neonDb';

export function SavedInvoicesModal({ isOpen, onClose, onLoadInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAllInvoicesFromNeon();
      if (res.success) {
        setInvoices(res.data);
      } else {
        setError(res.error || 'Failed to load invoices');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this invoice from Neon DB?')) return;
    setDeletingId(id);
    try {
      const res = await deleteInvoiceFromNeon(id);
      if (res.success) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      } else {
        alert('Failed to delete invoice: ' + res.error);
      }
    } catch (err) {
      alert('Delete error: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    const invNum = (inv.invoice_number || '').toLowerCase();
    const client = (inv.client_name || '').toLowerCase();
    const date = (inv.invoice_date || '').toLowerCase();
    return invNum.includes(term) || client.includes(term) || date.includes(term);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Neon Cloud Database
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-normal px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Connected
                </span>
              </h3>
              <p className="text-xs text-slate-400">All stored and generated invoices in your PostgreSQL database</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              title="Refresh from Neon DB"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by invoice number, client name, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            />
          </div>
        </div>

        {/* Invoice List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {loading && invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <RefreshCw size={32} className="animate-spin text-red-500" />
              <p className="text-sm">Fetching invoices from Neon PostgreSQL...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-950/30 border border-red-800/50 rounded-xl text-center">
              <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-red-300">Database Connection Error</p>
              <p className="text-xs text-red-400/80 mt-1">{error}</p>
              <button
                onClick={loadData}
                className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-xs font-semibold rounded-lg transition"
              >
                Retry
              </button>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-14 text-slate-500">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-base font-medium text-slate-400">No saved invoices found</p>
              <p className="text-xs text-slate-500 mt-1">
                {searchTerm ? 'Try a different search query' : 'Save an invoice from the editor to view it here'}
              </p>
            </div>
          ) : (
            filteredInvoices.map((inv) => {
              const invData = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;
              const total = invData?.payment?.totalAmount || 0;
              const currency = invData?.currency || '₹';

              return (
                <div
                  key={inv.id}
                  onClick={() => {
                    onLoadInvoice(invData);
                    onClose();
                  }}
                  className="group relative bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-red-500/50 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl group-hover:scale-105 transition">
                      <FileText size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-100 text-sm tracking-wide">
                          {inv.invoice_number}
                        </span>
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {inv.invoice_date}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-200 mt-1 truncate">
                        {inv.client_name || invData?.client?.fullName || invData?.client?.givenName || 'No Client Name'}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {invData?.client?.serviceOffered ? `${invData.client.serviceOffered} • ` : ''}
                        {invData?.client?.country || ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total Amount</div>
                      <div className="text-base font-bold text-emerald-400 font-mono">
                        {currency} {Number(total).toLocaleString(currency === '₹' ? 'en-IN' : 'en-US')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(inv.id, e)}
                        disabled={deletingId === inv.id}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete from Database"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-red-600/90 group-hover:bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow transition"
                      >
                        Load <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-slate-200">{filteredInvoices.length}</strong> of{' '}
            <strong className="text-slate-200">{invoices.length}</strong> invoices
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 size={14} /> Neon DB Synced
          </span>
        </div>
      </div>
    </div>
  );
}
