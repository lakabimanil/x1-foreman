'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Settings,
  Brain,
  FileText,
  Upload,
  Download,
  BookOpen,
  FlaskConical,
  History,
  Rocket,
  Play,
  Columns2,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import {
  OverviewTab,
  ModelsTab,
  InstructionsTab,
  InputsTab,
  OutputsTab,
  ExamplesTab,
  TestsTab,
  VersionsTab,
  DeployTab,
} from '@/components/behaviors';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Settings },
  { id: 'models', label: 'Models', icon: Brain },
  { id: 'instructions', label: 'Instructions', icon: FileText },
  { id: 'inputs', label: 'Inputs', icon: Upload },
  { id: 'outputs', label: 'Results', icon: Download },
  { id: 'examples', label: 'Examples', icon: BookOpen },
  { id: 'tests', label: 'Tests', icon: FlaskConical },
  { id: 'versions', label: 'Versions', icon: History },
  { id: 'deploy', label: 'Deploy', icon: Rocket },
];

interface BehaviorDetailClientProps {
  behaviorId: string;
}

export default function BehaviorDetailClient({ behaviorId }: BehaviorDetailClientProps) {
  const router = useRouter();
  const [isAssistantDockOpen, setIsAssistantDockOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(true);

  const {
    behaviors,
    models,
    selectedBehaviorId,
    selectBehavior,
    activeTab,
    setActiveTab,
    compareMode,
    toggleCompareMode,
    compareModelId,
    setCompareModel,
    playgroundInput,
    setPlaygroundInput,
    playgroundOutputs,
    isRunning,
    runPlayground,
    clearPlayground,
    assistantMessages,
    sendAssistantMessage,
    toolTraces,
  } = useBehaviorStore();

  const behavior = behaviors.find((b) => b.id === behaviorId);
  const currentModel = models.find((m) => m.id === behavior?.modelSettings.modelId);

  const tabGroups = useMemo(
    () => [
      { title: 'Configure', items: tabs.slice(0, 5) },
      { title: 'Evaluate', items: tabs.slice(5, 8) },
      { title: 'Ship', items: tabs.slice(8) },
    ],
    []
  );

  // Select behavior on mount
  useEffect(() => {
    if (behaviorId && behaviorId !== selectedBehaviorId) {
      selectBehavior(behaviorId);
    }
  }, [behaviorId, selectedBehaviorId, selectBehavior]);

  if (!behavior) {
    return (
      <div className="min-h-screen bg-[var(--surface-dark)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Behavior not found
          </h2>
          <button
            onClick={() => router.push('/behaviors')}
            className="text-[var(--apple-blue)] hover:underline"
          >
            Go back to behaviors
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab behavior={behavior} />;
      case 'models':
        return <ModelsTab behavior={behavior} />;
      case 'instructions':
        return <InstructionsTab behavior={behavior} />;
      case 'inputs':
        return <InputsTab behavior={behavior} />;
      case 'outputs':
        return <OutputsTab behavior={behavior} />;
      case 'examples':
        return <ExamplesTab behavior={behavior} />;
      case 'tests':
        return <TestsTab behavior={behavior} />;
      case 'versions':
        return <VersionsTab behavior={behavior} />;
      case 'deploy':
        return <DeployTab behavior={behavior} />;
      default:
        return <OverviewTab behavior={behavior} />;
    }
  };

  return (
    <div className="behaviors-theme min-h-screen bg-[var(--surface-dark)] flex flex-col relative overflow-hidden">
      {/* Ambient background (subtle depth, Apple-style) */}
      <div className="pointer-events-none absolute inset-0 opacity-100 [background-image:radial-gradient(circle_at_top,rgba(54,120,255,0.14),transparent_55%),radial-gradient(circle_at_bottom,rgba(140,66,244,0.12),transparent_50%)]" />

      {/* Top Header */}
      <header className="relative z-10 h-14 bg-black/35 backdrop-blur-xl border-b border-[var(--border-subtle)] flex items-center px-4 gap-4 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Home</span>
        </Link>

        <div className="h-5 w-px bg-[var(--border-subtle)]" />

        <button
          onClick={() => router.push('/behaviors')}
          className="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
        >
          Behaviors
        </button>

        <span className="text-[var(--text-tertiary)]">/</span>

        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-[var(--text-primary)]">{behavior.name}</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-card)] text-[var(--text-tertiary)]">
            {behavior.type.replace('-', ' ')}
          </span>
        </div>

        <div className="flex-1" />

        {/* Quick Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Brain size={14} />
            <span>{currentModel?.name}</span>
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
              behavior.lastEvalStatus === 'passed'
                ? 'bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]'
                : behavior.lastEvalStatus === 'drift'
                ? 'bg-[var(--color-accent-yellow)]/15 text-[var(--color-accent-yellow)]'
                : 'bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)]'
            }`}
          >
            {behavior.lastEvalStatus === 'passed' && <CheckCircle2 size={12} />}
            {behavior.lastEvalStatus === 'drift' && <AlertTriangle size={12} />}
            {behavior.lastEvalStatus === 'failed' && <XCircle size={12} />}
            {behavior.lastEvalStatus}
          </div>
        </div>

        {/* View Toggles */}
        <div className="ml-2 flex items-center gap-2">
          <div className="flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] p-0.5">
            <button
              type="button"
              onClick={() => setIsAssistantDockOpen((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isAssistantDockOpen ? 'bg-white/10 text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Assistant
            </button>
            <button
              type="button"
              onClick={() => setIsInspectorOpen((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isInspectorOpen ? 'bg-white/10 text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Inspector
            </button>
            <button
              type="button"
              onClick={() => setIsPlaygroundOpen((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isPlaygroundOpen ? 'bg-white/10 text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Playground
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Pane Layout */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Pane - Config Tabs */}
        <aside className="w-72 bg-black/30 backdrop-blur-xl border-r border-[var(--border-subtle)] flex flex-col overflow-hidden">
          {/* Tab Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-3">
            {tabGroups.map((group) => (
              <div key={group.title} className="mb-4">
                <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">
                  {group.title}
                </div>
                {group.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${
                        isActive
                          ? 'bg-white/10 text-[var(--text-primary)] border border-white/10'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[var(--apple-blue)]' : 'text-[var(--text-tertiary)]'} />
                      <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Assistant Panel */}
          <div className="border-t border-[var(--border-subtle)] flex flex-col max-h-[360px]">
            <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--apple-purple)]" />
                <span className="text-xs font-semibold text-[var(--text-primary)]">Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAssistantDockOpen((v) => !v)}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                title={isAssistantDockOpen ? 'Collapse assistant' : 'Expand assistant'}
              >
                {isAssistantDockOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>

            {/* Messages */}
            {isAssistantDockOpen && (
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {assistantMessages.length === 0 ? (
                  <p className="text-xs text-[var(--text-tertiary)] text-center py-4">
                    Ask me to adjust the behavior...
                  </p>
                ) : (
                  assistantMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`text-xs p-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-[var(--apple-blue)]/90 text-white ml-4'
                          : 'bg-white/5 text-[var(--text-primary)] mr-4 border border-white/10'
                      }`}
                    >
                      <p>{msg.content}</p>
                      {msg.changes && msg.changes.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.changes.map((change, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-[10px] bg-black/20 rounded px-1.5 py-0.5"
                            >
                              <span className="text-[var(--text-tertiary)]">{change.field}:</span>
                              <span className="line-through opacity-60">{change.before}</span>
                              <span>→</span>
                              <span className="text-[var(--color-accent-green)]">{change.after}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('assistant-input') as HTMLInputElement;
                if (input.value.trim()) {
                  sendAssistantMessage(input.value);
                  input.value = '';
                }
              }}
              className="p-2 border-t border-[var(--border-subtle)]"
            >
              <div className="flex items-center gap-2">
                <input
                  name="assistant-input"
                  type="text"
                  placeholder="e.g., make it harsher..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--apple-blue)]"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-lg bg-[var(--apple-blue)] flex items-center justify-center hover:bg-[var(--apple-blue)]/90 transition-colors"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </form>
          </div>
        </aside>

        {/* Center Pane - Tab Content + Playground */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Playground Bar */}
          {isPlaygroundOpen && (
            <div className="border-t border-[var(--border-subtle)] bg-black/25 backdrop-blur-xl">
            {/* Playground Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm text-[var(--text-primary)]">Playground</span>
                <button
                  onClick={toggleCompareMode}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    compareMode
                      ? 'bg-[var(--apple-purple)] text-white'
                      : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Columns2 size={14} />
                  Compare
                </button>
                {compareMode && (
                  <select
                    value={compareModelId || ''}
                    onChange={(e) => setCompareModel(e.target.value || null)}
                    className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--apple-blue)]"
                  >
                    <option value="">Select model...</option>
                    {models
                      .filter((m) => m.id !== behavior.modelSettings.modelId)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </select>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaygroundOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                  title="Hide playground"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={clearPlayground}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={runPlayground}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[var(--apple-blue)] text-white text-sm font-medium hover:bg-[var(--apple-blue)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play size={14} />
                      Run
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Playground Content */}
            <div className="flex h-64">
              {/* Input */}
              <div className="flex-1 p-4 border-r border-[var(--border-subtle)]">
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">
                  Input
                </label>
                {(behavior.type === 'vision-scorer' || behavior.type === 'extractor') && (
                  <div className="mb-3">
                    <div className="w-full h-20 border-2 border-dashed border-[var(--border-subtle)] rounded-xl flex items-center justify-center cursor-pointer hover:border-[var(--apple-blue)] transition-colors">
                      {playgroundInput.imageUrl ? (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 bg-[var(--surface-elevated)] rounded-lg flex items-center justify-center">
                            <span className="text-xs text-[var(--text-secondary)]">📷 Image uploaded</span>
                          </div>

                        </div>
                      ) : (
                        <span className="text-xs text-[var(--text-tertiary)]">
                          Click to upload image
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <textarea
                  value={playgroundInput.text || ''}
                  onChange={(e) => setPlaygroundInput({ ...playgroundInput, text: e.target.value })}
                  placeholder={
                    behavior.type === 'vision-scorer'
                      ? 'Add context (e.g., "going to a business meeting")'
                      : 'Enter your input...'
                  }
                  className="w-full h-24 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none focus:outline-none focus:border-[var(--apple-blue)]"
                />
              </div>

              {/* Output(s) */}
              <div className={`flex-1 p-4 ${compareMode ? 'flex gap-4' : ''}`}>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">
                  Output
                </label>
                {playgroundOutputs.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-sm text-[var(--text-tertiary)]">
                    Run to see output
                  </div>
                ) : (
                  <div className={`${compareMode ? 'flex gap-4 h-full' : 'h-full'}`}>
                    {playgroundOutputs.map((output, idx) => {
                      const model = models.find((m) => m.id === output.modelId);
                      return (
                        <div
                          key={idx}
                          className={`${compareMode ? 'flex-1' : ''} bg-[var(--surface-elevated)] rounded-xl p-3 overflow-y-auto`}
                          style={{ maxHeight: compareMode ? '150px' : '140px' }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-[var(--text-secondary)]">
                              {model?.name}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
                              <span>{output.latencyMs.toFixed(0)}ms</span>
                              <span>${output.costUsd.toFixed(4)}</span>
                            </div>
                          </div>
                          <pre className="text-xs text-[var(--text-primary)] whitespace-pre-wrap font-mono">
                            {JSON.stringify(output.result, null, 2)}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {!isPlaygroundOpen && (
            <div className="border-t border-[var(--border-subtle)] bg-black/20 backdrop-blur-xl px-4 py-2 flex items-center justify-between">
              <div className="text-sm text-[var(--text-tertiary)]">Playground hidden</div>
              <button
                type="button"
                onClick={() => setIsPlaygroundOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors"
              >
                <ChevronUp size={14} />
                Show Playground
              </button>
            </div>
          )}
        </main>

        {/* Right Pane - Compliance / Why / Tool Traces */}
        {isInspectorOpen && (
          <aside className="w-80 bg-black/30 backdrop-blur-xl border-l border-[var(--border-subtle)] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="font-medium text-[var(--text-primary)]">Inspector</h3>
              <button
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                title="Hide inspector"
              >
                <ChevronDown size={16} />
              </button>
            </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Schema Status */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-3">Schema Status</h4>
              {playgroundOutputs.length > 0 ? (
                playgroundOutputs.map((output, idx) => (
                  <div key={idx} className="flex items-center justify-between mb-2 last:mb-0">
                    <span className="text-xs text-[var(--text-primary)]">
                      {models.find((m) => m.id === output.modelId)?.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        output.schemaStatus === 'valid'
                          ? 'bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]'
                          : 'bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)]'
                      }`}
                    >
                      {output.schemaStatus === 'valid' ? '✓ Valid' : '✗ Invalid'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--text-tertiary)]">Run playground to check</p>
              )}
            </div>

            {/* Safety Status */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-3">Safety Status</h4>
              {playgroundOutputs.length > 0 ? (
                playgroundOutputs.map((output, idx) => (
                  <div key={idx} className="flex items-center justify-between mb-2 last:mb-0">
                    <span className="text-xs text-[var(--text-primary)]">
                      {models.find((m) => m.id === output.modelId)?.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        output.safetyStatus === 'pass'
                          ? 'bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]'
                          : output.safetyStatus === 'warning'
                          ? 'bg-[var(--color-accent-yellow)]/15 text-[var(--color-accent-yellow)]'
                          : 'bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)]'
                      }`}
                    >
                      {output.safetyStatus === 'pass' ? '✓ Pass' : output.safetyStatus === 'warning' ? '⚠ Warning' : '✗ Fail'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--text-tertiary)]">Run playground to check</p>
              )}
            </div>

            {/* Rules Hit */}
            {playgroundOutputs.length > 0 && playgroundOutputs[0].rulesHit.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-3">Rules Applied</h4>
                <ul className="space-y-2">
                  {playgroundOutputs[0].rulesHit.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-[var(--color-accent-green)] mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-[var(--text-primary)]">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tool Traces (for tool-use agents) */}
            {behavior.type === 'tool-use-agent' && toolTraces.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-3">Tool Calls</h4>
                <div className="space-y-2">
                  {toolTraces[0].calls.map((call) => (
                    <div
                      key={call.id}
                      className="bg-black/30 border border-white/10 rounded-lg p-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-[var(--apple-blue)]">
                          {call.name}()
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)]">
                          {call.latencyMs}ms
                        </span>
                      </div>
                      <pre className="text-[10px] text-[var(--text-secondary)] font-mono">
                        {JSON.stringify(call.arguments, null, 2)}
                      </pre>
                      {call.result && (
                        <div className="mt-1 pt-1 border-t border-[var(--border-subtle)]">
                          <pre className="text-[10px] text-[var(--color-accent-green)] font-mono">
                            → {JSON.stringify(call.result)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cost & Latency Estimates */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-3">
                Estimated Costs
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)]">Per call</span>
                  <span className="text-xs text-[var(--text-primary)]">
                    ~${((currentModel?.costPer1kTokens || 0.01) * 1.5).toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)]">Latency</span>
                  <span className="text-xs text-[var(--text-primary)]">{currentModel?.latency}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
        )}

        {!isInspectorOpen && (
          <aside className="w-12 bg-black/20 backdrop-blur-xl border-l border-[var(--border-subtle)] flex flex-col items-center py-3">
            <button
              type="button"
              onClick={() => setIsInspectorOpen(true)}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors"
              title="Show inspector"
            >
              <ChevronUp size={16} />
            </button>
          </aside>
        )}
      </div>
    </div>
  );
}

