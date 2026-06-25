import React, { useState } from 'react';
import { Home, Compass, Bot, Layers, User, Smartphone, Sparkles, Monitor } from 'lucide-react';
import { BrowserTab, Bookmark, NewsArticle, Message, Assistant } from './types';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import AiHubView from './components/AiHubView';
import TabsView from './components/TabsView';
import ProfileView from './components/ProfileView';
import BrowserViewport from './components/BrowserViewport';

export default function App() {
  // Navigation tabs state: 'home' | 'explore' | 'ai-hub' | 'tabs' | 'profile'
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'explore' | 'ai-hub' | 'tabs' | 'profile'>('home');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'responsive'>('mobile');

  // Bookmarks Shortcuts State
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: '1', name: 'Google', url: 'https://www.google.com', icon: 'G', color: '#4285f4' },
    { id: '2', name: 'Amazon', url: 'https://www.amazon.com/shop', icon: 'A', color: '#ff9900' },
    { id: '3', name: 'Facebook', url: 'https://www.facebook.com', icon: 'F', color: '#1877f2' },
    { id: '4', name: 'Instagram', url: 'https://www.instagram.com', icon: 'I', color: '#e1306c' },
    { id: '5', name: 'YouTube', url: 'https://www.youtube.com', icon: 'Y', color: '#ff0000' },
    { id: '6', name: 'Netflix', url: 'https://www.netflix.com', icon: 'N', color: '#e50914' },
    { id: '7', name: 'Spotify', url: 'https://www.spotify.com', icon: 'S', color: '#1db954' },
  ]);

  // Pre-loaded browser tabs matching Thumbnails in Screens 3 and 4
  const [browserTabs, setBrowserTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-news',
      title: 'News Site',
      url: 'https://www.nytimes.com',
      content: 'The New York Times: World coverage, science discoveries, and AI real-time predictive logistics analyses.',
      isIncognito: false,
    },
    {
      id: 'tab-shop',
      title: 'Shopping Page',
      url: 'https://www.amazon.com/shop',
      content: 'Product catalogs, clothing accessories, running shoes, and user reviews matching modern designs.',
      isIncognito: false,
    },
    {
      id: 'tab-ainovo',
      title: 'Ainovo Home',
      url: 'https://ainovo.ai/portal',
      content: 'Welcome to your premium AI-native browser portal. Summarize contents or chat live inside any tab.',
      isIncognito: false,
    },
    {
      id: 'tab-wiki',
      title: 'Design System',
      url: 'https://wikipedia.org/wiki/Glassmorphic_UI',
      content: 'A comprehensive guide explaining the history and implementation details of backdrop blurs in AI browsers.',
      isIncognito: false,
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>('tab-ainovo');
  const [isBrowsing, setIsBrowsing] = useState<boolean>(false); // whether browser overlay is visible

  // AI Chat History logs
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // AI Assistants config builder
  const [assistants, setAssistants] = useState<Assistant[]>([
    {
      id: 'coder',
      name: 'Coder',
      icon: '💻',
      description: 'Expert software developer for HTML, React, and Tailwind.',
      systemInstruction: 'You are an elite senior software developer. Write clean, modular, and performant code blocks with markdown explanation.',
    },
    {
      id: 'analyst',
      name: 'Analyst',
      icon: '📊',
      description: 'Business advisor for data analysis and logistical chains.',
      systemInstruction: 'You are an advanced business intelligence strategist. Use structured outlines, bullet points, and data summaries.',
    },
  ]);
  const [activeAssistantId, setActiveAssistantId] = useState<string>('coder');
  const [selectedModel, setSelectedModel] = useState<string>('Ainovo-G1');

  // Static prebuilt premium news feed
  const newsArticles: NewsArticle[] = [
    {
      id: 'art-1',
      title: 'The Future of AI in Mobile Browsing Experiences',
      source: 'Ainovo Insight',
      timeAgo: '2h ago',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
      description: 'AI is fundamentally reshaping how users interact with the web on mobile devices. Historically, browsers have been passive web rendering engines...',
      content: 'Artificial intelligence is fundamentally reshaping how users interact with the web on mobile devices. Instead of passive search entries, browsers are leveraging deep text comprehension modules to parse web pages asynchronously and serve logical summaries to readers without requiring redundant site transitions.',
      category: 'for-you',
    },
    {
      id: 'art-2',
      title: 'How Glassmorphism UI is Reshaping Intelligent Software',
      source: 'UX Digest',
      timeAgo: '5h ago',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      description: 'Learn why transparency, inner glows, and radial backdrops are being used to differentiate cognitive AI agents from static web forms...',
      content: 'Visual boundaries are crucial in conversational apps. By deploying high contrast, translucent glass panels paired with cyan-to-purple gradient overlays, UX designers can signal that a piece of content was dynamically generated by the software AI core rather than pulled from raw server storage.',
      category: 'design',
    },
    {
      id: 'art-3',
      title: 'Global Supply Chain Logistics Adapt Predictive AI Models',
      source: 'Enterprise Tech',
      timeAgo: '1d ago',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
      description: 'Logistics nodes reduce forecasting errors by up to 30%, shifting predictive intelligence from a theoretical asset to a core operational necessity.',
      content: 'Enterprises are integrating predictive networks to bypass shipping port jams. By linking local inventory counters directly to weather trends and regional geopolitical datasets, manufacturers are automating re-route pathways dynamically.',
      category: 'tech',
    },
  ];

  // Send message to Express backend with Gemini client
  const handleSendMessage = async (text: string, model: string, imageBase64?: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const activeAssistant = assistants.find((ast) => ast.id === activeAssistantId);
      const systemPrompt = activeAssistant ? activeAssistant.systemInstruction : undefined;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages,
          model,
          systemInstruction: systemPrompt,
          imageBase64,
        }),
      });

      const data = await response.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: data.text || "An unexpected error occurred. Please refresh or configure your API secret.",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: "### ⚠️ Network Timeout\nCould not connect to the Ainovo core server. Please check your system deployment parameters.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Browser Viewport Handlers
  const handleOpenBookmark = (bookmark: Bookmark) => {
    // Find or create tab for this bookmark url
    const domain = bookmark.url.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
    const existingTab = browserTabs.find((t) => t.url === bookmark.url);
    
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: BrowserTab = {
        id: `tab-${Date.now()}`,
        title: bookmark.name,
        url: bookmark.url,
        content: `Simulated portal for ${bookmark.name}. Built with full logical properties for responsive scaling.`,
        isIncognito: false,
      };
      setBrowserTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
    setIsBrowsing(true);
  };

  const handleOpenArticle = (article: NewsArticle) => {
    const articleUrl = `https://www.ainovo-insights.com/articles/${article.id}`;
    const existingTab = browserTabs.find((t) => t.url === articleUrl);

    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: BrowserTab = {
        id: `tab-${Date.now()}`,
        title: article.title,
        url: articleUrl,
        content: article.content,
        isIncognito: false,
      };
      setBrowserTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
    setIsBrowsing(true);
  };

  const handleSearchTrigger = (query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}`,
      title: `Google Search: ${query}`,
      url: searchUrl,
      content: `Google Search Results query matching "${query}". Includes smart related topics.`,
      isIncognito: false,
    };
    setBrowserTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setIsBrowsing(true);
  };

  const handleOpenCustomUrl = (title: string, url: string) => {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}`,
      title,
      url: cleanUrl,
      content: `Featured portal workspace for ${title}. Responsive and secure sandbox context.`,
      isIncognito: false,
    };
    setBrowserTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setIsBrowsing(true);
  };

  const handleUpdateTabUrl = (id: string, title: string, url: string, content?: string) => {
    setBrowserTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, url, content: content || t.content } : t))
    );
  };

  // Add custom bookmark
  const handleAddBookmark = (name: string, url: string) => {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    const initials = name.slice(0, 1).toUpperCase();
    const colors = ['#425aa5', '#ea4335', '#34a853', '#fbc02d', '#9c27b0', '#00bcd4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      name,
      url: cleanUrl,
      icon: initials,
      color: randomColor,
    };
    setBookmarks((prev) => [...prev, newBookmark]);
  };

  // Add custom AI assistant bot
  const handleAddAssistant = (name: string, description: string, systemInstruction: string, icon: string) => {
    const newAssistant: Assistant = {
      id: `ast-${Date.now()}`,
      name,
      icon,
      description,
      systemInstruction,
      isCustom: true,
    };
    setAssistants((prev) => [...prev, newAssistant]);
    setActiveAssistantId(newAssistant.id);
  };

  // Tab Manager Operations
  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
    setIsBrowsing(true);
  };

  const handleCloseTab = (id: string) => {
    const remaining = browserTabs.filter((t) => t.id !== id);
    setBrowserTabs(remaining);
    
    if (activeTabId === id && remaining.length > 0) {
      setActiveTabId(remaining[0].id);
    }
  };

  const handleAddBlankTab = (isIncognito = false) => {
    const id = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id,
      title: isIncognito ? 'Incognito Tab' : 'Blank Tab',
      url: 'https://ainovo.ai/portal',
      content: 'Blank safe portal template.',
      isIncognito,
    };
    setBrowserTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
    setIsBrowsing(true);
  };

  const activeTab = browserTabs.find((t) => t.id === activeTabId) || browserTabs[0];

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#1A1A1A] flex flex-col items-center justify-start p-0 md:p-6 font-sans">
      
      {/* Device frame preview selector for desktop */}
      <div className="hidden md:flex items-center gap-4 mb-4 bg-[#EBEBE6] border border-neutral-900/10 px-4 py-2 rounded-full shadow-sm text-neutral-800">
        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-600">Device Simulator:</span>
        <button
          onClick={() => setDeviceMode('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold transition ${
            deviceMode === 'mobile' ? 'bg-brand-primary text-white' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Smartphone className="w-3 h-3" /> Mobile Viewport
        </button>
        <button
          onClick={() => setDeviceMode('responsive')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold transition ${
            deviceMode === 'responsive' ? 'bg-brand-primary text-white' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Monitor className="w-3 h-3" /> Responsive Wide
        </button>
      </div>

      {/* Main smartphone/wrapper canvas */}
      <div
        className={`w-full bg-surface-bg flex flex-col relative overflow-hidden text-text-primary ${
          deviceMode === 'mobile'
            ? 'max-w-[412px] h-[840px] rounded-[40px] border-8 border-neutral-900 shadow-2xl'
            : 'max-w-4xl h-[840px] rounded-3xl border border-brand-primary/10 shadow-xl'
        }`}
      >
        
        {/* Phone Notch/Island representing Screen 1, 2 */}
        {deviceMode === 'mobile' && (
          <div className="shrink-0 h-6 bg-white w-full flex justify-between items-center px-6 relative z-10">
            <span className="text-[10px] font-bold font-mono text-brand-primary">9:41</span>
            <div className="w-24 h-4 rounded-full bg-brand-primary/5 absolute left-1/2 -translate-x-1/2 top-1 flex items-center justify-center border border-brand-primary/5">
              <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full" />
            </div>
            <div className="flex items-center gap-1 text-[9px] text-brand-primary font-bold uppercase font-mono">
              <span>5G</span>
              <span>📶</span>
            </div>
          </div>
        )}

        {/* Content View Routing */}
        <div className="flex-1 overflow-hidden flex flex-col relative bg-surface-bg">
          {activeNavTab === 'home' && (
            <HomeView
              onSearch={handleSearchTrigger}
              onOpenBookmark={handleOpenBookmark}
              onOpenArticle={handleOpenArticle}
              bookmarks={bookmarks}
              onAddBookmark={handleAddBookmark}
              newsArticles={newsArticles}
            />
          )}

          {activeNavTab === 'explore' && (
            <ExploreView
              onSearch={handleSearchTrigger}
              onOpenCustomUrl={handleOpenCustomUrl}
            />
          )}

          {activeNavTab === 'ai-hub' && (
            <AiHubView
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={chatLoading}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          )}

          {activeNavTab === 'tabs' && (
            <TabsView
              tabs={browserTabs}
              activeTabId={activeTabId}
              onSelectTab={handleSelectTab}
              onCloseTab={handleCloseTab}
              onAddTab={handleAddBlankTab}
            />
          )}

          {activeNavTab === 'profile' && (
            <ProfileView
              assistants={assistants}
              onAddAssistant={handleAddAssistant}
              onSelectAssistant={setActiveAssistantId}
              activeAssistantId={activeAssistantId}
            />
          )}

          {/* Simulated Webpage view floating overlay */}
          {isBrowsing && activeTab && (
            <BrowserViewport
              activeTab={activeTab}
              onUpdateTabUrl={handleUpdateTabUrl}
              onCloseViewport={() => setIsBrowsing(false)}
            />
          )}
        </div>

        {/* Floating Bottom Persistent Navigation Dock - Screens 1, 2, 3, 5 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-brand-primary/10 flex justify-around items-center px-2 z-30 shadow-lg">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'explore', label: 'Explore', icon: Compass },
            { id: 'ai-hub', label: 'AI Hub', icon: Bot, isSpecial: true },
            { id: 'tabs', label: 'Tabs', icon: Layers, badge: browserTabs.length },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNavTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveNavTab(tab.id as any);
                  setIsBrowsing(false); // return to core interface on nav
                }}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 group cursor-pointer ${
                  tab.isSpecial && isActive
                    ? 'bg-[#EBEBE6] text-brand-primary shadow-sm scale-103'
                    : 'text-brand-primary/40 hover:text-brand-primary'
                }`}
              >
                <div className="relative">
                  {/* Icon */}
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${
                    isActive ? 'text-brand-primary font-bold' : 'text-brand-primary/40'
                  }`} />
                  
                  {/* Badge Counter */}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white font-mono text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </div>
                
                <span className={`text-[10px] mt-1 font-medium tracking-tight ${
                  isActive ? 'text-brand-primary font-extrabold' : 'text-brand-primary/40'
                }`}>
                  {tab.label}
                </span>

                {isActive && !tab.isSpecial && (
                  <span className="absolute bottom-1 w-5 h-0.5 bg-brand-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic bottom gesture pill overlay representing home bar */}
        {deviceMode === 'mobile' && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-brand-primary/20 rounded-full z-35" />
        )}
      </div>
    </div>
  );
}
