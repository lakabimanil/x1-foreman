'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserX, LogOut, Ban, Clock, ChevronDown, ChevronUp, AlertTriangle, Info, DollarSign } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { 
  Offer, 
  CreatorDeparturePolicy,
  SubscriberHandling,
} from '@/types/revenue';

const SUBSCRIBER_HANDLING_OPTIONS: { value: SubscriberHandling; label: string; description: string; icon: string }[] = [
  { value: 'full-refund', label: 'Full Refund', description: 'Refund all active subscribers', icon: '💰' },
  { value: 'transfer-to-platform', label: 'Transfer to Platform', description: 'Subscribers become platform subscribers', icon: '🔄' },
  { value: 'gradual-sunset', label: 'Gradual Sunset', description: 'Honor current period, then end', icon: '🌅' },
  { value: 'find-similar', label: 'Find Similar', description: 'Suggest similar creators', icon: '🔍' },
];

const CONTENT_OPTIONS = [
  { value: 'archive', label: 'Archive', description: 'Keep for subscribers' },
  { value: 'delete', label: 'Delete', description: 'Remove all content' },
  { value: 'creator-choice', label: 'Creator Choice', description: 'Let creator decide' },
];

const defaultPolicy: CreatorDeparturePolicy = {
  voluntary: {
    subscriberHandling: 'gradual-sunset',
    noticeRequiredDays: 30,
    finalPayoutDelay: 30,
    contentRetention: 'creator-choice',
  },
  banned: {
    subscriberHandling: 'full-refund',
    refundFromEarnings: true,
    contentHandling: 'immediate-remove',
  },
  inactive: {
    inactiveDaysThreshold: 90,
    subscriberNotification: true,
    autoRefundAfterDays: 30,
    contentRetention: 'archive',
  },
};

interface Props {
  offer: Offer;
}

export default function CreatorDepartureSection({ offer }: Props) {
  const { updateCreatorDeparturePolicy } = useRevenueStore();
  const [expandedSection, setExpandedSection] = useState<'voluntary' | 'banned' | 'inactive' | null>('voluntary');
  
  const policy = offer.creatorDeparturePolicy || defaultPolicy;
  
  const updatePolicy = (updates: Partial<CreatorDeparturePolicy>) => {
    updateCreatorDeparturePolicy(offer.id, { ...policy, ...updates });
  };
  
  const updateVoluntary = (updates: Partial<CreatorDeparturePolicy['voluntary']>) => {
    updatePolicy({ voluntary: { ...policy.voluntary, ...updates } });
  };
  
  const updateBanned = (updates: Partial<CreatorDeparturePolicy['banned']>) => {
    updatePolicy({ banned: { ...policy.banned, ...updates } });
  };
  
  const updateInactive = (updates: Partial<CreatorDeparturePolicy['inactive']>) => {
    updatePolicy({ inactive: { ...policy.inactive, ...updates } });
  };
  
  // Calculate example impacts
  const calculateRefundExample = () => {
    const avgSubscriberValue = 5.99; // From first tier
    const activeSubscribers = 500; // Example
    return (avgSubscriberValue * activeSubscribers).toFixed(0);
  };
  
  return (
    <div className="space-y-4">
      {/* Important context */}
      <div className="p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent-purple flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white">Creator Departure Scenarios</p>
            <p className="text-xs text-gray-75">
              Define what happens to active subscribers when a creator leaves, gets banned, or goes inactive.
              This protects both users and your platform reputation.
            </p>
          </div>
        </div>
      </div>
      
      {/* Voluntary Departure */}
      <SectionCard
        icon={<LogOut className="w-5 h-5" />}
        iconColor="text-accent-blue"
        title="Voluntary Departure"
        description="Creator decides to leave the platform"
        expanded={expandedSection === 'voluntary'}
        onToggle={() => setExpandedSection(expandedSection === 'voluntary' ? null : 'voluntary')}
      >
        <div className="space-y-4">
          {/* Subscriber handling */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">How to handle subscribers</label>
            <div className="grid grid-cols-2 gap-2">
              {SUBSCRIBER_HANDLING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateVoluntary({ subscriberHandling: option.value })}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    policy.voluntary.subscriberHandling === option.value
                      ? 'bg-accent-blue/10 border-accent-blue/30'
                      : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                  }`}
                >
                  <span className="text-lg mr-2">{option.icon}</span>
                  <p className="text-xs font-medium text-white inline">{option.label}</p>
                  <p className="text-[10px] text-gray-75 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Notice required */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">Notice required (days)</label>
            <div className="flex gap-2">
              {[7, 14, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => updateVoluntary({ noticeRequiredDays: days })}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                    policy.voluntary.noticeRequiredDays === days
                      ? 'bg-accent-blue/10 border-accent-blue/30 text-white'
                      : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                  }`}
                >
                  {days}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-75 mt-1">
              Longer notice = more time to notify subscribers and handle transitions
            </p>
          </div>
          
          {/* Final payout delay */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">Hold final payout for (days)</label>
            <div className="flex gap-2">
              {[0, 14, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => updateVoluntary({ finalPayoutDelay: days })}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                    policy.voluntary.finalPayoutDelay === days
                      ? 'bg-accent-blue/10 border-accent-blue/30 text-white'
                      : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                  }`}
                >
                  {days === 0 ? 'None' : days}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-75 mt-1">
              Hold period protects against post-departure refund requests
            </p>
          </div>
          
          {/* Content retention */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">Content after departure</label>
            <div className="flex gap-2">
              {CONTENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateVoluntary({ contentRetention: option.value as CreatorDeparturePolicy['voluntary']['contentRetention'] })}
                  className={`flex-1 p-2 rounded-lg text-center transition-all border ${
                    policy.voluntary.contentRetention === option.value
                      ? 'bg-accent-blue/10 border-accent-blue/30'
                      : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                  }`}
                >
                  <p className="text-xs font-medium text-white">{option.label}</p>
                  <p className="text-[10px] text-gray-75">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
      
      {/* Creator Banned */}
      <SectionCard
        icon={<Ban className="w-5 h-5" />}
        iconColor="text-accent-red"
        title="Creator Banned"
        description="Creator violates terms and is removed"
        expanded={expandedSection === 'banned'}
        onToggle={() => setExpandedSection(expandedSection === 'banned' ? null : 'banned')}
      >
        <div className="space-y-4">
          {/* Warning */}
          <div className="p-3 rounded-xl bg-accent-red/10 border border-accent-red/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-accent-red flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-75">
                <strong className="text-white">High impact scenario:</strong> A banned creator could have 
                thousands of subscribers. Configure this carefully.
              </p>
            </div>
          </div>
          
          {/* Subscriber handling */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">How to handle subscribers</label>
            <div className="grid grid-cols-2 gap-2">
              {SUBSCRIBER_HANDLING_OPTIONS.slice(0, 2).map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateBanned({ subscriberHandling: option.value })}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    policy.banned.subscriberHandling === option.value
                      ? 'bg-accent-red/10 border-accent-red/30'
                      : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                  }`}
                >
                  <span className="text-lg mr-2">{option.icon}</span>
                  <p className="text-xs font-medium text-white inline">{option.label}</p>
                  <p className="text-[10px] text-gray-75 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Refund from earnings */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Deduct refunds from creator earnings</p>
              <p className="text-xs text-gray-75">Use withheld payouts to cover refunds</p>
            </div>
            <button
              onClick={() => updateBanned({ refundFromEarnings: !policy.banned.refundFromEarnings })}
              className={`w-10 h-6 rounded-full transition-colors ${
                policy.banned.refundFromEarnings ? 'bg-accent-red' : 'bg-gray-125'
              }`}
            >
              <motion.div
                animate={{ x: policy.banned.refundFromEarnings ? 18 : 2 }}
                className="w-4 h-4 rounded-full bg-white"
              />
            </button>
          </div>
          
          {/* Content handling */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">Content handling</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'immediate-remove', label: 'Immediate', desc: 'Remove now' },
                { value: 'gradual-remove', label: 'Gradual', desc: 'Over 7 days' },
                { value: 'archive', label: 'Archive', desc: 'Keep private' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateBanned({ contentHandling: option.value as CreatorDeparturePolicy['banned']['contentHandling'] })}
                  className={`p-2 rounded-lg text-center transition-all border ${
                    policy.banned.contentHandling === option.value
                      ? 'bg-accent-red/10 border-accent-red/30'
                      : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                  }`}
                >
                  <p className="text-xs font-medium text-white">{option.label}</p>
                  <p className="text-[10px] text-gray-75">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Example impact */}
          <div className="p-3 rounded-xl bg-gray-175 border border-gray-125">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-accent-yellow" />
              <p className="text-xs font-medium text-white">Example Impact</p>
            </div>
            <p className="text-xs text-gray-75">
              Creator with 500 subscribers at $5.99/mo = up to <strong className="text-white">${calculateRefundExample()}</strong> in potential refunds
              {policy.banned.refundFromEarnings && ' (covered by withheld earnings)'}
            </p>
          </div>
        </div>
      </SectionCard>
      
      {/* Creator Inactive */}
      <SectionCard
        icon={<Clock className="w-5 h-5" />}
        iconColor="text-accent-yellow"
        title="Creator Inactive"
        description="Creator stops posting without notice"
        expanded={expandedSection === 'inactive'}
        onToggle={() => setExpandedSection(expandedSection === 'inactive' ? null : 'inactive')}
      >
        <div className="space-y-4">
          {/* Inactive threshold */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">Consider inactive after (days)</label>
            <div className="flex gap-2">
              {[30, 60, 90, 180, 365].map((days) => (
                <button
                  key={days}
                  onClick={() => updateInactive({ inactiveDaysThreshold: days })}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                    policy.inactive.inactiveDaysThreshold === days
                      ? 'bg-accent-yellow/10 border-accent-yellow/30 text-white'
                      : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                  }`}
                >
                  {days}
                </button>
              ))}
            </div>
          </div>
          
          {/* Notify subscribers */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-150">
            <div>
              <p className="text-sm text-white">Notify subscribers</p>
              <p className="text-xs text-gray-75">Alert them of creator inactivity</p>
            </div>
            <button
              onClick={() => updateInactive({ subscriberNotification: !policy.inactive.subscriberNotification })}
              className={`w-10 h-6 rounded-full transition-colors ${
                policy.inactive.subscriberNotification ? 'bg-accent-yellow' : 'bg-gray-125'
              }`}
            >
              <motion.div
                animate={{ x: policy.inactive.subscriberNotification ? 18 : 2 }}
                className="w-4 h-4 rounded-full bg-white"
              />
            </button>
          </div>
          
          {/* Auto refund after */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">Auto-refund after (days of inactivity)</label>
            <div className="flex gap-2">
              {[0, 14, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => updateInactive({ autoRefundAfterDays: days })}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                    policy.inactive.autoRefundAfterDays === days
                      ? 'bg-accent-yellow/10 border-accent-yellow/30 text-white'
                      : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                  }`}
                >
                  {days === 0 ? 'Never' : days}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-75 mt-1">
              Days after inactivity threshold is reached (e.g., {policy.inactive.inactiveDaysThreshold} + {policy.inactive.autoRefundAfterDays} = {policy.inactive.inactiveDaysThreshold + policy.inactive.autoRefundAfterDays} total days)
            </p>
          </div>
          
          {/* Content retention */}
          <div>
            <label className="block text-xs text-gray-100 mb-2">Content retention</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'keep', label: 'Keep', desc: 'Leave accessible' },
                { value: 'archive', label: 'Archive', desc: 'Move to archive' },
                { value: 'delete-after-days', label: 'Delete', desc: 'After threshold' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateInactive({ contentRetention: option.value as CreatorDeparturePolicy['inactive']['contentRetention'] })}
                  className={`p-2 rounded-lg text-center transition-all border ${
                    policy.inactive.contentRetention === option.value
                      ? 'bg-accent-yellow/10 border-accent-yellow/30'
                      : 'bg-gray-150 border-gray-125 hover:border-gray-100'
                  }`}
                >
                  <p className="text-xs font-medium text-white">{option.label}</p>
                  <p className="text-[10px] text-gray-75">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// Reusable section card
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
