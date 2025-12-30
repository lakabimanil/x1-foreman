'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Ban,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Radio,
  Shield,
  Star,
  StarOff,
  StopCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Drawer, Badge, EmptyState, HealthIndicator, ActionButton, formatNumber, formatRelative, formatDuration } from './shared';
import type { LiveContent } from '@/types/platformOps';

interface LiveContentSectionProps {
  content: LiveContent[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onEndContent: (id: string, reason?: string) => void;
  onFeature: (id: string) => void;
  onUnfeature: (id: string) => void;
  onToast: (t: { level: 'success' | 'info' | 'warning' | 'error'; title: string; message?: string }) => void;
}

export function LiveContentSection({
  content,
  selectedId,
  onSelect,
  onEndContent,
  onFeature,
  onUnfeature,
  onToast,
}: LiveContentSectionProps) {
  const [filter, setFilter] = useState<'all' | 'featured' | 'flagged' | 'low_health'>('all');
  const [search, setSearch] = useState('');

  const filtered = content
    .filter(c => {
      if (filter === 'featured') return c.isFeatured;
      if (filter === 'flagged') return c.flagCount > 0;
      if (filter === 'low_health') return c.healthScore < 60;
      return true;
    })
    .filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.creatorName.toLowerCase().includes(q);
    })
    .sort((a, b) => b.viewerCount - a.viewerCount);

  const selected = selectedId ? content.find(c => c.id === selectedId) : null;

  return (
    <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      {/* List */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-white font-semibold flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              Live Content ({content.length})
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              {formatNumber(content.reduce((a, c) => a + c.viewerCount, 0))} total viewers
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-9 w-48 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as typeof filter)}
              className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
            >
              <option value="all">All</option>
              <option value="featured">Featured</option>
              <option value="flagged">Flagged</option>
              <option value="low_health">Low Health</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No live content" description="No content matches the current filters." icon={Radio} />
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {filtered.map(item => {
                const isSelected = selectedId === item.id;
                const healthColor =
                  item.healthScore >= 80 ? 'text-emerald-400' :
                  item.healthScore >= 60 ? 'text-amber-400' :
                  item.healthScore >= 40 ? 'text-orange-400' : 'text-rose-400';

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${isSelected ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">{item.title}</span>
                          {item.isFeatured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                          {item.isAgeRestricted && <Badge variant="warning">18+</Badge>}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {item.creatorName} • {item.category} • Started {formatRelative(item.startedAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-white">
                            <Eye className="w-3.5 h-3.5 text-neutral-500" />
                            {formatNumber(item.viewerCount)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                            <MessageSquare className="w-3 h-3" />
                            {formatNumber(item.chatMessageCount)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${healthColor}`}>{item.healthScore}</div>
                          <div className="text-xs text-neutral-500">health</div>
                        </div>
                        {item.flagCount > 0 && (
                          <Badge variant="danger">
                            <AlertTriangle className="w-3 h-3" />
                            {item.flagCount}
                          </Badge>
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

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <Drawer
            title={selected.title}
            subtitle={`${selected.creatorName} • ${selected.category}`}
            onClose={() => onSelect(null)}
            width={480}
          >
            <div className="p-5 space-y-5">
              {/* Status */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-white font-medium">LIVE</span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    Started {formatRelative(selected.startedAt)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-2xl font-semibold text-white">{formatNumber(selected.viewerCount)}</div>
                    <div className="text-xs text-neutral-500">Viewers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-white">{formatNumber(selected.peakViewers)}</div>
                    <div className="text-xs text-neutral-500">Peak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-white">{formatNumber(selected.chatMessageCount)}</div>
                    <div className="text-xs text-neutral-500">Chat msgs</div>
                  </div>
                </div>
              </div>

              {/* Health */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-white font-medium">Content Health</div>
                  <HealthIndicator score={selected.healthScore} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60">
                    <span className="text-neutral-400">User Flags</span>
                    <span className={selected.flagCount > 5 ? 'text-rose-400' : 'text-white'}>{selected.flagCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60">
                    <span className="text-neutral-400">Auto-mod Actions</span>
                    <span className="text-white">{selected.autoModActions}</span>
                  </div>
                </div>
                {selected.healthScore < 50 && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Low health score - consider reviewing this content
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selected.tags.map(tag => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
                {selected.isAgeRestricted && <Badge variant="warning">Age Restricted</Badge>}
                {selected.isFeatured && <Badge variant="success">Featured</Badge>}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  {selected.isFeatured ? (
                    <ActionButton
                      icon={StarOff}
                      onClick={() => {
                        onUnfeature(selected.id);
                        onToast({ level: 'info', title: 'Unfeatured', message: 'Removed from featured' });
                      }}
                    >
                      Unfeature
                    </ActionButton>
                  ) : (
                    <ActionButton
                      icon={Star}
                      onClick={() => {
                        onFeature(selected.id);
                        onToast({ level: 'success', title: 'Featured', message: 'Added to featured' });
                      }}
                    >
                      Feature
                    </ActionButton>
                  )}
                  <ActionButton icon={MessageSquare}>
                    Open Chat
                  </ActionButton>
                </div>
              </div>

              {/* Moderation Actions */}
              <div className="space-y-3">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase">Moderation</div>
                <div className="grid grid-cols-2 gap-2">
                  <ActionButton icon={VolumeX}>
                    Mute Audio
                  </ActionButton>
                  <ActionButton icon={Shield}>
                    Add Warning
                  </ActionButton>
                  <ActionButton
                    variant="danger"
                    icon={StopCircle}
                    onClick={() => {
                      onEndContent(selected.id, 'Ended by moderator');
                      onToast({ level: 'warning', title: 'Content Ended', message: 'Stream has been terminated' });
                      onSelect(null);
                    }}
                  >
                    End Stream
                  </ActionButton>
                  <ActionButton
                    variant="danger"
                    icon={Ban}
                    onClick={() => {
                      onEndContent(selected.id, 'Creator banned');
                      onToast({ level: 'error', title: 'Creator Banned', message: 'User banned and content ended' });
                      onSelect(null);
                    }}
                  >
                    Ban Creator
                  </ActionButton>
                </div>
              </div>

              {/* Creator Info */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Creator</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{selected.creatorName}</div>
                    <div className="text-xs text-neutral-500">{selected.creatorId}</div>
                  </div>
                  <ActionButton size="sm">View Profile</ActionButton>
                </div>
              </div>
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}
