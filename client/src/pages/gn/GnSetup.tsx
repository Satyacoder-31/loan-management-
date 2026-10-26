import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search, Sparkles, ChevronRight, ChevronLeft, RefreshCw,
  CheckCircle2
} from "lucide-react";
import { SetupModule, SETUP_MODULES } from "./setup/types";
import {
  BanksModule, BankBranchModule, ProductsModule, InsuranceModule,
  ParentDsaModule, DsaCodeModule, SchemeFeedModule, SchemesModule,
  PayoutStructureModule, CustomerProfileModule, PinCodeModule, TeamTargetModule
} from "./setup/SetupMasters";
import {
  WhatsAppModule, MetaModule, GoogleAdsModule, IvrModule, SmtpModule,
  RazorpayModule, CustomStatusModule, LeadSourcesModule, PartnerTypesModule,
  FieldCustomisationModule, AssignmentRulesModule, ProductVerticalsModule,
  NotificationsModule, ThemeNavModule, PddAlertsModule, CreditReportPolicyModule,
  InvoiceFormatModule, CoBrandingModule, WebsiteModule, IntegrationsModule
} from "./setup/SetupConfig";
import {
  LeaveTypesModule, AssignLeaveBalanceModule, HolidaysModule,
  ApprovalChainsModule, OfficeTimingsModule, SalaryComponentsModule,
  SalaryStructureModule, IncentivesModule, ConveyanceModule
} from "./setup/SetupHr";
import {
  RolesPermissionsModule, CompanyInvoiceModule, ApiAccessModule, StartFreshModule
} from "./setup/SetupSettings";

export { SETUP_MODULES };
export type { SetupModule };

export function GnSetup() {
  const [params, setParams] = useSearchParams();
  const currentTab = params.get("tab") || params.get("sub") || "";
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const activeModule = useMemo(() => {
    if (!currentTab) return null;
    return SETUP_MODULES.find(
      (m) =>
        m.id.toLowerCase() === currentTab.toLowerCase() ||
        m.title.toLowerCase() === currentTab.toLowerCase()
    );
  }, [currentTab]);

  const filteredModules = useMemo(() => {
    if (!search.trim()) return SETUP_MODULES;
    const q = search.toLowerCase();
    return SETUP_MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    );
  }, [search]);

  const masters = filteredModules.filter((m) => m.category === "MASTERS");
  const config = filteredModules.filter((m) => m.category === "CONFIGURATION");
  const hr = filteredModules.filter((m) => m.category === "HR & PAYROLL");
  const settings = filteredModules.filter((m) => m.category === "SETTINGS");

  return (
    <div className="min-h-full bg-[#090d16] text-slate-100 p-4 md:p-6 space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* VIEW: MAIN SETUP HUB (When no module is selected) */}
      {!activeModule ? (
        <div className="space-y-6 max-w-[1560px] mx-auto">
          {/* Header */}
          <div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-slate-200">Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Setup
              </h1>
              <span className="w-5 h-5 rounded-full border border-slate-600 text-slate-400 flex items-center justify-center text-[11px] cursor-pointer hover:border-slate-400 hover:text-slate-200" title="Setup Hub">
                ⓘ
              </span>
            </div>
            <p className="text-[13px] text-slate-400 mt-1">
              Masters, configuration and account settings — everything you set up once, in one place.
            </p>
          </div>

          {/* Search bar matching screenshot */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search setup — banks, WhatsApp, roles, salary, pin codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0d1322] border border-[#1e293b] rounded-xl text-[13.5px] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-2 py-0.5 rounded-md hover:bg-slate-800 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Callout Notice matching screenshot */}
          <div className="rounded-xl bg-[#0d1627] border border-[#1e2d4d] px-4 py-3 flex items-center gap-3 text-[12.5px] text-slate-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-white font-semibold">A strong master is the foundation of a great system & automation.</strong> An hour spent here saves 100 hours in operations.
            </span>
          </div>

          {/* 1. MASTERS SECTION */}
          {masters.length > 0 && (
            <div className="space-y-3 pt-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Masters</h2>
                <p className="text-[12px] text-slate-400">The reference data your CRM runs on.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {masters.map((m) => (
                  <ModuleCard key={m.id} module={m} onClick={() => setParams({ tab: m.id })} />
                ))}
              </div>
            </div>
          )}

          {/* 2. CONFIGURATION SECTION */}
          {config.length > 0 && (
            <div className="space-y-3 pt-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Configuration</h2>
                <p className="text-[12px] text-slate-400">Channels, rules and the things that run automatically.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {config.map((m) => (
                  <ModuleCard key={m.id} module={m} onClick={() => setParams({ tab: m.id })} />
                ))}
              </div>
            </div>
          )}

          {/* 3. HR & PAYROLL SECTION */}
          {hr.length > 0 && (
            <div className="space-y-3 pt-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">HR & Payroll</h2>
                <p className="text-[12px] text-slate-400">Leave, attendance rules and how salary is put together.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {hr.map((m) => (
                  <ModuleCard key={m.id} module={m} onClick={() => setParams({ tab: m.id })} />
                ))}
              </div>
            </div>
          )}

          {/* 4. SETTINGS SECTION */}
          {settings.length > 0 && (
            <div className="space-y-3 pt-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Settings</h2>
                <p className="text-[12px] text-slate-400">Your account, your people and your invoices.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {settings.map((m) => (
                  <ModuleCard key={m.id} module={m} onClick={() => setParams({ tab: m.id })} />
                ))}
              </div>
            </div>
          )}

          {/* Floating Action Button */}
          <button
            onClick={() => showToast("Setup Navigator Active — select any module to edit rules or add reference data")}
            className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 transition-all cursor-pointer z-40"
            title="Setup Quick Assist"
          >
            <Sparkles size={18} />
          </button>
        </div>
      ) : (
        /* VIEW: DEDICATED MODULE MANAGEMENT VIEW */
        <div className="space-y-6 max-w-[1560px] mx-auto animate-in fade-in-50 duration-150">
          {/* Header with Back button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182235] pb-4">
            <div>
              <button
                onClick={() => setParams({})}
                className="flex items-center gap-1.5 text-[12.5px] font-semibold text-blue-400 hover:text-blue-300 transition-colors mb-2 cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Back to Setup Hub</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-blue-400">
                  <activeModule.icon size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    {activeModule.title}
                  </h1>
                  <p className="text-[12.5px] text-slate-400">{activeModule.desc}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#111827] border border-[#1e293b] text-slate-400">
                Category: <strong className="text-slate-200">{activeModule.category}</strong>
              </span>
              <button
                onClick={() => showToast(`Synchronized ${activeModule.title} configuration with live system`)}
                className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-slate-300 hover:text-white hover:bg-[#162033] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Render Active Module Body */}
          <ModuleContent module={activeModule} onNotify={showToast} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MODULE CARD COMPONENT
// ============================================================================

function ModuleCard({ module, onClick }: { module: SetupModule; onClick: () => void }) {
  const Icon = module.icon;
  return (
    <div
      onClick={onClick}
      className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b] hover:border-blue-500/50 hover:bg-[#131f33] transition-all duration-150 cursor-pointer group flex items-center justify-between shadow-xs select-none"
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="w-8 h-8 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-400 flex items-center justify-center shrink-0 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors">
          <Icon size={16} />
        </div>
        <div className="truncate">
          <h3 className="text-[13px] font-medium text-slate-200 group-hover:text-white truncate">
            {module.title}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {module.count !== undefined && (
          <span className="text-[11px] font-semibold text-slate-400 bg-[#0d1322] px-2 py-0.5 rounded-md border border-[#1e293b]/70 font-mono">
            {module.count}
          </span>
        )}
        <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}

// ============================================================================
// DYNAMIC MODULE CONTENT SWITCHER
// ============================================================================

function ModuleContent({ module, onNotify }: { module: SetupModule; onNotify: (msg: string) => void }) {
  switch (module.id) {
    // --- MASTERS ---
    case "banks":
      return <BanksModule onNotify={onNotify} />;
    case "branches":
      return <BankBranchModule onNotify={onNotify} />;
    case "products":
      return <ProductsModule onNotify={onNotify} />;
    case "insurance":
      return <InsuranceModule onNotify={onNotify} />;
    case "parent-dsas":
      return <ParentDsaModule onNotify={onNotify} />;
    case "dsa-codes":
      return <DsaCodeModule onNotify={onNotify} />;
    case "scheme-feed":
      return <SchemeFeedModule onNotify={onNotify} />;
    case "schemes":
      return <SchemesModule onNotify={onNotify} />;
    case "payout-structure":
      return <PayoutStructureModule onNotify={onNotify} />;
    case "customer-profiles":
      return <CustomerProfileModule onNotify={onNotify} />;
    case "pin-codes":
      return <PinCodeModule onNotify={onNotify} />;
    case "team-targets":
      return <TeamTargetModule onNotify={onNotify} />;

    // --- CONFIGURATION ---
    case "whatsapp":
      return <WhatsAppModule onNotify={onNotify} />;
    case "meta":
      return <MetaModule onNotify={onNotify} />;
    case "google-ads":
      return <GoogleAdsModule onNotify={onNotify} />;
    case "ivr":
      return <IvrModule onNotify={onNotify} />;
    case "smtp":
      return <SmtpModule onNotify={onNotify} />;
    case "razorpay":
      return <RazorpayModule onNotify={onNotify} />;
    case "custom-status":
      return <CustomStatusModule onNotify={onNotify} />;
    case "lead-sources":
      return <LeadSourcesModule onNotify={onNotify} />;
    case "partner-types":
      return <PartnerTypesModule onNotify={onNotify} />;
    case "field-customisation":
      return <FieldCustomisationModule onNotify={onNotify} />;
    case "assignment-rules":
      return <AssignmentRulesModule onNotify={onNotify} />;
    case "product-verticals":
      return <ProductVerticalsModule onNotify={onNotify} />;
    case "notifications":
      return <NotificationsModule onNotify={onNotify} />;
    case "theme-navigation":
      return <ThemeNavModule onNotify={onNotify} />;
    case "pdd-alerts":
      return <PddAlertsModule onNotify={onNotify} />;
    case "credit-report-policy":
      return <CreditReportPolicyModule onNotify={onNotify} />;
    case "invoice-format":
      return <InvoiceFormatModule onNotify={onNotify} />;
    case "co-branding":
      return <CoBrandingModule onNotify={onNotify} />;
    case "website":
      return <WebsiteModule onNotify={onNotify} />;
    case "integrations":
      return <IntegrationsModule onNotify={onNotify} />;

    // --- HR & PAYROLL ---
    case "leave-types":
      return <LeaveTypesModule onNotify={onNotify} />;
    case "assign-leave-balance":
      return <AssignLeaveBalanceModule onNotify={onNotify} />;
    case "holidays":
      return <HolidaysModule onNotify={onNotify} />;
    case "approval-chains":
      return <ApprovalChainsModule onNotify={onNotify} />;
    case "office-timings":
      return <OfficeTimingsModule onNotify={onNotify} />;
    case "salary-components":
      return <SalaryComponentsModule onNotify={onNotify} />;
    case "salary-structure":
      return <SalaryStructureModule onNotify={onNotify} />;
    case "incentives":
      return <IncentivesModule onNotify={onNotify} />;
    case "conveyance":
      return <ConveyanceModule onNotify={onNotify} />;

    // --- SETTINGS ---
    case "roles-permissions":
      return <RolesPermissionsModule onNotify={onNotify} />;
    case "company-invoice":
      return <CompanyInvoiceModule onNotify={onNotify} />;
    case "api-access":
      return <ApiAccessModule onNotify={onNotify} />;
    case "start-fresh":
      return <StartFreshModule onNotify={onNotify} />;

    default:
      return (
        <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] max-w-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <module.icon className="text-blue-400" size={16} /> {module.title}
          </h3>
          <p className="text-slate-400">{module.desc}</p>
          <div className="p-4 rounded-lg bg-[#0c1220] border border-[#1e293b]">
            <p className="text-[11px] text-slate-400">Settings and operational parameters for {module.title} are synced.</p>
          </div>
        </div>
      );
  }
}
