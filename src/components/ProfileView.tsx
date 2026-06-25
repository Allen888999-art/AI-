import React, { useState } from 'react';
import { User, Settings2, Plus, ArrowRight, Shield, Download, FileText, Bot, HelpCircle, Sparkles, X } from 'lucide-react';
import { Assistant } from '../types';

interface ProfileViewProps {
  assistants: Assistant[];
  onAddAssistant: (name: string, description: string, systemInstruction: string, icon: string) => void;
  onSelectAssistant: (id: string) => void;
  activeAssistantId: string;
}

export default function ProfileView({
  assistants,
  onAddAssistant,
  onSelectAssistant,
  activeAssistantId,
}: ProfileViewProps) {
  const [showCreateAssistant, setShowCreateAssistant] = useState(false);
  const [assistantName, setAssistantName] = useState('');
  const [assistantDesc, setAssistantDesc] = useState('');
  const [assistantInst, setAssistantInst] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🤖');

  const iconsToSelect = ['🤖', '💻', '📊', '✍️', '🎨', '🚀', '🧠', '🔬'];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assistantName && assistantDesc && assistantInst) {
      onAddAssistant(assistantName, assistantDesc, assistantInst, selectedIcon);
      setAssistantName('');
      setAssistantDesc('');
      setAssistantInst('');
      setSelectedIcon('🤖');
      setShowCreateAssistant(false);
    }
  };

  const historyItems = [
    { title: "Q4 Earnings Report Review", time: "Today, 10:14 AM" },
    { title: "Marketing Copy Generation", time: "Yesterday, 4:22 PM" },
    { title: "Glassmorphic Card UI layout", time: "2 days ago" }
  ];

  const downloadItems = [
    { title: "Q4_Summary.pdf", size: "1.4 MB", type: "pdf" },
    { title: "Generated_Hero.png", size: "410 KB", type: "image" }
  ];

  return (
    <div id="profile-container" className="flex-1 overflow-y-auto pb-24 px-4 pt-4 bg-surface-bg select-none animate-fadeIn">
      {/* Top Profile Avatar and Title */}
      <div className="flex flex-col items-center mt-4 mb-8">
        <div className="relative mb-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            alt="Alex Jensen Profile Picture"
            className="w-20 h-20 rounded-full border border-brand-primary/15 shadow-sm object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            title="Edit Avatar"
            onClick={() => alert("Image editing is handled by image generation. Uploading works.")}
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-brand-primary text-white hover:bg-brand-secondary transition shadow-sm border border-white"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <h2 className="font-serif italic font-bold text-xl text-brand-primary">Alex Jensen</h2>
        <span className="text-xs text-brand-primary/60 mt-0.5">alex.jensen@enterprise.com</span>
        <span className="mt-3 text-[10px] font-bold uppercase bg-brand-primary/5 text-brand-primary px-3 py-1 rounded-full flex items-center gap-1 border border-brand-primary/10 tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Pro Member
        </span>
      </div>

      {/* My AI Assistants Module */}
      <div id="my-assistants-panel" className="bg-white rounded-2xl border border-brand-primary/10 p-4 mb-6 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-brand-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/60">
              My AI Assistants
            </h3>
          </div>
          <button
            onClick={() => setShowCreateAssistant(true)}
            className="p-1 rounded-full hover:bg-surface-bg text-brand-primary"
            title="Create Custom Assistant"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal scroll list of assistants */}
        <div className="flex gap-4 overflow-x-auto py-1">
          {assistants.map((ast) => {
            const isActive = ast.id === activeAssistantId;
            return (
              <button
                key={ast.id}
                onClick={() => onSelectAssistant(ast.id)}
                className={`flex flex-col items-center shrink-0 p-2.5 rounded-xl border transition-all ${
                  isActive 
                    ? 'border-brand-primary bg-brand-primary/5 shadow-xs' 
                    : 'border-brand-primary/10 bg-surface-bg hover:border-brand-primary/30'
                }`}
              >
                <div className="text-xl mb-1">{ast.icon}</div>
                <span className="text-[11px] font-bold text-brand-primary">{ast.name}</span>
                <span className="text-[9px] text-brand-primary/50 mt-0.5 truncate max-w-[65px]">
                  {isActive ? 'Active' : 'Toggle'}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowCreateAssistant(true)}
            className="flex flex-col items-center justify-center shrink-0 w-16 h-16 rounded-xl border border-dashed border-brand-primary/20 hover:border-brand-primary/40 hover:bg-surface-bg transition"
          >
            <Plus className="w-4 h-4 text-brand-primary/60" />
            <span className="text-[9px] text-brand-primary/60 mt-1">New</span>
          </button>
        </div>
      </div>

      {/* Create Assistant Overlay Modal */}
      {showCreateAssistant && (
        <div className="fixed inset-0 bg-brand-primary/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-brand-primary/15 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-brand-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-primary" /> Build custom AI Bot
              </h3>
              <button
                onClick={() => setShowCreateAssistant(false)}
                className="p-1 rounded-full hover:bg-surface-bg"
              >
                <X className="w-4 h-4 text-brand-primary" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-brand-primary/60 mb-1">Bot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Copywriter"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  className="w-full bg-surface-bg border border-brand-primary/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-brand-primary text-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-brand-primary/60 mb-1">Select Icon Avatar</label>
                <div className="grid grid-cols-4 gap-2">
                  {iconsToSelect.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`py-2 text-base rounded-xl border text-center transition ${
                        selectedIcon === icon 
                          ? 'border-brand-primary bg-brand-primary/10' 
                          : 'border-brand-primary/10 hover:bg-surface-bg'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-brand-primary/60 mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Specializes in email content writing"
                  value={assistantDesc}
                  onChange={(e) => setAssistantDesc(e.target.value)}
                  className="w-full bg-surface-bg border border-brand-primary/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-brand-primary text-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-brand-primary/60 mb-1">AI Prompt Instruction (System Prompt)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. You are a copywriter. Start your answer with a bold tag line. Keep explanations under 50 words..."
                  value={assistantInst}
                  onChange={(e) => setAssistantInst(e.target.value)}
                  className="w-full bg-surface-bg border border-brand-primary/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-brand-primary text-brand-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-xs font-bold uppercase tracking-wider text-white bg-brand-primary rounded-full hover:bg-brand-secondary transition"
              >
                Create Bot
              </button>
            </form>
          </div>
        </div>
      )}

      {/* History and Downloads Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* History card */}
        <div className="bg-white rounded-2xl border border-brand-primary/10 p-4 shadow-xs">
          <h4 className="text-[10px] font-bold text-brand-primary/60 uppercase tracking-[0.2em] mb-3">
            Search History
          </h4>
          <div className="space-y-2">
            {historyItems.map((h, i) => (
              <div key={i} className="min-w-0">
                <p className="text-[11px] font-bold text-brand-primary truncate">{h.title}</p>
                <span className="text-[9px] text-brand-primary/40 font-mono">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Downloads card */}
        <div className="bg-white rounded-2xl border border-brand-primary/10 p-4 shadow-xs">
          <h4 className="text-[10px] font-bold text-brand-primary/60 uppercase tracking-[0.2em] mb-3 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Downloads
          </h4>
          <div className="space-y-2">
            {downloadItems.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 min-w-0">
                <FileText className="w-3.5 h-3.5 text-brand-primary/60 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-brand-primary truncate">{d.title}</p>
                  <span className="text-[9px] text-brand-primary/40 font-mono">{d.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="bg-white rounded-2xl border border-brand-primary/10 divide-y divide-brand-primary/10 overflow-hidden shadow-xs">
        {[
          { label: "Account Settings", icon: User },
          { label: "Privacy & Security", icon: Shield },
          { label: "Browser Configuration", icon: Settings2 },
          { label: "Help & Documentation", icon: HelpCircle }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => alert(`Opening dialog for: ${item.label}`)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-bg transition"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-brand-primary/60" />
                <span className="text-xs font-semibold text-brand-primary">{item.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-brand-primary/30" />
            </div>
          );
        })}
      </div>

      {/* Sign Out Button */}
      <button
        onClick={() => alert("Signed out! Demo profile loaded.")}
        className="w-full mt-6 py-3 font-semibold text-red-600 bg-red-50/50 border border-red-200/50 rounded-full hover:bg-red-50 transition text-xs tracking-wider uppercase"
      >
        Sign Out
      </button>
    </div>
  );
}
