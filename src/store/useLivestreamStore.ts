'use client';

import { create } from 'zustand';
import type {
  LivestreamSection,
  PlatformUser,
  Stream,
  Report,
  ChatMessage,
  ChatFilter,
  TeamMember,
  TeamRole,
  AuditEvent,
  AuditAction,
  PlatformSettings,
  PlatformStats,
  StreamCategory,
  ReportCategory,
  ReportStatus,
  UserStatus,
} from '@/types/livestream';

// ─────────────────────────────────────────────────────────────
// Store Interface
// ─────────────────────────────────────────────────────────────

interface LivestreamStore {
  // UI State
  activeSection: LivestreamSection;
  selectedStreamId: string | null;
  selectedUserId: string | null;
  selectedReportId: string | null;
  selectedChatMessageId: string | null;
  
  // Data
  users: PlatformUser[];
  streams: Stream[];
  reports: Report[];
  chatMessages: ChatMessage[];
  chatFilters: ChatFilter[];
  teamMembers: TeamMember[];
  auditLog: AuditEvent[];
  settings: PlatformSettings;
  
  // Computed stats
  getStats: () => PlatformStats;
  
  // Navigation
  setActiveSection: (section: LivestreamSection) => void;
  selectStream: (id: string | null) => void;
  selectUser: (id: string | null) => void;
  selectReport: (id: string | null) => void;
  selectChatMessage: (id: string | null) => void;
  
  // Stream Actions
  muteStream: (streamId: string, reason?: string) => void;
  unmuteStream: (streamId: string) => void;
  endStream: (streamId: string, reason?: string) => void;
  ageRestrictStream: (streamId: string) => void;
  flagStream: (streamId: string, reason: string) => void;
  unflagStream: (streamId: string) => void;
  addStreamNote: (streamId: string, note: string) => void;
  
  // User Actions
  warnUser: (userId: string, reason: string) => void;
  suspendUser: (userId: string, reason: string, durationDays?: number) => void;
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  addUserNote: (userId: string, note: string) => void;
  setUserTier: (userId: string, tier: PlatformUser['tier']) => void;
  addUserBadge: (userId: string, badge: PlatformUser['badges'][number]) => void;
  removeUserBadge: (userId: string, badge: PlatformUser['badges'][number]) => void;
  
  // Report Actions
  assignReport: (reportId: string, assigneeId: string) => void;
  resolveReport: (reportId: string, resolution: string, actionTaken?: string) => void;
  dismissReport: (reportId: string, reason: string) => void;
  escalateReport: (reportId: string) => void;
  setReportPriority: (reportId: string, priority: Report['priority']) => void;
  
  // Chat Actions
  deleteChatMessage: (messageId: string) => void;
  restoreChatMessage: (messageId: string) => void;
  timeoutUser: (userId: string, streamId: string, durationSeconds: number) => void;
  banFromChat: (userId: string, streamId: string) => void;
  
  // Chat Filter Actions
  createFilter: (filter: Omit<ChatFilter, 'id' | 'matchCount' | 'createdAt'>) => void;
  updateFilter: (filterId: string, updates: Partial<ChatFilter>) => void;
  deleteFilter: (filterId: string) => void;
  toggleFilter: (filterId: string) => void;
  
  // Team Actions
  inviteTeamMember: (email: string, name: string, role: TeamRole) => void;
  updateTeamMemberRole: (memberId: string, role: TeamRole) => void;
  removeTeamMember: (memberId: string) => void;
  
  // Settings
  updateSettings: (updates: Partial<PlatformSettings>) => void;
  
  // Audit
  appendAudit: (event: Omit<AuditEvent, 'id' | 'at'>) => void;
  
  // Demo
  resetDemo: () => void;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const id = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;

const hoursAgo = (h: number) => Date.now() - h * 60 * 60 * 1000;
const minsAgo = (m: number) => Date.now() - m * 60 * 1000;
const daysAgo = (d: number) => Date.now() - d * 24 * 60 * 60 * 1000;

// ─────────────────────────────────────────────────────────────
// Initial State Builder
// ─────────────────────────────────────────────────────────────

function buildInitialState() {
  // Users - mix of streamers and viewers
  const users: PlatformUser[] = [
    {
      id: 'usr_ninja',
      username: 'NightOwlGaming',
      displayName: 'Night Owl',
      email: 'nightowl@demo.com',
      avatarUrl: undefined,
      status: 'active',
      tier: 'partner',
      badges: ['verified', 'partner'],
      isStreamer: true,
      followerCount: 1234567,
      followingCount: 89,
      totalStreamHours: 4500,
      totalViewHours: 120,
      warningCount: 0,
      strikeCount: 0,
      notes: ['Top streamer', 'Great community'],
      createdAt: daysAgo(890),
      lastActiveAt: minsAgo(5),
      lastStreamAt: minsAgo(5),
    },
    {
      id: 'usr_sarah',
      username: 'SarahPlays',
      displayName: 'Sarah',
      email: 'sarah@demo.com',
      status: 'active',
      tier: 'partner',
      badges: ['verified', 'partner'],
      isStreamer: true,
      followerCount: 456789,
      followingCount: 234,
      totalStreamHours: 2100,
      totalViewHours: 340,
      warningCount: 0,
      strikeCount: 0,
      notes: [],
      createdAt: daysAgo(650),
      lastActiveAt: minsAgo(12),
      lastStreamAt: minsAgo(12),
    },
    {
      id: 'usr_mike',
      username: 'MikeStreams',
      displayName: 'Mike',
      email: 'mike@demo.com',
      status: 'active',
      tier: 'subscriber',
      badges: ['verified'],
      isStreamer: true,
      followerCount: 23456,
      followingCount: 567,
      totalStreamHours: 450,
      totalViewHours: 890,
      warningCount: 1,
      strikeCount: 0,
      lastWarningAt: daysAgo(14),
      notes: ['Warned for borderline content 2 weeks ago'],
      createdAt: daysAgo(180),
      lastActiveAt: minsAgo(30),
      lastStreamAt: minsAgo(30),
    },
    {
      id: 'usr_toxic',
      username: 'xXToxicGamerXx',
      displayName: 'Toxic',
      email: 'toxic@demo.com',
      status: 'suspended',
      tier: 'free',
      badges: [],
      isStreamer: true,
      followerCount: 5678,
      followingCount: 12,
      totalStreamHours: 89,
      totalViewHours: 45,
      warningCount: 3,
      strikeCount: 2,
      lastWarningAt: daysAgo(2),
      notes: ['Multiple TOS violations', 'Suspended for hate speech'],
      createdAt: daysAgo(90),
      lastActiveAt: daysAgo(2),
      lastStreamAt: daysAgo(2),
    },
    {
      id: 'usr_creative',
      username: 'ArtByLuna',
      displayName: 'Luna ✨',
      email: 'luna@demo.com',
      status: 'active',
      tier: 'subscriber',
      badges: ['verified'],
      isStreamer: true,
      followerCount: 89012,
      followingCount: 345,
      totalStreamHours: 780,
      totalViewHours: 234,
      warningCount: 0,
      strikeCount: 0,
      notes: ['Creative category leader'],
      createdAt: daysAgo(420),
      lastActiveAt: hoursAgo(2),
      lastStreamAt: hoursAgo(2),
    },
    {
      id: 'usr_music',
      username: 'DJ_Beats',
      displayName: 'DJ Beats',
      email: 'djbeats@demo.com',
      status: 'active',
      tier: 'partner',
      badges: ['verified', 'partner', 'vip'],
      isStreamer: true,
      followerCount: 234567,
      followingCount: 123,
      totalStreamHours: 1200,
      totalViewHours: 56,
      warningCount: 0,
      strikeCount: 0,
      notes: [],
      createdAt: daysAgo(560),
      lastActiveAt: minsAgo(45),
      lastStreamAt: minsAgo(45),
    },
    {
      id: 'usr_viewer1',
      username: 'CasualViewer42',
      displayName: 'Casual',
      email: 'casual@demo.com',
      status: 'active',
      tier: 'free',
      badges: [],
      isStreamer: false,
      followerCount: 12,
      followingCount: 456,
      totalStreamHours: 0,
      totalViewHours: 890,
      warningCount: 0,
      strikeCount: 0,
      notes: [],
      createdAt: daysAgo(120),
      lastActiveAt: hoursAgo(1),
    },
    {
      id: 'usr_viewer2',
      username: 'SubGifter',
      displayName: 'Gift King',
      email: 'gifter@demo.com',
      status: 'active',
      tier: 'subscriber',
      badges: ['vip', 'founder'],
      isStreamer: false,
      followerCount: 234,
      followingCount: 1200,
      totalStreamHours: 0,
      totalViewHours: 4500,
      warningCount: 0,
      strikeCount: 0,
      notes: ['High LTV user', 'Gifted 500+ subs'],
      createdAt: daysAgo(800),
      lastActiveAt: minsAgo(15),
    },
    {
      id: 'usr_spam',
      username: 'FollowMe123',
      displayName: 'Follow4Follow',
      email: 'spam@demo.com',
      status: 'banned',
      tier: 'free',
      badges: [],
      isStreamer: false,
      followerCount: 0,
      followingCount: 10000,
      totalStreamHours: 0,
      totalViewHours: 2,
      warningCount: 1,
      strikeCount: 3,
      notes: ['Bot account', 'Banned for spam'],
      createdAt: daysAgo(5),
      lastActiveAt: daysAgo(3),
    },
    {
      id: 'usr_new',
      username: 'NewStreamer2024',
      displayName: 'New Guy',
      email: 'newguy@demo.com',
      status: 'active',
      tier: 'free',
      badges: [],
      isStreamer: true,
      followerCount: 45,
      followingCount: 78,
      totalStreamHours: 12,
      totalViewHours: 34,
      warningCount: 0,
      strikeCount: 0,
      notes: ['New affiliate candidate'],
      createdAt: daysAgo(7),
      lastActiveAt: hoursAgo(3),
      lastStreamAt: hoursAgo(3),
    },
  ];

  // Live & Recent Streams
  const streams: Stream[] = [
    {
      id: 'str_live1',
      userId: 'usr_ninja',
      title: '🔴 LIVE - Late Night Gaming Marathon | !socials',
      category: 'gaming',
      tags: ['fps', 'competitive', 'chill'],
      status: 'live',
      viewerCount: 45678,
      peakViewerCount: 52340,
      chatMessageCount: 234567,
      health: 'excellent',
      bitrate: 6000,
      fps: 60,
      resolution: '1080p60',
      duration: 0,
      isMuted: false,
      isAgeRestricted: false,
      isFlagged: false,
      moderationNotes: [],
      startedAt: hoursAgo(4),
    },
    {
      id: 'str_live2',
      userId: 'usr_sarah',
      title: 'Cozy Sunday Stream 🌸 Come hang out!',
      category: 'irl',
      tags: ['chatting', 'cozy', 'wholesome'],
      status: 'live',
      viewerCount: 12345,
      peakViewerCount: 15678,
      chatMessageCount: 45678,
      health: 'good',
      bitrate: 4500,
      fps: 30,
      resolution: '1080p30',
      duration: 0,
      isMuted: false,
      isAgeRestricted: false,
      isFlagged: false,
      moderationNotes: [],
      startedAt: hoursAgo(2),
    },
    {
      id: 'str_live3',
      userId: 'usr_mike',
      title: 'Ranked Grind - Road to Champion',
      category: 'gaming',
      tags: ['ranked', 'tryhard', 'competitive'],
      status: 'live',
      viewerCount: 3456,
      peakViewerCount: 4567,
      chatMessageCount: 12345,
      health: 'fair',
      bitrate: 3000,
      fps: 60,
      resolution: '720p60',
      duration: 0,
      isMuted: false,
      isAgeRestricted: false,
      isFlagged: true,
      flagReason: 'Viewer reported potential rage/toxicity',
      moderationNotes: ['Under review for language'],
      startedAt: hoursAgo(1),
    },
    {
      id: 'str_live4',
      userId: 'usr_music',
      title: '🎵 Sunday Vibes - Chill Electronic Mix | !song',
      category: 'music',
      tags: ['edm', 'chill', 'electronic', 'live_dj'],
      status: 'live',
      viewerCount: 8901,
      peakViewerCount: 11234,
      chatMessageCount: 23456,
      health: 'excellent',
      bitrate: 6000,
      fps: 60,
      resolution: '1080p60',
      duration: 0,
      isMuted: false,
      isAgeRestricted: false,
      isFlagged: false,
      moderationNotes: [],
      startedAt: hoursAgo(3),
    },
    {
      id: 'str_live5',
      userId: 'usr_creative',
      title: 'Drawing your suggestions! 🎨 Art stream',
      category: 'creative',
      tags: ['art', 'drawing', 'requests', 'digital_art'],
      status: 'live',
      viewerCount: 5678,
      peakViewerCount: 7890,
      chatMessageCount: 18901,
      health: 'good',
      bitrate: 5000,
      fps: 30,
      resolution: '1080p30',
      duration: 0,
      isMuted: false,
      isAgeRestricted: false,
      isFlagged: false,
      moderationNotes: [],
      startedAt: hoursAgo(5),
    },
    // Past streams (VODs)
    {
      id: 'str_vod1',
      userId: 'usr_ninja',
      title: 'Tournament Finals - $100k Prize Pool',
      category: 'gaming',
      tags: ['tournament', 'esports', 'competitive'],
      status: 'ended',
      viewerCount: 0,
      peakViewerCount: 89012,
      chatMessageCount: 456789,
      health: 'offline',
      bitrate: 0,
      fps: 0,
      resolution: '1080p60',
      duration: 21600, // 6 hours
      vodUrl: 'https://vod.example.com/str_vod1',
      thumbnailUrl: undefined,
      isMuted: false,
      isAgeRestricted: false,
      isFlagged: false,
      moderationNotes: [],
      startedAt: daysAgo(2),
      endedAt: daysAgo(2) + 21600000,
    },
    {
      id: 'str_vod2',
      userId: 'usr_toxic',
      title: '[DELETED] Toxic stream content',
      category: 'gaming',
      tags: [],
      status: 'deleted',
      viewerCount: 0,
      peakViewerCount: 2345,
      chatMessageCount: 5678,
      health: 'offline',
      bitrate: 0,
      fps: 0,
      resolution: '720p30',
      duration: 3600,
      isMuted: true,
      isAgeRestricted: true,
      isFlagged: true,
      flagReason: 'Hate speech and harassment',
      moderationNotes: ['VOD deleted for TOS violation', 'User suspended'],
      startedAt: daysAgo(2),
      endedAt: daysAgo(2) + 3600000,
    },
    {
      id: 'str_vod3',
      userId: 'usr_sarah',
      title: 'Cooking Stream - Making Pasta from Scratch!',
      category: 'irl',
      tags: ['cooking', 'food', 'tutorial'],
      status: 'ended',
      viewerCount: 0,
      peakViewerCount: 18901,
      chatMessageCount: 67890,
      health: 'offline',
      bitrate: 0,
      fps: 0,
      resolution: '1080p30',
      duration: 10800,
      vodUrl: 'https://vod.example.com/str_vod3',
      isMuted: false,
      isAgeRestricted: false,
      isFlagged: false,
      moderationNotes: [],
      startedAt: daysAgo(1),
      endedAt: daysAgo(1) + 10800000,
    },
  ];

  // Reports
  const reports: Report[] = [
    {
      id: 'rpt_001',
      reporterId: 'usr_viewer1',
      targetType: 'stream',
      targetId: 'str_live3',
      targetUserId: 'usr_mike',
      category: 'harassment',
      description: 'Streamer is being verbally abusive to viewers in chat',
      status: 'pending',
      priority: 'high',
      aiConfidence: 78,
      aiSuggestion: 'Review stream recording for TOS violations',
      createdAt: minsAgo(15),
      updatedAt: minsAgo(15),
    },
    {
      id: 'rpt_002',
      reporterId: 'usr_viewer2',
      targetType: 'user',
      targetId: 'usr_spam',
      targetUserId: 'usr_spam',
      category: 'spam',
      description: 'Bot account spamming follow-for-follow messages in multiple channels',
      status: 'resolved',
      priority: 'medium',
      resolution: 'User banned for spam/bot behavior',
      actionTaken: 'Permanent ban',
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
      resolvedAt: daysAgo(3),
    },
    {
      id: 'rpt_003',
      reporterId: 'usr_viewer1',
      targetType: 'stream',
      targetId: 'str_vod2',
      targetUserId: 'usr_toxic',
      category: 'hate_speech',
      description: 'Streamer used racial slurs and promoted hate',
      evidence: ['clip_evidence_001'],
      status: 'resolved',
      priority: 'critical',
      resolution: 'Confirmed TOS violation',
      actionTaken: 'User suspended, VOD deleted',
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
      resolvedAt: daysAgo(2),
    },
    {
      id: 'rpt_004',
      reporterId: 'usr_creative',
      targetType: 'chat_message',
      targetId: 'chat_flagged1',
      targetUserId: 'usr_viewer1',
      category: 'harassment',
      description: 'User sending inappropriate messages',
      status: 'reviewing',
      priority: 'medium',
      assignedTo: 'mod_alice',
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(1),
    },
    {
      id: 'rpt_005',
      reporterId: 'usr_ninja',
      targetType: 'user',
      targetId: 'usr_new',
      targetUserId: 'usr_new',
      category: 'impersonation',
      description: 'New account might be impersonating another streamer',
      status: 'pending',
      priority: 'low',
      aiConfidence: 23,
      aiSuggestion: 'Low likelihood - usernames are not similar',
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(5),
    },
    {
      id: 'rpt_006',
      reporterId: 'usr_viewer2',
      targetType: 'stream',
      targetId: 'str_live4',
      targetUserId: 'usr_music',
      category: 'copyright',
      description: 'Playing copyrighted music without license',
      status: 'pending',
      priority: 'medium',
      aiConfidence: 45,
      aiSuggestion: 'Streamer is a verified DJ - likely has licensing',
      createdAt: hoursAgo(1),
      updatedAt: hoursAgo(1),
    },
  ];

  // Chat messages (flagged/held)
  const chatMessages: ChatMessage[] = [
    {
      id: 'chat_flagged1',
      streamId: 'str_live1',
      userId: 'usr_viewer1',
      content: 'This is so boring, streamer sucks!!!',
      status: 'held',
      violation: 'harassment',
      autoModScore: 72,
      autoModFlags: ['negative_sentiment', 'potential_harassment'],
      createdAt: minsAgo(5),
    },
    {
      id: 'chat_flagged2',
      streamId: 'str_live2',
      userId: 'usr_spam',
      content: 'FOLLOW ME FOR FREE GIFT CARDS www.scam-site.com',
      status: 'auto_deleted',
      violation: 'spam',
      autoModScore: 98,
      autoModFlags: ['spam', 'suspicious_link', 'caps'],
      createdAt: minsAgo(12),
      deletedAt: minsAgo(12),
      deletedBy: 'AutoMod',
    },
    {
      id: 'chat_flagged3',
      streamId: 'str_live3',
      userId: 'usr_viewer2',
      content: 'hey everyone check out my stream later at...',
      status: 'held',
      violation: 'self_promo',
      autoModScore: 65,
      autoModFlags: ['self_promotion'],
      createdAt: minsAgo(8),
    },
    {
      id: 'chat_flagged4',
      streamId: 'str_live1',
      userId: 'usr_new',
      content: 'First time here! This stream is amazing 🔥',
      status: 'visible',
      autoModScore: 5,
      autoModFlags: [],
      createdAt: minsAgo(2),
    },
  ];

  // Chat filters
  const chatFilters: ChatFilter[] = [
    {
      id: 'filter_1',
      name: 'Scam Links',
      type: 'regex',
      pattern: '(free.*gift|bit\\.ly|tinyurl|giveaway.*click)',
      action: 'delete',
      enabled: true,
      matchCount: 1234,
      createdAt: daysAgo(180),
    },
    {
      id: 'filter_2',
      name: 'Excessive Caps',
      type: 'regex',
      pattern: '^[A-Z\\s!]{20,}$',
      action: 'hold',
      enabled: true,
      matchCount: 5678,
      createdAt: daysAgo(180),
    },
    {
      id: 'filter_3',
      name: 'Slurs List',
      type: 'word',
      pattern: '[REDACTED - word list]',
      action: 'delete',
      enabled: true,
      matchCount: 8901,
      createdAt: daysAgo(365),
    },
    {
      id: 'filter_4',
      name: 'Competitor Mentions',
      type: 'phrase',
      pattern: 'check out [competitor] instead',
      action: 'hold',
      enabled: false,
      matchCount: 23,
      createdAt: daysAgo(30),
    },
  ];

  // Team members
  const teamMembers: TeamMember[] = [
    {
      id: 'team_owner',
      userId: 'usr_system',
      email: 'admin@streamplatform.com',
      name: 'Platform Admin',
      role: 'owner',
      permissions: ['all'],
      status: 'active',
      lastActiveAt: minsAgo(1),
      actionsToday: 45,
      totalActions: 12345,
      invitedAt: daysAgo(365),
      joinedAt: daysAgo(365),
    },
    {
      id: 'team_alice',
      userId: 'mod_alice',
      email: 'alice@streamplatform.com',
      name: 'Alice (Lead Mod)',
      role: 'admin',
      permissions: ['manage_streams', 'manage_users', 'manage_reports', 'manage_chat', 'view_analytics'],
      status: 'active',
      lastActiveAt: minsAgo(15),
      actionsToday: 23,
      totalActions: 5678,
      invitedAt: daysAgo(300),
      joinedAt: daysAgo(300),
    },
    {
      id: 'team_bob',
      userId: 'mod_bob',
      email: 'bob@streamplatform.com',
      name: 'Bob',
      role: 'moderator',
      permissions: ['manage_streams', 'manage_chat', 'manage_reports', 'view_analytics'],
      status: 'active',
      lastActiveAt: hoursAgo(2),
      actionsToday: 12,
      totalActions: 2345,
      invitedAt: daysAgo(120),
      joinedAt: daysAgo(120),
    },
    {
      id: 'team_carol',
      userId: 'mod_carol',
      email: 'carol@streamplatform.com',
      name: 'Carol',
      role: 'support',
      permissions: ['view_streams', 'view_users', 'manage_reports', 'view_analytics'],
      status: 'active',
      lastActiveAt: hoursAgo(4),
      actionsToday: 8,
      totalActions: 890,
      invitedAt: daysAgo(60),
      joinedAt: daysAgo(60),
    },
    {
      id: 'team_pending',
      userId: '',
      email: 'newmod@example.com',
      name: 'New Moderator',
      role: 'moderator',
      permissions: ['manage_streams', 'manage_chat', 'manage_reports', 'view_analytics'],
      status: 'invited',
      lastActiveAt: 0,
      actionsToday: 0,
      totalActions: 0,
      invitedAt: daysAgo(1),
    },
  ];

  // Audit log
  const auditLog: AuditEvent[] = [
    {
      id: 'aud_001',
      at: minsAgo(15),
      actor: 'AutoMod',
      actorId: 'system',
      action: 'chat_message_deleted',
      summary: 'Auto-deleted spam message in NightOwlGaming stream',
      targetType: 'chat',
      targetId: 'chat_flagged2',
    },
    {
      id: 'aud_002',
      at: hoursAgo(1),
      actor: 'Alice (Lead Mod)',
      actorId: 'mod_alice',
      action: 'stream_age_restricted',
      summary: 'Age-restricted stream for mature content',
      targetType: 'stream',
      targetId: 'str_live3',
    },
    {
      id: 'aud_003',
      at: daysAgo(2),
      actor: 'Alice (Lead Mod)',
      actorId: 'mod_alice',
      action: 'user_suspended',
      summary: 'Suspended xXToxicGamerXx for hate speech',
      targetType: 'user',
      targetId: 'usr_toxic',
    },
    {
      id: 'aud_004',
      at: daysAgo(2),
      actor: 'System',
      actorId: 'system',
      action: 'report_resolved',
      summary: 'Resolved hate speech report - user suspended',
      targetType: 'report',
      targetId: 'rpt_003',
    },
    {
      id: 'aud_005',
      at: daysAgo(3),
      actor: 'Bob',
      actorId: 'mod_bob',
      action: 'user_banned',
      summary: 'Permanently banned FollowMe123 for spam/bot activity',
      targetType: 'user',
      targetId: 'usr_spam',
    },
  ];

  // Settings
  const settings: PlatformSettings = {
    autoModEnabled: true,
    autoModSensitivity: 65,
    holdMessagesAboveScore: 60,
    autoDeleteAboveScore: 90,
    maxStreamDuration: 48,
    minAccountAgeToStream: 7,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    chatSlowModeDefault: 0,
    subscriberOnlyModeAvailable: true,
    emoteOnlyModeAvailable: true,
    linksAllowedForSubs: true,
    warningsBeforeStrike: 3,
    strikesBeforeBan: 3,
    strikeExpirationDays: 90,
  };

  return {
    activeSection: 'overview' as LivestreamSection,
    selectedStreamId: null,
    selectedUserId: null,
    selectedReportId: null,
    selectedChatMessageId: null,
    users,
    streams,
    reports,
    chatMessages,
    chatFilters,
    teamMembers,
    auditLog,
    settings,
  };
}

// ─────────────────────────────────────────────────────────────
// Store Implementation
// ─────────────────────────────────────────────────────────────

export const useLivestreamStore = create<LivestreamStore>((set, get) => ({
  ...buildInitialState(),

  // Computed stats
  getStats: () => {
    const { users, streams, reports, chatMessages } = get();
    const liveStreams = streams.filter(s => s.status === 'live');
    const today = Date.now() - 24 * 60 * 60 * 1000;
    
    return {
      liveStreams: liveStreams.length,
      totalViewers: liveStreams.reduce((sum, s) => sum + s.viewerCount, 0),
      peakViewersToday: Math.max(...liveStreams.map(s => s.peakViewerCount), 0),
      activeChatUsers: new Set(chatMessages.filter(m => m.createdAt > today).map(m => m.userId)).size,
      newUsers: users.filter(u => u.createdAt > today).length,
      newStreamers: users.filter(u => u.isStreamer && u.createdAt > today).length,
      streamsStarted: streams.filter(s => s.startedAt > today).length,
      reportsReceived: reports.filter(r => r.createdAt > today).length,
      reportsClosed: reports.filter(r => r.resolvedAt && r.resolvedAt > today).length,
      totalUsers: users.length,
      totalStreamers: users.filter(u => u.isStreamer).length,
      totalVODHours: Math.round(streams.filter(s => s.status === 'ended').reduce((sum, s) => sum + s.duration, 0) / 3600),
      pendingReports: reports.filter(r => r.status === 'pending').length,
      escalatedReports: reports.filter(r => r.status === 'escalated').length,
      heldChatMessages: chatMessages.filter(m => m.status === 'held').length,
      streamsFlagged: streams.filter(s => s.isFlagged).length,
    };
  },

  // Navigation
  setActiveSection: (section) => set({ activeSection: section }),
  selectStream: (streamId) => set({ selectedStreamId: streamId }),
  selectUser: (userId) => set({ selectedUserId: userId }),
  selectReport: (reportId) => set({ selectedReportId: reportId }),
  selectChatMessage: (messageId) => set({ selectedChatMessageId: messageId }),

  // Audit helper
  appendAudit: (event) => {
    const next: AuditEvent = {
      id: id('aud'),
      at: Date.now(),
      ...event,
    };
    set((state) => ({ auditLog: [next, ...state.auditLog] }));
  },

  // Stream Actions
  muteStream: (streamId, reason) => {
    set((state) => ({
      streams: state.streams.map(s =>
        s.id === streamId ? { ...s, isMuted: true, moderationNotes: [...s.moderationNotes, `Muted: ${reason || 'No reason provided'}`] } : s
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'stream_muted',
      summary: `Muted stream${reason ? `: ${reason}` : ''}`,
      targetType: 'stream',
      targetId: streamId,
    });
  },

  unmuteStream: (streamId) => {
    set((state) => ({
      streams: state.streams.map(s =>
        s.id === streamId ? { ...s, isMuted: false, moderationNotes: [...s.moderationNotes, 'Unmuted'] } : s
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'stream_muted',
      summary: 'Unmuted stream',
      targetType: 'stream',
      targetId: streamId,
    });
  },

  endStream: (streamId, reason) => {
    set((state) => ({
      streams: state.streams.map(s =>
        s.id === streamId ? { ...s, status: 'ended', endedAt: Date.now(), moderationNotes: [...s.moderationNotes, `Ended by mod: ${reason || 'No reason'}`] } : s
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'stream_ended',
      summary: `Force-ended stream${reason ? `: ${reason}` : ''}`,
      targetType: 'stream',
      targetId: streamId,
    });
  },

  ageRestrictStream: (streamId) => {
    set((state) => ({
      streams: state.streams.map(s =>
        s.id === streamId ? { ...s, isAgeRestricted: true, moderationNotes: [...s.moderationNotes, 'Age-restricted'] } : s
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'stream_age_restricted',
      summary: 'Age-restricted stream',
      targetType: 'stream',
      targetId: streamId,
    });
  },

  flagStream: (streamId, reason) => {
    set((state) => ({
      streams: state.streams.map(s =>
        s.id === streamId ? { ...s, isFlagged: true, flagReason: reason, moderationNotes: [...s.moderationNotes, `Flagged: ${reason}`] } : s
      ),
    }));
  },

  unflagStream: (streamId) => {
    set((state) => ({
      streams: state.streams.map(s =>
        s.id === streamId ? { ...s, isFlagged: false, flagReason: undefined, moderationNotes: [...s.moderationNotes, 'Flag removed'] } : s
      ),
    }));
  },

  addStreamNote: (streamId, note) => {
    set((state) => ({
      streams: state.streams.map(s =>
        s.id === streamId ? { ...s, moderationNotes: [...s.moderationNotes, note] } : s
      ),
    }));
  },

  // User Actions
  warnUser: (userId, reason) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === userId ? { ...u, warningCount: u.warningCount + 1, lastWarningAt: Date.now(), notes: [...u.notes, `Warning: ${reason}`] } : u
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'user_warned',
      summary: `Warned user: ${reason}`,
      targetType: 'user',
      targetId: userId,
    });
  },

  suspendUser: (userId, reason, durationDays = 7) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === userId ? { ...u, status: 'suspended', strikeCount: u.strikeCount + 1, notes: [...u.notes, `Suspended ${durationDays}d: ${reason}`] } : u
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'user_suspended',
      summary: `Suspended user for ${durationDays} days: ${reason}`,
      targetType: 'user',
      targetId: userId,
    });
  },

  banUser: (userId, reason) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === userId ? { ...u, status: 'banned', notes: [...u.notes, `Banned: ${reason}`] } : u
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'user_banned',
      summary: `Banned user: ${reason}`,
      targetType: 'user',
      targetId: userId,
    });
  },

  unbanUser: (userId) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === userId ? { ...u, status: 'active', notes: [...u.notes, 'Unbanned'] } : u
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'user_unbanned',
      summary: 'Unbanned user',
      targetType: 'user',
      targetId: userId,
    });
  },

  addUserNote: (userId, note) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === userId ? { ...u, notes: [...u.notes, note] } : u
      ),
    }));
  },

  setUserTier: (userId, tier) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === userId ? { ...u, tier } : u
      ),
    }));
  },

  addUserBadge: (userId, badge) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === userId && !u.badges.includes(badge) ? { ...u, badges: [...u.badges, badge] } : u
      ),
    }));
  },

  removeUserBadge: (userId, badge) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === userId ? { ...u, badges: u.badges.filter(b => b !== badge) } : u
      ),
    }));
  },

  // Report Actions
  assignReport: (reportId, assigneeId) => {
    set((state) => ({
      reports: state.reports.map(r =>
        r.id === reportId ? { ...r, assignedTo: assigneeId, status: 'reviewing', updatedAt: Date.now() } : r
      ),
    }));
  },

  resolveReport: (reportId, resolution, actionTaken) => {
    set((state) => ({
      reports: state.reports.map(r =>
        r.id === reportId ? { ...r, status: 'resolved', resolution, actionTaken, resolvedAt: Date.now(), updatedAt: Date.now() } : r
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'report_resolved',
      summary: `Resolved report: ${resolution}`,
      targetType: 'report',
      targetId: reportId,
    });
  },

  dismissReport: (reportId, reason) => {
    set((state) => ({
      reports: state.reports.map(r =>
        r.id === reportId ? { ...r, status: 'dismissed', resolution: reason, resolvedAt: Date.now(), updatedAt: Date.now() } : r
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'report_resolved',
      summary: `Dismissed report: ${reason}`,
      targetType: 'report',
      targetId: reportId,
    });
  },

  escalateReport: (reportId) => {
    set((state) => ({
      reports: state.reports.map(r =>
        r.id === reportId ? { ...r, status: 'escalated', priority: 'critical', updatedAt: Date.now() } : r
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'report_escalated',
      summary: 'Escalated report to senior team',
      targetType: 'report',
      targetId: reportId,
    });
  },

  setReportPriority: (reportId, priority) => {
    set((state) => ({
      reports: state.reports.map(r =>
        r.id === reportId ? { ...r, priority, updatedAt: Date.now() } : r
      ),
    }));
  },

  // Chat Actions
  deleteChatMessage: (messageId) => {
    set((state) => ({
      chatMessages: state.chatMessages.map(m =>
        m.id === messageId ? { ...m, status: 'deleted', deletedAt: Date.now(), deletedBy: 'You' } : m
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'chat_message_deleted',
      summary: 'Deleted chat message',
      targetType: 'chat',
      targetId: messageId,
    });
  },

  restoreChatMessage: (messageId) => {
    set((state) => ({
      chatMessages: state.chatMessages.map(m =>
        m.id === messageId ? { ...m, status: 'visible', deletedAt: undefined, deletedBy: undefined } : m
      ),
    }));
  },

  timeoutUser: (userId, streamId, durationSeconds) => {
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'chat_user_timed_out',
      summary: `Timed out user for ${durationSeconds}s in stream`,
      targetType: 'chat',
      targetId: `${userId}_${streamId}`,
      metadata: { durationSeconds },
    });
  },

  banFromChat: (userId, streamId) => {
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'chat_user_banned',
      summary: 'Banned user from stream chat',
      targetType: 'chat',
      targetId: `${userId}_${streamId}`,
    });
  },

  // Chat Filter Actions
  createFilter: (filter) => {
    const newFilter: ChatFilter = {
      id: id('filter'),
      matchCount: 0,
      createdAt: Date.now(),
      ...filter,
    };
    set((state) => ({
      chatFilters: [...state.chatFilters, newFilter],
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'filter_created',
      summary: `Created chat filter: ${filter.name}`,
      targetType: 'settings',
      targetId: newFilter.id,
    });
  },

  updateFilter: (filterId, updates) => {
    set((state) => ({
      chatFilters: state.chatFilters.map(f =>
        f.id === filterId ? { ...f, ...updates } : f
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'filter_updated',
      summary: 'Updated chat filter',
      targetType: 'settings',
      targetId: filterId,
    });
  },

  deleteFilter: (filterId) => {
    set((state) => ({
      chatFilters: state.chatFilters.filter(f => f.id !== filterId),
    }));
  },

  toggleFilter: (filterId) => {
    set((state) => ({
      chatFilters: state.chatFilters.map(f =>
        f.id === filterId ? { ...f, enabled: !f.enabled } : f
      ),
    }));
  },

  // Team Actions
  inviteTeamMember: (email, name, role) => {
    const newMember: TeamMember = {
      id: id('team'),
      userId: '',
      email,
      name,
      role,
      permissions: role === 'owner' ? ['all'] : 
                   role === 'admin' ? ['manage_streams', 'manage_users', 'manage_reports', 'manage_chat', 'view_analytics'] :
                   role === 'moderator' ? ['manage_streams', 'manage_chat', 'manage_reports', 'view_analytics'] :
                   ['view_streams', 'view_users', 'manage_reports', 'view_analytics'],
      status: 'invited',
      lastActiveAt: 0,
      actionsToday: 0,
      totalActions: 0,
      invitedAt: Date.now(),
    };
    set((state) => ({
      teamMembers: [...state.teamMembers, newMember],
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'team_member_invited',
      summary: `Invited ${name} (${email}) as ${role}`,
      targetType: 'team',
      targetId: newMember.id,
    });
  },

  updateTeamMemberRole: (memberId, role) => {
    set((state) => ({
      teamMembers: state.teamMembers.map(m =>
        m.id === memberId ? { ...m, role } : m
      ),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'team_member_role_changed',
      summary: `Changed team member role to ${role}`,
      targetType: 'team',
      targetId: memberId,
    });
  },

  removeTeamMember: (memberId) => {
    const member = get().teamMembers.find(m => m.id === memberId);
    set((state) => ({
      teamMembers: state.teamMembers.filter(m => m.id !== memberId),
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'team_member_removed',
      summary: `Removed ${member?.name || 'team member'} from team`,
      targetType: 'team',
      targetId: memberId,
    });
  },

  // Settings
  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
    get().appendAudit({
      actor: 'You',
      actorId: 'current_user',
      action: 'settings_changed',
      summary: 'Updated platform settings',
      targetType: 'settings',
    });
  },

  // Demo reset
  resetDemo: () => {
    set(buildInitialState());
    setTimeout(() => {
      get().appendAudit({
        actor: 'System',
        actorId: 'system',
        action: 'demo_reset',
        summary: 'Reset demo data',
      });
    }, 0);
  },
}));
