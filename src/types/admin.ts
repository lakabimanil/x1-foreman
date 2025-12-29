// Cal AI Admin Dashboard (hardcoded) types

export type AdminSection =
  | 'overview'
  | 'moderation'
  | 'users'
  | 'support'
  | 'billing'
  | 'flags'
  | 'settings'
  | 'audit';

export type AdminRole = 'owner' | 'support' | 'moderator';

export type UserStatus = 'active' | 'disabled' | 'banned';
export type PlanTier = 'free' | 'pro';

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';
export type BillingInterval = 'monthly' | 'yearly';

export type ModerationStatus = 'pending' | 'approved' | 'removed' | 'escalated';
export type ModerationSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ModerationReason =
  | 'non_food'
  | 'nudity'
  | 'violence'
  | 'spam'
  | 'self_harm'
  | 'hate'
  | 'other';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  plan: PlanTier;
  createdAt: number; // epoch ms
  lastActiveAt: number; // epoch ms
  lastScanAt: number; // epoch ms
  totalScans: number;
  flaggedScans: number;
  riskScore: number; // 0-100
  notes: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  interval: BillingInterval;
  amountCents: number;
  currency: 'USD';
  currentPeriodStart: number; // epoch ms
  currentPeriodEnd: number; // epoch ms
  lastPaymentAt: number; // epoch ms
  refundsCount: number;
}

export interface ModerationItem {
  id: string;
  userId: string;
  createdAt: number; // epoch ms
  source: 'meal_photo' | 'label_scan' | 'profile_photo';
  reason: ModerationReason;
  severity: ModerationSeverity;
  aiSafetyScore: number; // 0-100, higher = safer
  status: ModerationStatus;
  previewLabel: string; // lightweight placeholder for preview
  details: {
    modelVersion: string;
    estimatedCalories?: number;
    detectedFoods?: string[];
    notes?: string;
  };
}

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TicketCategory = 'billing' | 'accuracy' | 'bug' | 'account' | 'feature';

export interface TicketMessage {
  id: string;
  at: number;
  author: 'user' | 'agent';
  body: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  subject: string;
  tags: string[];
  messages: TicketMessage[];
  slaDueAt: number;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercent: number; // 0-100
  updatedAt: number;
}

export interface IntegrationStatus {
  id: string;
  name: 'Stripe' | 'Slack' | 'Mixpanel' | 'Sentry' | 'OpenAI';
  connected: boolean;
  detail: string;
  updatedAt: number;
}

export type AuditAction =
  | 'setup_completed'
  | 'moderation_approved'
  | 'moderation_removed'
  | 'moderation_escalated'
  | 'user_warned'
  | 'user_disabled'
  | 'user_banned'
  | 'user_granted_pro'
  | 'ticket_replied'
  | 'ticket_status_changed'
  | 'subscription_canceled'
  | 'subscription_refunded'
  | 'flag_toggled'
  | 'flag_rollout_changed'
  | 'setting_changed'
  | 'integration_toggled'
  | 'demo_reset';

export interface AuditEvent {
  id: string;
  at: number;
  actor: string; // hardcoded "You" for the prototype
  action: AuditAction;
  summary: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface AdminSetupState {
  completed: boolean;
  completedAt: number | null;
  team: {
    ownerName: string;
    roles: AdminRole[];
    invitedEmails: string[];
  };
  surfaces: {
    mealPhotosEnabled: boolean;
    labelOcrEnabled: boolean;
    userAccountsEnabled: boolean;
    subscriptionsEnabled: boolean;
    sharingEnabled: boolean;
  };
  safety: {
    allowedReasons: ModerationReason[];
    autoRemoveBelowSafetyScore: number; // if aiSafetyScore < threshold, auto-remove when reviewed
    autoEscalateSeverities: ModerationSeverity[];
  };
  integrations: Record<IntegrationStatus['name'], boolean>;
}

