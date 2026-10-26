import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart2, Target, ChevronDown, CheckCircle2, Sparkles,
  TrendingUp, TrendingDown, ArrowRight, X, SlidersHorizontal,
  RefreshCw, Download, Info, Check, Edit2, RotateCcw, HelpCircle
} from "lucide-react";
import { fmtInr } from "../../lib/api";

// View mode types
type ViewMode = "Business" | "Revenue" | "Partners & Team";
type Granularity = "All" | "Daily" | "Weekly" | "Cycle (1–15 / 16–end)" | "Monthly" | "Quarterly" | "Yearly";

interface ColumnDef {
  id: string;
  label: string;
  sublabel: string;
  group: "yearly" | "quarterly" | "monthly" | "cycle" | "daily" | "weekly";
}

interface CellData {
  value: number;
  change?: string;
  changeType?: "neutral" | "first" | "up" | "down";
}

interface RowDef {
  id: string;
  label: string;
  subtext?: string;
  badge?: string;
  format?: "number" | "currency" | "percent";
  values: Record<string, CellData>;
  demoValues?: Record<string, CellData>;
}

interface TargetsState {
  leads: number;
  logins: number;
  sanctions: number;
  amount: number;
  isSet: boolean;
}

const TARGETS_STORAGE_KEY = "teleport_scorecard_targets_v1";

export function GnScorecard() {
  const nav = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("Business");
  const [granularity, setGranularity] = useState<Granularity>("All");
  const [funnelPeriod, setFunnelPeriod] = useState("Oct 26 so far");
  const [funnelDropdownOpen, setFunnelDropdownOpen] = useState(false);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [drilldownRow, setDrilldownRow] = useState<RowDef | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Targets state with persistence
  const [targets, setTargets] = useState<TargetsState>(() => {
    try {
      const saved = localStorage.getItem(TARGETS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      leads: 50,
      logins: 30,
      sanctions: 20,
      amount: 50000000,
      isSet: false
    };
  });

  // Modal draft inputs
  const [draftTargets, setDraftTargets] = useState({
    leads: targets.leads,
    logins: targets.logins,
    sanctions: targets.sanctions,
    amount: targets.amount
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  // 1. Column Definitions matching video frames 001 - 013
  const ALL_COLUMNS: ColumnDef[] = [
    { id: "fy_25_26", label: "FY 25-26", sublabel: "vs FY 24-25", group: "yearly" },
    { id: "fy_26_27", label: "FY 26-27 SO FAR", sublabel: "vs FY 25-26 to the same day", group: "yearly" },
    { id: "q2_26_27", label: "Q2 26-27", sublabel: "vs the quarter before", group: "quarterly" },
    { id: "q3_26_27", label: "Q3 26-27 SO FAR", sublabel: "vs Q2 26-27 to the same day", group: "quarterly" },
    { id: "sep_26", label: "SEP 26", sublabel: "vs Aug 26", group: "monthly" },
    { id: "oct_26", label: "OCT 26 SO FAR", sublabel: "vs Sep 26 to the same day", group: "monthly" },
    { id: "cycle_1_15_oct", label: "CYCLE 1-15 OCT", sublabel: "vs 16-30 Sep", group: "cycle" },
    { id: "cycle_16_31_oct", label: "CYCLE 16-31 OCT SO FAR", sublabel: "vs 1-15 Oct to the same day", group: "cycle" },
  ];

  // Filter columns based on granularity
  const activeColumns = useMemo(() => {
    if (granularity === "All") return ALL_COLUMNS;
    if (granularity === "Daily") {
      return [
        { id: "today", label: "TODAY", sublabel: "vs Yesterday", group: "daily" as const },
        { id: "yesterday", label: "YESTERDAY", sublabel: "vs Day before", group: "daily" as const }
      ];
    }
    if (granularity === "Weekly") {
      return [
        { id: "this_week", label: "THIS WEEK SO FAR", sublabel: "vs Last week to same day", group: "weekly" as const },
        { id: "last_week", label: "LAST WEEK", sublabel: "vs Week before", group: "weekly" as const }
      ];
    }
    if (granularity === "Cycle (1–15 / 16–end)") {
      return ALL_COLUMNS.filter((c) => c.group === "cycle");
    }
    if (granularity === "Monthly") {
      return ALL_COLUMNS.filter((c) => c.group === "monthly");
    }
    if (granularity === "Quarterly") {
      return ALL_COLUMNS.filter((c) => c.group === "quarterly");
    }
    if (granularity === "Yearly") {
      return ALL_COLUMNS.filter((c) => c.group === "yearly");
    }
    return ALL_COLUMNS;
  }, [granularity]);

  // Neutral cell helper
  const neutral = { value: 0, change: "—", changeType: "neutral" as const };

  // 2. Business Rows
  const businessRows: RowDef[] = [
    {
      id: "leads_received",
      label: "Leads received",
      subtext: "new enquiries; Direct Booking files excluded",
      format: "number",
      values: {
        fy_25_26: { value: 0, change: "—", changeType: "neutral" },
        fy_26_27: { value: 1, change: "first", changeType: "first" },
        q2_26_27: { value: 1, change: "first", changeType: "first" },
        q3_26_27: { value: 0, change: "—", changeType: "neutral" },
        sep_26: { value: 0, change: "▼ 100%", changeType: "down" },
        oct_26: { value: 0, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 0, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 0, change: "—", changeType: "neutral" },
        today: { value: 0, change: "—", changeType: "neutral" },
        yesterday: { value: 0, change: "—", changeType: "neutral" },
        this_week: { value: 0, change: "—", changeType: "neutral" },
        last_week: { value: 0, change: "—", changeType: "neutral" }
      },
      demoValues: {
        fy_25_26: { value: 142, change: "▲ +18%", changeType: "up" },
        fy_26_27: { value: 186, change: "▲ +31%", changeType: "up" },
        q2_26_27: { value: 68, change: "▲ +12%", changeType: "up" },
        q3_26_27: { value: 24, change: "▲ +8%", changeType: "up" },
        sep_26: { value: 34, change: "▲ +15%", changeType: "up" },
        oct_26: { value: 19, change: "▲ +6%", changeType: "up" },
        cycle_1_15_oct: { value: 12, change: "▲ +20%", changeType: "up" },
        cycle_16_31_oct: { value: 7, change: "—", changeType: "neutral" },
        today: { value: 3, change: "▲ +50%", changeType: "up" },
        yesterday: { value: 2, change: "—", changeType: "neutral" },
        this_week: { value: 11, change: "▲ +22%", changeType: "up" },
        last_week: { value: 9, change: "▲ +10%", changeType: "up" }
      }
    },
    {
      id: "logins",
      label: "Logins",
      subtext: "files logged with a bank",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 98, change: "▲ +14%", changeType: "up" },
        fy_26_27: { value: 128, change: "▲ +26%", changeType: "up" },
        q2_26_27: { value: 46, change: "▲ +9%", changeType: "up" },
        q3_26_27: { value: 16, change: "▲ +5%", changeType: "up" },
        sep_26: { value: 24, change: "▲ +12%", changeType: "up" },
        oct_26: { value: 13, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 8, change: "▲ +15%", changeType: "up" },
        cycle_16_31_oct: { value: 5, change: "—", changeType: "neutral" },
        today: { value: 2, change: "▲ +100%", changeType: "up" },
        yesterday: { value: 1, change: "—", changeType: "neutral" },
        this_week: { value: 7, change: "▲ +16%", changeType: "up" },
        last_week: { value: 6, change: "▲ +8%", changeType: "up" }
      }
    },
    {
      id: "sanctioned",
      label: "Sanctioned",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 72, change: "▲ +16%", changeType: "up" },
        fy_26_27: { value: 94, change: "▲ +28%", changeType: "up" },
        q2_26_27: { value: 34, change: "▲ +10%", changeType: "up" },
        q3_26_27: { value: 12, change: "▲ +4%", changeType: "up" },
        sep_26: { value: 18, change: "▲ +11%", changeType: "up" },
        oct_26: { value: 10, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 6, change: "▲ +20%", changeType: "up" },
        cycle_16_31_oct: { value: 4, change: "—", changeType: "neutral" },
        today: { value: 1, change: "—", changeType: "neutral" },
        yesterday: { value: 1, change: "—", changeType: "neutral" },
        this_week: { value: 5, change: "▲ +25%", changeType: "up" },
        last_week: { value: 4, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "amount_sanctioned",
      label: "Amount sanctioned",
      format: "currency",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 245000000, change: "▲ +22%", changeType: "up" },
        fy_26_27: { value: 328000000, change: "▲ +34%", changeType: "up" },
        q2_26_27: { value: 119000000, change: "▲ +15%", changeType: "up" },
        q3_26_27: { value: 42000000, change: "▲ +8%", changeType: "up" },
        sep_26: { value: 63000000, change: "▲ +14%", changeType: "up" },
        oct_26: { value: 35000000, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 21000000, change: "▲ +18%", changeType: "up" },
        cycle_16_31_oct: { value: 14000000, change: "—", changeType: "neutral" },
        today: { value: 3500000, change: "—", changeType: "neutral" },
        yesterday: { value: 3500000, change: "—", changeType: "neutral" },
        this_week: { value: 17500000, change: "▲ +25%", changeType: "up" },
        last_week: { value: 14000000, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "rejected",
      label: "Rejected",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 16, change: "▼ -12%", changeType: "down" },
        fy_26_27: { value: 18, change: "▼ -8%", changeType: "down" },
        q2_26_27: { value: 6, change: "▼ -15%", changeType: "down" },
        q3_26_27: { value: 2, change: "—", changeType: "neutral" },
        sep_26: { value: 3, change: "▼ -20%", changeType: "down" },
        oct_26: { value: 1, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 1, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 0, change: "—", changeType: "neutral" },
        today: { value: 0, change: "—", changeType: "neutral" },
        yesterday: { value: 0, change: "—", changeType: "neutral" },
        this_week: { value: 1, change: "—", changeType: "neutral" },
        last_week: { value: 1, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "files_disbursed",
      label: "Files disbursed",
      subtext: "counted once, on the first tranche",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 64, change: "▲ +17%", changeType: "up" },
        fy_26_27: { value: 82, change: "▲ +29%", changeType: "up" },
        q2_26_27: { value: 29, change: "▲ +11%", changeType: "up" },
        q3_26_27: { value: 10, change: "▲ +6%", changeType: "up" },
        sep_26: { value: 15, change: "▲ +15%", changeType: "up" },
        oct_26: { value: 8, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 5, change: "▲ +25%", changeType: "up" },
        cycle_16_31_oct: { value: 3, change: "—", changeType: "neutral" },
        today: { value: 1, change: "—", changeType: "neutral" },
        yesterday: { value: 1, change: "—", changeType: "neutral" },
        this_week: { value: 4, change: "▲ +33%", changeType: "up" },
        last_week: { value: 3, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "amount_disbursed",
      label: "Amount disbursed",
      subtext: "every tranche that went out in the period",
      format: "currency",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 218000000, change: "▲ +20%", changeType: "up" },
        fy_26_27: { value: 287000000, change: "▲ +32%", changeType: "up" },
        q2_26_27: { value: 101500000, change: "▲ +13%", changeType: "up" },
        q3_26_27: { value: 35000000, change: "▲ +7%", changeType: "up" },
        sep_26: { value: 52500000, change: "▲ +16%", changeType: "up" },
        oct_26: { value: 28000000, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 17500000, change: "▲ +25%", changeType: "up" },
        cycle_16_31_oct: { value: 10500000, change: "—", changeType: "neutral" },
        today: { value: 3500000, change: "—", changeType: "neutral" },
        yesterday: { value: 3500000, change: "—", changeType: "neutral" },
        this_week: { value: 14000000, change: "▲ +33%", changeType: "up" },
        last_week: { value: 10500000, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "average_ticket",
      label: "Average ticket",
      subtext: "amount disbursed ÷ files disbursed, inside the period",
      format: "currency",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 3406250, change: "▲ +3%", changeType: "up" },
        fy_26_27: { value: 3500000, change: "▲ +2.7%", changeType: "up" },
        q2_26_27: { value: 3500000, change: "▲ +2%", changeType: "up" },
        q3_26_27: { value: 3500000, change: "—", changeType: "neutral" },
        sep_26: { value: 3500000, change: "—", changeType: "neutral" },
        oct_26: { value: 3500000, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 3500000, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 3500000, change: "—", changeType: "neutral" },
        today: { value: 3500000, change: "—", changeType: "neutral" },
        yesterday: { value: 3500000, change: "—", changeType: "neutral" },
        this_week: { value: 3500000, change: "—", changeType: "neutral" },
        last_week: { value: 3500000, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "sanctioned_not_disbursed",
      label: "Sanctioned, not disbursed",
      badge: "BALANCE",
      subtext: "sanctioned files with nothing out yet",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 8, change: "—", changeType: "neutral" },
        fy_26_27: { value: 12, change: "▲ +50%", changeType: "up" },
        q2_26_27: { value: 5, change: "—", changeType: "neutral" },
        q3_26_27: { value: 2, change: "—", changeType: "neutral" },
        sep_26: { value: 3, change: "—", changeType: "neutral" },
        oct_26: { value: 2, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 1, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 1, change: "—", changeType: "neutral" },
        today: { value: 2, change: "—", changeType: "neutral" },
        yesterday: { value: 2, change: "—", changeType: "neutral" },
        this_week: { value: 2, change: "—", changeType: "neutral" },
        last_week: { value: 3, change: "▼ -33%", changeType: "down" }
      }
    }
  ];

  // 3. Revenue Rows
  const revenueRows: RowDef[] = [
    {
      id: "payin_accrued",
      label: "Pay-in accrued",
      subtext: "gross institutional brokerage expected",
      format: "currency",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 4360000, change: "▲ +24%", changeType: "up" },
        fy_26_27: { value: 5740000, change: "▲ +32%", changeType: "up" },
        q2_26_27: { value: 2030000, change: "▲ +15%", changeType: "up" },
        q3_26_27: { value: 700000, change: "▲ +6%", changeType: "up" },
        sep_26: { value: 1050000, change: "▲ +14%", changeType: "up" },
        oct_26: { value: 560000, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 350000, change: "▲ +22%", changeType: "up" },
        cycle_16_31_oct: { value: 210000, change: "—", changeType: "neutral" },
        today: { value: 70000, change: "—", changeType: "neutral" },
        yesterday: { value: 70000, change: "—", changeType: "neutral" },
        this_week: { value: 280000, change: "▲ +33%", changeType: "up" },
        last_week: { value: 210000, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "payin_received",
      label: "Pay-in received",
      subtext: "brokerage realized in bank account",
      format: "currency",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 3980000, change: "▲ +21%", changeType: "up" },
        fy_26_27: { value: 5210000, change: "▲ +31%", changeType: "up" },
        q2_26_27: { value: 1890000, change: "▲ +16%", changeType: "up" },
        q3_26_27: { value: 620000, change: "▲ +5%", changeType: "up" },
        sep_26: { value: 980000, change: "▲ +12%", changeType: "up" },
        oct_26: { value: 490000, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 310000, change: "▲ +18%", changeType: "up" },
        cycle_16_31_oct: { value: 180000, change: "—", changeType: "neutral" },
        today: { value: 55000, change: "—", changeType: "neutral" },
        yesterday: { value: 60000, change: "—", changeType: "neutral" },
        this_week: { value: 245000, change: "▲ +28%", changeType: "up" },
        last_week: { value: 190000, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "payout_payable",
      label: "Payout payable",
      subtext: "connector & DSA commission payable",
      format: "currency",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 2180000, change: "▲ +18%", changeType: "up" },
        fy_26_27: { value: 2870000, change: "▲ +32%", changeType: "up" },
        q2_26_27: { value: 1015000, change: "▲ +14%", changeType: "up" },
        q3_26_27: { value: 350000, change: "▲ +5%", changeType: "up" },
        sep_26: { value: 525000, change: "▲ +15%", changeType: "up" },
        oct_26: { value: 280000, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 175000, change: "▲ +20%", changeType: "up" },
        cycle_16_31_oct: { value: 105000, change: "—", changeType: "neutral" },
        today: { value: 35000, change: "—", changeType: "neutral" },
        yesterday: { value: 35000, change: "—", changeType: "neutral" },
        this_week: { value: 140000, change: "▲ +30%", changeType: "up" },
        last_week: { value: 105000, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "payout_paid",
      label: "Payout paid",
      subtext: "commissions disbursed to partners",
      format: "currency",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 1960000, change: "▲ +19%", changeType: "up" },
        fy_26_27: { value: 2540000, change: "▲ +29%", changeType: "up" },
        q2_26_27: { value: 920000, change: "▲ +13%", changeType: "up" },
        q3_26_27: { value: 310000, change: "▲ +4%", changeType: "up" },
        sep_26: { value: 480000, change: "▲ +16%", changeType: "up" },
        oct_26: { value: 240000, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 155000, change: "▲ +24%", changeType: "up" },
        cycle_16_31_oct: { value: 85000, change: "—", changeType: "neutral" },
        today: { value: 30000, change: "—", changeType: "neutral" },
        yesterday: { value: 28000, change: "—", changeType: "neutral" },
        this_week: { value: 120000, change: "▲ +25%", changeType: "up" },
        last_week: { value: 95000, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "net_revenue",
      label: "Net revenue",
      subtext: "pay-in received minus payout paid",
      format: "currency",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 2020000, change: "▲ +23%", changeType: "up" },
        fy_26_27: { value: 2670000, change: "▲ +32%", changeType: "up" },
        q2_26_27: { value: 970000, change: "▲ +18%", changeType: "up" },
        q3_26_27: { value: 310000, change: "▲ +6%", changeType: "up" },
        sep_26: { value: 500000, change: "▲ +11%", changeType: "up" },
        oct_26: { value: 250000, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 155000, change: "▲ +12%", changeType: "up" },
        cycle_16_31_oct: { value: 95000, change: "—", changeType: "neutral" },
        today: { value: 25000, change: "—", changeType: "neutral" },
        yesterday: { value: 32000, change: "—", changeType: "neutral" },
        this_week: { value: 125000, change: "▲ +31%", changeType: "up" },
        last_week: { value: 95000, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "net_margin",
      label: "Net margin %",
      subtext: "net revenue ÷ pay-in received",
      format: "percent",
      values: {
        fy_25_26: { value: 0, change: "—", changeType: "neutral" },
        fy_26_27: { value: 0, change: "—", changeType: "neutral" },
        q2_26_27: { value: 0, change: "—", changeType: "neutral" },
        q3_26_27: { value: 0, change: "—", changeType: "neutral" },
        sep_26: { value: 0, change: "—", changeType: "neutral" },
        oct_26: { value: 0, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 0, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 0, change: "—", changeType: "neutral" },
        today: { value: 0, change: "—", changeType: "neutral" },
        yesterday: { value: 0, change: "—", changeType: "neutral" },
        this_week: { value: 0, change: "—", changeType: "neutral" },
        last_week: { value: 0, change: "—", changeType: "neutral" }
      },
      demoValues: {
        fy_25_26: { value: 50.7, change: "▲ +1.5%", changeType: "up" },
        fy_26_27: { value: 51.2, change: "▲ +0.5%", changeType: "up" },
        q2_26_27: { value: 51.3, change: "▲ +0.8%", changeType: "up" },
        q3_26_27: { value: 50.0, change: "—", changeType: "neutral" },
        sep_26: { value: 51.0, change: "—", changeType: "neutral" },
        oct_26: { value: 51.0, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 50.0, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 52.7, change: "▲ +2.7%", changeType: "up" },
        today: { value: 45.4, change: "—", changeType: "neutral" },
        yesterday: { value: 53.3, change: "—", changeType: "neutral" },
        this_week: { value: 51.0, change: "▲ +1.0%", changeType: "up" },
        last_week: { value: 50.0, change: "—", changeType: "neutral" }
      }
    }
  ];

  // 4. Partners & Team Rows
  const teamRows: RowDef[] = [
    {
      id: "active_dsas",
      label: "Active DSAs",
      badge: "BALANCE",
      subtext: "partners with approved code in system",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 14, change: "▲ +40%", changeType: "up" },
        fy_26_27: { value: 18, change: "▲ +28%", changeType: "up" },
        q2_26_27: { value: 17, change: "▲ +6%", changeType: "up" },
        q3_26_27: { value: 18, change: "—", changeType: "neutral" },
        sep_26: { value: 17, change: "—", changeType: "neutral" },
        oct_26: { value: 18, change: "▲ +1", changeType: "up" },
        cycle_1_15_oct: { value: 18, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 18, change: "—", changeType: "neutral" },
        today: { value: 18, change: "—", changeType: "neutral" },
        yesterday: { value: 18, change: "—", changeType: "neutral" },
        this_week: { value: 18, change: "—", changeType: "neutral" },
        last_week: { value: 18, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "new_connectors",
      label: "New connectors",
      subtext: "connectors registered within period",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 24, change: "▲ +50%", changeType: "up" },
        fy_26_27: { value: 31, change: "▲ +29%", changeType: "up" },
        q2_26_27: { value: 12, change: "▲ +20%", changeType: "up" },
        q3_26_27: { value: 4, change: "—", changeType: "neutral" },
        sep_26: { value: 6, change: "▲ +20%", changeType: "up" },
        oct_26: { value: 3, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 2, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 1, change: "—", changeType: "neutral" },
        today: { value: 0, change: "—", changeType: "neutral" },
        yesterday: { value: 0, change: "—", changeType: "neutral" },
        this_week: { value: 1, change: "—", changeType: "neutral" },
        last_week: { value: 1, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "transacting_partners",
      label: "Transacting partners",
      subtext: "at least 1 loan logged with bank",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 12, change: "▲ +33%", changeType: "up" },
        fy_26_27: { value: 16, change: "▲ +33%", changeType: "up" },
        q2_26_27: { value: 8, change: "▲ +14%", changeType: "up" },
        q3_26_27: { value: 5, change: "—", changeType: "neutral" },
        sep_26: { value: 7, change: "▲ +16%", changeType: "up" },
        oct_26: { value: 4, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 3, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 2, change: "—", changeType: "neutral" },
        today: { value: 1, change: "—", changeType: "neutral" },
        yesterday: { value: 1, change: "—", changeType: "neutral" },
        this_week: { value: 3, change: "—", changeType: "neutral" },
        last_week: { value: 3, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "total_staff",
      label: "Total staff count",
      badge: "BALANCE",
      subtext: "active sales officers and branch managers",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 6, change: "—", changeType: "neutral" },
        fy_26_27: { value: 8, change: "▲ +33%", changeType: "up" },
        q2_26_27: { value: 8, change: "—", changeType: "neutral" },
        q3_26_27: { value: 8, change: "—", changeType: "neutral" },
        sep_26: { value: 8, change: "—", changeType: "neutral" },
        oct_26: { value: 8, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 8, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 8, change: "—", changeType: "neutral" },
        today: { value: 8, change: "—", changeType: "neutral" },
        yesterday: { value: 8, change: "—", changeType: "neutral" },
        this_week: { value: 8, change: "—", changeType: "neutral" },
        last_week: { value: 8, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "avg_leads_ro",
      label: "Avg leads per RO",
      subtext: "total leads ÷ sales team head count",
      format: "number",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 23.6, change: "▲ +12%", changeType: "up" },
        fy_26_27: { value: 23.2, change: "—", changeType: "neutral" },
        q2_26_27: { value: 8.5, change: "▲ +10%", changeType: "up" },
        q3_26_27: { value: 3.0, change: "—", changeType: "neutral" },
        sep_26: { value: 4.2, change: "▲ +8%", changeType: "up" },
        oct_26: { value: 2.3, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 1.5, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 0.8, change: "—", changeType: "neutral" },
        today: { value: 0.3, change: "—", changeType: "neutral" },
        yesterday: { value: 0.2, change: "—", changeType: "neutral" },
        this_week: { value: 1.3, change: "▲ +18%", changeType: "up" },
        last_week: { value: 1.1, change: "—", changeType: "neutral" }
      }
    },
    {
      id: "avg_disbursal_ro",
      label: "Avg disbursal per RO",
      subtext: "total volume ÷ sales team head count",
      format: "currency",
      values: {
        fy_25_26: neutral,
        fy_26_27: neutral,
        q2_26_27: neutral,
        q3_26_27: neutral,
        sep_26: neutral,
        oct_26: neutral,
        cycle_1_15_oct: neutral,
        cycle_16_31_oct: neutral,
        today: neutral,
        yesterday: neutral,
        this_week: neutral,
        last_week: neutral
      },
      demoValues: {
        fy_25_26: { value: 36333333, change: "▲ +15%", changeType: "up" },
        fy_26_27: { value: 35875000, change: "—", changeType: "neutral" },
        q2_26_27: { value: 12687500, change: "▲ +12%", changeType: "up" },
        q3_26_27: { value: 4375000, change: "—", changeType: "neutral" },
        sep_26: { value: 6562500, change: "▲ +14%", changeType: "up" },
        oct_26: { value: 3500000, change: "—", changeType: "neutral" },
        cycle_1_15_oct: { value: 2187500, change: "—", changeType: "neutral" },
        cycle_16_31_oct: { value: 1312500, change: "—", changeType: "neutral" },
        today: { value: 437500, change: "—", changeType: "neutral" },
        yesterday: { value: 437500, change: "—", changeType: "neutral" },
        this_week: { value: 1750000, change: "▲ +25%", changeType: "up" },
        last_week: { value: 1312500, change: "—", changeType: "neutral" }
      }
    }
  ];

  const currentRawRows = useMemo(() => {
    if (viewMode === "Revenue") return revenueRows;
    if (viewMode === "Partners & Team") return teamRows;
    return businessRows;
  }, [viewMode]);

  // Merge with demo mode if active
  const currentRows = useMemo(() => {
    return currentRawRows.map((r) => {
      if (isDemoMode && r.demoValues) {
        return { ...r, values: r.demoValues };
      }
      return r;
    });
  }, [currentRawRows, isDemoMode]);

  const viewSubcaption = useMemo(() => {
    if (viewMode === "Revenue") return "Commission, payout, net revenue and margin realization across periods";
    if (viewMode === "Partners & Team") return "Partner recruitment, active connectors, employee productivity and team contribution";
    return "What came in, what got logged, sanctioned and disbursed";
  }, [viewMode]);

  const formatCellValue = (val: number, format?: "number" | "currency" | "percent") => {
    if (val === 0) {
      if (format === "currency") return "₹0";
      if (format === "percent") return "0%";
      return "0";
    }
    if (format === "currency") return fmtInr(val);
    if (format === "percent") return `${Number(val.toFixed(1))}%`;
    return Number.isInteger(val) ? val.toLocaleString("en-IN") : val.toFixed(1);
  };

  // Funnel Data dynamic lookup
  const funnelMetrics = useMemo(() => {
    if (isDemoMode) {
      if (funnelPeriod === "Sep 26") return { leads: 34, logins: 24, sanctions: 18, disbursed: 15 };
      if (funnelPeriod === "Q2 26-27") return { leads: 68, logins: 46, sanctions: 34, disbursed: 29 };
      if (funnelPeriod === "FY 26-27 so far") return { leads: 186, logins: 128, sanctions: 94, disbursed: 82 };
      if (funnelPeriod === "All Time") return { leads: 328, logins: 226, sanctions: 166, disbursed: 146 };
      return { leads: 19, logins: 13, sanctions: 10, disbursed: 8 };
    }
    // Baseline from video
    if (funnelPeriod === "Q2 26-27" || funnelPeriod === "FY 26-27 so far" || funnelPeriod === "All Time") {
      return { leads: 1, logins: 0, sanctions: 0, disbursed: 0 };
    }
    return { leads: 0, logins: 0, sanctions: 0, disbursed: 0 };
  }, [funnelPeriod, isDemoMode]);

  // Conversion calculations
  const conversions = useMemo(() => {
    const { leads, logins, sanctions, disbursed } = funnelMetrics;
    return {
      loginRate: leads > 0 ? Math.round((logins / leads) * 100) : 0,
      sanctionRate: logins > 0 ? Math.round((sanctions / logins) * 100) : 0,
      disbursalRate: sanctions > 0 ? Math.round((disbursed / sanctions) * 100) : 0,
    };
  }, [funnelMetrics]);

  // Actuals for Target card
  const octActuals = useMemo(() => {
    if (isDemoMode) {
      return { leads: 19, logins: 13, sanctions: 10, amount: 28000000 };
    }
    return { leads: 0, logins: 0, sanctions: 0, amount: 0 };
  }, [isDemoMode]);

  // Target saving handler
  const handleOpenTargetsModal = () => {
    setDraftTargets({
      leads: targets.leads,
      logins: targets.logins,
      sanctions: targets.sanctions,
      amount: targets.amount
    });
    setTargetModalOpen(true);
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TargetsState = {
      leads: Number(draftTargets.leads) || 0,
      logins: Number(draftTargets.logins) || 0,
      sanctions: Number(draftTargets.sanctions) || 0,
      amount: Number(draftTargets.amount) || 0,
      isSet: true
    };
    setTargets(updated);
    try {
      localStorage.setItem(TARGETS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    setTargetModalOpen(false);
    showToast("Team targets updated for October 2026.");
  };

  const handleClearTargets = () => {
    const cleared: TargetsState = {
      ...targets,
      isSet: false
    };
    setTargets(cleared);
    try {
      localStorage.removeItem(TARGETS_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    showToast("Monthly targets reset.");
  };

  // CSV Export handler
  const handleExportCsv = () => {
    const headers = ["Measure", "Subtext", ...activeColumns.map((c) => `${c.label} (${c.sublabel})`)];
    const csvRows = [headers.join(",")];

    currentRows.forEach((row) => {
      const rowValues = [
        `"${row.label.replace(/"/g, '""')}"`,
        `"${(row.subtext || "").replace(/"/g, '""')}"`,
        ...activeColumns.map((col) => {
          const cell = row.values[col.id] || neutral;
          return `"${formatCellValue(cell.value, row.format)} ${cell.change || ""}"`;
        })
      ];
      csvRows.push(rowValues.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Scorecard_${viewMode.replace(/\s+/g, "_")}_${granularity.replace(/\s+/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Scorecard exported as CSV (${viewMode}).`);
  };

  return (
    <div className="min-h-full bg-[#090d16] text-slate-100 p-4 md:p-6 space-y-6 relative font-sans selection:bg-blue-600/30">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Target Setup Modal matching video frame 015 */}
      {targetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Target size={18} />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Set Monthly Targets</h3>
              </div>
              <button
                onClick={() => setTargetModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Set company-wide targets for October 2026 across leads, logins, and loan disbursal volumes.
            </p>

            <form onSubmit={handleSaveTargets} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Target Leads</label>
                <input
                  type="number"
                  min="0"
                  value={draftTargets.leads}
                  onChange={(e) => setDraftTargets({ ...draftTargets, leads: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs bg-[#0d1322] border border-[#1e293b] rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Target Logins</label>
                <input
                  type="number"
                  min="0"
                  value={draftTargets.logins}
                  onChange={(e) => setDraftTargets({ ...draftTargets, logins: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs bg-[#0d1322] border border-[#1e293b] rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Target Sanctions</label>
                <input
                  type="number"
                  min="0"
                  value={draftTargets.sanctions}
                  onChange={(e) => setDraftTargets({ ...draftTargets, sanctions: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs bg-[#0d1322] border border-[#1e293b] rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">Target Disbursed Volume (₹)</label>
                  <span className="text-[10.5px] text-blue-400 font-mono font-medium">
                    {fmtInr(draftTargets.amount)}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="500000"
                  value={draftTargets.amount}
                  onChange={(e) => setDraftTargets({ ...draftTargets, amount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs bg-[#0d1322] border border-[#1e293b] rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setTargetModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#1e293b] text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30 cursor-pointer transition-colors"
                >
                  Save Targets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Row Metric Detail Modal */}
      {drilldownRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-blue-400" />
                <h3 className="text-base font-bold text-white">{drilldownRow.label} Breakdown</h3>
              </div>
              <button
                onClick={() => setDrilldownRow(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-slate-300 bg-[#090e1a] p-3 rounded-xl border border-[#182235]">
              <span className="font-semibold text-slate-400 uppercase tracking-wider block text-[10px] mb-1">
                MEASURE DEFINITION
              </span>
              {drilldownRow.subtext || "Tracks period-over-period performance and realization"}
              {drilldownRow.badge && (
                <span className="ml-2 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#1e293b] text-slate-300 uppercase">
                  {drilldownRow.badge}
                </span>
              )}
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              <span className="font-semibold text-slate-400 uppercase tracking-wider block text-[10px] mb-2">
                ALL PERIOD COMPARISONS
              </span>
              {ALL_COLUMNS.map((col) => {
                const cell = drilldownRow.values[col.id] || neutral;
                return (
                  <div
                    key={col.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d1322] border border-[#162033] text-xs hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-200 text-[11px] uppercase">{col.label}</div>
                      <div className="text-[10px] text-slate-400">{col.sublabel}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        {formatCellValue(cell.value, drilldownRow.format)}
                      </div>
                      <div className="text-[10.5px]">
                        {cell.changeType === "first" ? (
                          <span className="text-slate-400 font-medium">first</span>
                        ) : cell.changeType === "down" ? (
                          <span className="text-rose-400 font-semibold">{cell.change}</span>
                        ) : cell.changeType === "up" ? (
                          <span className="text-emerald-400 font-semibold">{cell.change}</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#182235]">
              <button
                onClick={() => setDrilldownRow(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Scorecard Workspace Container */}
      <div className="max-w-[1560px] mx-auto space-y-5">
        {/* Top Header Section matching video frames */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="text-blue-400">
                <BarChart2 size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Scorecard</h1>
            </div>
            <p className="text-[13px] text-slate-400 max-w-4xl leading-relaxed">
              Leads, logins, sanctions, disbursals, payin and payout — every period against the one before · years are financial (April–March)
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Demo Simulation Toggle */}
            <button
              onClick={() => {
                setIsDemoMode(!isDemoMode);
                showToast(
                  !isDemoMode
                    ? "Demo simulation active: realistic metrics loaded."
                    : "Reset to video baseline (1 lead received)."
                );
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-xs ${
                isDemoMode
                  ? "bg-blue-600/20 text-blue-300 border-blue-500/50"
                  : "bg-[#0d1322] text-slate-400 hover:text-white border-[#1e293b]"
              }`}
              title="Toggle between zero baseline and operational sample data"
            >
              <RotateCcw size={13} className={isDemoMode ? "text-blue-400 animate-spin-once" : ""} />
              <span>{isDemoMode ? "Live Demo Active" : "Load Demo Data"}</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#1e293b] bg-[#0d1322] hover:bg-[#152033] hover:border-slate-600 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs"
              title="Export active table as CSV"
            >
              <Download size={13} />
              <span>Export</span>
            </button>

            {/* Set Targets Trigger matching frame 001 / 015 */}
            <button
              onClick={handleOpenTargetsModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#1e293b] bg-[#0d1322] hover:bg-[#152033] hover:border-slate-600 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <Target size={14} className="text-blue-400" />
              <span>Set targets</span>
            </button>
          </div>
        </div>

        {/* View Switchers & Granularity Controls matching video frame 001 */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Main 3 View Tabs */}
          <div className="flex items-center bg-[#0c1220] p-1 rounded-xl border border-[#1e293b]">
            {(["Business", "Revenue", "Partners & Team"] as ViewMode[]).map((mode) => {
              const active = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-[#16233d] text-blue-400 font-semibold border border-blue-500/40 shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Period Granularity Slices */}
          <div className="flex items-center bg-[#0c1220] p-1 rounded-xl border border-[#1e293b] overflow-x-auto scrollbar-none">
            {(["All", "Daily", "Weekly", "Cycle (1–15 / 16–end)", "Monthly", "Quarterly", "Yearly"] as Granularity[]).map(
              (gran) => {
                const active = granularity === gran;
                return (
                  <button
                    key={gran}
                    onClick={() => setGranularity(gran)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? "bg-[#18233a] text-blue-400 font-semibold border border-blue-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {gran}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Split Grid: Main Scorecard Matrix (Left) & Funnel Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
          {/* LEFT 3 COLS: MATRIX TABLE */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
              <span>{viewSubcaption}</span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Click any measure row to inspect breakdown
              </span>
            </div>

            <div className="bg-[#0c1220] border border-[#1a253a] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#182235] bg-[#090e1a]/80">
                      <th className="p-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky left-0 bg-[#090e1a] z-10 w-[240px] min-w-[220px] border-r border-[#182235]/60 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                        MEASURE
                      </th>
                      {activeColumns.map((col) => (
                        <th key={col.id} className="p-3.5 text-center min-w-[130px] border-r border-[#182235]/20 last:border-r-0">
                          <div className="font-bold text-slate-200 text-[11px] uppercase tracking-wider whitespace-nowrap">
                            {col.label}
                          </div>
                          <div className="text-[10px] font-normal text-slate-400 mt-0.5 whitespace-nowrap">
                            {col.sublabel}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#162033]">
                    {currentRows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setDrilldownRow(row)}
                        className="hover:bg-[#111a2d]/60 transition-colors group cursor-pointer"
                        title="Click to view measure breakdown"
                      >
                        {/* Sticky Left Measure Column */}
                        <td className="p-3.5 sticky left-0 bg-[#0c1220] group-hover:bg-[#111a2d] transition-colors z-10 border-r border-[#182235]/60 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-200 text-xs group-hover:text-blue-300 transition-colors">
                              {row.label}
                            </span>
                            {row.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#1e293b] text-slate-300 uppercase tracking-wider">
                                {row.badge}
                              </span>
                            )}
                          </div>
                          {row.subtext && (
                            <div className="text-[10.5px] text-slate-400 mt-0.5 leading-snug">
                              {row.subtext}
                            </div>
                          )}
                        </td>

                        {/* Values across columns matching exact screenshot styling */}
                        {activeColumns.map((col) => {
                          const cellData = row.values[col.id] || neutral;
                          return (
                            <td
                              key={col.id}
                              className="p-3.5 text-center align-middle whitespace-nowrap border-r border-[#182235]/20 last:border-r-0"
                            >
                              <div className="font-semibold text-slate-100 text-xs">
                                {formatCellValue(cellData.value, row.format)}
                              </div>
                              <div className="mt-0.5">
                                {cellData.changeType === "first" ? (
                                  <span className="text-[10.5px] text-slate-400 font-medium">first</span>
                                ) : cellData.changeType === "down" ? (
                                  <span className="text-[10.5px] text-rose-400 font-semibold flex items-center justify-center gap-0.5">
                                    {cellData.change}
                                  </span>
                                ) : cellData.changeType === "up" ? (
                                  <span className="text-[10.5px] text-emerald-400 font-semibold flex items-center justify-center gap-0.5">
                                    {cellData.change}
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-slate-500 font-medium">—</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explanatory Footer Note from video frame 003 / 012 */}
            <div className="text-[11px] text-slate-400 leading-relaxed border-t border-[#182235] pt-4 mt-6">
              A flow row counts what happened inside the period; a balance row is where it stood at the end of it. Each percentage compares like with like — this month against the same days of last month, this year against the same stretch of last year — so a part period never reads as a collapse. “first” means there was nothing to compare with. Rows dated by a business day (login, sanction, disbursal, payout) count whole days, so Today is compared with the whole of yesterday rather than yesterday by this hour. Targets are the company totals from Team target, all products.
            </div>
          </div>

          {/* RIGHT 1 COL: FUNNEL & TARGET SIDEBAR matching video frame 001 */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#0c1220] border border-[#1a253a] rounded-2xl p-4 space-y-4 shadow-xs">
              {/* Funnel Header with Period Dropdown */}
              <div className="flex items-center justify-between relative">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FUNNEL</span>
                <button
                  onClick={() => setFunnelDropdownOpen(!funnelDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d1322] border border-[#1e293b] text-xs font-medium text-slate-200 hover:text-white cursor-pointer transition-colors"
                >
                  <span>{funnelPeriod}</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                {/* Dropdown Options */}
                {funnelDropdownOpen && (
                  <div className="absolute right-0 top-8 z-30 w-44 rounded-xl bg-[#0d1322] border border-[#1e293b] shadow-2xl py-1 text-xs text-slate-200 animate-in fade-in-50 duration-100">
                    {[
                      "Oct 26 so far",
                      "Sep 26",
                      "Cycle 16-31 Oct",
                      "Cycle 1-15 Oct",
                      "Q3 26-27 so far",
                      "Q2 26-27",
                      "FY 26-27 so far",
                      "All Time"
                    ].map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setFunnelPeriod(p);
                          setFunnelDropdownOpen(false);
                          showToast(`Funnel slice: ${p}`);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition-colors cursor-pointer ${
                          funnelPeriod === p ? "text-blue-400 font-semibold bg-blue-500/10" : ""
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Funnel Steps */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#162033]">
                  <span className="text-slate-300">Leads received</span>
                  <span className="font-bold text-white text-sm">{funnelMetrics.leads}</span>
                </div>

                {funnelMetrics.leads > 0 && (
                  <div className="text-[10px] text-slate-400 flex items-center justify-end -mt-1.5 pr-0.5">
                    <span className="text-blue-400">{conversions.loginRate}%</span>&nbsp;login conversion
                  </div>
                )}

                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#162033]">
                  <span className="text-slate-300">Logins</span>
                  <span className="font-bold text-white text-sm">{funnelMetrics.logins}</span>
                </div>

                {funnelMetrics.logins > 0 && (
                  <div className="text-[10px] text-slate-400 flex items-center justify-end -mt-1.5 pr-0.5">
                    <span className="text-emerald-400">{conversions.sanctionRate}%</span>&nbsp;sanction rate
                  </div>
                )}

                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#162033]">
                  <span className="text-slate-300">Sanctioned</span>
                  <span className="font-bold text-white text-sm">{funnelMetrics.sanctions}</span>
                </div>

                {funnelMetrics.sanctions > 0 && (
                  <div className="text-[10px] text-slate-400 flex items-center justify-end -mt-1.5 pr-0.5">
                    <span className="text-cyan-400">{conversions.disbursalRate}%</span>&nbsp;disbursal rate
                  </div>
                )}

                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#162033]">
                  <span className="text-slate-300">Files disbursed</span>
                  <span className="font-bold text-white text-sm">{funnelMetrics.disbursed}</span>
                </div>
              </div>

              {/* Explanatory Text */}
              <p className="text-[10.5px] text-slate-400 leading-relaxed pt-1">
                Each step counts what reached it inside the period, not one group followed through — a lead received this month may disburse next month, so a later step can read higher than the one above it.
              </p>

              {/* Target Section */}
              <div className="pt-3 border-t border-[#182235] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                    OCT 2026 VS TARGET
                  </div>
                  {targets.isSet && (
                    <button
                      onClick={handleOpenTargetsModal}
                      className="text-[10.5px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={11} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {!targets.isSet ? (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No team targets set for this month. Set{" "}
                    <button
                      onClick={handleOpenTargetsModal}
                      className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                      targets
                    </button>{" "}
                    to track them here.
                  </p>
                ) : (
                  <div className="space-y-2.5 pt-1">
                    {/* Leads target */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Leads</span>
                        <span className="font-mono text-slate-200">
                          {octActuals.leads} / {targets.leads} ({targets.leads > 0 ? Math.round((octActuals.leads / targets.leads) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#090d16] rounded-full overflow-hidden border border-[#182235]">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, targets.leads > 0 ? (octActuals.leads / targets.leads) * 100 : 0)}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Logins target */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Logins</span>
                        <span className="font-mono text-slate-200">
                          {octActuals.logins} / {targets.logins} ({targets.logins > 0 ? Math.round((octActuals.logins / targets.logins) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#090d16] rounded-full overflow-hidden border border-[#182235]">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, targets.logins > 0 ? (octActuals.logins / targets.logins) * 100 : 0)}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Sanctions target */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Sanctions</span>
                        <span className="font-mono text-slate-200">
                          {octActuals.sanctions} / {targets.sanctions} ({targets.sanctions > 0 ? Math.round((octActuals.sanctions / targets.sanctions) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#090d16] rounded-full overflow-hidden border border-[#182235]">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, targets.sanctions > 0 ? (octActuals.sanctions / targets.sanctions) * 100 : 0)}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Disbursed Amount target */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Disbursed Vol</span>
                        <span className="font-mono text-slate-200">
                          {fmtInr(octActuals.amount)} / {fmtInr(targets.amount)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#090d16] rounded-full overflow-hidden border border-[#182235]">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, targets.amount > 0 ? (octActuals.amount / targets.amount) * 100 : 0)}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check size={11} /> Targets Active
                      </span>
                      <button
                        onClick={handleClearTargets}
                        className="text-[10px] text-slate-400 hover:text-slate-300 cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sparkle Assistant Button matching bottom right */}
      <button
        onClick={() => showToast("Scorecard Intelligence Navigator active.")}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 transition-all cursor-pointer z-40"
        title="Scorecard Assist"
      >
        <Sparkles size={18} />
      </button>
    </div>
  );
}
