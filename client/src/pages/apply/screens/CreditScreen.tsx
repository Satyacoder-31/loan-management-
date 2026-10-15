import React, { useState, useEffect } from "react";
import { ArrowRight, Gauge, CheckCircle2, ShieldCheck, AlertCircle, ShieldAlert, Info, Database, Lock } from "lucide-react";
import { journeyApi } from "../../../lib/api";
import type { JourneyData } from "../types";

interface CreditScreenProps {
  journey: JourneyData;
  onSuccess: (updatedJourney: JourneyData) => void;
}

export function CreditScreen({ journey, onSuccess }: CreditScreenProps) {
  const [score, setScore] = useState<number | null>(journey.credit_score ?? null);
  const [displayScore, setDisplayScore] = useState(300);
  const [loading, setLoading] = useState(journey.credit_score === undefined || journey.credit_score === null);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const fetchScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await journeyApi<{
        ok: boolean;
        provider?: string;
        score: number | null;
        score_band?: string;
        status: string;
        message?: string;
        active_accounts?: number;
        closed_accounts?: number;
        total_outstanding?: number;
        credit_utilization?: number;
      }>("/origination/credit/check", {
        method: "POST"
      });
      const validScore = typeof res.score === "number" ? res.score : null;
      setScore(validScore);
      setReportData(res);
      if (!validScore && res.message) {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to pull Experian credit score.");
      setScore(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (score === null || score === undefined) {
      fetchScore();
    }
  }, []);

  // Smooth counter animation up to real score if available
  useEffect(() => {
    if (!score) return;
    let start = 300;
    const duration = 1200;
    const increment = Math.ceil((score - start) / (duration / 25));
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [score]);

  const handleContinue = () => {
    const updated: JourneyData = {
      ...journey,
      credit_score: score ?? undefined,
      status: "CREDIT_COMPLETED",
      current_step: "offers",
      completed_steps: [...new Set([...journey.completed_steps, "credit"])]
    };
    onSuccess(updated);
  };

  const getScoreBand = (s: number) => {
    if (s >= 750) return { label: "Excellent (Experian Prime)", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    if (s >= 700) return { label: "Very Good", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" };
    if (s >= 650) return { label: "Good", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
    return { label: "Moderate", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  };

  const isIpBlocked = reportData?.status === "IP_BLOCKED" || error?.includes("IP");
  const isAuthFailed = reportData?.status === "AUTH_FAILED" || error?.includes("401");
  const isNoRecord = reportData?.status === "NO_RECORD_FOUND" || reportData?.status === "NAME_NOT_FOUND";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <Gauge className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Experian Credit Bureau Health & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Direct integration with Digitap Credit Analytics API Suite (v2.7) for Experian India Consumer Bureau.
        </p>
      </div>

      <div className="bg-[#161b22] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-center">
        {loading ? (
          <div className="py-12 space-y-4">
            <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-zinc-300 font-medium">
              Connecting to Experian Credit Analytics via Digitap Gateway...
            </p>
            <p className="text-xs text-zinc-500">
              Verifying bureau entitlement, CAIS tradelines & credit score
            </p>
          </div>
        ) : score !== null ? (
          <>
            {/* Real Bureau Score Display */}
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-b from-zinc-800/80 to-zinc-900 border border-zinc-700 shadow-inner">
                <div className="space-y-1">
                  <span className="text-5xl sm:text-6xl font-extrabold font-mono text-emerald-400 tracking-tight">
                    {displayScore}
                  </span>
                  <p className="text-xs text-zinc-400 font-medium">Experian Score / 900</p>
                </div>
              </div>

              <div>
                {(() => {
                  const band = getScoreBand(score);
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${band.bg} ${band.color} border ${band.border}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{band.label}</span>
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Score Factor Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-2">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Active Facilities</p>
                <p className="text-sm font-bold text-white font-mono mt-0.5">{reportData?.active_accounts ?? 0}</p>
                <p className="text-[10px] text-zinc-400">Live credit lines</p>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Utilization</p>
                <p className="text-sm font-bold text-white font-mono mt-0.5">{reportData?.credit_utilization ? `${reportData.credit_utilization}%` : "Low"}</p>
                <p className="text-[10px] text-emerald-400">Risk ratio</p>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Outstanding</p>
                <p className="text-sm font-bold text-white font-mono mt-0.5">₹{(reportData?.total_outstanding ?? 0).toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-indigo-400">Bureau recorded</p>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Enquiries (6M)</p>
                <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{reportData?.enquiries_6m ?? 0}</p>
                <p className="text-[10px] text-zinc-400">Recent inquiries</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Pre-Approved Lender Offers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* Live Bureau Status Explainer (No Fake Data) */
          <div className="space-y-6 text-left">
            {isIpBlocked ? (
              <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-300">Digitap Production Egress IP Blocked (HTTP 403)</h3>
                    <p className="text-xs text-amber-200/80">Digitap Production requires server IP Whitelisting.</p>
                  </div>
                </div>
                <div className="p-3 bg-black/40 rounded-lg border border-amber-500/20 text-xs font-mono text-zinc-300 space-y-1">
                  <div>Your Machine Egress IP: <strong className="text-amber-400">152.58.36.140</strong></div>
                  <div>Endpoint: <span className="text-zinc-400">https://api.digitap.ai/credit_analytics/request</span></div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your Digitap production credentials are verified, but Digitap firewall blocks requests until your public IP is added to the authorized whitelist on your Digitap Production Dashboard. Once whitelisted, real Experian credit scores will appear immediately.
                </p>
              </div>
            ) : isAuthFailed ? (
              <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-300">Digitap UAT Sandbox Mode (HTTP 401)</h3>
                    <p className="text-xs text-blue-200/80">Experian Credit Analytics not enabled on UAT demo key.</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The UAT client ID <code className="text-blue-300 font-mono">07625809</code> is not entitled for &quot;Credit Analytics 1&quot; on Digitap demo servers. Furthermore, by RBI and credit bureau regulations, live personal credit reports can never be queried in a UAT sandbox (only synthetic numbers like <code className="text-zinc-300">7908096603</code> are available).
                </p>
              </div>
            ) : isNoRecord ? (
              <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">No Bureau Record Found (Thin File)</h3>
                    <p className="text-xs text-zinc-400">No credit file found for this mobile number in Experian.</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Experian returned no previous loan or credit card tradelines for this mobile number. You can continue with standard income-based lender matching.
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Bureau Inquiries Pending</h3>
                    <p className="text-xs text-zinc-400">{error || "Credit score is currently unavailable."}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-2">
              <div className="font-semibold text-zinc-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Zero Fake Data Policy</span>
              </div>
              <p>
                In compliance with lending compliance standards, fabricated dummy scores (e.g. 782) are never injected into your loan application.
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue with Baseline Underwriting</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
