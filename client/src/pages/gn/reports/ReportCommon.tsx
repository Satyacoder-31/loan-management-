import React, { useState } from "react";
import { ChevronLeft, ChevronDown, Download, FileSpreadsheet, Calendar, Sparkles, Filter, RefreshCw } from "lucide-react";

export interface ReportHeaderProps {
  category: string;
  title: string;
  description?: string;
  onBack: () => void;
  timeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  actions?: React.ReactNode;
}

export function ReportHeader({
  category,
  title,
  description,
  onBack,
  timeframe = "30 days",
  onTimeframeChange,
  actions
}: ReportHeaderProps) {
  const [openTf, setOpenTf] = useState(false);
  const timeframes = ["7 days", "30 days", "90 days", "1 year", "Custom range..."];

  return (
    <div className="space-y-4 mb-5">
      {/* Top back bar and timeframe */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#152033] shadow-xs transition-all cursor-pointer"
          >
            <ChevronLeft size={14} className="text-slate-400" />
            <span>All Reports</span>
          </button>

          {/* Timeframe dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenTf(!openTf)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] text-slate-200 text-xs font-medium hover:bg-[#152033] shadow-xs transition-colors cursor-pointer"
            >
              <Calendar size={13} className="text-slate-400" />
              <span>{timeframe}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openTf && (
              <div className="absolute left-0 top-full mt-1 w-40 rounded-xl bg-[#0c1220] border border-[#1e293b] shadow-2xl py-1 z-30 text-xs animate-in fade-in-50 zoom-in-95 duration-100">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      onTimeframeChange?.(tf);
                      setOpenTf(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer ${
                      timeframe === tf ? "bg-blue-600/20 text-blue-400 font-semibold" : "text-slate-300 hover:bg-[#152033]"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom Actions (e.g. Export, Sync, Run Report, etc.) */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Breadcrumb & Title */}
      <div className="border-b border-[#182235] pb-3">
        <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-400 mb-1">
          <span className="hover:text-blue-400 cursor-pointer" onClick={onBack}>Home</span>
          <span>/</span>
          <span className="hover:text-blue-400 cursor-pointer" onClick={onBack}>Reports</span>
          <span>/</span>
          <span className="text-slate-400">{category}</span>
          <span>/</span>
          <span className="text-slate-200 font-semibold">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {title}
          </h1>
          <span
            className="w-4 h-4 rounded-full border border-slate-600 text-slate-400 flex items-center justify-center text-[10px] cursor-pointer hover:border-slate-400 hover:text-slate-200 transition-colors"
            title={description || title}
          >
            ⓘ
          </span>
        </div>

        {description && (
          <p className="text-[12.5px] text-slate-400 mt-1 max-w-4xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function ExportButton({
  label = "Export",
  onExport,
  variant = "ghost"
}: {
  label?: string;
  onExport: () => void;
  variant?: "ghost" | "blue" | "excel" | "csv";
}) {
  if (variant === "blue") {
    return (
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
      >
        <Download size={13} />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === "excel") {
    return (
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] hover:bg-[#152033] text-slate-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
      >
        <FileSpreadsheet size={13} className="text-emerald-400" />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === "csv") {
    return (
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e293b] hover:bg-[#152033] text-slate-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
      >
        <Download size={13} className="text-blue-400" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onExport}
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#131b2e] rounded-lg transition-colors cursor-pointer"
    >
      <Download size={13} />
      <span>{label}</span>
    </button>
  );
}

export function MetricTile({
  label,
  value,
  subtext,
  highlight = false,
  color = "text-white"
}: {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div
      className={`p-4 rounded-xl bg-[#0c1220] border transition-all ${
        highlight
          ? "border-blue-500/50 bg-blue-950/20"
          : "border-[#182235] hover:border-slate-700"
      }`}
    >
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold mt-1 tracking-tight ${color}`}>{value}</div>
      {subtext && <div className="text-[11px] text-slate-500 mt-0.5">{subtext}</div>}
    </div>
  );
}

export function EmptyReportBox({
  message,
  actionLabel,
  onAction
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#182235] bg-[#0c1220]/60 p-12 text-center">
      <p className="text-xs text-slate-400 max-w-md mx-auto">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-3 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
