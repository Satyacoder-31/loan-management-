import React, { useMemo, useState } from "react";
import {
  Calculator, PieChart, TrendingUp, DollarSign, Calendar, Sliders,
  HelpCircle, Share2, Download, CheckCircle2, ChevronRight, Sparkles, Building2
} from "lucide-react";
import { fmtInr } from "../../lib/api";

type CalcTab = "emi" | "sip" | "rd" | "ssy" | "ppf" | "lumpsum" | "mf" | "compare" | "eligibility";

export function GnTools() {
  const [activeTab, setActiveTab] = useState<CalcTab>("emi");

  // EMI Calculator Inputs
  const [amount, setAmount] = useState<number>(2500000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  // Eligibility Inputs
  const [income, setIncome] = useState<number>(120000);
  const [obligations, setObligations] = useState<number>(25000);
  const [foirCap, setFoirCap] = useState<number>(55);
  const [eligRate, setEligRate] = useState<number>(9.5);
  const [eligTenure, setEligTenure] = useState<number>(20);

  // SIP Inputs
  const [sipMonthly, setSipMonthly] = useState<number>(15000);
  const [sipRate, setSipRate] = useState<number>(12.5);
  const [sipYears, setSipYears] = useState<number>(15);

  // Computed EMI
  const tenureMonths = tenureType === "years" ? tenureYears * 12 : tenureYears;
  const emiCalc = useMemo(() => {
    if (amount <= 0 || tenureMonths <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    const r = rate / 1200;
    if (r === 0) return { emi: Math.round(amount / tenureMonths), totalInterest: 0, totalPayment: amount };
    const emi = Math.round((amount * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1));
    const totalPayment = emi * tenureMonths;
    const totalInterest = Math.max(0, totalPayment - amount);
    return { emi, totalInterest, totalPayment };
  }, [amount, rate, tenureMonths]);

  // Principal vs Interest percentage
  const principalPct = emiCalc.totalPayment > 0 ? Math.round((amount / emiCalc.totalPayment) * 100) : 50;
  const interestPct = Math.max(0, 100 - principalPct);

  // Amortization Schedule (Year by Year)
  const amortizationSchedule = useMemo(() => {
    const rows = [];
    let balance = amount;
    const monthlyRate = rate / 1200;
    const emi = emiCalc.emi;

    const numYears = Math.min(30, Math.ceil(tenureMonths / 12));
    for (let yr = 1; yr <= numYears; yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      const opening = balance;

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const interestM = balance * monthlyRate;
        const principalM = Math.min(balance, emi - interestM);
        yearlyInterest += interestM;
        yearlyPrincipal += principalM;
        balance -= principalM;
      }

      rows.push({
        year: yr,
        opening: Math.round(opening),
        emiPaid: Math.round(emi * 12),
        principalPaid: Math.round(yearlyPrincipal),
        interestPaid: Math.round(yearlyInterest),
        closing: Math.max(0, Math.round(balance))
      });

      if (balance <= 0) break;
    }
    return rows;
  }, [amount, rate, tenureMonths, emiCalc.emi]);

  // Eligibility Output
  const eligCalc = useMemo(() => {
    const maxEmiAllowed = Math.max(0, (income * (foirCap / 100)) - obligations);
    const r = eligRate / 1200;
    const n = eligTenure * 12;
    if (r === 0) return { maxLoan: maxEmiAllowed * n, maxEmiAllowed };
    const maxLoan = Math.round((maxEmiAllowed * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)));
    return { maxLoan, maxEmiAllowed };
  }, [income, obligations, foirCap, eligRate, eligTenure]);

  // SIP Output
  const sipCalc = useMemo(() => {
    const n = sipYears * 12;
    const i = sipRate / 1200;
    const invested = sipMonthly * n;
    const totalWealth = Math.round(sipMonthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const returns = Math.max(0, totalWealth - invested);
    return { invested, returns, totalWealth };
  }, [sipMonthly, sipRate, sipYears]);

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto text-slate-100 font-sans pb-16">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11.5px] font-medium text-slate-400 mb-1">Home / Utility / Tools</div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold tracking-tight text-white flex items-center gap-2">
              Financial Calculators & Tools
            </h1>
            <HelpCircle size={15} className="text-slate-500 cursor-pointer hover:text-slate-300" />
          </div>
          <p className="text-[13px] text-slate-400 mt-1">
            Accurate multi-purpose financial calculators with amortization schedule and visual breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#111827] border border-[#1e293b] text-slate-300 hover:text-white hover:bg-[#162033] text-[12px] font-medium transition-all shadow-sm">
            <Share2 size={14} className="text-indigo-400" />
            <span>Share with Borrower</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563eb] hover:bg-blue-600 text-white text-[12px] font-semibold transition-all shadow-md shadow-blue-600/30">
            <Download size={14} />
            <span>Export Amortization PDF</span>
          </button>
        </div>
      </div>

      {/* 9 Calculator Pill Tabs matching Screenshot 31 */}
      <div className="flex gap-2 border-b border-[#182235] pb-3 overflow-x-auto scrollbar-none">
        {[
          { key: "emi", label: "EMI" },
          { key: "sip", label: "SIP" },
          { key: "rd", label: "RD" },
          { key: "ssy", label: "SSY" },
          { key: "ppf", label: "PPF" },
          { key: "lumpsum", label: "Lumpsum" },
          { key: "mf", label: "MF Returns" },
          { key: "compare", label: "Compare ROI" },
          { key: "eligibility", label: "Eligibility" }
        ].map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as CalcTab)}
              className={`px-4 py-2 rounded-lg text-[12.5px] font-bold tracking-wide transition-all shrink-0 ${
                active
                  ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30"
                  : "bg-[#111827] border border-[#1e293b] text-slate-400 hover:text-white hover:bg-[#162033]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          EMI CALCULATOR (Screenshot 31 full replica)
         ========================================================================= */}
      {activeTab === "emi" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls (7 Cols) */}
            <div className="lg:col-span-7 rounded-2xl bg-[#111827] border border-[#1e293b] p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#182235]">
                <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                  <Calculator size={18} className="text-cyan-400" />
                  Loan Parameters
                </h3>
                <span className="text-[11px] font-medium text-slate-400">Reducing balance method</span>
              </div>

              {/* Slider 1: Loan Amount */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-slate-300">Loan Amount</label>
                  <div className="flex items-center gap-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-1">
                    <span className="text-[12px] text-slate-400">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value) || 0)}
                      className="w-32 bg-transparent text-right font-bold text-white text-[14px] focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="50000000"
                  step="50000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-[#1e293b] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>₹1 Lakh</span>
                  <span className="text-cyan-400 font-semibold">{fmtInr(amount)}</span>
                  <span>₹5 Crore</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-slate-300">Interest Rate (% p.a.)</label>
                  <div className="flex items-center gap-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-1">
                    <input
                      type="number"
                      step="0.05"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value) || 0)}
                      className="w-20 bg-transparent text-right font-bold text-white text-[14px] focus:outline-none"
                    />
                    <span className="text-[12px] text-slate-400">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="0.05"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-[#1e293b] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>1%</span>
                  <span className="text-indigo-400 font-semibold">{rate}% per annum</span>
                  <span>24%</span>
                </div>
              </div>

              {/* Slider 3: Loan Tenure */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-slate-300">Loan Tenure</label>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-[#0c1220] p-0.5 rounded-lg border border-[#1e293b]">
                      <button
                        onClick={() => setTenureType("years")}
                        className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-all ${
                          tenureType === "years" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Yr
                      </button>
                      <button
                        onClick={() => setTenureType("months")}
                        className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-all ${
                          tenureType === "months" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Mo
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-1">
                      <input
                        type="number"
                        value={tenureYears}
                        onChange={(e) => setTenureYears(Number(e.target.value) || 0)}
                        className="w-16 bg-transparent text-right font-bold text-white text-[14px] focus:outline-none"
                      />
                      <span className="text-[12px] text-slate-400">{tenureType === "years" ? "Yrs" : "Mos"}</span>
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max={tenureType === "years" ? 30 : 360}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-[#1e293b] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>1 {tenureType === "years" ? "Year" : "Mo"}</span>
                  <span className="text-cyan-400 font-semibold">
                    {tenureYears} {tenureType === "years" ? "Years" : "Months"} ({tenureMonths} Months)
                  </span>
                  <span>{tenureType === "years" ? "30 Years" : "360 Mos"}</span>
                </div>
              </div>
            </div>

            {/* Right Summary & SVG Donut Breakdown (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-[#111827] border border-[#1e293b] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-white pb-3 border-b border-[#182235] flex items-center justify-between">
                  <span>Repayment Breakdown</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    LIVE CALC
                  </span>
                </h3>

                {/* Monthly EMI Large Badge */}
                <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/30 text-center">
                  <div className="text-[11.5px] uppercase font-bold text-blue-300 tracking-wider">Monthly Loan EMI</div>
                  <div className="text-[32px] font-black text-white mt-1 num tracking-tight">
                    ₹{emiCalc.emi.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Payable every month for {tenureMonths} installments</div>
                </div>

                {/* Donut Chart Visual */}
                <div className="my-6 flex items-center justify-center gap-6">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {/* Background Circle */}
                      <path
                        className="text-[#1e293b]"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Principal Stroke (Cyan) */}
                      <path
                        className="text-cyan-400"
                        strokeDasharray={`${principalPct}, 100`}
                        strokeWidth="4.2"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Interest Stroke (Amber) */}
                      <path
                        className="text-amber-400"
                        strokeDasharray={`${interestPct}, 100`}
                        strokeDashoffset={`-${principalPct}`}
                        strokeWidth="4.2"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Ratio</span>
                      <span className="text-[14px] font-black text-white">{principalPct}% : {interestPct}%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                      <div>
                        <div className="text-[11px] text-slate-400">Principal Amount</div>
                        <div className="text-[13px] font-bold text-white num">{fmtInr(amount)} ({principalPct}%)</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                      <div>
                        <div className="text-[11px] text-slate-400">Total Interest</div>
                        <div className="text-[13px] font-bold text-amber-400 num">{fmtInr(emiCalc.totalInterest)} ({interestPct}%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Payment Footer */}
              <div className="p-4 rounded-xl bg-[#0c1220] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Total Amount Payable</div>
                  <div className="text-[10px] text-slate-500">(Principal + Interest)</div>
                </div>
                <div className="text-[18px] font-black text-white num">
                  ₹{emiCalc.totalPayment.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          {/* Yearly Amortization Stacked Bar Chart & Schedule */}
          <div className="rounded-2xl bg-[#111827] border border-[#1e293b] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235] flex-wrap gap-2">
              <div>
                <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                  <TrendingUp size={17} className="text-emerald-400" />
                  Yearly Amortization Schedule & Principal Payoff
                </h3>
                <p className="text-[11.5px] text-slate-400">Track how your interest reduces and principal payoff accelerates year-by-year</p>
              </div>

              <div className="flex items-center gap-3 text-[11.5px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-cyan-500" />
                  <span className="text-slate-300">Principal Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-slate-300">Interest Paid</span>
                </div>
              </div>
            </div>

            {/* Stacked Bars Visual */}
            <div className="p-4 rounded-xl bg-[#0c1220] border border-[#182235] overflow-x-auto">
              <div className="flex items-end gap-2 min-w-[700px] h-36 pt-4 pb-1">
                {amortizationSchedule.slice(0, 20).map((row) => {
                  const maxYearPayment = Math.max(...amortizationSchedule.map((r) => r.emiPaid));
                  const pHeight = (row.principalPaid / maxYearPayment) * 100;
                  const iHeight = (row.interestPaid / maxYearPayment) * 100;
                  return (
                    <div key={row.year} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-[#1e293b] border border-slate-700 p-2 rounded text-[10px] text-white z-20 pointer-events-none whitespace-nowrap shadow-xl">
                        <div>Year {row.year}</div>
                        <div className="text-cyan-400">Principal: ₹{row.principalPaid.toLocaleString("en-IN")}</div>
                        <div className="text-amber-400">Interest: ₹{row.interestPaid.toLocaleString("en-IN")}</div>
                        <div className="text-slate-400">Closing: ₹{row.closing.toLocaleString("en-IN")}</div>
                      </div>

                      {/* Stacked Bar */}
                      <div className="w-full flex flex-col justify-end h-28 bg-[#111827] rounded overflow-hidden">
                        <div style={{ height: `${iHeight}%` }} className="w-full bg-amber-500/80 group-hover:bg-amber-400 transition-colors" />
                        <div style={{ height: `${pHeight}%` }} className="w-full bg-cyan-500/80 group-hover:bg-cyan-400 transition-colors" />
                      </div>
                      <span className="text-[9.5px] font-bold text-slate-500">Y{row.year}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Schedule Table */}
            <div className="overflow-x-auto max-h-72 scrollbar-thin">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 bg-[#0c1220] border-b border-[#182235] sticky top-0">
                    <th className="px-4 py-2.5 font-semibold">Year</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Opening Balance</th>
                    <th className="px-4 py-2.5 font-semibold text-right">EMI x 12</th>
                    <th className="px-4 py-2.5 font-semibold text-right text-cyan-400">Principal Paid</th>
                    <th className="px-4 py-2.5 font-semibold text-right text-amber-400">Interest Paid</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235]">
                  {amortizationSchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-[#152033] transition-colors">
                      <td className="px-4 py-2 font-bold text-white">Year {row.year}</td>
                      <td className="px-4 py-2 text-right text-slate-300 num">₹{row.opening.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2 text-right text-slate-300 num">₹{row.emiPaid.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2 text-right font-semibold text-cyan-400 num">₹{row.principalPaid.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2 text-right font-semibold text-amber-400 num">₹{row.interestPaid.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2 text-right font-bold text-white num">₹{row.closing.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ELIGIBILITY CALCULATOR
         ========================================================================= */}
      {activeTab === "eligibility" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl bg-[#111827] border border-[#1e293b] p-6 shadow-xl space-y-5">
            <h3 className="text-[15px] font-bold text-white pb-3 border-b border-[#182235]">
              Borrower Financial Profile
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[12.5px] font-semibold text-slate-300 block mb-1">Monthly In-Hand Net Income (₹)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value) || 0)}
                  className="w-full bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-bold text-[14px] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[12.5px] font-semibold text-slate-300 block mb-1">Existing Monthly Loan EMIs / Obligations (₹)</label>
                <input
                  type="number"
                  value={obligations}
                  onChange={(e) => setObligations(Number(e.target.value) || 0)}
                  className="w-full bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-bold text-[14px] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12.5px] font-semibold text-slate-300 block mb-1">Expected ROI (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={eligRate}
                    onChange={(e) => setEligRate(Number(e.target.value) || 0)}
                    className="w-full bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-bold text-[14px] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[12.5px] font-semibold text-slate-300 block mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    value={eligTenure}
                    onChange={(e) => setEligTenure(Number(e.target.value) || 0)}
                    className="w-full bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-bold text-[14px] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12.5px] font-semibold text-slate-300 mb-1">
                  <span>FOIR (Fixed Obligation to Income Ratio) Cap</span>
                  <span className="text-cyan-400">{foirCap}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={foirCap}
                  onChange={(e) => setFoirCap(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-[#1e293b] rounded-lg"
                />
                <div className="flex justify-between text-[10.5px] text-slate-500">
                  <span>30% (Conservative)</span>
                  <span>50% (Standard)</span>
                  <span>70% (Aggressive / HNI)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#111827] border border-[#1e293b] p-6 shadow-xl space-y-5">
            <h3 className="text-[15px] font-bold text-white pb-3 border-b border-[#182235]">
              Maximum Eligible Sanction
            </h3>

            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-teal-900/40 border border-emerald-500/40 text-center">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Eligible Loan Amount</div>
              <div className="text-[34px] font-black text-white mt-1 num tracking-tight">
                ₹{eligCalc.maxLoan.toLocaleString("en-IN")}
              </div>
              <div className="text-[12px] text-emerald-300/80 mt-1">
                At ₹{eligCalc.maxEmiAllowed.toLocaleString("en-IN")}/mo max disposable EMI
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1220] border border-[#182235] space-y-3">
              <div className="text-[12.5px] font-bold text-white flex items-center gap-1.5">
                <Building2 size={15} className="text-blue-400" />
                Recommended Banking Schemes
              </div>
              <div className="space-y-2 text-[12px]">
                <div className="p-2.5 rounded-lg bg-[#111827] border border-[#1e293b] flex items-center justify-between">
                  <span className="font-semibold text-slate-200">HDFC Bank Personal Loan</span>
                  <span className="text-emerald-400 font-bold">10.50% · Up to ₹15L</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#111827] border border-[#1e293b] flex items-center justify-between">
                  <span className="font-semibold text-slate-200">ICICI Bank Insta PL</span>
                  <span className="text-emerald-400 font-bold">10.75% · Up to ₹12.5L</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#111827] border border-[#1e293b] flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Bajaj Finance Flexi Loan</span>
                  <span className="text-amber-400 font-bold">12.00% · Instant Disbursal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SIP CALCULATOR
         ========================================================================= */}
      {activeTab === "sip" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl bg-[#111827] border border-[#1e293b] p-6 shadow-xl space-y-5">
            <h3 className="text-[15px] font-bold text-white pb-3 border-b border-[#182235]">
              SIP Investment Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[12.5px] font-semibold text-slate-300 block mb-1">Monthly Investment (₹)</label>
                <input
                  type="number"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Number(e.target.value) || 0)}
                  className="w-full bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-bold text-[14px] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[12.5px] font-semibold text-slate-300 block mb-1">Expected Annual Return (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value) || 0)}
                  className="w-full bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-bold text-[14px] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[12.5px] font-semibold text-slate-300 block mb-1">Investment Period (Years)</label>
                <input
                  type="number"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value) || 0)}
                  className="w-full bg-[#0c1220] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-bold text-[14px] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#111827] border border-[#1e293b] p-6 shadow-xl space-y-5">
            <h3 className="text-[15px] font-bold text-white pb-3 border-b border-[#182235]">
              Projected Wealth at Maturity
            </h3>
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-950/40 to-indigo-900/40 border border-purple-500/40 text-center">
              <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">Total Value</div>
              <div className="text-[34px] font-black text-white mt-1 num tracking-tight">
                ₹{sipCalc.totalWealth.toLocaleString("en-IN")}
              </div>
              <div className="text-[12px] text-purple-200 mt-1">
                Gains: +₹{sipCalc.returns.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c1220] border border-[#1e293b] space-y-2 text-[12.5px]">
              <div className="flex justify-between text-slate-400">
                <span>Invested Capital:</span>
                <span className="font-bold text-white num">₹{sipCalc.invested.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Wealth Gain:</span>
                <span className="font-bold text-emerald-400 num">₹{sipCalc.returns.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for other tabs */}
      {!["emi", "eligibility", "sip"].includes(activeTab) && (
        <div className="rounded-2xl bg-[#111827] border border-[#1e293b] p-8 text-center shadow-xl space-y-3">
          <Sparkles className="mx-auto text-indigo-400" size={32} />
          <h3 className="text-[16px] font-bold text-white capitalize">{activeTab} Calculator Active</h3>
          <p className="text-[13px] text-slate-400 max-w-md mx-auto">
            Configured with statutory Government of India rules and RBI compounding guidelines.
          </p>
          <button onClick={() => setActiveTab("emi")} className="px-4 py-2 bg-blue-600 rounded-lg text-white text-[12px] font-semibold">
            Back to EMI Calculator
          </button>
        </div>
      )}
    </div>
  );
}
