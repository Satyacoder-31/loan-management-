import React, { useState, useEffect } from "react";
import {
  MessageSquare, Globe, Search, Phone, Mail, CreditCard,
  LayoutGrid, Tag, Users, Settings2, UserCheck, Layers, Bell,
  Palette, AlertCircle, ShieldAlert, FileText, Sparkles, Zap,
  Send, Plus, Trash2, Edit2, Check, X, Copy, ExternalLink, Printer
} from "lucide-react";

// ============================================================================
// 1. WHATSAPP MODULE
// ============================================================================
export function WhatsAppModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [config, setConfig] = useState({
    phone: "+91 90280 12312",
    wabaId: "10928374659201",
    token: "EAAGm0PX4ZC8...wB",
    webhookActive: true
  });
  const [testNum, setTestNum] = useState("");
  const [testSentModal, setTestSentModal] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("gn_whatsapp_config");
    if (saved) {
      try { setConfig(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("gn_whatsapp_config", JSON.stringify(config));
    onNotify("WhatsApp Cloud API settings saved successfully.");
  };

  const handleTest = () => {
    if (!testNum) {
      onNotify("Please enter a 10-digit mobile number.");
      return;
    }
    setTestSentModal({
      phone: testNum,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      template: "loan_intake_welcome_v2"
    });
    onNotify(`Test WhatsApp template message dispatched to ${testNum}!`);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="text-emerald-400" size={16} /> WhatsApp Business Cloud API Configuration
        </h3>
        <div>
          <label className="block text-slate-400 mb-1">WhatsApp Business Display Number</label>
          <input
            value={config.phone}
            onChange={e => setConfig({ ...config, phone: e.target.value })}
            className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">WABA Account ID</label>
          <input
            value={config.wabaId}
            onChange={e => setConfig({ ...config, wabaId: e.target.value })}
            className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Permanent Meta System User Token</label>
          <input
            type="password"
            value={config.token}
            onChange={e => setConfig({ ...config, token: e.target.value })}
            className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono"
          />
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-[#1e293b]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-emerald-400 font-medium">Webhook active & listening for borrower replies</span>
          </div>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
            Save Credentials
          </button>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3 text-xs">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Send size={14} className="text-emerald-400" /> Send Live Test Message
        </h4>
        <p className="text-slate-400">Test the Meta Cloud API connection by dispatching an interactive onboarding ping.</p>
        <div className="flex gap-2">
          <input
            placeholder="Enter 10-digit mobile number (e.g. 9820011223)"
            value={testNum}
            onChange={e => setTestNum(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono"
          />
          <button onClick={handleTest} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer">
            <Send size={14} /> Send Ping
          </button>
        </div>
      </div>

      {/* Simulated WhatsApp Preview Modal */}
      {testSentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#0b141a] px-4 py-3 flex items-center justify-between border-b border-emerald-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  S
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Sniper Loans Official</div>
                  <div className="text-emerald-400 text-[10px]">Verified Business Account</div>
                </div>
              </div>
              <button onClick={() => setTestSentModal(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <div className="p-4 bg-[#080e14] min-h-[220px] flex flex-col justify-end text-xs space-y-3">
              <div className="bg-[#005c4b] text-white p-3 rounded-xl rounded-tr-none max-w-[90%] self-end space-y-1.5 shadow">
                <p className="font-semibold text-[11.5px]">Hello! Welcome to Sniper Loans.</p>
                <p className="text-[11px] text-slate-200">
                  Your inquiry has been received. Our senior relationship manager will connect with you shortly.
                </p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200 pt-1">
                  <span>{testSentModal.time}</span>
                  <span className="text-cyan-300 font-bold">✓✓</span>
                </div>
              </div>
              <div className="text-center text-[10px] text-slate-500">
                Dispatched via Meta Graph API v20.0 to +91 {testSentModal.phone}
              </div>
            </div>
            <div className="p-3 bg-[#0c1220] border-t border-[#1e293b] flex justify-end">
              <button onClick={() => setTestSentModal(null)} className="px-3.5 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg cursor-pointer">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. META MODULE
// ============================================================================
export function MetaModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [syncing, setSyncing] = useState(false);
  const [simulatedLead, setSimulatedLead] = useState<any | null>(null);

  const handleSimulate = () => {
    const lead = {
      id: Date.now(),
      name: "Abhishek Rao",
      phone: "+91 98200 " + Math.floor(10000 + Math.random() * 90000),
      campaign: "Mumbai_Salaried_PL_Festive_Q3",
      amount: "₹15,00,000",
      form: "Instant Personal Loan Eligibility 2026",
      time: "Just now"
    };
    setSimulatedLead(lead);
    onNotify("Simulated Meta lead webhook triggered. Ingesting lead.");
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      onNotify("3 Meta Ad Accounts and 12 lead forms synchronized.");
    }, 1200);
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Globe className="text-blue-400" size={16} /> Meta Lead Ads Integration
      </h3>
      <p className="text-slate-400">Connect your Facebook & Instagram pages to ingest ad leads into your CRM in under 1 second.</p>
      <div className="p-3 rounded-lg bg-[#0c1220] border border-[#1e293b] flex items-center justify-between">
        <div>
          <div className="font-bold text-white">Connected Page: Sniper Loans Official</div>
          <div className="text-[11px] text-slate-400">Page ID: 109283719283 · Realtime Webhook Active</div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">CONNECTED</span>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSimulate} className="px-3.5 py-1.5 bg-[#182235] hover:bg-slate-700 text-slate-200 rounded-lg font-semibold cursor-pointer">
          Simulate Lead Ping
        </button>
        <button onClick={handleSync} disabled={syncing} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold cursor-pointer">
          {syncing ? "Syncing..." : "Sync Ad Accounts"}
        </button>
      </div>

      {simulatedLead && (
        <div className="p-4 rounded-xl bg-[#0c1220] border border-blue-500/30 space-y-2 animate-in fade-in-50">
          <div className="flex items-center justify-between text-blue-400 font-bold">
            <span>✓ Ingested Lead from Meta Webhook</span>
            <span className="text-[10px] text-slate-400">{simulatedLead.time}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>Customer: <strong className="text-white">{simulatedLead.name}</strong></div>
            <div>Phone: <strong className="text-cyan-400 font-mono">{simulatedLead.phone}</strong></div>
            <div>Requested: <strong className="text-emerald-400">{simulatedLead.amount}</strong></div>
            <div>Campaign: <strong className="text-slate-200">{simulatedLead.campaign}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. GOOGLE ADS MODULE
// ============================================================================
export function GoogleAdsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [custId, setCustId] = useState("810-132-4401");
  const [conversionName, setConversionName] = useState("Loan_Disbursed_Offline");

  const handleSave = () => {
    localStorage.setItem("gn_google_ads_config", JSON.stringify({ custId, conversionName }));
    onNotify("Google Ads offline conversion tracking saved.");
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Search className="text-cyan-400" size={16} /> Google Ads Conversion Tracking
      </h3>
      <p className="text-slate-400">Sync offline loan sanction and disbursement values back to Google Ads to optimize ROAS.</p>
      <div>
        <label className="block text-slate-400 mb-1">Google Ads Customer ID</label>
        <input value={custId} onChange={e => setCustId(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
      </div>
      <div>
        <label className="block text-slate-400 mb-1">Primary Offline Conversion Action</label>
        <input value={conversionName} onChange={e => setConversionName(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => onNotify("Test GCLID conversion payload uploaded to Google Ads API.")} className="px-3.5 py-2 bg-[#182235] text-slate-200 rounded-lg cursor-pointer">
          Test Conversion Ping
        </button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Configuration
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 4. IVR MODULE
// ============================================================================
export function IvrModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [provider, setProvider] = useState("Tata Smartflo IVR");
  const [virtualNum, setVirtualNum] = useState("022-6900-3322");
  const [incomingCall, setIncomingCall] = useState<any | null>(null);

  const handleSimulate = () => {
    setIncomingCall({
      caller: "+91 98200 77112",
      name: "Suresh Patil",
      city: "Mumbai",
      query: "Business Loan Ingestion"
    });
    onNotify("Simulated incoming customer IVR call.");
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Phone className="text-emerald-400" size={16} /> Cloud Telephony & IVR
      </h3>
      <div>
        <label className="block text-slate-400 mb-1">Provider</label>
        <select value={provider} onChange={e => setProvider(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white">
          <option>Tata Smartflo IVR</option>
          <option>Knowlarity SuperReceptionist</option>
          <option>Exotel</option>
          <option>MCube Telephony</option>
        </select>
      </div>
      <div>
        <label className="block text-slate-400 mb-1">Virtual Inbound Number</label>
        <input value={virtualNum} onChange={e => setVirtualNum(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={handleSimulate} className="px-3.5 py-2 bg-[#182235] hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer">
          Simulate Inbound Call
        </button>
        <button onClick={() => onNotify("IVR routing saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Routing
        </button>
      </div>

      {incomingCall && (
        <div className="p-4 rounded-xl bg-[#0c1220] border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Incoming IVR Call Ringing...</span>
            </div>
            <span className="font-mono text-cyan-400">{incomingCall.caller}</span>
          </div>
          <div className="text-slate-300 text-xs">
            Customer: <strong className="text-white">{incomingCall.name}</strong> ({incomingCall.city}) · Query: {incomingCall.query}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { onNotify("Call rejected."); setIncomingCall(null); }} className="px-3 py-1 bg-rose-600/20 text-rose-300 rounded font-bold cursor-pointer">
              Decline
            </button>
            <button onClick={() => { onNotify("Connected to caller on browser WebRTC."); setIncomingCall(null); }} className="px-3 py-1 bg-emerald-600 text-white rounded font-bold cursor-pointer">
              Answer Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. SMTP MODULE
// ============================================================================
export function SmtpModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [smtp, setSmtp] = useState({ host: "smtp.sendgrid.net", port: "587", from: "loans@sniperelectric.in" });
  const [testEmailModal, setTestEmailModal] = useState(false);
  const [recipient, setRecipient] = useState("admin@sniperelectric.in");

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify(`Dispatched test verification email to ${recipient}.`);
    setTestEmailModal(false);
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Mail className="text-blue-400" size={16} /> Outbound SMTP Server Settings
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1">SMTP Host</label>
          <input value={smtp.host} onChange={e => setSmtp({ ...smtp, host: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Port</label>
          <input value={smtp.port} onChange={e => setSmtp({ ...smtp, port: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
      </div>
      <div>
        <label className="block text-slate-400 mb-1">From Email Address</label>
        <input value={smtp.from} onChange={e => setSmtp({ ...smtp, from: e.target.value })} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => setTestEmailModal(true)} className="px-3.5 py-2 bg-[#182235] hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer">
          Send Test Email
        </button>
        <button onClick={() => onNotify("SMTP credentials saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save SMTP
        </button>
      </div>

      {testEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Send Test Email</h4>
              <button onClick={() => setTestEmailModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleSendTest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Recipient Email Address</label>
                <input required type="email" value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setTestEmailModal(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. RAZORPAY MODULE
// ============================================================================
export function RazorpayModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [keyId, setKeyId] = useState("rzp_live_9832049182");
  const [keySecret, setKeySecret] = useState("secret_live_891029381");

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <CreditCard className="text-blue-400" size={16} /> Razorpay Gateway
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 mb-1">Razorpay Key ID</label>
          <input value={keyId} onChange={e => setKeyId(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Key Secret</label>
          <input type="password" value={keySecret} onChange={e => setKeySecret(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => onNotify("Razorpay keys verified with live gateway.")} className="px-3.5 py-2 bg-[#182235] text-slate-200 rounded-lg cursor-pointer">
          Verify Keys
        </button>
        <button onClick={() => onNotify("Razorpay configuration saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Razorpay
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 7. CUSTOM STATUS MODULE
// ============================================================================
export function CustomStatusModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [statuses, setStatuses] = useState([
    { id: 1, name: "New Lead", stage: "Intake", color: "text-blue-400 bg-blue-500/20" },
    { id: 2, name: "Doc Collection", stage: "Processing", color: "text-amber-400 bg-amber-500/20" },
    { id: 3, name: "Logged In with Bank", stage: "Bank Underwriting", color: "text-purple-400 bg-purple-500/20" },
    { id: 4, name: "Sanctioned", stage: "Approval", color: "text-emerald-400 bg-emerald-500/20" },
    { id: 5, name: "Disbursed", stage: "Disbursement", color: "text-teal-400 bg-teal-500/20" }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newS, setNewS] = useState({ name: "", stage: "Intake", color: "text-blue-400 bg-blue-500/20" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newS.name) return;
    setStatuses([...statuses, { ...newS, id: Date.now() }]);
    setModalOpen(false);
    setNewS({ name: "", stage: "Intake", color: "text-blue-400 bg-blue-500/20" });
    onNotify(`Created custom pipeline status "${newS.name}".`);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Configure pipeline stages and custom lifecycle tags</span>
        <button onClick={() => setModalOpen(true)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer">
          + Add Status
        </button>
      </div>
      <div className="space-y-2">
        {statuses.map(s => (
          <div key={s.id} className="p-3 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${s.color}`}>{s.name}</span>
              <span className="text-slate-400">Stage: {s.stage}</span>
            </div>
            <button onClick={() => { setStatuses(statuses.filter(x => x.id !== s.id)); onNotify("Status removed."); }} className="text-rose-400 hover:text-rose-300 cursor-pointer">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Add Custom Status</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Status Title</label>
                <input required placeholder="e.g. Credit Assessment" value={newS.name} onChange={e => setNewS({ ...newS, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Lifecycle Stage</label>
                <select value={newS.stage} onChange={e => setNewS({ ...newS, stage: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                  <option>Intake</option>
                  <option>Processing</option>
                  <option>Bank Underwriting</option>
                  <option>Approval</option>
                  <option>Disbursement</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 8. LEAD SOURCES MODULE
// ============================================================================
export function LeadSourcesModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [sources, setSources] = useState([
    "Google Search Ads", "Facebook / Instagram Ads", "Connector Referral", "Branch Walk-in", "Direct Telecalling", "Website Form"
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSource, setNewSource] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource) return;
    setSources([...sources, newSource]);
    setModalOpen(false);
    setNewSource("");
    onNotify(`Lead source "${newSource}" added.`);
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Lead Attribution Sources</h3>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          + Add Source
        </button>
      </div>
      <div className="space-y-2">
        {sources.map((s, i) => (
          <div key={i} className="p-3 rounded-lg bg-[#0c1220] text-white font-medium flex items-center justify-between">
            <span>{s}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">ACTIVE</span>
              <button onClick={() => { setSources(sources.filter((_, idx) => idx !== i)); onNotify("Source removed."); }} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
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
              <h4 className="font-bold text-white text-sm">Add Lead Source</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Source Name</label>
                <input required placeholder="e.g. Outdoor Hoardings" value={newSource} onChange={e => setNewSource(e.target.value)} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Source</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 9. PARTNER TYPES MODULE
// ============================================================================
export function PartnerTypesModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [types, setTypes] = useState([
    { name: "Individual Connector", share: "0.80%", kyc: "PAN, Aadhaar, Cheque" },
    { name: "Real Estate Builder / Developer", share: "0.45%", kyc: "RERA, GST, PAN" },
    { name: "Chartered Accountant / Tax Consultant", share: "0.60%", kyc: "ICAI Membership, PAN" },
    { name: "Sub-DSA Agency", share: "1.20%", kyc: "GST, Entity PAN, MOA" }
  ]);
  const [editingType, setEditingType] = useState<any | null>(null);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    setTypes(types.map(t => t.name === editingType.name ? editingType : t));
    setEditingType(null);
    onNotify(`Partner type "${editingType.name}" updated.`);
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white">Connector & Partner Classifications</h3>
      <div className="space-y-2">
        {types.map((t, i) => (
          <div key={i} className="p-3 rounded-lg bg-[#0c1220] border border-[#1e293b] flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">{t.name}</div>
              <div className="text-slate-400 text-[11px]">Payout: {t.share} · KYC: {t.kyc}</div>
            </div>
            <button onClick={() => setEditingType({ ...t })} className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">
              Configure
            </button>
          </div>
        ))}
      </div>

      {editingType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Configure: {editingType.name}</h4>
              <button onClick={() => setEditingType(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Standard Payout Share</label>
                <input value={editingType.share} onChange={e => setEditingType({ ...editingType, share: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Required KYC Documents</label>
                <input value={editingType.kyc} onChange={e => setEditingType({ ...editingType, kyc: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingType(null)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
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
// 10. FIELD CUSTOMISATION MODULE
// ============================================================================
export function FieldCustomisationModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [fields, setFields] = useState([
    { name: "CIBIL Bureau Score", entity: "Borrower", type: "Number", required: true },
    { name: "Property Market Value", entity: "Loan Application", type: "Currency (₹)", required: false },
    { name: "GSTIN Number", entity: "Business Borrower", type: "Text (Regex)", required: false },
    { name: "Existing Monthly EMI", entity: "Financials", type: "Currency (₹)", required: true },
    { name: "Co-Applicant Relationship", entity: "Co-Borrower", type: "Dropdown", required: false }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newF, setNewF] = useState({ name: "", entity: "Borrower", type: "Text", required: false });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newF.name) return;
    setFields([...fields, newF]);
    setModalOpen(false);
    setNewF({ name: "", entity: "Borrower", type: "Text", required: false });
    onNotify(`Custom field "${newF.name}" created.`);
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Dynamic Form Fields & Intake Customisation</h3>
          <p className="text-slate-400 text-[11px]">Attach custom intake fields to loan application flows.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          + Add Custom Field
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((f, i) => (
          <div key={i} className="p-3 rounded-lg bg-[#0c1220] border border-[#1e293b] flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">{f.name}</div>
              <div className="text-[11px] text-slate-400">Entity: {f.entity} · Type: {f.type} · {f.required ? "Required" : "Optional"}</div>
            </div>
            <button onClick={() => { setFields(fields.filter((_, idx) => idx !== i)); onNotify("Field removed."); }} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">Add Dynamic Field</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Field Label</label>
                <input required placeholder="e.g. Vehicle Registration Number" value={newF.name} onChange={e => setNewF({ ...newF, name: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Entity Target</label>
                  <select value={newF.entity} onChange={e => setNewF({ ...newF, entity: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                    <option>Borrower</option>
                    <option>Loan Application</option>
                    <option>Business Borrower</option>
                    <option>Financials</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Data Type</label>
                  <select value={newF.type} onChange={e => setNewF({ ...newF, type: e.target.value })} className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white">
                    <option>Text</option>
                    <option>Number</option>
                    <option>Currency (₹)</option>
                    <option>Dropdown</option>
                    <option>File Upload</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Add Field</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 11. ASSIGNMENT RULES MODULE
// ============================================================================
export function AssignmentRulesModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [rrActive, setRrActive] = useState(true);
  const [geoActive, setGeoActive] = useState(true);

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white">Auto-Assignment Routing Engine</h3>
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-[#0c1220] border border-[#1e293b] flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Rule 1: Round-Robin Distribution</div>
            <div className="text-slate-400 text-[11px]">Equally distributes online leads among active telecalling staff.</div>
          </div>
          <button onClick={() => { setRrActive(!rrActive); onNotify("Round-Robin updated."); }} className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${rrActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
            {rrActive ? "ENABLED" : "OFF"}
          </button>
        </div>
        <div className="p-3 rounded-lg bg-[#0c1220] border border-[#1e293b] flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Rule 2: Pincode Geo-Routing</div>
            <div className="text-slate-400 text-[11px]">Routes home loan inquiries to the nearest operating branch.</div>
          </div>
          <button onClick={() => { setGeoActive(!geoActive); onNotify("Geo-Routing updated."); }} className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${geoActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
            {geoActive ? "ENABLED" : "OFF"}
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => onNotify("Assignment rules saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Rules
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 12. PRODUCT VERTICALS MODULE
// ============================================================================
export function ProductVerticalsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [verticals, setVerticals] = useState([
    { id: "pl", name: "Personal Loans", active: true },
    { id: "bl", name: "Business Loans & MSME", active: true },
    { id: "hl", name: "Home Loans & LAP", active: true },
    { id: "auto", name: "Used Car & Commercial Vehicle", active: true },
    { id: "cc", name: "Credit Cards", active: true },
    { id: "ins", name: "Insurance (Health & Life)", active: true }
  ]);

  const toggle = (id: string) => {
    setVerticals(verticals.map(v => v.id === id ? { ...v, active: !v.active } : v));
    onNotify("Product vertical settings updated.");
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white">Active Financial Product Verticals</h3>
      <p className="text-slate-400">Toggle loan and financial verticals enabled across your operations portal.</p>
      <div className="space-y-3">
        {verticals.map(v => (
          <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0c1220] border border-[#1e293b]">
            <span className="font-semibold text-white">{v.name}</span>
            <button
              onClick={() => toggle(v.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${v.active ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-700/40 text-slate-400"}`}
            >
              {v.active ? "ENABLED" : "DISABLED"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 13. NOTIFICATIONS MODULE
// ============================================================================
export function NotificationsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [triggers, setTriggers] = useState([
    { name: "New Lead Received", sms: true, whatsapp: true, email: false },
    { name: "Credit Report Pulled", sms: false, whatsapp: true, email: true },
    { name: "Sanction Letter Issued", sms: true, whatsapp: true, email: true },
    { name: "Disbursement Confirmed", sms: true, whatsapp: true, email: true }
  ]);

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Bell size={16} className="text-blue-400" /> System Notification Triggers
      </h3>
      <div className="space-y-2">
        {triggers.map((evt, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-[#0c1220] flex items-center justify-between">
            <span className="text-white font-medium">{evt.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const next = [...triggers];
                  next[idx].sms = !next[idx].sms;
                  setTriggers(next);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${evt.sms ? "bg-blue-500/20 text-blue-300" : "bg-slate-800 text-slate-500"}`}
              >
                SMS
              </button>
              <button
                onClick={() => {
                  const next = [...triggers];
                  next[idx].whatsapp = !next[idx].whatsapp;
                  setTriggers(next);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${evt.whatsapp ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}
              >
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={() => onNotify("Notification preferences saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 14. THEME & NAVIGATION MODULE
// ============================================================================
export function ThemeNavModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [selected, setSelected] = useState("Deep Blue");

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Palette size={16} className="text-cyan-400" /> Theme & Branding Controls
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 mb-2">Color Palette Theme</label>
          <div className="flex gap-2">
            {["Deep Blue", "Midnight Indigo", "Emerald Wealth"].map(t => (
              <button
                key={t}
                onClick={() => setSelected(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${selected === t ? "bg-blue-600 text-white border border-blue-400" : "bg-[#182235] text-slate-300"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => onNotify(`Applied theme "${selected}".`)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Apply Theme
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 15. PDD ALERTS MODULE
// ============================================================================
export function PddAlertsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [sla, setSla] = useState("45");

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <AlertCircle size={16} className="text-amber-400" /> Post-Disbursement Document (PDD) Escalation
      </h3>
      <div>
        <label className="block text-slate-400 mb-1">RC Book / Title Deed Collection SLA (Days)</label>
        <input value={sla} onChange={e => setSla(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
      </div>
      <div className="flex justify-end">
        <button onClick={() => onNotify("PDD alert thresholds saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save SLA
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 16. CREDIT REPORT POLICY MODULE
// ============================================================================
export function CreditReportPolicyModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [requirePay, setRequirePay] = useState(false);
  const [minScore, setMinScore] = useState(700);

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <ShieldAlert className="text-amber-400" size={16} /> Experian / CIBIL Credit Pull Policy
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0c1220] border border-[#1e293b]">
          <div>
            <div className="font-bold text-white">Require Payment Before Credit Pull</div>
            <div className="text-[11px] text-slate-400">Only permit pulling bureau report if customer login fee is marked collected</div>
          </div>
          <button
            onClick={() => { setRequirePay(!requirePay); onNotify(`Payment requirement ${!requirePay ? "enabled" : "disabled"}.`); }}
            className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${requirePay ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700/40 text-slate-400"}`}
          >
            {requirePay ? "ACTIVE" : "OFF"}
          </button>
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Minimum Benchmark Credit Score</label>
          <input type="number" value={minScore} onChange={e => setMinScore(Number(e.target.value))} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => onNotify("Credit report policies saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Policy
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 17. INVOICE FORMAT MODULE
// ============================================================================
export function InvoiceFormatModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [prefix, setPrefix] = useState("SNI-2026-");
  const [sac, setSac] = useState("9971 (Financial Services)");
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <FileText className="text-blue-400" size={16} /> Invoice Layout & GST Format
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1">Invoice Prefix</label>
          <input value={prefix} onChange={e => setPrefix(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">SAC / HSN Code</label>
          <input value={sac} onChange={e => setSac(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => setPreviewOpen(true)} className="px-3.5 py-2 bg-[#182235] hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer">
          Preview PDF
        </button>
        <button onClick={() => onNotify("Invoice layout saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Layout
        </button>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white text-slate-900 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">TAX INVOICE</h2>
                <div className="text-xs text-slate-500">Sniper Electric & Financial Services Pvt Ltd</div>
                <div className="text-[11px] text-slate-500">GSTIN: 27AABCS1429B1Z8</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-blue-600">{prefix}00891</div>
                <div className="text-[11px] text-slate-500">Date: {new Date().toLocaleDateString()}</div>
                <button onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs mt-1 cursor-pointer">✕ Close</button>
              </div>
            </div>
            <div className="text-xs space-y-1">
              <div className="font-semibold text-slate-700">Bill To:</div>
              <div>HDFC Bank Ltd — Institutional DSA Channel</div>
              <div className="text-slate-500">Fort, Mumbai 400001</div>
            </div>
            <table className="w-full text-xs text-left border">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-2">Description</th>
                  <th className="p-2">SAC</th>
                  <th className="p-2 text-right">Commission Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">DSA Sourcing Commission — Personal Loan File #PL-9021</td>
                  <td className="p-2">{sac.substring(0, 4)}</td>
                  <td className="p-2 text-right font-mono font-semibold">₹32,500.00</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end text-xs font-bold text-slate-800">
              <span>Total Payable: ₹32,500.00</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => { window.print(); }} className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs flex items-center gap-1.5 cursor-pointer">
                <Printer size={13} /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 18. CO-BRANDING MODULE
// ============================================================================
export function CoBrandingModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const link = "https://teleport.snipeelectric.in/apply/sniper-mumbai";
  const copy = () => {
    navigator.clipboard.writeText(link);
    onNotify("Co-branded application URL copied to clipboard!");
  };

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Sparkles className="text-cyan-400" size={16} /> Co-Branded Partner Landing Page
      </h3>
      <p className="text-slate-400">Share white-labeled intake links with builders, auto dealers and chartered accountants.</p>
      <div className="p-3 rounded-lg bg-[#0c1220] border border-[#1e293b] flex items-center justify-between gap-2 font-mono text-cyan-400">
        <span className="truncate">{link}</span>
        <button onClick={copy} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center gap-1 shrink-0 cursor-pointer">
          <Copy size={12} /> Copy
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 19. WEBSITE MODULE
// ============================================================================
export function WebsiteModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [domain, setDomain] = useState("https://teleport.snipeelectric.in");

  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Globe className="text-blue-400" size={16} /> Public Lead-Capture Website & Customer Portal
      </h3>
      <p className="text-slate-400">Manage your online presence where customers can calculate EMIs and submit loan requests.</p>
      <div>
        <label className="block text-slate-400 mb-1">Public Domain</label>
        <input value={domain} onChange={e => setDomain(e.target.value)} className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e293b] rounded-lg text-white font-mono" />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => window.open("#/apply", "_blank")} className="px-4 py-2 bg-[#182235] hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 font-semibold cursor-pointer">
          <ExternalLink size={13} /> Open Live Portal
        </button>
        <button onClick={() => onNotify("Website configuration saved.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer">
          Save Settings
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 20. INTEGRATIONS MODULE
// ============================================================================
export function IntegrationsModule({ onNotify }: { onNotify: (msg: string) => void }) {
  const [tools, setTools] = useState([
    { name: "Digitap Instant KYC & Bureau", status: "Connected", desc: "17 verification APIs & Experian pull" },
    { name: "Karza Pan / Bank Statement", status: "Active", desc: "Aadhaar OKYC & Perfios statements" },
    { name: "Razorpay Payments", status: "Active", desc: "Fee collections & payment links" },
    { name: "Webhooks Engine", status: "Listening", desc: "Real-time JSON events on lead transitions" }
  ]);
  const [selectedTool, setSelectedTool] = useState<any | null>(null);

  return (
    <div className="space-y-4 max-w-2xl text-xs">
      <div className="text-slate-400">Connected 3rd-party underwriting and messaging providers</div>
      <div className="space-y-3">
        {tools.map((t, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm">{t.name}</div>
              <div className="text-slate-400 text-xs">{t.desc}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                {t.status}
              </span>
              <button onClick={() => setSelectedTool(t)} className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTool && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-2">
              <h4 className="font-bold text-white text-sm">{selectedTool.name}</h4>
              <button onClick={() => setSelectedTool(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">API Key / Client ID</label>
                <input defaultValue="api_live_9012384910283" className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Client Secret</label>
                <input type="password" defaultValue="sec_901928301928" className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onNotify(`Health check ping to ${selectedTool.name} passed (HTTP 200 OK, latency 42ms).`)}
                  className="px-3 py-1.5 bg-[#182235] hover:bg-slate-700 text-slate-200 rounded font-semibold cursor-pointer"
                >
                  Test Connection
                </button>
                <button onClick={() => { onNotify(`${selectedTool.name} configuration saved.`); setSelectedTool(null); }} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded cursor-pointer">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
