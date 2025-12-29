'use client';

import { motion } from 'framer-motion';
import {
  Eye,
  FileText,
  MessageSquare,
  Tags,
  Wrench,
  Brain,
  Calendar,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior, BehaviorType } from '@/types/behaviors';

const behaviorTypeConfig: Record<BehaviorType, { label: string; icon: typeof Eye; color: string; description: string }> = {
  'vision-scorer': { label: 'Vision Scorer', icon: Eye, color: 'var(--color-accent-purple)', description: 'Analyze images and provide ratings or assessments' },
  'extractor': { label: 'Extractor', icon: FileText, color: 'var(--color-accent-blue)', description: 'Extract structured data from documents or images' },
  'classifier': { label: 'Classifier', icon: Tags, color: 'var(--color-accent-green)', description: 'Categorize and label input content' },
  'generator': { label: 'Generator', icon: MessageSquare, color: 'var(--color-accent-yellow)', description: 'Generate text responses or content' },
  'tool-use-agent': { label: 'Tool-Use Agent', icon: Wrench, color: 'var(--color-accent-red)', description: 'Conversational agent that can call external tools' },
};

interface OverviewTabProps {
  behavior: Behavior;
}

export function OverviewTab({ behavior }: OverviewTabProps) {
  const { updateBehavior, models, getVersionsForBehavior, getExamplesForBehavior, getEvalRunsForBehavior } = useBehaviorStore();
  
  const typeConfig = behaviorTypeConfig[behavior.type];
  const TypeIcon = typeConfig.icon;
  const currentModel = models.find((m) => m.id === behavior.modelSettings.modelId);
  const versions = getVersionsForBehavior(behavior.id);
  const examples = getExamplesForBehavior(behavior.id);
  const evalRuns = getEvalRunsForBehavior(behavior.id);
  const lastEval = evalRuns[0];

  const handleTypeChange = (newType: BehaviorType) => {
    updateBehavior(behavior.id, { type: newType });
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
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{behavior.name}</h2>
          <p className="text-[var(--text-secondary)]">{behavior.description}</p>
        </div>

        {/* Behavior Type Selector */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">
            Behavior Type
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(behaviorTypeConfig) as BehaviorType[]).map((type) => {
              const config = behaviorTypeConfig[type];
              const Icon = config.icon;
              const isSelected = behavior.type === type;

              return (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-[var(--apple-blue)] bg-[var(--apple-blue)]/10'
                      : 'border-[var(--border-subtle)] hover:border-[var(--color-gray-75)]'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon size={20} style={{ color: config.color }} />
                  </div>
                  <h3 className="font-medium text-[var(--text-primary)] text-sm mb-1">
                    {config.label}
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)] line-clamp-2">
                    {config.description}
                  </p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--apple-blue)] flex items-center justify-center">
                      <Sparkles size={12} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--surface-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)] mb-2">
              <Brain size={14} />
              <span className="text-xs">Model</span>
            </div>
            <p className="font-medium text-[var(--text-primary)]">{currentModel?.name || 'Not set'}</p>
          </div>

          <div className="bg-[var(--surface-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)] mb-2">
              <Activity size={14} />
              <span className="text-xs">Shipped Version</span>
            </div>
            <p className="font-medium text-[var(--text-primary)]">
              v{versions.find((v) => v.isShipped)?.versionNumber || 1}
            </p>
          </div>

          <div className="bg-[var(--surface-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)] mb-2">
              <Sparkles size={14} />
              <span className="text-xs">Examples</span>
            </div>
            <p className="font-medium text-[var(--text-primary)]">{examples.length}</p>
          </div>

          <div className="bg-[var(--surface-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)] mb-2">
              <Calendar size={14} />
              <span className="text-xs">Last Eval</span>
            </div>
            <p className="font-medium text-[var(--text-primary)]">
              {lastEval ? `${(lastEval.passRate * 100).toFixed(0)}% pass` : 'No evals'}
            </p>
          </div>
        </div>

        {/* Name & Description Edit */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-5 border border-[var(--border-subtle)] space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
              Behavior Name
            </label>
            <input
              type="text"
              value={behavior.name}
              onChange={(e) => updateBehavior(behavior.id, { name: e.target.value })}
              className="w-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--apple-blue)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
              Description
            </label>
            <textarea
              value={behavior.description}
              onChange={(e) => updateBehavior(behavior.id, { description: e.target.value })}
              rows={3}
              className="w-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--apple-blue)]"
            />
          </div>
        </div>

        {/* Current Type Info */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            backgroundColor: `${typeConfig.color}10`,
            borderColor: `${typeConfig.color}30`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${typeConfig.color}25` }}
            >
              <TypeIcon size={24} style={{ color: typeConfig.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                {typeConfig.label} Behavior
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                {typeConfig.description}
              </p>
              <div className="text-xs text-[var(--text-tertiary)]">
                <strong>Suggested use cases:</strong>{' '}
                {behavior.type === 'vision-scorer' && 'Product ratings, visual quality assessment, style evaluation'}
                {behavior.type === 'extractor' && 'Document parsing, receipt scanning, form data extraction'}
                {behavior.type === 'classifier' && 'Content moderation, sentiment analysis, ticket routing'}
                {behavior.type === 'generator' && 'Email drafts, support responses, content creation'}
                {behavior.type === 'tool-use-agent' && 'Sales assistants, booking agents, CRM automation'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

