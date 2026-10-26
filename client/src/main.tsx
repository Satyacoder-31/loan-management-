import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { AuthProvider, useAuth } from "./lib/auth";
import { Shell } from "./components/Shell";
import { PortalShell } from "./components/PortalShell";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Documentation from "./pages/Documentation";
import ApplyRoot from "./pages/apply/ApplyRoot";
import DigitapTestPortal from "./pages/DigitapTestPortal";
import Channel from "./pages/Channel";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalApply from "./pages/portal/PortalApply";
import PortalApplications from "./pages/portal/PortalApplications";
import PortalLoans from "./pages/portal/PortalLoans";
import PortalDocuments from "./pages/portal/PortalDocuments";
import PortalSupport from "./pages/portal/PortalSupport";
import CustomerUploadPortal from "./pages/portal/CustomerUploadPortal";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Telecall from "./pages/Telecall";
import Customers from "./pages/Customers";
import Customer360 from "./pages/Customer360";
import Applications from "./pages/Applications";
import ApplicationWorkspace from "./pages/ApplicationWorkspace";
import Underwriting from "./pages/Underwriting";
import BREBuilder from "./pages/BREBuilder";
import CreditRisk from "./pages/CreditRisk";
import Loans from "./pages/Loans";
import LoanWorkspace from "./pages/LoanWorkspace";
import Payments from "./pages/Payments";
import Collections from "./pages/Collections";
import Compliance from "./pages/Compliance";
import AuditLog from "./pages/AuditLog";
import Reports from "./pages/Reports";
import Risk from "./pages/Risk";
import AI from "./pages/AI";
import Network from "./pages/Network";
import Integrations from "./pages/Integrations";
import DocLab from "./pages/DocLab";
import Admin from "./pages/Admin";
import { GnDashboard } from "./pages/gn/GnDashboard";
import { GnApplications } from "./pages/gn/GnApplications";
import { GnLeads } from "./pages/gn/GnLeads";
import { GnSanction } from "./pages/gn/GnSanction";
import { GnDisbursement } from "./pages/gn/GnDisbursement";
import { GnCrossSelling } from "./pages/gn/GnCrossSelling";
import { GnDirectBooking } from "./pages/gn/GnDirectBooking";
import { GnWallet } from "./pages/gn/GnWallet";
import { GnApis } from "./pages/gn/GnApis";
import { GnTasks } from "./pages/gn/GnTasks";
import { GnTools } from "./pages/gn/GnTools";
import { GnUtility } from "./pages/gn/GnUtility";
import { GnSetup } from "./pages/gn/GnSetup";
import { GnMasters } from "./pages/gn/GnMasters";
import { GnConfiguration } from "./pages/gn/GnConfiguration";
import { GnSettings } from "./pages/gn/GnSettings";
import { GnRoles } from "./pages/gn/GnRoles";
import { GnReports } from "./pages/gn/GnReports";
import { GnScorecard } from "./pages/gn/GnScorecard";
import { GnChat } from "./pages/gn/GnChat";
import { GnNoticeBoard } from "./pages/gn/GnNoticeBoard";
import { GnLenders } from "./pages/gn/GnLenders";
import { GnPartners } from "./pages/gn/GnPartners";
import { GnFinance } from "./pages/gn/GnFinance";
import { GnHR } from "./pages/gn/GnHR";
import { GnMarketing } from "./pages/gn/GnMarketing";
import { GnInbox } from "./pages/gn/GnInbox";
import { GnDocs } from "./pages/gn/GnDocs";
import { GnHelp } from "./pages/gn/GnHelp";
import { GnChangelog } from "./pages/gn/GnChangelog";
import { GnRecycleBin } from "./pages/gn/GnRecycleBin";
import { GnOverview } from "./pages/gn/GnOverview";
import { GnNewApplicant } from "./pages/gn/GnNewApplicant";
import { GnApplicants } from "./pages/gn/GnApplicants";
import { GnBulk } from "./pages/gn/GnBulk";
import { GnApiCenter } from "./pages/gn/GnApiCenter";
import { GnTeam } from "./pages/gn/GnTeam";
import { GnCommitments } from "./pages/gn/GnCommitments";
import { GnAnalytics } from "./pages/gn/GnAnalytics";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error("Portal render error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-xl font-bold mb-3 shadow-xs">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-slate-900">Portal Interface Notice</h2>
          <p className="text-xs text-rose-700 mt-2 max-w-lg font-mono bg-white p-3 rounded-lg border border-slate-200 text-left overflow-auto shadow-xs">
            {this.state.error?.message || "Rendering exception encountered"}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.hash = "#/crm/commitments"; window.location.reload(); }}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
          >
            Refresh Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-blue-600 animate-pulse" />
          <span className="text-[13px] text-slate-600 font-medium">Loading TELEPORT…</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  // Customer accounts land in the customer portal; staff see the operations shell
  if (user.role === "customer") return <PortalShell><ErrorBoundary>{children}</ErrorBoundary></PortalShell>;
  return <Shell><ErrorBoundary>{children}</ErrorBoundary></Shell>;
}

function Home() {
  const { user } = useAuth();
  return user?.role === "customer" ? <PortalDashboard /> : <GnCommitments />;
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Protected><Home /></Protected>} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/apply" element={<ApplyRoot />} />
          <Route path="/apply/*" element={<ApplyRoot />} />
          <Route path="/test-portal" element={<DigitapTestPortal />} />
          <Route path="/digitap-portal" element={<DigitapTestPortal />} />
          <Route path="/upload/:id" element={<CustomerUploadPortal />} />
          <Route path="/portal/upload/:id" element={<CustomerUploadPortal />} />

          {/* Primary Operations Portal (Teleport Shell) */}
          <Route path="/app" element={<Protected><Home /></Protected>} />
          <Route path="/dashboard" element={<Protected><GnDashboard /></Protected>} />

          {/* 3. Setup Hub & Reference Modules */}
          <Route path="/setup" element={<Protected><GnSetup /></Protected>} />
          <Route path="/setup/*" element={<Protected><GnSetup /></Protected>} />
          <Route path="/masters" element={<Protected><GnSetup /></Protected>} />
          <Route path="/masters/*" element={<Protected><GnSetup /></Protected>} />
          <Route path="/banks" element={<Protected><GnSetup /></Protected>} />
          <Route path="/branches" element={<Protected><GnSetup /></Protected>} />
          <Route path="/products" element={<Protected><GnSetup /></Protected>} />
          <Route path="/parent-dsas" element={<Protected><GnSetup /></Protected>} />
          <Route path="/dsa-codes" element={<Protected><GnSetup /></Protected>} />
          <Route path="/scheme-feed" element={<Protected><GnSetup /></Protected>} />
          <Route path="/schemes" element={<Protected><GnSetup /></Protected>} />
          <Route path="/connector-payouts" element={<Protected><GnSetup /></Protected>} />
          <Route path="/scheme-profiles" element={<Protected><GnSetup /></Protected>} />
          <Route path="/territories" element={<Protected><GnSetup /></Protected>} />
          <Route path="/sales-targets" element={<Protected><GnSetup /></Protected>} />

          {/* 4. Team, Partners & Global Banker Directory */}
          <Route path="/team" element={<Protected><GnTeam /></Protected>} />
          <Route path="/partners" element={<Protected><GnTeam /></Protected>} />
          <Route path="/employees" element={<Protected><GnTeam /></Protected>} />
          <Route path="/team-tree" element={<Protected><GnTeam /></Protected>} />
          <Route path="/suppliers" element={<Protected><GnTeam /></Protected>} />
          <Route path="/banker-master" element={<Protected><GnTeam /></Protected>} />
          <Route path="/team/*" element={<Protected><GnTeam /></Protected>} />

          {/* 5, 6, 7. Configuration, Settings, Reports & Scorecard */}
          <Route path="/configuration" element={<Protected><GnConfiguration /></Protected>} />
          <Route path="/settings" element={<Protected><GnSettings /></Protected>} />
          <Route path="/reports" element={<Protected><GnReports /></Protected>} />
          <Route path="/scorecard" element={<Protected><GnScorecard /></Protected>} />

          {/* 8. Utility & Central Tools */}
          <Route path="/utility" element={<Protected><GnUtility /></Protected>} />
          <Route path="/tools" element={<Protected><GnTools /></Protected>} />
          <Route path="/documents" element={<Protected><GnDocs /></Protected>} />
          <Route path="/tasks" element={<Protected><GnTasks /></Protected>} />

          {/* 9, 10 & 11. Wallet, Chat, Notice Board & Instant APIs */}
          <Route path="/wallet" element={<Protected><GnWallet /></Protected>} />
          <Route path="/chat" element={<Protected><GnChat /></Protected>} />
          <Route path="/notice-board" element={<Protected><GnNoticeBoard /></Protected>} />
          <Route path="/notices" element={<Protected><GnNoticeBoard /></Protected>} />
          <Route path="/apis" element={<Protected><GnApis /></Protected>} />

          {/* 11. CRM & Loan Pipeline */}
          <Route path="/crm" element={<Protected><GnCommitments /></Protected>} />
          <Route path="/crm/commitments" element={<Protected><GnCommitments /></Protected>} />
          <Route path="/new-applicant" element={<Protected><GnNewApplicant /></Protected>} />
          <Route path="/applicant/new" element={<Protected><GnNewApplicant /></Protected>} />
          <Route path="/crm/new-applicant" element={<Protected><GnNewApplicant /></Protected>} />
          <Route path="/co/new" element={<Protected><GnNewApplicant /></Protected>} />
          <Route path="/crm/all" element={<Protected><GnApplications /></Protected>} />
          <Route path="/leads" element={<Protected><GnLeads /></Protected>} />
          <Route path="/leads/:id" element={<Protected><LeadDetail /></Protected>} />
          <Route path="/loans" element={<Protected><GnApplications /></Protected>} />
          <Route path="/loans/:id" element={<Protected><LoanWorkspace /></Protected>} />
          <Route path="/crm/sanction" element={<Protected><GnSanction /></Protected>} />
          <Route path="/crm/disbursement" element={<Protected><GnDisbursement /></Protected>} />
          <Route path="/crm/pdd" element={<Protected><GnApplications /></Protected>} />
          <Route path="/cross-selling" element={<Protected><GnCrossSelling /></Protected>} />
          <Route path="/crm/direct-booking" element={<Protected><GnDirectBooking /></Protected>} />
          <Route path="/crm/agreements" element={<Protected><GnApplications /></Protected>} />

          {/* 12. Finance, Payin, Receivable Aging & Payouts */}
          <Route path="/finance" element={<Protected><GnFinance /></Protected>} />
          <Route path="/finance/income" element={<Protected><GnFinance /></Protected>} />
          <Route path="/finance/received" element={<Protected><GnFinance /></Protected>} />
          <Route path="/payin/receivable" element={<Protected><GnFinance /></Protected>} />
          <Route path="/finance/receivable" element={<Protected><GnFinance /></Protected>} />
          <Route path="/finance/parent-dsa" element={<Protected><GnFinance /></Protected>} />
          <Route path="/finance/fees" element={<Protected><GnFinance /></Protected>} />
          <Route path="/payouts" element={<Protected><GnFinance /></Protected>} />
          <Route path="/payouts/payable" element={<Protected><GnFinance /></Protected>} />
          <Route path="/payouts/paid" element={<Protected><GnFinance /></Protected>} />
          <Route path="/accounting" element={<Protected><GnFinance /></Protected>} />

          {/* 13 & 14. HR, Marketing & Help */}
          <Route path="/hr" element={<Protected><GnHR /></Protected>} />
          <Route path="/hr/*" element={<Protected><GnHR /></Protected>} />
          <Route path="/marketing" element={<Protected><GnMarketing /></Protected>} />
          <Route path="/marketing/*" element={<Protected><GnMarketing /></Protected>} />
          <Route path="/help" element={<Protected><GnHelp /></Protected>} />
          <Route path="/help/*" element={<Protected><GnHelp /></Protected>} />
          <Route path="/docs" element={<Protected><GnHelp /></Protected>} />
          <Route path="/documentation" element={<Protected><GnHelp /></Protected>} />

          {/* Legacy & GN Sub-Routes */}
          <Route path="/telecall" element={<Protected><Telecall /></Protected>} />
          <Route path="/customers" element={<Protected><Customers /></Protected>} />
          <Route path="/customers/:id" element={<Protected><Customer360 /></Protected>} />
          <Route path="/applications" element={<Protected><GnApplications /></Protected>} />
          <Route path="/applications/:id" element={<Protected><ApplicationWorkspace /></Protected>} />
          <Route path="/underwriting" element={<Protected><Underwriting /></Protected>} />
          <Route path="/bre" element={<Protected><BREBuilder /></Protected>} />
          <Route path="/credit" element={<Protected><CreditRisk /></Protected>} />
          <Route path="/payments" element={<Protected><Payments /></Protected>} />
          <Route path="/collections" element={<Protected><Collections /></Protected>} />
          <Route path="/compliance" element={<Protected><Compliance /></Protected>} />
          <Route path="/audit" element={<Protected><AuditLog /></Protected>} />
          <Route path="/risk" element={<Protected><Risk /></Protected>} />
          <Route path="/ai" element={<Protected><AI /></Protected>} />
          <Route path="/network" element={<Protected><Network /></Protected>} />
          <Route path="/integrations" element={<Protected><Integrations /></Protected>} />
          <Route path="/doclab" element={<Protected><DocLab /></Protected>} />
          <Route path="/admin" element={<Protected><Admin /></Protected>} />
          <Route path="/channel" element={<Protected><Channel /></Protected>} />

          <Route path="/gn" element={<Protected><GnDashboard /></Protected>} />
          <Route path="/gn/applications" element={<Protected><GnApplications /></Protected>} />
          <Route path="/gn/leads" element={<Protected><GnLeads /></Protected>} />
          <Route path="/gn/sanction" element={<Protected><GnSanction /></Protected>} />
          <Route path="/gn/disbursement" element={<Protected><GnDisbursement /></Protected>} />
          <Route path="/gn/cross-selling" element={<Protected><GnCrossSelling /></Protected>} />
          <Route path="/gn/direct-booking" element={<Protected><GnDirectBooking /></Protected>} />
          <Route path="/gn/wallet" element={<Protected><GnWallet /></Protected>} />
          <Route path="/gn/apis" element={<Protected><GnApis /></Protected>} />
          <Route path="/gn/tasks" element={<Protected><GnTasks /></Protected>} />
          <Route path="/gn/tools" element={<Protected><GnTools /></Protected>} />
          <Route path="/gn/utility" element={<Protected><GnUtility /></Protected>} />
          <Route path="/gn/masters" element={<Protected><GnMasters /></Protected>} />
          <Route path="/gn/configuration" element={<Protected><GnConfiguration /></Protected>} />
          <Route path="/gn/settings" element={<Protected><GnSettings /></Protected>} />
          <Route path="/gn/roles" element={<Protected><GnRoles /></Protected>} />
          <Route path="/gn/reports" element={<Protected><GnReports /></Protected>} />
          <Route path="/gn/lenders" element={<Protected><GnLenders /></Protected>} />
          <Route path="/gn/partners" element={<Protected><GnPartners /></Protected>} />
          <Route path="/gn/finance" element={<Protected><GnFinance /></Protected>} />
          <Route path="/gn/hr" element={<Protected><GnHR /></Protected>} />
          <Route path="/gn/co" element={<Protected><GnOverview /></Protected>} />
          <Route path="/gn/co/new" element={<Protected><GnNewApplicant /></Protected>} />
          <Route path="/gn/co/applicants" element={<Protected><GnApplicants /></Protected>} />
          <Route path="/gn/co/bulk" element={<Protected><GnBulk /></Protected>} />
          <Route path="/gn/co/api" element={<Protected><GnApiCenter /></Protected>} />
          <Route path="/gn/co/analytics" element={<Protected><GnAnalytics /></Protected>} />
          <Route path="/gn/marketing" element={<Protected><GnMarketing /></Protected>} />
          <Route path="/gn/inbox" element={<Protected><GnInbox /></Protected>} />
          <Route path="/gn/docs" element={<Protected><GnDocs /></Protected>} />
          <Route path="/gn/help" element={<Protected><GnHelp /></Protected>} />
          <Route path="/gn/changelog" element={<Protected><GnChangelog /></Protected>} />
          <Route path="/gn/recycle-bin" element={<Protected><GnRecycleBin /></Protected>} />

          {/* Customer Self-Serve Portal */}
          <Route path="/portal" element={<Protected><PortalDashboard /></Protected>} />
          <Route path="/portal/apply" element={<Protected><PortalApply /></Protected>} />
          <Route path="/portal/applications" element={<Protected><PortalApplications /></Protected>} />
          <Route path="/portal/applications/:id" element={<Protected><PortalApplications /></Protected>} />
          <Route path="/portal/loans" element={<Protected><PortalLoans /></Protected>} />
          <Route path="/portal/loans/:id" element={<Protected><PortalLoans /></Protected>} />
          <Route path="/portal/documents" element={<Protected><PortalDocuments /></Protected>} />
          <Route path="/portal/support" element={<Protected><PortalSupport /></Protected>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
