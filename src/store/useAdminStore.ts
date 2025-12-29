'use client';

import { create } from 'zustand';
import type {
  AdminSection,
  AdminSetupState,
  AdminUser,
  AuditEvent,
  FeatureFlag,
  IntegrationStatus,
  ModerationItem,
  ModerationSeverity,
  Subscription,
  SupportTicket,
  TicketStatus,
} from '@/types/admin';

interface AdminStore {
  // UI
  activeSection: AdminSection;
  selectedUserId: string | null;
  selectedModerationId: string | null;
  selectedTicketId: string | null;

  // Setup/config
  setup: AdminSetupState;
  moderationThreshold: number; // AI safety score threshold for suggested auto-remove

  // Data (hardcoded demo)
  users: AdminUser[];
  subscriptions: Subscription[];
  moderationQueue: ModerationItem[];
  tickets: SupportTicket[];
  flags: FeatureFlag[];
  integrations: IntegrationStatus[];
  auditLog: AuditEvent[];

  // Actions
  setActiveSection: (section: AdminSection) => void;
  selectUser: (userId: string | null) => void;
  selectModeration: (itemId: string | null) => void;
  selectTicket: (ticketId: string | null) => void;

  // Setup actions
  toggleSurface: (key: keyof AdminSetupState['surfaces']) => void;
  toggleRole: (role: AdminSetupState['team']['roles'][number]) => void;
  inviteTeamMember: (email: string) => void;
  toggleIntegration: (name: IntegrationStatus['name']) => void;
  setModerationThreshold: (value: number) => void;
  setAutoEscalateSeverities: (severities: ModerationSeverity[]) => void;
  completeSetup: () => void;

  // Moderation actions
  approveModeration: (itemId: string) => void;
  removeModeration: (itemId: string) => void;
  escalateModeration: (itemId: string) => void;

  // User actions
  grantPro: (userId: string) => void;
  disableUser: (userId: string) => void;
  banUser: (userId: string, note?: string) => void;
  addUserNote: (userId: string, note: string) => void;

  // Ticket actions
  replyToTicket: (ticketId: string, body: string) => void;
  setTicketStatus: (ticketId: string, status: TicketStatus) => void;

  // Billing actions
  cancelSubscription: (subscriptionId: string) => void;
  refundSubscription: (subscriptionId: string) => void;

  // Flags
  toggleFlag: (flagId: string) => void;
  setFlagRollout: (flagId: string, rolloutPercent: number) => void;

  // Audit
  appendAudit: (event: Omit<AuditEvent, 'id' | 'at' | 'actor'>) => void;

  // Demo helpers
  resetDemo: () => void;
}

const id = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;

const hoursAgo = (h: number) => Date.now() - h * 60 * 60 * 1000;
const daysAgo = (d: number) => Date.now() - d * 24 * 60 * 60 * 1000;

function buildInitialState(): Omit<
  AdminStore,
  | 'setActiveSection'
  | 'selectUser'
  | 'selectModeration'
  | 'selectTicket'
  | 'toggleSurface'
  | 'toggleRole'
  | 'inviteTeamMember'
  | 'toggleIntegration'
  | 'setModerationThreshold'
  | 'setAutoEscalateSeverities'
  | 'completeSetup'
  | 'approveModeration'
  | 'removeModeration'
  | 'escalateModeration'
  | 'grantPro'
  | 'disableUser'
  | 'banUser'
  | 'addUserNote'
  | 'replyToTicket'
  | 'setTicketStatus'
  | 'cancelSubscription'
  | 'refundSubscription'
  | 'toggleFlag'
  | 'setFlagRollout'
  | 'appendAudit'
  | 'resetDemo'
> {
  const users: AdminUser[] = [
    {
      id: 'usr_sarah',
      name: 'Sarah M.',
      email: 'sarah.m@demo.com',
      status: 'active',
      plan: 'pro',
      createdAt: daysAgo(120),
      lastActiveAt: hoursAgo(2),
      lastScanAt: hoursAgo(1),
      totalScans: 342,
      flaggedScans: 1,
      riskScore: 8,
      notes: ['Loves macro breakdown', 'Requested Apple Health sync'],
    },
    {
      id: 'usr_mike',
      name: 'Mike R.',
      email: 'mike.r@demo.com',
      status: 'active',
      plan: 'free',
      createdAt: daysAgo(32),
      lastActiveAt: hoursAgo(6),
      lastScanAt: hoursAgo(5),
      totalScans: 71,
      flaggedScans: 0,
      riskScore: 4,
      notes: [],
    },
    {
      id: 'usr_jamie',
      name: 'Jamie K.',
      email: 'jamie.k@demo.com',
      status: 'active',
      plan: 'pro',
      createdAt: daysAgo(58),
      lastActiveAt: hoursAgo(10),
      lastScanAt: hoursAgo(9),
      totalScans: 124,
      flaggedScans: 3,
      riskScore: 22,
      notes: ['Accuracy complaints on restaurant meals'],
    },
    {
      id: 'usr_lina',
      name: 'Lina P.',
      email: 'lina.p@demo.com',
      status: 'disabled',
      plan: 'free',
      createdAt: daysAgo(14),
      lastActiveAt: daysAgo(2),
      lastScanAt: daysAgo(2),
      totalScans: 9,
      flaggedScans: 2,
      riskScore: 68,
      notes: ['Repeated non-food uploads', 'Warned twice'],
    },
    {
      id: 'usr_omar',
      name: 'Omar A.',
      email: 'omar.a@demo.com',
      status: 'active',
      plan: 'pro',
      createdAt: daysAgo(220),
      lastActiveAt: hoursAgo(3),
      lastScanAt: hoursAgo(2),
      totalScans: 802,
      flaggedScans: 0,
      riskScore: 3,
      notes: ['High LTV user'],
    },
    {
      id: 'usr_priya',
      name: 'Priya S.',
      email: 'priya.s@demo.com',
      status: 'active',
      plan: 'free',
      createdAt: daysAgo(6),
      lastActiveAt: hoursAgo(1),
      lastScanAt: hoursAgo(1),
      totalScans: 18,
      flaggedScans: 0,
      riskScore: 5,
      notes: ['New user, still onboarding'],
    },
    {
      id: 'usr_zoe',
      name: 'Zoe T.',
      email: 'zoe.t@demo.com',
      status: 'active',
      plan: 'pro',
      createdAt: daysAgo(88),
      lastActiveAt: hoursAgo(20),
      lastScanAt: hoursAgo(18),
      totalScans: 210,
      flaggedScans: 1,
      riskScore: 12,
      notes: [],
    },
    {
      id: 'usr_ken',
      name: 'Ken W.',
      email: 'ken.w@demo.com',
      status: 'banned',
      plan: 'free',
      createdAt: daysAgo(40),
      lastActiveAt: daysAgo(5),
      lastScanAt: daysAgo(5),
      totalScans: 22,
      flaggedScans: 7,
      riskScore: 92,
      notes: ['Banned for repeated policy violations'],
    },
  ];

  const subscriptions: Subscription[] = [
    {
      id: 'sub_sarah',
      userId: 'usr_sarah',
      status: 'active',
      interval: 'monthly',
      amountCents: 999,
      currency: 'USD',
      currentPeriodStart: daysAgo(3),
      currentPeriodEnd: daysAgo(-27),
      lastPaymentAt: daysAgo(3),
      refundsCount: 0,
    },
    {
      id: 'sub_jamie',
      userId: 'usr_jamie',
      status: 'past_due',
      interval: 'monthly',
      amountCents: 999,
      currency: 'USD',
      currentPeriodStart: daysAgo(31),
      currentPeriodEnd: daysAgo(1),
      lastPaymentAt: daysAgo(31),
      refundsCount: 1,
    },
    {
      id: 'sub_omar',
      userId: 'usr_omar',
      status: 'active',
      interval: 'yearly',
      amountCents: 5999,
      currency: 'USD',
      currentPeriodStart: daysAgo(120),
      currentPeriodEnd: daysAgo(-245),
      lastPaymentAt: daysAgo(120),
      refundsCount: 0,
    },
    {
      id: 'sub_zoe',
      userId: 'usr_zoe',
      status: 'trialing',
      interval: 'monthly',
      amountCents: 999,
      currency: 'USD',
      currentPeriodStart: daysAgo(1),
      currentPeriodEnd: daysAgo(-2),
      lastPaymentAt: daysAgo(1),
      refundsCount: 0,
    },
  ];

  const moderationQueue: ModerationItem[] = [
    {
      id: 'mod_001',
      userId: 'usr_lina',
      createdAt: hoursAgo(2),
      source: 'meal_photo',
      reason: 'non_food',
      severity: 'high',
      aiSafetyScore: 34,
      status: 'pending',
      previewLabel: 'Blurry selfie (non-food)',
      details: {
        modelVersion: 'scan-v3.2',
        estimatedCalories: undefined,
        detectedFoods: [],
        notes: 'Classifier confidence: 0.91 non-food',
      },
    },
    {
      id: 'mod_002',
      userId: 'usr_jamie',
      createdAt: hoursAgo(6),
      source: 'meal_photo',
      reason: 'spam',
      severity: 'medium',
      aiSafetyScore: 58,
      status: 'pending',
      previewLabel: 'Promotional flyer',
      details: {
        modelVersion: 'scan-v3.2',
        detectedFoods: [],
        notes: 'Text-heavy image, suspected spam',
      },
    },
    {
      id: 'mod_003',
      userId: 'usr_priya',
      createdAt: hoursAgo(9),
      source: 'label_scan',
      reason: 'other',
      severity: 'low',
      aiSafetyScore: 86,
      status: 'pending',
      previewLabel: 'Label scan (low contrast)',
      details: {
        modelVersion: 'ocr-v2.1',
        notes: 'User reported OCR mismatch',
      },
    },
    {
      id: 'mod_004',
      userId: 'usr_ken',
      createdAt: daysAgo(1),
      source: 'meal_photo',
      reason: 'nudity',
      severity: 'critical',
      aiSafetyScore: 12,
      status: 'escalated',
      previewLabel: 'Inappropriate content',
      details: {
        modelVersion: 'scan-v3.2',
        notes: 'Escalated by auto-rule',
      },
    },
    {
      id: 'mod_005',
      userId: 'usr_sarah',
      createdAt: daysAgo(2),
      source: 'meal_photo',
      reason: 'other',
      severity: 'low',
      aiSafetyScore: 92,
      status: 'pending',
      previewLabel: 'Salad (safe)',
      details: {
        modelVersion: 'scan-v3.2',
        estimatedCalories: 430,
        detectedFoods: ['salad', 'chicken', 'avocado'],
        notes: 'User mistakenly flagged as “wrong food”',
      },
    },
  ];

  const tickets: SupportTicket[] = [
    {
      id: 'tkt_001',
      userId: 'usr_jamie',
      createdAt: hoursAgo(20),
      updatedAt: hoursAgo(20),
      status: 'open',
      priority: 'high',
      category: 'accuracy',
      subject: 'Calories way off for sushi roll',
      tags: ['accuracy', 'restaurant'],
      messages: [
        {
          id: 'msg_001',
          at: hoursAgo(20),
          author: 'user',
          body: 'I scanned a sushi roll and it said 900 calories. That seems wrong. Can you fix it?',
        },
      ],
      slaDueAt: hoursAgo(-4),
    },
    {
      id: 'tkt_002',
      userId: 'usr_sarah',
      createdAt: hoursAgo(28),
      updatedAt: hoursAgo(10),
      status: 'pending',
      priority: 'normal',
      category: 'feature',
      subject: 'Can you add Apple Health sync?',
      tags: ['feature-request'],
      messages: [
        { id: 'msg_002a', at: hoursAgo(28), author: 'user', body: 'Would love to sync to Apple Health.' },
        {
          id: 'msg_002b',
          at: hoursAgo(10),
          author: 'agent',
          body: 'Thanks! This is on our roadmap. I’ve added your vote.',
        },
      ],
      slaDueAt: hoursAgo(-12),
    },
    {
      id: 'tkt_003',
      userId: 'usr_zoe',
      createdAt: hoursAgo(8),
      updatedAt: hoursAgo(8),
      status: 'open',
      priority: 'urgent',
      category: 'billing',
      subject: 'Charged twice for Pro',
      tags: ['billing', 'refund'],
      messages: [
        { id: 'msg_003a', at: hoursAgo(8), author: 'user', body: 'I see two charges for Cal AI Pro. Please help.' },
      ],
      slaDueAt: hoursAgo(16),
    },
    {
      id: 'tkt_004',
      userId: 'usr_priya',
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(3),
      status: 'open',
      priority: 'normal',
      category: 'account',
      subject: 'Can’t log in after reinstall',
      tags: ['login'],
      messages: [
        { id: 'msg_004a', at: hoursAgo(3), author: 'user', body: 'Reinstalled the app and now login keeps failing.' },
      ],
      slaDueAt: hoursAgo(21),
    },
  ];

  const flags: FeatureFlag[] = [
    {
      id: 'flag_scan_v3',
      key: 'scan_model_v3',
      name: 'Scan Model v3',
      description: 'Higher accuracy on mixed plates and restaurant meals.',
      enabled: true,
      rolloutPercent: 35,
      updatedAt: daysAgo(1),
    },
    {
      id: 'flag_ocr_v2',
      key: 'label_ocr_v2',
      name: 'Label OCR v2',
      description: 'Improved nutrition label parsing on low-contrast labels.',
      enabled: true,
      rolloutPercent: 60,
      updatedAt: daysAgo(4),
    },
    {
      id: 'flag_macro_insights',
      key: 'macro_insights_beta',
      name: 'Macro Insights (Beta)',
      description: 'New insights screen with macro trends and streaks.',
      enabled: false,
      rolloutPercent: 0,
      updatedAt: daysAgo(10),
    },
    {
      id: 'flag_paywall_v2',
      key: 'paywall_experiment_v2',
      name: 'Paywall Experiment v2',
      description: 'Updated pricing layout + trial copy testing.',
      enabled: true,
      rolloutPercent: 15,
      updatedAt: hoursAgo(12),
    },
  ];

  const integrations: IntegrationStatus[] = [
    {
      id: 'int_stripe',
      name: 'Stripe',
      connected: false,
      detail: 'Connect billing events for refunds, cancellations, and churn alerts.',
      updatedAt: daysAgo(0),
    },
    {
      id: 'int_slack',
      name: 'Slack',
      connected: false,
      detail: 'Route urgent tickets and escalations to #support.',
      updatedAt: daysAgo(0),
    },
    {
      id: 'int_mixpanel',
      name: 'Mixpanel',
      connected: true,
      detail: 'Events: scan_success, scan_failed, paywall_viewed, subscribed.',
      updatedAt: daysAgo(12),
    },
    {
      id: 'int_sentry',
      name: 'Sentry',
      connected: true,
      detail: 'Crash rate: 0.18% (7d).',
      updatedAt: daysAgo(2),
    },
    {
      id: 'int_openai',
      name: 'OpenAI',
      connected: true,
      detail: 'Used for scan assistance and nutrition label reasoning.',
      updatedAt: daysAgo(6),
    },
  ];

  const setup: AdminSetupState = {
    completed: false,
    completedAt: null,
    team: {
      ownerName: 'You',
      roles: ['owner', 'support', 'moderator'],
      invitedEmails: [],
    },
    surfaces: {
      mealPhotosEnabled: true,
      labelOcrEnabled: true,
      userAccountsEnabled: true,
      subscriptionsEnabled: true,
      sharingEnabled: false,
    },
    safety: {
      allowedReasons: ['non_food', 'nudity', 'violence', 'spam', 'self_harm', 'hate', 'other'],
      autoRemoveBelowSafetyScore: 25,
      autoEscalateSeverities: ['critical'],
    },
    integrations: {
      Stripe: false,
      Slack: false,
      Mixpanel: true,
      Sentry: true,
      OpenAI: true,
    },
  };

  const auditLog: AuditEvent[] = [
    {
      id: 'aud_seed_1',
      at: hoursAgo(18),
      actor: 'System',
      action: 'setting_changed',
      summary: 'Seeded demo workspace for Cal AI',
      metadata: { mode: 'demo' },
    },
    {
      id: 'aud_seed_2',
      at: hoursAgo(12),
      actor: 'System',
      action: 'flag_rollout_changed',
      summary: 'Rolled out Scan Model v3 to 35%',
      metadata: { key: 'scan_model_v3', rolloutPercent: 35 },
    },
  ];

  return {
    activeSection: 'overview',
    selectedUserId: null,
    selectedModerationId: null,
    selectedTicketId: null,
    setup,
    moderationThreshold: setup.safety.autoRemoveBelowSafetyScore,
    users,
    subscriptions,
    moderationQueue,
    tickets,
    flags,
    integrations,
    auditLog,
  };
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  ...buildInitialState(),

  setActiveSection: (section) => set({ activeSection: section }),
  selectUser: (userId) => set({ selectedUserId: userId }),
  selectModeration: (itemId) => set({ selectedModerationId: itemId }),
  selectTicket: (ticketId) => set({ selectedTicketId: ticketId }),

  appendAudit: (event) => {
    const next: AuditEvent = {
      id: id('aud'),
      at: Date.now(),
      actor: 'You',
      ...event,
    };
    set((state) => ({ auditLog: [next, ...state.auditLog] }));
  },

  toggleSurface: (key) => {
    set((state) => ({
      setup: {
        ...state.setup,
        surfaces: { ...state.setup.surfaces, [key]: !state.setup.surfaces[key] },
      },
    }));
    get().appendAudit({
      action: 'setting_changed',
      summary: `Toggled surface: ${key}`,
      metadata: { key },
    });
  },

  toggleRole: (role) => {
    set((state) => {
      const exists = state.setup.team.roles.includes(role);
      const roles = exists
        ? state.setup.team.roles.filter((r) => r !== role)
        : [...state.setup.team.roles, role];
      return { setup: { ...state.setup, team: { ...state.setup.team, roles } } };
    });
    get().appendAudit({
      action: 'setting_changed',
      summary: `Updated team roles`,
      metadata: { role },
    });
  },

  inviteTeamMember: (email) => {
    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return;

    set((state) => {
      if (state.setup.team.invitedEmails.includes(cleaned)) return state;
      return {
        setup: {
          ...state.setup,
          team: {
            ...state.setup.team,
            invitedEmails: [...state.setup.team.invitedEmails, cleaned],
          },
        },
      };
    });
    get().appendAudit({
      action: 'setting_changed',
      summary: `Invited team member`,
      metadata: { email: cleaned },
    });
  },

  toggleIntegration: (name) => {
    set((state) => ({
      setup: {
        ...state.setup,
        integrations: { ...state.setup.integrations, [name]: !state.setup.integrations[name] },
      },
      integrations: state.integrations.map((i) =>
        i.name === name ? { ...i, connected: !i.connected, updatedAt: Date.now() } : i
      ),
    }));

    get().appendAudit({
      action: 'integration_toggled',
      summary: `Toggled integration: ${name}`,
      metadata: { name },
    });
  },

  setModerationThreshold: (value) => {
    set((state) => ({
      moderationThreshold: value,
      setup: {
        ...state.setup,
        safety: { ...state.setup.safety, autoRemoveBelowSafetyScore: value },
      },
    }));

    get().appendAudit({
      action: 'setting_changed',
      summary: 'Updated moderation threshold',
      metadata: { autoRemoveBelowSafetyScore: value },
    });
  },

  setAutoEscalateSeverities: (severities) => {
    set((state) => ({
      setup: { ...state.setup, safety: { ...state.setup.safety, autoEscalateSeverities: severities } },
    }));
    get().appendAudit({
      action: 'setting_changed',
      summary: 'Updated auto-escalation severities',
      metadata: { severities: severities.join(',') },
    });
  },

  completeSetup: () => {
    set((state) => ({
      setup: { ...state.setup, completed: true, completedAt: Date.now() },
      activeSection: 'overview',
    }));
    get().appendAudit({
      action: 'setup_completed',
      summary: 'Completed admin setup',
      metadata: { demo: true },
    });
  },

  approveModeration: (itemId) => {
    set((state) => ({
      moderationQueue: state.moderationQueue.map((m) => (m.id === itemId ? { ...m, status: 'approved' } : m)),
      selectedModerationId: state.selectedModerationId === itemId ? null : state.selectedModerationId,
    }));
    get().appendAudit({ action: 'moderation_approved', summary: `Approved moderation item`, metadata: { itemId } });
  },

  removeModeration: (itemId) => {
    set((state) => ({
      moderationQueue: state.moderationQueue.map((m) => (m.id === itemId ? { ...m, status: 'removed' } : m)),
      selectedModerationId: state.selectedModerationId === itemId ? null : state.selectedModerationId,
    }));
    get().appendAudit({ action: 'moderation_removed', summary: `Removed moderation item`, metadata: { itemId } });
  },

  escalateModeration: (itemId) => {
    set((state) => ({
      moderationQueue: state.moderationQueue.map((m) => (m.id === itemId ? { ...m, status: 'escalated' } : m)),
    }));
    get().appendAudit({
      action: 'moderation_escalated',
      summary: 'Escalated moderation item',
      metadata: { itemId },
    });
  },

  grantPro: (userId) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, plan: 'pro' } : u)),
    }));
    get().appendAudit({ action: 'user_granted_pro', summary: 'Granted Pro access', metadata: { userId } });
  },

  disableUser: (userId) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, status: 'disabled' } : u)),
    }));
    get().appendAudit({ action: 'user_disabled', summary: 'Disabled user', metadata: { userId } });
  },

  banUser: (userId, note) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? { ...u, status: 'banned', notes: note ? [note, ...u.notes] : u.notes }
          : u
      ),
    }));
    get().appendAudit({ action: 'user_banned', summary: 'Banned user', metadata: { userId } });
  },

  addUserNote: (userId, note) => {
    const cleaned = note.trim();
    if (!cleaned) return;
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, notes: [cleaned, ...u.notes] } : u)),
    }));
    get().appendAudit({ action: 'setting_changed', summary: 'Added user note', metadata: { userId } });
  },

  replyToTicket: (ticketId, body) => {
    const cleaned = body.trim();
    if (!cleaned) return;

    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: t.status === 'open' ? 'pending' : t.status,
              updatedAt: Date.now(),
              messages: [
                ...t.messages,
                { id: id('msg'), at: Date.now(), author: 'agent', body: cleaned },
              ],
            }
          : t
      ),
    }));
    get().appendAudit({ action: 'ticket_replied', summary: 'Replied to support ticket', metadata: { ticketId } });
  },

  setTicketStatus: (ticketId, status) => {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status, updatedAt: Date.now() } : t
      ),
    }));
    get().appendAudit({
      action: 'ticket_status_changed',
      summary: `Changed ticket status to ${status}`,
      metadata: { ticketId, status },
    });
  },

  cancelSubscription: (subscriptionId) => {
    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === subscriptionId ? { ...s, status: 'canceled', currentPeriodEnd: Date.now() } : s
      ),
    }));
    get().appendAudit({
      action: 'subscription_canceled',
      summary: 'Canceled subscription',
      metadata: { subscriptionId },
    });
  },

  refundSubscription: (subscriptionId) => {
    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === subscriptionId ? { ...s, refundsCount: s.refundsCount + 1 } : s
      ),
    }));
    get().appendAudit({
      action: 'subscription_refunded',
      summary: 'Refunded subscription payment',
      metadata: { subscriptionId },
    });
  },

  toggleFlag: (flagId) => {
    set((state) => ({
      flags: state.flags.map((f) =>
        f.id === flagId ? { ...f, enabled: !f.enabled, updatedAt: Date.now() } : f
      ),
    }));
    const next = get().flags.find((f) => f.id === flagId);
    get().appendAudit({
      action: 'flag_toggled',
      summary: `Toggled flag ${next?.key ?? flagId}`,
      metadata: { flagId, enabled: next?.enabled ?? null },
    });
  },

  setFlagRollout: (flagId, rolloutPercent) => {
    const normalized = Math.max(0, Math.min(100, Math.round(rolloutPercent)));
    set((state) => ({
      flags: state.flags.map((f) =>
        f.id === flagId ? { ...f, rolloutPercent: normalized, updatedAt: Date.now() } : f
      ),
    }));
    const next = get().flags.find((f) => f.id === flagId);
    get().appendAudit({
      action: 'flag_rollout_changed',
      summary: `Updated rollout for ${next?.key ?? flagId}`,
      metadata: { flagId, rolloutPercent: normalized },
    });
  },

  resetDemo: () => {
    set(() => buildInitialState());
    setTimeout(() => {
      // Ensure audit has a visible “reset” entry after reset
      get().appendAudit({ action: 'demo_reset', summary: 'Reset demo data', metadata: {} });
    }, 0);
  },
}));

