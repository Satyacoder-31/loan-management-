import React, { useState } from "react";
import { ReportHeader, ExportButton, MetricTile } from "./ReportCommon";
import { PieChart, Layers, MapPin, Sparkles, Download, RefreshCw } from "lucide-react";

interface ReportCatalogueProps {
  subTab: string;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function ReportCatalogue({ subTab, onBack, onNotify }: ReportCatalogueProps) {
  const normTab = subTab.toLowerCase().replace(/_/g, "-");

  if (normTab === "category" || normTab === "loantype") {
    return <CategoryReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "product-wise" || normTab === "product_wise" || normTab === "product") {
    return <ProductWiseReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "territory") {
    return <TerritoryReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "lead-geography" || normTab === "geo") {
    return <LeadGeographyReport onBack={onBack} onNotify={onNotify} />;
  }

  return <CategoryReport onBack={onBack} onNotify={onNotify} />;
}

// ----------------------------------------------------------------------------
// 1. CATEGORY REPORT
// ----------------------------------------------------------------------------
function CategoryReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Catalogue"
        title="Category"
        description="Loan category mix: Personal, Business, Home, LAP, Used Car. Monitor product portfolio concentration."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Category Analysis CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-white tracking-tight">Category Analysis</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <MetricTile label="TOTAL CATEGORIES" value="1" subtext="active categories" />
          <MetricTile label="TOTAL LEADS" value="1" />
          <MetricTile label="CONVERSION RATE" value="0.0%" />
          <MetricTile label="TOTAL DISBURSED" value="₹0" />
          <MetricTile label="TOTAL COMMISSION" value="₹0" />
        </div>

        {/* Section: Leads by Category & Disbursed by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LEADS BY CATEGORY</div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-semibold text-slate-200">Car Loan</span>
              <span className="font-mono text-blue-600 font-bold">1</span>
            </div>
            <div className="w-full bg-[#121927] h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-full rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">DISBURSED BY CATEGORY</div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-semibold text-slate-200">Car Loan</span>
              <span className="font-mono text-emerald-600 font-bold">₹0</span>
            </div>
            <div className="w-full bg-[#121927] h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-0 rounded-full" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3 text-right">LEADS</th>
                <th className="px-4 py-3 text-right">CONV</th>
                <th className="px-4 py-3 text-right">CONV %</th>
                <th className="px-4 py-3 text-right">APPS</th>
                <th className="px-4 py-3 text-right">APPLIED</th>
                <th className="px-4 py-3 text-right">SANCTIONED</th>
                <th className="px-4 py-3 text-right">DISBURSED</th>
                <th className="px-4 py-3 text-right">AVG LOAN</th>
                <th className="px-4 py-3 text-right">COMMISSION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              <tr className="hover:bg-[#090e1a] transition-colors">
                <td className="px-4 py-3 font-bold text-white">Car Loan</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-white">1</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">0.0%</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">₹0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">₹0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">₹0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">₹0</td>
                <td className="px-4 py-3 text-right font-mono text-emerald-600 font-semibold">₹0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 2. PRODUCT-WISE REPORT
// ----------------------------------------------------------------------------
function ProductWiseReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Catalogue"
        title="Product-wise"
        description="Detailed metrics per bank product, average tickets and tenors. Discover best-performing loan schemes."
        onBack={onBack}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-white tracking-tight">Product-wise Performance</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <MetricTile label="PRODUCTS" value="0" subtext="active products" />
          <MetricTile label="TOTAL APPLICATIONS" value="0" />
          <MetricTile label="APPROVAL RATE" value="0%" />
          <MetricTile label="TOTAL DISBURSED" value="₹0" />
          <MetricTile label="AVG TICKET SIZE" value="₹0" />
        </div>

        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">PRODUCT</th>
                <th className="px-4 py-3">TYPE</th>
                <th className="px-4 py-3 text-center">APPS</th>
                <th className="px-4 py-3 text-right">APPLIED</th>
                <th className="px-4 py-3 text-right">SANCTIONED</th>
                <th className="px-4 py-3 text-right">APPROVAL %</th>
                <th className="px-4 py-3 text-right">DISBURSED</th>
                <th className="px-4 py-3 text-center">LOANS</th>
                <th className="px-4 py-3 text-right">AVG TICKET</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                  No product data for this period.
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
// 3. TERRITORY REPORT
// ----------------------------------------------------------------------------
function TerritoryReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [mode, setMode] = useState<"By State" | "By City">("By State");

  return (
    <div className="space-y-6">
      <ReportHeader
        category="Catalogue"
        title="Territory"
        description="Branch coverage, regional distribution and pin code mapping. Optimize operational reach."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Territory Sales CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-bold text-white tracking-tight">Territory-wise Sales</h2>

          {/* Toggle By State vs By City matching video */}
          <div className="flex items-center rounded-lg bg-[#0d1424] p-1 border border-[#182235] text-xs">
            {(["By State", "By City"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  mode === m ? "bg-[#090e1a] text-blue-600 shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <MetricTile label={mode === "By State" ? "TOTAL STATES" : "TOTAL CITIES"} value="1" />
          <MetricTile label="TOTAL LEADS" value="1" />
          <MetricTile label="CONVERSION RATE" value="0.0%" />
          <MetricTile label="TOTAL DISBURSED" value="₹0" />
          <MetricTile
            label="TOP TERRITORY"
            value={mode === "By State" ? "Gujarat" : "Valsad"}
            subtext="1 leads"
            color="text-blue-600"
          />
        </div>

        {/* Lead distribution & Disbursed by territory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LEAD DISTRIBUTION</div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-semibold text-slate-200">{mode === "By State" ? "Gujarat" : "Valsad"}</span>
              <span className="font-mono text-blue-600 font-bold">1</span>
            </div>
            <div className="w-full bg-[#121927] h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-full rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">DISBURSED BY TERRITORY</div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-semibold text-slate-200">{mode === "By State" ? "Gujarat" : "Valsad"}</span>
              <span className="font-mono text-emerald-600 font-bold">100%</span>
            </div>
            <div className="w-full bg-[#121927] h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full rounded-full" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">{mode === "By State" ? "STATE" : "CITY"}</th>
                <th className="px-4 py-3 text-right">LEADS</th>
                <th className="px-4 py-3 text-right">CONV</th>
                <th className="px-4 py-3 text-right">CONV %</th>
                <th className="px-4 py-3 text-right">APPS</th>
                <th className="px-4 py-3 text-right">SANCTIONED</th>
                <th className="px-4 py-3 text-right">DISBURSED</th>
                <th className="px-4 py-3 text-right">AVG LOAN</th>
                <th className="px-4 py-3 text-right">SHARE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              <tr className="hover:bg-[#090e1a] transition-colors">
                <td className="px-4 py-3 font-bold text-white">{mode === "By State" ? "Gujarat" : "Valsad"}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-white">1</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">0.0%</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">₹0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">₹0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">₹0</td>
                <td className="px-4 py-3 text-right font-mono text-blue-600 font-bold">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 4. LEAD GEOGRAPHY REPORT
// ----------------------------------------------------------------------------
function LeadGeographyReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="Catalogue"
        title="Lead Geography"
        description="Heat map of every lead in your CRM by city. Larger dots mean more leads that city. Live — refreshes every minute."
        onBack={onBack}
        actions={
          <button
            onClick={() => onNotify("Refreshed Lead Geographic Heatmap")}
            className="p-2 rounded-lg bg-[#090e1a] border border-[#1e293b] text-slate-400 hover:text-white hover:border-slate-400 transition-colors cursor-pointer shadow-sm"
            title="Refresh Map"
          >
            <RefreshCw size={14} />
          </button>
        }
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-sm font-bold text-white tracking-tight">Lead Geography</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Live Sync · 1 city active</span>
          </div>
        </div>

        {/* Map visualization matching screenshot with clean light styling */}
        <div className="relative w-full max-w-2xl mx-auto h-[480px] bg-[#070b13] rounded-2xl border border-[#182235] p-6 flex items-center justify-center overflow-hidden">
          {/* Subtle stylized India boundary SVG */}
          <svg viewBox="0 0 400 450" className="w-full h-full max-h-[440px]">
            <defs>
              <linearGradient id="indiaGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            {/* Outline path representing India map */}
            <path
              d="M 150 40 L 170 30 L 195 50 L 210 70 L 235 90 L 245 110 L 280 120 L 320 125 L 340 140 L 320 160 L 290 170 L 260 180 L 240 210 L 230 250 L 210 290 L 180 340 L 160 380 L 150 400 L 140 380 L 120 330 L 110 290 L 95 260 L 80 230 L 60 210 L 70 180 L 90 170 L 95 150 L 120 130 L 135 90 Z"
              fill="url(#indiaGradDark)"
              stroke="#334155"
              strokeWidth="1.5"
              className="drop-shadow-sm"
            />
            {/* Active marker for Valsad */}
            <g transform="translate(100, 240)" className="cursor-pointer">
              <circle cx="0" cy="0" r="18" fill="#38bdf8" fillOpacity="0.25" className="animate-ping" />
              <circle cx="0" cy="0" r="10" fill="#0284c7" />
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
              <text x="16" y="5" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                Valsad (1)
              </text>
            </g>
          </svg>

          {/* Floating detail badge */}
          <div className="absolute top-4 right-4 bg-[#090e1a]/95 backdrop-blur-md border border-[#182235] p-3.5 rounded-xl shadow-lg text-xs space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <MapPin size={13} className="text-blue-600" />
              <span>Valsad, Gujarat</span>
            </div>
            <div className="text-slate-500 text-[11px]">Active Leads: <b className="text-white">1 (100%)</b></div>
            <div className="text-slate-500 text-[11px]">Status: <b className="text-emerald-600 font-semibold">Fresh Capture</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}
