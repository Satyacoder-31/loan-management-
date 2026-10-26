import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, PageHeader, Badge, EmptyState } from "../../components/ui";
import { api, fmtInr, fmtDate } from "../../lib/api";
import { gnBadge, gnStatusLabel } from "../../lib/gn";
import { ProcessFlow, ImportExport } from "./shared";
import { Landmark, ArrowDown, Wallet } from "lucide-react";

const DISB_STATUSES = ["disb_pending", "disb_initiated", "disb_partial", "disb_fully", "disb_confirmed", "crm_updated", "commission_reconciled", "disb_failed"];

export function GnDisbursement() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    Promise.all(DISB_STATUSES.map((s) => api(`/gn/applications?status=${s}&limit=50`).then((r) => r.rows))).then((groups) => {
      const all: any[] = []; for (const g of groups) all.push(...g);
      setRows(all.sort((a, b) => (b.disbursed_at ?? b.created_at).localeCompare(a.disbursed_at ?? a.created_at)));
    }).catch(() => {});
  }, []);
  const total = rows.reduce((s, r) => s + (r.disbursed_amount || 0), 0);
  const confirmed = rows.filter((r) => ["disb_confirmed", "crm_updated", "commission_reconciled"].includes(r.status)).length;
  const failed = rows.filter((r) => r.status === "disb_failed").length;

  return (
    <div className="space-y-5">
      <PageHeader title="Disbursement" sub="Lender-triggered disbursements — funds go directly from the lender to the borrower's bank account" breadcrumb="Growth Nations / CRM / Disbursement" actions={<div className="flex items-center gap-2"><ImportExport entity="applications" /></div>} />
      <ProcessFlow status="disb_fully" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Total Disbursed", fmtInr(total)], ["Confirmed", confirmed], ["Triggered / Pending", rows.length - confirmed - failed], ["Failed", failed]].map(([l, v]) => (
          <div key={l as string} className="rounded-xl border border-[#1e293b] bg-[#111827] px-4 py-3 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{l}</div>
            <div className="text-[18px] font-bold text-white mt-0.5 font-mono">{v}</div>
          </div>
        ))}
      </div>

      {/* Funds flow visual */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#111827] via-[#131d31] to-[#111827] p-5 shadow-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-white">Lender Processing</div>
            <div className="text-[11px] text-slate-400">Sanction & disbursement triggered</div>
          </div>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-500 rotate-[-90deg] hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center">
            <ArrowDown className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-emerald-400 font-mono">{fmtInr(total)}</div>
            <div className="text-[11px] text-slate-400">Directly transferred by lender</div>
          </div>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-500 rotate-[-90deg] hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-white">Borrower's Bank Account</div>
            <div className="text-[11px] text-slate-400">Growth Nations never holds loan funds</div>
          </div>
        </div>
      </div>

      <Card pad={false} className="bg-[#111827] border-[#1e293b]">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-[10.5px] uppercase tracking-wide text-slate-400 border-b border-[#1e293b] bg-[#0c1220]">
                <th className="px-3.5 py-2.5 font-semibold">Ref</th>
                <th className="px-3.5 py-2.5 font-semibold">Borrower</th>
                <th className="px-3.5 py-2.5 font-semibold">Bank</th>
                <th className="px-3.5 py-2.5 font-semibold">Product</th>
                <th className="px-3.5 py-2.5 font-semibold text-right">Disbursed</th>
                <th className="px-3.5 py-2.5 font-semibold text-right">Commission</th>
                <th className="px-3.5 py-2.5 font-semibold">Status</th>
                <th className="px-3.5 py-2.5 font-semibold">Disbursed On</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[#182235] hover:bg-[#152033]/60 transition-colors">
                  <td className="px-3.5 py-2.5 font-semibold text-indigo-400 font-mono">{r.ref}</td>
                  <td className="px-3.5 py-2.5 font-semibold text-white">{r.name}</td>
                  <td className="px-3.5 py-2.5 text-slate-300">{r.lender_name ?? "—"}</td>
                  <td className="px-3.5 py-2.5 text-slate-400">{r.product_name ?? "—"}</td>
                  <td className="px-3.5 py-2.5 font-semibold text-white text-right font-mono">{fmtInr(r.disbursed_amount || 0)}</td>
                  <td className="px-3.5 py-2.5 text-right font-mono">{r.commission_gross > 0 ? <span className="font-semibold text-emerald-400">{fmtInr(r.commission_gross)}</span> : <span className="text-slate-500">—</span>}</td>
                  <td className="px-3.5 py-2.5"><Badge status=""><span className={gnBadge(r.status)}>{gnStatusLabel(r.status)}</span></Badge></td>
                  <td className="px-3 py-2.5 text-zinc-400">{fmtDate(r.disbursed_at ?? r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <EmptyState title="No disbursements" sub="Walk a file through the pipeline in the Loan Applications workspace" />}
        </div>
      </Card>
      <div className="text-[11px] text-zinc-400">Manage each file in the <Link to="/gn/applications" className="text-brand-600 font-semibold">Loan Applications</Link> workspace — trigger disbursement, confirm funds and reconcile commission step by step.</div>
    </div>
  );
}
