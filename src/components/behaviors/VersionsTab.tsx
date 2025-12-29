'use client';

import { motion } from 'framer-motion';
import {
  GitBranch,
  GitCommit,
  Clock,
  ArrowRight,
  Rocket,
  RotateCcw,
  Copy,
  Brain,
  FileText,
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior, BehaviorVersion, VersionChange, Model, EvalRun } from '@/types/behaviors';

interface VersionsTabProps {
  behavior: Behavior;
}

const changeTypeConfig: Record<VersionChange['type'], { icon: typeof Brain; color: string }> = {
  model: { icon: Brain, color: 'var(--color-accent-purple)' },
  schema: { icon: FileText, color: 'var(--color-accent-blue)' },
  rules: { icon: ListChecks, color: 'var(--color-accent-green)' },
  examples: { icon: GitCommit, color: 'var(--color-accent-yellow)' },
  settings: { icon: GitBranch, color: 'var(--color-gray-75)' },
};

export function VersionsTab({ behavior }: VersionsTabProps) {
  const {
    getVersionsForBehavior,
    getEvalRunsForBehavior,
    models,
    createVersion,
    promoteVersion,
    rollbackToVersion,
  } = useBehaviorStore();

  const versions = getVersionsForBehavior(behavior.id);
  const evalRuns = getEvalRunsForBehavior(behavior.id);
  const shipped = versions.find((v) => v.isShipped) || versions[0];
  const shippedEval = shipped ? evalRuns.find((e) => e.versionId === shipped.id) : undefined;

  const handleCreateVersion = () => {
    createVersion(behavior.id);
  };

  const getEvalForVersion = (versionId: string) => {
    return evalRuns.find((e) => e.versionId === versionId);
  };

  return (
    <div className="p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Version History</h2>
            <p className="text-[var(--text-secondary)]">
              Track changes, compare versions, and roll back when needed.
            </p>
          </div>
          <button
            onClick={handleCreateVersion}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--apple-blue)] text-white text-sm font-medium hover:bg-[var(--apple-blue)]/90 transition-colors"
          >
            <GitBranch size={16} />
            Create Version
          </button>
        </div>

        {/* Current Version */}
        {versions.length > 0 && (
          <div className="bg-gradient-to-r from-[var(--apple-blue)]/10 to-[var(--apple-purple)]/10 rounded-2xl p-6 border border-[var(--apple-blue)]/20">
            <div className="flex items-center gap-2 mb-3">
              <Rocket size={18} className="text-[var(--apple-blue)]" />
              <span className="text-sm font-medium text-[var(--apple-blue)]">Shipped Version</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  v{shipped?.versionNumber ?? 1}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Last updated{' '}
                  {(shipped?.createdAt ?? versions[0].createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {shippedEval && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                      shippedEval.status === 'passed'
                        ? 'bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]'
                        : shippedEval.status === 'drift'
                        ? 'bg-[var(--color-accent-yellow)]/15 text-[var(--color-accent-yellow)]'
                        : 'bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)]'
                    }`}
                  >
                    {shippedEval.status === 'passed' && <CheckCircle2 size={12} />}
                    {shippedEval.status === 'drift' && <AlertTriangle size={12} />}
                    {shippedEval.status === 'failed' && <XCircle size={12} />}
                    {(shippedEval.passRate * 100).toFixed(0)}
                    % pass
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Version Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border-subtle)] opacity-60" />

          <div className="space-y-6">
            {versions.map((version, idx) => (
              <VersionCard
                key={version.id}
                version={version}
                evalRun={getEvalForVersion(version.id)}
                models={models}
                isLatest={idx === 0}
                onPromote={() => promoteVersion(version.id)}
                onRollback={() => rollbackToVersion(version.id)}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {versions.length === 0 && (
          <div className="text-center py-12 bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)]">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center mx-auto mb-4">
              <GitBranch size={28} className="text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No versions yet</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Create your first version to start tracking changes.
            </p>
            <button
              onClick={handleCreateVersion}
              className="px-4 py-2 rounded-xl bg-[var(--apple-blue)] text-white text-sm font-medium hover:bg-[var(--apple-blue)]/90 transition-colors"
            >
              Create First Version
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function VersionCard({
  version,
  evalRun,
  models,
  isLatest,
  onPromote,
  onRollback,
}: {
  version: BehaviorVersion;
  evalRun?: EvalRun;
  models: Model[];
  isLatest: boolean;
  onPromote: () => void;
  onRollback: () => void;
}) {
  const model = models.find((m) => m.id === version.snapshot.modelSettings.modelId);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative pl-14"
    >
      {/* Timeline dot */}
      <div
        className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
          version.isShipped
            ? 'bg-[var(--apple-blue)] border-[var(--apple-blue)]'
            : 'bg-[var(--surface-card)] border-[var(--border-subtle)]'
        }`}
      >
        {version.isShipped && (
          <Rocket size={10} className="text-white absolute inset-0 m-auto" />
        )}
      </div>

      <div
        className={`bg-[var(--surface-card)] rounded-xl border overflow-hidden ${
          version.isShipped
            ? 'border-[var(--apple-blue)]/30'
            : 'border-[var(--border-subtle)]'
        }`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-[var(--text-primary)]">
                  v{version.versionNumber}
                </h4>
                {version.isShipped && (
                  <span className="px-2 py-0.5 bg-[var(--apple-blue)]/15 text-[var(--apple-blue)] rounded text-[10px] font-medium">
                    SHIPPED
                  </span>
                )}
                {isLatest && !version.isShipped && (
                  <span className="px-2 py-0.5 bg-[var(--surface-elevated)] text-[var(--text-tertiary)] rounded text-[10px] font-medium">
                    LATEST
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-tertiary)]">
                <Clock size={12} />
                {version.createdAt.toLocaleDateString()} at{' '}
                {version.createdAt.toLocaleTimeString()}
              </div>
            </div>

            {/* Eval Status */}
            {evalRun && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  evalRun.status === 'passed'
                    ? 'bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]'
                    : evalRun.status === 'drift'
                    ? 'bg-[var(--color-accent-yellow)]/15 text-[var(--color-accent-yellow)]'
                    : 'bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)]'
                }`}
              >
                {evalRun.status === 'passed' && <CheckCircle2 size={12} />}
                {evalRun.status === 'drift' && <AlertTriangle size={12} />}
                {evalRun.status === 'failed' && <XCircle size={12} />}
                {(evalRun.passRate * 100).toFixed(0)}%
              </div>
            )}
          </div>

          {/* Changes */}
          <div className="flex flex-wrap gap-2 mb-4">
            {version.changes.map((change, idx) => {
              const config = changeTypeConfig[change.type];
              const Icon = config.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
                  style={{ backgroundColor: `${config.color}15`, color: config.color }}
                >
                  <Icon size={12} />
                  {change.description}
                </div>
              );
            })}
          </div>

          {/* Snapshot Info */}
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <span>Model: {model?.name}</span>
            <span>•</span>
            <span>{version.snapshot.exampleCount} examples</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 p-3 bg-[var(--surface-elevated)]/50 border-t border-[var(--border-subtle)]">
          {!version.isShipped && (
            <button
              onClick={onPromote}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--apple-blue)] text-white text-xs font-medium hover:bg-[var(--apple-blue)]/90 transition-colors"
            >
              <Rocket size={12} />
              Promote to Shipped
            </button>
          )}
          <button
            onClick={onRollback}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-card)] text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)] transition-colors"
          >
            <RotateCcw size={12} />
            Rollback to This
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-card)] text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)] transition-colors">
            <Copy size={12} />
            Duplicate as Draft
          </button>
        </div>
      </div>
    </motion.div>
  );
}

