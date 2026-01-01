'use client';

import { motion } from 'framer-motion';
import { X, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import { providers } from '@/config/mockServicesConfig';

export default function ComparePanel() {
  const { comparePanel, services, closeComparePanel, swapProvider } = useServicesStudioStore();

  if (!comparePanel.isOpen || !comparePanel.serviceId) return null;

  const service = services[comparePanel.serviceId];
  if (!service) return null;

  const currentProvider = providers[service.selectedProviderId];
  const alternatives = service.availableProviders.filter(
    (p) => p.id !== service.selectedProviderId
  );

  const handleSelect = (providerId: string) => {
    swapProvider(comparePanel.serviceId!, providerId);
    closeComparePanel();
  };

  const riskColors = {
    low: 'text-emerald-400 bg-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/20',
    high: 'text-red-400 bg-red-500/20',
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 bottom-0 w-[400px] bg-[#0d0d0d] border-l border-neutral-800 shadow-2xl z-40 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div>
          <h2 className="text-lg font-semibold text-white">Compare Providers</h2>
          <p className="text-sm text-neutral-500">{service.name}</p>
        </div>
        <button
          onClick={closeComparePanel}
          className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Current Selection */}
        {currentProvider && (
          <div className="mb-6">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
              Current Selection
            </p>
            <div className="p-4 rounded-xl border-2 border-blue-500/50 bg-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-2xl">
                  {currentProvider.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{currentProvider.name}</span>
                    {currentProvider.recommended && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">{currentProvider.description}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternatives */}
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
            Alternatives
          </p>
          <div className="space-y-3">
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-2xl">
                    {alt.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{alt.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${riskColors[alt.riskLevel]}`}>
                        {alt.riskLevel.charAt(0).toUpperCase() + alt.riskLevel.slice(1)} risk
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{alt.costDriverLabel}</p>
                  </div>
                </div>

                {/* Pros */}
                <div className="mb-3">
                  <p className="text-xs text-neutral-500 mb-1.5">Pros</p>
                  <ul className="space-y-1">
                    {alt.pros.slice(0, 2).map((pro, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-neutral-300">
                        <Check className="w-3 h-3 text-emerald-400" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="mb-4">
                  <p className="text-xs text-neutral-500 mb-1.5">Cons</p>
                  <ul className="space-y-1">
                    {alt.cons.slice(0, 2).map((con, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-neutral-300">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Connector indicator */}
                {alt.hasConnector && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-blue-400" />
                    </div>
                    <span className="text-xs text-blue-400">x1 Connector available</span>
                  </div>
                )}

                {/* Select Button */}
                <button
                  onClick={() => handleSelect(alt.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors text-sm"
                >
                  <span>Select {alt.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {alternatives.length === 0 && (
              <div className="text-center py-8 text-neutral-500">
                <p>No alternatives available for this service.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
