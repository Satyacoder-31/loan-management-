import React, { useState } from "react";
import { ReportHeader, ExportButton, MetricTile } from "./ReportCommon";
import {
  IndianRupee, CreditCard, DollarSign, TrendingUp,
  FileText, Layers, BarChart3, ChevronDown, ChevronRight,
  Download, Calendar, Search
} from "lucide-react";

interface ReportFinanceProps {
  subTab: string;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function ReportFinance({ subTab, onBack, onNotify }: ReportFinanceProps) {
  const normTab = subTab.toLowerCase().replace(/_/g, "-");

  if (normTab === "pay-in" || normTab === "commission") {
    return <PayInReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "disbursements" || normTab === "disbursement") {
    return <DisbursementsReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "receivable") {
    return <ReceivableReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "payable") {
    return <PayableReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "expense") {
    return <ExpenseReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "income") {
    return <IncomeReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "payments") {
    return <PaymentsReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "sales-net-revenue") {
    return <SalesNetRevenueReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "bank-wise" || normTab === "bank") {
    return <BankWiseReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "mis-report" || normTab === "mis") {
    return <MisReportView onBack={onBack} onNotify={onNotify} />;
  }

  return <PayInReport onBack={onBack} onNotify={onNotify} />;
}

// ----------------------------------------------------------------------------
// 1. PAY-IN (COMMISSIONS) REPORT (Exact matching Frame 018/020 in video)
// ----------------------------------------------------------------------------
function PayInReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [drillExpanded, setDrillExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="Pay-in (Commissions)"
        description="Bank payout accruals, expected commission and rate grids. Forecast gross institutional receivables."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Pay-in Commission CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Commission Summary</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <MetricTile label="TOTAL GROSS" value="₹10.62 L" subtext="1 commissions" color="text-white" />
          <MetricTile label="AVG RATE" value="0.00%" />
          <MetricTile label="RECEIVED" value="₹0" color="text-emerald-600" />
          <MetricTile label="PENDING FROM BANK" value="₹10.62 L" color="text-amber-600" />
          <MetricTile label="TOTAL PAID" value="₹0" color="text-blue-600" />
        </div>

        {/* Section 1: BY SPLIT STATUS */}
        <div className="space-y-3 pt-3 border-t border-[#182235]">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">BY SPLIT STATUS</h3>
          <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
                <tr>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3 text-center">COUNT</th>
                  <th className="px-4 py-3 text-right">GROSS</th>
                  <th className="px-4 py-3 text-right">TDS</th>
                  <th className="px-4 py-3 text-right">NET</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182235]">
                <tr className="hover:bg-[#070b13] transition-colors">
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Pending from Bank
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-200">1</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-white">₹10,62,000</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">₹0</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">₹10,62,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: DRILL-DOWN — MONTH > BANK > LOAN */}
        <div className="space-y-3 pt-3 border-t border-[#182235]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">DRILL-DOWN — MONTH &gt; BANK &gt; LOAN</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Click any row to expand. Loan rows link to the application detail page.</p>
            </div>
            <ExportButton onExport={() => onNotify("Exported Drilldown CSV")} />
          </div>

          <div className="rounded-xl border border-[#182235] p-3 text-xs bg-[#090e1a] shadow-sm">
            <div
              onClick={() => setDrillExpanded(!drillExpanded)}
              className="flex items-center justify-between cursor-pointer py-2 px-2.5 hover:bg-[#0d1424]/70 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2 font-bold text-white">
                {drillExpanded ? <ChevronDown size={14} className="text-blue-600" /> : <ChevronRight size={14} className="text-slate-500" />}
                <span>Aug 2026</span>
                <span className="text-slate-500 font-normal font-mono text-[11px]">(1 commissions · 1 banks)</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-slate-400">Gross <b className="text-white font-semibold">₹10.62 L</b></span>
                <span className="text-slate-400">Received <b className="text-white font-semibold">₹0</b></span>
              </div>
            </div>

            {drillExpanded && (
              <div className="pl-6 pt-3 space-y-2 border-t border-[#182235] mt-2">
                <div className="p-3 bg-[#090e1a] rounded-lg border border-[#182235] flex items-center justify-between shadow-sm">
                  <div>
                    <div className="font-semibold text-white">Unassigned Bank / NBFC</div>
                    <div className="text-[11px] text-slate-500">Application: APP-2026-AUG · Customer: Omkar Kulkarni</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-white">₹10,62,000</div>
                    <div className="text-[11px] text-amber-600 font-medium">Disbursed: ₹45,00,000 (Rate: 2.36%)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 2. DISBURSEMENTS REPORT (Exact matching Frame 022 in video)
// ----------------------------------------------------------------------------
function DisbursementsReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="Disbursements"
        description="Realized loan disbursals, loan accounts and lender splits. Comprehensive ledger of successful loans."
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNotify("Showing summary overview")}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Summary
            </button>
            <button
              onClick={() => onNotify("Exported Disbursed Cases MIS")}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Export Cases (MIS)
            </button>
          </div>
        }
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Disbursement Trends (last 30 days)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricTile label="TOTAL DISBURSED" value="₹0" color="text-emerald-600" />
          <MetricTile label="TOTAL LOANS" value="0" />
          <MetricTile label="AVG TICKET SIZE" value="₹0" />
        </div>

        <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">MONTH</th>
                <th className="px-4 py-3 text-center">COUNT</th>
                <th className="px-4 py-3 text-right">AMOUNT</th>
                <th className="px-4 py-3 text-right">AVG TICKET</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                  No disbursement records in this range.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 3. RECEIVABLE REPORT
// ----------------------------------------------------------------------------
function ReceivableReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [tab, setTab] = useState("Bank-wise summary");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="Receivable"
        description="Aging receivables from partner banks and parent DSAs. Collect pending brokerages without delays."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Accounts Receivable CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Accounts Receivable</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <MetricTile label="TOTAL RECEIVABLE" value="₹10.62 L" subtext="1 bills" />
          <MetricTile label="0-30 DAYS" value="₹0" />
          <MetricTile label="31-60 DAYS" value="₹0" />
          <MetricTile label="61-90 DAYS" value="₹10.62 L" subtext="1 bills" color="text-amber-600" />
          <MetricTile label="OVER 90 DAYS" value="₹0" />
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-4 border-b border-[#182235] text-xs">
          {["Bank-wise summary", "Party-wise", "DSA-wise summary", "Ledger view"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2.5 font-semibold transition-colors cursor-pointer ${
                tab === t ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Bank-wise summary" && (
          <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
                <tr>
                  <th className="px-4 py-3">BANK</th>
                  <th className="px-4 py-3 text-center">BILLS</th>
                  <th className="px-4 py-3 text-right">GROSS</th>
                  <th className="px-4 py-3 text-right">GST</th>
                  <th className="px-4 py-3 text-right">TOTAL</th>
                  <th className="px-4 py-3 text-right">OLDEST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182235]">
                <tr className="hover:bg-[#070b13] transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">Unassigned</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-blue-600">1</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-white">₹10.62 L</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">₹0</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">₹10.62 L</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-600 font-semibold">61d</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {tab === "Ledger view" && (
          <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left min-w-[850px]">
              <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
                <tr>
                  <th className="px-3.5 py-3">DATE</th>
                  <th className="px-3.5 py-3">BANK</th>
                  <th className="px-3.5 py-3">PARTY</th>
                  <th className="px-3.5 py-3">DSA CODE</th>
                  <th className="px-3.5 py-3">BORROWER</th>
                  <th className="px-3.5 py-3">APPLICATION</th>
                  <th className="px-3.5 py-3 text-right">GROSS</th>
                  <th className="px-3.5 py-3 text-right">GST</th>
                  <th className="px-3.5 py-3 text-right">TOTAL</th>
                  <th className="px-3.5 py-3 text-right">AGING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182235]">
                <tr className="hover:bg-[#070b13] transition-colors">
                  <td className="px-3.5 py-3 font-mono text-slate-500">2026-08-20</td>
                  <td className="px-3.5 py-3 font-semibold text-white">Unassigned</td>
                  <td className="px-3.5 py-3 text-slate-400">—</td>
                  <td className="px-3.5 py-3 font-mono text-blue-600 font-medium">DSA-09101</td>
                  <td className="px-3.5 py-3 text-slate-200">Omkar Kulkarni</td>
                  <td className="px-3.5 py-3 font-mono text-slate-400">APP-AUG-01</td>
                  <td className="px-3.5 py-3 text-right font-mono font-bold text-white">₹10,62,000</td>
                  <td className="px-3.5 py-3 text-right font-mono text-slate-500">₹0</td>
                  <td className="px-3.5 py-3 text-right font-mono font-bold text-emerald-600">₹10,62,000</td>
                  <td className="px-3.5 py-3 text-right font-mono text-amber-600 font-bold">61d</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {(tab === "Party-wise" || tab === "DSA-wise summary") && (
          <div className="p-10 text-center text-xs text-slate-500 border border-dashed border-[#182235] rounded-lg">
            No party-specific bills recorded.
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 4. PAYABLE REPORT
// ----------------------------------------------------------------------------
function PayableReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="Payable"
        description="Outstanding payables to connectors, staff and vendors. Settle partner commissions accurately."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Payables CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Accounts Payable</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <MetricTile label="TOTAL PAYABLE" value="₹0" subtext="0 bills" />
          <MetricTile label="COMMISSION" value="₹0" />
          <MetricTile label="SALARY" value="₹0" />
          <MetricTile label="CONVEYANCE" value="₹0" />
          <MetricTile label="OVER 90 DAYS" value="₹0" />
        </div>

        <div className="space-y-3 pt-3 border-t border-[#182235]">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">PARTY-WISE</h3>
          <div className="p-12 text-center text-xs text-slate-500 border border-[#182235] rounded-xl bg-[#090e1a]">
            No outstanding payables.
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 5. EXPENSE REPORT
// ----------------------------------------------------------------------------
function ExpenseReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="Expense"
        description="Operating overheads, server fees, verification costs and conveyance. Control administrative expenditure."
        onBack={onBack}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Expense Ledger</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile label="TOTAL EXPENSES" value="₹0" subtext="0 entries" />
          <MetricTile label="DUE (UNPAID)" value="₹0" />
          <MetricTile label="PAID" value="₹0" />
          <MetricTile label="CATEGORIES" value="0" />
        </div>

        <div className="p-12 text-center text-xs text-slate-500 border border-[#182235] rounded-xl bg-[#090e1a]">
          No expenses recorded.
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 6. INCOME REPORT
// ----------------------------------------------------------------------------
function IncomeReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="Income"
        description="Net revenue recognized across lending products and streams. Track top-line earnings growth."
        onBack={onBack}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Income - 2026-09-21 to 2026-10-21</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricTile label="TOTAL INCOME" value="₹0" subtext="0 heads" color="text-emerald-600" />
          <MetricTile label="TOTAL EXPENSES" value="₹0" />
          <MetricTile label="NET PROFIT" value="₹0" color="text-blue-600" />
        </div>

        <div className="space-y-3 pt-3 border-t border-[#182235]">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">INCOME HEADS</h3>
          <div className="p-12 text-center text-xs text-slate-500 border border-[#182235] rounded-xl bg-[#090e1a]">
            No income posted in this period.
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 7. PAYMENTS REPORT (Exact matching Frame 024 in video)
// ----------------------------------------------------------------------------
function PaymentsReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="Payments"
        description="Transaction histories, gateway fees (Razorpay) and UTR tracking. Reconcile banking settlements."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Payments CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Payments &amp; Receipts · 2026-09-21 to 2026-10-21</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricTile label="MONEY OUT (PAYMENTS)" value="₹0" subtext="0 vouchers" />
          <MetricTile label="MONEY IN (RECEIPTS)" value="₹0" subtext="0 vouchers" color="text-emerald-600" />
          <MetricTile label="NET MOVEMENT" value="₹0" color="text-blue-600" />
        </div>

        <div className="p-14 text-center text-xs text-slate-500 border border-[#182235] rounded-xl bg-[#090e1a]">
          No payment or receipt vouchers in this period.
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 8. SALES NET REVENUE REPORT
// ----------------------------------------------------------------------------
function SalesNetRevenueReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="Sales Net Revenue"
        description="Net retention margin after deducting partner splits and taxes. Measure bottom-line business profitability."
        onBack={onBack}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-200 tracking-tight">Sales Manager Net Revenue</h2>
          <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
            Net retention is pay-in - payout - GST - TDS. What the deals make. Net profit/loss starts with that net cash in, flows and indicated by subtracting loan, tax and manager costs.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-medium">Month:</span>
          <select className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500">
            <option>October, 2026</option>
            <option>September, 2026</option>
            <option>August, 2026</option>
          </select>
        </div>

        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">SALES PERSON</th>
                <th className="px-4 py-3 text-right">DIRECT</th>
                <th className="px-4 py-3 text-right">TEAM</th>
                <th className="px-4 py-3 text-right">TOTAL REV.</th>
                <th className="px-4 py-3 text-right">COMM. PAYOUT</th>
                <th className="px-4 py-3 text-right">SALARY</th>
                <th className="px-4 py-3 text-right">NET RETENTION</th>
                <th className="px-4 py-3 text-right">NET PROFIT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  No sales activity for 2026-10.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 9. BANK-WISE REPORT (Exact matching Frame 025 in video)
// ----------------------------------------------------------------------------
function BankWiseReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="Bank-wise"
        description="Lender portfolio distribution and relative commission yield. Compare bank performance and turnaround times."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Bank-wise CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Bank-wise Summary</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile label="TOTAL SANCTIONED" value="₹0" />
          <MetricTile label="TOTAL DISBURSED" value="₹0" color="text-emerald-600" />
          <MetricTile label="TOTAL PAYIN" value="₹0" color="text-blue-600" />
          <MetricTile label="PENDING FROM BANK" value="₹0" color="text-amber-600" />
        </div>

        <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">BANK</th>
                <th className="px-4 py-3 text-center">LOANS</th>
                <th className="px-4 py-3 text-right">SANCTIONED</th>
                <th className="px-4 py-3 text-right">DISBURSED</th>
                <th className="px-4 py-3 text-right">PAYIN</th>
                <th className="px-4 py-3 text-right">PAYOUT</th>
                <th className="px-4 py-3 text-right">PENDING</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center text-slate-500">
                  No bank data yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 10. MIS REPORT
// ----------------------------------------------------------------------------
function MisReportView({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [from, setFrom] = useState("2026-09-21");
  const [to, setTo] = useState("2026-10-21");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Finance"
        title="MIS Report"
        description="Master financial intelligence statement with monthly trends. Complete financial health snapshot."
        onBack={onBack}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs max-w-md">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">FROM</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">TO</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onNotify("Running MIS Financial Query...")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer shadow-sm"
          >
            Run Report
          </button>
          <button
            onClick={() => onNotify("No rows to export.")}
            className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-400 text-xs font-medium hover:bg-[#090e1a] shadow-sm transition-colors cursor-pointer"
          >
            Export to Excel (0 rows)
          </button>
        </div>

        <p className="text-[11.5px] text-slate-500 leading-relaxed pt-2 border-t border-[#182235]">
          MIS captures covering disbursement, revenue, DSA payout, TDS, aging and payout voucher details. Voucher fields (PUR/M/DIS/MIS/Mem) are blank unless captured in your accounting setup.
        </p>
      </div>

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-14 text-center text-xs text-slate-500 shadow-sm">
        No commission rows in this date range. Adjust the dates and click Run Report.
      </div>
    </div>
  );
}
