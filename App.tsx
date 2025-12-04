import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Settings, Sun, Moon, Calendar, Grid, Volume2, Check } from 'lucide-react';
import { Language, Transaction, Theme, Subscription, Trip, Category, SoundStyle } from './types';
import { LOCALIZATION, MOCK_INITIAL_DATA, SOUND_STYLES } from './constants';
import HomeView from './components/HomeView';
import StatsView from './components/StatsView';
import CalendarView from './components/CalendarView';
import ToolsView from './components/ToolsView';
import VoiceInput from './components/VoiceInput';
import { VisionButton, GlassPanel } from './components/VisionUI';
import { playSound, setSoundStyle } from './services/audioService';
import { motion, AnimatePresence } from 'framer-motion';

// Ensure Mock Data conforms to new Transaction Type
const INITIAL_DATA: Transaction[] = MOCK_INITIAL_DATA.map(d => ({
    ...d,
    type: (d as any).type || 'expense', 
    tripId: null,
    deletedAt: null
}));

const App: React.FC = () => {
  // Global State
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [theme, setTheme] = useState<Theme>('dark');
  const [soundStyle, setSoundStyleState] = useState<SoundStyle>('glass');
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'tools' | 'stats' | 'settings'>('home');
  
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Theme Management
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync Sound Style
  useEffect(() => {
    setSoundStyle(soundStyle);
  }, [soundStyle]);

  // Trash Auto-Purge (48h)
  useEffect(() => {
     const now = new Date().getTime();
     setTransactions(prev => prev.filter(t => {
         if (t.deletedAt) {
             const deletedTime = new Date(t.deletedAt).getTime();
             if (now - deletedTime > 48 * 60 * 60 * 1000) return false;
         }
         return true;
     }));
  }, []);

  // Recurring Payments Check
  useEffect(() => {
      subscriptions.forEach(sub => {
          const today = new Date().toISOString().split('T')[0];
          if (sub.nextPaymentDate.startsWith(today)) {
             const newTrans: Transaction = {
                 id: Date.now().toString() + Math.random(),
                 item: sub.name,
                 amount: sub.amount,
                 category: sub.category,
                 type: 'expense',
                 timestamp: new Date().toISOString(),
                 isRecurring: true
             };
             setTransactions(prev => [newTrans, ...prev]);
          }
      })
  }, [subscriptions]);

  const t = (key: string) => LOCALIZATION[key][language];

  const handleAddTransaction = (partial: Partial<Transaction>) => {
    if (partial.item && partial.amount && partial.type && partial.category) {
      const newTrans: Transaction = {
        id: Date.now().toString(),
        item: partial.item,
        amount: partial.amount,
        type: partial.type,
        category: partial.category,
        timestamp: partial.timestamp || new Date().toISOString(),
        tripId: activeTrip ? activeTrip.id : null
      };
      setTransactions(prev => [newTrans, ...prev]);
      setIsVoiceOpen(false);
    }
  };

  const handleSoftDelete = (id: string) => {
    setTransactions(prev => prev.map(t => 
        t.id === id ? { ...t, deletedAt: new Date().toISOString() } : t
    ));
    playSound('click');
  };

  const handleRestore = (id: string) => {
    setTransactions(prev => prev.map(t => 
        t.id === id ? { ...t, deletedAt: null } : t
    ));
    playSound('success');
  };

  const handleTabChange = (tab: any) => {
      playSound('click');
      setActiveTab(tab);
  }

  const handleSoundChange = (style: SoundStyle) => {
      setSoundStyle(style); 
      setSoundStyleState(style);
      if (style !== 'mute') {
          playSound('click');
      }
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-premium-bg dark:text-premium-text-primary transition-colors duration-500">
      
      {/* Phone Container Mockup - Adaptive Background */}
      <div className={`
          relative w-full max-w-[480px] h-full sm:h-[92vh] sm:rounded-[40px] overflow-hidden 
          shadow-premium border-[8px] border-[#222] sm:border-gray-200 dark:sm:border-white/10
          transition-colors duration-500
          bg-gray-50 dark:bg-premium-bg
          ${theme === 'dark' ? 'dark:bg-[radial-gradient(circle_at_50%_-20%,_#1c2333_0%,_#0D0F14_60%)]' : ''}
      `}>
        
        {/* Main Content Area */}
        <div className="h-full pb-[100px] overflow-hidden relative"> 
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                  {activeTab === 'home' && (
                    <HomeView 
                      transactions={transactions} 
                      language={language} 
                      onOpenVoice={() => setIsVoiceOpen(true)}
                      onDelete={handleSoftDelete}
                      activeTrip={activeTrip}
                    />
                  )}
                  {activeTab === 'calendar' && (
                     <CalendarView transactions={transactions} language={language} />
                  )}
                  {activeTab === 'stats' && (
                    <StatsView transactions={transactions.filter(t => !t.deletedAt)} language={language} />
                  )}
                  {activeTab === 'tools' && (
                    <ToolsView 
                        transactions={transactions} 
                        subscriptions={subscriptions}
                        trip={activeTrip}
                        language={language}
                        onRestore={handleRestore}
                        onAddSub={(s) => setSubscriptions(prev => [...prev, s])}
                        onSetTrip={setActiveTrip}
                    />
                  )}
                  
                  {activeTab === 'settings' && (
                     <div className="p-6 pt-12 h-full overflow-y-auto no-scrollbar">
                        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('tab_settings')}</h1>
                        <div className="space-y-4 pb-24">
                            {/* Theme */}
                            <GlassPanel className="overflow-hidden">
                                <div className="flex justify-between items-center p-4">
                                    <span className="text-[15px] font-medium text-gray-900 dark:text-white flex items-center gap-2 whitespace-nowrap">
                                        {theme === 'dark' ? <Moon size={18}/> : <Sun size={18}/>}
                                        {t('settings_theme')}
                                    </span>
                                    <div className="flex bg-gray-200 dark:bg-black/40 p-1 rounded-xl">
                                        <button onClick={() => { playSound('click'); setTheme('light'); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                                            <Sun size={12}/> {t('theme_light')}
                                        </button>
                                        <button onClick={() => { playSound('click'); setTheme('dark'); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${theme === 'dark' ? 'bg-premium-surface text-white shadow-sm' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                                            <Moon size={12}/> {t('theme_dark')}
                                        </button>
                                    </div>
                                </div>
                            </GlassPanel>

                            {/* Language */}
                            <GlassPanel className="overflow-hidden">
                                <div className="flex justify-between items-center p-4">
                                    <span className="text-[15px] font-medium text-gray-900 dark:text-white">{t('settings_language')}</span>
                                    <div className="flex bg-gray-200 dark:bg-black/40 p-1 rounded-xl">
                                        <button onClick={() => { playSound('click'); setLanguage('zh-TW'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${language === 'zh-TW' ? 'bg-white dark:bg-premium-surface text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>中文</button>
                                        <button onClick={() => { playSound('click'); setLanguage('en'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${language === 'en' ? 'bg-white dark:bg-premium-surface text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>EN</button>
                                    </div>
                                </div>
                            </GlassPanel>

                            {/* Sound Style Selector */}
                            <div className="space-y-3">
                                <h2 className="text-xs font-bold uppercase text-gray-500 dark:text-premium-text-secondary px-2 flex items-center gap-2">
                                     <Volume2 size={14}/> {t('settings_sound')}
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {(Object.keys(SOUND_STYLES) as SoundStyle[]).map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => handleSoundChange(style)}
                                            className={`
                                                relative w-full p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 group min-h-[80px] border
                                                ${soundStyle === style 
                                                    ? 'bg-blue-50 dark:bg-premium-blue/10 border-blue-500 dark:border-premium-blue shadow-glow-blue' 
                                                    : 'bg-white dark:bg-premium-card/40 border-gray-200 dark:border-premium-border hover:bg-gray-50 dark:hover:bg-premium-card'}
                                            `}
                                        >
                                            <span className={`text-xs font-medium ${soundStyle === style ? 'text-blue-600 dark:text-premium-blue' : 'text-gray-500 dark:text-premium-text-secondary group-hover:text-black dark:group-hover:text-white'}`}>
                                                {SOUND_STYLES[style][language]}
                                            </span>
                                            {soundStyle === style && (
                                                <div className="absolute top-2 right-2 text-blue-600 dark:text-premium-blue">
                                                    <Check size={12} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <GlassPanel className="overflow-hidden">
                                <button onClick={() => setTransactions([])} className="w-full text-left p-4 text-red-500 hover:bg-red-50 dark:hover:bg-premium-red/10 transition-colors font-medium text-[15px]">
                                {t('settings_reset')}
                                </button>
                            </GlassPanel>
                        </div>
                     </div>
                  )}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Floating Premium Tab Bar */}
        <div className="absolute bottom-8 left-6 right-6 z-50">
            <div className="flex justify-between items-center px-6 py-4 rounded-[32px] bg-white/80 dark:bg-[#161922]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-premium-hover">
                {['home', 'calendar', 'tools', 'stats', 'settings'].map((tab) => {
                    const isActive = activeTab === tab;
                    const Icon = tab === 'home' ? Home : tab === 'calendar' ? Calendar : tab === 'tools' ? Grid : tab === 'stats' ? BarChart2 : Settings;
                    return (
                        <button key={tab} onClick={() => handleTabChange(tab as any)} className={`relative p-2 transition-all ${isActive ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            {isActive && <motion.div layoutId="tab-glow" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />}
                        </button>
                    )
                })}
            </div>
        </div>

        <VoiceInput 
          isOpen={isVoiceOpen} 
          onClose={() => setIsVoiceOpen(false)}
          onSave={handleAddTransaction}
          language={language}
        />

      </div>
    </div>
  );
};

export default App;