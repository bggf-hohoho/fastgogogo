import React, { useMemo, useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Plane, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HomeView = ({ transactions, language, onOpenVoice, onDelete, activeTrip }) => {
  const LOCALIZATION = (window as any).LOCALIZATION;
  const CATEGORY_LABELS = (window as any).CATEGORY_LABELS;
  const CATEGORY_COLORS = (window as any).CATEGORY_COLORS;
  const CATEGORY_ICONS = (window as any).CATEGORY_ICONS;
  const GlassPanel = (window as any).GlassPanel;
  const TiltCard = (window as any).TiltCard;

  const [filterType, setFilterType] = useState('all');
  
  const t = (key) => LOCALIZATION[key][language];
  const tCat = (cat) => CATEGORY_LABELS[cat][language];

  const visibleTransactions = useMemo(() => {
    return transactions
      .filter(t => !t.deletedAt)
      .filter(t => filterType === 'all' || t.type === filterType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions, filterType]);

  const { income, expense, balance } = useMemo(() => {
    const validTrans = transactions.filter(t => !t.deletedAt); 
    const income = validTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = validTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const grouped = useMemo(() => {
    const groups = {};
    visibleTransactions.forEach(e => {
      const dateKey = e.timestamp.split('T')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(e);
    });
    return groups;
  }, [visibleTransactions]);

  const formatTime = (iso) => new Date(iso).toLocaleTimeString(language === 'zh-TW' ? 'zh-TW' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  const formatDateHeader = (iso) => {
      const d = new Date(iso);
      const today = new Date().toISOString().split('T')[0];
      if (iso === today) return language === 'zh-TW' ? '今天' : 'Today';
      return d.toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  if (!TiltCard) return null; // Wait for load

  return (
    <div className="flex flex-col h-full relative px-5 pt-8">
      <AnimatePresence>
      {activeTrip && (
        <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className="absolute top-2 left-0 right-0 flex justify-center z-30"
        >
            <div className="bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center gap-2 shadow-glow-blue">
                <Plane size={12} /> {activeTrip.name}
            </div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="mb-8 relative z-20">
         <TiltCard>
            <div className={`
                relative overflow-hidden rounded-[32px] p-6 border shadow-premium transition-colors duration-500
                bg-white border-gray-100 text-gray-900
                dark:bg-[#161922] dark:border-white/10 dark:text-white
            `}>
                 <div className="absolute inset-0 bg-[#161922] z-0 opacity-0 dark:opacity-100 transition-opacity duration-500" />
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/30 rounded-full blur-[50px] z-0 opacity-0 dark:opacity-100 transition-opacity duration-500" />
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] z-0 opacity-0 dark:opacity-100 transition-opacity duration-500" />
                 
                 <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 z-0 opacity-100 dark:opacity-0 transition-opacity duration-500" />

                 <div className="relative z-10">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                             <div className="p-1.5 rounded-lg backdrop-blur-sm bg-black/5 dark:bg-white/10">
                                <CreditCard size={14} className="text-gray-600 dark:text-white/80" />
                             </div>
                             <span className="text-gray-500 dark:text-white/60 text-xs font-medium tracking-wide uppercase">{t('home_today')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border bg-black/5 border-black/5 dark:bg-black/20 dark:border-white/5">
                            <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse" />
                            <span className="text-[10px] text-gray-500 dark:text-white/50 font-medium">{t('status_active')}</span>
                        </div>
                     </div>
                     
                     <div className="flex items-baseline gap-1 mb-8">
                         <span className="text-3xl font-medium text-gray-400 dark:text-white/60">$</span>
                         <motion.span 
                            key={balance}
                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-sm"
                         >
                            {Math.abs(balance).toLocaleString()}
                         </motion.span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3">
                         <div className="rounded-2xl p-3 flex items-center gap-3 border backdrop-blur-sm bg-gray-50 border-gray-200 dark:bg-black/20 dark:border-white/5">
                            <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-premium-green/20 dark:text-premium-green shadow-inner">
                                <ArrowUpRight size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 dark:text-white/40 uppercase font-bold tracking-wider">{t('hero_income')}</p>
                                <p className="text-gray-900 dark:text-white font-semibold text-sm">+${income.toLocaleString()}</p>
                            </div>
                         </div>
                         <div className="rounded-2xl p-3 flex items-center gap-3 border backdrop-blur-sm bg-gray-50 border-gray-200 dark:bg-black/20 dark:border-white/5">
                            <div className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-premium-red/20 dark:text-premium-red shadow-inner">
                                <ArrowDownRight size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 dark:text-white/40 uppercase font-bold tracking-wider">{t('hero_expense')}</p>
                                <p className="text-gray-900 dark:text-white font-semibold text-sm">-${expense.toLocaleString()}</p>
                            </div>
                         </div>
                     </div>
                 </div>
            </div>
         </TiltCard>
      </div>

      <div className="flex justify-center mb-6">
          <div className="flex p-1 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
             {['all', 'expense', 'income'].map((f) => (
                 <button
                    key={f} 
                    onClick={() => setFilterType(f)}
                    className={`
                        px-6 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                        ${filterType === f 
                            ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}
                    `}
                 >
                    {f === 'all' ? (language === 'zh-TW' ? '全部' : 'All') : 
                     f === 'expense' ? (language === 'zh-TW' ? '支出' : 'Exp') : 
                     (language === 'zh-TW' ? '收入' : 'Inc')}
                 </button>
             ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 no-scrollbar -mx-5 px-5 mask-gradient-b">
        <AnimatePresence>
            {Object.keys(grouped).map((dateKey) => (
            <motion.div 
                key={dateKey} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3 mb-3 px-1">
                    <h3 className="text-gray-900 dark:text-white text-sm font-bold tracking-wide">
                      {formatDateHeader(dateKey)}
                    </h3>
                    <div className="h-[1px] flex-1 bg-gray-200 dark:bg-white/5"></div>
                    <span className="text-[10px] text-gray-500 font-mono">
                        {grouped[dateKey].length} {t('label_items')}
                    </span>
                </div>
                
                <div className="space-y-3">
                {grouped[dateKey].map((t) => (
                    <motion.div 
                        key={t.id}
                        initial={{ opacity: 0, scale: 0.98 }} 
                        whileTap={{ scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative"
                    >
                        <div className={`
                            relative z-10 p-3 pr-4 rounded-2xl flex items-center justify-between border transition-all duration-300
                            bg-white border-gray-100 hover:border-gray-200 shadow-sm
                            dark:bg-[#1D212C]/60 dark:border-white/5 dark:hover:bg-[#1D212C] dark:hover:border-white/10 dark:backdrop-blur-md
                        `}>
                            <div className="flex items-center gap-4">
                                <div className={`
                                    w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-lg bg-gradient-to-br
                                    ${CATEGORY_COLORS[t.category] || 'bg-gray-500'} bg-opacity-100 text-white
                                `} style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }}>
                                    {CATEGORY_ICONS[t.category] || '📄'}
                                </div>
                                
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[15px] font-medium text-gray-900 dark:text-white tracking-tight leading-none">{t.item}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{tCat(t.category)}</span>
                                        <span className="w-0.5 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                                        <span className="text-[11px] text-gray-400 dark:text-gray-500">{formatTime(t.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <span className={`text-[15px] font-bold tabular-nums tracking-tight ${t.type === 'income' ? 'text-green-600 dark:text-premium-gold dark:drop-shadow-gold' : 'text-gray-900 dark:text-white'}`}>
                                {t.type === 'income' ? '+' : '-'}{Math.abs(t.amount).toLocaleString()}
                            </span>
                        </div>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20 scale-90 hover:scale-100 shadow-lg backdrop-blur-md"
                        >
                            <Trash2 size={16} />
                        </button>
                    </motion.div>
                ))}
                </div>
            </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <motion.button 
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(47, 140, 255, 0.6)" }} 
        whileTap={{ scale: 0.95 }}
        onClick={onOpenVoice}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white z-30 shadow-[0_0_15px_rgba(47,140,255,0.4)] border border-white/20"
        style={{
            background: 'linear-gradient(135deg, #2F8CFF 0%, #0066FF 100%)'
        }}
      >
        <Plus size={24} strokeWidth={3} />
      </motion.button>
    </div>
  );
};

(window as any).HomeView = HomeView;