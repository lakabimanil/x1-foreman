'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Copy } from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';

export default function CopyWorkspace() {
  const { artifacts, updateCopy, lockCopy, isGenerating } = useBrandingStore();
  const { copy, isLocked } = artifacts.copy;
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const fields = [
    { key: 'appName', label: 'App Name', max: 30, value: copy.appName },
    { key: 'subtitle', label: 'Subtitle', max: 30, value: copy.subtitle },
    { key: 'oneLiner', label: 'One-liner', max: 100, value: copy.oneLiner },
    { key: 'description', label: 'Description', max: 4000, value: copy.description, multiline: true },
  ];
  
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
            Copy Locked
          </p>
        </motion.div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">Edit your App Store copy</p>
        {!isLocked && (
          <button
            onClick={() => lockCopy()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
          >
            <Lock className="w-3 h-3" />
            Lock
          </button>
        )}
      </div>
      
      {/* Fields */}
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-neutral-500">{field.label}</label>
              <span className={`text-[10px] ${
                field.value.length > field.max ? 'text-rose-400' : 'text-neutral-600'
              }`}>
                {field.value.length}/{field.max}
              </span>
            </div>
            
            {field.multiline ? (
              <textarea
                value={field.value}
                onChange={(e) => updateCopy(field.key as keyof typeof copy, e.target.value)}
                onFocus={() => setActiveField(field.key)}
                onBlur={() => setActiveField(null)}
                disabled={isLocked}
                rows={5}
                className={`w-full px-4 py-3 bg-neutral-900 rounded-xl text-sm text-white placeholder-neutral-600 outline-none resize-none transition-all ${
                  activeField === field.key ? 'ring-1 ring-neutral-700' : ''
                } ${isLocked ? 'opacity-50' : ''}`}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            ) : (
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateCopy(field.key as keyof typeof copy, e.target.value)}
                onFocus={() => setActiveField(field.key)}
                onBlur={() => setActiveField(null)}
                disabled={isLocked}
                className={`w-full px-4 py-3 bg-neutral-900 rounded-xl text-sm text-white placeholder-neutral-600 outline-none transition-all ${
                  activeField === field.key ? 'ring-1 ring-neutral-700' : ''
                } ${isLocked ? 'opacity-50' : ''}`}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
