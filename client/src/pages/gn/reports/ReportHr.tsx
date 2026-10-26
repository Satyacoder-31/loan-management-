import React, { useState } from "react";
import { ReportHeader, ExportButton, MetricTile } from "./ReportCommon";
import { Clock, FileText, Calendar, IndianRupee, MapPin, Search, Download } from "lucide-react";

interface ReportHrProps {
  subTab: string;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function ReportHr({ subTab, onBack, onNotify }: ReportHrProps) {
  const normTab = subTab.toLowerCase().replace(/_/g, "-");

  if (normTab === "attendance" || normTab === "hr-attendance" || normTab === "hr_attendance") {
    return <AttendanceReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "attendance-ledger" || normTab === "attendance_ledger" || normTab === "hr-attendance-ledger" || normTab === "hr_attendance_ledger") {
    return <AttendanceLedgerReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "leaves" || normTab === "hr-leaves" || normTab === "hr_leaves") {
    return <LeavesReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "salary" || normTab === "hr-salary" || normTab === "hr_salary") {
    return <SalaryReport onBack={onBack} onNotify={onNotify} />;
  }
  if (normTab === "conveyance" || normTab === "hr-conveyance" || normTab === "hr_conveyance") {
    return <ConveyanceReport onBack={onBack} onNotify={onNotify} />;
  }

  return <AttendanceReport onBack={onBack} onNotify={onNotify} />;
}

// ----------------------------------------------------------------------------
// 1. ATTENDANCE REPORT
// ----------------------------------------------------------------------------
function AttendanceReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="HR"
        title="Attendance"
        description="Daily check-ins, punch timings, late marks and hours logged. Ensure punctuality and shift adherence."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Attendance CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-white tracking-tight">Attendance - Last 30 days</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <MetricTile label="DAYS PRESENT" value="0" />
          <MetricTile label="DAYS ABSENT" value="0" />
          <MetricTile label="AVG HOURS/DAY" value="0.00h" />
          <MetricTile label="TOTAL HOURS" value="0.00h" />
          <MetricTile label="LAST CHECK-IN" value="—" />
        </div>

        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">EMPLOYEE</th>
                <th className="px-4 py-3 text-center">DAYS PRESENT</th>
                <th className="px-4 py-3 text-center">DAYS ABSENT</th>
                <th className="px-4 py-3 text-right">AVG HOURS/DAY</th>
                <th className="px-4 py-3 text-right">TOTAL HOURS</th>
                <th className="px-4 py-3 text-right">LAST CHECK-IN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              <tr className="hover:bg-[#090e1a] transition-colors">
                <td className="px-4 py-3 font-bold text-white">VIVEK MAHAJAN</td>
                <td className="px-4 py-3 text-center font-mono text-slate-400">0</td>
                <td className="px-4 py-3 text-center font-mono text-slate-400">0</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">0.00h</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">0.00h</td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 2. ATTENDANCE LEDGER REPORT
// ----------------------------------------------------------------------------
function AttendanceLedgerReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  const [empSearch, setEmpSearch] = useState("");

  // October 2026 calendar days: 1 to 31
  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    // October 1, 2026 is a Thursday (4)
    const dayOfWeekIndex = (dayNum + 3) % 7; // 0=Sun, 1=Mon, ..., 6=Sat
    const dayChars = ["S", "M", "T", "W", "T", "F", "S"];
    const isWeekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6;
    return { day: dayNum, char: dayChars[dayOfWeekIndex], isWeekend };
  });

  return (
    <div className="space-y-6">
      <ReportHeader
        category="HR"
        title="Attendance Ledger"
        description="Monthly employee muster roll, present days and deductions. Streamline monthly payroll processing."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Attendance Ledger Excel")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-bold text-white tracking-tight">Attendance Ledger</h2>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">October, 2026</span>
            <select className="px-2.5 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm focus:ring-1 focus:ring-blue-500">
              <option>All employees (1)</option>
              <option>Vivek Mahajan</option>
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or email"
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                className="pl-3 pr-2 py-1 bg-[#090e1a] border border-[#1e293b] rounded-md text-slate-300 placeholder-slate-400 text-xs shadow-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Legend matching Screenshot */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Checked in</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span>Weekend</span>
          </div>
        </div>

        {/* Calendar Matrix */}
        <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[1100px]">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-3 py-3 w-48">EMPLOYEE</th>
                {daysInMonth.map((d) => (
                  <th key={d.day} className={`px-1 py-1.5 text-center font-mono ${d.isWeekend ? "text-slate-500 bg-[#070b13]" : "text-slate-300"}`}>
                    <div className="text-[10px] text-slate-500">{d.char}</div>
                    <div className="text-[11px] font-semibold">{d.day}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              <tr className="hover:bg-[#111a2d]/70 transition-colors">
                <td className="px-3 py-3">
                  <div className="font-bold text-white">VIVEK MAHAJAN</div>
                  <div className="text-[10px] text-slate-400 font-mono">vivek@teleport.in</div>
                </td>
                {daysInMonth.map((d) => (
                  <td key={d.day} className={`px-1 py-2 text-center font-mono text-[11px] ${d.isWeekend ? "bg-[#070b13]" : ""}`}>
                    {d.isWeekend ? (
                      <span className="text-slate-600 font-bold">·</span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[10px]">
                        A
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 3. LEAVES REPORT
// ----------------------------------------------------------------------------
function LeavesReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="HR"
        title="Leaves"
        description="Casual, sick, earned leave balances and leaves consumed. Maintain statutory leave compliance."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Leaves CSV")} />}
      />

      <div className="space-y-6">
        {/* Section 1: Leave Balance — by category & employee */}
        <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-white tracking-tight">Leave Balance — by category &amp; employee</h2>

          <div className="rounded-xl border border-[#182235] overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left min-w-[650px]">
              <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
                <tr>
                  <th className="px-4 py-3">EMPLOYEE</th>
                  <th className="px-4 py-3 text-center">CL</th>
                  <th className="px-4 py-3 text-center">CO</th>
                  <th className="px-4 py-3 text-center">PL</th>
                  <th className="px-4 py-3 text-center">SL</th>
                  <th className="px-4 py-3 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182235]">
                <tr className="hover:bg-[#090e1a] transition-colors">
                  <td className="px-4 py-3 font-bold text-white">VIVEK MAHAJAN</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-400">0.0/0</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-400">0.0/0</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-400">0.0/0</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-400">0.0/0</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-blue-600">0.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-500 pt-1">
            Shows remaining / total (allocated + carry-forward) per category. Hover a cell for used days.
          </p>
        </div>

        {/* Section 2: Leave Summary - Last 30 days */}
        <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-white tracking-tight">Leave Summary - Last 30 days</h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <MetricTile label="TOTAL APPS" value="0" />
            <MetricTile label="APPROVED" value="0" />
            <MetricTile label="PENDING" value="0" />
            <MetricTile label="REJECTED" value="0" />
            <MetricTile label="DAYS APPROVED" value="0" />
            <MetricTile label="DAYS PENDING" value="0" />
          </div>

          <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-[#182235] rounded-xl bg-[#090e1a]/50">
            No leave applications in this period.
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 4. SALARY REPORT
// ----------------------------------------------------------------------------
function SalaryReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="HR"
        title="Salary"
        description="CTC breakups, gross salaries, PF/PT deductions and net pay. Accurate monthly staff remuneration."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Salary Register CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-bold text-white tracking-tight">Salary Disbursed by Month</h2>
          <div className="text-xs text-slate-500">
            <span className="font-semibold">Filter: </span>
            <select className="px-2.5 py-1 rounded-md bg-[#090e1a] border border-[#1e293b] text-slate-300 text-xs shadow-sm focus:ring-1 focus:ring-blue-500">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <MetricTile label="TOTAL GROSS" value="₹0" />
          <MetricTile label="EMPLOYEES" value="0" />
          <MetricTile label="TOTAL NET PAID" value="₹0" />
          <MetricTile label="NET MONTHS" value="0" />
          <MetricTile label="AVG/PERSON" value="₹0" />
        </div>

        <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">MONTH</th>
                <th className="px-4 py-3 text-center">EMPLOYEES</th>
                <th className="px-4 py-3 text-right">GROSS</th>
                <th className="px-4 py-3 text-right">DEDUCTIONS</th>
                <th className="px-4 py-3 text-right">NET PAY</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                  No salary slips generated yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 5. CONVEYANCE REPORT
// ----------------------------------------------------------------------------
function ConveyanceReport({ onBack, onNotify }: { onBack: () => void; onNotify: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <ReportHeader
        category="HR"
        title="Conveyance"
        description="Field kilometer logs, fuel claims and travel reimbursements. Validate field visit claims against GPS."
        onBack={onBack}
        actions={<ExportButton label="Export" onExport={() => onNotify("Exported Conveyance CSV")} />}
      />

      <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-white tracking-tight">Conveyance - Last 30 days</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <MetricTile label="TRIPS" value="0" />
          <MetricTile label="TOTAL KM" value="0" />
          <MetricTile label="TOTAL AMOUNT" value="₹0" />
          <MetricTile label="APPROVED" value="0" />
          <MetricTile label="PENDING" value="0" />
        </div>

        <div className="rounded-xl border border-[#182235] overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#182235]">
              <tr>
                <th className="px-4 py-3">EMPLOYEE</th>
                <th className="px-4 py-3 text-center">TRIPS</th>
                <th className="px-4 py-3 text-right">TOTAL KM</th>
                <th className="px-4 py-3 text-right">TOTAL AMOUNT</th>
                <th className="px-4 py-3 text-center">APPROVED</th>
                <th className="px-4 py-3 text-center">PENDING</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  No conveyance trips in this period.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
