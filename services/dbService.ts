
import { AppDatabase, TradeSignal, Post, User } from '../types';
import { MOCK_SIGNALS } from '../constants';

const DB_KEY = 'gold_master_db';

const INITIAL_DB: AppDatabase = {
  signals: MOCK_SIGNALS.map(s => ({ ...s, probability: 85 })),
  posts: [
    {
      id: 'p1',
      author: "Alex Trades",
      isVip: true,
      avatar: "https://picsum.photos/seed/alex/100/100",
      content: "XAUUSD showing strong rejection at 2020. Watch for reversal.",
      timestamp: new Date().toISOString(),
      likes: 42
    }
  ],
  user: null,
  tickerMessages: [
    "HIGH VOLATILITY ALERT: US CPI IN 2H 15M",
    "XAUUSD HIT R1 (2042.80) - OVERBOUGHT SIGNALS"
  ],
  settings: {
    notifications: true,
    autoVip: false
  }
};

export const dbService = {
  init: (): AppDatabase => {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DB));
      return INITIAL_DB;
    }
    return JSON.parse(data);
  },

  save: (db: AppDatabase) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  },

  getSignals: (): TradeSignal[] => {
    const db = dbService.init();
    return db.signals;
  },

  addSignal: (signal: TradeSignal) => {
    const db = dbService.init();
    db.signals = [signal, ...db.signals].slice(0, 50);
    dbService.save(db);
  },

  deleteSignal: (id: string) => {
    const db = dbService.init();
    db.signals = db.signals.filter(s => s.id !== id);
    dbService.save(db);
  },

  getTickerMessages: (): string[] => {
    const db = dbService.init();
    return db.tickerMessages;
  },

  updateTickerMessages: (messages: string[]) => {
    const db = dbService.init();
    db.tickerMessages = messages;
    dbService.save(db);
  },

  getPosts: (): Post[] => {
    const db = dbService.init();
    return db.posts;
  },

  addPost: (post: Post) => {
    const db = dbService.init();
    db.posts = [post, ...db.posts];
    dbService.save(db);
  },

  updateUser: (user: User | null) => {
    const db = dbService.init();
    db.user = user;
    dbService.save(db);
  }
};
