import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, X, Sparkles, Loader2, Bot, Check, ArrowRightLeft, BookOpen, AlertCircle } from 'lucide-react';
import { BrowserTab } from '../types';

interface BrowserViewportProps {
  activeTab: BrowserTab;
  onUpdateTabUrl: (id: string, title: string, url: string, content?: string) => void;
  onCloseViewport: () => void;
}

export default function BrowserViewport({
  activeTab,
  onUpdateTabUrl,
  onCloseViewport,
}: BrowserViewportProps) {
  const [urlInput, setUrlInput] = useState(activeTab.url);
  const [history, setHistory] = useState<string[]>([activeTab.url]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [aiPanelExpanded, setAiPanelExpanded] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Sync state with activeTab changes
  useEffect(() => {
    setUrlInput(activeTab.url);
    if (history[historyIndex] !== activeTab.url) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(activeTab.url);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [activeTab]);

  const handleNavigate = (targetUrl: string, targetTitle?: string) => {
    let cleanUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
    }
    
    setIsLoadingPage(true);
    setTimeout(() => {
      setIsLoadingPage(false);
      setUrlInput(cleanUrl);
      
      const domain = cleanUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
      const displayTitle = targetTitle || `${domain.charAt(0).toUpperCase() + domain.slice(1)} | Secure`;
      
      // Update Tab state
      onUpdateTabUrl(activeTab.id, displayTitle, cleanUrl, `This is a sandbox page preview of ${cleanUrl}. Built using high contrast glassmorphism design layouts.`);
      
      // Reset AI summaries on navigation
      setAiSummary(null);
      setAiPanelExpanded(false);
    }, 800);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      handleNavigate(urlInput);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      const targetUrl = history[nextIdx];
      setUrlInput(targetUrl);
      onUpdateTabUrl(activeTab.id, "Back | Browser", targetUrl);
      setAiSummary(null);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const targetUrl = history[nextIdx];
      setUrlInput(targetUrl);
      onUpdateTabUrl(activeTab.id, "Forward | Browser", targetUrl);
      setAiSummary(null);
    }
  };

  const triggerRefresh = () => {
    setIsLoadingPage(true);
    setTimeout(() => {
      setIsLoadingPage(false);
    }, 500);
  };

  // Get dynamic AI Summary from Backend
  const handleGenerateSummary = async () => {
    setAiPanelExpanded(true);
    if (aiSummary) return; // already loaded
    
    setLoadingSummary(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeTab.title,
          url: activeTab.url,
          content: activeTab.content || "Standard digital browser content.",
        }),
      });
      const data = await response.json();
      setAiSummary(data.summary);
    } catch (error) {
      console.error(error);
      setAiSummary("### ⚠️ Connection Failed\nCould not communicate with the summarization engine. Please ensure node modules and dev server are initialized.");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Render simulated page contents based on current URL
  const renderSimulatedPage = () => {
    const url = activeTab.url.toLowerCase();

    // 1. Google Search page simulation
    if (url.includes('google.com/search') || url.includes('search?q=')) {
      const searchParams = new URLSearchParams(activeTab.url.split('?')[1] || '');
      const query = searchParams.get('q') || 'Predictive AI logistics';
      
      return (
        <div className="p-6 bg-white min-h-full font-sans text-brand-primary animate-fadeIn select-text">
          <div className="flex items-center gap-3 border-b border-brand-primary/10 pb-4 mb-6">
            <span className="font-serif italic font-extrabold text-base tracking-tight text-brand-primary">
              Ainovo.Search
            </span>
            <div className="bg-surface-bg px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold border border-brand-primary/10 text-brand-primary">
              {query}
            </div>
          </div>

          <span className="text-[10px] uppercase font-mono text-brand-primary/40 block mb-4">About 3,420,000 index nodes (0.42 seconds)</span>

          <div className="space-y-6 max-w-xl">
            {/* Result 1 */}
            <div className="group">
              <span className="text-[9px] font-mono text-brand-primary/40 block truncate">https://www.ainovo-insights.com &gt; articles</span>
              <button
                onClick={() => handleNavigate('https://www.ainovo-insights.com/ai-in-browsers', 'The Future of AI in Mobile Browsing Experiences')}
                className="text-sm font-serif italic font-bold text-brand-primary hover:underline text-left block mt-1"
              >
                The Future of AI in Mobile Browsing Experiences - Ainovo Insight
              </button>
              <p className="text-xs text-brand-primary/60 mt-1 leading-relaxed">
                Explore how real-time semantic compression and on-device logic blocks are revolutionizing touch and voice navigation across premium devices...
              </p>
            </div>

            {/* Result 2 */}
            <div className="group">
              <span className="text-[9px] font-mono text-brand-primary/40 block truncate">https://www.techcrunch-sample.com &gt; logistics-ai</span>
              <button
                onClick={() => handleNavigate('https://techcrunch-sample.com/supply-chain-predictive', 'Global Supply Chain Trends with AI')}
                className="text-sm font-serif italic font-bold text-brand-primary hover:underline text-left block mt-1"
              >
                How Predictive AI Models Transform Global Supply Chain Operations
              </button>
              <p className="text-xs text-brand-primary/60 mt-1 leading-relaxed">
                Logistics managers adapt neural networks for demand forecasting, achieving 30% overhead reductions. Hurdles include legacy ERP siloing.
              </p>
            </div>

            {/* Result 3 */}
            <div className="group">
              <span className="text-[9px] font-mono text-brand-primary/40 block truncate">https://wikipedia-sample.org &gt; wiki &gt; Glassmorphism</span>
              <button
                onClick={() => handleNavigate('https://wikipedia-sample.org/wiki/Glassmorphism', 'Glassmorphism Design System')}
                className="text-sm font-serif italic font-bold text-brand-primary hover:underline text-left block mt-1"
              >
                Glassmorphism Design Systems - Wikipedia
              </button>
              <p className="text-xs text-brand-primary/60 mt-1 leading-relaxed">
                Glassmorphism is a UI visual trend featuring translucent panels, multi-layered layouts, subtle colored borders, and soft backdrop blurs representing intelligent software.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 2. Wikipedia article or Glassmorphism Wiki
    if (url.includes('wikipedia') || url.includes('glassmorphism')) {
      return (
        <div className="p-6 bg-white min-h-full font-serif text-brand-primary animate-fadeIn select-text leading-relaxed">
          <div className="border-b border-brand-primary/10 pb-3 mb-6 flex justify-between items-start">
            <div>
              <h1 className="font-serif italic font-bold text-xl tracking-tight text-brand-primary">Glassmorphism UI</h1>
              <span className="font-sans text-[10px] uppercase tracking-wider text-brand-primary/50 block mt-1">From Wikipedia, the free encyclopedia</span>
            </div>
            <span className="text-lg">📖</span>
          </div>

          <p className="text-xs mb-4">
            <strong className="font-serif italic font-bold">Glassmorphism</strong> is a modern visual design system popular in advanced applications, especially those deploying AI features. It relies heavily on transparency, semi-opaque background layers, and backdrop filtering to achieve a "frosted glass" appearance.
          </p>

          <h3 className="font-serif italic font-bold text-sm mt-6 mb-2 text-brand-primary">Key Aesthetics</h3>
          <ul className="list-disc pl-5 text-xs space-y-2 mb-4 font-sans text-brand-primary/75">
            <li><strong>Translucency:</strong> Soft background fill (usually 10% to 70% opacity) blended with backdrop-blur nodes.</li>
            <li><strong>Inner Glow:</strong> 1px semi-transparent borders defining edges cleanly over dark, colorful canvas spaces.</li>
            <li><strong>Vibrant Glows:</strong> Utilizing cyan and purple backdrops to reflect intelligence, system responsiveness, or generative tasks.</li>
          </ul>

          <blockquote className="border-l border-brand-primary/30 pl-4 py-1 my-4 bg-surface-bg font-sans text-[11px] text-brand-primary/60">
            "By incorporating glassmorphism exclusively in AI assistants and modals, developers differentiate system-native elements from user-visited sharp sites."
          </blockquote>
        </div>
      );
    }

    // 3. YouTube mockup
    if (url.includes('youtube') || url.includes('video') || url.includes('netflix')) {
      return (
        <div className="bg-[#1A1A1A] text-white min-h-full p-6 animate-fadeIn select-none font-sans">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white font-serif italic font-extrabold text-base tracking-wider">AinoStream.Media</span>
            <span className="text-[8px] tracking-widest font-mono uppercase bg-white/10 px-2 py-0.5 rounded-sm">4K RAW</span>
          </div>

          {/* Main Simulated video window */}
          <div className="w-full aspect-video rounded-2xl bg-black border border-white/10 flex flex-col justify-between p-4 mb-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0" />
            <div className="flex justify-between items-center z-10">
              <span className="text-[10px] uppercase font-mono tracking-wider bg-black/60 px-2.5 py-1 rounded-sm">Active Tab Stream</span>
              <span className="text-[10px] text-white animate-pulse font-bold flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full" /> LIVE
              </span>
            </div>

            {/* Play symbol center */}
            <div className="mx-auto w-12 h-12 rounded-full bg-white text-black flex items-center justify-center cursor-pointer shadow-lg z-10 transform group-hover:scale-105 transition">
              <span className="text-base">▶</span>
            </div>

            {/* Control panel */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[9px] font-mono">03:42 / 12:00</span>
              <div className="w-1/2 h-[2px] bg-white/20 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-white rounded-full" />
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-white/50">Controls</span>
            </div>
          </div>

          <h3 className="text-sm font-serif italic font-bold leading-tight mb-2 text-white">
            The Future of Mobile Browsers and Conversational AI Engines
          </h3>
          <p className="text-xs text-white/60">
            2,450 watching • Streamed live in high fidelity. This video outlines real-world UX design benchmarks for AI overlay panels.
          </p>
        </div>
      );
    }

    // 4. Spotify Mockup
    if (url.includes('spotify') || url.includes('music')) {
      return (
        <div className="bg-[#1A1A1A] text-white min-h-full p-6 animate-fadeIn font-sans flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="font-serif italic font-bold text-sm flex items-center gap-1.5">
              <span>●</span> Soundscape Sandbox
            </span>
            <span className="text-[9px] text-white/55 uppercase tracking-widest font-bold">Connected</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center my-6 gap-4">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 shadow-xl flex items-center justify-center text-4xl">
              🎵
            </div>
            <div className="text-center">
              <h4 className="text-sm font-serif italic font-bold">Midnight Synth Waves</h4>
              <p className="text-xs text-white/55 mt-1">Ainovo Atmospheric Node</p>
            </div>
          </div>

          {/* Player dashboard */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-[10px] text-white/50">
              <span>01:15</span>
              <div className="flex-1 mx-3 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                <div className="w-1/4 h-full bg-white rounded-full" />
              </div>
              <span>04:30</span>
            </div>
            <div className="flex justify-center items-center gap-6">
              <span className="text-white/40 cursor-pointer text-xs">⏮</span>
              <span className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-base cursor-pointer hover:scale-103 transition">▶</span>
              <span className="text-white/40 cursor-pointer text-xs">⏭</span>
            </div>
          </div>
        </div>
      );
    }

    // 5. News Article View
    if (url.includes('insights.com') || url.includes('ai-in-browsers') || activeTab.title.includes('Future')) {
      return (
        <div className="p-6 bg-white min-h-full text-brand-primary animate-fadeIn select-text leading-relaxed font-sans max-w-xl mx-auto">
          {/* Article Image Header */}
          <div className="h-44 w-full rounded-2xl overflow-hidden mb-6 relative border border-brand-primary/10">
            <img
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop"
              alt="Neural net brain"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-3 left-3 bg-brand-primary text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm shadow-sm">
              Ainovo Insight • Feature
            </span>
          </div>

          <h1 className="font-serif italic font-bold text-xl text-brand-primary leading-tight mb-3">
            The Future of AI in Mobile Browsing Experiences
          </h1>

          <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-wider text-brand-primary/60 mb-6 border-b border-brand-primary/10 pb-4">
            <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-bold">
              AI
            </div>
            <span>By <strong>Ainovo Core Team</strong> • 2 hours ago</span>
          </div>

          <p className="text-xs mb-4 text-brand-primary/80">
            Artificial intelligence is fundamentally reshaping how users interact with the web on mobile devices. Historically, browsers have been passive web display engines. The next-generation browser, pioneered by designs like <strong className="text-brand-primary">Ainovo</strong>, acts as a collaborative, cognitive partner.
          </p>

          <h3 className="font-serif italic font-bold text-sm mt-6 mb-2 text-brand-primary">The Demise of the URL Address Bar</h3>
          <p className="text-xs mb-4 text-brand-primary/80">
            In our testing, users of conversational interfaces bypassed typing URLs in 78% of research tasks. Instead, they asked direct synthesis questions like <em>"Analyze predictive AI benefits in inventory operations"</em>, allowing the browser to traverse, load, and compile multiple background targets autonomously.
          </p>

          <h3 className="font-serif italic font-bold text-sm mt-6 mb-2 text-brand-primary">Dynamic Glassmorphism Overlays</h3>
          <p className="text-xs mb-4 text-brand-primary/80">
            A major friction point is context switching. By implementing glassmorphic summary panels that hover gracefully over live pages, we allow readers to digest complex articles, research specifications, and shopping catalogs without abandoning their visual scroll depth.
          </p>

          <div className="bg-surface-bg border border-brand-primary/10 rounded-2xl p-4 font-mono text-[10px] text-brand-primary/60 my-6">
            <strong>Key takeaway:</strong> Future web experiences will prioritize zero-click semantic rendering, combining standard CSS with active server-side LLMs.
          </div>
        </div>
      );
    }

    // 6. Generic or Custom Webpage view
    const domain = activeTab.url.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
    return (
      <div className="p-8 bg-white min-h-full font-sans text-brand-primary animate-fadeIn select-text flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-brand-primary/60 text-[10px] uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-neutral-900" />
            <span>Secure Connection Approved</span>
          </div>

          <h1 className="font-serif italic font-bold text-xl text-brand-primary mb-3">
            Welcome to {domain}
          </h1>
          <p className="text-xs text-brand-primary/60 leading-relaxed mb-6">
            This is an interactive browser viewport rendering the domain: <strong>{activeTab.url}</strong>. You are currently connected via the safe sandbox emulator.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-brand-primary/10 bg-surface-bg">
              <h4 className="text-xs font-bold text-brand-primary mb-1">Security Verified</h4>
              <p className="text-[10px] text-brand-primary/60">SSL encryption active. Headers have been set to prevent third party trackers.</p>
            </div>
            <div className="p-4 rounded-2xl border border-brand-primary/10 bg-surface-bg">
              <h4 className="text-xs font-bold text-brand-primary mb-1">AI Integrated</h4>
              <p className="text-[10px] text-brand-primary/60">Click the floating Sparkles icon above to summarize this custom page content instantly!</p>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-primary/10 pt-4 mt-8 flex items-center justify-between text-[9px] uppercase tracking-wider text-brand-primary/40 font-mono">
          <span>Sandbox node ID: {activeTab.id.slice(0, 6)}</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  return (
    <div id="browser-viewport-overlay" className="fixed inset-0 bg-surface-bg z-40 flex flex-col animate-fadeIn select-none">
      {/* Top Browser Control Panel */}
      <div id="browser-top-controls" className="shrink-0 p-4 bg-white border-b border-brand-primary/10 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {/* Back, Forward, Refresh, Close navigation buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={goBack}
              title="Go Back"
              className="p-1.5 rounded-full hover:bg-surface-bg text-brand-primary disabled:opacity-30 transition"
              disabled={historyIndex === 0}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goForward}
              title="Go Forward"
              className="p-1.5 rounded-full hover:bg-surface-bg text-brand-primary disabled:opacity-30 transition"
              disabled={historyIndex === history.length - 1}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={triggerRefresh}
              title="Reload Page"
              className="p-1.5 rounded-full hover:bg-surface-bg text-brand-primary transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* URL Address Bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1 min-w-0">
            <div className="flex items-center bg-surface-bg border border-brand-primary/10 rounded-full px-4 py-1.5 min-w-0">
              <span className="text-[9px] font-mono font-bold text-brand-primary/60 bg-brand-primary/5 px-1.5 py-0.5 rounded mr-2 shrink-0 border border-brand-primary/10">
                SECURE
              </span>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="bg-transparent flex-1 focus:outline-none text-[11px] text-brand-primary font-mono truncate py-0.5"
              />
            </div>
          </form>

          {/* Close browser simulation, returning to dashboard */}
          <button
            onClick={onCloseViewport}
            title="Close Browser View"
            className="p-1.5 rounded-full bg-brand-primary/5 hover:bg-neutral-950 hover:text-white text-brand-primary/60 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main browser viewport area */}
      <div className="flex-1 relative overflow-hidden flex">
        {/* Webpage iframe simulator content scrollable */}
        <div className="flex-1 overflow-y-auto bg-surface-bg">
          {isLoadingPage ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-white">
              <Loader2 className="w-6 h-6 text-brand-primary animate-spin mb-3" />
              <p className="text-xs text-brand-primary/60">Simulating connection to secure sandbox node...</p>
            </div>
          ) : (
            renderSimulatedPage()
          )}
        </div>

        {/* Floating Glassmorphic AI Summary widget */}
        <div className="absolute top-4 right-4 z-30">
          {!aiPanelExpanded ? (
            <button
              onClick={handleGenerateSummary}
              className="px-4 py-2.5 bg-brand-primary hover:bg-brand-secondary hover:scale-103 text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Summarize Page
            </button>
          ) : (
            /* Expanded Glassmorphic Summary Card */
            <div className="bg-brand-primary text-white border border-brand-primary/15 rounded-2xl p-4 w-72 shadow-xl max-h-[80vh] overflow-y-auto flex flex-col gap-3 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-white/80" /> Ainovo Summary
                </span>
                <button
                  onClick={() => setAiPanelExpanded(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/80 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {loadingSummary ? (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span className="text-[10px] text-white/80">Summoning Gemini API engine...</span>
                </div>
              ) : (
                <div className="text-xs text-white/90 font-sans leading-relaxed space-y-3 select-text max-h-[60vh] overflow-y-auto pr-1">
                  {aiSummary ? (
                    /* Beautiful render with styled markdown spacing */
                    <div className="whitespace-pre-line space-y-2">
                      {aiSummary}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="w-6 h-6 mx-auto mb-1 text-white/80" />
                      <p>No outline loaded. Click summarize to trigger.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[8px] text-white/50 uppercase tracking-widest font-mono">
                <span>Model: gemini-3.5-flash</span>
                <span>Secure SSL summary</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
