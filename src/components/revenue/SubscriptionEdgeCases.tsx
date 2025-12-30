'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CreditCard, ArrowUpDown, LogOut, Users, ChevronDown, ChevronUp, AlertTriangle, Check, Info } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { Offer, SubscriptionConfig } from '@/types/revenue';

const defaultConfig: SubscriptionConfig = {
  gracePeriod: {
    enabled: true,
    days: 7,
    accessDuringGrace: 'full',
  },
  billingRetry: {
    maxAttempts: 3,
    intervalDays: 3,
    notifyUser: true,
    notifyCreator: false,
  },
  planChanges: {
    allowMidCycle: true,
    prorateUpgrades: true,
    prorateDowngrades: false,
    immediateAccess: true,
  },
  cancellation: {
    allowImmediateCancel: true,
    retainAccessUntilPeriodEnd: true,
    offerPausInstead: true,
    pauseDurationOptions: [7, 14, 30],
    winbackOfferEnabled: true,
    winbackDiscountPercent: 20,
  },
  sharing: {
    familySharingEnabled: false,
    maxFamilyMembers: 6,
  },
};

interface Props {
  offer: Offer;
}

export default function SubscriptionEdgeCases({ offer }: Props) {
  const { updateSubscriptionConfig } = useRevenueStore();
  const [expandedSection, setExpandedSection] = useState<'grace' | 'billing' | 'changes' | 'cancel' | 'sharing' | null>('grace');
  
  const config = offer.subscriptionConfig || defaultConfig;
  
  const updateConfig = (updates: Partial<SubscriptionConfig>) => {
    updateSubscriptionConfig(offer.id, { ...config, ...updates });
  };
  
  const updateGracePeriod = (updates: Partial<SubscriptionConfig['gracePeriod']>) => {
    updateConfig({ gracePeriod: { ...config.gracePeriod, ...updates } });
  };
  
  const updateBillingRetry = (updates: Partial<SubscriptionConfig['billingRetry']>) => {
    updateConfig({ billingRetry: { ...config.billingRetry, ...updates } });
  };
  
  const updatePlanChanges = (updates: Partial<SubscriptionConfig['planChanges']>) => {
    updateConfig({ planChanges: { ...config.planChanges, ...updates } });
  };
  
  const updateCancellation = (updates: Partial<SubscriptionConfig['cancellation']>) => {
    updateConfig({ cancellation: { ...config.cancellation, ...updates } });
  };
  
  const updateSharing = (updates: Partial<SubscriptionConfig['sharing']>) => {
    updateConfig({ sharing: { ...config.sharing, ...updates } });
  };
  
  return (
    <div className="space-y-4">
      {/* Summary banner */}
      <div className="p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white">Subscription Edge Cases</p>
            <p className="text-xs text-gray-75">
              Configure how your app handles payment failures, plan changes, cancellations, and more. 
              These settings prevent revenue loss and improve user experience.
            </p>
          </div>
        </div>
      </div>
      
      {/* Grace Period Section */}
      <SectionCard
        icon={<Clock className="w-5 h-5" />}
        iconColor="text-accent-yellow"
        title="Payment Grace Period"
        description="What happens when a payment fails?"
        expanded={expandedSection === 'grace'}
        onToggle={() => setExpandedSection(expandedSection === 'grace' ? null : 'grace')}
      >
        <div className="space-y-4">
          {/* Enable toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Enable grace period</p>
              <p className="text-xs text-gray-75">Give users time before losing access</p>
            </div>
            <ToggleButton
              enabled={config.gracePeriod.enabled}
              onToggle={() => updateGracePeriod({ enabled: !config.gracePeriod.enabled })}
            />
          </div>
          
          {config.gracePeriod.enabled && (
            <>
              {/* Days */}
              <div>
                <label className="block text-xs text-gray-100 mb-2">Grace period length</label>
                <div className="flex gap-2">
                  {[3, 7, 14, 30].map((days) => (
                    <button
                      key={days}
                      onClick={() => updateGracePeriod({ days })}
                      className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                        config.gracePeriod.days === days
                          ? 'bg-accent-yellow/10 border-accent-yellow/30 text-white'
                          : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                      }`}
                    >
                      {days} days
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Access during grace */}
              <div>
                <label className="block text-xs text-gray-100 mb-2">Access during grace period</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['full', 'limited', 'none'] as const).map((access) => (
                    <button
                      key={access}
                      onClick={() => updateGracePeriod({ accessDuringGrace: access })}
                      className={`p-3 rounded-xl text-center transition-all border ${
                        config.gracePeriod.accessDuringGrace === access
                          ? 'bg-accent-yellow/10 border-accent-yellow/30'
                          : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                      }`}
                    >
                      <p className="text-xs font-medium text-white capitalize">{access}</p>
                      <p className="text-[10px] text-gray-75">
                        {access === 'full' ? 'All features' : access === 'limited' ? 'Basic only' : 'Blocked'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SectionCard>
      
      {/* Billing Retry Section */}
      <SectionCard
        icon={<CreditCard className="w-5 h-5" />}
        iconColor="text-accent-red"
        title="Billing Retry"
        description="Automatic payment retry attempts"
        expanded={expandedSection === 'billing'}
        onToggle={() => setExpandedSection(expandedSection === 'billing' ? null : 'billing')}
      >
        <div className="space-y-4">
          {/* Retry attempts */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">Number of retry attempts</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((attempts) => (
                <button
                  key={attempts}
                  onClick={() => updateBillingRetry({ maxAttempts: attempts })}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                    config.billingRetry.maxAttempts === attempts
                      ? 'bg-accent-red/10 border-accent-red/30 text-white'
                      : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                  }`}
                >
                  {attempts}
                </button>
              ))}
            </div>
          </div>
          
          {/* Retry interval */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">Days between retries</label>
            <div className="flex gap-2">
              {[1, 2, 3, 5, 7].map((days) => (
                <button
                  key={days}
                  onClick={() => updateBillingRetry({ intervalDays: days })}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                    config.billingRetry.intervalDays === days
                      ? 'bg-accent-red/10 border-accent-red/30 text-white'
                      : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                  }`}
                >
                  {days}
                </button>
              ))}
            </div>
          </div>
          
          {/* Notifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
              <div>
                <p className="text-sm text-white">Notify user</p>
                <p className="text-xs text-gray-75">Email when payment fails</p>
              </div>
              <ToggleButton
                enabled={config.billingRetry.notifyUser}
                onToggle={() => updateBillingRetry({ notifyUser: !config.billingRetry.notifyUser })}
              />
            </div>
            
            {offer.linkedToCreator && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
                <div>
                  <p className="text-sm text-white">Notify creator</p>
                  <p className="text-xs text-gray-75">Alert creator of at-risk subscriber</p>
                </div>
                <ToggleButton
                  enabled={config.billingRetry.notifyCreator}
                  onToggle={() => updateBillingRetry({ notifyCreator: !config.billingRetry.notifyCreator })}
                />
              </div>
            )}
          </div>
        </div>
      </SectionCard>
      
      {/* Plan Changes Section */}
      <SectionCard
        icon={<ArrowUpDown className="w-5 h-5" />}
        iconColor="text-accent-purple"
        title="Upgrade & Downgrade"
        description="How plan changes are handled"
        expanded={expandedSection === 'changes'}
        onToggle={() => setExpandedSection(expandedSection === 'changes' ? null : 'changes')}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Allow mid-cycle changes</p>
              <p className="text-xs text-gray-75">Users can switch plans anytime</p>
            </div>
            <ToggleButton
              enabled={config.planChanges.allowMidCycle}
              onToggle={() => updatePlanChanges({ allowMidCycle: !config.planChanges.allowMidCycle })}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Prorate upgrades</p>
              <p className="text-xs text-gray-75">Charge difference only</p>
            </div>
            <ToggleButton
              enabled={config.planChanges.prorateUpgrades}
              onToggle={() => updatePlanChanges({ prorateUpgrades: !config.planChanges.prorateUpgrades })}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Prorate downgrades</p>
              <p className="text-xs text-gray-75">Credit remaining value</p>
            </div>
            <ToggleButton
              enabled={config.planChanges.prorateDowngrades}
              onToggle={() => updatePlanChanges({ prorateDowngrades: !config.planChanges.prorateDowngrades })}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Immediate access on upgrade</p>
              <p className="text-xs text-gray-75">Don't wait for next billing cycle</p>
            </div>
            <ToggleButton
              enabled={config.planChanges.immediateAccess}
              onToggle={() => updatePlanChanges({ immediateAccess: !config.planChanges.immediateAccess })}
            />
          </div>
        </div>
      </SectionCard>
      
      {/* Cancellation Section */}
      <SectionCard
        icon={<LogOut className="w-5 h-5" />}
        iconColor="text-accent-green"
        title="Cancellation & Winback"
        description="Reduce churn with smart cancellation flows"
        expanded={expandedSection === 'cancel'}
        onToggle={() => setExpandedSection(expandedSection === 'cancel' ? null : 'cancel')}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Retain access until period ends</p>
              <p className="text-xs text-gray-75">User keeps access after canceling</p>
            </div>
            <ToggleButton
              enabled={config.cancellation.retainAccessUntilPeriodEnd}
              onToggle={() => updateCancellation({ retainAccessUntilPeriodEnd: !config.cancellation.retainAccessUntilPeriodEnd })}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Offer pause instead</p>
              <p className="text-xs text-gray-75">Let users pause instead of cancel</p>
            </div>
            <ToggleButton
              enabled={config.cancellation.offerPausInstead}
              onToggle={() => updateCancellation({ offerPausInstead: !config.cancellation.offerPausInstead })}
            />
          </div>
          
          {config.cancellation.offerPausInstead && (
            <div>
              <label className="block text-xs text-gray-100 mb-2">Pause duration options</label>
              <div className="flex gap-2">
                {[7, 14, 30, 60, 90].map((days) => {
                  const isSelected = config.cancellation.pauseDurationOptions.includes(days);
                  return (
                    <button
                      key={days}
                      onClick={() => {
                        const newOptions = isSelected
                          ? config.cancellation.pauseDurationOptions.filter(d => d !== days)
                          : [...config.cancellation.pauseDurationOptions, days].sort((a, b) => a - b);
                        updateCancellation({ pauseDurationOptions: newOptions });
                      }}
                      className={`flex-1 py-2 rounded-lg text-xs transition-all border ${
                        isSelected
                          ? 'bg-accent-green/10 border-accent-green/30 text-white'
                          : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                      }`}
                    >
                      {days}d
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="p-4 rounded-xl bg-gray-175 border border-gray-125">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-white">Winback offer</p>
                <p className="text-xs text-gray-75">Discount to returning subscribers</p>
              </div>
              <ToggleButton
                enabled={config.cancellation.winbackOfferEnabled}
                onToggle={() => updateCancellation({ winbackOfferEnabled: !config.cancellation.winbackOfferEnabled })}
              />
            </div>
            
            {config.cancellation.winbackOfferEnabled && (
              <div>
                <label className="block text-xs text-gray-100 mb-2">Discount percentage</label>
                <div className="flex gap-2">
                  {[10, 15, 20, 25, 30, 50].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => updateCancellation({ winbackDiscountPercent: percent })}
                      className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                        config.cancellation.winbackDiscountPercent === percent
                          ? 'bg-accent-green/10 border-accent-green/30 text-white'
                          : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>
      
      {/* Family Sharing Section */}
      <SectionCard
        icon={<Users className="w-5 h-5" />}
        iconColor="text-accent-blue"
        title="Family Sharing"
        description="Let users share subscription with family"
        expanded={expandedSection === 'sharing'}
        onToggle={() => setExpandedSection(expandedSection === 'sharing' ? null : 'sharing')}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Enable family sharing</p>
              <p className="text-xs text-gray-75">Works with Apple Family Sharing</p>
            </div>
            <ToggleButton
              enabled={config.sharing.familySharingEnabled}
              onToggle={() => updateSharing({ familySharingEnabled: !config.sharing.familySharingEnabled })}
            />
          </div>
          
          {config.sharing.familySharingEnabled && (
            <div>
              <label className="block text-xs text-gray-100 mb-2">Max family members</label>
              <div className="flex gap-2">
                {[2, 4, 5, 6].map((count) => (
                  <button
                    key={count}
                    onClick={() => updateSharing({ maxFamilyMembers: count })}
                    className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                      config.sharing.maxFamilyMembers === count
                        ? 'bg-accent-blue/10 border-accent-blue/30 text-white'
                        : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

// Reusable section card component
function SectionCard({
  icon,
  iconColor,
  title,
  description,
  expanded,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-125 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 bg-gray-150 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={iconColor}>{icon}</div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="text-xs text-gray-75">{description}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-75" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-75" />
        )}
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-175">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable toggle button
function ToggleButton({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-10 h-6 rounded-full transition-colors ${
        enabled ? 'bg-accent-green' : 'bg-gray-125'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 18 : 2 }}
        className="w-4 h-4 rounded-full bg-white"
      />
    </button>
  );
}
