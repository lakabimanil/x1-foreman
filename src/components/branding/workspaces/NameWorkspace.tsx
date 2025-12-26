'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Lock, 
  RefreshCw, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Share2, 
  ChevronRight,
  Search,
  ArrowRight,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';
import { AppNameOption } from '@/types/branding';

export default function NameWorkspace() {
  const { 
    artifacts, 
    selectName, 
    lockName, 
    generateMoreNames, 
    addCustomName,
    isGenerating 
  } = useBrandingStore();
  
  const { options, lockedName } = artifacts.name;
  const [customNameInput, setCustomNameInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  
  // Find the currently selected option to show in the Hero section
  const selectedOption = options.find(o => o.selected);

  // Auto-select the first option if none selected (and not locked) on mount
  useEffect(() => {
    if (options.length > 0 && !selectedOption && !lockedName) {
      selectName(options[0].id);
    }
  }, [options, selectedOption, lockedName, selectName]);

  const handleAddCustomName = (e: React.FormEvent) => {
    e.preventDefault();
    if (customNameInput.trim()) {
      addCustomName(customNameInput.trim());
      setCustomNameInput('');
      setShowInput(false);
    }
  };

  // Group options by their primary vibe for the discovery section
  const groupedOptions = options.reduce((acc, option) => {
    const primaryVibe = option.vibeTags[0] || 'Other';
    if (!acc[primaryVibe]) acc[primaryVibe] = [];
    acc[primaryVibe].push(option);
    return acc;
  }, {} as Record<string, AppNameOption[]>);

  // Get top 4 categories to display
  const categories = Object.keys(groupedOptions).slice(0, 4);

  return (
    <div className="h-full flex flex-col">
      {/* 1. HERO SECTION: The Decision Area */}
      <div className="flex-none p-6 bg-gradient-to-b from-neutral-900 to-black border-b border-neutral-800">
        {lockedName ? (
            // LOCKED STATE
            <div className="text-center py-8">
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6"
               >
                 <Lock className="w-4 h-4" />
                 <span className="font-medium text-sm">Name Locked & Secured</span>
               </motion.div>
               <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">{lockedName.name}</h1>
               <p className="text-neutral-400 max-w-md mx-auto">
                 This name is now synced with your App Store copy and other assets.
               </p>
            </div>
        ) : selectedOption ? (
            // ACTIVE SELECTION STATE
            <div className="max-w-3xl mx-auto w-full">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <motion.div 
                    key={selectedOption.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-1"
                  >
                     <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                       {selectedOption.vibeTags[0]} Choice
                     </span>
                  </motion.div>
                  <motion.h1 
                    key={`title-${selectedOption.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
                  >
                    {selectedOption.name}
                  </motion.h1>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {Math.round((selectedOption.scores.memorability + selectedOption.scores.clarity + selectedOption.scores.uniqueness) / 3)}
                  </div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wide font-medium">Fit Score</div>
                </div>
              </div>

              {/* AI Analysis Blurb */}
              {selectedOption.analysis && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.2 }}
                   className="mb-6 bg-neutral-800/50 rounded-xl p-4 border border-neutral-800"
                 >
                   <div className="flex items-start gap-3">
                     <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                     <div>
                       <p className="text-sm text-neutral-300 leading-relaxed italic">
                         "{selectedOption.analysis}"
                       </p>
                     </div>
                   </div>
                 </motion.div>
              )}

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                 {selectedOption.pros && selectedOption.pros.length > 0 && (
                   <div className="space-y-2">
                     <p className="text-xs font-medium text-neutral-500 uppercase flex items-center gap-1.5">
                       <ThumbsUp className="w-3 h-3" /> Pros
                     </p>
                     <ul className="space-y-1">
                       {selectedOption.pros.map((pro, i) => (
                         <li key={i} className="text-xs text-emerald-400 flex items-center gap-1.5">
                           <Check className="w-3 h-3 flex-shrink-0" />
                           {pro}
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
                 
                 {selectedOption.cons && selectedOption.cons.length > 0 && (
                   <div className="space-y-2">
                     <p className="text-xs font-medium text-neutral-500 uppercase flex items-center gap-1.5">
                       <ThumbsDown className="w-3 h-3" /> Cons
                     </p>
                     <ul className="space-y-1">
                       {selectedOption.cons.map((con, i) => (
                         <li key={i} className="text-xs text-rose-400 flex items-center gap-1.5">
                           <Info className="w-3 h-3 flex-shrink-0" />
                           {con}
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
              </div>

              {/* Analysis & Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <AvailabilityCard 
                  icon={<Smartphone className="w-4 h-4" />}
                  label="App Store"
                  status={selectedOption.availability.appStore}
                />
                <AvailabilityCard 
                  icon={<Globe className="w-4 h-4" />}
                  label="Domain"
                  status={selectedOption.availability.domain}
                />
                <AvailabilityCard 
                  icon={<Share2 className="w-4 h-4" />}
                  label="Social"
                  status={selectedOption.availability.social}
                />
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => lockName(selectedOption.id)}
                  className="flex-1 bg-white text-black h-12 rounded-xl font-bold text-base hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Lock this Name
                </button>
                <div className="px-4 text-xs text-neutral-500 text-center max-w-[150px]">
                  Locking syncs this name to your other assets.
                </div>
              </div>
            </div>
        ) : (
            // EMPTY / LOADING STATE
            <div className="py-12 flex flex-col items-center justify-center text-center">
              {isGenerating ? (
                <>
                  <RefreshCw className="w-8 h-8 text-neutral-500 animate-spin mb-4" />
                  <p className="text-neutral-400">Dreaming up names...</p>
                </>
              ) : (
                <p className="text-neutral-500">Select a name below to analyze it.</p>
              )}
            </div>
        )}
      </div>

      {/* 2. DISCOVERY SECTION: The List */}
      <div className="flex-1 overflow-y-auto bg-neutral-950 p-6">
        {!lockedName && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Explore Options</h3>
               <div className="flex items-center gap-4">
                 <button 
                   onClick={() => setShowInput(!showInput)}
                   className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 transition-colors"
                 >
                   <Plus className="w-3 h-3" />
                   Add Custom Name
                 </button>
                 <button 
                   onClick={() => generateMoreNames()}
                   disabled={isGenerating}
                   className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 transition-colors"
                 >
                   <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                   Generate New Batch
                 </button>
               </div>
            </div>

            {/* Custom Name Input */}
            <AnimatePresence>
              {showInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <form onSubmit={handleAddCustomName} className="flex gap-2">
                    <input
                      type="text"
                      value={customNameInput}
                      onChange={(e) => setCustomNameInput(e.target.value)}
                      placeholder="Enter your own name idea..."
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!customNameInput.trim()}
                      className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50"
                    >
                      Add
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {categories.map((category) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-px flex-1 bg-neutral-800"></span>
                  <span className="text-xs text-neutral-500 font-medium px-2">{category}</span>
                  <span className="h-px flex-1 bg-neutral-800"></span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupedOptions[category].map((option) => {
                    const avgScore = Math.round((option.scores.memorability + option.scores.clarity + option.scores.uniqueness) / 3);
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => selectName(option.id)}
                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                          option.selected 
                            ? 'bg-neutral-900 border-neutral-700 ring-1 ring-neutral-700' 
                            : 'bg-black border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <span className={`font-medium transition-colors ${option.selected ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
                          {option.name}
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-mono font-medium ${
                            avgScore >= 80 ? 'text-emerald-400' : 
                            avgScore >= 60 ? 'text-amber-400' : 
                            'text-neutral-500'
                          }`}>
                            {avgScore}
                          </span>
                          
                          {option.selected ? (
                             <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                          ) : (
                             <ArrowRight className="w-4 h-4 text-neutral-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {options.length === 0 && !isGenerating && (
               <div className="text-center py-10">
                 <button 
                   onClick={() => generateMoreNames()}
                   className="text-white bg-neutral-800 px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors"
                 >
                   Start Generating Names
                 </button>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AvailabilityCard({ icon, label, status }: { icon: React.ReactNode, label: string, status: 'available' | 'taken' | 'unknown' | 'partial' }) {
  const getStatusColor = () => {
    switch (status) {
      case 'available': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'taken': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'partial': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-neutral-400 bg-neutral-800 border-neutral-700';
    }
  };

  const getStatusText = () => {
     switch (status) {
      case 'available': return 'Available';
      case 'taken': return 'Taken';
      case 'partial': return 'Mixed';
      default: return 'Checking...';
    }
  };

  return (
    <div className={`flex flex-col items-start p-3 rounded-xl border ${getStatusColor()} transition-colors`}>
      <div className="flex items-center gap-2 mb-1 opacity-80 text-xs font-medium uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="font-semibold">{getStatusText()}</div>
    </div>
  );
}
