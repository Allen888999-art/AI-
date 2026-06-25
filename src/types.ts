export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isDeepThinking?: boolean;
}

export interface Assistant {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemInstruction?: string;
  isCustom?: boolean;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  screenshotUrl?: string;
  content?: string;
  isIncognito?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  imageUrl: string;
  description: string;
  content: string;
  category: 'for-you' | 'tech' | 'design';
}

export interface Bookmark {
  id: string;
  name: string;
  url: string;
  icon: string;
  color?: string;
}
