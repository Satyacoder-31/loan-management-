import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, PageHeader, Badge, Field, Modal, Drawer, EmptyState } from "../../components/ui";
import { api, fmtInr, fmtDate } from "../../lib/api";
import { ImportExport, WorkflowStepper } from "./shared";
import { Search, RefreshCw, UserPlus, Send, CheckCircle2, ShieldCheck, Database, GitCompare, FileText, Upload, Rocket, Eye, X } from "lucide-react";
import { Link } from "react-router-dom";

const TABS = [
  ["all", "All Applicants"], ["kyc", "KYC"], ["credit", "Credit Profile"], ["match", "Lender Match"],
  ["docs", "Documents"], ["uw", "Underwriting"], ["sanction", "Sanctions"], ["disbursement", "Disbursement"], ["payout", "Payouts"]
] as const;

const APP2GN: Record<string, string> = {
  none: "app_created", created: "app_created", submitted: "submitted", uw: "uw", approved: "approved",
  sanctioned: "sanction_generated", agreement: "agreement_completed", disb_initiated: "disb_initiated",
  disbursed: "disb_confirmed", payout: "payout_received", rejected: "rejected"
};

export function GnApplicants() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? "all";
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [loanType, setLoanType] = useState("");
  const [detail, setDetail] = useState<any>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [showCirModal, setShowCirModal] = useState(false);

  const load = useCallback((t = tab) => {
    const p = new URLSearchParams({ tab: t, limit: "50" });
    if (q) p.set("q", q);
    if (loanType) p.set("loan_type", loanType);
    api(`/gn/co/applicants?${p}`).then((r) => { setRows(r.rows); setTotal(r.total); });
  }, [q, loanType, tab]);

  useEffect(() => { load(tab); }, [tab, load]);

  const openDetail = async (id: number) => {
    const r = await api(`/gn/co/applicants/${id}`);
    setDetail(r);
  };

  useEffect(() => {
    const d = params.get("detail");
    if (d) openDetail(Number(d));
  }, [params]);

  const act = async (k: string, fn: () => Promise<any>, reOpen = true) => {
    setBusy(k); setMsg(null);
    try {
      await fn();
      if (reOpen && detail?.applicant?.id) await openDetail(detail.applicant.id);
      load();
    } catch (e: any) {
      setMsg(e.message ?? "Action failed");
    } finally {
      setBusy(null);
    }
  };

  const a = detail?.applicant;
  const app = detail?.application;
  const disabled = (k: string) => busy !== null;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Loan Applicants"
        sub="End-to-end digital customer onboarding — OTP, KYC verification, credit profiling, instant lender-matching & document upload"
        breadcrumb="Growth Nations / Command Center / Applicants"
        actions={
          <div className="flex items-center gap-2">
            <ImportExport entity="applicants" />
            <button className="btn btn-secondary text-[12px] flex items-center gap-1.5 cursor-pointer" onClick={() => load(tab)}>
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <Link to="/gn/co/new" className="btn btn-primary text-[12px] flex items-center gap-1.5 shadow-sm shadow-indigo-600/30">
              <UserPlus className="w-3.5 h-3.5" /> New Applicant
            </Link>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setParams({ tab: key }); load(key); }}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
              tab === key
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500"
                : "bg-[#111827] border border-[#1e293b] text-slate-300 hover:bg-[#162033] hover:text-white hover:border-indigo-500/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Card pad={false} className="bg-[#111827] border-[#1e293b]">
        <div className="p-3 border-b border-[#1e293b] flex flex-wrap items-center gap-2">
          <div className="flex items-center flex-1 min-w-[220px] border border-[#1e293b] rounded-lg px-2.5 bg-[#0c1220] focus-within:border-indigo-500 transition-colors">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              className="input border-0 bg-transparent shadow-none flex-1 text-[12.5px] text-white placeholder-slate-500 focus:ring-0"
              placeholder="Search by ref, name, mobile or PAN…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>
          <select className="input text-[12.5px] w-auto border-[#1e293b] bg-[#0c1220] text-slate-200" value={loanType} onChange={(e) => { setLoanType(e.target.value); load(); }}>
            <option value="">All loan types</option>
            {["Green Energy Finance for Business", "Green Energy Finance for Individual", "Business Loan", "Personal Loan", "Home Loan", "Loan Against Property", "Vehicle Loan", "Equipment Loan", "Working Capital"].map((t) => <option key={t}>{t}</option>)}
          </select>
          <span className="text-[11px] text-slate-400 font-semibold font-mono">{total} applicants</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10.5px] uppercase tracking-wider text-slate-400 border-b border-[#1e293b] bg-[#0c1220]">
                <th className="px-4 py-2.5 font-semibold">Applicant</th>
                <th className="px-3 py-2.5 font-semibold">Loan</th>
                <th className="px-3 py-2.5 font-semibold">Amount</th>
                <th className="px-3 py-2.5 font-semibold">KYC</th>
                <th className="px-3 py-2.5 font-semibold">Credit</th>
                <th className="px-3 py-2.5 font-semibold">Match</th>
                <th className="px-3 py-2.5 font-semibold">Docs</th>
                <th className="px-3 py-2.5 font-semibold">Application</th>
                <th className="px-3 py-2.5 font-semibold">Lender</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[#182235] hover:bg-[#152033]/60 cursor-pointer transition-colors" onClick={() => openDetail(r.id)}>
                  <td className="px-4 py-2.5">
                    <div className="text-[12.5px] font-semibold text-slate-100">{r.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{r.ref} · {r.mobile ?? "—"}</div>
                  </td>
                  <td className="px-3 py-2.5 text-[11.5px] text-slate-300">{r.loan_type ?? "—"}</td>
                  <td className="px-3 py-2.5 text-[12px] font-semibold text-white font-mono">{fmtInr(r.loan_amount)}</td>
                  <td className="px-3 py-2.5"><Badge status={r.kyc_status}>{r.kyc_status?.replace(/_/g, " ")}</Badge></td>
                  <td className="px-3 py-2.5 text-[12px] font-bold text-indigo-400 font-mono">{r.credit_score ? `${r.credit_score} DEMO` : "—"}</td>
                  <td className="px-3 py-2.5"><Badge status={r.match_status}>{r.match_status?.replace(/_/g, " ")}</Badge></td>
                  <td className="px-3 py-2.5"><Badge status={r.doc_status}>{r.doc_status}</Badge></td>
                  <td className="px-3 py-2.5 text-[11px] text-slate-400 font-mono">{r.app_ref ?? "—"}</td>
                  <td className="px-3 py-2.5 text-[11.5px] text-slate-300">{r.selected_lender ?? "—"}</td>
                  <td className="px-3 py-2.5"><Badge status={r.app_status}>{r.app_status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="p-8"><EmptyState title="No applicants in this queue" sub="Create a new applicant or run the demo scenario" /></div>}
        </div>
      </Card>

      {msg && <div className="text-[12px] font-semibold text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-lg">{msg}</div>}

      <Drawer open={!!a} onClose={() => setDetail(null)} title={a ? `${a.name} — ${a.ref}` : ""} width="max-w-3xl">
        {a && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge status={a.app_status}>{a.app_status}</Badge>
              <Badge status={a.kyc_status}>KYC: {a.kyc_status?.replace(/_/g, " ")}</Badge>
              <Badge status={a.consent_status}>Consent: {a.consent_status?.replace(/_/g, " ")}</Badge>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 rounded-full px-2 py-0.5">DEMO</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[11.5px]">
              <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5"><div className="text-slate-400 text-[10px] uppercase font-semibold">Loan</div><div className="font-semibold text-white mt-0.5">{a.loan_type ?? "—"}</div></div>
              <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5"><div className="text-slate-400 text-[10px] uppercase font-semibold">Amount</div><div className="font-semibold text-white mt-0.5 font-mono">{fmtInr(a.loan_amount)}</div></div>
              <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5"><div className="text-slate-400 text-[10px] uppercase font-semibold">Tenure</div><div className="font-semibold text-white mt-0.5">{a.tenure ? `${a.tenure} mo` : "—"}</div></div>
              <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5"><div className="text-slate-400 text-[10px] uppercase font-semibold">Employment</div><div className="font-semibold text-white mt-0.5">{a.employment_type ?? "—"}</div></div>
              <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5"><div className="text-slate-400 text-[10px] uppercase font-semibold">City / State</div><div className="font-semibold text-white mt-0.5">{a.city ?? "—"}, {a.state ?? "—"}</div></div>
              <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5"><div className="text-slate-400 text-[10px] uppercase font-semibold">PAN</div><div className="font-semibold text-white mt-0.5 font-mono">{a.pan ? `${a.pan.slice(0, 2)}XXXX${a.pan.slice(-2)}` : "—"}</div></div>
              <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5"><div className="text-slate-400 text-[10px] uppercase font-semibold">Mobile</div><div className="font-semibold text-white mt-0.5 font-mono">{a.mobile ?? "—"}</div></div>
              <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5"><div className="text-slate-400 text-[10px] uppercase font-semibold">Source</div><div className="font-semibold text-white mt-0.5">{a.source ?? "—"}</div></div>
            </div>

            <WorkflowStepper status={APP2GN[a.app_status] ?? "app_created"} amount={a.loan_amount} />

            {/* OTP + Consent */}
            <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-3.5">
              <div className="text-[12.5px] font-bold text-white mb-2">1 · Mobile OTP & Consent</div>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-secondary text-[11px] cursor-pointer" disabled={disabled("otp")} onClick={() => act("otp", () => api(`/gn/co/applicants/${a.id}/otp`, { method: "POST", body: { action: "send" } }), false).then(() => openDetail(a.id))}><Send className="w-3 h-3 mr-1" />Send OTP (demo 123456)</button>
                <button className="btn btn-secondary text-[11px] cursor-pointer" disabled={disabled("otp")} onClick={() => act("otp", () => api(`/gn/co/applicants/${a.id}/otp`, { method: "POST", body: { action: "verify", otp: "123456" } }))}><CheckCircle2 className="w-3 h-3 mr-1" />Verify OTP</button>
                <button className="btn btn-secondary text-[11px] cursor-pointer" disabled={disabled("consent")} onClick={() => act("consent", () => api(`/gn/co/applicants/${a.id}/consent`, { method: "POST", body: { purpose: "Loan application, KYC, credit information & lender sharing" } }))}><ShieldCheck className="w-3 h-3 mr-1" />Capture Consent</button>
              </div>
              {a.otp_status === "verified" && <div className="mt-2 text-[11px] text-emerald-400 font-semibold">✓ Mobile verified · consent {a.consent_status}</div>}
            </div>

            {/* KYC */}
            <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[12.5px] font-bold text-white">2 · KYC Verification Center</div>
                <button className="btn btn-secondary text-[11px] cursor-pointer" disabled={disabled("kyc") || a.consent_status !== "received"} onClick={() => act("kyc", () => api(`/gn/co/applicants/${a.id}/kyc`, { method: "POST", body: {} }))}><ShieldCheck className="w-3 h-3 mr-1" />Run Demo KYC</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {["mobile", "pan", "identity", "address", "bank"].map((t) => {
                  const k = detail.kyc?.find((x: any) => x.kyc_type === t);
                  return (
                    <div key={t} className={`rounded-xl border px-2.5 py-2 ${k?.status === "verified" ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-300" : "border-[#1e293b] bg-[#0c1220] text-slate-300"}`}>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">{t}</div>
                      <div className="text-[11px] font-bold mt-0.5">{k?.status === "verified" ? "Verified ✓" : k ? k.status : "Pending"}</div>
                      {k?.reference && <div className="text-[9.5px] text-slate-400 mt-0.5 font-mono">{k.reference}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Credit */}
            <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-3.5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-[12.5px] font-bold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  3 · Credit Profile & CIR Bureau
                </div>
                <div className="flex items-center gap-2">
                  {detail.credit && (
                    <button
                      type="button"
                      onClick={() => setShowCirModal(true)}
                      className="btn btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 font-semibold text-indigo-300 border border-indigo-500/30 bg-[#0c1220] hover:bg-[#152033] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      View Full Credit Report (CIR)
                    </button>
                  )}
                  <button
                    className="btn btn-secondary text-[11px] cursor-pointer flex items-center gap-1"
                    disabled={disabled("credit") || a.consent_status !== "received"}
                    onClick={() => act("credit", () => api(`/gn/co/applicants/${a.id}/credit`, { method: "POST", body: {} }))}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Pull Experian Bureau
                  </button>
                </div>
              </div>

              {detail.credit ? (
                <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-[#0c1220] to-[#111827]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex flex-col items-center justify-center shadow-md">
                      <div className="text-[18px] font-black font-mono leading-none">{detail.credit.score}</div>
                      <div className="text-[7.5px] font-bold text-indigo-200 uppercase mt-1">Score</div>
                    </div>
                    <div className="text-[11.5px] text-slate-300 space-y-0.5">
                      <div className="font-semibold text-white">
                        Accounts: <span className="text-emerald-400 font-bold">{detail.credit.active_accounts} active</span> · <span className="text-slate-400">{detail.credit.closed_accounts} closed</span> · {detail.credit.enquiries_6m} enquiries (6m)
                      </div>
                      <div>Total Outstanding: <strong className="text-white">{fmtInr(detail.credit.total_outstanding)}</strong> · Utilization {detail.credit.utilization_pct}%</div>
                      <div className="text-emerald-400 font-semibold text-[11px]">
                        ✓ {detail.credit.provider || "Experian Credit Analytics (Digitap)"} · Ref: <span className="font-mono">{detail.credit.reference || "EXP-LIVE"}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCirModal(true)}
                    className="btn text-[11px] py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect Tradelines
                  </button>
                </div>
              ) : (
                <EmptyState title="No credit profile" sub="Consent captured. Click 'Pull Experian Bureau' to query Credit Information Report." />
              )}
            </div>

            {/* Matches */}
            <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[12.5px] font-bold text-white">4 · Lender / Product Matching</div>
                <button className="btn btn-secondary text-[11px] cursor-pointer" disabled={disabled("match") || !detail.credit} onClick={() => act("match", () => api(`/gn/co/applicants/${a.id}/match`, { method: "POST", body: {} }))}><GitCompare className="w-3 h-3 mr-1" />Run Matcher</button>
              </div>
              <div className="space-y-2">
                {detail.matches?.map((m: any) => (
                  <div key={m.id} className={`rounded-xl border px-3 py-2 ${m.selected ? "border-indigo-500/40 bg-indigo-950/30" : "border-[#1e293b] bg-[#0c1220]"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[12px] font-semibold text-white">{m.lender_name} · {m.product_name}</div>
                        <div className="text-[10px] text-slate-400">{m.category} · {fmtInr(m.min_amount)}–{fmtInr(m.max_amount)} · {m.roi ?? "—"} · {m.tenure ?? "—"}</div>
                        {m.reasons?.length ? <div className="text-[9.5px] text-amber-400 mt-0.5">{JSON.parse(m.reasons).join(" · ")}</div> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[13px] font-extrabold font-mono ${m.status === "eligible" ? "text-emerald-400" : m.status === "maybe" ? "text-amber-400" : "text-rose-400"}`}>{m.score}%</span>
                        <Badge status={m.status}>{m.status}</Badge>
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400">Growth Nations product-match score — NOT a lender approval score · commission {m.commission_pct}%</div>
                  </div>
                ))}
                {!detail.matches?.length && <EmptyState title="No matches yet" sub="Run the matcher to see eligible lender products" />}
              </div>
            </div>

            {/* Application */}
            <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[12.5px] font-bold text-white">5 · Application & Documents</div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary text-[11px] cursor-pointer" disabled={disabled("apply") || !detail.matches?.length || !!app} onClick={() => act("apply", () => api(`/gn/co/applicants/${a.id}/apply`, { method: "POST", body: { match_id: detail.matches.find((m: any) => m.status === "eligible")?.id ?? detail.matches[0]?.id } }))}><FileText className="w-3 h-3 mr-1" />Create Application</button>
                  {app && <button className="btn btn-secondary text-[11px] cursor-pointer" disabled={disabled("docs")} onClick={() => act("docs", () => api(`/gn/co/applicants/${a.id}/docs-complete`, { method: "POST", body: {} }))}><Upload className="w-3 h-3 mr-1" />Verify All Docs</button>}
                </div>
              </div>
              {app && (
                <div className="mb-2 text-[11.5px] text-slate-300">
                  <span className="font-bold text-white font-mono">{app.ref}</span> · {app.lender_name ?? "—"} · {app.product_name ?? "—"} · {fmtInr(app.amount)} · <Badge status={app.status}>{app.status?.replace(/_/g, " ")}</Badge>
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {detail.docs?.map((d: any) => (
                  <span key={d.id} className={`rounded-lg border px-2 py-1 text-[10px] font-semibold ${d.status === "verified" || d.status === "uploaded" ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-300" : d.status === "rejected" ? "border-rose-500/30 bg-rose-950/30 text-rose-300" : "border-[#1e293b] bg-[#0c1220] text-slate-400"}`}>
                    {d.name}
                  </span>
                ))}
                {!detail.docs?.length && <span className="text-[11px] text-slate-400">Create the application to generate its document checklist</span>}
              </div>
            </div>

            {/* Lender journey */}
            {app && (
              <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-3.5">
                <div className="text-[12.5px] font-bold text-white mb-2">6 · Lender Journey (Demo)</div>
                <div className="flex flex-wrap gap-2">
                  {!["submitted", "uw", "approved", "sanction_generated", "agreement_completed", "disb_initiated", "disb_fully", "disb_confirmed", "crm_updated", "payout_received"].includes(app.status) && (
                    <button className="btn btn-secondary text-[11px] cursor-pointer" disabled={disabled("submit")} onClick={() => act("submit", () => api(`/gn/co/applicants/${a.id}/submit`, { method: "POST", body: {} }))}><Rocket className="w-3 h-3 mr-1" />Submit to Lender</button>
                  )}
                  {app.status === "submitted" && <button className="btn btn-secondary text-[11px] cursor-pointer" onClick={() => act("uw", () => api(`/gn/co/applicants/${a.id}/lender`, { method: "POST", body: { action: "underwrite" } }))}><Database className="w-3 h-3 mr-1" />Simulate Underwriting</button>}
                  {app.status === "uw" && <button className="btn btn-secondary text-[11px] cursor-pointer" onClick={() => act("approve", () => api(`/gn/co/applicants/${a.id}/lender`, { method: "POST", body: { action: "approve", amount: app.amount } }))}><CheckCircle2 className="w-3 h-3 mr-1" />Simulate Approval</button>}
                  {app.status === "approved" && <button className="btn btn-secondary text-[11px] cursor-pointer" onClick={() => act("sanction", () => api(`/gn/co/applicants/${a.id}/lender`, { method: "POST", body: { action: "sanction" } }))}><FileText className="w-3 h-3 mr-1" />Generate Sanction</button>}
                  {app.status === "sanction_generated" && <button className="btn btn-secondary text-[11px] cursor-pointer" onClick={() => act("agreement", () => api(`/gn/co/applicants/${a.id}/lender`, { method: "POST", body: { action: "agreement" } }))}><ShieldCheck className="w-3 h-3 mr-1" />Complete Agreement / eSign</button>}
                  {app.status === "agreement_completed" && <button className="btn btn-secondary text-[11px] cursor-pointer" onClick={() => act("disburse", () => api(`/gn/co/applicants/${a.id}/lender`, { method: "POST", body: { action: "disburse", amount: app.amount } }))}><Rocket className="w-3 h-3 mr-1" />Trigger Disbursement</button>}
                  {app.status === "disb_initiated" && <button className="btn btn-secondary text-[11px] cursor-pointer" onClick={() => act("fund", () => api(`/gn/co/applicants/${a.id}/lender`, { method: "POST", body: { action: "fund", amount: app.amount } }))}><Rocket className="w-3 h-3 mr-1" />Fund Transfer</button>}
                  {app.status === "disb_fully" && <button className="btn btn-secondary text-[11px] cursor-pointer" onClick={() => act("confirm", () => api(`/gn/co/applicants/${a.id}/lender`, { method: "POST", body: { action: "confirm" } }))}><CheckCircle2 className="w-3 h-3 mr-1" />Confirm Disbursement</button>}
                  {app.status === "disb_confirmed" && <button className="btn btn-secondary text-[11px] cursor-pointer" onClick={() => act("payout", () => api(`/gn/co/applicants/${a.id}/lender`, { method: "POST", body: { action: "payout" } }))}><Rocket className="w-3 h-3 mr-1" />Calculate Payout</button>}
                  {busy && <span className="text-[11px] text-indigo-400 font-semibold self-center">Processing {busy}…</span>}
                </div>

                {/* Sanction / Agreement / Disbursement / Payout records */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
                  <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5">
                    <div className="text-[9.5px] uppercase text-slate-400 font-semibold">Sanction</div>
                    {detail.sanctions?.[0] ? <div className="text-[11.5px] font-bold text-white mt-0.5 font-mono">{fmtInr(detail.sanctions[0].sanctioned_amount)}</div> : <div className="text-[11px] text-slate-500 mt-0.5">—</div>}
                  </div>
                  <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5">
                    <div className="text-[9.5px] uppercase text-slate-400 font-semibold">Agreement</div>
                    <div className="text-[11.5px] font-bold text-white mt-0.5">{detail.agreements?.[0]?.status ?? "—"}</div>
                  </div>
                  <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5">
                    <div className="text-[9.5px] uppercase text-slate-400 font-semibold">Disbursement</div>
                    {detail.disbursements?.[0] ? <div className="text-[11.5px] font-bold text-white mt-0.5 font-mono">{fmtInr(detail.disbursements[0].amount)}</div> : <div className="text-[11px] text-slate-500 mt-0.5">—</div>}
                  </div>
                  <div className="rounded-xl border border-[#1e293b] bg-[#0c1220] p-2.5">
                    <div className="text-[9.5px] uppercase text-slate-400 font-semibold">Payout</div>
                    {detail.payouts?.[0] ? <div className="text-[11.5px] font-bold text-emerald-400 mt-0.5 font-mono">{fmtInr(detail.payouts[0].gross)}</div> : <div className="text-[11px] text-slate-500 mt-0.5">—</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-3.5">
              <div className="text-[12.5px] font-bold text-white mb-2">Applicant Timeline & Audit</div>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {[...(detail.events ?? [])].map((e: any) => (
                  <div key={e.id} className="flex items-start gap-2 text-[11px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <div><span className="font-bold text-slate-200">{e.event}</span> <span className="text-slate-400">· {e.note}</span> <span className="text-slate-500">· {fmtDate(e.created_at)}</span></div>
                  </div>
                ))}
                {!detail.events?.length && <div className="text-[11px] text-slate-500">No events yet</div>}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
