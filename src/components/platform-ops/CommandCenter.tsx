'use client';

import {
  Activity,
  AlertTriangle,
  ChevronRight,
  Eye,
  Flag,
  MessageSquare,
  Radio,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { StatCard, Badge, formatNumber, HealthIndicator } from './shared';
import type { AnalyticsData, LiveContent, ModerationQueueItem, UserReport, OpsSection } from '@/types/platformOps';

interface CommandCenterProps {
  analytics: AnalyticsData;
  liveContent: LiveContent[];
  moderationQueue: ModerationQueueItem[];
  reports: UserReport[];
  onNavigate: (section: OpsSection) => void;
}

export function CommandCenter({ analytics, liveContent, moderationQueue, reports, onNavigate }: CommandCenterProps) {
  const { metrics } = analytics;
  const pendingModeration = moderationQueue.filter(m => m.status === 'pending');
  const criticalItems = moderationQueue.filter(m => m.severity === 'critical' && m.status !== 'removed');
  const newReports = reports.filter(r => r.status === 'new');
  const lowHealthContent = liveContent.filter(c => c.healthScore < 50);

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {(criticalItems.length > 0 || lowHealthContent.length > 0) && (
        <div className="space-y-3">
          {criticalItems.map(item => (
            <div key={item.id} className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <div className="text-white font-medium">Critical: {item.contentTitle}</div>
                  <div className="text-xs text-rose-300/70 mt-0.5">{item.reason.replace('_', ' ')} • AI Confidence: {item.aiConfidence}%</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('moderation-queue')}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 transition-colors"
              >
                Review Now
              </button>
            </div>
          ))}
          {lowHealthContent.map(content => (
            <div key={content.id} className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-white font-medium">Low Health Score: {content.title}</div>
                  <div className="text-xs text-amber-300/70 mt-0.5">
                    Health: {content.healthScore} • {content.flagCount} flags • {formatNumber(content.viewerCount)} viewers
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('live-content')}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors"
              >
                Monitor
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Real-time Stats */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard
          label="Live Content"
          value={formatNumber(metrics.liveContentCount)}
          icon={Radio}
          sub={`${liveContent.length} tracked`}
        />
        <StatCard
          label="Total Viewers"
          value={formatNumber(metrics.totalViewers)}
          trend={metrics.viewersTrend}
          icon={Eye}
        />
        <StatCard
          label="Active Users"
          value={formatNumber(metrics.activeUsers)}
          trend={metrics.activeUsersTrend}
          icon={Users}
        />
        <StatCard
          label="Chat/min"
          value={formatNumber(metrics.chatMessagesPerMinute)}
          icon={MessageSquare}
        />
        <StatCard
          label="Platform Health"
          value={metrics.contentHealthScore}
          icon={Shield}
          sub="Content safety score"
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Moderation Queue */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <div className="text-white font-semibold">Moderation Queue</div>
                <div className="text-xs text-neutral-500 mt-0.5">Items needing review</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('moderation-queue')}
              className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Open <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-neutral-900/60 rounded-xl p-3">
              <div className="text-2xl font-semibold text-white">{pendingModeration.length}</div>
              <div className="text-xs text-neutral-500 mt-1">Pending</div>
            </div>
            <div className="bg-neutral-900/60 rounded-xl p-3">
              <div className="text-2xl font-semibold text-rose-400">{criticalItems.length}</div>
              <div className="text-xs text-neutral-500 mt-1">Critical</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-neutral-500">
            Avg response: {metrics.avgResponseTime}m • Auto-catch: {metrics.autoModCatchRate}%
          </div>
        </div>

        {/* Reports */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Flag className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-white font-semibold">User Reports</div>
                <div className="text-xs text-neutral-500 mt-0.5">Submitted by community</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Open <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-neutral-900/60 rounded-xl p-3">
              <div className="text-2xl font-semibold text-white">{newReports.length}</div>
              <div className="text-xs text-neutral-500 mt-1">New</div>
            </div>
            <div className="bg-neutral-900/60 rounded-xl p-3">
              <div className="text-2xl font-semibold text-amber-400">{metrics.reportsToday}</div>
              <div className="text-xs text-neutral-500 mt-1">Today</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-neutral-500 flex items-center gap-1">
            <span className={metrics.reportsTrend < 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {metrics.reportsTrend < 0 ? '↓' : '↑'} {Math.abs(metrics.reportsTrend).toFixed(1)}%
            </span>
            vs yesterday
          </div>
        </div>

        {/* Live Content */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-semibold">Live Content</div>
                <div className="text-xs text-neutral-500 mt-0.5">Currently broadcasting</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('live-content')}
              className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Open <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {liveContent.slice(0, 3).map(content => (
              <div key={content.id} className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/60">
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{content.creatorName}</div>
                  <div className="text-xs text-neutral-500">{formatNumber(content.viewerCount)} viewers</div>
                </div>
                <HealthIndicator score={content.healthScore} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="New Users Today" value={formatNumber(metrics.newUsersToday)} icon={Users} />
        <StatCard label="Content Created" value={metrics.contentCreatedToday} icon={Zap} />
        <StatCard label="Mod Actions Today" value={metrics.moderationActionsToday} icon={Shield} />
        <StatCard label="Trust Score Avg" value={metrics.trustScoreAvg} icon={TrendingUp} sub="Platform-wide" />
      </div>

      {/* Top Categories & Reasons */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="text-white font-semibold mb-4">Top Categories (Live)</div>
          <div className="space-y-3">
            {analytics.topCategories.slice(0, 5).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-400">
                    {i + 1}
                  </div>
                  <div className="text-sm text-white">{cat.name}</div>
                </div>
                <Badge>{cat.count} live</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="text-white font-semibold mb-4">Top Moderation Reasons (24h)</div>
          <div className="space-y-3">
            {analytics.topReasons.slice(0, 5).map((reason, i) => (
              <div key={reason.reason} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-400">
                    {i + 1}
                  </div>
                  <div className="text-sm text-white capitalize">{reason.reason.replace('_', ' ')}</div>
                </div>
                <Badge variant={i === 0 ? 'warning' : 'default'}>{reason.count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
