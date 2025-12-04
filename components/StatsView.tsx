import React, { useMemo, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Sparkles, RefreshCcw, ArrowDown, ArrowUp, Maximize2, X, BarChart2, PieChart as PieIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#2F8CFF', '#3ED27A', '#F8D37A', '#FF453A', '#BF5AF2', '#5E5CE6', '#FF375F', '#AC8E68', '#7F8C8D', '#1ABC9C', '#34495E', '#D35400'];

const StatsView = ({ transactions, language }) => {
  const LOCALIZATION = (window as any).LOCALIZATION;
  const CATEGORY_LABELS = (window as any).CATEGORY_LABELS;
  const generateSpendingInsight = (window as any).generateSpendingInsight;
  const GlassPanel = (window as any).GlassPanel;
  const playSound = (window as any).playSound;

  const t = (key) => LOCALIZATION[key][language];
  
  const tCat = (cat) => {
    const labels = CATEGORY_LABELS[cat];
    return labels ? labels[language] : String(cat);
  };

  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showFullInsight, setShowFullInsight] = useState(false);
  const [showFullCategories, setShowFullCategories] = useState(false);
  const [showFullWeekly, setShowFullWeekly] = useState(false);

  const expenses = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  useEffect(() => {
    if (transactions.length > 0 && !aiSummary) {
        handleGenerateSummary(null);
    }
  }, [transactions.length]);

  const handleGenerateSummary = async (e) => {
    if (e) e.stopPropagation(); 
    if (loadingSummary) return;
    
    playSound('click');
    setLoadingSummary(true);
    try {
        const summary = await generateSpendingInsight(transactions);
        if (summary) {
            setAiSummary(summary);
            playSound('success');
        }
    } catch (e) {
        console.error("Failed to generate stats", e);
    } finally {
        setLoadingSummary(false);
    }
  }

  const categoryData = useMemo(() => {
    const totals = {};
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.keys(totals)
      .map(cat => ({ 
        name: tCat(cat), 
        value: totals[cat], 
        key: cat,
        percentage: totalExpense > 0 ? (totals[cat] / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, language, totalExpense]);

  const topCategory = categoryData.length > 0 ? categoryData[0] : null;

  const weeklyData = useMemo(() => {
      const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const data = new Array(7).fill(0).map((_, i) => ({ day: days[i], amount: 0 }));
      expenses.forEach(e => {
          const d = new Date(e.timestamp);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - d.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          if(diffDays <= 7) {
             data[d.getDay()].amount += e.amount;
          }
      });
      return data;
  }, [expenses]);

  const weeklyTotal = weeklyData.reduce((acc, curr) => acc + curr.amount, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-[#1D212C]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-2 rounded-lg shadow-xl z-50">
          <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold">{label || payload[0].name}</p>
          <p className="text-gray-900 dark:text-white text-sm font-bold">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!GlassPanel) return null;

  return (
    <>
      <div className="flex flex-col h-full pt-12 px-5 pb-24 overflow-y-auto no-scrollbar">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 px-1">
            {t('tab_stats')}
        </h1>

        <motion.div whileHover={{ scale: 0.99 }} whileTap={{ scale: 0.98 }}>
            <GlassPanel 
                onClick={() => { playSound('open'); setShowFullInsight(true); }}
                className="p-0 mb-4 relative group overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-blue-900/10 dark:via-[#161922] dark:to-purple-900/10 !border-blue-100 dark:!border-white/10 cursor-pointer"
            >
                <div className="relative p-4 z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <h3 className="font-semibold text-xs text-blue-600 dark:text-blue-300 tracking-wide uppercase">{t('stats_insight_title')}</h3>
                        <div className="ml-auto flex items-center gap-3">
                            <button 
                                onClick={handleGenerateSummary} 
                                disabled={loadingSummary}
                                className={`text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${loadingSummary ? 'animate-spin' : ''}`}
                            >
                                <RefreshCcw size={12}/>
                            </button>
                            <Maximize2 size={12} className="text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>
                    <motion.div 
                        key={aiSummary ? 'loaded' : 'loading'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-[40px]" 
                    >
                        {loadingSummary ? (
                            <span className="flex items-center gap-2 text-[13px] text-blue-500 dark:text-blue-300 animate-pulse">
                            AI Analyzing your finances...
                            </span>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 text-[13px] leading-relaxed line-clamp-2">
                                {aiSummary ? aiSummary[language] : (language === 'zh-TW' ? "持續記帳以獲得 AI 財務分析。" : "Keep tracking to unlock insights.")}
                            </p>
                        )}
                    </motion.div>
                </div>
            </GlassPanel>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-4">
            <GlassPanel className="p-4 flex flex-col justify-between items-start bg-green-50/50 dark:bg-green-900/5 !border-green-100 dark:!border-green-500/10">
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="p-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                        <ArrowUp size={12} />
                    </div>
                    <span className="text-[11px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">{t('type_income')}</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    ${totalIncome.toLocaleString()}
                </span>
            </GlassPanel>

            <GlassPanel className="p-4 flex flex-col justify-between items-start bg-red-50/50 dark:bg-red-900/5 !border-red-100 dark:!border-red-500/10">
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="p-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                        <ArrowDown size={12} />
                    </div>
                    <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">{t('type_expense')}</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    ${totalExpense.toLocaleString()}
                </span>
            </GlassPanel>
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
            <GlassPanel 
                onClick={() => { playSound('open'); setShowFullWeekly(true); }}
                className="p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group"
                delay={0.1}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <BarChart2 size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('stats_weekly')}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Last 7 Days</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">${weeklyTotal.toLocaleString()}</span>
                    <div className="p-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        <Maximize2 size={14} />
                    </div>
                </div>
            </GlassPanel>
        </motion.div>

        <motion.div whileTap={{ scale: 0.98 }}>
            <GlassPanel 
                onClick={() => { playSound('open'); setShowFullCategories(true); }}
                className="p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group"
                delay={0.2}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                        <PieIcon size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('stats_categories')}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {topCategory ? `Top: ${topCategory.name}` : t('stats_no_data')}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     {topCategory && <span className="text-sm font-bold text-gray-900 dark:text-white">${topCategory.value.toLocaleString()}</span>}
                     <div className="p-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        <Maximize2 size={14} />
                    </div>
                </div>
            </GlassPanel>
        </motion.div>
      </div>

      <AnimatePresence>
        {showFullInsight && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setShowFullInsight(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm bg-white dark:bg-[#1D212C] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
                >
                    <div className="p-5 pb-2 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('stats_insight_title')}</h2>
                        </div>
                        <button onClick={() => setShowFullInsight(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"><X size={20} /></button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {loadingSummary ? (
                             <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                <RefreshCcw className="animate-spin text-blue-500" size={32} />
                                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Analyzing financial patterns...</p>
                             </div>
                        ) : (
                            <p className="text-[16px] leading-7 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{aiSummary ? aiSummary[language] : "No data available."}</p>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                         <button onClick={(e) => handleGenerateSummary(e)} disabled={loadingSummary} className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${loadingSummary ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-white/5' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'}`}>
                            <RefreshCcw size={16} className={loadingSummary ? 'animate-spin' : ''} />
                            {loadingSummary ? 'Processing...' : (language === 'zh-TW' ? '重新分析' : 'Regenerate Analysis')}
                         </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
};

(window as any).StatsView = StatsView;