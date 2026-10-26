import React, { useState } from "react";
import { ReportHeader, ExportButton, MetricTile } from "./ReportCommon";
import { Sparkles, PieChart, TrendingUp, RefreshCw, Download, Search, AlertCircle } from "lucide-react";

interface ReportMarketingProps {
  subTab: string;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function ReportMarketing({ subTab, onBack, onNotify }: ReportMarketingProps) {
  const normTab = subTab.toLowerCase().replace(/_/g, "-");

  if (normTab === "lead-sources" || normTab === "sources") {
    return <LeadSourcesReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "campaign-performance" || normTab === "campaigns") {
    return <CampaignPerformanceReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "ad-performance" || normTab === "ads") {
    return <AdPerformanceReport onBack={onBack} onNotify={onNotify} />;
  }

  return <LeadSourcesReport onBack={onBack} onNotify={onNotify} />;
}

// ----------------------------------------------------------------------------
// 1. LEAD SOURCES REPORT
// ----------------------------------------------------------------------------
function LeadSourcesReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [period, setPeriod] = useState("Last 30 days");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Marketing"
        title="Lead Sources"
        description="Analyze which sources and campaigns drive the best conversions."
        onBack={onBack}
        timeframe={period}
        onTimeframeChange={setPeriod}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Period:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-xs text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
              <option value="Last 12 months">Last 12 months</option>
              <option value="All time">All time</option>
            </select>
          </div>
        }
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile label="TOTAL LEADS" value="1" subtext="Top source: walk in (1)" />
          <MetricTile label="CONTACTED" value="0" subtext="0% reached" />
          <MetricTile label="CONVERTED" value="0" subtext="0.0% conversion rate overall" />
          <MetricTile label="CONV. RATE" value="0.0%" subtext="Overall funnel" />
        </div>

        {/* Section 1: Source Distribution */}
        <div className="space-y-3 pt-3 border-t border-[#182235]">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Source Distribution</h3>
          <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
                <tr>
                  <th className="px-4 py-3">SOURCE</th>
                  <th className="px-4 py-3 text-right">LEADS</th>
                  <th className="px-4 py-3 text-right">%</th>
                  <th className="px-4 py-3 text-right">CONTACTED</th>
                  <th className="px-4 py-3 text-right">CONVERTED</th>
                  <th className="px-4 py-3 text-right">CONV. RATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182235]">
                <tr className="hover:bg-[#070b13] transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Walk In</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">1</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">100%</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">0</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">0</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">0.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Campaign / Source Detail Breakdown */}
        <div className="space-y-3 pt-3 border-t border-[#182235]">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Campaign / Source Detail Breakdown</h3>
          <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
                <tr>
                  <th className="px-4 py-3">CAMPAIGN / SOURCE</th>
                  <th className="px-4 py-3 text-right">LEADS</th>
                  <th className="px-4 py-3 text-right">CONVERTED</th>
                  <th className="px-4 py-3 text-right">CONV. RATE</th>
                  <th className="px-4 py-3 text-right">FUNNEL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182235]">
                <tr className="hover:bg-[#070b13] transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-200">Direct / Organic</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">1</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">0</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">0.0%</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">0.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 2. CAMPAIGN PERFORMANCE REPORT (Exact matching Frame 015 in video)
// ----------------------------------------------------------------------------
function CampaignPerformanceReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [from, setFrom] = useState("2026-07-24");
  const [to, setTo] = useState("2026-10-21");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Marketing"
        title="Campaign Performance"
        description="Ad campaigns, click-throughs, lead volume and cost per lead (CPL)."
        onBack={onBack}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="text-slate-400">📢</span>
            <span>Leads that came in between</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 text-xs shadow-sm focus:outline-none focus:border-blue-500"
            />
            <span>and</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 text-xs shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Campaign id or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-slate-300 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-500 w-48"
            />
            <button
              onClick={() => onNotify("Exported Campaign Performance CSV")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 text-xs font-semibold hover:bg-[#090e1a] shadow-sm transition-colors cursor-pointer"
            >
              <Download size={13} className="text-slate-500" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* 6 Top Metric Tiles matching video */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <MetricTile label="CAMPAIGNS" value="0" />
          <MetricTile label="LEADS" value="2" />
          <MetricTile label="LOAN FILES" value="0" />
          <MetricTile label="SANCTIONED" value="0" />
          <MetricTile label="DISBURSED" value="0" />
          <MetricTile label="DISBURSED AMOUNT" value="₹0" />
        </div>

        {/* Table matching Frame 015 */}
        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[880px]">
            <thead className="bg-[#090e1a] text-slate-400 font-bold border-b border-[#182235]">
              <tr>
                <th className="px-3.5 py-3">CAMPAIGN</th>
                <th className="px-3 py-3 text-right">LEADS</th>
                <th className="px-3 py-3 text-right">CONTACTED</th>
                <th className="px-3 py-3 text-right">INTERESTED</th>
                <th className="px-3 py-3 text-right">FILES</th>
                <th className="px-3 py-3 text-right">LOGGED</th>
                <th className="px-3 py-3 text-right">SANCTIONED</th>
                <th className="px-3 py-3 text-right">DISBURSED</th>
                <th className="px-3 py-3 text-right">LEAD &rarr; DISBURSAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              <tr className="hover:bg-[#070b13] transition-colors">
                <td className="px-3.5 py-3.5">
                  <div className="font-semibold text-white">No campaign</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Leads without a campaign id · referral, walk in</div>
                </td>
                <td className="px-3 py-3.5 text-right font-mono font-bold text-slate-200">2</td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-500">0 (0%)</td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-500">0</td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-500">0</td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-500">0</td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-500">0</td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-500">0</td>
                <td className="px-3 py-3.5 text-right font-mono text-slate-500">0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 3. AD PERFORMANCE REPORT (Exact matching Frame 021 in video)
// ----------------------------------------------------------------------------
function AdPerformanceReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [period, setPeriod] = useState("Last 30 days");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Marketing"
        title="Ad Performance"
        description="Track ROAS, cost-per-lead and campaign performance."
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNotify("Initiating Meta Ads synchronization...")}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Sync from Meta
            </button>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-xs text-slate-300 shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="This month">This month</option>
            </select>
          </div>
        }
      />

      {/* Meta sync notice box matching Frame 021 in video */}
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 leading-relaxed shadow-sm">
        No ad spend has been synced yet. Ad figures come from the Meta ad account linked when you run{" "}
        <span className="font-semibold text-amber-950">Settings &rarr; Integrations &rarr; Meta &rarr; Connect Facebook</span> (allow
        the ads permission when Facebook asks). Already connected? Press{" "}
        <span className="font-semibold text-blue-600 hover:underline cursor-pointer" onClick={() => onNotify("Syncing Meta Ads...")}>
          Sync from Meta
        </span>.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
        <MetricTile label="ROAS" value="0.0x" subtext="Revenue ₹0 on ₹0 spent" color="text-blue-600" />
        <MetricTile label="TOTAL AD SPEND" value="₹0" subtext="Last 30 days" />
        <MetricTile label="TOTAL SPEND" value="₹0" subtext="Last 30 days" />
        <MetricTile label="LEADS GENERATED" value="0" subtext="CPL ₹0" color="text-blue-600" />
        <MetricTile label="CONVERSIONS" value="0" subtext="0.0% rate" color="text-emerald-600" />
        <MetricTile label="ROAS" value="0.0x" subtext="Revenue ₹0" />
      </div>

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Campaign Breakdown</h3>
        <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-[#182235] rounded-lg">
          No ad campaign data yet. Connect Meta Ads in Settings to start tracking.
        </div>
      </div>
    </div>
  );
}
