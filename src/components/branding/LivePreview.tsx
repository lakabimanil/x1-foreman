'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, Smartphone } from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';

export default function LivePreview() {
  const { artifacts, activeArtifact } = useBrandingStore();
  
  const { name, icon, screenshots, copy, keywords } = artifacts;
  
  const displayName = name.lockedName?.name || copy.copy.appName || 'Your App';
  const displayIcon = icon.primaryIcon?.imageUrl || icon.concepts.find(c => c.selected)?.imageUrl;
  const displaySubtitle = copy.copy.subtitle || 'Your subtitle here';
  
  return (
    <div className="w-[340px] min-w-[340px] bg-[#0a0a0a] border-l border-neutral-800/50 flex flex-col h-full">
      {/* Minimal Header */}
      <div className="px-5 py-4 border-b border-neutral-800/50">
        <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">
          Preview
        </p>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeArtifact}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* App Store Card - Clean */}
            <div className="bg-neutral-900 rounded-2xl overflow-hidden">
              {/* App Header */}
              <div className="p-4 flex items-start gap-3">
                {/* App Icon */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 flex-shrink-0">
                  {displayIcon ? (
                    <img 
                      src={displayIcon} 
                      alt="App Icon" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-neutral-600" />
                    </div>
                  )}
                </div>
                
                {/* App Info */}
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {displayName}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {displaySubtitle}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span className="text-[10px] text-neutral-500">4.8</span>
                  </div>
                </div>
                
                {/* Get Button */}
                <button className="px-4 py-1.5 bg-white rounded-full text-xs font-semibold text-black">
                  GET
                </button>
              </div>
              
              {/* Screenshots - Minimal */}
              <div className="px-4 pb-4">
                <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {screenshots.cards.slice(0, 3).map((card) => (
                    <div
                      key={card.id}
                      className="flex-shrink-0 w-20 h-36 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 overflow-hidden"
                    >
                      <div className="h-full p-2 flex items-end">
                        <p className="text-[7px] text-white/80 line-clamp-2">
                          {card.headline}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Description - Collapsed */}
              <div className="px-4 pb-4 pt-3 border-t border-neutral-800">
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {copy.copy.description || 'Your description here...'}
                </p>
              </div>
            </div>
            
            {/* Context Panels - Show based on active artifact */}
            {activeArtifact === 'icon' && icon.concepts.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">
                  Icon Options
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {icon.concepts.map((concept) => (
                    <div 
                      key={concept.id}
                      className={`aspect-square rounded-xl overflow-hidden transition-all ${
                        concept.selected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]' : ''
                      }`}
                    >
                      <img 
                        src={concept.imageUrl} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeArtifact === 'keywords' && keywords.keywords.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">
                  Keywords
                </p>
                <div className="p-3 bg-neutral-900 rounded-xl">
                  <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                    {keywords.keywords.map(k => k.text).join(', ')}
                  </p>
                </div>
                <p className="text-[10px] text-neutral-600 mt-2">
                  {keywords.currentCharacters}/{keywords.maxCharacters}
                </p>
              </div>
            )}
            
            {activeArtifact === 'riskCheck' && artifacts.riskCheck.result && (
              <div className="mt-4">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">
                  Flagged
                </p>
                <div className="space-y-2">
                  {artifacts.riskCheck.result.findings.slice(0, 3).map((finding) => (
                    <div 
                      key={finding.id}
                      className={`p-2 rounded-lg text-xs ${
                        finding.applied ? 'opacity-30' : 'bg-amber-500/10'
                      }`}
                    >
                      <span className="text-amber-400">"{finding.phrase}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
