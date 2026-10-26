import {
  Landmark, Building2, Package, ShieldCheck, GitBranch, KeyRound, Sparkles, Sliders,
  Calculator, UserCheck, MapPin, Target, MessageSquare, Globe, Search, Phone, Mail,
  CreditCard, LayoutGrid, Tag, Users, Settings2, Layers, Bell, Palette, AlertCircle,
  ShieldAlert, FileText, Building, Zap, Calendar, CalendarDays, GitMerge, Clock, Gift,
  Navigation, Lock, AlertTriangle
} from "lucide-react";

export interface SetupModule {
  id: string;
  title: string;
  desc: string;
  category: "MASTERS" | "CONFIGURATION" | "HR & PAYROLL" | "SETTINGS";
  icon: any;
  count?: string | number;
  badge?: string;
}

export const SETUP_MODULES: SetupModule[] = [
  // 1. MASTERS (12 modules)
  { id: "banks", title: "Banks", desc: "Lenders you work with — contacts, DSA code, GST policy.", category: "MASTERS", icon: Landmark, count: 5 },
  { id: "branches", title: "Bank Branch", desc: "Bank branches — address, IFSC and branch contacts.", category: "MASTERS", icon: Building2, count: 2 },
  { id: "products", title: "Products", desc: "Loan products offered per bank.", category: "MASTERS", icon: Package, count: 105 },
  { id: "insurance", title: "Insurance Companies", desc: "Insurance provider partners, health & general tie-ups.", category: "MASTERS", icon: ShieldCheck, count: 4 },
  { id: "parent-dsas", title: "Parent DSA Master", desc: "Bigger DSAs you operate under (sub-DSA relationships).", category: "MASTERS", icon: Users, count: 2 },
  { id: "dsa-codes", title: "DSA Code Master", desc: "Your registered DSA codes per bank / parent DSA.", category: "MASTERS", icon: KeyRound, count: 2 },
  { id: "scheme-feed", title: "Scheme Feed", desc: "Browse & import master commission schemes and live feeds.", category: "MASTERS", icon: Sparkles, count: 3 },
  { id: "schemes", title: "Schemes", desc: "Bank-wise commission schemes & payout grids.", category: "MASTERS", icon: Layers, count: 2 },
  { id: "payout-structure", title: "Payout Structure", desc: "Per-employee / per-partner payout for every product & sub-product, in a grid.", category: "MASTERS", icon: Calculator, count: 4 },
  { id: "customer-profiles", title: "Customer Profile", desc: "Customer profile categories (Bank Salary, Pvt Ltd, NRI...) — used on schemes & leads.", category: "MASTERS", icon: UserCheck, count: 4 },
  { id: "pin-codes", title: "Pin Code Master", desc: "State ▸ District geography for lead routing & serviceability.", category: "MASTERS", icon: MapPin, count: 888 },
  { id: "team-targets", title: "Team target", desc: "Monthly targets per salesperson — logins, disbursement & loans.", category: "MASTERS", icon: Target, count: 3 },

  // 2. CONFIGURATION (20 modules)
  { id: "whatsapp", title: "WhatsApp", desc: "WhatsApp Cloud API & automated notification drips.", category: "CONFIGURATION", icon: MessageSquare },
  { id: "meta", title: "Meta / Facebook", desc: "Connect Facebook Lead Ads & pages for instant lead ingestion.", category: "CONFIGURATION", icon: Globe },
  { id: "google-ads", title: "Google Ads", desc: "Track ad spend, leads & ROAS from Google Ads.", category: "CONFIGURATION", icon: Search },
  { id: "ivr", title: "IVR", desc: "Call routing, virtual numbers & telephony provider.", category: "CONFIGURATION", icon: Phone },
  { id: "smtp", title: "Email / SMTP", desc: "Outbound email server settings & automated triggers.", category: "CONFIGURATION", icon: Mail },
  { id: "razorpay", title: "Razorpay", desc: "Payment gateway for processing fees & collections.", category: "CONFIGURATION", icon: CreditCard },
  { id: "custom-status", title: "Custom Status", desc: "Lead & loan statuses and pipeline view rules.", category: "CONFIGURATION", icon: LayoutGrid, count: 5 },
  { id: "lead-sources", title: "Lead Sources", desc: "Where your leads come from (Online, Referral, Direct).", category: "CONFIGURATION", icon: Tag, count: 6 },
  { id: "partner-types", title: "Partner Types", desc: "Connector categories, referral payout tiers & agency models.", category: "CONFIGURATION", icon: Users, count: 4 },
  { id: "field-customisation", title: "Field Customisation", desc: "Custom fields per entity and custom intake rules.", category: "CONFIGURATION", icon: Settings2, count: 5 },
  { id: "assignment-rules", title: "Assignment Rules", desc: "Auto-assign incoming leads to your team via Round-Robin or Geo.", category: "CONFIGURATION", icon: UserCheck },
  { id: "product-verticals", title: "Product Verticals", desc: "Enable loan / MF / insurance / stocks verticals.", category: "CONFIGURATION", icon: Layers, count: 6 },
  { id: "notifications", title: "Notifications", desc: "In-app, SMS, email & WhatsApp trigger notification rules.", category: "CONFIGURATION", icon: Bell },
  { id: "theme-navigation", title: "Theme & Navigation", desc: "Theme styling, branding colors & navigation customisation.", category: "CONFIGURATION", icon: Palette },
  { id: "pdd-alerts", title: "PDD Alerts", desc: "Who gets emailed when RC / Insurance / Title deeds are due.", category: "CONFIGURATION", icon: AlertCircle },
  { id: "credit-report-policy", title: "Credit Report Policy", desc: "Require a collected payment before a lead's CIBIL / Experian pull.", category: "CONFIGURATION", icon: ShieldAlert },
  { id: "invoice-format", title: "Invoice Format", desc: "Choose your invoice layout + collection bank details.", category: "CONFIGURATION", icon: FileText },
  { id: "co-branding", title: "Co-Branding", desc: "Co-branded loan application links, custom domains & partner logos.", category: "CONFIGURATION", icon: Sparkles },
  { id: "website", title: "Website", desc: "Your public lead-capture website & pages.", category: "CONFIGURATION", icon: Globe },
  { id: "integrations", title: "Integrations", desc: "Connect external tools & third-party APIs (Digitap, Karza).", category: "CONFIGURATION", icon: Zap, count: 4 },

  // 3. HR & PAYROLL (9 modules)
  { id: "leave-types", title: "Leave Types", desc: "Casual, Sick, Earned & Maternity leave allowances.", category: "HR & PAYROLL", icon: Calendar, count: 4 },
  { id: "assign-leave-balance", title: "Assign Leave Balance", desc: "Allocate annual leave quotas & carry-forward balance.", category: "HR & PAYROLL", icon: CalendarDays, count: 3 },
  { id: "holidays", title: "Holidays", desc: "Official company calendar & gazetted holiday schedule.", category: "HR & PAYROLL", icon: Calendar, count: 4 },
  { id: "approval-chains", title: "Approval Chains", desc: "Multi-level leave, expense and payout approval hierarchy.", category: "HR & PAYROLL", icon: GitMerge },
  { id: "office-timings", title: "Office Timings", desc: "Shift timings, grace periods & biometric punch rules.", category: "HR & PAYROLL", icon: Clock },
  { id: "salary-components", title: "Salary Components", desc: "Basic, HRA, Special Allowance, PF, ESI & TDS tax slabs.", category: "HR & PAYROLL", icon: Layers, count: 7 },
  { id: "salary-structure", title: "Salary Structure", desc: "CTC breakup templates, role-based ladders & formulas.", category: "HR & PAYROLL", icon: FileText, count: 2 },
  { id: "incentives", title: "Incentives", desc: "Performance incentive slabs for loan disbursement milestones.", category: "HR & PAYROLL", icon: Gift, count: 3 },
  { id: "conveyance", title: "Conveyance", desc: "Travel reimbursement policies, per-km rates & fuel allowances.", category: "HR & PAYROLL", icon: Navigation },

  // 4. SETTINGS (4 modules)
  { id: "roles-permissions", title: "Roles & Permissions", desc: "Granular role access (Admin, Branch Manager, Sales Agent).", category: "SETTINGS", icon: ShieldCheck, count: 4 },
  { id: "company-invoice", title: "Company / Invoice", desc: "Legal entity name, GSTIN, registered office & bank account.", category: "SETTINGS", icon: Building },
  { id: "api-access", title: "API Access", desc: "Developer API keys, webhook signing secrets & token rotation.", category: "SETTINGS", icon: KeyRound, count: 2 },
  { id: "start-fresh", title: "Start Fresh", desc: "Database reset utility, purge test leads & clean slate restore.", category: "SETTINGS", icon: AlertTriangle }
];
