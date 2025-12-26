'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Lock, AlertTriangle } from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';

export default function KeywordsWorkspace() {
  const [newKeyword, setNewKeyword] = useState('');
  const { artifacts, addKeyword, removeKeyword, lockKeywords } = useBrandingStore();
  const { keywords, status, currentCharacters, maxCharacters } = artifacts.keywords;
  const isLocked = status === 'locked';
  
  const isOverLimit = currentCharacters > maxCharacters;
  
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() && !isLocked) {
      addKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };
  
  return (
    <div className="p-6">
      {/* Locked State */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
        >
          <p className="text-xs text-emerald-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Keywords Locked
          </p>
        </motion.div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-neutral-400">{keywords.length} keywords</p>
        </div>
        {!isLocked && (
          <button
            onClick={() => lockKeywords()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
          >
            <Lock className="w-3 h-3" />
            Lock
          </button>
        )}
      </div>
      
      {/* Character Counter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-500">Character usage</span>
          <span className={`text-xs font-medium ${isOverLimit ? 'text-rose-400' : 'text-neutral-400'}`}>
            {currentCharacters} / {maxCharacters}
          </span>
        </div>
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isOverLimit ? 'bg-rose-500' : 'bg-white'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((currentCharacters / maxCharacters) * 100, 100)}%` }}
          />
        </div>
        {isOverLimit && (
          <p className="text-[10px] text-rose-400 mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Over limit. Remove some keywords.
          </p>
        )}
      </div>
      
      {/* Add Keyword */}
      {!isLocked && (
        <form onSubmit={handleAdd} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword..."
              className="flex-1 px-4 py-2.5 bg-neutral-900 rounded-xl text-sm text-white placeholder-neutral-600 outline-none focus:ring-1 focus:ring-neutral-700"
            />
            <button
              type="submit"
              disabled={!newKeyword.trim()}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
      
      {/* Keywords Grid */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {keywords.map((keyword) => (
            <motion.div
              key={keyword.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                keyword.risky
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-neutral-800 text-white'
              }`}
            >
              <span>{keyword.text}</span>
              {!isLocked && (
                <button
                  onClick={() => removeKeyword(keyword.id)}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Empty State */}
      {keywords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-neutral-500">No keywords yet</p>
        </div>
      )}
    </div>
  );
}
