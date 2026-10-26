import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft, RefreshCw, Plus, Download, X, Search, Check, CheckCircle2,
  DollarSign, TrendingUp, Clock, AlertCircle, HelpCircle, FileText
} from "lucide-react";
import { api, fmtInr } from "../../lib/api";

type FinanceTab =
  | "income"
  | "received"
  | "receivable"
  | "parent_dsa"
  | "fees"
  | "expenses"
  | "payable"
  | "paid"
  | "accounting";

export function GnFinance() {
  const loc = useLocation();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();

  const [showBlueNotice, setShowBlueNotice] = useState(true);
  const [showProcessFlow, setShowProcessFlow] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createIncomeOpen, setCreateIncomeOpen] = useState(false);

  // New Income form
  const [incomeForm, setIncomeForm] = useState({
    party: "ihuh",
    scheme: "Partner Onboarding Income",
    amount: "1062000",
    status: "approved"
  });

  // Table items
  const [incomeItems, setIncomeItems] = useState<any[]>([
    {
      id: 1,
      badge: "Direct Income",
      title: "Partner Onboarding Income",
      party: "ihuh",
      scheme: "Partner Onboarding Income",
      disbursed: "—",
      commission: "₹10.62 L",
      received: "—",
      status: "Approved",
      date: "14 Aug",
      receivedStatus: "Received"
    }
  ]);

  const activeTab: FinanceTab = useMemo(() => {
    if (loc.pathname === "/finance/received") return "received";
    if (loc.pathname === "/payin/receivable" || loc.pathname === "/finance/receivable") return "receivable";
    if (loc.pathname === "/finance/parent-dsa") return "parent_dsa";
    if (loc.pathname === "/finance/fees") return "fees";
    if (loc.pathname === "/payouts/payable") return "payable";
    if (loc.pathname === "/payouts/paid") return "paid";
    if (loc.pathname === "/payouts") return "expenses";
    if (loc.pathname === "/accounting") return "accounting";
    return "income";
  }, [loc.pathname]);

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      badge: "Direct Income",
      title: incomeForm.scheme,
      party: incomeForm.party,
      scheme: incomeForm.scheme,
      disbursed: "—",
      commission: fmtInr(Number(incomeForm.amount) || 0),
      received: "—",
      status: "Approved",
      date: "Today",
      receivedStatus: "Received"
    };
    setIncomeItems([newEntry, ...incomeItems]);
    setCreateIncomeOpen(false);
  };

  const filteredItems = incomeItems.filter((item) =>
    !searchTerm ||
    item.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.scheme.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4 text-slate-800 font-sans">
      {/* =========================================================================
          PAGE HEADER (Matching Screenshot 3 exactly)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => nav("/dashboard")}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Income
            </h1>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Home / <span className="text-slate-500">Income</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-4xl leading-relaxed">
            Track payin from banks, payout to partners and employees, and reconcile receipts.
          </p>
        </div>

        {/* Action Buttons Matching Screenshot 3 */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCreateIncomeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>+ Create Income</span>
          </button>

          <button
            onClick={() => alert("Exporting Income Register MIS...")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Export</span>
          </button>

          <button
            onClick={() => {}}
            className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          BLUE CALLOUT NOTICE BANNER (Matching Screenshot 3 exactly)
         ========================================================================= */}
      {showBlueNotice && (
        <div className="bg-blue-50/80 border border-blue-200/90 rounded-xl px-4 py-3 text-xs text-blue-900 leading-relaxed shadow-xs flex items-center justify-between">
          <div className="flex items-start gap-2.5">
            <span className="text-blue-600 text-sm shrink-0 mt-0.5">💡</span>
            <span>
              Auto-calculated from scheme + disbursement amount • Track gross, TDS deductions & net payable • Filter by bank, partner or date range • Split commissions between partners & sales persons
            </span>
          </div>
          <button
            onClick={() => setShowBlueNotice(false)}
            className="text-slate-400 hover:text-slate-700 shrink-0 ml-3 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* =========================================================================
          LOAN PROCESS FLOW CARD (Matching Screenshot 3 exactly)
         ========================================================================= */}
      {showProcessFlow && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="text-blue-600">⚡</span>
              <span className="uppercase tracking-wider text-[11px]">YOUR LOAN PROCESS FLOW</span>
            </div>
            <button
              onClick={() => setShowProcessFlow(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <Check size={14} className="stroke-[3]" />
              <span>Lead Capture</span>
            </div>
            <span className="text-slate-300">─────</span>

            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <Check size={14} className="stroke-[3]" />
              <span>Loan Application</span>
            </div>
            <span className="text-slate-300">─────</span>

            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <Check size={14} className="stroke-[3]" />
              <span>Sanctioned Loan</span>
            </div>
            <span className="text-slate-300">─────</span>

            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <Check size={14} className="stroke-[3]" />
              <span>Disbursement</span>
            </div>
            <span className="text-slate-300">─────</span>

            <div className="flex items-center gap-1.5 bg-blue-600 text-white font-bold px-2.5 py-1 rounded-md shadow-xs">
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">5</span>
              <span>Commission</span>
            </div>
            <span className="text-slate-300">─────</span>

            <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">6</span>
              <span>Payout</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INVOICE TREND & MONTH TIMELINE (Matching Screenshot 3 exactly)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            INVOICE TREND
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 num">
            ₹0
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            0 invoices this month · vs ₹0 (0) last
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="flex-1 max-w-md flex flex-col justify-center">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span className="font-bold text-slate-700">Aug</span>
            <span>Sept</span>
            <span>Oct</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="w-1/6 bg-transparent" />
            <div className="w-1/6 bg-transparent" />
            <div className="w-1/6 bg-transparent" />
            <div className="w-1/6 bg-slate-400 rounded-sm" />
            <div className="w-1/6 bg-transparent" />
            <div className="w-1/6 bg-transparent" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEARCH FILTER (Matching Screenshot 3 exactly)
         ========================================================================= */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, loan ref, A/C no, invoice #..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
        />
      </div>

      {/* =========================================================================
          INCOME TABLE (Matching Screenshot 3 exactly)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">LOAN REF / LEAD</th>
                <th className="px-4 py-3">BILL TO (PARTY)</th>
                <th className="px-4 py-3">SCHEME</th>
                <th className="px-4 py-3">DISBURSED</th>
                <th className="px-4 py-3">COMMISSION</th>
                <th className="px-4 py-3">RECEIVED</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">DATE</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5 space-y-1">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.badge}
                    </span>
                    <div className="text-xs font-medium text-slate-800">{item.title}</div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{item.party}</td>
                  <td className="px-4 py-3.5 italic text-slate-500">{item.scheme}</td>
                  <td className="px-4 py-3.5 text-slate-400">{item.disbursed}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900 num">{item.commission}</td>
                  <td className="px-4 py-3.5 text-slate-400">{item.received}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-[11px]">{item.date}</td>
                  <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.receivedStatus}
                    </span>
                    <button
                      onClick={() => alert(`Generating Invoice for ${item.party}...`)}
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      Invoice
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Cancel invoice for ${item.party}?`)) {
                          setIncomeItems(incomeItems.filter((i) => i.id !== item.id));
                        }
                      }}
                      className="px-2 py-1 text-slate-500 hover:text-rose-600 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Income */}
      {createIncomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setCreateIncomeOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Create Direct Income Entry</h3>
            <form onSubmit={handleCreateIncome} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Bill to Party</label>
                <input
                  required
                  value={incomeForm.party}
                  onChange={(e) => setIncomeForm({ ...incomeForm, party: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Scheme Description</label>
                <input
                  required
                  value={incomeForm.scheme}
                  onChange={(e) => setIncomeForm({ ...incomeForm, scheme: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Commission Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 num"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateIncomeOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
