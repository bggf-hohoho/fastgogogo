import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Check, Loader2, Keyboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceInput = ({ isOpen, onClose, onSave, language }) => {
  // Access globals lazily
  const LOCALIZATION = (window as any).LOCALIZATION;
  const CATEGORY_LABELS = (window as any).CATEGORY_LABELS;
  const Category = (window as any).Category;
  const parseExpenseVoiceInput = (window as any).parseExpenseVoiceInput;
  const playSound = (window as any).playSound;
  const GlassPanel = (window as any).GlassPanel;
  const VisionButton = (window as any).VisionButton;

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [inputMode, setInputMode] = useState('voice');
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const recognitionRef = useRef(null);
  const t = (key) => LOCALIZATION[key][language];
  const tCat = (cat) => CATEGORY_LABELS[cat][language];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'zh-TW' ? 'zh-TW' : 'en-US';
        
        recognition.onstart = () => {
            setIsListening(true);
            playSound('ripple');
        };
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          handleProcessText(text);
        };
        
        recognitionRef.current = recognition;
      } else {
         setInputMode('text');
      }
    }
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      playSound('open');
      setTranscript('');
      setParsedData(null);
      setAlternatives([]);
      setShowAllCategories(false);
      setIsProcessing(false);
      if (inputMode === 'voice' && recognitionRef.current) {
         try {
             recognitionRef.current.start();
         } catch(e) { }
      }
    } else {
        if(recognitionRef.current) recognitionRef.current.stop();
    }
  }, [isOpen, inputMode]);

  const handleProcessText = async (text) => {
    setIsProcessing(true);
    const result = await parseExpenseVoiceInput(text);
    setIsProcessing(false);
    if (result && result.transaction) {
      playSound('success');
      setParsedData(result.transaction);
      setAlternatives(result.alternatives || []);
    } else {
      playSound('error');
    }
  };

  const handleManualSubmit = (e) => {
      e.preventDefault();
      if(transcript.trim()) handleProcessText(transcript);
  }

  const handleCategoryChange = (cat) => {
      if (parsedData) {
          setParsedData({ ...parsedData, category: cat });
          playSound('click');
      }
  };

  if (!isOpen || !GlassPanel) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      >
        <GlassPanel className="w-full max-w-sm mx-4 p-8 relative overflow-visible border-white/20 shadow-2xl bg-white/90 dark:bg-premium-card/90">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:text-white/50 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="absolute top-4 left-4">
             <button onClick={() => setInputMode(prev => prev === 'voice' ? 'text' : 'voice')} className="text-blue-500 dark:text-blue-400 text-sm font-medium flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-300">
                {inputMode === 'voice' ? <Keyboard size={16}/> : <Mic size={16}/>}
                {inputMode === 'voice' ? 'Type' : 'Voice'}
             </button>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[300px] text-center mt-6">
            {!parsedData ? (
               <>
                 {isProcessing ? (
                   <div className="flex flex-col items-center">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      >
                         <Loader2 size={64} className="text-blue-500 mb-6" />
                      </motion.div>
                      <p className="text-xl font-medium text-gray-900 dark:text-white tracking-wide animate-pulse">{t('voice_processing')}</p>
                   </div>
                 ) : (
                   <>
                     {inputMode === 'voice' ? (
                         <>
                           <div className="relative mb-8">
                                <motion.div 
                                    animate={{ scale: isListening ? [1, 1.5, 1] : 1, opacity: isListening ? 0.4 : 0 }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-blue-500 rounded-full blur-xl"
                                />
                                <motion.div 
                                  animate={{ scale: isListening ? 1.1 : 1 }}
                                  className={`relative w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-glow border border-white/20`}
                                >
                                  <Mic size={40} className="text-white drop-shadow-md" />
                                </motion.div>
                           </div>
                           <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{isListening ? t('voice_listening') : 'Tap to speak'}</h3>
                           <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] leading-relaxed">{transcript || t('voice_hint')}</p>
                         </>
                     ) : (
                         <form onSubmit={handleManualSubmit} className="w-full">
                             <textarea 
                               autoFocus
                               className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-lg text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                               rows={3}
                               placeholder={t('voice_hint')}
                               value={transcript}
                               onChange={(e) => setTranscript(e.target.value)}
                             />
                             <VisionButton 
                               type="submit"
                               disabled={!transcript.trim()}
                               className="mt-6 w-full justify-center"
                             >
                               Analyze
                             </VisionButton>
                         </form>
                     )}
                   </>
                 )}
               </>
            ) : (
              <div className="w-full text-left">
                <div className="flex items-center gap-2 mb-4 justify-center">
                   <div className="bg-green-100 dark:bg-green-500/20 p-2 rounded-full border border-green-500/50"><Check size={20} className="text-green-600 dark:text-green-400"/></div>
                   <span className="text-lg font-bold text-green-600 dark:text-green-400 tracking-wide">AI Verified</span>
                </div>
                
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 mb-8 space-y-4 shadow-inner">
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Item</span>
                        <span className="font-semibold text-xl text-gray-900 dark:text-white">{parsedData.item}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Amount</span>
                        <span className="font-semibold text-xl text-gray-900 dark:text-white">${parsedData.amount}</span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Category</span>
                            <button 
                               onClick={() => setShowAllCategories(!showAllCategories)}
                               className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors"
                            >
                               {parsedData.category && tCat(parsedData.category)}
                               <ChevronDown size={14} className={`transition-transform ${showAllCategories ? 'rotate-180' : ''}`}/>
                            </button>
                        </div>
                        
                        {!showAllCategories && alternatives.length > 0 && (
                            <div className="flex justify-end gap-2 flex-wrap animate-in fade-in slide-in-from-top-1">
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 self-center uppercase tracking-wide">Or:</span>
                                {alternatives.filter(c => c !== parsedData.category).slice(0, 3).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className="px-2 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                                    >
                                        {tCat(cat)}
                                    </button>
                                ))}
                            </div>
                        )}

                        {showAllCategories && (
                            <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl max-h-48 overflow-y-auto no-scrollbar animate-in zoom-in-95 origin-top-right shadow-xl">
                                {Object.values(Category).map((cat: any) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            handleCategoryChange(cat);
                                            setShowAllCategories(false);
                                        }}
                                        className={`text-xs p-2 rounded-lg text-left transition-colors ${parsedData.category === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'}`}
                                    >
                                        {tCat(cat)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <VisionButton variant="secondary" onClick={() => { setParsedData(null); setTranscript(''); }}>
                      Retry
                    </VisionButton>
                    <VisionButton variant="primary" onClick={() => onSave(parsedData)}>
                      {t('button_save')}
                    </VisionButton>
                </div>
              </div>
            )}
          </div>
        </GlassPanel>
      </motion.div>
    </AnimatePresence>
  );
};

(window as any).VoiceInput = VoiceInput;