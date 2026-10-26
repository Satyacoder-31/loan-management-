import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Play, 
  Layers, 
  Cpu, 
  FileCheck, 
  ArrowRight,
  Shield,
  Workflow,
  Sparkles,
  CreditCard,
  Building2,
  Users,
  Smartphone,
  PieChart
} from 'lucide-react';

interface HeaderProps {
  onOpenBookDemo: () => void;
  onOpenTour: () => void;
  onOpenLiveDemo: () => void;
  onLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBookDemo, onOpenTour, onOpenLiveDemo, onLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800/80 py-3 text-white' 
          : 'bg-slate-900/90 backdrop-blur-sm py-3.5 border-b border-slate-800 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 border border-slate-800">
              <span className="text-blue-400 font-extrabold tracking-tighter">N</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">SNIPER</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/60">OS</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight hidden sm:block">
                India's Intelligent Lending Operating System
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            
            {/* Platform Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMenu('platform')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white flex items-center gap-1 rounded-lg hover:bg-slate-800 transition-colors">
                <span>Platform</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === 'platform' ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} />
              </button>

              {activeMenu === 'platform' && (
                <div className="absolute top-full left-0 w-[640px] mt-1 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="col-span-2 pb-3 mb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">SNIPER Core Modules</h4>
                      <p className="text-xs text-slate-500">Connected lifecycle from Lead to Recovery</p>
                    </div>
                    <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-md">18+ Modules</span>
                  </div>

                  <a href="#los" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Workflow className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Loan Origination (LOS)</div>
                      <div className="text-xs text-slate-500">13-stage friction-free approval pipeline</div>
                    </div>
                  </a>

                  <a href="#lms" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">Loan Servicing (LMS)</div>
                      <div className="text-xs text-slate-500">Core accounting, EMI schedules & interest</div>
                    </div>
                  </a>

                  <a href="#bre" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-sky-600">Credit BRE Engine</div>
                      <div className="text-xs text-slate-500">Visual rules builder, DSCR, FOIR & CIBIL</div>
                    </div>
                  </a>

                  <a href="#payments" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600">Payments & Auto-Recon</div>
                      <div className="text-xs text-slate-500">98%+ automated bank matching & eNACH</div>
                    </div>
                  </a>

                  <a href="#sniper-ai" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group col-span-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        SNIPER AI Copilot
                        <span className="text-[10px] font-bold uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded">NEW</span>
                      </div>
                      <div className="text-xs text-slate-600">Operational AI for applications risk, reconciliation & SLA breach alerts</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Solutions */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMenu('solutions')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white flex items-center gap-1 rounded-lg hover:bg-slate-800 transition-colors">
                <span>Solutions</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === 'solutions' ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} />
              </button>

              {activeMenu === 'solutions' && (
                <div className="absolute top-full left-0 w-[520px] mt-1 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <a href="#industries" className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                    <Building2 className="w-5 h-5 text-blue-600 mb-1.5" />
                    <div className="text-sm font-semibold text-slate-900">NBFCs & Banks</div>
                    <div className="text-xs text-slate-500 mt-0.5">Scale multi-product lending with compliance</div>
                  </a>
                  <a href="#industries" className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                    <Sparkles className="w-5 h-5 text-indigo-600 mb-1.5" />
                    <div className="text-sm font-semibold text-slate-900">Fintechs & Lenders</div>
                    <div className="text-xs text-slate-500 mt-0.5">Sub-second API origination & instant KFS</div>
                  </a>
                  <a href="#dsa" className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                    <Users className="w-5 h-5 text-emerald-600 mb-1.5" />
                    <div className="text-sm font-semibold text-slate-900">DSA Networks</div>
                    <div className="text-xs text-slate-500 mt-0.5">Partner portals with commission tracking</div>
                  </a>
                  <a href="#field-sales" className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                    <Smartphone className="w-5 h-5 text-sky-600 mb-1.5" />
                    <div className="text-sm font-semibold text-slate-900">Field Operations</div>
                    <div className="text-xs text-slate-500 mt-0.5">Mobile geo-tagging & offline collection</div>
                  </a>
                </div>
              )}
            </div>

            <a href="#compliance" className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              Compliance
            </a>

            <a href="#integrations" className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              Integrations
            </a>

            <a href="#analytics" className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              Portfolio Risk
            </a>

            <a href="#white-label" className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              White Label
            </a>

            <a href="#/docs" className="px-3.5 py-2 text-sm font-medium text-blue-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1">
              <span>Docs</span>
            </a>
          </nav>

          {/* Right Action Corner: Outlined Login Button at the Last Corner */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Desktop secondary actions on wide screens */}
            <div className="hidden xl:flex items-center gap-2">
              <a 
                href="#/test-portal"
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>CellX Portal</span>
              </a>

              <button 
                onClick={onOpenLiveDemo}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <PieChart className="w-3.5 h-3.5 text-blue-400" />
                <span>Live Sandbox</span>
              </button>

              <button 
                onClick={onOpenTour}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-slate-300" />
                <span>Watch Tour</span>
              </button>
            </div>

            {/* Outlined Prominent Login Button at Top Right Corner */}
            <button 
              onClick={onLogin}
              className="px-4 py-1.5 text-sm font-semibold text-white hover:text-slate-950 border border-white/80 hover:border-white hover:bg-white rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center tracking-wide active:scale-95"
              title="Log into SNIPER Lending OS"
            >
              <span>Login</span>
            </button>

            {/* Hamburger Menu Toggle (always adjacent to Login in the top-right corner) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>

        </div>
      </div>

      {/* Drawer Menu */}
      {mobileMenuOpen && (
        <div className="bg-slate-900/98 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200 text-white shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenTour(); }}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Watch Tour
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenLiveDemo(); }}
              className="w-full py-2 px-3 text-xs font-semibold text-blue-300 bg-blue-950/80 hover:bg-blue-900/80 border border-blue-800/60 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <PieChart className="w-3.5 h-3.5 text-blue-400" />
              Live Sandbox
            </button>
          </div>

          <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-200">
            <a href="#/test-portal" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/40 hover:bg-emerald-900/60">
              🧪 CellX + Digitap Test Portal
            </a>
            <a href="#/docs" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg bg-blue-950/60 text-blue-300 font-bold border border-blue-800/60 hover:bg-blue-900/60">
              📖 Product Documentation & PDF
            </a>
            <a href="#los" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">Loan Origination (LOS)</a>
            <a href="#lms" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">Loan Servicing (LMS)</a>
            <a href="#bre" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">Credit BRE Engine</a>
            <a href="#payments" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">Payments & Auto-Recon</a>
            <a href="#collections" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">Smart Collections</a>
            <a href="#sniper-ai" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 text-blue-400 font-semibold transition-colors">SNIPER AI Copilot</a>
            <a href="#compliance" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">Compliance & KFS</a>
            <a href="#integrations" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">Integrations (CIBIL, Setu, AA)</a>
            <a href="#industries" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">Industries & Models</a>
          </nav>

          <div className="pt-2 space-y-2">
            <button 
              onClick={() => { setMobileMenuOpen(false); onLogin(); }}
              className="w-full py-2.5 text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl shadow text-center transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenBookDemo(); }}
              className="w-full py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow text-center transition-colors"
            >
              BOOK A PRIVATE DEMO
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
