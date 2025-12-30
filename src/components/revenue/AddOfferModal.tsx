'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, CreditCard, Zap, Tv } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { Offer, OfferType } from '@/types/revenue';

const offerTypes: { 
  type: OfferType; 
  label: string; 
  description: string; 
  icon: React.ReactNode;
  examples: string[];
}[] = [
  { 
    type: 'subscription', 
    label: 'Subscription', 
    description: 'Recurring payment (weekly, monthly, yearly)',
    icon: <CreditCard className="w-5 h-5" />,
    examples: ['Pro access', 'Premium features', 'Ad-free experience'],
  },
  { 
    type: 'one-time', 
    label: 'One-time Purchase', 
    description: 'Single payment for permanent access',
    icon: <ShoppingBag className="w-5 h-5" />,
    examples: ['Lifetime Pro', 'Remove Ads', 'Unlock feature'],
  },
  { 
    type: 'consumable', 
    label: 'Consumable', 
    description: 'Can be purchased multiple times',
    icon: <Zap className="w-5 h-5" />,
    examples: ['Tips', 'Coins', 'Tokens', 'Credits'],
  },
  { 
    type: 'ad-supported', 
    label: 'Ads Revenue', 
    description: 'Revenue from advertisers',
    icon: <Tv className="w-5 h-5" />,
    examples: ['Display ads', 'Video ads', 'Sponsored content'],
  },
];

const defaultIcons = ['💜', '⭐', '💎', '⚡', '🎁', '🔥', '✨', '🚀'];
const defaultColors = ['#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#EF4444'];

export default function AddOfferModal() {
  const { isAddingOffer, setAddingOffer, addOffer, getCurrentScenario } = useRevenueStore();
  const scenario = getCurrentScenario();
  
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<OfferType | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(defaultIcons[0]);
  const [color, setColor] = useState(defaultColors[0]);
  const [linkedToCreator, setLinkedToCreator] = useState(false);
  
  const resetAndClose = () => {
    setStep('type');
    setSelectedType(null);
    setName('');
    setDescription('');
    setIcon(defaultIcons[0]);
    setColor(defaultColors[0]);
    setLinkedToCreator(false);
    setAddingOffer(false);
  };
  
  const handleSelectType = (type: OfferType) => {
    setSelectedType(type);
    setStep('details');
    
    // Set sensible defaults
    if (type === 'consumable') {
      setLinkedToCreator(scenario.id === 'livestream');
    }
  };
  
  const handleCreate = () => {
    if (!selectedType || !name.trim()) return;
    
    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      name: name.trim(),
      icon,
      type: selectedType,
      description: description.trim() || `${name} offer`,
      status: 'draft',
      isConfigured: false,
      prices: [],
      splits: linkedToCreator 
        ? [
            { earner: 'creator', percentage: 70 },
            { earner: 'platform', percentage: 30 },
          ]
        : [{ earner: 'platform', percentage: 100 }],
      payoutTiming: 'weekly',
      refundBehavior: selectedType === 'consumable' ? 'no-refund' : 'full-revoke',
      color,
      linkedToCreator,
    };
    
    addOffer(newOffer);
    resetAndClose();
  };
  
  if (!isAddingOffer) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-gray-175 rounded-2xl border border-gray-125 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-125">
            <h2 className="text-lg font-semibold text-white">
              {step === 'type' ? 'Add New Offer' : 'Offer Details'}
            </h2>
            <button
              onClick={resetAndClose}
              className="w-8 h-8 rounded-lg bg-gray-150 flex items-center justify-center text-gray-75 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-5">
            {step === 'type' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-75 mb-4">
                  What type of offer do you want to create?
                </p>
                {offerTypes.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleSelectType(item.type)}
                    className="w-full p-4 rounded-xl bg-gray-150 border border-gray-125 hover:border-gray-100 transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-125 flex items-center justify-center text-gray-75 group-hover:text-white transition-colors">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white mb-0.5">
                          {item.label}
                        </h3>
                        <p className="text-xs text-gray-75 mb-2">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-gray-100">
                          e.g. {item.examples.join(', ')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {step === 'details' && (
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs text-gray-75 mb-2">Offer Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pro Subscription"
                    className="w-full px-4 py-3 rounded-xl bg-gray-150 border border-gray-125 text-white placeholder-gray-100 focus:outline-none focus:border-accent-blue"
                    autoFocus
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-xs text-gray-75 mb-2">Description (optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this offer"
                    className="w-full px-4 py-3 rounded-xl bg-gray-150 border border-gray-125 text-white placeholder-gray-100 focus:outline-none focus:border-accent-blue"
                  />
                </div>
                
                {/* Icon */}
                <div>
                  <label className="block text-xs text-gray-75 mb-2">Icon</label>
                  <div className="flex gap-2">
                    {defaultIcons.map((i) => (
                      <button
                        key={i}
                        onClick={() => setIcon(i)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                          icon === i 
                            ? 'bg-white text-black scale-110' 
                            : 'bg-gray-150 hover:bg-gray-125'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Color */}
                <div>
                  <label className="block text-xs text-gray-75 mb-2">Color</label>
                  <div className="flex gap-2">
                    {defaultColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-175' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Creator-linked toggle */}
                {scenario.id === 'livestream' && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-150 border border-gray-125">
                    <div>
                      <p className="text-sm text-white">Link to Creator</p>
                      <p className="text-xs text-gray-75">Revenue will be shared with creators</p>
                    </div>
                    <button
                      onClick={() => setLinkedToCreator(!linkedToCreator)}
                      className={`w-12 h-7 rounded-full transition-colors ${
                        linkedToCreator ? 'bg-accent-purple' : 'bg-gray-125'
                      }`}
                    >
                      <motion.div
                        animate={{ x: linkedToCreator ? 22 : 2 }}
                        className="w-5 h-5 rounded-full bg-white"
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between p-5 border-t border-gray-125">
            {step === 'details' ? (
              <>
                <button
                  onClick={() => setStep('type')}
                  className="px-4 py-2 rounded-xl text-sm text-gray-75 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    name.trim()
                      ? 'bg-white text-black hover:bg-gray-50'
                      : 'bg-gray-150 text-gray-100 cursor-not-allowed'
                  }`}
                >
                  Create Offer
                </button>
              </>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
