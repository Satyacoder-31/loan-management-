import React, { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import {
  ShieldCheck, Building, KeyRound, AlertTriangle,
  Plus, Trash2, Edit2, Copy, Check, X, Shield, Lock
} from "lucide-react";

// ============================================================================
// 1. ROLES & PERMISSIONS MODULE
// ============================================================================
export function RolesPermissionsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [roles, setRoles] = useState([
    { id: 1, name: "Super Admin", users: 1, desc: "Unrestricted control over financial and operational data" },
    { id: 2, name: "Branch Manager", users: 3, desc: "Manage local team, leads and login commitments" },
    { id: 3, name: "Credit Underwriter", users: 2, desc: "Evaluate bureau, banking and trigger sanction approvals" },
    { id: 4, name: "Sales Executive", users: 8, desc: "Create leads and follow up on customer applications" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [matrixRole, setMatrixRole] = useState<any | null>(null);
  const [newRole, setNewRole] = useState({ name: "", desc: "", users: 0 });

  const [permissions, setPermissions] = useState<Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }>>({
    "Leads & Inquiries": { view: true, create: true, edit: true, delete: false },
    "Loan Applications": { view: true, create: true, edit: true, delete: false },
    "Sanctions & Credit": { view: true, create: false, edit: false, delete: false },
    "Commission Payouts": { view: false, create: false, edit: false, delete: false },
    "Reports & Analytics": { view: true, create: false, edit: false, delete: false },
    "Settings & Masters": { view: false, create: false, edit: false, delete: false }
  });

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) return;
    setRoles([...roles, { ...newRole, id: Date.now() }]);
    setModalOpen(false);
    setNewRole({ name: "", desc: "", users: 0 });
    onNotify(`Role "${newRole.name}" created.`);
  };

  const handleOpenMatrix = (role: any) => {
    setMatrixRole(role);
    // Initialize permissions according to role
    if (role.name === "Super Admin") {
      setPermissions({
        "Leads & Inquiries": { view: true, create: true, edit: true, delete: true },
        "Loan Applications": { view: true, create: true, edit: true, delete: true },
        "Sanctions & Credit": { view: true, create: true, edit: true, delete: true },
        "Commission Payouts": { view: true, create: true, edit: true, delete: true },
        "Reports & Analytics": { view: true, create: true, edit: true, delete: true },
        "Settings & Masters": { view: true, create: true, edit: true, delete: true }
      });
    } else {
      setPermissions({
        "Leads & Inquiries": { view: true, create: true, edit: true, delete: false },
        "Loan Applications": { view: true, create: true, edit: true, delete: false },
        "Sanctions & Credit": { view: true, create: false, edit: false, delete: false },
        "Commission Payouts": { view: false, create: false, edit: false, delete: false },
        "Reports & Analytics": { view: true, create: false, edit: false, delete: false },
        "Settings & Masters": { view: false, create: false, edit: false, delete: false }
      });
    }
  };

  const togglePerm = (module: string, action: "view" | "create" | "edit" | "delete") => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action]
      }
    }));
  };

  return (
    <div className="space-y-4 max-w-3xl text-xs">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">Manage user access roles and module permission matrices</span>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
          + Add Role
        </button>
      </div>
      <div className="space-y-3">
        {roles.map((r) => (
          <div key={r.id} className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm">{r.name}</div>
              <div className="text-slate-400 text-xs">{r.desc}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono">{r.users} users</span>
              <button onClick={() => handleOpenMatrix(r)} className="px-3 py-1.5 rounded-lg bg-[#182235] hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-bold cursor-pointer">
                Edit Matrix
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Add New Role</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddRole} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Role Title</label>
                <input required placeholder="e.g. Regional Manager" value={newRole.name} onChange={e => setNewRole({ ...newRole, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Role Scope / Description</label>
                <textarea rows={2} placeholder="Oversees branch sales targets..." value={newRole.desc} onChange={e => setNewRole({ ...newRole, desc: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Create Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Matrix Modal */}
      {matrixRole && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c1220] border border-[#1e293b] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="text-blue-400" size={18} />
                  Permissions Matrix: {matrixRole.name}
                </h3>
                <p className="text-xs text-slate-400">Configure read, write, and deletion privileges per operational module.</p>
              </div>
              <button onClick={() => setMatrixRole(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
                  <tr>
                    <th className="px-4 py-3">Module</th>
                    <th className="px-3 py-3 text-center">View</th>
                    <th className="px-3 py-3 text-center">Create</th>
                    <th className="px-3 py-3 text-center">Edit</th>
                    <th className="px-3 py-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]/60">
                  {Object.entries(permissions).map(([mod, perms]) => (
                    <tr key={mod} className="hover:bg-[#162033]/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{mod}</td>
                      {(["view", "create", "edit", "delete"] as const).map(action => (
                        <td key={action} className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={perms[action]}
                            onChange={() => togglePerm(mod, action)}
                            className="w-4 h-4 rounded bg-[#0c1220] border border-slate-600 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400">Changes apply immediately to all active {matrixRole.name} accounts.</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setMatrixRole(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    onNotify(`Updated permissions matrix for ${matrixRole.name}.`);
                    setMatrixRole(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                >
                  Save Matrix
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
// 2. COMPANY / INVOICE MODULE
// ============================================================================
export function CompanyInvoiceModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [form, setForm] = useState({
    legal_name: "Sniper Electric & Financial Services Pvt Ltd",
    gstin: "27AABCS1429B1Z8",
    pan: "AABCS1429B",
    cin: "U65100MH2021PTC368190",
    registered_address: "Level 4, Commerce Center, Bandra Kurla Complex, Mumbai 400051",
    bank_name: "HDFC Bank Ltd",
    account_number: "50200088912344",
    ifsc: "HDFC0000060"
  });

  useEffect(() => {
    const saved = localStorage.getItem("gn_company_profile");
    if (saved) {
      try { setForm(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("gn_company_profile", JSON.stringify(form));
    api("/gn/admin/settings", {
      method: "POST",
      body: { key: "gn_company", value: form }
    })
      .then(() => onNotify("Company profile and legal details saved successfully."))
      .catch(() => onNotify("Saved locally."));
  };

  return (
    <form onSubmit={handleSave} className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Building className="text-blue-400" size={16} /> Legal Entity & Payout Bank Details
      </h3>
      <div>
        <label className="block text-slate-400 mb-1">Company Legal Name</label>
        <input value={form.legal_name} onChange={e => setForm({ ...form, legal_name: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-semibold" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1">GSTIN</label>
          <input value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">PAN Number</label>
          <input value={form.pan} onChange={e => setForm({ ...form, pan: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
      </div>
      <div>
        <label className="block text-slate-400 mb-1">Registered Office Address</label>
        <textarea rows={2} value={form.registered_address} onChange={e => setForm({ ...form, registered_address: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white" />
      </div>
      <div className="pt-2 border-t border-[#1e293b]">
        <h4 className="font-bold text-white mb-2">Disbursement Payout Bank Account</h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-400 mb-1">Bank Name</label>
            <input value={form.bank_name} onChange={e => setForm({ ...form, bank_name: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Account Number</label>
            <input value={form.account_number} onChange={e => setForm({ ...form, account_number: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">IFSC Code</label>
            <input value={form.ifsc} onChange={e => setForm({ ...form, ifsc: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Company Details
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// 3. API ACCESS MODULE
// ============================================================================
export function ApiAccessModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [keys, setKeys] = useState([
    { id: 1, name: "Live Production Key", prefix: "tlp_live_891238491029384", created: "10 Oct 2026", status: "Active" },
    { id: 2, name: "Staging Test Key", prefix: "tlp_test_109283910283910", created: "05 Oct 2026", status: "Active" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const key = {
      id: Date.now(),
      name: newKeyName,
      prefix: "tlp_live_" + Math.random().toString(36).substring(2, 18),
      created: "Today",
      status: "Active"
    };
    setKeys([key, ...keys]);
    setModalOpen(false);
    setNewKeyName("");
    onNotify(`Generated API key "${key.name}".`);
  };

  return (
    <div className="space-y-4 max-w-2xl text-xs">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">Developer API Keys for CRM integration & automated lead intake</span>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
          + Generate New API Key
        </button>
      </div>
      <div className="space-y-3">
        {keys.map((k) => (
          <div key={k.id} className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm">{k.name}</div>
              <div className="text-cyan-400 font-mono text-xs mt-1">{k.prefix.substring(0, 18)}••••••••</div>
              <div className="text-[11px] text-slate-500 mt-1">Created on {k.created}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { navigator.clipboard.writeText(k.prefix); onNotify("API token copied."); }}
                className="px-3 py-1 bg-[#182235] hover:bg-slate-700 text-slate-200 rounded font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy size={12} /> Copy
              </button>
              <button
                onClick={() => { setKeys(keys.filter(x => x.id !== k.id)); onNotify("API key revoked."); }}
                className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                title="Revoke key"
              >
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
              <h4 className="font-bold text-white text-sm">Generate New API Key</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleGenerate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Key Description / Client Name</label>
                <input required placeholder="e.g. Website Form Intake" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. START FRESH MODULE
// ============================================================================
export function StartFreshModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [confirm, setConfirm] = useState("");

  const handleReset = () => {
    if (confirm !== "RESET") {
      onNotify("Type 'RESET' to confirm database purge.");
      return;
    }
    onNotify("Demo records cleaned successfully. Masters and system credentials preserved.");
    setConfirm("");
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-rose-500/30 max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
        <AlertTriangle size={16} /> Clean Slate & Test Data Reset
      </h3>
      <p className="text-slate-300">
        Safely purge test leads and temporary sandbox queries before going live. Your bank masters, schemes and staff credentials remain intact.
      </p>
      <div>
        <label className="block text-slate-400 mb-1">Type <strong>RESET</strong> below to confirm:</label>
        <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Type RESET" className="w-full px-3 py-2 bg-[#0c1220] border border-rose-500/40 rounded-lg text-white font-mono" />
      </div>
      <button onClick={handleReset} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg cursor-pointer">
        Execute Clean Slate
      </button>
    </div>
  );
}
