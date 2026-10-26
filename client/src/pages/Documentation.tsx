import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Printer,
  Download,
  Share2,
  Check,
  Search,
  BookOpen,
  Info,
  ChevronRight,
  ShieldCheck,
  Users,
  Briefcase,
  HeartPulse,
  Landmark,
  Settings2,
  Megaphone,
  Wrench,
  SlidersHorizontal,
  LayoutDashboard,
  FileText,
  Workflow,
  Sparkles,
  ExternalLink,
  Copy,
  ChevronUp,
  Clock,
  ArrowRight,
  CreditCard,
  Building2,
  CheckCircle2,
  Lock,
  Code2,
  FileSpreadsheet,
  PhoneCall,
  MessageSquare,
  Send,
  Zap,
  FolderLock,
  Shield,
  FileCheck,
  DollarSign,
  ChevronDown
} from "lucide-react";

interface SubSection {
  id: string;
  title: string;
  description: string;
  badge?: string;
  tags?: string[];
  steps?: string[];
  features?: { title: string; desc: string; icon?: any }[];
  highlight?: string;
  pipeline?: string[];
  codeSnippet?: string;
}

interface DocSection {
  id: string;
  num: number;
  title: string;
  category: "Core CRM & LOS" | "People & Org" | "Finance & Admin" | "Growth & Tools";
  gradient: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  icon: any;
  summary: string;
  subsections: SubSection[];
}

const CATEGORIES = [
  "All Modules",
  "Core CRM & LOS",
  "People & Org",
  "Finance & Admin",
  "Growth & Tools"
] as const;

const SECTIONS: DocSection[] = [
  {
    id: "overview",
    num: 1,
    title: "Getting Started",
    category: "Core CRM & LOS",
    gradient: "from-indigo-500 via-indigo-600 to-violet-600",
    accentBg: "bg-indigo-500/10",
    accentText: "text-indigo-400",
    accentBorder: "border-indigo-500/30",
    icon: Sparkles,
    summary: "Essential initial steps, role assignments, and first-time configuration order for your tenant.",
    subsections: [
      {
        id: "roles-you-can-assign",
        title: "Roles you can assign",
        badge: "13 Granular Roles",
        description:
          "Each ships with a default permission set you can tighten or extend in Settings → Roles & Permissions.",
        tags: [
          "Owner",
          "Manager",
          "Sales Agent",
          "Sales Manager",
          "Ops Manager",
          "Credit Manager",
          "Accountant",
          "Accounts Manager",
          "HR Manager",
          "Telesales",
          "Dealer",
          "Sub-DSA",
          "Connector"
        ],
        highlight: "Default permissions follow strict least-privilege principles and adjust sidebar nav items dynamically."
      },
      {
        id: "first-time-setup-order",
        title: "First-time setup order",
        badge: "7-Step Activation",
        description:
          "Follow this optimal onboarding sequence to activate your tenant with full compliance, branding, and workflows:",
        steps: [
          "Settings → Company (legal name, GSTIN, billing address, authorized signatory)",
          "Branding (company logo, primary colours, Android APK URL, white-label toggle)",
          "Email (SMTP for outbound notifications, password resets, and approval emails)",
          "Setup → Products and Banks (loan categories & partner lender integrations)",
          "Schemes from Master (percentage, flat, or slab-based commission policies)",
          "Territories (hierarchical State → City → Branch distribution mapping)",
          "Invite Employees and Partners (internal workforce & external sub-DSA network)"
        ]
      }
    ]
  },
  {
    id: "dashboard",
    num: 2,
    title: "Dashboard",
    category: "Core CRM & LOS",
    gradient: "from-sky-500 via-blue-600 to-indigo-600",
    accentBg: "bg-sky-500/10",
    accentText: "text-sky-400",
    accentBorder: "border-sky-500/30",
    icon: LayoutDashboard,
    summary: "Real-time command center showing team velocity, SLA alerts, and pipeline metrics.",
    subsections: [
      {
        id: "insights-bell",
        title: "Insights bell",
        badge: "Unified Notification Aggregator",
        description:
          "The bell at the top right aggregates everything that needs your attention — overdue follow-ups, pending approvals (leave + expense), today's tasks, stale leads, unassigned leads, conversion-rate dips. Click any row to jump straight to the relevant page.",
        features: [
          { title: "Overdue Follow-ups", desc: "Flagged telecalling promises past scheduled SLA" },
          { title: "Pending Approvals", desc: "Leave applications and conveyance claims awaiting sign-off" },
          { title: "Today's Tasks", desc: "Drip nudges and manual to-dos due today" },
          { title: "Stale & Unassigned Leads", desc: "Prospects untouched >48h or missing owners" }
        ]
      },
      {
        id: "quick-stats",
        title: "Quick stats",
        badge: "Real-Time Telemetry",
        description:
          "The dashboard cards show your team's real-time pipeline by stage, today's expected disbursements, and commissions earned this month.",
        tags: ["Live Pipeline by Stage", "Expected Disbursements Today", "Commissions Earned This Month", "Disbursed Value MTD"]
      }
    ]
  },
  {
    id: "crm",
    num: 3,
    title: "CRM",
    category: "Core CRM & LOS",
    gradient: "from-emerald-500 via-teal-600 to-cyan-600",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-400",
    accentBorder: "border-emerald-500/30",
    icon: FileText,
    summary: "Run your loan pipeline end-to-end: capture a lead, qualify it, file a loan application, track it to disbursement, and reconcile commission.",
    subsections: [
      {
        id: "leads",
        title: "Leads",
        badge: "Omnichannel Ingestion",
        description:
          "Capture by hand, bulk-import a spreadsheet, or auto-create from WhatsApp/Meta/Website forms. Each lead has 11 tabs covering Info, Personal, Address, Job, Income, Current Debt, GST 3B, Co-applicants, Documents, Activity timeline and Schemes that match. Status moves through New → Contacted → Followup → Documents → Application → Approved → Disbursed (configurable per tenant).",
        pipeline: ["New", "Contacted", "Followup", "Documents", "Application", "Approved", "Disbursed"],
        tags: [
          "1. Info",
          "2. Personal",
          "3. Address",
          "4. Job",
          "5. Income",
          "6. Current Debt",
          "7. GST 3B",
          "8. Co-applicants",
          "9. Documents",
          "10. Activity Timeline",
          "11. Schemes Match"
        ]
      },
      {
        id: "loan-applications",
        title: "Loan Applications",
        badge: "Multi-Lender Submission",
        description:
          "Convert any lead into a loan application. Track logged → sanctioned → disbursed across multiple banks per lead. Bank-side sub-statuses keep ops visibility.",
        tags: [
          "Credit",
          "Docs Closed",
          "Login",
          "Legal & Technical",
          "Sanction",
          "Booked",
          "BT (Balance Transfer)",
          "MODT",
          "Disbursement",
          "PDD (Post-Disbursement Docs)"
        ]
      },
      {
        id: "sanctioned-loans",
        title: "Sanctioned Loans",
        badge: "Automated Commission Recalculation",
        description:
          "Every loan after sanction lands here with disbursement entries, processing fee, PF GST, sanction amount, disbursed amount, MOA, ROI etc. Edits to disbursed / sanctioned amount auto-recalculate downstream commission."
      },
      {
        id: "cross-selling",
        title: "Cross Selling",
        badge: "Intelligent Retention",
        description:
          "Pulls existing customers ripe for a second product (e.g. a Home Loan customer eligible for a Personal Loan top-up). Filters by tenure, current ROI and loan vintage."
      },
      {
        id: "direct-booking",
        title: "Direct Booking",
        badge: "Rapid File Entry",
        description:
          "Manual booking entry for files that didn't flow through the CRM — used when a banker submits a file directly and you only need commission tracking, not lead management."
      },
      {
        id: "tasks",
        title: "Tasks",
        badge: "SLA Driven",
        description:
          "Lightweight to-dos linked to a lead or loan application. Auto-created from follow-up dates, drip workflows, and manual entries. Shows up on the assignee's dashboard and as overdue insights in the bell."
      },
      {
        id: "documents",
        title: "Documents",
        badge: "Magic-Link Customer Portal",
        description:
          'Per-lead / per-loan attachments. Mandatory documents per scheme drive a checklist; upload via camera, file picker, or share via "Send Docs Request" (a magic-link page customers use without logging in).'
      }
    ]
  },
  {
    id: "team",
    num: 4,
    title: "Team",
    category: "People & Org",
    gradient: "from-blue-500 via-indigo-600 to-sky-600",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-400",
    accentBorder: "border-blue-500/30",
    icon: Users,
    summary: "Manage your workforce, external distribution partners, hierarchy tree, and branch territories.",
    subsections: [
      {
        id: "users",
        title: "Users",
        badge: "Settings → Users",
        description:
          "Settings → Users. Add a teammate by email, pick a role, send a one-time password by email or WhatsApp. Roles control what they see and do; HR archetype can create users too."
      },
      {
        id: "partners",
        title: "Partners",
        badge: "Multi-Tier Hierarchy",
        description:
          "External partners — sub-DSAs, dealers, connectors. Each has a commission rate or split rule and can be a parent of other partners in a hierarchy. Optional login (link to a User account) so they get their own portal."
      },
      {
        id: "employees",
        title: "Employees",
        badge: "Unified Payout Engine",
        description:
          "In-house team. Treated as Sales Agent partners under the hood so commission, hierarchy, and reporting all work the same. Link/Unlink/Change the login account directly from the Edit drawer."
      },
      {
        id: "team-tree",
        title: "Team Tree",
        badge: "Visual Org Chart",
        description:
          'Visual org chart of users + partners. Drag-and-drop a node to reparent. Reflects the materialized hierarchy used for "see only my team" filters across the app.'
      },
      {
        id: "territories",
        title: "Territories",
        badge: "Geo-Fencing & Routing",
        description:
          "Hierarchical geography (State → City → Branch). Attach to leads, partners, employees for territory-based reports + assignment rules."
      }
    ]
  },
  {
    id: "hr",
    num: 5,
    title: "HR",
    category: "People & Org",
    gradient: "from-rose-500 via-pink-600 to-purple-600",
    accentBg: "bg-rose-500/10",
    accentText: "text-rose-400",
    accentBorder: "border-rose-500/30",
    icon: HeartPulse,
    summary: "Run your in-house team's attendance, leave, salary, and reimbursements without leaving DSA Sathi.",
    subsections: [
      {
        id: "attendance",
        title: "Attendance",
        badge: "Geo + Selfie Verification",
        description:
          "Selfie + geo check-in via the mobile app or web. Supervisors can correct entries. Marks half-days, late marks, comp-offs based on tenant timing rules."
      },
      {
        id: "leave",
        title: "Leave",
        badge: "Multi-Level Approval Chains",
        description:
          "Configurable leave types (CL, SL, EL, etc.) with quotas, half-day support, multi-level approval chains (manager-kind or role-kind levels). Approvers get an email + an in-app bell insight when one lands."
      },
      {
        id: "salary-slips",
        title: "Salary Slips",
        badge: "1-Click PDF Generation",
        description:
          "Monthly slips auto-computed from attendance + incentives + reimbursements. Templates configurable per tenant. Downloadable PDFs for the team."
      },
      {
        id: "conveyance-expenses",
        title: "Conveyance & Expenses",
        badge: "Distance & Receipt Auditing",
        description:
          "Track field trips by distance (per-km rate) or ad-hoc expenses with receipts. Manager-approved and rolled into payroll. Approvals show up in the unified Approvals workspace."
      },
      {
        id: "holidays",
        title: "Holidays",
        badge: "Calendar Sync",
        description:
          "Per-tenant calendar — used by Leave (working-day count excludes holidays) and Attendance."
      }
    ]
  },
  {
    id: "finance",
    num: 6,
    title: "Finance",
    category: "Finance & Admin",
    gradient: "from-amber-500 via-orange-600 to-yellow-600",
    accentBg: "bg-amber-500/10",
    accentText: "text-amber-400",
    accentBorder: "border-amber-500/30",
    icon: Landmark,
    summary: "Automate bank commissions, partner payouts, digital wallet credits, and general ledger accounting.",
    subsections: [
      {
        id: "payin-commissions",
        title: "Payin (Commissions)",
        badge: "Bank Receivables Tracking",
        description:
          "Bank-side commissions calculated automatically from disbursement entries + scheme rules. Tracks pending → approved → invoiced → received. Can override per row when banker pays differently from scheme.",
        pipeline: ["Pending", "Approved", "Invoiced", "Received"]
      },
      {
        id: "payouts",
        title: "Payouts",
        badge: "Batch Bank Payment Utilities",
        description:
          "What you owe sub-DSAs and connectors after splits. Batch by partner, generate utility uploads (ICICI / HDFC / RBL), reconcile against bank statements.",
        tags: ["ICICI Utility", "HDFC Bulk", "RBL Upload", "Split Formula", "Statement Recon"]
      },
      {
        id: "wallet",
        title: "Wallet",
        badge: "API Credits & Add-ons",
        description:
          "On-platform balance — used for AI calls, verification credits, optional add-on usage. Top-up via Razorpay; spend via the wallet.",
        tags: ["Razorpay Gateway", "Real-Time Balance", "Experian & Digitap Credits", "Transaction Ledger"]
      },
      {
        id: "accounting",
        title: "Accounting",
        badge: "Tally / CSV Integration",
        description:
          "Tenant-scoped ledger. Auto-records commission income, payout expense, wallet top-ups. Manual journal entries for adjustments. Export to Tally / CSV."
      }
    ]
  },
  {
    id: "setup",
    num: 7,
    title: "Setup (Admin)",
    category: "Finance & Admin",
    gradient: "from-purple-500 via-fuchsia-600 to-pink-600",
    accentBg: "bg-purple-500/10",
    accentText: "text-purple-400",
    accentBorder: "border-purple-500/30",
    icon: Settings2,
    summary: "Configure master lenders, loan products, policy parameters, and commission schemes.",
    subsections: [
      {
        id: "scheme-feed",
        title: "Scheme Feed",
        badge: "Live Master Syndication",
        description:
          "Live feed of new master schemes bankers publish on dsasathi.com. One click adds a scheme into your account."
      },
      {
        id: "schemes",
        title: "Schemes",
        badge: "Commission & Policy Engine",
        description:
          "Your tenant's commission schemes — Percentage, Flat, or Slab-based. Each carries a full Product Policy (programs, property types, FOIR/CIBIL, surrogates, USPs) which drives lead-to-scheme matching.",
        tags: ["Percentage (%)", "Flat Fee", "Slab Tiers", "FOIR/CIBIL Filters", "Surrogates & USPs"]
      },
      {
        id: "products",
        title: "Products",
        badge: "Loan Taxonomy",
        description:
          "Loan types and sub-types (HL, LAP, BL, PL, etc.) you offer. Drives the product picker on every lead.",
        tags: ["Home Loan (HL)", "Loan Against Property (LAP)", "Business Loan (BL)", "Personal Loan (PL)", "Gold & Auto Loans"]
      },
      {
        id: "banks",
        title: "Banks",
        badge: "Lender Directory & Assets",
        description:
          "List of banks/NBFCs you work with. Sync from master in one click; each bank carries branding so the loan list looks right."
      }
    ]
  },
  {
    id: "marketing",
    num: 8,
    title: "Marketing",
    category: "Growth & Tools",
    gradient: "from-rose-500 via-red-600 to-orange-600",
    accentBg: "bg-rose-500/10",
    accentText: "text-rose-400",
    accentBorder: "border-rose-500/30",
    icon: Megaphone,
    summary: "Attract and convert borrowers with omnichannel drip campaigns, IVR routing, and white-label portals.",
    subsections: [
      {
        id: "campaigns",
        title: "Campaigns",
        badge: "WhatsApp, SMS & Email",
        description:
          "WhatsApp drip / SMS / Email blasts targeting saved lead filters. Schedule, see open / reply rates, auto-route replies back as conversations."
      },
      {
        id: "workflow-builder",
        title: "Workflow Builder",
        badge: "Visual Event Automations",
        description:
          "Visual automations — when a lead changes status / a day passes / a follow-up missed, fire WhatsApp, email, task, or assignment changes.",
        highlight: "Trigger: Status Change / Inactivity ➔ Action: Fire WhatsApp Drip + Create Escalation Task"
      },
      {
        id: "ivr",
        title: "IVR",
        badge: "Call Routing & Timeline Recording",
        description:
          "Inbound call routing rules, recording, agent assignment. Logs to each lead's timeline."
      },
      {
        id: "website",
        title: "Website",
        badge: "White-Label Subdomain",
        description:
          "White-label landing pages + lead capture form, hosted at your subdomain."
      },
      {
        id: "banners",
        title: "Banners",
        badge: "Auto-Personalized Creatives",
        description:
          "Festival greetings and branded creatives. Auto-personalised with your logo, brand colour, and contact. Download as PNG or share to WhatsApp."
      }
    ]
  },
  {
    id: "utilities",
    num: 9,
    title: "Utilities",
    category: "Growth & Tools",
    gradient: "from-cyan-500 via-teal-600 to-emerald-600",
    accentBg: "bg-cyan-500/10",
    accentText: "text-cyan-400",
    accentBorder: "border-cyan-500/30",
    icon: Wrench,
    summary: "Unified approvals inbox, secure vault, reporting analytics, changelog, and staff training.",
    subsections: [
      {
        id: "approvals",
        title: "Approvals",
        badge: "Unified Sign-off Inbox",
        description:
          "Unified inbox for everything you need to sign off — leave, expenses, conveyance claims. Inline Approve / Reject. Visible to any user holding the relevant approve permission, regardless of role archetype."
      },
      {
        id: "document-vault",
        title: "Document Vault",
        badge: "Per-Document ACLs",
        description:
          "Internal storage for PAN, Aadhaar, agreements, vendor contracts etc. Per-document user ACL — pick which teammates can see each file. Owner / Accounts Manager always see everything."
      },
      {
        id: "reports",
        title: "Reports",
        badge: "Deep BI & Attribution",
        description:
          "Funnel, conversion, bank-wise, scheme-wise, partner-wise, employee-wise — and Lead Sources / Ad Performance for marketing attribution. Export CSV / Excel.",
        tags: ["Funnel Conversion", "Bank-wise Performance", "Partner Volume", "Employee Productivity", "Ad Performance Attribution"]
      },
      {
        id: "recycle-bin",
        title: "Recycle Bin",
        badge: "30-Day Safe Retention",
        description:
          "Soft-deleted leads / loans / partners land here for 30 days. Restore or purge."
      },
      {
        id: "refer-earn",
        title: "Refer & Earn",
        badge: "3 Months Free per DSA",
        description:
          "Share your unique referral link. Earn 3 free months for every DSA who signs up and converts."
      },
      {
        id: "training",
        title: "Training",
        badge: "Video Onboarding",
        description: "Onboarding videos and how-to guides for new team members."
      },
      {
        id: "whats-new",
        title: "What's New",
        badge: "Platform Changelog",
        description: "Changelog — every recent feature, improvement and fix the platform shipped."
      }
    ]
  },
  {
    id: "settings",
    num: 10,
    title: "Settings",
    category: "Finance & Admin",
    gradient: "from-slate-500 via-zinc-600 to-neutral-700",
    accentBg: "bg-slate-500/10",
    accentText: "text-slate-300",
    accentBorder: "border-slate-500/30",
    icon: SlidersHorizontal,
    summary: "Fine-tune system preferences, security policies, API integrations, and corporate branding.",
    subsections: [
      {
        id: "settings-users",
        title: "Users",
        badge: "User Lifecycle",
        description: "Invite users, set role, deactivate, send fresh passwords."
      },
      {
        id: "roles-permissions",
        title: "Roles & Permissions",
        badge: "Dynamic Nav Auto-Binding",
        description:
          "Toggle granular resource × action permissions per role. Sidebar visibility now follows these toggles — granting a permission to a role surfaces the matching nav item automatically."
      },
      {
        id: "subscription",
        title: "Subscription",
        badge: "Plan & Invoicing",
        description: "Plan, seats, renewal date, invoices."
      },
      {
        id: "company-invoice",
        title: "Company / Invoice",
        badge: "Statutory Credentials",
        description: "Legal name, GSTIN, billing address, signatory."
      },
      {
        id: "branding",
        title: "Branding",
        badge: "Custom Logo & White-Label",
        description:
          "Logo, primary colour, hide-DSA-Sathi-branding (white-label), Android APK URL."
      },
      {
        id: "meta-facebook",
        title: "Meta / Facebook",
        badge: "Real-time Lead Webhooks",
        description: "Connect Facebook Pages to auto-import lead-gen form submissions."
      },
      {
        id: "ivr-email-smtp",
        title: "IVR / Email SMTP",
        badge: "Custom Domain Delivery",
        description:
          "Tenant-owned IVR provider config and outbound SMTP. Email SMTP must be set for password resets and approval emails to send from your domain."
      },
      {
        id: "notifications",
        title: "Notifications",
        badge: "Smart Preferences",
        description:
          "Toggle drip nudges, daily summaries, birthday / anniversary / holiday reminders per user."
      },
      {
        id: "api-access",
        title: "API Access",
        badge: "RESTful Integration Keys",
        description: "Generate API keys for programmatic lead import / export.",
        codeSnippet: `curl -X POST https://api.sniperelectric.in/v1/leads \\
  -H "Authorization: Bearer sec_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Rahul Verma", "mobile": "+919876543210", "product": "HL", "amount": 4500000}'`
      }
    ]
  }
];

export default function Documentation() {
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All Modules");
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pageCopied, setPageCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const location = useLocation();

  // Scrollspy & progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setReadingProgress(Math.min(100, Math.round((totalScroll / windowHeight) * 100)));
      }

      const scrollPos = window.scrollY + 160;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle URL Hash navigation
  useEffect(() => {
    const hash = window.location.hash.split("#")[2] || window.location.hash.replace("#/docs#", "").replace("#/docs", "").replace("#", "");
    if (hash && document.getElementById(hash)) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const yOffset = -90;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
          setActiveSection(hash);
        }
      }, 150);
    }
  }, [location]);

  const handleDownloadPdf = () => {
    window.print();
  };

  const copySectionLink = (id: string) => {
    const url = `${window.location.origin}/#/docs#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setPageCopied(true);
    setTimeout(() => setPageCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
      window.history.replaceState(null, "", `#/docs#${id}`);
    }
  };

  // Filter sections by Category & Query
  const filteredSections = useMemo(() => {
    return SECTIONS.filter((sec) => {
      if (selectedCat !== "All Modules" && sec.category !== selectedCat) {
        return false;
      }
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      const matchSection = sec.title.toLowerCase().includes(q) || sec.summary.toLowerCase().includes(q);
      const matchSub = sec.subsections.some((sub) => {
        return (
          sub.title.toLowerCase().includes(q) ||
          sub.description.toLowerCase().includes(q) ||
          sub.tags?.some((t) => t.toLowerCase().includes(q)) ||
          sub.steps?.some((st) => st.toLowerCase().includes(q))
        );
      });
      return matchSection || matchSub;
    });
  }, [query, selectedCat]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white print:bg-white print:text-zinc-900">
      
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none print:hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-xl border-b border-slate-800/80 print:hidden transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-white text-base shadow-md group-hover:scale-105 transition-transform">
                N
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight">SNIPER</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    DOCS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">Product Documentation</span>
              </div>
            </Link>

            <span className="text-slate-700 mx-1 hidden sm:inline">/</span>

            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-blue-400 font-semibold">Documentation</span>
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download as PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={copyPageLink}
              className="p-1.5 sm:px-3 sm:py-1.5 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Share documentation link"
            >
              {pageCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{pageCopied ? "Copied!" : "Share"}</span>
            </button>

            <Link
              to="/app"
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              Open App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Banner with Ambient Radial Glow */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0e1629] via-[#090d18] to-[#070b14] py-10 sm:py-14 print:bg-white print:border-zinc-200 print:py-4">
        
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none print:hidden" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none print:hidden" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide print:hidden">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Complete Feature & Architecture Manual</span>
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span className="text-slate-400 font-normal">v2.7 Production</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight print:text-zinc-950">
              Product Documentation
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl print:text-zinc-600">
              A comprehensive reference for every feature on the platform. Use <strong className="text-white print:text-zinc-900">Download as PDF</strong> to save a clean offline copy for operations, training, and team onboarding.
            </p>

            {/* Quick Stats Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs print:hidden">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white">10</span> Core Modules
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="font-semibold text-white">13</span> Configurable Roles
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RBI Digital Lending Guidelines Compliant</span>
              </div>
            </div>

          </div>

          {/* Search Bar & Download Trigger */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:hidden">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by keyword, module, role (e.g. CRM, Leave, Sanction, Wallet, IVR)…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Download CTA Button */}
            <button
              onClick={handleDownloadPdf}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download as PDF</span>
            </button>
          </div>

          {/* Tip Callout Box */}
          <div className="mt-6 p-4 rounded-xl bg-blue-950/30 border border-blue-800/50 flex items-start gap-3.5 text-xs sm:text-sm text-blue-200 print:bg-slate-50 print:border-slate-200 print:text-zinc-800">
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <Info className="w-3.5 h-3.5" />
            </div>
            <div className="leading-relaxed">
              <span className="font-bold text-white print:text-zinc-900">Tip:</span> Download as PDF prints in your browser — choose <strong className="text-white underline decoration-blue-400 underline-offset-2">"Save as PDF"</strong> in the destination dropdown.
            </div>
          </div>

          {/* Module Category Filter Pills */}
          <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 print:hidden">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCat === cat
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Table of Contents Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 sticky top-20 print:hidden space-y-4">
            <div className="bg-[#0b101e]/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 px-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Contents
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-blue-300 border border-slate-700">
                  {filteredSections.length} modules
                </span>
              </div>

              {/* Navigation List */}
              <nav className="space-y-1">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? "bg-blue-600/20 text-white font-semibold border border-blue-500/40 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10.5px] font-mono shrink-0 transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white font-bold shadow-xs"
                            : "bg-slate-800 text-slate-400 group-hover:text-slate-200"
                        }`}>
                          {sec.num}
                        </span>
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"
                      }`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Live Testing Sandbox Card */}
            <div className="bg-gradient-to-br from-[#0c1426] via-[#091020] to-[#080d19] border border-blue-900/30 rounded-2xl p-4 text-xs space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-white font-semibold">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>Interactive Live Sandbox</span>
              </div>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">
                Test the loan origination journey, BRE rules, and Experian pull directly in the running app.
              </p>
              <div className="pt-1 flex flex-col gap-2">
                <Link
                  to="/app"
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-center transition-colors shadow-sm text-xs"
                >
                  Open Operations Shell
                </Link>
                <Link
                  to="/test-portal"
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-center transition-colors text-xs border border-slate-700"
                >
                  Digitap & CellX Portal
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Main Content Sections */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-12 print:col-span-12 print:space-y-8">
            
            {filteredSections.length === 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <Search className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No matching documentation topics found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search query or reset the category filter to view all modules.
                </p>
                <button
                  onClick={() => { setQuery(""); setSelectedCat("All Modules"); }}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-24 bg-gradient-to-b from-[#0c1222] to-[#090d18] border border-slate-800/90 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl print:border-zinc-200 print:bg-white print:p-0 print:rounded-none print:shadow-none print:break-inside-avoid print:mb-8 transition-all hover:border-slate-700/80"
                >
                  
                  {/* Module Header Banner */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/90 pb-6 mb-7 print:border-zinc-300 print:pb-3">
                    <div className="flex items-start gap-4">
                      
                      {/* Section Icon Box */}
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sec.gradient} p-0.5 shadow-md shrink-0 print:border print:border-zinc-400`}>
                        <div className="w-full h-full bg-[#0b101d] rounded-[14px] flex items-center justify-center text-white print:bg-white print:text-zinc-900">
                          <Icon className="w-5 h-5 text-blue-400 print:text-zinc-900" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono border ${sec.accentBg} ${sec.accentText} ${sec.accentBorder} print:border-zinc-400 print:text-zinc-800`}>
                            Module {sec.num}
                          </span>
                          <span className="text-[11px] text-slate-500 print:hidden font-mono">
                            {sec.category}
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight print:text-zinc-950">
                          {sec.num}. {sec.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl print:text-zinc-600">
                          {sec.summary}
                        </p>
                      </div>
                    </div>

                    {/* Copy Link Button */}
                    <button
                      onClick={() => copySectionLink(sec.id)}
                      className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors shrink-0 print:hidden"
                      title="Copy link to this section"
                    >
                      {copiedId === sec.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Subsections Cards */}
                  <div className="space-y-6">
                    {sec.subsections.map((sub, sidx) => (
                      <div
                        key={sidx}
                        id={sub.id}
                        className="bg-[#0b1120]/80 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/80 transition-all shadow-sm print:border-zinc-200 print:bg-slate-50/50 print:p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 print:text-zinc-900">
                            <span className="w-2 h-2 rounded-full bg-blue-400 print:bg-zinc-800 shrink-0" />
                            <span>{sub.title}</span>
                          </h3>

                          {sub.badge && (
                            <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80 print:bg-zinc-100 print:text-zinc-800">
                              {sub.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed print:text-zinc-700">
                          {sub.description}
                        </p>

                        {/* Interactive Pipeline Diagram */}
                        {sub.pipeline && sub.pipeline.length > 0 && (
                          <div className="mt-4 pt-3.5 border-t border-slate-800/80 print:border-zinc-200">
                            <div className="text-[10px] font-mono uppercase text-slate-400 mb-2 flex items-center gap-1.5 font-bold">
                              <Workflow className="w-3.5 h-3.5 text-blue-400" />
                              <span>Status Progression Pipeline</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              {sub.pipeline.map((step, pidx) => (
                                <React.Fragment key={pidx}>
                                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-200 text-xs font-semibold print:bg-white print:border-zinc-300 print:text-zinc-800">
                                    <span className="text-[10px] text-blue-400 font-mono">{pidx + 1}.</span>
                                    <span>{step}</span>
                                  </div>
                                  {pidx < sub.pipeline!.length - 1 && (
                                    <ArrowRight className="w-3 h-3 text-slate-600 shrink-0 print:text-zinc-400" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tag Pills */}
                        {sub.tags && sub.tags.length > 0 && (
                          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5 print:border-zinc-200">
                            {sub.tags.map((t, tidx) => (
                              <span
                                key={tidx}
                                className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900/90 text-blue-300 border border-slate-800 hover:border-slate-700 transition-colors print:bg-white print:border-zinc-300 print:text-zinc-800"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Feature Cards Grid (if present) */}
                        {sub.features && sub.features.length > 0 && (
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80 print:border-zinc-200">
                            {sub.features.map((feat, fidx) => (
                              <div key={fidx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                <div className="text-xs font-semibold text-white flex items-center gap-1.5 mb-0.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>{feat.title}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 leading-normal pl-5">
                                  {feat.desc}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Sequential Steps List */}
                        {sub.steps && sub.steps.length > 0 && (
                          <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3.5 print:border-zinc-200">
                            {sub.steps.map((st, sidx) => (
                              <div key={sidx} className="flex items-start gap-2.5 text-xs text-slate-300 print:text-zinc-800">
                                <span className="w-5 h-5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[10.5px] font-bold font-mono shrink-0 mt-0.5 print:bg-zinc-200 print:text-zinc-800">
                                  {sidx + 1}
                                </span>
                                <span className="leading-relaxed">{st}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Code Snippet Preview (for API Access) */}
                        {sub.codeSnippet && (
                          <div className="mt-4 pt-3.5 border-t border-slate-800/80 print:border-zinc-200">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1.5">
                              <span className="flex items-center gap-1">
                                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                                <span>cURL Request Example</span>
                              </span>
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">REST v1</span>
                            </div>
                            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11.5px] font-mono text-blue-200 overflow-x-auto leading-relaxed shadow-inner">
                              {sub.codeSnippet}
                            </pre>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                </section>
              );
            })}
          </main>

        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center cursor-pointer active:scale-95 print:hidden"
        title="Back to Top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Footer */}
      <footer className="mt-auto bg-[#05080f] border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SNIPER Lending OS</span>
            <span>· Product Documentation & Runbooks</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link to="/app" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Login</Link>
            <button
              onClick={handleDownloadPdf}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Save as PDF
            </button>
          </div>
        </div>
      </footer>

      {/* Embedded Print Stylesheet */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #09090b !important;
            font-size: 10.5pt !important;
          }
          header, footer, aside, button, input {
            display: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          main {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          section {
            page-break-inside: avoid;
            margin-bottom: 24pt !important;
            border-bottom: 1px solid #e4e4e7 !important;
            padding-bottom: 16pt !important;
          }
          h1, h2, h3 {
            color: #09090b !important;
          }
        }
      `}</style>

    </div>
  );
}
