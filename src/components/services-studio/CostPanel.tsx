'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  Clock, 
  Activity,
  X,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import { templates } from '@/config/mockServicesConfig';

interface CostPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CostPanel({ isOpen, onClose }: CostPanelProps) {
  const {
    selectedTemplate,
    costScenario,
    updateCostScenario,
    calculateEstimatedCost,
  } = useServicesStudioStore();

  const [activePreset, setActivePreset] = useState<'mvp' | 'growth' | 'viral'>('mvp');

  const cost = calculateEstimatedCost();

  const presets = {
    mvp: {
      label: 'MVP Launch',
      desc: 'Most apps start here',
      values: { mau: 1000, avgUsage: 10, concurrency: 5 }
    },
    growth: {
      label: 'Growing App',
      desc: 'Consistent usage',
      values: { mau: 10000, avgUsage: 30, concurrency: 50 }
    },
    viral: {
      label: 'Viral Spike',
      desc: 'High load scenario',
      values: { mau: 100000, avgUsage: 60, concurrency: 500 }
    }
  };

  const handlePresetSelect = (preset: 'mvp' | 'growth' | 'viral') => {
    setActivePreset(preset);
    updateCostScenario(presets[preset].values);
  };

  const handleSliderChange = (key: keyof typeof costScenario, value: number) => {
    updateCostScenario({ [key]: value });
    // If values deviate significantly from preset, maybe clear active preset visual?
    // For now, keep it simple.
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (optional, maybe just overlay on right) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-14 bottom-0 w-96 bg-neutral-900 border-l border-neutral-800 z-50 overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Cost Estimator
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-3 gap-2 mb-8">
                {(Object.keys(presets) as Array<'mvp' | 'growth' | 'viral'>).map((key) => (
                  <button
                    key={key}
                    onClick={() => handlePresetSelect(key)}
                    className={`p-2 rounded-lg text-center transition-all border ${
                      activePreset === key
                        ? 'bg-blue-500/20 border-blue-500/50 text-white'
                        : 'bg-neutral-800 border-transparent text-neutral-400 hover:bg-neutral-750'
                    }`}
                  >
                    <div className="text-xs font-medium mb-0.5">{presets[key].label}</div>
                  </button>
                ))}
              </div>
              
              <div className="text-xs text-center text-neutral-500 mb-6 -mt-4">
                {presets[activePreset].desc}
              </div>

              {/* Sliders */}
              <div className="space-y-6 mb-8">
                {/* MAU */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Monthly Users</span>
                    <span className="text-white font-mono">{costScenario.mau.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="200000"
                    step="100"
                    value={costScenario.mau}
                    onChange={(e) => handleSliderChange('mau', parseInt(e.target.value))}
                    className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Usage */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Avg Usage (min/day)</span>
                    <span className="text-white font-mono">{costScenario.avgUsage}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={costScenario.avgUsage}
                    onChange={(e) => handleSliderChange('avgUsage', parseInt(e.target.value))}
                    className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-800/50 border border-neutral-700 mb-6">
                <div className="text-center mb-4">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Likely Monthly Range</p>
                  <div className="text-3xl font-bold text-white">
                    ${cost.min.toLocaleString()} – ${cost.max.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-700/50">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-white">Primary Cost Driver</p>
                      <p className="text-xs text-neutral-400">{cost.drivers[0] || 'Usage'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-white">Spike Risk</p>
                      <p className="text-xs text-neutral-400">Going over free tier limits triggers pay-as-you-go rates.</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-500 text-center">
                Estimates based on current provider pricing.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
