'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  Ban,
  Check,
  ChevronRight,
  CreditCard,
  Download,
  Filter,
  MessageSquare,
  RotateCcw,
  Search,
  Settings,
  ShieldAlert,
  Sliders,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import { useAdminStore } from '@/store/useAdminStore';
import type {
  AdminSection,
  AdminSetupState,
  AdminUser,
  FeatureFlag,
  ModerationItem,
  ModerationSeverity,
  SupportTicket,
  Subscription,
  TicketStatus,
} from '@/types/admin';

type Toast = {
  id: string;
  level: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
};

const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / (60 * 1000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const severityConfig: Record<
  ModerationSeverity,
  { label: string; className: string; dot: string }
> = {
  low: { label: 'Low', className: 'bg-neutral-800 text-neutral-300', dot: 'bg-neutral-400' },
  medium: { label: 'Medium', className: 'bg-amber-500/15 text-amber-300', dot: 'bg-amber-400' },
  high: { label: 'High', className: 'bg-orange-500/15 text-orange-300', dot: 'bg-orange-400' },
  critical: { label: 'Critical', className: 'bg-rose-500/15 text-rose-300', dot: 'bg-rose-400' },
};

const sectionTabs: Array<{ id: AdminSection; label: string; icon: React.ElementType }> = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'moderation', label: 'Review', icon: ShieldAlert },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'support', label: 'Support', icon: MessageSquare },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'flags', label: 'Flags', icon: Sliders },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'audit', label: 'Audit', icon: UserCog },
];

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-2xl font-semibold text-white mt-2">{value}</div>
      {sub && <div className="text-xs text-neutral-500 mt-1">{sub}</div>}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-neutral-800/70 bg-neutral-900/20 rounded-2xl p-10 text-center">
      <div className="text-white font-semibold">{title}</div>
      <div className="text-sm text-neutral-500 mt-2">{description}</div>
    </div>
  );
}

function Drawer({
  title,
  subtitle,
  onClose,
  children,
}: {
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
      className="w-[420px] border-l border-neutral-800 bg-neutral-950 flex flex-col"
    >
      <div className="px-5 py-4 border-b border-neutral-800 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-white font-semibold truncate">{title}</div>
          {subtitle && <div className="text-xs text-neutral-500 mt-0.5 truncate">{subtitle}</div>}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </motion.aside>
  );
}

function SetupWizard({ onToast }: { onToast: (t: Omit<Toast, 'id'>) => void }) {
  const {
    setup,
    flags,
    integrations,
    moderationThreshold,
    toggleRole,
    toggleSurface,
    toggleIntegration,
    inviteTeamMember,
    setModerationThreshold,
    completeSetup,
  } = useAdminStore();

  const [inviteEmail, setInviteEmail] = useState('');

  const tasks = useMemo(() => {
    const hasInvite = setup.team.invitedEmails.length > 0;
    const billingReady = setup.integrations.Stripe;
    const supportReady = setup.integrations.Slack;
    const moderationReady = moderationThreshold > 0;
    const flagsReady = flags.some((f) => f.enabled);
    return [
      { label: 'Invite your team', done: hasInvite },
      { label: 'Connect billing (Stripe)', done: billingReady },
      { label: 'Connect support (Slack)', done: supportReady },
      { label: 'Set moderation threshold', done: moderationReady },
      { label: 'Enable at least one feature flag', done: flagsReady },
    ];
  }, [setup.team.invitedEmails.length, setup.integrations, moderationThreshold, flags]);

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#0a0a0a] to-black">
      <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Set up Cal AI Admin</h1>
            <p className="text-neutral-400 mt-1 max-w-2xl">
              This is a hardcoded, high-fidelity prototype. Configure your workflow once, then use the dashboard
              to simulate real ops: meal/photo review, support tickets, billing actions, and experiments.
            </p>
          </div>
          <Pill className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <BadgeCheck className="w-4 h-4" />
            Demo Mode
          </Pill>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Setup progress" value={`${doneCount}/${tasks.length}`} sub="Complete these to unlock the dashboard" />
          <StatCard label="Integrations connected" value={`${integrations.filter((i) => i.connected).length}/5`} />
          <StatCard label="Moderation threshold" value={`${moderationThreshold}`} sub="Auto-remove suggestion (AI safety score)" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5 space-y-3">
            <div className="text-xs font-semibold tracking-wider text-white/30 uppercase px-1">Checklist</div>
            <div className="space-y-2">
              {tasks.map((t) => (
                <div
                  key={t.label}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border ${
                    t.done ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-neutral-800 bg-neutral-900/40'
                  }`}
                >
                  <div className="text-sm text-white">{t.label}</div>
                  {t.done ? (
                    <Pill className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <Check className="w-4 h-4" />
                      Done
                    </Pill>
                  ) : (
                    <Pill className="bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      <Filter className="w-4 h-4" />
                      Pending
                    </Pill>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-7 space-y-6">
            {/* Team */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-white font-semibold">Team & Roles</div>
                  <div className="text-sm text-neutral-500 mt-1">Simulate who can take actions in the dashboard.</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {(['owner', 'support', 'moderator'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-2 rounded-xl border text-sm transition-colors ${
                      setup.team.roles.includes(role)
                        ? 'border-rose-500/30 bg-rose-500/10 text-white'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Invite email (e.g., mod@calai.app)"
                  className="flex-1 h-10 px-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
                />
                <button
                  onClick={() => {
                    const cleaned = inviteEmail.trim().toLowerCase();
                    if (!cleaned) return;
                    if (setup.team.invitedEmails.includes(cleaned)) {
                      onToast({ level: 'info', title: 'Already invited', message: 'That email is already on the invited list.' });
                      return;
                    }
                    inviteTeamMember(cleaned);
                    setInviteEmail('');
                    onToast({ level: 'success', title: 'Invite queued', message: 'Added to invited list (demo).' });
                  }}
                  disabled={!inviteEmail.trim()}
                  className="h-10 px-4 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors"
                >
                  Invite
                </button>
              </div>

              {setup.team.invitedEmails.length > 0 && (
                <div className="mt-3 text-xs text-neutral-500">
                  Invited: {setup.team.invitedEmails.join(', ')}
                </div>
              )}
            </div>

            {/* Surfaces */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="text-white font-semibold">Cal AI surfaces</div>
              <div className="text-sm text-neutral-500 mt-1">Enable the product areas you operate.</div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {(Object.keys(setup.surfaces) as Array<keyof AdminSetupState['surfaces']>).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleSurface(key)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-colors ${
                      setup.surfaces[key]
                        ? 'border-emerald-500/25 bg-emerald-500/5'
                        : 'border-neutral-800 bg-neutral-950 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-sm text-white">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className={`w-10 h-6 rounded-full ${setup.surfaces[key] ? 'bg-emerald-500' : 'bg-neutral-800'}`}>
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-sm m-0.5"
                        animate={{ x: setup.surfaces[key] ? 16 : 0 }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Safety */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="text-white font-semibold">Safety & moderation</div>
              <div className="text-sm text-neutral-500 mt-1">Tune how Cal AI handles meal/photo uploads.</div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-white">
                  <span>Auto-remove suggestion threshold</span>
                  <span className="text-neutral-400">{moderationThreshold}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={moderationThreshold}
                  onChange={(e) => setModerationThreshold(parseInt(e.target.value, 10))}
                  className="w-full mt-3"
                />
                <div className="text-xs text-neutral-500 mt-2">
                  If AI safety score is below this, the UI will strongly recommend removal during review.
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="text-white font-semibold">Integrations (mock)</div>
              <div className="text-sm text-neutral-500 mt-1">Simulate operational tooling without a backend.</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {integrations.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => toggleIntegration(i.name)}
                    className={`p-4 rounded-2xl border text-left transition-colors ${
                      i.connected ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-neutral-800 bg-neutral-950 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-white font-medium">{i.name}</div>
                      <Pill className={i.connected ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-300'}>
                        {i.connected ? 'Connected' : 'Not connected'}
                      </Pill>
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">{i.detail}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  completeSetup();
                  onToast({ level: 'success', title: 'Setup complete', message: 'Admin dashboard unlocked.' });
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
              >
                Complete setup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOverview({
  users,
  moderationQueue,
  tickets,
  subscriptions,
  flags,
  auditLog,
  onNavigate,
}: {
  users: AdminUser[];
  moderationQueue: ModerationItem[];
  tickets: SupportTicket[];
  subscriptions: Subscription[];
  flags: FeatureFlag[];
  auditLog: { id: string; at: number; summary: string; actor: string }[];
  onNavigate: (section: AdminSection) => void;
}) {
  const pendingModeration = moderationQueue.filter((m) => m.status === 'pending').length;
  const escalated = moderationQueue.filter((m) => m.status === 'escalated').length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;

  const dau = users.filter((u) => Date.now() - u.lastActiveAt < 24 * 60 * 60 * 1000).length;
  const scansLast24h = users.reduce((acc, u) => (Date.now() - u.lastScanAt < 24 * 60 * 60 * 1000 ? acc + 1 : acc), 0);

  const mrrCents = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (s.interval === 'monthly' ? s.amountCents : Math.round(s.amountCents / 12)), 0);

  const connectedFlags = flags.filter((f) => f.enabled).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="DAU (demo)" value={dau} sub="Users active in last 24h" />
        <StatCard label="Meal scans (24h)" value={scansLast24h} sub="Proxy metric for usage" />
        <StatCard label="MRR (run-rate)" value={formatMoney(mrrCents)} sub="Active subs (yearly normalized)" />
        <StatCard label="Flags enabled" value={`${connectedFlags}/${flags.length}`} sub="Experiment surface" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Moderation queue</div>
              <div className="text-xs text-neutral-500 mt-1">Meal photos & scans needing review</div>
            </div>
            <button
              onClick={() => onNavigate('moderation')}
              className="text-sm text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
            >
              Open <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            <StatCard label="Pending" value={pendingModeration} />
            <StatCard label="Escalated" value={escalated} />
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Support</div>
              <div className="text-xs text-neutral-500 mt-1">Billing + accuracy tickets</div>
            </div>
            <button
              onClick={() => onNavigate('support')}
              className="text-sm text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
            >
              Open <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <StatCard label="Open tickets" value={openTickets} sub="SLA tracked (demo)" />
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Billing</div>
              <div className="text-xs text-neutral-500 mt-1">Subscriptions & refunds</div>
            </div>
            <button
              onClick={() => onNavigate('billing')}
              className="text-sm text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
            >
              Open <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <StatCard
              label="Active subs"
              value={subscriptions.filter((s) => s.status === 'active').length}
              sub={`${subscriptions.filter((s) => s.status === 'past_due').length} past due`}
            />
          </div>
        </div>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl">
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">Recent activity</div>
            <div className="text-xs text-neutral-500 mt-0.5">Everything you do in this prototype is logged.</div>
          </div>
          <button
            onClick={() => onNavigate('audit')}
            className="text-sm text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {auditLog.slice(0, 5).map((e) => (
            <div key={e.id} className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-white">{e.summary}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  {e.actor} • {formatRelative(e.at)}
                </div>
              </div>
              <div className="text-xs text-neutral-600">{new Date(e.at).toLocaleTimeString()}</div>
            </div>
          ))}
          {auditLog.length === 0 && <div className="text-sm text-neutral-500">No activity yet.</div>}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { setActiveView } = useWebPresenceStore();
  const {
    setup,
    activeSection,
    setActiveSection,
    users,
    subscriptions,
    moderationQueue,
    tickets,
    flags,
    integrations,
    auditLog,
    moderationThreshold,
    selectedModerationId,
    selectedUserId,
    selectedTicketId,
    selectModeration,
    selectUser,
    selectTicket,
    approveModeration,
    removeModeration,
    escalateModeration,
    grantPro,
    disableUser,
    banUser,
    addUserNote,
    replyToTicket,
    setTicketStatus,
    cancelSubscription,
    refundSubscription,
    toggleFlag,
    setFlagRollout,
    toggleIntegration,
    setModerationThreshold,
    resetDemo,
  } = useAdminStore();

  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (t: Omit<Toast, 'id'>) => {
    const next: Toast = { id: Math.random().toString(36).slice(2, 9), ...t };
    setToast(next);
    window.setTimeout(() => setToast((cur) => (cur?.id === next.id ? null : cur)), 2600);
  };

  const usersById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const handleExportAudit = () => {
    const payload = JSON.stringify(
      { exportedAt: new Date().toISOString(), app: 'Cal AI', auditLog },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cal-ai-admin-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({ level: 'success', title: 'Exported audit log', message: 'Downloaded JSON.' });
  };

  const [search, setSearch] = useState('');
  const [moderationStatus, setModerationStatus] = useState<'all' | ModerationItem['status']>('all');
  const [userStatus, setUserStatus] = useState<'all' | AdminUser['status']>('all');
  const [ticketStatus, setTicketStatusFilter] = useState<'all' | TicketStatus>('all');

  const filteredModeration = useMemo(() => {
    const q = search.trim().toLowerCase();
    return moderationQueue
      .filter((m) => (moderationStatus === 'all' ? true : m.status === moderationStatus))
      .filter((m) => (q ? m.previewLabel.toLowerCase().includes(q) : true))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [moderationQueue, moderationStatus, search]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter((u) => (userStatus === 'all' ? true : u.status === userStatus))
      .filter((u) => (q ? `${u.name} ${u.email}`.toLowerCase().includes(q) : true))
      .sort((a, b) => b.lastActiveAt - a.lastActiveAt);
  }, [users, userStatus, search]);

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets
      .filter((t) => (ticketStatus === 'all' ? true : t.status === ticketStatus))
      .filter((t) => (q ? t.subject.toLowerCase().includes(q) : true))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [tickets, ticketStatus, search]);

  const filteredAudit = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return auditLog;
    return auditLog.filter((e) => `${e.summary} ${e.actor}`.toLowerCase().includes(q));
  }, [auditLog, search]);

  const selectedModeration = selectedModerationId
    ? moderationQueue.find((m) => m.id === selectedModerationId)
    : null;
  const selectedUser = selectedUserId ? users.find((u) => u.id === selectedUserId) : null;
  const selectedTicket = selectedTicketId ? tickets.find((t) => t.id === selectedTicketId) : null;

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
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">Admin & Moderation</h1>
              <Pill className="bg-violet-500/10 text-violet-300 border border-violet-500/20">
                <ShieldAlert className="w-4 h-4" />
                Cal AI Ops
              </Pill>
              {!setup.completed && (
                <Pill className="bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Setup required
                </Pill>
              )}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Fully hardcoded prototype • actions write to an audit log
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAudit}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export audit
          </button>
          <button
            onClick={() => {
              resetDemo();
              showToast({ level: 'info', title: 'Demo reset', message: 'Restored seeded Cal AI data.' });
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset demo
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        {!setup.completed ? (
          <SetupWizard onToast={(t) => showToast(t)} />
        ) : (
          <div className="h-full flex flex-col">
            {/* Tabs */}
            <div className="px-8 pt-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {sectionTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSection === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveSection(tab.id);
                          setSearch('');
                          setModerationStatus('all');
                          setUserStatus('all');
                          setTicketStatusFilter('all');
                          selectModeration(null);
                          selectUser(null);
                          selectTicket(null);
                        }}
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
                            layoutId="admin-tab-indicator"
                            className="absolute -bottom-[6px] left-3 right-3 h-[2px] bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search"
                      className="h-10 w-[280px] pl-9 pr-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden px-8 pb-8 pt-6">
              {activeSection === 'overview' && (
                <div className="h-full overflow-y-auto">
                  <AdminOverview
                    users={users}
                    moderationQueue={moderationQueue}
                    tickets={tickets}
                    subscriptions={subscriptions}
                    flags={flags}
                    auditLog={auditLog}
                    onNavigate={(s) => setActiveSection(s)}
                  />
                </div>
              )}

              {activeSection === 'moderation' && (
                <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-white font-semibold">Review queue</div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          Threshold: {moderationThreshold} • Pending: {moderationQueue.filter((m) => m.status === 'pending').length}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={moderationStatus}
                          onChange={(e) => setModerationStatus(e.target.value as any)}
                          className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
                        >
                          <option value="all">All statuses</option>
                          <option value="pending">Pending</option>
                          <option value="escalated">Escalated</option>
                          <option value="approved">Approved</option>
                          <option value="removed">Removed</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {filteredModeration.length === 0 ? (
                        <div className="p-6">
                          <EmptyState title="No items" description="No moderation items match the current filters." />
                        </div>
                      ) : (
                        <div className="divide-y divide-neutral-800">
                          {filteredModeration.map((m) => {
                            const u = usersById.get(m.userId);
                            const sev = severityConfig[m.severity];
                            const isSelected = selectedModerationId === m.id;
                            const recommendedRemove = m.aiSafetyScore < moderationThreshold;

                            return (
                              <button
                                key={m.id}
                                onClick={() => selectModeration(m.id)}
                                className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${
                                  isSelected ? 'bg-white/5' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white font-medium truncate">{m.previewLabel}</span>
                                      {recommendedRemove && (
                                        <Pill className="bg-rose-500/10 text-rose-300 border border-rose-500/20">
                                          Recommended remove
                                        </Pill>
                                      )}
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-1">
                                      {u?.email ?? 'Unknown user'} • {m.reason.replace('_', ' ')} • {formatRelative(m.createdAt)}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Pill className={sev.className}>
                                      <span className={`w-2 h-2 rounded-full ${sev.dot}`} />
                                      {sev.label}
                                    </Pill>
                                    <Pill className="bg-neutral-800 text-neutral-300">
                                      Safety {m.aiSafetyScore}
                                    </Pill>
                                    <Pill className="bg-white/5 text-neutral-300 border border-white/10">
                                      {m.status}
                                    </Pill>
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
                    {selectedModeration && (
                      <Drawer
                        title={selectedModeration.previewLabel}
                        subtitle={`Safety ${selectedModeration.aiSafetyScore} • ${selectedModeration.reason.replace('_', ' ')}`}
                        onClose={() => selectModeration(null)}
                      >
                        <div className="p-5 space-y-5">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800">
                            <div className="text-xs text-neutral-500">Preview</div>
                            <div className="text-white font-medium mt-2">{selectedModeration.previewLabel}</div>
                            <div className="text-xs text-neutral-500 mt-1">
                              Source: {selectedModeration.source.replace('_', ' ')} • Model {selectedModeration.details.modelVersion}
                            </div>
                          </div>

                          {selectedModeration.aiSafetyScore < moderationThreshold && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                              <div className="font-semibold text-sm">Suggested action: Remove</div>
                              <div className="text-xs text-rose-200/80 mt-1">
                                This item is below your threshold ({moderationThreshold}). In a real system, auto-actions could apply.
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                approveModeration(selectedModeration.id);
                                showToast({ level: 'success', title: 'Approved', message: 'Item marked as approved.' });
                              }}
                              className="px-4 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                removeModeration(selectedModeration.id);
                                showToast({ level: 'warning', title: 'Removed', message: 'Item removed (demo).' });
                              }}
                              className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-500 transition-colors"
                            >
                              Remove
                            </button>
                            <button
                              onClick={() => {
                                escalateModeration(selectedModeration.id);
                                showToast({ level: 'info', title: 'Escalated', message: 'Sent to escalation queue.' });
                              }}
                              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                            >
                              Escalate
                            </button>
                            <button
                              onClick={() => {
                                banUser(selectedModeration.userId, `Banned from moderation item ${selectedModeration.id}`);
                                showToast({ level: 'error', title: 'User banned', message: 'User status set to banned.' });
                              }}
                              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                            >
                              <Ban className="w-4 h-4" />
                              Ban user
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs font-semibold tracking-wider text-white/30 uppercase">Details</div>
                            <div className="text-sm text-white">
                              {usersById.get(selectedModeration.userId)?.name ?? 'Unknown user'}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {usersById.get(selectedModeration.userId)?.email ?? '—'}
                            </div>
                            {selectedModeration.details.detectedFoods?.length ? (
                              <div className="text-xs text-neutral-400 mt-2">
                                Detected: {selectedModeration.details.detectedFoods.join(', ')}
                              </div>
                            ) : null}
                            {selectedModeration.details.notes ? (
                              <div className="text-xs text-neutral-500 mt-2">{selectedModeration.details.notes}</div>
                            ) : null}
                          </div>
                        </div>
                      </Drawer>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeSection === 'users' && (
                <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-white font-semibold">Users</div>
                        <div className="text-xs text-neutral-500 mt-0.5">Search, grant Pro, disable, ban.</div>
                      </div>
                      <select
                        value={userStatus}
                        onChange={(e) => setUserStatus(e.target.value as any)}
                        className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
                      >
                        <option value="all">All statuses</option>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {filteredUsers.length === 0 ? (
                        <div className="p-6">
                          <EmptyState title="No users" description="No users match the current filters." />
                        </div>
                      ) : (
                        <div className="divide-y divide-neutral-800">
                          {filteredUsers.map((u) => (
                            <button
                              key={u.id}
                              onClick={() => selectUser(u.id)}
                              className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${
                                selectedUserId === u.id ? 'bg-white/5' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="text-white font-medium truncate">{u.name}</div>
                                  <div className="text-xs text-neutral-500 mt-1 truncate">{u.email}</div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Pill className="bg-white/5 text-neutral-300 border border-white/10">{u.plan.toUpperCase()}</Pill>
                                  <Pill className="bg-neutral-800 text-neutral-300">Risk {u.riskScore}</Pill>
                                  <Pill
                                    className={
                                      u.status === 'active'
                                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                        : u.status === 'disabled'
                                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                    }
                                  >
                                    {u.status}
                                  </Pill>
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
                        title={selectedUser.name}
                        subtitle={`${selectedUser.email} • ${selectedUser.plan.toUpperCase()} • Risk ${selectedUser.riskScore}`}
                        onClose={() => selectUser(null)}
                      >
                        <UserDetail
                          user={selectedUser}
                          onGrantPro={() => {
                            grantPro(selectedUser.id);
                            showToast({ level: 'success', title: 'Granted Pro', message: 'User plan set to Pro.' });
                          }}
                          onDisable={() => {
                            disableUser(selectedUser.id);
                            showToast({ level: 'warning', title: 'User disabled', message: 'User status set to disabled.' });
                          }}
                          onBan={() => {
                            banUser(selectedUser.id, 'Banned from user drawer');
                            showToast({ level: 'error', title: 'User banned', message: 'User status set to banned.' });
                          }}
                          onAddNote={(note) => {
                            addUserNote(selectedUser.id, note);
                            showToast({ level: 'info', title: 'Note added', message: 'Saved to user notes (demo).' });
                          }}
                        />
                      </Drawer>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeSection === 'support' && (
                <div className="h-full flex overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-900/20">
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-white font-semibold">Support inbox</div>
                        <div className="text-xs text-neutral-500 mt-0.5">Tickets, SLA, canned replies (demo).</div>
                      </div>
                      <select
                        value={ticketStatus}
                        onChange={(e) => setTicketStatusFilter(e.target.value as any)}
                        className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
                      >
                        <option value="all">All statuses</option>
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {filteredTickets.length === 0 ? (
                        <div className="p-6">
                          <EmptyState title="No tickets" description="No support tickets match the current filters." />
                        </div>
                      ) : (
                        <div className="divide-y divide-neutral-800">
                          {filteredTickets.map((t) => {
                            const u = usersById.get(t.userId);
                            const isSelected = selectedTicketId === t.id;
                            const slaOverdue = Date.now() > t.slaDueAt && (t.status === 'open' || t.status === 'pending');
                            return (
                              <button
                                key={t.id}
                                onClick={() => selectTicket(t.id)}
                                className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${isSelected ? 'bg-white/5' : ''}`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <div className="text-white font-medium truncate">{t.subject}</div>
                                    <div className="text-xs text-neutral-500 mt-1 truncate">
                                      {u?.email ?? 'Unknown user'} • {t.category} • {formatRelative(t.updatedAt)}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {slaOverdue && (
                                      <Pill className="bg-rose-500/10 text-rose-300 border border-rose-500/20">SLA</Pill>
                                    )}
                                    <Pill className="bg-white/5 text-neutral-300 border border-white/10">{t.priority}</Pill>
                                    <Pill className="bg-neutral-800 text-neutral-300">{t.status}</Pill>
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
                    {selectedTicket && (
                      <Drawer
                        title={selectedTicket.subject}
                        subtitle={`${usersById.get(selectedTicket.userId)?.email ?? 'Unknown'} • ${selectedTicket.category}`}
                        onClose={() => selectTicket(null)}
                      >
                        <TicketDetail
                          ticket={selectedTicket}
                          onReply={(body) => {
                            replyToTicket(selectedTicket.id, body);
                            showToast({ level: 'success', title: 'Reply sent', message: 'Added to ticket thread (demo).' });
                          }}
                          onSetStatus={(status) => {
                            setTicketStatus(selectedTicket.id, status);
                            showToast({ level: 'info', title: 'Status updated', message: `Ticket set to ${status}.` });
                          }}
                        />
                      </Drawer>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeSection === 'billing' && (
                <div className="h-full overflow-y-auto space-y-4">
                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl">
                    <div className="px-5 py-4 border-b border-neutral-800">
                      <div className="text-white font-semibold">Subscriptions</div>
                      <div className="text-xs text-neutral-500 mt-0.5">Cancel/refund actions are simulated.</div>
                    </div>
                    <div className="divide-y divide-neutral-800">
                      {subscriptions.map((s) => {
                        const u = usersById.get(s.userId);
                        return (
                          <div key={s.id} className="px-5 py-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <div className="text-white font-medium truncate">
                                {u?.email ?? s.userId} • {s.interval}
                              </div>
                              <div className="text-xs text-neutral-500 mt-1">
                                {formatMoney(s.amountCents)} • {s.status} • refunds: {s.refundsCount}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => {
                                  refundSubscription(s.id);
                                  showToast({ level: 'warning', title: 'Refunded', message: 'Refund count incremented (demo).' });
                                }}
                                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                              >
                                Refund
                              </button>
                              <button
                                onClick={() => {
                                  cancelSubscription(s.id);
                                  showToast({ level: 'info', title: 'Canceled', message: 'Subscription set to canceled.' });
                                }}
                                className="px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {subscriptions.length === 0 && (
                        <div className="p-6">
                          <EmptyState title="No subscriptions" description="No subscription records found in the demo seed." />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'flags' && (
                <div className="h-full overflow-y-auto space-y-4">
                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl">
                    <div className="px-5 py-4 border-b border-neutral-800">
                      <div className="text-white font-semibold">Feature flags</div>
                      <div className="text-xs text-neutral-500 mt-0.5">Toggle and adjust rollouts (demo).</div>
                    </div>
                    <div className="divide-y divide-neutral-800">
                      {flags.map((f) => (
                        <FlagRow
                          key={f.id}
                          flag={f}
                          onToggle={() => {
                            toggleFlag(f.id);
                            showToast({ level: 'info', title: 'Flag updated', message: `${f.key} toggled.` });
                          }}
                          onRollout={(v) => setFlagRollout(f.id, v)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'settings' && (
                <div className="h-full overflow-y-auto space-y-4">
                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                    <div className="text-white font-semibold">Moderation policy</div>
                    <div className="text-xs text-neutral-500 mt-1">
                      Configure the review recommendation threshold.
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-white">
                        <span>Auto-remove suggestion threshold</span>
                        <span className="text-neutral-400">{moderationThreshold}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        step={1}
                        value={moderationThreshold}
                        onChange={(e) => setModerationThreshold(parseInt(e.target.value, 10))}
                        className="w-full mt-3"
                      />
                      <div className="text-xs text-neutral-500 mt-2">
                        Used for UI guidance only. No backend automation in this prototype.
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                    <div className="text-white font-semibold">Integrations</div>
                    <div className="text-xs text-neutral-500 mt-1">
                      Toggle integration states to simulate your ops stack.
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {integrations.map((i) => (
                        <button
                          key={i.id}
                          onClick={() => {
                            toggleIntegration(i.name);
                            showToast({
                              level: 'info',
                              title: 'Integration updated',
                              message: `${i.name} toggled.`,
                            });
                          }}
                          className={`p-4 rounded-2xl border text-left transition-colors ${
                            i.connected
                              ? 'border-emerald-500/25 bg-emerald-500/5'
                              : 'border-neutral-800 bg-neutral-950 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-white font-medium">{i.name}</div>
                            <Pill className={i.connected ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-300'}>
                              {i.connected ? 'On' : 'Off'}
                            </Pill>
                          </div>
                          <div className="text-xs text-neutral-500 mt-2">{i.detail}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'audit' && (
                <div className="h-full overflow-y-auto">
                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl">
                    <div className="px-5 py-4 border-b border-neutral-800">
                      <div className="text-white font-semibold">Audit log</div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        Append-only activity feed for this prototype session.
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {filteredAudit.length === 0 ? (
                        <EmptyState title="No events yet" description="Actions you take will appear here." />
                      ) : (
                        filteredAudit.map((e) => (
                          <div key={e.id} className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-sm text-white">{e.summary}</div>
                              <div className="text-xs text-neutral-500 mt-1">
                                {e.actor} • {formatRelative(e.at)}
                              </div>
                            </div>
                            <div className="text-xs text-neutral-600">{new Date(e.at).toLocaleString()}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 shadow-xl min-w-[280px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-white font-semibold text-sm">{toast.title}</div>
                  {toast.message && <div className="text-xs text-neutral-500 mt-1">{toast.message}</div>}
                </div>
                <button
                  onClick={() => setToast(null)}
                  className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserDetail({
  user,
  onGrantPro,
  onDisable,
  onBan,
  onAddNote,
}: {
  user: AdminUser;
  onGrantPro: () => void;
  onDisable: () => void;
  onBan: () => void;
  onAddNote: (note: string) => void;
}) {
  const [note, setNote] = useState('');

  return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Plan" value={user.plan.toUpperCase()} />
        <StatCard label="Status" value={user.status} />
        <StatCard label="Total scans" value={user.totalScans} />
        <StatCard label="Flagged scans" value={user.flaggedScans} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onGrantPro}
          className="px-4 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
        >
          Grant Pro
        </button>
        <button
          onClick={onDisable}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          Disable
        </button>
        <button
          onClick={onBan}
          className="px-4 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors flex items-center justify-center gap-2"
        >
          <Ban className="w-4 h-4" />
          Ban
        </button>
        <button
          onClick={() => {
            setNote('');
            onAddNote(note);
          }}
          disabled={!note.trim()}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add note
        </button>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
        <div className="text-xs text-neutral-500">New note</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full mt-2 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
          placeholder="e.g., Refunded due to double charge. Watch for repeat..."
        />
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
        <div className="text-xs font-semibold tracking-wider text-white/30 uppercase">Notes</div>
        <div className="mt-3 space-y-2">
          {user.notes.length === 0 ? (
            <div className="text-sm text-neutral-500">No notes yet.</div>
          ) : (
            user.notes.map((n, idx) => (
              <div key={`${idx}-${n}`} className="text-sm text-white">
                {n}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TicketDetail({
  ticket,
  onReply,
  onSetStatus,
}: {
  ticket: SupportTicket;
  onReply: (body: string) => void;
  onSetStatus: (status: TicketStatus) => void;
}) {
  const [reply, setReply] = useState('');

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Pill className="bg-white/5 text-neutral-300 border border-white/10">{ticket.priority}</Pill>
        <select
          value={ticket.status}
          onChange={(e) => onSetStatus(e.target.value as TicketStatus)}
          className="h-9 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white"
        >
          <option value="open">open</option>
          <option value="pending">pending</option>
          <option value="resolved">resolved</option>
          <option value="closed">closed</option>
        </select>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
        <div className="text-xs font-semibold tracking-wider text-white/30 uppercase">Thread</div>
        <div className="mt-3 space-y-3">
          {ticket.messages.map((m) => (
            <div key={m.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold ${
                m.author === 'agent' ? 'bg-violet-500/20 text-violet-300' : 'bg-neutral-800 text-neutral-300'
              }`}>
                {m.author === 'agent' ? 'A' : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-sm text-white whitespace-pre-wrap">{m.body}</div>
                <div className="text-xs text-neutral-500 mt-1">{formatRelative(m.at)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
        <div className="text-xs text-neutral-500">Reply</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            'Thanks — could you share a screenshot of the scan result?',
            'Sorry about that. We’re investigating. What was the exact meal and where did you get it?',
            'For billing: can you confirm the Apple/Stripe receipt and the timestamp?',
            'I’ve credited you 7 days of Pro while we resolve this (demo).',
          ].map((canned) => (
            <button
              key={canned}
              onClick={() => setReply(canned)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              type="button"
            >
              {canned.startsWith('For billing') ? 'Billing receipt' : canned.startsWith('I’ve credited') ? 'Comp Pro' : canned.startsWith('Sorry') ? 'Investigating' : 'Screenshot'}
            </button>
          ))}
        </div>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          className="w-full mt-2 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
          placeholder="Write a response..."
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => setReply('')}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => {
              onReply(reply);
              setReply('');
            }}
            disabled={!reply.trim()}
            className="px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function FlagRow({
  flag,
  onToggle,
  onRollout,
}: {
  flag: FeatureFlag;
  onToggle: () => void;
  onRollout: (v: number) => void;
}) {
  return (
    <div className="px-5 py-4 flex items-start justify-between gap-6">
      <div className="min-w-0">
        <div className="text-white font-medium">{flag.name}</div>
        <div className="text-xs text-neutral-500 mt-1">{flag.description}</div>
        <div className="text-[11px] text-neutral-600 mt-2">{flag.key}</div>
      </div>
      <div className="w-[320px] flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Pill className="bg-white/5 text-neutral-300 border border-white/10">
            Rollout {flag.rolloutPercent}%
          </Pill>
          <button
            onClick={onToggle}
            className={`w-12 h-7 rounded-full transition-colors ${flag.enabled ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            aria-label="Toggle flag"
          >
            <motion.div className="w-6 h-6 bg-white rounded-full shadow-sm m-0.5" animate={{ x: flag.enabled ? 20 : 0 }} />
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={flag.rolloutPercent}
          onChange={(e) => onRollout(parseInt(e.target.value, 10))}
          disabled={!flag.enabled}
          className="w-full disabled:opacity-50"
        />
        <div className="text-xs text-neutral-600">Updated {formatRelative(flag.updatedAt)}</div>
      </div>
    </div>
  );
}

