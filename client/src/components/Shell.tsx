import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Sparkles, Users, SlidersHorizontal, BarChart3,
  Wallet, ChevronDown, ChevronRight, ChevronLeft, Phone, Headphones, Bell, Lightbulb,
  LogOut, Plus, Search, X, CheckCircle2, Send, Bot, FileText, Check,
  Briefcase, DollarSign, RefreshCw, HelpCircle, MessageSquare, Megaphone,
  Activity, PanelLeftClose, PanelLeftOpen, UserCheck, Calendar, Plane, Download
} from "lucide-react";
import { api, fmtInr } from "../lib/api";
import { useAuth } from "../lib/auth";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  // Secondary sidebar filter search states
  const [setupSearch, setSetupSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [reportsSearch, setReportsSearch] = useState("");
  const [crmSearch, setCrmSearch] = useState("");
  const [financeSearch, setFinanceSearch] = useState("");
  const [hrSearch, setHrSearch] = useState("");
  const [marketSearch, setMarketSearch] = useState("");
  const [helpSearch, setHelpSearch] = useState("");

  // Determine active section for secondary sidebar panel
  const isSetup =
    loc.pathname.startsWith("/setup") ||
    loc.pathname.startsWith("/masters");

  const isTeam =
    loc.pathname.startsWith("/team") ||
    loc.pathname === "/partners" ||
    loc.pathname === "/employees" ||
    loc.pathname === "/team-tree" ||
    loc.pathname === "/suppliers" ||
    loc.pathname === "/banker-master";

  const isReports = loc.pathname.startsWith("/reports") || loc.pathname.startsWith("/gn/reports");
  const isScorecard = loc.pathname.startsWith("/scorecard");
  const isWallet = loc.pathname.startsWith("/wallet");
  const isChat = loc.pathname.startsWith("/chat");
  const isNoticeBoard = loc.pathname.startsWith("/notice-board") || loc.pathname === "/notices";

  const isCrm =
    loc.pathname.startsWith("/crm") ||
    loc.pathname === "/loans" ||
    loc.pathname.startsWith("/loans/") ||
    loc.pathname === "/leads" ||
    loc.pathname.startsWith("/leads/") ||
    loc.pathname === "/cross-selling" ||
    loc.pathname === "/new-applicant" ||
    loc.pathname === "/applicant/new" ||
    loc.pathname === "/co/new";

  const isFinance =
    loc.pathname.startsWith("/finance") ||
    loc.pathname.startsWith("/payouts") ||
    loc.pathname.startsWith("/payin") ||
    loc.pathname === "/accounting";

  const isHr = loc.pathname.startsWith("/hr");

  const isMarketing = false; // Direct full-width page

  const isHelp = false; // Direct full-width page

  // Secondary Sidebar Sub-Items matching Teleport Setup Hub exactly
  const SETUP_MASTERS = [
    { id: "banks", label: "Banks", path: "/setup?tab=banks" },
    { id: "branches", label: "Bank Branch", path: "/setup?tab=branches" },
    { id: "products", label: "Products", path: "/setup?tab=products" },
    { id: "insurance", label: "Insurance Companies", path: "/setup?tab=insurance" },
    { id: "parent-dsas", label: "Parent DSA Master", path: "/setup?tab=parent-dsas" },
    { id: "dsa-codes", label: "DSA Code Master", path: "/setup?tab=dsa-codes" },
    { id: "scheme-feed", label: "Scheme Feed", path: "/setup?tab=scheme-feed" },
    { id: "schemes", label: "Schemes", path: "/setup?tab=schemes" },
    { id: "payout-structure", label: "Payout Structure", path: "/setup?tab=payout-structure" },
    { id: "customer-profiles", label: "Customer Profile", path: "/setup?tab=customer-profiles" },
    { id: "pin-codes", label: "Pin Code Master", path: "/setup?tab=pin-codes" },
    { id: "team-targets", label: "Team target", path: "/setup?tab=team-targets" },
  ];

  const SETUP_CONFIG = [
    { id: "whatsapp", label: "WhatsApp", path: "/setup?tab=whatsapp" },
    { id: "meta", label: "Meta / Facebook", path: "/setup?tab=meta" },
    { id: "google-ads", label: "Google Ads", path: "/setup?tab=google-ads" },
    { id: "ivr", label: "IVR", path: "/setup?tab=ivr" },
    { id: "smtp", label: "Email / SMTP", path: "/setup?tab=smtp" },
    { id: "razorpay", label: "Razorpay", path: "/setup?tab=razorpay" },
    { id: "custom-status", label: "Custom Status", path: "/setup?tab=custom-status" },
    { id: "lead-sources", label: "Lead Sources", path: "/setup?tab=lead-sources" },
    { id: "partner-types", label: "Partner Types", path: "/setup?tab=partner-types" },
    { id: "field-customisation", label: "Field Customisation", path: "/setup?tab=field-customisation" },
    { id: "assignment-rules", label: "Assignment Rules", path: "/setup?tab=assignment-rules" },
    { id: "product-verticals", label: "Product Verticals", path: "/setup?tab=product-verticals" },
    { id: "notifications", label: "Notifications", path: "/setup?tab=notifications" },
    { id: "theme-navigation", label: "Theme & Navigation", path: "/setup?tab=theme-navigation" },
    { id: "pdd-alerts", label: "PDD Alerts", path: "/setup?tab=pdd-alerts" },
    { id: "credit-report-policy", label: "Credit Report Policy", path: "/setup?tab=credit-report-policy" },
    { id: "invoice-format", label: "Invoice Format", path: "/setup?tab=invoice-format" },
    { id: "co-branding", label: "Co-Branding", path: "/setup?tab=co-branding" },
    { id: "website", label: "Website", path: "/setup?tab=website" },
    { id: "integrations", label: "Integrations", path: "/setup?tab=integrations" },
  ];

  const SETUP_HR = [
    { id: "leave-types", label: "Leave Types", path: "/setup?tab=leave-types" },
    { id: "assign-leave-balance", label: "Assign Leave Balance", path: "/setup?tab=assign-leave-balance" },
    { id: "holidays", label: "Holidays", path: "/setup?tab=holidays" },
    { id: "approval-chains", label: "Approval Chains", path: "/setup?tab=approval-chains" },
    { id: "office-timings", label: "Office Timings", path: "/setup?tab=office-timings" },
    { id: "salary-components", label: "Salary Components", path: "/setup?tab=salary-components" },
    { id: "salary-structure", label: "Salary Structure", path: "/setup?tab=salary-structure" },
    { id: "incentives", label: "Incentives", path: "/setup?tab=incentives" },
    { id: "conveyance", label: "Conveyance", path: "/setup?tab=conveyance" },
  ];

  const SETUP_SETTINGS = [
    { id: "roles-permissions", label: "Roles & Permissions", path: "/setup?tab=roles-permissions" },
    { id: "company-invoice", label: "Company / Invoice", path: "/setup?tab=company-invoice" },
    { id: "api-access", label: "API Access", path: "/setup?tab=api-access" },
    { id: "start-fresh", label: "Start Fresh", path: "/setup?tab=start-fresh" },
  ];

  const filteredSetupMasters = useMemo(
    () => SETUP_MASTERS.filter((i) => !setupSearch || i.label.toLowerCase().includes(setupSearch.toLowerCase())),
    [setupSearch]
  );

  const filteredSetupConfig = useMemo(
    () => SETUP_CONFIG.filter((i) => !setupSearch || i.label.toLowerCase().includes(setupSearch.toLowerCase())),
    [setupSearch]
  );

  const filteredSetupHr = useMemo(
    () => SETUP_HR.filter((i) => !setupSearch || i.label.toLowerCase().includes(setupSearch.toLowerCase())),
    [setupSearch]
  );

  const filteredSetupSettings = useMemo(
    () => SETUP_SETTINGS.filter((i) => !setupSearch || i.label.toLowerCase().includes(setupSearch.toLowerCase())),
    [setupSearch]
  );

  // Secondary Sidebar Sub-Items matching Teleport Team section exactly
  const TEAM_PEOPLE = [
    { id: "employees", label: "Employees", path: "/team?tab=employees" },
    { id: "partners", label: "Partners", path: "/team?tab=partners" },
    { id: "tree", label: "Team Tree", path: "/team?tab=tree" },
    { id: "suppliers", label: "Supplier (Vendor)", path: "/team?tab=suppliers" },
    { id: "bankers", label: "Banker", path: "/team?tab=bankers" },
  ];

  const TEAM_TOOLS = [
    { id: "approvals", label: "Approvals", path: "/team?tab=approvals" },
    { id: "tasks", label: "Tasks", path: "/team?tab=tasks" },
    { id: "bulk-import", label: "Bulk Lead Import", path: "/team?tab=bulk-import" },
    { id: "bulk-assign", label: "Bulk Lead Assign", path: "/team?tab=bulk-assign" },
    { id: "tools", label: "Tools", path: "/team?tab=tools" },
  ];

  const filteredTeamPeople = useMemo(
    () => TEAM_PEOPLE.filter((i) => !teamSearch || i.label.toLowerCase().includes(teamSearch.toLowerCase())),
    [teamSearch]
  );

  const filteredTeamTools = useMemo(
    () => TEAM_TOOLS.filter((i) => !teamSearch || i.label.toLowerCase().includes(teamSearch.toLowerCase())),
    [teamSearch]
  );

  // Secondary Sidebar Sub-Items matching Teleport Reports Hub exactly (39 reports across 6 sections)
  const REPORTS_SALES = [
    { id: "lead-analysis", label: "Lead Analysis", path: "/reports?tab=lead-analysis", tooltip: "Inflow, conversion, status mix, drop-offs" },
    { id: "loan-pipeline", label: "Loan Pipeline", path: "/reports?tab=loan-pipeline", tooltip: "Applications across stages with stuck-case alerts" },
    { id: "case-review", label: "Case Review", path: "/reports?tab=case-review", tooltip: "Per-case tracker: product, branch, RO, lender, sourcing channel, status & last remark" },
    { id: "rejected-case-mis", label: "Rejected Case MIS", path: "/reports?tab=rejected-case-mis", tooltip: "Every rejected file with reason, rejected date, by whom, bank & DSA" },
    { id: "tat-analysis", label: "TAT Analysis", path: "/reports?tab=tat-analysis", tooltip: "Time spent in each lead and loan app status" },
    { id: "sales-person", label: "Sales Person", path: "/reports?tab=sales-person", tooltip: "Per-employee leads, conversions, revenue" },
    { id: "dial-report", label: "Dial Report", path: "/reports?tab=dial-report", tooltip: "Call volumes, connected calls, talk time, dispositions and agent reach" },
    { id: "client-visit-report", label: "Client Visit Report", path: "/reports?tab=client-visit-report", tooltip: "Field visits logged, location pins, customer discussions and next actions" },
    { id: "target-vs-achieved", label: "Target vs Achieved", path: "/reports?tab=target-vs-achieved", tooltip: "Monthly logins, volume and commission goals vs actual achievement" },
    { id: "sales-partner", label: "Sales Partner", path: "/reports?tab=sales-partner", tooltip: "DSA and connector-wise login counts, approval rates and payouts" },
  ];

  const REPORTS_MARKETING = [
    { id: "lead-sources", label: "Lead Sources", path: "/reports?tab=lead-sources", tooltip: "Inflow and conversions mapped to Meta, Google, Organic & Referrals" },
    { id: "campaign-performance", label: "Campaign Performance", path: "/reports?tab=campaign-performance", tooltip: "Ad campaigns, click-throughs, lead volume and cost per lead (CPL)" },
    { id: "ad-performance", label: "Ad Performance", path: "/reports?tab=ad-performance", tooltip: "Ad sets, creatives, impressions and ROAS across platforms" },
  ];

  const REPORTS_FINANCE = [
    { id: "pay-in", label: "Pay-in (Commission)", path: "/reports?tab=pay-in", tooltip: "Bank payout accruals, expected commission and rate grids" },
    { id: "disbursements", label: "Disbursements", path: "/reports?tab=disbursements", tooltip: "Realized loan disbursals, loan accounts and lender splits" },
    { id: "receivable", label: "Receivable", path: "/reports?tab=receivable", tooltip: "Aging receivables from partner banks and parent DSAs" },
    { id: "payable", label: "Payable", path: "/reports?tab=payable", tooltip: "Outstanding payables to suppliers / parties" },
    { id: "income", label: "Income", path: "/reports?tab=income", tooltip: "Net revenue recognized across lending products and streams" },
    { id: "expense", label: "Expense", path: "/reports?tab=expense", tooltip: "Operating overheads, server fees, verification costs and conveyance" },
    { id: "payments", label: "Payments", path: "/reports?tab=payments", tooltip: "Transaction histories, gateway fees (Razorpay) and UTR tracking" },
    { id: "sales-net-revenue", label: "Sales Net Revenue", path: "/reports?tab=sales-net-revenue", tooltip: "Net retention margin after deducting partner splits and taxes" },
    { id: "bank-wise", label: "Bank-wise", path: "/reports?tab=bank-wise", tooltip: "Lender portfolio distribution and relative commission yield" },
    { id: "mis-report", label: "MIS Report", path: "/reports?tab=mis-report", tooltip: "Master financial intelligence statement with monthly trends" },
  ];

  const REPORTS_MANAGEMENT = [
    { id: "master-deal-report", label: "Master Deal Report", path: "/reports?tab=master-deal-report", tooltip: "End-to-end deal ledger with all borrower and loan metadata" },
    { id: "headline-summary", label: "Headline Summary", path: "/reports?tab=headline-summary", tooltip: "Executive top-line metrics, conversion ratios and year-on-year growth" },
    { id: "monthly-performance", label: "Monthly Performance", path: "/reports?tab=monthly-performance", tooltip: "Month-on-month trend analysis, seasonality and run-rates" },
    { id: "hierarchy-summary", label: "Hierarchy Summary", path: "/reports?tab=hierarchy-summary", tooltip: "Branch, regional cluster and managerial unit rollups" },
    { id: "lender-wise", label: "Lender-wise", path: "/reports?tab=lender-wise", tooltip: "Portfolio risk distribution and sanction velocities per bank" },
    { id: "nr-analysis", label: "NR Analysis", path: "/reports?tab=nr-analysis", tooltip: "Net revenue realization yields and commission spread per loan type" },
    { id: "pl-trackers", label: "P&L Trackers", path: "/reports?tab=pl-trackers", tooltip: "Profit & loss statements for current FY with quarterly breakdown" },
  ];

  const REPORTS_CATALOGUE = [
    { id: "category", label: "Category", path: "/reports?tab=category", tooltip: "Loan category mix: Personal, Business, Home, LAP, Used Car" },
    { id: "product-wise", label: "Product-wise", path: "/reports?tab=product-wise", tooltip: "Detailed metrics per bank product, average tickets and tenors" },
    { id: "territory", label: "Territory", path: "/reports?tab=territory", tooltip: "Branch coverage, regional distribution and pin code mapping" },
    { id: "lead-geography", label: "Lead Geography", path: "/reports?tab=lead-geography", tooltip: "State and district heatmap of incoming borrower inquiries" },
  ];

  const REPORTS_HR = [
    { id: "attendance", label: "Attendance", path: "/reports?tab=attendance", tooltip: "Daily check-ins, punch timings, late marks and hours logged" },
    { id: "attendance-ledger", label: "Attendance Ledger", path: "/reports?tab=attendance-ledger", tooltip: "Monthly employee muster roll, present days and deductions" },
    { id: "leaves", label: "Leaves", path: "/reports?tab=leaves", tooltip: "Casual, sick, earned leave balances and leaves consumed" },
    { id: "salary", label: "Salary", path: "/reports?tab=salary", tooltip: "CTC breakups, gross salaries, PF/PT deductions and net pay" },
    { id: "conveyance", label: "Conveyance", path: "/reports?tab=conveyance", tooltip: "Field kilometer logs, fuel claims and travel reimbursements" },
  ];

  const filteredReportsSales = useMemo(
    () => REPORTS_SALES.filter((i) => !reportsSearch || i.label.toLowerCase().includes(reportsSearch.toLowerCase())),
    [reportsSearch]
  );
  const filteredReportsMarketing = useMemo(
    () => REPORTS_MARKETING.filter((i) => !reportsSearch || i.label.toLowerCase().includes(reportsSearch.toLowerCase())),
    [reportsSearch]
  );
  const filteredReportsFinance = useMemo(
    () => REPORTS_FINANCE.filter((i) => !reportsSearch || i.label.toLowerCase().includes(reportsSearch.toLowerCase())),
    [reportsSearch]
  );
  const filteredReportsManagement = useMemo(
    () => REPORTS_MANAGEMENT.filter((i) => !reportsSearch || i.label.toLowerCase().includes(reportsSearch.toLowerCase())),
    [reportsSearch]
  );
  const filteredReportsCatalogue = useMemo(
    () => REPORTS_CATALOGUE.filter((i) => !reportsSearch || i.label.toLowerCase().includes(reportsSearch.toLowerCase())),
    [reportsSearch]
  );
  const filteredReportsHr = useMemo(
    () => REPORTS_HR.filter((i) => !reportsSearch || i.label.toLowerCase().includes(reportsSearch.toLowerCase())),
    [reportsSearch]
  );

  // Secondary Sidebar Sub-Items matching Teleport CRM exactly
  const CRM_SUBITEMS = [
    { id: "new-applicant", label: "✨ New Applicant (Intake)", path: "/new-applicant" },
    { id: "commitments", label: "Login Commitments", path: "/crm/commitments" },
    { id: "all", label: "All Applications", path: "/crm/all" },
    { id: "leads", label: "Leads", path: "/leads" },
    { id: "loans", label: "Loan Applications", path: "/loans" },
    { id: "sanction", label: "Sanctioned Loans", path: "/crm/sanction" },
    { id: "disbursement", label: "Disbursement", path: "/crm/disbursement" },
    { id: "pdd", label: "PDD", path: "/crm/pdd" },
    { id: "cross-selling", label: "Cross Selling", path: "/cross-selling" },
    { id: "direct-booking", label: "Direct Booking", path: "/crm/direct-booking" },
    { id: "agreements", label: "Agreements", path: "/crm/agreements" },
  ];

  const HRMS_SUBITEMS = [
    { id: "my-attendance", label: "My Attendance", path: "/hr" },
    { id: "recruitment", label: "Recruitment", path: "/hr/recruitment" },
    { id: "attendance", label: "Attendance", path: "/hr/all-attendance" },
    { id: "leave", label: "Leave", path: "/hr/leave" },
    { id: "slips", label: "Salary Slips", path: "/hr/slips" },
    { id: "payroll", label: "Payroll", path: "/hr/payroll" },
    { id: "conveyance", label: "Conveyance", path: "/hr/conveyance" },
    { id: "settings", label: "HR Settings", path: "/hr/settings" },
  ];

  const FINANCE_SUBITEMS = [
    { id: "income", label: "Income", path: "/finance/income" },
    { id: "received", label: "Payment (Received)", path: "/finance/received" },
    { id: "receivable", label: "Receivable", path: "/finance/receivable" },
    { id: "parent-dsa", label: "Parent DSA", path: "/finance/parent-dsa" },
    { id: "fees", label: "Customer Fees", path: "/finance/fees" },
    { id: "expenses", label: "Expenses", path: "/payouts" },
    { id: "payable", label: "Payment (Payable)", path: "/payouts/payable" },
    { id: "paid", label: "Payment (Paid)", path: "/payouts/paid" },
    { id: "accounting", label: "Accounting", path: "/accounting" },
  ];

  const MARKETING_SUBITEMS = [
    { id: "campaigns", label: "Campaigns", path: "/marketing/campaigns" },
    { id: "workflows", label: "Workflow Builder", path: "/marketing/workflows" },
    { id: "ivr", label: "IVR", path: "/marketing/ivr" },
    { id: "inbox", label: "Inbox", path: "/marketing/inbox" },
    { id: "drips", label: "WhatsApp Drips", path: "/marketing/drips" },
    { id: "templates", label: "Templates", path: "/marketing/templates" },
    { id: "banners", label: "Banners", path: "/marketing/banners" },
    { id: "franchise", label: "Franchise", path: "/marketing/franchise" },
  ];

  const HELP_SUBITEMS = [
    { id: "docs", label: "Documentation", path: "/help/docs" },
    { id: "faq", label: "Help & FAQ", path: "/help/faq" },
    { id: "support", label: "Support", path: "/help/support" },
    { id: "training", label: "Training & Demo", path: "/help/training" },
    { id: "changelog", label: "Change Log", path: "/help/changelog" },
    { id: "whats-new", label: "What's New", path: "/help/whats-new" },
    { id: "recycle-bin", label: "Recycle Bin", path: "/help/recycle-bin" },
  ];

  const filteredCrmItems = useMemo(
    () => CRM_SUBITEMS.filter((i) => !crmSearch || i.label.toLowerCase().includes(crmSearch.toLowerCase())),
    [crmSearch]
  );

  const filteredHrItems = useMemo(
    () => HRMS_SUBITEMS.filter((i) => !hrSearch || i.label.toLowerCase().includes(hrSearch.toLowerCase())),
    [hrSearch]
  );

  const filteredFinanceItems = useMemo(
    () => FINANCE_SUBITEMS.filter((i) => !financeSearch || i.label.toLowerCase().includes(financeSearch.toLowerCase())),
    [financeSearch]
  );

  const filteredMarketingItems = useMemo(
    () => MARKETING_SUBITEMS.filter((i) => !marketSearch || i.label.toLowerCase().includes(marketSearch.toLowerCase())),
    [marketSearch]
  );

  const filteredHelpItems = useMemo(
    () => HELP_SUBITEMS.filter((i) => !helpSearch || i.label.toLowerCase().includes(helpSearch.toLowerCase())),
    [helpSearch]
  );

  // Modals & Drawers
  const [quickLeadOpen, setQuickLeadOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [tipsModalOpen, setTipsModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [primaryRailCollapsed, setPrimaryRailCollapsed] = useState(false);

  // AI Chat state
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "Namaste! I am Baadal AI, your intelligent lending co-pilot. I can instantly verify borrowers, match loan schemes across 71+ banks, and track commission payouts. How can I help you today?",
      time: "Just now"
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Quick Lead Form state
  const [leadForm, setLeadForm] = useState({
    name: "",
    mobile: "",
    loan_type: "Personal Loan",
    amount: "500000",
    pan: "",
    employment_type: "Salaried",
    city: "Mumbai"
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState<any[]>([
    { id: 1, title: "New Lead Created", body: "Omkar (8767424655) submitted Personal Loan inquiry", time: "10m ago", read: false },
    { id: 2, title: "Digitap API Connected", body: "17 Instant Verification APIs ready for execution", time: "1h ago", read: false },
    { id: 3, title: "Experian Offline Guard", body: "Demo mobile 8838864869 active with cached credit report", time: "2h ago", read: true }
  ]);
  const [unread, setUnread] = useState(2);

  // Global search
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuickLeadOpen(false);
        setAiDrawerOpen(false);
        setSupportModalOpen(false);
        setTipsModalOpen(false);
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.mobile) return;
    setLeadSubmitting(true);
    try {
      await api("/gn/applications", {
        method: "POST",
        body: {
          name: leadForm.name,
          mobile: leadForm.mobile,
          loan_type: leadForm.loan_type,
          amount: Number(leadForm.amount) || 500000,
          pan: leadForm.pan,
          status: "lead_new"
        }
      });
      setLeadSuccess(true);
      setTimeout(() => {
        setLeadSuccess(false);
        setQuickLeadOpen(false);
        setLeadForm({ name: "", mobile: "", loan_type: "Personal Loan", amount: "500000", pan: "", employment_type: "Salaried", city: "Mumbai" });
        nav("/loans");
      }, 1200);
    } catch (err: any) {
      alert("Failed to create lead: " + (err.message || "Unknown error"));
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleSendAi = (textToSend?: string) => {
    const query = textToSend || aiInput;
    if (!query.trim()) return;
    const userMsg = { sender: "user" as const, text: query, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);

    setTimeout(() => {
      let reply = "Here is what I found for your request:";
      const qLower = query.toLowerCase();
      if (qLower.includes("experian") || qLower.includes("bureau") || qLower.includes("credit")) {
        reply = "⚡ Experian Live Production Active: Real-time Credit Information Report (CIR) queries are sent to Digitap Experian Credit Analytics. Live soft bureau pulls and tradelines are fetched dynamically.";
      } else if (qLower.includes("personal loan") || qLower.includes("eligibility")) {
        reply = "📊 Personal Loan Eligibility Guide: For salaried profiles earning ₹45,000/mo with credit score >720, max FOIR is 55%. Max loan eligibility: ~₹12,50,000 with HDFC/ICICI at 10.75% ROI.";
      } else if (qLower.includes("scheme") || qLower.includes("1230")) {
        reply = "🏦 Scheme Feed Matcher: 1230 live banker schemes detected. Top commission payout currently: TVS Credit Commercial Vehicle at 2.40% and ICICI Business Loan at 1.85%.";
      } else if (qLower.includes("whatsapp") || qLower.includes("form 16")) {
        reply = "📲 WhatsApp Template Ready: 'Dear Applicant, kindly upload your Form 16 and last 3 months salary slips via this secure link to proceed with sanction.'";
      } else {
        reply = `I have analyzed "${query}". Relevant pipeline and banking rules indicate all documents are in compliance. You can run automated verification from the Verification API center.`;
      }
      setAiMessages((prev) => [...prev, { sender: "ai", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      setAiLoading(false);
    }, 800);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-[#f8fafc] font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* =========================================================================
          LEFT PRIMARY SIDEBAR (Matching Screenshots 1, 2, and 3 in crisp light mode)
         ========================================================================= */}
      <aside
        className={`${
          primaryRailCollapsed ? "w-[68px]" : "w-[248px]"
        } shrink-0 bg-[#0c1220] border-r border-[#182235] flex flex-col z-20 select-none transition-all duration-200`}
      >
        {/* Brand Header */}
        {primaryRailCollapsed ? (
          <div className="h-14 flex items-center justify-center border-b border-[#182235]">
            <button
              onClick={() => setPrimaryRailCollapsed(false)}
              className="w-11 h-11 rounded-xl bg-[#131b2e] hover:bg-[#1a253e] text-cyan-400 flex items-center justify-center border border-[#1e293b] cursor-pointer shadow-sm group transition-all"
              title="Click logo to expand double panel"
            >
              <div className="flex items-center">
                <span className="text-[17px] font-black tracking-tight text-white font-sans">T</span>
                <div className="ml-0.5 w-1.5 h-1.5 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xs transform rotate-45 -translate-y-1" />
              </div>
            </button>
          </div>
        ) : (
          <div className="h-14 flex items-center justify-between px-3.5 border-b border-[#182235]">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => nav("/dashboard")}>
              <div className="flex items-center">
                <span className="text-[19px] font-black tracking-tight text-white font-sans">
                  TELEPORT
                </span>
                <div className="ml-1 w-2.5 h-2.5 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xs transform rotate-45 -translate-y-1 shadow-xs" />
                <span className="text-[9px] font-bold text-slate-400 -translate-y-1.5 ml-0.5">®</span>
              </div>
            </div>
            <button
              onClick={() => setPrimaryRailCollapsed(true)}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#131b2e] cursor-pointer"
              title="Collapse to icons (show only logos)"
            >
              <PanelLeftClose size={17} />
            </button>
          </div>
        )}

        {/* Navigation List (1-14) */}
        {primaryRailCollapsed ? (
          /* COLLAPSED ICON RAIL: Show ONLY logos on the left; clicking expands double panel */
          <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-2 scrollbar-thin">
            {/* 1 Dashboard */}
            <NavLink
              to="/dashboard"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="1 Dashboard (Click to open double panel)"
              className={({ isActive }) =>
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isActive && !isCrm && !isFinance && !isHr && !isMarketing && !isHelp && !isSetup && !isTeam && !isReports && !isScorecard && !isWallet && !isChat && !isNoticeBoard
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <LayoutDashboard size={21} />
            </NavLink>

            {/* 2 Ask Baadal AI */}
            <button
              onClick={() => {
                setAiDrawerOpen(true);
                setPrimaryRailCollapsed(false);
              }}
              title="2 Ask Baadal AI (Click to open double panel)"
              className="w-11 h-11 mx-auto flex items-center justify-center rounded-xl text-slate-400 hover:bg-[#131b2e] hover:text-white transition-all cursor-pointer group"
            >
              <Bot size={21} className="text-blue-500 group-hover:rotate-12 transition-transform" />
            </button>

            {/* 3 Setup */}
            <NavLink
              to="/setup"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="3 Setup (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isSetup
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <SlidersHorizontal size={21} />
            </NavLink>

            {/* 4 Team */}
            <NavLink
              to="/team?tab=employees"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="4 Team (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isTeam
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Users size={21} />
            </NavLink>

            {/* 5 Reports */}
            <NavLink
              to="/reports"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="5 Reports (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isReports
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <BarChart3 size={21} />
            </NavLink>

            {/* 6 Scorecard */}
            <NavLink
              to="/scorecard"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="6 Scorecard (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isScorecard
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Activity size={21} />
            </NavLink>

            {/* 7 Wallet */}
            <NavLink
              to="/wallet"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="7 Wallet (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isWallet
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Wallet size={21} />
            </NavLink>

            {/* 8 Chat */}
            <NavLink
              to="/chat"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="8 Chat (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isChat
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <MessageSquare size={21} />
            </NavLink>

            {/* 9 Notice Board */}
            <NavLink
              to="/notice-board"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="9 Notice Board (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isNoticeBoard
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Megaphone size={21} />
            </NavLink>

            <div className="w-8 mx-auto border-t border-[#182235] my-1" />

            {/* 10 CRM */}
            <NavLink
              to="/crm/commitments"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="10 CRM (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isCrm
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Users size={21} />
            </NavLink>

            {/* 11 Finance */}
            <NavLink
              to="/finance/income"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="11 Finance (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isFinance
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <FileText size={21} />
            </NavLink>

            {/* 12 HRMS */}
            <NavLink
              to="/hr"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="12 HRMS (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isHr
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Briefcase size={21} />
            </NavLink>

            {/* 13 Marketing */}
            <NavLink
              to="/marketing"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="13 Marketing (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  loc.pathname.startsWith("/marketing")
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Megaphone size={21} />
            </NavLink>

            {/* 14 Help */}
            <NavLink
              to="/help"
              onClick={() => setPrimaryRailCollapsed(false)}
              title="14 Help (Click to open double panel)"
              className={
                `w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  loc.pathname.startsWith("/help") || loc.pathname === "/docs" || loc.pathname === "/documentation"
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <HelpCircle size={21} />
            </NavLink>
          </nav>
        ) : (
          /* EXPANDED PRIMARY SIDEBAR: Enhanced larger typography & comfortable layout */
          <nav className="flex-1 overflow-y-auto px-2 py-2.5 space-y-1 scrollbar-thin">
            {/* 1 Dashboard */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isActive && !isCrm && !isFinance && !isHr && !isMarketing && !isHelp && !isSetup && !isTeam && !isReports && !isScorecard && !isWallet && !isChat && !isNoticeBoard
                    ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <LayoutDashboard size={19} className="shrink-0" />
              <span className="truncate">1 &nbsp;Dashboard</span>
            </NavLink>

            {/* 2 Ask Baadal AI */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[16px] font-semibold text-slate-300 hover:bg-[#131b2e] hover:text-white transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3 truncate">
                <Bot size={19} className="shrink-0 text-blue-500 group-hover:rotate-12 transition-transform" />
                <span className="truncate">2 &nbsp;Ask Baadal AI</span>
              </div>
            </button>

            {/* 3 Setup > */}
            <NavLink
              to="/setup"
              className={
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isSetup
                    ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <SlidersHorizontal size={19} className={`shrink-0 ${isSetup ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">3 &nbsp;Setup</span>
              </div>
              <ChevronRight size={16} className={`shrink-0 ${isSetup ? "text-white" : "text-slate-400"}`} />
            </NavLink>

            {/* 4 Team */}
            <NavLink
              to="/team?tab=employees"
              className={
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isTeam
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Users size={19} className={`shrink-0 ${isTeam ? "text-blue-400" : "text-slate-400"}`} />
              <span className="truncate">4 &nbsp;Team</span>
            </NavLink>

            {/* 5 Reports */}
            <NavLink
              to="/reports"
              className={
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isReports
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <BarChart3 size={19} className={`shrink-0 ${isReports ? "text-blue-400" : "text-slate-400"}`} />
              <span className="truncate">5 &nbsp;Reports</span>
            </NavLink>

            {/* 6 Scorecard */}
            <NavLink
              to="/scorecard"
              className={
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isScorecard
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Activity size={19} className={`shrink-0 ${isScorecard ? "text-blue-400" : "text-slate-400"}`} />
              <span className="truncate">6 &nbsp;Scorecard</span>
            </NavLink>

            {/* 7 Wallet */}
            <NavLink
              to="/wallet"
              className={
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isWallet
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Wallet size={19} className={`shrink-0 ${isWallet ? "text-blue-400" : "text-slate-400"}`} />
              <span className="truncate">7 &nbsp;Wallet</span>
            </NavLink>

            {/* 8 Chat */}
            <NavLink
              to="/chat"
              className={
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isChat
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <MessageSquare size={19} className={`shrink-0 ${isChat ? "text-blue-400" : "text-slate-400"}`} />
              <span className="truncate">8 &nbsp;Chat</span>
            </NavLink>

            {/* 9 Notice Board */}
            <NavLink
              to="/notice-board"
              className={
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isNoticeBoard
                    ? "bg-[#18233a] text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Megaphone size={19} className={`shrink-0 ${isNoticeBoard ? "text-blue-400" : "text-slate-400"}`} />
              <span className="truncate">9 &nbsp;Notice Board</span>
            </NavLink>

            {/* Divider */}
            <div className="pt-1.5 pb-1 border-t border-[#182235] my-1" />

            {/* 10 CRM > */}
            <NavLink
              to="/crm/commitments"
              className={
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isCrm
                    ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <Users size={19} className={`shrink-0 ${isCrm ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">10 &nbsp;CRM</span>
              </div>
              <ChevronRight size={16} className={`shrink-0 ${isCrm ? "text-white" : "text-slate-400"}`} />
            </NavLink>

            {/* 11 Finance > */}
            <NavLink
              to="/finance/income"
              className={
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isFinance
                    ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <FileText size={19} className={`shrink-0 ${isFinance ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">11 &nbsp;Finance</span>
              </div>
              <ChevronRight size={16} className={`shrink-0 ${isFinance ? "text-white" : "text-slate-400"}`} />
            </NavLink>

            {/* 12 HRMS > */}
            <NavLink
              to="/hr"
              className={
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  isHr
                    ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <Briefcase size={19} className={`shrink-0 ${isHr ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">12 &nbsp;HRMS</span>
              </div>
              <ChevronRight size={16} className={`shrink-0 ${isHr ? "text-white" : "text-slate-400"}`} />
            </NavLink>

            {/* 13 Marketing */}
            <NavLink
              to="/marketing"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  loc.pathname.startsWith("/marketing")
                    ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <Megaphone size={19} className="shrink-0 text-slate-400" />
              <span className="truncate">13 &nbsp;Marketing</span>
            </NavLink>

            {/* 14 Help */}
            <NavLink
              to="/help"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                  loc.pathname.startsWith("/help") || loc.pathname === "/docs" || loc.pathname === "/documentation"
                    ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:bg-[#131b2e] hover:text-white"
                }`
              }
            >
              <HelpCircle size={19} className="shrink-0 text-slate-400" />
              <span className="truncate">14 &nbsp;Help</span>
            </NavLink>
          </nav>
        )}

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#182235] flex items-center justify-between">
          {!primaryRailCollapsed ? (
            <>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-mono bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                v2371
              </span>
              <button
                onClick={() => setPrimaryRailCollapsed(true)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#131b2e] cursor-pointer"
                title="Collapse left panel to logos (more page space)"
              >
                <PanelLeftClose size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setPrimaryRailCollapsed(false)}
              className="mx-auto text-slate-400 hover:text-white p-2 rounded-lg hover:bg-[#131b2e] cursor-pointer transition-colors"
              title="Expand double panel"
            >
              <PanelLeftOpen size={18} className="text-cyan-400" />
            </button>
          )}
        </div>
      </aside>

      {/* =========================================================================
          SECONDARY SIDEBAR PANEL (Rendered for Setup, CRM, Finance, HRMS)
         ========================================================================= */}
      {/* 3 SETUP SECONDARY SIDEBAR (Matches Screenshots 1 & 2) */}
      {isSetup && (
        <aside
          onClick={(e) => {
            if (!primaryRailCollapsed && !(e.target as HTMLElement).closest("input, textarea, select")) {
              setPrimaryRailCollapsed(true);
            }
          }}
          className="w-[252px] shrink-0 bg-[#0c1220] border-r border-[#182235] flex flex-col z-10 select-none text-slate-200 animate-in slide-in-from-left-2 duration-150 cursor-pointer"
        >
          <div className="h-10 flex items-center justify-between px-3 pt-2">
            <button
              onClick={() => nav("/setup")}
              className="flex items-center gap-1 text-[14px] font-bold text-slate-200 hover:text-white cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Sniper Electric</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPrimaryRailCollapsed(!primaryRailCollapsed);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 hover:text-white text-[11.5px] font-semibold border border-[#1e293b] cursor-pointer transition-colors"
              title={primaryRailCollapsed ? "Open double panel" : "Shift left (more space for page)"}
            >
              {primaryRailCollapsed ? (
                <>
                  <PanelLeftOpen size={13} className="text-cyan-400" />
                  <span>Double</span>
                </>
              ) : (
                <>
                  <PanelLeftClose size={13} className="text-cyan-400" />
                  <span>More Space</span>
                </>
              )}
            </button>
          </div>

          <div className="p-2 border-b border-[#182235]">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search setup..."
                value={setupSearch}
                onChange={(e) => setSetupSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-[13px] bg-[#0d1322] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin">
            {/* Group 1: MASTERS */}
            {filteredSetupMasters.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  MASTERS
                </div>
                <div className="space-y-0.5">
                  {filteredSetupMasters.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-blue-600/20 border border-blue-500/30"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Group 2: CONFIGURATION */}
            {filteredSetupConfig.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  CONFIGURATION
                </div>
                <div className="space-y-0.5">
                  {filteredSetupConfig.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-blue-600/20 border border-blue-500/30"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Group 3: HR & PAYROLL */}
            {filteredSetupHr.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  HR & PAYROLL
                </div>
                <div className="space-y-0.5">
                  {filteredSetupHr.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-blue-600/20 border border-blue-500/30"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Group 4: SETTINGS */}
            {filteredSetupSettings.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  SETTINGS
                </div>
                <div className="space-y-0.5">
                  {filteredSetupSettings.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-blue-600/20 border border-blue-500/30"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 4 TEAM SECONDARY SIDEBAR (Matches Screenshot) */}
      {isTeam && (
        <aside
          onClick={(e) => {
            if (!primaryRailCollapsed && !(e.target as HTMLElement).closest("input, textarea, select")) {
              setPrimaryRailCollapsed(true);
            }
          }}
          className="w-[252px] shrink-0 bg-[#0c1220] border-r border-[#182235] flex flex-col z-10 select-none text-slate-200 animate-in slide-in-from-left-2 duration-150 cursor-pointer"
        >
          <div className="h-10 flex items-center justify-between px-3 pt-2">
            <button
              onClick={() => nav("/team?tab=employees")}
              className="flex items-center gap-1 text-[14px] font-bold text-slate-200 hover:text-white cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Sniper Electric</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPrimaryRailCollapsed(!primaryRailCollapsed);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 hover:text-white text-[11.5px] font-semibold border border-[#1e293b] cursor-pointer transition-colors"
              title={primaryRailCollapsed ? "Open double panel" : "Shift left (more space for page)"}
            >
              {primaryRailCollapsed ? (
                <>
                  <PanelLeftOpen size={13} className="text-cyan-400" />
                  <span>Double</span>
                </>
              ) : (
                <>
                  <PanelLeftClose size={13} className="text-cyan-400" />
                  <span>More Space</span>
                </>
              )}
            </button>
          </div>

          <div className="p-2 border-b border-[#182235]">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search team..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-[13px] bg-[#0d1322] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin">
            {/* PEOPLE */}
            {filteredTeamPeople.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  PEOPLE
                </div>
                <div className="space-y-0.5">
                  {filteredTeamPeople.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || (
                      loc.pathname === "/partners" ? "partners" :
                      loc.pathname === "/team-tree" ? "tree" :
                      loc.pathname === "/suppliers" ? "suppliers" :
                      loc.pathname === "/banker-master" ? "bankers" :
                      "employees"
                    );
                    const active = currentTab === item.id;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-[#16233d] border border-blue-500/20"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TOOLS */}
            {filteredTeamTools.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  TOOLS
                </div>
                <div className="space-y-0.5">
                  {filteredTeamTools.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-[#16233d] border border-blue-500/20"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 5 REPORTS SECONDARY SIDEBAR (Matching SNIPER Dark Theme & Exact Tab Structure) */}
      {isReports && (
        <aside
          onClick={(e) => {
            if (!primaryRailCollapsed && !(e.target as HTMLElement).closest("input, textarea, select")) {
              setPrimaryRailCollapsed(true);
            }
          }}
          className="w-[252px] shrink-0 bg-[#0c1220] border-r border-[#182235] flex flex-col z-10 select-none text-slate-200 animate-in slide-in-from-left-2 duration-150 cursor-pointer"
        >
          <div className="h-10 flex items-center justify-between px-3 pt-2">
            <button
              onClick={() => nav(loc.pathname.startsWith("/gn/reports") ? "/gn/reports" : "/reports")}
              className="flex items-center gap-1 text-[14px] font-bold text-slate-200 hover:text-white cursor-pointer transition-colors"
            >
              <ChevronLeft size={15} />
              <span>Sniper Electric</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPrimaryRailCollapsed(!primaryRailCollapsed);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 hover:text-white text-[11.5px] font-semibold border border-[#1e293b] cursor-pointer transition-colors"
              title={primaryRailCollapsed ? "Open double panel" : "Shift left (more space for page)"}
            >
              {primaryRailCollapsed ? (
                <>
                  <PanelLeftOpen size={13} className="text-cyan-400" />
                  <span>Double</span>
                </>
              ) : (
                <>
                  <PanelLeftClose size={13} className="text-cyan-400" />
                  <span>More Space</span>
                </>
              )}
            </button>
          </div>

          <div className="p-2 border-b border-[#182235]">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports.."
                value={reportsSearch}
                onChange={(e) => setReportsSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-[13px] bg-[#0d1322] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin">
            {/* 1. SALES & PIPELINE */}
            {filteredReportsSales.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  SALES & PIPELINE
                </div>
                <div className="space-y-0.5">
                  {filteredReportsSales.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id || currentTab === item.id.replace(/-/g, "_") || currentTab.replace(/-/g, "_") === item.id;
                    const basePath = loc.pathname.startsWith("/gn/reports") ? "/gn/reports" : "/reports";
                    return (
                      <NavLink
                        key={item.id}
                        to={`${basePath}?tab=${item.id}`}
                        title={item.tooltip}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-[#16233d] border border-blue-500/20"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. MARKETING */}
            {filteredReportsMarketing.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  MARKETING
                </div>
                <div className="space-y-0.5">
                  {filteredReportsMarketing.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id || currentTab === item.id.replace(/-/g, "_") || currentTab.replace(/-/g, "_") === item.id;
                    const basePath = loc.pathname.startsWith("/gn/reports") ? "/gn/reports" : "/reports";
                    return (
                      <NavLink
                        key={item.id}
                        to={`${basePath}?tab=${item.id}`}
                        title={item.tooltip}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-[#16233d] border border-blue-500/20"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. FINANCE */}
            {filteredReportsFinance.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  FINANCE
                </div>
                <div className="space-y-0.5">
                  {filteredReportsFinance.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id || currentTab === item.id.replace(/-/g, "_") || currentTab.replace(/-/g, "_") === item.id;
                    const basePath = loc.pathname.startsWith("/gn/reports") ? "/gn/reports" : "/reports";
                    return (
                      <NavLink
                        key={item.id}
                        to={`${basePath}?tab=${item.id}`}
                        title={item.tooltip}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-[#16233d] border border-blue-500/20"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. MANAGEMENT PACK */}
            {filteredReportsManagement.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  MANAGEMENT PACK
                </div>
                <div className="space-y-0.5">
                  {filteredReportsManagement.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id || currentTab === item.id.replace(/-/g, "_") || currentTab.replace(/-/g, "_") === item.id;
                    const basePath = loc.pathname.startsWith("/gn/reports") ? "/gn/reports" : "/reports";
                    return (
                      <NavLink
                        key={item.id}
                        to={`${basePath}?tab=${item.id}`}
                        title={item.tooltip}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-[#16233d] border border-blue-500/20"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. CATALOGUE */}
            {filteredReportsCatalogue.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  CATALOGUE
                </div>
                <div className="space-y-0.5">
                  {filteredReportsCatalogue.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id || currentTab === item.id.replace(/-/g, "_") || currentTab.replace(/-/g, "_") === item.id;
                    const basePath = loc.pathname.startsWith("/gn/reports") ? "/gn/reports" : "/reports";
                    return (
                      <NavLink
                        key={item.id}
                        to={`${basePath}?tab=${item.id}`}
                        title={item.tooltip}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-[#16233d] border border-blue-500/20"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. HR */}
            {filteredReportsHr.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  HR
                </div>
                <div className="space-y-0.5">
                  {filteredReportsHr.map((item) => {
                    const currentTab = new URLSearchParams(loc.search).get("tab") || "";
                    const active = currentTab === item.id || currentTab === item.id.replace(/-/g, "_") || currentTab.replace(/-/g, "_") === item.id;
                    const basePath = loc.pathname.startsWith("/gn/reports") ? "/gn/reports" : "/reports";
                    return (
                      <NavLink
                        key={item.id}
                        to={`${basePath}?tab=${item.id}`}
                        title={item.tooltip}
                        onClick={() => setPrimaryRailCollapsed(true)}
                        className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                          active
                            ? "text-blue-400 font-semibold bg-[#16233d] border border-blue-500/20"
                            : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 10 CRM SECONDARY SIDEBAR (Matches Screenshot 1) */}
      {isCrm && (
        <aside
          onClick={(e) => {
            if (!primaryRailCollapsed && !(e.target as HTMLElement).closest("input, textarea, select")) {
              setPrimaryRailCollapsed(true);
            }
          }}
          className="w-[252px] shrink-0 bg-[#0c1220] border-r border-[#182235] flex flex-col z-10 select-none text-slate-200 animate-in slide-in-from-left-2 duration-150 cursor-pointer"
        >
          <div className="h-10 flex items-center justify-between px-3 pt-2">
            <button
              onClick={() => nav("/dashboard")}
              className="flex items-center gap-1 text-[14px] font-bold text-slate-200 hover:text-white cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Sniper Electric</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPrimaryRailCollapsed(!primaryRailCollapsed);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 hover:text-white text-[11.5px] font-semibold border border-[#1e293b] cursor-pointer transition-colors"
              title={primaryRailCollapsed ? "Open double panel" : "Shift left (more space for page)"}
            >
              {primaryRailCollapsed ? (
                <>
                  <PanelLeftOpen size={13} className="text-cyan-400" />
                  <span>Double</span>
                </>
              ) : (
                <>
                  <PanelLeftClose size={13} className="text-cyan-400" />
                  <span>More Space</span>
                </>
              )}
            </button>
          </div>

          <div className="p-2 border-b border-[#182235]">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search crm..."
                value={crmSearch}
                onChange={(e) => setCrmSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-[13px] bg-[#0d1322] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
            <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              CRM
            </div>
            {filteredCrmItems.map((item) => {
              const active =
                loc.pathname === item.path ||
                (item.id === "commitments" && loc.pathname === "/crm") ||
                (item.id === "loans" && loc.pathname.startsWith("/loans"));
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setPrimaryRailCollapsed(true)}
                  className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                    active
                      ? "text-blue-400 font-semibold bg-blue-600/20 border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                  }`}
                >
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </aside>
      )}

      {/* 11 FINANCE SECONDARY SIDEBAR (Matches Screenshot 3) */}
      {isFinance && (
        <aside
          onClick={(e) => {
            if (!primaryRailCollapsed && !(e.target as HTMLElement).closest("input, textarea, select")) {
              setPrimaryRailCollapsed(true);
            }
          }}
          className="w-[252px] shrink-0 bg-[#0c1220] border-r border-[#182235] flex flex-col z-10 select-none text-slate-200 animate-in slide-in-from-left-2 duration-150 cursor-pointer"
        >
          <div className="h-10 flex items-center justify-between px-3 pt-2">
            <button
              onClick={() => nav("/dashboard")}
              className="flex items-center gap-1 text-[14px] font-bold text-slate-200 hover:text-white cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Sniper Electric</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPrimaryRailCollapsed(!primaryRailCollapsed);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 hover:text-white text-[11.5px] font-semibold border border-[#1e293b] cursor-pointer transition-colors"
              title={primaryRailCollapsed ? "Open double panel" : "Shift left (more space for page)"}
            >
              {primaryRailCollapsed ? (
                <>
                  <PanelLeftOpen size={13} className="text-cyan-400" />
                  <span>Double</span>
                </>
              ) : (
                <>
                  <PanelLeftClose size={13} className="text-cyan-400" />
                  <span>More Space</span>
                </>
              )}
            </button>
          </div>

          <div className="p-2 border-b border-[#182235]">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search finance..."
                value={financeSearch}
                onChange={(e) => setFinanceSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-[13px] bg-[#0d1322] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
            <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              FINANCE
            </div>
            {filteredFinanceItems.map((item) => {
              const active =
                loc.pathname === item.path ||
                (item.id === "income" && loc.pathname === "/finance");
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setPrimaryRailCollapsed(true)}
                  className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                    active
                      ? "text-blue-400 font-semibold bg-blue-600/20 border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                  }`}
                >
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </aside>
      )}

      {/* 12 HRMS SECONDARY SIDEBAR (Matches Screenshot 2) */}
      {isHr && (
        <aside
          onClick={(e) => {
            if (!primaryRailCollapsed && !(e.target as HTMLElement).closest("input, textarea, select")) {
              setPrimaryRailCollapsed(true);
            }
          }}
          className="w-[252px] shrink-0 bg-[#0c1220] border-r border-[#182235] flex flex-col z-10 select-none text-slate-200 animate-in slide-in-from-left-2 duration-150 cursor-pointer"
        >
          <div className="h-10 flex items-center justify-between px-3 pt-2">
            <button
              onClick={() => nav("/dashboard")}
              className="flex items-center gap-1 text-[14px] font-bold text-slate-200 hover:text-white cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Sniper Electric</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPrimaryRailCollapsed(!primaryRailCollapsed);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 hover:text-white text-[11.5px] font-semibold border border-[#1e293b] cursor-pointer transition-colors"
              title={primaryRailCollapsed ? "Open double panel" : "Shift left (more space for page)"}
            >
              {primaryRailCollapsed ? (
                <>
                  <PanelLeftOpen size={13} className="text-cyan-400" />
                  <span>Double</span>
                </>
              ) : (
                <>
                  <PanelLeftClose size={13} className="text-cyan-400" />
                  <span>More Space</span>
                </>
              )}
            </button>
          </div>

          <div className="p-2 border-b border-[#182235]">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search hrms..."
                value={hrSearch}
                onChange={(e) => setHrSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-[13px] bg-[#0d1322] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
            <div className="px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              HRMS
            </div>
            {filteredHrItems.map((item) => {
              const active =
                loc.pathname === item.path ||
                (item.id === "my-attendance" && loc.pathname === "/hr");
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setPrimaryRailCollapsed(true)}
                  className={`flex items-center px-3 py-2 rounded-lg text-[14.5px] font-medium transition-colors ${
                    active
                      ? "text-blue-400 font-semibold bg-blue-600/20 border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-[#131b2e]"
                  }`}
                >
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </aside>
      )}

      {/* =========================================================================
          MAIN CONTAINER (TOP HEADER + SCROLLABLE PAGE CONTENT)
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#090d16] text-[#f8fafc]">
        {/* Top Header Bar (Matching Screenshots 1, 2, and 3) */}
        <header className="h-14 shrink-0 flex items-center justify-between px-5 gap-3 select-none z-10 bg-[#0c1220] border-b border-[#182235]">
          {/* Org Code DS101 */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-700/50 font-mono tracking-wide">
              CODE DS101
            </span>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#0d1322] hover:bg-[#131b2e] text-xs cursor-pointer transition-colors text-slate-400 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Sparkles size={11} />
                </div>
                <span className="text-slate-500">Search anything...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131b2e] border border-[#1e293b] text-slate-400">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Header Controls (Matching Screenshots 1, 2, & 3) */}
          <div className="flex items-center gap-2">
            {/* + New Applicant (Experian Auto-fill Intake) */}
            <NavLink
              to="/new-applicant"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm shadow-emerald-500/25 border border-emerald-400/30 transition-all cursor-pointer"
              title="Start New Borrower Loan Intake (Auto-fill Experian & KYC)"
            >
              <Sparkles size={13} className="text-emerald-200" />
              <span>+ New Applicant</span>
            </NavLink>

            {/* Upgrade */}
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-600/40 transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-blue-500" />
              <span>Upgrade</span>
            </button>

            {/* Quick Actions More */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131b2e] cursor-pointer transition-colors"
              title="More Actions"
            >
              <span className="text-sm font-bold tracking-tight">···</span>
            </button>

            {/* Sales Button */}
            <a
              href="tel:+917413014661"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 bg-[#0d1b33] hover:bg-[#122445] border border-blue-500/30 transition-colors"
            >
              <Phone size={12} className="text-blue-400" />
              <span>Sales</span>
            </a>

            {/* Support Button */}
            <button
              onClick={() => setSupportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-[#0a231f] hover:bg-[#0e2f2a] border border-emerald-500/30 transition-colors cursor-pointer"
            >
              <Headphones size={12} className="text-emerald-400" />
              <span>Support</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131b2e] cursor-pointer transition-colors"
              >
                <Bell size={16} />
                {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
              </button>

              {/* Notification Popover */}
              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 bg-[#0c1220] border border-[#1e293b] rounded-xl shadow-2xl z-50 overflow-hidden text-slate-100 animate-in fade-in-50 duration-100">
                  <div className="px-4 py-3 border-b border-[#182235] flex items-center justify-between bg-[#0e1626]">
                    <span className="text-[12.5px] font-bold text-white">Notifications</span>
                    <button
                      onClick={() => setUnread(0)}
                      className="text-[11px] font-medium text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#182235]">
                    {notifs.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-[#121c2e] transition-colors">
                        <div className="text-[12px] font-semibold text-white">{n.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{n.body}</div>
                        <div className="text-[9.5px] text-slate-500 mt-1">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tip lightbulb */}
            <button
              onClick={() => setTipsModalOpen(true)}
              className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131b2e] cursor-pointer transition-colors"
              title="Daily Tips & Updates"
            >
              <Lightbulb size={16} className="text-amber-400" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
            </button>

            {/* User Profile Pill (V VIVEK matching screenshot) */}
            <div className="relative pl-1">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[#131b2e] text-slate-200 cursor-pointer transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                  V
                </div>
                <span className="text-[12px] font-bold tracking-tight text-slate-200">VIVEK</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-11 w-52 bg-[#0c1220] border border-[#1e293b] rounded-xl shadow-2xl z-50 p-1.5 text-[12px] text-slate-200 animate-in fade-in-50 duration-100">
                  <div className="px-3 py-2 border-b border-[#182235]">
                    <div className="font-bold text-white">VIVEK MAHAJAN</div>
                    <div className="text-[10.5px] text-slate-400">Owner · Sniper Electric</div>
                  </div>
                  <button onClick={() => { setUserMenuOpen(false); nav("/settings"); }} className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-[#131b2e] hover:text-white transition-colors">
                    Account Settings
                  </button>
                  <button onClick={() => { setUserMenuOpen(false); nav("/wallet"); }} className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-[#131b2e] hover:text-white transition-colors">
                    API Wallet (₹30,000)
                  </button>
                  <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          {children}
        </main>
      </div>

      {/* =========================================================================
          FLOATING BAADAL AI LAUNCHER BUTTON (Bottom-Right Blue Button in Screenshots 1, 2, 3)
         ========================================================================= */}
      <button
        onClick={() => setAiDrawerOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-[#2563eb] text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
        title="Ask Baadal AI"
      >
        <Sparkles size={20} className="group-hover:rotate-12 transition-transform drop-shadow" />
      </button>

      {/* =========================================================================
          BAADAL AI SLIDE-OVER DRAWER
         ========================================================================= */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setAiDrawerOpen(false)} />
          <div className="relative w-full max-w-md h-full bg-[#0c1220] border-l border-[#182235] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 text-slate-100">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#182235] flex items-center justify-between bg-[#0e1626]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white flex items-center gap-1.5">
                    Ask Baadal AI <span className="text-[9px] bg-blue-900/60 text-blue-300 border border-blue-600/40 px-1.5 py-0.5 rounded font-mono">v2.0</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Intelligent Loan Co-Pilot & Policy Matcher</p>
                </div>
              </div>
              <button onClick={() => setAiDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#131b2e] cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {aiMessages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                      m.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/30"
                        : "bg-[#131c2e] text-slate-200 border border-[#1e293b] rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9.5px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
              {aiLoading && (
                <div className="flex items-center gap-2 text-[12px] text-blue-400 p-2">
                  <Sparkles size={14} className="animate-spin" /> Baadal AI is evaluating criteria…
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-3 border-t border-[#182235] bg-[#0c1220] flex gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => { setAiDrawerOpen(false); nav("/new-applicant"); }}
                className="whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 transition-colors font-semibold cursor-pointer"
              >
                🚀 New Applicant Intake
              </button>
              <button
                onClick={() => handleSendAi("Check Experian offline cache for 8838864869")}
                className="whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] bg-[#0e1626] hover:bg-[#131c2e] text-blue-300 border border-[#1e293b] transition-colors cursor-pointer"
              >
                ⚡ Experian Guard (8838864869)
              </button>
              <button
                onClick={() => handleSendAi("Check Personal Loan eligibility for salaried 50k")}
                className="whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] bg-[#0e1626] hover:bg-[#131c2e] text-blue-300 border border-[#1e293b] transition-colors cursor-pointer"
              >
                📊 Calculate Eligibility
              </button>
              <button
                onClick={() => handleSendAi("Show top commission scheme in feed")}
                className="whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] bg-[#0e1626] hover:bg-[#131c2e] text-blue-300 border border-[#1e293b] transition-colors cursor-pointer"
              >
                🏦 Top Bank Schemes
              </button>
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-[#182235] bg-[#0e1626]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAi();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask about schemes, eligibility, GST, or customer docs…"
                  className="w-full text-[12.5px] bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim() || aiLoading}
                  className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition-colors cursor-pointer shadow-sm"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quick Lead Modal */}
      {quickLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setQuickLeadOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 text-slate-100">
            <div className="px-5 py-4 border-b border-[#182235] flex items-center justify-between bg-[#0e1626]">
              <div>
                <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                  <Plus size={16} className="text-blue-400" />
                  Quick Lead Capture
                </h3>
                <p className="text-[11.5px] text-slate-400">Instantly register borrower to CRM pipeline</p>
              </div>
              <button onClick={() => setQuickLeadOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-5 space-y-3.5">
              {leadSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/60 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-[15px] font-bold text-white">Lead Successfully Created!</h4>
                  <p className="text-[12px] text-slate-400">Redirecting to loan applications…</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Borrower Full Name *</label>
                      <input
                        required
                        className="w-full text-xs text-white bg-[#0d1322] border border-[#1e293b] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Satyajeet Kere"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Mobile Number *</label>
                      <input
                        required
                        className="w-full text-xs text-white bg-[#0d1322] border border-[#1e293b] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="e.g. 8838864869"
                        value={leadForm.mobile}
                        onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Loan Product</label>
                      <select
                        className="w-full text-xs text-white bg-[#0d1322] border border-[#1e293b] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={leadForm.loan_type}
                        onChange={(e) => setLeadForm({ ...leadForm, loan_type: e.target.value })}
                      >
                        <option value="Green Energy Finance for Business" className="bg-[#0c1220]">Green Energy Finance for Business</option>
                        <option value="Green Energy Finance for Individual" className="bg-[#0c1220]">Green Energy Finance for Individual</option>
                        <option value="Business Loan" className="bg-[#0c1220]">Business Loan</option>
                        <option value="Personal Loan" className="bg-[#0c1220]">Personal Loan</option>
                        <option value="Home Loan" className="bg-[#0c1220]">Home Loan</option>
                        <option value="Loan Against Property" className="bg-[#0c1220]">Loan Against Property (LAP)</option>
                        <option value="Auto Loan" className="bg-[#0c1220]">Auto Loan</option>
                        <option value="Commercial Vehicle" className="bg-[#0c1220]">Commercial Vehicle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Requested Amount (₹)</label>
                      <input
                        type="number"
                        className="w-full text-xs text-white bg-[#0d1322] border border-[#1e293b] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="500000"
                        value={leadForm.amount}
                        onChange={(e) => setLeadForm({ ...leadForm, amount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">PAN Number</label>
                      <input
                        className="w-full text-xs text-white uppercase bg-[#0d1322] border border-[#1e293b] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="ABCDE1234F"
                        value={leadForm.pan}
                        onChange={(e) => setLeadForm({ ...leadForm, pan: e.target.value.toUpperCase() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Customer Profile</label>
                      <select
                        className="w-full text-xs text-white bg-[#0d1322] border border-[#1e293b] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={leadForm.employment_type}
                        onChange={(e) => setLeadForm({ ...leadForm, employment_type: e.target.value })}
                      >
                        <option value="Salaried" className="bg-[#0c1220]">Salaried (Bank Salary)</option>
                        <option value="Self-Employed Business" className="bg-[#0c1220]">Self-Employed Business</option>
                        <option value="Self-Employed Professional" className="bg-[#0c1220]">Self-Employed Professional</option>
                        <option value="NRI" className="bg-[#0c1220]">NRI</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#182235] flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Auto-routes to lead pipeline</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickLeadOpen(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-[#131b2e] hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={leadSubmitting}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white min-w-[90px] cursor-pointer shadow-sm"
                      >
                        {leadSubmitting ? "Creating…" : "Save Lead"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Global Search Modal (Ctrl+K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-100 text-slate-100">
            <div className="flex items-center px-4 py-3 border-b border-[#182235] bg-[#0e1626]">
              <Search size={16} className="text-slate-400 mr-2" />
              <input
                ref={searchRef}
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search leads, loan applications, banks, schemes, or APIs…"
                className="bg-transparent border-0 outline-none text-[13.5px] text-white flex-1 placeholder:text-slate-500"
              />
              <span className="text-[10px] text-slate-400 bg-[#131b2e] border border-[#1e293b] px-1.5 py-0.5 rounded font-mono">ESC</span>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto space-y-1">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Quick Links</div>
              <button onClick={() => { setSearchOpen(false); nav("/new-applicant"); }} className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 flex items-center justify-between font-medium cursor-pointer">
                <span className="flex items-center gap-2"><Sparkles size={14} className="text-emerald-400" /> New Applicant Intake (Experian Bureau)</span>
                <span className="text-[10.5px] text-emerald-400 font-bold uppercase">Ready</span>
              </button>
              <button onClick={() => { setSearchOpen(false); nav("/crm/commitments"); }} className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] text-slate-300 hover:bg-[#131b2e] hover:text-white flex items-center justify-between cursor-pointer">
                <span>Login Commitments</span>
                <span className="text-[10.5px] text-slate-400">CRM Module</span>
              </button>
              <button onClick={() => { setSearchOpen(false); nav("/hr"); }} className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] text-slate-300 hover:bg-[#131b2e] hover:text-white flex items-center justify-between cursor-pointer">
                <span>Attendance (HRMS)</span>
                <span className="text-[10.5px] text-slate-400">HR Module</span>
              </button>
              <button onClick={() => { setSearchOpen(false); nav("/finance/income"); }} className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] text-slate-300 hover:bg-[#131b2e] hover:text-white flex items-center justify-between cursor-pointer">
                <span>Income (Finance)</span>
                <span className="text-[10.5px] text-slate-400">Finance Module</span>
              </button>
              <button onClick={() => { setSearchOpen(false); nav("/loans"); }} className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] text-slate-300 hover:bg-[#131b2e] hover:text-white flex items-center justify-between cursor-pointer">
                <span>Loan Applications</span>
                <span className="text-[10.5px] text-slate-400">CRM Pipeline</span>
              </button>
              <button onClick={() => { setSearchOpen(false); nav("/wallet"); }} className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] text-slate-300 hover:bg-[#131b2e] hover:text-white flex items-center justify-between cursor-pointer">
                <span>Verification Wallet & APIs</span>
                <span className="text-[10.5px] text-slate-400">Wallet</span>
              </button>
              <button onClick={() => { setSearchOpen(false); nav("/scorecard"); }} className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] text-slate-300 hover:bg-[#131b2e] hover:text-white flex items-center justify-between cursor-pointer">
                <span>Scorecard (Business & Revenue)</span>
                <span className="text-[10.5px] text-slate-400">Scorecard</span>
              </button>
              <button onClick={() => { setSearchOpen(false); nav("/chat"); }} className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] text-slate-300 hover:bg-[#131b2e] hover:text-white flex items-center justify-between cursor-pointer">
                <span>Staff Chat & Channels</span>
                <span className="text-[10.5px] text-slate-400">Chat</span>
              </button>
              <button onClick={() => { setSearchOpen(false); nav("/notice-board"); }} className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] text-slate-300 hover:bg-[#131b2e] hover:text-white flex items-center justify-between cursor-pointer">
                <span>Company Notice Board</span>
                <span className="text-[10.5px] text-slate-400">Notice Board</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Info Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSupportModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 z-10 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                <Headphones size={16} className="text-emerald-400" />
                Teleport Dedicated Support
              </h3>
              <button onClick={() => setSupportModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-[12.5px]">
              <div className="p-3.5 rounded-xl bg-[#0e1626] border border-[#182235]">
                <div className="font-semibold text-emerald-400">Relationship Manager (Support)</div>
                <div className="text-white font-bold text-sm mt-1">Preeti Yadav</div>
                <div className="text-slate-400 text-[11.5px] mt-0.5">📞 +91 92160 77251</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0e1626] border border-[#182235]">
                <div className="font-semibold text-blue-400">Account Executive (Sales & Upgrades)</div>
                <div className="text-white font-bold text-sm mt-1">Tanishq</div>
                <div className="text-slate-400 text-[11.5px] mt-0.5">📞 +91 74130 14661</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setUpgradeModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0c1220] border border-[#1e293b] rounded-2xl p-6 z-10 space-y-4 text-center text-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-900/40 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto shadow-md">
              👑
            </div>
            <h3 className="text-[18px] font-bold text-white">Upgrade to Teleport Enterprise</h3>
            <p className="text-[12.5px] text-slate-400 max-w-sm mx-auto leading-relaxed">
              Get unlimited partner seats, automated Banker RM WhatsApp dispatch, white-labeled client portals, and 100 free verification API calls.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setUpgradeModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-[#131b2e] hover:text-white cursor-pointer">Maybe Later</button>
              <button onClick={() => { setUpgradeModalOpen(false); alert("Upgrade request submitted! Tanishq from Enterprise Sales will connect with you within 15 minutes."); }} className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-sm">Confirm Upgrade</button>
            </div>
          </div>
        </div>
      )}

      {/* Tips Modal */}
      {tipsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setTipsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 z-10 space-y-3 text-slate-100">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                <Lightbulb size={16} className="text-amber-400" />
                Teleport System Tips & Insights
              </h3>
              <button onClick={() => setTipsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-2 text-[12px] text-slate-300">
              <div className="p-3 rounded-lg bg-[#0e1626] border border-[#182235]">💡 <b>Experian Cost Saver:</b> We cache credit reports by mobile number so multiple pulls never charge your wallet twice.</div>
              <div className="p-3 rounded-lg bg-[#0e1626] border border-[#182235]">💡 <b>Quick Form Dispatch:</b> Send client WhatsApp link directly from the application card to collect salary slips & Form 16.</div>
              <div className="p-3 rounded-lg bg-[#0e1626] border border-[#182235]">💡 <b>Instant Calculators:</b> Open Utility &gt; Financial Tools to calculate EMI, SIP, and maximum FOIR on reducing/flat rates.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
