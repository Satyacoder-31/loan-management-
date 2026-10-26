import React, { useState } from "react";
import { ReportHeader, ExportButton, MetricTile, EmptyReportBox } from "./ReportCommon";
import {
  FileText, Sparkles, TrendingUp, Users, Layers,
  IndianRupee, BarChart3, Download, Calendar, Filter
} from "lucide-react";

interface ReportManagementProps {
  subTab: string;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function ReportManagement({ subTab, onBack, onNotify }: ReportManagementProps) {
  const normTab = subTab.toLowerCase().replace(/_/g, "-");

  if (normTab === "master-deal-report" || normTab === "master-deals" || normTab === "master_deals") {
    return <MasterDealReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "headline-summary" || normTab === "headline") {
    return <HeadlineSummaryReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "monthly-performance" || normTab === "monthly_performance") {
    return <MonthlyPerformanceReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "hierarchy-summary" || normTab === "hierarchy") {
    return <HierarchySummaryReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "lender-wise" || normTab === "lender_wise") {
    return <LenderWiseReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "nr-analysis" || normTab === "nr_analysis") {
    return <NrAnalysisReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "pl-trackers" || normTab === "pnl") {
    return <PlTrackersReport onBack={onBack} onNotify={onNotify} />;
  }

  return <MasterDealReport onBack={onBack} onNotify={onNotify} />;
}

// ----------------------------------------------------------------------------
// 1. MASTER DEAL REPORT
// ----------------------------------------------------------------------------
function MasterDealReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [from, setFrom] = useState("2026-07-30");
  const [to, setTo] = useState("2026-10-21");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Management Pack"
        title="Master Deal Report"
        description="End-to-end deal ledger with all borrower and loan metadata. Complete operational audit trail."
        onBack={onBack}
        actions={<ExportButton label="Export Excel" onExport={() => onNotify("Exported Master Deal Excel file")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">FROM:</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm focus:ring-1 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-500 ml-2">TO:</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-slate-400 font-mono ml-3">0 deals</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile label="DEALS" value="0" subtext="0 deals" />
          <MetricTile label="DISBURSED" value="₹0" />
          <MetricTile label="GROSS PAY-IN" value="₹0" />
          <MetricTile label="NET RETENTION" value="₹0" />
        </div>

        <div className="rounded-lg bg-[#090e1a] border border-[#182235] p-3 text-[11px] text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-300">Calculation Note: </span>
          Net Retention = Gross Pay-in - GST - Payout - TDS (at your settings rate or the per-GST base). Business Head / Cluster Head come from each sales person&apos;s reporting manager chain and the hierarchy tags (see Settings -&gt; Roles &amp; Permissions).
        </div>

        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[1450px]">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-3 py-3">DEAL NO.</th>
                <th className="px-3 py-3">MONTH</th>
                <th className="px-3 py-3">BUSINESS HEAD</th>
                <th className="px-3 py-3">CLUSTER HEAD (CH)</th>
                <th className="px-3 py-3">SALES MANAGER (SM)</th>
                <th className="px-3 py-3">LOCATION</th>
                <th className="px-3 py-3">CUSTOMER</th>
                <th className="px-3 py-3">ASSET TYPE</th>
                <th className="px-3 py-3">NEW / USED</th>
                <th className="px-3 py-3">FINANCIER</th>
                <th className="px-3 py-3">DISBURSEMENT PROOF</th>
                <th className="px-3 py-3">LAN NUMBER</th>
                <th className="px-3 py-3">DISBURSEMENT DATE</th>
                <th className="px-3 py-3 text-right">DISBURSEMENT AMOUNT</th>
                <th className="px-3 py-3 text-center">NO. OF UNITS</th>
                <th className="px-3 py-3 text-right">IRR (%)</th>
                <th className="px-3 py-3 text-right">GROSS PAY-IN (LACS)</th>
                <th className="px-3 py-3 text-right">PAYOUT (LACS)</th>
                <th className="px-3 py-3 text-right">NET RETENTION (LACS)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={19} className="px-4 py-12 text-center text-slate-400">
                  No disbursed deals in this range.
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
// 2. HEADLINE SUMMARY REPORT
// ----------------------------------------------------------------------------
function HeadlineSummaryReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const manpowerRows = [
    { title: "Number of Sales Managers", val: "0" },
    { title: "Number of Cluster Heads", val: "0" },
    { title: "Number of Branch Head / Product Head", val: "0" },
    { title: "Number of Finance / co-ordinators (support)", val: "0" },
    { title: "Other manpower (untagged roles)", val: "1" },
    { title: "Total head count strength (closing)", val: "1", bold: true },
  ];

  const businessRows = [
    { title: "Number of active DSA / partners", val: "0" },
    { title: "Number of unique transacting channel partners", val: "0" },
    { title: "Number of unique transacting lending partners", val: "0" },
    { title: "Disbursement (Rs. Lacs)", val: "0.00" },
    { title: "Number of units disbursed", val: "0" },
    { title: "Gross pay-in amount (Rs. Lacs)", val: "0.00" },
    { title: "Gross pay-in %", val: "0.00" },
    { title: "Payout - Rs. Lacs", val: "0.00" },
    { title: "Net retention amount (gross - payout) - Rs. Lacs", val: "0.00" },
    { title: "Net retention %", val: "0.00" },
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Management Pack"
        title="Headline Summary"
        description="Executive top-line metrics, conversion ratios and year-on-year growth. Boardroom ready KPI executive summary."
        onBack={onBack}
        actions={<ExportButton label="Export Excel" onExport={() => onNotify("Exported Headline Summary Excel")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-4 max-w-3xl">
        <div className="flex items-center justify-between text-xs border-b border-[#182235] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Month:</span>
            <select className="px-2.5 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm focus:ring-1 focus:ring-blue-500">
              <option>October, 2026</option>
              <option>September, 2026</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-[#182235] overflow-hidden text-xs shadow-sm">
          <div className="bg-[#090e1a] px-4 py-2.5 font-bold text-slate-200 flex justify-between border-b border-[#182235]">
            <span>HEADLINE SUMMARY</span>
            <span className="font-mono text-blue-600 font-semibold">2026-10</span>
          </div>

          <div className="divide-y divide-[#182235]">
            {/* Manpower Section */}
            <div className="bg-[#0d1424] px-4 py-2 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
              Manpower strength (closing — as on last day)
            </div>
            {manpowerRows.map((r) => (
              <div key={r.title} className="px-4 py-2 flex justify-between hover:bg-[#090e1a] transition-colors">
                <span className={r.bold ? "font-bold text-white" : "text-slate-300"}>{r.title}</span>
                <span className={`font-mono ${r.bold ? "font-bold text-blue-600" : "text-slate-400"}`}>{r.val}</span>
              </div>
            ))}

            {/* Business Section */}
            <div className="bg-[#0d1424] px-4 py-2 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
              Business details (closing — as on last day)
            </div>
            {businessRows.map((r) => (
              <div key={r.title} className="px-4 py-2 flex justify-between hover:bg-[#090e1a] transition-colors">
                <span className="text-slate-300">{r.title}</span>
                <span className="font-mono text-slate-400">{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 pt-2">
          Headcount counts active employees whose role is tagged in Settings -&gt; Roles &amp; Permissions -&gt; Hierarchy. Untagged roles appear under &apos;Other manpower&apos;.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 3. MONTHLY PERFORMANCE REPORT
// ----------------------------------------------------------------------------
function MonthlyPerformanceReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [monthsCount, setMonthsCount] = useState("Last 6");
  const months = ["MAY 26", "JUN 26", "JUL 26", "AUG 26", "SEP 26", "OCT 26"];

  const rows = [
    { p: "Total disbursement vol", u: "Rs. Lacs" },
    { p: "No. of deals", u: "Units" },
    { p: "Avg ticket size", u: "Rs. Lacs" },
    { p: "SM business volume", u: "Rs. Lacs" },
    { p: "Number of SM", u: "Units" },
    { p: "SM productivity (disb amount)", u: "Rs. Lacs" },
    { p: "WIRR %", u: "%" },
    { p: "Total direct sourcing volume", u: "Rs. Lacs" },
    { p: "Direct sourcing %", u: "%" },
    { p: "Gross pay-in amount", u: "Rs. Lacs" },
    { p: "Gross pay-in %", u: "%" },
    { p: "Net pay-in amount", u: "Rs. Lacs" },
    { p: "Net pay-in %", u: "%" },
    { p: "Payout amount", u: "Rs. Lacs" },
    { p: "Payout %", u: "%" },
    { p: "Net retention amount", u: "Rs. Lacs" },
    { p: "Net retention %", u: "%" },
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Management Pack"
        title="Monthly Performance"
        description="Month-on-month trend analysis, seasonality and run-rates. Identify growth trajectories and momentum."
        onBack={onBack}
        actions={<ExportButton label="Export Excel" onExport={() => onNotify("Exported Monthly Performance Excel")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Months:</span>
          <select
            value={monthsCount}
            onChange={(e) => setMonthsCount(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm focus:ring-1 focus:ring-blue-500"
          >
            <option value="Last 6">Last 6</option>
            <option value="Last 12">Last 12</option>
            <option value="Last 18">Last 18</option>
            <option value="Last 24">Last 24</option>
          </select>
        </div>

        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">PARTICULARS</th>
                <th className="px-4 py-3">UNITS</th>
                {months.map((m) => (
                  <th key={m} className="px-4 py-3 text-right">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              {rows.map((r) => (
                <tr key={r.p} className="hover:bg-[#090e1a] transition-colors">
                  <td className="px-4 py-2.5 font-medium text-slate-200">{r.p}</td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">{r.u}</td>
                  {months.map((m) => (
                    <td key={m} className="px-4 py-2.5 text-right font-mono text-slate-400">0</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          SM = employees whose role is tagged &apos;Sales&apos; in the hierarchy. WIRR = disbursement weighted average of deal IRR. Direct sourcing = deals with no channel partner on the file.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 4. HIERARCHY SUMMARY REPORT
// ----------------------------------------------------------------------------
function HierarchySummaryReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [tab, setTab] = useState("Cluster-wise Head");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Management Pack"
        title="Hierarchy Summary"
        description="Branch, regional cluster and managerial unit rollups. Assess regional contribution to revenue."
        onBack={onBack}
        actions={<ExportButton label="Export Excel" onExport={() => onNotify("Exported Hierarchy Summary Excel")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#182235] pb-3">
          <div className="flex items-center gap-3">
            {["Cluster-wise Head", "Business Head-wise"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-1 text-xs font-semibold cursor-pointer transition-colors ${
                  tab === t ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Month:</span>
            <select className="px-2 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm">
              <option>October, 2026</option>
            </select>
            <select className="px-2 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm">
              <option>All business heads</option>
            </select>
            <select className="px-2 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm">
              <option>All clusters</option>
            </select>
          </div>
        </div>

        <div className="p-12 text-center text-xs text-slate-400 border border-dashed border-[#182235] rounded-xl bg-[#090e1a]/50">
          No data for this month.
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          Cluster Heads come from the reporting manager chain and the hierarchy tag on roles (Settings -&gt; Roles &amp; Permissions). Deals whose sales person has no tagged cluster head above them show under &apos;Unassigned&apos;. NR goal = sum of the Net Retention target set for the people under each head for the month.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 5. LENDER-WISE REPORT
// ----------------------------------------------------------------------------
function LenderWiseReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [from, setFrom] = useState("2026-06-30");
  const [to, setTo] = useState("2026-10-21");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Management Pack"
        title="Lender-wise"
        description="Portfolio risk distribution and sanction velocities per bank. Manage lender dependencies and diversification."
        onBack={onBack}
        actions={<ExportButton label="Export Excel" onExport={() => onNotify("Exported Lender-wise Excel")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-500">FROM:</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm"
          />
          <span className="font-semibold text-slate-500 ml-2">TO:</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm"
          />
        </div>

        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[950px]">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-3 py-3">LENDER</th>
                <th className="px-3 py-3 text-center">DEALS</th>
                <th className="px-3 py-3 text-right">DISB AMOUNT (LACS)</th>
                <th className="px-3 py-3 text-right">WIRR %</th>
                <th className="px-3 py-3 text-right">GROSS PAY-IN AMT (LACS)</th>
                <th className="px-3 py-3 text-right">GROSS PAY-IN %</th>
                <th className="px-3 py-3 text-right">NET PAY-IN AMT (LACS)</th>
                <th className="px-3 py-3 text-right">NET PAY-IN %</th>
                <th className="px-3 py-3 text-right">PAYOUT (LACS)</th>
                <th className="px-3 py-3 text-right">NET RETENTION AMT (LACS)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-slate-400">
                  No disbursed deals in this range.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          Net Pay-in = Gross Pay-in - GST. Lender is the lender / financer / alliance / partner on the deal&apos;s master record. WIRR = disbursement weighted average of deal IRR for that lender.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 6. NR ANALYSIS REPORT
// ----------------------------------------------------------------------------
function NrAnalysisReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [tab, setTab] = useState("3.11 Sales Manager metrics");

  const tabs = [
    "3.11 Sales Manager metrics",
    "3.12 NR by Grade",
    "3.13 NR by Vintage",
    "3.15 NR Head + cluster"
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Management Pack"
        title="NR Analysis"
        description="Net revenue realization yields and commission spread per loan type. Maximize margin per crore disbursed."
        onBack={onBack}
        actions={<ExportButton label="Export Excel" onExport={() => onNotify("Exported NR Analysis Excel")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#182235] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  tab === t
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Month:</span>
            <select className="px-2 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm">
              <option>October, 2026</option>
            </select>
          </div>
        </div>

        <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-[#182235] rounded-xl bg-[#090e1a]/50">
          No sales people found. Tag sales roles under Settings -&gt; Roles &amp; Permissions -&gt; Hierarchy.
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          NR per person = Net Retention of the deals disbursed in the month where they are the sales person. Grade = the grade code on the user (after designation), vintage = months since the joining date on the employee record. Net/Goal % = the Net Retention target set for that person and month (Reports -&gt; Target vs Achieved).
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 7. P&L TRACKERS REPORT
// ----------------------------------------------------------------------------
function PlTrackersReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [tab, setTab] = useState("3.12 Business Head P&L (1)");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Management Pack"
        title="P&L Trackers"
        description="Profit & loss statements for current FY with quarterly breakdown. Institutional accounting audit readiness."
        onBack={onBack}
        actions={<ExportButton label="Export Excel" onExport={() => onNotify("Exported P&L Trackers Excel")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#182235] pb-3">
          <div className="flex items-center gap-2">
            {["3.12 Business Head P&L (1)", "3.13 Cluster Head P&L (1)"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  tab === t
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Month:</span>
            <select className="px-2 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm">
              <option>October, 2026</option>
            </select>
            <select className="px-2 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm">
              <option>All business heads</option>
            </select>
          </div>
        </div>

        <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-[#182235] rounded-xl bg-[#090e1a]/50">
          No Business Heads yet — tag the roles under Settings -&gt; Roles &amp; Permissions.
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          Salary = HRMS salary slips generated for the people under each head that month. Rooster NR and Fixed Cost are type-in (amber cells, rupees) and saved per head per month. Level 1 = NR - Rooster - Salary; Level 2 = Level 1 - Fixed Cost - per BH level 1; Level 2 = Level 2 / number of BH.
        </p>
      </div>
    </div>
  );
}
