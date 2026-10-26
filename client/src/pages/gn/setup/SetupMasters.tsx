import React, { useState, useEffect } from "react";
import { api, fmtInr } from "../../../lib/api";
import {
  Landmark, Building2, Package, ShieldCheck, KeyRound, Sparkles,
  Calculator, UserCheck, MapPin, Target, Plus, Trash2, Edit2,
  Download, Upload, Check, X, Users, Layers, ExternalLink, Settings2
} from "lucide-react";

// ============================================================================
// 1. BANKS MODULE
// ============================================================================
export function BanksModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [banks, setBanks] = useState<any[]>([
    { id: 1, name: "HDFC Bank", type: "Private", dsa_code: "HDFC-88219", products_count: 24, status: "active", api_status: "connected", contact: "Rahul Khanna", phone: "9820011223", commission_share: "85%" },
    { id: 2, name: "ICICI Bank", type: "Private", dsa_code: "ICICI-00921", products_count: 18, status: "active", api_status: "connected", contact: "Priya Nair", phone: "9811099887", commission_share: "80%" },
    { id: 3, name: "State Bank of India (SBI)", type: "Public", dsa_code: "SBI-DSA-44", products_count: 32, status: "active", api_status: "sandbox", contact: "Sunil Joshi", phone: "9833445566", commission_share: "75%" },
    { id: 4, name: "Bajaj Finserv", type: "NBFC", dsa_code: "BAJAJ-9921", products_count: 16, status: "active", api_status: "connected", contact: "Vikas Mehra", phone: "9876543210", commission_share: "90%" },
    { id: 5, name: "Axis Bank", type: "Private", dsa_code: "AXIS-7712", products_count: 15, status: "active", api_status: "not configured", contact: "Sneha Patel", phone: "9819988776", commission_share: "82%" }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [configModalBank, setConfigModalBank] = useState<any | null>(null);
  const [newBank, setNewBank] = useState({ name: "", type: "Private", dsa_code: "", products_count: 0, contact: "", phone: "", commission_share: "80%" });

  useEffect(() => {
    const saved = localStorage.getItem("gn_banks_list");
    if (saved) {
      try { setBanks(JSON.parse(saved)); } catch (e) {}
    } else {
      api("/gn/lenders")
        .then((data: any) => {
          if (Array.isArray(data) && data.length > 0) {
            setBanks(data);
          }
        })
        .catch(() => {});
    }
  }, []);

  const saveList = (updated: any[]) => {
    setBanks(updated);
    localStorage.setItem("gn_banks_list", JSON.stringify(updated));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.name) return;
    const item = { ...newBank, id: Date.now(), status: "active", api_status: "connected" };
    const updated = [item, ...banks];
    saveList(updated);
    setModalOpen(false);
    setNewBank({ name: "", type: "Private", dsa_code: "", products_count: 0, contact: "", phone: "", commission_share: "80%" });
    onNotify(`Bank "${item.name}" registered successfully.`);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configModalBank) return;
    const updated = banks.map(b => b.id === configModalBank.id ? configModalBank : b);
    saveList(updated);
    setConfigModalBank(null);
    onNotify(`Configuration for ${configModalBank.name} updated.`);
  };

  const toggleStatus = (id: number) => {
    const updated = banks.map(b => b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b);
    saveList(updated);
    onNotify("Bank status updated.");
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Remove ${name} from lenders list?`)) {
      const updated = banks.filter(b => b.id !== id);
      saveList(updated);
      onNotify(`${name} removed.`);
    }
  };

  const exportCsv = () => {
    const headers = "ID,Bank Name,Type,DSA Code,Active Products,API Status,Status,Contact,Phone,Commission Share\n";
    const rows = banks.map(b => `"${b.id}","${b.name}","${b.type}","${b.dsa_code || ''}","${b.products_count}","${b.api_status}","${b.status}","${b.contact || ''}","${b.phone || ''}","${b.commission_share || ''}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `banks_directory_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify("Exported Bank Directory CSV.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-xs text-slate-400">
          Showing <strong>{banks.length}</strong> registered lenders and institutional financiers
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-slate-300 text-xs font-semibold hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer"
          >
            <Plus size={14} /> Add Bank
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Bank Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">DSA Code</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">API Integration</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {banks.map((b) => (
              <tr key={b.id} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-2">
                  <Landmark size={14} className="text-blue-400" />
                  <span>{b.name}</span>
                </td>
                <td className="px-4 py-3 text-slate-400">{b.type}</td>
                <td className="px-4 py-3 font-mono text-cyan-400 font-semibold">{b.dsa_code || "—"}</td>
                <td className="px-4 py-3 text-slate-300">{b.products_count} active</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.api_status === "connected" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-700/40 text-slate-400"}`}>
                    {b.api_status || "connected"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(b.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold cursor-pointer transition-colors ${b.status === "active" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"}`}
                  >
                    {b.status}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setConfigModalBank({ ...b })}
                      className="text-blue-400 hover:text-blue-300 font-semibold text-[11.5px] cursor-pointer"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.name)}
                      className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                      title="Delete Bank"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Bank Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add New Lender / Bank</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Bank / Institution Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kotak Mahindra Bank"
                  value={newBank.name}
                  onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Type</label>
                  <select
                    value={newBank.type}
                    onChange={(e) => setNewBank({ ...newBank, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  >
                    <option value="Private">Private Bank</option>
                    <option value="Public">Public Sector Bank</option>
                    <option value="NBFC">NBFC</option>
                    <option value="HFC">Housing Finance Corp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">DSA / Vendor Code</label>
                  <input
                    type="text"
                    placeholder="e.g. KOTAK-DSA-01"
                    value={newBank.dsa_code}
                    onChange={(e) => setNewBank({ ...newBank, dsa_code: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Relationship Manager</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={newBank.contact}
                    onChange={(e) => setNewBank({ ...newBank, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="98XXXXXXXX"
                    value={newBank.phone}
                    onChange={(e) => setNewBank({ ...newBank, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Bank</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configure Bank Modal */}
      {configModalBank && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">Configure Lender: {configModalBank.name}</h3>
                <p className="text-[11px] text-slate-400">Credentials, payout split and relationship contact</p>
              </div>
              <button onClick={() => setConfigModalBank(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Lender Name</label>
                <input
                  required
                  value={configModalBank.name}
                  onChange={(e) => setConfigModalBank({ ...configModalBank, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">DSA Code</label>
                  <input
                    value={configModalBank.dsa_code || ""}
                    onChange={(e) => setConfigModalBank({ ...configModalBank, dsa_code: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Commission Share</label>
                  <input
                    value={configModalBank.commission_share || "80%"}
                    onChange={(e) => setConfigModalBank({ ...configModalBank, commission_share: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">API Integration Status</label>
                  <select
                    value={configModalBank.api_status || "connected"}
                    onChange={(e) => setConfigModalBank({ ...configModalBank, api_status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  >
                    <option value="connected">Connected (Live)</option>
                    <option value="sandbox">Sandbox Test</option>
                    <option value="not configured">Not Configured</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Active Products</label>
                  <input
                    type="number"
                    value={configModalBank.products_count || 0}
                    onChange={(e) => setConfigModalBank({ ...configModalBank, products_count: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Key RM / Contact</label>
                  <input
                    value={configModalBank.contact || ""}
                    onChange={(e) => setConfigModalBank({ ...configModalBank, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">RM Phone</label>
                  <input
                    value={configModalBank.phone || ""}
                    onChange={(e) => setConfigModalBank({ ...configModalBank, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setConfigModalBank(null)} className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. BANK BRANCH MODULE
// ============================================================================
export function BankBranchModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [branches, setBranches] = useState<any[]>([
    { id: 1, bank: "HDFC Bank", branch: "Fort Mumbai Flagship", ifsc: "HDFC0000060", city: "Mumbai", state: "Maharashtra", manager: "Rajesh Sharma", contact: "9820011223" },
    { id: 2, bank: "ICICI Bank", branch: "Connaught Place", ifsc: "ICIC0000007", city: "New Delhi", state: "Delhi", manager: "Priya Nair", contact: "9811099887" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [newBranch, setNewBranch] = useState({ bank: "HDFC Bank", branch: "", ifsc: "", city: "Mumbai", state: "Maharashtra", manager: "", contact: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.branch) return;
    setBranches([{ ...newBranch, id: Date.now() }, ...branches]);
    setModalOpen(false);
    setNewBranch({ bank: "HDFC Bank", branch: "", ifsc: "", city: "Mumbai", state: "Maharashtra", manager: "", contact: "" });
    onNotify(`Branch "${newBranch.branch}" added.`);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;
    setBranches(branches.map(b => b.id === editingBranch.id ? editingBranch : b));
    setEditingBranch(null);
    onNotify(`Branch "${editingBranch.branch}" updated.`);
  };

  const handleDelete = (id: number) => {
    setBranches(branches.filter(x => x.id !== id));
    onNotify("Branch removed.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-xs text-slate-400">Manage physical branches, local IFSC mapping and key relationship managers</div>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Bank Branch
        </button>
      </div>

      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Bank</th>
              <th className="px-4 py-3">Branch Name</th>
              <th className="px-4 py-3">IFSC Code</th>
              <th className="px-4 py-3">City / State</th>
              <th className="px-4 py-3">Branch Manager</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {branches.map(b => (
              <tr key={b.id} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-200">{b.bank}</td>
                <td className="px-4 py-3 text-white">{b.branch}</td>
                <td className="px-4 py-3 font-mono text-cyan-400">{b.ifsc}</td>
                <td className="px-4 py-3 text-slate-400">{b.city}, {b.state}</td>
                <td className="px-4 py-3 text-slate-300">{b.manager || "—"}</td>
                <td className="px-4 py-3 text-slate-400 font-mono">{b.contact || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditingBranch({ ...b })} className="text-blue-400 hover:text-blue-300 p-1 cursor-pointer">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Bank Branch</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Bank</label>
                <select value={newBranch.bank} onChange={e => setNewBranch({ ...newBranch, bank: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Bajaj Finserv</option>
                  <option>Axis Bank</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Branch Name</label>
                <input required placeholder="e.g. Andheri West Branch" value={newBranch.branch} onChange={e => setNewBranch({ ...newBranch, branch: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">IFSC Code</label>
                  <input required placeholder="HDFC0001234" value={newBranch.ifsc} onChange={e => setNewBranch({ ...newBranch, ifsc: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">City</label>
                  <input required placeholder="Mumbai" value={newBranch.city} onChange={e => setNewBranch({ ...newBranch, city: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Manager Name</label>
                  <input placeholder="e.g. Amit Kumar" value={newBranch.manager} onChange={e => setNewBranch({ ...newBranch, manager: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Manager Phone</label>
                  <input placeholder="98XXXXXXXX" value={newBranch.contact} onChange={e => setNewBranch({ ...newBranch, contact: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Edit Branch: {editingBranch.branch}</h3>
              <button onClick={() => setEditingBranch(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Bank</label>
                <input required value={editingBranch.bank} onChange={e => setEditingBranch({ ...editingBranch, bank: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Branch Name</label>
                <input required value={editingBranch.branch} onChange={e => setEditingBranch({ ...editingBranch, branch: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">IFSC Code</label>
                  <input required value={editingBranch.ifsc} onChange={e => setEditingBranch({ ...editingBranch, ifsc: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">City</label>
                  <input required value={editingBranch.city} onChange={e => setEditingBranch({ ...editingBranch, city: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Manager Name</label>
                  <input value={editingBranch.manager || ""} onChange={e => setEditingBranch({ ...editingBranch, manager: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Manager Phone</label>
                  <input value={editingBranch.contact || ""} onChange={e => setEditingBranch({ ...editingBranch, contact: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingBranch(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Update Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. PRODUCTS MODULE
// ============================================================================
export function ProductsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [filterCat, setFilterCat] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingP, setEditingP] = useState<any | null>(null);
  const [newP, setNewP] = useState({ name: "", category: "Personal Loan", lender_name: "HDFC Bank", min_amount: 100000, max_amount: 5000000, payout_pct: 1.5 });

  useEffect(() => {
    api("/gn/products")
      .then((res: any) => {
        if (Array.isArray(res?.rows) && res.rows.length > 0) {
          setProducts(res.rows);
        } else {
          setProducts([
            { id: 1, name: "HDFC Express Personal Loan", category: "Personal Loan", lender_name: "HDFC Bank", min_amount: 50000, max_amount: 4000000, payout_pct: 1.75 },
            { id: 2, name: "ICICI Business Growth Loan", category: "Business Loan", lender_name: "ICICI Bank", min_amount: 500000, max_amount: 7500000, payout_pct: 1.6 },
            { id: 3, name: "SBI Home Super Saver", category: "Home Loan", lender_name: "State Bank of India (SBI)", min_amount: 1000000, max_amount: 30000000, payout_pct: 0.5 },
            { id: 4, name: "Bajaj Finserv Professional Loan", category: "Personal Loan", lender_name: "Bajaj Finserv", min_amount: 200000, max_amount: 5000000, payout_pct: 2.1 }
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const displayed = filterCat === "ALL" ? products : products.filter(p => p.category?.toLowerCase() === filterCat.toLowerCase());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newP.name) return;
    const item = { ...newP, id: Date.now() };
    setProducts([item, ...products]);
    setModalOpen(false);
    onNotify(`Loan Product "${newP.name}" created.`);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingP) return;
    setProducts(products.map(p => p.id === editingP.id ? editingP : p));
    setEditingP(null);
    onNotify(`Product "${editingP.name}" updated.`);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    onNotify("Product removed.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Category:</span>
          {["ALL", "Personal Loan", "Business Loan", "Home Loan", "Loan Against Property", "Used Car Loan"].map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${filterCat === c ? "bg-blue-600 text-white" : "bg-[#111827] text-slate-400 hover:text-white"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Lender / Partner</th>
              <th className="px-4 py-3 text-right">Loan Range (Min – Max)</th>
              <th className="px-4 py-3 text-right">Base Payout</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {displayed.slice(0, 15).map(p => (
              <tr key={p.id} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-100">{p.name}</td>
                <td className="px-4 py-3 text-slate-400">{p.category}</td>
                <td className="px-4 py-3 text-slate-300">{p.lender_name || "Multiple"}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-300">{fmtInr(p.min_amount || 50000)} – {fmtInr(p.max_amount || 5000000)}</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-400">{p.payout_pct || 1.25}%</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => setEditingP({ ...p })} className="text-blue-400 hover:text-blue-300 p-1 cursor-pointer">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayed.length > 15 && (
          <div className="p-3 text-center text-xs text-slate-500 border-t border-[#1e293b]">
            Showing 15 of {displayed.length} products. Use category filter to view others.
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Loan Product</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Title</label>
                <input required placeholder="e.g. HDFC Express Personal Loan" value={newP.name} onChange={e => setNewP({ ...newP, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select value={newP.category} onChange={e => setNewP({ ...newP, category: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                    <option>Personal Loan</option>
                    <option>Business Loan</option>
                    <option>Home Loan</option>
                    <option>Loan Against Property</option>
                    <option>Used Car Loan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Lender Bank</label>
                  <input placeholder="HDFC Bank" value={newP.lender_name} onChange={e => setNewP({ ...newP, lender_name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Min Amount (₹)</label>
                  <input type="number" value={newP.min_amount} onChange={e => setNewP({ ...newP, min_amount: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Max Amount (₹)</label>
                  <input type="number" value={newP.max_amount} onChange={e => setNewP({ ...newP, max_amount: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Base Payout (%)</label>
                <input type="number" step="0.05" value={newP.payout_pct} onChange={e => setNewP({ ...newP, payout_pct: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingP && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Edit Loan Product: {editingP.name}</h3>
              <button onClick={() => setEditingP(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Title</label>
                <input required value={editingP.name} onChange={e => setEditingP({ ...editingP, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select value={editingP.category} onChange={e => setEditingP({ ...editingP, category: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                    <option>Personal Loan</option>
                    <option>Business Loan</option>
                    <option>Home Loan</option>
                    <option>Loan Against Property</option>
                    <option>Used Car Loan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Lender Bank</label>
                  <input value={editingP.lender_name || ""} onChange={e => setEditingP({ ...editingP, lender_name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Min Amount (₹)</label>
                  <input type="number" value={editingP.min_amount} onChange={e => setEditingP({ ...editingP, min_amount: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Max Amount (₹)</label>
                  <input type="number" value={editingP.max_amount} onChange={e => setEditingP({ ...editingP, max_amount: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Base Payout (%)</label>
                <input type="number" step="0.05" value={editingP.payout_pct} onChange={e => setEditingP({ ...editingP, payout_pct: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingP(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. INSURANCE MODULE
// ============================================================================
export function InsuranceModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [partners, setPartners] = useState([
    { id: 1, name: "HDFC Life Insurance", type: "Life", payout: "18.5%", contact: "Sandeep Roy", phone: "9820099881", status: "Active" },
    { id: 2, name: "Star Health & Allied Insurance", type: "Health", payout: "15.0%", contact: "Anita Nair", phone: "9819922334", status: "Active" },
    { id: 3, name: "ICICI Lombard General", type: "Motor & General", payout: "12.0%", contact: "Karan Desai", phone: "9833441122", status: "Active" },
    { id: 4, name: "Tata AIG General Insurance", type: "General", payout: "14.5%", contact: "Manish Shah", phone: "9876501234", status: "Active" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [newP, setNewP] = useState({ name: "", type: "Health", payout: "15.0%", contact: "", phone: "", status: "Active" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newP.name) return;
    setPartners([{ ...newP, id: Date.now() }, ...partners]);
    setModalOpen(false);
    setNewP({ name: "", type: "Health", payout: "15.0%", contact: "", phone: "", status: "Active" });
    onNotify(`Insurance partner "${newP.name}" registered.`);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;
    setPartners(partners.map(p => p.id === editingPartner.id ? editingPartner : p));
    setEditingPartner(null);
    onNotify(`Insurance partner "${editingPartner.name}" updated.`);
  };

  const handleDelete = (id: number) => {
    setPartners(partners.filter(p => p.id !== id));
    onNotify("Insurance partner removed.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400">Insurance distribution partners & commission grids</span>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Insurance Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map(p => (
          <div key={p.id} className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{p.name}</h4>
                <p className="text-xs text-slate-400">Line: {p.type} · Up to {p.payout} commission</p>
                {p.contact && <p className="text-[11px] text-slate-500">Contact: {p.contact} ({p.phone})</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingPartner({ ...p })} className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer">
                Edit
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Insurance Partner</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Company Name</label>
                <input required placeholder="e.g. Max Life Insurance" value={newP.name} onChange={e => setNewP({ ...newP, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Insurance Line</label>
                  <select value={newP.type} onChange={e => setNewP({ ...newP, type: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                    <option>Life</option>
                    <option>Health</option>
                    <option>Motor & General</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Commission Payout</label>
                  <input placeholder="e.g. 16.5%" value={newP.payout} onChange={e => setNewP({ ...newP, payout: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Contact Person</label>
                  <input placeholder="Name" value={newP.contact} onChange={e => setNewP({ ...newP, contact: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input placeholder="98XXXXXXXX" value={newP.phone} onChange={e => setNewP({ ...newP, phone: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingPartner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Edit Insurance Partner: {editingPartner.name}</h3>
              <button onClick={() => setEditingPartner(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Company Name</label>
                <input required value={editingPartner.name} onChange={e => setEditingPartner({ ...editingPartner, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Insurance Line</label>
                  <input value={editingPartner.type} onChange={e => setEditingPartner({ ...editingPartner, type: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Commission Payout</label>
                  <input value={editingPartner.payout} onChange={e => setEditingPartner({ ...editingPartner, payout: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Contact Person</label>
                  <input value={editingPartner.contact || ""} onChange={e => setEditingPartner({ ...editingPartner, contact: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input value={editingPartner.phone || ""} onChange={e => setEditingPartner({ ...editingPartner, phone: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingPartner(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Update Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. PARENT DSA MODULE
// ============================================================================
export function ParentDsaModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [dsas, setDsas] = useState<any[]>([
    { id: 1, name: "Andromeda Sales & Distribution", contact: "Vikas Aggarwal", share: "85% - 15% Split", codes_count: 8, status: "Active" },
    { id: 2, name: "MyMoneyMantra FinTech Ltd", contact: "Sanjay Kaul", share: "80% - 20% Split", codes_count: 5, status: "Active" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDsa, setEditingDsa] = useState<any | null>(null);
  const [newDsa, setNewDsa] = useState({ name: "", contact: "", share: "85% - 15% Split", codes_count: 0, status: "Active" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDsa.name) return;
    setDsas([{ ...newDsa, id: Date.now() }, ...dsas]);
    setModalOpen(false);
    setNewDsa({ name: "", contact: "", share: "85% - 15% Split", codes_count: 0, status: "Active" });
    onNotify(`Parent DSA "${newDsa.name}" registered.`);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDsa) return;
    setDsas(dsas.map(d => d.id === editingDsa.id ? editingDsa : d));
    setEditingDsa(null);
    onNotify(`Parent DSA "${editingDsa.name}" updated.`);
  };

  const handleDelete = (id: number) => {
    setDsas(dsas.filter(d => d.id !== id));
    onNotify("Parent DSA removed.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400">Bigger DSAs you operate under for institutional codes and pooled sub-DSA payouts</span>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Parent DSA
        </button>
      </div>

      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Parent DSA</th>
              <th className="px-4 py-3">Key Contact</th>
              <th className="px-4 py-3">Revenue Share Terms</th>
              <th className="px-4 py-3">Linked Codes</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {dsas.map(d => (
              <tr key={d.id} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{d.name}</td>
                <td className="px-4 py-3 text-slate-300">{d.contact}</td>
                <td className="px-4 py-3 text-cyan-400 font-medium">{d.share}</td>
                <td className="px-4 py-3 text-slate-400">{d.codes_count} active codes</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{d.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditingDsa({ ...d })} className="text-blue-400 hover:text-blue-300 cursor-pointer">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="text-rose-400 hover:text-rose-300 cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Parent DSA</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">DSA / Entity Name</label>
                <input required placeholder="e.g. Andromeda Sales & Distribution" value={newDsa.name} onChange={e => setNewDsa({ ...newDsa, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Key Relationship Contact</label>
                <input placeholder="e.g. Vikas Aggarwal" value={newDsa.contact} onChange={e => setNewDsa({ ...newDsa, contact: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Revenue Share Terms</label>
                  <input placeholder="85% - 15% Split" value={newDsa.share} onChange={e => setNewDsa({ ...newDsa, share: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Initial Active Codes</label>
                  <input type="number" value={newDsa.codes_count} onChange={e => setNewDsa({ ...newDsa, codes_count: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Parent DSA</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingDsa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Edit Parent DSA: {editingDsa.name}</h3>
              <button onClick={() => setEditingDsa(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">DSA / Entity Name</label>
                <input required value={editingDsa.name} onChange={e => setEditingDsa({ ...editingDsa, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Key Relationship Contact</label>
                <input value={editingDsa.contact} onChange={e => setEditingDsa({ ...editingDsa, contact: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Revenue Share Terms</label>
                  <input value={editingDsa.share} onChange={e => setEditingDsa({ ...editingDsa, share: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Active Codes</label>
                  <input type="number" value={editingDsa.codes_count} onChange={e => setEditingDsa({ ...editingDsa, codes_count: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingDsa(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Update Parent DSA</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. DSA CODE MODULE
// ============================================================================
export function DsaCodeModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [codes, setCodes] = useState([
    { id: 1, lender: "HDFC Bank", code: "HDFC-BL-8801", label: "BL / PL Direct Hub", type: "Direct DSA", status: "Active" },
    { id: 2, lender: "Bajaj Finance", code: "BJ-MSME-991", label: "National SME Channel", type: "Via Andromeda", status: "Active" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<any | null>(null);
  const [newC, setNewC] = useState({ lender: "HDFC Bank", code: "", label: "", type: "Direct DSA", status: "Active" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newC.code) return;
    setCodes([{ ...newC, id: Date.now() }, ...codes]);
    setModalOpen(false);
    setNewC({ lender: "HDFC Bank", code: "", label: "", type: "Direct DSA", status: "Active" });
    onNotify(`DSA Code "${newC.code}" registered.`);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCode) return;
    setCodes(codes.map(c => c.id === editingCode.id ? editingCode : c));
    setEditingCode(null);
    onNotify(`DSA Code "${editingCode.code}" updated.`);
  };

  const handleDelete = (id: number) => {
    setCodes(codes.filter(c => c.id !== id));
    onNotify("DSA Code removed.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400">DSA Code Registry — tie every bank login directly to the correct channel code</span>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Register DSA Code
        </button>
      </div>
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Bank / Financier</th>
              <th className="px-4 py-3">Channel Code</th>
              <th className="px-4 py-3">Label / Description</th>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {codes.map(c => (
              <tr key={c.id} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{c.lender}</td>
                <td className="px-4 py-3 font-mono text-cyan-400 font-bold">{c.code}</td>
                <td className="px-4 py-3 text-slate-300">{c.label}</td>
                <td className="px-4 py-3 text-slate-400">{c.type}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{c.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditingCode({ ...c })} className="text-blue-400 hover:text-blue-300 cursor-pointer">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-rose-400 hover:text-rose-300 cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Register DSA Code</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Bank / Financier</label>
                <input required placeholder="e.g. HDFC Bank" value={newC.lender} onChange={e => setNewC({ ...newC, lender: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Channel DSA Code</label>
                <input required placeholder="e.g. HDFC-DSA-8821" value={newC.code} onChange={e => setNewC({ ...newC, code: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Label / Description</label>
                <input placeholder="e.g. Western Region Direct Codes" value={newC.label} onChange={e => setNewC({ ...newC, label: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Scope</label>
                <select value={newC.type} onChange={e => setNewC({ ...newC, type: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                  <option>Direct DSA</option>
                  <option>Via Andromeda</option>
                  <option>Via MyMoneyMantra</option>
                  <option>Sub-DSA Referral</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Register Code</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Edit DSA Code: {editingCode.code}</h3>
              <button onClick={() => setEditingCode(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Bank / Financier</label>
                <input required value={editingCode.lender} onChange={e => setEditingCode({ ...editingCode, lender: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Channel DSA Code</label>
                <input required value={editingCode.code} onChange={e => setEditingCode({ ...editingCode, code: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Label / Description</label>
                <input value={editingCode.label} onChange={e => setEditingCode({ ...editingCode, label: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Scope</label>
                <input value={editingCode.type} onChange={e => setEditingCode({ ...editingCode, type: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingCode(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Update Code</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. SCHEME FEED MODULE
// ============================================================================
export function SchemeFeedModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [feeds, setFeeds] = useState([
    { id: 1, bank: "HDFC Bank", product: "Personal Loan", payout: "1.75% + 0.25% Booster on >50L", tag: "Hot Incentive", date: "Valid till end of month", imported: false },
    { id: 2, bank: "Axis Bank", product: "Home Loan & Balance Transfer", payout: "0.45% Flat + ₹5,000 Login Cash", tag: "Festive Promo", date: "Updated today", imported: false },
    { id: 3, bank: "Bajaj Finserv", product: "Doctor Loan & Professional Loan", payout: "2.10% Direct Disbursement", tag: "High Ticket", date: "Active", imported: false }
  ]);

  const handleImport = (f: any) => {
    // Add to local schemes
    const saved = localStorage.getItem("gn_custom_schemes");
    let current = saved ? JSON.parse(saved) : [];
    current.push({
      id: Date.now(),
      name: `${f.bank} - ${f.product} Feed Scheme`,
      bank: f.bank,
      product: f.product,
      type: "Percentage",
      rate: f.payout,
      status: "active"
    });
    localStorage.setItem("gn_custom_schemes", JSON.stringify(current));

    setFeeds(feeds.map(x => x.id === f.id ? { ...x, imported: true } : x));
    onNotify(`Imported ${f.bank} ${f.product} scheme into your active schemes master!`);
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-400">Live institutional scheme feeds automatically synced across national banking networks</div>
      <div className="space-y-3">
        {feeds.map(f => (
          <div key={f.id} className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-sm">{f.bank} — {f.product}</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">{f.tag}</span>
              </div>
              <div className="text-xs text-emerald-400 font-semibold">{f.payout}</div>
              <div className="text-[11px] text-slate-500 mt-1">{f.date}</div>
            </div>
            <button
              onClick={() => handleImport(f)}
              disabled={f.imported}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors ${
                f.imported
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 cursor-default"
                  : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              }`}
            >
              {f.imported ? <Check size={13} /> : <Download size={13} />}
              <span>{f.imported ? "Imported to Schemes" : "Import to My Schemes"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 8. SCHEMES MODULE
// ============================================================================
export function SchemesModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [schemes, setSchemes] = useState<any[]>([
    { id: 1, name: "HDFC Salaried Standard Scheme", bank: "HDFC Bank", product: "Personal Loan", type: "Percentage", rate: "1.50%", status: "active" },
    { id: 2, name: "ICICI LAP High-Value Slab", bank: "ICICI Bank", product: "LAP", type: "Slab", rate: "0.85% - 1.20%", status: "active" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<any | null>(null);
  const [newS, setNewS] = useState({ name: "", bank: "HDFC Bank", product: "Personal Loan", type: "Percentage", rate: "1.50%", status: "active" });

  useEffect(() => {
    const saved = localStorage.getItem("gn_custom_schemes");
    if (saved) {
      try {
        const extra = JSON.parse(saved);
        if (Array.isArray(extra) && extra.length > 0) {
          setSchemes([...extra, ...schemes]);
        }
      } catch (e) {}
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newS.name) return;
    setSchemes([{ ...newS, id: Date.now() }, ...schemes]);
    setModalOpen(false);
    setNewS({ name: "", bank: "HDFC Bank", product: "Personal Loan", type: "Percentage", rate: "1.50%", status: "active" });
    onNotify(`Scheme "${newS.name}" created.`);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheme) return;
    setSchemes(schemes.map(s => s.id === editingScheme.id ? editingScheme : s));
    setEditingScheme(null);
    onNotify(`Scheme "${editingScheme.name}" updated.`);
  };

  const handleDelete = (id: number) => {
    setSchemes(schemes.filter(s => s.id !== id));
    onNotify("Scheme removed.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400">Bank-wise commission schemes, flat rates and performance slabs</span>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Create Scheme
        </button>
      </div>
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Scheme Name</th>
              <th className="px-4 py-3">Bank</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Payout Type</th>
              <th className="px-4 py-3 text-right">Commission Rate</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {schemes.map(s => (
              <tr key={s.id} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{s.name}</td>
                <td className="px-4 py-3 text-slate-300">{s.bank}</td>
                <td className="px-4 py-3 text-slate-400">{s.product}</td>
                <td className="px-4 py-3 text-slate-300">{s.type}</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-400">{s.rate}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">{s.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditingScheme({ ...s })} className="text-blue-400 hover:text-blue-300 cursor-pointer">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-rose-400 hover:text-rose-300 cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Create New Scheme</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Scheme Title</label>
                <input required placeholder="e.g. Axis Mega Home Loan Fest" value={newS.name} onChange={e => setNewS({ ...newS, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Lender Bank</label>
                  <input placeholder="HDFC Bank" value={newS.bank} onChange={e => setNewS({ ...newS, bank: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Product</label>
                  <input placeholder="Personal Loan" value={newS.product} onChange={e => setNewS({ ...newS, product: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Payout Type</label>
                  <select value={newS.type} onChange={e => setNewS({ ...newS, type: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                    <option>Percentage</option>
                    <option>Slab</option>
                    <option>Flat Fee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Commission Rate</label>
                  <input placeholder="e.g. 1.75%" value={newS.rate} onChange={e => setNewS({ ...newS, rate: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Scheme</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingScheme && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Edit Scheme: {editingScheme.name}</h3>
              <button onClick={() => setEditingScheme(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Scheme Title</label>
                <input required value={editingScheme.name} onChange={e => setEditingScheme({ ...editingScheme, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Lender Bank</label>
                  <input value={editingScheme.bank} onChange={e => setEditingScheme({ ...editingScheme, bank: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Product</label>
                  <input value={editingScheme.product} onChange={e => setEditingScheme({ ...editingScheme, product: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Payout Type</label>
                  <input value={editingScheme.type} onChange={e => setEditingScheme({ ...editingScheme, type: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Commission Rate</label>
                  <input value={editingScheme.rate} onChange={e => setEditingScheme({ ...editingScheme, rate: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingScheme(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Update Scheme</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 9. PAYOUT STRUCTURE MODULE
// ============================================================================
export function PayoutStructureModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [grid, setGrid] = useState([
    { product: "Personal Loan (Unsecured)", connector: 0.8, sales_agent: 0.3, manager: 0.1, retention: 0.3 },
    { product: "Business Loan", connector: 1.0, sales_agent: 0.4, manager: 0.15, retention: 0.45 },
    { product: "Home Loan & LAP", connector: 0.3, sales_agent: 0.15, manager: 0.05, retention: 0.15 },
    { product: "Used Car Loan", connector: 1.2, sales_agent: 0.5, manager: 0.2, retention: 0.6 }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRow, setNewRow] = useState({ product: "", connector: 0.8, sales_agent: 0.3, manager: 0.1, retention: 0.3 });

  useEffect(() => {
    const saved = localStorage.getItem("gn_payout_matrix");
    if (saved) {
      try { setGrid(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("gn_payout_matrix", JSON.stringify(grid));
    onNotify("Payout Grid saved and synced across system.");
  };

  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.product) return;
    const updated = [...grid, newRow];
    setGrid(updated);
    localStorage.setItem("gn_payout_matrix", JSON.stringify(updated));
    setModalOpen(false);
    setNewRow({ product: "", connector: 0.8, sales_agent: 0.3, manager: 0.1, retention: 0.3 });
    onNotify(`Added ${newRow.product} to payout matrix.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400">Configure role-based payout allocation matrix across loan products</span>
        <div className="flex gap-2">
          <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-slate-200 text-xs font-semibold hover:text-white flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Category
          </button>
          <button onClick={handleSave} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer">
            Save Payout Matrix
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Product Category</th>
              <th className="px-4 py-3 text-right">Connector Payout %</th>
              <th className="px-4 py-3 text-right">Sales Agent %</th>
              <th className="px-4 py-3 text-right">Team Lead %</th>
              <th className="px-4 py-3 text-right">Company Retention %</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {grid.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{row.product}</td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    step="0.05"
                    value={row.connector}
                    onChange={(e) => {
                      const next = [...grid];
                      next[idx].connector = Number(e.target.value);
                      setGrid(next);
                    }}
                    className="w-16 px-2 py-1 bg-[#0c1220] border border-[#1e293b] rounded text-right font-mono text-emerald-400"
                  />%
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    step="0.05"
                    value={row.sales_agent}
                    onChange={(e) => {
                      const next = [...grid];
                      next[idx].sales_agent = Number(e.target.value);
                      setGrid(next);
                    }}
                    className="w-16 px-2 py-1 bg-[#0c1220] border border-[#1e293b] rounded text-right font-mono text-slate-200"
                  />%
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    step="0.05"
                    value={row.manager}
                    onChange={(e) => {
                      const next = [...grid];
                      next[idx].manager = Number(e.target.value);
                      setGrid(next);
                    }}
                    className="w-16 px-2 py-1 bg-[#0c1220] border border-[#1e293b] rounded text-right font-mono text-slate-200"
                  />%
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    step="0.05"
                    value={row.retention}
                    onChange={(e) => {
                      const next = [...grid];
                      next[idx].retention = Number(e.target.value);
                      setGrid(next);
                    }}
                    className="w-16 px-2 py-1 bg-[#0c1220] border border-[#1e293b] rounded text-right font-mono text-cyan-400 font-bold"
                  />%
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setGrid(grid.filter((_, i) => i !== idx)); onNotify("Row removed."); }} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
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
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Category to Payout Matrix</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddRow} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Category</label>
                <input required placeholder="e.g. Gold Loan" value={newRow.product} onChange={e => setNewRow({ ...newRow, product: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Connector %</label>
                  <input type="number" step="0.05" value={newRow.connector} onChange={e => setNewRow({ ...newRow, connector: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Sales Agent %</label>
                  <input type="number" step="0.05" value={newRow.sales_agent} onChange={e => setNewRow({ ...newRow, sales_agent: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Team Lead %</label>
                  <input type="number" step="0.05" value={newRow.manager} onChange={e => setNewRow({ ...newRow, manager: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Company Retention %</label>
                  <input type="number" step="0.05" value={newRow.retention} onChange={e => setNewRow({ ...newRow, retention: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Add Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 10. CUSTOMER PROFILE MODULE
// ============================================================================
export function CustomerProfileModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [profiles, setProfiles] = useState([
    { id: 1, name: "Salaried — MNC / Cat-A", min_salary: "₹50,000/mo", roi_range: "10.25% - 11.50%", docs: "3M Salary Slip + 6M Banking" },
    { id: 2, name: "Salaried — Govt / PSU", min_salary: "₹35,000/mo", roi_range: "10.00% - 10.75%", docs: "Form 16 + ID Card" },
    { id: 3, name: "Self Employed Professional (Doctor/CA)", min_salary: "₹10,00,000/yr", roi_range: "11.00% - 12.50%", docs: "Degree + 2Y ITR" },
    { id: 4, name: "Self Employed Non-Professional (MSME)", min_salary: "₹25,00,000 turnover", roi_range: "12.50% - 16.00%", docs: "GST 1Y + 3Y ITR Audit" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any | null>(null);
  const [newProfile, setNewProfile] = useState({ name: "", min_salary: "", roi_range: "", docs: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfile.name) return;
    setProfiles([{ ...newProfile, id: Date.now() }, ...profiles]);
    setModalOpen(false);
    setNewProfile({ name: "", min_salary: "", roi_range: "", docs: "" });
    onNotify(`Customer Profile "${newProfile.name}" added.`);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    setProfiles(profiles.map(p => p.id === editingProfile.id ? editingProfile : p));
    setEditingProfile(null);
    onNotify(`Profile "${editingProfile.name}" updated.`);
  };

  const handleDelete = (id: number) => {
    setProfiles(profiles.filter(p => p.id !== id));
    onNotify("Profile removed.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400">Customer profile classifications used on schemes and loan underwriting rules</span>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Profile
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {profiles.map(p => (
          <div key={p.id} className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-2 relative group">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{p.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400">{p.roi_range}</span>
                <button onClick={() => setEditingProfile({ ...p })} className="text-blue-400 hover:text-blue-300 p-1 cursor-pointer">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="text-xs text-slate-300">Minimum Baseline: <strong className="text-white">{p.min_salary}</strong></div>
            <div className="text-[11px] text-slate-400">Standard Checklist: {p.docs}</div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Customer Profile</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Profile Classification Name</label>
                <input required placeholder="e.g. Salaried — Tech / IT Sector" value={newProfile.name} onChange={e => setNewProfile({ ...newProfile, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Minimum Income / Turnover</label>
                  <input required placeholder="e.g. ₹40,000/mo" value={newProfile.min_salary} onChange={e => setNewProfile({ ...newProfile, min_salary: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Benchmark ROI Range</label>
                  <input required placeholder="e.g. 10.50% - 11.75%" value={newProfile.roi_range} onChange={e => setNewProfile({ ...newProfile, roi_range: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Required Documentation Checklist</label>
                <input placeholder="e.g. 3M Salary Slip + 6M Bank Statement + PAN" value={newProfile.docs} onChange={e => setNewProfile({ ...newProfile, docs: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Edit Profile: {editingProfile.name}</h3>
              <button onClick={() => setEditingProfile(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Profile Classification Name</label>
                <input required value={editingProfile.name} onChange={e => setEditingProfile({ ...editingProfile, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Minimum Income / Turnover</label>
                  <input required value={editingProfile.min_salary} onChange={e => setEditingProfile({ ...editingProfile, min_salary: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Benchmark ROI Range</label>
                  <input required value={editingProfile.roi_range} onChange={e => setEditingProfile({ ...editingProfile, roi_range: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Required Documentation Checklist</label>
                <input value={editingProfile.docs} onChange={e => setEditingProfile({ ...editingProfile, docs: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingProfile(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 11. PIN CODE MODULE
// ============================================================================
export function PinCodeModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [pins, setPins] = useState([
    { pin: "400001", area: "Fort, Colaba", district: "Mumbai City", state: "Maharashtra", branch: "Fort Flagship", status: "Serviceable" },
    { pin: "400053", area: "Andheri West", district: "Mumbai Suburban", state: "Maharashtra", branch: "Andheri Hub", status: "Serviceable" },
    { pin: "110001", area: "Connaught Place", district: "New Delhi", state: "Delhi", branch: "Delhi Central", status: "Serviceable" },
    { pin: "560001", area: "MG Road, Bangalore", district: "Bangalore Urban", state: "Karnataka", branch: "Bangalore South", status: "Serviceable" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [newPin, setNewPin] = useState({ pin: "", area: "", district: "", state: "", branch: "Fort Flagship", status: "Serviceable" });
  const [pinSearch, setPinSearch] = useState("");

  const handleDownloadTemplate = () => {
    const content = "PIN Code,Area,District,State,Assigned Branch,Status\n400001,Fort Colaba,Mumbai City,Maharashtra,Fort Flagship,Serviceable\n110001,Connaught Place,New Delhi,Delhi,Delhi Central,Serviceable\n560001,MG Road,Bangalore Urban,Karnataka,Bangalore South,Serviceable";
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pincodes_serviceability_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    onNotify("CSV template downloaded.");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.pin) return;
    setPins([newPin, ...pins]);
    setModalOpen(false);
    setNewPin({ pin: "", area: "", district: "", state: "", branch: "Fort Flagship", status: "Serviceable" });
    onNotify(`Pin Code ${newPin.pin} added to serviceability matrix.`);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    const lines = csvText.trim().split("\n");
    const parsed: any[] = [];
    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes("pin")) return; // skip header
      const parts = line.split(",").map(p => p.trim().replace(/^"|"$/g, ""));
      if (parts[0]) {
        parsed.push({
          pin: parts[0] || "",
          area: parts[1] || "Regional",
          district: parts[2] || "District",
          state: parts[3] || "State",
          branch: parts[4] || "Head Office",
          status: parts[5] || "Serviceable"
        });
      }
    });
    if (parsed.length > 0) {
      setPins([...parsed, ...pins]);
      onNotify(`Imported ${parsed.length} pin codes from CSV.`);
    }
    setUploadModalOpen(false);
    setCsvText("");
  };

  const filtered = pinSearch
    ? pins.filter(p => p.pin.includes(pinSearch) || p.area.toLowerCase().includes(pinSearch.toLowerCase()) || p.district.toLowerCase().includes(pinSearch.toLowerCase()))
    : pins;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400"><strong>{pins.length}</strong> serviceable pincodes configured</span>
          <input
            type="text"
            placeholder="Search pin / area..."
            value={pinSearch}
            onChange={e => setPinSearch(e.target.value)}
            className="px-2.5 py-1 bg-[#111827] border border-[#1e293b] rounded-lg text-xs text-white"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownloadTemplate} className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-slate-300 text-xs font-semibold hover:text-white cursor-pointer">
            Download Template
          </button>
          <button onClick={() => setUploadModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <Upload size={13} /> Upload CSV
          </button>
          <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Pincode
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">PIN Code</th>
              <th className="px-4 py-3">Area / Post Office</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Assigned Branch</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {filtered.map((p, idx) => (
              <tr key={idx} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-cyan-400">{p.pin}</td>
                <td className="px-4 py-3 text-white font-medium">{p.area}</td>
                <td className="px-4 py-3 text-slate-300">{p.district}</td>
                <td className="px-4 py-3 text-slate-400">{p.state}</td>
                <td className="px-4 py-3 text-slate-300">{p.branch}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{p.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setPins(pins.filter((_, i) => i !== idx)); onNotify("Pin code removed."); }} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
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
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Serviceable Pincode</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">6-Digit PIN Code</label>
                  <input required placeholder="e.g. 400001" value={newPin.pin} onChange={e => setNewPin({ ...newPin, pin: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Area / Location</label>
                  <input required placeholder="e.g. Bandra Kurla Complex" value={newPin.area} onChange={e => setNewPin({ ...newPin, area: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">District</label>
                  <input required placeholder="e.g. Mumbai Suburban" value={newPin.district} onChange={e => setNewPin({ ...newPin, district: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">State</label>
                  <input required placeholder="e.g. Maharashtra" value={newPin.state} onChange={e => setNewPin({ ...newPin, state: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Assigned Branch Hub</label>
                <input placeholder="e.g. Fort Flagship" value={newPin.branch} onChange={e => setNewPin({ ...newPin, branch: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Pincode</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Bulk Upload Pincodes (CSV Text)</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <p className="text-slate-400">Paste comma-separated rows below (PIN, Area, District, State, Branch):</p>
              <textarea
                rows={6}
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                placeholder={"400001, Fort Colaba, Mumbai City, Maharashtra, Fort Flagship\n400050, Bandra West, Mumbai Suburban, Maharashtra, Andheri Hub"}
                className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono text-[11px]"
              />
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setUploadModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer">Import Rows</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 12. TEAM TARGET MODULE
// ============================================================================
export function TeamTargetModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [targets, setTargets] = useState([
    { id: 1, member: "Vivek (You)", role: "Director / Admin", logins: 25, disbursement: "₹2,50,00,000", achieved: "₹1,85,00,000" },
    { id: 2, member: "Anil Deshmukh", role: "Sales Executive", logins: 15, disbursement: "₹75,00,000", achieved: "₹62,00,000" },
    { id: 3, member: "Neha Gupta", role: "Telecaller", logins: 30, disbursement: "₹50,00,000", achieved: "₹48,50,000" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTarget, setNewTarget] = useState({ member: "", role: "Sales Executive", logins: 15, disbursement: "₹50,00,000", achieved: "₹0" });

  useEffect(() => {
    const saved = localStorage.getItem("gn_team_targets");
    if (saved) {
      try { setTargets(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("gn_team_targets", JSON.stringify(targets));
    onNotify("Team targets updated for October 2026.");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget.member) return;
    const updated = [...targets, { ...newTarget, id: Date.now() }];
    setTargets(updated);
    localStorage.setItem("gn_team_targets", JSON.stringify(updated));
    setModalOpen(false);
    setNewTarget({ member: "", role: "Sales Executive", logins: 15, disbursement: "₹50,00,000", achieved: "₹0" });
    onNotify(`Target set for ${newTarget.member}.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400">Monthly targets per salesperson — logins, loan volume & disbursement</span>
        <div className="flex gap-2">
          <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-slate-200 text-xs font-semibold hover:text-white flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Target
          </button>
          <button onClick={handleSave} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer">
            Save Targets
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0c1220] text-slate-400 font-semibold border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3">Team Member</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Logins Target</th>
              <th className="px-4 py-3 text-right">Disbursement Goal</th>
              <th className="px-4 py-3 text-right">Achieved MTD</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {targets.map((t, i) => (
              <tr key={t.id || i} className="hover:bg-[#162033]/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{t.member}</td>
                <td className="px-4 py-3 text-slate-400">{t.role}</td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    value={t.logins}
                    onChange={e => {
                      const next = [...targets];
                      next[i].logins = Number(e.target.value);
                      setTargets(next);
                    }}
                    className="w-16 px-2 py-1 bg-[#0c1220] border border-[#1e293b] rounded text-right font-mono text-slate-200"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    value={t.disbursement}
                    onChange={e => {
                      const next = [...targets];
                      next[i].disbursement = e.target.value;
                      setTargets(next);
                    }}
                    className="w-28 px-2 py-1 bg-[#0c1220] border border-[#1e293b] rounded text-right font-mono font-bold text-cyan-400"
                  />
                </td>
                <td className="px-4 py-3 text-right font-mono text-emerald-400 font-bold">{t.achieved}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setTargets(targets.filter((_, idx) => idx !== i)); onNotify("Target removed."); }} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
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
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Team Target</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Employee Name</label>
                <input required placeholder="e.g. Ramesh Kadam" value={newTarget.member} onChange={e => setNewTarget({ ...newTarget, member: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Role / Designation</label>
                <input placeholder="e.g. Senior Loan Officer" value={newTarget.role} onChange={e => setNewTarget({ ...newTarget, role: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Monthly Logins</label>
                  <input type="number" value={newTarget.logins} onChange={e => setNewTarget({ ...newTarget, logins: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Disbursement Goal</label>
                  <input placeholder="₹75,00,000" value={newTarget.disbursement} onChange={e => setNewTarget({ ...newTarget, disbursement: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Target</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
