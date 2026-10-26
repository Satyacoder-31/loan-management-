import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  BarChart3, FileText, CheckCircle2, RefreshCw, Download, Calendar, Search,
  ChevronLeft, Sparkles, TrendingUp, IndianRupee, Briefcase, ChevronDown,
  Layers, UserCheck, Clock, Users, Phone, MapPin, Target, DollarSign,
  PieChart, ShieldAlert, CreditCard, ArrowRight, Eye, Filter
} from "lucide-react";
import { ReportSales } from "./reports/ReportSales";
import { ReportMarketing } from "./reports/ReportMarketing";
import { ReportFinance } from "./reports/ReportFinance";
import { ReportManagement } from "./reports/ReportManagement";
import { ReportCatalogue } from "./reports/ReportCatalogue";
import { ReportHr } from "./reports/ReportHr";

// ============================================================================
// ALL 39 REPORTS ACROSS 6 SECTIONS (Matching Teleport CRM Hub & Walkthrough)
// ============================================================================

export interface ReportItem {
  id: string;
  aliases?: string[];
  title: string;
  desc: string;
  highlight: string;
  category: "Sales & Pipeline" | "Marketing" | "Finance" | "Management Pack" | "Catalogue" | "HR";
  icon: any;
}

export const ALL_REPORTS: ReportItem[] = [
  // 1. SALES & PIPELINE (10 reports)
  {
    id: "lead-analysis",
    aliases: ["lead_analysis"],
    title: "Lead Analysis",
    desc: "Inflow, conversion, status mix, drop-offs",
    highlight: "Spot where leads leak and plug the funnel",
    category: "Sales & Pipeline",
    icon: BarChart3
  },
  {
    id: "loan-pipeline",
    aliases: ["pipeline"],
    title: "Loan Pipeline",
    desc: "Applications across stages with stuck-case alerts",
    highlight: "Catch stuck files before they go cold",
    category: "Sales & Pipeline",
    icon: FileText
  },
  {
    id: "case-review",
    aliases: ["case_review", "cases"],
    title: "Case Review",
    desc: "Per-case tracker: product, branch, RO, lender, sourcing channel, status & last remark",
    highlight: "One glance at every live case & next step",
    category: "Sales & Pipeline",
    icon: FileText
  },
  {
    id: "rejected-case-mis",
    aliases: ["rejected", "rejected_case_mis"],
    title: "Rejected Case MIS",
    desc: "Every rejected file with reason, rejected date, by whom, bank & DSA",
    highlight: "Learn why files die and cut the leakage",
    category: "Sales & Pipeline",
    icon: FileText
  },
  {
    id: "tat-analysis",
    aliases: ["tat", "tat_analysis"],
    title: "TAT Analysis",
    desc: "Time spent in each lead and loan app status",
    highlight: "Find slow stages and speed up closures",
    category: "Sales & Pipeline",
    icon: Clock
  },
  {
    id: "sales-person",
    aliases: ["agent", "sales_person"],
    title: "Sales Person",
    desc: "Per-employee leads, conversions, revenue",
    highlight: "See who to reward and who to coach",
    category: "Sales & Pipeline",
    icon: Users
  },
  {
    id: "dial-report",
    aliases: ["dials", "dial_report"],
    title: "Dial Report",
    desc: "Call volumes, connected calls, talk time, dispositions and agent reach",
    highlight: "Measure telecalling efficiency and reachability",
    category: "Sales & Pipeline",
    icon: Phone
  },
  {
    id: "client-visit-report",
    aliases: ["visits", "client_visit_report"],
    title: "Client Visit Report",
    desc: "Field visits logged, location pins, customer discussions and next actions",
    highlight: "Verify in-person customer verification and pickup",
    category: "Sales & Pipeline",
    icon: MapPin
  },
  {
    id: "target-vs-achieved",
    aliases: ["target_achievement", "target-achievement"],
    title: "Target vs Achieved",
    desc: "Monthly logins, volume and commission goals vs actual achievement",
    highlight: "Track team quota progress against targets",
    category: "Sales & Pipeline",
    icon: Target
  },
  {
    id: "sales-partner",
    aliases: ["partner", "sales_partner"],
    title: "Sales Partner",
    desc: "DSA and connector-wise login counts, approval rates and payouts",
    highlight: "Identify top producing referral channels",
    category: "Sales & Pipeline",
    icon: UserCheck
  },

  // 2. MARKETING (3 reports)
  {
    id: "lead-sources",
    aliases: ["sources", "lead_sources"],
    title: "Lead Sources",
    desc: "Inflow and conversions mapped to Meta, Google, Organic & Referrals",
    highlight: "Track customer acquisition channels and ROI",
    category: "Marketing",
    icon: PieChart
  },
  {
    id: "campaign-performance",
    aliases: ["campaigns", "campaign_performance"],
    title: "Campaign Performance",
    desc: "Ad campaigns, click-throughs, lead volume and cost per lead (CPL)",
    highlight: "Optimize ad campaigns for lowest acquisition cost",
    category: "Marketing",
    icon: TrendingUp
  },
  {
    id: "ad-performance",
    aliases: ["ads", "ad_performance"],
    title: "Ad Performance",
    desc: "Ad sets, creatives, impressions and ROAS across platforms",
    highlight: "Scale high-converting creatives",
    category: "Marketing",
    icon: Sparkles
  },

  // 3. FINANCE (10 reports)
  {
    id: "pay-in",
    aliases: ["commission", "pay_in"],
    title: "Pay-in (Commission)",
    desc: "Bank payout accruals, expected commission and rate grids",
    highlight: "Forecast gross institutional receivables",
    category: "Finance",
    icon: IndianRupee
  },
  {
    id: "disbursements",
    aliases: ["disbursement"],
    title: "Disbursements",
    desc: "Realized loan disbursals, loan accounts and lender splits",
    highlight: "Comprehensive ledger of successful loans",
    category: "Finance",
    icon: CheckCircle2
  },
  {
    id: "receivable",
    title: "Receivable",
    desc: "Aging receivables from partner banks and parent DSAs",
    highlight: "Collect pending brokerages without delays",
    category: "Finance",
    icon: DollarSign
  },
  {
    id: "payable",
    title: "Payable",
    desc: "Outstanding payables to connectors, staff and vendors",
    highlight: "Settle partner commissions accurately",
    category: "Finance",
    icon: CreditCard
  },
  {
    id: "income",
    title: "Income",
    desc: "Net revenue recognized across lending products and streams",
    highlight: "Track top-line earnings growth",
    category: "Finance",
    icon: TrendingUp
  },
  {
    id: "expense",
    title: "Expense",
    desc: "Operating overheads, server fees, verification costs and conveyance",
    highlight: "Control administrative expenditure",
    category: "Finance",
    icon: FileText
  },
  {
    id: "payments",
    title: "Payments",
    desc: "Transaction histories, gateway fees (Razorpay) and UTR tracking",
    highlight: "Reconcile banking settlements",
    category: "Finance",
    icon: CreditCard
  },
  {
    id: "sales-net-revenue",
    aliases: ["sales_net_revenue"],
    title: "Sales Net Revenue",
    desc: "Net retention margin after deducting partner splits and taxes",
    highlight: "Measure bottom-line business profitability",
    category: "Finance",
    icon: IndianRupee
  },
  {
    id: "bank-wise",
    aliases: ["bank", "bank_wise"],
    title: "Bank-wise",
    desc: "Lender portfolio distribution and relative commission yield",
    highlight: "Compare bank performance and turnaround times",
    category: "Finance",
    icon: Layers
  },
  {
    id: "mis-report",
    aliases: ["mis", "mis_report"],
    title: "MIS Report",
    desc: "Master financial intelligence statement with monthly trends",
    highlight: "Complete financial health snapshot",
    category: "Finance",
    icon: BarChart3
  },

  // 4. MANAGEMENT PACK (7 reports)
  {
    id: "master-deal-report",
    aliases: ["master_deals", "master-deals"],
    title: "Master Deal Report",
    desc: "End-to-end deal ledger with all borrower and loan metadata",
    highlight: "Complete operational audit trail",
    category: "Management Pack",
    icon: FileText
  },
  {
    id: "headline-summary",
    aliases: ["headline", "headline_summary"],
    title: "Headline Summary",
    desc: "Executive top-line metrics, conversion ratios and year-on-year growth",
    highlight: "Boardroom ready KPI executive summary",
    category: "Management Pack",
    icon: Sparkles
  },
  {
    id: "monthly-performance",
    aliases: ["monthly_performance"],
    title: "Monthly Performance",
    desc: "Month-on-month trend analysis, seasonality and run-rates",
    highlight: "Identify growth trajectories and momentum",
    category: "Management Pack",
    icon: TrendingUp
  },
  {
    id: "hierarchy-summary",
    aliases: ["hierarchy", "hierarchy_summary"],
    title: "Hierarchy Summary",
    desc: "Branch, regional cluster and managerial unit rollups",
    highlight: "Assess regional contribution to revenue",
    category: "Management Pack",
    icon: Users
  },
  {
    id: "lender-wise",
    aliases: ["lender_wise"],
    title: "Lender-wise",
    desc: "Portfolio risk distribution and sanction velocities per bank",
    highlight: "Manage lender dependencies and diversification",
    category: "Management Pack",
    icon: Layers
  },
  {
    id: "nr-analysis",
    aliases: ["nr_analysis"],
    title: "NR Analysis",
    desc: "Net revenue realization yields and commission spread per loan type",
    highlight: "Maximize margin per crore disbursed",
    category: "Management Pack",
    icon: IndianRupee
  },
  {
    id: "pl-trackers",
    aliases: ["pnl", "pl_trackers"],
    title: "P&L Trackers",
    desc: "Profit & loss statements for current FY with quarterly breakdown",
    highlight: "Institutional accounting audit readiness",
    category: "Management Pack",
    icon: BarChart3
  },

  // 5. CATALOGUE (4 reports)
  {
    id: "category",
    aliases: ["loantype"],
    title: "Category",
    desc: "Loan category mix: Personal, Business, Home, LAP, Used Car",
    highlight: "Monitor product portfolio concentration",
    category: "Catalogue",
    icon: PieChart
  },
  {
    id: "product-wise",
    aliases: ["product_wise", "product"],
    title: "Product-wise",
    desc: "Detailed metrics per bank product, average tickets and tenors",
    highlight: "Discover best-performing loan schemes",
    category: "Catalogue",
    icon: Layers
  },
  {
    id: "territory",
    title: "Territory",
    desc: "Branch coverage, regional distribution and pin code mapping",
    highlight: "Optimize operational reach",
    category: "Catalogue",
    icon: MapPin
  },
  {
    id: "lead-geography",
    aliases: ["geo", "lead_geography"],
    title: "Lead Geography",
    desc: "Heat map of every lead in your CRM by city. Live — refreshes every minute",
    highlight: "Target underserved geographic pockets",
    category: "Catalogue",
    icon: MapPin
  },

  // 6. HR (5 reports)
  {
    id: "attendance",
    aliases: ["hr_attendance", "hr-attendance"],
    title: "Attendance",
    desc: "Daily check-ins, punch timings, late marks and hours logged",
    highlight: "Ensure punctuality and shift adherence",
    category: "HR",
    icon: Clock
  },
  {
    id: "attendance-ledger",
    aliases: ["attendance_ledger", "hr_attendance_ledger"],
    title: "Attendance Ledger",
    desc: "Monthly employee muster roll, present days and deductions",
    highlight: "Streamline monthly payroll processing",
    category: "HR",
    icon: FileText
  },
  {
    id: "leaves",
    aliases: ["hr_leaves", "hr-leaves"],
    title: "Leaves",
    desc: "Casual, sick, earned leave balances and leaves consumed",
    highlight: "Maintain statutory leave compliance",
    category: "HR",
    icon: Calendar
  },
  {
    id: "salary",
    aliases: ["hr_salary", "hr-salary"],
    title: "Salary",
    desc: "CTC breakups, gross salaries, PF/PT deductions and net pay",
    highlight: "Accurate monthly staff remuneration",
    category: "HR",
    icon: IndianRupee
  },
  {
    id: "conveyance",
    aliases: ["hr_conveyance", "hr-conveyance"],
    title: "Conveyance",
    desc: "Field kilometer logs, fuel claims and travel reimbursements",
    highlight: "Validate field visit claims against GPS",
    category: "HR",
    icon: MapPin
  }
];

export function GnReports() {
  const [params, setParams] = useSearchParams();
  const currentTab = params.get("tab") || "";
  const [timeframe, setTimeframe] = useState("30 days");
  const [search, setSearch] = useState("");
  const [timeframeOpen, setTimeframeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Find active report item by id, alias, or title
  const activeReport = useMemo(() => {
    if (!currentTab) return null;
    const tabLower = currentTab.toLowerCase().replace(/_/g, "-");
    return ALL_REPORTS.find(
      (r) =>
        r.id === tabLower ||
        r.id === currentTab ||
        r.aliases?.includes(currentTab) ||
        r.aliases?.includes(tabLower) ||
        r.title.toLowerCase() === currentTab.toLowerCase()
    );
  }, [currentTab]);

  const filteredReports = useMemo(() => {
    if (!search.trim()) return ALL_REPORTS;
    const q = search.toLowerCase();
    return ALL_REPORTS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.highlight.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [search]);

  const salesReports = filteredReports.filter((r) => r.category === "Sales & Pipeline");
  const marketingReports = filteredReports.filter((r) => r.category === "Marketing");
  const financeReports = filteredReports.filter((r) => r.category === "Finance");
  const mgmtReports = filteredReports.filter((r) => r.category === "Management Pack");
  const catalogueReports = filteredReports.filter((r) => r.category === "Catalogue");
  const hrReports = filteredReports.filter((r) => r.category === "HR");

  return (
    <div className="min-h-full bg-[#090d16] text-slate-100 p-4 md:p-6 space-y-6 relative font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-xl shadow-blue-500/40 border border-blue-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* VIEW 1: MAIN REPORTS HUB (When no specific report is selected) */}
      {!activeReport ? (
        <div className="space-y-6 max-w-[1560px] mx-auto">
          {/* Header & Controls matching SNIPER Dark Theme */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mb-1">
                <span className="hover:text-blue-400 cursor-pointer">Home</span>
                <span>/</span>
                <span className="text-slate-200 font-semibold">Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Reports
                </h1>
                <span
                  className="w-5 h-5 rounded-full border border-slate-600 text-slate-400 flex items-center justify-center text-[11px] cursor-pointer hover:border-slate-400 hover:text-slate-200"
                  title="Pre-built Reports"
                >
                  ⓘ
                </span>
              </div>
              <p className="text-[13px] text-slate-400 mt-1">
                Pre-built reports across sales, marketing, finance, catalogue and HR.
              </p>
            </div>

            {/* Reload Button */}
            <button
              onClick={() => showToast("Refreshed all 39 reporting datasets.")}
              className="p-2 rounded-xl bg-[#0d1322] border border-[#1e293b] text-slate-400 hover:text-white hover:bg-[#152033] transition-colors cursor-pointer"
              title="Refresh Reports"
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Timeframe selector dropdown */}
          <div className="relative inline-block">
            <button
              onClick={() => setTimeframeOpen(!timeframeOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1322] border border-[#1e293b] text-slate-200 text-xs font-semibold hover:border-blue-500/40 transition-colors cursor-pointer"
            >
              <Calendar size={13} className="text-slate-400" />
              <span>{timeframe}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {timeframeOpen && (
              <div className="absolute left-0 mt-1 w-44 rounded-xl bg-[#0c1220] border border-[#1e293b] shadow-2xl py-1 z-30 text-xs">
                {["7 days", "30 days", "90 days", "1 year", "Custom range..."].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setTimeframeOpen(false);
                      showToast(`Reports timeframe set to ${tf}`);
                    }}
                    className={`w-full text-left px-3 py-2 transition-colors cursor-pointer ${
                      timeframe === tf ? "bg-blue-600/20 text-blue-400 font-semibold" : "text-slate-300 hover:bg-[#152033]"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Top 4 KPI Tiles in sleek dark styling */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0c1220] border border-[#1e293b] flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL REPORTS</span>
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <FileText size={15} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">39</div>
                <div className="text-[11px] text-slate-400 mt-0.5">6 sections</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1220] border border-[#1e293b] flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FINANCE</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <IndianRupee size={15} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">10</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Commission, MIS, disbursal</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1220] border border-[#1e293b] flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">HR</span>
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Briefcase size={15} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Attendance, leaves, salary</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1220] border border-[#1e293b] flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ACTIVE WINDOW</span>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Calendar size={15} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">30d</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Default for time-bound reports</div>
              </div>
            </div>
          </div>

          {/* Search Bar for 39 Reports */}
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0c1220] border border-[#1e293b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* 1. SALES & PIPELINE SECTION */}
          {salesReports.length > 0 && (
            <div className="space-y-3 pt-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Sales &amp; Pipeline</h2>
                <p className="text-[12px] text-slate-400">Lead funnel, conversion, and turnaround time across the team.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {salesReports.map((r) => (
                  <ReportCard key={r.id} report={r} onClick={() => setParams({ tab: r.id })} />
                ))}
              </div>
            </div>
          )}

          {/* 2. MARKETING SECTION */}
          {marketingReports.length > 0 && (
            <div className="space-y-3 pt-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Marketing</h2>
                <p className="text-[12px] text-slate-400">Sources, campaigns, ROAS, click costs and ad set ROI.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {marketingReports.map((r) => (
                  <ReportCard key={r.id} report={r} onClick={() => setParams({ tab: r.id })} />
                ))}
              </div>
            </div>
          )}

          {/* 3. FINANCE SECTION */}
          {financeReports.length > 0 && (
            <div className="space-y-3 pt-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Finance</h2>
                <p className="text-[12px] text-slate-400">Pay-in accruals, lender disbursements, receivables and net cash flows.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {financeReports.map((r) => (
                  <ReportCard key={r.id} report={r} onClick={() => setParams({ tab: r.id })} />
                ))}
              </div>
            </div>
          )}

          {/* 4. MANAGEMENT PACK SECTION */}
          {mgmtReports.length > 0 && (
            <div className="space-y-3 pt-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Management Pack</h2>
                <p className="text-[12px] text-slate-400">Executive dashboards, executive summaries and P&amp;L statements.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {mgmtReports.map((r) => (
                  <ReportCard key={r.id} report={r} onClick={() => setParams({ tab: r.id })} />
                ))}
              </div>
            </div>
          )}

          {/* 5. CATALOGUE SECTION */}
          {catalogueReports.length > 0 && (
            <div className="space-y-3 pt-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Catalogue</h2>
                <p className="text-[12px] text-slate-400">Products, loan categories, branch serviceability and geography.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {catalogueReports.map((r) => (
                  <ReportCard key={r.id} report={r} onClick={() => setParams({ tab: r.id })} />
                ))}
              </div>
            </div>
          )}

          {/* 6. HR SECTION */}
          {hrReports.length > 0 && (
            <div className="space-y-3 pt-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">HR</h2>
                <p className="text-[12px] text-slate-400">Staff muster rolls, punch attendance, leaves and monthly payroll.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {hrReports.map((r) => (
                  <ReportCard key={r.id} report={r} onClick={() => setParams({ tab: r.id })} />
                ))}
              </div>
            </div>
          )}

          {/* Floating Action Button */}
          <button
            onClick={() => showToast("Report Intelligence Navigator active.")}
            className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 transition-all cursor-pointer z-40"
            title="Reports Assist"
          >
            <Sparkles size={18} />
          </button>
        </div>
      ) : (
        /* VIEW 2: DEDICATED REPORT DATA VIEW */
        <div className="max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {activeReport.category === "Sales & Pipeline" && (
            <ReportSales subTab={currentTab} onBack={() => setParams({})} onNotify={showToast} />
          )}
          {activeReport.category === "Marketing" && (
            <ReportMarketing subTab={currentTab} onBack={() => setParams({})} onNotify={showToast} />
          )}
          {activeReport.category === "Finance" && (
            <ReportFinance subTab={currentTab} onBack={() => setParams({})} onNotify={showToast} />
          )}
          {activeReport.category === "Management Pack" && (
            <ReportManagement subTab={currentTab} onBack={() => setParams({})} onNotify={showToast} />
          )}
          {activeReport.category === "Catalogue" && (
            <ReportCatalogue subTab={currentTab} onBack={() => setParams({})} onNotify={showToast} />
          )}
          {activeReport.category === "HR" && (
            <ReportHr subTab={currentTab} onBack={() => setParams({})} onNotify={showToast} />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// REPORT CARD COMPONENT (Matching SNIPER Dark Theme & Exact Screenshots)
// ============================================================================

function ReportCard({ report, onClick }: { report: ReportItem; onClick: () => void }) {
  const Icon = report.icon;
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl bg-[#0c1220] border border-[#1a253a] hover:border-blue-500/50 hover:bg-[#111a2d] transition-all duration-150 cursor-pointer group flex flex-col justify-between shadow-xs space-y-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#111a2d] border border-[#1e293b] text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <h3 className="text-[13.5px] font-bold text-white group-hover:text-blue-300 transition-colors">
            {report.title}
          </h3>
          <p className="text-[11.5px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
            {report.desc}
          </p>
        </div>
      </div>

      {/* Green Sparkle Highlight Tag matching Screenshot */}
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 pt-2 border-t border-[#162033]">
        <Sparkles size={12} className="shrink-0 text-emerald-400" />
        <span className="truncate">{report.highlight}</span>
      </div>
    </div>
  );
}
