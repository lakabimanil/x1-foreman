'use client';

import { motion } from 'framer-motion';
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Globe,
  Server,
  Code,
  Shield,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior, DeploymentEnv, DeploymentStatus } from '@/types/behaviors';

interface DeployTabProps {
  behavior: Behavior;
}

const envConfig: Record<DeploymentEnv, { label: string; icon: typeof Globe; color: string }> = {
  dev: { label: 'Development', icon: Code, color: 'var(--color-accent-yellow)' },
  staging: { label: 'Staging', icon: Server, color: 'var(--color-accent-purple)' },
  prod: { label: 'Production', icon: Globe, color: 'var(--color-accent-green)' },
};

const statusConfig: Record<DeploymentStatus, { label: string; icon: typeof Clock; color: string }> = {
  draft: { label: 'Draft', icon: Clock, color: 'var(--color-gray-75)' },
  testing: { label: 'Testing', icon: AlertTriangle, color: 'var(--color-accent-yellow)' },
  shipped: { label: 'Shipped', icon: Rocket, color: 'var(--color-accent-green)' },
};

export function DeployTab({ behavior }: DeployTabProps) {
  const { updateBehavior, getVersionsForBehavior, getEvalRunsForBehavior } = useBehaviorStore();
  
  const versions = getVersionsForBehavior(behavior.id);
  const evalRuns = getEvalRunsForBehavior(behavior.id);
  const latestEval = evalRuns[0];
  const shippedVersion = versions.find((v) => v.isShipped);
  
  const canDeploy = latestEval?.status === 'passed' && !behavior.instructions.rawEditUnlocked;

  const handleEnvironmentChange = (env: DeploymentEnv) => {
    updateBehavior(behavior.id, {
      deployment: { ...behavior.deployment, environment: env },
    });
  };

  const handleToggleMustPassTests = () => {
    updateBehavior(behavior.id, {
      deployment: { ...behavior.deployment, mustPassTests: !behavior.deployment.mustPassTests },
    });
  };

  return (
    <div className="p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Deployment</h2>
          <p className="text-[var(--text-secondary)]">
            Configure deployment settings and ship your behavior to production.
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-6 border border-[var(--border-subtle)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Current Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Environment */}
            <div className="p-4 bg-[var(--surface-elevated)] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                {(() => {
                  const config = envConfig[behavior.deployment.environment];
                  const Icon = config.icon;
                  return (
                    <>
                      <Icon size={16} style={{ color: config.color }} />
                      <span className="text-xs text-[var(--text-tertiary)]">Environment</span>
                    </>
                  );
                })()}
              </div>
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                {envConfig[behavior.deployment.environment].label}
              </span>
            </div>

            {/* Status */}
            <div className="p-4 bg-[var(--surface-elevated)] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                {(() => {
                  const config = statusConfig[behavior.deployment.status];
                  const Icon = config.icon;
                  return (
                    <>
                      <Icon size={16} style={{ color: config.color }} />
                      <span className="text-xs text-[var(--text-tertiary)]">Status</span>
                    </>
                  );
                })()}
              </div>
              <span
                className="text-lg font-semibold"
                style={{ color: statusConfig[behavior.deployment.status].color }}
              >
                {statusConfig[behavior.deployment.status].label}
              </span>
            </div>

            {/* Version */}
            <div className="p-4 bg-[var(--surface-elevated)] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Rocket size={16} className="text-[var(--text-tertiary)]" />
                <span className="text-xs text-[var(--text-tertiary)]">Shipped Version</span>
              </div>
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                v{shippedVersion?.versionNumber || 1}
              </span>
            </div>
          </div>

          {/* Last Deployed */}
          {behavior.deployment.lastDeployedAt && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Clock size={14} />
              Last deployed: {behavior.deployment.lastDeployedAt.toLocaleDateString()} at{' '}
              {behavior.deployment.lastDeployedAt.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Environment Selection */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-6 border border-[var(--border-subtle)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Target Environment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(envConfig) as DeploymentEnv[]).map((env) => {
              const config = envConfig[env];
              const Icon = config.icon;
              const isSelected = behavior.deployment.environment === env;

              return (
                <button
                  key={env}
                  onClick={() => handleEnvironmentChange(env)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-[var(--apple-blue)] bg-[var(--apple-blue)]/5'
                      : 'border-[var(--border-subtle)] hover:border-[var(--color-gray-75)]'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon size={20} style={{ color: config.color }} />
                  </div>
                  <h4 className="font-medium text-[var(--text-primary)] text-sm">{config.label}</h4>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    {env === 'dev' && 'For development and testing'}
                    {env === 'staging' && 'Pre-production validation'}
                    {env === 'prod' && 'Live production traffic'}
                  </p>
                  {isSelected && (
                    <CheckCircle2
                      size={18}
                      className="absolute top-3 right-3 text-[var(--apple-blue)]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Deployment Requirements */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-6 border border-[var(--border-subtle)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Deployment Requirements</h3>
          
          <div className="space-y-4">
            {/* Must Pass Tests */}
            <div className="flex items-center justify-between p-4 bg-[var(--surface-elevated)] rounded-xl">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-[var(--apple-blue)]" />
                <div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Must pass all tests
                  </span>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Deployment blocked if any tests fail
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={behavior.deployment.mustPassTests}
                onClick={handleToggleMustPassTests}
                className={`relative w-11 h-6 rounded-full border transition-colors ${
                  behavior.deployment.mustPassTests
                    ? 'bg-[var(--apple-blue)] border-[var(--apple-blue)]/30'
                    : 'bg-white/10 border-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    behavior.deployment.mustPassTests ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Raw Prompt Warning */}
            {behavior.instructions.rawEditUnlocked && (
              <div className="flex items-start gap-3 p-4 bg-[var(--color-accent-red)]/10 rounded-xl border border-[var(--color-accent-red)]/20">
                <Lock size={18} className="text-[var(--color-accent-red)] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-[var(--color-accent-red)]">
                    Raw prompt editing enabled
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Deployment is blocked because raw prompt editing is enabled. Run tests and
                    verify results before deploying.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pre-deployment Checks */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-6 border border-[var(--border-subtle)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Pre-deployment Checks</h3>
          
          <div className="space-y-3">
            {/* Tests Status */}
            <div className="flex items-center justify-between p-3 bg-[var(--surface-elevated)] rounded-xl">
              <div className="flex items-center gap-3">
                {latestEval?.status === 'passed' ? (
                  <CheckCircle2 size={18} className="text-[var(--color-accent-green)]" />
                ) : latestEval?.status === 'drift' ? (
                  <AlertTriangle size={18} className="text-[var(--color-accent-yellow)]" />
                ) : latestEval?.status === 'failed' ? (
                  <XCircle size={18} className="text-[var(--color-accent-red)]" />
                ) : (
                  <Clock size={18} className="text-[var(--text-tertiary)]" />
                )}
                <span className="text-sm text-[var(--text-primary)]">Test Results</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  latestEval?.status === 'passed'
                    ? 'text-[var(--color-accent-green)]'
                    : latestEval?.status === 'drift'
                    ? 'text-[var(--color-accent-yellow)]'
                    : latestEval?.status === 'failed'
                    ? 'text-[var(--color-accent-red)]'
                    : 'text-[var(--text-tertiary)]'
                }`}
              >
                {latestEval ? `${(latestEval.passRate * 100).toFixed(0)}% pass` : 'No tests run'}
              </span>
            </div>

            {/* Schema Valid */}
            <div className="flex items-center justify-between p-3 bg-[var(--surface-elevated)] rounded-xl">
              <div className="flex items-center gap-3">
                {behavior.outputSchema.fields.length > 0 ? (
                  <CheckCircle2 size={18} className="text-[var(--color-accent-green)]" />
                ) : (
                  <AlertTriangle size={18} className="text-[var(--color-accent-yellow)]" />
                )}
                <span className="text-sm text-[var(--text-primary)]">Output Schema</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  behavior.outputSchema.fields.length > 0
                    ? 'text-[var(--color-accent-green)]'
                    : 'text-[var(--color-accent-yellow)]'
                }`}
              >
                {behavior.outputSchema.fields.length > 0
                  ? `${behavior.outputSchema.fields.length} fields defined`
                  : 'No schema'}
              </span>
            </div>

            {/* Guardrails */}
            <div className="flex items-center justify-between p-3 bg-[var(--surface-elevated)] rounded-xl">
              <div className="flex items-center gap-3">
                {behavior.instructions.guardrails.filter((g) => g.enabled).length > 0 ? (
                  <CheckCircle2 size={18} className="text-[var(--color-accent-green)]" />
                ) : (
                  <AlertTriangle size={18} className="text-[var(--color-accent-yellow)]" />
                )}
                <span className="text-sm text-[var(--text-primary)]">Safety Guardrails</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  behavior.instructions.guardrails.filter((g) => g.enabled).length > 0
                    ? 'text-[var(--color-accent-green)]'
                    : 'text-[var(--color-accent-yellow)]'
                }`}
              >
                {behavior.instructions.guardrails.filter((g) => g.enabled).length} active
              </span>
            </div>
          </div>
        </div>

        {/* Deploy Button */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[var(--apple-blue)]/10 to-[var(--apple-purple)]/10 rounded-2xl border border-[var(--apple-blue)]/20">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Ready to deploy?</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {canDeploy
                ? `Deploy v${shippedVersion?.versionNumber || 1} to ${envConfig[behavior.deployment.environment].label}`
                : 'Address the issues above before deploying'}
            </p>
          </div>
          <button
            disabled={!canDeploy}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              canDeploy
                ? 'bg-[var(--apple-blue)] text-white hover:bg-[var(--apple-blue)]/90'
                : 'bg-[var(--surface-card)] text-[var(--text-tertiary)] cursor-not-allowed'
            }`}
          >
            <Rocket size={18} />
            Deploy to {envConfig[behavior.deployment.environment].label}
          </button>
        </div>

        {/* API Endpoint Preview */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-6 border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[var(--text-primary)]">API Endpoint</h3>
            <button className="flex items-center gap-1.5 text-xs text-[var(--apple-blue)] hover:underline">
              View Docs
              <ExternalLink size={12} />
            </button>
          </div>
          <div className="bg-[var(--surface-elevated)] rounded-xl p-4 font-mono text-sm">
            <span className="text-[var(--color-accent-green)]">POST</span>{' '}
            <span className="text-[var(--text-primary)]">
              /api/v1/behaviors/{behavior.id}/run
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

