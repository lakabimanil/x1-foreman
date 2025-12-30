'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Info, AlertTriangle, Check, Sparkles } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { 
  Offer, 
  UnlockCondition, 
  UnlockConditionType, 
  UnlockLogic,
  UNLOCK_CONDITION_LABELS 
} from '@/types/revenue';

const UNLOCK_TYPES: { type: UnlockConditionType; title: string; description: string; icon: string }[] = [
  { type: 'payment', title: 'Purchase', description: 'Standard payment unlock', icon: '💳' },
  { type: 'engagement', title: 'Engagement', description: 'Unlock through activity (likes, comments)', icon: '❤️' },
  { type: 'achievement', title: 'Achievement', description: 'Complete challenges or milestones', icon: '🏆' },
  { type: 'referral', title: 'Referral', description: 'Invite friends to unlock', icon: '👥' },
  { type: 'time-based', title: 'Loyalty', description: 'Been a member for X days', icon: '📅' },
  { type: 'creator-gift', title: 'Creator Gift', description: 'Creator manually unlocks', icon: '🎁' },
  { type: 'promotional', title: 'Promo Code', description: 'Use a promotional code', icon: '🎟️' },
];

const ENGAGEMENT_METRICS = [
  { value: 'likes_received', label: 'Likes received on comments', icon: '❤️' },
  { value: 'comments', label: 'Comments made', icon: '💬' },
  { value: 'watch_time', label: 'Hours watched', icon: '⏱️' },
  { value: 'streams_attended', label: 'Streams attended', icon: '📺' },
];

interface Props {
  offer: Offer;
}

export default function UnlockConditionsSection({ offer }: Props) {
  const { updateUnlockConditions } = useRevenueStore();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const conditions = offer.unlockConditions || [];
  const logic = offer.unlockLogic || 'any';
  
  // Check if there's a free unlock path alongside payment
  const hasPaymentPath = conditions.some(c => c.type === 'payment' && c.enabled);
  const hasFreePath = conditions.some(c => c.type !== 'payment' && c.enabled);
  const hasMixedPaths = hasPaymentPath && hasFreePath;
  
  const addCondition = (type: UnlockConditionType) => {
    const newCondition: UnlockCondition = {
      id: `unlock-${Date.now()}`,
      type,
      enabled: true,
      unlockDuration: type === 'payment' ? 'monthly' : 'monthly',
      unlockMessage: getDefaultMessage(type),
    };
    
    // Set defaults based on type
    if (type === 'engagement') {
      newCondition.engagementMetric = 'likes_received';
      newCondition.engagementThreshold = 10;
      newCondition.engagementWindow = 'monthly';
    } else if (type === 'referral') {
      newCondition.referralCount = 3;
    } else if (type === 'time-based') {
      newCondition.membershipDays = 30;
    } else if (type === 'promotional') {
      newCondition.promoCodeRequired = true;
    }
    
    updateUnlockConditions(offer.id, [...conditions, newCondition], logic);
    setShowAddModal(false);
  };
  
  const removeCondition = (conditionId: string) => {
    updateUnlockConditions(
      offer.id,
      conditions.filter(c => c.id !== conditionId),
      logic
    );
  };
  
  const updateCondition = (conditionId: string, updates: Partial<UnlockCondition>) => {
    updateUnlockConditions(
      offer.id,
      conditions.map(c => c.id === conditionId ? { ...c, ...updates } : c),
      logic
    );
  };
  
  const toggleCondition = (conditionId: string) => {
    const condition = conditions.find(c => c.id === conditionId);
    if (condition) {
      updateCondition(conditionId, { enabled: !condition.enabled });
    }
  };
  
  const setLogic = (newLogic: UnlockLogic) => {
    updateUnlockConditions(offer.id, conditions, newLogic);
  };
  
  // Add default payment condition if none exists
  const ensurePaymentCondition = () => {
    if (!conditions.some(c => c.type === 'payment')) {
      addCondition('payment');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent-purple flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white mb-1">Alternative Unlock Paths</p>
            <p className="text-xs text-gray-75">
              Users can unlock this offer through payment OR engagement. For example: pay $4.99/month 
              <span className="text-accent-purple"> OR </span> 
              earn 10 likes on comments.
            </p>
          </div>
        </div>
      </div>
      
      {/* Logic selector (show only if multiple conditions) */}
      {conditions.length > 1 && (
        <div className="p-4 rounded-xl bg-gray-150 border border-gray-125">
          <p className="text-sm font-medium text-white mb-3">How should unlock conditions work?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setLogic('any')}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                logic === 'any'
                  ? 'border-accent-purple bg-accent-purple/10'
                  : 'border-gray-125 hover:border-gray-100'
              }`}
            >
              <p className="text-sm font-medium text-white">ANY condition</p>
              <p className="text-xs text-gray-75 mt-1">User needs to meet just ONE</p>
            </button>
            <button
              onClick={() => setLogic('all')}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                logic === 'all'
                  ? 'border-accent-purple bg-accent-purple/10'
                  : 'border-gray-125 hover:border-gray-100'
              }`}
            >
              <p className="text-sm font-medium text-white">ALL conditions</p>
              <p className="text-xs text-gray-75 mt-1">User needs to meet every one</p>
            </button>
          </div>
        </div>
      )}
      
      {/* Warning for mixed paths */}
      {hasMixedPaths && logic === 'any' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent-yellow flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-1">Free unlock path active</p>
              <p className="text-xs text-gray-75">
                Users can unlock this without paying. This is great for engagement, but make sure 
                the engagement threshold is meaningful (e.g., 10+ likes shows genuine participation).
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Conditions list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {conditions.map((condition, index) => (
            <motion.div
              key={condition.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
            >
              <ConditionCard
                condition={condition}
                onUpdate={(updates) => updateCondition(condition.id, updates)}
                onRemove={() => removeCondition(condition.id)}
                onToggle={() => toggleCondition(condition.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Add condition button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full p-4 rounded-xl border-2 border-dashed border-gray-125 hover:border-gray-100 bg-gray-175/50 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus className="w-4 h-4 text-gray-100 group-hover:text-white" />
          <span className="text-sm text-gray-100 group-hover:text-white">
            Add unlock condition
          </span>
        </button>
      </div>
      
      {/* Empty state */}
      {conditions.length === 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-gray-75 mb-3">No unlock conditions yet</p>
          <p className="text-xs text-gray-100">
            Add at least a payment condition, or create alternative unlock paths like engagement
          </p>
        </div>
      )}
      
      {/* Add Condition Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-gray-175 rounded-2xl border border-gray-125 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Add Unlock Condition</h3>
              <div className="space-y-2">
                {UNLOCK_TYPES.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addCondition(item.type)}
                    className="w-full p-3 rounded-xl bg-gray-150 border border-gray-125 hover:border-gray-100 transition-all text-left flex items-center gap-3 group"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-gray-75">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full mt-4 py-2 text-sm text-gray-75 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Individual condition card
function ConditionCard({ 
  condition, 
  onUpdate, 
  onRemove, 
  onToggle 
}: { 
  condition: UnlockCondition;
  onUpdate: (updates: Partial<UnlockCondition>) => void;
  onRemove: () => void;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  
  const getTypeInfo = () => UNLOCK_TYPES.find(t => t.type === condition.type) || UNLOCK_TYPES[0];
  const typeInfo = getTypeInfo();
  
  return (
    <div className={`rounded-xl border transition-all ${
      condition.enabled 
        ? 'bg-gray-150 border-gray-125' 
        : 'bg-gray-175/50 border-gray-125/50 opacity-60'
    }`}>
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            condition.enabled
              ? 'bg-accent-green border-accent-green'
              : 'border-gray-100'
          }`}
        >
          {condition.enabled && <Check className="w-3 h-3 text-white" />}
        </button>
        
        <span className="text-xl">{typeInfo.icon}</span>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{typeInfo.title}</p>
          <p className="text-xs text-gray-75">{getConditionSummary(condition)}</p>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 rounded-lg text-xs text-gray-75 hover:text-white hover:bg-gray-125 transition-colors"
        >
          {expanded ? 'Less' : 'Configure'}
        </button>
        
        {condition.type !== 'payment' && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg text-gray-100 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Expanded configuration */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-gray-125 space-y-4">
              {/* Engagement-specific options */}
              {condition.type === 'engagement' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-75 mb-2">What counts?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ENGAGEMENT_METRICS.map((metric) => (
                        <button
                          key={metric.value}
                          onClick={() => onUpdate({ engagementMetric: metric.value as UnlockCondition['engagementMetric'] })}
                          className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                            condition.engagementMetric === metric.value
                              ? 'bg-accent-purple/10 border-accent-purple/30 text-white'
                              : 'bg-gray-175 border-gray-125 text-gray-75 hover:text-white'
                          }`}
                        >
                          <span className="mr-1.5">{metric.icon}</span>
                          {metric.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-75 mb-2">
                      How many {condition.engagementMetric?.replace(/_/g, ' ')}?
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={condition.engagementThreshold || 10}
                      onChange={(e) => onUpdate({ engagementThreshold: parseInt(e.target.value) || 10 })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-175 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-75 mb-2">Time window</label>
                    <div className="flex gap-2">
                      {(['all-time', 'monthly', 'weekly'] as const).map((window) => (
                        <button
                          key={window}
                          onClick={() => onUpdate({ engagementWindow: window })}
                          className={`flex-1 py-2 rounded-lg text-xs transition-all border ${
                            condition.engagementWindow === window
                              ? 'bg-accent-purple/10 border-accent-purple/30 text-white'
                              : 'bg-gray-175 border-gray-125 text-gray-75 hover:text-white'
                          }`}
                        >
                          {window === 'all-time' ? 'All time' : window.charAt(0).toUpperCase() + window.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Referral-specific */}
              {condition.type === 'referral' && (
                <div>
                  <label className="block text-xs text-gray-75 mb-2">Friends to invite</label>
                  <input
                    type="number"
                    min="1"
                    value={condition.referralCount || 3}
                    onChange={(e) => onUpdate({ referralCount: parseInt(e.target.value) || 3 })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-175 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
              )}
              
              {/* Time-based specific */}
              {condition.type === 'time-based' && (
                <div>
                  <label className="block text-xs text-gray-75 mb-2">Days as member</label>
                  <input
                    type="number"
                    min="1"
                    value={condition.membershipDays || 30}
                    onChange={(e) => onUpdate({ membershipDays: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-175 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
              )}
              
              {/* Unlock duration */}
              <div>
                <label className="block text-xs text-gray-75 mb-2">How long does unlock last?</label>
                <div className="flex gap-2">
                  {(['permanent', 'monthly', 'weekly'] as const).map((duration) => (
                    <button
                      key={duration}
                      onClick={() => onUpdate({ unlockDuration: duration })}
                      className={`flex-1 py-2 rounded-lg text-xs transition-all border ${
                        condition.unlockDuration === duration
                          ? 'bg-accent-green/10 border-accent-green/30 text-white'
                          : 'bg-gray-175 border-gray-125 text-gray-75 hover:text-white'
                      }`}
                    >
                      {duration.charAt(0).toUpperCase() + duration.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Custom message */}
              <div>
                <label className="block text-xs text-gray-75 mb-2">Success message</label>
                <input
                  type="text"
                  value={condition.unlockMessage || ''}
                  onChange={(e) => onUpdate({ unlockMessage: e.target.value })}
                  placeholder="Congratulations! You've unlocked..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-175 border border-gray-125 text-white text-sm placeholder:text-gray-100 focus:outline-none focus:border-accent-purple"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper functions
function getConditionSummary(condition: UnlockCondition): string {
  switch (condition.type) {
    case 'payment':
      return 'Standard payment required';
    case 'engagement':
      const metric = condition.engagementMetric?.replace(/_/g, ' ') || 'activity';
      return `${condition.engagementThreshold || 0} ${metric} (${condition.engagementWindow || 'monthly'})`;
    case 'referral':
      return `Invite ${condition.referralCount || 0} friends`;
    case 'time-based':
      return `Member for ${condition.membershipDays || 0} days`;
    case 'achievement':
      return 'Complete specific achievements';
    case 'creator-gift':
      return 'Creator can grant access manually';
    case 'promotional':
      return 'Valid promo code required';
    default:
      return 'Configure this condition';
  }
}

function getDefaultMessage(type: UnlockConditionType): string {
  switch (type) {
    case 'payment':
      return 'Thanks for subscribing!';
    case 'engagement':
      return 'Congrats! Your engagement earned you this access!';
    case 'referral':
      return 'Thanks for spreading the word!';
    case 'time-based':
      return 'Your loyalty has been rewarded!';
    case 'achievement':
      return 'Achievement unlocked!';
    case 'creator-gift':
      return 'The creator gifted you this access!';
    case 'promotional':
      return 'Promo code applied successfully!';
    default:
      return 'Access unlocked!';
  }
}
