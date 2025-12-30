// Revenue Module Types - Comprehensive Edge Case Architecture
// Core principle: Revenue is designed around "Offers" with full edge case coverage

export type ScenarioType = 'cal-ai' | 'livestream';

// ============================================================================
// MONETIZATION ENTRY SETUP
// ============================================================================

export type MonetizationModel = 'subscription' | 'freemium' | 'free' | 'ads' | 'creator-subscription';

export type ValueFrequency = 'habit-based' | 'somewhat' | 'mostly-one-time';
export type CreatorPaymentAnswer = 'yes' | 'no' | 'not-sure';

export interface PricingTier {
  id: string;
  amount: number;
  period: 'week' | 'month' | 'year';
  label: string;
  isDefault?: boolean;
  displayName?: string;
}

export interface MonetizationSetup {
  recommendedModel: MonetizationModel;
  pricing: PricingTier[];
  trialEnabled: boolean;
  trialDays: number;
  assumptions: {
    usersPerMonth: number;
    conversionPct: number;
    avgPrice: number;
  };
  answers: {
    valueFrequency?: ValueFrequency;
    creatorPayment?: CreatorPaymentAnswer;
  };
}

export interface MonetizationRecommendation {
  model: MonetizationModel;
  modelLabel: string;
  reasons: string[];
  typicalRange: string;
  defaultPricing: PricingTier[];
  trialDefault: boolean;
}

// ============================================================================
// OFFER TYPES - The core unit of Revenue
// ============================================================================

export type OfferType = 'subscription' | 'one-time' | 'consumable' | 'ad-supported';

export type OfferStatus = 'draft' | 'ready' | 'needs-attention' | 'inactive';

export type PayoutTiming = 'instant' | 'weekly' | 'monthly';

export type RefundBehavior = 'full-revoke' | 'prorated' | 'no-refund';

export type RefundAfterPayout = 'deduct-next' | 'platform-covers';

// ============================================================================
// PRICING & PAYMENT CONFIGURATION
// ============================================================================

export interface PriceOption {
  id: string;
  amount: number;
  period: 'week' | 'month' | 'year' | 'one-time';
  label: string;
  displayName?: string;
  isDefault?: boolean;
  // Free trial support
  hasFreeTrial?: boolean;
  freeTrialDays?: number;
  // Regional pricing
  regionalPrices?: RegionalPrice[];
}

export interface RegionalPrice {
  region: string;
  currency: string;
  amount: number;
  enabled: boolean;
}

export type PaymentMethod = 'apple-iap' | 'stripe' | 'paypal' | 'crypto';

export interface PaymentConfig {
  enabledMethods: PaymentMethod[];
  primaryMethod: PaymentMethod;
  stripeAccountId?: string;
  allowAlternativeCheckout: boolean; // For web checkout bypass
}

// ============================================================================
// ALTERNATIVE UNLOCK CONDITIONS (The key edge case!)
// ============================================================================

export type UnlockConditionType = 
  | 'payment'           // Standard payment
  | 'engagement'        // Likes, comments, shares
  | 'achievement'       // Completed challenges
  | 'referral'          // Referred X users
  | 'time-based'        // Been a member for X days
  | 'creator-gift'      // Creator manually unlocked
  | 'promotional';      // Promo code

export interface UnlockCondition {
  id: string;
  type: UnlockConditionType;
  enabled: boolean;
  
  // For engagement unlocks
  engagementMetric?: 'likes_received' | 'comments' | 'watch_time' | 'streams_attended';
  engagementThreshold?: number;
  engagementWindow?: 'all-time' | 'monthly' | 'weekly';
  
  // For achievement unlocks
  achievementIds?: string[];
  
  // For referral unlocks
  referralCount?: number;
  
  // For time-based unlocks
  membershipDays?: number;
  
  // For promotional unlocks
  promoCodeRequired?: boolean;
  
  // What happens when this condition is met
  unlockDuration?: 'permanent' | 'monthly' | 'weekly' | 'daily';
  unlockMessage?: string;
}

export type UnlockLogic = 'any' | 'all'; // ANY condition vs ALL conditions

// ============================================================================
// USER MODERATION & BAN HANDLING
// ============================================================================

export type BanType = 'temporary' | 'permanent';

export type BanRefundPolicy = 
  | 'full-refund'           // Refund everything
  | 'prorated-refund'       // Refund remaining time
  | 'no-refund'             // No refund (TOS violation)
  | 'case-by-case';         // Manual review

export type BanAccessPolicy = 
  | 'immediate-revoke'      // Access revoked immediately
  | 'grace-period'          // X days to appeal
  | 'downgrade-to-free';    // Keep basic access

export interface ModerationPolicy {
  enabled: boolean;
  
  // For temporary bans
  temporaryBan: {
    refundPolicy: BanRefundPolicy;
    accessPolicy: BanAccessPolicy;
    gracePeriodDays: number;
    pauseSubscription: boolean; // Pause billing during ban
  };
  
  // For permanent bans
  permanentBan: {
    refundPolicy: BanRefundPolicy;
    accessPolicy: BanAccessPolicy;
    appealWindowDays: number;
  };
  
  // Creator-specific bans (banned from specific creator)
  creatorBan: {
    refundPolicy: BanRefundPolicy;
    canResubscribe: boolean;
    cooldownDays: number;
  };
}

// ============================================================================
// SUBSCRIPTION EDGE CASES
// ============================================================================

export interface SubscriptionConfig {
  // Grace period for failed payments
  gracePeriod: {
    enabled: boolean;
    days: number;
    accessDuringGrace: 'full' | 'limited' | 'none';
  };
  
  // Billing retry configuration
  billingRetry: {
    maxAttempts: number;
    intervalDays: number;
    notifyUser: boolean;
    notifyCreator: boolean;
  };
  
  // Upgrade/downgrade behavior
  planChanges: {
    allowMidCycle: boolean;
    prorateUpgrades: boolean;
    prorateDowngrades: boolean;
    immediateAccess: boolean; // Immediate access on upgrade
  };
  
  // Cancellation behavior
  cancellation: {
    allowImmediateCancel: boolean;
    retainAccessUntilPeriodEnd: boolean;
    offerPausInstead: boolean;
    pauseDurationOptions: number[]; // e.g. [7, 14, 30]
    winbackOfferEnabled: boolean;
    winbackDiscountPercent: number;
  };
  
  // Family/sharing
  sharing: {
    familySharingEnabled: boolean;
    maxFamilyMembers: number;
  };
}

// ============================================================================
// AD REVENUE CONFIGURATION
// ============================================================================

export type AdNetwork = 'admob' | 'meta' | 'applovin' | 'unity' | 'ironsource';
export type AdPlacement = 'banner' | 'interstitial' | 'rewarded' | 'native' | 'pre-roll' | 'mid-roll';

export interface AdConfig {
  enabled: boolean;
  networks: AdNetwork[];
  primaryNetwork: AdNetwork;
  
  placements: AdPlacementConfig[];
  
  // Revenue sharing
  creatorShare: number; // Percentage (0-100)
  platformShare: number;
  
  // User experience
  adFrequency: {
    minSecondsBetweenAds: number;
    maxAdsPerHour: number;
    maxAdsPerSession: number;
  };
  
  // Estimated revenue
  estimatedECPM: number;
  estimatedDailyRevenue?: number;
}

export interface AdPlacementConfig {
  id: string;
  type: AdPlacement;
  location: string; // e.g. "feed_every_5", "stream_start", "between_videos"
  enabled: boolean;
  frequency?: number; // For feed placements
  skipAfterSeconds?: number; // For video ads
  rewardAmount?: number; // For rewarded ads
  rewardType?: string; // e.g. "coins", "extra_lives"
}

// ============================================================================
// PROMOTIONAL & DISCOUNT CONFIGURATION
// ============================================================================

export type PromoType = 'percentage' | 'fixed' | 'free-trial-extension' | 'free-access';

export interface PromoConfig {
  enabled: boolean;
  
  // Intro offers (first-time users)
  introOffer: {
    enabled: boolean;
    type: PromoType;
    value: number; // Percentage or fixed amount
    duration: 'first-period' | 'first-3-months' | 'first-year';
  };
  
  // Promo codes
  promoCodes: {
    enabled: boolean;
    allowMultipleUses: boolean;
    codes: PromoCode[];
  };
  
  // Student/education discount
  studentDiscount: {
    enabled: boolean;
    discountPercent: number;
    verificationMethod: 'sheerid' | 'manual' | 'email-domain';
  };
  
  // Seasonal/event promotions
  seasonalPromos: {
    enabled: boolean;
    // Could link to a promo calendar
  };
}

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
  creatorId?: string; // Creator-specific codes
  minPurchase?: number;
}

// ============================================================================
// CREATOR DEPARTURE SCENARIOS
// ============================================================================

export type CreatorDepartureReason = 
  | 'voluntary'         // Creator left platform
  | 'banned'            // Creator was banned
  | 'inactive'          // Creator went inactive
  | 'deceased';         // Sensitive handling

export type SubscriberHandling = 
  | 'full-refund'           // Refund all active subscribers
  | 'transfer-to-platform'  // Subscribers become platform subscribers
  | 'transfer-to-creator'   // Subscribers follow to new platform (if allowed)
  | 'gradual-sunset'        // Notify users, honor existing period, then end
  | 'find-similar';         // Suggest similar creators

export interface CreatorDeparturePolicy {
  voluntary: {
    subscriberHandling: SubscriberHandling;
    noticeRequiredDays: number;
    finalPayoutDelay: number; // Hold final payout for refunds
    contentRetention: 'archive' | 'delete' | 'creator-choice';
  };
  
  banned: {
    subscriberHandling: SubscriberHandling;
    refundFromEarnings: boolean;
    contentHandling: 'immediate-remove' | 'gradual-remove' | 'archive';
  };
  
  inactive: {
    inactiveDaysThreshold: number;
    subscriberNotification: boolean;
    autoRefundAfterDays: number;
    contentRetention: 'keep' | 'archive' | 'delete-after-days';
  };
}

// ============================================================================
// PAYOUT CONFIGURATION
// ============================================================================

export interface PayoutConfig {
  minimumPayout: number;
  currency: string;
  
  // Fee breakdown
  fees: {
    platformFeePercent: number;
    paymentProcessingPercent: number;
    showFeesTransparently: boolean;
  };
  
  // Payout methods
  methods: {
    bankTransfer: boolean;
    paypal: boolean;
    stripe: boolean;
    crypto: boolean;
  };
  
  // Tax handling
  tax: {
    collectW9: boolean;
    reportTo1099: boolean;
    vatHandling: 'platform-handles' | 'creator-responsible';
  };
}

// ============================================================================
// EARNER SPLIT
// ============================================================================

export interface EarnerSplit {
  earner: 'creator' | 'platform';
  percentage: number;
}

// ============================================================================
// THE CORE OFFER TYPE - Enhanced
// ============================================================================

export interface Offer {
  id: string;
  name: string;
  icon: string;
  type: OfferType;
  description: string;
  
  // Status
  status: OfferStatus;
  isConfigured: boolean;
  isSuggested?: boolean;
  
  // Section A: Price
  prices: PriceOption[];
  
  // Section B: Who earns
  splits: EarnerSplit[];
  
  // Section C: When money moves
  payoutTiming: PayoutTiming;
  payoutHoldDays?: number;
  
  // Section D: If something goes wrong
  refundBehavior: RefundBehavior;
  refundAfterPayout?: RefundAfterPayout;
  
  // Visual
  color: string;
  
  // Creator-linked offers
  linkedToCreator: boolean;
  creatorChurnBehavior?: 'reroute-to-platform' | 'refund-users';
  
  // NEW: Alternative unlock conditions
  unlockConditions?: UnlockCondition[];
  unlockLogic?: UnlockLogic;
  
  // NEW: Moderation policy for this offer
  moderationPolicy?: ModerationPolicy;
  
  // NEW: Subscription-specific config
  subscriptionConfig?: SubscriptionConfig;
  
  // NEW: Ad configuration (for ad-supported offers)
  adConfig?: AdConfig;
  
  // NEW: Promo configuration
  promoConfig?: PromoConfig;
  
  // NEW: Creator departure policy (for creator-linked offers)
  creatorDeparturePolicy?: CreatorDeparturePolicy;
}

// ============================================================================
// MONEY SUMMARY - Enhanced
// ============================================================================

export interface MoneySummary {
  userPays: number;
  appleKeeps: number;
  remaining: number;
  creatorGets: number;
  platformGets: number;
  payoutTiming: string;
  // NEW
  afterFees?: number;
  processingFees?: number;
}

// ============================================================================
// REVENUE HEALTH - Enhanced
// ============================================================================

export type HealthIssueType = 
  | 'refund-after-payout-missing'
  | 'creator-churn-missing'
  | 'no-prices-set'
  | 'splits-incomplete'
  | 'app-store-ready'
  // NEW issues
  | 'moderation-policy-missing'
  | 'unlock-conditions-conflict'
  | 'subscription-grace-period-missing'
  | 'ad-config-incomplete'
  | 'creator-departure-unhandled'
  | 'ban-scenario-unhandled';

export type HealthIssueSeverity = 'error' | 'warning' | 'success' | 'info';

export interface HealthIssue {
  id: string;
  type: HealthIssueType;
  severity: HealthIssueSeverity;
  message: string;
  offerId?: string;
  section?: 'price' | 'earners' | 'payout' | 'refund' | 'unlock' | 'moderation' | 'subscription' | 'ads' | 'promo' | 'departure';
  recommendation?: string;
}

// ============================================================================
// EDGE CASE SCENARIOS FOR SIMULATION
// ============================================================================

export interface EdgeCaseScenario {
  id: string;
  name: string;
  description: string;
  category: 'user-action' | 'system-event' | 'creator-event' | 'payment-issue';
  
  // The scenario setup
  setup: {
    userType: 'subscriber' | 'one-time-buyer' | 'free-user';
    offerIds: string[];
    timeline: string; // e.g. "User subscribed 15 days ago"
  };
  
  // What happens
  event: {
    type: string;
    description: string;
  };
  
  // Expected outcome based on config
  expectedOutcome?: {
    accessStatus: 'active' | 'revoked' | 'limited';
    refundAmount?: number;
    creatorImpact?: string;
    platformAction?: string;
  };
}

// ============================================================================
// APP STORE EXPORT
// ============================================================================

export type IAPType = 'Auto-Renewable Subscription' | 'Non-Consumable' | 'Consumable' | 'Non-Renewing Subscription';

export interface AppStoreProduct {
  productId: string;
  productType: IAPType;
  displayName: string;
  priceTiers: string[];
  subscriptionGroup?: string;
  reviewNotes: string;
  sourceOfferId: string;
}

export interface AppStoreReadiness {
  subscriptions: number;
  consumables: number;
  oneTimePurchases: number;
  pricingMapped: boolean;
  reviewNotesGenerated: boolean;
  products: AppStoreProduct[];
}

// ============================================================================
// SCENARIO
// ============================================================================

export interface RevenueScenario {
  id: ScenarioType;
  name: string;
  description: string;
  icon: string;
  offers: Offer[];
  suggestedOffers: Offer[];
  // NEW
  payoutConfig?: PayoutConfig;
  paymentConfig?: PaymentConfig;
}

// ============================================================================
// STORE STATE
// ============================================================================

export type RevenueView = 'offers' | 'editor' | 'health' | 'money-map' | 'app-store' | 'edge-cases' | 'monetization-entry';

export interface RevenueState {
  currentScenario: ScenarioType;
  scenarios: Record<ScenarioType, RevenueScenario>;
  
  activeView: RevenueView;
  selectedOfferId: string | null;
  editorSection: 'price' | 'earners' | 'payout' | 'refund' | 'unlock' | 'moderation' | 'subscription' | 'ads' | 'promo' | 'departure' | null;
  
  isAddingOffer: boolean;
  toastMessage: string | null;
  
  // Edge cases
  edgeCaseScenarios: EdgeCaseScenario[];
  selectedEdgeCaseId: string | null;
  
  // Monetization Entry
  isMonetizationConfigured: boolean;
  monetizationSetup: MonetizationSetup | null;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const APPLE_COMMISSION_PERCENT = 30;

export const DEFAULT_PRICES: Record<OfferType, PriceOption[]> = {
  subscription: [
    { id: 'weekly', amount: 4.99, period: 'week', label: '$4.99/week' },
    { id: 'monthly', amount: 9.99, period: 'month', label: '$9.99/month', isDefault: true },
    { id: 'yearly', amount: 49.99, period: 'year', label: '$49.99/year' },
  ],
  'one-time': [
    { id: 'standard', amount: 9.99, period: 'one-time', label: '$9.99', isDefault: true },
  ],
  consumable: [
    { id: 'small', amount: 0.99, period: 'one-time', label: '$0.99' },
    { id: 'medium', amount: 4.99, period: 'one-time', label: '$4.99', isDefault: true },
    { id: 'large', amount: 9.99, period: 'one-time', label: '$9.99' },
  ],
  'ad-supported': [],
};

export const PAYOUT_TIMING_LABELS: Record<PayoutTiming, string> = {
  instant: 'Immediately',
  weekly: 'Weekly (every Friday)',
  monthly: 'End of month',
};

export const REFUND_BEHAVIOR_LABELS: Record<RefundBehavior, { title: string; description: string }> = {
  'full-revoke': { 
    title: 'Full refund & revoke', 
    description: 'User gets full refund, access revoked immediately' 
  },
  'prorated': { 
    title: 'Prorated refund', 
    description: 'Refund based on remaining subscription time' 
  },
  'no-refund': { 
    title: 'No refunds', 
    description: 'Non-refundable purchase (consumables typically)' 
  },
};

// NEW CONSTANTS

export const UNLOCK_CONDITION_LABELS: Record<UnlockConditionType, { title: string; description: string; icon: string }> = {
  payment: { title: 'Purchase', description: 'Standard payment unlock', icon: '💳' },
  engagement: { title: 'Engagement', description: 'Unlock through activity', icon: '❤️' },
  achievement: { title: 'Achievement', description: 'Complete challenges', icon: '🏆' },
  referral: { title: 'Referral', description: 'Invite friends', icon: '👥' },
  'time-based': { title: 'Loyalty', description: 'Member for X days', icon: '📅' },
  'creator-gift': { title: 'Creator Gift', description: 'Gifted by creator', icon: '🎁' },
  promotional: { title: 'Promo Code', description: 'Use a code', icon: '🎟️' },
};

export const AD_NETWORK_LABELS: Record<AdNetwork, { name: string; avgECPM: number }> = {
  admob: { name: 'Google AdMob', avgECPM: 2.50 },
  meta: { name: 'Meta Audience Network', avgECPM: 3.00 },
  applovin: { name: 'AppLovin MAX', avgECPM: 4.00 },
  unity: { name: 'Unity Ads', avgECPM: 2.00 },
  ironsource: { name: 'ironSource', avgECPM: 3.50 },
};

export const AD_PLACEMENT_LABELS: Record<AdPlacement, { name: string; description: string }> = {
  banner: { name: 'Banner', description: 'Small persistent ad at top/bottom' },
  interstitial: { name: 'Interstitial', description: 'Full-screen ad between content' },
  rewarded: { name: 'Rewarded', description: 'User watches ad for reward' },
  native: { name: 'Native', description: 'Blends with feed content' },
  'pre-roll': { name: 'Pre-roll', description: 'Before video content' },
  'mid-roll': { name: 'Mid-roll', description: 'During video content' },
};

export const BAN_SCENARIO_EXAMPLES = [
  { id: 'spam', name: 'Spamming', severity: 'temporary' as BanType },
  { id: 'harassment', name: 'Harassment', severity: 'permanent' as BanType },
  { id: 'tos-violation', name: 'Terms of Service Violation', severity: 'permanent' as BanType },
  { id: 'chargebacks', name: 'Excessive Chargebacks', severity: 'permanent' as BanType },
  { id: 'creator-ban', name: 'Banned by Creator', severity: 'temporary' as BanType },
];
