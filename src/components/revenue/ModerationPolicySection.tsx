'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Ban, Clock, DollarSign, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { 
  Offer, 
  ModerationPolicy, 
  BanRefundPolicy, 
  BanAccessPolicy,
  BanType,
} from '@/types/revenue';

const BAN_SCENARIOS = [
  { 
    id: 'spam', 
    name: 'Spamming', 
    severity: 'temporary' as BanType,
    description: 'User sends repetitive messages',
    icon: '💬'
  },
  { 
    id: 'harassment', 
    name: 'Harassment', 
    severity: 'permanent' as BanType,
    description: 'User harasses other users or creators',
    icon: '⚠️'
  },
  { 
    id: 'tos-violation', 
    name: 'TOS Violation', 
    severity: 'permanent' as BanType,
    description: 'User violates terms of service',
    icon: '📜'
  },
  { 
    id: 'chargebacks', 
    name: 'Excessive Chargebacks', 
    severity: 'permanent' as BanType,
    description: 'User files fraudulent chargebacks',
    icon: '💳'
  },
  { 
    id: 'creator-ban', 
    name: 'Banned by Creator', 
    severity: 'temporary' as BanType,
    description: 'Individual creator bans user from their content',
    icon: '🚫'
  },
];

const REFUND_OPTIONS: { value: BanRefundPolicy; label: string; description: string }[] = [
  { value: 'full-refund', label: 'Full Refund', description: 'Refund remaining subscription value' },
  { value: 'prorated-refund', label: 'Prorated', description: 'Refund based on remaining days' },
  { value: 'no-refund', label: 'No Refund', description: 'TOS violation, no refund owed' },
  { value: 'case-by-case', label: 'Case by Case', description: 'Manual review for each ban' },
];

const ACCESS_OPTIONS: { value: BanAccessPolicy; label: string; description: string }[] = [
  { value: 'immediate-revoke', label: 'Immediate Revoke', description: 'Access removed instantly' },
  { value: 'grace-period', label: 'Grace Period', description: 'X days to appeal before revoke' },
  { value: 'downgrade-to-free', label: 'Downgrade', description: 'Keep free tier access only' },
];

interface Props {
  offer: Offer;
}

export default function ModerationPolicySection({ offer }: Props) {
  const { updateModerationPolicy } = useRevenueStore();
  const [expandedSection, setExpandedSection] = useState<'temp' | 'perm' | 'creator' | null>('temp');
  const [showScenario, setShowScenario] = useState<string | null>(null);
  
  // Default policy if not set
  const policy: ModerationPolicy = offer.moderationPolicy || {
    enabled: false,
    temporaryBan: {
      refundPolicy: 'no-refund',
      accessPolicy: 'immediate-revoke',
      gracePeriodDays: 0,
      pauseSubscription: false,
    },
    permanentBan: {
      refundPolicy: 'no-refund',
      accessPolicy: 'immediate-revoke',
      appealWindowDays: 7,
    },
    creatorBan: {
      refundPolicy: 'prorated-refund',
      canResubscribe: false,
      cooldownDays: 30,
    },
  };
  
  const updatePolicy = (updates: Partial<ModerationPolicy>) => {
    updateModerationPolicy(offer.id, { ...policy, ...updates });
  };
  
  const updateTempBan = (updates: Partial<ModerationPolicy['temporaryBan']>) => {
    updatePolicy({ temporaryBan: { ...policy.temporaryBan, ...updates } });
  };
  
  const updatePermBan = (updates: Partial<ModerationPolicy['permanentBan']>) => {
    updatePolicy({ permanentBan: { ...policy.permanentBan, ...updates } });
  };
  
  const updateCreatorBan = (updates: Partial<ModerationPolicy['creatorBan']>) => {
    updatePolicy({ creatorBan: { ...policy.creatorBan, ...updates } });
  };
  
  const toggleEnabled = () => {
    updatePolicy({ enabled: !policy.enabled });
  };
  
  const getScenarioOutcome = (scenarioId: string) => {
    const scenario = BAN_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return null;
    
    if (scenarioId === 'creator-ban') {
      return {
        refund: policy.creatorBan.refundPolicy,
        access: 'Blocked from this creator only',
        additional: policy.creatorBan.canResubscribe 
          ? `Can resubscribe after ${policy.creatorBan.cooldownDays} days` 
          : 'Cannot resubscribe to this creator',
      };
    }
    
    const banPolicy = scenario.severity === 'temporary' ? policy.temporaryBan : policy.permanentBan;
    return {
      refund: banPolicy.refundPolicy,
      access: banPolicy.accessPolicy === 'immediate-revoke' 
        ? 'Immediate' 
        : banPolicy.accessPolicy === 'grace-period'
          ? `${scenario.severity === 'temporary' ? policy.temporaryBan.gracePeriodDays : policy.permanentBan.appealWindowDays} day grace period`
          : 'Downgraded to free',
      additional: scenario.severity === 'temporary' && policy.temporaryBan.pauseSubscription
        ? 'Subscription paused during ban'
        : scenario.severity === 'permanent'
          ? `${policy.permanentBan.appealWindowDays} days to appeal`
          : '',
    };
  };
  
  return (
    <div className="space-y-6">
      {/* Main toggle */}
      <div className="p-4 rounded-xl bg-gray-150 border border-gray-125 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            policy.enabled ? 'bg-accent-green/20' : 'bg-gray-125'
          }`}>
            <Shield className={`w-5 h-5 ${policy.enabled ? 'text-accent-green' : 'text-gray-75'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Moderation Policy</p>
            <p className="text-xs text-gray-75">Define what happens when users are banned</p>
          </div>
        </div>
        <button
          onClick={toggleEnabled}
          className={`w-12 h-7 rounded-full transition-colors ${
            policy.enabled ? 'bg-accent-green' : 'bg-gray-125'
          }`}
        >
          <motion.div
            animate={{ x: policy.enabled ? 22 : 2 }}
            className="w-5 h-5 rounded-full bg-white"
          />
        </button>
      </div>
      
      {/* Policy sections (only show if enabled) */}
      {policy.enabled && (
        <>
          {/* Scenario Examples */}
          <div className="p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Test Your Policies</p>
                <p className="text-xs text-gray-75">
                  Click a scenario to see what would happen with your current settings
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {BAN_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setShowScenario(showScenario === scenario.id ? null : scenario.id)}
                  className={`px-3 py-2 rounded-lg text-xs transition-all ${
                    showScenario === scenario.id
                      ? 'bg-accent-blue text-white'
                      : 'bg-gray-150 text-gray-75 hover:text-white border border-gray-125'
                  }`}
                >
                  <span className="mr-1.5">{scenario.icon}</span>
                  {scenario.name}
                </button>
              ))}
            </div>
            
            {/* Scenario outcome */}
            <AnimatePresence>
              {showScenario && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {(() => {
                    const outcome = getScenarioOutcome(showScenario);
                    const scenario = BAN_SCENARIOS.find(s => s.id === showScenario);
                    if (!outcome || !scenario) return null;
                    
                    return (
                      <div className="mt-4 p-4 rounded-xl bg-gray-175 border border-gray-125">
                        <p className="text-sm font-medium text-white mb-3">
                          If user is banned for: {scenario.name}
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-gray-150">
                            <p className="text-[10px] text-gray-100 uppercase mb-1">Refund</p>
                            <p className="text-sm text-white">
                              {outcome.refund.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-150">
                            <p className="text-[10px] text-gray-100 uppercase mb-1">Access</p>
                            <p className="text-sm text-white">{outcome.access}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-150">
                            <p className="text-[10px] text-gray-100 uppercase mb-1">Note</p>
                            <p className="text-sm text-white">{outcome.additional || 'Standard'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Temporary Ban Section */}
          <div className="rounded-xl border border-gray-125 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'temp' ? null : 'temp')}
              className="w-full p-4 bg-gray-150 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent-yellow" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Temporary Bans</p>
                  <p className="text-xs text-gray-75">Spam, minor violations, cooling off</p>
                </div>
              </div>
              {expandedSection === 'temp' ? (
                <ChevronUp className="w-4 h-4 text-gray-75" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-75" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedSection === 'temp' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 bg-gray-175">
                    {/* Refund Policy */}
                    <div>
                      <label className="block text-xs text-gray-100 mb-2">Refund policy</label>
                      <div className="grid grid-cols-2 gap-2">
                        {REFUND_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateTempBan({ refundPolicy: option.value })}
                            className={`p-3 rounded-xl text-left transition-all border ${
                              policy.temporaryBan.refundPolicy === option.value
                                ? 'bg-accent-yellow/10 border-accent-yellow/30'
                                : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                            }`}
                          >
                            <p className="text-sm font-medium text-white">{option.label}</p>
                            <p className="text-[10px] text-gray-75">{option.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Access Policy */}
                    <div>
                      <label className="block text-xs text-gray-100 mb-2">Access revocation</label>
                      <div className="grid grid-cols-3 gap-2">
                        {ACCESS_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateTempBan({ accessPolicy: option.value })}
                            className={`p-3 rounded-xl text-left transition-all border ${
                              policy.temporaryBan.accessPolicy === option.value
                                ? 'bg-accent-yellow/10 border-accent-yellow/30'
                                : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                            }`}
                          >
                            <p className="text-xs font-medium text-white">{option.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Grace period days */}
                    {policy.temporaryBan.accessPolicy === 'grace-period' && (
                      <div>
                        <label className="block text-xs text-gray-100 mb-2">Grace period (days)</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={policy.temporaryBan.gracePeriodDays}
                          onChange={(e) => updateTempBan({ gracePeriodDays: parseInt(e.target.value) || 3 })}
                          className="w-full px-3 py-2 rounded-lg bg-gray-150 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-yellow"
                        />
                      </div>
                    )}
                    
                    {/* Pause subscription toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
                      <div>
                        <p className="text-sm text-white">Pause subscription during ban?</p>
                        <p className="text-xs text-gray-75">Don't charge while user is banned</p>
                      </div>
                      <button
                        onClick={() => updateTempBan({ pauseSubscription: !policy.temporaryBan.pauseSubscription })}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          policy.temporaryBan.pauseSubscription ? 'bg-accent-yellow' : 'bg-gray-125'
                        }`}
                      >
                        <motion.div
                          animate={{ x: policy.temporaryBan.pauseSubscription ? 18 : 2 }}
                          className="w-4 h-4 rounded-full bg-white"
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Permanent Ban Section */}
          <div className="rounded-xl border border-gray-125 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'perm' ? null : 'perm')}
              className="w-full p-4 bg-gray-150 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Ban className="w-5 h-5 text-accent-red" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Permanent Bans</p>
                  <p className="text-xs text-gray-75">Harassment, fraud, severe TOS violations</p>
                </div>
              </div>
              {expandedSection === 'perm' ? (
                <ChevronUp className="w-4 h-4 text-gray-75" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-75" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedSection === 'perm' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 bg-gray-175">
                    {/* Refund Policy */}
                    <div>
                      <label className="block text-xs text-gray-100 mb-2">Refund policy</label>
                      <div className="grid grid-cols-2 gap-2">
                        {REFUND_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updatePermBan({ refundPolicy: option.value })}
                            className={`p-3 rounded-xl text-left transition-all border ${
                              policy.permanentBan.refundPolicy === option.value
                                ? 'bg-accent-red/10 border-accent-red/30'
                                : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                            }`}
                          >
                            <p className="text-sm font-medium text-white">{option.label}</p>
                            <p className="text-[10px] text-gray-75">{option.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Appeal window */}
                    <div>
                      <label className="block text-xs text-gray-100 mb-2">Appeal window (days)</label>
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={policy.permanentBan.appealWindowDays}
                        onChange={(e) => updatePermBan({ appealWindowDays: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-150 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-red"
                      />
                      <p className="text-[10px] text-gray-75 mt-1">
                        Set to 0 for immediate permanent ban with no appeal
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Creator-specific Ban (only for creator-linked offers) */}
          {offer.linkedToCreator && (
            <div className="rounded-xl border border-gray-125 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'creator' ? null : 'creator')}
                className="w-full p-4 bg-gray-150 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">🚫</div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Creator Bans</p>
                    <p className="text-xs text-gray-75">When a creator bans a subscriber</p>
                  </div>
                </div>
                {expandedSection === 'creator' ? (
                  <ChevronUp className="w-4 h-4 text-gray-75" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-75" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSection === 'creator' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-4 bg-gray-175">
                      {/* Important context */}
                      <div className="p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
                        <p className="text-xs text-gray-75">
                          <strong className="text-white">Important:</strong> This is when an individual creator 
                          bans a user from their channel, not a platform-wide ban.
                        </p>
                      </div>
                      
                      {/* Refund Policy */}
                      <div>
                        <label className="block text-xs text-gray-100 mb-2">Refund policy</label>
                        <div className="grid grid-cols-2 gap-2">
                          {REFUND_OPTIONS.slice(0, 3).map((option) => (
                            <button
                              key={option.value}
                              onClick={() => updateCreatorBan({ refundPolicy: option.value })}
                              className={`p-3 rounded-xl text-left transition-all border ${
                                policy.creatorBan.refundPolicy === option.value
                                  ? 'bg-accent-purple/10 border-accent-purple/30'
                                  : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                              }`}
                            >
                              <p className="text-sm font-medium text-white">{option.label}</p>
                              <p className="text-[10px] text-gray-75">{option.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Can resubscribe */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
                        <div>
                          <p className="text-sm text-white">Allow resubscribe?</p>
                          <p className="text-xs text-gray-75">After cooldown period</p>
                        </div>
                        <button
                          onClick={() => updateCreatorBan({ canResubscribe: !policy.creatorBan.canResubscribe })}
                          className={`w-10 h-6 rounded-full transition-colors ${
                            policy.creatorBan.canResubscribe ? 'bg-accent-green' : 'bg-gray-125'
                          }`}
                        >
                          <motion.div
                            animate={{ x: policy.creatorBan.canResubscribe ? 18 : 2 }}
                            className="w-4 h-4 rounded-full bg-white"
                          />
                        </button>
                      </div>
                      
                      {/* Cooldown days */}
                      {policy.creatorBan.canResubscribe && (
                        <div>
                          <label className="block text-xs text-gray-100 mb-2">Cooldown period (days)</label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={policy.creatorBan.cooldownDays}
                            onChange={(e) => updateCreatorBan({ cooldownDays: parseInt(e.target.value) || 30 })}
                            className="w-full px-3 py-2 rounded-lg bg-gray-150 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-purple"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
      
      {/* Disabled state message */}
      {!policy.enabled && (
        <div className="p-6 rounded-xl bg-gray-175 border border-dashed border-gray-125 text-center">
          <AlertTriangle className="w-8 h-8 text-accent-yellow mx-auto mb-3" />
          <p className="text-sm text-white mb-2">No moderation policy configured</p>
          <p className="text-xs text-gray-75">
            Enable the policy above to define what happens when users are banned. 
            Without this, banned users may keep access or refund handling will be manual.
          </p>
        </div>
      )}
    </div>
  );
}
