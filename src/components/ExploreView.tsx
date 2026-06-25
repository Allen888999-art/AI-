import React, { useState } from 'react';
import { Search, Compass, ExternalLink, Flame, Trophy, Cpu, Palette, Zap } from 'lucide-react';
import { Bookmark } from '../types';

interface ExploreViewProps {
  onSearch: (query: string) => void;
  onOpenCustomUrl: (title: string, url: string) => void;
}

export default function ExploreView({ onSearch, onOpenCustomUrl }: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const trendingTopics = [
    { title: "Generative Video Synthesis 2026", clicks: "45.2K views", category: "AI Video" },
    { title: "Glassmorphic Web App Architecture", clicks: "32.8K views", category: "UI Design" },
    { title: "AI Agentic Workflows with Multi-Agent Systems", clicks: "28.1K views", category: "Tech" },
    { title: "Decentralized Personal Computing", clicks: "19.5K views", category: "Hardware" },
  ];

  const featuredTools = [
    {
      name: "DALL-E 3 Creative Studio",
      desc: "Simulate high-end text to image canvas layout",
      url: "dalle.ai-native.com",
      color: "#444440",
      icon: "🎨"
    },
    {
      name: "GitHub Copilot Workspace",
      desc: "AI developer workflow engine for coding apps",
      url: "github.com/copilot",
      color: "#1A1A1A",
      icon: "💻"
    },
    {
      name: "Vercel v0 AI UI Designer",
      desc: "Generate production ready React components on the fly",
      url: "v0.dev",
      color: "#1A1A1A",
      icon: "⚡"
    },
    {
      name: "Perplexity Research Assistant",
      desc: "AI search and interactive research engine companion",
      url: "perplexity.ai",
      color: "#444440",
      icon: "🔍"
    }
  ];

  const categories = [
    { name: "Tech & Dev", icon: Cpu, count: "128 sites", bg: "bg-brand-primary/5 text-brand-primary" },
    { name: "Design & UX", icon: Palette, count: "94 sites", bg: "bg-brand-primary/5 text-brand-primary" },
    { name: "Productivity", icon: Zap, count: "210 sites", bg: "bg-brand-primary/5 text-brand-primary" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div id="explore-view-container" className="flex-1 overflow-y-auto pb-24 px-4 pt-4 bg-surface-bg select-none animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Compass className="w-5 h-5 text-brand-primary" />
        <h1 className="font-serif italic font-bold text-xl text-brand-primary">Explore Directory</h1>
      </div>

      {/* Local search bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative flex items-center bg-white border border-brand-primary/10 rounded-full px-4 py-2.5 shadow-xs">
          <Search className="w-4 h-4 text-brand-primary/40 mr-2" />
          <input
            type="text"
            placeholder="Explore websites, AI tools, or search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 focus:outline-none text-xs text-brand-primary font-sans"
          />
          {searchQuery && (
            <button
              type="submit"
              className="text-[10px] uppercase tracking-wider font-bold text-white bg-brand-primary px-3 py-1 rounded-full hover:bg-brand-secondary transition-all"
            >
              Go
            </button>
          )}
        </div>
      </form>

      {/* Curated Categories */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {categories.map((cat, idx) => {
          const IconComponent = cat.icon;
          return (
            <div
              key={idx}
              onClick={() => onSearch(cat.name)}
              className="bg-white rounded-2xl p-3.5 border border-brand-primary/10 flex flex-col justify-between items-start cursor-pointer hover:border-brand-primary/30 hover:shadow-xs transition-all duration-300"
            >
              <div className={`p-2 rounded-xl ${cat.bg} mb-3 border border-brand-primary/5`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-primary tracking-tight truncate w-full">{cat.name}</h4>
                <span className="text-[10px] text-brand-primary/60 font-mono mt-0.5 block">{cat.count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Curated AI Web Tools */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 mb-4">
          <Trophy className="w-4 h-4 text-brand-primary" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/60">
            Featured AI Web-Tools
          </h2>
        </div>
        <div className="space-y-3">
          {featuredTools.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => onOpenCustomUrl(tool.name, tool.url)}
              className="bg-white rounded-2xl p-4 border border-brand-primary/10 flex items-center justify-between cursor-pointer hover:border-brand-primary/30 hover:shadow-xs group transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base shadow-inner bg-surface-bg border border-brand-primary/10"
                >
                  {tool.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-[10px] text-brand-primary/55 truncate max-w-[190px] mt-0.5">{tool.desc}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-brand-primary/35 group-hover:text-brand-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Trending Search Topics */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-4">
          <Flame className="w-4 h-4 text-brand-primary" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/60">
            Trending on Ainovo Search
          </h2>
        </div>
        <div className="bg-white rounded-2xl border border-brand-primary/10 divide-y divide-brand-primary/10 overflow-hidden shadow-xs">
          {trendingTopics.map((topic, idx) => (
            <div
              key={idx}
              onClick={() => onSearch(topic.title)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-bg transition-colors"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-brand-primary/60">
                  {topic.category}
                </span>
                <h4 className="text-xs font-semibold text-brand-primary mt-1 truncate">{topic.title}</h4>
              </div>
              <span className="text-[9px] font-mono text-brand-primary/60 bg-surface-bg border border-brand-primary/10 px-2 py-0.5 rounded-full shrink-0">
                {topic.clicks}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
