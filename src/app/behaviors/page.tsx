'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Eye,
  FileText,
  MessageSquare,
  Tags,
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior, BehaviorType, EvalStatus } from '@/types/behaviors';

const behaviorTypeConfig: Record<BehaviorType, { label: string; icon: typeof Eye; color: string }> = {
  'vision-scorer': { label: 'Vision', icon: Eye, color: 'var(--color-accent-purple)' },
  'extractor': { label: 'Extractor', icon: FileText, color: 'var(--color-accent-blue)' },
  'classifier': { label: 'Classifier', icon: Tags, color: 'var(--color-accent-green)' },
  'generator': { label: 'Generator', icon: MessageSquare, color: 'var(--color-accent-yellow)' },
  'tool-use-agent': { label: 'Tool-Use', icon: Wrench, color: 'var(--color-accent-red)' },
};

const evalStatusConfig: Record<EvalStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  passed: { label: 'Passed', icon: CheckCircle2, color: 'var(--color-accent-green)' },
  drift: { label: 'Drift', icon: AlertTriangle, color: 'var(--color-accent-yellow)' },
  failed: { label: 'Failed', icon: XCircle, color: 'var(--color-accent-red)' },
  pending: { label: 'Pending', icon: Clock, color: 'var(--color-gray-75)' },
};

function BehaviorCard({ behavior, onClick }: { behavior: Behavior; onClick: () => void }) {
  const { models, getVersionsForBehavior } = useBehaviorStore();
  const typeConfig = behaviorTypeConfig[behavior.type];
  const statusConfig = evalStatusConfig[behavior.lastEvalStatus];
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;
  const model = models.find((m) => m.id === behavior.modelSettings.modelId);
  const versions = getVersionsForBehavior(behavior.id);
  const shippedVersion = versions.find((v) => v.isShipped);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden cursor-pointer transition-all duration-200 hover:border-[var(--color-gray-75)]"
      onClick={onClick}
    >
      {/* Gradient accent at top */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${typeConfig.color}, ${typeConfig.color}88)` }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${typeConfig.color}20` }}
            >
              <TypeIcon size={20} style={{ color: typeConfig.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] text-lg leading-tight">
                {behavior.name}
              </h3>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${typeConfig.color}20`,
                  color: typeConfig.color,
                }}
              >
                {typeConfig.label}
              </span>
            </div>
          </div>

          {/* Eval Status Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${statusConfig.color}15`,
              color: statusConfig.color,
            }}
          >
            <StatusIcon size={12} />
            {statusConfig.label}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
          {behavior.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] mb-4">
          <div className="flex items-center gap-1.5">
            <Brain size={12} />
            <span>{model?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} />
            <span>v{shippedVersion?.versionNumber || 1}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          <button
            className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Duplicate behavior
            }}
          >
            <Copy size={12} />
            Duplicate
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--apple-blue)] hover:text-[var(--apple-blue)]/80 transition-colors group-hover:translate-x-1 duration-200">
            Open
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BehaviorsPage() {
  const router = useRouter();
  const { behaviors, selectBehavior } = useBehaviorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<BehaviorType | 'all'>('all');

  const filteredBehaviors = behaviors.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || b.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleOpenBehavior = (behavior: Behavior) => {
    selectBehavior(behavior.id);
    router.push(`/behaviors/${behavior.id}`);
  };

  return (
    <div className="behaviors-theme min-h-screen bg-[var(--surface-dark)] flex flex-col relative overflow-hidden">
      {/* Ambient background (subtle depth) */}
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_top,rgba(54,120,255,0.14),transparent_55%),radial-gradient(circle_at_bottom,rgba(140,66,244,0.12),transparent_50%)]" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 h-12 bg-black/35 backdrop-blur-xl border-b border-[var(--border-subtle)] flex items-center px-4 gap-4 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Home</span>
        </Link>
        <div className="h-5 w-px bg-[var(--border-subtle)]" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--apple-blue)] to-[var(--apple-purple)] flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <span className="font-semibold text-[var(--text-primary)]">AI Behavior Builder</span>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Sidebar - Behaviors List */}
        <aside className="w-72 bg-black/30 backdrop-blur-xl border-r border-[var(--border-subtle)] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--apple-blue)] to-[var(--apple-purple)] flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">Behaviors</span>
            </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="text"
              placeholder="Search behaviors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--apple-blue)]"
            />
          </div>
        </div>

        {/* Type Filters */}
        <div className="p-3 border-b border-[var(--border-subtle)]">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedType === 'all'
                  ? 'bg-[var(--apple-blue)] text-white'
                  : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All
            </button>
            {(Object.keys(behaviorTypeConfig) as BehaviorType[]).map((type) => {
              const config = behaviorTypeConfig[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                    selectedType === type
                      ? 'text-white'
                      : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  style={{
                    backgroundColor: selectedType === type ? config.color : undefined,
                  }}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Behaviors List */}
        <nav className="flex-1 overflow-y-auto p-2">
          <AnimatePresence mode="popLayout">
            {filteredBehaviors.map((behavior) => {
              const typeConfig = behaviorTypeConfig[behavior.type];
              const statusConfig = evalStatusConfig[behavior.lastEvalStatus];
              const TypeIcon = typeConfig.icon;

              return (
                <motion.button
                  key={behavior.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => handleOpenBehavior(behavior)}
                  className="w-full text-left p-3 rounded-xl mb-1 hover:bg-[var(--surface-card)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${typeConfig.color}20` }}
                    >
                      <TypeIcon size={16} style={{ color: typeConfig.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-[var(--text-primary)] truncate">
                          {behavior.name}
                        </span>
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: statusConfig.color }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)] truncate block">
                        {typeConfig.label}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </nav>

        {/* Create New */}
        <div className="p-3 border-t border-[var(--border-subtle)]">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--apple-blue)] text-white font-medium text-sm hover:bg-[var(--apple-blue)]/90 transition-colors">
            <Plus size={16} />
            New Behavior
          </button>
        </div>
      </aside>

      {/* Main Content - Cards Grid */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-[var(--surface-dark)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)] px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">AI Behaviors</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Configure and manage your AI capabilities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--text-tertiary)]">
                {filteredBehaviors.length} behavior{filteredBehaviors.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </header>

        {/* Cards Grid */}
        <div className="p-8">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBehaviors.map((behavior) => (
                <BehaviorCard
                  key={behavior.id}
                  behavior={behavior}
                  onClick={() => handleOpenBehavior(behavior)}
                />
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredBehaviors.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--surface-card)] flex items-center justify-center mb-4">
                  <Search size={28} className="text-[var(--text-tertiary)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                  No behaviors found
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm">
                  Try adjusting your search or filters, or create a new behavior to get started.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      </div>
    </div>
  );
}

