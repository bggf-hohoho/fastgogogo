import React, { useState } from 'react';
import { Trash2, Repeat, Plane, ArrowLeft, Undo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToolsView = ({ transactions, subscriptions, trip, language, onRestore, onAddSub, onSetTrip }) => {
  const LOCALIZATION = (window as any).LOCALIZATION;
  const GlassPanel = (window as any).GlassPanel;
  const VisionButton = (window as any).VisionButton;
  const Category = (window as any).Category;

  const [activeTool, setActiveTool] = useState('menu');
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');

  const t = (key) => LOCALIZATION[key][language];

  const TrashList = () => {
    const deleted = transactions.filter(t => t.deletedAt);
    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Trash2 size={20}/> {t('tool_trash')}</h2>
            <p className="text-xs text-gray-500 mb-4">{t('trash_auto_delete')}</p>
            <div className="flex-1 overflow-y-auto space-y-3">
                {deleted.length === 0 ? <p className="text-gray-400 dark:text-gray-600 text-center mt-10">{t('trash_empty')}</p> : 
                 deleted.map(t => (
                    <GlassPanel key={t.id} className="p-3 flex justify-between items-center bg-red-50 !border-red-200 dark:!bg-red-900/10 dark:border-red-500/20">
                        <div>
                            <p className="text-gray-900 dark:text-white">{t.item}</p>
                            <p className="text-xs text-red-500 dark:text-red-300">Deleted: {new Date(t.deletedAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => onRestore(t.id)} className="p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-white dark:hover:bg-white/20 text-red-600 dark:text-white shadow-sm">
                            <Undo2 size={16} />
                        </button>
                    </GlassPanel>
                ))}
            </div>
        </div>
    );
  };

  const SubsList = () => {
      const handleAdd = () => {
          if(!newSubName || !newSubAmount) return;
          onAddSub({
              id: Date.now().toString(),
              name: newSubName,
              amount: parseFloat(newSubAmount),
              cycle: 'monthly',
              nextPaymentDate: new Date().toISOString(),
              category: Category.Essentials
          });
          setNewSubName(''); setNewSubAmount('');
      }
      return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Repeat size={20}/> {t('tool_subs')}</h2>
            
            <GlassPanel className="p-4 mb-4 bg-blue-50 !border-blue-200 dark:!bg-blue-900/10 dark:border-blue-500/20">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-300 mb-2">{t('sub_add')}</h3>
                <div className="flex gap-2">
                    <input value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="Netflix..." className="bg-white dark:bg-black/30 text-gray-900 dark:text-white px-3 py-2 rounded-lg w-full text-sm outline-none border border-gray-300 dark:border-white/10 focus:border-blue-500"/>
                    <input value={newSubAmount} onChange={e => setNewSubAmount(e.target.value)} placeholder="$..." className="bg-white dark:bg-black/30 text-gray-900 dark:text-white px-3 py-2 rounded-lg w-20 text-sm outline-none border border-gray-300 dark:border-white/10 focus:border-blue-500"/>
                    <button onClick={handleAdd} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"><PlusIcon/></button>
                </div>
            </GlassPanel>

            <div className="space-y-3">
                {subscriptions.map(s => (
                    <GlassPanel key={s.id} className="p-3 flex justify-between items-center">
                        <div>
                            <p className="text-gray-900 dark:text-white font-medium">{s.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('sub_cycle_monthly')} • ${s.amount}</p>
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">Active</div>
                    </GlassPanel>
                ))}
            </div>
        </div>
      );
  }

  const TravelMode = () => {
      return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Plane size={20}/> {t('tool_travel')}</h2>
            
            {trip ? (
                <GlassPanel className="p-6 text-center bg-indigo-50 !border-indigo-200 dark:!bg-indigo-900/20 dark:border-indigo-500/30">
                    <Plane size={48} className="text-indigo-500 dark:text-indigo-400 mx-auto mb-4"/>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{trip.name}</h3>
                    <p className="text-indigo-600 dark:text-indigo-300 text-sm mb-6">{t('travel_active')}</p>
                    <VisionButton onClick={() => onSetTrip(null)} variant="secondary" className="w-full">End Trip</VisionButton>
                </GlassPanel>
            ) : (
                <div className="space-y-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Start a trip to categorize expenses separately.</p>
                    <VisionButton onClick={() => onSetTrip({ id: 'trip1', name: 'Japan Trip', startDate: new Date().toISOString(), endDate: '', isActive: true })} className="w-full">
                        {t('travel_set')} (Demo: Japan)
                    </VisionButton>
                </div>
            )}
        </div>
      );
  }

  if (!GlassPanel) return null;

  return (
    <div className="h-full pt-12 px-4 pb-24">
      <AnimatePresence mode="wait">
        {activeTool === 'menu' ? (
           <motion.div 
             key="menu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
             className="grid grid-cols-1 gap-4"
           >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('tab_tools')}</h1>
              
              <button onClick={() => setActiveTool('subs')} className="group">
                  <GlassPanel className="p-6 flex items-center gap-4 hover:bg-blue-50 dark:hover:!bg-blue-500/10 transition-colors">
                      <div className="p-3 rounded-full bg-blue-100 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 group-hover:scale-110 transition-transform"><Repeat size={24}/></div>
                      <div className="text-left">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('tool_subs')}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Manage recurring payments</p>
                      </div>
                  </GlassPanel>
              </button>

              <button onClick={() => setActiveTool('travel')} className="group">
                  <GlassPanel className="p-6 flex items-center gap-4 hover:bg-indigo-50 dark:hover:!bg-indigo-500/10 transition-colors">
                      <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400 group-hover:scale-110 transition-transform"><Plane size={24}/></div>
                      <div className="text-left">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('tool_travel')}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{trip ? trip.name : 'Off'}</p>
                      </div>
                  </GlassPanel>
              </button>

              <button onClick={() => setActiveTool('trash')} className="group">
                  <GlassPanel className="p-6 flex items-center gap-4 hover:bg-red-50 dark:hover:!bg-red-500/10 transition-colors">
                      <div className="p-3 rounded-full bg-red-100 text-red-500 dark:bg-red-500/20 dark:text-red-400 group-hover:scale-110 transition-transform"><Trash2 size={24}/></div>
                      <div className="text-left">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('tool_trash')}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Restore deleted items</p>
                      </div>
                  </GlassPanel>
              </button>
           </motion.div>
        ) : (
           <motion.div 
             key="submenu" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
             className="h-full flex flex-col"
           >
              <button onClick={() => setActiveTool('menu')} className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4">
                  <ArrowLeft size={16} className="mr-1"/> Back
              </button>
              {activeTool === 'trash' && <TrashList />}
              {activeTool === 'subs' && <SubsList />}
              {activeTool === 'travel' && <TravelMode />}
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>;

(window as any).ToolsView = ToolsView;