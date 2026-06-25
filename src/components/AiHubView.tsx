import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Bot, Plus, Mic, Paperclip, CheckCircle2, Info, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Message } from '../types';

interface AiHubViewProps {
  messages: Message[];
  onSendMessage: (text: string, model: string, imageBase64?: string) => Promise<void>;
  isLoading: boolean;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export default function AiHubView({
  messages,
  onSendMessage,
  isLoading,
  selectedModel,
  setSelectedModel,
}: AiHubViewProps) {
  const [inputText, setInputText] = useState('');
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDeepThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedImage) return;

    const textToSend = inputText;
    const imgToSend = attachedImage || undefined;
    
    setInputText('');
    setAttachedImage(null);

    if (selectedModel === 'Ainovo-G1') {
      // Simulate "Deep Thinking..." effect
      setIsDeepThinking(true);
      setTimeout(async () => {
        setIsDeepThinking(false);
        await onSendMessage(textToSend, selectedModel, imgToSend);
      }, 1800);
    } else {
      await onSendMessage(textToSend, selectedModel, imgToSend);
    }
  };

  const selectSuggestedPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  const handleMicToggle = () => {
    if (!micActive) {
      setMicActive(true);
      // Simulate speech-to-text
      setTimeout(() => {
        setInputText("Analyze the latest trends in global supply chain logistics, specifically focusing on predictive AI models.");
        setMicActive(false);
      }, 2000);
    } else {
      setMicActive(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachedImage(null);
  };

  const suggestedPrompts = [
    {
      title: "Supply Chain",
      prompt: "Analyze the latest trends in global supply chain logistics, specifically focusing on the integration of predictive AI models for inventory management. Highlight key benefits and potential integration hurdles."
    },
    {
      title: "Design Code",
      prompt: "Write a React component for a premium glassmorphic news card with tailwind styling, a glowing cyan/purple border, and responsive behavior."
    },
    {
      title: "Quick Summary",
      prompt: "Explain quantum computing in three clear, humbler bullet points for a non-technical manager."
    }
  ];

  // Helper to format bot responses nicely
  const renderBotContent = (content: string) => {
    // Check if it's the specific supply chain query to format exactly like Screen 2
    const isSupplyChainResult = content.includes("supply chain") || content.includes("Demand Forecasting Accuracy");
    
    if (isSupplyChainResult) {
      return (
        <div className="space-y-4 animate-fadeIn">
          {/* Analysis Complete Header */}
          <div className="flex items-center gap-2 border-b border-border-light pb-2">
            <Bot className="w-5 h-5 text-brand-secondary" />
            <h3 className="font-display font-extrabold text-base text-brand-primary">Analysis Complete</h3>
          </div>
          
          <p className="text-sm text-text-primary leading-relaxed">
            The integration of predictive AI models in global supply chain logistics is shifting from a theoretical advantage to an operational necessity. Recent data indicates a significant acceleration in adoption, primarily driven by the need for resilience against macroeconomic shocks.
          </p>

          <div>
            <h4 className="font-display font-bold text-sm text-brand-primary mb-2">Key Integration Benefits</h4>
            <ul className="space-y-3 pl-1">
              <li className="text-xs text-text-secondary flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                <span>
                  <strong className="text-text-primary">Demand Forecasting Accuracy:</strong> Advanced models reduce forecasting errors by up to 30%, minimizing stockouts and overstock.
                </span>
              </li>
              <li className="text-xs text-text-secondary flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                <span>
                  <strong className="text-text-primary">Dynamic Routing:</strong> Real-time adjustments to logistics networks based on weather, geopolitical events, and port congestion.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex gap-2.5">
            <Info className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary">
              While benefits are substantial, data siloing remains the primary hurdle. Organizations struggle to harmonize legacy enterprise resource planning (ERP) datasets.
            </p>
          </div>
        </div>
      );
    }

    // Generic formatting for standard markdown, list items, code snippets
    return (
      <div className="text-sm leading-relaxed space-y-2 whitespace-pre-line text-text-primary">
        {content}
      </div>
    );
  };

  return (
    <div id="ai-hub-container" className="flex-1 flex flex-col h-full bg-surface-bg overflow-hidden animate-fadeIn select-none">
      {/* Top Model Selector Bar */}
      <div id="model-selector-bar" className="shrink-0 p-4 bg-white border-b border-brand-primary/10 flex flex-col items-center">
        <div className="flex items-center gap-1.5 mb-3">
          <Bot className="w-4 h-4 text-brand-primary" />
          <h1 className="font-serif italic font-bold text-base text-brand-primary">Ainovo AI Hub</h1>
        </div>

        {/* Triple model pill tab */}
        <div className="bg-surface-bg p-1 rounded-full flex w-full max-w-sm border border-brand-primary/10">
          {['Ainovo-G1', 'GPT-4', 'Claude'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-full transition-all duration-300 ${
                selectedModel === m
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-primary/60 hover:text-brand-primary'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div id="chat-messages-container" className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center max-w-xs mx-auto space-y-6 pt-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center border border-brand-primary/10 relative shadow-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="font-serif italic font-bold text-lg text-brand-primary">Meet your AI Browse Companion</h2>
              <p className="text-xs text-brand-primary/60 mt-2 leading-relaxed">
                Choose a model and ask anything. Or, visit webpages and use me to summarize, analyze, or answer research questions instantly.
              </p>
            </div>

            {/* Quick Suggestions list */}
            <div className="w-full text-left space-y-2 pt-2">
              <h4 className="text-[9px] font-bold text-brand-primary/50 uppercase tracking-[0.2em] mb-2">Suggested Tasks</h4>
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSuggestedPrompt(p.prompt)}
                  className="w-full bg-white hover:bg-surface-bg border border-brand-primary/10 rounded-xl p-3 text-left transition-all duration-200 group flex justify-between items-center"
                >
                  <span className="text-xs font-semibold text-brand-primary group-hover:text-brand-secondary">
                    {p.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-primary/35 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                  msg.sender === 'user' 
                    ? 'bg-brand-primary border-brand-primary text-white' 
                    : 'bg-white border-brand-primary/15 text-brand-primary'
                }`}>
                  {msg.sender === 'user' ? (
                    <span>U</span>
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Bubble */}
                <div className="flex flex-col space-y-1">
                  <div
                    className={`p-4 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-[#EBEBE6] border border-brand-primary/5 rounded-tr-sm text-brand-primary'
                        : 'bg-white border border-brand-primary/10 rounded-tl-sm shadow-xs'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="text-xs font-sans leading-relaxed">{msg.content}</p>
                    ) : (
                      renderBotContent(msg.content)
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-brand-primary/40 self-end px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Real circular radial "Deep Thinking..." spinner or Loading Loader */}
        {isDeepThinking && (
          <div className="flex gap-3 max-w-[85%] mr-auto animate-fadeIn">
            <div className="w-7 h-7 rounded-full bg-white border border-brand-primary/15 flex items-center justify-center text-brand-primary">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-brand-primary/10 rounded-2xl rounded-tl-sm p-4 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                {/* Segmented rotation loader representing Screen 2 */}
                <div className="relative shrink-0 w-5 h-5">
                  <div className="absolute inset-0 rounded-full border-2 border-brand-primary/10"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-t-brand-primary border-r-brand-primary animate-spin"></div>
                </div>
                <span className="text-xs font-bold text-brand-primary font-serif italic tracking-tight">
                  Deep Thinking...
                </span>
              </div>
              <p className="text-[10px] font-mono text-brand-primary/50 animate-pulse">
                Evaluating core parameters & compiling logistics optimization graphs...
              </p>
            </div>
          </div>
        )}

        {/* Loading from Server */}
        {isLoading && !isDeepThinking && (
          <div className="flex gap-3 max-w-[85%] mr-auto animate-fadeIn">
            <div className="w-7 h-7 rounded-full bg-white border border-brand-primary/15 flex items-center justify-center text-brand-primary">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-brand-primary/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary/50" />
              <span className="text-xs text-brand-primary/60">AI is generating answer...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Tray at the bottom */}
      <div id="ai-input-tray" className="shrink-0 bg-white border-t border-brand-primary/10 p-4 pb-24">
        {/* Attachment preview */}
        {attachedImage && (
          <div className="mb-2 flex items-center justify-between bg-surface-bg border border-brand-primary/10 p-2 rounded-xl">
            <div className="flex items-center gap-2">
              <img
                src={attachedImage}
                alt="Upload preview"
                className="w-8 h-8 object-cover rounded-lg border border-brand-primary/10"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] text-brand-primary/60 font-mono">photo_upload.png</span>
            </div>
            <button
              onClick={removeAttachment}
              className="text-[9px] uppercase tracking-wider font-bold bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full transition"
            >
              Remove
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="relative flex items-center">
          <div className="w-full bg-surface-bg border border-brand-primary/10 rounded-full pl-4 pr-2 py-1.5 flex items-center gap-2 focus-within:border-brand-primary transition-colors">
            {/* Image attachment icon trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach File"
              className="p-1.5 hover:bg-brand-primary/5 rounded-full text-brand-primary/60 transition"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <input
              type="text"
              placeholder={`Ask ${selectedModel} or enter a prompt...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-brand-primary placeholder-brand-primary/40 focus:outline-none py-1 font-sans"
            />

            {/* Voice dictate microphone simulation */}
            <button
              type="button"
              onClick={handleMicToggle}
              title="Voice Input"
              className={`p-1.5 rounded-full transition shrink-0 ${
                micActive 
                  ? 'bg-neutral-950 text-white animate-pulse' 
                  : 'hover:bg-brand-primary/5 text-brand-primary/60'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !attachedImage)}
              className="p-2 rounded-full bg-brand-primary text-white hover:bg-brand-secondary transition disabled:opacity-40 shrink-0"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
        <span className="block text-[8px] uppercase tracking-widest text-center text-brand-primary/40 mt-2.5">
          {selectedModel} matches premium corporate design rules • SSL secure
        </span>
      </div>
    </div>
  );
}
