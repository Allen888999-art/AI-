import React, { useState } from 'react';
import { Search, QrCode, ScanFace, Plus, ArrowRight, Settings2, Sparkles, BookOpen } from 'lucide-react';
import { Bookmark, NewsArticle } from '../types';

interface HomeViewProps {
  onSearch: (query: string) => void;
  onOpenBookmark: (bookmark: Bookmark) => void;
  onOpenArticle: (article: NewsArticle) => void;
  bookmarks: Bookmark[];
  onAddBookmark: (name: string, url: string) => void;
  newsArticles: NewsArticle[];
}

export default function HomeView({
  onSearch,
  onOpenBookmark,
  onOpenArticle,
  bookmarks,
  onAddBookmark,
  newsArticles,
}: HomeViewProps) {
  const [searchVal, setSearchVal] = useState('');
  const [activeCategory, setActiveCategory] = useState<'for-you' | 'tech' | 'design'>('for-you');
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [newBookUrl, setNewBookUrl] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearch(searchVal);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBookName && newBookUrl) {
      onAddBookmark(newBookName, newBookUrl);
      setNewBookName('');
      setNewBookUrl('');
      setShowAddBookmark(false);
    }
  };

  const filteredNews = newsArticles.filter((art) => art.category === activeCategory);

  return (
    <div id="home-view-container" className="flex-1 overflow-y-auto pb-24 px-4 pt-4 bg-surface-bg select-none animate-fadeIn">
      {/* Header */}
      <div id="home-header" className="flex justify-between items-center mb-6">
        <div id="home-avatar-container" className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-brand-primary/10 object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neutral-900 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-brand-primary tracking-tight">Alex Jensen</h3>
            <span className="text-[9px] font-mono uppercase bg-brand-primary/5 text-brand-primary px-1.5 py-0.5 rounded tracking-wider font-bold">
              PRO MEMBER
            </span>
          </div>
        </div>
        
        <div id="logo-container" className="flex items-center gap-1.5 px-2 py-1">
          <span className="font-serif italic font-black text-xl tracking-tighter text-brand-primary">Ainovo.</span>
        </div>
      </div>

      {/* AI search and ask bar */}
      <div id="ai-search-outer" className="mb-8 max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          {/* Editorial Minimal Border Wrapper */}
          <div className="w-full bg-brand-primary p-[1.5px] rounded-full shadow-sm">
            <div className="flex items-center bg-white rounded-full px-4 py-3 gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
              <input
                type="text"
                placeholder="Search or ask anything..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="flex-1 bg-transparent text-brand-primary placeholder-brand-primary/40 focus:outline-none text-xs font-sans"
              />
              <div className="flex items-center gap-2 text-brand-primary/50 shrink-0 border-l border-brand-primary/10 pl-2">
                <button
                  type="button"
                  title="Scan QR Code"
                  onClick={() => alert("Simulating Camera QR Scan... Frame permissions configured.")}
                  className="p-1 hover:text-brand-primary transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Face Search"
                  onClick={() => alert("Simulating Image / Visual Search feature...")}
                  className="p-1 hover:text-brand-primary transition-colors"
                >
                  <ScanFace className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Shortcut Bookmarks Grid */}
      <div id="shortcuts-grid-container" className="mb-8">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/60 mb-4 px-1">
          The Archive / Quick Access
        </h2>
        <div id="bookmarks-grid" className="grid grid-cols-4 gap-4">
          {bookmarks.map((b) => (
            <button
              key={b.id}
              onClick={() => onOpenBookmark(b)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center bg-white border border-brand-primary/10 shadow-xs group-hover:scale-105 group-hover:border-brand-primary/40 group-hover:shadow-sm transition-all duration-300"
              >
                {b.icon.startsWith('http') ? (
                  <img
                    src={b.icon}
                    alt={b.name}
                    className="w-7 h-7 object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-serif italic font-bold text-white text-sm shadow-inner"
                    style={{ backgroundColor: b.color || '#444440' }}
                  >
                    {b.icon}
                  </div>
                )}
              </div>
              <span className="mt-2 text-[11px] font-medium text-brand-primary text-center truncate w-full px-1">
                {b.name}
              </span>
            </button>
          ))}

          {/* Add Bookmark Trigger */}
          <button
            onClick={() => setShowAddBookmark(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white border border-dashed border-brand-primary/20 group-hover:border-brand-primary/50 group-hover:bg-brand-primary/5 transition-all duration-300">
              <Plus className="w-4 h-4 text-brand-primary/60 group-hover:text-brand-primary" />
            </div>
            <span className="mt-2 text-[11px] font-medium text-brand-primary/60 group-hover:text-brand-primary">
              Add
            </span>
          </button>
        </div>
      </div>

      {/* Add Bookmark Dialog Overlay */}
      {showAddBookmark && (
        <div className="fixed inset-0 bg-brand-primary/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-brand-primary/15 shadow-xl">
            <h3 className="text-sm font-bold tracking-tight text-brand-primary mb-4">Add Custom Bookmark</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-brand-primary/60 mb-1">Site Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wikipedia"
                  value={newBookName}
                  onChange={(e) => setNewBookName(e.target.value)}
                  className="w-full bg-surface-bg border border-brand-primary/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-brand-primary text-brand-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-brand-primary/60 mb-1">URL / Link</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. wikipedia.org"
                  value={newBookUrl}
                  onChange={(e) => setNewBookUrl(e.target.value)}
                  className="w-full bg-surface-bg border border-brand-primary/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-brand-primary text-brand-primary"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBookmark(false)}
                  className="px-4 py-2 text-xs font-medium text-brand-primary/60 hover:bg-surface-bg rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-full hover:bg-brand-secondary transition-colors"
                >
                  Add Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* For You / Tech / Design Categories */}
      <div id="news-categories" className="flex items-center gap-2 mb-4 overflow-x-auto py-1">
        {(['for-you', 'tech', 'design'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-brand-primary text-white shadow-xs'
                : 'bg-white text-brand-primary/75 border border-brand-primary/10 hover:bg-surface-bg'
            }`}
          >
            {cat === 'for-you' ? 'For You' : cat === 'tech' ? 'Tech' : 'Design'}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div id="articles-feed" className="space-y-4">
        {filteredNews.map((art) => (
          <div
            key={art.id}
            onClick={() => onOpenArticle(art)}
            className="bg-white rounded-2xl overflow-hidden border border-brand-primary/10 shadow-xs hover:shadow-sm hover:border-brand-primary/25 transition-all duration-300 cursor-pointer group"
          >
            {/* News Cover Image */}
            <div className="h-44 w-full overflow-hidden relative">
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 text-[9px] uppercase tracking-widest font-bold bg-white text-brand-primary px-2.5 py-1 rounded-sm shadow-xs">
                {art.category === 'for-you' ? 'Insight' : art.category}
              </span>
            </div>

            {/* News Content */}
            <div className="p-4">
              <h3 className="font-serif italic font-bold text-lg text-brand-primary leading-snug mb-2 group-hover:text-brand-secondary transition-colors">
                {art.title}
              </h3>
              <p className="text-xs text-brand-primary/60 line-clamp-2 mb-3">
                {art.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-brand-primary/55 font-mono">
                  {art.source} • {art.timeAgo}
                </span>
                <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-brand-primary flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Read Article <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
