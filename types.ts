
export enum AppView {
  DASHBOARD = 'dashboard',
  EDUCATION = 'education',
  TOOLS = 'tools',
  SIGNALS = 'signals',
  COMMUNITY = 'community',
  LIVE_ROOM = 'live_room',
  ADMIN = 'admin'
}

export type Language = 'en' | 'th';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVip: boolean;
  role: 'user' | 'admin';
  provider: 'google' | 'line' | 'apple' | 'facebook' | 'email';
  balance: number;
}

export type AuthMode = 'login' | 'register' | 'forgot' | 'email_sent';

export interface TradeSignal {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  timestamp: string;
  status: 'ACTIVE' | 'HIT_TP' | 'HIT_SL' | 'CLOSED';
  aiAnalysis?: string;
  isVip: boolean;
  probability: number;
}

export interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  thumbnail: string;
  category: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
  avatar: string;
  isVip: boolean;
}

export interface AppDatabase {
  signals: TradeSignal[];
  posts: Post[];
  user: User | null;
  tickerMessages: string[];
  settings: {
    notifications: boolean;
    autoVip: boolean;
  };
}
