'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Ban,
  Check,
  ChevronUp,
  Clock,
  ExternalLink,
  Shield,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { Drawer, Badge, EmptyState, ActionButton, formatRelative, severityConfig, reasonLabels } from './shared';
import type { ModerationQueueItem, ModerationStatus, ModerationSeverity, TeamMember } from '@/types/platformOps';

interface ModerationQueueProps {
  items: ModerationQueueItem[];
  team: TeamMember[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onApprove: (id: string, note?: string) => void;
  onRemove: (id: string, note?: string) => void;
  onEscalate: (id: string, note?: string) => void;
  onAssign: (id: string, assigneeId: string) => void;
  onAddNote: (id: string, note: string) => void;
  onToast: (t: { level: 'success' | 'info' | 'warning' | 'error'; title: string; message?: string }) => void;
}

export function ModerationQueue({
  items,
  team,
  selectedId,
  onSelect,
  onApprove,
  onRemove,
  onEscalate,
  onAssign,
  onAddNote,
  onToast,
}: ModerationQueueProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | ModerationStatus>('pending');
  const [severityFilter, setSeverityFilter] = useState<'all' | ModerationSeverity>('all');
  const [noteInput, setNoteInput] = useState('');

  const filtered = items
    .filter(i => statusFilter === 'all' || i.status === statusFilter)
    .filter(i => severityFilter === 'all' || i.severity === severityFilter)
    .sort((a, b) => {
      // Critical first, then by date
      const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (sevOrder[a.severity] !== sevOrder[b.severity]) {
        return sevOrder[a.severity] - sevOrder[b.severity];
      }
      return b.createdAt - a.createdAt;
    });

  const selected = selectedId ? items.find(i => i.id === selectedId) : null;
  const moderators = team.filter(t => ['moderator', 'senior_mod', 'admin', 'owner'].includes(t.role));

  const pendingCount = items.filter(i => i.status === 'pending').length;
  const criticalCount = items.filter(i => i.severity === 'critical' && i.status === 'pending').length;

  return (
    <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
      {/* List */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-white font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" />
                Moderation Queue
                {pendingCount > 0 && (
                  <Badge variant="warning">{pendingCount} pending</Badge>
                )}
              </div>
              {criticalCount > 0 && (
                <div className="text-xs text-rose-400 mt-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {criticalCount} critical items need attention
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
                className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="escalated">Escalated</option>
                <option value="approved">Approved</option>
                <option value="removed">Removed</option>
              </select>
              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value as typeof severityFilter)}
                className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState 
                title="Queue is clear" 
                description="No items match the current filters." 
                icon={Shield} 
              />
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {filtered.map(item => {
                const isSelected = selectedId === item.id;
                const sev = severityConfig[item.severity];
                const isResolved = item.status === 'approved' || item.status === 'removed';

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${isSelected ? 'bg-white/5' : ''} ${isResolved ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">{item.contentTitle}</span>
                          {item.aiConfidence && (
                            <Badge variant="info">AI {item.aiConfidence}%</Badge>
                          )}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {item.creatorName} • {reasonLabels[item.reason]} • {formatRelative(item.createdAt)}
                        </div>
                        {item.reportCount > 0 && (
                          <div className="text-xs text-amber-400 mt-1">
                            {item.reportCount} user reports
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={`${sev.bg} ${sev.text}`}>
                          <span className={`w-2 h-2 rounded-full ${sev.dot}`} />
                          {sev.label}
                        </Badge>
                        <Badge variant={
                          item.status === 'pending' ? 'warning' :
                          item.status === 'escalated' ? 'danger' :
                          item.status === 'approved' ? 'success' :
                          item.status === 'removed' ? 'danger' : 'default'
                        }>
                          {item.status}
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
            title={selected.contentTitle}
            subtitle={`${selected.source.replace('_', ' ')} • ${reasonLabels[selected.reason]}`}
            onClose={() => onSelect(null)}
            width={500}
          >
            <div className="p-5 space-y-5">
              {/* Severity Banner */}
              {selected.severity === 'critical' && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 text-rose-300 font-semibold">
                    <AlertTriangle className="w-5 h-5" />
                    Critical Severity
                  </div>
                  <div className="text-xs text-rose-300/70 mt-1">
                    This item requires immediate attention. Consider removing content and reviewing user account.
                  </div>
                </div>
              )}

              {/* Content Preview */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Content</div>
                <div className="text-white">{selected.contentTitle}</div>
                {selected.contentPreview && (
                  <div className="mt-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-400 font-mono">
                    {selected.contentPreview}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                  <span>Type: {selected.contentType}</span>
                  <span>ID: {selected.contentId}</span>
                </div>
              </div>

              {/* Detection Info */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Detection</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-neutral-950">
                    <div className="text-xs text-neutral-500">Source</div>
                    <div className="text-white mt-1 capitalize">{selected.source.replace('_', ' ')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-950">
                    <div className="text-xs text-neutral-500">Reason</div>
                    <div className="text-white mt-1">{reasonLabels[selected.reason]}</div>
                  </div>
                  {selected.aiConfidence && (
                    <div className="p-3 rounded-xl bg-neutral-950">
                      <div className="text-xs text-neutral-500">AI Confidence</div>
                      <div className="text-white mt-1">{selected.aiConfidence}%</div>
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-neutral-950">
                    <div className="text-xs text-neutral-500">User Reports</div>
                    <div className="text-white mt-1">{selected.reportCount}</div>
                  </div>
                </div>
              </div>

              {/* Creator */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{selected.creatorName}</div>
                      <div className="text-xs text-neutral-500">{selected.creatorId}</div>
                    </div>
                  </div>
                  <ActionButton size="sm" icon={ExternalLink}>
                    Profile
                  </ActionButton>
                </div>
              </div>

              {/* Assignment */}
              {selected.status === 'pending' && (
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                  <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Assign To</div>
                  <select
                    value={selected.assignedTo ?? ''}
                    onChange={e => {
                      if (e.target.value) {
                        onAssign(selected.id, e.target.value);
                        onToast({ level: 'info', title: 'Assigned', message: 'Item assigned for review' });
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

              {/* Notes */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-semibold tracking-wider text-white/30 uppercase mb-3">Notes</div>
                {selected.notes.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {selected.notes.map((note, i) => (
                      <div key={i} className="text-sm text-neutral-300 p-2 rounded-lg bg-neutral-950">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500 mb-3">No notes yet</div>
                )}
                <div className="flex gap-2">
                  <input
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
                  />
                  <ActionButton
                    size="sm"
                    disabled={!noteInput.trim()}
                    onClick={() => {
                      if (noteInput.trim()) {
                        onAddNote(selected.id, noteInput.trim());
                        setNoteInput('');
                      }
                    }}
                  >
                    Add
                  </ActionButton>
                </div>
              </div>

              {/* Actions */}
              {(selected.status === 'pending' || selected.status === 'reviewing') && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold tracking-wider text-white/30 uppercase">Actions</div>
                  <div className="grid grid-cols-2 gap-2">
                    <ActionButton
                      variant="primary"
                      icon={Check}
                      onClick={() => {
                        onApprove(selected.id);
                        onToast({ level: 'success', title: 'Approved', message: 'Content marked as safe' });
                      }}
                    >
                      Approve
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      icon={Trash2}
                      onClick={() => {
                        onRemove(selected.id);
                        onToast({ level: 'warning', title: 'Removed', message: 'Content removed' });
                      }}
                    >
                      Remove
                    </ActionButton>
                    <ActionButton
                      icon={ChevronUp}
                      onClick={() => {
                        onEscalate(selected.id);
                        onToast({ level: 'info', title: 'Escalated', message: 'Sent to senior moderator' });
                      }}
                    >
                      Escalate
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      icon={Ban}
                    >
                      Ban Creator
                    </ActionButton>
                  </div>
                </div>
              )}

              {/* Already Resolved */}
              {(selected.status === 'approved' || selected.status === 'removed') && (
                <div className={`p-4 rounded-2xl ${selected.status === 'approved' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                  <div className={`font-semibold ${selected.status === 'approved' ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {selected.status === 'approved' ? 'Approved' : 'Removed'}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    This item has already been reviewed.
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
