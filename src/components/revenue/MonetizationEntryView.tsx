'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Info,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Video,
  BarChart3
} from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { MonetizationSetup } from '@/types/revenue';

// ============================================================================
// TEMPLATE DATA
// ============================================================================

const templates = {
  'livestream': {
    title: 'Creator Economy (Livestream)',
    badge: 'Recommended',
    description: 'Fans support creators. Creators earn from subscriptions and tips. Your platform takes a percentage of every transaction.',
    anchorSentence: 'Your platform earns when creators earn — not by charging fans directly.',
    flow: [
      { icon: '👤', label: 'Fans' },
      { icon: '🎬', label: 'Creators', highlight: true },
      { icon: '📱', label: 'Platform Cut' }
    ],
    stories: [
      {
        icon: Calendar,
        title: 'Monthly Creator Subscription',
        content: (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-50">Fan subscribes for</span>
              <span className="text-white font-medium">$4.99 / month</span>
            </div>
            <div className="text-xs text-gray-100 pl-4 border-l border-gray-125 space-y-1">
              <p>Apple keeps ~30%</p>
              <p>The rest is shared between <span className="text-white">The Creator</span> and <span className="text-white">Your Platform</span></p>
            </div>
            <div className="flex items-center gap-2 text-xs text-accent-green bg-accent-green/10 p-2 rounded-lg mt-auto">
              <Sparkles className="w-3 h-3 flex-shrink-0" />
              Creators earn recurring income. Your platform earns as creators grow.
            </div>
          </div>
        )
      },
      {
        icon: Video,
        title: 'One Livestream with 100 Viewers',
        highlight: true,
        content: (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-175 p-2 rounded-lg">
                <span className="block text-xs text-gray-75">Fans tipping</span>
                <span className="text-white font-medium">20 fans</span>
              </div>
              <div className="bg-gray-175 p-2 rounded-lg">
                <span className="block text-xs text-gray-75">Avg tip</span>
                <span className="text-white font-medium">$5</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-125">
              <span className="text-sm text-gray-50">Total Tips Generated</span>
              <span className="text-white font-bold">~$100</span>
            </div>
            <div className="text-xs text-gray-100 space-y-1">
              <div className="flex justify-between">
                <span>Creator earnings:</span>
                <span className="text-white">most of this</span>
              </div>
              <div className="flex justify-between">
                <span>Platform earnings:</span>
                <span className="text-white">a smaller percentage</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-accent-green bg-accent-green/10 p-2 rounded-lg mt-auto">
              <TrendingUp className="w-3 h-3 flex-shrink-0" />
              This is where most livestream revenue comes from.
            </div>
          </div>
        )
      },
      {
        icon: BarChart3,
        title: 'Platform-Level View',
        content: (
          <div className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-75" />
                <span className="text-gray-50">10 active creators</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-75" />
                <span className="text-gray-50">Streaming twice a week</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-100 bg-gray-175 p-2 rounded-lg mt-auto">
              <span className="text-accent-purple">→</span>
              Your platform earns recurring revenue as creators stream and grow.
            </div>
          </div>
        )
      }
    ]
  },
  'cal-ai': {
    title: 'Premium Subscription',
    badge: 'Recommended',
    description: 'Users pay a recurring fee to unlock premium features. Simple, predictable revenue.',
    anchorSentence: 'Your platform earns when users subscribe to access premium value.',
    flow: [
      { icon: '👤', label: 'Users' },
      { icon: '⭐', label: 'Premium Features', highlight: true },
      { icon: '📱', label: 'Platform Revenue' }
    ],
    stories: [
      {
        icon: Calendar,
        title: 'Monthly Subscription',
        content: (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-50">User subscribes for</span>
              <span className="text-white font-medium">$9.99 / month</span>
            </div>
            <div className="text-xs text-gray-100 pl-4 border-l border-gray-125 space-y-1">
              <p>Apple keeps ~30%</p>
              <p>Your platform keeps <span className="text-white">100% of the rest</span></p>
            </div>
            <div className="flex items-center gap-2 text-xs text-accent-green bg-accent-green/10 p-2 rounded-lg mt-auto">
              <Sparkles className="w-3 h-3 flex-shrink-0" />
              Steady, compounding monthly revenue.
            </div>
          </div>
        )
      },
      {
        icon: TrendingUp,
        title: 'Yearly Plan',
        highlight: true,
        content: (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-50">User subscribes for</span>
              <span className="text-white font-medium">$49.99 / year</span>
            </div>
            <p className="text-xs text-gray-100">
              Users save money compared to monthly. You get cash upfront.
            </p>
            <div className="flex items-center gap-2 text-xs text-accent-green bg-accent-green/10 p-2 rounded-lg mt-auto">
              <TrendingUp className="w-3 h-3 flex-shrink-0" />
              Great for cash flow and user commitment.
            </div>
          </div>
        )
      }
    ]
  }
};

export default function MonetizationEntryView() {
  const { 
    currentScenario, 
    applyMonetizationSetup,
    startFromScratch
  } = useRevenueStore();
  
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  const template = templates[currentScenario];

  const handleStartTemplate = () => {
    setIsSettingUp(true);
    
    // Hardcoded defaults based on scenario
    const setup: MonetizationSetup = currentScenario === 'cal-ai' 
      ? {
          recommendedModel: 'subscription',
          trialEnabled: true,
          trialDays: 7,
          pricing: [
            { id: 'weekly', amount: 4.99, period: 'week', label: '$4.99/week' },
            { id: 'monthly', amount: 9.99, period: 'month', label: '$9.99/month', isDefault: true },
            { id: 'yearly', amount: 49.99, period: 'year', label: '$49.99/year' },
          ],
          assumptions: { usersPerMonth: 2500, conversionPct: 6, avgPrice: 9.99 },
          answers: { valueFrequency: 'full-refund', creatorPayment: 'grace-period' }
        }
      : {
          recommendedModel: 'creator-subscription',
          trialEnabled: false,
          trialDays: 0,
          pricing: [
            { id: 'creator-sub', amount: 4.99, period: 'month', label: '$4.99/month', displayName: 'Most common', isDefault: true },
            { id: 'tip-small', amount: 1, period: 'month', label: '$1', displayName: 'Quick tip' },
            { id: 'tip-medium', amount: 5, period: 'month', label: '$5', displayName: 'Standard tip' },
            { id: 'tip-large', amount: 10, period: 'month', label: '$10', displayName: 'Big tip' },
          ],
          assumptions: { usersPerMonth: 1000, conversionPct: 5, avgPrice: 20 },
          answers: { valueFrequency: 'prorated', creatorPayment: 'weekly' }
        };

    setTimeout(() => {
      applyMonetizationSetup(setup);
      setIsSettingUp(false);
    }, 800);
  };

  const handleStartScratch = () => {
    startFromScratch();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-4xl mx-auto px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-white mb-3">
            Choose how you want to start monetizing
          </h1>
          <p className="text-base text-gray-75">
            We’ll set up a proven starting point. You can customize everything later.
          </p>
        </div>

        {/* Template Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gray-150 border border-gray-125 rounded-[24px] overflow-hidden mb-12 shadow-2xl shadow-black/50"
        >
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent pointer-events-none" />
          
          {/* Card Header */}
          <div className="p-10 border-b border-gray-125 relative">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-white">{template.title}</h2>
                  <span className="px-3 py-1 rounded-full bg-accent-green/20 text-accent-green text-xs font-medium flex items-center gap-1.5 shadow-sm border border-accent-green/10">
                    <Sparkles className="w-3 h-3" />
                    {template.badge}
                  </span>
                </div>
                <p className="text-base text-gray-50 leading-relaxed mb-4">{template.description}</p>
                <p className="text-sm font-medium text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-green" />
                  {template.anchorSentence}
                </p>
              </div>
              
              {/* Visual Flow Spine */}
              <div className="flex items-center bg-gray-175/50 p-2 rounded-2xl border border-white/5 backdrop-blur-sm self-start">
                {template.flow.map((step, i) => (
                  <div key={i} className="flex items-center relative z-10">
                    <div className="flex flex-col items-center px-4 py-2 group">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-2 transition-all duration-300
                        ${step.highlight 
                          ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20 scale-110' 
                          : 'bg-gray-150 text-gray-50 group-hover:bg-gray-125'
                        }
                      `}>
                        {step.icon}
                      </div>
                      <span className={`
                        text-[10px] uppercase tracking-wide font-medium transition-colors
                        ${step.highlight ? 'text-white' : 'text-gray-75 group-hover:text-gray-50'}
                      `}>
                        {step.label}
                      </span>
                    </div>
                    {i < template.flow.length - 1 && (
                      <div className="w-8 h-px bg-gray-125 mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Money Stories */}
          <div className="p-10 bg-gray-175/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-gray-75 uppercase tracking-wide">
                  Example Money Stories (Illustrative Only)
                </h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {template.stories.map((story, i) => {
                const Icon = story.icon;
                return (
                  <div 
                    key={i} 
                    className={`
                      flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:translate-y-[-2px]
                      ${story.highlight 
                        ? 'bg-gradient-to-b from-accent-green/5 to-transparent border-accent-green/20 shadow-lg shadow-accent-green/5' 
                        : 'bg-gray-150 border-gray-125 hover:border-gray-100 shadow-md'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${story.highlight ? 'bg-accent-green/20 text-accent-green' : 'bg-gray-175 text-gray-75'}
                      `}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className={`text-sm font-semibold leading-tight ${story.highlight ? 'text-white' : 'text-gray-50'}`}>
                        {story.title}
                      </h4>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      {story.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <button
              onClick={handleStartTemplate}
              disabled={isSettingUp}
              className="group relative w-full px-8 py-5 rounded-xl text-lg font-semibold bg-white text-black hover:bg-gray-25 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-white/5 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-0.5"
            >
              {isSettingUp ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                  />
                  Setting up...
                </>
              ) : (
                <>
                  Start with this template
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-xs text-gray-75 font-medium">
              You can change everything later
            </p>
          </div>

          <div className="h-px w-full max-w-xs bg-gray-125/50 my-2" />

          <div className="text-center">
            <button
              onClick={handleStartScratch}
              disabled={isSettingUp}
              className="text-sm text-gray-75 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
            >
              Start from scratch
            </button>
            <p className="text-[10px] text-gray-100 mt-1">
              For advanced users who want full control
            </p>
          </div>

          <p className="text-xs text-gray-100 mt-4 opacity-60">
            Next, you’ll customize pricing, splits, and payouts. Nothing here is final.
          </p>
        </div>

      </div>
    </div>
  );
}