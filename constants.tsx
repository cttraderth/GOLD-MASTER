
import React from 'react';
import { LayoutDashboard, BookOpen, Tool, Bell, Users, TrendingUp, ShieldCheck, Zap, MonitorPlay } from 'lucide-react';
import { AppView, Course, TradeSignal, Language } from './types';
import { translations } from './translations';

export const getNavigationItems = (lang: Language) => [
  { id: AppView.DASHBOARD, label: translations[lang].nav.dashboard, icon: <LayoutDashboard size={20} /> },
  { id: AppView.SIGNALS, label: translations[lang].nav.signals, icon: <Bell size={20} /> },
  { id: AppView.LIVE_ROOM, label: translations[lang].nav.live_room, icon: <MonitorPlay size={20} /> },
  { id: AppView.EDUCATION, label: translations[lang].nav.education, icon: <BookOpen size={20} /> },
  { id: AppView.TOOLS, label: translations[lang].nav.tools, icon: <Zap size={20} /> },
  { id: AppView.COMMUNITY, label: translations[lang].nav.community, icon: <Users size={20} /> },
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Gold Trading Fundamentals',
    level: 'Beginner',
    duration: '2.5 hrs',
    thumbnail: 'https://images.unsplash.com/photo-1589750670744-dc963161a917?auto=format&fit=crop&q=80&w=400',
    category: 'Basics'
  },
  {
    id: '2',
    title: 'Advanced XAUUSD Price Action',
    level: 'Advanced',
    duration: '4 hrs',
    thumbnail: 'https://images.unsplash.com/photo-1611974717482-58a2522e5686?auto=format&fit=crop&q=80&w=400',
    category: 'Technical'
  },
  {
    id: '3',
    title: 'Risk Management for 1:2 RR',
    level: 'Intermediate',
    duration: '1.5 hrs',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
    category: 'Strategy'
  }
];

export const MOCK_SIGNALS: TradeSignal[] = [
  {
    id: 's1',
    pair: 'XAUUSD',
    type: 'BUY',
    entry: 2024.50,
    sl: 2018.00,
    tp1: 2035.00,
    tp2: 2045.00,
    timestamp: new Date().toISOString(),
    status: 'ACTIVE',
    aiAnalysis: 'Bullish divergence observed on H1. Strong support at 2020 handled well.',
    isVip: false,
    // Fix: Added probability to match TradeSignal interface
    probability: 88
  },
  {
    id: 's2',
    pair: 'XAUUSD',
    type: 'SELL',
    entry: 2055.20,
    sl: 2062.00,
    tp1: 2040.00,
    tp2: 2025.00,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'ACTIVE',
    aiAnalysis: 'Double top rejection at psychological resistance. Profit target 1 hit.',
    isVip: true,
    // Fix: Added probability to match TradeSignal interface
    probability: 92
  }
];
