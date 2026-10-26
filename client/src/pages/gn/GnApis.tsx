import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Wallet,
  Search,
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  Download,
  Building2,
  Briefcase,
  Receipt,
  Car,
  ShieldCheck,
  Calendar,
  Layers,
  ExternalLink,
  X,
  FileText,
  Clock,
  Sparkles
} from "lucide-react";
import { fmtInr } from "../../lib/api";

interface ApiDefinition {
  id: string;
  name: string;
  category: "COMPANY" | "EMPLOYMENT" | "GST" | "VEHICLE";
  cost: number;
  inputPlaceholder: string;
  sampleInput: string;
  sampleResult: Record<string, any>;
}

interface ApiHitRecord {
  id: string;
  when: string;
  source: string;
  api: string;
  input: string;
  runBy: string;
  status: "Success" | "Failed" | "Refunded";
  cost: number;
  details: string;
  payload: Record<string, any>;
}

const APIS_DATA: ApiDefinition[] = [
  // COMPANY
  {
    id: "pan-cin",
    name: "PAN → CIN",
    category: "COMPANY",
    cost: 25.0,
    inputPlaceholder: "PAN — ABCDE1234F",
    sampleInput: "ABCDE1234F",
    sampleResult: {
      status: "SUCCESS",
      pan: "ABCDE1234F",
      cin: "U74999DL2015PTC284839",
      companyName: "Acme Power & Grid Solutions Pvt Ltd",
      companyClass: "Private",
      incorporationDate: "14/08/2015",
      rocCode: "ROC Delhi",
      authorizedCapital: "₹1,00,00,000",
      paidUpCapital: "₹50,00,000",
      companyStatus: "Active",
      registeredAddress: "Plot 42, Okhla Industrial Area Phase-III, New Delhi 110020"
    }
  },
  {
    id: "cin-pan",
    name: "CIN → PAN",
    category: "COMPANY",
    cost: 4.5,
    inputPlaceholder: "CIN — U74999DL2015PTC284839",
    sampleInput: "U74999DL2015PTC284839",
    sampleResult: {
      status: "SUCCESS",
      cin: "U74999DL2015PTC284839",
      pan: "ABCDE1234F",
      name: "Acme Power & Grid Solutions Pvt Ltd",
      panStatus: "Valid & Linked",
      panCategory: "Company"
    }
  },
  {
    id: "company-cin",
    name: "Company → CIN",
    category: "COMPANY",
    cost: 5.5,
    inputPlaceholder: "Company Name — Acme Pvt Ltd",
    sampleInput: "Acme Power & Grid Solutions Pvt Ltd",
    sampleResult: {
      status: "SUCCESS",
      query: "Acme Power & Grid Solutions Pvt Ltd",
      exactMatchCin: "U74999DL2015PTC284839",
      registeredName: "ACME POWER & GRID SOLUTIONS PRIVATE LIMITED",
      state: "Delhi",
      incorporationYear: "2015"
    }
  },
  {
    id: "pan-din",
    name: "PAN → DIN",
    category: "COMPANY",
    cost: 2.0,
    inputPlaceholder: "PAN — ABCDE1234F",
    sampleInput: "ABCDE1234F",
    sampleResult: {
      status: "SUCCESS",
      pan: "ABCDE1234F",
      directorName: "Omkar Patil",
      din: "08472910",
      dinStatus: "Approved & Active",
      directorshipsCount: 2,
      companies: [
        { cin: "U74999DL2015PTC284839", name: "Acme Power & Grid Solutions Pvt Ltd", role: "Managing Director" },
        { cin: "U29100MH2020PTC339102", name: "SunVolt EV Mobility Pvt Ltd", role: "Director" }
      ]
    }
  },
  {
    id: "din-pan",
    name: "DIN → PAN",
    category: "COMPANY",
    cost: 2.25,
    inputPlaceholder: "DIN — 01234567",
    sampleInput: "08472910",
    sampleResult: {
      status: "SUCCESS",
      din: "08472910",
      pan: "ABCDE1234F",
      name: "Omkar Patil",
      dob: "12/06/1984",
      nationality: "Indian"
    }
  },
  {
    id: "mobile-udyam",
    name: "Mobile → Udyam (MSME)",
    category: "COMPANY",
    cost: 12.0,
    inputPlaceholder: "Mobile — 9876543210",
    sampleInput: "9876543210",
    sampleResult: {
      status: "SUCCESS",
      mobile: "9876543210",
      udyamRegistrationNo: "UDYAM-DL-01-0019482",
      enterpriseName: "Acme Fabrication Works",
      classification: "Small Enterprise",
      majorActivity: "Manufacturing",
      dateOfCommencement: "01/04/2018",
      dicName: "DIC Central Delhi"
    }
  },

  // EMPLOYMENT
  {
    id: "uan-basic",
    name: "Employment (UAN Basic)",
    category: "EMPLOYMENT",
    cost: 6.75,
    inputPlaceholder: "UAN — 100123456789",
    sampleInput: "100123456789",
    sampleResult: {
      status: "SUCCESS",
      uan: "100123456789",
      employeeName: "Rajesh Kumar Sharma",
      currentEmployer: "Tata Motors Limited",
      dateOfJoining: "15/07/2021",
      employmentStatus: "Active",
      establishmentId: "MHBAN0012345000"
    }
  },
  {
    id: "uan-history",
    name: "Employment History (UAN)",
    category: "EMPLOYMENT",
    cost: 11.25,
    inputPlaceholder: "UAN — 100123456789",
    sampleInput: "100123456789",
    sampleResult: {
      status: "SUCCESS",
      uan: "100123456789",
      totalServiceMonths: 64,
      employersCount: 3,
      history: [
        { employer: "Tata Motors Limited", doj: "15/07/2021", doe: "Present", active: true },
        { employer: "Mahindra & Mahindra Ltd", doj: "01/03/2019", doe: "30/06/2021", active: false },
        { employer: "Bosch Chassis Systems", doj: "10/08/2016", doe: "15/02/2019", active: false }
      ]
    }
  },
  {
    id: "uan-pf",
    name: "Employment + PF (UAN)",
    category: "EMPLOYMENT",
    cost: 9.0,
    inputPlaceholder: "UAN — 100123456789",
    sampleInput: "100123456789",
    sampleResult: {
      status: "SUCCESS",
      uan: "100123456789",
      currentMemberId: "MHBAN0012345000004921",
      lastContributionMonth: "Sep 2026",
      employeeShareBalance: "₹2,84,310",
      employerShareBalance: "₹1,97,990",
      pensionBalance: "₹85,420",
      totalPfCorpus: "₹4,82,300",
      continuousContributions: 38
    }
  },

  // GST
  {
    id: "gst-verify",
    name: "GSTIN Verification",
    category: "GST",
    cost: 2.54,
    inputPlaceholder: "GSTIN — 22AAAAA0000A1Z5",
    sampleInput: "22AAAAA0000A1Z5",
    sampleResult: {
      status: "SUCCESS",
      gstin: "22AAAAA0000A1Z5",
      tradeName: "Acme Solar Solutions",
      legalName: "Acme Power & Grid Solutions Pvt Ltd",
      gstinStatus: "Active",
      taxpayerType: "Regular",
      registrationDate: "01/07/2017",
      principalPlaceOfBusiness: "Plot 42, Industrial Area, Raipur, Chhattisgarh 492001",
      natureOfBusiness: ["Wholesale Business", "Factory / Manufacturing"]
    }
  },
  {
    id: "gst-basic",
    name: "GSTIN Basic",
    category: "GST",
    cost: 1.8,
    inputPlaceholder: "GSTIN — 22AAAAA0000A1Z5",
    sampleInput: "22AAAAA0000A1Z5",
    sampleResult: {
      status: "SUCCESS",
      gstin: "22AAAAA0000A1Z5",
      legalName: "Acme Power & Grid Solutions Pvt Ltd",
      stateCode: "22",
      stateName: "Chhattisgarh",
      gstinStatus: "Active"
    }
  },
  {
    id: "gst-enhanced",
    name: "GSTIN Enhanced",
    category: "GST",
    cost: 15.01,
    inputPlaceholder: "GSTIN — 22AAAAA0000A1Z5",
    sampleInput: "22AAAAA0000A1Z5",
    sampleResult: {
      status: "SUCCESS",
      gstin: "22AAAAA0000A1Z5",
      filingComplianceScore: "98% (High)",
      annualTurnoverEstimate: "₹12.4 Cr",
      lastGstr1Period: "August 2026",
      lastGstr3bPeriod: "August 2026",
      filingStatusGstr3b: "FILED",
      ewayBillActive: true,
      eInvoiceApplicable: true
    }
  },
  {
    id: "gst-by-pan",
    name: "GSTINs by PAN",
    category: "GST",
    cost: 1.8,
    inputPlaceholder: "PAN — ABCDE1234F",
    sampleInput: "ABCDE1234F",
    sampleResult: {
      status: "SUCCESS",
      pan: "ABCDE1234F",
      totalGstins: 2,
      gstins: [
        { gstin: "22AAAAA0000A1Z5", state: "Chhattisgarh", status: "Active", tradeName: "Acme Solar Solutions" },
        { gstin: "07AAAAA0000A1Z2", state: "Delhi", status: "Active", tradeName: "Acme Power Head Office" }
      ]
    }
  },
  {
    id: "gst-contact",
    name: "GSTIN → Contact",
    category: "GST",
    cost: 3.5,
    inputPlaceholder: "GSTIN — 22AAAAA0000A1Z5",
    sampleInput: "22AAAAA0000A1Z5",
    sampleResult: {
      status: "SUCCESS",
      gstin: "22AAAAA0000A1Z5",
      primaryEmail: "compliance@acmesolar.co.in",
      primaryMobile: "+91 98****3210",
      promoterName: "Omkar Patil",
      panLinked: "ABCDE1234F"
    }
  },

  // VEHICLE
  {
    id: "vehicle-rc",
    name: "Vehicle RC (VAHAN)",
    category: "VEHICLE",
    cost: 10.0,
    inputPlaceholder: "RC / Vehicle No. — RJ14AB1234",
    sampleInput: "RJ14AB1234",
    sampleResult: {
      status: "SUCCESS",
      rcNumber: "RJ14AB1234",
      registeredOwner: "Omkar Patil",
      makerModel: "Mahindra Bolero Maxi Truck Plus",
      fuelType: "DIESEL",
      manufacturingYear: "2019",
      rcStatus: "ACTIVE",
      fitnessValidUpto: "14/05/2027",
      insuranceValidUpto: "28/11/2026",
      hypothecation: "Mahindra & Mahindra Financial Services Ltd"
    }
  },
  {
    id: "rc-challan",
    name: "RC e-Challan",
    category: "VEHICLE",
    cost: 9.0,
    inputPlaceholder: "RC / Vehicle No. — RJ14AB1234",
    sampleInput: "RJ14AB1234",
    sampleResult: {
      status: "SUCCESS",
      rcNumber: "RJ14AB1234",
      totalPendingChallans: 2,
      totalAmountPending: "₹1,200",
      challans: [
        { challanNo: "RJ2026049210", date: "12/04/2026", offense: "Over-speeding (40 km/h in 30 zone)", amount: "₹1,000", status: "PENDING" },
        { challanNo: "RJ2026071842", date: "04/07/2026", offense: "Improper Parking", amount: "₹200", status: "PENDING" }
      ]
    }
  }
];

export function GnApis() {
  // Read and sync wallet balance with localStorage key `teleport_wallet_credits`
  const [walletCredits, setWalletCredits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("teleport_wallet_credits");
      return saved !== null ? parseFloat(saved) : 0.0;
    } catch {
      return 0.0;
    }
  });

  // Credit Report Policy states
  const [cibilEnabled, setCibilEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("teleport_cibil_policy");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [experianEnabled, setExperianEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("teleport_experian_policy");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Dismissable alert banner
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Search input
  const [searchQuery, setSearchQuery] = useState("");

  // Input states per API id
  const [inputs, setInputs] = useState<Record<string, string>>({});

  // Active running state
  const [runningId, setRunningId] = useState<string | null>(null);

  // Result inspect modal
  const [activeModalData, setActiveModalData] = useState<{
    apiName: string;
    cost: number;
    input: string;
    status: string;
    data: Record<string, any>;
    when: string;
  } | null>(null);

  // Insufficient credits modal
  const [showLowBalanceModal, setShowLowBalanceModal] = useState<{
    needed: number;
    available: number;
  } | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Sync wallet balance if other tabs update localStorage
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem("teleport_wallet_credits");
        if (saved !== null) setWalletCredits(parseFloat(saved));
      } catch {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Save policy toggles
  const toggleCibil = () => {
    const next = !cibilEnabled;
    setCibilEnabled(next);
    localStorage.setItem("teleport_cibil_policy", JSON.stringify(next));
    showToast(`CIBIL bureau policy set to ${next ? "Enabled" : "Disabled"}.`);
  };

  const toggleExperian = () => {
    const next = !experianEnabled;
    setExperianEnabled(next);
    localStorage.setItem("teleport_experian_policy", JSON.stringify(next));
    showToast(`Experian bureau policy set to ${next ? "Enabled" : "Disabled"}.`);
  };

  // Hit Ledger storage
  const [hitLedger, setHitLedger] = useState<ApiHitRecord[]>(() => {
    try {
      const saved = localStorage.getItem("teleport_api_hits");
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default initial mock hit history from system video
    return [
      {
        id: "hit-101",
        when: "10 Oct 2026, 02:40 PM",
        source: "Manual Check",
        api: "PAN → CIN",
        input: "ABCDE1234F",
        runBy: "Vivek (You)",
        status: "Success",
        cost: 25.0,
        details: "Acme Power & Grid Solutions Pvt Ltd · Active",
        payload: {
          cin: "U74999DL2015PTC284839",
          pan: "ABCDE1234F",
          companyName: "Acme Power & Grid Solutions Pvt Ltd",
          status: "Active"
        }
      },
      {
        id: "hit-102",
        when: "08 Oct 2026, 11:15 AM",
        source: "Manual Check",
        api: "GSTIN Verification",
        input: "22AAAAA0000A1Z5",
        runBy: "Vivek (You)",
        status: "Success",
        cost: 2.54,
        details: "Acme Solar Solutions · Regular Taxpayer",
        payload: {
          gstin: "22AAAAA0000A1Z5",
          legalName: "Acme Power & Grid Solutions Pvt Ltd",
          status: "Active"
        }
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("teleport_api_hits", JSON.stringify(hitLedger));
    } catch {}
  }, [hitLedger]);

  // Execute an API check
  const handleRunApi = (api: ApiDefinition) => {
    const rawVal = inputs[api.id]?.trim();
    const inputValue = rawVal || api.sampleInput;

    // Check balance
    if (walletCredits < api.cost) {
      setShowLowBalanceModal({ needed: api.cost, available: walletCredits });
      return;
    }

    setRunningId(api.id);

    // Simulate API network call
    setTimeout(() => {
      const newBalance = Number((walletCredits - api.cost).toFixed(2));
      setWalletCredits(newBalance);
      localStorage.setItem("teleport_wallet_credits", newBalance.toString());

      const nowFormatted =
        new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
        `, ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;

      const newHit: ApiHitRecord = {
        id: `hit-${Date.now()}`,
        when: nowFormatted,
        source: "Manual Check",
        api: api.name,
        input: inputValue,
        runBy: "Vivek (You)",
        status: "Success",
        cost: api.cost,
        details: `${api.name} executed successfully for [${inputValue}]`,
        payload: {
          ...api.sampleResult,
          queriedInput: inputValue,
          timestamp: new Date().toISOString()
        }
      };

      setHitLedger((prev) => [newHit, ...prev]);

      // Record transaction into wallet ledger
      try {
        const txSaved = localStorage.getItem("teleport_wallet_txns");
        const existingTx = txSaved ? JSON.parse(txSaved) : [];
        const newTx = {
          srNo: existingTx.length + 1,
          type: "DEBIT",
          amount: api.cost,
          paid: 0,
          balanceAfter: newBalance,
          reason: `API Call: ${api.name}`,
          description: `Verification API check on ${inputValue} (Ref: ${newHit.id})`,
          createdAt: nowFormatted,
          bucket: "Verification Wallet"
        };
        localStorage.setItem("teleport_wallet_txns", JSON.stringify([newTx, ...existingTx]));
      } catch {}

      setRunningId(null);
      setActiveModalData({
        apiName: api.name,
        cost: api.cost,
        input: inputValue,
        status: "SUCCESS",
        data: newHit.payload,
        when: nowFormatted
      });
      showToast(`Checked ${api.name} successfully! Billed ₹${api.cost.toFixed(2)}.`);
    }, 750);
  };

  // Filtered APIs by search query
  const filteredApis = useMemo(() => {
    if (!searchQuery.trim()) return APIS_DATA;
    const q = searchQuery.toLowerCase();
    return APIS_DATA.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.inputPlaceholder.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Group filtered APIs
  const groupedApis = useMemo(() => {
    const groups: Record<string, ApiDefinition[]> = {
      COMPANY: [],
      EMPLOYMENT: [],
      GST: [],
      VEHICLE: []
    };
    filteredApis.forEach((item) => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    });
    return groups;
  }, [filteredApis]);

  // Stats for Hit Ledger
  const ledgerStats = useMemo(() => {
    const totalHits = hitLedger.length;
    const successfulHits = hitLedger.filter((h) => h.status === "Success").length;
    const totalSpent = hitLedger.reduce((acc, h) => acc + (h.cost || 0), 0);
    return { totalHits, successfulHits, totalSpent };
  }, [hitLedger]);

  return (
    <div className="min-h-full bg-[#090d16] text-slate-100 p-4 md:p-6 space-y-5 font-sans selection:bg-blue-600/30">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Warning Banner matching video frame 014 */}
      {!bannerDismissed && (
        <div className="max-w-[1560px] mx-auto rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-2.5 text-xs text-red-300 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            <span>
              This account is limited to one browser at a time. The other browser session has been signed out — each team member needs their own login.
            </span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-red-300 hover:text-white font-semibold underline text-xs cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Section matching wf_014.jpg */}
      <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/wallet"
              className="text-slate-400 hover:text-white transition-colors flex items-center p-0.5 rounded hover:bg-slate-800/50"
              title="Back to Wallet"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Verification APIs
            </h1>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium flex items-center gap-1.5 pl-6">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-200">API</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl pl-6">
            Run GST, PAN, CIN, DIN, Udyam, Employment (UAN) and Vehicle checks on demand. Each call is billed from your wallet.
          </p>
        </div>

        {/* Top-Right Wallet Pill button */}
        <div className="shrink-0 pt-1">
          <Link
            to="/wallet"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#1e293b] bg-[#0c1220] hover:bg-[#131b2e] hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-xs cursor-pointer"
          >
            <Wallet size={14} className="text-blue-400" />
            <span>Wallet: ₹{walletCredits.toFixed(2)}</span>
          </Link>
        </div>
      </div>

      {/* Credit Report Policy Card matching wf_014.jpg */}
      <div className="max-w-[1560px] mx-auto rounded-xl border border-[#182235] bg-[#0c1220] p-4 space-y-3 shadow-xs">
        <div>
          <h2 className="text-sm font-semibold text-white">Credit Report Policy</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn a bureau off and it disappears from Leads for everyone in this account, and the API refuses it — including the consent OTP, so nothing is charged. Role permissions still apply on top.
          </p>
        </div>

        <div className="flex items-center gap-6 pt-1">
          {/* CIBIL Toggle */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-slate-300">CIBIL</span>
            <button
              onClick={toggleCibil}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
                cibilEnabled
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/60"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {cibilEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* Experian Toggle */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-slate-300">Experian</span>
            <button
              onClick={toggleExperian}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
                experianEnabled
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/60"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {experianEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar matching wf_014.jpg */}
      <div className="max-w-[1560px] mx-auto">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search a check (GSTIN, PAN, UAN, RC...)"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#182235] bg-[#0c1220] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* API Groups List */}
      <div className="max-w-[1560px] mx-auto space-y-6">
        {(["COMPANY", "EMPLOYMENT", "GST", "VEHICLE"] as const).map((category) => {
          const items = groupedApis[category] || [];
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-0.5">
                {category}
              </div>

              <div className="space-y-2">
                {items.map((api) => {
                  const isRunning = runningId === api.id;
                  const currentVal = inputs[api.id] !== undefined ? inputs[api.id] : "";

                  return (
                    <div
                      key={api.id}
                      className="rounded-xl border border-[#182235] bg-[#0c1220] p-3 md:px-4 md:py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700/80 transition-all shadow-xs"
                    >
                      {/* Left: Icon & Name */}
                      <div className="flex items-center gap-2.5 md:w-56 shrink-0">
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                          {category === "COMPANY" && <Building2 size={13} className="text-blue-400" />}
                          {category === "EMPLOYMENT" && <Briefcase size={13} className="text-amber-400" />}
                          {category === "GST" && <Receipt size={13} className="text-emerald-400" />}
                          {category === "VEHICLE" && <Car size={13} className="text-purple-400" />}
                        </div>
                        <span className="text-xs font-semibold text-white tracking-tight">
                          {api.name}
                        </span>
                      </div>

                      {/* Middle: Interactive Input Field matching video placeholder */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) =>
                            setInputs((prev) => ({ ...prev, [api.id]: e.target.value }))
                          }
                          placeholder={api.inputPlaceholder}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#080c14] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/60 transition-colors font-mono"
                        />
                      </div>

                      {/* Right: Run Button and Active Status Badge */}
                      <div className="flex items-center justify-end gap-3 shrink-0">
                        <button
                          onClick={() => handleRunApi(api)}
                          disabled={isRunning}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
                            isRunning
                              ? "bg-blue-950 text-blue-300 border-blue-800 cursor-wait"
                              : "bg-[#101828] hover:bg-[#1a253d] border-[#1e293b] text-slate-200 hover:text-white"
                          }`}
                        >
                          <Play size={12} className={isRunning ? "animate-spin text-blue-400" : "text-slate-400 fill-slate-400"} />
                          <span>{isRunning ? "Running…" : `Run · ₹${api.cost}`}</span>
                        </button>

                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 w-16 justify-end">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50" />
                          <span>Active</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hit Ledger Section matching wf_016.jpg */}
      <div className="max-w-[1560px] mx-auto rounded-xl border border-[#182235] bg-[#0c1220] p-4 md:p-5 space-y-4 shadow-xs mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#182235] pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-blue-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Hit Ledger</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Every check you have run, with the response you paid for. Open a row to see it again or download it as a PDF — no need to run the check twice.
            </p>
          </div>

          {/* Stats on top right matching wf_016.jpg */}
          <div className="flex items-center gap-4 bg-[#080c14] border border-[#182235] px-4 py-2 rounded-xl text-xs">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">HITS</div>
              <div className="text-sm font-bold text-white">{ledgerStats.totalHits}</div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SUCCESSFUL</div>
              <div className="text-sm font-bold text-emerald-400">{ledgerStats.successfulHits}</div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SPENT</div>
              <div className="text-sm font-bold text-white">₹{ledgerStats.totalSpent.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#182235] text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">WHEN</th>
                <th className="py-2.5 px-3">SOURCE</th>
                <th className="py-2.5 px-3">API</th>
                <th className="py-2.5 px-3">RUN BY</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">COST</th>
                <th className="py-2.5 px-3">DETAILS</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141d30]">
              {hitLedger.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#11192e] transition-colors cursor-pointer group"
                  onClick={() =>
                    setActiveModalData({
                      apiName: row.api,
                      cost: row.cost,
                      input: row.input,
                      status: row.status,
                      data: row.payload,
                      when: row.when
                    })
                  }
                >
                  <td className="py-2.5 px-3 text-slate-300 font-medium whitespace-nowrap">
                    {row.when}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{row.source}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{row.api}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.runBy}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">₹{row.cost.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">{row.details}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      className="px-2.5 py-1 rounded bg-[#182235] group-hover:bg-blue-600 text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalData({
                          apiName: row.api,
                          cost: row.cost,
                          input: row.input,
                          status: row.status,
                          data: row.payload,
                          when: row.when
                        });
                      }}
                    >
                      View Response
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: API Result Inspector */}
      {activeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0c1220] border border-[#1e293b] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#182235] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {activeModalData.apiName} — Result
                  </h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Queried: <strong className="text-slate-200">{activeModalData.input}</strong></span>
                    <span>•</span>
                    <span>{activeModalData.when}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModalData(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Cost & Status banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#080c14] border border-[#182235]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/50">
                    {activeModalData.status}
                  </span>
                  <span className="text-xs text-slate-400">Response code 200 · Latency: 210ms</span>
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  Billed: <span className="text-emerald-400 font-bold">₹{activeModalData.cost.toFixed(2)}</span>
                </div>
              </div>

              {/* Formatted Key-Value Grid */}
              <div className="rounded-xl border border-[#182235] bg-[#090e18] p-4 space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Extracted Data
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(activeModalData.data).map(([k, v]) => {
                    if (typeof v === "object") return null;
                    return (
                      <div key={k} className="p-2 rounded-lg bg-[#0c1220] border border-[#182235]/70">
                        <div className="text-[10px] uppercase font-bold text-slate-400">{k}</div>
                        <div className="text-xs font-medium text-slate-200 mt-0.5 truncate">{String(v)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Raw JSON viewer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Raw Provider JSON</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(activeModalData.data, null, 2));
                      showToast("JSON payload copied to clipboard!");
                    }}
                    className="flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 normal-case cursor-pointer"
                  >
                    <Copy size={12} />
                    <span>Copy JSON</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-[#060910] border border-[#182235] text-[11px] text-slate-300 font-mono overflow-x-auto max-h-48 scrollbar-thin">
                  {JSON.stringify(activeModalData.data, null, 2)}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#182235] bg-[#090d16] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Verified live with provider API signature
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#182235] bg-[#0c1220] hover:bg-[#152033] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={13} />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setActiveModalData(null)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Low Balance / Recharge prompt */}
      {showLowBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0c1220] border border-amber-900/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle size={22} />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Insufficient Wallet Credits</h3>
              <p className="text-xs text-slate-400 mt-1">
                This verification check requires <strong className="text-white">₹{showLowBalanceModal.needed.toFixed(2)}</strong>, but your Verification Wallet balance is <strong className="text-amber-400">₹{showLowBalanceModal.available.toFixed(2)}</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#080c14] border border-[#182235] text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Check Cost:</span>
                <span className="text-white font-medium">₹{showLowBalanceModal.needed.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Current Credits:</span>
                <span className="text-amber-400 font-medium">₹{showLowBalanceModal.available.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold pt-1 border-t border-slate-800">
                <span>Credit Deficit:</span>
                <span className="text-red-400">₹{(showLowBalanceModal.needed - showLowBalanceModal.available).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLowBalanceModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <Link
                to="/wallet"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/30"
              >
                <Sparkles size={14} />
                <span>Recharge Wallet Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
