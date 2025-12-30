'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Check,
  ChevronUp,
  ExternalLink,
  Flag,
  MessageSquare,
  User,
  X,
} from 'lucide-react';
import { Drawer, Badge, EmptyState, ActionButton, formatRelative, reasonLabels } from './shared';
import type { UserReport, ReportStatus, TeamMember } from '@/types/platformOps';

interface ReportsSectionProps {
  reports: UserReport[];
  team: TeamMember[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAssign: (id: string, assigneeId: string) => void;
  onResolve: (id: string, action: string, note: string) => void;
  onDismiss: (id: string, note: string) => void;
  onEscalate: (id: string, note: string) => void;
  onToast: (t: { level: 'success' | 'info' | 'warning' | 'error'; title: string; message?: string }) => void;
}

export function ReportsSection({
  reports,
  team,
  selectedId,
  onSelect,
  onAssign,
  onResolve,
  onDismiss,
  onEscalate,
  onToast,
}: ReportsSectionProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('new');
  const [typeFilter, setTypeFilter] = useState<'all' | 'content' | 'user' | 'chat'>('all');
  const [actionNote, setActionNote] = useState('');
  const [actionType, setActionType] = useState('Warning issued');

  const filtered = reports
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .filter(r => typeFilter === 'all' || r.type === typeFilter)
    .sort((a, b) => b.createdAt - a.createdAt);

  const selected = selectedId ? reports.find(r => r.id === selectedId) : null;
  const moderators = team.filter(t => ['moderator', 'senior_mod', 'admin', 'owner'].includes(t.role));

  const statusConfig: Record<ReportStatus, { label: string; variant: 'default' | 'warning' | 'info' | 'success' | 'danger' }> = {
    new: { label: 'New', variant: 'warning' },
    in_review: { label: 'In Review', variant: 'info' },
    action_taken: { label: 'Action Taken', variant: 'success' },
    no_action: { label: 'Dismissed', variant: 'default' },
    duplicate: { label: 'Duplicate', variant: 'default' },
  };

  return (
    <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      {/* List */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="text-white font-semibold flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-400" />
              User Reports
              <Badge variant="warning">{reports.filter(r => r.status === 'new').length} new</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_review">In Review</option>
              <option value="action_taken">Action Taken</option>
              <option value="no_action">Dismissed</option>
            </select>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
              className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
            >
              <option value="all">All Types</option>
              <option value="content">Content</option>
              <option value="user">User</option>
              <option value="chat">Chat</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No reports" description="No reports match the current filters." icon={Flag} />
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {filtered.map(report => {
                const isSelected = selectedId === report.id;
                const status = statusConfig[report.status];

                return (
                  <button
                    key={report.id}
                    onClick={() => onSelect(report.id)}
                    className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${isSelected ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{reasonLabels[report.reason]}</span>
                          <Badge>{report.type}</Badge>
                        </div>
                        <div className="text-sm text-neutral-400 mt-1 line-clamp-2">
                          {report.description}
                        </div>
                        <div className="text-xs text-neutral-500 mt-2">
                          Reported by {report.reporterName} • {formatRelative(report.createdAt)}
                          {report.targetOwnerName && ` • Against ${report.targetOwnerName}`}
                        </div>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
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
            title={reasonLabels[selected.reason]}
            subtitle={`${selected.type} report • ${formatRelative(selected.createdAt)}`}
            onClose={() => onSelect(null)}
            width={500}
          >
            <div className="p-5 space-y-5">
              {/* Status */}
              <div className={`p-4 rounded-2xl ${
                selected.status === 'new' ? 'bg-amber-500/10 border border-amber-500/20' :
                selected.status === 'action_taken' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                'bg-neutral-900/60 border border-neutral-800'
              }`}>
                <div className="flex items-center justify-between">
                  <Badge variant={statusConfig[selected.status].variant}>
                    {statusConfig[selected.status].label}
                  </Badge>
                  {selected.assignedTo && (
                    <span className="text-xs text-neutral-400">
                      Assigned to {team.find(t => t.id === selected.assignedTo)?.name ?? 'Unknown'}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Report Details</div>
                <div className="text-white">{selected.description}</div>
                {selected.evidence && selected.evidence.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-neutral-500 mb-2">Evidence ({selected.evidence.length} files)</div>
                    <div className="flex flex-wrap gap-2">
                      {selected.evidence.map((e, i) => (
                        <Badge key={i}>{e}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reporter */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Reporter</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{selected.reporterName}</div>
                      <div className="text-xs text-neutral-500">{selected.reporterId}</div>
                    </div>
                  </div>
                  <ActionButton size="sm" icon={ExternalLink}>View</ActionButton>
                </div>
              </div>

              {/* Target */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">
                  Reported {selected.targetType}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                      {selected.targetType === 'user' ? (
                        <User className="w-5 h-5 text-neutral-400" />
                      ) : selected.targetType === 'message' ? (
                        <MessageSquare className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{selected.targetOwnerName ?? 'Unknown'}</div>
                      <div className="text-xs text-neutral-500">{selected.targetId}</div>
                    </div>
                  </div>
                  <ActionButton size="sm" icon={ExternalLink}>View</ActionButton>
                </div>
              </div>

              {/* Assignment */}
              {(selected.status === 'new' || selected.status === 'in_review') && (
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Assign To</div>
                  <select
                    value={selected.assignedTo ?? ''}
                    onChange={e => {
                      if (e.target.value) {
                        onAssign(selected.id, e.target.value);
                        onToast({ level: 'info', title: 'Report assigned' });
                      }
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
                  >
                    <option value="">Unassigned</option>
                    {moderators.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Resolution */}
              {selected.resolution && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                  <div className="text-xs font-semibold tracking-wider text-emerald-300/50 uppercase mb-3">Resolution</div>
                  <div className="text-emerald-300 font-medium">{selected.resolution.action}</div>
                  <div className="text-sm text-emerald-300/70 mt-1">{selected.resolution.note}</div>
                  <div className="text-xs text-emerald-300/50 mt-2">
                    By {selected.resolution.by} • {formatRelative(selected.resolution.at)}
                  </div>
                </div>
              )}

              {/* Actions */}
              {(selected.status === 'new' || selected.status === 'in_review') && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold tracking-wider text-white/30 uppercase">Take Action</div>
                  
                  <select
                    value={actionType}
                    onChange={e => setActionType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
                  >
                    <option value="Warning issued">Warning Issued</option>
                    <option value="Content removed">Content Removed</option>
                    <option value="User suspended">User Suspended</option>
                    <option value="User banned">User Banned</option>
                    <option value="DMCA processed">DMCA Processed</option>
                    <option value="Other">Other</option>
                  </select>

                  <textarea
                    value={actionNote}
                    onChange={e => setActionNote(e.target.value)}
                    placeholder="Add resolution notes..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <ActionButton
                      variant="primary"
                      icon={Check}
                      disabled={!actionNote.trim()}
                      onClick={() => {
                        onResolve(selected.id, actionType, actionNote);
                        setActionNote('');
                        onToast({ level: 'success', title: 'Report resolved', message: actionType });
                      }}
                    >
                      Resolve
                    </ActionButton>
                    <ActionButton
                      icon={X}
                      disabled={!actionNote.trim()}
                      onClick={() => {
                        onDismiss(selected.id, actionNote);
                        setActionNote('');
                        onToast({ level: 'info', title: 'Report dismissed' });
                      }}
                    >
                      Dismiss
                    </ActionButton>
                    <ActionButton
                      icon={ChevronUp}
                      onClick={() => {
                        onEscalate(selected.id, 'Escalated for senior review');
                        onToast({ level: 'info', title: 'Report escalated' });
                      }}
                    >
                      Escalate
                    </ActionButton>
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
