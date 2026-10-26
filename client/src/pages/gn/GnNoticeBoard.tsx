import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Megaphone, Plus, RefreshCw, ChevronLeft, Pin,
  Calendar, CheckCircle2, Sparkles, X, Trash2, Edit3,
  Users, AlertCircle, Eye, EyeOff
} from "lucide-react";
import { useAuth } from "../../lib/auth";

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  audience: string;
  category: "General" | "Policy" | "Holiday" | "Milestone" | "Urgent";
  author: string;
  date: string;
  pinned: boolean;
  acknowledgedCount: number;
}

export function GnNoticeBoard() {
  const nav = useNavigate();
  const { user } = useAuth();
  const authorName = user?.name ? `${user.name} (Admin)` : "Vivek Mahajan (Admin)";

  // By default, start with empty list or saved notices
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem("teleport_notices");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("teleport_notices", JSON.stringify(notices));
    } catch (e) {}
  }, [notices]);

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("Everyone on staff");
  const [category, setCategory] = useState<NoticeItem["category"]>("General");
  const [pinned, setPinned] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNotice: NoticeItem = {
      id: "ntc-" + Date.now(),
      title: title.trim(),
      content: content.trim(),
      audience,
      category,
      author: authorName,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }) + `, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      pinned,
      acknowledgedCount: 0
    };

    setNotices((prev) => (pinned ? [newNotice, ...prev] : [...prev, newNotice]));
    setTitle("");
    setContent("");
    setPinned(false);
    setCategory("General");
    setModalOpen(false);
    showToast(`Notice "${newNotice.title}" published to ${audience}.`);
  };

  const handleTogglePin = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    );
    showToast("Updated notice pin status.");
  };

  const handleDelete = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    showToast("Notice removed from board.");
  };

  const handleAcknowledge = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, acknowledgedCount: n.acknowledgedCount + 1 } : n))
    );
    showToast("Marked notice as read & acknowledged.");
  };

  return (
    <div className="min-h-full bg-[#090d16] text-slate-100 p-4 md:p-6 space-y-6 relative font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* POST NOTICE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-blue-400" />
                <h3 className="text-base font-bold text-white">Post a Notice</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePostNotice} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Diwali Holiday Announcement & Login Deadlines"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#0d1322] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#0d1322] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Everyone on staff">Everyone on staff</option>
                    <option value="Sales & Field ROs">Sales & Field ROs</option>
                    <option value="Credit & Underwriting">Credit & Underwriting</option>
                    <option value="Operations & HR">Operations & HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-[#0d1322] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="General">General Announcement</option>
                    <option value="Policy">Policy Update</option>
                    <option value="Holiday">Holiday & Schedule</option>
                    <option value="Milestone">Target Milestone</option>
                    <option value="Urgent">Urgent Notice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  placeholder="Type the full announcement message here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0d1322] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded bg-[#0d1322] border-[#1e293b] text-blue-600 focus:ring-0"
                />
                <span className="flex items-center gap-1 font-medium">
                  <Pin size={13} className="text-amber-400" /> Pin this notice to the top
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#1e293b] text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-xs cursor-pointer transition-colors"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER matching Screenshot */}
      <div className="max-w-[1560px] mx-auto space-y-6">
        {/* Header Section matching Screenshot exactly */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mb-1">
              <button
                onClick={() => nav("/dashboard")}
                className="hover:text-slate-200 transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-slate-200">Notice Board</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => nav(-1)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Back"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold tracking-tight text-white">Notice Board</h1>
            </div>
            <p className="text-[13px] text-slate-400 mt-1">
              Office updates, for everyone or for a team. Pinned notices stay at the top.
            </p>
          </div>

          {/* Top Right Action Buttons matching Screenshot */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-xs shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Post a notice</span>
            </button>
            <button
              onClick={() => showToast("Notice board refreshed.")}
              className="p-1.5 rounded-lg border border-[#1e293b] bg-[#0c1220] hover:bg-[#152033] text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* BOARD CONTENT */}
        {notices.length === 0 ? (
          /* EMPTY STATE matching Screenshot exactly */
          <div className="bg-[#0c1220] border border-[#182235] rounded-2xl p-16 text-center space-y-2 shadow-xs">
            <Megaphone size={32} className="mx-auto text-slate-400 stroke-[1.5]" />
            <div className="text-sm font-bold text-slate-200 pt-1">
              Nothing on the board yet
            </div>
            <div className="text-xs text-slate-400">
              Post the first notice — it reaches everyone on staff.
            </div>
          </div>
        ) : (
          /* POSTED NOTICES LIST */
          <div className="space-y-3.5">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`p-5 rounded-2xl border transition-all ${
                  notice.pinned
                    ? "bg-[#0e1628] border-blue-500/30 shadow-xs shadow-blue-500/10"
                    : "bg-[#0c1220] border-[#182235]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {notice.pinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Pin size={10} className="fill-amber-400" /> PINNED
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                        {notice.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#131b2e] text-slate-300 border border-[#1e293b] flex items-center gap-1">
                        <Users size={11} className="text-slate-400" />
                        {notice.audience}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">{notice.title}</h3>
                    <div className="text-[11px] text-slate-400">
                      By {notice.author} · {notice.date}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleTogglePin(notice.id)}
                      className="p-1.5 rounded-lg border border-[#1e293b] bg-[#0d1322] hover:bg-[#152033] text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title={notice.pinned ? "Unpin notice" : "Pin notice"}
                    >
                      <Pin size={13} className={notice.pinned ? "fill-amber-400 text-amber-400" : ""} />
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="p-1.5 rounded-lg border border-[#1e293b] bg-[#0d1322] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete notice"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pt-2 border-t border-[#182235]/60">
                  {notice.content}
                </div>

                <div className="mt-4 pt-3 border-t border-[#182235]/60 flex items-center justify-between text-xs">
                  <div className="text-slate-400 text-[11px]">
                    {notice.acknowledgedCount > 0 ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> Acknowledged by {notice.acknowledgedCount} staff member(s)
                      </span>
                    ) : (
                      "0 acknowledgements"
                    )}
                  </div>
                  <button
                    onClick={() => handleAcknowledge(notice.id)}
                    className="px-3 py-1 rounded-lg border border-[#1e293b] bg-[#0d1322] hover:bg-emerald-500/15 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={12} />
                    <span>Acknowledge</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Sparkle Assistant Button matching bottom right */}
      <button
        onClick={() => showToast("Notice Board sync active.")}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 transition-all cursor-pointer z-40"
        title="Notice Assist"
      >
        <Sparkles size={18} />
      </button>
    </div>
  );
}
