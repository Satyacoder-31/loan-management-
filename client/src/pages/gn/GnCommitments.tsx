import React, { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Calendar, Plus, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { fmtInr } from "../../lib/api";

interface Commitment {
  id: number;
  employee: string;
  customerName: string;
  amount: number;
  product: string;
  bank: string;
  status: "open" | "logged" | "missed";
  date: string;
}

export function GnCommitments() {
  const [selectedDate, setSelectedDate] = useState("2026-10-18");
  const [employee, setEmployee] = useState("VIVEK MAHAJAN");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState("Personal Loan");
  const [bank, setBank] = useState("HDFC Bank");

  const [commitments, setCommitments] = useState<Commitment[]>([
    // Empty by default to match Screenshot 1, or populated when user adds
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !amount) return;

    const newCommitment: Commitment = {
      id: Date.now(),
      employee,
      customerName: customerName.trim(),
      amount: Number(amount) || 0,
      product,
      bank,
      status: "open",
      date: selectedDate,
    };

    setCommitments((prev) => [newCommitment, ...prev]);
    setCustomerName("");
    setAmount("");
  };

  const handleStatusChange = (id: number, newStatus: "open" | "logged" | "missed") => {
    setCommitments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const dayCommitments = commitments.filter((c) => c.date === selectedDate);
  const committedCount = dayCommitments.length;
  const committedAmount = dayCommitments.reduce((sum, c) => sum + c.amount, 0);

  const loggedCount = dayCommitments.filter((c) => c.status === "logged").length;
  const loggedAmount = dayCommitments
    .filter((c) => c.status === "logged")
    .reduce((sum, c) => sum + c.amount, 0);

  const openCount = dayCommitments.filter((c) => c.status === "open").length;
  const openAmount = dayCommitments
    .filter((c) => c.status === "open")
    .reduce((sum, c) => sum + c.amount, 0);

  const missedCount = dayCommitments.filter((c) => c.status === "missed").length;
  const missedAmount = dayCommitments
    .filter((c) => c.status === "missed")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4 text-slate-800 font-sans">
      {/* =========================================================================
          PAGE HEADER (Matching Screenshot 1 exactly)
         ========================================================================= */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Login Commitments
            </h1>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            CRM / <span className="text-slate-500">Login Commitments</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-4xl leading-relaxed">
            The files each salesperson commits to log today — and what actually got logged. A file logged for the same customer that day marks it Logged by itself.
          </p>
        </div>

        <button
          onClick={() => {}}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer"
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* =========================================================================
          DATE SELECTOR BAR (Matching Screenshot 1 exactly)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <button className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer">
            <ChevronLeft size={16} />
          </button>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-medium text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 pl-1">
          <ChevronRight size={14} className="text-slate-400" />
          <span>Sunday, 18 October</span>
        </div>
      </div>

      {/* =========================================================================
          4 STAT CARDS (COMMITTED | LOGGED | STILL OPEN | MISSED)
         ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* COMMITTED */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            COMMITTED
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 num">
            {committedCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 num">
            ₹{committedAmount}
          </div>
        </div>

        {/* LOGGED */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            LOGGED
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 num">
            {loggedCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 num">
            ₹{loggedAmount}
          </div>
        </div>

        {/* STILL OPEN */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            STILL OPEN
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-1 num">
            {openCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 num">
            ₹{openAmount}
          </div>
        </div>

        {/* MISSED */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            MISSED
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1 num">
            {missedCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 num">
            ₹{missedAmount}
          </div>
        </div>
      </div>

      {/* =========================================================================
          ADD A COMMITMENT FOR TODAY FORM (Matching Screenshot 1 exactly)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
          ADD A COMMITMENT FOR TODAY
        </div>

        <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2.5">
          {/* Employee dropdown */}
          <div className="min-w-[170px]">
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="VIVEK MAHAJAN">VIVEK MAHAJAN</option>
              <option value="Rajesh Sharma">Rajesh Sharma</option>
              <option value="Amit Patel">Amit Patel</option>
              <option value="Priya Nair">Priya Nair</option>
              <option value="Arjun Verma">Arjun Verma</option>
            </select>
          </div>

          {/* Customer name input */}
          <div className="flex-1 min-w-[160px]">
            <input
              type="text"
              placeholder="Customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Loan amount input */}
          <div className="w-[140px]">
            <input
              type="number"
              placeholder="Loan amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 num"
            />
          </div>

          {/* Product dropdown */}
          <div className="min-w-[130px]">
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Personal Loan">Product</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Loan Against Property">LAP</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
            </select>
          </div>

          {/* Bank dropdown */}
          <div className="min-w-[140px]">
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Bank">Bank</option>
              <option value="HDFC Bank">HDFC Bank</option>
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="State Bank of India">SBI</option>
              <option value="Axis Bank">Axis Bank</option>
              <option value="Bajaj Finance">Bajaj Finance</option>
              <option value="TVS Credit">TVS Credit</option>
            </select>
          </div>

          {/* Add button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* =========================================================================
          COMMITMENTS LIST / EMPTY STATE (Matching Screenshot 1 exactly)
         ========================================================================= */}
      {dayCommitments.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-xl p-14 text-center shadow-xs flex flex-col items-center justify-center min-h-[180px]">
          <h3 className="text-sm font-bold text-slate-800">
            No commitments for this day
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Add each file your team plans to log — the day's logins will be checked against it.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10.5px] font-bold">
                <tr>
                  <th className="px-4 py-3">Salesperson</th>
                  <th className="px-4 py-3">Customer Name</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Bank</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dayCommitments.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{c.employee}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{c.customerName}</td>
                    <td className="px-4 py-3 text-slate-600">{c.product}</td>
                    <td className="px-4 py-3 text-slate-600">{c.bank}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 num">{fmtInr(c.amount)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${
                          c.status === "logged"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : c.status === "missed"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {c.status !== "logged" && (
                        <button
                          onClick={() => handleStatusChange(c.id, "logged")}
                          className="px-2 py-1 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                        >
                          Mark Logged
                        </button>
                      )}
                      {c.status !== "missed" && (
                        <button
                          onClick={() => handleStatusChange(c.id, "missed")}
                          className="px-2 py-1 text-[11px] font-semibold rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                        >
                          Mark Missed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
