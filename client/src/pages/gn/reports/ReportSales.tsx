import React, { useState } from "react";
import { ReportHeader, ExportButton, MetricTile } from "./ReportCommon";
import {
  BarChart3, FileText, Clock, Users, Phone, MapPin, Target,
  UserCheck, Download, Search, Filter, Calendar, CheckCircle2,
  AlertCircle, ChevronDown, ArrowRight, ExternalLink
} from "lucide-react";

interface ReportSalesProps {
  subTab: string;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function ReportSales({ subTab, onBack, onNotify }: ReportSalesProps) {
  const normTab = subTab.toLowerCase().replace(/_/g, "-");

  if (normTab === "lead-analysis" || normTab === "lead_analysis") {
    return <LeadAnalysisReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "loan-pipeline" || normTab === "pipeline") {
    return <LoanPipelineReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "case-review" || normTab === "case_review" || normTab === "cases") {
    return <CaseReviewReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "rejected-case-mis" || normTab === "rejected") {
    return <RejectedCaseReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "tat-analysis" || normTab === "tat") {
    return <TatAnalysisReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "sales-person" || normTab === "agent") {
    return <SalesPersonReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "dial-report" || normTab === "dials") {
    return <DialReportView onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "client-visit-report" || normTab === "visits") {
    return <ClientVisitReportView onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "target-vs-achieved" || normTab === "target_achievement" || normTab === "target-achievement") {
    return <TargetVsAchievedReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "sales-partner" || normTab === "partner") {
    return <SalesPartnerReport onBack={onBack} onNotify={onNotify} />;
  }

  return <LeadAnalysisReport onBack={onBack} onNotify={onNotify} />;
}

// ----------------------------------------------------------------------------
// 1. LEAD ANALYSIS REPORT
// ----------------------------------------------------------------------------
function LeadAnalysisReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const statuses = [
    { name: "New", count: 1 },
    { name: "Contacted", count: 0 },
    { name: "Follow Up", count: 0 },
    { name: "Meeting Done", count: 0 },
    { name: "Not Reachable", count: 0 },
    { name: "Customer Disqualified", count: 0 },
    { name: "Document Pending", count: 0 },
    { name: "In Review", count: 0 },
    { name: "Rejected", count: 0 },
    { name: "Lead Nurtured", count: 0 },
    { name: "Lost", count: 0 },
    { name: "Inactive", count: 0 },
    { name: "Ringing", count: 0 },
    { name: "Recovablity", count: 0 }
  ];

  const handleExport = () => {
    const csv = "Metric,Value\nTotal Leads,2\nConversion Rate,0.0%\nNew Leads (30d),1\nDisbursed (30d),0\nSource: Walk In,1\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Lead_Analysis_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    onNotify("Exported Lead Analysis CSV");
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="Lead Analysis"
        description="Lead flow and turnaround time across the team."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={handleExport} />}
      />

      {/* Lead Funnel Header Section */}
      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Lead Funnel</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile label="TOTAL LEADS" value="2" subtext="- no change" />
          <MetricTile label="CONVERSION RATE" value="0.0%" subtext="0 of 2 converted" />
          <MetricTile label="NEW LEADS" value="1" subtext="in last 30 days" color="text-blue-600" />
          <MetricTile label="DISBURSED" value="0" subtext="in last 30 days" color="text-emerald-600" />
        </div>

        {/* Split grid: BY STATUS vs BY SOURCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#182235]">
          {/* Left Column: BY STATUS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">BY STATUS</h3>
            <div className="space-y-2">
              {statuses.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs py-1.5 border-b border-[#182235]">
                  <span className="text-slate-400">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-[#0d1424] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${s.count * 50}%` }} />
                    </div>
                    <span className="text-slate-300 font-mono font-medium w-4 text-right">{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: BY SOURCE */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">BY SOURCE</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs py-2 border-b border-[#182235]">
                <span className="text-slate-200 font-semibold">Walk In</span>
                <div className="flex items-center gap-3">
                  <div className="w-44 bg-[#0d1424] h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-full rounded-full" />
                  </div>
                  <span className="text-white font-mono font-bold">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 2. LOAN PIPELINE REPORT
// ----------------------------------------------------------------------------
function LoanPipelineReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const stages = [
    { stage: "Lead Captured", count: 1, applied: "₹5,00,000", sanctioned: "₹0", funnel: "100%" },
    { stage: "Document Collection", count: 1, applied: "₹5,00,000", sanctioned: "₹0", funnel: "50%" },
    { stage: "Logged In", count: 0, applied: "₹0", sanctioned: "₹0", funnel: "0%" },
    { stage: "Credit Underwriting", count: 0, applied: "₹0", sanctioned: "₹0", funnel: "0%" },
    { stage: "Sanctioned", count: 0, applied: "₹0", sanctioned: "₹0", funnel: "0%" },
    { stage: "Disbursed", count: 0, applied: "₹0", sanctioned: "₹0", funnel: "0%" },
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="Loan Pipeline"
        description="Stage / funnel metrics across stages with stuck-case alerts. Catch stuck files before they go cold."
        onBack={onBack}
        actions={
          <ExportButton
            label="Export"
            onExport={() => onNotify("Exported Loan Pipeline CSV")}
          />
        }
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Loan Application Pipeline</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile label="TOTAL APPLICATIONS" value="1" />
          <MetricTile label="TOTAL APPLIED" value="₹5,00,000" />
          <MetricTile label="ACTIVE LOANS" value="1" />
          <MetricTile label="DISBURSEMENT" value="₹0" subtext="- no change" />
        </div>

        <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">STAGE</th>
                <th className="px-4 py-3 text-center">COUNT</th>
                <th className="px-4 py-3 text-right">APPLIED AMOUNT</th>
                <th className="px-4 py-3 text-right">SANCTIONED</th>
                <th className="px-4 py-3 text-right">FUNNEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              {stages.map((st) => (
                <tr key={st.stage} className="hover:bg-[#070b13] transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-200">{st.stage}</td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-blue-600">{st.count}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">{st.applied}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">{st.sanctioned}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">{st.funnel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 3. CASE REVIEW REPORT (Exact matching Frame 001 & 005 in video)
// ----------------------------------------------------------------------------
function CaseReviewReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [from, setFrom] = useState("2026-09-21");
  const [to, setTo] = useState("2026-10-21");
  const [status, setStatus] = useState("");
  const [customer, setCustomer] = useState("");
  const [hasRun, setHasRun] = useState(false);

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="Case Review"
        description="One row per case — product, branch, initiating RO, customer, lender, the channel it was sourced through (partner firm or in-house employee), amount, login details, current status and the last remark."
        onBack={onBack}
      />

      {/* Filter Bar matching video Frame 001/005 */}
      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
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
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">CASE STATUS</label>
            <input
              type="text"
              placeholder="e.g. PD pending"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">CUSTOMER</label>
            <input
              type="text"
              placeholder="Search name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => {
              setHasRun(true);
              onNotify("Running Case Review report query...");
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer shadow-sm"
          >
            Run Report
          </button>
        </div>

        <div className="pt-2 border-t border-[#182235] flex items-center justify-between flex-wrap gap-2 text-xs">
          <button
            onClick={() => onNotify("No rows to export.")}
            className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-400 text-xs font-medium hover:bg-[#090e1a] shadow-sm transition-colors cursor-pointer"
          >
            Export to Excel (0 rows)
          </button>
          <p className="text-[11.5px] text-slate-500 max-w-2xl leading-relaxed">
            One row per case — product, branch, initiating RO, customer, lender, the channel it was sourced through (partner firm or in-house employee), amount, login details, current status and the last remark.
          </p>
        </div>
      </div>

      {/* Empty State matching video */}
      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-14 text-center text-xs text-slate-500 shadow-sm">
        No cases in this range. Adjust the filters and click Run Report.
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 4. REJECTED CASE MIS REPORT
// ----------------------------------------------------------------------------
function RejectedCaseReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [from, setFrom] = useState("2026-09-21");
  const [to, setTo] = useState("2026-10-21");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="Rejected Case MIS"
        description="One row per reject file — customer, product, bank, DSA, sales agent, amount, and inherently why it was rejected and by whom. Date filter is on rejection date."
        onBack={onBack}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">REJECTED FROM</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">REJECTED TO</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">CUSTOMER / APP NO</label>
            <input
              type="text"
              placeholder="Search name or ref"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onNotify("Refreshed Rejected Case query.")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer shadow-sm"
          >
            Run Report
          </button>
          <button
            onClick={() => onNotify("No rejected rows to export.")}
            className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-400 text-xs font-medium hover:bg-[#090e1a] shadow-sm transition-colors cursor-pointer"
          >
            Export to Excel (0 rows)
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-14 text-center text-xs text-slate-500 shadow-sm">
        No rejected cases in this range. Adjust the filters and click Run Report.
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 5. TAT ANALYSIS REPORT (Exact matching Frame 002 & 003 in video)
// ----------------------------------------------------------------------------
function TatAnalysisReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [from1, setFrom1] = useState("2025-09-21");
  const [to1, setTo1] = useState("2026-10-21");
  const [period, setPeriod] = useState("Monthly");
  const [view, setView] = useState("Report View");

  const [stage, setStage] = useState("Lead -> Application");
  const [groupBy, setGroupBy] = useState("Product");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="TAT Analysis"
        description="Time spent in each pipeline stage. Use the Pipeline TAT report below for sliced views by person, product, branch and city."
        onBack={onBack}
      />

      {/* Card 1: APPLICATION STATUS TAT TREND */}
      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">APPLICATION STATUS TAT TREND</h2>
          <ExportButton onExport={() => onNotify("Exported Status TAT Trend CSV")} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <input
            type="date"
            value={from1}
            onChange={(e) => setFrom1(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
          />
          <input
            type="date"
            value={to1}
            onChange={(e) => setTo1(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
          />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
          </select>
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="Report View">Report View</option>
            <option value="Chart View">Chart View</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#182235] text-xs text-slate-500">
          <span className="font-semibold text-slate-300">Status</span>
          <span>All Time Avg</span>
        </div>

        <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-[#182235] rounded-lg">
          No data for the selected range
        </div>
      </div>

      {/* Card 2: PIPELINE TAT — LEAD -> APPLICATION (Fixed TS1382 unescaped character) */}
      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">PIPELINE TAT — LEAD &rarr; APPLICATION</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Average days from start to end event, grouped by product, bucketed by month.</p>
          </div>
          <ExportButton onExport={() => onNotify("Exported Pipeline TAT CSV")} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">STAGE</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Lead -> Application">Lead &rarr; Application</option>
              <option value="Application -> Sanction">Application &rarr; Sanction</option>
              <option value="Sanction -> Disbursal">Sanction &rarr; Disbursal</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">GROUP BY</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Product">Product</option>
              <option value="Person">Person</option>
              <option value="Sub-product">Sub-product</option>
              <option value="City">City</option>
              <option value="Branch">Branch</option>
              <option value="Bank">Bank</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">TREND</label>
            <select className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500">
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">FROM</label>
            <input
              type="date"
              defaultValue="2025-09-21"
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">TO</label>
            <input
              type="date"
              defaultValue="2026-10-21"
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-[#182235] rounded-lg">
          No transitions in this range — try widening the date filter.
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 6. SALES PERSON REPORT (Exact matching Frame 008 in video)
// ----------------------------------------------------------------------------
function SalesPersonReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="Sales Person"
        description="Per-employee leads, conversions, revenue. See who to reward and who to coach."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Sales Person Performance CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Sales Person Performance</h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <MetricTile label="TOTAL LEADS" value="1" subtext="1 sales persons" />
          <MetricTile label="CONVERSIONS" value="0" subtext="0.0%" color="text-emerald-600" />
          <MetricTile label="CONVERSION RATE" value="0.0%" color="text-amber-600" />
          <MetricTile label="TOTAL DISBURSED" value="₹0" />
          <MetricTile label="AVG LOAN VALUE" value="₹0" />
          <MetricTile label="TOTAL COMMISSION" value="₹0" color="text-emerald-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] text-xs shadow-sm">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">DISBURSED AMOUNT BY SALES PERSON</span>
            <div className="mt-2 text-slate-200 font-bold flex justify-between items-center">
              <span>VIVEK MAHAJAN</span>
              <span className="font-mono text-slate-400 font-medium">₹0</span>
            </div>
            <div className="w-full bg-[#121927] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-600 h-full w-0" />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] text-xs shadow-sm">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">CONVERSION RATE BY SALES PERSON</span>
            <div className="mt-2 text-slate-200 font-bold flex justify-between items-center">
              <span>VIVEK MAHAJAN</span>
              <span className="font-mono text-slate-400 font-medium">0%</span>
            </div>
            <div className="w-full bg-[#121927] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full w-0" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">SALES PERSON</th>
                <th className="px-4 py-3 text-right">LEADS</th>
                <th className="px-4 py-3 text-right">CONV.</th>
                <th className="px-4 py-3 text-right">CONV %</th>
                <th className="px-4 py-3 text-right">APPS</th>
                <th className="px-4 py-3 text-right">SANCTIONED</th>
                <th className="px-4 py-3 text-right">DISBURSED</th>
                <th className="px-4 py-3 text-right">AVG LOAN</th>
                <th className="px-4 py-3 text-right">COMMISSION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              <tr className="hover:bg-[#070b13] transition-colors">
                <td className="px-4 py-3 font-mono text-slate-400">1</td>
                <td className="px-4 py-3 font-bold text-white">VIVEK MAHAJAN</td>
                <td className="px-4 py-3 text-right font-mono text-slate-300">1</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">0.0%</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">₹0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">₹0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">₹0</td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">₹0</td>
              </tr>
            </tbody>
            <tfoot className="bg-[#090e1a]/60 font-semibold text-slate-200 border-t border-[#182235]">
              <tr>
                <td className="px-4 py-2.5" colSpan={2}>Total</td>
                <td className="px-4 py-2.5 text-right font-mono">1</td>
                <td className="px-4 py-2.5 text-right font-mono">0</td>
                <td className="px-4 py-2.5 text-right font-mono">0.0%</td>
                <td className="px-4 py-2.5 text-right font-mono">0</td>
                <td className="px-4 py-2.5 text-right font-mono">₹0</td>
                <td className="px-4 py-2.5 text-right font-mono">₹0</td>
                <td className="px-4 py-2.5 text-right font-mono">₹0</td>
                <td className="px-4 py-2.5 text-right font-mono text-emerald-600">₹0</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 7. DIAL REPORT
// ----------------------------------------------------------------------------
function DialReportView({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [from, setFrom] = useState("2026-09-22");
  const [to, setTo] = useState("2026-10-21");
  const [recall, setRecall] = useState("10 min or more");
  const [salesPerson, setSalesPerson] = useState("Everyone");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="Dial Report"
        description="Call volumes, connected calls, talk time, dispositions and agent reach."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Dial Report CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
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
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">IDLE OR RECALL FOR</label>
            <select
              value={recall}
              onChange={(e) => setRecall(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="5 min or more">5 min or more</option>
              <option value="10 min or more">10 min or more</option>
              <option value="15 min or more">15 min or more</option>
              <option value="30 min or more">30 min or more</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">SALES PERSON</label>
            <select
              value={salesPerson}
              onChange={(e) => setSalesPerson(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Everyone">Everyone</option>
              <option value="Vivek Mahajan">Vivek Mahajan</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <MetricTile label="TOTAL CALLS" value="0" subtext="0 unique leads" />
        <MetricTile label="CONNECTED" value="0" subtext="0 asked for a callback" />
        <MetricTile label="CONNECTED RATE" value="0%" subtext="0 min total duration" />
        <MetricTile label="NOT CONNECTED" value="0" subtext="0 no answer" />
        <MetricTile label="TALK TIME" value="0m" subtext="0s per call avg" />
      </div>

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-14 text-center text-xs text-slate-500 shadow-sm">
        No calls tagged in this period. Calls appear here when they're made from a lead's Call button, the mobile app or the auto-dialer.
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 8. CLIENT VISIT REPORT (Exact matching Frame 010 in video)
// ----------------------------------------------------------------------------
function ClientVisitReportView({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [from, setFrom] = useState("2026-09-21");
  const [to, setTo] = useState("2026-10-21");
  const [client, setClient] = useState("");
  const [visitedBy, setVisitedBy] = useState("Everyone");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="Client Visit Report"
        description="One row per field visit logged from the mobile app — who was met, where, why, and what came of it. Location shows the address entered, or the GPS coordinates the visit was stamped with."
        onBack={onBack}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">VISITED FROM</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">VISITED TO</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">CLIENT / MOBILE</label>
            <input
              type="text"
              placeholder="Search name or phone"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">VISITED BY</label>
            <select
              value={visitedBy}
              onChange={(e) => setVisitedBy(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Everyone">Everyone</option>
              <option value="Vivek Mahajan">Vivek Mahajan</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => onNotify("Refreshed visit logs query.")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer shadow-sm"
          >
            Run Report
          </button>
        </div>

        <div className="pt-2 border-t border-[#182235] flex items-center justify-between flex-wrap gap-2 text-xs">
          <button
            onClick={() => onNotify("No visits to export.")}
            className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-400 text-xs font-medium hover:bg-[#090e1a] shadow-sm transition-colors cursor-pointer"
          >
            Export to Excel (0 rows)
          </button>
          <p className="text-[11.5px] text-slate-500 max-w-2xl leading-relaxed">
            One row per field visit logged from the mobile app — who was met, where, why, and what came of it. Location shows the address entered, or the GPS coordinates the visit was stamped with.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-14 text-center text-xs text-slate-500 shadow-sm">
        No visits logged in this range. Visits are recorded from the mobile app on a lead — open a lead and tap Log Visit.
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 9. TARGET VS ACHIEVED REPORT (Exact matching Frame 011 in video)
// ----------------------------------------------------------------------------
function TargetVsAchievedReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const months = ["MAY 26", "JUN 26", "JUL 26", "AUG 26", "SEP 26", "OCT 26"];

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="Target vs Achieved"
        description="Achieved: logins = applications assigned to the salesperson that month; disbursement & loans = disbursed loans on their applications. Targets from Masters &rarr; Team target."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Target vs Achieved CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5 text-xs flex-wrap">
            <span className="font-bold text-white">Target vs Achieved — month over month</span>
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">DSA-wise, weekly &rarr;</span>
            <select className="px-2.5 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500">
              <option>Disbursement (₹)</option>
              <option>Files Count</option>
            </select>
            <select className="px-2.5 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
            <select className="px-2.5 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 shadow-sm focus:outline-none focus:border-blue-500">
              <option>Overall (all products)</option>
              <option>Personal Loan</option>
              <option>Business Loan</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">SALESPERSON</th>
                {months.map((m) => (
                  <th key={m} className="px-4 py-3 text-right">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center text-slate-500">
                  No salespeople found. Set targets in Masters &rarr; Team target first.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11.5px] text-slate-500 pt-2 leading-relaxed">
          Achieved: logins = applications assigned to the salesperson that month; disbursement & loans = disbursed loans on their applications. Targets from Masters &rarr; Team target.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 10. SALES PARTNER REPORT
// ----------------------------------------------------------------------------
function SalesPartnerReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Sales & Pipeline"
        title="Sales Partner"
        description="DSA and connector-wise login counts, approval rates and payouts."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Sales Partner CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">Sales Partner Performance</h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <MetricTile label="TOTAL LEADS" value="1" subtext="1 sales partners" />
          <MetricTile label="CONVERSIONS" value="0" subtext="0.0%" />
          <MetricTile label="CONVERSION RATE" value="0.0%" />
          <MetricTile label="TOTAL DISBURSED" value="₹0" />
          <MetricTile label="AVG TICKET" value="₹0" />
          <MetricTile label="TOTAL COMMISSION" value="₹0" color="text-emerald-600" />
        </div>

        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[950px]">
            <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
              <tr>
                <th className="px-3.5 py-3">#</th>
                <th className="px-3.5 py-3">SALES PARTNER</th>
                <th className="px-3.5 py-3">PRODUCT</th>
                <th className="px-3.5 py-3">SALESPERSON / REPORTING</th>
                <th className="px-3.5 py-3">TYPE</th>
                <th className="px-3.5 py-3 text-right">LEADS</th>
                <th className="px-3.5 py-3 text-right">CONVERSION</th>
                <th className="px-3.5 py-3 text-right">APPLICATIONS</th>
                <th className="px-3.5 py-3 text-right">DISBURSED</th>
                <th className="px-3.5 py-3 text-right">AVG TICKET</th>
                <th className="px-3.5 py-3 text-right">COMMISSION</th>
                <th className="px-3.5 py-3 text-right">PAYOUT EXPECTED</th>
                <th className="px-3.5 py-3 text-right">PAYOUT PAID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              <tr className="hover:bg-[#070b13] transition-colors">
                <td className="px-3.5 py-3 font-mono text-slate-400">1</td>
                <td className="px-3.5 py-3 font-bold text-white">ASHISH GUPTA</td>
                <td className="px-3.5 py-3 text-slate-400">Auto Loan</td>
                <td className="px-3.5 py-3 text-slate-400">—</td>
                <td className="px-3.5 py-3">
                  <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/40 text-[10.5px] font-semibold">
                    Main DSA
                  </span>
                </td>
                <td className="px-3.5 py-3 text-right font-mono font-bold text-white">1</td>
                <td className="px-3.5 py-3 text-right font-mono text-slate-500">0%</td>
                <td className="px-3.5 py-3 text-right font-mono text-slate-500">0</td>
                <td className="px-3.5 py-3 text-right font-mono text-slate-500">₹0</td>
                <td className="px-3.5 py-3 text-right font-mono text-slate-500">₹0</td>
                <td className="px-3.5 py-3 text-right font-mono font-semibold text-emerald-600">₹0</td>
                <td className="px-3.5 py-3 text-right font-mono text-slate-500">₹0</td>
                <td className="px-3.5 py-3 text-right font-mono text-slate-500">₹0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
