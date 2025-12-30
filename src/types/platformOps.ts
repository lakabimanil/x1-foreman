// Generic Platform Operations Dashboard Types
// Designed to be applicable to any content platform (streaming, social, marketplace, etc.)

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION & UI
// ═══════════════════════════════════════════════════════════════════════════════

export type OpsSection =
  | 'command-center'
  | 'live-content'
  | 'moderation-queue'
  | 'users'
  | 'reports'
  | 'team'
  | 'audit-log'
  | 'settings'
  | 'analytics';

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT TYPES (Generic - could be streams, posts, listings, etc.)
// ═══════════════════════════════════════════════════════════════════════════════

export type ContentType = 'stream' | 'video' | 'post' | 'listing' | 'message';
export type ContentStatus = 'live' | 'processing' | 'published' | 'archived' | 'removed';

export interface LiveContent {
  id: string;
  type: ContentType;
  title: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  status: ContentStatus;
  startedAt: number;
  viewerCount: number;
  peakViewers: number;
  category: string;
  tags: string[];
  isAgeRestricted: boolean;
  isFeatured: boolean;
  healthScore: number; // 0-100, AI-based content health
  chatEnabled: boolean;
  chatMessageCount: number;
  flagCount: number; // User reports during session
  autoModActions: number; // Automated moderation actions taken
  thumbnailUrl?: string;
}

export interface ArchivedContent {
  id: string;
  type: ContentType;
  title: string;
  creatorId: string;
  creatorName: string;
  status: 'published' | 'archived' | 'removed';
  createdAt: number;
  endedAt?: number;
  duration: number; // seconds
  totalViews: number;
  uniqueViewers: number;
  peakConcurrent: number;
  category: string;
  wasLive: boolean;
  vodAvailable: boolean;
  clipsCount: number;
  reportCount: number;
  moderationHistory: ModerationAction[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODERATION
// ═══════════════════════════════════════════════════════════════════════════════

export type ModerationReason =
  | 'nudity'
  | 'violence'
  | 'harassment'
  | 'hate_speech'
  | 'spam'
  | 'copyright'
  | 'misinformation'
  | 'self_harm'
  | 'illegal_activity'
  | 'underage'
  | 'impersonation'
  | 'other';

export type ModerationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ModerationStatus = 'pending' | 'reviewing' | 'approved' | 'removed' | 'escalated';
export type ModerationSource = 'user_report' | 'ai_detection' | 'keyword_filter' | 'manual' | 'external';

export interface ModerationQueueItem {
  id: string;
  contentId: string;
  contentType: ContentType;
  contentTitle: string;
  contentPreview?: string;
  creatorId: string;
  creatorName: string;
  source: ModerationSource;
  reason: ModerationReason;
  severity: ModerationSeverity;
  status: ModerationStatus;
  aiConfidence?: number; // 0-100 for AI detections
  reportCount: number;
  createdAt: number;
  assignedTo?: string;
  notes: string[];
  context?: {
    timestamp?: number; // Specific time in content
    screenshot?: string;
    chatLog?: string[];
  };
}

export interface ModerationAction {
  id: string;
  at: number;
  actor: string;
  action: 'approve' | 'remove' | 'warn' | 'timeout' | 'escalate' | 'note';
  reason?: string;
  details?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════════════════

export type UserRole = 'viewer' | 'creator' | 'partner' | 'affiliate';
export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending_verification';
export type VerificationStatus = 'none' | 'email' | 'phone' | 'id' | 'partner';

export interface PlatformUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  verificationLevel: VerificationStatus;
  createdAt: number;
  lastActiveAt: number;
  
  // Creator stats (if applicable)
  isCreator: boolean;
  followerCount: number;
  subscriberCount: number;
  totalContentCount: number;
  totalViews: number;
  
  // Trust & Safety
  trustScore: number; // 0-100
  warningCount: number;
  strikeCount: number;
  timeoutHistory: { at: number; duration: number; reason: string }[];
  previousBans: { at: number; reason: string; liftedAt?: number }[];
  
  // Revenue (if creator)
  totalEarnings?: number;
  pendingPayout?: number;
  
  notes: string[];
  tags: string[]; // Admin tags like "VIP", "Watch", "Trusted"
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type ReportType = 'content' | 'user' | 'chat' | 'other';
export type ReportStatus = 'new' | 'in_review' | 'action_taken' | 'no_action' | 'duplicate';

export interface UserReport {
  id: string;
  type: ReportType;
  reason: ModerationReason;
  status: ReportStatus;
  reporterId: string;
  reporterName: string;
  
  // Target info
  targetType: 'content' | 'user' | 'message';
  targetId: string;
  targetOwnerId?: string;
  targetOwnerName?: string;
  
  description: string;
  evidence?: string[];
  createdAt: number;
  updatedAt: number;
  assignedTo?: string;
  resolution?: {
    action: string;
    note: string;
    at: number;
    by: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM & PERMISSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type TeamRole = 'owner' | 'admin' | 'senior_mod' | 'moderator' | 'support' | 'analyst';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: TeamRole;
  status: 'active' | 'invited' | 'disabled';
  permissions: Permission[];
  joinedAt: number;
  lastActiveAt: number;
  
  // Activity stats
  actionsToday: number;
  actionsThisWeek: number;
  avgResponseTime: number; // minutes
  accuracy?: number; // Moderation accuracy if tracked
}

export type Permission =
  | 'view_content'
  | 'moderate_content'
  | 'remove_content'
  | 'view_users'
  | 'warn_users'
  | 'timeout_users'
  | 'ban_users'
  | 'view_reports'
  | 'resolve_reports'
  | 'manage_team'
  | 'view_analytics'
  | 'manage_settings'
  | 'view_audit'
  | 'manage_payouts';

export const ROLE_PERMISSIONS: Record<TeamRole, Permission[]> = {
  owner: [
    'view_content', 'moderate_content', 'remove_content',
    'view_users', 'warn_users', 'timeout_users', 'ban_users',
    'view_reports', 'resolve_reports',
    'manage_team', 'view_analytics', 'manage_settings', 'view_audit', 'manage_payouts'
  ],
  admin: [
    'view_content', 'moderate_content', 'remove_content',
    'view_users', 'warn_users', 'timeout_users', 'ban_users',
    'view_reports', 'resolve_reports',
    'manage_team', 'view_analytics', 'manage_settings', 'view_audit'
  ],
  senior_mod: [
    'view_content', 'moderate_content', 'remove_content',
    'view_users', 'warn_users', 'timeout_users', 'ban_users',
    'view_reports', 'resolve_reports',
    'view_analytics', 'view_audit'
  ],
  moderator: [
    'view_content', 'moderate_content',
    'view_users', 'warn_users', 'timeout_users',
    'view_reports', 'resolve_reports'
  ],
  support: [
    'view_content',
    'view_users', 'warn_users',
    'view_reports', 'resolve_reports'
  ],
  analyst: [
    'view_content', 'view_users', 'view_reports', 'view_analytics', 'view_audit'
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG
// ═══════════════════════════════════════════════════════════════════════════════

export type AuditAction =
  | 'content_removed'
  | 'content_approved'
  | 'content_featured'
  | 'user_warned'
  | 'user_timed_out'
  | 'user_suspended'
  | 'user_banned'
  | 'user_unbanned'
  | 'report_resolved'
  | 'report_escalated'
  | 'team_member_added'
  | 'team_member_removed'
  | 'team_role_changed'
  | 'setting_changed'
  | 'payout_processed'
  | 'appeal_reviewed';

export interface AuditEntry {
  id: string;
  at: number;
  actor: {
    id: string;
    name: string;
    role: TeamRole;
  };
  action: AuditAction;
  targetType: 'content' | 'user' | 'report' | 'team' | 'setting' | 'payout';
  targetId: string;
  targetName?: string;
  summary: string;
  details?: Record<string, unknown>;
  ip?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLATFORM SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

export interface PlatformSettings {
  // Auto-moderation
  autoMod: {
    enabled: boolean;
    keywordFilterEnabled: boolean;
    aiModerationEnabled: boolean;
    aiSensitivity: 'low' | 'medium' | 'high';
    autoRemoveThreshold: number; // AI confidence threshold for auto-remove
    autoEscalateSeverities: ModerationSeverity[];
    bannedWords: string[];
    bannedPatterns: string[];
  };
  
  // Content rules
  contentRules: {
    allowAdultContent: boolean;
    requireAgeGating: boolean;
    maxContentLength?: number;
    allowedCategories: string[];
  };
  
  // User rules
  userRules: {
    newAccountCooldown: number; // hours before can create content
    verificationRequired: VerificationStatus;
    autoTimeoutOnStrikes: boolean;
    strikesToBan: number;
  };
  
  // Alerts
  alerts: {
    slackWebhook?: string;
    discordWebhook?: string;
    emailAlerts: string[];
    alertOnCritical: boolean;
    alertOnHighVolume: boolean;
    highVolumeThreshold: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════

export interface PlatformMetrics {
  // Real-time
  activeUsers: number;
  liveContentCount: number;
  totalViewers: number;
  chatMessagesPerMinute: number;
  
  // Today
  newUsersToday: number;
  contentCreatedToday: number;
  reportsToday: number;
  moderationActionsToday: number;
  
  // Trends (vs yesterday)
  activeUsersTrend: number; // percentage change
  viewersTrend: number;
  reportsTrend: number;
  
  // Queue health
  pendingModeration: number;
  pendingReports: number;
  avgResponseTime: number; // minutes
  
  // Safety
  contentHealthScore: number; // 0-100 platform-wide
  trustScoreAvg: number;
  autoModCatchRate: number; // percentage caught by automation
}

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export interface AnalyticsData {
  metrics: PlatformMetrics;
  viewersHistory: TimeSeriesPoint[];
  reportsHistory: TimeSeriesPoint[];
  moderationHistory: TimeSeriesPoint[];
  topCategories: { name: string; count: number }[];
  topReasons: { reason: ModerationReason; count: number }[];
}
