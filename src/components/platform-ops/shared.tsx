'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ModerationSeverity, ModerationReason } from '@/types/platformOps';

// ═══════════════════════════════════════════════════════════════════════════════
// FORMATTING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / (60 * 1000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEVERITY CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export const severityConfig: Record<ModerationSeverity, { label: string; bg: string; text: string; dot: string }> = {
  low: { label: 'Low', bg: 'bg-neutral-800', text: 'text-neutral-300', dot: 'bg-neutral-400' },
  medium: { label: 'Medium', bg: 'bg-amber-500/15', text: 'text-amber-300', dot: 'bg-amber-400' },
  high: { label: 'High', bg: 'bg-orange-500/15', text: 'text-orange-300', dot: 'bg-orange-400' },
  critical: { label: 'Critical', bg: 'bg-rose-500/15', text: 'text-rose-300', dot: 'bg-rose-400' },
};

export const reasonLabels: Record<ModerationReason, string> = {
  nudity: 'Nudity/Sexual',
  violence: 'Violence',
  harassment: 'Harassment',
  hate_speech: 'Hate Speech',
  spam: 'Spam',
  copyright: 'Copyright',
  misinformation: 'Misinformation',
  self_harm: 'Self-Harm',
  illegal_activity: 'Illegal Activity',
  underage: 'Underage',
  impersonation: 'Impersonation',
  other: 'Other',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className ?? ''}`}>
      {children}
    </span>
  );
}

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; className?: string }) {
  const variants = {
    default: 'bg-white/5 text-neutral-300 border border-white/10',
    success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-300 border border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  };
  return <Pill className={className ?? variants[variant]}>{children}</Pill>;
}

export function StatCard({ label, value, sub, trend, icon: Icon }: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  trend?: number;
  icon?: React.ElementType;
}) {
  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div className="text-xs text-neutral-500">{label}</div>
        {Icon && <Icon className="w-4 h-4 text-neutral-600" />}
      </div>
      <div className="flex items-end gap-2 mt-2">
        <div className="text-2xl font-semibold text-white">{value}</div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {sub && <div className="text-xs text-neutral-500 mt-1">{sub}</div>}
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon }: {
  title: string;
  description: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="border border-neutral-800/70 bg-neutral-900/20 rounded-2xl p-10 text-center">
      {Icon && <Icon className="w-10 h-10 text-neutral-700 mx-auto mb-4" />}
      <div className="text-white font-semibold">{title}</div>
      <div className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">{description}</div>
    </div>
  );
}

export function Drawer({
  title,
  subtitle,
  onClose,
  children,
  width = 420,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <motion.aside
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ width }}
      className="border-l border-neutral-800 bg-neutral-950 flex flex-col"
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

export function ActionButton({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled,
  icon: Icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  icon?: React.ElementType;
}) {
  const variants = {
    default: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
    primary: 'bg-white text-black hover:bg-neutral-200',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
    ghost: 'text-neutral-400 hover:text-white hover:bg-white/5',
  };
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

export function HealthIndicator({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-emerald-500' :
    score >= 60 ? 'bg-amber-500' :
    score >= 40 ? 'bg-orange-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-neutral-400">{score}</span>
    </div>
  );
}

export function Toast({ toast, onClose }: { 
  toast: { id: string; level: 'success' | 'info' | 'warning' | 'error'; title: string; message?: string } | null;
  onClose: () => void;
}) {
  return (
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
                onClick={onClose}
                className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
