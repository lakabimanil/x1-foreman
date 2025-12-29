'use client';

import { motion } from 'framer-motion';
import {
  Star,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  Mic,
  Wrench,
  AlertTriangle,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior, Model, ModelProvider } from '@/types/behaviors';

const providerColors: Record<ModelProvider, string> = {
  openai: '#10A37F',
  anthropic: '#D4A574',
  google: '#4285F4',
  other: '#6B7280',
};

const providerLabels: Record<ModelProvider, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  other: 'Other',
};

interface ModelsTabProps {
  behavior: Behavior;
}

function ModelCard({ model, isSelected, onSelect }: { model: Model; isSelected: boolean; onSelect: () => void }) {
  const providerColor = providerColors[model.provider];

  return (
    <motion.button
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative w-full p-5 rounded-2xl border-2 text-left transition-all ${
        isSelected
          ? 'border-[var(--apple-blue)] bg-[var(--apple-blue)]/5'
          : 'border-[var(--border-subtle)] hover:border-[var(--color-gray-75)] bg-[var(--surface-card)]'
      }`}
    >
      {/* Provider Badge */}
      <div
        className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
        style={{ backgroundColor: providerColor }}
      >
        {providerLabels[model.provider]}
      </div>

      {/* Model Name */}
      <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-3 pr-20">{model.name}</h3>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Quality */}
        <div>
          <span className="text-xs text-[var(--text-tertiary)] block mb-1">Quality</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < model.qualityScore ? 'fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]' : 'text-[var(--color-gray-125)]'}
              />
            ))}
          </div>
        </div>

        {/* Latency */}
        <div>
          <span className="text-xs text-[var(--text-tertiary)] block mb-1">Latency</span>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-[var(--color-accent-blue)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">{model.latency}</span>
          </div>
        </div>

        {/* Cost */}
        <div>
          <span className="text-xs text-[var(--text-tertiary)] block mb-1">Cost</span>
          <div className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-[var(--color-accent-green)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              ${model.costPer1kTokens}/1k
            </span>
          </div>
        </div>
      </div>

      {/* Modalities */}
      <div className="flex items-center gap-2 mb-3">
        {model.modalities.includes('text') && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface-elevated)] text-xs text-[var(--text-secondary)]">
            <MessageSquare size={12} />
            Text
          </div>
        )}
        {model.modalities.includes('vision') && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface-elevated)] text-xs text-[var(--text-secondary)]">
            <Eye size={12} />
            Vision
          </div>
        )}
        {model.modalities.includes('audio') && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface-elevated)] text-xs text-[var(--text-secondary)]">
            <Mic size={12} />
            Audio
          </div>
        )}
        {model.modalities.includes('tools') && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface-elevated)] text-xs text-[var(--text-secondary)]">
            <Wrench size={12} />
            Tools
          </div>
        )}
      </div>

      {/* Constraints */}
      {model.constraints.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-[var(--color-accent-yellow)]">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{model.constraints.join(', ')}</span>
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[var(--apple-blue)] flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}
    </motion.button>
  );
}

export function ModelsTab({ behavior }: ModelsTabProps) {
  const { models, updateModelSettings } = useBehaviorStore();

  const handleModelSelect = (modelId: string) => {
    updateModelSettings(behavior.id, { modelId });
  };

  const selectedModel = models.find((m) => m.id === behavior.modelSettings.modelId);

  return (
    <div className="p-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Model Selection</h2>
          <p className="text-[var(--text-secondary)]">
            Choose the AI model that best fits your quality, speed, and cost requirements.
          </p>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={model.id === behavior.modelSettings.modelId}
              onSelect={() => handleModelSelect(model.id)}
            />
          ))}
        </div>

        {/* Model Settings */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-6 border border-[var(--border-subtle)]">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Model Settings</h3>

          <div className="space-y-6">
            {/* Temperature */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Temperature
                </label>
                <span className="text-sm text-[var(--text-primary)] font-mono">
                  {behavior.modelSettings.temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={behavior.modelSettings.temperature}
                onChange={(e) =>
                  updateModelSettings(behavior.id, { temperature: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                <span>Deterministic</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Max Output Length */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Max Output Length
                </label>
                <span className="text-sm text-[var(--text-primary)] font-mono">
                  {behavior.modelSettings.maxOutputLength} tokens
                </span>
              </div>
              <input
                type="range"
                min="256"
                max="4096"
                step="256"
                value={behavior.modelSettings.maxOutputLength}
                onChange={(e) =>
                  updateModelSettings(behavior.id, { maxOutputLength: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strict JSON Mode */}
              <div className="flex items-center justify-between p-4 bg-[var(--surface-elevated)] rounded-xl">
                <div>
                  <span className="text-sm font-medium text-[var(--text-primary)] block">
                    Strict JSON Mode
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {selectedModel?.supportsStrictJson ? 'Supported' : 'Not supported'}
                  </span>
                </div>
                <button
                  onClick={() =>
                    updateModelSettings(behavior.id, {
                      strictJsonMode: !behavior.modelSettings.strictJsonMode,
                    })
                  }
                  disabled={!selectedModel?.supportsStrictJson}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    behavior.modelSettings.strictJsonMode && selectedModel?.supportsStrictJson
                      ? 'bg-[var(--apple-blue)]'
                      : 'bg-[var(--border-subtle)]'
                  } ${!selectedModel?.supportsStrictJson ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      behavior.modelSettings.strictJsonMode && selectedModel?.supportsStrictJson
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Tool Use */}
              <div className="flex items-center justify-between p-4 bg-[var(--surface-elevated)] rounded-xl">
                <div>
                  <span className="text-sm font-medium text-[var(--text-primary)] block">
                    Tool Use
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {selectedModel?.supportsTools ? 'Supported' : 'Not supported'}
                  </span>
                </div>
                <button
                  onClick={() =>
                    updateModelSettings(behavior.id, {
                      toolUseEnabled: !behavior.modelSettings.toolUseEnabled,
                    })
                  }
                  disabled={!selectedModel?.supportsTools}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    behavior.modelSettings.toolUseEnabled && selectedModel?.supportsTools
                      ? 'bg-[var(--apple-blue)]'
                      : 'bg-[var(--border-subtle)]'
                  } ${!selectedModel?.supportsTools ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      behavior.modelSettings.toolUseEnabled && selectedModel?.supportsTools
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Vision Detail */}
              {selectedModel?.supportsVision && (
                <div className="p-4 bg-[var(--surface-elevated)] rounded-xl">
                  <span className="text-sm font-medium text-[var(--text-primary)] block mb-2">
                    Vision Detail
                  </span>
                  <select
                    value={behavior.modelSettings.visionDetail}
                    onChange={(e) =>
                      updateModelSettings(behavior.id, {
                        visionDetail: e.target.value as 'low' | 'high' | 'auto',
                      })
                    }
                    className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--apple-blue)]"
                  >
                    <option value="auto">Auto</option>
                    <option value="low">Low (faster)</option>
                    <option value="high">High (more accurate)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-6 border border-[var(--border-subtle)]">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--apple-purple)]" />
            Quick Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="text-left py-3 text-[var(--text-tertiary)] font-medium">Model</th>
                  <th className="text-center py-3 text-[var(--text-tertiary)] font-medium">Quality</th>
                  <th className="text-center py-3 text-[var(--text-tertiary)] font-medium">Latency</th>
                  <th className="text-center py-3 text-[var(--text-tertiary)] font-medium">Cost/1k</th>
                  <th className="text-center py-3 text-[var(--text-tertiary)] font-medium">Vision</th>
                  <th className="text-center py-3 text-[var(--text-tertiary)] font-medium">Tools</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr
                    key={model.id}
                    className={`border-b border-[var(--border-subtle)] last:border-0 ${
                      model.id === behavior.modelSettings.modelId ? 'bg-[var(--apple-blue)]/5' : ''
                    }`}
                  >
                    <td className="py-3 font-medium text-[var(--text-primary)]">{model.name}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < model.qualityScore ? 'fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]' : 'text-[var(--color-gray-125)]'}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-center text-[var(--text-secondary)]">{model.latency}</td>
                    <td className="py-3 text-center text-[var(--text-secondary)]">${model.costPer1kTokens}</td>
                    <td className="py-3 text-center">
                      {model.supportsVision ? (
                        <Check size={16} className="text-[var(--color-accent-green)] mx-auto" />
                      ) : (
                        <X size={16} className="text-[var(--color-gray-75)] mx-auto" />
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {model.supportsTools ? (
                        <Check size={16} className="text-[var(--color-accent-green)] mx-auto" />
                      ) : (
                        <X size={16} className="text-[var(--color-gray-75)] mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

