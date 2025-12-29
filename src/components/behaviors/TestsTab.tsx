'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Trash2,
  FileText,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior, EvalRun, TestSet, Model } from '@/types/behaviors';

interface TestsTabProps {
  behavior: Behavior;
}

export function TestsTab({ behavior }: TestsTabProps) {
  const { getTestSetsForBehavior, getEvalRunsForBehavior, models } = useBehaviorStore();
  const testSets = getTestSetsForBehavior(behavior.id);
  const evalRuns = getEvalRunsForBehavior(behavior.id);
  
  const [expandedTestSet, setExpandedTestSet] = useState<string | null>(null);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = async () => {
    setIsRunning(true);
    // Simulate test run
    await new Promise((r) => setTimeout(r, 2000));
    setIsRunning(false);
  };
  const currentModel = models.find((m) => m.id === behavior.modelSettings.modelId);

  return (
    <div className="p-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Tests & Evaluations</h2>
            <p className="text-[var(--text-secondary)]">
              Create test sets and run evaluations to ensure behavior quality.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-card)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)]">
              <Plus size={16} />
              New Test Set
            </button>
            <button
              onClick={handleRunTests}
              disabled={isRunning || testSets.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--apple-blue)] text-white text-sm font-medium hover:bg-[var(--apple-blue)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Run Tests
                </>
              )}
            </button>
          </div>
        </div>

        {/* Run context */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)]">Run quality checks</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                {testSets.length === 0
                  ? 'Create a test set first. Then run tests to catch schema issues, safety regressions, and drift.'
                  : 'Run tests to validate schema, safety, and performance before shipping.'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 rounded-full bg-black/20 border border-white/10 text-xs text-[var(--text-secondary)]">
                Model: <span className="text-[var(--text-primary)] font-medium">{currentModel?.name ?? 'Not set'}</span>
              </span>
              <button
                onClick={handleRunTests}
                disabled={isRunning || testSets.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--apple-blue)] text-white text-sm font-medium hover:bg-[var(--apple-blue)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Run
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Latest Eval Summary */}
        {evalRuns.length > 0 && (
          <div className="bg-[var(--surface-card)] rounded-2xl p-6 border border-[var(--border-subtle)]">
            <h3 className="font-medium text-[var(--text-primary)] mb-4">Latest Evaluation</h3>
            <LatestEvalSummary evalRun={evalRuns[0]} models={models} />
          </div>
        )}

        {/* Test Sets */}
        <div className="space-y-4">
          <h3 className="font-medium text-[var(--text-primary)]">Test Sets</h3>
          
          {testSets.length === 0 ? (
            <div className="text-center py-12 bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)]">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-[var(--text-tertiary)]" />
              </div>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                No test sets yet
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Create a test set to define expectations and run evaluations.
              </p>
              <button className="px-4 py-2 rounded-xl bg-[var(--apple-blue)] text-white text-sm font-medium hover:bg-[var(--apple-blue)]/90 transition-colors">
                Create Test Set
              </button>
            </div>
          ) : (
            testSets.map((testSet) => (
              <TestSetCard
                key={testSet.id}
                testSet={testSet}
                isExpanded={expandedTestSet === testSet.id}
                onToggle={() =>
                  setExpandedTestSet(expandedTestSet === testSet.id ? null : testSet.id)
                }
              />
            ))
          )}
        </div>

        {/* Eval History */}
        {evalRuns.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-[var(--text-primary)]">Evaluation History</h3>
            {evalRuns.map((run) => (
              <EvalRunCard
                key={run.id}
                evalRun={run}
                models={models}
                isExpanded={expandedRun === run.id}
                onToggle={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function LatestEvalSummary({ evalRun, models }: { evalRun: EvalRun; models: Model[] }) {
  const model = models.find((m) => m.id === evalRun.modelId);
  const passedCount = evalRun.results.filter((r) => r.passed).length;
  const failedCount = evalRun.results.filter((r) => !r.passed).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Pass Rate */}
      <div
        className={`p-4 rounded-2xl border border-[var(--border-subtle)] ${
          evalRun.status === 'passed'
            ? 'bg-[var(--color-accent-green)]/10'
            : evalRun.status === 'drift'
            ? 'bg-[var(--color-accent-yellow)]/10'
            : 'bg-[var(--color-accent-red)]/10'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {evalRun.status === 'passed' && (
            <CheckCircle2 size={20} className="text-[var(--color-accent-green)]" />
          )}
          {evalRun.status === 'drift' && (
            <AlertTriangle size={20} className="text-[var(--color-accent-yellow)]" />
          )}
          {evalRun.status === 'failed' && (
            <XCircle size={20} className="text-[var(--color-accent-red)]" />
          )}
          <span className="text-2xl font-bold text-[var(--text-primary)]">
            {(evalRun.passRate * 100).toFixed(0)}%
          </span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">Pass Rate</p>
        {evalRun.driftSummary && (
          <p className="text-xs text-[var(--color-accent-yellow)] mt-1">{evalRun.driftSummary}</p>
        )}
      </div>

      {/* Test Results */}
      <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-lg font-bold text-[var(--color-accent-green)]">{passedCount}</span>
          <span className="text-[var(--text-tertiary)]">/</span>
          <span className="text-lg font-bold text-[var(--color-accent-red)]">{failedCount}</span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">Passed / Failed</p>
      </div>

      {/* Latency */}
      <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-[var(--text-tertiary)]" />
          <span className="text-lg font-bold text-[var(--text-primary)]">
            {(evalRun.totalLatencyMs / 1000).toFixed(1)}s
          </span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">Total Latency</p>
      </div>

      {/* Cost */}
      <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={16} className="text-[var(--text-tertiary)]" />
          <span className="text-lg font-bold text-[var(--text-primary)]">
            ${evalRun.totalCostUsd.toFixed(3)}
          </span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">Total Cost</p>
      </div>
    </div>
  );
}

function TestSetCard({
  testSet,
  isExpanded,
  onToggle,
}: {
  testSet: TestSet;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-elevated)]/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-elevated)] flex items-center justify-center">
            <FileText size={18} className="text-[var(--apple-blue)]" />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-[var(--text-primary)]">{testSet.name}</h4>
            <p className="text-xs text-[var(--text-tertiary)]">
              {testSet.testCases.length} test cases • Created{' '}
              {testSet.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[var(--border-subtle)]"
          >
            <div className="p-4 space-y-2">
              {testSet.testCases.map((tc) => (
                <div
                  key={tc.id}
                  className="flex items-center justify-between p-3 bg-[var(--surface-elevated)] rounded-lg"
                >
                  <div>
                    <span className="text-sm text-[var(--text-primary)]">{tc.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {tc.expectations.map((exp, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 bg-[var(--surface-card)] rounded text-[var(--text-tertiary)]"
                        >
                          {exp.type}: {exp.field || 'schema'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-[var(--color-accent-red)]/10 text-[var(--text-tertiary)] hover:text-[var(--color-accent-red)]">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--apple-blue)] transition-colors">
                <Plus size={14} />
                Add Test Case
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EvalRunCard({
  evalRun,
  models,
  isExpanded,
  onToggle,
}: {
  evalRun: EvalRun;
  models: Model[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const model = models.find((m) => m.id === evalRun.modelId);

  return (
    <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-elevated)]/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              evalRun.status === 'passed'
                ? 'bg-[var(--color-accent-green)]/15'
                : evalRun.status === 'drift'
                ? 'bg-[var(--color-accent-yellow)]/15'
                : 'bg-[var(--color-accent-red)]/15'
            }`}
          >
            {evalRun.status === 'passed' && (
              <CheckCircle2 size={18} className="text-[var(--color-accent-green)]" />
            )}
            {evalRun.status === 'drift' && (
              <AlertTriangle size={18} className="text-[var(--color-accent-yellow)]" />
            )}
            {evalRun.status === 'failed' && (
              <XCircle size={18} className="text-[var(--color-accent-red)]" />
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[var(--text-primary)]">
                {(evalRun.passRate * 100).toFixed(0)}% Pass
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">•</span>
              <span className="text-xs text-[var(--text-secondary)]">{model?.name}</span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              {evalRun.runAt.toLocaleDateString()} at {evalRun.runAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-sm text-[var(--text-primary)]">
              ${evalRun.totalCostUsd.toFixed(3)}
            </span>
            <p className="text-xs text-[var(--text-tertiary)]">
              {(evalRun.totalLatencyMs / 1000).toFixed(1)}s
            </p>
          </div>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[var(--border-subtle)]"
          >
            <div className="p-4 space-y-2">
              {evalRun.results.map((result) => (
                <div
                  key={result.testCaseId}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.passed ? 'bg-[var(--surface-elevated)]' : 'bg-[var(--color-accent-red)]/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.passed ? (
                      <CheckCircle2 size={16} className="text-[var(--color-accent-green)]" />
                    ) : (
                      <XCircle size={16} className="text-[var(--color-accent-red)]" />
                    )}
                    <div>
                      <span className="text-sm text-[var(--text-primary)]">
                        Test {result.testCaseId}
                      </span>
                      {!result.passed && result.error && (
                        <p className="text-xs text-[var(--color-accent-red)]">{result.error}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--text-secondary)]">{result.latencyMs}ms</span>
                    <p className="text-xs text-[var(--text-tertiary)]">${result.costUsd.toFixed(4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

