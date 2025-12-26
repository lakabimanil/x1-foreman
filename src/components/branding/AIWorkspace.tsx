'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';
import type { ArtifactType } from '@/types/branding';

// Artifact-specific workspace content
import AssetsWorkspace from './workspaces/AssetsWorkspace';
import NameWorkspace from './workspaces/NameWorkspace';
import IconWorkspace from './workspaces/IconWorkspace';
import ScreenshotsWorkspace from './workspaces/ScreenshotsWorkspace';
import CopyWorkspace from './workspaces/CopyWorkspace';
import KeywordsWorkspace from './workspaces/KeywordsWorkspace';
import RiskCheckWorkspace from './workspaces/RiskCheckWorkspace';

const workspaceComponents: Record<ArtifactType, React.ComponentType> = {
  assets: AssetsWorkspace,
  name: NameWorkspace,
  icon: IconWorkspace,
  screenshots: ScreenshotsWorkspace,
  copy: CopyWorkspace,
  keywords: KeywordsWorkspace,
  riskCheck: RiskCheckWorkspace,
};

const artifactLabels: Record<ArtifactType, string> = {
  assets: 'Assets Library',
  name: 'App Name',
  icon: 'App Icon',
  screenshots: 'Screenshots',
  copy: 'App Store Copy',
  keywords: 'Keywords',
  riskCheck: 'Review Check',
};

export default function AIWorkspace() {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    activeArtifact,
    activities,
    isGenerating,
    processUserInput,
  } = useBrandingStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    
    const command = input;
    setInput('');
    await processUserInput(command);
  };
  
  const WorkspaceContent = workspaceComponents[activeArtifact];
  const activeActivities = activities.filter(a => !a.completed);
  
  // Contextual suggestions - minimal
  const getSuggestions = (): string[] => {
    switch (activeArtifact) {
      case 'name': return ['Shorter', 'Playful', 'Premium'];
      case 'icon': return ['Minimal', 'Vibrant', 'Dark'];
      case 'copy': return ['Shorter', 'Bolder', 'Softer'];
      case 'screenshots': return ['Reorder', 'Headlines'];
      case 'keywords': return ['Suggest', 'Optimize'];
      case 'riskCheck': return ['Check', 'Fix all'];
      default: return [];
    }
  };
  
  return (
    <div className="flex-1 flex flex-col bg-[#0d0d0d] overflow-hidden">
      {/* Clean Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/50">
        <div>
          <h1 className="text-lg font-medium text-white">
            {artifactLabels[activeArtifact]}
          </h1>
          {activeActivities.length > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1.5"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
              />
              Generating...
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Workspace Content - Clean and focused */}
      <div className="flex-1 overflow-hidden relative">
        <WorkspaceContent />
      </div>
      
      {/* Minimal Input Bar */}
      <div className="flex-shrink-0 p-4 border-t border-neutral-800/50">
        <form onSubmit={handleSubmit}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isFocused 
              ? 'bg-neutral-800/80 ring-1 ring-neutral-700' 
              : 'bg-neutral-900 hover:bg-neutral-800/60'
          }`}>
            <Sparkles className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Tell AI how to refine..."
              className="flex-1 bg-transparent text-white placeholder-neutral-600 outline-none text-sm"
              disabled={isGenerating}
            />
            
            <AnimatePresence>
              {input.trim() && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="submit"
                  disabled={isGenerating}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          {/* Quick actions - Only show when focused or empty input */}
          <AnimatePresence>
            {(isFocused || !input) && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 mt-2 px-1"
              >
                {getSuggestions().map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 text-xs text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-md transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
