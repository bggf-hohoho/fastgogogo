import React, { useMemo, useState } from 'react';
import { Transaction, Language } from '../types';
import { LOCALIZATION, CATEGORY_ICONS } from '../constants';
import { GlassPanel, TiltCard } from './VisionUI';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  transactions: Transaction[];
  language: Language;
}

const CalendarView: React.FC<CalendarViewProps> = ({ transactions, language }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const t = (key: string) => LOCALIZATION[key][language];

  // Helper to get days in month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Pad start
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    // Days
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));

    return days;
  }, [currentDate]);

  const getDailyData = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayTrans = transactions.filter(t => t.timestamp.startsWith(dateStr) && !t.deletedAt);
    const expense = dayTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const income = dayTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    return { expense, income, transactions: dayTrans };
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + delta)));
  };

  const selectedData = useMemo(() => getDailyData(selectedDate), [selectedDate, transactions]);

  return (
    <div className="h-full pt-12 px-4 flex flex-col pb-24 overflow-y-auto no-scrollbar">
       {/* Header */}
       <div className="flex justify-between items-center mb-6 px-2">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {currentDate.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-TW', { year: 'numeric', month: 'long' })}
            </h1>
            <p className="text-xs text-gray-500 font-medium">Select a day to view details</p>
         </div>
         <div className="flex gap-1 bg-gray-200 dark:bg-white/5 rounded-full p-1 border border-white/20 dark:border-white/10">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-full text-gray-600 dark:text-white dark:hover:bg-white/10 transition-colors"><ChevronLeft size={18}/></button>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-full text-gray-600 dark:text-white dark:hover:bg-white/10 transition-colors"><ChevronRight size={18}/></button>
         </div>
       </div>

       {/* Calendar Grid */}
       <GlassPanel className="p-4 !bg-white dark:!bg-[#161922] mb-6 shadow-sm dark:shadow-premium">
         <div className="grid grid-cols-7 gap-y-2 gap-x-1">
            {['S','M','T','W','T','F','S'].map((d,i) => (
                <div key={i} className="text-center text-[10px] text-gray-400 dark:text-gray-500 font-bold mb-2">{d}</div>
            ))}
            
            {calendarDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                
                const { expense, income, transactions } = getDailyData(day);
                const hasActivity = transactions.length > 0;
                const isSelected = day.toDateString() === selectedDate.toDateString();
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                    <motion.button 
                        key={day.toISOString()}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedDate(day)}
                        className={`
                            aspect-square rounded-xl flex flex-col items-center justify-center relative
                            transition-all duration-300
                            ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-gray-100 dark:hover:bg-white/5'}
                            ${!isSelected && isToday ? 'border border-blue-500/50 text-blue-500 dark:text-blue-400' : ''}
                            ${!isSelected && !isToday ? 'text-gray-700 dark:text-gray-300' : ''}
                        `}
                    >
                        <span className="text-xs font-semibold z-10">{day.getDate()}</span>
                        
                        {/* Status Dots */}
                        <div className="flex gap-0.5 mt-1 h-1">
                             {expense > 0 && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-red-500'}`} />}
                             {income > 0 && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-green-500'}`} />}
                        </div>
                    </motion.button>
                );
            })}
         </div>
       </GlassPanel>

       {/* Selected Day Details */}
       <AnimatePresence mode="wait">
            <motion.div
                key={selectedDate.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-3"
            >
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-gray-900 dark:text-white font-bold">{selectedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-TW', { weekday: 'short', month: 'short', day: 'numeric'})}</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedData.transactions.length > 0 ? (
                           <span>
                               {selectedData.expense > 0 && <span className="text-red-500 dark:text-red-400 mr-2">-${selectedData.expense}</span>}
                               {selectedData.income > 0 && <span className="text-green-500 dark:text-green-400">+${selectedData.income}</span>}
                           </span>
                        ) : 'No entries'}
                    </div>
                </div>

                {selectedData.transactions.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-gray-300 dark:border-white/5 rounded-2xl">
                        <p className="text-gray-500 dark:text-gray-600 text-sm">Nothing recorded this day</p>
                    </div>
                ) : (
                    selectedData.transactions.map(t => (
                        <div key={t.id} className="bg-white dark:bg-white/5 p-3 rounded-xl flex items-center justify-between border border-gray-200 dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="text-lg">{CATEGORY_ICONS[t.category]}</div>
                                <div>
                                    <p className="text-sm text-gray-900 dark:text-white font-medium">{t.item}</p>
                                    <p className="text-[10px] text-gray-500">{new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                            </div>
                            <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {t.type === 'income' ? '+' : '-'}{Math.abs(t.amount)}
                            </span>
                        </div>
                    ))
                )}
            </motion.div>
       </AnimatePresence>
    </div>
  );
};

export default CalendarView;