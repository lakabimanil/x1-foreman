'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Target,
  ListChecks,
  Shield,
  MessageSquare,
  Code,
  AlertTriangle,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior, InstructionRule, Guardrail } from '@/types/behaviors';

interface InstructionsTabProps {
  behavior: Behavior;
}

const toneStyles = [
  { id: 'coach', label: 'Coach', description: 'Supportive and guiding' },
  { id: 'direct', label: 'Direct', description: 'Clear and concise' },
  { id: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { id: 'strict', label: 'Strict', description: 'Formal and precise' },
] as const;

export function InstructionsTab({ behavior }: InstructionsTabProps) {
  const { updateInstructions } = useBehaviorStore();
  const [showRawPrompt, setShowRawPrompt] = useState(false);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  const handleAddRule = () => {
    const newRule: InstructionRule = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      priority: 'medium',
    };
    updateInstructions(behavior.id, {
      rules: [...behavior.instructions.rules, newRule],
    });
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<InstructionRule>) => {
    updateInstructions(behavior.id, {
      rules: behavior.instructions.rules.map((r) =>
        r.id === ruleId ? { ...r, ...updates } : r
      ),
    });
  };

  const handleRemoveRule = (ruleId: string) => {
    updateInstructions(behavior.id, {
      rules: behavior.instructions.rules.filter((r) => r.id !== ruleId),
    });
  };

  const handleReorderRules = (newOrder: InstructionRule[]) => {
    updateInstructions(behavior.id, { rules: newOrder });
  };

  const handleAddGuardrail = () => {
    const newGuardrail: Guardrail = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      enabled: true,
    };
    updateInstructions(behavior.id, {
      guardrails: [...behavior.instructions.guardrails, newGuardrail],
    });
  };

  const handleUpdateGuardrail = (id: string, updates: Partial<Guardrail>) => {
    updateInstructions(behavior.id, {
      guardrails: behavior.instructions.guardrails.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    });
  };

  const handleRemoveGuardrail = (id: string) => {
    updateInstructions(behavior.id, {
      guardrails: behavior.instructions.guardrails.filter((g) => g.id !== id),
    });
  };

  // Generate mock raw prompt
  const generatedPrompt = `You are an AI assistant with the following behavior:

Goal: ${behavior.instructions.goal}

${behavior.instructions.rubric ? `Rubric:\n${behavior.instructions.rubric}\n` : ''}
Rules:
${behavior.instructions.rules.map((r, i) => `${i + 1}. [${r.priority.toUpperCase()}] ${r.text}${r.condition ? ` (${r.condition})` : ''}`).join('\n')}

Tone: ${behavior.instructions.tone.style} (intensity: ${behavior.instructions.tone.intensity}%)

Guardrails:
${behavior.instructions.guardrails.filter((g) => g.enabled).map((g) => `- ${g.text}`).join('\n')}

If you cannot fulfill a request: ${behavior.instructions.refusalBehavior}

Context placeholders: ${behavior.instructions.contextPlaceholders.join(', ')}`;

  return (
    <div className="p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Instructions</h2>
          <p className="text-[var(--text-secondary)]">
            Configure the behavior's goal, rules, tone, and safety guardrails.
          </p>
        </div>

        {/* Goal */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-[var(--apple-blue)]" />
            <label className="text-sm font-medium text-[var(--text-primary)]">Goal</label>
          </div>
          <textarea
            value={behavior.instructions.goal}
            onChange={(e) => updateInstructions(behavior.id, { goal: e.target.value })}
            rows={2}
            placeholder="What should this behavior accomplish?"
            className="w-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--apple-blue)]"
          />
        </div>

        {/* Rubric (optional) */}
        {(behavior.type === 'vision-scorer' || behavior.type === 'classifier') && (
          <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks size={18} className="text-[var(--color-accent-purple)]" />
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Rubric / Scoring Criteria
              </label>
            </div>
            <textarea
              value={behavior.instructions.rubric || ''}
              onChange={(e) => updateInstructions(behavior.id, { rubric: e.target.value })}
              rows={4}
              placeholder="Define the scoring criteria and weights..."
              className="w-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--apple-blue)] font-mono text-sm"
            />
          </div>
        )}

        {/* Rules */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListChecks size={18} className="text-[var(--color-accent-green)]" />
              <label className="text-sm font-medium text-[var(--text-primary)]">Rules</label>
              <span className="text-xs text-[var(--text-tertiary)]">
                ({behavior.instructions.rules.length})
              </span>
            </div>
            <button
              onClick={handleAddRule}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--apple-blue)] text-white text-xs font-medium hover:bg-[var(--apple-blue)]/90 transition-colors"
            >
              <Plus size={14} />
              Add Rule
            </button>
          </div>

          <Reorder.Group
            axis="y"
            values={behavior.instructions.rules}
            onReorder={handleReorderRules}
            className="space-y-2"
          >
            <AnimatePresence>
              {behavior.instructions.rules.map((rule) => (
                <Reorder.Item
                  key={rule.id}
                  value={rule}
                  className="bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)] overflow-hidden"
                >
                  <div className="flex items-start gap-3 p-4">
                    <div className="cursor-grab active:cursor-grabbing mt-1">
                      <GripVertical size={16} className="text-[var(--text-tertiary)]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={rule.text}
                        onChange={(e) => handleUpdateRule(rule.id, { text: e.target.value })}
                        placeholder="Enter rule..."
                        className="w-full bg-transparent text-[var(--text-primary)] text-sm focus:outline-none"
                      />
                      
                      {expandedRule === rule.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 pt-3 border-t border-[var(--border-subtle)]"
                        >
                          <input
                            type="text"
                            value={rule.condition || ''}
                            onChange={(e) =>
                              handleUpdateRule(rule.id, { condition: e.target.value || undefined })
                            }
                            placeholder="Optional: if/then condition..."
                            className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--apple-blue)]"
                          />
                        </motion.div>
                      )}
                    </div>

                    <select
                      value={rule.priority}
                      onChange={(e) =>
                        handleUpdateRule(rule.id, {
                          priority: e.target.value as 'high' | 'medium' | 'low',
                        })
                      }
                      className={`px-2 py-1 rounded-lg text-xs font-medium border-0 focus:outline-none ${
                        rule.priority === 'high'
                          ? 'bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)]'
                          : rule.priority === 'medium'
                          ? 'bg-[var(--color-accent-yellow)]/15 text-[var(--color-accent-yellow)]'
                          : 'bg-[var(--color-gray-75)]/15 text-[var(--color-gray-75)]'
                      }`}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    <button
                      onClick={() =>
                        setExpandedRule(expandedRule === rule.id ? null : rule.id)
                      }
                      className="p-1.5 rounded-lg hover:bg-[var(--surface-card)] text-[var(--text-tertiary)]"
                    >
                      {expandedRule === rule.id ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>

                    <button
                      onClick={() => handleRemoveRule(rule.id)}
                      className="p-1.5 rounded-lg hover:bg-[var(--color-accent-red)]/10 text-[var(--text-tertiary)] hover:text-[var(--color-accent-red)]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {behavior.instructions.rules.length === 0 && (
            <p className="text-sm text-[var(--text-tertiary)] text-center py-8">
              No rules defined. Add rules to guide the AI's behavior.
            </p>
          )}
        </div>

        {/* Tone & Style */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={18} className="text-[var(--color-accent-yellow)]" />
            <label className="text-sm font-medium text-[var(--text-primary)]">Tone & Style</label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {toneStyles.map((style) => (
              <button
                key={style.id}
                onClick={() =>
                  updateInstructions(behavior.id, {
                    tone: { ...behavior.instructions.tone, style: style.id },
                  })
                }
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  behavior.instructions.tone.style === style.id
                    ? 'border-[var(--apple-blue)] bg-[var(--apple-blue)]/5'
                    : 'border-[var(--border-subtle)] hover:border-[var(--color-gray-75)]'
                }`}
              >
                <span className="font-medium text-sm text-[var(--text-primary)] block">
                  {style.label}
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">{style.description}</span>
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-[var(--text-secondary)]">Intensity</label>
              <span className="text-sm text-[var(--text-primary)] font-mono">
                {behavior.instructions.tone.intensity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={behavior.instructions.tone.intensity}
              onChange={(e) =>
                updateInstructions(behavior.id, {
                  tone: { ...behavior.instructions.tone, intensity: parseInt(e.target.value) },
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
              <span>Subtle</span>
              <span>Strong</span>
            </div>
          </div>
        </div>

        {/* Guardrails */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[var(--color-accent-red)]" />
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Guardrails & Policy
              </label>
            </div>
            <button
              onClick={handleAddGuardrail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-secondary)] text-xs font-medium hover:bg-[var(--surface-elevated)]/80 transition-colors"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {behavior.instructions.guardrails.map((guardrail) => (
              <div
                key={guardrail.id}
                className="flex items-center gap-3 p-3 bg-[var(--surface-elevated)] rounded-xl"
              >
                <button
                  onClick={() =>
                    handleUpdateGuardrail(guardrail.id, { enabled: !guardrail.enabled })
                  }
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    guardrail.enabled ? 'bg-[var(--color-accent-green)]' : 'bg-[var(--border-subtle)]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      guardrail.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <input
                  type="text"
                  value={guardrail.text}
                  onChange={(e) => handleUpdateGuardrail(guardrail.id, { text: e.target.value })}
                  placeholder="Enter guardrail..."
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${
                    guardrail.enabled ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                  }`}
                />
                <button
                  onClick={() => handleRemoveGuardrail(guardrail.id)}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-accent-red)]/10 text-[var(--text-tertiary)] hover:text-[var(--color-accent-red)]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Refusal Behavior */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-[var(--color-accent-yellow)]" />
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Refusal / Escalation Behavior
            </label>
          </div>
          <textarea
            value={behavior.instructions.refusalBehavior}
            onChange={(e) =>
              updateInstructions(behavior.id, { refusalBehavior: e.target.value })
            }
            rows={2}
            placeholder="What should the AI do if it cannot fulfill a request?"
            className="w-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--apple-blue)] text-sm"
          />
        </div>

        {/* Context Placeholders */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-3">
            <Code size={18} className="text-[var(--text-tertiary)]" />
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Context Placeholders
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {behavior.instructions.contextPlaceholders.map((placeholder, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-[var(--surface-elevated)] rounded-lg text-sm font-mono text-[var(--apple-blue)]"
              >
                {placeholder}
              </span>
            ))}
            <button className="px-3 py-1.5 border border-dashed border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-tertiary)] hover:border-[var(--apple-blue)] hover:text-[var(--apple-blue)] transition-colors">
              + Add
            </button>
          </div>
        </div>

        {/* View Generated Prompt */}
        <div className="bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
          <button
            onClick={() => setShowRawPrompt(!showRawPrompt)}
            className="w-full flex items-center justify-between p-5 hover:bg-[var(--surface-elevated)]/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {showRawPrompt ? (
                <EyeOff size={18} className="text-[var(--text-tertiary)]" />
              ) : (
                <Eye size={18} className="text-[var(--text-tertiary)]" />
              )}
              <span className="text-sm font-medium text-[var(--text-primary)]">
                View Generated Prompt
              </span>
            </div>
            {showRawPrompt ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <AnimatePresence>
            {showRawPrompt && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-[var(--border-subtle)]"
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3 text-[var(--color-accent-yellow)]">
                    <Lock size={14} />
                    <span className="text-xs font-medium">Read-only preview</span>
                  </div>
                  <pre className="bg-[var(--surface-elevated)] rounded-xl p-4 text-xs text-[var(--text-secondary)] font-mono whitespace-pre-wrap overflow-x-auto">
                    {generatedPrompt}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

