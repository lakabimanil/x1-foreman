'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Command,
  Flag,
  Radio,
  RotateCcw,
  Settings,
  Shield,
  Users,
  UserCog,
} from 'lucide-react';
import { usePlatformOpsStore } from '@/store/usePlatformOpsStore';
import { Toast, Badge } from './shared';
import { CommandCenter } from './CommandCenter';
import { LiveContentSection } from './LiveContentSection';
import { ModerationQueue } from './ModerationQueue';
import { UsersSection } from './UsersSection';
import { ReportsSection } from './ReportsSection';
import { TeamSection } from './TeamSection';
import { AuditLogSection } from './AuditLogSection';
import type { OpsSection, PlatformSettings } from '@/types/platformOps';

type ToastData = { id: string; level: 'success' | 'info' | 'warning' | 'error'; title: string; message?: string };

const sectionTabs: { id: OpsSection; label: string; icon: React.ElementType }[] = [
  { id: 'command-center', label: 'Command Center', icon: Command },
  { id: 'live-content', label: 'Live Content', icon: Radio },
  { id: 'moderation-queue', label: 'Moderation', icon: Shield },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'reports', label: 'Reports', icon: Flag },
  { id: 'team', label: 'Team', icon: UserCog },
  { id: 'audit-log', label: 'Audit Log', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface PlatformOpsDashboardProps {
  onBack?: () => void;
}

export function PlatformOpsDashboard({ onBack }: PlatformOpsDashboardProps) {
  const store = usePlatformOpsStore();
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (t: Omit<ToastData, 'id'>) => {
    const next: ToastData = { id: Math.random().toString(36).slice(2, 9), ...t };
    setToast(next);
    window.setTimeout(() => setToast((cur) => (cur?.id === next.id ? null : cur)), 2600);
  };

  const pendingMod = store.moderationQueue.filter(m => m.status === 'pending').length;
  const newReports = store.reports.filter(r => r.status === 'new').length;
  const criticalItems = store.moderationQueue.filter(m => m.severity === 'critical' && m.status === 'pending').length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-black">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {onBack && (
            <>
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>
              <div className="h-4 w-px bg-neutral-800" />
            </>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">Platform Operations</h1>
              <Badge className="bg-rose-500/10 text-rose-300 border border-rose-500/20">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Live
              </Badge>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Real-time moderation, user management, and platform health
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {criticalItems > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-sm text-rose-300">{criticalItems} critical</span>
            </div>
          )}
          <button
            onClick={() => {
              store.resetDemo();
              showToast({ level: 'info', title: 'Demo reset', message: 'All data restored to initial state' });
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Demo
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="px-8 pt-5 pb-4 border-b border-neutral-800/50">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {sectionTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = store.activeSection === tab.id;
              const hasBadge = 
                (tab.id === 'moderation-queue' && pendingMod > 0) ||
                (tab.id === 'reports' && newReports > 0);
              const badgeCount = 
                tab.id === 'moderation-queue' ? pendingMod :
                tab.id === 'reports' ? newReports : 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => store.setActiveSection(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all flex-shrink-0 ${
                    isActive
                      ? 'border-white/15 bg-white/10 text-white'
                      : 'border-transparent bg-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {hasBadge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      tab.id === 'moderation-queue' && criticalItems > 0
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-black'
                    }`}>
                      {badgeCount}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="ops-tab-indicator"
                      className="absolute -bottom-[17px] left-4 right-4 h-[2px] bg-gradient-to-r from-violet-500 to-rose-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-8">
          {store.activeSection === 'command-center' && (
            <div className="h-full overflow-y-auto">
              <CommandCenter
                analytics={store.analytics}
                liveContent={store.liveContent}
                moderationQueue={store.moderationQueue}
                reports={store.reports}
                onNavigate={store.setActiveSection}
              />
            </div>
          )}

          {store.activeSection === 'live-content' && (
            <LiveContentSection
              content={store.liveContent}
              selectedId={store.selectedContentId}
              onSelect={store.selectContent}
              onEndContent={store.endContent}
              onFeature={store.featureContent}
              onUnfeature={store.unfeatureContent}
              onToast={showToast}
            />
          )}

          {store.activeSection === 'moderation-queue' && (
            <ModerationQueue
              items={store.moderationQueue}
              team={store.team}
              selectedId={store.selectedModerationId}
              onSelect={store.selectModeration}
              onApprove={store.approveModeration}
              onRemove={store.removeModeration}
              onEscalate={store.escalateModeration}
              onAssign={store.assignModeration}
              onAddNote={store.addModerationNote}
              onToast={showToast}
            />
          )}

          {store.activeSection === 'users' && (
            <UsersSection
              users={store.users}
              selectedId={store.selectedUserId}
              onSelect={store.selectUser}
              onWarn={store.warnUser}
              onTimeout={store.timeoutUser}
              onSuspend={store.suspendUser}
              onBan={store.banUser}
              onUnban={store.unbanUser}
              onAddNote={store.addUserNote}
              onAddTag={store.addUserTag}
              onRemoveTag={store.removeUserTag}
              onToast={showToast}
            />
          )}

          {store.activeSection === 'reports' && (
            <ReportsSection
              reports={store.reports}
              team={store.team}
              selectedId={store.selectedReportId}
              onSelect={store.selectReport}
              onAssign={store.assignReport}
              onResolve={store.resolveReport}
              onDismiss={store.dismissReport}
              onEscalate={store.escalateReport}
              onToast={showToast}
            />
          )}

          {store.activeSection === 'team' && (
            <div className="h-full overflow-y-auto">
              <TeamSection
                team={store.team}
                onInvite={store.inviteTeamMember}
                onUpdateRole={store.updateTeamRole}
                onRemove={store.removeTeamMember}
                onToast={showToast}
              />
            </div>
          )}

          {store.activeSection === 'audit-log' && (
            <AuditLogSection entries={store.auditLog} />
          )}

          {store.activeSection === 'settings' && (
            <div className="h-full overflow-y-auto">
              <SettingsSection settings={store.settings} onUpdate={store.updateSettings} onToast={showToast} />
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

// Settings Section (inline to keep it simple)
function SettingsSection({ 
  settings, 
  onUpdate, 
  onToast 
}: { 
  settings: PlatformSettings;
  onUpdate: (s: Partial<PlatformSettings>) => void;
  onToast: (t: { level: 'success' | 'info' | 'warning' | 'error'; title: string; message?: string }) => void;
}) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Auto-Moderation */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
        <div className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-violet-400" />
          Auto-Moderation
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm">Enable Auto-Moderation</div>
              <div className="text-xs text-neutral-500 mt-1">Automatically flag content using AI and keyword filters</div>
            </div>
            <button
              onClick={() => {
                onUpdate({ autoMod: { ...settings.autoMod, enabled: !settings.autoMod.enabled } });
                onToast({ level: 'info', title: 'Setting updated' });
              }}
              className={`w-12 h-7 rounded-full transition-colors ${settings.autoMod.enabled ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow-sm m-0.5" animate={{ x: settings.autoMod.enabled ? 20 : 0 }} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm">AI Moderation</div>
              <div className="text-xs text-neutral-500 mt-1">Use AI to detect policy violations</div>
            </div>
            <button
              onClick={() => {
                onUpdate({ autoMod: { ...settings.autoMod, aiModerationEnabled: !settings.autoMod.aiModerationEnabled } });
                onToast({ level: 'info', title: 'Setting updated' });
              }}
              className={`w-12 h-7 rounded-full transition-colors ${settings.autoMod.aiModerationEnabled ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow-sm m-0.5" animate={{ x: settings.autoMod.aiModerationEnabled ? 20 : 0 }} />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-white text-sm">AI Sensitivity</div>
              <span className="text-neutral-400 text-sm capitalize">{settings.autoMod.aiSensitivity}</span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              value={['low', 'medium', 'high'].indexOf(settings.autoMod.aiSensitivity)}
              onChange={e => {
                const levels = ['low', 'medium', 'high'] as const;
                onUpdate({ autoMod: { ...settings.autoMod, aiSensitivity: levels[Number(e.target.value)] } });
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-600 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-white text-sm">Auto-Remove Threshold</div>
              <span className="text-neutral-400 text-sm">{settings.autoMod.autoRemoveThreshold}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={settings.autoMod.autoRemoveThreshold}
              onChange={e => {
                onUpdate({ autoMod: { ...settings.autoMod, autoRemoveThreshold: Number(e.target.value) } });
              }}
              className="w-full"
            />
            <div className="text-xs text-neutral-500 mt-1">
              Content with AI confidence above this threshold will be auto-removed
            </div>
          </div>
        </div>
      </div>

      {/* Content Rules */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
        <div className="text-white font-semibold mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-400" />
          Content Rules
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm">Allow Adult Content</div>
              <div className="text-xs text-neutral-500 mt-1">Permit age-restricted content on the platform</div>
            </div>
            <button
              onClick={() => {
                onUpdate({ contentRules: { ...settings.contentRules, allowAdultContent: !settings.contentRules.allowAdultContent } });
                onToast({ level: 'info', title: 'Setting updated' });
              }}
              className={`w-12 h-7 rounded-full transition-colors ${settings.contentRules.allowAdultContent ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow-sm m-0.5" animate={{ x: settings.contentRules.allowAdultContent ? 20 : 0 }} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm">Require Age Gating</div>
              <div className="text-xs text-neutral-500 mt-1">Force age verification for restricted content</div>
            </div>
            <button
              onClick={() => {
                onUpdate({ contentRules: { ...settings.contentRules, requireAgeGating: !settings.contentRules.requireAgeGating } });
                onToast({ level: 'info', title: 'Setting updated' });
              }}
              className={`w-12 h-7 rounded-full transition-colors ${settings.contentRules.requireAgeGating ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow-sm m-0.5" animate={{ x: settings.contentRules.requireAgeGating ? 20 : 0 }} />
            </button>
          </div>
        </div>
      </div>

      {/* User Rules */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
        <div className="text-white font-semibold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" />
          User Rules
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-white text-sm">New Account Cooldown</div>
              <span className="text-neutral-400 text-sm">{settings.userRules.newAccountCooldown}h</span>
            </div>
            <input
              type="range"
              min={0}
              max={72}
              step={6}
              value={settings.userRules.newAccountCooldown}
              onChange={e => {
                onUpdate({ userRules: { ...settings.userRules, newAccountCooldown: Number(e.target.value) } });
              }}
              className="w-full"
            />
            <div className="text-xs text-neutral-500 mt-1">
              Hours before new accounts can create content
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-white text-sm">Strikes to Ban</div>
              <span className="text-neutral-400 text-sm">{settings.userRules.strikesToBan}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={settings.userRules.strikesToBan}
              onChange={e => {
                onUpdate({ userRules: { ...settings.userRules, strikesToBan: Number(e.target.value) } });
              }}
              className="w-full"
            />
            <div className="text-xs text-neutral-500 mt-1">
              Number of strikes before automatic ban
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm">Auto-Timeout on Strikes</div>
              <div className="text-xs text-neutral-500 mt-1">Automatically timeout users when they receive strikes</div>
            </div>
            <button
              onClick={() => {
                onUpdate({ userRules: { ...settings.userRules, autoTimeoutOnStrikes: !settings.userRules.autoTimeoutOnStrikes } });
                onToast({ level: 'info', title: 'Setting updated' });
              }}
              className={`w-12 h-7 rounded-full transition-colors ${settings.userRules.autoTimeoutOnStrikes ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow-sm m-0.5" animate={{ x: settings.userRules.autoTimeoutOnStrikes ? 20 : 0 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
        <div className="text-white font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          Alerts & Notifications
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm">Alert on Critical Issues</div>
              <div className="text-xs text-neutral-500 mt-1">Send alerts for critical moderation items</div>
            </div>
            <button
              onClick={() => {
                onUpdate({ alerts: { ...settings.alerts, alertOnCritical: !settings.alerts.alertOnCritical } });
                onToast({ level: 'info', title: 'Setting updated' });
              }}
              className={`w-12 h-7 rounded-full transition-colors ${settings.alerts.alertOnCritical ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow-sm m-0.5" animate={{ x: settings.alerts.alertOnCritical ? 20 : 0 }} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm">Alert on High Volume</div>
              <div className="text-xs text-neutral-500 mt-1">Notify when report volume exceeds threshold</div>
            </div>
            <button
              onClick={() => {
                onUpdate({ alerts: { ...settings.alerts, alertOnHighVolume: !settings.alerts.alertOnHighVolume } });
                onToast({ level: 'info', title: 'Setting updated' });
              }}
              className={`w-12 h-7 rounded-full transition-colors ${settings.alerts.alertOnHighVolume ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            >
              <motion.div className="w-6 h-6 bg-white rounded-full shadow-sm m-0.5" animate={{ x: settings.alerts.alertOnHighVolume ? 20 : 0 }} />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-white text-sm">High Volume Threshold</div>
              <span className="text-neutral-400 text-sm">{settings.alerts.highVolumeThreshold} reports/hour</span>
            </div>
            <input
              type="range"
              min={10}
              max={200}
              step={10}
              value={settings.alerts.highVolumeThreshold}
              onChange={e => {
                onUpdate({ alerts: { ...settings.alerts, highVolumeThreshold: Number(e.target.value) } });
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
