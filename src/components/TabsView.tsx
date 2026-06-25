import React, { useState } from 'react';
import { X, Plus, Search, Shield, Globe, ShoppingBag, EyeOff } from 'lucide-react';
import { BrowserTab } from '../types';

interface TabsViewProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onAddTab: (isIncognito?: boolean) => void;
}

export default function TabsView({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onAddTab,
}: TabsViewProps) {
  const [currentSubTab, setCurrentSubTab] = useState<'regular' | 'incognito'>('regular');
  const [searchFilter, setSearchFilter] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredTabs = tabs.filter((t) => {
    const matchesIncognito = currentSubTab === 'incognito' ? t.isIncognito : !t.isIncognito;
    const matchesSearch = t.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          t.url.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesIncognito && matchesSearch;
  });

  const getTabIcon = (url: string) => {
    if (url.includes('news') || url.includes('nytimes')) return <Globe className="w-3.5 h-3.5 text-brand-primary/60" />;
    if (url.includes('shop') || url.includes('amazon')) return <ShoppingBag className="w-3.5 h-3.5 text-brand-primary/60" />;
    if (url.includes('ainovo')) return <Shield className="w-3.5 h-3.5 text-brand-primary/60" />;
    return <Globe className="w-3.5 h-3.5 text-brand-primary/50" />;
  };

  const getMockThumbnail = (tab: BrowserTab) => {
    if (tab.url.includes('nytimes') || tab.url.includes('news')) {
      return (
        <div className="w-full h-full p-3 flex flex-col justify-between bg-[#F5F5F0] text-brand-primary border border-brand-primary/5">
          <div className="border-b border-brand-primary/10 pb-1 flex justify-between items-center">
            <span className="font-serif font-black text-[9px] tracking-tight uppercase">THE NEWS TIMES</span>
            <span className="text-[7px] font-mono bg-brand-primary text-white px-1 py-0.5 rounded-sm">BREAKING</span>
          </div>
          <div className="flex-1 py-2 flex flex-col gap-1.5 justify-center">
            <h4 className="font-serif font-bold text-xs text-brand-primary leading-tight line-clamp-2">
              AI Models Breakthrough in Climate Modeling Insights
            </h4>
            <p className="text-[8px] text-brand-primary/60 line-clamp-2">
              Leading scientists announce new real-time forecasting nodes powered by high-throughput processors...
            </p>
          </div>
          <div className="flex items-center gap-1 border-t border-brand-primary/5 pt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            <span className="text-[7px] uppercase tracking-wider text-brand-primary/40 font-mono">Live Coverage</span>
          </div>
        </div>
      );
    }
    
    if (tab.url.includes('amazon') || tab.url.includes('shop')) {
      return (
        <div className="w-full h-full p-3 bg-white text-brand-primary flex flex-col justify-between border border-brand-primary/5">
          <div className="flex justify-between items-center border-b border-brand-primary/10 pb-1">
            <span className="text-[9px] uppercase tracking-wider font-bold text-brand-primary/60">Shopping Portal</span>
            <span className="text-[7px] bg-brand-primary/5 text-brand-primary px-1 rounded-sm border border-brand-primary/10 font-bold">SALE</span>
          </div>
          <div className="flex-1 flex gap-2 items-center py-2">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F0] border border-brand-primary/10 flex items-center justify-center text-base shadow-inner">
              👟
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-[10px] font-bold text-brand-primary truncate">Running shoes Pro</h5>
              <p className="text-[9px] font-mono text-brand-primary font-bold">$89.99</p>
            </div>
          </div>
          <button disabled className="w-full bg-brand-primary text-white text-[8px] uppercase tracking-wider py-1 rounded-full font-bold">
            Add to cart
          </button>
        </div>
      );
    }

    if (tab.url.includes('netflix') || tab.url.includes('youtube')) {
      return (
        <div className="w-full h-full bg-[#1A1A1A] p-3 flex flex-col justify-between border border-brand-primary/5 text-white">
          <div className="flex justify-between items-center">
            <span className="font-serif italic font-black text-xs tracking-wider">Cinema</span>
            <span className="text-[7px] tracking-wider text-white/40 uppercase font-mono">Trending #1</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-1 py-1">
            <div className="h-10 w-full rounded bg-zinc-800 flex items-center justify-center relative overflow-hidden group">
              <span className="text-[8px] text-zinc-500 font-mono">Video Canvas</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1">
                <span className="text-[8px] text-white font-bold truncate">Stranger Things S5</span>
              </div>
            </div>
          </div>
          <span className="text-[7px] text-[#EBEBE6] uppercase tracking-widest font-bold">Watch Trailer Now</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full p-3 bg-surface-bg flex flex-col justify-between border border-brand-primary/5">
        <div className="flex items-center gap-1.5 border-b border-brand-primary/10 pb-1">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          <span className="font-serif italic font-semibold text-[10px] text-brand-primary truncate">Ainovo Homepage</span>
        </div>
        <div className="flex-1 py-2 flex flex-col justify-center items-center gap-1">
          <span className="text-xl">🪐</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Search or Ask</span>
        </div>
        <div className="text-[7px] uppercase tracking-wider text-brand-primary/40 text-center font-mono">
          Secure Sandbox Session
        </div>
      </div>
    );
  };

  return (
    <div id="tabs-dashboard-container" className="flex-1 flex flex-col h-full bg-surface-bg select-none animate-fadeIn">
      {/* Header with Regular vs Incognito switch */}
      <div className="shrink-0 p-4 bg-white border-b border-brand-primary/10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentSubTab('regular')}
              className={`text-base font-serif italic font-extrabold pb-1 border-b-2 transition-all ${
                currentSubTab === 'regular'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-primary/40 hover:text-brand-primary'
              }`}
            >
              Tabs
            </button>
            <button
              onClick={() => setCurrentSubTab('incognito')}
              className={`text-base font-serif italic font-extrabold pb-1 border-b-2 flex items-center gap-1.5 transition-all ${
                currentSubTab === 'incognito'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-primary/40 hover:text-brand-primary'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" /> Incognito
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {showSearch && (
              <input
                type="text"
                placeholder="Search tabs..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-surface-bg border border-brand-primary/10 rounded-full px-3 py-1 text-[11px] focus:outline-none w-32 animate-fadeIn text-brand-primary"
              />
            )}
            <button
              onClick={() => setShowSearch(!showSearch)}
              title="Search Tabs"
              className="p-1.5 rounded-full hover:bg-surface-bg text-brand-primary/60"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs list Grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {filteredTabs.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center max-w-xs mx-auto space-y-4 pt-12">
            <div className="w-12 h-12 rounded-full bg-white border border-brand-primary/10 flex items-center justify-center text-brand-primary/40">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider">No Tabs Open</h3>
              <p className="text-xs text-brand-primary/60 mt-1">
                All open browser tabs in this {currentSubTab} session will list here. Add a new tab to start browsing.
              </p>
            </div>
            <button
              onClick={() => onAddTab(currentSubTab === 'incognito')}
              className="bg-brand-primary text-white text-[10px] uppercase tracking-wider font-bold px-4 py-2 rounded-full hover:bg-brand-secondary transition"
            >
              Spawn Tab
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredTabs.map((t) => {
              const isActive = t.id === activeTabId;
              return (
                <div
                  key={t.id}
                  className={`relative rounded-2xl overflow-hidden border bg-white flex flex-col h-48 hover:shadow-xs transition-all duration-300 group cursor-pointer ${
                    isActive 
                      ? 'ring-1 ring-brand-primary border-transparent' 
                      : 'border-brand-primary/10'
                  }`}
                >
                  {/* Card Tab Header */}
                  <div
                    onClick={() => onSelectTab(t.id)}
                    className="shrink-0 p-2.5 bg-surface-bg border-b border-brand-primary/10 flex items-center justify-between min-w-0"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {getTabIcon(t.url)}
                      <span className="text-[10px] font-bold text-brand-primary truncate max-w-[80px]">
                        {t.title}
                      </span>
                    </div>
                    {/* Close Tab X Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(t.id);
                      }}
                      className="p-1 rounded-full bg-brand-primary/5 hover:bg-neutral-950 hover:text-white text-brand-primary/60 shrink-0 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Thumbnail Preview Area */}
                  <div
                    onClick={() => onSelectTab(t.id)}
                    className="flex-1 relative overflow-hidden"
                  >
                    {getMockThumbnail(t)}
                    {/* Dark gradient when hovering */}
                    <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary bg-white px-2.5 py-1 rounded-full shadow-sm">
                        Activate Tab
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Center Addition Button */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => onAddTab(currentSubTab === 'incognito')}
          className="w-12 h-12 rounded-full bg-brand-primary hover:bg-brand-secondary text-white flex items-center justify-center shadow-md hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
