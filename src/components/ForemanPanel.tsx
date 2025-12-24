'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Loader2, CheckCircle2, AlertCircle, Info, Sparkles, Edit3, Palette } from 'lucide-react';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export default function ForemanPanel() {
  const { steps, logs, blocks, activeBlockId, setEditPanelOpen } = useOnboardingStore();

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  return (
    <div className="w-[280px] min-w-[280px] bg-[var(--color-gray-175)] border-r border-[var(--color-gray-125)] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-gray-125)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-white">The Foreman</h1>
            <p className="text-[11px] text-[var(--color-gray-75)]">AI building guide</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Compact */}
      {activeBlock && (
        <div className="p-3 border-b border-[var(--color-gray-125)] flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setEditPanelOpen(true)}
              className="flex-1 flex items-center gap-2 p-2.5 rounded-lg bg-[var(--color-accent-blue)]/10 hover:bg-[var(--color-accent-blue)]/20 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
              <span className="text-xs font-medium text-white">Edit</span>
            </button>
            <button
              onClick={() => setEditPanelOpen(true)}
              className="flex-1 flex items-center gap-2 p-2.5 rounded-lg bg-[var(--color-gray-150)] hover:bg-[var(--color-gray-125)] transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--color-accent-purple)]" />
              <span className="text-xs font-medium text-white">Style</span>
            </button>
          </div>
        </div>
      )}

      {/* Build Progress */}
      <div className="flex-1 overflow-y-auto p-3">
        <h2 className="text-[10px] font-medium text-[var(--color-gray-100)] uppercase tracking-wider mb-3">Build Progress</h2>
        
        <div className="space-y-0.5">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex items-start gap-2.5 p-2.5 rounded-lg transition-all ${
                step.active 
                  ? 'bg-[var(--color-accent-blue)]/10' 
                  : 'bg-transparent'
              }`}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute left-[18px] top-[34px] w-0.5 h-4 ${
                    step.completed ? 'bg-[var(--color-accent-green)]' : 'bg-[var(--color-gray-125)]'
                  }`} 
                />
              )}
              
              {/* Status Icon */}
              <div className="relative z-10 flex-shrink-0">
                {step.completed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-[var(--color-accent-green)] flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                ) : step.active ? (
                  <div className="w-5 h-5 rounded-full bg-[var(--color-accent-blue)] flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="w-3 h-3 text-white" />
                    </motion.div>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] flex items-center justify-center">
                    <Circle className="w-2.5 h-2.5 text-[var(--color-gray-100)]" />
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-xs font-medium leading-tight ${
                  step.active 
                    ? 'text-white' 
                    : step.completed 
                      ? 'text-[var(--color-gray-75)]' 
                      : 'text-[var(--color-gray-100)]'
                }`}>
                  {step.title}
                </h3>
                <p className="text-[10px] text-[var(--color-gray-100)] truncate">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Verification Log - Compact */}
      <div className="border-t border-[var(--color-gray-125)] flex-shrink-0">
        <div className="p-3">
          <h2 className="text-[10px] font-medium text-[var(--color-gray-100)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
            Activity Log
          </h2>
          
          <div className="space-y-1 max-h-[100px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {logs.length === 0 ? (
                <p className="text-[10px] text-[var(--color-gray-100)] italic">Waiting for actions...</p>
              ) : (
                logs.slice(-4).map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-start gap-1.5 text-[10px]"
                  >
                    {log.status === 'success' ? (
                      <CheckCircle2 className="w-3 h-3 text-[var(--color-accent-green)] flex-shrink-0 mt-0.5" />
                    ) : log.status === 'error' ? (
                      <AlertCircle className="w-3 h-3 text-[var(--color-accent-red)] flex-shrink-0 mt-0.5" />
                    ) : log.status === 'pending' ? (
                      <Loader2 className="w-3 h-3 text-[var(--color-accent-yellow)] animate-spin flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-3 h-3 text-[var(--color-accent-blue)] flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`truncate ${
                      log.status === 'success' 
                        ? 'text-[var(--color-gray-75)]' 
                        : log.status === 'error' 
                          ? 'text-[var(--color-accent-red)]' 
                          : 'text-white'
                    }`}>
                      {log.message}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="p-3 bg-[var(--color-gray-150)]/50 border-t border-[var(--color-gray-125)] flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] text-[var(--color-gray-100)]">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-gray-125)] rounded font-mono">E</kbd>
            Edit
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-gray-125)] rounded font-mono">←→</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-gray-125)] rounded font-mono">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
