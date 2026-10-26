import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Megaphone, Sparkles, Plus, Play, Pause, Trash2, Phone, Workflow,
  MessageSquare, Mail, RefreshCw, Send, ArrowRight, Share2, Download,
  ExternalLink, Copy, Check, CheckCircle2, AlertCircle, Clock, Users,
  BarChart3, ChevronRight, Eye, Smartphone, Filter, Search, X, Award,
  Building, Layers, ArrowUpRight
} from "lucide-react";
import { api, fmtInr } from "../../lib/api";

const CHANNELS = ["whatsapp", "meta", "google", "email", "sms"];
const AUDIENCES = [
  { id: "all_leads", label: "All Active Leads (7,420)" },
  { id: "salaried", label: "Salaried Employees (₹35k+ /mo)" },
  { id: "self_employed", label: "Self-Employed / MSME Borrowers" },
  { id: "incomplete_kyc", label: "Pending KYC / Bureau Drop-offs" },
  { id: "disbursed_clients", label: "Existing Disbursed (Cross-sell)" },
];

const PRESET_TEMPLATES = [
  {
    id: "festive_personal",
    title: "Diwali Festive Personal Loan @ 9.99%",
    channel: "whatsapp",
    category: "Festival Promo",
    subject: "Special Festive Loan Approval for {{name}}",
    body: "Dear {{name}}, celebrate this festive season with an instant pre-approved personal loan up to ₹10,00,000 at special 9.99% ROI. Zero processing fees for next 48 hours! Apply here: https://teleport.sniperelectric.in/apply?ref=festive",
    previewImage: "Festive Personal Loan Special",
  },
  {
    id: "business_growth",
    title: "MSME Quick Working Capital ₹25 Lakhs",
    channel: "whatsapp",
    category: "Business Loan",
    subject: "Unsecured Business Credit Line Approved",
    body: "Hello {{name}}, expand your business inventory without collateral! Get up to ₹25,00,000 working capital sanctioned within 4 hours. Minimal bank statement verification. Click to accept: https://teleport.sniperelectric.in/apply?product=bl",
    previewImage: "Business Capital Booster",
  },
  {
    id: "kyc_reminder",
    title: "Document Upload Reminder & Express Sanction",
    channel: "whatsapp",
    category: "KYC Follow-up",
    subject: "Pending Form 16 / Salary Slip for {{name}}",
    body: "Hi {{name}}, your loan application is 80% complete! Kindly upload your last 3 months bank statement to issue the digital sanction letter today: https://teleport.sniperelectric.in/apply?mobile={{phone}}",
    previewImage: "Instant KYC Completion",
  },
  {
    id: "partner_dsa",
    title: "Sub-DSA Partner Festive Commission 2.5%",
    channel: "email",
    category: "Partner DSA",
    subject: "Earn up to 2.50% Payout on Every Disbursed File",
    body: "Dear Partner {{name}}, partner with Sniper Electric & Growth Nations. Disburse files across 71+ partner banks and enjoy same-day payout reconciliation with transparent commission tracking. Register sub-DSA: https://teleport.sniperelectric.in/channel",
    previewImage: "Partner Payout Multiplier",
  },
  {
    id: "home_balance_transfer",
    title: "Home Loan Balance Transfer @ 8.40%",
    channel: "whatsapp",
    category: "Home Loan",
    subject: "Reduce your monthly EMI by up to ₹8,500",
    body: "Namaste {{name}}, reduce your home loan interest burden! Transfer your existing home loan to SBI/HDFC at 8.40% ROI + get top-up cash up to ₹20,00,000. Calculate your new EMI: https://teleport.sniperelectric.in/apply?calc=bt",
    previewImage: "Home Loan BT Savings",
  }
];

const META_ADS_DATA = [
  {
    id: 1,
    campaign: "Meta Leads · Delhi NCR Salaried 10.5%",
    platform: "Facebook / Instagram Feed",
    spend: 24500,
    impressions: 142000,
    clicks: 3420,
    leads: 284,
    cpl: 86.2,
    apps: 92,
    disbursed: 4850000,
    roas: "19.8x",
    status: "active"
  },
  {
    id: 2,
    campaign: "Instagram Reels · Instant Micro Loan ₹50k",
    platform: "Instagram Stories & Reels",
    spend: 18200,
    impressions: 290000,
    clicks: 4890,
    leads: 395,
    cpl: 46.1,
    apps: 148,
    disbursed: 3200000,
    roas: "17.5x",
    status: "active"
  },
  {
    id: 3,
    campaign: "Meta Advantage+ · Business Loans Mumbai",
    platform: "Facebook Audience Network",
    spend: 32000,
    impressions: 98000,
    clicks: 1840,
    leads: 142,
    cpl: 225.3,
    apps: 41,
    disbursed: 6400000,
    roas: "20.0x",
    status: "paused"
  },
  {
    id: 4,
    campaign: "Google Search · Doctor & CA Special Loans",
    platform: "Google Adwords Search",
    spend: 15400,
    impressions: 42000,
    clicks: 1220,
    leads: 88,
    cpl: 175.0,
    apps: 36,
    disbursed: 5100000,
    roas: "33.1x",
    status: "active"
  }
];

const BANNERS_DATA = [
  {
    id: "b1",
    title: "Diwali Personal Loan 9.99%",
    tagline: "Instant Disbursal in 2 Hours",
    product: "Personal Loan",
    gradient: "from-amber-600 via-rose-700 to-purple-900",
    badge: "Festive Offer",
    features: ["Zero processing fee", "No guarantor needed", "Tenure up to 60 mos"],
  },
  {
    id: "b2",
    title: "Doctor & CA Professional Loan",
    tagline: "Pre-approved up to ₹50 Lakhs",
    product: "Professional Loan",
    gradient: "from-blue-700 via-indigo-800 to-slate-900",
    badge: "Exclusive",
    features: ["Zero collateral", "Same day sanction letter", "Attractive 10.25% ROI"],
  },
  {
    id: "b3",
    title: "Sub-DSA Franchise Partner Call",
    tagline: "Partner with Teleport CRM",
    product: "DSA Recruitment",
    gradient: "from-emerald-700 via-teal-800 to-cyan-950",
    badge: "High Commission",
    features: ["2.40% max commercial payout", "Automated CRM login", "Real-time tracker"],
  },
  {
    id: "b4",
    title: "Instant Home Loan BT @ 8.40%",
    tagline: "Lowest EMI Guaranteed",
    product: "Home Loan BT",
    gradient: "from-purple-700 via-violet-900 to-indigo-950",
    badge: "Save Big",
    features: ["Top-up up to ₹25 Lakhs", "Free doorstep pickup", "HDFC/ICICI options"],
  }
];

export function GnMarketing() {
  const loc = useLocation();
  const nav = useNavigate();
  const params = useParams();

  // Determine current active subview from pathname
  const currentSub = useMemo(() => {
    const p = loc.pathname.replace(/^\/marketing\/?/, "").split("/")[0];
    if (p === "workflows" || p === "workflow") return "workflows";
    if (p === "ivr") return "ivr";
    if (p === "inbox") return "inbox";
    if (p === "drips" || p === "whatsapp-drips") return "drips";
    if (p === "templates") return "templates";
    if (p === "banners") return "banners";
    if (p === "franchise") return "franchise";
    return "campaigns";
  }, [loc.pathname]);

  // Campaign specific tab: "campaigns" | "roas"
  const [campaignTab, setCampaignTab] = useState<"campaigns" | "roas">("campaigns");

  // Live data states
  const [campaignsData, setCampaignsData] = useState<any>({ rows: [], totals: {} });
  const [workflowsData, setWorkflowsData] = useState<any>({ rows: [], summary: [] });
  const [ivrMenus, setIvrMenus] = useState<any[]>([]);
  const [ivrCalls, setIvrCalls] = useState<any>({ rows: [], summary: [] });
  const [inboxData, setInboxData] = useState<any>({ rows: [], summary: [] });
  const [dripsData, setDripsData] = useState<any>({ rows: [], summary: [] });
  const [templatesData, setTemplatesData] = useState<any>({ rows: [], summary: [] });
  const [loading, setLoading] = useState(false);

  // Modals
  const [browseTemplatesOpen, setBrowseTemplatesOpen] = useState(false);
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [newWorkflowOpen, setNewWorkflowOpen] = useState(false);
  const [newIvrOpen, setNewIvrOpen] = useState(false);
  const [simCallOpen, setSimCallOpen] = useState<any>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [newDripOpen, setNewDripOpen] = useState(false);
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states for New Campaign
  const [campForm, setCampForm] = useState({
    name: "",
    channel: "whatsapp",
    spend: 5000,
    leads: 65,
    applications: 24,
    disbursed_amount: 1250000,
    audience: "all_leads",
    subject: "",
    message: "",
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [c, w, im, ic, ib, dr, tp] = await Promise.allSettled([
        api("/gn/campaigns"),
        api("/gn/workflows"),
        api("/gn/ivr/menus"),
        api("/gn/ivr/calls"),
        api("/gn/inbox"),
        api("/gn/inbox/drips"),
        api("/gn/inbox/templates"),
      ]);

      if (c.status === "fulfilled") setCampaignsData(c.value);
      if (w.status === "fulfilled") setWorkflowsData(w.value);
      if (im.status === "fulfilled") setIvrMenus(im.value);
      if (ic.status === "fulfilled") setIvrCalls(ic.value);
      if (ib.status === "fulfilled") setInboxData(ib.value);
      if (dr.status === "fulfilled") setDripsData(dr.value);
      if (tp.status === "fulfilled") setTemplatesData(tp.value);
    } catch (err) {
      console.error("Error loading marketing data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [currentSub]);

  const handleSelectTemplate = (t: any) => {
    setCampForm((prev) => ({
      ...prev,
      name: t.title,
      channel: t.channel || "whatsapp",
      subject: t.subject || "",
      message: t.body || "",
    }));
    setBrowseTemplatesOpen(false);
    setNewCampaignOpen(true);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campForm.name) return;
    try {
      await api("/gn/campaigns", {
        method: "POST",
        body: {
          name: campForm.name,
          channel: campForm.channel,
          spend: Number(campForm.spend) || 0,
          leads: Number(campForm.leads) || 0,
          applications: Number(campForm.applications) || 0,
          disbursed_amount: Number(campForm.disbursed_amount) || 0,
        },
      });
      setNewCampaignOpen(false);
      setCampForm({
        name: "",
        channel: "whatsapp",
        spend: 5000,
        leads: 65,
        applications: 24,
        disbursed_amount: 1250000,
        audience: "all_leads",
        subject: "",
        message: "",
      });
      loadAll();
    } catch (err: any) {
      alert("Failed to save campaign: " + err.message);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculations for Campaigns
  const rows = campaignsData.rows || [];
  const activeCount = rows.filter((r: any) => r.status === "active").length;
  const totalSent = rows.reduce((acc: number, r: any) => acc + (r.leads ? r.leads * 12 : 0), 0);

  return (
    <div className="w-full max-w-[1500px] mx-auto space-y-5 text-slate-100">
      {/* Top Marketing Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#1e293b] pb-3 overflow-x-auto scrollbar-thin">
        {[
          { id: "campaigns", label: "Campaigns", icon: Megaphone },
          { id: "workflows", label: "Workflow Builder", icon: Workflow },
          { id: "ivr", label: "IVR & Telephony", icon: Phone },
          { id: "drips", label: "WhatsApp Drips", icon: MessageSquare },
          { id: "templates", label: "Templates", icon: Mail },
          { id: "banners", label: "Banners", icon: Layers },
          { id: "franchise", label: "Franchise Partner", icon: Building },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentSub === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => nav(`/marketing/${tab.id}`)}
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
          VIEW 1: CAMPAIGNS
         ========================================================================= */}
      {currentSub === "campaigns" && (
        <div className="space-y-4">
          {/* Top Blue Notice Banner */}
          <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl px-4 py-3 text-[12.5px] text-blue-200 leading-relaxed flex items-center justify-between shadow-lg">
            <div>
              Campaigns send one-time bulk messages to a segment of your leads. Best for festive offers, rate updates, or announcements. For automated follow-ups based on triggers, use{" "}
              <button
                onClick={() => nav("/marketing/workflows")}
                className="font-bold underline text-blue-300 hover:text-white cursor-pointer"
              >
                Workflows
              </button>{" "}
              instead.
            </div>
            <button
              onClick={() => nav("/marketing/workflows")}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-blue-300 hover:text-white shrink-0 ml-3 transition-colors"
            >
              <span>Explore Workflows</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Tabs: Campaigns | Meta Ads ROAS */}
          <div className="flex items-center gap-2 pt-1 border-b border-[#182235] pb-2">
            <button
              onClick={() => setCampaignTab("campaigns")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                campaignTab === "campaigns"
                  ? "bg-[#1e2b45] text-white shadow-md border border-[#2a3c5d] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-[#131b2e]"
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setCampaignTab("roas")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                campaignTab === "roas"
                  ? "bg-[#1e2b45] text-white shadow-md border border-[#2a3c5d] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-[#131b2e]"
              }`}
            >
              <BarChart3 size={13} />
              <span>Meta Ads ROAS</span>
            </button>
          </div>

          {campaignTab === "campaigns" ? (
            <>
              {/* Page Sub-Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-medium">‹</span>
                    <h1 className="text-xl font-bold tracking-tight text-white">Campaigns</h1>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Home / Campaigns</div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Send one-time WhatsApp and email campaigns to a segment of your leads.
                  </p>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setBrowseTemplatesOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#151f33] hover:bg-[#1c2b46] border border-[#22314d] text-slate-200 shadow-sm transition-colors cursor-pointer"
                  >
                    <Sparkles size={13} className="text-purple-400" />
                    <span>Browse Templates</span>
                  </button>

                  <button
                    onClick={() => setNewCampaignOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ New Campaign</span>
                  </button>

                  <button
                    onClick={loadAll}
                    disabled={loading}
                    className="p-1.5 rounded-lg bg-[#151f33] hover:bg-[#1c2b46] border border-[#22314d] text-slate-300 hover:text-white shadow-sm transition-colors cursor-pointer"
                    title="Refresh campaigns"
                  >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                {/* Total Campaigns */}
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      TOTAL CAMPAIGNS
                    </div>
                    <div className="text-[26px] font-bold text-blue-400 mt-1 num">
                      {rows.length}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Lifetime</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <MessageSquare size={18} />
                  </div>
                </div>

                {/* Active */}
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      ACTIVE
                    </div>
                    <div className="text-[26px] font-bold text-emerald-400 mt-1 num">
                      {activeCount}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Running now</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                {/* Messages Sent */}
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      MESSAGES SENT
                    </div>
                    <div className="text-[26px] font-bold text-white mt-1 num">
                      {totalSent}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Delivered</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Send size={18} />
                  </div>
                </div>

                {/* Failed */}
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      FAILED
                    </div>
                    <div className="text-[26px] font-bold text-slate-300 mt-1 num">
                      0
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Delivery errors</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-500/15 border border-slate-500/30 flex items-center justify-center text-slate-400">
                    <AlertCircle size={18} />
                  </div>
                </div>
              </div>

              {/* Tip Callout Box */}
              <div className="rounded-xl bg-[#0d1627] border border-blue-900/60 px-4 py-3 text-xs text-blue-200 leading-relaxed shadow-md flex items-start gap-2">
                <span className="font-bold text-blue-300 shrink-0">Tip:</span>
                <span>
                  WhatsApp messages are sent from your configured WhatsApp number (Settings → Meta/Facebook). Emails are sent from your SMTP (Settings → Email/SMTP). Use{" "}
                  <code className="bg-blue-950/80 border border-blue-800/60 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[11px]">&#123;&#123;name&#125;&#125;</code> and{" "}
                  <code className="bg-blue-950/80 border border-blue-800/60 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[11px]">&#123;&#123;phone&#125;&#125;</code> as variables in your message.
                </span>
              </div>

              {/* Main Campaigns Content / Empty State Box */}
              {rows.length === 0 ? (
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-12 text-center shadow-lg flex flex-col items-center justify-center min-h-[220px]">
                  <p className="text-sm font-medium text-slate-400">
                    No campaigns yet. Create your first one!
                  </p>
                  <button
                    onClick={() => setNewCampaignOpen(true)}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create Campaign</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0c1220] border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10.5px] font-bold">
                        <tr>
                          <th className="px-4 py-3">Campaign</th>
                          <th className="px-4 py-3">Channel</th>
                          <th className="px-4 py-3">Spend</th>
                          <th className="px-4 py-3">Leads</th>
                          <th className="px-4 py-3">Apps</th>
                          <th className="px-4 py-3">Disbursed</th>
                          <th className="px-4 py-3">CPL</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#162033]">
                        {rows.map((c: any) => (
                          <tr key={c.id} className="hover:bg-[#162033]/60 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-white">
                              {c.name}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold border border-sky-800/60 bg-sky-950/40 text-sky-300 uppercase">
                                {c.channel}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-200 num">
                              {fmtInr(c.spend)}
                            </td>
                            <td className="px-4 py-3.5 text-slate-300 num">{c.leads || 0}</td>
                            <td className="px-4 py-3.5 text-slate-300 num">{c.applications || 0}</td>
                            <td className="px-4 py-3.5 font-bold text-emerald-400 num">
                              {fmtInr(c.disbursed_amount || 0)}
                            </td>
                            <td className="px-4 py-3.5 text-slate-400 font-medium num">
                              {c.leads > 0 ? fmtInr(Math.round(c.spend / c.leads)) : "—"}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${
                                  c.status === "active"
                                    ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-300"
                                    : "border-slate-700 bg-slate-800/50 text-slate-400"
                                }`}
                              >
                                {c.status || "active"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right space-x-1">
                              <button
                                title="Delete / Move to Recycle Bin"
                                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                onClick={async () => {
                                  if (confirm(`Move campaign "${c.name}" to the Recycle Bin?`)) {
                                    await api(`/gn/campaigns/${c.id}`, { method: "DELETE" });
                                    loadAll();
                                  }
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Meta Ads ROAS Sub-view */
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Ad Spend</div>
                  <div className="text-[26px] font-bold text-white mt-1 num">₹90,100</div>
                  <div className="text-xs text-slate-400 mt-0.5">Last 30 Days</div>
                </div>
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Leads Captured</div>
                  <div className="text-[26px] font-bold text-blue-400 mt-1 num">909</div>
                  <div className="text-xs text-slate-400 mt-0.5">Avg. CPL ₹99.1</div>
                </div>
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Disbursed Volume</div>
                  <div className="text-[26px] font-bold text-emerald-400 mt-1 num">₹1,95,50,000</div>
                  <div className="text-xs text-slate-400 mt-0.5">317 Applications</div>
                </div>
                <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Blended ROAS</div>
                  <div className="text-[26px] font-bold text-purple-400 mt-1 num">21.7×</div>
                  <div className="text-xs text-slate-400 mt-0.5">Commission / Ad Spend</div>
                </div>
              </div>

              <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden shadow-lg">
                <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between bg-[#0c1220]">
                  <div className="font-bold text-white text-sm">Live Meta & Google Campaigns</div>
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/50">● 3 Running</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1220] border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10.5px] font-bold">
                      <tr>
                        <th className="px-4 py-3">Ad Campaign</th>
                        <th className="px-4 py-3">Placement</th>
                        <th className="px-4 py-3">Spend</th>
                        <th className="px-4 py-3">Impressions</th>
                        <th className="px-4 py-3">Leads</th>
                        <th className="px-4 py-3">CPL</th>
                        <th className="px-4 py-3">Disbursed</th>
                        <th className="px-4 py-3">ROAS</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#162033]">
                      {META_ADS_DATA.map((ad) => (
                        <tr key={ad.id} className="hover:bg-[#162033]/60 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-white">{ad.campaign}</td>
                          <td className="px-4 py-3.5 text-slate-400">{ad.platform}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-200 num">₹{ad.spend.toLocaleString()}</td>
                          <td className="px-4 py-3.5 text-slate-300 num">{ad.impressions.toLocaleString()}</td>
                          <td className="px-4 py-3.5 font-bold text-blue-400 num">{ad.leads}</td>
                          <td className="px-4 py-3.5 font-medium text-slate-300 num">₹{ad.cpl}</td>
                          <td className="px-4 py-3.5 font-bold text-emerald-400 num">₹{(ad.disbursed / 100000).toFixed(1)}L</td>
                          <td className="px-4 py-3.5 font-black text-purple-400 num">{ad.roas}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${ad.status === "active" ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/50" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                              {ad.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: WORKFLOW BUILDER
         ========================================================================= */}
      {currentSub === "workflows" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Workflow Builder</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Workflows</div>
              <p className="text-xs text-slate-400 mt-0.5">Automated lead routing, instant WhatsApp triggers and task assignment sequences.</p>
            </div>
            <button
              onClick={() => setNewWorkflowOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>+ New Workflow</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Workflows</div>
              <div className="text-[26px] font-bold text-white mt-1 num">{workflowsData.rows?.length || 0}</div>
            </div>
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Automated</div>
              <div className="text-[26px] font-bold text-emerald-400 mt-1 num">
                {workflowsData.rows?.filter((w: any) => w.status === "active").length || 0}
              </div>
            </div>
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Triggers Fired</div>
              <div className="text-[26px] font-bold text-blue-400 mt-1 num">
                {workflowsData.rows?.reduce((a: number, w: any) => a + (w.run_count || 0), 0) || 0}
              </div>
            </div>
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 shadow-lg">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Response Time</div>
              <div className="text-[26px] font-bold text-purple-400 mt-1 num">1.2s</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflowsData.rows?.map((w: any) => {
              const actions = Array.isArray(w.actions)
                ? w.actions
                : (() => { try { return JSON.parse(w.actions || "[]"); } catch { return []; } })();
              return (
                <div key={w.id} className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Workflow size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{w.name}</div>
                          <div className="text-[11px] text-slate-400">Trigger: {w.trigger} · Ran {w.run_count || 0} times</div>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${w.status === "active" ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/50" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                        {w.status || "active"}
                      </span>
                    </div>

                    <div className="mt-3 bg-[#0c1220] border border-[#1e293b] rounded-lg p-3 text-xs text-slate-300 space-y-1.5">
                      <div className="font-semibold text-slate-200">Action Chain:</div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {actions.map((act: any, idx: number) => (
                          <span key={idx} className="bg-[#151f33] border border-[#22314d] px-2 py-0.5 rounded text-[11px] font-medium text-slate-200 flex items-center gap-1">
                            <span className="text-indigo-400">➔</span>
                            <span>{act.title || act.type}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between">
                    <button
                      onClick={async () => {
                        const r = await api(`/gn/workflows/${w.id}/run`, { method: "POST" });
                        alert(`Workflow fired! ${r.enqueued || 1} actions executed.`);
                        loadAll();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#151f33] hover:bg-[#1c2b46] border border-[#22314d] text-indigo-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Play size={12} />
                      <span>Run Now</span>
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete workflow "${w.name}"?`)) {
                          await api(`/gn/workflows/${w.id}`, { method: "DELETE" });
                          loadAll();
                        }
                      }}
                      className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: IVR
         ========================================================================= */}
      {currentSub === "ivr" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">IVR & Inbound Calls</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / IVR</div>
              <p className="text-xs text-slate-400 mt-0.5">Virtual smart receptionist with key-press routing to telecallers, sales managers and support.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSimCallOpen(ivrMenus[0] || { id: 1, name: "Main Line IVR" })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#151f33] hover:bg-[#1c2b46] border border-[#22314d] text-emerald-300 shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Phone size={13} className="text-emerald-400" />
                <span>Simulate Call</span>
              </button>
              <button
                onClick={() => setNewIvrOpen(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus size={14} />
                <span>+ New IVR Menu</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="font-bold text-white text-sm mb-2">Key 1 · Telecalling Desk</div>
              <p className="text-xs text-slate-400">Routes new inbound personal & business loan inquiries to round-robin telecallers.</p>
              <div className="mt-3 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-md inline-block">Active: 6 Agents Online</div>
            </div>
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="font-bold text-white text-sm mb-2">Key 2 · Sales & Sanction Desk</div>
              <p className="text-xs text-slate-400">Routes pre-approved borrowers to Senior Credit Managers for scheme matching.</p>
              <div className="mt-3 text-[11px] font-semibold text-blue-300 bg-blue-950/40 border border-blue-800/50 px-2.5 py-1 rounded-md inline-block">Active: 4 Credit Managers</div>
            </div>
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="font-bold text-white text-sm mb-2">Key 3 · Partner / DSA Support</div>
              <p className="text-xs text-slate-400">Inbound helpline for Connectors and sub-DSAs regarding commission reconciliations.</p>
              <div className="mt-3 text-[11px] font-semibold text-purple-300 bg-purple-950/40 border border-purple-800/50 px-2.5 py-1 rounded-md inline-block">Active: Payout Desk</div>
            </div>
          </div>

          {/* Call Logs Table */}
          <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden shadow-lg">
            <div className="px-4 py-3 border-b border-[#1e293b] font-bold text-white text-sm bg-[#0c1220]">Recent Inbound Calls & Recordings</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c1220] border-b border-[#1e293b] text-slate-400 uppercase tracking-wider text-[10.5px] font-bold">
                  <tr>
                    <th className="px-4 py-2.5">Call ID</th>
                    <th className="px-4 py-2.5">Caller Mobile</th>
                    <th className="px-4 py-2.5">Route</th>
                    <th className="px-4 py-2.5">Outcome</th>
                    <th className="px-4 py-2.5">Duration</th>
                    <th className="px-4 py-2.5">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#162033]">
                  {(ivrCalls.rows || []).slice(0, 5).map((c: any) => (
                    <tr key={c.id} className="hover:bg-[#162033]/60 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-white">{c.call_id}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-300">{c.caller}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-300">{c.route}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-800/50">
                          {c.outcome}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-400 num">{c.duration_sec || 45}s</td>
                      <td className="px-4 py-2.5 text-slate-500">{String(c.created_at || "Just now").slice(0, 16)}</td>
                    </tr>
                  ))}
                  {(!ivrCalls.rows || ivrCalls.rows.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        No calls recorded yet. Click "Simulate Call" above to test the dialer!
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
          VIEW 4: INBOX
         ========================================================================= */}
      {currentSub === "inbox" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Unified Inbox</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Inbox</div>
              <p className="text-xs text-slate-400 mt-0.5">Two-way WhatsApp, Email and SMS threads directly connected with borrower profiles.</p>
            </div>
            <button
              onClick={() => setComposeOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Send size={13} />
              <span>Compose Message</span>
            </button>
          </div>

          <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden shadow-lg divide-y divide-[#1e293b]">
            {inboxData.rows?.map((m: any) => (
              <div key={m.id} className="p-4 hover:bg-[#162033]/60 transition-colors flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{m.to_contact || m.from_contact}</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-[#151f33] text-indigo-300 border border-[#22314d] rounded">
                        {m.channel}
                      </span>
                      <span className="text-[11px] text-slate-400">· {m.subject}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{m.body}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] text-slate-400">{String(m.created_at || "Recent").slice(0, 16)}</div>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                    {m.status || "delivered"}
                  </span>
                </div>
              </div>
            ))}
            {(!inboxData.rows || inboxData.rows.length === 0) && (
              <div className="p-10 text-center text-slate-400 text-xs">
                Inbox is clean. Inbound messages from WhatsApp & SMS will show up here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 5: WHATSAPP DRIPS
         ========================================================================= */}
      {currentSub === "drips" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">WhatsApp Drips</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / WhatsApp Drips</div>
              <p className="text-xs text-slate-400 mt-0.5">Automated time-delayed message triggers for document collection, sanction drops and cross-sell.</p>
            </div>
            <button
              onClick={() => setNewDripOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>+ New Drip</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">Sequence · Stage 1</span>
                  <div className="text-sm font-bold text-white mt-1">Lead Captured → Instant Welcome</div>
                  <p className="text-xs text-slate-400 mt-1">Fires immediately when an inquiry arrives from website, Meta ad or walk-in.</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-300 bg-[#0c1220] p-3 rounded-lg border border-[#1e293b]">
                “Hi &#123;&#123;name&#125;&#125;, thanks for choosing Sniper Electric. Our loan officer is reviewing your profile…”
              </div>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/50">Sequence · Stage 2</span>
                  <div className="text-sm font-bold text-white mt-1">Day 1 Follow-up · Pending Documents</div>
                  <p className="text-xs text-slate-400 mt-1">Sends after 24 hours if borrower hasn't uploaded bank statements or PAN.</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Clock size={16} />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-300 bg-[#0c1220] p-3 rounded-lg border border-[#1e293b]">
                “Hello &#123;&#123;name&#125;&#125;, your sanction of ₹5 Lakhs is on hold awaiting 3 months statement. Click here to upload…”
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 6: TEMPLATES
         ========================================================================= */}
      {currentSub === "templates" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Message Templates</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Templates</div>
              <p className="text-xs text-slate-400 mt-0.5">Pre-approved WhatsApp & Email templates with variable merge tags.</p>
            </div>
            <button
              onClick={() => setNewTemplateOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>+ New Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_TEMPLATES.map((tpl) => (
              <div key={tpl.id} className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-purple-300 bg-purple-950/40 px-2.5 py-0.5 rounded border border-purple-800/50">
                        {tpl.category}
                      </span>
                      <div className="text-sm font-bold text-white mt-1.5">{tpl.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Channel: {tpl.channel.toUpperCase()}</div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">#{tpl.id}</span>
                  </div>
                  <div className="mt-3 p-3 bg-[#0c1220] rounded-lg border border-[#1e293b] text-xs text-slate-300 font-sans leading-relaxed">
                    {tpl.body}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between">
                  <button
                    onClick={() => copyToClipboard(tpl.body, tpl.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors"
                  >
                    {copiedId === tpl.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copiedId === tpl.id ? "Copied!" : "Copy Text"}</span>
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(tpl)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                  >
                    Use in Campaign →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 7: BANNERS
         ========================================================================= */}
      {currentSub === "banners" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Marketing Banners & Collateral</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Banners</div>
              <p className="text-xs text-slate-400 mt-0.5">High-converting promotional banners ready to share on WhatsApp status, Instagram and partner networks.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BANNERS_DATA.map((b) => (
              <div key={b.id} className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden shadow-lg">
                {/* Visual Banner Preview */}
                <div className={`p-6 bg-gradient-to-tr ${b.gradient} text-white relative overflow-hidden`}>
                  <div className="absolute right-3 top-3 px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider">
                    {b.badge}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-white/80 font-semibold">{b.product}</div>
                  <div className="text-xl font-black mt-1">{b.title}</div>
                  <div className="text-xs text-white/90 mt-1 font-medium">{b.tagline}</div>
                  <div className="mt-4 flex flex-wrap gap-2 text-[10.5px]">
                    {b.features.map((f, i) => (
                      <span key={i} className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">✓ {f}</span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#0c1220] flex items-center justify-between border-t border-[#1e293b]">
                  <div className="text-xs font-semibold text-slate-300">Sniper Electric Official Creative</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Shareable link generated for ${b.title}`)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151f33] hover:bg-[#1c2b46] border border-[#22314d] text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Share2 size={12} />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => alert(`Downloading high-res banner asset for ${b.title}...`)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 8: FRANCHISE
         ========================================================================= */}
      {currentSub === "franchise" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">‹</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Franchise & Partner Hub</h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Home / Franchise</div>
              <p className="text-xs text-slate-400 mt-0.5">Scale your sub-DSA network, distribute partner kits and track franchisee commission tiers.</p>
            </div>
            <button
              onClick={() => nav("/channel")}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>Manage Partner Network →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <div className="font-bold text-white text-sm">Silver DSA Partner Tier</div>
              <div className="text-xs text-slate-400 mt-1">Disbursements: Up to ₹50 Lakhs/month</div>
              <div className="mt-3 text-lg font-black text-amber-400">1.25% Commission</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Instant portal login + dedicated credit desk</div>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <div className="font-bold text-white text-sm">Gold DSA Partner Tier</div>
              <div className="text-xs text-slate-400 mt-1">Disbursements: ₹50L – ₹2 Crores/month</div>
              <div className="mt-3 text-lg font-black text-blue-400">1.85% Commission</div>
              <div className="text-[11px] text-slate-400 mt-0.5">White-label branding + direct banker routing</div>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <div className="font-bold text-white text-sm">Platinum Franchise Partner</div>
              <div className="text-xs text-slate-400 mt-1">Disbursements: ₹2 Crores+/month</div>
              <div className="mt-3 text-lg font-black text-purple-400">2.40% Max Payout</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Master territory exclusivity + daily settlements</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS
         ========================================================================= */}

      {/* Modal: Browse Templates */}
      {browseTemplatesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setBrowseTemplatesOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#111827] rounded-2xl shadow-2xl border border-[#1e293b] overflow-hidden z-10 text-white">
            <div className="px-5 py-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0c1220]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <h3 className="font-bold text-white text-sm">Select Ready-to-Use Marketing Template</h3>
              </div>
              <button onClick={() => setBrowseTemplatesOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
              {PRESET_TEMPLATES.map((t) => (
                <div key={t.id} className="p-4 rounded-xl border border-[#1e293b] hover:border-indigo-500 hover:bg-[#151f33] transition-all flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{t.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-950/40 text-purple-300 rounded border border-purple-800/50">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans line-clamp-2 mt-1">{t.body}</p>
                  </div>
                  <button
                    onClick={() => handleSelectTemplate(t)}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shrink-0 cursor-pointer shadow-sm transition-all"
                  >
                    Use This
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Campaign */}
      {newCampaignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setNewCampaignOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111827] rounded-2xl shadow-2xl border border-[#1e293b] overflow-hidden z-10 text-white">
            <div className="px-5 py-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0c1220]">
              <h3 className="font-bold text-white text-sm">Create New Outbound Campaign</h3>
              <button onClick={() => setNewCampaignOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateCampaign} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Festive Blast 9.99%"
                  value={campForm.name}
                  onChange={(e) => setCampForm({ ...campForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Channel</label>
                  <select
                    value={campForm.channel}
                    onChange={(e) => setCampForm({ ...campForm, channel: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    {CHANNELS.map((ch) => (
                      <option key={ch} value={ch}>{ch.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Target Segment</label>
                  <select
                    value={campForm.audience}
                    onChange={(e) => setCampForm({ ...campForm, audience: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    {AUDIENCES.map((a) => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Budget / Spend (₹)</label>
                  <input
                    type="number"
                    value={campForm.spend}
                    onChange={(e) => setCampForm({ ...campForm, spend: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-indigo-500 num"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Expected Disbursal (₹)</label>
                  <input
                    type="number"
                    value={campForm.disbursed_amount}
                    onChange={(e) => setCampForm({ ...campForm, disbursed_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-indigo-500 num"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Message Content</label>
                <textarea
                  rows={3}
                  placeholder="Dear {{name}}, special pre-approved loan of ₹5,00,000 is ready..."
                  value={campForm.message}
                  onChange={(e) => setCampForm({ ...campForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setNewCampaignOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#151f33] border border-[#22314d] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer transition-all"
                >
                  Create & Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Simulate Call Dialpad */}
      {simCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setSimCallOpen(null)} />
          <div className="relative w-full max-w-sm bg-[#111827] rounded-2xl shadow-2xl border border-[#1e293b] overflow-hidden z-10 p-5 text-center text-white">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <Phone size={20} />
            </div>
            <h3 className="font-bold text-white text-sm">Interactive IVR Call Simulator</h3>
            <p className="text-xs text-slate-400 mt-1">Dial a key to test auto-receptionist routing:</p>

            <div className="grid grid-cols-3 gap-2 my-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((k) => (
                <button
                  key={k}
                  onClick={async () => {
                    const r = await api("/gn/ivr/calls", {
                      method: "POST",
                      body: { caller: "+91 98765 43210", ivr_menu_id: simCallOpen.id, option: String(k), outcome: "connected" }
                    });
                    alert(`Key ${k} pressed! Call successfully routed to: ${r.route || "Telecalling"}`);
                    setSimCallOpen(null);
                    loadAll();
                  }}
                  className="p-3 rounded-xl bg-[#0c1220] hover:bg-indigo-600 hover:text-white font-mono font-bold text-slate-200 transition-colors border border-[#1e293b] cursor-pointer"
                >
                  {k}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSimCallOpen(null)}
              className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
