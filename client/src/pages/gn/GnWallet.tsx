import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Wallet, ShieldCheck, Sparkles, RefreshCw, Download, Calendar,
  FileText, Activity, Layers, IndianRupee, Search, ChevronDown,
  CheckCircle2, ArrowDownLeft, ArrowUpRight, Plus, X, ExternalLink,
  Zap, Check, AlertCircle, Copy, CreditCard, Filter, Printer,
  QrCode, Building2, CheckSquare, ArrowRight, Smartphone
} from "lucide-react";
import { fmtInr } from "../../lib/api";

type WalletTab =
  | "transactions"
  | "history"
  | "subscriptions"
  | "usage-summary"
  | "usage-ledger"
  | "pricing";

type WalletBucket = "Verification Wallet" | "Reseller Seats" | "WhatsApp Messages";

interface TransactionRow {
  srNo: number;
  type: "CREDIT" | "DEBIT";
  amount: number;
  paid: number;
  balanceAfter: number;
  reason: string;
  description: string;
  createdAt: string;
  bucket: WalletBucket;
}

interface PurchaseInvoice {
  id: string;
  date: string;
  type: "SEATS" | "WALLET";
  description: string;
  amountPaid: number;
  paymentRef: string;
  invoiceNo: string;
}

interface ApiHitLedgerRow {
  id: string;
  when: string;
  source: string;
  api: string;
  runBy: string;
  status: "Success" | "Refunded" | "Failed";
  cost: number | null;
  details: string;
}

interface ApiPricingItem {
  id: string;
  name: string;
  subtext: string;
  category:
    | "Credit bureau"
    | "Bank statement"
    | "GST / KYB"
    | "Company & directors"
    | "Employment (EPFO)"
    | "Vehicle"
    | "e-Sign"
    | "SMS";
  whereUsed: string;
  price: number;
}

// Initial transactions matching video frame 001
const INITIAL_TRANSACTIONS: TransactionRow[] = [
  {
    srNo: 1,
    type: "CREDIT",
    amount: 383.25,
    paid: 0,
    balanceAfter: 0.0,
    reason: "Negative Balance Writeoff",
    description: "Negative balances are not permitted on production tier. Automatic administrative balance writeoff applied.",
    createdAt: "02 Aug 2026, 10:27 am",
    bucket: "Verification Wallet"
  },
  {
    srNo: 2,
    type: "CREDIT",
    amount: 0.25,
    paid: 0,
    balanceAfter: 1.0,
    reason: "Refund",
    description: "Refund: credit-report-v1 (upstream timeout on Experian CIR gateway)",
    createdAt: "02 Jul 2026, 02:58 pm",
    bucket: "Verification Wallet"
  },
  {
    srNo: 3,
    type: "CREDIT",
    amount: 0.25,
    paid: 0,
    balanceAfter: 1.0,
    reason: "Refund",
    description: "Refund: credit-report-v1 (upstream timeout on Experian CIR gateway)",
    createdAt: "02 Jul 2026, 02:56 pm",
    bucket: "Verification Wallet"
  },
  {
    srNo: 4,
    type: "CREDIT",
    amount: 0.25,
    paid: 0,
    balanceAfter: 1.0,
    reason: "Refund",
    description: "Refund: credit-report-v1 (upstream timeout on Experian CIR gateway)",
    createdAt: "02 Jul 2026, 02:35 pm",
    bucket: "Verification Wallet"
  },
  {
    srNo: 5,
    type: "CREDIT",
    amount: 0.25,
    paid: 0,
    balanceAfter: 1.0,
    reason: "Refund",
    description: "Refund: credit-report-v1 (upstream timeout on Experian CIR gateway)",
    createdAt: "02 Jul 2026, 02:27 pm",
    bucket: "Verification Wallet"
  },
  {
    srNo: 6,
    type: "CREDIT",
    amount: 0.25,
    paid: 0,
    balanceAfter: 1.0,
    reason: "Refund",
    description: "Refund: credit-report-v1 (upstream timeout on Experian CIR gateway)",
    createdAt: "02 Jul 2026, 02:24 pm",
    bucket: "Verification Wallet"
  },
  {
    srNo: 7,
    type: "CREDIT",
    amount: 1.0,
    paid: 0,
    balanceAfter: 1.0,
    reason: "Admin Manual Credit",
    description: "Manual ₹100 credit granted by admin for onboarding verification test runs.",
    createdAt: "02 Jul 2026, 02:21 pm",
    bucket: "Verification Wallet"
  }
];

// Initial purchases matching video frame 026
const INITIAL_PURCHASES: PurchaseInvoice[] = [
  {
    id: "p1",
    date: "31 Mar 2026",
    type: "SEATS",
    description: "DSA Sathi — Subscription Upgrade (5 seats)",
    amountPaid: 8796,
    paymentRef: "pay_SXmg1EIryp094Y...",
    invoiceNo: "INV-2026-0331-SEATS"
  }
];

// Initial API Ledger rows matching video frame 008
const INITIAL_LEDGER_ROWS: ApiHitLedgerRow[] = [
  {
    id: "l1",
    when: "06 Jul, 06:21 pm",
    source: "API Sathi",
    api: "Credit Report V1",
    runBy: "VIVEK MAHAJAN",
    status: "Success",
    cost: 0.25,
    details: "—"
  },
  {
    id: "l2",
    when: "06 Jul, 06:16 pm",
    source: "API Sathi",
    api: "Credit Report V1",
    runBy: "VIVEK MAHAJAN",
    status: "Success",
    cost: 0.25,
    details: "—"
  },
  {
    id: "l3",
    when: "02 Jul, 02:58 pm",
    source: "API Sathi",
    api: "Credit Report V1",
    runBy: "VIVEK MAHAJAN",
    status: "Refunded",
    cost: null,
    details: '{"code":"VENDOR_ERROR","message":"Upstream timeout on Experian gateway"}'
  },
  {
    id: "l4",
    when: "02 Jul, 02:56 pm",
    source: "API Sathi",
    api: "Credit Report V1",
    runBy: "VIVEK MAHAJAN",
    status: "Refunded",
    cost: null,
    details: '{"code":"VENDOR_ERROR","message":"Upstream timeout on Experian gateway"}'
  },
  {
    id: "l5",
    when: "02 Jul, 02:35 pm",
    source: "API Sathi",
    api: "Credit Report V1",
    runBy: "VIVEK MAHAJAN",
    status: "Refunded",
    cost: null,
    details: '{"code":"VENDOR_ERROR","message":"Upstream timeout on Experian gateway"}'
  },
  {
    id: "l6",
    when: "02 Jul, 02:27 pm",
    source: "API Sathi",
    api: "Credit Report V1",
    runBy: "VIVEK MAHAJAN",
    status: "Refunded",
    cost: null,
    details: '{"code":"VENDOR_ERROR","message":"Upstream timeout on Experian gateway"}'
  },
  {
    id: "l7",
    when: "02 Jul, 02:24 pm",
    source: "API Sathi",
    api: "Credit Report V1",
    runBy: "VIVEK MAHAJAN",
    status: "Refunded",
    cost: null,
    details: '{"code":"VENDOR_ERROR","message":"Upstream timeout on Experian gateway"}'
  }
];

// Complete API catalog matching video frame 020 (All 26 APIs)
const API_CATALOG: ApiPricingItem[] = [
  // 1. Credit bureau (3)
  {
    id: "cibil",
    name: "CIBIL Credit Report",
    subtext: "Pull a CIBIL (TransUnion) credit report and score for an applicant. Requires customer OTP consent.",
    category: "Credit bureau",
    whereUsed: "Lead → Credit Report",
    price: 125
  },
  {
    id: "experian",
    name: "Credit Report",
    subtext: "Pull a full Experian credit report and score for an applicant. Requires customer OTP consent.",
    category: "Credit bureau",
    whereUsed: "Lead → Credit Report",
    price: 55
  },
  {
    id: "mobile_cibil",
    name: "Mobile Credit Report",
    subtext: "Fetch a masked-mobile Experian credit report with OTP consent — no full mobile number needed.",
    category: "Credit bureau",
    whereUsed: "Lead → Credit Report",
    price: 95
  },

  // 2. Bank statement (3)
  {
    id: "bank_pdf",
    name: "Bank Statement Analysis (PDF)",
    subtext: "Upload and parse net banking or scanned PDF bank statements with fraud & tampering detection.",
    category: "Bank statement",
    whereUsed: "Lead → Financials",
    price: 45
  },
  {
    id: "penny_drop",
    name: "Bank Account Penny Drop",
    subtext: "Authenticate beneficiary account name with instant ₹1 penny drop IMPS transfer.",
    category: "Bank statement",
    whereUsed: "Disbursement → Bank",
    price: 2.50
  },
  {
    id: "aa_consent",
    name: "Net Banking Aggregator (AA)",
    subtext: "RBI-regulated Account Aggregator direct banking consent and live transaction stream.",
    category: "Bank statement",
    whereUsed: "Lead → Financials",
    price: 35
  },

  // 3. GST / KYB (5)
  {
    id: "pan_verify",
    name: "PAN Verification",
    subtext: "Verify PAN authenticity, holder name, category, and Aadhaar seeding status.",
    category: "GST / KYB",
    whereUsed: "Lead → KYC",
    price: 1.50
  },
  {
    id: "gstin_search",
    name: "GSTIN Comprehensive Search",
    subtext: "Verify GSTIN status, filing track record, trade name, and registered addresses.",
    category: "GST / KYB",
    whereUsed: "Lead → Business",
    price: 3.00
  },
  {
    id: "gstin_basic",
    name: "GSTIN Basic Verification",
    subtext: "Fast lookup of taxpayer active status and state registration code.",
    category: "GST / KYB",
    whereUsed: "Lead → Business",
    price: 1.80
  },
  {
    id: "gstin_pan",
    name: "GSTINs by PAN",
    subtext: "Find all GST registrations across India associated with a corporate or individual PAN.",
    category: "GST / KYB",
    whereUsed: "Lead → Business",
    price: 2.00
  },
  {
    id: "udyam_verify",
    name: "Udyam MSME Certificate Search",
    subtext: "Verify Ministry of MSME Udyam registration, enterprise type and manufacturing sector.",
    category: "GST / KYB",
    whereUsed: "Lead → Business",
    price: 4.50
  },

  // 4. Company & directors (7)
  {
    id: "pan_cin",
    name: "PAN → CIN Search",
    subtext: "Resolve Corporate Identification Number (CIN) from company PAN.",
    category: "Company & directors",
    whereUsed: "Lead → Business",
    price: 25.00
  },
  {
    id: "cin_pan",
    name: "CIN → PAN Resolution",
    subtext: "Retrieve official company PAN and incorporation certificate details from CIN.",
    category: "Company & directors",
    whereUsed: "Lead → Business",
    price: 4.50
  },
  {
    id: "company_cin",
    name: "Company Name → CIN Search",
    subtext: "Fuzzy lookup of registered entity name to locate exact MCA CIN.",
    category: "Company & directors",
    whereUsed: "Lead → Business",
    price: 5.50
  },
  {
    id: "pan_din",
    name: "PAN → DIN Search",
    subtext: "Identify all Director Identification Numbers (DIN) held by an individual PAN.",
    category: "Company & directors",
    whereUsed: "Lead → Business",
    price: 2.00
  },
  {
    id: "din_pan",
    name: "DIN → PAN Verification",
    subtext: "Confirm director identity, association history, and disqualification status.",
    category: "Company & directors",
    whereUsed: "Lead → Business",
    price: 2.25
  },
  {
    id: "mca_master",
    name: "MCA Company Master Data",
    subtext: "Detailed authorized capital, paid-up capital, date of last AGM, and balance sheet date.",
    category: "Company & directors",
    whereUsed: "Lead → Business",
    price: 8.00
  },
  {
    id: "mca_charges",
    name: "MCA Charges & Hypothecation Check",
    subtext: "Index of active bank charges, debentures, and mortgages on company assets.",
    category: "Company & directors",
    whereUsed: "Lead → Collateral",
    price: 15.00
  },

  // 5. Employment (EPFO) (4)
  {
    id: "uan_basic",
    name: "Employment (UAN Basic)",
    subtext: "Verify EPFO active membership, employer name, and member joining date.",
    category: "Employment (EPFO)",
    whereUsed: "Lead → Employment",
    price: 4.50
  },
  {
    id: "uan_history",
    name: "Employment History (UAN)",
    subtext: "Fetch complete work history across all previous employers and tenures.",
    category: "Employment (EPFO)",
    whereUsed: "Lead → Employment",
    price: 7.50
  },
  {
    id: "uan_pf",
    name: "Employment + PF Passbook",
    subtext: "Verify monthly PF remittances, basic salary estimate, and continuous service.",
    category: "Employment (EPFO)",
    whereUsed: "Lead → Employment",
    price: 6.00
  },
  {
    id: "uan_otp",
    name: "EPFO Passbook with Consent OTP",
    subtext: "Full official EPFO passbook extraction with employee OTP verification.",
    category: "Employment (EPFO)",
    whereUsed: "Lead → Employment",
    price: 9.00
  },

  // 6. Vehicle (2)
  {
    id: "vahan_rc",
    name: "Vehicle RC (VAHAN)",
    subtext: "Verify vehicle registration number, owner name, fuel type, and hypothecation financier.",
    category: "Vehicle",
    whereUsed: "Lead → Collateral",
    price: 3.50
  },
  {
    id: "echallan",
    name: "RC e-Challan & Blacklist Check",
    subtext: "Check pending traffic court challans, theft records, and transport blacklist status.",
    category: "Vehicle",
    whereUsed: "Lead → Collateral",
    price: 2.50
  },

  // 7. e-Sign (1)
  {
    id: "aadhaar_esign",
    name: "Aadhaar Paperless e-Sign",
    subtext: "Legally binding Aadhaar OTP e-sign for loan agreements and KFS sanctions.",
    category: "e-Sign",
    whereUsed: "Sanction → e-Sign",
    price: 25.00
  },

  // 8. SMS (1)
  {
    id: "dlt_sms",
    name: "Transactional SMS Delivery",
    subtext: "Instant DLT registered OTP, status update, and disbursement alert SMS.",
    category: "SMS",
    whereUsed: "CRM → Notifications",
    price: 0.20
  }
];

export function GnWallet() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<WalletTab>("transactions");
  const [walletBucket, setWalletBucket] = useState<WalletBucket>("Verification Wallet");
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [toast, setToast] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Ledger state
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState<string>("All statuses");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedLedgerRow, setSelectedLedgerRow] = useState<ApiHitLedgerRow | null>(null);

  // Pricing filter
  const [pricingCategory, setPricingCategory] = useState<string>("All (26)");
  const [pricingSearch, setPricingSearch] = useState("");

  // Invoice modal state
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);

  // Balances with localStorage persistence
  const [verificationCredits, setVerificationCredits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("teleport_wallet_credits");
      return saved !== null ? Number(saved) : 0.0;
    } catch {
      return 0.0;
    }
  });

  const [resellerSeats, setResellerSeats] = useState<number>(2);
  const [whatsappCredits, setWhatsappCredits] = useState<number>(0);

  // Modals
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<number>(1000);
  const [rechargeMethod, setRechargeMethod] = useState<string>("upi");

  // Transactions list with localStorage persistence
  const [transactions, setTransactions] = useState<TransactionRow[]>(() => {
    try {
      const saved = localStorage.getItem("teleport_wallet_txns");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Purchases list
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>(() => {
    try {
      const saved = localStorage.getItem("teleport_wallet_purchases");
      return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
    } catch {
      return INITIAL_PURCHASES;
    }
  });

  // Sync balances
  useEffect(() => {
    try {
      localStorage.setItem("teleport_wallet_credits", verificationCredits.toString());
    } catch (e) {}
  }, [verificationCredits]);

  useEffect(() => {
    try {
      localStorage.setItem("teleport_wallet_txns", JSON.stringify(transactions));
    } catch (e) {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem("teleport_wallet_purchases", JSON.stringify(purchases));
    } catch (e) {}
  }, [purchases]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  // Filtered transactions for Tab 1
  const filteredTransactions = useMemo(() => {
    let list = transactions.filter((t) => t.bucket === walletBucket);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.reason.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q) ||
          t.amount.toString().includes(q)
      );
    }
    return list;
  }, [transactions, walletBucket, search]);

  // Filtered transactions for Tab 2 (Usage history)
  const filteredUsageHistory = useMemo(() => {
    // When walletBucket is "Reseller Seats" or "WhatsApp Messages", video showed "No transactions yet."
    if (walletBucket !== "Verification Wallet") {
      return [];
    }
    return transactions.filter((t) => t.type === "DEBIT");
  }, [transactions, walletBucket]);

  // Filtered Ledger for Tab 5
  const filteredLedger = useMemo(() => {
    return INITIAL_LEDGER_ROWS.filter((row) => {
      if (ledgerStatusFilter !== "All statuses" && row.status !== ledgerStatusFilter) {
        return false;
      }
      if (ledgerSearch.trim()) {
        const q = ledgerSearch.toLowerCase();
        return (
          row.api.toLowerCase().includes(q) ||
          row.source.toLowerCase().includes(q) ||
          row.runBy.toLowerCase().includes(q) ||
          row.details.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [ledgerStatusFilter, ledgerSearch]);

  // Filtered Pricing for Tab 6
  const filteredPricing = useMemo(() => {
    return API_CATALOG.filter((item) => {
      if (pricingCategory !== "All (26)") {
        const catKey = pricingCategory.split(" (")[0];
        if (item.category !== catKey) return false;
      }
      if (pricingSearch.trim()) {
        const q = pricingSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.subtext.toLowerCase().includes(q) ||
          item.whereUsed.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [pricingCategory, pricingSearch]);

  // Lifetime spend calculation
  const lifetimeSpend = useMemo(() => {
    return purchases.reduce((acc, p) => acc + p.amountPaid, 0);
  }, [purchases]);

  // Recharge submission
  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCredit = Number(rechargeAmount);
    if (!newCredit || newCredit <= 0) return;

    const updatedCredits = Number((verificationCredits + newCredit).toFixed(2));
    setVerificationCredits(updatedCredits);

    const txId = Math.floor(100000 + Math.random() * 900000);
    const newTx: TransactionRow = {
      srNo: transactions.length + 1,
      type: "CREDIT",
      amount: newCredit,
      paid: newCredit,
      balanceAfter: updatedCredits,
      reason: "Wallet Recharge",
      description: `Online wallet top-up via ${rechargeMethod.toUpperCase()} (Ref #TXN-${txId})`,
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }) + `, ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`,
      bucket: "Verification Wallet"
    };

    const newPurchase: PurchaseInvoice = {
      id: `p-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      type: "WALLET",
      description: `Verification Wallet Top-up (₹${newCredit.toLocaleString("en-IN")})`,
      amountPaid: newCredit,
      paymentRef: `pay_${Math.random().toString(36).substring(2, 14)}`,
      invoiceNo: `INV-2026-${txId}`
    };

    setTransactions([newTx, ...transactions]);
    setPurchases([newPurchase, ...purchases]);
    setRechargeModalOpen(false);
    showToast(`Successfully credited ₹${newCredit.toLocaleString("en-IN")} to Verification Wallet!`);
  };

  // CSV Export for transactions
  const handleExportTransactions = () => {
    const csvHeader = "Sr.No,Type,Amount (credits),Paid (INR),Balance After (credits),Reason,Description,Created At\n";
    const csvRows = filteredTransactions
      .map(
        (t) =>
          `"${t.srNo}","${t.type}","${t.amount}","${t.paid}","${t.balanceAfter}","${t.reason.replace(/"/g, '""')}","${t.description.replace(/"/g, '""')}","${t.createdAt}"`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Wallet_${walletBucket.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${walletBucket} ledger CSV.`);
  };

  // CSV Export for ledger
  const handleExportLedger = () => {
    const csvHeader = "When,Source,API,Run By,Status,Cost,Details\n";
    const csvRows = filteredLedger
      .map(
        (l) =>
          `"${l.when}","${l.source}","${l.api}","${l.runBy}","${l.status}","${l.cost ?? 0}","${(l.details || "").replace(/"/g, '""')}"`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `API_Usage_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported API Usage Ledger CSV.");
  };

  return (
    <div className="min-h-full bg-[#090d16] text-slate-100 p-4 md:p-6 space-y-5 relative font-sans selection:bg-blue-600/30">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Warning Banner matching video frame 001 */}
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

      {/* TOP METRIC CARDS (Matching Screenshot 1 exactly) */}
      <div className="max-w-[1560px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* 1. RESELLER SEATS */}
        <div
          onClick={() => {
            setWalletBucket("Reseller Seats");
            setActiveTab("history");
          }}
          className="p-4 rounded-xl bg-[#0c1220] border border-[#182235] shadow-xs flex flex-col justify-between hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
            RESELLER SEATS
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white tracking-tight">{resellerSeats}</span>
            <span className="text-xs font-normal text-slate-400">left</span>
          </div>
        </div>

        {/* 2. VERIFICATION WALLET */}
        <div
          onClick={() => {
            setWalletBucket("Verification Wallet");
            setActiveTab("transactions");
          }}
          className="p-4 rounded-xl bg-[#0c1220] border border-[#182235] shadow-xs flex flex-col justify-between hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
            VERIFICATION WALLET
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white tracking-tight">
              {verificationCredits.toFixed(2)}
            </span>
            <span className="text-xs font-normal text-slate-400">credits</span>
          </div>
        </div>

        {/* 3. WHATSAPP MESSAGES */}
        <div
          onClick={() => {
            setWalletBucket("WhatsApp Messages");
            setActiveTab("history");
          }}
          className="p-4 rounded-xl bg-[#0c1220] border border-[#182235] shadow-xs flex flex-col justify-between hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
            WHATSAPP MESSAGES
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white tracking-tight">{whatsappCredits}</span>
            <span className="text-xs font-normal text-slate-400">left</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL NAVIGATION TABS & HEADER ACTIONS matching video frame 001 */}
      <div className="max-w-[1560px] mx-auto space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#182235] pb-2">
          {/* 6 Tabs */}
          <div className="flex items-center gap-5 overflow-x-auto scrollbar-none text-xs">
            {/* Tab 1: Transaction History */}
            <button
              onClick={() => setActiveTab("transactions")}
              className={`pb-2.5 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === "transactions"
                  ? "text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Transaction History</span>
              {activeTab === "transactions" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300 rounded-full" />
              )}
            </button>

            {/* Tab 2: Wallet History */}
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-2.5 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === "history"
                  ? "text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar size={13} className="text-slate-400 shrink-0" />
              <span>Wallet History</span>
              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300 rounded-full" />
              )}
            </button>

            {/* Tab 3: Subscription & Invoices */}
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`pb-2.5 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === "subscriptions"
                  ? "text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText size={13} className="text-slate-400 shrink-0" />
              <span>Subscription & Invoices</span>
              {activeTab === "subscriptions" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300 rounded-full" />
              )}
            </button>

            {/* Tab 4: API Usage Summary */}
            <button
              onClick={() => setActiveTab("usage-summary")}
              className={`pb-2.5 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === "usage-summary"
                  ? "text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity size={13} className="text-slate-400 shrink-0" />
              <span>API Usage Summary</span>
              {activeTab === "usage-summary" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300 rounded-full" />
              )}
            </button>

            {/* Tab 5: API Usage Ledger */}
            <button
              onClick={() => setActiveTab("usage-ledger")}
              className={`pb-2.5 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === "usage-ledger"
                  ? "text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers size={13} className="text-slate-400 shrink-0" />
              <span>API Usage Ledger</span>
              {activeTab === "usage-ledger" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300 rounded-full" />
              )}
            </button>

            {/* Tab 6: API Pricing */}
            <button
              onClick={() => setActiveTab("pricing")}
              className={`pb-2.5 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === "pricing"
                  ? "text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <IndianRupee size={13} className="text-slate-400 shrink-0" />
              <span>API Pricing</span>
              {activeTab === "pricing" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300 rounded-full" />
              )}
            </button>
          </div>

          {/* Right Action Buttons matching Screenshot */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Verification Toolbox (Links to /apis as seen in video frame 014) */}
            <Link
              to="/apis"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#0d1322] hover:bg-[#152033] text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <ShieldCheck size={14} className="text-slate-400" />
              <span>Verification toolbox</span>
            </Link>

            {/* Recharge */}
            <button
              onClick={() => setRechargeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-blue-500/30 bg-[#16233d] hover:bg-[#1f2e4e] text-xs font-semibold text-white transition-all cursor-pointer shadow-xs shadow-blue-500/10"
            >
              <Sparkles size={14} className="text-blue-400" />
              <span>Recharge</span>
            </button>

            {/* Reload button */}
            <button
              onClick={() => showToast("Wallet balances synchronized.")}
              className="p-1.5 rounded-lg border border-[#1e293b] bg-[#0d1322] hover:bg-[#152033] text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* TAB 1: TRANSACTION HISTORY (Matching video frame 001) */}
        {activeTab === "transactions" && (
          <div className="space-y-3.5">
            {/* Sub-Header & Wallet Type Dropdown & Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <h2 className="text-sm font-semibold text-slate-200">
                Transactions · {walletBucket}
              </h2>

              <div className="flex items-center gap-2">
                {/* Wallet Type Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#0c1220] hover:bg-[#111a2d] text-xs font-medium text-slate-200 cursor-pointer"
                  >
                    <span>{walletBucket}</span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </button>

                  {walletDropdownOpen && (
                    <div className="absolute right-0 top-9 z-20 w-48 rounded-xl bg-[#0d1322] border border-[#1e293b] shadow-2xl py-1 text-xs text-slate-200 animate-in fade-in-50 duration-100">
                      {(["Verification Wallet", "Reseller Seats", "WhatsApp Messages"] as WalletBucket[]).map((w) => (
                        <button
                          key={w}
                          onClick={() => {
                            setWalletBucket(w);
                            setWalletDropdownOpen(false);
                            showToast(`Filtered by ${w}`);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition-colors cursor-pointer ${
                            walletBucket === w ? "text-blue-400 font-semibold bg-blue-500/10" : ""
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExportTransactions}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#0c1220] hover:bg-[#111a2d] text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
                >
                  <Download size={13} className="text-slate-400" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Filter Row: Show entries & Search Input */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="bg-[#0c1220] border border-[#1e293b] text-slate-200 rounded px-1.5 py-0.5 text-xs focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by reason, description, ref..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Data Table matching Screenshot 1 exactly */}
            <div className="bg-[#0c1220] border border-[#182235] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#182235] bg-[#0a0f1d] text-slate-400 font-semibold text-[11px]">
                      <th className="px-3.5 py-3 w-14">Sr.No</th>
                      <th className="px-3.5 py-3 w-28">Type</th>
                      <th className="px-3.5 py-3">Amount (credits)</th>
                      <th className="px-3.5 py-3">Paid (₹)</th>
                      <th className="px-3.5 py-3">Balance After (credits)</th>
                      <th className="px-3.5 py-3">Reason</th>
                      <th className="px-3.5 py-3 min-w-[320px]">Description</th>
                      <th className="px-3.5 py-3 whitespace-nowrap">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141d30]">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          No transactions yet.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.slice(0, entriesPerPage).map((row) => (
                        <tr key={row.srNo} className="hover:bg-[#10182b] transition-colors">
                          <td className="px-3.5 py-3 text-slate-400">{row.srNo}</td>
                          <td className="px-3.5 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                row.type === "CREDIT"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                              }`}
                            >
                              {row.type === "CREDIT" ? (
                                <ArrowDownLeft size={11} className="stroke-[2.5]" />
                              ) : (
                                <ArrowUpRight size={11} className="stroke-[2.5]" />
                              )}
                              <span>{row.type}</span>
                            </span>
                          </td>
                          <td
                            className={`px-3.5 py-3 font-semibold ${
                              row.type === "CREDIT" ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {row.type === "CREDIT" ? "+" : "-"}
                            {row.amount.toFixed(2)}
                          </td>
                          <td className="px-3.5 py-3 text-slate-300">₹{row.paid}</td>
                          <td className="px-3.5 py-3 text-slate-300 font-mono">
                            {row.balanceAfter.toFixed(2)}
                          </td>
                          <td className="px-3.5 py-3 text-slate-200 font-medium">{row.reason}</td>
                          <td className="px-3.5 py-3 text-slate-400 truncate max-w-sm" title={row.description}>
                            {row.description}
                          </td>
                          <td className="px-3.5 py-3 text-slate-400 whitespace-nowrap">{row.createdAt}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WALLET HISTORY (Matching video frames 003 & 005) */}
        {activeTab === "history" && (
          <div className="space-y-3.5">
            {/* Sub-Header matching video: "Usage history · Reseller Seats / WhatsApp Messages" */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <h2 className="text-sm font-semibold text-slate-200">
                Usage history · {walletBucket}
              </h2>

              <div className="flex items-center gap-2">
                {/* Bucket Dropdown matching video frame 003 / 005 */}
                <div className="relative">
                  <button
                    onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#0c1220] hover:bg-[#111a2d] text-xs font-medium text-slate-200 cursor-pointer"
                  >
                    <span>{walletBucket}</span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </button>

                  {walletDropdownOpen && (
                    <div className="absolute right-0 top-9 z-20 w-48 rounded-xl bg-[#0d1322] border border-[#1e293b] shadow-2xl py-1 text-xs text-slate-200 animate-in fade-in-50 duration-100">
                      {(["Reseller Seats", "WhatsApp Messages", "Verification Wallet"] as WalletBucket[]).map((w) => (
                        <button
                          key={w}
                          onClick={() => {
                            setWalletBucket(w);
                            setWalletDropdownOpen(false);
                            showToast(`Switched bucket: ${w}`);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition-colors cursor-pointer ${
                            walletBucket === w ? "text-blue-400 font-semibold bg-blue-500/10" : ""
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExportTransactions}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#0c1220] hover:bg-[#111a2d] text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
                >
                  <Download size={13} className="text-slate-400" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="bg-[#0c1220] border border-[#1e293b] text-slate-200 rounded px-1.5 py-0.5 text-xs focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>

              <div className="relative w-full sm:w-80">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by reason, description, ref..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Table matching video frame 003 / 005 */}
            <div className="bg-[#0c1220] border border-[#182235] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#182235] bg-[#0a0f1d] text-slate-400 font-semibold text-[11px]">
                      <th className="px-3.5 py-3 w-16">Sr.No</th>
                      <th className="px-3.5 py-3 w-28">Type</th>
                      <th className="px-3.5 py-3">Amount</th>
                      <th className="px-3.5 py-3">Balance After</th>
                      <th className="px-3.5 py-3">Reason</th>
                      <th className="px-3.5 py-3 min-w-[280px]">Description</th>
                      <th className="px-3.5 py-3 whitespace-nowrap">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141d30]">
                    {filteredUsageHistory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-14 text-center text-slate-400 text-xs font-medium">
                          No transactions yet.
                        </td>
                      </tr>
                    ) : (
                      filteredUsageHistory.map((row) => (
                        <tr key={row.srNo} className="hover:bg-[#10182b] transition-colors">
                          <td className="px-3.5 py-3 text-slate-400">{row.srNo}</td>
                          <td className="px-3.5 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <ArrowUpRight size={11} className="stroke-[2.5]" />
                              <span>{row.type}</span>
                            </span>
                          </td>
                          <td className="px-3.5 py-3 font-semibold text-rose-400">-{row.amount.toFixed(2)}</td>
                          <td className="px-3.5 py-3 text-slate-300 font-mono">{row.balanceAfter.toFixed(2)}</td>
                          <td className="px-3.5 py-3 text-slate-200 font-medium">{row.reason}</td>
                          <td className="px-3.5 py-3 text-slate-400">{row.description}</td>
                          <td className="px-3.5 py-3 text-slate-400 whitespace-nowrap">{row.createdAt}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTION & INVOICES (Matching video frame 026) */}
        {activeTab === "subscriptions" && (
          <div className="space-y-4">
            {/* Header section matching frame 026 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">Purchases & Invoices</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  All paid subscription seats and wallet recharges. Download a GST invoice per row.
                </p>
              </div>

              {/* Lifetime Spend Badge */}
              <div className="text-right shrink-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  LIFETIME SPEND
                </div>
                <div className="text-xl font-bold text-white tracking-tight mt-0.5">
                  ₹{lifetimeSpend.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-[#0c1220] border border-[#182235] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#182235] bg-[#0a0f1d] text-slate-400 font-semibold text-[11px]">
                      <th className="px-3.5 py-3 w-32">Date</th>
                      <th className="px-3.5 py-3 w-28">Type</th>
                      <th className="px-3.5 py-3 min-w-[280px]">Description</th>
                      <th className="px-3.5 py-3">Amount Paid</th>
                      <th className="px-3.5 py-3">Payment Ref</th>
                      <th className="px-3.5 py-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141d30]">
                    {purchases.map((p) => (
                      <tr key={p.id} className="hover:bg-[#10182b] transition-colors">
                        <td className="px-3.5 py-3 text-slate-300 whitespace-nowrap">{p.date}</td>
                        <td className="px-3.5 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              p.type === "SEATS"
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {p.type}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-slate-200 font-medium">{p.description}</td>
                        <td className="px-3.5 py-3 font-semibold text-white">
                          ₹{p.amountPaid.toLocaleString("en-IN")}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-slate-400 text-[11px]">
                          {p.paymentRef}
                        </td>
                        <td className="px-3.5 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedInvoice(p)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#1e293b] bg-[#0d1322] hover:bg-[#152033] text-[11px] font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
                          >
                            <FileText size={12} className="text-blue-400" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footnote matching video frame 026 */}
            <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
              Showing the most recent purchases. Wallet rows reflect the currently-selected credit type (Verification Wallet); switch the credit filter on Transaction History to see other buckets.
            </p>
          </div>
        )}

        {/* TAB 4: API USAGE SUMMARY (Matching video frames 011 & 024) */}
        {activeTab === "usage-summary" && (
          <div className="space-y-4">
            {/* 4 Summary Cards matching frame 011 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-[#0c1220] border border-[#182235] shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  TOTAL HITS
                </div>
                <div className="mt-2 text-2xl font-bold text-white tracking-tight">7</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1220] border border-[#182235] shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  SUCCESSFUL
                </div>
                <div className="mt-2 text-2xl font-bold text-white tracking-tight">2</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1220] border border-[#182235] shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  FAILED / REFUNDED
                </div>
                <div className="mt-2 text-2xl font-bold text-white tracking-tight">0 / 5</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1220] border border-[#182235] shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  SPENT ON API HITS
                </div>
                <div className="mt-2 text-2xl font-bold text-white tracking-tight">₹0.50</div>
              </div>
            </div>

            {/* USAGE BY API Table matching frame 011 */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                USAGE BY API
              </h3>
              <div className="bg-[#0c1220] border border-[#182235] rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#182235] bg-[#0a0f1d] text-slate-400 font-semibold text-[11px]">
                        <th className="px-3.5 py-3">SOURCE</th>
                        <th className="px-3.5 py-3">API</th>
                        <th className="px-3.5 py-3">HITS</th>
                        <th className="px-3.5 py-3">AVG / HIT</th>
                        <th className="px-3.5 py-3">SPENT</th>
                        <th className="px-3.5 py-3">SHARE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#141d30]">
                      <tr className="hover:bg-[#10182b] transition-colors">
                        <td className="px-3.5 py-3 text-slate-300 font-medium">API Sathi</td>
                        <td className="px-3.5 py-3 text-white font-semibold">Credit Report V1</td>
                        <td className="px-3.5 py-3 text-slate-200">7</td>
                        <td className="px-3.5 py-3 text-slate-300 font-mono">₹0.07</td>
                        <td className="px-3.5 py-3 text-slate-200 font-semibold">₹0.50</td>
                        <td className="px-3.5 py-3 text-slate-300">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: API USAGE LEDGER (Matching video frame 008) */}
        {activeTab === "usage-ledger" && (
          <div className="space-y-3.5">
            {/* Header Row matching frame 008: "7 hits", Search, Status filter, Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-sm font-semibold text-slate-200">
                {filteredLedger.length} hits
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Search input */}
                <div className="relative w-64 sm:w-72">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search API, person, error, reference..."
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    className="w-full pl-7 pr-3 py-1 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#0c1220] hover:bg-[#111a2d] text-xs font-medium text-slate-200 cursor-pointer"
                  >
                    <span>{ledgerStatusFilter}</span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute right-0 top-9 z-20 w-36 rounded-xl bg-[#0d1322] border border-[#1e293b] shadow-2xl py-1 text-xs text-slate-200 animate-in fade-in-50 duration-100">
                      {["All statuses", "Success", "Refunded", "Failed"].map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setLedgerStatusFilter(st);
                            setStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition-colors cursor-pointer ${
                            ledgerStatusFilter === st ? "text-blue-400 font-semibold" : ""
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExportLedger}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#0c1220] hover:bg-[#111a2d] text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
                >
                  <Download size={13} className="text-slate-400" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Table matching frame 008 */}
            <div className="bg-[#0c1220] border border-[#182235] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#182235] bg-[#0a0f1d] text-slate-400 font-semibold text-[11px]">
                      <th className="px-3.5 py-3">WHEN</th>
                      <th className="px-3.5 py-3">SOURCE</th>
                      <th className="px-3.5 py-3">API</th>
                      <th className="px-3.5 py-3">RUN BY</th>
                      <th className="px-3.5 py-3">STATUS</th>
                      <th className="px-3.5 py-3">COST</th>
                      <th className="px-3.5 py-3 min-w-[240px]">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141d30]">
                    {filteredLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-[#10182b] transition-colors">
                        <td className="px-3.5 py-3 text-slate-300 whitespace-nowrap">{row.when}</td>
                        <td className="px-3.5 py-3 text-slate-300 font-medium">{row.source}</td>
                        <td className="px-3.5 py-3 text-white font-semibold">{row.api}</td>
                        <td className="px-3.5 py-3 text-slate-300 uppercase tracking-wider text-[11px]">
                          {row.runBy}
                        </td>
                        <td className="px-3.5 py-3 whitespace-nowrap">
                          {row.status === "Success" ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Refunded
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-3 font-semibold text-slate-200">
                          {row.cost !== null ? `₹${row.cost.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-3.5 py-3">
                          {row.details === "—" ? (
                            <span className="text-slate-500">—</span>
                          ) : (
                            <button
                              onClick={() => setSelectedLedgerRow(row)}
                              className="font-mono text-[11px] text-amber-300/80 hover:text-amber-200 hover:underline truncate max-w-xs block text-left cursor-pointer"
                              title={row.details}
                            >
                              {row.details}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: API PRICING (Matching video frame 020) */}
        {activeTab === "pricing" && (
          <div className="space-y-4">
            {/* Header matching frame 020 */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pt-1">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">API pricing</h2>
                <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                  Price per call, charged to your Verification Wallet. Calls that fail at the provider are refunded to your wallet.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search APIs..."
                  value={pricingSearch}
                  onChange={(e) => setPricingSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 text-xs bg-[#0c1220] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter Pills matching frame 020 */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {[
                "All (26)",
                "Credit bureau (3)",
                "Bank statement (3)",
                "GST / KYB (5)",
                "Company & directors (7)",
                "Employment (EPFO) (4)",
                "Vehicle (2)",
                "e-Sign (1)",
                "SMS (1)"
              ].map((cat) => {
                const active = pricingCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setPricingCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? "bg-[#18233a] text-blue-400 font-semibold border border-blue-500/30"
                        : "bg-[#0c1220] text-slate-400 hover:text-slate-200 border border-[#1e293b]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Table matching frame 020 */}
            <div className="bg-[#0c1220] border border-[#182235] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#182235] bg-[#0a0f1d] text-slate-400 font-semibold text-[11px]">
                      <th className="px-3.5 py-3 w-[360px] min-w-[280px]">API</th>
                      <th className="px-3.5 py-3">Category</th>
                      <th className="px-3.5 py-3">Where you use it</th>
                      <th className="px-3.5 py-3 text-right">Price / call</th>
                      <th className="px-3.5 py-3 text-right">Your balance covers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141d30]">
                    {filteredPricing.map((item) => {
                      const affordableCalls = Math.floor(verificationCredits / item.price);
                      return (
                        <tr key={item.id} className="hover:bg-[#10182b] transition-colors">
                          <td className="px-3.5 py-3">
                            <div className="font-semibold text-white text-xs">{item.name}</div>
                            <div className="text-[10.5px] text-slate-400 mt-0.5 leading-snug">
                              {item.subtext}
                            </div>
                          </td>
                          <td className="px-3.5 py-3 text-slate-300 font-medium whitespace-nowrap">
                            {item.category}
                          </td>
                          <td className="px-3.5 py-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {item.whereUsed}
                          </td>
                          <td className="px-3.5 py-3 text-right font-bold text-white whitespace-nowrap">
                            ₹{item.price.toFixed(item.price % 1 === 0 ? 0 : 2)}
                          </td>
                          <td className="px-3.5 py-3 text-right whitespace-nowrap">
                            <span
                              className={`font-semibold ${
                                affordableCalls > 0 ? "text-emerald-400" : "text-slate-400"
                              }`}
                            >
                              {affordableCalls} {affordableCalls === 1 ? "call" : "calls"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RECHARGE MODAL */}
      {rechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Recharge Verification Wallet</h3>
              </div>
              <button
                onClick={() => setRechargeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Select or enter an amount to top up your verification credits. Credits reflect instantly across your account.
            </p>

            <form onSubmit={handleRechargeSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Preset Top-Up Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setRechargeAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        rechargeAmount === amt
                          ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                          : "bg-[#0d1322] text-slate-300 border-[#1e293b] hover:border-slate-500"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Custom Amount (₹)</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-[#0d1322] border border-[#1e293b] rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: "upi", label: "UPI / QR", icon: QrCode },
                    { id: "card", label: "Cards", icon: CreditCard },
                    { id: "netbanking", label: "NetBanking", icon: Building2 }
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setRechargeMethod(m.id)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          rechargeMethod === m.id
                            ? "border-blue-500 bg-blue-500/15 text-blue-300 font-semibold"
                            : "border-[#1e293b] bg-[#0d1322] text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Icon size={16} />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setRechargeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#1e293b] text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30 cursor-pointer transition-colors"
                >
                  Pay ₹{rechargeAmount.toLocaleString("en-IN")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE VIEWER MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Top */}
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-400" />
                <h3 className="text-base font-bold text-white tracking-tight">GST Tax Invoice</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Invoice Printable View */}
            <div className="bg-[#090d16] border border-[#182235] rounded-xl p-5 space-y-4 text-xs font-sans text-slate-300">
              <div className="flex items-start justify-between border-b border-[#182235] pb-4">
                <div>
                  <div className="text-lg font-bold text-white tracking-tight">TELEPORT TECHNOLOGIES</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    GSTIN: 27AABCT1234F1Z8 · PAN: AABCT1234F
                  </div>
                  <div className="text-[11px] text-slate-400">
                    BKC, Bandra East, Mumbai, Maharashtra 400051
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                    TAX INVOICE
                  </div>
                  <div className="font-mono text-white text-xs mt-0.5 font-bold">
                    {selectedInvoice.invoiceNo}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Date: {selectedInvoice.date}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 border-b border-[#182235] pb-3 text-[11.5px]">
                <div>
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                    BILLED TO:
                  </div>
                  <div className="font-semibold text-white">Sniper Electric Private Limited</div>
                  <div className="text-slate-400">Tenant Code: DS101</div>
                  <div className="text-slate-400">State: Maharashtra (27)</div>
                </div>
                <div>
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                    PAYMENT DETAILS:
                  </div>
                  <div>Mode: Online Razorpay Payment</div>
                  <div className="font-mono text-slate-400">Ref: {selectedInvoice.paymentRef}</div>
                  <div className="text-emerald-400 font-semibold mt-0.5">Status: PAID IN FULL</div>
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-[#182235] pb-1.5">
                  <span>ITEM DESCRIPTION</span>
                  <span>AMOUNT (INR)</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-200">
                  <span>{selectedInvoice.description}</span>
                  <span className="font-mono font-medium">
                    ₹{(selectedInvoice.amountPaid / 1.18).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-0.5 text-[11px] text-slate-400">
                  <span>CGST (9%)</span>
                  <span className="font-mono">
                    ₹{((selectedInvoice.amountPaid / 1.18) * 0.09).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-0.5 text-[11px] text-slate-400">
                  <span>SGST (9%)</span>
                  <span className="font-mono">
                    ₹{((selectedInvoice.amountPaid / 1.18) * 0.09).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#182235] text-sm font-bold text-white">
                  <span>TOTAL PAID</span>
                  <span className="text-emerald-400 font-mono">
                    ₹{selectedInvoice.amountPaid.toLocaleString("en-IN")}.00
                  </span>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#182235]">
              <button
                onClick={() => {
                  window.print();
                  showToast("Invoice print dialogue launched.");
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#1e293b] bg-[#0d1322] hover:bg-[#152033] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Printer size={13} />
                <span>Print</span>
              </button>
              <button
                onClick={() => {
                  showToast(`Invoice ${selectedInvoice.invoiceNo} downloaded.`);
                  setSelectedInvoice(null);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
              >
                <Download size={13} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEDGER DETAILS MODAL */}
      {selectedLedgerRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-blue-400" />
                <h3 className="text-base font-bold text-white">API Call Payload & Error Details</h3>
              </div>
              <button
                onClick={() => setSelectedLedgerRow(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-400 bg-[#090d16] p-3 rounded-xl border border-[#182235]">
                <div>API: <span className="text-white font-medium">{selectedLedgerRow.api}</span></div>
                <div>When: <span className="text-white font-medium">{selectedLedgerRow.when}</span></div>
                <div>Status: <span className="text-amber-400 font-semibold">{selectedLedgerRow.status}</span></div>
                <div>Run By: <span className="text-white font-medium">{selectedLedgerRow.runBy}</span></div>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                  RESPONSE PAYLOAD
                </span>
                <pre className="text-[11px] font-mono text-amber-300 bg-black/60 p-3 rounded-xl border border-[#182235] overflow-x-auto">
                  {selectedLedgerRow.details}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-[#182235]">
              <button
                onClick={() => setSelectedLedgerRow(null)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sparkle Assistant Button matching bottom right */}
      <button
        onClick={() => showToast("Wallet Intelligence active.")}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 transition-all cursor-pointer z-40"
        title="Wallet Assist"
      >
        <Sparkles size={18} />
      </button>
    </div>
  );
}
