'use client';

import React, { useState } from 'react';
import {
  Check,
  Clock,
  Crown,
  Mail,
  Shield,
  Target,
  Trash2,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { Badge, EmptyState, ActionButton, StatCard, formatRelative } from './shared';
import type { TeamMember, TeamRole } from '@/types/platformOps';

interface TeamSectionProps {
  team: TeamMember[];
  onInvite: (email: string, role: TeamRole) => void;
  onUpdateRole: (id: string, role: TeamRole) => void;
  onRemove: (id: string) => void;
  onToast: (t: { level: 'success' | 'info' | 'warning' | 'error'; title: string; message?: string }) => void;
}

export function TeamSection({
  team,
  onInvite,
  onUpdateRole,
  onRemove,
  onToast,
}: TeamSectionProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('moderator');

  const roleConfig: Record<TeamRole, { label: string; color: string; icon: React.ElementType }> = {
    owner: { label: 'Owner', color: 'text-amber-400', icon: Crown },
    admin: { label: 'Admin', color: 'text-violet-400', icon: Shield },
    senior_mod: { label: 'Senior Mod', color: 'text-sky-400', icon: Shield },
    moderator: { label: 'Moderator', color: 'text-emerald-400', icon: Shield },
    support: { label: 'Support', color: 'text-pink-400', icon: User },
    analyst: { label: 'Analyst', color: 'text-orange-400', icon: Target },
  };

  const activeTeam = team.filter(m => m.status === 'active');
  const invitedTeam = team.filter(m => m.status === 'invited');

  const totalActionsToday = activeTeam.reduce((a, m) => a + m.actionsToday, 0);
  const avgResponseTime = activeTeam.length > 0
    ? Math.round(activeTeam.reduce((a, m) => a + m.avgResponseTime, 0) / activeTeam.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Team Members" value={activeTeam.length} icon={Users} />
        <StatCard label="Pending Invites" value={invitedTeam.length} icon={Mail} />
        <StatCard label="Actions Today" value={totalActionsToday} icon={Check} />
        <StatCard label="Avg Response Time" value={`${avgResponseTime}m`} icon={Clock} />
      </div>

      {/* Invite */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
        <div className="text-white font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-emerald-400" />
          Invite Team Member
        </div>
        <div className="flex gap-3">
          <input
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            type="email"
            placeholder="email@example.com"
            className="flex-1 h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600"
          />
          <select
            value={inviteRole}
            onChange={e => setInviteRole(e.target.value as TeamRole)}
            className="h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
          >
            <option value="moderator">Moderator</option>
            <option value="senior_mod">Senior Mod</option>
            <option value="support">Support</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <ActionButton
            variant="primary"
            icon={UserPlus}
            disabled={!inviteEmail.includes('@')}
            onClick={() => {
              onInvite(inviteEmail, inviteRole);
              setInviteEmail('');
              onToast({ level: 'success', title: 'Invite sent', message: `Invited ${inviteEmail} as ${inviteRole}` });
            }}
          >
            Invite
          </ActionButton>
        </div>
      </div>

      {/* Active Team */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl">
        <div className="px-5 py-4 border-b border-neutral-800">
          <div className="text-white font-semibold">Active Team ({activeTeam.length})</div>
        </div>
        <div className="divide-y divide-neutral-800">
          {activeTeam.map(member => {
            const role = roleConfig[member.role];
            const Icon = role.icon;

            return (
              <div key={member.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-6 h-6 ${role.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{member.name}</span>
                      <Badge className={`${role.color} bg-current/10 border border-current/20`}>
                        {role.label}
                      </Badge>
                    </div>
                    <div className="text-xs text-neutral-500 truncate">{member.email}</div>
                    <div className="text-xs text-neutral-600 mt-1">
                      Last active {formatRelative(member.lastActiveAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-white font-medium">{member.actionsToday}</div>
                      <div className="text-xs text-neutral-500">Today</div>
                    </div>
                    <div>
                      <div className="text-white font-medium">{member.actionsThisWeek}</div>
                      <div className="text-xs text-neutral-500">Week</div>
                    </div>
                    <div>
                      <div className="text-white font-medium">{member.avgResponseTime}m</div>
                      <div className="text-xs text-neutral-500">Avg</div>
                    </div>
                  </div>

                  {/* Actions */}
                  {member.role !== 'owner' && (
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        onChange={e => {
                          onUpdateRole(member.id, e.target.value as TeamRole);
                          onToast({ level: 'info', title: 'Role updated' });
                        }}
                        className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
                      >
                        <option value="moderator">Moderator</option>
                        <option value="senior_mod">Senior Mod</option>
                        <option value="support">Support</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                      <ActionButton
                        size="sm"
                        variant="danger"
                        icon={Trash2}
                        onClick={() => {
                          onRemove(member.id);
                          onToast({ level: 'warning', title: 'Team member removed' });
                        }}
                      >
                        Remove
                      </ActionButton>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Invites */}
      {invitedTeam.length > 0 && (
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl">
          <div className="px-5 py-4 border-b border-neutral-800">
            <div className="text-white font-semibold">Pending Invites ({invitedTeam.length})</div>
          </div>
          <div className="divide-y divide-neutral-800">
            {invitedTeam.map(member => {
              const role = roleConfig[member.role];

              return (
                <div key={member.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800/50 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-neutral-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{member.email}</span>
                        <Badge variant="warning">Invited</Badge>
                        <Badge className={`${role.color} bg-current/10 border border-current/20`}>
                          {role.label}
                        </Badge>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Invited {formatRelative(member.joinedAt)}
                      </div>
                    </div>
                  </div>
                  <ActionButton
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => {
                      onRemove(member.id);
                      onToast({ level: 'info', title: 'Invite cancelled' });
                    }}
                  >
                    Cancel
                  </ActionButton>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Permissions Reference */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
        <div className="text-white font-semibold mb-4">Role Permissions</div>
        <div className="grid grid-cols-6 gap-2 text-xs">
          {/* Header */}
          <div className="text-neutral-500 font-medium">Permission</div>
          {Object.entries(roleConfig).map(([key, config]) => (
            <div key={key} className={`${config.color} font-medium text-center`}>{config.label}</div>
          ))}
          
          {/* Rows */}
          {[
            { perm: 'View Content', roles: ['owner', 'admin', 'senior_mod', 'moderator', 'support', 'analyst'] },
            { perm: 'Moderate', roles: ['owner', 'admin', 'senior_mod', 'moderator'] },
            { perm: 'Remove Content', roles: ['owner', 'admin', 'senior_mod'] },
            { perm: 'Warn Users', roles: ['owner', 'admin', 'senior_mod', 'moderator', 'support'] },
            { perm: 'Timeout Users', roles: ['owner', 'admin', 'senior_mod', 'moderator'] },
            { perm: 'Ban Users', roles: ['owner', 'admin', 'senior_mod'] },
            { perm: 'Manage Team', roles: ['owner', 'admin'] },
            { perm: 'View Analytics', roles: ['owner', 'admin', 'senior_mod', 'analyst'] },
            { perm: 'Settings', roles: ['owner', 'admin'] },
          ].map(row => (
            <React.Fragment key={row.perm}>
              <div className="text-neutral-400 py-1">{row.perm}</div>
              {Object.keys(roleConfig).map(role => (
                <div key={`${row.perm}-${role}`} className="text-center py-1">
                  {row.roles.includes(role) ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <span className="text-neutral-700">—</span>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
