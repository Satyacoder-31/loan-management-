import React, { useState, useRef, useEffect } from "react";
import {
  Send, Plus, Hash, User, Users, Search, MoreVertical,
  Smile, Paperclip, CheckCircle2, Sparkles, X, MessageSquare
} from "lucide-react";
import { useAuth } from "../../lib/auth";

interface Message {
  id: string;
  sender: string;
  senderInitials: string;
  avatarBg: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatChannel {
  id: string;
  name: string;
  type: "channel" | "dm";
  description: string;
  unreadCount?: number;
}

const DEFAULT_CHANNELS: ChatChannel[] = [
  { id: "general", name: "General", type: "channel", description: "Everyone on staff" },
  { id: "disbursals", name: "Disbursals", type: "channel", description: "Real-time loan sanction & disbursal alerts" },
  { id: "leads", name: "Leads-Underwriting", type: "channel", description: "Lead escalations and branch credit queries" },
  { id: "ashish", name: "Ashish Mahajan", type: "dm", description: "Relationship Officer · Active" },
  { id: "rahul", name: "Rahul Sharma (HDFC)", type: "dm", description: "Branch Credit Manager · HDFC Bank" }
];

export function GnChat() {
  const { user } = useAuth();
  const userName = user?.name || "VIVEK";
  const userInitial = userName.charAt(0).toUpperCase();

  const [channels, setChannels] = useState<ChatChannel[]>(() => {
    try {
      const saved = localStorage.getItem("teleport_chat_channels");
      return saved ? JSON.parse(saved) : DEFAULT_CHANNELS;
    } catch {
      return DEFAULT_CHANNELS;
    }
  });
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem("teleport_chat_messages");
      return saved ? JSON.parse(saved) : {
        general: [],
        disbursals: [],
        leads: [],
        ashish: [],
        rahul: []
      };
    } catch {
      return { general: [], disbursals: [], leads: [], ashish: [], rahul: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("teleport_chat_channels", JSON.stringify(channels));
    } catch (e) {}
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem("teleport_chat_messages", JSON.stringify(messagesByChannel));
    } catch (e) {}
  }, [messagesByChannel]);

  const [inputMessage, setInputMessage] = useState("");
  const [dmModalOpen, setDmModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [newDmName, setNewDmName] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const activeMessages = messagesByChannel[activeChannelId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: "msg-" + Date.now(),
      sender: userName,
      senderInitials: userInitial,
      avatarBg: "bg-blue-600",
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true
    };

    setMessagesByChannel((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
    }));

    setInputMessage("");
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    const cleanId = newChannelName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newChan: ChatChannel = {
      id: cleanId,
      name: newChannelName.trim(),
      type: "channel",
      description: newChannelDesc.trim() || "Staff Channel"
    };
    setChannels((prev) => [...prev, newChan]);
    setMessagesByChannel((prev) => ({ ...prev, [cleanId]: [] }));
    setActiveChannelId(cleanId);
    setNewChannelName("");
    setNewChannelDesc("");
    setGroupModalOpen(false);
    showToast(`Created channel #${newChan.name}`);
  };

  const handleCreateDm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDmName.trim()) return;
    const cleanId = "dm-" + Date.now();
    const newChan: ChatChannel = {
      id: cleanId,
      name: newDmName.trim(),
      type: "dm",
      description: "Direct Message"
    };
    setChannels((prev) => [...prev, newChan]);
    setMessagesByChannel((prev) => ({ ...prev, [cleanId]: [] }));
    setActiveChannelId(cleanId);
    setNewDmName("");
    setDmModalOpen(false);
    showToast(`Started conversation with ${newChan.name}`);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] bg-[#090d16] text-slate-100 flex overflow-hidden font-sans relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      {groupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-blue-400" />
                <h3 className="text-base font-bold text-white">Create New Channel</h3>
              </div>
              <button
                onClick={() => setGroupModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Channel Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">#</span>
                  <input
                    type="text"
                    placeholder="e.g. sales-pune, approvals"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 text-xs bg-[#0d1322] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Regional team discussions"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#0d1322] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#1e293b] text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-xs cursor-pointer transition-colors"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DM MODAL */}
      {dmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0c1220] border border-[#1e293b] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#182235]">
              <div className="flex items-center gap-2">
                <User size={18} className="text-blue-400" />
                <h3 className="text-base font-bold text-white">Direct Message</h3>
              </div>
              <button
                onClick={() => setDmModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateDm} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Select Colleague / Contact</label>
                <input
                  type="text"
                  placeholder="Enter name or email..."
                  value={newDmName}
                  onChange={(e) => setNewDmName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#0d1322] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#182235]">
                <button
                  type="button"
                  onClick={() => setDmModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#1e293b] text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-xs cursor-pointer transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEFT COLUMN: CHATS LIST (Matching Screenshot exactly) */}
      <div className="w-72 shrink-0 bg-[#0c1220] border-r border-[#182235] flex flex-col select-none">
        {/* Header matching Screenshot: CHATS  + DM  + Group */}
        <div className="p-3.5 border-b border-[#182235] flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CHATS</span>
          <div className="flex items-center gap-2.5 text-xs">
            <button
              onClick={() => setDmModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors"
            >
              + DM
            </button>
            <button
              onClick={() => setGroupModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors"
            >
              + Group
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {channels.map((chan) => {
            const isActive = chan.id === activeChannelId;
            return (
              <button
                key={chan.id}
                onClick={() => setActiveChannelId(chan.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-[#152033] text-white font-semibold shadow-xs"
                    : "text-slate-300 hover:bg-[#111a2d] hover:text-white"
                }`}
              >
                {chan.type === "channel" ? (
                  <span className={`text-sm shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`}>#</span>
                ) : (
                  <User size={13} className={`shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                )}
                <span className="truncate">{chan.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: MAIN CHAT CONVERSATION VIEW (Matching Screenshot) */}
      <div className="flex-1 flex flex-col bg-[#090d16] overflow-hidden">
        {/* Top Header of Chat: General / Everyone on staff */}
        <div className="p-4 border-b border-[#182235] bg-[#0c1220]/50 backdrop-blur-xs shrink-0">
          <h2 className="text-base font-bold text-white tracking-tight">{activeChannel.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{activeChannel.description}</p>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between scrollbar-thin">
          {activeMessages.length === 0 ? (
            /* Empty State matching Screenshot: "No messages yet. Say something." */
            <div className="flex-1 flex items-center justify-center">
              <span className="text-sm text-slate-400 font-normal">
                No messages yet. Say something.
              </span>
            </div>
          ) : (
            /* Message Feed */
            <div className="space-y-4 max-w-4xl w-full mx-auto">
              {activeMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 animate-in fade-in-50 duration-150">
                  <div
                    className={`w-8 h-8 rounded-full ${msg.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {msg.senderInitials}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-xs text-slate-200">{msg.sender}</span>
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    </div>
                    <div className="text-xs text-slate-200 bg-[#0c1220] border border-[#1e293b] p-3 rounded-2xl rounded-tl-xs shadow-xs max-w-xl leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Docked Message Input Box matching Screenshot */}
        <div className="p-4 bg-[#090d16] border-t border-[#182235] shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="bg-[#0c1220] border border-[#1e293b] rounded-xl flex items-center px-4 py-2.5 shadow-lg focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                placeholder="Write a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="ml-3 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Send size={12} className="shrink-0" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Sparkle Assistant Button matching bottom right */}
      <button
        onClick={() => showToast("Staff Chat Sync active.")}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 transition-all cursor-pointer z-40"
        title="Chat Assist"
      >
        <Sparkles size={18} />
      </button>
    </div>
  );
}
