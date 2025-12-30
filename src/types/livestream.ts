// Livestream Platform Admin Dashboard Types

// ─────────────────────────────────────────────────────────────
// Navigation & UI
// ─────────────────────────────────────────────────────────────

export type LivestreamSection =
  | 'overview'
  | 'live'
  | 'streams'
  | 'users'
  | 'reports'
  | 'chat'
  | 'team'
  | 'settings'
  | 'audit';

export type TeamRole = 'owner' | 'admin' | 'moderator' | 'support';

export const TeamRolePermissions: Record<TeamRole, string[]> = {
  owner: ['all'],
  admin: ['manage_streams', 'manage_users', 'manage_reports', 'manage_chat', 'manage_team', 'view_analytics'],
  moderator: ['manage_streams', 'manage_chat', 'manage_reports', 'view_analytics'],
  support: ['view_streams', 'view_users', 'manage_reports', 'view_analytics'],
};

// ─────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────

export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending';
export type UserTier = 'free' | 'subscriber' | 'partner' | 'staff';
export type UserBadge = 'verified' | 'partner' | 'vip' | 'founder' | 'staff';

export interface PlatformUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  status: UserStatus;
  tier: UserTier;
  badges: UserBadge[];
  isStreamer: boolean;
  
  // Stats
  followerCount: number;
  followingCount: number;
  totalStreamHours: number;
  totalViewHours: number;
  
  // Moderation
  warningCount: number;
  strikeCount: number;
  lastWarningAt?: number;
  notes: string[];
  
  // Timestamps
  createdAt: number;
  lastActiveAt: number;
  lastStreamAt?: number;
}

// ─────────────────────────────────────────────────────────────
// Streams
// ─────────────────────────────────────────────────────────────

export type StreamStatus = 'live' | 'ended' | 'processing' | 'failed' | 'deleted';
export type StreamCategory = 
  | 'gaming' 
  | 'irl' 
  | 'music' 
  | 'creative' 
  | 'sports' 
  | 'talk_shows' 
  | 'education' 
  | 'news' 
  | 'other';

export type StreamHealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'offline';

export interface Stream {
  id: string;
  userId: string;
  title: string;
  category: StreamCategory;
  tags: string[];
  status: StreamStatus;
  
  // Live metrics
  viewerCount: number;
  peakViewerCount: number;
  chatMessageCount: number;
  health: StreamHealthStatus;
  bitrate: number; // kbps
  fps: number;
  resolution: string;
  
  // VOD info
  duration: number; // seconds
  vodUrl?: string;
  thumbnailUrl?: string;
  
  // Moderation
  isMuted: boolean;
  isAgeRestricted: boolean;
  isFlagged: boolean;
  flagReason?: string;
  moderationNotes: string[];
  
  // Timestamps
  startedAt: number;
  endedAt?: number;
}

export interface LiveStreamAction {
  type: 'mute' | 'unmute' | 'warn' | 'end' | 'age_restrict' | 'feature' | 'unfeature';
  streamId: string;
  reason?: string;
}

// ─────────────────────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────────────────────

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed' | 'escalated';
export type ReportCategory = 
  | 'harassment'
  | 'hate_speech'
  | 'nsfw'
  | 'violence'
  | 'self_harm'
  | 'spam'
  | 'copyright'
  | 'impersonation'
  | 'underage'
  | 'other';

export type ReportTargetType = 'stream' | 'user' | 'chat_message' | 'vod' | 'clip';

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  targetUserId: string; // The user being reported
  category: ReportCategory;
  description: string;
  evidence?: string[]; // URLs to screenshots, clips, etc.
  status: ReportStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Resolution
  assignedTo?: string;
  resolution?: string;
  actionTaken?: string;
  
  // AI moderation
  aiConfidence?: number;
  aiSuggestion?: string;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
}

// ─────────────────────────────────────────────────────────────
// Chat Moderation
// ─────────────────────────────────────────────────────────────

export type ChatMessageStatus = 'visible' | 'deleted' | 'auto_deleted' | 'held';
export type ChatViolationType = 
  | 'profanity'
  | 'spam'
  | 'links'
  | 'caps'
  | 'harassment'
  | 'hate'
  | 'self_promo'
  | 'other';

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  content: string;
  status: ChatMessageStatus;
  violation?: ChatViolationType;
  
  // Auto-mod
  autoModScore: number; // 0-100, higher = more likely violation
  autoModFlags: string[];
  
  createdAt: number;
  deletedAt?: number;
  deletedBy?: string;
}

export interface ChatFilter {
  id: string;
  name: string;
  type: 'word' | 'phrase' | 'regex' | 'link_pattern';
  pattern: string;
  action: 'delete' | 'hold' | 'timeout' | 'ban';
  enabled: boolean;
  matchCount: number;
  createdAt: number;
}

// ─────────────────────────────────────────────────────────────
// Team Management
// ─────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: TeamRole;
  permissions: string[];
  status: 'active' | 'invited' | 'disabled';
  
  // Activity
  lastActiveAt: number;
  actionsToday: number;
  totalActions: number;
  
  // Timestamps
  invitedAt: number;
  joinedAt?: number;
}

// ─────────────────────────────────────────────────────────────
// Audit Log
// ─────────────────────────────────────────────────────────────

export type AuditAction =
  | 'stream_muted'
  | 'stream_ended'
  | 'stream_age_restricted'
  | 'stream_featured'
  | 'user_warned'
  | 'user_suspended'
  | 'user_banned'
  | 'user_unbanned'
  | 'report_resolved'
  | 'report_escalated'
  | 'chat_message_deleted'
  | 'chat_user_timed_out'
  | 'chat_user_banned'
  | 'filter_created'
  | 'filter_updated'
  | 'team_member_invited'
  | 'team_member_role_changed'
  | 'team_member_removed'
  | 'settings_changed'
  | 'demo_reset';

export interface AuditEvent {
  id: string;
  at: number;
  actor: string;
  actorId: string;
  action: AuditAction;
  summary: string;
  targetType?: 'stream' | 'user' | 'report' | 'chat' | 'team' | 'settings';
  targetId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

// ─────────────────────────────────────────────────────────────
// Platform Settings
// ─────────────────────────────────────────────────────────────

export interface PlatformSettings {
  // Moderation
  autoModEnabled: boolean;
  autoModSensitivity: number; // 0-100
  holdMessagesAboveScore: number;
  autoDeleteAboveScore: number;
  
  // Stream rules
  maxStreamDuration: number; // hours
  minAccountAgeToStream: number; // days
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  
  // Chat rules
  chatSlowModeDefault: number; // seconds, 0 = off
  subscriberOnlyModeAvailable: boolean;
  emoteOnlyModeAvailable: boolean;
  linksAllowedForSubs: boolean;
  
  // Strike system
  warningsBeforeStrike: number;
  strikesBeforeBan: number;
  strikeExpirationDays: number;
}

// ─────────────────────────────────────────────────────────────
// Analytics (Overview)
// ─────────────────────────────────────────────────────────────

export interface PlatformStats {
  // Real-time
  liveStreams: number;
  totalViewers: number;
  peakViewersToday: number;
  activeChatUsers: number;
  
  // Today
  newUsers: number;
  newStreamers: number;
  streamsStarted: number;
  reportsReceived: number;
  reportsClosed: number;
  
  // Totals
  totalUsers: number;
  totalStreamers: number;
  totalVODHours: number;
  
  // Moderation
  pendingReports: number;
  escalatedReports: number;
  heldChatMessages: number;
  streamsFlagged: number;
}
