'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Copy, Trash2, Sparkles } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { Offer, OfferStatus } from '@/types/revenue';

const statusConfig: Record<OfferStatus, { label: string; color: string; bgColor: string }> = {
  ready: { label: 'Ready', color: 'text-accent-green', bgColor: 'bg-accent-green/15' },
  draft: { label: 'Draft', color: 'text-accent-blue', bgColor: 'bg-accent-blue/15' },
  'needs-attention': { label: 'Needs attention', color: 'text-accent-yellow', bgColor: 'bg-accent-yellow/15' },
  inactive: { label: 'Inactive', color: 'text-gray-100', bgColor: 'bg-gray-125/50' },
};

function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const { openOfferEditor, duplicateOffer, removeOffer } = useRevenueStore();
  
  const status = statusConfig[offer.status];
  const defaultPrice = offer.prices.find((p) => p.isDefault) || offer.prices[0];
  
  // Determine who benefits
  const beneficiaries = offer.splits
    .filter((s) => s.percentage > 0)
    .map((s) => s.earner === 'creator' ? 'Creator' : 'Platform')
    .join(' / ');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div 
        role="button"
        tabIndex={0}
        className={`
          relative p-5 rounded-2xl border transition-all cursor-pointer
          bg-gray-150 border-gray-125 hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue
          ${offer.status === 'inactive' ? 'opacity-60' : ''}
        `}
        onClick={() => openOfferEditor(offer.id)}
        onKeyDown={(e) => e.key === 'Enter' && openOfferEditor(offer.id)}
      >
        {/* Status badge */}
        <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-medium ${status.bgColor} ${status.color}`}>
          {status.label}
        </div>
        
        {/* Icon and name */}
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: `${offer.color}20` }}
          >
            {offer.icon}
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <h3 className="text-base font-semibold text-white mb-0.5 truncate">
              {offer.name}
            </h3>
            <p className="text-xs text-gray-75 line-clamp-1">
              {offer.description}
            </p>
          </div>
        </div>
        
        {/* Price preview */}
        {defaultPrice && (
          <div className="mb-3">
            <span className="text-lg font-bold text-white">
              {defaultPrice.label}
            </span>
          </div>
        )}
        
        {/* Who benefits */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-75">
            {beneficiaries || 'Platform'}
          </span>
          
          {/* Quick actions - only show on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateOffer(offer.id);
              }}
              className="p-1.5 rounded-lg text-gray-100 hover:text-white hover:bg-gray-125 transition-colors"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeOffer(offer.id);
              }}
              className="p-1.5 rounded-lg text-gray-100 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SuggestedOfferCard({ offer, index }: { offer: Offer; index: number }) {
  const { addSuggestedOffer } = useRevenueStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.05 }}
    >
      <button
        onClick={() => addSuggestedOffer(offer.id)}
        className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-125 hover:border-gray-100 bg-gray-175/50 hover:bg-gray-150/50 transition-all text-left group"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: `${offer.color}15` }}
          >
            {offer.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-75 group-hover:text-white transition-colors truncate">
                {offer.name}
              </h4>
              <Sparkles className="w-3 h-3 text-accent-purple opacity-60" />
            </div>
            <p className="text-xs text-gray-100 truncate">
              {offer.status === 'inactive' ? 'Suggested' : 'Add to configure'}
            </p>
          </div>
          <Plus className="w-4 h-4 text-gray-100 group-hover:text-white transition-colors" />
        </div>
      </button>
    </motion.div>
  );
}

export default function OffersCanvas() {
  const { getCurrentScenario, setAddingOffer } = useRevenueStore();
  const scenario = getCurrentScenario();
  
  const activeOffers = scenario.offers.filter((o) => o.status !== 'inactive');
  const inactiveOffers = scenario.offers.filter((o) => o.status === 'inactive');
  
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            What can users buy in your app?
          </h1>
          <p className="text-sm text-gray-75">
            We'll handle Apple, payouts, and edge cases automatically.
          </p>
        </motion.div>
        
        {/* Active offers grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <AnimatePresence mode="popLayout">
            {activeOffers.map((offer, index) => (
              <OfferCard key={offer.id} offer={offer} index={index} />
            ))}
          </AnimatePresence>
          
          {/* Add new offer card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: activeOffers.length * 0.05 }}
          >
            <button
              onClick={() => setAddingOffer(true)}
              className="w-full h-full min-h-[160px] p-5 rounded-2xl border-2 border-dashed border-gray-125 hover:border-accent-blue/50 bg-gray-175/30 hover:bg-accent-blue/5 transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-125 group-hover:bg-accent-blue/20 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-gray-75 group-hover:text-accent-blue transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-75 group-hover:text-white transition-colors">
                Add Offer
              </span>
            </button>
          </motion.div>
        </div>
        
        {/* AI Suggestions */}
        {scenario.suggestedOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent-purple" />
              <h2 className="text-sm font-medium text-gray-75">
                AI Suggestions
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {scenario.suggestedOffers.map((offer, index) => (
                <SuggestedOfferCard key={offer.id} offer={offer} index={index} />
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Inactive offers section */}
        {inactiveOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <h2 className="text-sm font-medium text-gray-100 mb-4">
              Inactive Offers
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {inactiveOffers.map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
