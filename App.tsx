import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Settings, Sun, Moon, Calendar, Grid, Volume2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  // Access globals inside component to ensure scripts are loaded
  const LOCALIZATION = (window as any).LOCALIZATION;
  const MOCK_INITIAL_DATA = (window as any).MOCK_INITIAL_DATA;
  const SOUND_STYLES = (window as any).SOUND_STYLES;
  const HomeView = (window as any).HomeView;
  const StatsView = (window as any).StatsView;
  const CalendarView = (window as any).CalendarView;
  const ToolsView = (window as any).ToolsView;
  const VoiceInput = (window as any).VoiceInput;
  const GlassPanel = (window as any).GlassPanel;
  const playSound = (window as any).playSound;
  const setSoundStyle = (window as any).setSoundStyle;

  const [language, setLanguage] = useState('zh-TW');
  const [theme, setTheme] = useState('dark');
  const [soundStyle, setSoundStyleState] = useState('glass');
  const [activeTab, setActiveTab] = useState('home');
  
  const [transactions, setTransactions] = useState(() => {
     // Lazy initialization of data
     if (!MOCK_INITIAL_DATA) return [];
     return MOCK_INITIAL_DATA.map(d => ({
        ...d,
        type: d.type || 'expense', 
        tripId: null,
        deletedAt: null
     }));
  });
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if(setSoundStyle) setSoundStyle(soundStyle);
  }, [soundStyle, setSoundStyle]);

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

  useEffect(() => {
      subscriptions.forEach(sub => {
          const today = new Date().toISOString().split('T')[0];
          if (sub.nextPaymentDate.startsWith(today)) {
             const newTrans = {
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

  // Guard against missing localization
  if (!LOCALIZATION) return <div className="flex h-screen items-center justify-center text-white">Loading Resources...</div>;
  const t = (key) => LOCALIZATION[key][language];

  const handleAddTransaction = (partial) => {
    if (partial.item && partial.amount && partial.type && partial.category) {
      const newTrans = {
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

  const handleSoftDelete = (id) => {
    setTransactions(prev => prev.map(t => 
        t.id === id ? { ...t, deletedAt: new Date().toISOString() } : t
    ));
    playSound('click');
  };

  const handleRestore = (id) => {
    setTransactions(prev => prev.map(t => 
        t.id === id ? { ...t, deletedAt: null } : t
    ));
    playSound('success');
  };

  const handleTabChange = (tab) => {
      playSound('click');
      setActiveTab(tab);
  }

  const handleSoundChange = (style) => {
      setSoundStyle(style); 
      setSoundStyleState(style);
      if (style !== 'mute') {
          playSound('click');
      }
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-premium-bg dark:text-premium-text-primary transition-colors duration-500">
      <div className={`
          relative w-full max-w-[480px] h-full sm:h-[92vh] sm:rounded-[40px] overflow-hidden 
          shadow-premium border-[8px] border-[#222] sm:border-gray-200 dark:sm:border-white/10
          transition-colors duration-500
          bg-gray-50 dark:bg-premium-bg
          ${theme === 'dark' ? 'dark:bg-[radial-gradient(circle_at_50%_-20%,_#1c2333_0%,_#0D0F14_60%)]' : ''}
      `}>
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
                  {activeTab === 'home' && HomeView && (
                    <HomeView 
                      transactions={transactions} 
                      language={language} 
                      onOpenVoice={() => setIsVoiceOpen(true)}
                      onDelete={handleSoftDelete}
                      activeTrip={activeTrip}
                    />
                  )}
                  {activeTab === 'calendar' && CalendarView && (
                     <CalendarView transactions={transactions} language={language} />
                  )}
                  {activeTab === 'stats' && StatsView && (
                    <StatsView transactions={transactions.filter(t => !t.deletedAt)} language={language} />
                  )}
                  {activeTab === 'tools' && ToolsView && (
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
                  
                  {activeTab === 'settings' && GlassPanel && (
                     <div className="p-6 pt-12 h-full overflow-y-auto no-scrollbar">
                        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('tab_settings')}</h1>
                        <div className="space-y-4 pb-24">
                            <GlassPanel className="overflow-hidden">
                                <div className="flex justify-between items-center p-4">
                                    <span className="text-[15px] font-medium text-gray-900 dark:text-white flex items-center gap-2 whitespace-nowrap">
                                        {Moon ? (theme === 'dark' ? <Moon size={18}/> : <Sun size={18}/>) : null}
                                        {t('settings_theme')}
                                    </span>
                                    <div className="flex bg-gray-200 dark:bg-black/40 p-1 rounded-xl">
                                        <button onClick={() => { playSound('click'); setTheme('light'); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                                            {Sun && <Sun size={12}/>} {t('theme_light')}
                                        </button>
                                        <button onClick={() => { playSound('click'); setTheme('dark'); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${theme === 'dark' ? 'bg-premium-surface text-white shadow-sm' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                                            {Moon && <Moon size={12}/>} {t('theme_dark')}
                                        </button>
                                    </div>
                                </div>
                            </GlassPanel>

                            <GlassPanel className="overflow-hidden">
                                <div className="flex justify-between items-center p-4">
                                    <span className="text-[15px] font-medium text-gray-900 dark:text-white">{t('settings_language')}</span>
                                    <div className="flex bg-gray-200 dark:bg-black/40 p-1 rounded-xl">
                                        <button onClick={() => { playSound('click'); setLanguage('zh-TW'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${language === 'zh-TW' ? 'bg-white dark:bg-premium-surface text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>中文</button>
                                        <button onClick={() => { playSound('click'); setLanguage('en'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${language === 'en' ? 'bg-white dark:bg-premium-surface text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>EN</button>
                                    </div>
                                </div>
                            </GlassPanel>

                            <div className="space-y-4 mt-2">
                                <h2 className="text-base font-bold text-gray-900 dark:text-white px-1 flex items-center gap-2">
                                     {Volume2 && <Volume2 size={18} className="text-blue-500"/>} {t('settings_sound')}
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {SOUND_STYLES && Object.keys(SOUND_STYLES).map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => handleSoundChange(style)}
                                            className={`
                                                relative w-full py-4 px-2 rounded-2xl flex items-center justify-center text-center transition-all duration-200 border
                                                ${soundStyle === style 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                                                    : 'bg-white dark:bg-premium-card/40 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}
                                            `}
                                        >
                                            <span className="text-sm font-semibold tracking-wide">
                                                {SOUND_STYLES[style][language]}
                                            </span>
                                            {soundStyle === style && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
                                                        {Check && <Check size={10} strokeWidth={4} className="text-white" />}
                                                    </div>
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

        <div className="absolute bottom-8 left-6 right-6 z-50">
            <div className="flex justify-between items-center px-6 py-4 rounded-[32px] bg-white/80 dark:bg-[#161922]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-premium-hover">
                {['home', 'calendar', 'tools', 'stats', 'settings'].map((tab) => {
                    const isActive = activeTab === tab;
                    const Icon = tab === 'home' ? Home : tab === 'calendar' ? Calendar : tab === 'tools' ? Grid : tab === 'stats' ? BarChart2 : Settings;
                    // Guard against undefined Icon component from lazy import issues
                    if (!Icon) return null;
                    return (
                        <button key={tab} onClick={() => handleTabChange(tab)} className={`relative p-2 transition-all ${isActive ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            {isActive && <motion.div layoutId="tab-glow" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />}
                        </button>
                    )
                })}
            </div>
        </div>

        {VoiceInput && (
            <VoiceInput 
            isOpen={isVoiceOpen} 
            onClose={() => setIsVoiceOpen(false)}
            onSave={handleAddTransaction}
            language={language}
            />
        )}

      </div>
    </div>
  );
};

(window as any).App = App;