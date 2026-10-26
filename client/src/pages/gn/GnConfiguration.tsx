import { useState, useEffect } from "react";
import { PageHeader } from "../../components/ui";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import {
  Facebook, Phone, MessageCircle, Mail, Globe, Settings2, Database, Zap,
  CreditCard, LayoutGrid, UserCheck, ShieldAlert, Search, Smartphone,
  Tag, Briefcase, Bell, FileText, Sparkles, Loader2, ShieldCheck
} from "lucide-react";

const INTEGRATIONS: { icon: any; name: string; status: string; tone: "done" | "pending" | "purchase"; desc: string }[] = [
  { icon: Facebook, name: "Meta / Facebook", status: "PENDING", tone: "pending", desc: "Connect Facebook Lead Ads & pages." },
  { icon: Phone, name: "IVR", status: "PENDING", tone: "pending", desc: "Call routing & IVR provider." },
  { icon: MessageCircle, name: "WhatsApp", status: "PURCHASE", tone: "purchase", desc: "Purchase to unlock WhatsApp Business API & drip." },
  { icon: Mail, name: "Email / SMTP", status: "PENDING", tone: "pending", desc: "Outbound email server settings." },
  { icon: Globe, name: "Website", status: "DONE", tone: "done", desc: "Your public lead-capture website & pages." },
  { icon: Settings2, name: "Field Customisation", status: "PENDING", tone: "pending", desc: "Custom fields per entity." },
  { icon: Database, name: "Lead Service", status: "PENDING", tone: "pending", desc: "Buy leads & product — we run the ads for your city." },
  { icon: Zap, name: "Integrations", status: "PENDING", tone: "pending", desc: "Connect external tools & third-party apps." },
  { icon: CreditCard, name: "Razorpay", status: "PENDING", tone: "pending", desc: "Payment gateway for collections." },
  { icon: LayoutGrid, name: "Custom Status", status: "DONE", tone: "done", desc: "Lead & loan statuses and view rules." },
  { icon: UserCheck, name: "Assignment Rules", status: "PENDING", tone: "pending", desc: "Auto-assign leads to your team." },
  { icon: ShieldAlert, name: "Credit Report Policy", status: "PENDING", tone: "pending", desc: "Require a collected payment before a lead's CIBIL / Experian pull." },
  { icon: Search, name: "Google Ads", status: "PENDING", tone: "pending", desc: "Track ad spend, leads & ROAS from Google Ads." },
  { icon: Smartphone, name: "PhonePe", status: "PENDING", tone: "pending", desc: "PhonePe gateway for collections." },
  { icon: Tag, name: "Lead Sources", status: "PENDING", tone: "pending", desc: "Where your leads come from." },
  { icon: Briefcase, name: "Product Verticals", status: "DONE", tone: "done", desc: "Enable loan / MF / insurance / stocks." },
  { icon: Bell, name: "PDD Alerts", status: "PENDING", tone: "pending", desc: "Who gets emailed when RC / Insurance is cleared on a loan." },
  { icon: FileText, name: "Invoice Format", status: "PENDING", tone: "pending", desc: "Choose your invoice layout + collection bank details." }
];

export function GnConfiguration() {
  const [experianLive, setExperianLive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api("/gn/co/experian-mode")
      .then((res: any) => {
        if (typeof res?.live === "boolean") setExperianLive(res.live);
      })
      .catch(() => {});
  }, []);

  const toggleExperian = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await api("/gn/co/experian-mode", {
        method: "POST",
        body: { live: !experianLive }
      });
      setExperianLive(res.live);
      setMsg(res.message);
    } catch (e: any) {
      setMsg(e.message || "Failed to update Experian mode");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuration"
        sub="Connect your channels & integrations — pick one to configure it"
        breadcrumb="Growth Nations / Configuration"
      />

      {/* Experian API Gateway & Billing Guard Card */}
      <div
        className={`rounded-2xl border p-5 transition-all shadow-xl backdrop-blur-md ${
          experianLive
            ? "bg-gradient-to-r from-amber-950/40 via-[#18181b]/90 to-amber-900/20 border-amber-500/40 shadow-amber-500/5"
            : "bg-gradient-to-r from-emerald-950/40 via-[#111827] to-teal-950/30 border-emerald-500/40 shadow-emerald-500/5"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-xl border shrink-0 ${
                experianLive
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[14.5px] font-bold text-white tracking-tight">
                  Digitap Experian Credit Analytics Gateway
                </span>
                <span
                  className={`text-[10.5px] font-extrabold px-3 py-0.5 rounded-full border ${
                    experianLive
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-xs"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-xs"
                  }`}
                >
                  {experianLive
                    ? "⚡ LIVE PRODUCTION API (BILLABLE)"
                    : "🛡️ COST-SAVER MODE (DEACTIVATED — ZERO BILLING)"}
                </span>
              </div>
              <div className="text-[12.5px] text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
                {experianLive
                  ? "Live Experian API calls are active. Each applicant credit bureau pull incurs production charges via Digitap."
                  : "Live Experian API calls are deactivated to protect your credit wallet. Zero billable calls are incurred in Cost-Saver mode."}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleExperian}
              disabled={busy}
              className={`btn text-[12px] px-4 py-2.5 font-bold shadow-md rounded-xl transition-all ${
                experianLive
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30"
              }`}
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />
              )}
              {experianLive
                ? "Deactivate Experian (Cost-Saver Mode)"
                : "Activate Live Experian (Billable)"}
            </button>
          </div>
        </div>
        {msg && (
          <div className="mt-3.5 pt-3 border-t border-slate-700/60 text-[12px] font-medium text-slate-300 flex items-center gap-1.5">
            <span>ℹ️</span> {msg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {INTEGRATIONS.map((i) => (
          <div
            key={i.name}
            className="group relative rounded-xl border border-[#1e293b] bg-[#111827] p-4.5 hover:border-indigo-500/50 hover:bg-[#152033] shadow-lg shadow-black/20 hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#0d1322] border border-[#22314d] flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
                  <i.icon className="w-4.5 h-4.5" />
                </div>
                <span
                  className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    i.tone === "done"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : i.tone === "purchase"
                      ? "bg-violet-500/15 text-violet-400 border-violet-500/30"
                      : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {i.status}
                </span>
              </div>
              <div className="text-[13.5px] font-bold text-white mt-3 group-hover:text-indigo-300 transition-colors">
                {i.name}
              </div>
              <div className="text-[12px] text-slate-400 mt-1 leading-snug">
                {i.desc}
              </div>
            </div>
            {i.tone === "purchase" && (
              <button className="btn btn-primary text-[11.5px] mt-4 w-full">
                Purchase
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="text-[12px] text-slate-400">
        Statuses are demo configuration states.{" "}
        <Link to="/gn/apis" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
          Verification APIs
        </Link>{" "}
        run in sandbox mode until production credentials are added.
      </div>
    </div>
  );
}

