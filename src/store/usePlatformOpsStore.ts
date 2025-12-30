'use client';

import { create } from 'zustand';
import type {
  OpsSection,
  LiveContent,
  ArchivedContent,
  ModerationQueueItem,
  ModerationStatus,
  ModerationSeverity,
  PlatformUser,
  UserReport,
  ReportStatus,
  TeamMember,
  TeamRole,
  AuditEntry,
  AuditAction,
  PlatformSettings,
  PlatformMetrics,
  AnalyticsData,
} from '@/types/platformOps';

// ═══════════════════════════════════════════════════════════════════════════════
// STORE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

interface PlatformOpsStore {
  // UI State
  activeSection: OpsSection;
  selectedContentId: string | null;
  selectedUserId: string | null;
  selectedReportId: string | null;
  selectedModerationId: string | null;
  searchQuery: string;
  
  // Data
  liveContent: LiveContent[];
  archivedContent: ArchivedContent[];
  moderationQueue: ModerationQueueItem[];
  users: PlatformUser[];
  reports: UserReport[];
  team: TeamMember[];
  auditLog: AuditEntry[];
  settings: PlatformSettings;
  analytics: AnalyticsData;
  
  // Navigation
  setActiveSection: (section: OpsSection) => void;
  setSearchQuery: (query: string) => void;
  
  // Selection
  selectContent: (id: string | null) => void;
  selectUser: (id: string | null) => void;
  selectReport: (id: string | null) => void;
  selectModeration: (id: string | null) => void;
  
  // Content Actions
  endContent: (contentId: string, reason?: string) => void;
  featureContent: (contentId: string) => void;
  unfeatureContent: (contentId: string) => void;
  
  // Moderation Actions
  approveModeration: (itemId: string, note?: string) => void;
  removeModeration: (itemId: string, note?: string) => void;
  escalateModeration: (itemId: string, note?: string) => void;
  assignModeration: (itemId: string, assigneeId: string) => void;
  addModerationNote: (itemId: string, note: string) => void;
  
  // User Actions
  warnUser: (userId: string, reason: string) => void;
  timeoutUser: (userId: string, duration: number, reason: string) => void;
  suspendUser: (userId: string, reason: string) => void;
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string, reason: string) => void;
  addUserNote: (userId: string, note: string) => void;
  addUserTag: (userId: string, tag: string) => void;
  removeUserTag: (userId: string, tag: string) => void;
  
  // Report Actions
  assignReport: (reportId: string, assigneeId: string) => void;
  resolveReport: (reportId: string, action: string, note: string) => void;
  dismissReport: (reportId: string, note: string) => void;
  escalateReport: (reportId: string, note: string) => void;
  
  // Team Actions
  inviteTeamMember: (email: string, role: TeamRole) => void;
  updateTeamRole: (memberId: string, role: TeamRole) => void;
  removeTeamMember: (memberId: string) => void;
  
  // Settings
  updateSettings: (settings: Partial<PlatformSettings>) => void;
  
  // Audit
  appendAudit: (entry: Omit<AuditEntry, 'id' | 'at'>) => void;
  
  // Demo
  resetDemo: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const id = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;

const minsAgo = (m: number) => Date.now() - m * 60 * 1000;
const hoursAgo = (h: number) => Date.now() - h * 60 * 60 * 1000;
const daysAgo = (d: number) => Date.now() - d * 24 * 60 * 60 * 1000;

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

function generateInitialState() {
  // Live Content
  const liveContent: LiveContent[] = [
    {
      id: 'live_001',
      type: 'stream',
      title: 'Late Night Gaming - Ranked Climb',
      creatorId: 'usr_alex',
      creatorName: 'AlexPlays',
      status: 'live',
      startedAt: hoursAgo(2),
      viewerCount: 12453,
      peakViewers: 15200,
      category: 'Gaming',
      tags: ['fps', 'competitive', 'english'],
      isAgeRestricted: false,
      isFeatured: true,
      healthScore: 94,
      chatEnabled: true,
      chatMessageCount: 45230,
      flagCount: 2,
      autoModActions: 156,
    },
    {
      id: 'live_002',
      type: 'stream',
      title: 'Cooking Stream: Italian Night 🍝',
      creatorId: 'usr_maria',
      creatorName: 'ChefMaria',
      status: 'live',
      startedAt: hoursAgo(1),
      viewerCount: 3420,
      peakViewers: 4100,
      category: 'Food & Drink',
      tags: ['cooking', 'italian', 'recipes'],
      isAgeRestricted: false,
      isFeatured: false,
      healthScore: 98,
      chatEnabled: true,
      chatMessageCount: 8920,
      flagCount: 0,
      autoModActions: 12,
    },
    {
      id: 'live_003',
      type: 'stream',
      title: 'Music Production Session',
      creatorId: 'usr_beats',
      creatorName: 'BeatMakerPro',
      status: 'live',
      startedAt: minsAgo(45),
      viewerCount: 892,
      peakViewers: 1100,
      category: 'Music',
      tags: ['production', 'hiphop', 'tutorial'],
      isAgeRestricted: false,
      isFeatured: false,
      healthScore: 96,
      chatEnabled: true,
      chatMessageCount: 2340,
      flagCount: 0,
      autoModActions: 5,
    },
    {
      id: 'live_004',
      type: 'stream',
      title: 'ASMR Relaxation & Chat',
      creatorId: 'usr_whisper',
      creatorName: 'WhisperASMR',
      status: 'live',
      startedAt: hoursAgo(3),
      viewerCount: 5670,
      peakViewers: 7200,
      category: 'ASMR',
      tags: ['asmr', 'relaxing', 'sleep'],
      isAgeRestricted: false,
      isFeatured: false,
      healthScore: 72,
      chatEnabled: true,
      chatMessageCount: 12400,
      flagCount: 8,
      autoModActions: 89,
    },
    {
      id: 'live_005',
      type: 'stream',
      title: '🔴 HIGH STAKES POKER - $50K POT',
      creatorId: 'usr_cards',
      creatorName: 'PokerKing',
      status: 'live',
      startedAt: hoursAgo(4),
      viewerCount: 28900,
      peakViewers: 35000,
      category: 'Poker',
      tags: ['poker', 'gambling', 'highstakes'],
      isAgeRestricted: true,
      isFeatured: true,
      healthScore: 88,
      chatEnabled: true,
      chatMessageCount: 98400,
      flagCount: 15,
      autoModActions: 423,
    },
    {
      id: 'live_006',
      type: 'stream',
      title: 'Just Chatting - Life Updates',
      creatorId: 'usr_toxic',
      creatorName: 'EdgeLord99',
      status: 'live',
      startedAt: minsAgo(30),
      viewerCount: 456,
      peakViewers: 600,
      category: 'Just Chatting',
      tags: ['chat', 'rant'],
      isAgeRestricted: false,
      isFeatured: false,
      healthScore: 34,
      chatEnabled: true,
      chatMessageCount: 3200,
      flagCount: 24,
      autoModActions: 67,
    },
  ];

  // Archived Content
  const archivedContent: ArchivedContent[] = [
    {
      id: 'vod_001',
      type: 'stream',
      title: 'Marathon Gaming Session - 12 Hours!',
      creatorId: 'usr_alex',
      creatorName: 'AlexPlays',
      status: 'published',
      createdAt: daysAgo(1),
      endedAt: daysAgo(1) + 12 * 60 * 60 * 1000,
      duration: 43200,
      totalViews: 145000,
      uniqueViewers: 42000,
      peakConcurrent: 18500,
      category: 'Gaming',
      wasLive: true,
      vodAvailable: true,
      clipsCount: 156,
      reportCount: 3,
      moderationHistory: [],
    },
    {
      id: 'vod_002',
      type: 'video',
      title: 'Best of December Clips',
      creatorId: 'usr_maria',
      creatorName: 'ChefMaria',
      status: 'published',
      createdAt: daysAgo(3),
      duration: 1800,
      totalViews: 89000,
      uniqueViewers: 67000,
      peakConcurrent: 0,
      category: 'Food & Drink',
      wasLive: false,
      vodAvailable: true,
      clipsCount: 0,
      reportCount: 0,
      moderationHistory: [],
    },
  ];

  // Moderation Queue
  const moderationQueue: ModerationQueueItem[] = [
    {
      id: 'mod_001',
      contentId: 'live_006',
      contentType: 'stream',
      contentTitle: 'Just Chatting - Life Updates',
      creatorId: 'usr_toxic',
      creatorName: 'EdgeLord99',
      source: 'ai_detection',
      reason: 'hate_speech',
      severity: 'high',
      status: 'pending',
      aiConfidence: 87,
      reportCount: 12,
      createdAt: minsAgo(5),
      notes: ['AI flagged potential hate speech at 00:24:15'],
    },
    {
      id: 'mod_002',
      contentId: 'live_004',
      contentType: 'stream',
      contentTitle: 'ASMR Relaxation & Chat',
      creatorId: 'usr_whisper',
      creatorName: 'WhisperASMR',
      source: 'user_report',
      reason: 'nudity',
      severity: 'medium',
      status: 'pending',
      reportCount: 5,
      createdAt: minsAgo(15),
      notes: ['Multiple reports about suggestive content'],
    },
    {
      id: 'mod_003',
      contentId: 'msg_45678',
      contentType: 'message',
      contentTitle: 'Chat message in PokerKing stream',
      contentPreview: '[Redacted - contains slur]',
      creatorId: 'usr_anon_123',
      creatorName: 'Anonymous123',
      source: 'keyword_filter',
      reason: 'harassment',
      severity: 'high',
      status: 'pending',
      reportCount: 0,
      createdAt: minsAgo(2),
      notes: ['Auto-caught by keyword filter'],
    },
    {
      id: 'mod_004',
      contentId: 'clip_789',
      contentType: 'video',
      contentTitle: 'Clip: Insane headshot compilation',
      creatorId: 'usr_clipper',
      creatorName: 'ClipMaster',
      source: 'user_report',
      reason: 'copyright',
      severity: 'medium',
      status: 'pending',
      reportCount: 1,
      createdAt: hoursAgo(1),
      notes: ['Music rights claim from Universal'],
    },
    {
      id: 'mod_005',
      contentId: 'live_removed',
      contentType: 'stream',
      contentTitle: 'SHOCKING LEAK - Must Watch',
      creatorId: 'usr_banned_001',
      creatorName: 'LeakMaster',
      source: 'ai_detection',
      reason: 'illegal_activity',
      severity: 'critical',
      status: 'escalated',
      aiConfidence: 95,
      reportCount: 45,
      createdAt: hoursAgo(2),
      assignedTo: 'team_admin',
      notes: ['Auto-escalated due to critical severity', 'Stream terminated by system', 'User pre-banned pending review'],
    },
    {
      id: 'mod_006',
      contentId: 'post_123',
      contentType: 'post',
      contentTitle: 'Check out my new setup!',
      creatorId: 'usr_newbie',
      creatorName: 'NewStreamer2024',
      source: 'ai_detection',
      reason: 'spam',
      severity: 'low',
      status: 'pending',
      aiConfidence: 62,
      reportCount: 0,
      createdAt: hoursAgo(3),
      notes: ['Possible self-promotion, low confidence'],
    },
  ];

  // Users
  const users: PlatformUser[] = [
    {
      id: 'usr_alex',
      username: 'alexplays',
      displayName: 'AlexPlays',
      email: 'alex@example.com',
      role: 'partner',
      status: 'active',
      verificationLevel: 'partner',
      createdAt: daysAgo(890),
      lastActiveAt: minsAgo(1),
      isCreator: true,
      followerCount: 1250000,
      subscriberCount: 45000,
      totalContentCount: 1245,
      totalViews: 89000000,
      trustScore: 98,
      warningCount: 0,
      strikeCount: 0,
      timeoutHistory: [],
      previousBans: [],
      totalEarnings: 456000,
      pendingPayout: 12400,
      notes: ['Top partner', 'Excellent community'],
      tags: ['VIP', 'Partner', 'Trusted'],
    },
    {
      id: 'usr_maria',
      username: 'chefmaria',
      displayName: 'ChefMaria',
      email: 'maria@example.com',
      role: 'affiliate',
      status: 'active',
      verificationLevel: 'id',
      createdAt: daysAgo(456),
      lastActiveAt: minsAgo(5),
      isCreator: true,
      followerCount: 89000,
      subscriberCount: 3200,
      totalContentCount: 234,
      totalViews: 4500000,
      trustScore: 95,
      warningCount: 0,
      strikeCount: 0,
      timeoutHistory: [],
      previousBans: [],
      totalEarnings: 34000,
      pendingPayout: 2100,
      notes: [],
      tags: ['Rising Star'],
    },
    {
      id: 'usr_toxic',
      username: 'edgelord99',
      displayName: 'EdgeLord99',
      email: 'edge@example.com',
      role: 'creator',
      status: 'active',
      verificationLevel: 'email',
      createdAt: daysAgo(120),
      lastActiveAt: minsAgo(1),
      isCreator: true,
      followerCount: 12000,
      subscriberCount: 150,
      totalContentCount: 89,
      totalViews: 450000,
      trustScore: 28,
      warningCount: 3,
      strikeCount: 2,
      timeoutHistory: [
        { at: daysAgo(30), duration: 24, reason: 'Hate speech in chat' },
        { at: daysAgo(60), duration: 72, reason: 'Harassment of other streamer' },
      ],
      previousBans: [],
      totalEarnings: 890,
      pendingPayout: 45,
      notes: ['Multiple TOS violations', 'On final warning'],
      tags: ['Watch', 'Problematic'],
    },
    {
      id: 'usr_whisper',
      username: 'whisperasmr',
      displayName: 'WhisperASMR',
      email: 'whisper@example.com',
      role: 'affiliate',
      status: 'active',
      verificationLevel: 'id',
      createdAt: daysAgo(234),
      lastActiveAt: minsAgo(1),
      isCreator: true,
      followerCount: 156000,
      subscriberCount: 8900,
      totalContentCount: 456,
      totalViews: 12000000,
      trustScore: 72,
      warningCount: 1,
      strikeCount: 0,
      timeoutHistory: [],
      previousBans: [],
      totalEarnings: 67000,
      pendingPayout: 4500,
      notes: ['Occasional borderline content', 'Generally compliant'],
      tags: [],
    },
    {
      id: 'usr_cards',
      username: 'pokerking',
      displayName: 'PokerKing',
      email: 'poker@example.com',
      role: 'partner',
      status: 'active',
      verificationLevel: 'partner',
      createdAt: daysAgo(567),
      lastActiveAt: minsAgo(1),
      isCreator: true,
      followerCount: 890000,
      subscriberCount: 34000,
      totalContentCount: 890,
      totalViews: 67000000,
      trustScore: 88,
      warningCount: 0,
      strikeCount: 0,
      timeoutHistory: [],
      previousBans: [],
      totalEarnings: 345000,
      pendingPayout: 18900,
      notes: ['Gambling content - age restricted'],
      tags: ['Partner', 'Age-Restricted Content'],
    },
    {
      id: 'usr_banned_001',
      username: 'leakmaster',
      displayName: 'LeakMaster',
      email: 'leak@example.com',
      role: 'creator',
      status: 'banned',
      verificationLevel: 'email',
      createdAt: daysAgo(45),
      lastActiveAt: hoursAgo(2),
      isCreator: true,
      followerCount: 2300,
      subscriberCount: 0,
      totalContentCount: 12,
      totalViews: 89000,
      trustScore: 0,
      warningCount: 2,
      strikeCount: 3,
      timeoutHistory: [
        { at: daysAgo(30), duration: 168, reason: 'Copyright violation' },
      ],
      previousBans: [
        { at: daysAgo(15), reason: 'Doxxing', liftedAt: daysAgo(8) },
      ],
      notes: ['Permanent ban - illegal content distribution'],
      tags: ['Banned', 'Legal Review'],
    },
    {
      id: 'usr_viewer_001',
      username: 'chillviewer',
      displayName: 'ChillViewer',
      email: 'viewer@example.com',
      role: 'viewer',
      status: 'active',
      verificationLevel: 'email',
      createdAt: daysAgo(234),
      lastActiveAt: hoursAgo(1),
      isCreator: false,
      followerCount: 0,
      subscriberCount: 0,
      totalContentCount: 0,
      totalViews: 0,
      trustScore: 85,
      warningCount: 0,
      strikeCount: 0,
      timeoutHistory: [],
      previousBans: [],
      notes: [],
      tags: [],
    },
  ];

  // Reports
  const reports: UserReport[] = [
    {
      id: 'rpt_001',
      type: 'content',
      reason: 'harassment',
      status: 'new',
      reporterId: 'usr_viewer_001',
      reporterName: 'ChillViewer',
      targetType: 'content',
      targetId: 'live_006',
      targetOwnerId: 'usr_toxic',
      targetOwnerName: 'EdgeLord99',
      description: 'Streamer is targeting and mocking another creator repeatedly. Very uncomfortable to watch.',
      createdAt: minsAgo(10),
      updatedAt: minsAgo(10),
    },
    {
      id: 'rpt_002',
      type: 'user',
      reason: 'impersonation',
      status: 'in_review',
      reporterId: 'usr_alex',
      reporterName: 'AlexPlays',
      targetType: 'user',
      targetId: 'usr_fake_alex',
      targetOwnerName: 'AIexPlays',
      description: 'This account is impersonating me. Using my clips and pretending to be me.',
      evidence: ['screenshot_1.png', 'screenshot_2.png'],
      createdAt: hoursAgo(4),
      updatedAt: hoursAgo(1),
      assignedTo: 'team_mod_1',
    },
    {
      id: 'rpt_003',
      type: 'chat',
      reason: 'spam',
      status: 'new',
      reporterId: 'usr_maria',
      reporterName: 'ChefMaria',
      targetType: 'message',
      targetId: 'msg_spam_123',
      targetOwnerId: 'usr_spammer',
      targetOwnerName: 'CryptoGains2024',
      description: 'User keeps spamming crypto scam links in my chat despite multiple timeouts.',
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(2),
    },
    {
      id: 'rpt_004',
      type: 'content',
      reason: 'copyright',
      status: 'action_taken',
      reporterId: 'usr_external_dmca',
      reporterName: 'DMCA Agent - Universal Music',
      targetType: 'content',
      targetId: 'vod_music_123',
      targetOwnerId: 'usr_dj',
      targetOwnerName: 'DJMixMaster',
      description: 'DMCA takedown request for unauthorized use of copyrighted music.',
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1),
      resolution: {
        action: 'Content removed, strike issued',
        note: 'Valid DMCA claim. VOD muted and strike applied.',
        at: daysAgo(1),
        by: 'System',
      },
    },
  ];

  // Team
  const team: TeamMember[] = [
    {
      id: 'team_owner',
      name: 'Platform Owner',
      email: 'owner@platform.com',
      role: 'owner',
      status: 'active',
      permissions: ['view_content', 'moderate_content', 'remove_content', 'view_users', 'warn_users', 'timeout_users', 'ban_users', 'view_reports', 'resolve_reports', 'manage_team', 'view_analytics', 'manage_settings', 'view_audit', 'manage_payouts'],
      joinedAt: daysAgo(1000),
      lastActiveAt: minsAgo(5),
      actionsToday: 12,
      actionsThisWeek: 89,
      avgResponseTime: 15,
    },
    {
      id: 'team_admin',
      name: 'Sarah Admin',
      email: 'sarah@platform.com',
      role: 'admin',
      status: 'active',
      permissions: ['view_content', 'moderate_content', 'remove_content', 'view_users', 'warn_users', 'timeout_users', 'ban_users', 'view_reports', 'resolve_reports', 'manage_team', 'view_analytics', 'manage_settings', 'view_audit'],
      joinedAt: daysAgo(456),
      lastActiveAt: minsAgo(2),
      actionsToday: 45,
      actionsThisWeek: 234,
      avgResponseTime: 8,
      accuracy: 97,
    },
    {
      id: 'team_mod_1',
      name: 'Mike Moderator',
      email: 'mike@platform.com',
      role: 'moderator',
      status: 'active',
      permissions: ['view_content', 'moderate_content', 'view_users', 'warn_users', 'timeout_users', 'view_reports', 'resolve_reports'],
      joinedAt: daysAgo(234),
      lastActiveAt: minsAgo(15),
      actionsToday: 78,
      actionsThisWeek: 456,
      avgResponseTime: 5,
      accuracy: 94,
    },
    {
      id: 'team_mod_2',
      name: 'Lisa Mod',
      email: 'lisa@platform.com',
      role: 'moderator',
      status: 'active',
      permissions: ['view_content', 'moderate_content', 'view_users', 'warn_users', 'timeout_users', 'view_reports', 'resolve_reports'],
      joinedAt: daysAgo(120),
      lastActiveAt: hoursAgo(1),
      actionsToday: 34,
      actionsThisWeek: 289,
      avgResponseTime: 12,
      accuracy: 91,
    },
    {
      id: 'team_support',
      name: 'Support Agent',
      email: 'support@platform.com',
      role: 'support',
      status: 'active',
      permissions: ['view_content', 'view_users', 'warn_users', 'view_reports', 'resolve_reports'],
      joinedAt: daysAgo(90),
      lastActiveAt: hoursAgo(2),
      actionsToday: 23,
      actionsThisWeek: 156,
      avgResponseTime: 20,
    },
    {
      id: 'team_invited',
      name: 'New Hire',
      email: 'newhire@platform.com',
      role: 'moderator',
      status: 'invited',
      permissions: ['view_content', 'moderate_content', 'view_users', 'warn_users', 'timeout_users', 'view_reports', 'resolve_reports'],
      joinedAt: daysAgo(1),
      lastActiveAt: daysAgo(1),
      actionsToday: 0,
      actionsThisWeek: 0,
      avgResponseTime: 0,
    },
  ];

  // Audit Log
  const auditLog: AuditEntry[] = [
    {
      id: 'aud_001',
      at: minsAgo(5),
      actor: { id: 'team_admin', name: 'Sarah Admin', role: 'admin' },
      action: 'content_removed',
      targetType: 'content',
      targetId: 'live_removed',
      targetName: 'SHOCKING LEAK - Must Watch',
      summary: 'Terminated stream for illegal content distribution',
    },
    {
      id: 'aud_002',
      at: minsAgo(10),
      actor: { id: 'team_mod_1', name: 'Mike Moderator', role: 'moderator' },
      action: 'user_warned',
      targetType: 'user',
      targetId: 'usr_toxic',
      targetName: 'EdgeLord99',
      summary: 'Issued warning for hate speech',
    },
    {
      id: 'aud_003',
      at: hoursAgo(1),
      actor: { id: 'team_admin', name: 'Sarah Admin', role: 'admin' },
      action: 'user_banned',
      targetType: 'user',
      targetId: 'usr_banned_001',
      targetName: 'LeakMaster',
      summary: 'Permanent ban for illegal content',
    },
    {
      id: 'aud_004',
      at: hoursAgo(2),
      actor: { id: 'team_mod_2', name: 'Lisa Mod', role: 'moderator' },
      action: 'report_resolved',
      targetType: 'report',
      targetId: 'rpt_004',
      summary: 'Processed DMCA takedown request',
    },
    {
      id: 'aud_005',
      at: hoursAgo(4),
      actor: { id: 'team_owner', name: 'Platform Owner', role: 'owner' },
      action: 'content_featured',
      targetType: 'content',
      targetId: 'live_001',
      targetName: 'Late Night Gaming - Ranked Climb',
      summary: 'Featured stream on homepage',
    },
  ];

  // Settings
  const settings: PlatformSettings = {
    autoMod: {
      enabled: true,
      keywordFilterEnabled: true,
      aiModerationEnabled: true,
      aiSensitivity: 'medium',
      autoRemoveThreshold: 90,
      autoEscalateSeverities: ['critical'],
      bannedWords: ['[redacted]'],
      bannedPatterns: [],
    },
    contentRules: {
      allowAdultContent: true,
      requireAgeGating: true,
      maxContentLength: undefined,
      allowedCategories: ['Gaming', 'Music', 'Art', 'Just Chatting', 'Food & Drink', 'ASMR', 'Poker', 'Sports'],
    },
    userRules: {
      newAccountCooldown: 24,
      verificationRequired: 'email',
      autoTimeoutOnStrikes: true,
      strikesToBan: 3,
    },
    alerts: {
      slackWebhook: 'https://hooks.slack.com/...',
      emailAlerts: ['alerts@platform.com'],
      alertOnCritical: true,
      alertOnHighVolume: true,
      highVolumeThreshold: 50,
    },
  };

  // Analytics
  const analytics: AnalyticsData = {
    metrics: {
      activeUsers: 145230,
      liveContentCount: 1234,
      totalViewers: 892456,
      chatMessagesPerMinute: 12450,
      newUsersToday: 3456,
      contentCreatedToday: 567,
      reportsToday: 234,
      moderationActionsToday: 456,
      activeUsersTrend: 12.4,
      viewersTrend: 8.2,
      reportsTrend: -5.3,
      pendingModeration: 6,
      pendingReports: 3,
      avgResponseTime: 8,
      contentHealthScore: 94,
      trustScoreAvg: 78,
      autoModCatchRate: 67,
    },
    viewersHistory: Array.from({ length: 24 }, (_, i) => ({
      timestamp: hoursAgo(23 - i),
      value: 500000 + Math.random() * 400000,
    })),
    reportsHistory: Array.from({ length: 24 }, (_, i) => ({
      timestamp: hoursAgo(23 - i),
      value: Math.floor(5 + Math.random() * 20),
    })),
    moderationHistory: Array.from({ length: 24 }, (_, i) => ({
      timestamp: hoursAgo(23 - i),
      value: Math.floor(10 + Math.random() * 40),
    })),
    topCategories: [
      { name: 'Gaming', count: 456 },
      { name: 'Just Chatting', count: 234 },
      { name: 'Music', count: 156 },
      { name: 'Art', count: 89 },
      { name: 'ASMR', count: 67 },
    ],
    topReasons: [
      { reason: 'harassment', count: 89 },
      { reason: 'spam', count: 67 },
      { reason: 'hate_speech', count: 45 },
      { reason: 'nudity', count: 34 },
      { reason: 'copyright', count: 23 },
    ],
  };

  return {
    activeSection: 'command-center' as OpsSection,
    selectedContentId: null,
    selectedUserId: null,
    selectedReportId: null,
    selectedModerationId: null,
    searchQuery: '',
    liveContent,
    archivedContent,
    moderationQueue,
    users,
    reports,
    team,
    auditLog,
    settings,
    analytics,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const usePlatformOpsStore = create<PlatformOpsStore>((set, get) => ({
  ...generateInitialState(),

  // Navigation
  setActiveSection: (section) => {
    set({
      activeSection: section,
      selectedContentId: null,
      selectedUserId: null,
      selectedReportId: null,
      selectedModerationId: null,
      searchQuery: '',
    });
  },
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Selection
  selectContent: (id) => set({ selectedContentId: id }),
  selectUser: (id) => set({ selectedUserId: id }),
  selectReport: (id) => set({ selectedReportId: id }),
  selectModeration: (id) => set({ selectedModerationId: id }),

  // Content Actions
  endContent: (contentId, reason) => {
    set((state) => ({
      liveContent: state.liveContent.map((c) =>
        c.id === contentId ? { ...c, status: 'archived' as const } : c
      ),
    }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'content_removed',
      targetType: 'content',
      targetId: contentId,
      summary: `Ended content${reason ? `: ${reason}` : ''}`,
    });
  },

  featureContent: (contentId) => {
    set((state) => ({
      liveContent: state.liveContent.map((c) =>
        c.id === contentId ? { ...c, isFeatured: true } : c
      ),
    }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'content_featured',
      targetType: 'content',
      targetId: contentId,
      summary: 'Featured content',
    });
  },

  unfeatureContent: (contentId) => {
    set((state) => ({
      liveContent: state.liveContent.map((c) =>
        c.id === contentId ? { ...c, isFeatured: false } : c
      ),
    }));
  },

  // Moderation Actions
  approveModeration: (itemId, note) => {
    set((state) => ({
      moderationQueue: state.moderationQueue.map((m) =>
        m.id === itemId
          ? { ...m, status: 'approved' as ModerationStatus, notes: note ? [...m.notes, note] : m.notes }
          : m
      ),
      selectedModerationId: state.selectedModerationId === itemId ? null : state.selectedModerationId,
    }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'content_approved',
      targetType: 'content',
      targetId: itemId,
      summary: 'Approved moderation item',
    });
  },

  removeModeration: (itemId, note) => {
    set((state) => ({
      moderationQueue: state.moderationQueue.map((m) =>
        m.id === itemId
          ? { ...m, status: 'removed' as ModerationStatus, notes: note ? [...m.notes, note] : m.notes }
          : m
      ),
      selectedModerationId: state.selectedModerationId === itemId ? null : state.selectedModerationId,
    }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'content_removed',
      targetType: 'content',
      targetId: itemId,
      summary: 'Removed content from moderation queue',
    });
  },

  escalateModeration: (itemId, note) => {
    set((state) => ({
      moderationQueue: state.moderationQueue.map((m) =>
        m.id === itemId
          ? { ...m, status: 'escalated' as ModerationStatus, notes: note ? [...m.notes, note] : m.notes }
          : m
      ),
    }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'report_escalated',
      targetType: 'content',
      targetId: itemId,
      summary: 'Escalated moderation item',
    });
  },

  assignModeration: (itemId, assigneeId) => {
    set((state) => ({
      moderationQueue: state.moderationQueue.map((m) =>
        m.id === itemId ? { ...m, assignedTo: assigneeId, status: 'reviewing' as ModerationStatus } : m
      ),
    }));
  },

  addModerationNote: (itemId, note) => {
    set((state) => ({
      moderationQueue: state.moderationQueue.map((m) =>
        m.id === itemId ? { ...m, notes: [...m.notes, note] } : m
      ),
    }));
  },

  // User Actions
  warnUser: (userId, reason) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, warningCount: u.warningCount + 1, notes: [reason, ...u.notes] } : u
      ),
    }));
    const user = get().users.find((u) => u.id === userId);
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'user_warned',
      targetType: 'user',
      targetId: userId,
      targetName: user?.displayName,
      summary: `Warned user: ${reason}`,
    });
  },

  timeoutUser: (userId, duration, reason) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              timeoutHistory: [{ at: Date.now(), duration, reason }, ...u.timeoutHistory],
            }
          : u
      ),
    }));
    const user = get().users.find((u) => u.id === userId);
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'user_timed_out',
      targetType: 'user',
      targetId: userId,
      targetName: user?.displayName,
      summary: `Timed out user for ${duration}h: ${reason}`,
    });
  },

  suspendUser: (userId, reason) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, status: 'suspended', notes: [reason, ...u.notes] } : u
      ),
    }));
    const user = get().users.find((u) => u.id === userId);
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'user_suspended',
      targetType: 'user',
      targetId: userId,
      targetName: user?.displayName,
      summary: `Suspended user: ${reason}`,
    });
  },

  banUser: (userId, reason) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'banned',
              trustScore: 0,
              previousBans: [{ at: Date.now(), reason }, ...u.previousBans],
              notes: [reason, ...u.notes],
            }
          : u
      ),
    }));
    const user = get().users.find((u) => u.id === userId);
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'user_banned',
      targetType: 'user',
      targetId: userId,
      targetName: user?.displayName,
      summary: `Banned user: ${reason}`,
    });
  },

  unbanUser: (userId, reason) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'active',
              previousBans: u.previousBans.map((b, i) =>
                i === 0 ? { ...b, liftedAt: Date.now() } : b
              ),
              notes: [reason, ...u.notes],
            }
          : u
      ),
    }));
    const user = get().users.find((u) => u.id === userId);
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'user_unbanned',
      targetType: 'user',
      targetId: userId,
      targetName: user?.displayName,
      summary: `Unbanned user: ${reason}`,
    });
  },

  addUserNote: (userId, note) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, notes: [note, ...u.notes] } : u
      ),
    }));
  },

  addUserTag: (userId, tag) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId && !u.tags.includes(tag) ? { ...u, tags: [...u.tags, tag] } : u
      ),
    }));
  },

  removeUserTag: (userId, tag) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, tags: u.tags.filter((t) => t !== tag) } : u
      ),
    }));
  },

  // Report Actions
  assignReport: (reportId, assigneeId) => {
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === reportId ? { ...r, assignedTo: assigneeId, status: 'in_review' as ReportStatus, updatedAt: Date.now() } : r
      ),
    }));
  },

  resolveReport: (reportId, action, note) => {
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'action_taken' as ReportStatus,
              updatedAt: Date.now(),
              resolution: { action, note, at: Date.now(), by: 'You' },
            }
          : r
      ),
      selectedReportId: state.selectedReportId === reportId ? null : state.selectedReportId,
    }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'report_resolved',
      targetType: 'report',
      targetId: reportId,
      summary: `Resolved report: ${action}`,
    });
  },

  dismissReport: (reportId, note) => {
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'no_action' as ReportStatus,
              updatedAt: Date.now(),
              resolution: { action: 'Dismissed', note, at: Date.now(), by: 'You' },
            }
          : r
      ),
      selectedReportId: state.selectedReportId === reportId ? null : state.selectedReportId,
    }));
  },

  escalateReport: (reportId, note) => {
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === reportId
          ? { ...r, status: 'in_review' as ReportStatus, updatedAt: Date.now() }
          : r
      ),
    }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'report_escalated',
      targetType: 'report',
      targetId: reportId,
      summary: 'Escalated report',
    });
  },

  // Team Actions
  inviteTeamMember: (email, role) => {
    const newMember: TeamMember = {
      id: id('team'),
      name: email.split('@')[0],
      email,
      role,
      status: 'invited',
      permissions: [],
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
      actionsToday: 0,
      actionsThisWeek: 0,
      avgResponseTime: 0,
    };
    set((state) => ({ team: [...state.team, newMember] }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'team_member_added',
      targetType: 'team',
      targetId: newMember.id,
      targetName: email,
      summary: `Invited ${email} as ${role}`,
    });
  },

  updateTeamRole: (memberId, role) => {
    set((state) => ({
      team: state.team.map((m) => (m.id === memberId ? { ...m, role } : m)),
    }));
    const member = get().team.find((m) => m.id === memberId);
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'team_role_changed',
      targetType: 'team',
      targetId: memberId,
      targetName: member?.name,
      summary: `Changed role to ${role}`,
    });
  },

  removeTeamMember: (memberId) => {
    const member = get().team.find((m) => m.id === memberId);
    set((state) => ({
      team: state.team.filter((m) => m.id !== memberId),
    }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'team_member_removed',
      targetType: 'team',
      targetId: memberId,
      targetName: member?.name,
      summary: 'Removed team member',
    });
  },

  // Settings
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
    get().appendAudit({
      actor: { id: 'team_owner', name: 'You', role: 'owner' },
      action: 'setting_changed',
      targetType: 'setting',
      targetId: 'platform_settings',
      summary: 'Updated platform settings',
    });
  },

  // Audit
  appendAudit: (entry) => {
    const newEntry: AuditEntry = {
      id: id('aud'),
      at: Date.now(),
      ...entry,
    };
    set((state) => ({ auditLog: [newEntry, ...state.auditLog] }));
  },

  // Demo
  resetDemo: () => {
    set(generateInitialState());
  },
}));
