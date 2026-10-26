import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Users, UserCheck, GitBranch, Landmark, Building2, Phone, Mail, Search,
  Plus, Filter, Download, ArrowUpRight, ShieldCheck, ChevronRight, MessageSquare,
  Briefcase, CheckCircle2, Copy, Sparkles, TrendingUp, HelpCircle, Lightbulb,
  X, Check, Edit2, FileText, QrCode, Printer, AlertTriangle, Clock, Calendar,
  Share2, ArrowRight, UserPlus, Sliders, ChevronDown, ChevronLeft, RefreshCw,
  Send, ExternalLink, Eye, Trash2, Key, Globe, FileSpreadsheet, Lock, CheckCircle,
  Calculator, PiggyBank, Scale, Coins, Vault, DollarSign, BarChart3, Play,
  CheckCheck, Inbox, AlertCircle, FileUp, Layers, PieChart, Repeat
} from "lucide-react";
import { api, fmtInr, fmtDate } from "../../lib/api";

// Types
interface Employee {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  branch: string;
  files_fy: string;
  disbursed: string;
  conv_pct: string;
  open: string;
  leads: string;
  leads_cold: number;
  login_status: string; // "today", "never", "inactive"
  status: "active" | "inactive";
  emp_code: string;
  join_date: string;
}

interface Partner {
  id: number;
  name: string;
  type: string; // "Main DSA", "Master DSA", "DSA", "Sub-DSA", "Connector", "Sales Agent"
  parent: string;
  phone: string;
  email: string;
  leads_fy: number;
  disbursed: string;
  conv_pct: string;
  pending: string;
  last_referral: string;
  status: "Active" | "Inactive" | "Dormant";
  login_status: "QR Not created" | "Created";
  created: string;
  commission_pct: number;
}

interface Supplier {
  id: number;
  name: string;
  category: string;
  gstin: string;
  contact: string;
  phone: string;
  email: string;
  spend: string;
  outstanding: number;
  status: "Active" | "Pending";
}

interface Banker {
  id: number;
  name: string;
  role: string;
  is_global: boolean;
  bank: string;
  branch: string;
  city: string;
  phone: string;
  email: string;
  active_apps: number;
  total_apps: number;
  loans: number;
  portal_status: "invited" | "not_invited" | "active";
  status: "Active" | "Inactive";
  products: string[];
}

const SEED_BANKERS_LIST: Banker[] = [
  {
    id: 1,
    name: "AJAY SHINDE",
    role: "RM",
    is_global: true,
    bank: "Hero housing finance ltd",
    branch: "PUNALUR",
    city: "Punalur",
    phone: "+91 77097 90928",
    email: "ajayshinde@gmail.com",
    active_apps: 0,
    total_apps: 0,
    loans: 0,
    portal_status: "not_invited",
    status: "Active",
    products: ["Home Loan", "Loan Against Property"]
  },
  {
    id: 2,
    name: "9645106642",
    role: "EXECUTIVE",
    is_global: true,
    bank: "Hero housing finance ltd",
    branch: "PUNALUR",
    city: "Punalur",
    phone: "+91 96451 06642",
    email: "punalur.branch@herohfl.com",
    active_apps: 0,
    total_apps: 0,
    loans: 0,
    portal_status: "not_invited",
    status: "Active",
    products: ["Home Loan", "Loan Against Property"]
  },
  {
    id: 3,
    name: "98765434567",
    role: "relationship manager",
    is_global: true,
    bank: "AU MALL FINANCE BANK LTD",
    branch: "AU MALL BRANCH",
    city: "Ahmedabad",
    phone: "+91 98765 45678",
    email: "Maaenterprise914@gmail.com",
    active_apps: 0,
    total_apps: 0,
    loans: 0,
    portal_status: "not_invited",
    status: "Active",
    products: ["Personal Loan", "Business Loan", "Vehicle Loan"]
  },
  {
    id: 4,
    name: "AALAP SHAH",
    role: "ASM",
    is_global: true,
    bank: "AU MALL FINANCE BANK LTD",
    branch: "AHMEDABAD",
    city: "Ahmedabad",
    phone: "+91 63596 39630",
    email: "aalap.shah@aubank.in",
    active_apps: 0,
    total_apps: 0,
    loans: 0,
    portal_status: "not_invited",
    status: "Active",
    products: ["Business Loan", "MSME Secured Loan"]
  },
  {
    id: 5,
    name: "AMIT SHARMA",
    role: "Relationship Manager (RM)",
    is_global: false, // 1 Yours
    bank: "HDFC Bank",
    branch: "Fort, Mumbai",
    city: "Mumbai",
    phone: "+91 98201 12345",
    email: "amit.sharma@hdfcbank.com",
    active_apps: 2,
    total_apps: 14,
    loans: 8,
    portal_status: "active",
    status: "Active",
    products: ["Personal Loan", "Business Loan", "Home Loan"]
  },
  {
    id: 6,
    name: "PRIYA NAIR",
    role: "Credit Processing Associate (CPA)",
    is_global: true,
    bank: "ICICI Bank",
    branch: "Bandra Kurla Complex",
    city: "Mumbai",
    phone: "+91 98202 23456",
    email: "priya.nair@icicibank.com",
    active_apps: 1,
    total_apps: 9,
    loans: 6,
    portal_status: "not_invited",
    status: "Active",
    products: ["Personal Loan", "Business Loan"]
  },
  {
    id: 7,
    name: "RAHUL DESHMUKH",
    role: "Branch Manager (BM)",
    is_global: true,
    bank: "Axis Bank",
    branch: "Shivaji Nagar",
    city: "Pune",
    phone: "+91 98203 34567",
    email: "rahul.deshmukh@axisbank.com",
    active_apps: 0,
    total_apps: 4,
    loans: 3,
    portal_status: "not_invited",
    status: "Active",
    products: ["Business Loan", "Loan Against Property"]
  },
  {
    id: 8,
    name: "SURESH MENON",
    role: "Chief Manager (SME)",
    is_global: true,
    bank: "State Bank of India",
    branch: "Connaught Place",
    city: "Delhi",
    phone: "+91 98204 45678",
    email: "suresh.menon@sbi.co.in",
    active_apps: 0,
    total_apps: 11,
    loans: 7,
    portal_status: "not_invited",
    status: "Active",
    products: ["MSME Term Loan", "Cash Credit", "CGTMSE"]
  },
  {
    id: 9,
    name: "NEHA VERMA",
    role: "Area Sales Manager (ASM)",
    is_global: true,
    bank: "Kotak Mahindra Bank",
    branch: "Indiranagar",
    city: "Bengaluru",
    phone: "+91 98205 56789",
    email: "neha.verma@kotak.com",
    active_apps: 0,
    total_apps: 6,
    loans: 4,
    portal_status: "not_invited",
    status: "Active",
    products: ["Personal Loan", "Doctor Loan"]
  },
  {
    id: 10,
    name: "VIKRAM SINGHANIA",
    role: "Regional Head - Commercial",
    is_global: true,
    bank: "TVS Credit",
    branch: "T. Nagar",
    city: "Chennai",
    phone: "+91 98206 67890",
    email: "vikram.s@tvscredit.com",
    active_apps: 0,
    total_apps: 15,
    loans: 12,
    portal_status: "not_invited",
    status: "Active",
    products: ["Commercial Vehicle Loan", "Used Car Loan"]
  },
  {
    id: 11,
    name: "RITU AGGARWAL",
    role: "Relationship Manager (PL/BL)",
    is_global: true,
    bank: "Bajaj Finance",
    branch: "Sector 18",
    city: "Noida",
    phone: "+91 98207 78901",
    email: "ritu.aggarwal@bajajfinserv.in",
    active_apps: 0,
    total_apps: 8,
    loans: 5,
    portal_status: "not_invited",
    status: "Active",
    products: ["Personal Loan", "Business Loan", "Professional Loan"]
  },
  {
    id: 12,
    name: "KUNAL BANSAL",
    role: "Zonal Credit Head",
    is_global: true,
    bank: "IDFC FIRST Bank",
    branch: "C.G. Road",
    city: "Ahmedabad",
    phone: "+91 98208 89012",
    email: "kunal.b@idfcfirstbank.com",
    active_apps: 0,
    total_apps: 7,
    loans: 4,
    portal_status: "not_invited",
    status: "Active",
    products: ["Home Loan", "Balance Transfer"]
  }
];

export function GnTeam() {
  const loc = useLocation();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();

  // Active section from search param ?tab=... or default to "employees" (matching user's screenshot)
  const activeTab = useMemo(() => {
    const t = params.get("tab");
    if (t) return t.toLowerCase();
    if (loc.pathname === "/partners") return "partners";
    if (loc.pathname === "/team-tree") return "tree";
    if (loc.pathname === "/suppliers") return "suppliers";
    if (loc.pathname === "/banker-master") return "bankers";
    return "employees";
  }, [params, loc.pathname]);

  // Notice banner state
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const [partnerNoticeDismissed, setPartnerNoticeDismissed] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  // ============================================================================
  // 1. EMPLOYEES STATE (Matches Screenshot 1 Exactly)
  // ============================================================================
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "ASHISH MAHAJAN",
      role: "no role",
      phone: "9850198506",
      email: "ashish@sniperelectric.in",
      branch: "—",
      files_fy: "—",
      disbursed: "—",
      conv_pct: "—",
      open: "—",
      leads: "—",
      leads_cold: 0,
      login_status: "never",
      status: "active",
      emp_code: "EMP-DS101-02",
      join_date: "01 Feb 2026"
    },
    {
      id: 2,
      name: "VIVEK MAHAJAN",
      role: "Owner",
      phone: "919764044044",
      email: "vivek@sniperelectric.in",
      branch: "—",
      files_fy: "—",
      disbursed: "—",
      conv_pct: "—",
      open: "—",
      leads: "1 - 1 cold",
      leads_cold: 1,
      login_status: "today",
      status: "active",
      emp_code: "EMP-DS101-01",
      join_date: "15 Jan 2024"
    }
  ]);
  const [employeeSearch, setEmployeeSearch] = useState("");

  // Modals for Employees
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [idCardEmployee, setIdCardEmployee] = useState<Employee | null>(null);
  const [relievingEmployee, setRelievingEmployee] = useState<Employee | null>(null);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    phone: "",
    email: "",
    role: "Sales Executive",
    branch: "Head Office (Mumbai)"
  });

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    if (!employeeSearch.trim()) return employees;
    const q = employeeSearch.toLowerCase();
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.branch.toLowerCase().includes(q)
    );
  }, [employees, employeeSearch]);

  const handleExportEmployeesCSV = () => {
    const headers = "Employee,Role,Phone,Email,Branch,FilesFY,Disbursed,Leads,Status\n";
    const rows = employees
      .map((e) => `"${e.name}","${e.role}","${e.phone}","${e.email}","${e.branch}","${e.files_fy}","${e.disbursed}","${e.leads}","${e.status}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Employees_Roster_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Employee Roster exported to CSV.");
  };

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.phone) return;
    const added: Employee = {
      id: Date.now(),
      name: newEmployee.name.toUpperCase(),
      role: newEmployee.role,
      phone: newEmployee.phone,
      email: newEmployee.email || `${newEmployee.name.toLowerCase().replace(/\s+/g, "")}@sniperelectric.in`,
      branch: newEmployee.branch,
      files_fy: "—",
      disbursed: "—",
      conv_pct: "—",
      open: "—",
      leads: "—",
      leads_cold: 0,
      login_status: "never",
      status: "active",
      emp_code: `EMP-DS101-0${employees.length + 1}`,
      join_date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    };
    setEmployees([...employees, added]);
    setAddEmployeeOpen(false);
    setNewEmployee({ name: "", phone: "", email: "", role: "Sales Executive", branch: "Head Office (Mumbai)" });
    showToast(`Added employee seat for ${added.name}!`);
  };

  const handleSaveEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmployee) return;
    setEmployees(employees.map((emp) => (emp.id === editEmployee.id ? editEmployee : emp)));
    showToast(`Saved changes for ${editEmployee.name}.`);
    setEditEmployee(null);
  };

  // ============================================================================
  // 2. PARTNERS STATE (Matches Screenshot 2 Exactly)
  // ============================================================================
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: 1,
      name: "ASHISH GUPTA",
      type: "Main DSA",
      parent: "ASHISH MAHAJAN",
      phone: "9075007700",
      email: "ashish.gupta@genesisdsa.com",
      leads_fy: 2,
      disbursed: "—",
      conv_pct: "0%",
      pending: "—",
      last_referral: "today",
      status: "Active",
      login_status: "QR Not created",
      created: "16 Mar",
      commission_pct: 0.60
    }
  ]);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("All");
  const [partnerStatusFilter, setPartnerStatusFilter] = useState("All");
  const [partnerTabFilter, setPartnerTabFilter] = useState<"all" | "earning" | "dormant" | "payout_due">("all");

  // Modals for Partners
  const [addPartnerOpen, setAddPartnerOpen] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [idCardPartner, setIdCardPartner] = useState<Partner | null>(null);
  const [statementPartner, setStatementPartner] = useState<Partner | null>(null);
  const [createLoginPartner, setCreateLoginPartner] = useState<Partner | null>(null);
  const [shareSignupModalOpen, setShareSignupModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    type: "Main DSA",
    parent: "ASHISH MAHAJAN",
    phone: "",
    email: "",
    commission_pct: "0.50"
  });

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchSearch =
        !partnerSearch.trim() ||
        p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
        p.phone.includes(partnerSearch) ||
        p.type.toLowerCase().includes(partnerSearch.toLowerCase());
      const matchType = partnerTypeFilter === "All" || p.type === partnerTypeFilter;
      const matchStatus = partnerStatusFilter === "All" || p.status === partnerStatusFilter;
      const matchTab =
        partnerTabFilter === "all" ||
        (partnerTabFilter === "earning" && p.leads_fy > 0) ||
        (partnerTabFilter === "dormant" && p.status === "Dormant") ||
        (partnerTabFilter === "payout_due" && p.pending !== "—");
      return matchSearch && matchType && matchStatus && matchTab;
    });
  }, [partners, partnerSearch, partnerTypeFilter, partnerStatusFilter, partnerTabFilter]);

  const handleAddPartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.phone) return;
    const added: Partner = {
      id: Date.now(),
      name: newPartner.name.toUpperCase(),
      type: newPartner.type,
      parent: newPartner.parent,
      phone: newPartner.phone,
      email: newPartner.email || `${newPartner.name.toLowerCase().replace(/\s+/g, "")}@dsa-partner.in`,
      leads_fy: 0,
      disbursed: "—",
      conv_pct: "0%",
      pending: "—",
      last_referral: "Never",
      status: "Active",
      login_status: "QR Not created",
      created: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      commission_pct: parseFloat(newPartner.commission_pct) || 0.50
    };
    setPartners([...partners, added]);
    setAddPartnerOpen(false);
    setNewPartner({ name: "", type: "Main DSA", parent: "ASHISH MAHAJAN", phone: "", email: "", commission_pct: "0.50" });
    showToast(`Added channel partner ${added.name}!`);
  };

  const handleSaveEditPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPartner) return;
    setPartners(partners.map((p) => (p.id === editPartner.id ? editPartner : p)));
    showToast(`Updated partner ${editPartner.name}.`);
    setEditPartner(null);
  };

  // ============================================================================
  // 3. TEAM TREE STATE (Matches Screenshot 3 Exactly)
  // ============================================================================
  const [treeSearch, setTreeSearch] = useState("");
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>({
    root: true,
    node_ashish_m: true,
    node_ashish_g: true
  });
  const [treeViewMode, setTreeViewMode] = useState<"view1" | "view2" | "view3">("view1");
  const [reassignNode, setReassignNode] = useState<{ id: string; name: string; currentParent: string } | null>(null);

  // ============================================================================
  // 4. SUPPLIERS STATE (Matches Screenshot 4 Exactly)
  // ============================================================================
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // Starts at 0 matching screenshot 4
  const [supplierSearch, setSupplierSearch] = useState("");
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    category: "KYC & Bureau Verification",
    gstin: "",
    contact: "",
    phone: "",
    email: "",
    spend: "₹15,000/mo"
  });

  const filteredSuppliers = useMemo(() => {
    if (!supplierSearch.trim()) return suppliers;
    const q = supplierSearch.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.gstin.toLowerCase().includes(q) ||
        s.contact.toLowerCase().includes(q)
    );
  }, [suppliers, supplierSearch]);

  const handleAddSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name) return;
    const added: Supplier = {
      id: Date.now(),
      name: newSupplier.name,
      category: newSupplier.category,
      gstin: newSupplier.gstin || "27AABCS1429B1Z8",
      contact: newSupplier.contact || "Accounts Dept",
      phone: newSupplier.phone || "+91 98200 00000",
      email: newSupplier.email || "billing@supplier.com",
      spend: newSupplier.spend,
      outstanding: 0,
      status: "Active"
    };
    setSuppliers([...suppliers, added]);
    setAddSupplierOpen(false);
    setNewSupplier({ name: "", category: "KYC & Bureau Verification", gstin: "", contact: "", phone: "", email: "", spend: "₹15,000/mo" });
    showToast(`Added supplier ${added.name}.`);
  };

  // ============================================================================
  // 5. BANKER DIRECTORY STATE (Matches Screenshot 5 + ACTION SECTION)
  // ============================================================================
  const [bankers, setBankers] = useState<Banker[]>(SEED_BANKERS_LIST);
  const [bankerSearch, setBankerSearch] = useState("");
  const [bankerBankFilter, setBankerBankFilter] = useState("All banks");
  const [bankerProductFilter, setBankerProductFilter] = useState("All products");
  const [bankerCityFilter, setBankerCityFilter] = useState("All");
  const [bankerScopeFilter, setBankerScopeFilter] = useState("All (mine + global)");

  // Modals for Bankers & Actions
  const [shareFileModalBanker, setShareFileModalBanker] = useState<Banker | null>(null);
  const [editBanker, setEditBanker] = useState<Banker | null>(null);
  const [profileBanker, setProfileBanker] = useState<Banker | null>(null);
  const [addBankerOpen, setAddBankerOpen] = useState(false);
  const [selectedApplicantForBanker, setSelectedApplicantForBanker] = useState("OMKAR - Personal Loan (₹8,00,000)");

  const [newBanker, setNewBanker] = useState({
    name: "",
    role: "Relationship Manager (RM)",
    bank: "HDFC Bank",
    branch: "",
    city: "Mumbai",
    phone: "",
    email: "",
    product: "Personal Loan"
  });

  const filteredBankers = useMemo(() => {
    return bankers.filter((b) => {
      const q = bankerSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.bank.toLowerCase().includes(q) ||
        b.branch.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.email.toLowerCase().includes(q);

      const matchBank =
        bankerBankFilter === "All banks" ||
        b.bank.toLowerCase().includes(bankerBankFilter.toLowerCase().replace(" bank", ""));

      const matchProduct =
        bankerProductFilter === "All products" ||
        b.products.some((p) => p.toLowerCase().includes(bankerProductFilter.toLowerCase()));

      const matchCity =
        bankerCityFilter === "All" ||
        b.city.toLowerCase() === bankerCityFilter.toLowerCase();

      const matchScope =
        bankerScopeFilter === "All (mine + global)" ||
        (bankerScopeFilter === "Mine only" && !b.is_global) ||
        (bankerScopeFilter === "Global shared" && b.is_global);

      return matchSearch && matchBank && matchProduct && matchCity && matchScope;
    });
  }, [bankers, bankerSearch, bankerBankFilter, bankerProductFilter, bankerCityFilter, bankerScopeFilter]);

  const handleInviteBanker = (bankerId: number) => {
    setBankers(
      bankers.map((b) => (b.id === bankerId ? { ...b, portal_status: "invited" } : b))
    );
    showToast("Portal invitation email & SMS dispatched to banker!");
  };

  const handleSendFileToBanker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareFileModalBanker) return;
    showToast(`Loan Dossier for ${selectedApplicantForBanker} dispatched to ${shareFileModalBanker.name} (${shareFileModalBanker.bank})!`);
    setShareFileModalBanker(null);
  };

  const handleAddBankerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanker.name || !newBanker.phone) return;
    const added: Banker = {
      id: Date.now(),
      name: newBanker.name.toUpperCase(),
      role: newBanker.role,
      is_global: false,
      bank: newBanker.bank,
      branch: newBanker.branch || "Main Branch",
      city: newBanker.city,
      phone: newBanker.phone,
      email: newBanker.email || `${newBanker.name.toLowerCase().replace(/\s+/g, "")}@bank.com`,
      active_apps: 0,
      total_apps: 0,
      loans: 0,
      portal_status: "not_invited",
      status: "Active",
      products: [newBanker.product]
    };
    setBankers([added, ...bankers]);
    setAddBankerOpen(false);
    setNewBanker({ name: "", role: "Relationship Manager (RM)", bank: "HDFC Bank", branch: "", city: "Mumbai", phone: "", email: "", product: "Personal Loan" });
    showToast(`Added ${added.name} to your banker roster!`);
  };

  const handleSaveEditBanker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBanker) return;
    setBankers(bankers.map((b) => (b.id === editBanker.id ? editBanker : b)));
    showToast(`Updated details for ${editBanker.name}.`);
    setEditBanker(null);
  };

  // ============================================================================
  // 6. TOOLS STATE (Approvals, Tasks, Bulk Import, Bulk Assign, Tools)
  // ============================================================================

  // --- APPROVALS (Screenshot 1) ---
  const [approvalsStatusTab, setApprovalsStatusTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [approvalsCategory, setApprovalsCategory] = useState<"All" | "Leave" | "Expenses" | "Conveyance" | "Fee Waivers">("All");
  const [approvals, setApprovals] = useState<Array<{
    id: number;
    member: string;
    type: "Leave" | "Expenses" | "Conveyance" | "Fee Waivers";
    details: string;
    date: string;
    amount?: string;
    status: "Pending" | "Approved" | "Rejected";
  }>>([]);
  const [requestApprovalModalOpen, setRequestApprovalModalOpen] = useState(false);
  const [newApproval, setNewApproval] = useState<{
    member: string;
    type: "Leave" | "Expenses" | "Conveyance" | "Fee Waivers";
    details: string;
    amount: string;
  }>({
    member: "ASHISH MAHAJAN",
    type: "Leave",
    details: "Sick Leave (2 Days: 22-23 Oct)",
    amount: ""
  });

  // --- TASKS (Screenshot 2) ---
  const [tasksNoticeDismissed, setTasksNoticeDismissed] = useState(false);
  const [tasksFilterTab, setTasksFilterTab] = useState<"All Tasks" | "Pending" | "In Progress" | "Completed">("All Tasks");
  const [tasksEmployeeFilter, setTasksEmployeeFilter] = useState("All employees");
  const [tasks, setTasks] = useState<Array<{
    id: number;
    title: string;
    leadName?: string;
    assignee: string;
    priority: "High" | "Medium" | "Low";
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed";
    createdMonth: string;
  }>>([]);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    leadName: "Rahul Sharma (PL-9821)",
    assignee: "VIVEK MAHAJAN",
    priority: "High" as "High" | "Medium" | "Low",
    dueDate: "Today",
    description: ""
  });

  // --- BULK LEAD IMPORT (Screenshot 3) ---
  const [importHistory, setImportHistory] = useState<Array<{
    id: number;
    date: string;
    by: string;
    file: string;
    total: number;
    created: number;
    skipped: number;
    errors: number;
    issues: string;
  }>>([]);
  const [bulkImportToolModalOpen, setBulkImportToolModalOpen] = useState(false);
  const [isSimulatingImport, setIsSimulatingImport] = useState(false);

  // --- BULK LEAD ASSIGN (Screenshot 4) ---
  const [assignConditionAssignedTo, setAssignConditionAssignedTo] = useState("Anyone");
  const [assignConditionStatus, setAssignConditionStatus] = useState("Any status");
  const [assignConditionSource, setAssignConditionSource] = useState("Any source");
  const [assignConditionProduct, setAssignConditionProduct] = useState("Any product");
  const [assignConditionSearch, setAssignConditionSearch] = useState("");
  const [assignTargetMember, setAssignTargetMember] = useState("");
  const [assignedLeadCount, setAssignedLeadCount] = useState(2); // Matches Screenshot 4 "2 leads match this condition"

  // --- FINANCIAL CALCULATORS & TOOLS (Screenshot 5) ---
  const [toolCalcTab, setToolCalcTab] = useState<
    "EMI" | "SIP" | "RD" | "SSY" | "PPF" | "Lumpsum" | "MF Returns" | "Compare ROI" | "Eligibility"
  >("EMI");

  // EMI Calculator State (Screenshot 5 exact defaults)
  const [emiMode, setEmiMode] = useState<"reducing" | "flat">("reducing");
  const [emiLoanAmount, setEmiLoanAmount] = useState<number>(2500000); // 25 Lakhs
  const [emiInterestRate, setEmiInterestRate] = useState<number>(8.5); // 8.5%
  const [emiTenureMonths, setEmiTenureMonths] = useState<number>(240); // 240 months = 20 years

  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState<number>(10000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);

  // RD Calculator State
  const [rdMonthly, setRdMonthly] = useState<number>(5000);
  const [rdRate, setRdRate] = useState<number>(7.1);
  const [rdMonths, setRdMonths] = useState<number>(36);

  // SSY Calculator State
  const [ssyYearly, setSsyYearly] = useState<number>(100000);
  const [ssyYears, setSsyYears] = useState<number>(21);

  // PPF Calculator State
  const [ppfYearly, setPpfYearly] = useState<number>(150000);
  const [ppfYears, setPpfYears] = useState<number>(15);

  // Lumpsum State
  const [lumpAmount, setLumpAmount] = useState<number>(500000);
  const [lumpRate, setLumpRate] = useState<number>(12);
  const [lumpYears, setLumpYears] = useState<number>(5);

  // Eligibility (FOIR) State
  const [eligSalary, setEligSalary] = useState<number>(75000);
  const [eligExistingEmi, setEligExistingEmi] = useState<number>(15000);
  const [eligFoir, setEligFoir] = useState<number>(50);
  const [eligRate, setEligRate] = useState<number>(8.5);
  const [eligTenureMonths, setEligTenureMonths] = useState<number>(240);

  // --- CALCULATOR COMPUTATIONS ---
  // EMI Computations (Matches Screenshot 5: ₹21,696 / ₹27.07 L / ₹52.07 L / 52% Interest / 48% Principal)
  const emiCalc = useMemo(() => {
    const P = Number(emiLoanAmount) || 0;
    const annualR = Number(emiInterestRate) || 0;
    const n = Number(emiTenureMonths) || 1;
    let monthlyEmi = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (emiMode === "reducing") {
      const r = (annualR / 12) / 100;
      if (r === 0 || n === 0) {
        monthlyEmi = n > 0 ? P / n : 0;
      } else {
        monthlyEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
      totalPayment = monthlyEmi * n;
      totalInterest = Math.max(0, totalPayment - P);
    } else {
      // Flat Rate
      totalInterest = P * (annualR / 100) * (n / 12);
      totalPayment = P + totalInterest;
      monthlyEmi = totalPayment / n;
    }

    const interestPct = totalPayment > 0 ? Math.round((totalInterest / totalPayment) * 100) : 0;
    const principalPct = 100 - interestPct;

    // Yearly amortization breakdown for the stacked bar chart (Screenshot 5)
    const tenureYears = Math.min(30, Math.ceil(n / 12));
    const yearlyData = [];
    let balance = P;
    const monthlyRate = (annualR / 12) / 100;

    for (let y = 1; y <= tenureYears; y++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      const monthsInYear = Math.min(12, n - (y - 1) * 12);

      for (let m = 0; m < monthsInYear; m++) {
        const intPayment = emiMode === "reducing" ? balance * monthlyRate : (P * (annualR / 100)) / 12;
        const prinPayment = Math.min(balance, monthlyEmi - intPayment);
        yearInterest += intPayment;
        yearPrincipal += prinPayment;
        balance = Math.max(0, balance - prinPayment);
      }

      yearlyData.push({
        year: y,
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        balance: Math.round(balance)
      });
    }

    return {
      monthlyEmi: Math.round(monthlyEmi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      interestPct,
      principalPct,
      yearlyData,
      totalInterestLakhs: (totalInterest / 100000).toFixed(2),
      totalPaymentLakhs: (totalPayment / 100000).toFixed(2)
    };
  }, [emiLoanAmount, emiInterestRate, emiTenureMonths, emiMode]);

  // SIP Computation
  const sipCalc = useMemo(() => {
    const P = Number(sipMonthly) || 0;
    const i = (Number(sipRate) || 0) / 12 / 100;
    const n = (Number(sipYears) || 1) * 12;
    const invested = P * n;
    const maturity = i === 0 ? invested : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const returns = Math.max(0, maturity - invested);
    return {
      invested: Math.round(invested),
      returns: Math.round(returns),
      maturity: Math.round(maturity),
      investedLakhs: (invested / 100000).toFixed(2),
      returnsLakhs: (returns / 100000).toFixed(2),
      maturityLakhs: (maturity / 100000).toFixed(2)
    };
  }, [sipMonthly, sipRate, sipYears]);

  // RD Computation
  const rdCalc = useMemo(() => {
    const P = Number(rdMonthly) || 0;
    const r = (Number(rdRate) || 0) / 100;
    const n = Number(rdMonths) || 1;
    const quarters = n / 3;
    const invested = P * n;
    // Standard Indian compound RD formula (compounded quarterly)
    let maturity = 0;
    for (let m = 1; m <= n; m++) {
      const t = (n - m + 1) / 12;
      maturity += P * Math.pow(1 + r / 4, 4 * t);
    }
    const returns = Math.max(0, maturity - invested);
    return {
      invested: Math.round(invested),
      returns: Math.round(returns),
      maturity: Math.round(maturity)
    };
  }, [rdMonthly, rdRate, rdMonths]);

  // SSY Computation (8.2% annual compound interest)
  const ssyCalc = useMemo(() => {
    const P = Number(ssyYearly) || 0;
    const r = 0.082; // 8.2%
    let balance = 0;
    let invested = 0;
    for (let y = 1; y <= 21; y++) {
      if (y <= 15) {
        balance += P;
        invested += P;
      }
      balance += balance * r;
    }
    return {
      invested: Math.round(invested),
      returns: Math.round(balance - invested),
      maturity: Math.round(balance)
    };
  }, [ssyYearly]);

  // PPF Computation (7.1% annual compounding)
  const ppfCalc = useMemo(() => {
    const P = Number(ppfYearly) || 0;
    const r = 0.071;
    let balance = 0;
    let invested = 0;
    for (let y = 1; y <= 15; y++) {
      balance += P;
      invested += P;
      balance += balance * r;
    }
    return {
      invested: Math.round(invested),
      returns: Math.round(balance - invested),
      maturity: Math.round(balance)
    };
  }, [ppfYearly]);

  // Lumpsum Computation
  const lumpCalc = useMemo(() => {
    const P = Number(lumpAmount) || 0;
    const r = (Number(lumpRate) || 0) / 100;
    const n = Number(lumpYears) || 1;
    const maturity = P * Math.pow(1 + r, n);
    const returns = Math.max(0, maturity - P);
    return {
      invested: Math.round(P),
      returns: Math.round(returns),
      maturity: Math.round(maturity)
    };
  }, [lumpAmount, lumpRate, lumpYears]);

  // Eligibility / FOIR Computation
  const eligCalc = useMemo(() => {
    const salary = Number(eligSalary) || 0;
    const existing = Number(eligExistingEmi) || 0;
    const foirPct = (Number(eligFoir) || 50) / 100;
    const maxEmiAllowed = Math.max(0, salary * foirPct - existing);
    const r = (Number(eligRate) || 8.5) / 12 / 100;
    const n = Number(eligTenureMonths) || 240;

    let maxLoan = 0;
    if (r > 0 && n > 0) {
      maxLoan = maxEmiAllowed * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    }
    return {
      maxEmiAllowed: Math.round(maxEmiAllowed),
      maxLoan: Math.round(maxLoan),
      maxLoanLakhs: (maxLoan / 100000).toFixed(2)
    };
  }, [eligSalary, eligExistingEmi, eligFoir, eligRate, eligTenureMonths]);

  // Download Sample CSV for Bulk Lead Import
  const handleDownloadSampleCsv = () => {
    const csvContent =
      "ApplicantName,Phone,Email,City,LoanType,LoanAmount,MonthlyIncome\n" +
      "Rahul Sharma,9820123456,rahul.sharma@gmail.com,Mumbai,Personal Loan,2500000,95000\n" +
      "Amit Verma,9811234567,amit.verma@gmail.com,Delhi,Business Loan,5000000,180000\n" +
      "Priya Nair,9876543210,priya.nair@gmail.com,Bengaluru,Green Energy Finance for Individual,1500000,80000\n" +
      "Vikram Singh,9988776655,vikram.singh@gmail.com,Pune,Green Energy Finance for Business,4500000,160000\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "teleport_leads_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded sample lead CSV template.");
  };

  // Execute Bulk Lead Import
  const handleExecuteBulkImport = () => {
    setIsSimulatingImport(true);
    setTimeout(() => {
      const newImportRecord = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        by: "VIVEK MAHAJAN",
        file: "Inbound_Leads_Batch_DS101.csv",
        total: 15,
        created: 15,
        skipped: 0,
        errors: 0,
        issues: "None"
      };
      setImportHistory([newImportRecord, ...importHistory]);
      setIsSimulatingImport(false);
      setBulkImportToolModalOpen(false);
      showToast("Successfully imported 15 new leads into CRM pipeline!");
    }, 900);
  };

  // Execute Bulk Lead Reassignment
  const handleExecuteBulkAssign = () => {
    if (!assignTargetMember) {
      showToast("Please select a target team member to reassign leads.");
      return;
    }
    showToast(`Successfully reassigned ${assignedLeadCount} leads to ${assignTargetMember}!`);
  };

  // Add Task Handler
  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const taskItem = {
      id: Date.now(),
      title: newTask.title.trim(),
      leadName: newTask.leadName,
      assignee: newTask.assignee,
      priority: newTask.priority,
      dueDate: newTask.dueDate || "Today",
      status: "Pending" as const,
      createdMonth: "Oct"
    };
    setTasks([taskItem, ...tasks]);
    setCreateTaskModalOpen(false);
    setNewTask({
      title: "",
      leadName: "Rahul Sharma (PL-9821)",
      assignee: "VIVEK MAHAJAN",
      priority: "High",
      dueDate: "Today",
      description: ""
    });
    showToast(`Task created and assigned to ${taskItem.assignee}!`);
  };

  // Submit Approval Request
  const handleRequestApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appItem = {
      id: Date.now(),
      member: newApproval.member,
      type: newApproval.type,
      details: newApproval.details,
      amount: newApproval.amount,
      date: "Today",
      status: "Pending" as const
    };
    setApprovals([appItem, ...approvals]);
    setRequestApprovalModalOpen(false);
    showToast(`Approval request submitted for ${appItem.member}!`);
  };

  return (
    <div className="min-h-full bg-[#090d16] text-slate-100 p-4 md:p-6 space-y-4 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: EMPLOYEES (Matches Screenshot 1 Exactly)
         ========================================================================= */}
      {activeTab === "employees" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Top Header Bar (Screenshot 1) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                <ChevronLeft size={16} className="cursor-pointer hover:text-white" onClick={() => nav("/dashboard")} />
                <h1 className="text-xl font-bold text-white tracking-tight">Employees</h1>
              </div>
              <div className="text-[11.5px] text-slate-400">Home / Employees</div>
              <p className="text-xs text-slate-300 mt-1">Manage your sales team members, performance and payouts.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkImportOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Download size={13} className="rotate-180" />
                <span>Bulk Import</span>
              </button>
              <button
                onClick={() => setAddEmployeeOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer transition-all"
              >
                <Plus size={14} />
                <span>+ Add Employee</span>
              </button>
              <button
                onClick={() => showToast("Employee list refreshed.")}
                className="p-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-400 hover:text-white cursor-pointer transition-colors"
                title="Refresh Roster"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Top Notice Banner (Screenshot 1) */}
          {!noticeDismissed && (
            <div className="rounded-xl bg-[#0d1627] border border-[#1e2d4d] px-4 py-2.5 flex items-center justify-between text-[12.5px] text-slate-300 shadow-sm">
              <div className="flex items-center gap-2.5 truncate pr-2">
                <Lightbulb size={16} className="text-blue-400 shrink-0" />
                <span className="truncate">
                  Manage your sales team members &nbsp;•&nbsp; Track individual performance & payouts &nbsp;•&nbsp; Assign leads and loans to employees &nbsp;•&nbsp; Generate login credentials for team access
                </span>
              </div>
              <button
                onClick={() => setNoticeDismissed(true)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
                title="Dismiss notice"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Seat Usage Card (Screenshot 1) */}
          <div className="rounded-xl bg-[#0c1424] border border-[#1a2942] p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {employees.length} / 5 employee seats used
                </h3>
                <p className="text-[12px] text-slate-400">
                  {Math.max(0, 5 - employees.length)} seats remaining
                </p>
              </div>
            </div>

            <button
              onClick={() => setAddEmployeeOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>+ Invite Employee</span>
            </button>
          </div>

          {/* 4 KPI Metric Cards (Screenshot 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Using the Product */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                USING THE PRODUCT (7D)
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                1 <span className="text-sm font-normal text-slate-400">of {employees.length}</span>
              </div>
            </div>

            {/* Card 2: Never Signed In */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                NEVER SIGNED IN
              </div>
              <div className="text-2xl font-bold text-rose-500 tracking-tight">
                1
              </div>
              <div className="text-[11px] text-slate-400">
                Accounts that exist but are unused
              </div>
            </div>

            {/* Card 3: Cold Leads */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                COLD LEADS
              </div>
              <div className="text-2xl font-bold text-amber-400 tracking-tight">
                1
              </div>
              <div className="text-[11px] text-slate-400">
                Assigned, untouched over 48h
              </div>
            </div>

            {/* Card 4: Disbursed FY */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                DISBURSED FY
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                ₹0
              </div>
            </div>
          </div>

          {/* Table Controls (Search employees... & Export button Screenshot 1) */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-sm">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search employees..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              onClick={handleExportEmployeesCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 hover:text-white hover:bg-[#141d30] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>

          {/* Employees Table (Exact columns & rows matching Screenshot 1) */}
          <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#1a253a]">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">PHONE</th>
                    <th className="px-4 py-3">BRANCH</th>
                    <th className="px-4 py-3">Files FY</th>
                    <th className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        Disbursed <ChevronDown size={11} className="text-slate-400" />
                      </span>
                    </th>
                    <th className="px-4 py-3">Conv %</th>
                    <th className="px-4 py-3">Open</th>
                    <th className="px-4 py-3">Leads</th>
                    <th className="px-4 py-3">Login</th>
                    <th className="px-4 py-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235]">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#111a2d]/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-[12.5px] uppercase tracking-wide">
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {emp.role}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-300">
                        {emp.phone}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {emp.branch}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {emp.files_fy}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {emp.disbursed}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {emp.conv_pct}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {emp.open}
                      </td>
                      <td className="px-4 py-3">
                        {emp.leads === "—" ? (
                          <span className="text-slate-500">—</span>
                        ) : (
                          <span className="font-medium text-slate-200">
                            1 - <span className="text-rose-400 font-semibold">1 cold</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {emp.login_status === "today" ? (
                          <span className="inline-flex items-center gap-1.5 text-slate-300 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            today
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-[#141d2e] text-slate-400 border border-[#1e2a40]">
                            No login
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5 text-xs font-semibold whitespace-nowrap">
                          <button
                            onClick={() => setEditEmployee(emp)}
                            className="text-blue-400 hover:text-blue-300 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setIdCardEmployee(emp)}
                            className="text-blue-400 hover:text-blue-300 cursor-pointer"
                          >
                            ID card
                          </button>
                          <button
                            onClick={() => setRelievingEmployee(emp)}
                            className="text-amber-400 hover:text-amber-300 cursor-pointer font-semibold"
                          >
                            Relieving letter
                          </button>
                          <button
                            onClick={() => {
                              const link = `https://teleport.sniperelectric.in/staff/login?auth=emp_${emp.id}_${emp.phone}`;
                              navigator.clipboard.writeText(link);
                              showToast(`Direct access link for ${emp.name} copied!`);
                            }}
                            className="text-blue-400 hover:text-blue-300 cursor-pointer"
                          >
                            Details link
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: PARTNERS (Matches Screenshot 2 Exactly)
         ========================================================================= */}
      {activeTab === "partners" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Top Header Bar (Screenshot 2) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                <ChevronLeft size={16} className="cursor-pointer hover:text-white" onClick={() => nav("/dashboard")} />
                <h1 className="text-xl font-bold text-white tracking-tight">Partners</h1>
              </div>
              <div className="text-[11.5px] text-slate-400">Home / Partners</div>
              <p className="text-xs text-slate-300 mt-1">Manage DSAs, dealers, connectors and sales agents and their commission share.</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => showToast("Exported partner network CSV.")}
                className="px-3 py-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download size={13} />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShareSignupModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Share2 size={13} className="text-blue-400" />
                <span>Share Signup Link</span>
              </button>
              <button
                onClick={() => showToast("Opening Monthly Commission Statements...")}
                className="px-3 py-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText size={13} />
                <span>Monthly Statements</span>
              </button>
              <button
                onClick={() => setBulkImportOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download size={13} className="rotate-180" />
                <span>Bulk Import</span>
              </button>
              <button
                onClick={() => setAddPartnerOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Add Partner</span>
              </button>
              <button
                onClick={() => showToast("Partners list updated.")}
                className="p-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-400 hover:text-white cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Top Notice Banner (Screenshot 2) */}
          {!partnerNoticeDismissed && (
            <div className="rounded-xl bg-[#0d1627] border border-[#1e2d4d] px-4 py-2.5 flex items-center justify-between text-[12.5px] text-slate-300 shadow-sm">
              <div className="flex items-center gap-2.5 truncate pr-2">
                <Lightbulb size={16} className="text-blue-400 shrink-0" />
                <span className="truncate">
                  Manage dealers, DSAs & connector partners &nbsp;•&nbsp; Track partner-wise commissions and payouts &nbsp;•&nbsp; Auto-assign leads to partners with hierarchy &nbsp;•&nbsp; Generate login credentials for partner portal
                </span>
              </div>
              <button
                onClick={() => setPartnerNoticeDismissed(true)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Seats Usage Card (Screenshot 2) */}
          <div className="rounded-xl bg-[#0c1424] border border-[#1a2942] p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {partners.length} / 10 partner seats used
                </h3>
                <p className="text-[12px] text-slate-400">
                  {Math.max(0, 10 - partners.length)} seats remaining &nbsp;•&nbsp; 10 free included
                </p>
              </div>
            </div>

            <button
              onClick={() => setAddPartnerOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Add Partner</span>
            </button>
          </div>

          {/* 4 Metric Cards (Screenshot 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                ACTIVE REFERRERS (30D)
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                1 <span className="text-sm font-normal text-slate-400">of 1</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                DISBURSED VIA PARTNERS (FY)
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                ₹0
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                PAYOUT PENDING
              </div>
              <div className="text-2xl font-bold text-rose-500 tracking-tight">
                ₹0
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                TOP PARTNER (FY)
              </div>
              <div className="text-sm font-bold text-slate-300 tracking-tight pt-1">
                No disbursement yet
              </div>
            </div>
          </div>

          {/* Partner List Header with Filter Tabs (Screenshot 2) */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
            <h3 className="text-base font-bold text-white">Partner List</h3>

            <div className="flex items-center gap-1.5 bg-[#090e1a] p-1 rounded-xl border border-[#1a253a]">
              <button
                onClick={() => setPartnerTabFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  partnerTabFilter === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                All {partners.length}
              </button>
              <button
                onClick={() => setPartnerTabFilter("earning")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  partnerTabFilter === "earning" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Earning
              </button>
              <button
                onClick={() => setPartnerTabFilter("dormant")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  partnerTabFilter === "dormant" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Dormant 60d+
              </button>
              <button
                onClick={() => setPartnerTabFilter("payout_due")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  partnerTabFilter === "payout_due" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Payout due
              </button>
            </div>
          </div>

          {/* Search & Filter Dropdowns Bar (Screenshot 2) */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search name, phone, email, PAN, GSTIN..."
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={partnerTypeFilter}
                onChange={(e) => setPartnerTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Main DSA">Main DSA</option>
                <option value="Master DSA">Master DSA</option>
                <option value="Sub-DSA">Sub-DSA</option>
                <option value="Connector">Connector</option>
                <option value="Sales Agent">Sales Agent</option>
              </select>

              <select
                value={partnerStatusFilter}
                onChange={(e) => setPartnerStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Dormant">Dormant</option>
              </select>

              <select className="px-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer">
                <option>Newest</option>
                <option>Highest Disbursed</option>
                <option>Most Leads</option>
              </select>
            </div>
          </div>

          {/* Partners Table (Exact columns & rows matching Screenshot 2) */}
          <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#1a253a]">
                  <tr>
                    <th className="px-4 py-3">Partner</th>
                    <th className="px-4 py-3">PHONE</th>
                    <th className="px-4 py-3">Leads FY</th>
                    <th className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        Disbursed <ChevronDown size={11} className="text-slate-400" />
                      </span>
                    </th>
                    <th className="px-4 py-3">Conv %</th>
                    <th className="px-4 py-3">Pending</th>
                    <th className="px-4 py-3">Last referral</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3">LOGIN</th>
                    <th className="px-4 py-3">CREATED</th>
                    <th className="px-4 py-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235]">
                  {filteredPartners.map((p) => (
                    <tr key={p.id} className="hover:bg-[#111a2d]/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-[12.5px] uppercase tracking-wide">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {p.type} <span className="text-slate-500">- under {p.parent}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-300">{p.phone}</td>
                      <td className="px-4 py-3 text-slate-200 font-bold">{p.leads_fy}</td>
                      <td className="px-4 py-3 text-slate-500">{p.disbursed}</td>
                      <td className="px-4 py-3 text-slate-400">{p.conv_pct}</td>
                      <td className="px-4 py-3 text-slate-500">{p.pending}</td>
                      <td className="px-4 py-3 text-slate-400">{p.last_referral}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.login_status === "Created" ? (
                          <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="text-[10.5px] text-slate-500 flex items-center gap-1">
                              <QrCode size={11} /> QR Not created
                            </div>
                            <button
                              onClick={() => setCreateLoginPartner(p)}
                              className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>🔑</span> <span>Create Login</span>
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono">{p.created}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-xs font-semibold whitespace-nowrap">
                          <button
                            onClick={() => setEditPartner(p)}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 size={12} /> <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setIdCardPartner(p)}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                          >
                            <UserCheck size={12} /> <span>ID card</span>
                          </button>
                          <button
                            onClick={() => setStatementPartner(p)}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                          >
                            <FileText size={12} /> <span>Statement</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: TEAM TREE (Matches Screenshot 3 Exactly)
         ========================================================================= */}
      {activeTab === "tree" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Top Header Bar (Screenshot 3) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                <ChevronLeft size={16} className="cursor-pointer hover:text-white" onClick={() => nav("/dashboard")} />
                <h1 className="text-xl font-bold text-white tracking-tight">Team Structure</h1>
              </div>
              <div className="text-[11.5px] text-slate-400">Home / Team Tree</div>
              <p className="text-xs text-slate-300 mt-1">Employees at the top, with owned partners (sales agents, DSAs) nested under them.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#090e1a] p-1 rounded-xl border border-[#1a253a]">
                <button
                  onClick={() => setTreeViewMode("view1")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    treeViewMode === "view1" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  View 1
                </button>
                <button
                  onClick={() => setTreeViewMode("view2")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    treeViewMode === "view2" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  View 2
                </button>
                <button
                  onClick={() => setTreeViewMode("view3")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    treeViewMode === "view3" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  View 3
                </button>
              </div>

              <button
                onClick={() => showToast("Team Tree hierarchy synchronized.")}
                className="p-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-400 hover:text-white cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* 6 Metric Cards (Screenshot 3) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Total Nodes */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL NODES</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">3</div>
                <div className="text-[10.5px] text-slate-400">3 active</div>
              </div>
              <Users size={18} className="text-slate-500" />
            </div>

            {/* 2. Employees */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EMPLOYEES</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">2</div>
                <div className="text-[10.5px] text-slate-400 truncate">Users + Sales Agents</div>
              </div>
              <UserCheck size={18} className="text-slate-500" />
            </div>

            {/* 3. DSAs */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DSAS</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">1</div>
                <div className="text-[10.5px] text-slate-400">Channel partners</div>
              </div>
              <Building2 size={18} className="text-slate-500" />
            </div>

            {/* 4. Owner */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OWNER</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">1</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center text-[10px] font-bold">
                1
              </div>
            </div>

            {/* 5. Sales Agent */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SALES AGENT</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">1</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center text-[10px] font-bold">
                1
              </div>
            </div>

            {/* 6. Main DSA */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MAIN DSA</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">1</div>
              </div>
              <Building2 size={18} className="text-slate-500" />
            </div>
          </div>

          {/* Search & Collapse Controls (Screenshot 3) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, code, phone..."
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <button
                onClick={() => setTreeExpanded({ root: true, node_ashish_m: true, node_ashish_g: true })}
                className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Expand All
              </button>

              <button
                onClick={() => setTreeExpanded({ root: false, node_ashish_m: false, node_ashish_g: false })}
                className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Collapse All
              </button>
            </div>

            <div className="text-[11.5px] text-slate-400">
              Hover any row to <span className="text-blue-400 font-semibold cursor-pointer underline">change parent</span>.
            </div>
          </div>

          {/* Nested Tree List matching Screenshot 3 */}
          <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-4 space-y-2 min-h-[360px]">
            {/* Level 1: Root Owner (VIVEK MAHAJAN) */}
            <div className="group rounded-xl p-2.5 hover:bg-[#111a2d]/80 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-500/40">
                  VM
                </div>
                <UserCheck size={15} className="text-slate-400" />
                <span className="font-bold text-white text-[13px] tracking-wide">VIVEK MAHAJAN</span>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-[#18233a] text-blue-300 border border-blue-500/30">
                  Owner
                </span>
                <span className="font-mono text-xs text-slate-400">919764044044</span>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <button
                  onClick={() => setReassignNode({ id: "1", name: "VIVEK MAHAJAN", currentParent: "Root" })}
                  className="px-2.5 py-1 rounded bg-[#131b2e] text-blue-400 hover:text-white text-xs border border-[#1e293b]"
                >
                  Change Parent
                </button>
              </div>
            </div>

            {/* Level 2: Sales Agent (ASHISH MAHAJAN) */}
            <div className="pl-6 border-l-2 border-[#1e293b] ml-4 space-y-2">
              <div className="group rounded-xl p-2.5 hover:bg-[#111a2d]/80 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTreeExpanded(prev => ({ ...prev, node_ashish_m: !prev.node_ashish_m }))}
                    className="text-slate-400 hover:text-white"
                  >
                    <ChevronDown size={14} className={treeExpanded.node_ashish_m ? "" : "-rotate-90"} />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/40">
                    AM
                  </div>
                  <UserCheck size={15} className="text-slate-400" />
                  <span className="font-bold text-white text-[13px] tracking-wide">ASHISH MAHAJAN</span>
                  <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-900/40 text-blue-300 border border-blue-600/40">
                    Sales Agent
                  </span>
                  <span className="font-mono text-xs text-slate-400">9850198506</span>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <button
                    onClick={() => setReassignNode({ id: "2", name: "ASHISH MAHAJAN", currentParent: "VIVEK MAHAJAN" })}
                    className="px-2.5 py-1 rounded bg-[#131b2e] text-blue-400 hover:text-white text-xs border border-[#1e293b]"
                  >
                    Change Parent
                  </button>
                </div>
              </div>

              {/* Level 3: Main DSA (ASHISH GUPTA) */}
              {treeExpanded.node_ashish_m && (
                <div className="pl-6 border-l-2 border-[#1e293b] ml-4">
                  <div className="group rounded-xl p-2.5 hover:bg-[#111a2d]/80 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div className="w-8 h-8 rounded-full bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                        AG
                      </div>
                      <Building2 size={15} className="text-slate-400" />
                      <span className="font-bold text-white text-[13px] tracking-wide">ASHISH GUPTA</span>
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-600/30 text-cyan-300 border border-blue-500/40">
                        Main DSA
                      </span>
                      <span className="font-mono text-xs text-slate-400">9075007700</span>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <button
                        onClick={() => setReassignNode({ id: "3", name: "ASHISH GUPTA", currentParent: "ASHISH MAHAJAN" })}
                        className="px-2.5 py-1 rounded bg-[#131b2e] text-blue-400 hover:text-white text-xs border border-[#1e293b]"
                      >
                        Change Parent
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: SUPPLIER (VENDOR) (Matches Screenshot 4 Exactly)
         ========================================================================= */}
      {activeTab === "suppliers" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Top Header Bar (Screenshot 4) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                <ChevronLeft size={16} className="cursor-pointer hover:text-white" onClick={() => nav("/dashboard")} />
                <h1 className="text-xl font-bold text-white tracking-tight">Supplier (Vendor)</h1>
              </div>
              <div className="text-[11.5px] text-slate-400">Home / Team / Supplier (Vendor)</div>
              <p className="text-xs text-slate-300 mt-1">Vendor master — used when posting expense dues from Payouts.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAddSupplierOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Add Supplier</span>
              </button>
              <button
                onClick={() => showToast("Suppliers list refreshed.")}
                className="p-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-400 hover:text-white cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* 3 Metric Cards (Screenshot 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Total Suppliers */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">TOTAL SUPPLIERS</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-1">{suppliers.length}</div>
              </div>
              <Building2 size={20} className="text-slate-600" />
            </div>

            {/* 2. Outstanding Due */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">OUTSTANDING DUE</div>
                <div className="text-2xl font-bold text-amber-500 tracking-tight mt-1">
                  ₹{suppliers.reduce((acc, s) => acc + s.outstanding, 0).toLocaleString()}
                </div>
              </div>
              <Briefcase size={20} className="text-amber-500/40" />
            </div>

            {/* 3. GSTIN On File */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">GSTIN ON FILE</div>
                <div className="text-2xl font-bold text-emerald-400 tracking-tight mt-1">
                  {suppliers.filter(s => s.gstin).length}
                </div>
              </div>
              <FileText size={20} className="text-emerald-500/40" />
            </div>
          </div>

          {/* Search bar (Screenshot 4) */}
          <div className="relative max-w-md">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, GSTIN, contact..."
              value={supplierSearch}
              onChange={(e) => setSupplierSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Content: Empty State or Table matching Screenshot 4 */}
          {suppliers.length === 0 ? (
            <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] p-12 text-center text-slate-400 text-xs">
              <p>No suppliers yet. Click "+ Add Supplier" to add your first vendor.</p>
              <button
                onClick={() => setAddSupplierOpen(true)}
                className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus size={14} /> + Add Supplier
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] overflow-hidden shadow-md">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#1a253a]">
                  <tr>
                    <th className="px-4 py-3">Vendor / Company</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">GSTIN</th>
                    <th className="px-4 py-3">Contact Person</th>
                    <th className="px-4 py-3">Monthly Spend</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235]">
                  {filteredSuppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-[#111a2d]/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{s.name}</td>
                      <td className="px-4 py-3 text-slate-300">{s.category}</td>
                      <td className="px-4 py-3 font-mono text-cyan-400">{s.gstin}</td>
                      <td className="px-4 py-3 text-slate-400">{s.contact}</td>
                      <td className="px-4 py-3 font-bold text-white">{s.spend}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            onClick={() => showToast(`Posting expense voucher for ${s.name}`)}
                            className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                          >
                            Pay Due
                          </button>
                          <button
                            onClick={() => setSuppliers(suppliers.filter(x => x.id !== s.id))}
                            className="text-rose-400 hover:text-rose-300 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 5: BANKER (Matches Screenshot 5 + ACTION SECTION REQUESTED BY USER)
         ========================================================================= */}
      {activeTab === "bankers" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Top Header Bar (Screenshot 5) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                <ChevronLeft size={16} className="cursor-pointer hover:text-white" onClick={() => nav("/dashboard")} />
                <h1 className="text-xl font-bold text-white tracking-tight">Banker</h1>
              </div>
              <div className="text-[11.5px] text-slate-400">Home / Team / Banker</div>
              <p className="text-xs text-slate-300 mt-1">
                Manage bank relationship managers, credit officers and contact. These are used when emailing loan files to banks.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => showToast("Exporting Banker Directory CSV...")}
                className="px-3 py-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download size={13} />
                <span>Export</span>
              </button>
              <button
                onClick={() => setBulkImportOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download size={13} className="rotate-180" />
                <span>Bulk Import</span>
              </button>
              <button
                onClick={() => setAddBankerOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Add Banker</span>
              </button>
              <button
                onClick={() => showToast("Banker directory refreshed.")}
                className="p-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-400 hover:text-white cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* 4 Metric Cards (Screenshot 5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Total Bankers */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark size={13} className="text-slate-400" />
                <span>TOTAL BANKERS</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">229</div>
              <div className="text-[11.5px] text-slate-400">1 yours • 228 shared in</div>
            </div>

            {/* 2. Active */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck size={13} className="text-emerald-400" />
                <span>ACTIVE</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400 tracking-tight">229</div>
            </div>

            {/* 3. On the Portal */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={13} className="text-cyan-400" />
                <span>ON THE PORTAL</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {bankers.filter(b => b.portal_status === "active").length}
              </div>
              <div className="text-[11.5px] text-slate-400">0 invited, not yet logged in</div>
            </div>

            {/* 4. Global (Shared In) */}
            <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a253a] space-y-1">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={13} className="text-blue-400" />
                <span>GLOBAL (SHARED IN)</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">228</div>
            </div>
          </div>

          {/* Search & Filter Dropdowns Bar (Screenshot 5) */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search name, bank, branch, phone..."
                value={bankerSearch}
                onChange={(e) => setBankerSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={bankerBankFilter}
                onChange={(e) => setBankerBankFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All banks">All banks</option>
                <option value="Hero housing">Hero housing finance</option>
                <option value="AU MALL">AU Small Finance Bank</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="Axis">Axis Bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="Kotak">Kotak Mahindra Bank</option>
                <option value="TVS Credit">TVS Credit</option>
                <option value="Bajaj">Bajaj Finance</option>
                <option value="IDFC FIRST">IDFC FIRST Bank</option>
              </select>

              <select
                value={bankerProductFilter}
                onChange={(e) => setBankerProductFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All products">All products</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Loan Against Property">Loan Against Property</option>
                <option value="Commercial Vehicle">Commercial Vehicle</option>
              </select>

              <select
                value={bankerCityFilter}
                onChange={(e) => setBankerCityFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All">City / pincode</option>
                <option value="Punalur">Punalur</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Delhi">Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
              </select>

              <select
                value={bankerScopeFilter}
                onChange={(e) => setBankerScopeFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0c1220] border border-[#1e293b] rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All (mine + global)">All (mine + global)</option>
                <option value="Mine only">Mine only</option>
                <option value="Global shared">Global shared</option>
              </select>
            </div>
          </div>

          {/* Bankers Table + Comprehensive ACTION SECTION requested by user */}
          <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#1a253a]">
                  <tr>
                    <th className="px-4 py-3">BANKER</th>
                    <th className="px-4 py-3">BANK / BRANCH</th>
                    <th className="px-4 py-3">CONTACT</th>
                    <th className="px-4 py-3 text-center">ACTIVE APPS</th>
                    <th className="px-4 py-3 text-center">TOTAL APPS</th>
                    <th className="px-4 py-3 text-center">LOANS</th>
                    <th className="px-4 py-3">PORTAL</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3 text-center font-bold text-cyan-400">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235]">
                  {filteredBankers.map((b) => (
                    <tr key={b.id} className="hover:bg-[#111a2d]/70 transition-colors">
                      {/* Banker Name & Designation */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center shrink-0 border border-slate-700">
                            {b.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white text-[12.5px] tracking-wide flex items-center gap-1.5">
                              <span>{b.name}</span>
                              {b.is_global ? (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-blue-900/40 text-blue-300 border border-blue-600/40">
                                  <Globe size={9} /> GLOBAL
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-purple-900/40 text-purple-300 border border-purple-500/40">
                                  YOURS
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 uppercase font-medium">{b.role}</div>
                          </div>
                        </div>
                      </td>

                      {/* Bank / Branch */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-200">{b.bank}</div>
                        <div className="text-[11px] text-slate-400">
                          {b.branch} {b.city && `• ${b.city}`}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <div className="font-mono text-slate-300">{b.phone}</div>
                        <div className="font-mono text-[11px] text-slate-500">{b.email}</div>
                      </td>

                      {/* Counts */}
                      <td className="px-4 py-3 text-center font-bold text-slate-300">{b.active_apps}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-300">{b.total_apps}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-300">{b.loans}</td>

                      {/* Portal */}
                      <td className="px-4 py-3">
                        {b.portal_status === "active" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : b.portal_status === "invited" ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-medium text-[11px]">
                            <Clock size={12} /> Invited
                          </span>
                        ) : (
                          <button
                            onClick={() => handleInviteBanker(b.id)}
                            className="px-2 py-0.5 rounded-md bg-[#131b2e] hover:bg-blue-600/20 text-slate-300 hover:text-white border border-[#1e293b] text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Mail size={11} className="text-cyan-400" />
                            <span>Invite</span>
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className="text-emerald-400 font-semibold text-xs">
                          {b.status}
                        </span>
                      </td>

                      {/* ACTIONS SECTION (Explicitly requested by user) */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                          {/* Share Loan File */}
                          <button
                            onClick={() => setShareFileModalBanker(b)}
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all cursor-pointer"
                            title="Send / Email Loan Application File to Banker"
                          >
                            <Send size={13} />
                          </button>

                          {/* WhatsApp Direct */}
                          <a
                            href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(b.name)},%20I%20have%20a%20new%20loan%20applicant%20dossier%20from%20Sniper%20Electric.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare size={13} />
                          </a>

                          {/* Edit Banker */}
                          <button
                            onClick={() => setEditBanker(b)}
                            className="p-1.5 rounded-lg bg-[#141d30] hover:bg-[#1a253e] text-slate-300 hover:text-white border border-[#1e293b] transition-all cursor-pointer"
                            title="Edit Banker Details"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* View Profile */}
                          <button
                            onClick={() => setProfileBanker(b)}
                            className="p-1.5 rounded-lg bg-[#141d30] hover:bg-[#1a253e] text-slate-300 hover:text-white border border-[#1e293b] transition-all cursor-pointer"
                            title="View Banker Profile"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="p-3 border-t border-[#182235] bg-[#090e1a] flex items-center justify-between text-xs text-slate-400">
              <span>Showing 1 to {filteredBankers.length} of 229 bankers</span>
              <div className="flex gap-1">
                <button className="px-2.5 py-1 rounded bg-[#0c1220] border border-[#1e293b] text-slate-300 hover:text-white cursor-pointer">
                  Previous
                </button>
                <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
                <button className="px-2.5 py-1 rounded bg-[#0c1220] border border-[#1e293b] text-slate-300 hover:text-white cursor-pointer">
                  2
                </button>
                <button className="px-2.5 py-1 rounded bg-[#0c1220] border border-[#1e293b] text-slate-300 hover:text-white cursor-pointer">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 6: APPROVALS (Matches Screenshot 1 Exactly)
         ========================================================================= */}
      {activeTab === "approvals" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Header Bar (Screenshot 1) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                <ChevronLeft size={16} className="cursor-pointer hover:text-white" onClick={() => nav("/team")} />
                <h1 className="text-xl font-bold text-white tracking-tight">Approvals</h1>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Home / Approvals</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every pending item that needs your sign-off — leave, expenses, conveyance claims and fee waivers in one place.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRequestApprovalModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Plus size={14} /> + New Request
              </button>
              <button
                onClick={() => showToast("Approvals sync complete. All items up to date.")}
                className="p-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-400 hover:text-white cursor-pointer transition-colors"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Pending Approvals Metric Card (Screenshot 1: large card with 0 & subtle watermark) */}
          <div className="p-5 rounded-2xl bg-[#0c1322] border border-[#1a253a] relative overflow-hidden flex items-center justify-between">
            <div className="space-y-1 relative z-10">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                PENDING APPROVALS
              </div>
              <div className="text-3xl font-bold text-emerald-400 tracking-tight">
                {approvals.filter((a) => a.status === "Pending").length}
              </div>
              <div className="text-xs text-slate-400">
                {approvals.filter((a) => a.status === "Pending").length === 0
                  ? "All caught up"
                  : `${approvals.filter((a) => a.status === "Pending").length} item(s) awaiting your sign-off`}
              </div>
            </div>

            {/* Circular Checkmark Watermark (Screenshot 1) */}
            <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500/25 shrink-0">
              <Check size={36} strokeWidth={2.5} />
            </div>
          </div>

          {/* Filter Pills & Categories (Screenshot 1) */}
          <div className="space-y-3">
            {/* Top Row: Pending / Approved / Rejected */}
            <div className="flex items-center gap-1.5">
              {(["Pending", "Approved", "Rejected"] as const).map((tabName) => {
                const count = approvals.filter((a) => a.status === tabName).length;
                const isActive = approvalsStatusTab === tabName;
                return (
                  <button
                    key={tabName}
                    onClick={() => setApprovalsStatusTab(tabName)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    {tabName} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>

            {/* Category Tabs: All / Leave / Expenses / Conveyance / Fee Waivers */}
            <div className="flex items-center gap-6 border-b border-[#182235] text-xs">
              {(["All", "Leave", "Expenses", "Conveyance", "Fee Waivers"] as const).map((cat) => {
                const isActive = approvalsCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setApprovalsCategory(cat)}
                    className={`pb-2.5 font-medium cursor-pointer transition-all relative ${
                      isActive ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area / Empty State (Screenshot 1) */}
          {(() => {
            const filtered = approvals.filter((a) => {
              const matchStatus = a.status === approvalsStatusTab;
              const matchCat = approvalsCategory === "All" || a.type === approvalsCategory;
              return matchStatus && matchCat;
            });

            if (filtered.length === 0) {
              return (
                <div className="p-16 rounded-2xl bg-[#0c1220] border border-[#1a253a] text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#111a2d] border border-[#1e293b] text-slate-500 flex items-center justify-center mx-auto">
                    <Inbox size={26} strokeWidth={1.5} />
                  </div>
                  <div className="text-sm font-semibold text-slate-300">
                    Nothing {approvalsStatusTab.toLowerCase()} — you're all caught up.
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Requests submitted by sales agents or loan officers for leaves, expense claims, or overrides will appear here.
                  </p>
                  <button
                    onClick={() => setRequestApprovalModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111a2d] hover:bg-[#18233c] border border-[#1e293b] text-xs font-semibold text-blue-400 cursor-pointer transition-colors"
                  >
                    <Plus size={13} /> Submit Test Approval Request
                  </button>
                </div>
              );
            }

            return (
              <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#1a253a]">
                    <tr>
                      <th className="px-4 py-3">Team Member</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Details / Purpose</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Requested On</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#182235]">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-[#111a2d]/70 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">{item.member}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-500/20 text-blue-300">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{item.details}</td>
                        <td className="px-4 py-3 text-emerald-400 font-mono font-semibold">
                          {item.amount ? item.amount : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{item.date}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === "Approved"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : item.status === "Rejected"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.status === "Pending" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setApprovals(
                                    approvals.map((a) => (a.id === item.id ? { ...a, status: "Approved" } : a))
                                  );
                                  showToast(`Approved ${item.type} for ${item.member}.`);
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setApprovals(
                                    approvals.map((a) => (a.id === item.id ? { ...a, status: "Rejected" } : a))
                                  );
                                  showToast(`Rejected request.`);
                                }}
                                className="px-2.5 py-1 rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-bold text-[11px] cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          VIEW 7: TASKS (Matches Screenshot 2 Exactly)
         ========================================================================= */}
      {activeTab === "tasks" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Top Header Bar (Screenshot 2) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                <ChevronLeft size={16} className="cursor-pointer hover:text-white" onClick={() => nav("/team")} />
                <h1 className="text-xl font-bold text-white tracking-tight">Tasks</h1>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Home / Tasks</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Track follow-ups, deadlines, and team assignments across leads.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCreateTaskModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Plus size={14} /> + Create Task
              </button>
              <button
                onClick={() => showToast("Tasks board refreshed.")}
                className="p-1.5 rounded-lg bg-[#0c1220] hover:bg-[#141d30] border border-[#1e293b] text-slate-400 hover:text-white cursor-pointer transition-colors"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Lightbulb Notice Banner (Screenshot 2) */}
          {!tasksNoticeDismissed && (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-950/40 border border-blue-500/25 text-xs text-blue-200">
              <div className="flex items-center gap-2 flex-wrap">
                <Lightbulb size={15} className="text-blue-400 shrink-0" />
                <span>
                  Create follow-up tasks linked to leads • Set priority, due dates & assign to team • Track overdue, in-progress & completed tasks • Never miss a follow-up with task reminders
                </span>
              </div>
              <button
                onClick={() => setTasksNoticeDismissed(true)}
                className="text-blue-400 hover:text-white ml-2 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* 6 Metric Cards (Screenshot 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Total Tasks */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1 relative z-10">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL TASKS</div>
                <div className="text-2xl font-bold text-white tracking-tight">{tasks.length}</div>
                <div className="text-[10.5px] text-slate-400">
                  {tasks.filter((t) => t.status === "Completed").length} completed
                </div>
                <button
                  onClick={() => setCreateTaskModalOpen(true)}
                  className="mt-1 inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <Plus size={11} /> Create Task
                </button>
              </div>
              <div className="text-slate-600/30">
                <CheckCheck size={28} />
              </div>
            </div>

            {/* 2. Overdue */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OVERDUE</div>
                <div className="text-2xl font-bold text-white tracking-tight">0</div>
                <div className="text-[10.5px] text-slate-400">On track</div>
              </div>
              <AlertCircle size={20} className="text-slate-500" />
            </div>

            {/* 3. Pending */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PENDING</div>
                <div className="text-2xl font-bold text-amber-400 tracking-tight">
                  {tasks.filter((t) => t.status === "Pending").length}
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>

            {/* 4. In Progress */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IN PROGRESS</div>
                <div className="text-2xl font-bold text-blue-400 tracking-tight">
                  {tasks.filter((t) => t.status === "In Progress").length}
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Play size={14} className="fill-blue-400 ml-0.5" />
              </div>
            </div>

            {/* 5. Completed */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">COMPLETED</div>
                <div className="text-2xl font-bold text-emerald-400 tracking-tight">
                  {tasks.filter((t) => t.status === "Completed").length}
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check size={16} />
              </div>
            </div>

            {/* 6. Created (6MO) - Mini Bar Graph (Screenshot 2) */}
            <div className="p-3.5 rounded-xl bg-[#0c1322] border border-[#1a253a] flex flex-col justify-between">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CREATED (6MO)</div>
              <div className="flex items-end justify-between gap-1 h-9 mt-2">
                {[
                  { m: "May", h: "15%" },
                  { m: "Jun", h: "20%" },
                  { m: "Jul", h: "15%" },
                  { m: "Aug", h: "35%" },
                  { m: "Sept", h: "30%" },
                  { m: "Oct", h: tasks.length > 0 ? "70%" : "25%" }
                ].map((col) => (
                  <div key={col.m} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm bg-blue-600/70 hover:bg-blue-500 transition-all"
                      style={{ height: col.h }}
                    />
                    <span className="text-[8px] text-slate-500">{col.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Controls (Screenshot 2) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Left Filter Pills: All Tasks / Pending / In Progress / Completed */}
            <div className="flex items-center gap-1 bg-[#0c1220] p-1 rounded-xl border border-[#1a253a]">
              {(["All Tasks", "Pending", "In Progress", "Completed"] as const).map((tabName) => {
                const isActive = tasksFilterTab === tabName;
                return (
                  <button
                    key={tabName}
                    onClick={() => setTasksFilterTab(tabName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tabName}
                  </button>
                );
              })}
            </div>

            {/* Right: Employee Filter Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Employee</span>
              <select
                value={tasksEmployeeFilter}
                onChange={(e) => setTasksEmployeeFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0c1220] border border-[#1a253a] rounded-lg text-white cursor-pointer focus:outline-none"
              >
                <option value="All employees">All employees</option>
                <option value="VIVEK MAHAJAN">VIVEK MAHAJAN (Owner)</option>
                <option value="ASHISH MAHAJAN">ASHISH MAHAJAN</option>
                <option value="ASHISH GUPTA">ASHISH GUPTA (Main DSA)</option>
              </select>
            </div>
          </div>

          {/* Tasks List / Empty State (Screenshot 2) */}
          {(() => {
            const filteredTasks = tasks.filter((t) => {
              const matchFilter =
                tasksFilterTab === "All Tasks" ||
                (tasksFilterTab === "Pending" && t.status === "Pending") ||
                (tasksFilterTab === "In Progress" && t.status === "In Progress") ||
                (tasksFilterTab === "Completed" && t.status === "Completed");

              const matchEmp =
                tasksEmployeeFilter === "All employees" || t.assignee === tasksEmployeeFilter;

              return matchFilter && matchEmp;
            });

            if (filteredTasks.length === 0) {
              return (
                <div className="p-16 rounded-2xl bg-[#0c1220] border border-[#1a253a] text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#111a2d] border border-[#1e293b] text-slate-500 flex items-center justify-center mx-auto">
                    <CheckCheck size={22} />
                  </div>
                  <div className="text-sm font-semibold text-slate-300">No tasks found.</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Create your first operational task to keep track of loan file pickups, KYC verifications, and customer follow-ups.
                  </p>
                  <button
                    onClick={() => setCreateTaskModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer shadow-sm"
                  >
                    <Plus size={14} /> + Create Task
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-2.5">
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl bg-[#0c1220] border border-[#1a253a] flex items-center justify-between gap-4 hover:border-blue-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.status === "Completed"}
                        onChange={() => {
                          setTasks(
                            tasks.map((x) =>
                              x.id === t.id
                                ? { ...x, status: x.status === "Completed" ? "Pending" : "Completed" }
                                : x
                            )
                          );
                          showToast(
                            t.status === "Completed"
                              ? "Task marked pending."
                              : "Task marked completed!"
                          );
                        }}
                        className="w-4 h-4 rounded border-[#1e293b] text-blue-600 cursor-pointer"
                      />
                      <div>
                        <div
                          className={`text-xs font-semibold ${
                            t.status === "Completed" ? "line-through text-slate-500" : "text-white"
                          }`}
                        >
                          {t.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          {t.leadName && (
                            <span className="text-blue-400 font-medium">{t.leadName}</span>
                          )}
                          <span>•</span>
                          <span>Assigned to: <strong className="text-slate-300">{t.assignee}</strong></span>
                          <span>•</span>
                          <span className="text-amber-400 font-mono">Due: {t.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === "High"
                            ? "bg-rose-500/20 text-rose-300"
                            : t.priority === "Medium"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {t.priority}
                      </span>
                      <button
                        onClick={() => {
                          setTasks(tasks.filter((x) => x.id !== t.id));
                          showToast("Task deleted.");
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          VIEW 8: BULK LEAD IMPORT (Matches Screenshot 3 Exactly)
         ========================================================================= */}
      {activeTab === "bulk-import" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Header Bar (Screenshot 3) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                <ChevronLeft size={16} className="cursor-pointer hover:text-white" onClick={() => nav("/team")} />
                <h1 className="text-xl font-bold text-white tracking-tight">Bulk Lead Import</h1>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Home / Tools / Bulk Lead Import</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Import leads from Excel/CSV and review past import runs.
              </p>
            </div>
          </div>

          {/* Subheader & Start Button (Screenshot 3) */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Bulk Lead Import</h2>
              <p className="text-xs text-slate-400">Import leads from Excel/CSV and review your import history.</p>
            </div>

            <button
              onClick={() => setBulkImportToolModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Download size={14} className="rotate-180" /> Start Bulk Import
            </button>
          </div>

          {/* Import History Card Container (Screenshot 3) */}
          <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] overflow-hidden">
            <div className="p-4 border-b border-[#182235]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Import history</h3>
              <div className="text-[11px] text-slate-500">Last 50 imports</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#1a253a]">
                  <tr>
                    <th className="px-4 py-3">DATE</th>
                    <th className="px-4 py-3">BY</th>
                    <th className="px-4 py-3">FILE</th>
                    <th className="px-4 py-3">TOTAL</th>
                    <th className="px-4 py-3">CREATED</th>
                    <th className="px-4 py-3">SKIPPED</th>
                    <th className="px-4 py-3">ERRORS</th>
                    <th className="px-4 py-3">ISSUES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235]">
                  {importHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-20 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#111a2d] border border-[#1e293b] text-slate-500 flex items-center justify-center mx-auto mb-3">
                          <FileSpreadsheet size={24} strokeWidth={1.5} />
                        </div>
                        <div className="text-xs font-semibold text-slate-300">
                          No imports yet. Click "Start Bulk Import" to import leads from a spreadsheet.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    importHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-[#111a2d]/70 transition-colors">
                        <td className="px-4 py-3 text-slate-300 font-mono">{item.date}</td>
                        <td className="px-4 py-3 font-semibold text-white">{item.by}</td>
                        <td className="px-4 py-3 text-blue-400 font-mono">{item.file}</td>
                        <td className="px-4 py-3 font-bold text-white">{item.total}</td>
                        <td className="px-4 py-3 text-emerald-400 font-bold">{item.created}</td>
                        <td className="px-4 py-3 text-slate-400">{item.skipped}</td>
                        <td className="px-4 py-3 text-rose-400 font-bold">{item.errors}</td>
                        <td className="px-4 py-3 text-slate-400">{item.issues}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 9: BULK LEAD ASSIGN (Matches Screenshot 4 Exactly)
         ========================================================================= */}
      {activeTab === "bulk-assign" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Header Bar (Screenshot 4) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                <ChevronLeft size={16} className="cursor-pointer hover:text-white" onClick={() => nav("/team")} />
                <h1 className="text-xl font-bold text-white tracking-tight">Bulk Lead Assignment</h1>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Home / Tools / Bulk Lead Assign</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Set a condition, preview how many leads match, then reassign them all to a team member.
              </p>
            </div>
          </div>

          {/* 1. Condition — which leads? (Screenshot 4) */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">1. Condition — which leads?</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Currently assigned to</label>
                <select
                  value={assignConditionAssignedTo}
                  onChange={(e) => setAssignConditionAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                >
                  <option value="Anyone">Anyone</option>
                  <option value="Unassigned">Unassigned Only</option>
                  <option value="VIVEK MAHAJAN">VIVEK MAHAJAN (Owner)</option>
                  <option value="ASHISH MAHAJAN">ASHISH MAHAJAN</option>
                  <option value="ASHISH GUPTA">ASHISH GUPTA (Main DSA)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Status</label>
                <select
                  value={assignConditionStatus}
                  onChange={(e) => setAssignConditionStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                >
                  <option value="Any status">Any status</option>
                  <option value="New Lead">New Lead</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Underwriting">Underwriting</option>
                  <option value="Sanctioned">Sanctioned</option>
                  <option value="Cold / Untouched > 48h">Cold / Untouched &gt; 48h</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Source</label>
                <select
                  value={assignConditionSource}
                  onChange={(e) => setAssignConditionSource(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                >
                  <option value="Any source">Any source</option>
                  <option value="Website Inbound">Website Inbound</option>
                  <option value="Channel Partner / DSA">Channel Partner / DSA</option>
                  <option value="Direct Sales">Direct Sales</option>
                  <option value="Telecalling">Telecalling</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Product</label>
                <select
                  value={assignConditionProduct}
                  onChange={(e) => setAssignConditionProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                >
                  <option value="Any product">Any product</option>
                  <option value="Green Energy Finance for Business">Green Energy Finance for Business</option>
                  <option value="Green Energy Finance for Individual">Green Energy Finance for Individual</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Loan Against Property">Loan Against Property</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Search (name / phone)</label>
                <input
                  type="text"
                  placeholder="Optional..."
                  value={assignConditionSearch}
                  onChange={(e) => setAssignConditionSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Matching Leads Card Banner (Screenshot 4) */}
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-blue-300 font-medium">
                <Users size={16} className="text-blue-400" />
                <span>
                  <strong>{assignedLeadCount} leads match this condition</strong> — all of them will be reassigned.
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Reassign all leads matching a condition to a team member.
              </div>
            </div>
          </div>

          {/* 2. Assign to (Screenshot 4) */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">2. Assign to</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-medium">Team member</label>
                <select
                  value={assignTargetMember}
                  onChange={(e) => setAssignTargetMember(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                >
                  <option value="">Select a team member</option>
                  <option value="ASHISH MAHAJAN">ASHISH MAHAJAN (9850198506)</option>
                  <option value="VIVEK MAHAJAN">VIVEK MAHAJAN (Owner)</option>
                  <option value="ASHISH GUPTA">ASHISH GUPTA (Main DSA)</option>
                </select>
              </div>

              <div>
                <button
                  onClick={handleExecuteBulkAssign}
                  className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <UserPlus size={14} /> Assign {assignedLeadCount} leads
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 10: TOOLS (FINANCIAL CALCULATORS) (Matches Screenshot 5 Exactly)
         ========================================================================= */}
      {activeTab === "tools" && (
        <div className="space-y-4 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Header Tab Bar: EMI / SIP / RD / SSY / PPF / Lumpsum / MF Returns / Compare ROI / Eligibility (Screenshot 5) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#182235] text-xs">
            {[
              { id: "EMI", label: "EMI", icon: Calculator },
              { id: "SIP", label: "SIP", icon: TrendingUp },
              { id: "RD", label: "RD", icon: PiggyBank },
              { id: "SSY", label: "SSY", icon: Coins },
              { id: "PPF", label: "PPF", icon: Vault },
              { id: "Lumpsum", label: "Lumpsum", icon: DollarSign },
              { id: "MF Returns", label: "MF Returns", icon: BarChart3 },
              { id: "Compare ROI", label: "Compare ROI", icon: Scale },
              { id: "Eligibility", label: "Eligibility", icon: CheckCircle2 }
            ].map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = toolCalcTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setToolCalcTab(tabItem.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold cursor-pointer whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#10192d] text-blue-400 border border-blue-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tabItem.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: EMI CALCULATOR (Screenshot 5 Exact Replica) */}
          {toolCalcTab === "EMI" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Panel: EMI Calculator Sliders (col-span-7) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white tracking-tight">EMI Calculator</h2>
                  {/* Mode Toggle: Reducing Rate / Flat Rate */}
                  <div className="flex items-center gap-1 bg-[#090e1a] p-1 rounded-xl border border-[#1a253a] text-xs">
                    <button
                      onClick={() => setEmiMode("reducing")}
                      className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                        emiMode === "reducing" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Reducing Rate
                    </button>
                    <button
                      onClick={() => setEmiMode("flat")}
                      className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                        emiMode === "flat" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Flat Rate
                    </button>
                  </div>
                </div>

                {/* Slider 1: Loan Amount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Loan Amount</span>
                    <div className="flex items-center gap-1 px-3 py-1 bg-[#090e1a] border border-[#1e293b] rounded-lg">
                      <span className="text-slate-400 font-mono">₹</span>
                      <input
                        type="number"
                        value={emiLoanAmount}
                        onChange={(e) => setEmiLoanAmount(Math.max(100000, Number(e.target.value)))}
                        className="w-28 bg-transparent text-white font-mono font-bold text-right focus:outline-none"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={50000000}
                    step={50000}
                    value={emiLoanAmount}
                    onChange={(e) => setEmiLoanAmount(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-[#1a253a] rounded-lg"
                  />
                  <div className="flex justify-between text-[10.5px] text-slate-500 font-mono">
                    <span>1 L</span>
                    <span>5 Cr</span>
                  </div>
                </div>

                {/* Slider 2: Interest Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Interest Rate</span>
                    <div className="flex items-center gap-1 px-3 py-1 bg-[#090e1a] border border-[#1e293b] rounded-lg">
                      <input
                        type="number"
                        step={0.1}
                        value={emiInterestRate}
                        onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                        className="w-16 bg-transparent text-white font-mono font-bold text-right focus:outline-none"
                      />
                      <span className="text-slate-400 font-mono">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.1}
                    value={emiInterestRate}
                    onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-[#1a253a] rounded-lg"
                  />
                  <div className="flex justify-between text-[10.5px] text-slate-500 font-mono">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Slider 3: Tenure (years / months) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      Tenure ({(emiTenureMonths / 12).toFixed(1)} yrs)
                    </span>
                    <div className="flex items-center gap-1 px-3 py-1 bg-[#090e1a] border border-[#1e293b] rounded-lg">
                      <input
                        type="number"
                        value={emiTenureMonths}
                        onChange={(e) => setEmiTenureMonths(Math.max(12, Number(e.target.value)))}
                        className="w-16 bg-transparent text-white font-mono font-bold text-right focus:outline-none"
                      />
                      <span className="text-slate-400 font-mono">months</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={360}
                    step={6}
                    value={emiTenureMonths}
                    onChange={(e) => setEmiTenureMonths(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-[#1a253a] rounded-lg"
                  />
                  <div className="flex justify-between text-[10.5px] text-slate-500 font-mono">
                    <span>1 yr</span>
                    <span>30 yrs</span>
                  </div>
                </div>

                {/* Summary Metrics Bar (Screenshot 5: ₹21,696 | ₹27.07 L | ₹52.07 L) */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#182235]">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly EMI</div>
                    <div className="text-xl sm:text-2xl font-bold text-[#38bdf8] font-mono mt-0.5">
                      ₹{emiCalc.monthlyEmi.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Interest</div>
                    <div className="text-xl sm:text-2xl font-bold text-[#fb923c] font-mono mt-0.5">
                      ₹{emiCalc.totalInterestLakhs} L
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Payment</div>
                    <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-0.5">
                      ₹{emiCalc.totalPaymentLakhs} L
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Donut Breakdown + Yearly Amortization (col-span-5) */}
              <div className="lg:col-span-5 space-y-4">
                {/* 1. Payment Breakdown Donut Chart (Screenshot 5) */}
                <div className="p-5 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Payment Breakdown</h3>

                  <div className="flex items-center justify-center py-2">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                        {/* Background circle */}
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#162235" strokeWidth="16" />
                        {/* Principal arc (Blue) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="16"
                          strokeDasharray={`${(emiCalc.principalPct / 100) * 301.6} 301.6`}
                          strokeDashoffset="0"
                        />
                        {/* Interest arc (Orange) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="16"
                          strokeDasharray={`${(emiCalc.interestPct / 100) * 301.6} 301.6`}
                          strokeDashoffset={`-${(emiCalc.principalPct / 100) * 301.6}`}
                        />
                      </svg>
                      {/* Center Label (Screenshot 5: Interest 52%) */}
                      <div className="absolute text-center">
                        <div className="text-xs font-bold text-white">Interest {emiCalc.interestPct}%</div>
                        <div className="text-[10px] text-slate-400">Principal {emiCalc.principalPct}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#182235]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-400">Principal</div>
                        <div className="font-bold text-white font-mono">
                          ₹{(emiLoanAmount / 100000).toFixed(2)} L ({emiCalc.principalPct}%)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-400">Interest</div>
                        <div className="font-bold text-white font-mono">
                          ₹{emiCalc.totalInterestLakhs} L ({emiCalc.interestPct}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Yearly Amortization Stacked Bar Chart (Screenshot 5) */}
                <div className="p-5 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Yearly Amortization</h3>

                  <div className="h-44 flex items-end gap-1.5 pt-4 pb-2 border-b border-[#182235]">
                    {emiCalc.yearlyData.map((d) => {
                      const totalAnnual = d.principal + d.interest;
                      const prinHeight = totalAnnual > 0 ? (d.principal / totalAnnual) * 100 : 0;
                      const intHeight = 100 - prinHeight;
                      return (
                        <div
                          key={d.year}
                          className="flex-1 flex flex-col justify-end h-full gap-0.5 group relative cursor-pointer"
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none whitespace-nowrap bg-[#090e1a] border border-[#1e293b] p-2 rounded-lg text-[10px] shadow-xl">
                            <span className="font-bold text-white">Year {d.year}</span>
                            <span className="text-blue-400">Principal: ₹{d.principal.toLocaleString("en-IN")}</span>
                            <span className="text-amber-400">Interest: ₹{d.interest.toLocaleString("en-IN")}</span>
                            <span className="text-slate-400">Balance: ₹{d.balance.toLocaleString("en-IN")}</span>
                          </div>

                          {/* Interest portion (Orange) */}
                          <div
                            className="w-full bg-[#f59e0b] rounded-t-xs hover:brightness-110 transition-all"
                            style={{ height: `${intHeight}%` }}
                          />
                          {/* Principal portion (Blue) */}
                          <div
                            className="w-full bg-[#3b82f6] rounded-b-xs hover:brightness-110 transition-all"
                            style={{ height: `${prinHeight}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[10.5px] text-slate-500 font-mono">
                    <span>Year 1</span>
                    <span>Year {Math.min(30, Math.ceil(emiTenureMonths / 12))}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIP CALCULATOR */}
          {toolCalcTab === "SIP" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-[#0c1220] border border-[#1a253a]">
              <div className="space-y-5">
                <h2 className="text-base font-bold text-white">Systematic Investment Plan (SIP)</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Monthly Investment</span>
                    <span className="text-white font-mono font-bold">₹{sipMonthly.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={100000}
                    step={500}
                    value={sipMonthly}
                    onChange={(e) => setSipMonthly(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Expected Annual Return</span>
                    <span className="text-white font-mono font-bold">{sipRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={0.5}
                    value={sipRate}
                    onChange={(e) => setSipRate(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Time Period</span>
                    <span className="text-white font-mono font-bold">{sipYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={sipYears}
                    onChange={(e) => setSipYears(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#090e1a] border border-[#182235] flex flex-col justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SIP Projection</h3>
                <div className="space-y-3 my-4">
                  <div>
                    <div className="text-[10px] text-slate-400">Total Invested Amount</div>
                    <div className="text-lg font-bold text-white font-mono">₹{sipCalc.investedLakhs} Lakhs</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Estimated Returns</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono">₹{sipCalc.returnsLakhs} Lakhs</div>
                  </div>
                  <div className="pt-3 border-t border-[#1e293b]">
                    <div className="text-[10px] text-slate-400">Total Maturity Value</div>
                    <div className="text-2xl font-bold text-[#38bdf8] font-mono">₹{sipCalc.maturityLakhs} Lakhs</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RD CALCULATOR */}
          {toolCalcTab === "RD" && (
            <div className="p-6 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-5">
              <h2 className="text-base font-bold text-white">Recurring Deposit (RD) Calculator</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Monthly Deposit (₹)</label>
                  <input
                    type="number"
                    value={rdMonthly}
                    onChange={(e) => setRdMonthly(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Interest Rate (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={rdRate}
                    onChange={(e) => setRdRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Tenure (Months)</label>
                  <input
                    type="number"
                    value={rdMonths}
                    onChange={(e) => setRdMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#182235]">
                <div className="p-4 rounded-xl bg-[#090e1a]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Invested</div>
                  <div className="text-xl font-bold text-white font-mono mt-1">₹{rdCalc.invested.toLocaleString("en-IN")}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#090e1a]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Interest Earned</div>
                  <div className="text-xl font-bold text-amber-400 font-mono mt-1">₹{rdCalc.returns.toLocaleString("en-IN")}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#090e1a]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Maturity Amount</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-1">₹{rdCalc.maturity.toLocaleString("en-IN")}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SSY CALCULATOR */}
          {toolCalcTab === "SSY" && (
            <div className="p-6 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-5">
              <h2 className="text-base font-bold text-white">Sukanya Samriddhi Yojana (SSY) — 8.2% Interest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Yearly Deposit (Max ₹1.5L / yr)</label>
                  <input
                    type="number"
                    max={150000}
                    value={ssyYearly}
                    onChange={(e) => setSsyYearly(Math.min(150000, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-500">Deposits for 15 years, matures in 21 years tax-free.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] space-y-2">
                  <div className="text-xs text-slate-400">Total Invested: <strong className="text-white">₹{ssyCalc.invested.toLocaleString("en-IN")}</strong></div>
                  <div className="text-xs text-slate-400">Interest Earned: <strong className="text-amber-400">₹{ssyCalc.returns.toLocaleString("en-IN")}</strong></div>
                  <div className="text-sm font-bold text-emerald-400 pt-2 border-t border-[#1e293b]">
                    Maturity at 21 Yrs: ₹{ssyCalc.maturity.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PPF CALCULATOR */}
          {toolCalcTab === "PPF" && (
            <div className="p-6 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-5">
              <h2 className="text-base font-bold text-white">Public Provident Fund (PPF) — 7.1% Tax-Free</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Annual Deposit (₹)</label>
                  <input
                    type="number"
                    max={150000}
                    value={ppfYearly}
                    onChange={(e) => setPpfYearly(Math.min(150000, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-500">15-year statutory lock-in with EEE tax exemption benefit.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] space-y-2">
                  <div className="text-xs text-slate-400">Total Invested: <strong className="text-white">₹{ppfCalc.invested.toLocaleString("en-IN")}</strong></div>
                  <div className="text-xs text-slate-400">Interest Earned: <strong className="text-amber-400">₹{ppfCalc.returns.toLocaleString("en-IN")}</strong></div>
                  <div className="text-sm font-bold text-emerald-400 pt-2 border-t border-[#1e293b]">
                    15-Year Maturity: ₹{ppfCalc.maturity.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LUMPSUM CALCULATOR */}
          {toolCalcTab === "Lumpsum" && (
            <div className="p-6 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-5">
              <h2 className="text-base font-bold text-white">Lumpsum Investment Calculator</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Investment Amount (₹)</label>
                  <input
                    type="number"
                    value={lumpAmount}
                    onChange={(e) => setLumpAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Expected Return (%)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={lumpRate}
                    onChange={(e) => setLumpRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Tenure (Years)</label>
                  <input
                    type="number"
                    value={lumpYears}
                    onChange={(e) => setLumpYears(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Projected Maturity Value</div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">₹{lumpCalc.maturity.toLocaleString("en-IN")}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Wealth Gain</div>
                  <div className="text-lg font-bold text-amber-400 font-mono">+₹{lumpCalc.returns.toLocaleString("en-IN")}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MF RETURNS */}
          {toolCalcTab === "MF Returns" && (
            <div className="p-6 rounded-2xl bg-[#0c1220] border border-[#1a253a] space-y-4">
              <h2 className="text-base font-bold text-white">Mutual Fund Category 5-Year CAGR Benchmark</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {[
                  { cat: "Large Cap Equity", cagr: "14.2%", risk: "Moderate", benchmark: "NIFTY 50" },
                  { cat: "Mid Cap Equity", cagr: "18.8%", risk: "High", benchmark: "NIFTY Midcap 150" },
                  { cat: "Small Cap Equity", cagr: "22.5%", risk: "Very High", benchmark: "NIFTY Smallcap 250" },
                  { cat: "Hybrid / Balanced", cagr: "12.6%", risk: "Low-Mod", benchmark: "CRISIL Hybrid" }
                ].map((m) => (
                  <div key={m.cat} className="p-4 rounded-xl bg-[#090e1a] border border-[#182235] space-y-2">
                    <div className="font-bold text-white">{m.cat}</div>
                    <div className="text-2xl font-bold text-emerald-400 font-mono">{m.cagr}</div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Risk: {m.risk}</span>
                      <span>{m.benchmark}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: COMPARE ROI */}
          {toolCalcTab === "Compare ROI" && (
            <div className="rounded-xl border border-[#1a253a] bg-[#0c1220] overflow-hidden">
              <div className="p-4 border-b border-[#182235]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bank Rate Matrix (Q3 2026)</h3>
                <div className="text-[11px] text-slate-500">Live base rate benchmarks across personal, business and green loans</div>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-[#090e1a] text-slate-400 font-semibold border-b border-[#1a253a]">
                  <tr>
                    <th className="px-4 py-3">Bank / NBFC</th>
                    <th className="px-4 py-3">Personal Loan</th>
                    <th className="px-4 py-3">Business Loan</th>
                    <th className="px-4 py-3">Green Energy Finance</th>
                    <th className="px-4 py-3">Max Tenure</th>
                    <th className="px-4 py-3">Processing Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235]">
                  {[
                    { bank: "HDFC Bank", pl: "10.50% - 14.50%", bl: "11.75% - 15.50%", green: "8.75% - 10.25%", tenure: "7 Years", pf: "1.00%" },
                    { bank: "State Bank of India (SBI)", pl: "10.30% - 13.90%", bl: "10.85% - 14.20%", green: "8.40% - 9.80%", tenure: "8 Years", pf: "0.50%" },
                    { bank: "ICICI Bank", pl: "10.65% - 15.00%", bl: "11.90% - 16.00%", green: "8.90% - 10.50%", tenure: "7 Years", pf: "1.25%" },
                    { bank: "Hero Housing Finance", pl: "—", bl: "12.50% - 17.00%", green: "9.20% - 11.00%", tenure: "15 Years", pf: "1.50%" },
                    { bank: "AU Small Finance Bank", pl: "11.25% - 16.50%", bl: "12.00% - 18.00%", green: "9.00% - 11.50%", tenure: "7 Years", pf: "1.50%" }
                  ].map((row) => (
                    <tr key={row.bank} className="hover:bg-[#111a2d]/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{row.bank}</td>
                      <td className="px-4 py-3 text-blue-300 font-mono">{row.pl}</td>
                      <td className="px-4 py-3 text-amber-300 font-mono">{row.bl}</td>
                      <td className="px-4 py-3 text-emerald-400 font-mono font-bold">{row.green}</td>
                      <td className="px-4 py-3 text-slate-300">{row.tenure}</td>
                      <td className="px-4 py-3 text-slate-400">{row.pf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 9: ELIGIBILITY & FOIR */}
          {toolCalcTab === "Eligibility" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-[#0c1220] border border-[#1a253a]">
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white">FOIR & Loan Eligibility Estimator</h2>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Net Monthly Salary / Income (₹)</label>
                  <input
                    type="number"
                    value={eligSalary}
                    onChange={(e) => setEligSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Existing Monthly EMIs (₹)</label>
                  <input
                    type="number"
                    value={eligExistingEmi}
                    onChange={(e) => setEligExistingEmi(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">FOIR Allowed (%)</label>
                  <input
                    type="number"
                    value={eligFoir}
                    onChange={(e) => setEligFoir(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#090e1a] border border-[#182235] flex flex-col justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Eligibility</h3>
                <div className="space-y-3 my-4">
                  <div>
                    <div className="text-[10px] text-slate-400">Max Monthly EMI Capacity</div>
                    <div className="text-xl font-bold text-white font-mono">
                      ₹{eligCalc.maxEmiAllowed.toLocaleString("en-IN")}/mo
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#1e293b]">
                    <div className="text-[10px] text-slate-400">Max Loan Eligibility Amount</div>
                    <div className="text-3xl font-bold text-emerald-400 font-mono">
                      ₹{eligCalc.maxLoanLakhs} Lakhs
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Based on 8.5% interest rate over 20-year tenure.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          ALL MODALS
         ========================================================================= */}

      {/* 1. ADD / INVITE EMPLOYEE MODAL */}
      {addEmployeeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add New Employee</h3>
              <button onClick={() => setAddEmployeeOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Role / Designation</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  >
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Sales Agent">Sales Agent</option>
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Credit Underwriter">Credit Underwriter</option>
                    <option value="Telecaller">Telecaller</option>
                    <option value="no role">no role</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="98XXXXXXXX"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Official Email</label>
                <input
                  type="email"
                  placeholder="name@sniperelectric.in"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Branch</label>
                <input
                  type="text"
                  value={newEmployee.branch}
                  onChange={(e) => setNewEmployee({ ...newEmployee, branch: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button type="button" onClick={() => setAddEmployeeOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT EMPLOYEE MODAL */}
      {editEmployee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Edit Employee — {editEmployee.name}</h3>
              <button onClick={() => setEditEmployee(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveEditEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Designation</label>
                  <select
                    value={editEmployee.role}
                    onChange={(e) => setEditEmployee({ ...editEmployee, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Sales Agent">Sales Agent</option>
                    <option value="Head of Sales">Head of Sales</option>
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Credit Underwriter">Credit Underwriter</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Telecaller">Telecaller</option>
                    <option value="no role">no role</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={editEmployee.phone}
                    onChange={(e) => setEditEmployee({ ...editEmployee, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button type="button" onClick={() => setEditEmployee(null)} className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EMPLOYEE ID CARD MODAL */}
      {idCardEmployee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Official Employee Identity Card</h3>
              <button onClick={() => setIdCardEmployee(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-b from-[#111a2d] to-[#0a101d] p-5 shadow-xl space-y-4 text-center">
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                <span className="font-extrabold tracking-wider text-xs text-white">SNIPER ELECTRIC</span>
                <span className="text-[10px] text-blue-400 font-mono font-bold">DS101</span>
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto border-2 border-blue-400 shadow-md">
                {idCardEmployee.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white text-base tracking-wide">{idCardEmployee.name}</h4>
                <p className="text-xs text-blue-400 font-semibold">{idCardEmployee.role}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{idCardEmployee.emp_code}</p>
              </div>
              <div className="bg-[#0c1220] p-2.5 rounded-xl border border-[#1e293b] text-left text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Phone:</span>
                  <span className="text-white font-mono">{idCardEmployee.phone}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Email:</span>
                  <span className="text-white font-mono">{idCardEmployee.email}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-slate-500 font-mono">
                <QrCode size={14} className="text-blue-400" />
                <span>AUTHORIZED CREDENTIAL • VERIFIED</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#182235]">
              <button
                onClick={() => {
                  window.print();
                  showToast("Print dialog triggered.");
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} />
                <span>Print / Download ID Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. RELIEVING LETTER MODAL */}
      {relievingEmployee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1220] border border-[#1e293b] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Official Relieving Certificate</h3>
              <button onClick={() => setRelievingEmployee(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5 text-slate-200 text-xs space-y-3 leading-relaxed font-sans shadow-inner">
              <div className="border-b border-[#1e293b] pb-2 flex justify-between items-center">
                <div>
                  <div className="font-extrabold text-sm text-white tracking-wider">SNIPER ELECTRIC PVT LTD</div>
                  <div className="text-[10px] text-slate-400">BKC, Mumbai • Ref: SE/REL/{new Date().getFullYear()}/09</div>
                </div>
              </div>
              <div>
                <p><strong>To,</strong> {relievingEmployee.name} ({relievingEmployee.emp_code})</p>
                <p className="mt-2">
                  This confirms that your resignation from the position of <strong>{relievingEmployee.role}</strong> at Sniper Electric has been accepted and you are hereby relieved of your duties with immediate effect.
                </p>
                <p className="mt-1 text-slate-400">All company property and active leads have been handed over. We wish you every success.</p>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
                showToast("Relieving letter downloaded.");
              }}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Download Official Relieving Letter PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. ADD PARTNER MODAL */}
      {addPartnerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Channel Partner (DSA / Connector)</h3>
              <button onClick={() => setAddPartnerOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddPartnerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Partner Name / Entity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Genesis Capital / Ketan Mehta"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Partner Type</label>
                  <select
                    value={newPartner.type}
                    onChange={(e) => setNewPartner({ ...newPartner, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  >
                    <option value="Main DSA">Main DSA</option>
                    <option value="Master DSA">Master DSA</option>
                    <option value="Sub-DSA">Sub-DSA</option>
                    <option value="Connector">Connector</option>
                    <option value="Sales Agent">Sales Agent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reporting Under</label>
                  <select
                    value={newPartner.parent}
                    onChange={(e) => setNewPartner({ ...newPartner, parent: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  >
                    <option value="ASHISH MAHAJAN">ASHISH MAHAJAN</option>
                    <option value="VIVEK MAHAJAN">VIVEK MAHAJAN</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="90XXXXXXXX"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Commission Share %</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newPartner.commission_pct}
                    onChange={(e) => setNewPartner({ ...newPartner, commission_pct: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button type="button" onClick={() => setAddPartnerOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
                  Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. PARTNER CREATE LOGIN MODAL */}
      {createLoginPartner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3 text-left">
              <h3 className="font-bold text-white text-sm">Partner Portal Credentials</h3>
              <button onClick={() => setCreateLoginPartner(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="w-24 h-24 rounded-2xl bg-white p-2 mx-auto flex items-center justify-center shadow-md">
              <QrCode size={80} className="text-slate-900" />
            </div>

            <div>
              <h4 className="font-bold text-white text-base">{createLoginPartner.name}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Mobile: {createLoginPartner.phone}</p>
            </div>

            <div className="bg-[#111827] p-3 rounded-xl border border-[#1e293b] text-left text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Portal Link:</span>
                <span className="text-blue-400 font-mono">teleport.in/partner</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Temp Password:</span>
                <span className="text-emerald-400 font-mono font-bold">DSA@9075</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPartners(partners.map(p => p.id === createLoginPartner.id ? { ...p, login_status: "Created" } : p));
                showToast(`Login credentials & QR SMS dispatched to ${createLoginPartner.phone}!`);
                setCreateLoginPartner(null);
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer"
            >
              Send Credentials via WhatsApp & SMS
            </button>
          </div>
        </div>
      )}

      {/* 7. SHARE SIGNUP LINK MODAL */}
      {shareSignupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Public Partner Onboarding Link</h3>
              <button onClick={() => setShareSignupModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Share this secure registration link with external connectors and DSA agents. They will be auto-assigned under your organization (Code DS101).
            </p>
            <div className="flex items-center gap-2 p-2 bg-[#111827] rounded-lg border border-[#1e293b] text-xs font-mono text-cyan-400">
              <span className="truncate flex-1">https://teleport.sniperelectric.in/partner/join?org=DS101</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://teleport.sniperelectric.in/partner/join?org=DS101");
                  showToast("Partner join link copied to clipboard!");
                }}
                className="px-2.5 py-1 rounded bg-blue-600 text-white font-sans font-semibold cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. ADD SUPPLIER MODAL */}
      {addSupplierOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Vendor / Supplier</h3>
              <button onClick={() => setAddSupplierOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddSupplierSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Vendor Entity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Digitap Technologies / Exotel"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  >
                    <option value="KYC & Bureau Verification">KYC & Bureau</option>
                    <option value="Telephony & IVR Services">Telephony & IVR</option>
                    <option value="Legal & Title Search">Legal & Title</option>
                    <option value="CA & Valuation Firm">CA & Valuation</option>
                    <option value="Software & Cloud Infrastructure">Software/Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="27AABCS1429B1Z8"
                    value={newSupplier.gstin}
                    onChange={(e) => setNewSupplier({ ...newSupplier, gstin: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Accounts Manager"
                    value={newSupplier.contact}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Monthly Billing</label>
                  <input
                    type="text"
                    placeholder="₹15,000/mo"
                    value={newSupplier.spend}
                    onChange={(e) => setNewSupplier({ ...newSupplier, spend: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button type="button" onClick={() => setAddSupplierOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. ADD BANKER MODAL */}
      {addBankerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Add Banker to Directory</h3>
              <button onClick={() => setAddBankerOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddBankerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Banker Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={newBanker.name}
                  onChange={(e) => setNewBanker({ ...newBanker, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Lending Bank</label>
                  <select
                    value={newBanker.bank}
                    onChange={(e) => setNewBanker({ ...newBanker, bank: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="State Bank of India">SBI</option>
                    <option value="Kotak Mahindra Bank">Kotak</option>
                    <option value="Hero housing finance ltd">Hero Housing</option>
                    <option value="AU MALL FINANCE BANK LTD">AU Small Finance</option>
                    <option value="Bajaj Finance">Bajaj Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={newBanker.role}
                    onChange={(e) => setNewBanker({ ...newBanker, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Branch / Location</label>
                  <input
                    type="text"
                    placeholder="Fort Mumbai / Punalur"
                    value={newBanker.branch}
                    onChange={(e) => setNewBanker({ ...newBanker, branch: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98XXXXXXX"
                    value={newBanker.phone}
                    onChange={(e) => setNewBanker({ ...newBanker, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="banker@hdfcbank.com"
                  value={newBanker.email}
                  onChange={(e) => setNewBanker({ ...newBanker, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button type="button" onClick={() => setAddBankerOpen(false)} className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
                  Add Banker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. DISPATCH LOAN FILE TO BANKER MODAL (Specifically for the Banker Action Section) */}
      {shareFileModalBanker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1220] border border-[#1e293b] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <div className="flex items-center gap-2">
                <Send size={16} className="text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Send Loan Dossier to Banker</h3>
              </div>
              <button onClick={() => setShareFileModalBanker(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#111827] border border-[#1e293b] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient Banker:</span>
                <span className="text-white font-bold">{shareFileModalBanker.name} ({shareFileModalBanker.bank})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Official Email:</span>
                <span className="text-cyan-400 font-mono">{shareFileModalBanker.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Branch:</span>
                <span className="text-slate-300">{shareFileModalBanker.branch}</span>
              </div>
            </div>

            <form onSubmit={handleSendFileToBanker} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Select Active Applicant Application</label>
                <select
                  value={selectedApplicantForBanker}
                  onChange={(e) => setSelectedApplicantForBanker(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white"
                >
                  <option value="OMKAR - Personal Loan (₹8,00,000)">OMKAR (8767424655) — Personal Loan ₹8,00,000</option>
                  <option value="SATYAJEET KERE - Business Loan (₹25,00,000)">SATYAJEET KERE (8838864869) — Business Loan ₹25,00,000</option>
                  <option value="VIKAS GUPTA - Home Loan (₹45,00,000)">VIKAS GUPTA (9820011223) — Home Loan ₹45,00,000</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Attached KYC & Financial Packets</label>
                <div className="p-3 bg-[#090e1a] rounded-xl border border-[#1e293b] space-y-1.5 text-[11.5px] text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>Experian Bureau Score & Verification PDF Linked</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>PAN & Aadhaar Masked Verification Complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>Bank Statement Analysis (Perfios/Karza) Linked</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cover Note to Credit Desk</label>
                <textarea
                  rows={2}
                  defaultValue="Dear Team, please find attached the verified loan dossier with complete KYC, Form 16 and 3 months salary slips for sanction."
                  className="w-full px-3 py-2 bg-[#090e1a] border border-[#1e293b] rounded-lg text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button type="button" onClick={() => setShareFileModalBanker(null)} className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer flex items-center gap-1.5">
                  <Send size={13} />
                  <span>Dispatch Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. BANKER PROFILE DRAWER / MODAL */}
      {profileBanker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Banker Profile & Escalation Matrix</h3>
              <button onClick={() => setProfileBanker(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600/30 text-blue-300 font-bold text-lg flex items-center justify-center border border-blue-500/40">
                {profileBanker.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{profileBanker.name}</h4>
                <p className="text-xs text-cyan-400 font-semibold">{profileBanker.bank}</p>
                <p className="text-[11px] text-slate-400">{profileBanker.role} • {profileBanker.branch}</p>
              </div>
            </div>

            <div className="bg-[#111827] p-3 rounded-xl border border-[#1e293b] text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Phone:</span>
                <span className="text-white font-mono font-semibold">{profileBanker.phone}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Email:</span>
                <span className="text-cyan-400 font-mono">{profileBanker.email}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Products Handled:</span>
                <span className="text-emerald-400 font-semibold">{profileBanker.products.join(", ")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Sanction TAT:</span>
                <span className="text-amber-300 font-semibold">24-48 Business Hours</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#182235]">
              <button
                onClick={() => {
                  setProfileBanker(null);
                  setShareFileModalBanker(profileBanker);
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send size={13} />
                <span>Submit Loan File to this Banker</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. EDIT BANKER MODAL */}
      {editBanker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Edit Banker — {editBanker.name}</h3>
              <button onClick={() => setEditBanker(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveEditBanker} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Banker Name</label>
                <input
                  type="text"
                  required
                  value={editBanker.name}
                  onChange={(e) => setEditBanker({ ...editBanker, name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Lending Bank</label>
                  <input
                    type="text"
                    value={editBanker.bank}
                    onChange={(e) => setEditBanker({ ...editBanker, bank: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={editBanker.role}
                    onChange={(e) => setEditBanker({ ...editBanker, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Branch</label>
                  <input
                    type="text"
                    value={editBanker.branch}
                    onChange={(e) => setEditBanker({ ...editBanker, branch: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editBanker.phone}
                    onChange={(e) => setEditBanker({ ...editBanker, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={editBanker.email}
                  onChange={(e) => setEditBanker({ ...editBanker, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white font-mono"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button type="button" onClick={() => setEditBanker(null)} className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. BULK IMPORT MODAL (Common) */}
      {bulkImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <h3 className="font-bold text-white text-sm">Bulk CSV Import</h3>
              <button onClick={() => setBulkImportOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="border-2 border-dashed border-[#1e2d4d] rounded-xl p-6 text-center space-y-2">
              <Download size={24} className="rotate-180 mx-auto text-blue-400" />
              <div className="text-xs font-bold text-white">Upload CSV Spreadsheet</div>
              <p className="text-[11px] text-slate-400">Accepts .CSV format with standard column headers</p>
              <button
                onClick={() => {
                  showToast("Batch records successfully imported!");
                  setBulkImportOpen(false);
                }}
                className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Browse & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 14. CREATE TASK MODAL (Screenshot 2) */}
      {createTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <CheckCheck size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Create Operational Task</h3>
                  <p className="text-[11px] text-slate-400">Assign deadlines, document pickups and follow-ups</p>
                </div>
              </div>
              <button onClick={() => setCreateTaskModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Task Title / Action</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Collect 6-month bank statement & ITR"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Linked Borrower Lead</label>
                  <select
                    value={newTask.leadName}
                    onChange={(e) => setNewTask({ ...newTask, leadName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                  >
                    <option value="Rahul Sharma (PL-9821)">Rahul Sharma (PL-9821)</option>
                    <option value="Amit Verma (BL-4102)">Amit Verma (BL-4102)</option>
                    <option value="Pooja Patel (HL-3310)">Pooja Patel (HL-3310)</option>
                    <option value="Priya Nair (GE-5520)">Priya Nair (GE-5520)</option>
                    <option value="General Operational Task">General Operational Task</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Assignee</label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                  >
                    <option value="VIVEK MAHAJAN">VIVEK MAHAJAN (Owner)</option>
                    <option value="ASHISH MAHAJAN">ASHISH MAHAJAN</option>
                    <option value="ASHISH GUPTA">ASHISH GUPTA (Main DSA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Priority Level</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Due Date</label>
                  <select
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Within 48h">Within 48 Hours</option>
                    <option value="25 Oct 2026">25 Oct 2026</option>
                    <option value="End of Month">End of Month</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setCreateTaskModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-sm"
                >
                  Create & Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 15. REQUEST APPROVAL MODAL (Screenshot 1) */}
      {requestApprovalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <Check size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Submit Approval Request</h3>
                  <p className="text-[11px] text-slate-400">Submit an item for manager sign-off</p>
                </div>
              </div>
              <button onClick={() => setRequestApprovalModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRequestApprovalSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Team Member</label>
                  <select
                    value={newApproval.member}
                    onChange={(e) => setNewApproval({ ...newApproval, member: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                  >
                    <option value="ASHISH MAHAJAN">ASHISH MAHAJAN</option>
                    <option value="VIVEK MAHAJAN">VIVEK MAHAJAN</option>
                    <option value="ASHISH GUPTA">ASHISH GUPTA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={newApproval.type}
                    onChange={(e) => setNewApproval({ ...newApproval, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                  >
                    <option value="Leave">Leave</option>
                    <option value="Expenses">Expenses</option>
                    <option value="Conveyance">Conveyance</option>
                    <option value="Fee Waivers">Fee Waivers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Claim Amount / Duration</label>
                <input
                  type="text"
                  placeholder="e.g. ₹1,450 or 2 Days"
                  value={newApproval.amount}
                  onChange={(e) => setNewApproval({ ...newApproval, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Details & Justification</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Client meeting travel conveyance from Thane to BKC office."
                  value={newApproval.details}
                  onChange={(e) => setNewApproval({ ...newApproval, details: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setRequestApprovalModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-sm"
                >
                  Submit For Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 16. BULK LEAD IMPORT MODAL (Screenshot 3) */}
      {bulkImportToolModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1220] border border-[#1e293b] rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#182235] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Download size={18} className="rotate-180" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Start Bulk Lead Import</h3>
                  <p className="text-[11px] text-slate-400">Import leads from spreadsheet directly into funnel</p>
                </div>
              </div>
              <button onClick={() => setBulkImportToolModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-[#1e2d4d] rounded-xl p-5 text-center space-y-2 bg-[#090e1a]/60">
                <FileSpreadsheet size={28} className="mx-auto text-blue-400" />
                <div className="font-bold text-white">Inbound_Leads_Batch_DS101.csv</div>
                <p className="text-[11px] text-slate-400">15 prospective borrower records detected • 100% valid headers</p>
              </div>

              {/* Sample Download Prompt */}
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#090e1a] border border-[#1e293b]">
                <span className="text-slate-400">Need the standard import format?</span>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  Download Sample CSV
                </button>
              </div>

              {/* Mapping Confirmation */}
              <div className="p-3 rounded-lg bg-[#090e1a] border border-[#182235] space-y-1.5 text-[11px]">
                <div className="font-bold text-slate-300">Column Mapping Verified:</div>
                <div className="grid grid-cols-2 gap-1 text-slate-400">
                  <div>✓ ApplicantName → Full Name</div>
                  <div>✓ Phone → Mobile Phone</div>
                  <div>✓ LoanType → Product</div>
                  <div>✓ LoanAmount → Sanction Value</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setBulkImportToolModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSimulatingImport}
                  onClick={handleExecuteBulkImport}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  {isSimulatingImport ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> Importing...
                    </>
                  ) : (
                    "Confirm & Import 15 Leads"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Sparkle Button */}
      <button
        onClick={() => showToast("Team Co-pilot active — manage roster, permissions, and direct logins.")}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 transition-all cursor-pointer z-40"
        title="Team Actions"
      >
        <Sparkles size={18} />
      </button>
    </div>
  );
}
