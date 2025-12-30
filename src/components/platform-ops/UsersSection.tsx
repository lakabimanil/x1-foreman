'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Crown,
  Eye,
  MessageSquare,
  Shield,
  Star,
  Tag,
  User,
  UserMinus,
  Users,
  XCircle,
} from 'lucide-react';
import { Drawer, Badge, EmptyState, ActionButton, StatCard, formatNumber, formatRelative, formatMoney } from './shared';
import type { PlatformUser, UserStatus } from '@/types/platformOps';

interface UsersSectionProps {
  users: PlatformUser[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onWarn: (id: string, reason: string) => void;
  onTimeout: (id: string, duration: number, reason: string) => void;
  onSuspend: (id: string, reason: string) => void;
  onBan: (id: string, reason: string) => void;
  onUnban: (id: string, reason: string) => void;
  onAddNote: (id: string, note: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onToast: (t: { level: 'success' | 'info' | 'warning' | 'error'; title: string; message?: string }) => void;
}

export function UsersSection({
  users,
  selectedId,
  onSelect,
  onWarn,
  onTimeout,
  onSuspend,
  onBan,
  onUnban,
  onAddNote,
  onAddTag,
  onRemoveTag,
  onToast,
}: UsersSectionProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'creator' | 'viewer'>('all');
  const [sortBy, setSortBy] = useState<'activity' | 'followers' | 'trust'>('activity');

  const [actionReason, setActionReason] = useState('');
  const [timeoutDuration, setTimeoutDuration] = useState(24);
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');

  const filtered = users
    .filter(u => {
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (roleFilter === 'creator' && !u.isCreator) return false;
      if (roleFilter === 'viewer' && u.isCreator) return false;
      if (search) {
        const q = search.toLowerCase();
        return u.username.toLowerCase().includes(q) || 
               u.displayName.toLowerCase().includes(q) || 
               u.email.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'followers') return b.followerCount - a.followerCount;
      if (sortBy === 'trust') return b.trustScore - a.trustScore;
      return b.lastActiveAt - a.lastActiveAt;
    });

  const selected = selectedId ? users.find(u => u.id === selectedId) : null;

  const statusColors: Record<UserStatus, { bg: string; text: string }> = {
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
    suspended: { bg: 'bg-amber-500/10', text: 'text-amber-300' },
    banned: { bg: 'bg-rose-500/10', text: 'text-rose-300' },
    pending_verification: { bg: 'bg-sky-500/10', text: 'text-sky-300' },
  };

  return (
    <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      {/* List */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="text-white font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              Users ({users.length})
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="flex-1 h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as typeof roleFilter)}
              className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
            >
              <option value="all">All Users</option>
              <option value="creator">Creators</option>
              <option value="viewer">Viewers</option>
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
            >
              <option value="activity">Last Active</option>
              <option value="followers">Followers</option>
              <option value="trust">Trust Score</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No users found" description="No users match the current filters." icon={Users} />
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {filtered.map(user => {
                const isSelected = selectedId === user.id;
                const status = statusColors[user.status];

                return (
                  <button
                    key={user.id}
                    onClick={() => onSelect(user.id)}
                    className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${isSelected ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center flex-shrink-0">
                          {user.role === 'partner' ? (
                            <Crown className="w-5 h-5 text-amber-400" />
                          ) : user.isCreator ? (
                            <Star className="w-5 h-5 text-violet-400" />
                          ) : (
                            <User className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium truncate">{user.displayName}</span>
                            {user.role === 'partner' && <Badge variant="warning">Partner</Badge>}
                            {user.role === 'affiliate' && <Badge variant="info">Affiliate</Badge>}
                          </div>
                          <div className="text-xs text-neutral-500 truncate">
                            @{user.username} • {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {user.isCreator && (
                          <div className="text-right">
                            <div className="text-sm text-white">{formatNumber(user.followerCount)}</div>
                            <div className="text-xs text-neutral-500">followers</div>
                          </div>
                        )}
                        <div className="text-right">
                          <div className={`text-sm ${user.trustScore >= 70 ? 'text-emerald-400' : user.trustScore >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {user.trustScore}
                          </div>
                          <div className="text-xs text-neutral-500">trust</div>
                        </div>
                        <Badge className={`${status.bg} ${status.text} border border-current/20`}>
                          {user.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <Drawer
            title={selected.displayName}
            subtitle={`@${selected.username} • ${selected.email}`}
            onClose={() => onSelect(null)}
            width={520}
          >
            <div className="p-5 space-y-5">
              {/* Status Banner */}
              {selected.status !== 'active' && (
                <div className={`p-4 rounded-2xl ${statusColors[selected.status].bg} border border-current/20`}>
                  <div className={`font-semibold ${statusColors[selected.status].text} flex items-center gap-2`}>
                    {selected.status === 'banned' ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    {selected.status === 'banned' ? 'Banned' : 'Suspended'}
                  </div>
                  {selected.previousBans.length > 0 && (
                    <div className="text-xs mt-1 opacity-70">
                      {selected.previousBans[0].reason}
                    </div>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Trust Score" value={selected.trustScore} />
                <StatCard label="Warnings" value={selected.warningCount} />
                <StatCard label="Strikes" value={selected.strikeCount} />
                <StatCard label="Timeouts" value={selected.timeoutHistory.length} />
              </div>

              {selected.isCreator && (
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Followers" value={formatNumber(selected.followerCount)} />
                  <StatCard label="Subscribers" value={formatNumber(selected.subscriberCount)} />
                  <StatCard label="Total Content" value={selected.totalContentCount} />
                  <StatCard label="Total Views" value={formatNumber(selected.totalViews)} />
                </div>
              )}

              {selected.totalEarnings !== undefined && (
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Total Earnings" value={formatMoney(selected.totalEarnings * 100)} />
                  <StatCard label="Pending Payout" value={formatMoney((selected.pendingPayout ?? 0) * 100)} />
                </div>
              )}

              {/* Tags */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Tags</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selected.tags.length === 0 ? (
                    <span className="text-sm text-neutral-500">No tags</span>
                  ) : (
                    selected.tags.map(tag => (
                      <Badge key={tag}>
                        {tag}
                        <button
                          onClick={() => onRemoveTag(selected.id, tag)}
                          className="ml-1 hover:text-rose-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="flex-1 h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
                  />
                  <ActionButton
                    size="sm"
                    icon={Tag}
                    disabled={!newTag.trim()}
                    onClick={() => {
                      onAddTag(selected.id, newTag.trim());
                      setNewTag('');
                    }}
                  >
                    Add
                  </ActionButton>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Notes</div>
                {selected.notes.length > 0 ? (
                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                    {selected.notes.map((note, i) => (
                      <div key={i} className="text-sm text-neutral-300 p-2 rounded-lg bg-neutral-950">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500 mb-3">No notes</div>
                )}
                <div className="flex gap-2">
                  <input
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add note..."
                    className="flex-1 h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
                  />
                  <ActionButton
                    size="sm"
                    disabled={!newNote.trim()}
                    onClick={() => {
                      onAddNote(selected.id, newNote.trim());
                      setNewNote('');
                      onToast({ level: 'info', title: 'Note added' });
                    }}
                  >
                    Add
                  </ActionButton>
                </div>
              </div>

              {/* History */}
              {selected.timeoutHistory.length > 0 && (
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Timeout History</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selected.timeoutHistory.map((t, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-950">
                        <span className="text-neutral-400">{t.reason}</span>
                        <span className="text-neutral-500">{t.duration}h • {formatRelative(t.at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selected.status !== 'banned' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold tracking-wider text-white/30 uppercase">Actions</div>
                  
                  <input
                    value={actionReason}
                    onChange={e => setActionReason(e.target.value)}
                    placeholder="Reason for action..."
                    className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <ActionButton
                      icon={AlertTriangle}
                      disabled={!actionReason.trim()}
                      onClick={() => {
                        onWarn(selected.id, actionReason);
                        setActionReason('');
                        onToast({ level: 'warning', title: 'Warning issued' });
                      }}
                    >
                      Warn
                    </ActionButton>
                    <div className="flex gap-1">
                      <select
                        value={timeoutDuration}
                        onChange={e => setTimeoutDuration(Number(e.target.value))}
                        className="w-20 h-full px-2 rounded-l-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
                      >
                        <option value={1}>1h</option>
                        <option value={24}>24h</option>
                        <option value={72}>72h</option>
                        <option value={168}>7d</option>
                      </select>
                      <ActionButton
                        icon={Clock}
                        disabled={!actionReason.trim()}
                        onClick={() => {
                          onTimeout(selected.id, timeoutDuration, actionReason);
                          setActionReason('');
                          onToast({ level: 'warning', title: `Timed out for ${timeoutDuration}h` });
                        }}
                      >
                        Timeout
                      </ActionButton>
                    </div>
                    <ActionButton
                      icon={UserMinus}
                      disabled={!actionReason.trim()}
                      onClick={() => {
                        onSuspend(selected.id, actionReason);
                        setActionReason('');
                        onToast({ level: 'warning', title: 'User suspended' });
                      }}
                    >
                      Suspend
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      icon={Ban}
                      disabled={!actionReason.trim()}
                      onClick={() => {
                        onBan(selected.id, actionReason);
                        setActionReason('');
                        onToast({ level: 'error', title: 'User banned' });
                      }}
                    >
                      Ban
                    </ActionButton>
                  </div>
                </div>
              )}

              {/* Unban */}
              {selected.status === 'banned' && (
                <ActionButton
                  variant="primary"
                  icon={CheckCircle}
                  onClick={() => {
                    onUnban(selected.id, 'Ban lifted by admin');
                    onToast({ level: 'success', title: 'User unbanned' });
                  }}
                >
                  Unban User
                </ActionButton>
              )}

              {/* Account Info */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Account</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Created</span>
                    <span className="text-neutral-300">{formatRelative(selected.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Last Active</span>
                    <span className="text-neutral-300">{formatRelative(selected.lastActiveAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Verification</span>
                    <span className="text-neutral-300 capitalize">{selected.verificationLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Role</span>
                    <span className="text-neutral-300 capitalize">{selected.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}
