'use client';

import { create } from 'zustand';
import type {
  ScenarioType,
  RevenueState,
  RevenueScenario,
  RevenueView,
  Offer,
  OfferStatus,
  EarnerSplit,
  PriceOption,
  PayoutTiming,
  RefundBehavior,
  RefundAfterPayout,
  MoneySummary,
  HealthIssue,
  AppStoreReadiness,
  UnlockCondition,
  UnlockLogic,
  ModerationPolicy,
  SubscriptionConfig,
  AdConfig,
  PromoConfig,
  CreatorDeparturePolicy,
  EdgeCaseScenario,
  MonetizationSetup,
  PricingTier,
} from '@/types/revenue';

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

const defaultModerationPolicy: ModerationPolicy = {
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

const defaultSubscriptionConfig: SubscriptionConfig = {
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

const defaultCreatorDeparturePolicy: CreatorDeparturePolicy = {
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

// ============================================================================
// SCENARIO DATA - Comprehensive Edge Case Support
// ============================================================================

// Cal AI - Simple subscription app with edge cases
const calAIOffers: Offer[] = [
  {
    id: 'cal-ai-pro',
    name: 'Cal AI Pro',
    icon: '⭐',
    type: 'subscription',
    description: 'Premium subscription with all features unlocked',
    status: 'ready',
    isConfigured: true,
    prices: [
      { id: 'weekly', amount: 4.99, period: 'week', label: '$4.99/week' },
      { id: 'monthly', amount: 9.99, period: 'month', label: '$9.99/month', isDefault: true, hasFreeTrial: true, freeTrialDays: 7 },
      { id: 'yearly', amount: 49.99, period: 'year', label: '$49.99/year' },
    ],
    splits: [{ earner: 'platform', percentage: 100 }],
    payoutTiming: 'monthly',
    refundBehavior: 'full-revoke',
    color: '#8B5CF6',
    linkedToCreator: false,
    subscriptionConfig: {
      ...defaultSubscriptionConfig,
      gracePeriod: { enabled: true, days: 7, accessDuringGrace: 'limited' },
    },
    moderationPolicy: {
      ...defaultModerationPolicy,
      enabled: true,
      temporaryBan: {
        refundPolicy: 'no-refund',
        accessPolicy: 'immediate-revoke',
        gracePeriodDays: 3,
        pauseSubscription: true,
      },
    },
    promoConfig: {
      enabled: true,
      introOffer: { enabled: true, type: 'percentage', value: 50, duration: 'first-period' },
      promoCodes: { enabled: true, allowMultipleUses: false, codes: [] },
      studentDiscount: { enabled: true, discountPercent: 20, verificationMethod: 'sheerid' },
      seasonalPromos: { enabled: false },
    },
  },
];

const calAISuggestedOffers: Offer[] = [
  {
    id: 'lifetime-pro',
    name: 'Lifetime Pro',
    icon: '💎',
    type: 'one-time',
    description: 'One-time purchase for permanent Pro access',
    status: 'draft',
    isConfigured: false,
    isSuggested: true,
    prices: [{ id: 'lifetime', amount: 99.99, period: 'one-time', label: '$99.99', isDefault: true }],
    splits: [{ earner: 'platform', percentage: 100 }],
    payoutTiming: 'monthly',
    refundBehavior: 'full-revoke',
    color: '#10B981',
    linkedToCreator: false,
  },
  {
    id: 'remove-ads',
    name: 'Remove Ads',
    icon: '🧼',
    type: 'one-time',
    description: 'One-time purchase to remove all advertisements',
    status: 'inactive',
    isConfigured: false,
    isSuggested: true,
    prices: [{ id: 'remove-ads', amount: 2.99, period: 'one-time', label: '$2.99', isDefault: true }],
    splits: [{ earner: 'platform', percentage: 100 }],
    payoutTiming: 'monthly',
    refundBehavior: 'full-revoke',
    color: '#F59E0B',
    linkedToCreator: false,
  },
];

// Livestream - Complex creator economy with full edge case handling
const livestreamOffers: Offer[] = [
  {
    id: 'subscribe-creator',
    name: 'Subscribe to Creator',
    icon: '💜',
    type: 'subscription',
    description: 'Monthly subscription to support a specific creator',
    status: 'ready',
    isConfigured: true,
    prices: [
      { id: 'tier1', amount: 5.99, period: 'month', label: '$5.99/mo', displayName: 'Supporter', isDefault: true },
      { id: 'tier2', amount: 9.99, period: 'month', label: '$9.99/mo', displayName: 'Super Fan' },
      { id: 'tier3', amount: 24.99, period: 'month', label: '$24.99/mo', displayName: 'VIP' },
    ],
    splits: [
      { earner: 'creator', percentage: 70 },
      { earner: 'platform', percentage: 30 },
    ],
    payoutTiming: 'weekly',
    refundBehavior: 'prorated',
    refundAfterPayout: 'deduct-next',
    creatorChurnBehavior: 'reroute-to-platform',
    color: '#8B5CF6',
    linkedToCreator: true,
    subscriptionConfig: {
      ...defaultSubscriptionConfig,
      gracePeriod: { enabled: true, days: 3, accessDuringGrace: 'full' },
      cancellation: {
        ...defaultSubscriptionConfig.cancellation,
        offerPausInstead: true,
        winbackOfferEnabled: true,
        winbackDiscountPercent: 30,
      },
    },
    moderationPolicy: {
      enabled: true,
      temporaryBan: {
        refundPolicy: 'no-refund',
        accessPolicy: 'immediate-revoke',
        gracePeriodDays: 0,
        pauseSubscription: true,
      },
      permanentBan: {
        refundPolicy: 'no-refund',
        accessPolicy: 'immediate-revoke',
        appealWindowDays: 14,
      },
      creatorBan: {
        refundPolicy: 'prorated-refund',
        canResubscribe: false,
        cooldownDays: 90,
      },
    },
    creatorDeparturePolicy: defaultCreatorDeparturePolicy,
  },
  {
    id: 'superfan-membership',
    name: 'Superfan Membership',
    icon: '⭐',
    type: 'subscription',
    description: 'Premium creator-linked membership with exclusive perks - unlock via payment OR engagement!',
    status: 'needs-attention',
    isConfigured: true,
    prices: [
      { id: 'superfan-monthly', amount: 4.99, period: 'month', label: '$4.99/month', isDefault: true },
    ],
    splits: [
      { earner: 'creator', percentage: 50 },
      { earner: 'platform', percentage: 50 },
    ],
    payoutTiming: 'weekly',
    refundBehavior: 'prorated',
    refundAfterPayout: 'deduct-next',
    creatorChurnBehavior: 'reroute-to-platform',
    color: '#EC4899',
    linkedToCreator: true,
    // KEY EDGE CASE: Alternative unlock conditions!
    unlockConditions: [
      {
        id: 'payment-unlock',
        type: 'payment',
        enabled: true,
        unlockDuration: 'monthly',
        unlockMessage: 'Thanks for subscribing! You\'re now a Superfan.',
      },
      {
        id: 'engagement-unlock',
        type: 'engagement',
        enabled: true,
        engagementMetric: 'likes_received',
        engagementThreshold: 10,
        engagementWindow: 'monthly',
        unlockDuration: 'monthly',
        unlockMessage: 'Congrats! You earned 10 likes and unlocked Superfan status!',
      },
    ],
    unlockLogic: 'any',
    subscriptionConfig: defaultSubscriptionConfig,
    moderationPolicy: {
      enabled: true,
      temporaryBan: {
        refundPolicy: 'prorated-refund',
        accessPolicy: 'grace-period',
        gracePeriodDays: 7,
        pauseSubscription: true,
      },
      permanentBan: {
        refundPolicy: 'prorated-refund',
        accessPolicy: 'immediate-revoke',
        appealWindowDays: 14,
      },
      creatorBan: {
        refundPolicy: 'full-refund',
        canResubscribe: false,
        cooldownDays: 60,
      },
    },
    creatorDeparturePolicy: defaultCreatorDeparturePolicy,
  },
  {
    id: 'send-tip',
    name: 'Send a Tip',
    icon: '⚡',
    type: 'consumable',
    description: 'One-time tips to show appreciation during streams',
    status: 'ready',
    isConfigured: true,
    prices: [
      { id: 'tip-1', amount: 1.00, period: 'one-time', label: '$1', displayName: 'Coffee ☕' },
      { id: 'tip-5', amount: 5.00, period: 'one-time', label: '$5', displayName: 'High Five 🙌', isDefault: true },
      { id: 'tip-10', amount: 10.00, period: 'one-time', label: '$10', displayName: 'Super Fan ⭐' },
      { id: 'tip-50', amount: 50.00, period: 'one-time', label: '$50', displayName: 'Legend 🏆' },
      { id: 'tip-100', amount: 100.00, period: 'one-time', label: '$100', displayName: 'GOAT 🐐' },
    ],
    splits: [
      { earner: 'creator', percentage: 80 },
      { earner: 'platform', percentage: 20 },
    ],
    payoutTiming: 'weekly',
    refundBehavior: 'no-refund',
    color: '#F59E0B',
    linkedToCreator: true,
    // Tips have special moderation: banned users can't tip
    moderationPolicy: {
      enabled: true,
      temporaryBan: {
        refundPolicy: 'no-refund', // Tips already sent are not refunded
        accessPolicy: 'immediate-revoke',
        gracePeriodDays: 0,
        pauseSubscription: false,
      },
      permanentBan: {
        refundPolicy: 'no-refund',
        accessPolicy: 'immediate-revoke',
        appealWindowDays: 0,
      },
      creatorBan: {
        refundPolicy: 'no-refund',
        canResubscribe: false,
        cooldownDays: 0, // Can't tip this creator anymore
      },
    },
  },
  {
    id: 'virtual-gifts',
    name: 'Virtual Gifts',
    icon: '🎁',
    type: 'consumable',
    description: 'Send animated gifts during streams',
    status: 'ready',
    isConfigured: true,
    prices: [
      { id: 'gift-rose', amount: 0.99, period: 'one-time', label: '$0.99', displayName: 'Rose 🌹' },
      { id: 'gift-heart', amount: 1.99, period: 'one-time', label: '$1.99', displayName: 'Heart ❤️' },
      { id: 'gift-fire', amount: 4.99, period: 'one-time', label: '$4.99', displayName: 'Fire 🔥', isDefault: true },
      { id: 'gift-crown', amount: 9.99, period: 'one-time', label: '$9.99', displayName: 'Crown 👑' },
      { id: 'gift-rocket', amount: 49.99, period: 'one-time', label: '$49.99', displayName: 'Rocket 🚀' },
    ],
    splits: [
      { earner: 'creator', percentage: 70 },
      { earner: 'platform', percentage: 30 },
    ],
    payoutTiming: 'weekly',
    refundBehavior: 'no-refund',
    color: '#F472B6',
    linkedToCreator: true,
  },
];

const livestreamSuggestedOffers: Offer[] = [
  {
    id: 'remove-ads',
    name: 'Remove Ads',
    icon: '🧼',
    type: 'one-time',
    description: 'One-time purchase to remove all advertisements',
    status: 'inactive',
    isConfigured: false,
    isSuggested: true,
    prices: [{ id: 'remove-ads', amount: 4.99, period: 'one-time', label: '$4.99', isDefault: true }],
    splits: [{ earner: 'platform', percentage: 100 }],
    payoutTiming: 'monthly',
    refundBehavior: 'full-revoke',
    color: '#3B82F6',
    linkedToCreator: false,
  },
  {
    id: 'ads-revenue',
    name: 'Ad Revenue',
    icon: '📢',
    type: 'ad-supported',
    description: 'Revenue from advertisers shared with creators',
    status: 'inactive',
    isConfigured: false,
    isSuggested: true,
    prices: [],
    splits: [
      { earner: 'creator', percentage: 55 },
      { earner: 'platform', percentage: 45 },
    ],
    payoutTiming: 'monthly',
    refundBehavior: 'no-refund',
    color: '#EF4444',
    linkedToCreator: true,
    adConfig: {
      enabled: false,
      networks: ['admob'],
      primaryNetwork: 'admob',
      placements: [
        { id: 'pre-roll', type: 'pre-roll', location: 'Before stream starts', enabled: true, skipAfterSeconds: 5 },
        { id: 'mid-roll', type: 'mid-roll', location: 'Every 15 minutes', enabled: false, skipAfterSeconds: 5 },
        { id: 'banner', type: 'banner', location: 'Bottom of screen', enabled: true },
      ],
      creatorShare: 55,
      platformShare: 45,
      adFrequency: {
        minSecondsBetweenAds: 300,
        maxAdsPerHour: 4,
        maxAdsPerSession: 10,
      },
      estimatedECPM: 3.00,
    },
  },
  {
    id: 'paid-dms',
    name: 'Paid DMs',
    icon: '💌',
    type: 'consumable',
    description: 'Pay to send direct messages to creator',
    status: 'inactive',
    isConfigured: false,
    isSuggested: true,
    prices: [
      { id: 'dm-basic', amount: 2.99, period: 'one-time', label: '$2.99', displayName: 'Standard DM', isDefault: true },
      { id: 'dm-priority', amount: 9.99, period: 'one-time', label: '$9.99', displayName: 'Priority DM' },
    ],
    splits: [
      { earner: 'creator', percentage: 85 },
      { earner: 'platform', percentage: 15 },
    ],
    payoutTiming: 'weekly',
    refundBehavior: 'no-refund',
    color: '#8B5CF6',
    linkedToCreator: true,
  },
];

const scenarios: Record<ScenarioType, RevenueScenario> = {
  'cal-ai': {
    id: 'cal-ai',
    name: 'Cal AI',
    description: 'Simple subscription app with paywall',
    icon: '🍎',
    offers: calAIOffers,
    suggestedOffers: calAISuggestedOffers,
  },
  'livestream': {
    id: 'livestream',
    name: 'Livestream App',
    description: 'Creator economy with subscriptions, tips, and memberships',
    icon: '📺',
    offers: livestreamOffers,
    suggestedOffers: livestreamSuggestedOffers,
  },
};

// ============================================================================
// EDGE CASE SCENARIOS FOR TESTING
// ============================================================================

const edgeCaseScenarios: EdgeCaseScenario[] = [
  {
    id: 'user-banned-after-payment',
    name: 'User Banned After Paying $4.99',
    description: 'User pays for Superfan, then gets banned by creator for harassment. What happens to their money?',
    category: 'user-action',
    setup: {
      userType: 'subscriber',
      offerIds: ['superfan-membership'],
      timeline: 'User subscribed 3 days ago for $4.99/month',
    },
    event: {
      type: 'creator-ban',
      description: 'Creator bans user from their channel for harassment in chat',
    },
  },
  {
    id: 'engagement-unlock-then-payment',
    name: 'Free Unlock Then Payment Attempt',
    description: 'User earns Superfan via 10 likes, then tries to pay. Should they be charged?',
    category: 'user-action',
    setup: {
      userType: 'free-user',
      offerIds: ['superfan-membership'],
      timeline: 'User has been active for 2 weeks, earned 10 likes yesterday',
    },
    event: {
      type: 'payment-attempt',
      description: 'User clicks "Subscribe" button while already having engagement-unlocked access',
    },
  },
  {
    id: 'creator-leaves-platform',
    name: 'Creator Leaves Platform',
    description: 'Creator with 500 active subscribers decides to leave. What happens to all subscriptions?',
    category: 'creator-event',
    setup: {
      userType: 'subscriber',
      offerIds: ['subscribe-creator'],
      timeline: 'Creator has been active for 1 year with 500 subscribers',
    },
    event: {
      type: 'creator-departure',
      description: 'Creator announces they\'re moving to another platform',
    },
  },
  {
    id: 'payment-fails-mid-month',
    name: 'Payment Fails Mid-Subscription',
    description: 'User\'s card declines on renewal. How long do they keep access?',
    category: 'payment-issue',
    setup: {
      userType: 'subscriber',
      offerIds: ['subscribe-creator'],
      timeline: 'User has been subscribed for 6 months, payment due today',
    },
    event: {
      type: 'payment-failure',
      description: 'Credit card is declined due to insufficient funds',
    },
  },
  {
    id: 'refund-after-creator-payout',
    name: 'Refund After Creator Already Paid',
    description: 'User gets Apple refund after creator already received their weekly payout',
    category: 'payment-issue',
    setup: {
      userType: 'subscriber',
      offerIds: ['subscribe-creator'],
      timeline: 'User subscribed 10 days ago, creator received payout on Friday',
    },
    event: {
      type: 'apple-refund',
      description: 'User requests and receives refund from Apple',
    },
  },
  {
    id: 'tip-to-banned-creator',
    name: 'Tip Sent Then Creator Banned',
    description: 'User sends $50 tip, creator gets banned same day before payout',
    category: 'creator-event',
    setup: {
      userType: 'one-time-buyer',
      offerIds: ['send-tip'],
      timeline: 'User sent $50 tip at 2pm',
    },
    event: {
      type: 'creator-ban',
      description: 'Creator is permanently banned at 5pm for violating TOS',
    },
  },
  {
    id: 'platform-ban-multiple-subs',
    name: 'Platform Bans User With Multiple Subs',
    description: 'User is subscribed to 5 creators, then banned from entire platform',
    category: 'system-event',
    setup: {
      userType: 'subscriber',
      offerIds: ['subscribe-creator', 'superfan-membership'],
      timeline: 'User has 5 active creator subscriptions totaling $45/month',
    },
    event: {
      type: 'platform-ban',
      description: 'User permanently banned for using fake payment methods',
    },
  },
  {
    id: 'downgrade-mid-cycle',
    name: 'Downgrade Subscription Mid-Cycle',
    description: 'VIP subscriber ($24.99) wants to downgrade to Supporter ($5.99) halfway through billing cycle',
    category: 'user-action',
    setup: {
      userType: 'subscriber',
      offerIds: ['subscribe-creator'],
      timeline: 'User on $24.99/month VIP tier, 15 days into cycle',
    },
    event: {
      type: 'plan-change',
      description: 'User requests downgrade to $5.99/month Supporter tier',
    },
  },
];

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface RevenueStore extends RevenueState {
  // Navigation
  setActiveView: (view: RevenueView) => void;
  setScenario: (scenario: ScenarioType) => void;
  
  // Offer selection
  selectOffer: (offerId: string | null) => void;
  openOfferEditor: (offerId: string, section?: RevenueState['editorSection']) => void;
  closeOfferEditor: () => void;
  
  // Offer actions
  updateOffer: (offerId: string, updates: Partial<Offer>) => void;
  addOffer: (offer: Offer) => void;
  addSuggestedOffer: (offerId: string) => void;
  removeOffer: (offerId: string) => void;
  duplicateOffer: (offerId: string) => void;
  
  // Offer configuration
  updateOfferPrices: (offerId: string, prices: PriceOption[]) => void;
  updateOfferSplits: (offerId: string, splits: EarnerSplit[]) => void;
  updateOfferPayout: (offerId: string, timing: PayoutTiming, holdDays?: number) => void;
  updateOfferRefund: (offerId: string, behavior: RefundBehavior, afterPayout?: RefundAfterPayout) => void;
  
  // Edge case configuration
  updateUnlockConditions: (offerId: string, conditions: UnlockCondition[], logic: UnlockLogic) => void;
  updateModerationPolicy: (offerId: string, policy: ModerationPolicy) => void;
  updateSubscriptionConfig: (offerId: string, config: SubscriptionConfig) => void;
  updateAdConfig: (offerId: string, config: AdConfig) => void;
  updatePromoConfig: (offerId: string, config: PromoConfig) => void;
  updateCreatorDeparturePolicy: (offerId: string, policy: CreatorDeparturePolicy) => void;
  
  // Edge case scenarios
  selectEdgeCase: (scenarioId: string | null) => void;
  simulateEdgeCase: (scenarioId: string) => { outcome: string; actions: string[] };
  
  // Monetization Entry
  updateMonetizationSetup: (setup: Partial<MonetizationSetup>) => void;
  applyMonetizationSetup: (setup: MonetizationSetup) => void;
  resetMonetizationSetup: () => void;
  
  // UI State
  setAddingOffer: (adding: boolean) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  
  // Computed
  getCurrentScenario: () => RevenueScenario;
  getSelectedOffer: () => Offer | null;
  getOfferMoneySummary: (offerId: string, priceId?: string) => MoneySummary | null;
  getHealthIssues: () => HealthIssue[];
  getAppStoreReadiness: () => AppStoreReadiness;
  getOfferStatus: (offer: Offer) => OfferStatus;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useRevenueStore = create<RevenueStore>((set, get) => ({
  // Initial state
  currentScenario: 'livestream',
  scenarios: scenarios,
  activeView: 'offers',
  selectedOfferId: null,
  editorSection: null,
  isAddingOffer: false,
  toastMessage: null,
  edgeCaseScenarios: edgeCaseScenarios,
  selectedEdgeCaseId: null,
  
  // Monetization Entry - set to false to show entry screen first
  isMonetizationConfigured: false,
  monetizationSetup: null,
  
  // Navigation
  setActiveView: (view) => set({ activeView: view }),
  
  setScenario: (scenario) => set({ 
    currentScenario: scenario,
    selectedOfferId: null,
    editorSection: null,
  }),
  
  // Offer selection
  selectOffer: (offerId) => set({ selectedOfferId: offerId }),
  
  openOfferEditor: (offerId, section) => set({ 
    activeView: 'editor',
    selectedOfferId: offerId,
    editorSection: section || null,
  }),
  
  closeOfferEditor: () => set({ 
    activeView: 'offers',
    selectedOfferId: null,
    editorSection: null,
  }),
  
  // Offer actions
  updateOffer: (offerId, updates) => {
    set((state) => {
      const scenario = state.scenarios[state.currentScenario];
      const updatedOffers = scenario.offers.map((o) =>
        o.id === offerId ? { ...o, ...updates } : o
      );
      
      // Recalculate status
      const offer = updatedOffers.find(o => o.id === offerId);
      if (offer) {
        offer.status = get().getOfferStatus(offer);
      }
      
      return {
        scenarios: {
          ...state.scenarios,
          [state.currentScenario]: {
            ...scenario,
            offers: updatedOffers,
          },
        },
      };
    });
  },
  
  addOffer: (offer) => {
    set((state) => {
      const scenario = state.scenarios[state.currentScenario];
      return {
        scenarios: {
          ...state.scenarios,
          [state.currentScenario]: {
            ...scenario,
            offers: [...scenario.offers, offer],
          },
        },
        isAddingOffer: false,
      };
    });
    get().showToast(`Added "${offer.name}"`);
  },
  
  addSuggestedOffer: (offerId) => {
    const { currentScenario, scenarios } = get();
    const scenario = scenarios[currentScenario];
    const suggested = scenario.suggestedOffers.find((o) => o.id === offerId);
    
    if (!suggested) return;
    
    const newOffer: Offer = {
      ...suggested,
      isSuggested: false,
      status: 'draft',
    };
    
    set((state) => {
      const scenario = state.scenarios[state.currentScenario];
      return {
        scenarios: {
          ...state.scenarios,
          [state.currentScenario]: {
            ...scenario,
            offers: [...scenario.offers, newOffer],
            suggestedOffers: scenario.suggestedOffers.filter((o) => o.id !== offerId),
          },
        },
      };
    });
    
    get().showToast(`Added "${suggested.name}" — configure it to go live`);
    get().openOfferEditor(offerId);
  },
  
  removeOffer: (offerId) => {
    set((state) => {
      const scenario = state.scenarios[state.currentScenario];
      return {
        scenarios: {
          ...state.scenarios,
          [state.currentScenario]: {
            ...scenario,
            offers: scenario.offers.filter((o) => o.id !== offerId),
          },
        },
        selectedOfferId: state.selectedOfferId === offerId ? null : state.selectedOfferId,
        activeView: state.selectedOfferId === offerId ? 'offers' : state.activeView,
      };
    });
  },
  
  duplicateOffer: (offerId) => {
    const { currentScenario, scenarios } = get();
    const offer = scenarios[currentScenario].offers.find((o) => o.id === offerId);
    if (!offer) return;
    
    const newOffer: Offer = {
      ...offer,
      id: `${offer.id}-copy-${Date.now()}`,
      name: `${offer.name} (Copy)`,
      status: 'draft',
      isConfigured: false,
    };
    
    get().addOffer(newOffer);
  },
  
  // Offer configuration
  updateOfferPrices: (offerId, prices) => {
    get().updateOffer(offerId, { prices, isConfigured: prices.length > 0 });
  },
  
  updateOfferSplits: (offerId, splits) => {
    const total = splits.reduce((acc, s) => acc + s.percentage, 0);
    if (total !== 100) return;
    get().updateOffer(offerId, { splits });
  },
  
  updateOfferPayout: (offerId, timing, holdDays) => {
    get().updateOffer(offerId, { payoutTiming: timing, payoutHoldDays: holdDays });
  },
  
  updateOfferRefund: (offerId, behavior, afterPayout) => {
    get().updateOffer(offerId, { refundBehavior: behavior, refundAfterPayout: afterPayout });
  },
  
  // NEW: Edge case configurations
  updateUnlockConditions: (offerId, conditions, logic) => {
    get().updateOffer(offerId, { unlockConditions: conditions, unlockLogic: logic });
  },
  
  updateModerationPolicy: (offerId, policy) => {
    get().updateOffer(offerId, { moderationPolicy: policy });
  },
  
  updateSubscriptionConfig: (offerId, config) => {
    get().updateOffer(offerId, { subscriptionConfig: config });
  },
  
  updateAdConfig: (offerId, config) => {
    get().updateOffer(offerId, { adConfig: config });
  },
  
  updatePromoConfig: (offerId, config) => {
    get().updateOffer(offerId, { promoConfig: config });
  },
  
  updateCreatorDeparturePolicy: (offerId, policy) => {
    get().updateOffer(offerId, { creatorDeparturePolicy: policy });
  },
  
  // Edge case scenarios
  selectEdgeCase: (scenarioId) => set({ selectedEdgeCaseId: scenarioId }),
  
  simulateEdgeCase: (scenarioId) => {
    const scenario = get().edgeCaseScenarios.find(s => s.id === scenarioId);
    if (!scenario) return { outcome: 'Unknown scenario', actions: [] };
    
    const { currentScenario, scenarios } = get();
    const offers = scenarios[currentScenario].offers;
    const relevantOffer = offers.find(o => scenario.setup.offerIds.includes(o.id));
    
    // Simulate based on configured policies
    if (scenario.event.type === 'creator-ban' && relevantOffer?.moderationPolicy) {
      const policy = relevantOffer.moderationPolicy.creatorBan;
      return {
        outcome: `Based on your configuration: ${policy.refundPolicy === 'full-refund' ? 'Full refund issued' : policy.refundPolicy === 'prorated-refund' ? 'Prorated refund issued' : 'No refund'}`,
        actions: [
          `User's access to this creator: ${policy.canResubscribe ? 'Can resubscribe after ' + policy.cooldownDays + ' days' : 'Permanently blocked'}`,
          `Refund source: ${relevantOffer.refundAfterPayout === 'deduct-next' ? 'Deducted from creator\'s next payout' : 'Platform covers cost'}`,
        ],
      };
    }
    
    if (scenario.event.type === 'payment-failure' && relevantOffer?.subscriptionConfig) {
      const grace = relevantOffer.subscriptionConfig.gracePeriod;
      const retry = relevantOffer.subscriptionConfig.billingRetry;
      return {
        outcome: `Based on your configuration: User keeps ${grace.accessDuringGrace} access for ${grace.days} days`,
        actions: [
          `Billing retry: ${retry.maxAttempts} attempts, every ${retry.intervalDays} days`,
          retry.notifyUser ? 'User will be notified via email' : 'No user notification',
          retry.notifyCreator ? 'Creator will be notified' : 'Creator not notified',
        ],
      };
    }
    
    return {
      outcome: 'Configure the offer settings to see how this scenario would be handled',
      actions: ['Set up moderation policy', 'Configure subscription settings', 'Define refund behavior'],
    };
  },
  
  // Monetization Entry
  updateMonetizationSetup: (updates) => {
    set((state) => ({
      monetizationSetup: state.monetizationSetup 
        ? { ...state.monetizationSetup, ...updates }
        : null,
    }));
  },
  
  applyMonetizationSetup: (setup) => {
    const { currentScenario, showToast } = get();
    
    // Generate offers based on scenario and setup
    const generatedOffers: Offer[] = [];
    
    if (currentScenario === 'cal-ai') {
      // Cal AI: Create Pro Subscription
      const prices: PriceOption[] = setup.pricing.map((tier) => ({
        id: tier.id,
        amount: tier.amount,
        period: tier.period,
        label: tier.label,
        isDefault: tier.isDefault,
        hasFreeTrial: tier.isDefault && setup.trialEnabled,
        freeTrialDays: setup.trialEnabled ? setup.trialDays : undefined,
      }));
      
      // Determine refund behavior from answers
      const refundBehavior = setup.answers.valueFrequency === 'full-refund' 
        ? 'full-revoke' 
        : setup.answers.valueFrequency === 'prorated' 
        ? 'prorated' 
        : 'no-refund';
      
      // Determine payment handling from answers
      const hasGracePeriod = setup.answers.creatorPayment === 'grace-period';
      const retryBilling = setup.answers.creatorPayment === 'retry-billing';
      
      generatedOffers.push({
        id: 'cal-ai-pro-generated',
        name: 'Cal AI Pro',
        icon: '⭐',
        type: 'subscription',
        description: 'Premium subscription with all features unlocked',
        status: 'ready',
        isConfigured: true,
        prices,
        splits: [{ earner: 'platform', percentage: 100 }],
        payoutTiming: 'monthly',
        refundBehavior: refundBehavior as RefundBehavior,
        color: '#8B5CF6',
        linkedToCreator: false,
        subscriptionConfig: {
          gracePeriod: { 
            enabled: hasGracePeriod, 
            days: hasGracePeriod ? 7 : 0, 
            accessDuringGrace: hasGracePeriod ? 'limited' : 'none' 
          },
          billingRetry: { 
            maxAttempts: retryBilling ? 5 : 3, 
            intervalDays: 3, 
            notifyUser: true, 
            notifyCreator: false 
          },
          planChanges: { allowMidCycle: true, prorateUpgrades: true, prorateDowngrades: false, immediateAccess: true },
          cancellation: { allowImmediateCancel: true, retainAccessUntilPeriodEnd: true, offerPausInstead: true, pauseDurationOptions: [7, 14, 30], winbackOfferEnabled: true, winbackDiscountPercent: 20 },
          sharing: { familySharingEnabled: false, maxFamilyMembers: 6 },
        },
      });
    } else if (currentScenario === 'livestream') {
      // Livestream: Create Subscribe to Creator + Tips + Superfan
      const creatorPrices: PriceOption[] = setup.pricing.map((tier) => ({
        id: tier.id,
        amount: tier.amount,
        period: tier.period,
        label: tier.label,
        displayName: tier.displayName,
        isDefault: tier.isDefault,
      }));
      
      // Determine refund behavior from answers
      const refundBehavior = setup.answers.valueFrequency === 'full-refund' 
        ? 'full-revoke' 
        : setup.answers.valueFrequency === 'prorated' 
        ? 'prorated' 
        : 'no-refund';
      
      // Determine payout timing from answers
      const payoutTiming = setup.answers.creatorPayment === 'weekly' 
        ? 'weekly' 
        : setup.answers.creatorPayment === 'monthly' 
        ? 'monthly' 
        : 'instant';
      
      generatedOffers.push({
        id: 'subscribe-creator-generated',
        name: 'Subscribe to Creator',
        icon: '💜',
        type: 'subscription',
        description: 'Monthly subscription to support a specific creator',
        status: 'ready',
        isConfigured: true,
        prices: creatorPrices,
        splits: [
          { earner: 'creator', percentage: 80 },
          { earner: 'platform', percentage: 20 },
        ],
        payoutTiming: payoutTiming as PayoutTiming,
        refundBehavior: refundBehavior as RefundBehavior,
        refundAfterPayout: refundBehavior !== 'no-refund' ? 'deduct-next' : undefined,
        creatorChurnBehavior: 'reroute-to-platform',
        color: '#8B5CF6',
        linkedToCreator: true,
        subscriptionConfig: defaultSubscriptionConfig,
        moderationPolicy: defaultModerationPolicy,
        creatorDeparturePolicy: defaultCreatorDeparturePolicy,
      });
      
      // Send a Tip (always no-refund, but uses payout timing)
      generatedOffers.push({
        id: 'send-tip-generated',
        name: 'Send a Tip',
        icon: '⚡',
        type: 'consumable',
        description: 'One-time tips to show appreciation during streams',
        status: 'ready',
        isConfigured: true,
        prices: [
          { id: 'tip-1', amount: 1.00, period: 'one-time', label: '$1', displayName: 'Quick Tip' },
          { id: 'tip-5', amount: 5.00, period: 'one-time', label: '$5', displayName: 'High Five 🙌', isDefault: true },
          { id: 'tip-10', amount: 10.00, period: 'one-time', label: '$10', displayName: 'Super Fan ⭐' },
        ],
        splits: [
          { earner: 'creator', percentage: 90 },
          { earner: 'platform', percentage: 10 },
        ],
        payoutTiming: payoutTiming as PayoutTiming,
        refundBehavior: 'no-refund',
        color: '#F59E0B',
        linkedToCreator: true,
      });
      
      // Superfan Membership (uses refund policy and payout timing)
      generatedOffers.push({
        id: 'superfan-generated',
        name: 'Superfan Membership',
        icon: '⭐',
        type: 'subscription',
        description: 'Premium creator-linked membership with exclusive perks',
        status: 'ready',
        isConfigured: true,
        prices: [
          { id: 'superfan-monthly', amount: 4.99, period: 'month', label: '$4.99/month', isDefault: true },
        ],
        splits: [
          { earner: 'creator', percentage: 50 },
          { earner: 'platform', percentage: 50 },
        ],
        payoutTiming: payoutTiming as PayoutTiming,
        refundBehavior: refundBehavior as RefundBehavior,
        refundAfterPayout: refundBehavior !== 'no-refund' ? 'deduct-next' : undefined,
        creatorChurnBehavior: 'reroute-to-platform',
        color: '#EC4899',
        linkedToCreator: true,
        subscriptionConfig: defaultSubscriptionConfig,
        moderationPolicy: defaultModerationPolicy,
        creatorDeparturePolicy: defaultCreatorDeparturePolicy,
      });
    }
    
    // Update the store
    set((state) => {
      const scenario = state.scenarios[state.currentScenario];
      return {
        isMonetizationConfigured: true,
        monetizationSetup: setup,
        activeView: 'offers',
        scenarios: {
          ...state.scenarios,
          [state.currentScenario]: {
            ...scenario,
            offers: generatedOffers,
            suggestedOffers: currentScenario === 'cal-ai' 
              ? calAISuggestedOffers 
              : livestreamSuggestedOffers,
          },
        },
      };
    });
    
    showToast(`Monetization configured! ${generatedOffers.length} offers created.`);
  },
  
  resetMonetizationSetup: () => {
    set({
      isMonetizationConfigured: false,
      monetizationSetup: null,
    });
    get().showToast('Monetization reset — you can configure it again');
  },
  
  // UI State
  setAddingOffer: (adding) => set({ isAddingOffer: adding }),
  
  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },
  
  clearToast: () => set({ toastMessage: null }),
  
  // Computed
  getCurrentScenario: () => {
    const { currentScenario, scenarios } = get();
    return scenarios[currentScenario];
  },
  
  getSelectedOffer: () => {
    const { currentScenario, scenarios, selectedOfferId } = get();
    if (!selectedOfferId) return null;
    return scenarios[currentScenario].offers.find((o) => o.id === selectedOfferId) || null;
  },
  
  getOfferMoneySummary: (offerId, priceId) => {
    const { currentScenario, scenarios } = get();
    const offer = scenarios[currentScenario].offers.find((o) => o.id === offerId);
    if (!offer || offer.prices.length === 0) return null;
    
    const price = priceId 
      ? offer.prices.find((p) => p.id === priceId)
      : offer.prices.find((p) => p.isDefault) || offer.prices[0];
    
    if (!price) return null;
    
    const userPays = price.amount;
    const appleKeeps = userPays * 0.30;
    const remaining = userPays - appleKeeps;
    
    const creatorSplit = offer.splits.find((s) => s.earner === 'creator');
    const platformSplit = offer.splits.find((s) => s.earner === 'platform');
    
    const creatorGets = creatorSplit ? remaining * (creatorSplit.percentage / 100) : 0;
    const platformGets = platformSplit ? remaining * (platformSplit.percentage / 100) : 0;
    
    const timingLabels: Record<PayoutTiming, string> = {
      instant: 'Immediately',
      weekly: 'Weekly',
      monthly: 'Monthly',
    };
    
    return {
      userPays,
      appleKeeps,
      remaining,
      creatorGets,
      platformGets,
      payoutTiming: timingLabels[offer.payoutTiming],
    };
  },
  
  getHealthIssues: () => {
    const { currentScenario, scenarios } = get();
    const offers = scenarios[currentScenario].offers;
    const issues: HealthIssue[] = [];
    
    offers.forEach((offer) => {
      // Check refund-after-payout for creator-linked offers
      if (offer.linkedToCreator && offer.refundBehavior !== 'no-refund' && !offer.refundAfterPayout) {
        issues.push({
          id: `${offer.id}-refund-after-payout`,
          type: 'refund-after-payout-missing',
          severity: 'warning',
          message: `What happens if refund occurs after creator payout?`,
          offerId: offer.id,
          section: 'refund',
          recommendation: 'Configure whether platform covers or deducts from next payout',
        });
      }
      
      // Check creator churn behavior
      if (offer.linkedToCreator && !offer.creatorChurnBehavior) {
        issues.push({
          id: `${offer.id}-creator-churn`,
          type: 'creator-churn-missing',
          severity: 'warning',
          message: `What if creator leaves? "${offer.name}"`,
          offerId: offer.id,
          section: 'departure',
          recommendation: 'Define what happens to subscribers if creator departs',
        });
      }
      
      // Check prices
      if (offer.type !== 'ad-supported' && offer.prices.length === 0) {
        issues.push({
          id: `${offer.id}-no-prices`,
          type: 'no-prices-set',
          severity: 'error',
          message: `No prices set for "${offer.name}"`,
          offerId: offer.id,
          section: 'price',
        });
      }
      
      // Check splits
      const splitTotal = offer.splits.reduce((acc, s) => acc + s.percentage, 0);
      if (splitTotal !== 100) {
        issues.push({
          id: `${offer.id}-splits`,
          type: 'splits-incomplete',
          severity: 'error',
          message: `Earnings splits don't add to 100% for "${offer.name}"`,
          offerId: offer.id,
          section: 'earners',
        });
      }
      
      // NEW: Check moderation policy for creator-linked
      if (offer.linkedToCreator && !offer.moderationPolicy?.enabled) {
        issues.push({
          id: `${offer.id}-moderation`,
          type: 'moderation-policy-missing',
          severity: 'warning',
          message: `No moderation policy for "${offer.name}"`,
          offerId: offer.id,
          section: 'moderation',
          recommendation: 'Define what happens when users are banned',
        });
      }
      
      // NEW: Check for conflicting unlock conditions
      if (offer.unlockConditions && offer.unlockConditions.length > 1) {
        const paymentUnlock = offer.unlockConditions.find(c => c.type === 'payment' && c.enabled);
        const freeUnlock = offer.unlockConditions.find(c => c.type !== 'payment' && c.enabled);
        
        if (paymentUnlock && freeUnlock && offer.unlockLogic === 'any') {
          issues.push({
            id: `${offer.id}-unlock-conflict`,
            type: 'unlock-conditions-conflict',
            severity: 'info',
            message: `"${offer.name}" has payment AND free unlock paths`,
            offerId: offer.id,
            section: 'unlock',
            recommendation: 'Make sure this is intentional - users could unlock without paying',
          });
        }
      }
      
      // NEW: Check subscription grace period
      if (offer.type === 'subscription' && !offer.subscriptionConfig?.gracePeriod?.enabled) {
        issues.push({
          id: `${offer.id}-grace-period`,
          type: 'subscription-grace-period-missing',
          severity: 'info',
          message: `No payment grace period for "${offer.name}"`,
          offerId: offer.id,
          section: 'subscription',
          recommendation: 'Consider adding a grace period for failed payments',
        });
      }
      
      // NEW: Check ad config for ad-supported offers
      if (offer.type === 'ad-supported' && !offer.adConfig?.enabled) {
        issues.push({
          id: `${offer.id}-ad-config`,
          type: 'ad-config-incomplete',
          severity: 'error',
          message: `Ad configuration incomplete for "${offer.name}"`,
          offerId: offer.id,
          section: 'ads',
        });
      }
      
      // NEW: Check creator departure for creator-linked
      if (offer.linkedToCreator && !offer.creatorDeparturePolicy) {
        issues.push({
          id: `${offer.id}-departure`,
          type: 'creator-departure-unhandled',
          severity: 'warning',
          message: `Creator departure not configured for "${offer.name}"`,
          offerId: offer.id,
          section: 'departure',
          recommendation: 'Define what happens to subscribers if creator leaves',
        });
      }
    });
    
    // Add success if no major issues
    const hasErrors = issues.filter(i => i.severity === 'error').length;
    const hasWarnings = issues.filter(i => i.severity === 'warning').length;
    
    if (hasErrors === 0 && hasWarnings === 0) {
      issues.unshift({
        id: 'all-good',
        type: 'app-store-ready',
        severity: 'success',
        message: 'All offers configured and ready!',
      });
    }
    
    return issues;
  },
  
  getAppStoreReadiness: () => {
    const { currentScenario, scenarios } = get();
    const offers = scenarios[currentScenario].offers.filter(o => o.status !== 'inactive');
    
    const subscriptions = offers.filter((o) => o.type === 'subscription').length;
    const consumables = offers.filter((o) => o.type === 'consumable').length;
    const oneTimePurchases = offers.filter((o) => o.type === 'one-time').length;
    
    const products: AppStoreReadiness['products'] = offers
      .filter((o) => o.type !== 'ad-supported')
      .map((offer) => {
        const typeMap: Record<string, AppStoreReadiness['products'][0]['productType']> = {
          subscription: 'Auto-Renewable Subscription',
          'one-time': 'Non-Consumable',
          consumable: 'Consumable',
        };
        
        return {
          productId: `com.app.${offer.id.replace(/-/g, '_')}`,
          productType: typeMap[offer.type] || 'Non-Consumable',
          displayName: offer.name,
          priceTiers: offer.prices.map((p) => p.label),
          subscriptionGroup: offer.type === 'subscription' ? 'premium_access' : undefined,
          reviewNotes: generateReviewNotes(offer),
          sourceOfferId: offer.id,
        };
      });
    
    return {
      subscriptions,
      consumables,
      oneTimePurchases,
      pricingMapped: offers.every((o) => o.type === 'ad-supported' || o.prices.length > 0),
      reviewNotesGenerated: true,
      products,
    };
  },
  
  getOfferStatus: (offer) => {
    if (offer.status === 'inactive') return 'inactive';
    
    const hasErrors = [];
    
    // Check required fields
    if (offer.type !== 'ad-supported' && offer.prices.length === 0) {
      hasErrors.push('prices');
    }
    
    const splitTotal = offer.splits.reduce((acc, s) => acc + s.percentage, 0);
    if (splitTotal !== 100) {
      hasErrors.push('splits');
    }
    
    if (hasErrors.length > 0) return 'needs-attention';
    
    // Check warnings for creator-linked
    if (offer.linkedToCreator) {
      if (!offer.refundAfterPayout || !offer.creatorChurnBehavior) {
        return 'needs-attention';
      }
      if (!offer.moderationPolicy?.enabled) {
        return 'needs-attention';
      }
    }
    
    if (!offer.isConfigured) return 'draft';
    
    return 'ready';
  },
}));

// ============================================================================
// HELPERS
// ============================================================================

function generateReviewNotes(offer: Offer): string {
  const typeDescriptions: Record<string, string> = {
    subscription: `This subscription unlocks "${offer.name}" features for users.`,
    'one-time': `This is a one-time purchase for "${offer.name}".`,
    consumable: `This consumable item allows users to ${offer.name.toLowerCase()}.`,
  };
  
  let notes = typeDescriptions[offer.type] || '';
  
  if (offer.linkedToCreator) {
    notes += ' Revenue is shared with content creators based on configured split ratios.';
  }
  
  if (offer.refundBehavior === 'full-revoke') {
    notes += ' Upon refund, access is immediately revoked.';
  }
  
  if (offer.unlockConditions && offer.unlockConditions.length > 1) {
    notes += ' This offer can also be unlocked through user engagement/achievements.';
  }
  
  return notes;
}
