import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Download, Search, Sparkles, BookOpen, HelpCircle, LifeBuoy,
  Phone, Mail, CheckCircle2, ChevronRight, ChevronDown, RotateCcw,
  Trash2, AlertTriangle, Play, Check, Copy, ExternalLink, Shield,
  Layers, Users, Briefcase, FileText, Settings, Sliders, DollarSign,
  HeartPulse, ArrowRight, Clock, Plus, ThumbsUp, ThumbsDown
} from "lucide-react";
import { api } from "../../lib/api";

const DOC_CONTENTS = [
  { id: "getting-started", num: 1, label: "1. Getting Started" },
  { id: "dashboard", num: 2, label: "2. Dashboard" },
  { id: "crm", num: 3, label: "3. CRM" },
  { id: "team", num: 4, label: "4. Team" },
  { id: "hr", num: 5, label: "5. HR" },
  { id: "finance", num: 6, label: "6. Finance" },
  { id: "setup", num: 7, label: "7. Setup (Admin)" },
  { id: "marketing", num: 8, label: "8. Marketing" },
  { id: "utilities", num: 9, label: "9. Utilities" },
  { id: "settings", num: 10, label: "10. Settings" },
];

export function GnHelp() {
  const loc = useLocation();
  const nav = useNavigate();

  // Current sub-route: docs, faq, support, training, changelog, whats-new, recycle-bin
  const currentSub = useMemo(() => {
    const p = loc.pathname.replace(/^\/help\/?/, "").split("/")[0];
    if (p === "faq" || p === "faqs") return "faq";
    if (p === "support" || p === "tickets") return "support";
    if (p === "training" || p === "demo") return "training";
    if (p === "changelog") return "changelog";
    if (p === "whats-new" || p === "updates") return "whats-new";
    if (p === "recycle-bin" || p === "trash") return "recycle-bin";
    return "docs";
  }, [loc.pathname]);

  // Data states
  const [faqs, setFaqs] = useState<any>({ rows: [], categories: [] });
  const [tickets, setTickets] = useState<any>({ rows: [], summary: [] });
  const [changelog, setChangelog] = useState<any>({ rows: [], summary: [] });
  const [trashData, setTrashData] = useState<any>({ rows: [], summary: [] });
  const [faqFilter, setFaqFilter] = useState("");
  const [trashFilter, setTrashFilter] = useState({ entity_type: "", search: "" });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Modals
  const [newFaqOpen, setNewFaqOpen] = useState(false);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newReleaseOpen, setNewReleaseOpen] = useState(false);

  // Forms
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "Loan Operations" });
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "", priority: "high", category: "Credit Desk" });
  const [releaseForm, setReleaseForm] = useState({ version: "2.3.72", title: "", content: "", category: "feature" });

  const loadData = async () => {
    try {
      const [f, t, c, tr] = await Promise.allSettled([
        api("/gn/faqs"),
        api("/gn/support/tickets"),
        api("/gn/changelog"),
        api("/gn/trash"),
      ]);
      if (f.status === "fulfilled") setFaqs(f.value);
      if (t.status === "fulfilled") setTickets(t.value);
      if (c.status === "fulfilled") setChangelog(c.value);
      if (tr.status === "fulfilled") setTrashData(tr.value);
    } catch (e) {
      console.error("Error loading help center data:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentSub]);

  const scrollToDoc = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;
    try {
      await api("/gn/faqs", { method: "POST", body: faqForm });
      setNewFaqOpen(false);
      setFaqForm({ question: "", answer: "", category: "Loan Operations" });
      loadData();
    } catch (err: any) {
      alert("Failed to save FAQ: " + err.message);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject) return;
    try {
      await api("/gn/support/tickets", { method: "POST", body: ticketForm });
      setNewTicketOpen(false);
      setTicketForm({ subject: "", message: "", priority: "high", category: "Credit Desk" });
      alert("Support ticket logged successfully! SLA: < 15 minutes.");
      loadData();
    } catch (err: any) {
      alert("Failed to save ticket: " + err.message);
    }
  };

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseForm.title || !releaseForm.content) return;
    try {
      await api("/gn/changelog", { method: "POST", body: releaseForm });
      setNewReleaseOpen(false);
      setReleaseForm({ version: "2.3.73", title: "", content: "", category: "feature" });
      loadData();
    } catch (err: any) {
      alert("Failed to save release note: " + err.message);
    }
  };

  const handleRestoreTrash = async (row: any) => {
    try {
      await api(`/gn/trash/${row.id}/restore`, { method: "POST" });
      alert(`Restored "${row.name}" successfully!`);
      loadData();
    } catch (err: any) {
      alert("Failed to restore item: " + err.message);
    }
  };

  const handlePurgeTrash = async (row: any) => {
    if (!confirm(`Permanently delete "${row.name}"? This cannot be undone.`)) return;
    try {
      await api(`/gn/trash/${row.id}`, { method: "DELETE" });
      loadData();
    } catch (err: any) {
      alert("Failed to purge item: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto space-y-5 text-slate-100">
      {/* Top Help Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#1e293b] pb-3 overflow-x-auto scrollbar-thin">
        {[
          { id: "docs", label: "Product Documentation", icon: BookOpen },
          { id: "faq", label: "Help & FAQ", icon: HelpCircle },
          { id: "support", label: "Support Tickets", icon: LifeBuoy },
          { id: "training", label: "Training & Demo", icon: Play },
          { id: "changelog", label: "Release Changelog", icon: RotateCcw },
          { id: "recycle-bin", label: "Recycle Bin", icon: Trash2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentSub === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => nav(`/help/${tab.id}`)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-[#131b2e]"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          VIEW 1: DOCUMENTATION
         ========================================================================= */}
      {currentSub === "docs" && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Product Documentation</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Documentation</div>
              <p className="text-xs text-slate-500 mt-0.5">
                A reference for every feature on the platform. Use Download as PDF to save a copy you can share offline.
              </p>
            </div>

            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <Download size={14} />
              <span>Download as PDF</span>
            </button>
          </div>

          {/* CONTENTS Quick Jump Card */}
          <div className="rounded-xl bg-white border border-slate-200/90 p-5 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              CONTENTS
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2.5 gap-x-4 text-xs font-semibold">
              {DOC_CONTENTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => scrollToDoc(c.id)}
                  className="text-left text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
              <span>💡</span>
              <span>
                <strong className="text-slate-700">Tip:</strong> Download as PDF prints in your browser — choose "Save as PDF" in the destination dropdown.
              </span>
            </div>
          </div>

          {/* DOCUMENTATION SECTIONS */}
          <div className="rounded-xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-8 divide-y divide-slate-100">
            {/* 1. Getting Started */}
            <div id="getting-started" className="pt-2 first:pt-0 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>1. Getting Started</span>
              </h2>

              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">Roles you can assign</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Owner · Manager · Sales Agent · Sales Manager · Ops Manager · Credit Manager · Accountant · Accounts Manager · HR Manager · Telesales · Dealer · Sub-DSA · Connector. Each ships with a default permission set you can tighten or extend in Settings → Roles & Permissions.
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">First-time setup order</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Settings → Company (legal name, GSTIN), Branding (logo + colours), Email (SMTP for outbound notifications), Setup → Products and Banks, then Schemes from Master, Territories, and finally invite Employees and Partners.
                </p>
              </div>
            </div>

            {/* 2. Dashboard */}
            <div id="dashboard" className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">2. Dashboard</h2>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">Insights Bell & Quick Stats</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aggregates urgent follow-ups, pending leave and expense approvals, today's telecalling promises, stale leads (&gt;48 hours untouched), and conversion rate dips. Click any row to jump directly into the borrower's workspace. Real-time telemetry cards reflect MTD disbursement volume and gross commissions earned.
                </p>
              </div>
            </div>

            {/* 3. CRM */}
            <div id="crm" className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">3. CRM & Lending Co-Pilot</h2>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">New Applicant Intake & Bureau Extraction</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter borrower mobile number to pull verified Experian/CIBIL credit score with cached cost-saver offline intelligence. Automatic PAN verification, Aadhaar OTP authentication, and bank statement analyzer match applicant eligibility across 71+ partner banks simultaneously.
                </p>
              </div>
            </div>

            {/* 4. Team */}
            <div id="team" className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">4. Team & Partner Distribution</h2>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">Sub-DSA & Connector Network Hierarchy</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Assign custom commission splits (flat, slab or percentage basis) for internal sales executives versus external partner brokers. Sub-DSA portals give channel partners real-time visibility into their application pipeline without revealing internal lender margins.
                </p>
              </div>
            </div>

            {/* 5. HR */}
            <div id="hr" className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">5. HRMS & Payroll Automation</h2>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">Attendance, Conveyance Claims & Salary Slips</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  GPS-tagged mobile punch-in/out for field sales officers. Automated conveyance kilometer tracking with proof upload. One-click salary slip generation and monthly payroll disbursement with EPF/ESIC statutory compliance deductions.
                </p>
              </div>
            </div>

            {/* 6. Finance */}
            <div id="finance" className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">6. Finance & Payout Ledger</h2>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">Receivable Aging & Parent DSA Reconciliation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tracks lender payout turnaround times (0-30, 31-60, 61-90, 90+ days aging). Automatically reconciles commission credits received against file-level disbursements, generating TDS certificates and vendor payout vouchers.
                </p>
              </div>
            </div>

            {/* 7. Setup (Admin) */}
            <div id="setup" className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">7. Setup (Admin) & Master Schemas</h2>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">1,230 Live Scheme Master Feeds</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pre-configured lending rate sheets for HDFC, ICICI, SBI, TVS Credit, Tata Capital, Bajaj Finserv, Axis Bank, and Kotak. Easily configure branch territories, sales quotas, and processing fee structures.
                </p>
              </div>
            </div>

            {/* 8. Marketing */}
            <div id="marketing" className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">8. Marketing & Lead Engines</h2>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">Campaigns, Meta Ads ROAS & Smart IVR</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bulk WhatsApp broadcasts, automated 7-day lead nurture drip sequences, Meta/Google ROAS spend tracker, and cloud IVR smart receptionist with auto-routing to telecalling queues.
                </p>
              </div>
            </div>

            {/* 9. Utilities */}
            <div id="utilities" className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">9. Utilities & Verification APIs</h2>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">Digitap 17-API Instant Verification Locker</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Comprehensive API center supporting Aadhaar OTP, PAN OCR, Bank Statement Net Banking Fetch, DL/Voter ID validation, GSTIN turnover checks, and high-speed document watermarking.
                </p>
              </div>
            </div>

            {/* 10. Settings */}
            <div id="settings" className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">10. Settings & White-Label Customization</h2>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-200">Company KYC & Granular RBAC Permissions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload company logo, configure primary branding colors, bind custom SMTP relay for transaction emails, generate API secret tokens, and inspect immutable audit trail logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: HELP & FAQ
         ========================================================================= */}
      {currentSub === "faq" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Knowledge Base & FAQ</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Help & FAQ</div>
              <p className="text-xs text-slate-400 mt-0.5">Quick answers to common operational questions, verification guidelines and payout rules.</p>
            </div>
            <button
              onClick={() => setNewFaqOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>+ Ask a Question</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions (e.g. Experian score cache, payout commission, attendance punch-in)..."
              value={faqFilter}
              onChange={(e) => setFaqFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0c1220] border border-[#1e293b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-md"
            />
          </div>

          <div className="space-y-3">
            {(faqs.rows || [])
              .filter((f: any) =>
                !faqFilter ||
                f.question?.toLowerCase().includes(faqFilter.toLowerCase()) ||
                f.answer?.toLowerCase().includes(faqFilter.toLowerCase())
              )
              .map((f: any, idx: number) => {
                const isOpen = expandedFaq === f.id || idx === 0;
                return (
                  <div key={f.id} className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden shadow-lg">
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : f.id)}
                      className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-3 hover:bg-[#162033]/60 transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-xs text-white">{f.question}</div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-semibold text-slate-300 bg-[#151f33] px-2 py-0.5 rounded border border-[#22314d]">
                          {f.category || "General"}
                        </span>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-[#1e293b] bg-[#0c1220]/50">
                        <p>{f.answer}</p>
                        <div className="mt-3 pt-2 border-t border-[#1e293b] flex items-center gap-3 text-[11px] text-slate-400">
                          <span>Was this helpful?</span>
                          <button
                            onClick={async () => {
                              await api(`/gn/faqs/${f.id}`, { method: "PATCH", body: { helpful_yes: true } });
                              loadData();
                            }}
                            className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer transition-colors"
                          >
                            <ThumbsUp size={12} />
                            <span>{f.helpful_yes || 0}</span>
                          </button>
                          <button
                            onClick={async () => {
                              await api(`/gn/faqs/${f.id}`, { method: "PATCH", body: { helpful_no: true } });
                              loadData();
                            }}
                            className="flex items-center gap-1 hover:text-rose-400 cursor-pointer transition-colors"
                          >
                            <ThumbsDown size={12} />
                            <span>{f.helpful_no || 0}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: SUPPORT & TICKETS
         ========================================================================= */}
      {currentSub === "support" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Helpdesk & Support</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Support</div>
              <p className="text-xs text-slate-400 mt-0.5">Direct hotline to dedicated relationship managers and technical support desk.</p>
            </div>
            <button
              onClick={() => setNewTicketOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <LifeBuoy size={14} />
              <span>+ Raise Support Ticket</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <div className="font-bold text-white text-sm">Account Manager · Tanishq</div>
              <div className="text-xs text-slate-400 mt-1">Lender Onboarding & Product Sourcing</div>
              <div className="mt-3 text-xs font-bold text-blue-400 space-y-1">
                <div>📞 +91 74130 14661</div>
                <div>✉️ tanishq@teleportcrm.in</div>
              </div>
              <div className="text-[10.5px] text-slate-500 mt-2">Available: 9:00 AM – 8:00 PM IST</div>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
                <Shield size={20} />
              </div>
              <div className="font-bold text-white text-sm">Operations Desk · Preeti Yadav</div>
              <div className="text-xs text-slate-400 mt-1">Digitap API Verifications & Payout Queries</div>
              <div className="mt-3 text-xs font-bold text-emerald-400 space-y-1">
                <div>📞 +91 92160 77251</div>
                <div>✉️ support@sniperelectric.in</div>
              </div>
              <div className="text-[10.5px] text-slate-500 mt-2">Available: 9:30 AM – 7:30 PM IST</div>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3">
                <Clock size={20} />
              </div>
              <div className="font-bold text-white text-sm">Priority Escalation SLA</div>
              <div className="text-xs text-slate-400 mt-1">Guaranteed Ticket Turnaround Times</div>
              <div className="mt-3 text-xs text-slate-300 space-y-1.5 font-medium">
                <div>⚡ Critical Bug: &lt; 15 mins</div>
                <div>📋 Sanction Hold: &lt; 30 mins</div>
                <div>💳 Payout Discrepancy: Same-Day</div>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden shadow-lg">
            <div className="px-4 py-3 border-b border-[#1e293b] font-bold text-white text-sm bg-[#0c1220]">Logged Support Tickets</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c1220] border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10.5px] font-bold">
                  <tr>
                    <th className="px-4 py-2.5">Ticket ID</th>
                    <th className="px-4 py-2.5">Subject</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Priority</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Logged At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#162033]">
                  {(tickets.rows || []).map((t: any) => (
                    <tr key={t.id} className="hover:bg-[#162033]/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-400">#TK-{t.id}</td>
                      <td className="px-4 py-3 font-bold text-white">{t.subject}</td>
                      <td className="px-4 py-3 text-slate-300">{t.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${t.priority === "urgent" ? "bg-rose-950/40 text-rose-300 border-rose-800/50" : "bg-blue-950/40 text-blue-300 border-blue-800/50"}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/40 text-amber-300 border border-amber-800/50">
                          {t.status || "open"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{String(t.created_at || "Today").slice(0, 16)}</td>
                    </tr>
                  ))}
                  {(!tickets.rows || tickets.rows.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        No active support tickets. Click "Raise Support Ticket" if you need immediate assistance.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: TRAINING & DEMO
         ========================================================================= */}
      {currentSub === "training" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Training & Workflow Sandbox</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Training & Demo</div>
              <p className="text-xs text-slate-400 mt-0.5">Interactive step-by-step loan processing simulator for staff onboarding.</p>
            </div>
            <button
              onClick={() => nav("/new-applicant")}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles size={14} />
              <span>Launch Live Co-Pilot Intake →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg space-y-3">
              <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">Simulation 1</span>
              <div className="font-bold text-white text-sm">Personal Loan Express Sanction</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Experience how a verified borrower profile gets a live Experian score, compares 71+ schemes, and secures digital sanction in under 2 minutes.
              </p>
              <button
                onClick={() => nav("/new-applicant")}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              >
                <span>Run Interactive Demo</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg space-y-3">
              <span className="text-[10px] font-bold uppercase text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/50">Simulation 2</span>
              <div className="font-bold text-white text-sm">Digitap 17-API Instant Verification</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Test the complete digital KYC sandbox: Aadhaar paperless offline OTP, PAN 360 name-match check, bank statement e-sign authorization, and automated OCR cross-checks.
              </p>
              <button
                onClick={() => nav("/test-portal")}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
              >
                <span>Open Verification Sandbox</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 5: CHANGE LOG
         ========================================================================= */}
      {currentSub === "changelog" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Change Log & Releases</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Change Log</div>
              <p className="text-xs text-slate-400 mt-0.5">Platform release notes, newly shipped features and performance hardening.</p>
            </div>
            <button
              onClick={() => setNewReleaseOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>+ Add Release Note</span>
            </button>
          </div>

          <div className="space-y-3">
            {(changelog.rows || []).map((r: any) => (
              <div key={r.id} className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-[#151f33] text-indigo-300 px-2 py-0.5 rounded border border-[#22314d]">
                      v{r.version}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                      {r.category || "feature"}
                    </span>
                    <h3 className="text-xs font-bold text-white">{r.title}</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">{String(r.released_at || "Recent").slice(0, 10)}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans">{r.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 6: WHAT'S NEW
         ========================================================================= */}
      {currentSub === "whats-new" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">What's New in Teleport</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / What's New</div>
              <p className="text-xs text-slate-400 mt-0.5">Explore the latest major capabilities shipped to your tenant.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/50">New Feature</span>
              <div className="font-bold text-white text-sm">New Applicant Intake Co-Pilot 2.0</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Now extracts verified credit score, PAN and salary records directly with cost-saving cache fallback. Automatically matches loan eligibility across 71+ banks.
              </p>
              <button onClick={() => nav("/new-applicant")} className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors">
                <span>Try Intake Co-Pilot</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/50">Enhanced</span>
              <div className="font-bold text-white text-sm">Meta Ads Real-Time ROAS Tracker</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Track ad spend conversion end-to-end: see which Facebook and Instagram lead forms convert into disbursed loans and commission payouts.
              </p>
              <button onClick={() => nav("/marketing")} className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors">
                <span>View ROAS Analytics</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 7: RECYCLE BIN
         ========================================================================= */}
      {currentSub === "recycle-bin" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Recycle Bin</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Recycle Bin</div>
              <p className="text-xs text-slate-400 mt-0.5">Soft-deleted campaigns, workflows, templates and documents. Restore anything deleted by accident.</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c1220] border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10.5px] font-bold">
                  <tr>
                    <th className="px-4 py-2.5">Item Name</th>
                    <th className="px-4 py-2.5">Entity Type</th>
                    <th className="px-4 py-2.5">Deleted Timestamp</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#162033]">
                  {(trashData.rows || []).map((row: any) => (
                    <tr key={row.id} className="hover:bg-[#162033]/60 transition-colors">
                      <td className="px-4 py-3 font-bold text-white">{row.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#151f33] text-slate-300 border border-[#22314d] uppercase">
                          {row.entity_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{String(row.deleted_at || "Recent").slice(0, 16)}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleRestoreTrash(row)}
                          className="px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-300 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RotateCcw size={12} />
                          <span>Restore</span>
                        </button>
                        <button
                          onClick={() => handlePurgeTrash(row)}
                          className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 size={12} />
                          <span>Purge</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!trashData.rows || trashData.rows.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        Recycle Bin is empty. No deleted records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS
         ========================================================================= */}

      {/* Modal: New FAQ */}
      {newFaqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setNewFaqOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111827] rounded-2xl shadow-2xl border border-[#1e293b] overflow-hidden z-10 p-5 text-white">
            <h3 className="font-bold text-white text-sm mb-3">Add FAQ Knowledge Item</h3>
            <form onSubmit={handleCreateFaq} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Question</label>
                <input
                  required
                  placeholder="e.g. How does Experian credit score caching work?"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Answer</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed explanation..."
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#1e293b]">
                <button type="button" onClick={() => setNewFaqOpen(false)} className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#151f33] border border-[#22314d] rounded-lg cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg cursor-pointer transition-all shadow-md shadow-indigo-600/30">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Support Ticket */}
      {newTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setNewTicketOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111827] rounded-2xl shadow-2xl border border-[#1e293b] overflow-hidden z-10 p-5 text-white">
            <h3 className="font-bold text-white text-sm mb-3">Raise Priority Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Subject</label>
                <input
                  required
                  placeholder="e.g. Urgent sanction letter query for applicant"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="urgent">Urgent (&lt; 15m response)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Credit Desk">Credit Desk</option>
                    <option value="Disbursement">Disbursement</option>
                    <option value="Digitap API">Digitap API</option>
                    <option value="Commission">Commission Payout</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Detailed Message</label>
                <textarea
                  rows={3}
                  placeholder="Describe your issue or request..."
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#1e293b]">
                <button type="button" onClick={() => setNewTicketOpen(false)} className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#151f33] border border-[#22314d] rounded-lg cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg cursor-pointer transition-all shadow-md shadow-indigo-600/30">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Release */}
      {newReleaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setNewReleaseOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111827] rounded-2xl shadow-2xl border border-[#1e293b] overflow-hidden z-10 p-5 text-white">
            <h3 className="font-bold text-white text-sm mb-3">Add Release Note</h3>
            <form onSubmit={handleCreateRelease} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Version</label>
                  <input
                    value={releaseForm.version}
                    onChange={(e) => setReleaseForm({ ...releaseForm, version: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={releaseForm.category}
                    onChange={(e) => setReleaseForm({ ...releaseForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="feature">Feature</option>
                    <option value="improvement">Improvement</option>
                    <option value="fix">Bug Fix</option>
                    <option value="security">Security</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Title</label>
                <input
                  required
                  placeholder="e.g. Instant Bureau Extraction & 71+ Lender Matching"
                  value={releaseForm.title}
                  onChange={(e) => setReleaseForm({ ...releaseForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Release Highlights</label>
                <textarea
                  rows={3}
                  value={releaseForm.content}
                  onChange={(e) => setReleaseForm({ ...releaseForm, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#1e293b]">
                <button type="button" onClick={() => setNewReleaseOpen(false)} className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#151f33] border border-[#22314d] rounded-lg cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg cursor-pointer transition-all shadow-md shadow-indigo-600/30">Publish Release</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
