import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Moon, Sun, Check, ChevronDown, ChevronLeft, ChevronRight, X, Calendar, Sparkles,
  Users, Banknote, TrendingUp, Wallet, CheckCircle2, Trophy, Target, Zap, Phone,
  ArrowUpRight, Clock, Award, ShieldCheck, FileText, ArrowRight, Lightbulb,
  ExternalLink, BarChart3, PieChart, Layers, UserCheck, Briefcase, MapPin,
  TrendingDown, Percent, Settings, CheckCircle, AlertCircle, RefreshCw, Star,
  Compass, Building2, UserPlus, FileSpreadsheet, Headphones
} from "lucide-react";
import { api, fmtInr } from "../../lib/api";

// ============================================================================
// 25 FEATURE UPDATES CAROUSEL
// ============================================================================
const FEATURE_UPDATES = [
  { tag: "IMPROVED", title: "Parent-DSA Commission Routing", sub: "Route commissions through the parent DSA correctly.", linkText: "Open Payin", linkUrl: "/setup?tab=payout-structure" },
  { tag: "NEW FEATURE", title: "Smart Document OCR", sub: "Auto-extract salary and Form 16 text instantly.", linkText: "Explore APIs", linkUrl: "/apis" },
  { tag: "NEW FEATURE", title: "Direct Banker Login", sub: "Forward loan files directly into bank RM systems.", linkText: "Banker Directory", linkUrl: "/team?tab=bankers" },
  { tag: "FEATURE", title: "Cross-Selling", sub: "Offer insurance and more to existing customers.", linkText: "Open Cross-Sell", linkUrl: "/setup?tab=insurance" },
  { tag: "FEATURE", title: "Aadhaar Lead Capture", sub: "Create a lead straight from an Aadhaar scan.", linkText: "New Applicant", linkUrl: "/new-applicant" },
  { tag: "NEW FEATURE", title: "Experian CIR Integration", sub: "1-click bureau report with score, trade lines & repayment track.", linkText: "Check Bureau", linkUrl: "/apis" },
  { tag: "IMPROVED", title: "Bank Statement Analyser", sub: "Detect FOIR, bouncing, EMI obligations and average balance.", linkText: "Analyser API", linkUrl: "/apis" },
  { tag: "FEATURE", title: "Vehicle RC Verification", sub: "Instant Parivahan Vahan registry lookup for used car loans.", linkText: "Vehicle API", linkUrl: "/apis" },
  { tag: "IMPROVED", title: "e-Challan Checking", sub: "Detect pending traffic challans and blacklisting before sanction.", linkText: "Challan Check", linkUrl: "/apis" },
  { tag: "FEATURE", title: "DSA Code Management", sub: "Multi-lender code allocation for sub-DSAs and connectors.", linkText: "DSA Codes", linkUrl: "/setup?tab=dsa-codes" },
  { tag: "FEATURE", title: "Instant Eligibility Matcher", sub: "Live algorithm checks 1,230 bank policies in under 2 seconds.", linkText: "View Schemes", linkUrl: "/setup?tab=schemes" },
  { tag: "IMPROVED", title: "Automated Payout Grids", sub: "Auto-calculate slab commissions on net disbursed volumes.", linkText: "Payout Structure", linkUrl: "/setup?tab=payout-structure" },
  { tag: "FEATURE", title: "WhatsApp Document Drop", sub: "Borrowers receive auto-upload links directly on WhatsApp.", linkText: "WhatsApp Config", linkUrl: "/setup?tab=whatsapp" },
  { tag: "NEW FEATURE", title: "Field Visit GPS Logger", sub: "Verification agents log real-time geolocation pins during visits.", linkText: "Visit Report", linkUrl: "/reports?tab=client-visit-report" },
  { tag: "IMPROVED", title: "Dialer & Call Analytics", sub: "Inbound & outbound click-to-call with disposition tracking.", linkText: "Dial Report", linkUrl: "/reports?tab=dial-report" },
  { tag: "FEATURE", title: "Rechargeable API Wallet", sub: "Centralized balance for Experian, PAN and OCR verification APIs.", linkText: "Open Wallet", linkUrl: "/wallet" },
  { tag: "FEATURE", title: "Multi-Level Hierarchy Tree", sub: "Visualize team structure, reporting lines and sub-channel branches.", linkText: "Team Tree", linkUrl: "/team?tab=tree" },
  { tag: "IMPROVED", title: "TAT Bottleneck Alerts", sub: "Highlights stuck applications exceeding lender stage SLA.", linkText: "TAT Report", linkUrl: "/reports?tab=tat-analysis" },
  { tag: "FEATURE", title: "Vendor (Supplier) Ledger", sub: "Track procurement, asset invoices and verification vendor bills.", linkText: "Suppliers", linkUrl: "/team?tab=suppliers" },
  { tag: "FEATURE", title: "Bulk Lead CSV Import", sub: "Import thousands of cold leads with duplicate mobile detection.", linkText: "Bulk Import", linkUrl: "/team?tab=bulk-import" },
  { tag: "IMPROVED", title: "Automated KFS Generator", sub: "RBI-compliant Key Fact Statement PDF generation in seconds.", linkText: "Documents Hub", linkUrl: "/documents" },
  { tag: "FEATURE", title: "Razorpay Gateway Integration", sub: "Collect processing fees and partner subscription seats online.", linkText: "Razorpay Config", linkUrl: "/setup?tab=razorpay" },
  { tag: "FEATURE", title: "Pin Code Serviceability Matrix", sub: "Restrict loan intake to active serviceable branch territories.", linkText: "Pin Codes", linkUrl: "/setup?tab=pin-codes" },
  { tag: "IMPROVED", title: "Monthly Executive P&L", sub: "Net retainer margin report after partner splits and operating costs.", linkText: "P&L Statement", linkUrl: "/reports?tab=sales-net-revenue" },
  { tag: "NEW FEATURE", title: "Ask Baadal AI Co-Pilot", sub: "Context-aware lending intelligence and credit underwriting assistant.", linkText: "Open AI Chat", linkUrl: "/chat" }
];

// ============================================================================
// 13 ACHIEVEMENTS DATA
// ============================================================================
const ACHIEVEMENTS_LIST = [
  { id: "first-lead", name: "First Lead", icon: "🎯", earned: true, desc: "Capture your first verified borrower lead in the workspace." },
  { id: "lead-hunter", name: "Lead Hunter", icon: "🏹", earned: false, desc: "Generate 10 qualified leads within a single calendar month." },
  { id: "lead-machine", name: "Lead Machine", icon: "⚡", earned: false, desc: "Reach 50 active leads across personal and business lending." },
  { id: "century-club", name: "Century Club", icon: "💯", earned: false, desc: "Cross 100 leads milestone in your CRM pipeline." },
  { id: "application-pro", name: "Application Pro", icon: "📋", earned: false, desc: "Convert 10 leads into fully completed loan application files." },
  { id: "pipeline-builder", name: "Pipeline Builder", icon: "🔧", earned: false, desc: "Build a live active pipeline of ₹1 Crore in loan value." },
  { id: "deal-closer", name: "Deal Closer", icon: "🏆", earned: false, desc: "Successfully disburse your first loan with partner banks." },
  { id: "closer-pro", name: "Closer Pro", icon: "🥇", earned: false, desc: "Disburse 5 loans in a single month with zero bounce back." },
  { id: "money-maker", name: "Money Maker", icon: "💰", earned: true, desc: "Earn your first gross commission payout from lender disbursements." },
  { id: "lakh-club", name: "Lakh Club", icon: "💎", earned: true, desc: "Earn over ₹1,00,000 in monthly net commission retained." },
  { id: "team-builder", name: "Team Builder", icon: "👥", earned: false, desc: "Onboard 5 active employees to your lending workspace roster." },
  { id: "network-builder", name: "Network Builder", icon: "🤝", earned: false, desc: "Connect 10 active channel partners or sub-DSAs to your network." },
  { id: "doc-master", name: "Doc Master", icon: "📄", earned: false, desc: "Collect and verify 50 borrower documents with 100% compliance." }
];

// 17 Lead Pipeline Statuses matching Teleport CRM
const CRM_STATUSES = [
  { key: "new", label: "new", count: 2 },
  { key: "contacted", label: "contacted", count: 0 },
  { key: "no_response", label: "no response", count: 0 },
  { key: "not_reachable", label: "not reachable", count: 0 },
  { key: "interested", label: "interested", count: 0 },
  { key: "follow_up", label: "follow up", count: 0 },
  { key: "assessment", label: "assessment", count: 0 },
  { key: "lead_nurtured", label: "lead nurtured", count: 0 },
  { key: "docs_pending", label: "docs pending", count: 0 },
  { key: "documents_collected", label: "documents collected", count: 0 },
  { key: "application_submitted", label: "application submitted", count: 0 },
  { key: "approved", label: "approved", count: 0 },
  { key: "rejected", label: "rejected", count: 0 },
  { key: "disbursed", label: "disbursed", count: 0 },
  { key: "converted", label: "converted", count: 0 },
  { key: "lost", label: "lost", count: 0 },
  { key: "unqualified", label: "unqualified", count: 0 }
];

// India map polygon coordinates
const INDIA_POLY: [number, number][] = [
  [68.2, 23.8], [68.5, 23.0], [69.4, 22.2], [70.5, 21.0], [72.5, 20.0], [72.8, 19.0], [73.9, 17.6], [74.0, 15.5],
  [74.8, 13.5], [75.9, 11.8], [77.2, 10.2], [78.2, 8.8], [77.55, 8.08], [79.8, 10.3], [80.2, 13.1], [80.3, 16.2],
  [81.9, 17.6], [82.3, 18.3], [83.3, 21.5], [85.8, 21.6], [87.0, 21.6], [88.3, 22.5], [88.9, 23.4], [89.6, 25.0],
  [91.8, 26.1], [92.6, 26.7], [93.9, 27.2], [95.0, 27.9], [96.5, 28.7], [97.4, 28.6], [95.5, 29.8], [93.8, 30.2],
  [91.0, 29.8], [89.0, 30.0], [88.1, 27.9], [86.3, 27.5], [84.5, 28.4], [82.4, 30.1], [80.2, 30.5], [78.6, 30.9],
  [77.5, 31.8], [76.0, 32.6], [75.5, 33.9], [74.3, 35.4], [74.0, 36.8], [73.5, 35.5], [72.8, 34.0], [71.8, 32.7],
  [71.5, 31.5], [70.8, 29.3], [70.2, 27.0], [68.8, 25.7], [68.2, 24.3]
];

function projectLonLat(lon: number, lat: number): [number, number] {
  const x = (lon - 67.5) * 11.2;
  const y = (37.5 - lat) * 10.6;
  return [x, y];
}

export function GnDashboard() {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "business";

  const [d, setD] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // Banners visibility
  const [showFeatureBanner, setShowFeatureBanner] = useState(true);
  const [showCallBanner, setShowCallBanner] = useState(true);
  const [showTicker, setShowTicker] = useState(true);

  // Timeframe selector
  const [period, setPeriod] = useState("Last 30 days");
  const [callsPeriod, setCallsPeriod] = useState("30 days");
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("Last 30 days");
  const [leaderboardFilter, setLeaderboardFilter] = useState<"all" | "employees" | "partners">("all");

  // Feature carousel index
  const [featureIdx, setFeatureIdx] = useState(19); // Index 19 is "Parent-DSA Commission Routing" matching Screenshot 01 (20/25)

  // Interactive Modals
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Targets state (stored in local storage)
  const [targets, setTargets] = useState(() => {
    try {
      const saved = localStorage.getItem("teleport_targets_oct2026");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [targetForm, setTargetForm] = useState({
    leads: "25",
    apps: "15",
    sanctioned: "2500000",
    disbursed: "2000000",
    commission: "50000"
  });

  // Onboarding Call state
  const [onboardingSlot, setOnboardingSlot] = useState({
    date: "Tomorrow, 22 Oct 2026",
    time: "2:30 PM - 3:30 PM IST",
    advisor: "Priya Sharma (Senior Lending Architect)",
    mobile: "8838864869",
    email: "vivek@sniperelectric.in"
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    api("/gn/dashboard").then(setD).catch(() => {});
    api("/gn/applications?limit=10").then((r) => setApps(r.rows || [])).catch(() => {});
    api("/gn/tasks").then((r) => setTasks(r.rows || [])).catch(() => {});
  }, []);

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    const newTargets = {
      leads: Number(targetForm.leads) || 25,
      apps: Number(targetForm.apps) || 15,
      sanctioned: Number(targetForm.sanctioned) || 2500000,
      disbursed: Number(targetForm.disbursed) || 2000000,
      commission: Number(targetForm.commission) || 50000,
      setAt: new Date().toISOString()
    };
    setTargets(newTargets);
    localStorage.setItem("teleport_targets_oct2026", JSON.stringify(newTargets));
    setTargetModalOpen(false);
    showToast("🎯 Monthly targets for October 2026 have been set!");
  };

  const handleBookOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingModalOpen(false);
    showToast(`🎓 Free Onboarding Call confirmed for ${onboardingSlot.date} at ${onboardingSlot.time}!`);
  };

  // Switch Sub-Tab
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const currentFeature = FEATURE_UPDATES[featureIdx % FEATURE_UPDATES.length];

  // Dynamic greeting based on current local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // Today formatted string matching Screenshot 1: "Wednesday, 21 October 2026"
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-slate-100 font-sans antialiased pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          SUB-NAVIGATION TABS (7 TABS MATCHING ALL SCREENSHOTS)
          Business | Users | CRM | Sales | Accounts | HRM | Market
         ========================================================================= */}
      <div className="border-b border-[#182235] bg-[#0c1220] rounded-xl px-2 py-1 shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none">
        {[
          { id: "business", label: "Business" },
          { id: "users", label: "Users" },
          { id: "crm", label: "CRM" },
          { id: "sales", label: "Sales" },
          { id: "accounts", label: "Accounts" },
          { id: "hrm", label: "HRM" },
          { id: "market", label: "Market" }
        ].map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-[13.5px] font-semibold transition-all relative rounded-lg cursor-pointer whitespace-nowrap ${
                isActive
                  ? "text-blue-400 font-bold bg-blue-500/10 shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]"
              }`}
            >
              <span>{t.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: BUSINESS OVERVIEW (Screenshots 01, 02, 03, 04)
         ========================================================================= */}
      {activeTab === "business" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {/* 1. GREETING BLUE BANNER (Screenshot 01) */}
          <div className="rounded-2xl bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] border border-blue-400/30 p-5 shadow-xl relative text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sun size={22} className="text-amber-200 fill-amber-200/30" />
                </div>
                <div>
                  <h2 className="text-[21px] font-bold tracking-tight text-white flex items-center gap-2">
                    {greeting}, VIVEK!
                  </h2>
                  <p className="text-[12.5px] text-blue-100 font-medium mt-0.5">{formattedDate}</p>
                  <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold border border-white/20">
                    <Check size={12} className="text-emerald-300 stroke-[3]" />
                    <span>All caught up! Great job.</span>
                  </div>
                </div>
              </div>

              {/* Time Period Selector */}
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-black/25 hover:bg-black/35 border border-white/20 text-white text-[12px] font-medium rounded-lg px-3 py-1.5 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/40 transition-colors"
                >
                  <option value="Today" className="bg-[#0c1220] text-slate-100">Today</option>
                  <option value="Yesterday" className="bg-[#0c1220] text-slate-100">Yesterday</option>
                  <option value="Last 7 days" className="bg-[#0c1220] text-slate-100">Last 7 days</option>
                  <option value="Last 30 days" className="bg-[#0c1220] text-slate-100">Last 30 d...</option>
                  <option value="This Month" className="bg-[#0c1220] text-slate-100">This Month</option>
                  <option value="Last Month" className="bg-[#0c1220] text-slate-100">Last Month</option>
                  <option value="This FY" className="bg-[#0c1220] text-slate-100">This FY</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-2.5 pointer-events-none text-blue-100" />
              </div>
            </div>

            {/* Feature Announcement Slider inside blue banner */}
            {showFeatureBanner && (
              <div className="mt-4 rounded-xl bg-white/10 border border-white/15 p-3 flex items-center justify-between flex-wrap gap-3 backdrop-blur-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center shrink-0">
                    <Sparkles size={16} className="text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-black uppercase tracking-wider bg-white text-blue-900 px-1.5 py-0.5 rounded shadow-xs">
                        {currentFeature.tag}
                      </span>
                      <span className="text-[13px] font-bold text-white">{currentFeature.title}</span>
                    </div>
                    <p className="text-[11.5px] text-blue-100 mt-0.5">{currentFeature.sub}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    to={currentFeature.linkUrl}
                    className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11.5px] font-bold transition-colors flex items-center gap-1 border border-white/20 shadow-xs"
                  >
                    <span>{currentFeature.linkText}</span>
                    <ArrowRight size={12} />
                  </Link>

                  <div className="flex items-center gap-1 text-[11px] bg-black/20 px-2 py-1 rounded-md border border-white/15 font-mono">
                    <button
                      onClick={() => setFeatureIdx((prev) => (prev > 0 ? prev - 1 : FEATURE_UPDATES.length - 1))}
                      className="hover:text-amber-300 px-0.5 cursor-pointer"
                      title="Previous update"
                    >
                      &lt;
                    </button>
                    <span>{featureIdx + 1}/{FEATURE_UPDATES.length}</span>
                    <button
                      onClick={() => setFeatureIdx((prev) => (prev + 1) % FEATURE_UPDATES.length)}
                      className="hover:text-amber-300 px-0.5 cursor-pointer"
                      title="Next update"
                    >
                      &gt;
                    </button>
                  </div>

                  <button
                    onClick={() => setShowFeatureBanner(false)}
                    className="text-blue-200 hover:text-white p-1 rounded cursor-pointer"
                    title="Dismiss"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. SCHEDULE YOUR FREE ONBOARDING CALL (Warm Gold Card - Screenshot 01) */}
          {showCallBanner && (
            <div className="rounded-2xl bg-[#1c1611] border border-[#593d18] p-4 flex items-center justify-between flex-wrap gap-4 shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-amber-100">
                    Schedule Your Free Onboarding Call 🎓
                  </h4>
                  <p className="text-[12px] text-amber-200/70 mt-0.5">
                    60 min · a product expert walks through your workspace, leads, schemes & integrations.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOnboardingModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#b45309] hover:bg-[#d97706] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-900/30 cursor-pointer"
                >
                  <Clock size={13} />
                  <span>Pick a Slot</span>
                </button>
                <button
                  onClick={() => setShowCallBanner(false)}
                  className="text-amber-400/60 hover:text-amber-200 p-1 rounded"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          {/* 3. SLIM ANNOUNCEMENT TICKER (Screenshot 01) */}
          {showTicker && (
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] px-4 py-2.5 flex items-center justify-between text-[11.5px] text-slate-300 shadow-sm">
              <div className="flex items-center gap-2 overflow-hidden truncate">
                <Lightbulb size={14} className="text-blue-400 shrink-0" />
                <span className="truncate">
                  Real-time overview of leads, loans & commissions &nbsp;•&nbsp; Track conversion rates and pipeline health &nbsp;•&nbsp; Monitor disbursement trends over 6 months &nbsp;•&nbsp; Quick access to pending tasks and follow-ups
                </span>
              </div>
              <button onClick={() => setShowTicker(false)} className="text-slate-500 hover:text-white shrink-0 ml-3 cursor-pointer">
                <X size={14} />
              </button>
            </div>
          )}

          {/* 4. FTD / MTD / YTD METRIC BLOCK (Screenshot 01) */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#182235]">
            {/* FTD */}
            <div className="px-3 py-2 md:py-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-black text-blue-400">FTD</span>
                <span className="text-[11.5px] text-slate-400">For the day</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> APPLIED
                  </div>
                  <div className="text-[20px] font-bold text-white mt-0.5">₹0</div>
                  <div className="text-[10.5px] text-slate-400">0 files</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> DISBURSED
                  </div>
                  <div className="text-[20px] font-bold text-emerald-400 mt-0.5">₹0</div>
                  <div className="text-[10.5px] text-slate-400">0 files</div>
                </div>
              </div>
            </div>

            {/* MTD */}
            <div className="px-3 py-2 md:py-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-black text-blue-400">MTD</span>
                <span className="text-[11.5px] text-slate-400">Month to date</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> APPLIED
                  </div>
                  <div className="text-[20px] font-bold text-white mt-0.5">₹0</div>
                  <div className="text-[10.5px] text-slate-400">0 files</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> DISBURSED
                  </div>
                  <div className="text-[20px] font-bold text-emerald-400 mt-0.5">₹0</div>
                  <div className="text-[10.5px] text-slate-400">0 files</div>
                </div>
              </div>
            </div>

            {/* YTD */}
            <div className="px-3 py-2 md:py-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-black text-blue-400">YTD</span>
                <span className="text-[11.5px] text-slate-400">Financial year to date</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> APPLIED
                  </div>
                  <div className="text-[20px] font-bold text-white mt-0.5">₹0</div>
                  <div className="text-[10.5px] text-slate-400">0 files</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> DISBURSED
                  </div>
                  <div className="text-[20px] font-bold text-emerald-400 mt-0.5">₹0</div>
                  <div className="text-[10.5px] text-slate-400">0 files</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. 4 KPI STAT CARDS (Screenshot 02) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* LEADS */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 flex items-start justify-between shadow-sm">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">LEADS</div>
                <div className="text-[26px] font-bold text-blue-400 mt-1">2</div>
                <div className="text-[11px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                  <span>↗ +100% vs prev period</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>

            {/* ACTIVE APPLICATIONS */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 flex items-start justify-between shadow-sm">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ACTIVE APPLICATIONS</div>
                <div className="text-[26px] font-bold text-emerald-400 mt-1">0</div>
                <div className="text-[11px] font-medium text-slate-400 mt-1">
                  <span>— no change vs prev period</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Banknote size={18} />
              </div>
            </div>

            {/* DISBURSED */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 flex items-start justify-between shadow-sm">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">DISBURSED</div>
                <div className="text-[26px] font-bold text-white mt-1">₹0</div>
                <div className="text-[11px] font-medium text-slate-400 mt-1">
                  <span>— no change vs prev period</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-700/20 border border-slate-700/40 text-slate-300 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
            </div>

            {/* COMMISSION EARNED */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 flex items-start justify-between shadow-sm">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">COMMISSION EARNED</div>
                <div className="text-[26px] font-bold text-amber-400 mt-1">₹0</div>
                <div className="text-[11px] font-medium text-slate-400 mt-1">
                  <span>— no change vs prev period</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Wallet size={18} />
              </div>
            </div>
          </div>

          {/* 6. TARGET VS ACHIEVED (Screenshot 02) */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div>
                <h3 className="text-[14px] font-bold text-white tracking-tight">Target vs Achieved</h3>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  A manager's figure is their own plus everyone reporting under them.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-slate-400">2026-10</span>
                <button
                  onClick={() => setTargetModalOpen(true)}
                  className="text-[12px] font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  Set targets
                </button>
              </div>
            </div>

            {targets ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-[#080d1a] border border-[#182235]">
                  <div className="text-[11px] text-slate-400">Leads Target</div>
                  <div className="text-[16px] font-bold text-white mt-1">2 / {targets.leads}</div>
                  <div className="w-full bg-[#182235] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (2 / targets.leads) * 100)}%` }} />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#080d1a] border border-[#182235]">
                  <div className="text-[11px] text-slate-400">Applications Target</div>
                  <div className="text-[16px] font-bold text-white mt-1">0 / {targets.apps}</div>
                  <div className="w-full bg-[#182235] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#080d1a] border border-[#182235]">
                  <div className="text-[11px] text-slate-400">Disbursement Goal</div>
                  <div className="text-[16px] font-bold text-white mt-1">₹0 / {fmtInr(targets.disbursed)}</div>
                  <div className="w-full bg-[#182235] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#080d1a] border border-[#182235]">
                  <div className="text-[11px] text-slate-400">Commission Goal</div>
                  <div className="text-[16px] font-bold text-white mt-1">₹0 / {fmtInr(targets.commission)}</div>
                  <div className="w-full bg-[#182235] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-[12.5px] text-slate-400">
                No targets set for this month yet — use{" "}
                <button
                  onClick={() => setTargetModalOpen(true)}
                  className="font-bold text-blue-400 hover:underline cursor-pointer"
                >
                  Set targets
                </button>{" "}
                to add them, and progress will track here as files move.
              </div>
            )}
          </div>

          {/* 7. THREE COLUMN WIDGETS (My Leads | Loan Applications | Tasks) (Screenshot 02) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* My Leads */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-white">
                    <Users size={15} className="text-blue-400" />
                    <span>My Leads</span>
                  </div>
                  <Link to="/leads" className="text-[11.5px] font-semibold text-blue-400 hover:underline">
                    View all &gt;
                  </Link>
                </div>

                <div className="mt-3 space-y-2">
                  <div
                    onClick={() => nav("/leads")}
                    className="p-3 rounded-lg bg-[#080d1a] border border-[#182235] hover:border-blue-500/40 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-[13px] font-bold text-white">Satyajeet Kere</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">8838864869</div>
                    </div>
                    <span className="text-[10.5px] font-semibold text-blue-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> New
                    </span>
                  </div>

                  <div
                    onClick={() => nav("/leads")}
                    className="p-3 rounded-lg bg-[#080d1a] border border-[#182235] hover:border-blue-500/40 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-[13px] font-bold text-white">Omkar</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">8767424655</div>
                    </div>
                    <span className="text-[10.5px] font-semibold text-blue-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> New
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Applications */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-white">
                    <FileText size={15} className="text-emerald-400" />
                    <span>Loan Applications</span>
                  </div>
                  <Link to="/loans" className="text-[11.5px] font-semibold text-blue-400 hover:underline">
                    View all &gt;
                  </Link>
                </div>
                <div className="py-12 text-center text-[12px] text-slate-500">
                  No applications
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-white">
                    <Calendar size={15} className="text-amber-400" />
                    <span>Tasks</span>
                  </div>
                  <Link to="/utility" className="text-[11.5px] font-semibold text-blue-400 hover:underline">
                    View all &gt;
                  </Link>
                </div>
                <div className="py-12 text-center text-[12px] text-slate-500">
                  No tasks
                </div>
              </div>
            </div>
          </div>

          {/* 8. LEAD BREAKDOWN & COMMISSION CARDS (Screenshot 03) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEAD BREAKDOWN */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                LEAD BREAKDOWN
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center shrink-0 pr-4 border-r border-[#182235]">
                  <div className="text-[28px] font-black text-white">0.0%</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Conversion</div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-slate-400 w-24">New</span>
                    <div className="flex-1 h-2 bg-[#080d1a] rounded-full overflow-hidden border border-[#182235]">
                      <div className="h-full bg-blue-500 rounded-full w-full" />
                    </div>
                    <span className="text-[12px] font-bold text-white w-6 text-right">2</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-slate-400 w-24">Contacted</span>
                    <div className="flex-1 h-2 bg-[#080d1a] rounded-full overflow-hidden border border-[#182235]">
                      <div className="h-full bg-blue-500 rounded-full w-0" />
                    </div>
                    <span className="text-[12px] font-bold text-slate-500 w-6 text-right">0</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-slate-400 w-24">No Response</span>
                    <div className="flex-1 h-2 bg-[#080d1a] rounded-full overflow-hidden border border-[#182235]">
                      <div className="h-full bg-blue-500 rounded-full w-0" />
                    </div>
                    <span className="text-[12px] font-bold text-slate-500 w-6 text-right">0</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-slate-400 w-24">Not Reachable</span>
                    <div className="flex-1 h-2 bg-[#080d1a] rounded-full overflow-hidden border border-[#182235]">
                      <div className="h-full bg-blue-500 rounded-full w-0" />
                    </div>
                    <span className="text-[12px] font-bold text-slate-500 w-6 text-right">0</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-slate-400 w-24">Interested</span>
                    <div className="flex-1 h-2 bg-[#080d1a] rounded-full overflow-hidden border border-[#182235]">
                      <div className="h-full bg-blue-500 rounded-full w-0" />
                    </div>
                    <span className="text-[12px] font-bold text-slate-500 w-6 text-right">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COMMISSION */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm flex flex-col justify-between">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                COMMISSION
              </div>

              <div className="grid grid-cols-3 gap-3 text-center py-4">
                <div className="p-3.5 rounded-xl bg-[#080d1a] border border-[#182235]">
                  <div className="text-[26px] font-bold text-white">₹0</div>
                  <div className="text-[11px] text-slate-400 mt-1">Earned</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#080d1a] border border-[#182235]">
                  <div className="text-[26px] font-bold text-emerald-400">₹0</div>
                  <div className="text-[11px] text-emerald-300 mt-1">Paid</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#080d1a] border border-[#182235]">
                  <div className="text-[26px] font-bold text-amber-400">₹0</div>
                  <div className="text-[11px] text-amber-300 mt-1">Pending</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 text-center">
                Commissions auto-calculate on lender disbursement based on scheme rules.
              </div>
            </div>
          </div>

          {/* 9. CALLS — DIALED VS PICKED UP (Screenshot 03) */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235] mb-4">
              <div className="flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-wider text-slate-300">
                <Phone size={15} className="text-blue-400" />
                <span>CALLS — DIALED VS PICKED UP</span>
              </div>
              <div className="relative">
                <select
                  value={callsPeriod}
                  onChange={(e) => setCallsPeriod(e.target.value)}
                  className="bg-[#080d1a] border border-[#182235] text-slate-200 text-[11.5px] font-medium rounded-lg px-2.5 py-1 pr-6 appearance-none cursor-pointer focus:outline-none"
                >
                  <option value="7 days">7 days</option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-2 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div className="py-8 text-center text-[12px] text-slate-400 max-w-2xl mx-auto">
              No calls recorded in this period. Calls count when they are logged on a lead, or when a lead is marked Contacted, Interested, No Response or Not Reachable.
            </div>
          </div>

          {/* 10. TEAM LEADERBOARD & ACHIEVEMENTS (Screenshots 03, 04) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Team Leaderboard */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#182235] mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[13.5px] font-bold text-white">
                  <span>🏆 Team Leaderboard</span>
                  <span className="text-[11.5px] text-slate-400 font-normal">({leaderboardPeriod})</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#080d1a] p-0.5 rounded-lg border border-[#182235] text-[11px] font-semibold">
                    <button
                      onClick={() => setLeaderboardFilter("all")}
                      className={`px-2 py-0.5 rounded-md ${leaderboardFilter === "all" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      All 1
                    </button>
                    <button
                      onClick={() => setLeaderboardFilter("employees")}
                      className={`px-2 py-0.5 rounded-md ${leaderboardFilter === "employees" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      Employees 1
                    </button>
                    <button
                      onClick={() => setLeaderboardFilter("partners")}
                      className={`px-2 py-0.5 rounded-md ${leaderboardFilter === "partners" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      Partners 0
                    </button>
                  </div>

                  <div className="relative">
                    <select
                      value={leaderboardPeriod}
                      onChange={(e) => setLeaderboardPeriod(e.target.value)}
                      className="bg-[#080d1a] border border-[#182235] text-slate-200 text-[11px] font-medium rounded-lg px-2 py-1 pr-6 appearance-none cursor-pointer"
                    >
                      <option value="Last 7 days">Last 7 days</option>
                      <option value="Last 30 days">Last 30 days</option>
                      <option value="This Month">This Month</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-1.5 top-2 pointer-events-none text-slate-400" />
                  </div>
                </div>
              </div>

              {/* 11 Column Table matching Screenshot 04 */}
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-[11.5px]">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#182235]">
                      <th className="py-2 pr-2">#</th>
                      <th className="py-2 pr-3">MEMBER</th>
                      <th className="py-2 px-1 text-center">LEADS</th>
                      <th className="py-2 px-1 text-center">APPS</th>
                      <th className="py-2 px-1 text-center">LOANS</th>
                      <th className="py-2 px-1 text-center">SANCTIONED</th>
                      <th className="py-2 px-1 text-center">DISBURSED</th>
                      <th className="py-2 px-1 text-center">CONV</th>
                      <th className="py-2 px-1 text-center">OVERDUE</th>
                      <th className="py-2 px-1 text-right">COMMISSION</th>
                      <th className="py-2 pl-2 text-right">NET</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#182235]/60 hover:bg-[#080d1a]/50">
                      <td className="py-3 pr-2 text-[14px]">🥇</td>
                      <td className="py-3 pr-3 font-bold text-white whitespace-nowrap">VIVEK MAHAJAN</td>
                      <td className="py-3 px-1 text-center font-semibold text-slate-200">1</td>
                      <td className="py-3 px-1 text-center text-slate-500">—</td>
                      <td className="py-3 px-1 text-center text-slate-500">—</td>
                      <td className="py-3 px-1 text-center text-slate-500">—</td>
                      <td className="py-3 px-1 text-center text-slate-500">—</td>
                      <td className="py-3 px-1 text-center font-semibold text-slate-300">0%</td>
                      <td className="py-3 px-1 text-center text-slate-500">—</td>
                      <td className="py-3 px-1 text-right font-bold text-emerald-400">₹0</td>
                      <td className="py-3 pl-2 text-right text-slate-500">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Achievements Card (Screenshot 04) */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#182235] mb-3">
                <div className="flex items-center gap-2 text-[13.5px] font-bold text-white">
                  <span>🎖️ Achievements</span>
                  <span className="text-[11.5px] text-blue-400 font-semibold">3/13 earned</span>
                </div>
              </div>

              {/* Progress Bar (3/13) */}
              <div className="w-full bg-[#182235] h-2 rounded-full mb-4 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${(3 / 13) * 100}%` }} />
              </div>

              {/* 13 Badges Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {ACHIEVEMENTS_LIST.map((ach) => (
                  <button
                    key={ach.id}
                    onClick={() => setSelectedAchievement(ach)}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                      ach.earned
                        ? "bg-blue-600/15 border-blue-500/40 text-blue-200 shadow-sm hover:bg-blue-600/25"
                        : "bg-[#080d1a] border-[#182235] text-slate-500 opacity-60 hover:opacity-100 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-[20px]">{ach.icon}</div>
                    <div className="text-[10.5px] font-bold mt-1 truncate w-full">{ach.name}</div>
                    {ach.earned && (
                      <span className="text-[9px] font-bold text-blue-400 mt-0.5">Earned</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: USERS (Screenshot 05)
         ========================================================================= */}
      {activeTab === "users" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {/* 1. SEAT METRICS (4 CARDS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SEATS PURCHASED</div>
              <div className="text-[26px] font-bold text-white mt-1">5</div>
              <div className="text-[11px] text-slate-400 mt-1">starter plan</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ACTIVE USERS</div>
              <div className="text-[26px] font-bold text-emerald-400 mt-1">1</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SEATS FREE</div>
              <div className="text-[26px] font-bold text-white mt-1">4</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">UTILISATION</div>
              <div className="text-[26px] font-bold text-blue-400 mt-1">20%</div>
              <div className="text-[11px] text-slate-400 mt-1">of the seats you pay for</div>
            </div>
          </div>

          {/* 2. THREE BREAKDOWN CARDS (Employees 2 | Partners 1 | Bankers 1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Employees */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
                  <span className="text-[14px] font-bold text-white">Employees</span>
                  <span className="text-[18px] font-bold text-blue-400">2</span>
                </div>
                <div className="space-y-2 py-3 text-[12px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Files this FY</span>
                    <span className="font-semibold text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">In pipeline now</span>
                    <span className="font-semibold text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Disbursed this FY</span>
                    <span className="font-semibold text-white">₹0</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Commission this FY</span>
                    <span className="font-semibold text-white">₹0</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Never signed in</span>
                    <span className="font-semibold text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Quiet 30 days+</span>
                    <span className="font-semibold text-white">0</span>
                  </div>
                </div>
              </div>
              <Link
                to="/team?tab=employees"
                className="mt-2 text-[12px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Manage Employees</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Partners */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
                  <span className="text-[14px] font-bold text-white">Partners</span>
                  <span className="text-[18px] font-bold text-blue-400">1</span>
                </div>
                <div className="space-y-2 py-3 text-[12px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Connectors & sub-DSAs</span>
                    <span className="font-semibold text-white">1</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Leads assigned to staff</span>
                    <span className="font-semibold text-white">2</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Untouched leads</span>
                    <span className="font-semibold text-white">1</span>
                  </div>
                </div>
              </div>
              <Link
                to="/team?tab=partners"
                className="mt-2 text-[12px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Manage Partners</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Bankers */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
                  <span className="text-[14px] font-bold text-white">Bankers</span>
                  <span className="text-[18px] font-bold text-blue-400">1</span>
                </div>
                <div className="space-y-2 py-3 text-[12px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Applications sent</span>
                    <span className="font-semibold text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Live with them now</span>
                    <span className="font-semibold text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Loans closed</span>
                    <span className="font-semibold text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">No file yet</span>
                    <span className="font-semibold text-white">1</span>
                  </div>
                </div>
              </div>
              <Link
                to="/team?tab=bankers"
                className="mt-2 text-[12px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Banker Directory</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* 3. WORKLOAD BY PERSON TABLE */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <div className="pb-3 border-b border-[#182235]">
              <h3 className="text-[14px] font-bold text-white tracking-tight">Workload by person</h3>
              <p className="text-[12px] text-slate-400 mt-0.5">Who is carrying how much right now. Busiest first.</p>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#182235]">
                    <th className="py-2.5">PERSON</th>
                    <th className="py-2.5 text-center">LEADS</th>
                    <th className="py-2.5 text-center">APPLICATIONS</th>
                    <th className="py-2.5 text-center">SANCTIONED</th>
                    <th className="py-2.5 text-right">FILES DISBURSED</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#182235]/60 hover:bg-[#080d1a]/50">
                    <td className="py-3 font-bold text-white">VIVEK MAHAJAN</td>
                    <td className="py-3 text-center font-semibold text-slate-200">1</td>
                    <td className="py-3 text-center text-slate-400">0</td>
                    <td className="py-3 text-center text-slate-400">0</td>
                    <td className="py-3 text-right font-semibold text-slate-300">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CRM (Screenshots 06, 07, 08, 09)
         ========================================================================= */}
      {activeTab === "crm" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {/* 1. 4 STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">LEADS</div>
              <div className="text-[26px] font-bold text-white mt-1">2</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">STILL OPEN</div>
              <div className="text-[26px] font-bold text-amber-400 mt-1">2</div>
              <div className="text-[11px] text-slate-400 mt-1">not yet converted or closed</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CONVERSION</div>
              <div className="text-[26px] font-bold text-emerald-400 mt-1">0%</div>
              <div className="text-[11px] text-slate-400 mt-1">▲ 0 pts on last month</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SOURCES IN USE</div>
              <div className="text-[26px] font-bold text-white mt-1">1</div>
            </div>
          </div>

          {/* 2. WHERE LEADS CAME FROM & LEADS PER DAY (2 CHARTS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Where leads came from */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-white tracking-tight mb-4">Where leads came from</h3>
              <div className="h-44 w-full">
                <svg viewBox="0 0 400 160" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="380" y2="20" stroke="#182235" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="380" y2="60" stroke="#182235" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="380" y2="100" stroke="#182235" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="380" y2="140" stroke="#334155" />

                  {/* Y Axis Labels */}
                  <text x="25" y="24" fill="#64748b" fontSize="10">4</text>
                  <text x="25" y="64" fill="#64748b" fontSize="10">3</text>
                  <text x="25" y="104" fill="#64748b" fontSize="10">2</text>
                  <text x="25" y="144" fill="#64748b" fontSize="10">0</text>

                  {/* Bar: Walk IN */}
                  <rect x="80" y="100" width="240" height="40" rx="3" fill="#2563eb" />
                  <text x="200" y="155" fill="#94a3b8" fontSize="10.5" textAnchor="middle">Walk IN</text>
                </svg>
              </div>
            </div>

            {/* Leads per day */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-white tracking-tight mb-4">Leads per day</h3>
              <div className="h-44 w-full">
                <svg viewBox="0 0 400 160" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="380" y2="20" stroke="#182235" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="380" y2="60" stroke="#182235" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="380" y2="100" stroke="#182235" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="380" y2="140" stroke="#334155" />

                  {/* Y Axis Labels */}
                  <text x="25" y="24" fill="#64748b" fontSize="10">4</text>
                  <text x="25" y="64" fill="#64748b" fontSize="10">3</text>
                  <text x="25" y="104" fill="#64748b" fontSize="10">2</text>
                  <text x="25" y="144" fill="#64748b" fontSize="10">0</text>

                  {/* Line & Point */}
                  <line x1="40" y1="140" x2="210" y2="115" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="210" cy="115" r="4" fill="#0c1220" stroke="#2563eb" strokeWidth="2.5" />
                  <text x="210" y="155" fill="#94a3b8" fontSize="10.5" textAnchor="middle">20</text>
                </svg>
              </div>
            </div>
          </div>

          {/* 3. CONVERSION TREND (6 MONTHS) */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Conversion trend</h3>
            <p className="text-[12px] text-slate-400 mt-0.5 max-w-4xl">
              Leads raised each month against the ones that reached disbursement. The headline card above measures the period you have selected; this is month by month, so the two will not read the same and are not meant to.
            </p>

            <div className="h-52 w-full mt-4">
              <svg viewBox="0 0 800 180" className="w-full h-full">
                {/* Horizontal grid lines */}
                <line x1="50" y1="20" x2="750" y2="20" stroke="#182235" strokeDasharray="3 3" />
                <line x1="50" y1="60" x2="750" y2="60" stroke="#182235" strokeDasharray="3 3" />
                <line x1="50" y1="100" x2="750" y2="100" stroke="#182235" strokeDasharray="3 3" />
                <line x1="50" y1="140" x2="750" y2="140" stroke="#334155" />

                {/* Left Y-axis */}
                <text x="35" y="24" fill="#64748b" fontSize="10">4</text>
                <text x="35" y="64" fill="#64748b" fontSize="10">3</text>
                <text x="35" y="104" fill="#64748b" fontSize="10">2</text>
                <text x="35" y="144" fill="#64748b" fontSize="10">0</text>

                {/* Right Y-axis */}
                <text x="760" y="24" fill="#64748b" fontSize="10">100%</text>
                <text x="760" y="64" fill="#64748b" fontSize="10">75%</text>
                <text x="760" y="104" fill="#64748b" fontSize="10">50%</text>
                <text x="760" y="144" fill="#64748b" fontSize="10">0%</text>

                {/* Bars for 2026-08 (x: 480) and 2026-10 (x: 700) */}
                <rect x="470" y="115" width="40" height="25" fill="#3b82f6" opacity="0.4" rx="2" />
                <rect x="670" y="115" width="40" height="25" fill="#3b82f6" opacity="0.4" rx="2" />

                {/* Conversion % Line (Green at 0%) */}
                <line x1="50" y1="140" x2="750" y2="140" stroke="#10b981" strokeWidth="2.5" />
                <circle cx="100" cy="140" r="3.5" fill="#10b981" />
                <circle cx="220" cy="140" r="3.5" fill="#10b981" />
                <circle cx="340" cy="140" r="3.5" fill="#10b981" />
                <circle cx="490" cy="140" r="3.5" fill="#10b981" />
                <circle cx="610" cy="140" r="3.5" fill="#10b981" />
                <circle cx="690" cy="140" r="3.5" fill="#10b981" />

                {/* X Axis Labels */}
                <text x="100" y="158" fill="#94a3b8" fontSize="10.5" textAnchor="middle">2026-05</text>
                <text x="220" y="158" fill="#94a3b8" fontSize="10.5" textAnchor="middle">2026-06</text>
                <text x="340" y="158" fill="#94a3b8" fontSize="10.5" textAnchor="middle">2026-07</text>
                <text x="490" y="158" fill="#94a3b8" fontSize="10.5" textAnchor="middle">2026-08</text>
                <text x="610" y="158" fill="#94a3b8" fontSize="10.5" textAnchor="middle">2026-09</text>
                <text x="690" y="158" fill="#94a3b8" fontSize="10.5" textAnchor="middle">2026-10</text>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Conversion %</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-600 rounded-xs" />
                <span>Disbursed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-400/40 rounded-xs" />
                <span>Leads</span>
              </div>
            </div>
          </div>

          {/* 4. BY STATUS (17 ROW LEAD PIPELINE TABLE) */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">By status</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">The whole book, wherever each lead currently sits.</p>

            <div className="mt-3 divide-y divide-[#182235]">
              <div className="flex items-center justify-between py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>STATUS</span>
                <span>LEADS</span>
              </div>
              {CRM_STATUSES.map((st) => (
                <div key={st.key} className="flex items-center justify-between py-2.5 text-[12.5px] hover:bg-[#080d1a]/50 px-1 rounded transition-colors">
                  <span className="text-slate-300 font-medium">{st.label}</span>
                  <span className={`font-bold ${st.count > 0 ? "text-white" : "text-slate-500"}`}>{st.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. FILES BY STAGE */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Files by stage</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Count, and the money sitting at each step.</p>
            <div className="py-12 text-center text-[12.5px] text-slate-400 space-y-2">
              <div>No applications in the pipeline.</div>
              <div>
                <Link to="/loans" className="text-blue-400 font-semibold hover:underline">
                  Open Loan Applications
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SALES (Screenshots 10, 11, 12)
         ========================================================================= */}
      {activeTab === "sales" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {/* 1. 4 KPI STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CONVERTED</div>
              <div className="text-[26px] font-bold text-emerald-400 mt-1">0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SANCTIONED</div>
              <div className="text-[26px] font-bold text-white mt-1">₹0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">DISBURSED</div>
              <div className="text-[26px] font-bold text-white mt-1">₹0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">COMMISSION</div>
              <div className="text-[26px] font-bold text-emerald-400 mt-1">₹0</div>
            </div>
          </div>

          {/* 2. BY SALESPERSON */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">By salesperson</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Best converter first — not the one with the most leads.</p>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#182235]">
                    <th className="py-2.5">PERSON</th>
                    <th className="py-2.5 text-center">LEADS</th>
                    <th className="py-2.5 text-center">CONVERTED</th>
                    <th className="py-2.5 text-center">CONV %</th>
                    <th className="py-2.5 text-center">SANCTIONED</th>
                    <th className="py-2.5 text-center">DISBURSED</th>
                    <th className="py-2.5 text-right">COMMISSION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#182235]/60 hover:bg-[#080d1a]/50">
                    <td className="py-3 font-bold text-white">VIVEK MAHAJAN</td>
                    <td className="py-3 text-center font-semibold text-slate-200">1</td>
                    <td className="py-3 text-center text-slate-400">0</td>
                    <td className="py-3 text-center text-slate-400">0%</td>
                    <td className="py-3 text-center text-slate-400">₹0</td>
                    <td className="py-3 text-center text-slate-400">₹0</td>
                    <td className="py-3 text-right font-bold text-emerald-400">₹0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. TARGET VS ACHIEVED — OCTOBER 2026 */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Target vs achieved — October 2026</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Set against this month, whatever period is selected above.</p>

            <div className="py-8 text-center text-[12.5px] text-slate-400 space-y-2">
              <div>No targets set for this month.</div>
              <div>
                <button
                  onClick={() => setTargetModalOpen(true)}
                  className="text-blue-400 font-semibold hover:underline cursor-pointer"
                >
                  Set targets
                </button>
              </div>
            </div>
          </div>

          {/* 4. PARTNER METRICS (4 CARDS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PARTNERS WITH ACTIVITY</div>
              <div className="text-[26px] font-bold text-white mt-1">1</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">BUSINESS SOURCED</div>
              <div className="text-[26px] font-bold text-white mt-1">₹0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PAYOUT OWED</div>
              <div className="text-[26px] font-bold text-amber-400 mt-1">₹0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PAYOUT RELEASED</div>
              <div className="text-[26px] font-bold text-emerald-400 mt-1">₹0</div>
            </div>
          </div>

          {/* 5. BY PARTNER */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">By partner</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">What each connector and sub-DSA brought in, and what they are owed for it.</p>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#182235]">
                    <th className="py-2.5">PARTNER</th>
                    <th className="py-2.5">TYPE</th>
                    <th className="py-2.5 text-center">LEADS</th>
                    <th className="py-2.5 text-center">CONV %</th>
                    <th className="py-2.5 text-center">APPLICATIONS</th>
                    <th className="py-2.5 text-center">DISBURSED</th>
                    <th className="py-2.5 text-center">AVG TICKET</th>
                    <th className="py-2.5 text-center">OWED</th>
                    <th className="py-2.5 text-right">PAID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#182235]/60 hover:bg-[#080d1a]/50">
                    <td className="py-3 font-bold text-white">ASHISH GUPTA</td>
                    <td className="py-3 text-slate-400">main dsa</td>
                    <td className="py-3 text-center font-semibold text-slate-200">1</td>
                    <td className="py-3 text-center text-slate-400">0%</td>
                    <td className="py-3 text-center text-slate-400">0</td>
                    <td className="py-3 text-center text-slate-400">₹0</td>
                    <td className="py-3 text-center text-slate-400">₹0</td>
                    <td className="py-3 text-center text-slate-400">₹0</td>
                    <td className="py-3 text-right text-slate-400">₹0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. BY LOAN TYPE */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">By loan type</h3>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#182235]">
                    <th className="py-2.5">LOAN TYPE</th>
                    <th className="py-2.5 text-center">LEADS</th>
                    <th className="py-2.5 text-center">CONV %</th>
                    <th className="py-2.5 text-center">APPLICATIONS</th>
                    <th className="py-2.5 text-center">SANCTIONED</th>
                    <th className="py-2.5 text-center">DISBURSED</th>
                    <th className="py-2.5 text-right">AVG TICKET</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#182235]/60 hover:bg-[#080d1a]/50">
                    <td className="py-3 font-bold text-white">car_loan</td>
                    <td className="py-3 text-center font-semibold text-slate-200">1</td>
                    <td className="py-3 text-center text-slate-400">0%</td>
                    <td className="py-3 text-center text-slate-400">0</td>
                    <td className="py-3 text-center text-slate-400">0</td>
                    <td className="py-3 text-center text-slate-400">₹0</td>
                    <td className="py-3 text-right text-slate-400">₹0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. BY PRODUCT */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">By product</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Approval rate is the number to watch — a product that never sanctions is costing you files.
            </p>
            <div className="py-8 text-center text-[12.5px] text-slate-400 space-y-2">
              <div>Nothing in this period.</div>
              <div>
                <Link to="/setup?tab=products" className="text-blue-400 font-semibold hover:underline">
                  Open Products
                </Link>
              </div>
            </div>
          </div>

          {/* 8. LEADS AND LOANS BY MONTH (WAVE CHART) */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight mb-4">Leads and loans by month</h3>
            <div className="h-48 w-full">
              <svg viewBox="0 0 800 160" className="w-full h-full">
                {/* Grid lines */}
                <line x1="40" y1="20" x2="760" y2="20" stroke="#182235" strokeDasharray="3 3" />
                <line x1="40" y1="55" x2="760" y2="55" stroke="#182235" strokeDasharray="3 3" />
                <line x1="40" y1="90" x2="760" y2="90" stroke="#182235" strokeDasharray="3 3" />
                <line x1="40" y1="125" x2="760" y2="125" stroke="#334155" />

                {/* Y Axis */}
                <text x="25" y="24" fill="#64748b" fontSize="10">4</text>
                <text x="25" y="59" fill="#64748b" fontSize="10">3</text>
                <text x="25" y="94" fill="#64748b" fontSize="10">2</text>
                <text x="25" y="129" fill="#64748b" fontSize="10">0</text>

                {/* Smooth wave path for leads */}
                <path
                  d="M 40 125 C 200 125, 350 125, 450 100 C 530 85, 570 95, 620 115 C 670 125, 710 115, 760 95"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />
                <line x1="40" y1="125" x2="760" y2="125" stroke="#10b981" strokeWidth="2" />

                {/* X Axis */}
                <text x="40" y="142" fill="#94a3b8" fontSize="10">05</text>
                <text x="180" y="142" fill="#94a3b8" fontSize="10">06</text>
                <text x="320" y="142" fill="#94a3b8" fontSize="10">07</text>
                <text x="470" y="142" fill="#94a3b8" fontSize="10">08</text>
                <text x="610" y="142" fill="#94a3b8" fontSize="10">09</text>
                <text x="760" y="142" fill="#94a3b8" fontSize="10">10</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: ACCOUNTS (Screenshot 13)
         ========================================================================= */}
      {activeTab === "accounts" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {/* 1. 4 STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">DISBURSED</div>
              <div className="text-[26px] font-bold text-white mt-1">₹0</div>
              <div className="text-[11px] text-slate-400 mt-1">0% vs prev</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">COMMISSION EARNED</div>
              <div className="text-[26px] font-bold text-emerald-400 mt-1">₹0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">RECEIVED</div>
              <div className="text-[26px] font-bold text-white mt-1">₹0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">STILL DUE</div>
              <div className="text-[26px] font-bold text-amber-400 mt-1">₹0</div>
            </div>
          </div>

          {/* 2. TWO MONTHLY CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Disbursement by month */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-white tracking-tight">Disbursement by month</h3>
              <div className="py-12 text-center text-[12.5px] text-slate-400 space-y-2">
                <div>No disbursements recorded.</div>
                <div>
                  <Link to="/reports?tab=disbursements" className="text-blue-400 font-semibold hover:underline">
                    Open Disbursements
                  </Link>
                </div>
              </div>
            </div>

            {/* Commission earned by month */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-white tracking-tight">Commission earned by month</h3>
              <div className="py-12 text-center text-[12.5px] text-slate-400 space-y-2">
                <div>No commission booked yet.</div>
                <div>
                  <Link to="/reports?tab=pay-in" className="text-blue-400 font-semibold hover:underline">
                    Open Commissions
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. DISBURSEMENT DETAIL */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Disbursement detail</h3>
            <div className="py-12 text-center text-[12.5px] text-slate-400">
              Nothing to show.
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: HRM (Screenshots 14, 15)
         ========================================================================= */}
      {activeTab === "hrm" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {/* 1. 4 STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ON THE PAYROLL</div>
              <div className="text-[26px] font-bold text-white mt-1">0</div>
              <div className="text-[11px] text-slate-400 mt-1">with a salary structure</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">MONTHLY NET</div>
              <div className="text-[26px] font-bold text-white mt-1">₹0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">LEAVE TO APPROVE</div>
              <div className="text-[26px] font-bold text-white mt-1">0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CONVEYANCE PENDING</div>
              <div className="text-[26px] font-bold text-white mt-1">0</div>
            </div>
          </div>

          {/* 2. ATTENDANCE — 2026-10 */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Attendance — 2026-10</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Days present and average hours, this month.</p>
            <div className="py-12 text-center text-[12.5px] text-slate-400 space-y-2">
              <div>Nobody has marked attendance this month.</div>
              <div>
                <Link to="/hr" className="text-blue-400 font-semibold hover:underline">
                  Open HR
                </Link>
              </div>
            </div>
          </div>

          {/* 3. LEAVE WAITING ON YOU */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Leave waiting on you</h3>
            <div className="py-12 text-center text-[12.5px] text-slate-400">
              Nothing waiting for approval.
            </div>
          </div>

          {/* 4. CONVEYANCE CLAIMS & SALARY STRUCTURES (2 CARDS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Conveyance claims */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-white tracking-tight">Conveyance claims</h3>
              <div className="py-12 text-center text-[12.5px] text-slate-400 space-y-2">
                <div>No claims raised.</div>
                <div>
                  <Link to="/team?tab=approvals" className="text-blue-400 font-semibold hover:underline">
                    Open Approvals
                  </Link>
                </div>
              </div>
            </div>

            {/* Salary structures */}
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-white tracking-tight">Salary structures</h3>
              <p className="text-[12px] text-slate-400 mt-0.5">Net pay per month, as configured.</p>
              <div className="py-10 text-center text-[12.5px] text-slate-400 space-y-2">
                <div>No salary structures set up.</div>
                <div>
                  <Link to="/reports?tab=salary" className="text-blue-400 font-semibold hover:underline">
                    Open Payroll
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: MARKET (Screenshots 16, 17, 18)
         ========================================================================= */}
      {activeTab === "market" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {/* 1. 4 STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TERRITORIES ACTIVE</div>
              <div className="text-[26px] font-bold text-white mt-1">1</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">STATES WITH LEADS</div>
              <div className="text-[26px] font-bold text-white mt-1">1</div>
              <div className="text-[11px] text-slate-400 mt-1">1 cities</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TOP BY VALUE</div>
              <div className="text-[26px] font-bold text-white mt-1">Gujarat</div>
              <div className="text-[11px] text-slate-400 mt-1">₹0</div>
            </div>

            <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">BEST CONVERTING</div>
              <div className="text-[26px] font-bold text-slate-400 mt-1">—</div>
              <div className="text-[11px] text-slate-400 mt-1">needs 5+ leads to rank</div>
            </div>
          </div>

          {/* 2. EVERY LEAD ON THE MAP (INDIA VECTOR MAP) */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div>
                <h3 className="text-[14px] font-bold text-white tracking-tight">Every lead on the map</h3>
                <p className="text-[12px] text-slate-400 mt-0.5">By city. Bigger dots are more leads.</p>
              </div>
            </div>

            {/* Dark Map Container (Screenshot 16 & 17) */}
            <div className="rounded-xl bg-[#1e2538] border border-[#2b354d] p-4 mt-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-200">Lead geography</h4>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">MAPPED LEADS</div>
                  <div className="text-[22px] font-bold text-white leading-none">0</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">+1 from unrecognised cities</div>
                </div>
              </div>

              {/* Vector Map Canvas */}
              <div className="relative w-full max-w-[500px] h-[340px] mx-auto my-2 flex items-center justify-center">
                <svg viewBox="0 0 360 330" className="w-full h-full drop-shadow-lg">
                  {/* Outer glow filter */}
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* India Polygon */}
                  <polygon
                    points={INDIA_POLY.map(([lon, lat]) => projectLonLat(lon, lat).map((v) => v.toFixed(1)).join(",")).join(" ")}
                    fill="#111625"
                    stroke="#2e3b55"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  {/* Highlight Gujarat state area */}
                  <circle cx="85" cy="155" r="14" fill="#10b981" opacity="0.25" filter="url(#glow)" />
                  <circle cx="85" cy="155" r="5" fill="#10b981" />
                  <circle cx="85" cy="155" r="9" fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-ping opacity-75" />
                  <text x="85" y="180" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Gujarat (1 Lead)
                  </text>
                </svg>

                {/* Centered overlay text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[12px] font-medium text-slate-400 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs">
                    No mapped leads yet
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CONVERSION BY TERRITORY */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Conversion by territory</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Territories with at least five leads — below that a single deal swings the rate to 100%.
            </p>
            <div className="py-10 text-center text-[12.5px] text-slate-400 space-y-2">
              <div>No territory has enough leads yet to compare.</div>
              <div>
                <Link to="/setup?tab=pin-codes" className="text-blue-400 font-semibold hover:underline">
                  Open Territories
                </Link>
              </div>
            </div>
          </div>

          {/* 4. BUSINESS BY TERRITORY (Screenshot 18) */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Business by territory</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Sorted by money disbursed, not by lead count — volume and value are not the same story.
            </p>

            <div className="mt-4 flex items-center gap-4 text-[12.5px]">
              <span className="w-24 text-slate-300 font-medium">Gujarat</span>
              <div className="flex-1 h-3 bg-[#080d1a] rounded-full overflow-hidden border border-[#182235]">
                <div className="h-full bg-emerald-500 rounded-full w-12" />
              </div>
              <span className="font-bold text-white">₹0</span>
            </div>
          </div>

          {/* 5. TERRITORY DETAIL */}
          <div className="rounded-xl bg-[#0c1220] border border-[#182235] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Territory detail</h3>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#182235]">
                    <th className="py-2.5">TERRITORY</th>
                    <th className="py-2.5 text-center">LEADS</th>
                    <th className="py-2.5 text-center">CONVERTED</th>
                    <th className="py-2.5 text-center">CONV %</th>
                    <th className="py-2.5 text-center">APPLICATIONS</th>
                    <th className="py-2.5 text-center">SANCTIONED</th>
                    <th className="py-2.5 text-center">DISBURSED</th>
                    <th className="py-2.5 text-right">AVG TICKET</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#182235]/60 hover:bg-[#080d1a]/50">
                    <td className="py-3 font-bold text-white">Gujarat</td>
                    <td className="py-3 text-center font-semibold text-slate-200">1</td>
                    <td className="py-3 text-center text-slate-400">0</td>
                    <td className="py-3 text-center text-slate-400">0%</td>
                    <td className="py-3 text-center text-slate-400">0</td>
                    <td className="py-3 text-center text-slate-400">0</td>
                    <td className="py-3 text-center text-slate-400">₹0</td>
                    <td className="py-3 text-right text-slate-400">₹0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: TARGET SETTER (Interactive Modal)
         ========================================================================= */}
      {targetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#0c1220] border border-[#1e293b] rounded-2xl w-full max-w-md p-5 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-blue-400" />
                <h3 className="text-base font-bold text-white">Set Monthly Targets — October 2026</h3>
              </div>
              <button
                onClick={() => setTargetModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveTargets} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Leads (Count)</label>
                <input
                  type="number"
                  value={targetForm.leads}
                  onChange={(e) => setTargetForm({ ...targetForm, leads: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#182235] text-white focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="e.g. 25"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Applications (Files)</label>
                <input
                  type="number"
                  value={targetForm.apps}
                  onChange={(e) => setTargetForm({ ...targetForm, apps: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#182235] text-white focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="e.g. 15"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Sanction Volume (₹)</label>
                <input
                  type="number"
                  value={targetForm.sanctioned}
                  onChange={(e) => setTargetForm({ ...targetForm, sanctioned: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#182235] text-white focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="e.g. 2500000"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Disbursement Volume (₹)</label>
                <input
                  type="number"
                  value={targetForm.disbursed}
                  onChange={(e) => setTargetForm({ ...targetForm, disbursed: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#182235] text-white focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="e.g. 2000000"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Commission Retained (₹)</label>
                <input
                  type="number"
                  value={targetForm.commission}
                  onChange={(e) => setTargetForm({ ...targetForm, commission: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#182235] text-white focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="e.g. 50000"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setTargetModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#131b2e] text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Save Targets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ONBOARDING CALL BOOKING (Interactive Modal)
         ========================================================================= */}
      {onboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#0c1220] border border-[#1e293b] rounded-2xl w-full max-w-lg p-5 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-amber-400" />
                <h3 className="text-base font-bold text-white">Book Free 1-on-1 Onboarding Walkthrough</h3>
              </div>
              <button
                onClick={() => setOnboardingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleBookOnboarding} className="space-y-3.5 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <div className="font-bold flex items-center gap-1.5 text-[12.5px]">
                  <span>🎓 60-Minute Guided Expert Session</span>
                </div>
                <p className="text-[11.5px] text-amber-200/80 mt-1 leading-relaxed">
                  A certified product architect will walk through your workspace configuration, lead channels, scheme feeds, commission payout rules, and custom integrations.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Date</label>
                <select
                  value={onboardingSlot.date}
                  onChange={(e) => setOnboardingSlot({ ...onboardingSlot, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#182235] text-white focus:outline-none focus:border-blue-500"
                >
                  <option>Tomorrow, 22 Oct 2026</option>
                  <option>Friday, 23 Oct 2026</option>
                  <option>Monday, 26 Oct 2026</option>
                  <option>Tuesday, 27 Oct 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Time Slot</label>
                <select
                  value={onboardingSlot.time}
                  onChange={(e) => setOnboardingSlot({ ...onboardingSlot, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#182235] text-white focus:outline-none focus:border-blue-500"
                >
                  <option>11:00 AM - 12:00 PM IST</option>
                  <option>2:30 PM - 3:30 PM IST</option>
                  <option>4:00 PM - 5:00 PM IST</option>
                  <option>6:00 PM - 7:00 PM IST</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Mobile</label>
                  <input
                    type="text"
                    value={onboardingSlot.mobile}
                    onChange={(e) => setOnboardingSlot({ ...onboardingSlot, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#182235] text-white focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Email</label>
                  <input
                    type="email"
                    value={onboardingSlot.email}
                    onChange={(e) => setOnboardingSlot({ ...onboardingSlot, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080d1a] border border-[#182235] text-white focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setOnboardingModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#131b2e] text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  <span>Confirm Slot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ACHIEVEMENT DETAILS MODAL
         ========================================================================= */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#0c1220] border border-[#1e293b] rounded-2xl w-full max-w-sm p-5 text-slate-100 shadow-2xl text-center animate-in zoom-in-95 duration-150">
            <div className="text-[44px] mb-2">{selectedAchievement.icon}</div>
            <h3 className="text-lg font-bold text-white">{selectedAchievement.name}</h3>
            <p className="text-[12px] text-slate-300 mt-2 leading-relaxed">
              {selectedAchievement.desc}
            </p>

            <div className="mt-4 p-2.5 rounded-xl bg-[#080d1a] border border-[#182235]">
              <span className="text-[11px] font-semibold text-slate-400">STATUS: </span>
              {selectedAchievement.earned ? (
                <span className="text-[11px] font-bold text-emerald-400">UNLOCKED & EARNED</span>
              ) : (
                <span className="text-[11px] font-bold text-amber-400">LOCKED (In Progress)</span>
              )}
            </div>

            <button
              onClick={() => setSelectedAchievement(null)}
              className="mt-5 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
