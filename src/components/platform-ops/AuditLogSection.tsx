'use client';

import { useState, useMemo } from 'react';
import {
  Activity,
  Download,
  Filter,
  Search,
} from 'lucide-react';
import { Badge, EmptyState, formatRelative } from './shared';
import type { AuditEntry, AuditAction } from '@/types/platformOps';

interface AuditLogSectionProps {
  entries: AuditEntry[];
}

const actionLabels: Record<AuditAction, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  content_removed: { label: 'Content Removed', variant: 'danger' },
  content_approved: { label: 'Content Approved', variant: 'success' },
  content_featured: { label: 'Content Featured', variant: 'info' },
  user_warned: { label: 'User Warned', variant: 'warning' },
  user_timed_out: { label: 'User Timed Out', variant: 'warning' },
  user_suspended: { label: 'User Suspended', variant: 'danger' },
  user_banned: { label: 'User Banned', variant: 'danger' },
  user_unbanned: { label: 'User Unbanned', variant: 'success' },
  report_resolved: { label: 'Report Resolved', variant: 'success' },
  report_escalated: { label: 'Report Escalated', variant: 'warning' },
  team_member_added: { label: 'Team Added', variant: 'info' },
  team_member_removed: { label: 'Team Removed', variant: 'warning' },
  team_role_changed: { label: 'Role Changed', variant: 'info' },
  setting_changed: { label: 'Setting Changed', variant: 'default' },
  payout_processed: { label: 'Payout Processed', variant: 'success' },
  appeal_reviewed: { label: 'Appeal Reviewed', variant: 'info' },
};

export function AuditLogSection({ entries }: AuditLogSectionProps) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | AuditAction>('all');
  const [actorFilter, setActorFilter] = useState<string>('all');

  const actors = useMemo(() => {
    const unique = new Set(entries.map(e => e.actor.name));
    return Array.from(unique).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    return entries
      .filter(e => actionFilter === 'all' || e.action === actionFilter)
      .filter(e => actorFilter === 'all' || e.actor.name === actorFilter)
      .filter(e => {
        if (!search) return true;
        const q = search.toLowerCase();
        return e.summary.toLowerCase().includes(q) ||
               e.actor.name.toLowerCase().includes(q) ||
               (e.targetName?.toLowerCase().includes(q) ?? false);
      });
  }, [entries, actionFilter, actorFilter, search]);

  const handleExport = () => {
    const payload = JSON.stringify(
      { exportedAt: new Date().toISOString(), entries: filtered },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col border border-neutral-800 rounded-2xl bg-neutral-900/20 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-800">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="text-white font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-400" />
            Audit Log
            <Badge>{filtered.length} entries</Badge>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search audit log..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
            />
          </div>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value as typeof actionFilter)}
            className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
          >
            <option value="all">All Actions</option>
            {Object.entries(actionLabels).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <select
            value={actorFilter}
            onChange={e => setActorFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
          >
            <option value="all">All Actors</option>
            {actors.map(actor => (
              <option key={actor} value={actor}>{actor}</option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              title="No entries found" 
              description="No audit log entries match the current filters." 
              icon={Activity} 
            />
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {filtered.map(entry => {
              const action = actionLabels[entry.action];

              return (
                <div key={entry.id} className="px-5 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={action.variant}>{action.label}</Badge>
                        <span className="text-white">{entry.summary}</span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-2 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          By <span className="text-neutral-300">{entry.actor.name}</span>
                          <span className="text-neutral-600">({entry.actor.role})</span>
                        </span>
                        {entry.targetName && (
                          <span>
                            Target: <span className="text-neutral-300">{entry.targetName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-neutral-400">{formatRelative(entry.at)}</div>
                      <div className="text-xs text-neutral-600 mt-1">
                        {new Date(entry.at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {entry.details && Object.keys(entry.details).length > 0 && (
                    <div className="mt-3 p-2 rounded-lg bg-neutral-950 text-xs font-mono text-neutral-500">
                      {JSON.stringify(entry.details)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
