'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Ban,
  Check,
  ChevronRight,
  Clock,
  Download,
  Eye,
  EyeOff,
  Filter,
  Flag,
  Hash,
  Headphones,
  MessageSquare,
  Mic,
  MicOff,
  MoreVertical,
  Pause,
  Play,
  Radio,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  TrendingUp,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import { useLivestreamStore } from '@/store/useLivestreamStore';
import type {
  LivestreamSection,
  Stream,
  PlatformUser,
  Report,
  ChatMessage,
  TeamMember,
  TeamRole,
  AuditEvent,
  StreamCategory,
  ReportCategory,
} from '@/types/livestream';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / (60 * 1000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─────────────────────────────────────────────────────────────
// UI Components
// ─────────────────────────────────────────────────────────────

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, trend, icon: Icon }: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ElementType;
}) {
  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-neutral-500">{label}</div>
        {Icon && <Icon className="w-4 h-4 text-neutral-600" />}
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && (
          <TrendingUp className={`w-4 h-4 ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400 rotate-180' : 'text-neutral-500'}`} />
        )}
      </div>
      {sub && <div className="text-xs text-neutral-500 mt-1">{sub}</div>}
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500 text-white text-xs font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      Live
    </span>
  );
}

function HealthIndicator({ health }: { health: Stream['health'] }) {
  const config = {
    excellent: { color: 'bg-emerald-400', label: 'Excellent' },
    good: { color: 'bg-emerald-400', label: 'Good' },
    fair: { color: 'bg-amber-400', label: 'Fair' },
    poor: { color: 'bg-rose-400', label: 'Poor' },
    offline: { color: 'bg-neutral-600', label: 'Offline' },
  };
  const { color, label } = config[health];
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-neutral-400">{label}</span>
    </div>
  );
}

function Drawer({ title, subtitle, onClose, children }: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.aside
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-[440px] border-l border-neutral-800 bg-neutral-950 flex flex-col"
    >
      <div className="px-5 py-4 border-b border-neutral-800 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-white font-semibold truncate">{title}</div>
          {subtitle && <div className="text-xs text-neutral-500 mt-0.5 truncate">{subtitle}</div>}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </motion.aside>
  );
}

function EmptyState({ title, description, icon: Icon }: { title: string; description: string; icon?: React.ElementType }) {
  return (
    <div className="border border-neutral-800/70 bg-neutral-900/20 rounded-2xl p-10 text-center">
      {Icon && <Icon className="w-12 h-12 text-neutral-700 mx-auto mb-4" />}
      <div className="text-white font-semibold">{title}</div>
      <div className="text-sm text-neutral-500 mt-2">{description}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Tabs
// ─────────────────────────────────────────────────────────────

const sectionTabs: Array<{ id: LivestreamSection; label: string; icon: React.ElementType }> = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'live', label: 'Live Now', icon: Radio },
  { id: 'streams', label: 'All Streams', icon: Video },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'reports', label: 'Reports', icon: Flag },
  { id: 'chat', label: 'Chat Mod', icon: MessageSquare },
  { id: 'team', label: 'Team', icon: UserCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'audit', label: 'Audit', icon: Shield },
];

// ─────────────────────────────────────────────────────────────
// Overview Section
// ─────────────────────────────────────────────────────────────

function OverviewSection({ onNavigate }: { onNavigate: (section: LivestreamSection) => void }) {
  const { getStats, streams, reports, users } = useLivestreamStore();
  const stats = getStats();
  const liveStreams = streams.filter(s => s.status === 'live').slice(0, 3);
  const pendingReports = reports.filter(r => r.status === 'pending').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Real-time stats */}
      <div>
        <h3 className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-4">Real-time</h3>
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Live Streams" value={stats.liveStreams} icon={Radio} trend="up" />
          <StatCard label="Total Viewers" value={formatNumber(stats.totalViewers)} icon={Eye} trend="up" />
          <StatCard label="Peak Today" value={formatNumber(stats.peakViewersToday)} icon={TrendingUp} />
          <StatCard label="Active Chat" value={formatNumber(stats.activeChatUsers)} icon={MessageSquare} />
        </div>
      </div>

      {/* Moderation overview */}
      <div>
        <h3 className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-4">Moderation Queue</h3>
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            label="Pending Reports" 
            value={stats.pendingReports} 
            sub={stats.escalatedReports > 0 ? `${stats.escalatedReports} escalated` : undefined}
            icon={Flag} 
          />
          <StatCard label="Held Messages" value={stats.heldChatMessages} icon={MessageSquare} />
          <StatCard label="Flagged Streams" value={stats.streamsFlagged} icon={AlertTriangle} />
          <StatCard label="Reports (24h)" value={stats.reportsReceived} sub={`${stats.reportsClosed} resolved`} icon={ShieldCheck} />
        </div>
      </div>

      {/* Quick actions grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Live streams quick view */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white font-semibold">Live Streams</div>
              <div className="text-xs text-neutral-500">{stats.liveStreams} currently live</div>
            </div>
            <button onClick={() => onNavigate('live')} className="text-sm text-neutral-300 hover:text-white flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {liveStreams.map(stream => {
              const user = users.find(u => u.id === stream.userId);
              return (
                <div key={stream.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">{user?.displayName || 'Unknown'}</div>
                    <div className="text-xs text-neutral-500 truncate">{stream.title}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-neutral-400">{formatNumber(stream.viewerCount)}</span>
                    <Eye className="w-3 h-3 text-neutral-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending reports */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white font-semibold">Pending Reports</div>
              <div className="text-xs text-neutral-500">{stats.pendingReports} need review</div>
            </div>
            <button onClick={() => onNavigate('reports')} className="text-sm text-neutral-300 hover:text-white flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {pendingReports.length === 0 ? (
              <div className="text-sm text-neutral-500 text-center py-4">No pending reports</div>
            ) : (
              pendingReports.map(report => (
                <div key={report.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="min-w-0">
                    <div className="text-sm text-white capitalize">{report.category.replace('_', ' ')}</div>
                    <div className="text-xs text-neutral-500">{formatRelative(report.createdAt)}</div>
                  </div>
                  <Pill className={
                    report.priority === 'critical' ? 'bg-rose-500/15 text-rose-300' :
                    report.priority === 'high' ? 'bg-orange-500/15 text-orange-300' :
                    'bg-neutral-800 text-neutral-300'
                  }>
                    {report.priority}
                  </Pill>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Platform stats */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white font-semibold">Platform Stats</div>
              <div className="text-xs text-neutral-500">Overall metrics</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Users" value={formatNumber(stats.totalUsers)} />
            <StatCard label="Streamers" value={formatNumber(stats.totalStreamers)} />
            <StatCard label="VOD Hours" value={`${formatNumber(stats.totalVODHours)}h`} />
            <StatCard label="New Today" value={stats.newUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Live Streams Section
// ─────────────────────────────────────────────────────────────

function LiveStreamsSection() {
  const { streams, users, selectStream, selectedStreamId, muteStream, unmuteStream, endStream, ageRestrictStream, flagStream, unflagStream } = useLivestreamStore();
  const liveStreams = streams.filter(s => s.status === 'live');
  const [search, setSearch] = useState('');

  const filteredStreams = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return liveStreams;
    return liveStreams.filter(s => {
      const user = users.find(u => u.id === s.userId);
      return s.title.toLowerCase().includes(q) || 
             user?.username.toLowerCase().includes(q) ||
             s.category.toLowerCase().includes(q);
    });
  }, [liveStreams, search, users]);

  const selectedStream = selectedStreamId ? streams.find(s => s.id === selectedStreamId) : null;
  const selectedUser = selectedStream ? users.find(u => u.id === selectedStream.userId) : null;

  return (
    <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      {/* Stream list */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-white font-semibold flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-400" />
              Live Streams
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">{liveStreams.length} currently broadcasting</div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search streams..."
              className="h-9 w-[200px] pl-9 pr-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredStreams.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No live streams" description="No streams match your search." icon={VideoOff} />
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {filteredStreams.map(stream => {
                const user = users.find(u => u.id === stream.userId);
                const isSelected = selectedStreamId === stream.id;
                return (
                  <button
                    key={stream.id}
                    onClick={() => selectStream(stream.id)}
                    className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${isSelected ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <LiveBadge />
                          <span className="text-white font-medium truncate">{user?.displayName || 'Unknown'}</span>
                          {user?.badges.includes('verified') && <UserCheck className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="text-sm text-neutral-400 truncate">{stream.title}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {formatNumber(stream.viewerCount)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5" />
                            {stream.category}
                          </span>
                          <HealthIndicator health={stream.health} />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {stream.isMuted && (
                          <Pill className="bg-rose-500/15 text-rose-300">
                            <VolumeX className="w-3 h-3" />
                            Muted
                          </Pill>
                        )}
                        {stream.isFlagged && (
                          <Pill className="bg-amber-500/15 text-amber-300">
                            <Flag className="w-3 h-3" />
                            Flagged
                          </Pill>
                        )}
                        {stream.isAgeRestricted && (
                          <Pill className="bg-purple-500/15 text-purple-300">
                            18+
                          </Pill>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Stream detail drawer */}
      <AnimatePresence>
        {selectedStream && selectedUser && (
          <Drawer
            title={selectedUser.displayName}
            subtitle={`@${selectedUser.username} • ${selectedStream.category}`}
            onClose={() => selectStream(null)}
          >
            <div className="p-5 space-y-5">
              {/* Stream preview card */}
              <div className="aspect-video bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-12 h-12 text-neutral-700 mx-auto mb-2" />
                  <div className="text-sm text-neutral-500">Stream preview</div>
                </div>
              </div>

              {/* Stream info */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                <div className="text-white font-medium">{selectedStream.title}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedStream.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-300">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Viewers" value={formatNumber(selectedStream.viewerCount)} />
                <StatCard label="Peak" value={formatNumber(selectedStream.peakViewerCount)} />
                <StatCard label="Chat msgs" value={formatNumber(selectedStream.chatMessageCount)} />
                <StatCard label="Duration" value={formatDuration(Math.floor((Date.now() - selectedStream.startedAt) / 1000))} />
              </div>

              {/* Technical info */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                <div className="text-xs text-neutral-500 mb-3">Stream Health</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-white font-medium">{selectedStream.bitrate}kbps</div>
                    <div className="text-xs text-neutral-500">Bitrate</div>
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedStream.resolution}</div>
                    <div className="text-xs text-neutral-500">Resolution</div>
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedStream.fps}fps</div>
                    <div className="text-xs text-neutral-500">Frame Rate</div>
                  </div>
                </div>
              </div>

              {/* Flags/warnings */}
              {selectedStream.isFlagged && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="text-amber-300 font-medium text-sm">⚠️ Stream Flagged</div>
                  <div className="text-xs text-amber-200/70 mt-1">{selectedStream.flagReason}</div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => selectedStream.isMuted ? unmuteStream(selectedStream.id) : muteStream(selectedStream.id, 'Manual moderation')}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                    selectedStream.isMuted 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {selectedStream.isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  {selectedStream.isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button
                  onClick={() => ageRestrictStream(selectedStream.id)}
                  disabled={selectedStream.isAgeRestricted}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <EyeOff className="w-4 h-4" />
                  18+ Restrict
                </button>
                <button
                  onClick={() => selectedStream.isFlagged ? unflagStream(selectedStream.id) : flagStream(selectedStream.id, 'Manual review')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  {selectedStream.isFlagged ? 'Remove Flag' : 'Flag'}
                </button>
                <button
                  onClick={() => {
                    if (confirm('End this stream immediately?')) {
                      endStream(selectedStream.id, 'Ended by moderator');
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                >
                  <VideoOff className="w-4 h-4" />
                  End Stream
                </button>
              </div>

              {/* Streamer info */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                <div className="text-xs text-neutral-500 mb-3">Streamer</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {selectedUser.displayName[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedUser.displayName}</div>
                    <div className="text-xs text-neutral-500">@{selectedUser.username} • {formatNumber(selectedUser.followerCount)} followers</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {selectedUser.badges.map(badge => (
                    <Pill key={badge} className="bg-neutral-800 text-neutral-300 capitalize">{badge}</Pill>
                  ))}
                </div>
              </div>

              {/* Mod notes */}
              {selectedStream.moderationNotes.length > 0 && (
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                  <div className="text-xs text-neutral-500 mb-3">Moderation Notes</div>
                  <div className="space-y-2">
                    {selectedStream.moderationNotes.map((note, i) => (
                      <div key={i} className="text-sm text-neutral-300">{note}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Users Section
// ─────────────────────────────────────────────────────────────

function UsersSection() {
  const { users, selectUser, selectedUserId, warnUser, suspendUser, banUser, unbanUser, addUserNote, setUserTier } = useLivestreamStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PlatformUser['status']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'streamer' | 'viewer'>('all');
  const [noteInput, setNoteInput] = useState('');

  const filteredUsers = useMemo(() => {
    let result = users;
    if (statusFilter !== 'all') result = result.filter(u => u.status === statusFilter);
    if (typeFilter === 'streamer') result = result.filter(u => u.isStreamer);
    if (typeFilter === 'viewer') result = result.filter(u => !u.isStreamer);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => 
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => b.lastActiveAt - a.lastActiveAt);
  }, [users, statusFilter, typeFilter, search]);

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  const statusColors = {
    active: 'bg-emerald-500/15 text-emerald-300',
    suspended: 'bg-amber-500/15 text-amber-300',
    banned: 'bg-rose-500/15 text-rose-300',
    pending: 'bg-neutral-800 text-neutral-300',
  };

  return (
    <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-white font-semibold">Users</div>
            <div className="text-xs text-neutral-500 mt-0.5">{users.length} total accounts</div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
            >
              <option value="all">All Types</option>
              <option value="streamer">Streamers</option>
              <option value="viewer">Viewers</option>
            </select>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-9 w-[180px] pl-9 pr-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No users found" description="Try adjusting your filters." icon={Users} />
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => selectUser(user.id)}
                  className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${selectedUserId === user.id ? 'bg-white/5' : ''}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {user.displayName[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">{user.displayName}</span>
                          {user.badges.includes('verified') && <UserCheck className="w-4 h-4 text-blue-400" />}
                          {user.isStreamer && <Video className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className="text-xs text-neutral-500 truncate">@{user.username} • {user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right mr-2">
                        <div className="text-sm text-neutral-300">{formatNumber(user.followerCount)}</div>
                        <div className="text-xs text-neutral-600">followers</div>
                      </div>
                      <Pill className={statusColors[user.status]}>
                        {user.status}
                      </Pill>
                      <Pill className="bg-neutral-800 text-neutral-300 capitalize">{user.tier}</Pill>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <Drawer
            title={selectedUser.displayName}
            subtitle={`@${selectedUser.username}`}
            onClose={() => selectUser(null)}
          >
            <div className="p-5 space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Followers" value={formatNumber(selectedUser.followerCount)} />
                <StatCard label="Following" value={formatNumber(selectedUser.followingCount)} />
                <StatCard label="Stream Hours" value={formatNumber(selectedUser.totalStreamHours)} />
                <StatCard label="Watch Hours" value={formatNumber(selectedUser.totalViewHours)} />
              </div>

              {/* Status & tier */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-500">Account Status</div>
                    <Pill className={`mt-1 ${statusColors[selectedUser.status]}`}>{selectedUser.status}</Pill>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Tier</div>
                    <Pill className="mt-1 bg-neutral-800 text-neutral-300 capitalize">{selectedUser.tier}</Pill>
                  </div>
                </div>
              </div>

              {/* Moderation history */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                <div className="text-xs text-neutral-500 mb-3">Moderation History</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-2xl font-bold text-white">{selectedUser.warningCount}</div>
                    <div className="text-xs text-neutral-500">Warnings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{selectedUser.strikeCount}</div>
                    <div className="text-xs text-neutral-500">Strikes</div>
                  </div>
                </div>
                {selectedUser.lastWarningAt && (
                  <div className="text-xs text-neutral-500 mt-3">Last warning: {formatRelative(selectedUser.lastWarningAt)}</div>
                )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const reason = prompt('Warning reason:');
                    if (reason) warnUser(selectedUser.id, reason);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Warn
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Suspension reason:');
                    if (reason) suspendUser(selectedUser.id, reason, 7);
                  }}
                  disabled={selectedUser.status === 'suspended' || selectedUser.status === 'banned'}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-500 transition-colors disabled:opacity-50"
                >
                  <Clock className="w-4 h-4" />
                  Suspend
                </button>
                {selectedUser.status === 'banned' ? (
                  <button
                    onClick={() => unbanUser(selectedUser.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors col-span-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Unban
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const reason = prompt('Ban reason:');
                      if (reason && confirm('Permanently ban this user?')) banUser(selectedUser.id, reason);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors col-span-2"
                  >
                    <Ban className="w-4 h-4" />
                    Ban Permanently
                  </button>
                )}
              </div>

              {/* Notes */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                <div className="text-xs text-neutral-500 mb-3">Notes ({selectedUser.notes.length})</div>
                <div className="flex gap-2 mb-3">
                  <input
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 h-9 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
                  />
                  <button
                    onClick={() => {
                      if (noteInput.trim()) {
                        addUserNote(selectedUser.id, noteInput.trim());
                        setNoteInput('');
                      }
                    }}
                    disabled={!noteInput.trim()}
                    className="px-3 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedUser.notes.length === 0 ? (
                    <div className="text-sm text-neutral-500">No notes yet</div>
                  ) : (
                    selectedUser.notes.map((note, i) => (
                      <div key={i} className="text-sm text-neutral-300 p-2 bg-neutral-950 rounded-lg">{note}</div>
                    ))
                  )}
                </div>
              </div>

              {/* Account info */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 text-xs text-neutral-500 space-y-1">
                <div>Created: {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                <div>Last active: {formatRelative(selectedUser.lastActiveAt)}</div>
                {selectedUser.lastStreamAt && <div>Last stream: {formatRelative(selectedUser.lastStreamAt)}</div>}
              </div>
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Reports Section
// ─────────────────────────────────────────────────────────────

function ReportsSection() {
  const { reports, users, selectReport, selectedReportId, resolveReport, dismissReport, escalateReport, setReportPriority } = useLivestreamStore();
  const [statusFilter, setStatusFilter] = useState<'all' | Report['status']>('all');
  const [search, setSearch] = useState('');

  const filteredReports = useMemo(() => {
    let result = reports;
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => 
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.createdAt - a.createdAt;
    });
  }, [reports, statusFilter, search]);

  const selectedReport = selectedReportId ? reports.find(r => r.id === selectedReportId) : null;
  const targetUser = selectedReport ? users.find(u => u.id === selectedReport.targetUserId) : null;
  const reporterUser = selectedReport ? users.find(u => u.id === selectedReport.reporterId) : null;

  const priorityColors = {
    critical: 'bg-rose-500/15 text-rose-300',
    high: 'bg-orange-500/15 text-orange-300',
    medium: 'bg-amber-500/15 text-amber-300',
    low: 'bg-neutral-800 text-neutral-300',
  };

  const statusColors = {
    pending: 'bg-amber-500/15 text-amber-300',
    reviewing: 'bg-blue-500/15 text-blue-300',
    resolved: 'bg-emerald-500/15 text-emerald-300',
    dismissed: 'bg-neutral-800 text-neutral-400',
    escalated: 'bg-rose-500/15 text-rose-300',
  };

  return (
    <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-white font-semibold">Reports</div>
            <div className="text-xs text-neutral-500 mt-0.5">
              {reports.filter(r => r.status === 'pending').length} pending • {reports.filter(r => r.status === 'escalated').length} escalated
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-9 w-[180px] pl-9 pr-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredReports.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No reports" description="No reports match the current filters." icon={ShieldCheck} />
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {filteredReports.map(report => {
                const target = users.find(u => u.id === report.targetUserId);
                return (
                  <button
                    key={report.id}
                    onClick={() => selectReport(report.id)}
                    className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${selectedReportId === report.id ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium capitalize">{report.category.replace('_', ' ')}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="text-sm text-neutral-400">{report.targetType}</span>
                        </div>
                        <div className="text-sm text-neutral-500 truncate">{report.description}</div>
                        <div className="text-xs text-neutral-600 mt-1">
                          Against @{target?.username || 'unknown'} • {formatRelative(report.createdAt)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Pill className={priorityColors[report.priority]}>
                          {report.priority}
                        </Pill>
                        <Pill className={statusColors[report.status]}>
                          {report.status}
                        </Pill>
                        {report.aiConfidence !== undefined && (
                          <span className="text-xs text-neutral-500">AI: {report.aiConfidence}%</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedReport && (
          <Drawer
            title={`${selectedReport.category.replace('_', ' ')} Report`}
            subtitle={`${selectedReport.targetType} • ${formatRelative(selectedReport.createdAt)}`}
            onClose={() => selectReport(null)}
          >
            <div className="p-5 space-y-5">
              {/* Report details */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                <div className="text-xs text-neutral-500 mb-2">Description</div>
                <div className="text-white">{selectedReport.description}</div>
              </div>

              {/* Target & Reporter */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                  <div className="text-xs text-neutral-500 mb-2">Reported User</div>
                  <div className="text-white font-medium">{targetUser?.displayName || 'Unknown'}</div>
                  <div className="text-xs text-neutral-500">@{targetUser?.username}</div>
                </div>
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                  <div className="text-xs text-neutral-500 mb-2">Reporter</div>
                  <div className="text-white font-medium">{reporterUser?.displayName || 'Unknown'}</div>
                  <div className="text-xs text-neutral-500">@{reporterUser?.username}</div>
                </div>
              </div>

              {/* AI suggestion */}
              {selectedReport.aiConfidence !== undefined && (
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-2">
                    <Zap className="w-4 h-4" />
                    AI Analysis ({selectedReport.aiConfidence}% confidence)
                  </div>
                  <div className="text-sm text-violet-200/80">{selectedReport.aiSuggestion}</div>
                </div>
              )}

              {/* Priority selector */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                <div className="text-xs text-neutral-500 mb-2">Priority</div>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setReportPriority(selectedReport.id, p)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedReport.priority === p 
                          ? priorityColors[p] + ' ring-2 ring-white/20'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selectedReport.status === 'pending' || selectedReport.status === 'reviewing' ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const resolution = prompt('Resolution summary:');
                      const action = prompt('Action taken (optional):');
                      if (resolution) resolveReport(selectedReport.id, resolution, action || undefined);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Resolve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Dismissal reason:');
                      if (reason) dismissReport(selectedReport.id, reason);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Dismiss
                  </button>
                  <button
                    onClick={() => escalateReport(selectedReport.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors col-span-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Escalate
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                  <div className="text-xs text-neutral-500 mb-2">Resolution</div>
                  <div className="text-white">{selectedReport.resolution || 'No resolution recorded'}</div>
                  {selectedReport.actionTaken && (
                    <div className="text-sm text-neutral-400 mt-2">Action: {selectedReport.actionTaken}</div>
                  )}
                </div>
              )}
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chat Moderation Section
// ─────────────────────────────────────────────────────────────

function ChatModSection() {
  const { chatMessages, chatFilters, users, streams, deleteChatMessage, restoreChatMessage, toggleFilter, createFilter, deleteFilter } = useLivestreamStore();
  const [tab, setTab] = useState<'held' | 'filters'>('held');

  const heldMessages = chatMessages.filter(m => m.status === 'held');

  return (
    <div className="h-full flex flex-col overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      {/* Tabs */}
      <div className="px-5 py-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('held')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'held' ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            Held Messages ({heldMessages.length})
          </button>
          <button
            onClick={() => setTab('filters')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'filters' ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            Filters ({chatFilters.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'held' ? (
          heldMessages.length === 0 ? (
            <EmptyState title="No held messages" description="Messages flagged by AutoMod will appear here." icon={MessageSquare} />
          ) : (
            <div className="space-y-3">
              {heldMessages.map(msg => {
                const user = users.find(u => u.id === msg.userId);
                const stream = streams.find(s => s.id === msg.streamId);
                return (
                  <div key={msg.id} className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{user?.displayName || 'Unknown'}</span>
                          <span className="text-neutral-500">in</span>
                          <span className="text-neutral-400">{streams.find(s => s.id === msg.streamId)?.title || 'Unknown stream'}</span>
                        </div>
                        <div className="text-white bg-neutral-950 rounded-lg p-3 mt-2">{msg.content}</div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                          <Pill className="bg-amber-500/15 text-amber-300 capitalize">{msg.violation || 'Unknown'}</Pill>
                          <span>Score: {msg.autoModScore}</span>
                          <span>•</span>
                          <span>{formatRelative(msg.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => restoreChatMessage(msg.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500"
                        >
                          <Check className="w-3 h-3" />
                          Allow
                        </button>
                        <button
                          onClick={() => deleteChatMessage(msg.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm hover:bg-rose-500"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => {
                const name = prompt('Filter name:');
                const pattern = prompt('Pattern (word, phrase, or regex):');
                if (name && pattern) {
                  createFilter({ name, type: 'phrase', pattern, action: 'hold', enabled: true });
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Create New Filter
            </button>
            {chatFilters.map(filter => (
              <div key={filter.id} className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{filter.name}</div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {filter.type} • {filter.action} • {formatNumber(filter.matchCount)} matches
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFilter(filter.id)}
                      className={`w-10 h-6 rounded-full transition-colors ${filter.enabled ? 'bg-emerald-500' : 'bg-neutral-700'}`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow m-0.5"
                        animate={{ x: filter.enabled ? 16 : 0 }}
                      />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this filter?')) deleteFilter(filter.id);
                      }}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-white/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Team Section
// ─────────────────────────────────────────────────────────────

function TeamSection() {
  const { teamMembers, inviteTeamMember, updateTeamMemberRole, removeTeamMember } = useLivestreamStore();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('moderator');

  const roleColors = {
    owner: 'bg-amber-500/15 text-amber-300',
    admin: 'bg-rose-500/15 text-rose-300',
    moderator: 'bg-violet-500/15 text-violet-300',
    support: 'bg-blue-500/15 text-blue-300',
  };

  return (
    <div className="h-full flex flex-col overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <div className="text-white font-semibold">Team Management</div>
          <div className="text-xs text-neutral-500 mt-0.5">{teamMembers.filter(m => m.status === 'active').length} active members</div>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Invite form */}
        <AnimatePresence>
          {showInvite && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 mb-4"
            >
              <div className="text-white font-medium mb-3">Invite Team Member</div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Name"
                  className="h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
                />
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email"
                  className="h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
                />
              </div>
              <div className="mt-3">
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setShowInvite(false)}
                  className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (inviteName && inviteEmail) {
                      inviteTeamMember(inviteEmail, inviteName, inviteRole);
                      setInviteName('');
                      setInviteEmail('');
                      setShowInvite(false);
                    }
                  }}
                  disabled={!inviteName || !inviteEmail}
                  className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 disabled:opacity-50"
                >
                  Send Invite
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team list */}
        <div className="space-y-3">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {member.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{member.name}</span>
                      {member.status === 'invited' && (
                        <Pill className="bg-amber-500/15 text-amber-300">Pending</Pill>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill className={roleColors[member.role]}>{member.role}</Pill>
                  {member.role !== 'owner' && (
                    <button
                      onClick={() => {
                        if (confirm('Remove this team member?')) removeTeamMember(member.id);
                      }}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-white/5"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {member.status === 'active' && (
                <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                  <span>Actions today: {member.actionsToday}</span>
                  <span>Total: {formatNumber(member.totalActions)}</span>
                  <span>Last active: {formatRelative(member.lastActiveAt)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Settings Section
// ─────────────────────────────────────────────────────────────

function SettingsSection() {
  const { settings, updateSettings } = useLivestreamStore();

  return (
    <div className="h-full overflow-y-auto space-y-4">
      {/* AutoMod */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
        <div className="text-white font-semibold mb-4">AutoMod Settings</div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white">Enable AutoMod</div>
              <div className="text-xs text-neutral-500">Automatically moderate chat messages</div>
            </div>
            <button
              onClick={() => updateSettings({ autoModEnabled: !settings.autoModEnabled })}
              className={`w-12 h-7 rounded-full transition-colors ${settings.autoModEnabled ? 'bg-emerald-500' : 'bg-neutral-700'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow m-0.5" animate={{ x: settings.autoModEnabled ? 20 : 0 }} />
            </button>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white">Sensitivity</span>
              <span className="text-neutral-400">{settings.autoModSensitivity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.autoModSensitivity}
              onChange={(e) => updateSettings({ autoModSensitivity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white">Hold messages above score</span>
              <span className="text-neutral-400">{settings.holdMessagesAboveScore}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.holdMessagesAboveScore}
              onChange={(e) => updateSettings({ holdMessagesAboveScore: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white">Auto-delete above score</span>
              <span className="text-neutral-400">{settings.autoDeleteAboveScore}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.autoDeleteAboveScore}
              onChange={(e) => updateSettings({ autoDeleteAboveScore: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Stream rules */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
        <div className="text-white font-semibold mb-4">Stream Requirements</div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white">Require email verification</div>
              <div className="text-xs text-neutral-500">Users must verify email to stream</div>
            </div>
            <button
              onClick={() => updateSettings({ requireEmailVerification: !settings.requireEmailVerification })}
              className={`w-12 h-7 rounded-full transition-colors ${settings.requireEmailVerification ? 'bg-emerald-500' : 'bg-neutral-700'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow m-0.5" animate={{ x: settings.requireEmailVerification ? 20 : 0 }} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white">Require phone verification</div>
              <div className="text-xs text-neutral-500">Additional verification for streaming</div>
            </div>
            <button
              onClick={() => updateSettings({ requirePhoneVerification: !settings.requirePhoneVerification })}
              className={`w-12 h-7 rounded-full transition-colors ${settings.requirePhoneVerification ? 'bg-emerald-500' : 'bg-neutral-700'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow m-0.5" animate={{ x: settings.requirePhoneVerification ? 20 : 0 }} />
            </button>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white">Min account age to stream (days)</span>
              <span className="text-neutral-400">{settings.minAccountAgeToStream}</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={settings.minAccountAgeToStream}
              onChange={(e) => updateSettings({ minAccountAgeToStream: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Strike system */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
        <div className="text-white font-semibold mb-4">Strike System</div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Warnings before strike" value={settings.warningsBeforeStrike} />
          <StatCard label="Strikes before ban" value={settings.strikesBeforeBan} />
          <StatCard label="Strike expires (days)" value={settings.strikeExpirationDays} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Audit Section
// ─────────────────────────────────────────────────────────────

function AuditSection() {
  const { auditLog } = useLivestreamStore();
  const [search, setSearch] = useState('');

  const filteredAudit = useMemo(() => {
    if (!search) return auditLog;
    const q = search.toLowerCase();
    return auditLog.filter(e => 
      e.summary.toLowerCase().includes(q) ||
      e.actor.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q)
    );
  }, [auditLog, search]);

  return (
    <div className="h-full flex flex-col overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <div className="text-white font-semibold">Audit Log</div>
          <div className="text-xs text-neutral-500 mt-0.5">{auditLog.length} events recorded</div>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="h-9 w-[200px] pl-9 pr-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {filteredAudit.length === 0 ? (
          <EmptyState title="No events" description="Audit events will appear here." icon={Shield} />
        ) : (
          filteredAudit.map(event => (
            <div key={event.id} className="flex items-start justify-between gap-4 p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl">
              <div>
                <div className="text-white">{event.summary}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  {event.actor} • {formatRelative(event.at)}
                </div>
              </div>
              <Pill className="bg-neutral-800 text-neutral-300 text-xs">
                {event.action.replace(/_/g, ' ')}
              </Pill>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────

export function LivestreamDashboard() {
  const { setActiveView } = useWebPresenceStore();
  const { activeSection, setActiveSection, resetDemo, getStats } = useLivestreamStore();
  const stats = getStats();

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0a0a] to-black">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="h-4 w-px bg-neutral-800" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">Platform Operations</h1>
              <Pill className="bg-rose-500/15 text-rose-300 border border-rose-500/20">
                <Radio className="w-3.5 h-3.5" />
                {stats.liveStreams} Live
              </Pill>
              <Pill className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                <Eye className="w-3.5 h-3.5" />
                {formatNumber(stats.totalViewers)} Viewers
              </Pill>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Livestream moderation • User management • Reports • Analytics
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetDemo();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Demo
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-8 pt-6">
        <div className="flex flex-wrap gap-2">
          {sectionTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
                  isActive
                    ? 'border-white/15 bg-white/10 text-white'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="livestream-tab-indicator"
                    className="absolute -bottom-[6px] left-3 right-3 h-[2px] bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-8 pb-8 pt-6">
        {activeSection === 'overview' && <OverviewSection onNavigate={setActiveSection} />}
        {activeSection === 'live' && <LiveStreamsSection />}
        {activeSection === 'streams' && (
          <div className="h-full flex items-center justify-center">
            <EmptyState 
              title="All Streams (VODs)" 
              description="View past streams and VOD archive. Coming in this demo." 
              icon={Video} 
            />
          </div>
        )}
        {activeSection === 'users' && <UsersSection />}
        {activeSection === 'reports' && <ReportsSection />}
        {activeSection === 'chat' && <ChatModSection />}
        {activeSection === 'team' && <TeamSection />}
        {activeSection === 'settings' && <SettingsSection />}
        {activeSection === 'audit' && <AuditSection />}
      </div>
    </div>
  );
}
