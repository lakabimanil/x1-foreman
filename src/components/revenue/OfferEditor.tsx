'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, DollarSign, Users, Clock, AlertTriangle, 
  Check, ChevronDown, ChevronUp, Info, Unlock, Shield, 
  Settings, Tv, UserX, Sparkles
} from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import UnlockConditionsSection from './UnlockConditionsSection';
import ModerationPolicySection from './ModerationPolicySection';
import SubscriptionEdgeCases from './SubscriptionEdgeCases';
import AdRevenueSetup from './AdRevenueSetup';
import CreatorDepartureSection from './CreatorDepartureSection';
import type { 
  PriceOption, EarnerSplit, PayoutTiming, RefundBehavior, RefundAfterPayout, Offer,
} from '@/types/revenue';

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function PriceSection({ offer }: { offer: Offer }) {
  const { updateOfferPrices } = useRevenueStore();
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'one-time' | 'week' | 'month' | 'year'>(
    offer.type === 'subscription' ? 'month' : 'one-time'
  );
  const [hasFreeTrial, setHasFreeTrial] = useState(false);
  const [freeTrialDays, setFreeTrialDays] = useState(7);
  
  const isSubscription = offer.type === 'subscription';
  
  const periodOptions = isSubscription 
    ? [
        { value: 'week' as const, label: 'Weekly' },
        { value: 'month' as const, label: 'Monthly' },
        { value: 'year' as const, label: 'Yearly' },
      ]
    : [{ value: 'one-time' as const, label: 'One-time' }];
  
  const getSuggestions = (): { amount: number; label: string; suggestedName?: string }[] => {
    if (offer.type === 'consumable') {
      return [
        { amount: 0.99, label: 'Small tip', suggestedName: 'Coffee ☕' },
        { amount: 2.99, label: 'Medium tip', suggestedName: 'High Five 🙌' },
        { amount: 4.99, label: 'Big tip', suggestedName: 'Super Fan ⭐' },
        { amount: 9.99, label: 'Mega tip', suggestedName: 'Legend 🏆' },
      ];
    }
    if (offer.type === 'subscription') {
      if (selectedPeriod === 'week') {
        return [
          { amount: 2.99, label: 'Budget', suggestedName: 'Starter' },
          { amount: 4.99, label: 'Popular', suggestedName: 'Weekly Pro' },
          { amount: 7.99, label: 'Premium', suggestedName: 'Weekly Premium' },
        ];
      }
      if (selectedPeriod === 'year') {
        return [
          { amount: 29.99, label: '~$2.50/mo', suggestedName: 'Annual Saver' },
          { amount: 49.99, label: '~$4.17/mo', suggestedName: 'Annual Pro' },
          { amount: 79.99, label: '~$6.67/mo', suggestedName: 'Annual Premium' },
          { amount: 99.99, label: '~$8.33/mo', suggestedName: 'Annual Ultimate' },
        ];
      }
      return [
        { amount: 4.99, label: 'Entry', suggestedName: 'Basic' },
        { amount: 9.99, label: 'Popular', suggestedName: 'Pro' },
        { amount: 14.99, label: 'Pro', suggestedName: 'Pro Plus' },
        { amount: 24.99, label: 'Premium', suggestedName: 'Premium' },
      ];
    }
    return [
      { amount: 2.99, label: 'Low' },
      { amount: 9.99, label: 'Standard' },
      { amount: 19.99, label: 'Premium' },
    ];
  };
  
  const formatPriceLabel = (amount: number, period: 'one-time' | 'week' | 'month' | 'year') => {
    const formatted = `$${amount.toFixed(2)}`;
    if (period === 'one-time') return formatted;
    const periodLabels = { week: '/week', month: '/month', year: '/year' };
    return `${formatted}${periodLabels[period]}`;
  };
  
  const addPrice = (amount: number, displayName?: string) => {
    if (amount <= 0) return;
    
    const newPrice: PriceOption = {
      id: `price-${Date.now()}`,
      amount,
      period: selectedPeriod,
      label: formatPriceLabel(amount, selectedPeriod),
      displayName: displayName || undefined,
      isDefault: offer.prices.length === 0,
      hasFreeTrial: isSubscription && hasFreeTrial,
      freeTrialDays: isSubscription && hasFreeTrial ? freeTrialDays : undefined,
    };
    
    updateOfferPrices(offer.id, [...offer.prices, newPrice]);
    setCustomAmount('');
  };
  
  const removePrice = (priceId: string) => {
    const newPrices = offer.prices.filter((p) => p.id !== priceId);
    if (offer.prices.find(p => p.id === priceId)?.isDefault && newPrices.length > 0) {
      newPrices[0].isDefault = true;
    }
    updateOfferPrices(offer.id, newPrices);
  };
  
  const setDefaultPrice = (priceId: string) => {
    const newPrices = offer.prices.map((p) => ({
      ...p,
      isDefault: p.id === priceId,
    }));
    updateOfferPrices(offer.id, newPrices);
  };
  
  const updatePriceTrial = (priceId: string, hasTrial: boolean, days?: number) => {
    const newPrices = offer.prices.map((p) => 
      p.id === priceId 
        ? { ...p, hasFreeTrial: hasTrial, freeTrialDays: hasTrial ? (days || 7) : undefined }
        : p
    );
    updateOfferPrices(offer.id, newPrices);
  };
  
  const updatePriceDisplayName = (priceId: string, displayName: string) => {
    const newPrices = offer.prices.map((p) => 
      p.id === priceId 
        ? { ...p, displayName: displayName || undefined }
        : p
    );
    updateOfferPrices(offer.id, newPrices);
  };
  
  const handleCustomAmountSubmit = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      addPrice(amount);
    }
  };
  
  // Skip pricing section for ad-supported offers
  if (offer.type === 'ad-supported') {
    return (
      <div className="p-4 rounded-xl bg-gray-175 border border-gray-125 text-center">
        <Tv className="w-8 h-8 text-accent-green mx-auto mb-3" />
        <p className="text-sm text-white mb-1">Ad-Supported Offer</p>
        <p className="text-xs text-gray-75">
          This offer is monetized through ads, not direct pricing. 
          Configure ad settings in the Ads section below.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Period selector (for subscriptions) */}
      {isSubscription && (
        <div>
          <label className="block text-xs text-gray-100 mb-2">Billing period</label>
          <div className="flex gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${selectedPeriod === option.value
                    ? 'bg-white text-black'
                    : 'bg-gray-150 text-gray-75 hover:text-white hover:bg-gray-125 border border-gray-125'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Custom price input */}
      <div>
        <label className="block text-xs text-gray-100 mb-2">Set your price</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-75 text-lg">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomAmountSubmit()}
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-150 border border-gray-125 text-white text-lg font-medium focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 placeholder:text-gray-100"
            />
          </div>
          <button
            onClick={handleCustomAmountSubmit}
            disabled={!customAmount || parseFloat(customAmount) <= 0}
            className="px-6 py-3 rounded-xl bg-accent-blue text-white font-medium hover:bg-accent-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Free trial (for subscriptions) */}
      {isSubscription && (
        <div className="p-4 rounded-xl bg-gray-175 border border-gray-125">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-white">Include free trial?</p>
              <p className="text-xs text-gray-100">Users can try before subscribing</p>
            </div>
            <button
              onClick={() => setHasFreeTrial(!hasFreeTrial)}
              className={`relative w-12 h-7 rounded-full transition-colors ${hasFreeTrial ? 'bg-accent-green' : 'bg-gray-125'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${hasFreeTrial ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          
          {hasFreeTrial && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3"
            >
              <span className="text-sm text-gray-75">Trial length:</span>
              <div className="flex gap-2">
                {[3, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setFreeTrialDays(days)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      freeTrialDays === days
                        ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                        : 'bg-gray-150 text-gray-75 hover:text-white border border-gray-125'
                    }`}
                  >
                    {days} days
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
      
      {/* Quick suggestions */}
      <div>
        <label className="block text-xs text-gray-100 mb-2">Quick add suggestions</label>
        <div className="flex flex-wrap gap-2">
          {getSuggestions().map((suggestion) => {
            const alreadyAdded = offer.prices.some(
              p => p.amount === suggestion.amount && p.period === selectedPeriod
            );
            return (
              <button
                key={suggestion.amount}
                onClick={() => !alreadyAdded && addPrice(suggestion.amount, suggestion.suggestedName)}
                disabled={alreadyAdded}
                className={`px-4 py-2.5 rounded-xl text-sm transition-all border ${
                  alreadyAdded
                    ? 'bg-gray-175 text-gray-100 border-gray-125 cursor-not-allowed'
                    : 'bg-gray-150 text-white hover:bg-gray-125 border-gray-125 hover:border-gray-100'
                }`}
              >
                <span className="font-medium">${suggestion.amount.toFixed(2)}</span>
                {suggestion.suggestedName && (
                  <span className="text-gray-75 ml-1.5">· {suggestion.suggestedName}</span>
                )}
                {!suggestion.suggestedName && (
                  <span className="text-gray-75 ml-1.5">· {suggestion.label}</span>
                )}
                {alreadyAdded && <Check className="w-3 h-3 inline ml-1.5 text-accent-green" />}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Current prices list */}
      {offer.prices.length > 0 && (
        <div>
          <label className="block text-xs text-gray-100 mb-2">Your prices</label>
          <div className="space-y-3">
            {offer.prices.map((price) => (
              <div key={price.id} className="p-4 rounded-xl bg-gray-150 border border-gray-125">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={price.displayName || ''}
                      onChange={(e) => updatePriceDisplayName(price.id, e.target.value)}
                      placeholder={offer.type === 'consumable' ? 'Name this tip...' : 'Name this price...'}
                      className="w-full bg-transparent text-white font-medium text-base placeholder:text-gray-100 focus:outline-none border-b border-transparent focus:border-gray-100 pb-1"
                    />
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm text-gray-75">{price.label}</span>
                      {price.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-accent-green/20 text-accent-green text-[10px] font-medium">Default</span>
                      )}
                      {price.hasFreeTrial && (
                        <span className="px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple text-[10px] font-medium">{price.freeTrialDays} day trial</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removePrice(price.id)}
                    className="p-1.5 rounded-lg text-gray-100 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  {!price.isDefault && offer.prices.length > 1 && (
                    <button
                      onClick={() => setDefaultPrice(price.id)}
                      className="px-3 py-1.5 rounded-lg text-xs text-gray-75 hover:text-white hover:bg-gray-125 transition-colors"
                    >
                      Set default
                    </button>
                  )}
                  
                  {isSubscription && (
                    <button
                      onClick={() => updatePriceTrial(price.id, !price.hasFreeTrial, price.freeTrialDays || 7)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        price.hasFreeTrial ? 'bg-accent-purple/20 text-accent-purple' : 'text-gray-75 hover:text-white hover:bg-gray-125'
                      }`}
                    >
                      {price.hasFreeTrial ? 'Remove trial' : 'Add trial'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {offer.prices.length === 0 && (
        <div className="p-6 rounded-xl bg-gray-175 border border-dashed border-gray-125 text-center">
          <p className="text-gray-75 text-sm">No prices yet. Enter a custom price or pick a suggestion above.</p>
        </div>
      )}
    </div>
  );
}

function EarnersSection({ offer }: { offer: Offer }) {
  const { updateOfferSplits } = useRevenueStore();
  
  const creatorSplit = offer.splits.find((s) => s.earner === 'creator')?.percentage || 0;
  const platformSplit = offer.splits.find((s) => s.earner === 'platform')?.percentage || 0;
  
  const updateSplits = (creatorPct: number) => {
    const platformPct = 100 - creatorPct;
    
    if (creatorPct === 0) {
      updateOfferSplits(offer.id, [{ earner: 'platform', percentage: 100 }]);
    } else if (platformPct === 0) {
      updateOfferSplits(offer.id, [{ earner: 'creator', percentage: 100 }]);
    } else {
      updateOfferSplits(offer.id, [
        { earner: 'creator', percentage: creatorPct },
        { earner: 'platform', percentage: platformPct },
      ]);
    }
  };
  
  if (!offer.linkedToCreator) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-150 border border-gray-125">
          <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
            <span className="text-lg">📱</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">100% to Platform</p>
            <p className="text-xs text-gray-100">All revenue (after Apple) goes to your platform</p>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-accent-green/20 text-xs text-accent-green font-medium">✓ Set</div>
        </div>
        
        <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-175 border border-gray-125">
          <div className="w-8 h-8 rounded-lg bg-gray-125 flex items-center justify-center text-lg">🍎</div>
          <div className="flex-1">
            <p className="text-sm text-white">Apple keeps 30%</p>
            <p className="text-xs text-gray-100">Applied automatically before splits</p>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-gray-125 text-xs text-gray-75">Fixed</div>
        </div>
      </div>
    );
  }
  
  const presets = [
    { label: '50/50', creator: 50 },
    { label: '70% Creator', creator: 70 },
    { label: '80% Creator', creator: 80 },
    { label: '90% Creator', creator: 90 },
  ];
  
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => updateSplits(preset.creator)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              creatorSplit === preset.creator
                ? 'bg-white text-black'
                : 'bg-gray-150 text-gray-75 hover:text-white hover:bg-gray-125 border border-gray-125'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎬</span>
            <span className="text-gray-75">Creator</span>
          </div>
          <span className="text-white font-medium">{creatorSplit}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={creatorSplit}
          onChange={(e) => updateSplits(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <span className="text-gray-75">Platform</span>
          </div>
          <span className="text-white font-medium">{platformSplit}%</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-175 border border-gray-125">
        <div className="w-8 h-8 rounded-lg bg-gray-125 flex items-center justify-center text-lg">🍎</div>
        <div className="flex-1">
          <p className="text-sm text-white">Apple keeps 30%</p>
          <p className="text-xs text-gray-100">Applied automatically before splits</p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-gray-125 text-xs text-gray-75">Fixed</div>
      </div>
    </div>
  );
}

function PayoutSection({ offer }: { offer: Offer }) {
  const { updateOfferPayout } = useRevenueStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const timingOptions: { value: PayoutTiming; label: string; description: string }[] = [
    { value: 'instant', label: 'Instant', description: 'Paid out immediately' },
    { value: 'weekly', label: 'Weekly', description: 'Every Friday' },
    { value: 'monthly', label: 'Monthly', description: 'End of month' },
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {timingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => updateOfferPayout(offer.id, option.value)}
            className={`p-4 rounded-xl text-left transition-all border ${
              offer.payoutTiming === option.value
                ? 'bg-white text-black border-white'
                : 'bg-gray-150 text-white hover:bg-gray-125 border-gray-125'
            }`}
          >
            <p className="text-sm font-medium mb-0.5">{option.label}</p>
            <p className={`text-xs ${offer.payoutTiming === option.value ? 'text-gray-600' : 'text-gray-75'}`}>
              {option.description}
            </p>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-xs text-gray-100 hover:text-white transition-colors"
      >
        {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        Advanced options
      </button>
      
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-gray-175 border border-gray-125 space-y-3">
              <label className="block">
                <span className="text-xs text-gray-75 mb-1 block">Hold period (days)</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={offer.payoutHoldDays || 0}
                  onChange={(e) => updateOfferPayout(offer.id, offer.payoutTiming, parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-150 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-blue"
                />
              </label>
              <p className="text-xs text-gray-100">
                Hold funds for a buffer period before payout (e.g., for fraud prevention)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RefundSection({ offer }: { offer: Offer }) {
  const { updateOfferRefund } = useRevenueStore();
  
  const refundOptions: { value: RefundBehavior; label: string; description: string }[] = [
    { value: 'full-revoke', label: 'Full refund & revoke', description: 'User gets full refund, access revoked immediately' },
    { value: 'prorated', label: 'Prorated refund', description: 'Refund based on remaining time' },
    { value: 'no-refund', label: 'No refunds', description: 'Non-refundable (typical for consumables)' },
  ];
  
  const afterPayoutOptions: { value: RefundAfterPayout; label: string; description: string }[] = [
    { value: 'deduct-next', label: 'Deduct from next payout', description: 'Refund amount deducted from creator\'s next payout' },
    { value: 'platform-covers', label: 'Platform covers', description: 'Platform absorbs the refund cost' },
  ];
  
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        {refundOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => updateOfferRefund(offer.id, option.value, offer.refundAfterPayout)}
            className={`w-full p-4 rounded-xl text-left transition-all border ${
              offer.refundBehavior === option.value
                ? 'bg-white text-black border-white'
                : 'bg-gray-150 text-white hover:bg-gray-125 border-gray-125'
            }`}
          >
            <p className="text-sm font-medium mb-0.5">{option.label}</p>
            <p className={`text-xs ${offer.refundBehavior === option.value ? 'text-gray-600' : 'text-gray-75'}`}>
              {option.description}
            </p>
          </button>
        ))}
      </div>
      
      {offer.linkedToCreator && offer.refundBehavior !== 'no-refund' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-yellow" />
            <p className="text-sm text-white">If refund happens after creator payout:</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {afterPayoutOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateOfferRefund(offer.id, offer.refundBehavior, option.value)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  offer.refundAfterPayout === option.value
                    ? 'bg-accent-yellow/10 text-white border-accent-yellow/30'
                    : 'bg-gray-150 text-white hover:bg-gray-125 border-gray-125'
                }`}
              >
                <p className="text-xs font-medium">{option.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MONEY SUMMARY CARD
// ============================================================================

function MoneySummaryCard({ offer }: { offer: Offer }) {
  const { getOfferMoneySummary } = useRevenueStore();
  const summary = getOfferMoneySummary(offer.id);
  
  if (!summary) {
    return (
      <div className="p-4 rounded-2xl bg-gray-150 border border-gray-125">
        <p className="text-sm text-gray-75 text-center">Add a price to see money breakdown</p>
      </div>
    );
  }
  
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-gray-150 to-gray-175 border border-gray-125"
    >
      <h4 className="text-xs font-medium text-gray-100 uppercase tracking-wide mb-4">Money Breakdown</h4>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-75">User pays</span>
          <span className="text-lg font-bold text-white">{formatCurrency(summary.userPays)}</span>
        </div>
        
        <div className="h-px bg-gray-125" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍎</span>
            <span className="text-sm text-gray-75">Apple keeps</span>
          </div>
          <span className="text-sm text-gray-100">−{formatCurrency(summary.appleKeeps)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-75">Remaining</span>
          <span className="text-white">{formatCurrency(summary.remaining)}</span>
        </div>
        
        <div className="h-px bg-gray-125" />
        
        {summary.creatorGets > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-accent-purple/20 flex items-center justify-center">
                <span className="text-xs">🎬</span>
              </div>
              <span className="text-sm text-gray-75">Creator gets</span>
            </div>
            <span className="text-sm font-medium text-accent-purple">{formatCurrency(summary.creatorGets)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent-green/20 flex items-center justify-center">
              <span className="text-xs">📱</span>
            </div>
            <span className="text-sm text-gray-75">Platform gets</span>
          </div>
          <span className="text-sm font-medium text-accent-green">{formatCurrency(summary.platformGets)}</span>
        </div>
        
        <div className="h-px bg-gray-125" />
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-75">Payout</span>
          <span className="text-sm text-white">{summary.payoutTiming}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN EDITOR COMPONENT
// ============================================================================

export default function OfferEditor() {
  const { getSelectedOffer, closeOfferEditor, editorSection, updateOffer } = useRevenueStore();
  const offer = getSelectedOffer();
  
  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    price: useRef<HTMLDivElement>(null),
    earners: useRef<HTMLDivElement>(null),
    payout: useRef<HTMLDivElement>(null),
    refund: useRef<HTMLDivElement>(null),
    unlock: useRef<HTMLDivElement>(null),
    moderation: useRef<HTMLDivElement>(null),
    subscription: useRef<HTMLDivElement>(null),
    ads: useRef<HTMLDivElement>(null),
    promo: useRef<HTMLDivElement>(null),
    departure: useRef<HTMLDivElement>(null),
  };
  
  useEffect(() => {
    if (editorSection && sectionRefs[editorSection]?.current) {
      sectionRefs[editorSection].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editorSection]);
  
  if (!offer) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-75">No offer selected</p>
      </div>
    );
  }
  
  // Build sections dynamically based on offer characteristics
  const sections = [
    { 
      id: 'price' as const, 
      icon: <DollarSign className="w-4 h-4" />, 
      title: offer.type === 'ad-supported' ? 'Pricing (N/A for Ads)' : 'How much does this cost?',
      component: <PriceSection offer={offer} />,
      show: true,
    },
    { 
      id: 'earners' as const, 
      icon: <Users className="w-4 h-4" />, 
      title: offer.linkedToCreator ? 'Who should earn from this?' : 'Revenue split',
      component: <EarnersSection offer={offer} />,
      show: true,
    },
    {
      id: 'unlock' as const,
      icon: <Unlock className="w-4 h-4" />,
      title: 'Alternative unlock paths',
      subtitle: 'Payment OR engagement',
      component: <UnlockConditionsSection offer={offer} />,
      show: offer.linkedToCreator && offer.type === 'subscription',
      highlight: true,
    },
    { 
      id: 'payout' as const, 
      icon: <Clock className="w-4 h-4" />, 
      title: offer.linkedToCreator ? 'When should creators get paid?' : 'When do payouts happen?',
      component: <PayoutSection offer={offer} />,
      show: offer.linkedToCreator,
    },
    { 
      id: 'refund' as const, 
      icon: <AlertTriangle className="w-4 h-4" />, 
      title: 'If something goes wrong',
      component: <RefundSection offer={offer} />,
      show: true,
    },
    {
      id: 'moderation' as const,
      icon: <Shield className="w-4 h-4" />,
      title: 'User bans & moderation',
      subtitle: 'What happens when users get banned?',
      component: <ModerationPolicySection offer={offer} />,
      show: offer.linkedToCreator,
      highlight: true,
    },
    {
      id: 'subscription' as const,
      icon: <Settings className="w-4 h-4" />,
      title: 'Subscription edge cases',
      subtitle: 'Grace periods, billing retry, plan changes',
      component: <SubscriptionEdgeCases offer={offer} />,
      show: offer.type === 'subscription',
      highlight: true,
    },
    {
      id: 'ads' as const,
      icon: <Tv className="w-4 h-4" />,
      title: 'Ad revenue setup',
      subtitle: 'Networks, placements, frequency',
      component: <AdRevenueSetup offer={offer} />,
      show: offer.type === 'ad-supported',
      highlight: true,
    },
    {
      id: 'departure' as const,
      icon: <UserX className="w-4 h-4" />,
      title: 'Creator departure',
      subtitle: 'What if creator leaves or gets banned?',
      component: <CreatorDepartureSection offer={offer} />,
      show: offer.linkedToCreator,
      highlight: true,
    },
  ].filter(section => section.show);
  
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main editor area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-8">
          {/* Back button */}
          <button
            onClick={closeOfferEditor}
            className="flex items-center gap-2 text-sm text-gray-75 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Offers
          </button>
          
          {/* Sticky offer header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-10 -mx-8 px-8 py-4 bg-gray-175/95 backdrop-blur-sm border-b border-gray-125 mb-8"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${offer.color}20` }}
              >
                {offer.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white">{offer.name}</h1>
                <p className="text-sm text-gray-75">
                  {offer.prices.find((p) => p.isDefault)?.label || (offer.type === 'ad-supported' ? 'Ad-supported' : 'No price set')}
                  {offer.linkedToCreator && ' • Creator-linked'}
                </p>
              </div>
              {offer.unlockConditions && offer.unlockConditions.length > 1 && (
                <div className="px-3 py-1.5 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Multiple unlock paths
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                ref={sectionRefs[section.id]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`flex items-center gap-3 mb-4 ${section.highlight ? 'pb-3 border-b border-gray-125' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    section.highlight ? 'bg-accent-purple/20 text-accent-purple' : 'bg-gray-150 text-gray-75'
                  }`}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-base font-medium text-white">{section.title}</h2>
                    {section.subtitle && (
                      <p className="text-xs text-gray-100">{section.subtitle}</p>
                    )}
                  </div>
                  {section.highlight && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple text-[10px] font-medium">
                      Edge Case
                    </span>
                  )}
                </div>
                {section.component}
              </motion.div>
            ))}
          </div>
          
          {/* Mark as configured button */}
          {!offer.isConfigured && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 pt-6 border-t border-gray-125"
            >
              <button
                onClick={() => updateOffer(offer.id, { isConfigured: true, status: 'ready' })}
                className="w-full py-3 rounded-xl bg-accent-green text-white font-medium hover:bg-accent-green/90 transition-colors"
              >
                Mark as Ready
              </button>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Sidebar with Money Summary */}
      <div className="w-80 border-l border-gray-125 bg-gray-175 p-6 overflow-y-auto">
        <MoneySummaryCard offer={offer} />
        
        {/* Quick info */}
        <div className="mt-6 p-4 rounded-xl bg-gray-150 border border-gray-125">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-accent-blue" />
            <span className="text-xs font-medium text-white">How this works</span>
          </div>
          <p className="text-xs text-gray-75 leading-relaxed">
            When a user buys this offer, Apple takes 30% first. The remaining 70% is split according to your configuration above.
          </p>
        </div>
        
        {/* Edge case summary */}
        {offer.linkedToCreator && (
          <div className="mt-4 p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent-purple" />
              <span className="text-xs font-medium text-white">Edge Cases Configured</span>
            </div>
            <ul className="text-xs text-gray-75 space-y-1">
              <li className="flex items-center gap-2">
                {offer.moderationPolicy?.enabled ? (
                  <Check className="w-3 h-3 text-accent-green" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-accent-yellow" />
                )}
                Ban/moderation handling
              </li>
              {offer.type === 'subscription' && (
                <li className="flex items-center gap-2">
                  {offer.subscriptionConfig?.gracePeriod?.enabled ? (
                    <Check className="w-3 h-3 text-accent-green" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-accent-yellow" />
                  )}
                  Payment grace period
                </li>
              )}
              <li className="flex items-center gap-2">
                {offer.creatorDeparturePolicy ? (
                  <Check className="w-3 h-3 text-accent-green" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-accent-yellow" />
                )}
                Creator departure policy
              </li>
              {offer.unlockConditions && offer.unlockConditions.length > 1 && (
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-accent-green" />
                  Alternative unlock paths
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
