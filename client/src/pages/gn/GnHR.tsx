import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft, RefreshCw, Check, Clock, Calendar, AlertCircle, Plane,
  Users, DollarSign, Briefcase, FileText, Settings, Sparkles, Plus,
  Camera, MapPin, CheckCircle2, ShieldCheck, Hourglass, PartyPopper
} from "lucide-react";
import { api, fmtInr } from "../../lib/api";

export function GnHR() {
  const loc = useLocation();
  const nav = useNavigate();

  // Determine current active subview
  const currentSub = useMemo(() => {
    const p = loc.pathname.replace(/^\/hr\/?/, "").split("/")[0];
    if (p === "recruitment") return "recruitment";
    if (p === "all-attendance" || p === "staff-attendance") return "all-attendance";
    if (p === "leave") return "leave";
    if (p === "slips" || p === "salary-slips") return "slips";
    if (p === "payroll") return "payroll";
    if (p === "conveyance") return "conveyance";
    if (p === "settings") return "settings";
    return "attendance"; // Default to My Attendance matching Screenshot 2
  }, [loc.pathname]);

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false);

  const handleCheckInConfirm = () => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCheckedIn(true);
    setCheckInTime(now);
    setCheckInModalOpen(false);
    alert(`Clocked in at ${now} with verified GPS location & selfie.`);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4 text-slate-800 font-sans">
      {/* =========================================================================
          VIEW 1: MY ATTENDANCE (Matching Screenshot 2 exactly)
         ========================================================================= */}
      {currentSub === "attendance" && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => nav("/dashboard")}
                  className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Attendance
                </h1>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Home / <span className="text-slate-500">Attendance</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-4xl leading-relaxed">
                Mark your daily attendance with selfie and location.
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

          {/* Row 1: 2 Large Cards (Matching Screenshot 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PRESENT THIS MONTH */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs relative overflow-hidden flex items-start justify-between min-h-[140px]">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  PRESENT THIS MONTH
                </div>
                <div className="text-4xl font-black text-emerald-600 mt-2 num">
                  {checkedIn ? 1 : 0}
                </div>
                <div className="text-xs text-slate-400 mt-3 font-medium">
                  — total · avg —/day
                </div>
              </div>

              {/* Watermark Green Calendar Outline */}
              <div className="absolute right-4 bottom-2 text-emerald-100 pointer-events-none">
                <Calendar size={96} className="stroke-[1.2]" />
              </div>
            </div>

            {/* OPEN (CHECKED IN) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs relative overflow-hidden flex items-start justify-between min-h-[140px]">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  OPEN (CHECKED IN)
                </div>
                <div className="text-4xl font-black text-amber-500 mt-2 num">
                  {checkedIn ? 1 : 0}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">
                  {checkedIn ? `Session active since ${checkInTime}` : "No open sessions"}
                </div>
                <button
                  onClick={() => nav("/hr/all-attendance")}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View</span>
                  <span>→</span>
                </button>
              </div>

              {/* Watermark Orange Clock Outline */}
              <div className="absolute right-4 bottom-2 text-amber-100 pointer-events-none">
                <Clock size={96} className="stroke-[1.2]" />
              </div>
            </div>
          </div>

          {/* Row 2: 6 Medium Cards (Matching Screenshot 2) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {/* LOSS OF PAY */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">LOSS OF PAY</span>
                  <Calendar size={14} className="text-slate-400" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 num">0</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Nothing deducted this month</div>
              </div>
              <button onClick={() => {}} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 text-left">
                View →
              </button>
            </div>

            {/* ABSENT */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">ABSENT</span>
                  <Calendar size={14} className="text-slate-400" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 num">6</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Unauthorised misses</div>
              </div>
              <button onClick={() => {}} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 text-left">
                View →
              </button>
            </div>

            {/* ON LEAVE */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">ON LEAVE</span>
                  <Plane size={14} className="text-amber-500" />
                </div>
                <div className="text-2xl font-black text-amber-500 mt-1 num">0</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Approved leave days</div>
              </div>
              <button onClick={() => nav("/hr/leave")} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 text-left">
                View →
              </button>
            </div>

            {/* HOLIDAYS */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">HOLIDAYS</span>
                  <Sparkles size={14} className="text-blue-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 num">0</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Public holidays</div>
              </div>
              <button onClick={() => {}} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 text-left">
                View →
              </button>
            </div>

            {/* WEEKENDS */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">WEEKENDS</span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 num">12</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Off days</div>
              </div>
              <button onClick={() => {}} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 text-left">
                View →
              </button>
            </div>

            {/* AVG HOURS */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">AVG HOURS</span>
                  <Hourglass size={14} className="text-blue-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 num">—</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Per present day</div>
              </div>
              <button onClick={() => {}} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 text-left">
                View →
              </button>
            </div>
          </div>

          {/* Row 3: 1 Card (TOTAL HOURS) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL HOURS</span>
                  <Clock size={15} className="text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 num">—</div>
                <div className="text-[11px] text-slate-400 mt-0.5">This month</div>
              </div>
              <button onClick={() => {}} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 text-left">
                View →
              </button>
            </div>
          </div>

          {/* Row 4: Bottom Check-In Bar (Matching Screenshot 2) */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs font-semibold text-slate-700">
              Today — Sunday, 18 Oct 2026
            </div>

            <button
              onClick={() => {
                if (checkedIn) {
                  alert("Already checked in for today!");
                } else {
                  setCheckInModalOpen(true);
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                checkedIn
                  ? "bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <Check size={14} className="stroke-[3]" />
              <span>{checkedIn ? "Checked In" : "Check In"}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: RECRUITMENT
         ========================================================================= */}
      {currentSub === "recruitment" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recruitment & Hiring Pipeline</h2>
              <p className="text-xs text-slate-500">Track candidates across sourcing, screening, interview, and offer stages.</p>
            </div>
            <button className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs">
              + Post New Vacancy
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {["Applied (3)", "Screening (2)", "Interview (4)", "Offered (1)"].map((stage, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-800">{stage}</div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-xs text-slate-900">Credit Analyst Candidate</div>
                  <div className="text-[11px] text-slate-500">Exp: 3 yrs · Expected: ₹45k/mo</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: LEAVE REQUESTS
         ========================================================================= */}
      {currentSub === "leave" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Leave Applications & Approval Queue</h2>
              <p className="text-xs text-slate-500">Review staff leave requests, sick leave doctor slips, and privilege balance.</p>
            </div>
            <button className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs">
              + Apply for Leave
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10.5px] font-bold">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-bold text-slate-900">Suresh Rao</td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">Casual Leave</td>
                  <td className="px-4 py-3.5 text-slate-600">20 Oct – 21 Oct (2 Days)</td>
                  <td className="px-4 py-3.5 text-slate-500">Family event in native town</td>
                  <td className="px-4 py-3.5"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending</span></td>
                  <td className="px-4 py-3.5 text-right space-x-1.5">
                    <button className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded">Approve</button>
                    <button className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: SALARY SLIPS & PAYROLL
         ========================================================================= */}
      {(currentSub === "slips" || currentSub === "payroll") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Payroll Processing & Salary Slips</h2>
              <p className="text-xs text-slate-500">Monthly salary calculation, TDS 192 deductions, and automated pay slip generation.</p>
            </div>
            <button className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs">
              Disburse Payroll
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10.5px] font-bold">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Basic</th>
                  <th className="px-4 py-3">HRA</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">TDS</th>
                  <th className="px-4 py-3">Net Pay</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-bold text-slate-900">VIVEK MAHAJAN</td>
                  <td className="px-4 py-3.5 text-slate-600">Managing Director</td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">₹75,000</td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">₹45,000</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">₹1,50,000</td>
                  <td className="px-4 py-3.5 text-slate-500">₹3,000</td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600">₹1,47,000</td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
                      Download PDF
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Check-In with Selfie / GPS */}
      {checkInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setCheckInModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Camera size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Daily Selfie & Location Check-In</h3>
            <p className="text-xs text-slate-500 mt-1">Please confirm your current work location:</p>

            <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <MapPin size={14} className="text-blue-600" />
                <span>Sniper Electric Corporate Office</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Lat: 19.0760° N, Lon: 72.8777° E · Accuracy: 4 meters
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setCheckInModalOpen(false)}
                className="w-1/2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCheckInConfirm}
                className="w-1/2 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                Confirm Check In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
