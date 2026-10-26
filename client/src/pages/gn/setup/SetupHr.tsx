import React, { useState } from "react";
import {
  Calendar, CalendarDays, GitMerge, Clock, Layers, FileText,
  Gift, Navigation, Plus, Trash2, Edit2, Check, X, Calculator
} from "lucide-react";

// ============================================================================
// 1. LEAVE TYPES MODULE
// ============================================================================
export function LeaveTypesModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [types, setTypes] = useState([
    { id: 1, name: "Casual Leave (CL)", quota: "12 days/yr", carry: "No", status: "Active" },
    { id: 2, name: "Sick Leave (SL)", quota: "10 days/yr", carry: "Yes (Max 5)", status: "Active" },
    { id: 3, name: "Earned Leave (EL)", quota: "15 days/yr", carry: "Yes (Max 30)", status: "Active" },
    { id: 4, name: "Maternity Leave", quota: "180 days", carry: "No", status: "Active" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newT, setNewT] = useState({ name: "", quota: "12 days/yr", carry: "No", status: "Active" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newT.name) return;
    setTypes([...types, { ...newT, id: Date.now() }]);
    setModalOpen(false);
    setNewT({ name: "", quota: "12 days/yr", carry: "No", status: "Active" });
    onNotify(`Leave type "${newT.name}" added.`);
  };

  return (
    <div className="space-y-4 max-w-2xl text-xs">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">Leave policies, annual allowances and carry-forward rules</span>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
          + Add Leave Type
        </button>
      </div>
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Leave Type</th>
              <th className="px-4 py-3">Quota</th>
              <th className="px-4 py-3">Carry Forward</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {types.map(t => (
              <tr key={t.id} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{t.name}</td>
                <td className="px-4 py-3 text-cyan-400 font-mono">{t.quota}</td>
                <td className="px-4 py-3 text-slate-300">{t.carry}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">{t.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setTypes(types.filter(x => x.id !== t.id)); onNotify("Leave type removed."); }} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Add Leave Policy</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Leave Name</label>
                <input required placeholder="e.g. Paternity Leave" value={newT.name} onChange={e => setNewT({ ...newT, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Annual Quota Days</label>
                <input placeholder="e.g. 7 days/yr" value={newT.quota} onChange={e => setNewT({ ...newT, quota: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Carry Forward Policy</label>
                <select value={newT.carry} onChange={e => setNewT({ ...newT, carry: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                  <option value="No">No (Lapses annually)</option>
                  <option value="Yes (Max 5)">Yes (Max 5 days)</option>
                  <option value="Yes (Max 15)">Yes (Max 15 days)</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. ASSIGN LEAVE BALANCE MODULE
// ============================================================================
export function AssignLeaveBalanceModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [staff, setStaff] = useState([
    { id: 1, name: "Vivek", cl: 12, sl: 10, el: 15, used: 2, balance: 35 },
    { id: 2, name: "Anil Deshmukh", cl: 12, sl: 10, el: 15, used: 5, balance: 32 },
    { id: 3, name: "Neha Gupta", cl: 12, sl: 10, el: 15, used: 1, balance: 36 }
  ]);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  const handleRecalculate = () => {
    onNotify("Leave quotas recalculated based on current attendance ledger.");
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    const balance = (editingStaff.cl + editingStaff.sl + editingStaff.el) - editingStaff.used;
    setStaff(staff.map(s => s.id === editingStaff.id ? { ...editingStaff, balance } : s));
    setEditingStaff(null);
    onNotify(`Updated balances for ${editingStaff.name}.`);
  };

  return (
    <div className="space-y-4 max-w-2xl text-xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-slate-400">Employee leave balance allocations for 2026</span>
        <button onClick={handleRecalculate} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
          Recalculate Balances
        </button>
      </div>
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3 text-center">CL</th>
              <th className="px-4 py-3 text-center">SL</th>
              <th className="px-4 py-3 text-center">EL</th>
              <th className="px-4 py-3 text-center">Used</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{s.name}</td>
                <td className="px-4 py-3 text-center font-mono">{s.cl}</td>
                <td className="px-4 py-3 text-center font-mono">{s.sl}</td>
                <td className="px-4 py-3 text-center font-mono">{s.el}</td>
                <td className="px-4 py-3 text-center font-mono text-rose-400">{s.used}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">{s.balance} days</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditingStaff({ ...s })} className="text-blue-400 hover:text-blue-300 cursor-pointer">
                    <Edit2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Edit Balance: {editingStaff.name}</h4>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">CL</label>
                  <input type="number" value={editingStaff.cl} onChange={e => setEditingStaff({ ...editingStaff, cl: Number(e.target.value) })} className="w-full px-2 py-1.5 bg-[#111827] border border-[#1e293b] rounded text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">SL</label>
                  <input type="number" value={editingStaff.sl} onChange={e => setEditingStaff({ ...editingStaff, sl: Number(e.target.value) })} className="w-full px-2 py-1.5 bg-[#111827] border border-[#1e293b] rounded text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">EL</label>
                  <input type="number" value={editingStaff.el} onChange={e => setEditingStaff({ ...editingStaff, el: Number(e.target.value) })} className="w-full px-2 py-1.5 bg-[#111827] border border-[#1e293b] rounded text-white font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Leaves Taken</label>
                <input type="number" value={editingStaff.used} onChange={e => setEditingStaff({ ...editingStaff, used: Number(e.target.value) })} className="w-full px-2 py-1.5 bg-[#111827] border border-[#1e293b] rounded text-white font-mono text-rose-400" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingStaff(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. HOLIDAYS MODULE
// ============================================================================
export function HolidaysModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [holidays, setHolidays] = useState([
    { id: 1, date: "26 Jan 2026", name: "Republic Day", day: "Monday" },
    { id: 2, date: "15 Aug 2026", name: "Independence Day", day: "Saturday" },
    { id: 3, date: "02 Oct 2026", name: "Gandhi Jayanti", day: "Friday" },
    { id: 4, date: "08 Nov 2026", name: "Diwali (Laxmi Pujan)", day: "Sunday" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newH, setNewH] = useState({ name: "", date: "", day: "Friday" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newH.name) return;
    setHolidays([...holidays, { ...newH, id: Date.now() }]);
    setModalOpen(false);
    setNewH({ name: "", date: "", day: "Friday" });
    onNotify(`Holiday "${newH.name}" added.`);
  };

  return (
    <div className="space-y-4 max-w-2xl text-xs">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">Gazetted & company holidays calendar</span>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
          + Add Holiday
        </button>
      </div>
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] divide-y divide-[#1e293b]/60">
        {holidays.map((h) => (
          <div key={h.id} className="p-3.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm">{h.name}</div>
              <div className="text-slate-400 text-xs">{h.day}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-[#0c1220] border border-[#1e293b] text-cyan-400 font-mono font-bold text-xs">
                {h.date}
              </span>
              <button onClick={() => { setHolidays(holidays.filter(x => x.id !== h.id)); onNotify("Holiday removed."); }} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Add Company Holiday</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Holiday Name</label>
                <input required placeholder="e.g. Holi" value={newH.name} onChange={e => setNewH({ ...newH, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input required placeholder="e.g. 17 Mar 2026" value={newH.date} onChange={e => setNewH({ ...newH, date: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Day of Week</label>
                  <input placeholder="Tuesday" value={newH.day} onChange={e => setNewH({ ...newH, day: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Holiday</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. APPROVAL CHAINS MODULE
// ============================================================================
export function ApprovalChainsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <GitMerge className="text-blue-400" size={16} /> Approval Hierarchy & Workflow
      </h3>
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-[#0c1220] border border-[#1e293b]">
          <div className="font-bold text-white mb-1">Tier 1: Reporting Branch Manager</div>
          <div className="text-slate-400">Approves leave applications, local travel conveyance and login requests.</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0c1220] border border-[#1e293b]">
          <div className="font-bold text-white mb-1">Tier 2: HR Head / Operations Admin</div>
          <div className="text-slate-400">Final sanction for payout releases & salary deductions.</div>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => onNotify("Approval chain rules saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Chain
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 5. OFFICE TIMINGS MODULE
// ============================================================================
export function OfficeTimingsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [shiftStart, setShiftStart] = useState("09:30 AM");
  const [shiftEnd, setShiftEnd] = useState("06:30 PM");
  const [grace, setGrace] = useState("15");

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Clock className="text-emerald-400" size={16} /> Office Shift & Biometric Timings
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1">Shift Start Time</label>
          <input value={shiftStart} onChange={e => setShiftStart(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Shift End Time</label>
          <input value={shiftEnd} onChange={e => setShiftEnd(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
      </div>
      <div>
        <label className="block text-slate-400 mb-1">Grace Period (Minutes)</label>
        <input value={grace} onChange={e => setGrace(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
      </div>
      <div className="flex justify-end">
        <button onClick={() => onNotify("Shift timings updated.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Timings
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 6. SALARY COMPONENTS MODULE
// ============================================================================
export function SalaryComponentsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [earnings, setEarnings] = useState(["Basic Salary (50% CTC)", "House Rent Allowance - HRA (20%)", "Special Allowance", "Conveyance Allowance"]);
  const [deductions, setDeductions] = useState(["Employee PF (12%)", "Professional Tax - PT (₹200/mo)", "TDS Tax Deduction"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newComp, setNewComp] = useState({ name: "", type: "earning" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComp.name) return;
    if (newComp.type === "earning") {
      setEarnings([...earnings, newComp.name]);
    } else {
      setDeductions([...deductions, newComp.name]);
    }
    setModalOpen(false);
    setNewComp({ name: "", type: "earning" });
    onNotify(`Component "${newComp.name}" added.`);
  };

  return (
    <div className="space-y-4 max-w-2xl text-xs">
      <div className="flex justify-end">
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
          + Add Component
        </button>
      </div>
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
        <h4 className="font-bold text-white text-sm">Earnings Components</h4>
        {earnings.map((e, i) => (
          <div key={i} className="p-2.5 rounded-lg bg-[#0c1220] text-slate-200 font-medium flex items-center justify-between">
            <span>{e}</span>
            <button onClick={() => setEarnings(earnings.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
        <h4 className="font-bold text-white text-sm">Statutory Deductions</h4>
        {deductions.map((d, i) => (
          <div key={i} className="p-2.5 rounded-lg bg-[#0c1220] text-slate-300 font-medium flex items-center justify-between">
            <span>{d}</span>
            <button onClick={() => setDeductions(deductions.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Add Salary Component</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Component Name</label>
                <input required placeholder="e.g. Medical Allowance" value={newComp.name} onChange={e => setNewComp({ ...newComp, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Component Classification</label>
                <select value={newComp.type} onChange={e => setNewComp({ ...newComp, type: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                  <option value="earning">Earning Component</option>
                  <option value="deduction">Statutory Deduction</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. SALARY STRUCTURE MODULE
// ============================================================================
export function SalaryStructureModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [structures, setStructures] = useState([
    { id: 1, role: "Telecalling Executive", ctc: "₹3,00,000/yr", basic: "₹12,500/mo", hra: "₹5,000/mo", special: "₹7,500/mo" },
    { id: 2, role: "Sales Manager", ctc: "₹6,50,000/yr", basic: "₹27,000/mo", hra: "₹10,800/mo", special: "₹16,366/mo" }
  ]);
  const [configModal, setConfigModal] = useState<any | null>(null);

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white">CTC Formula & Template Builder</h3>
      <p className="text-slate-400">Configure role-based salary templates for automated payslip generation.</p>
      <div className="space-y-2">
        {structures.map(s => (
          <div key={s.id} className="p-3.5 rounded-lg bg-[#0c1220] border border-[#1e293b] flex items-center justify-between">
            <div>
              <span className="font-bold text-white">{s.role}</span>
              <div className="text-[11px] text-slate-400 font-mono">CTC: {s.ctc} · Basic: {s.basic}</div>
            </div>
            <button onClick={() => setConfigModal({ ...s })} className="text-blue-400 font-semibold cursor-pointer">Configure</button>
          </div>
        ))}
      </div>

      {configModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Structure: {configModal.role}</h4>
              <button onClick={() => setConfigModal(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Annual CTC</label>
                <input value={configModal.ctc} onChange={e => setConfigModal({ ...configModal, ctc: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Basic Salary</label>
                  <input value={configModal.basic} onChange={e => setConfigModal({ ...configModal, basic: e.target.value })} className="w-full px-2 py-1.5 bg-[#111827] border border-[#1e293b] rounded text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">HRA</label>
                  <input value={configModal.hra} onChange={e => setConfigModal({ ...configModal, hra: e.target.value })} className="w-full px-2 py-1.5 bg-[#111827] border border-[#1e293b] rounded text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setConfigModal(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    setStructures(structures.map(x => x.id === configModal.id ? configModal : x));
                    setConfigModal(null);
                    onNotify("Salary template updated.");
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                >
                  Save Structure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 8. INCENTIVES MODULE
// ============================================================================
export function IncentivesModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [slabs, setSlabs] = useState([
    { id: 1, target: "Disbursement > ₹25 Lakhs", bonus: "0.15% Cash Incentive" },
    { id: 2, target: "Disbursement > ₹50 Lakhs", bonus: "0.25% Cash Incentive" },
    { id: 3, target: "Disbursement > ₹1 Crore", bonus: "0.40% Cash Incentive + Star Club Trophy" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSlab, setNewSlab] = useState({ target: "", bonus: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlab.target) return;
    setSlabs([...slabs, { ...newSlab, id: Date.now() }]);
    setModalOpen(false);
    setNewSlab({ target: "", bonus: "" });
    onNotify("Incentive slab added.");
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Gift className="text-amber-400" size={16} /> Sales Performance Incentive Slabs
      </h3>
      <div className="space-y-3">
        {slabs.map((s) => (
          <div key={s.id} className="p-3 rounded-lg bg-[#0c1220] border border-[#1e293b] flex items-center justify-between">
            <span className="font-semibold text-white">{s.target}</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-emerald-400 font-mono">{s.bonus}</span>
              <button onClick={() => { setSlabs(slabs.filter(x => x.id !== s.id)); onNotify("Slab removed."); }} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
        + Add Incentive Slab
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Add Incentive Slab</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Milestone</label>
                <input required placeholder="e.g. Disbursement > ₹2 Crores" value={newSlab.target} onChange={e => setNewSlab({ ...newSlab, target: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Bonus Reward</label>
                <input required placeholder="e.g. 0.50% Cash Incentive" value={newSlab.bonus} onChange={e => setNewSlab({ ...newSlab, bonus: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Slab</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 9. CONVEYANCE MODULE
// ============================================================================
export function ConveyanceModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [twoWheeler, setTwoWheeler] = useState("₹ 4.50 / km");
  const [fourWheeler, setFourWheeler] = useState("₹ 9.00 / km");

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Navigation className="text-cyan-400" size={16} /> Travel & Field Reimbursement Rates
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1">Two-Wheeler Rate (per KM)</label>
          <input value={twoWheeler} onChange={e => setTwoWheeler(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Four-Wheeler Rate (per KM)</label>
          <input value={fourWheeler} onChange={e => setFourWheeler(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => onNotify("Conveyance rates saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Rates
        </button>
      </div>
    </div>
  );
}
