'use client';

import { motion } from 'framer-motion';
import { Eye, Info, ArrowRight } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';

export default function MoneyMapPreview() {
  const { getCurrentScenario, getOfferMoneySummary, setActiveView } = useRevenueStore();
  const scenario = getCurrentScenario();
  
  // Only show active offers
  const offers = scenario.offers.filter((o) => o.status !== 'inactive' && o.type !== 'ad-supported');
  
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-gray-75" />
            <h1 className="text-2xl font-bold text-white">Money Map</h1>
          </div>
          <p className="text-sm text-gray-75">
            A read-only blueprint of how money flows through your app.
          </p>
        </motion.div>
        
        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white mb-1">This is a generated preview</p>
            <p className="text-xs text-gray-75">
              To make changes, edit individual offers from the{' '}
              <button 
                onClick={() => setActiveView('offers')}
                className="text-accent-blue hover:underline"
              >
                Offers screen
              </button>
              .
            </p>
          </div>
        </motion.div>
        
        {/* Money flow visualization */}
        <div className="space-y-6">
          {offers.map((offer, index) => {
            const summary = getOfferMoneySummary(offer.id);
            if (!summary) return null;
            
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="p-6 rounded-2xl bg-gray-150 border border-gray-125"
              >
                {/* Offer header */}
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${offer.color}20` }}
                  >
                    {offer.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{offer.name}</h3>
                    <p className="text-sm text-gray-75">
                      {offer.prices.find((p) => p.isDefault)?.label || 'No price'}
                    </p>
                  </div>
                </div>
                
                {/* Flow diagram */}
                <div className="relative">
                  {/* User pays */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-accent-blue/20 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-accent-blue to-gray-125" />
                      <div className="px-3 py-1 rounded-full bg-gray-175 text-sm font-medium text-white">
                        ${summary.userPays.toFixed(2)}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-100 mx-2" />
                    </div>
                  </div>
                  
                  {/* Apple takes */}
                  <div className="flex items-center gap-4 mb-4 ml-20">
                    <div className="w-12 h-12 rounded-xl bg-gray-175 flex items-center justify-center">
                      <span className="text-xl">🍎</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-75">Apple (30%)</span>
                      <span className="text-gray-100 ml-2">−${summary.appleKeeps.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Splits */}
                  <div className="ml-20 pl-6 border-l-2 border-gray-125 space-y-3">
                    {summary.creatorGets > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                          <span className="text-lg">🎬</span>
                        </div>
                        <div>
                          <span className="text-sm text-white font-medium">
                            ${summary.creatorGets.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-75 ml-2">Creator</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent-green/20 flex items-center justify-center">
                        <span className="text-lg">📱</span>
                      </div>
                      <div>
                        <span className="text-sm text-white font-medium">
                          ${summary.platformGets.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-75 ml-2">Platform</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payout timing */}
                  <div className="mt-4 pt-4 border-t border-gray-125 flex items-center gap-2">
                    <span className="text-xs text-gray-100">Payout:</span>
                    <span className="text-xs text-white">{summary.payoutTiming}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Empty state */}
        {offers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-gray-150 flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-100" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No offers to display</h3>
            <p className="text-sm text-gray-75 mb-6">
              Add some offers to see how money will flow through your app.
            </p>
            <button
              onClick={() => setActiveView('offers')}
              className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Go to Offers
            </button>
          </motion.div>
        )}
        
        {/* Legend */}
        {offers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 p-4 rounded-xl bg-gray-175 border border-gray-125"
          >
            <p className="text-xs text-gray-100 mb-3 uppercase tracking-wide">Legend</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-accent-blue/20 flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
                <span className="text-xs text-gray-75">User</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gray-150 flex items-center justify-center">
                  <span className="text-xs">🍎</span>
                </div>
                <span className="text-xs text-gray-75">Apple (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-accent-purple/20 flex items-center justify-center">
                  <span className="text-xs">🎬</span>
                </div>
                <span className="text-xs text-gray-75">Creator</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-accent-green/20 flex items-center justify-center">
                  <span className="text-xs">📱</span>
                </div>
                <span className="text-xs text-gray-75">Platform</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
