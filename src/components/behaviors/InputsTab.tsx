'use client';

import { motion } from 'framer-motion';
import {
  MessageSquare,
  Image,
  Mic,
  File,
  Wrench,
  Plus,
  X,
  Info,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior } from '@/types/behaviors';

interface InputsTabProps {
  behavior: Behavior;
}

const modalityConfig = [
  { id: 'text', label: 'Text', icon: MessageSquare, description: 'Plain text input' },
  { id: 'image', label: 'Image', icon: Image, description: 'Photos and screenshots' },
  { id: 'audio', label: 'Audio', icon: Mic, description: 'Voice recordings' },
  { id: 'files', label: 'Files', icon: File, description: 'Documents (PDF, etc.)' },
  { id: 'tool-calls', label: 'Tool Calls', icon: Wrench, description: 'External API results' },
] as const;

export function InputsTab({ behavior }: InputsTabProps) {
  const { updateInputConfig } = useBehaviorStore();

  const toggleModality = (modality: string) => {
    const current = behavior.inputConfig.modalities as string[];
    const isEnabled = current.includes(modality);
    const updatedModalities = isEnabled ? current.filter((m) => m !== modality) : [...current, modality];

    // If a modality gets disabled, it can't remain "required".
    const updatedRequiredFields = isEnabled
      ? behavior.inputConfig.requiredFields.filter((f) => f !== modality)
      : behavior.inputConfig.requiredFields;

    updateInputConfig(behavior.id, {
      modalities: updatedModalities as typeof behavior.inputConfig.modalities,
      requiredFields: updatedRequiredFields,
    });
  };

  const toggleRequiredField = (field: string) => {
    const current = behavior.inputConfig.requiredFields;
    const updated = current.includes(field)
      ? current.filter((f) => f !== field)
      : [...current, field];
    updateInputConfig(behavior.id, { requiredFields: updated });
  };

  const enabledModalities = modalityConfig.filter((m) =>
    (behavior.inputConfig.modalities as string[]).includes(m.id)
  );

  return (
    <div className="p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Input Configuration</h2>
          <p className="text-[var(--text-secondary)]">
            Define what types of input this behavior accepts and their requirements.
          </p>
        </div>

        {/* Modalities */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <div className="text-sm font-semibold text-[var(--text-primary)]">Accepted input types</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              Turn on what this behavior can receive (text, images, files, tool results).
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {modalityConfig.map((modality) => {
              const Icon = modality.icon;
              const isEnabled = (behavior.inputConfig.modalities as string[]).includes(modality.id);

              return (
                <div key={modality.id} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className={isEnabled ? 'text-[var(--apple-blue)]' : 'text-[var(--text-tertiary)]'} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-[var(--text-primary)]">{modality.label}</div>
                        {isEnabled && behavior.inputConfig.requiredFields.includes(modality.id) && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)] font-semibold">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)] mt-1 truncate">
                        {modality.description}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    onClick={() => toggleModality(modality.id)}
                    className={`relative w-11 h-6 rounded-full border transition-colors flex-shrink-0 ${
                      isEnabled ? 'bg-[var(--apple-blue)] border-[var(--apple-blue)]/30' : 'bg-white/10 border-white/10'
                    }`}
                    title={isEnabled ? `Disable ${modality.label}` : `Enable ${modality.label}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Required Fields Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)]">Required fields</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                Mark which enabled inputs must be present for a valid request.
              </div>
            </div>
          </div>

          {enabledModalities.length === 0 ? (
            <div className="text-sm text-[var(--text-tertiary)]">Enable at least one input type above.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {enabledModalities.map((m) => {
                const isRequired = behavior.inputConfig.requiredFields.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleRequiredField(m.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                      isRequired
                        ? 'bg-[var(--color-accent-red)]/12 border-[var(--color-accent-red)]/25 text-[var(--color-accent-red)]'
                        : 'bg-white/5 border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10'
                    }`}
                    title={isRequired ? 'Click to make optional' : 'Click to require'}
                  >
                    <span>{m.id}</span>
                    {isRequired ? <X size={12} /> : <Plus size={12} className="opacity-70" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Constraints */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="text-sm font-semibold text-[var(--text-primary)] mb-4">Constraints</div>
          <div className="space-y-4">
            {/* File Limit */}
            {(behavior.inputConfig.modalities as string[]).includes('files') && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Max files per request</span>
                  <span className="text-sm text-[var(--text-primary)] font-mono">
                    {behavior.inputConfig.fileLimit || 10}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={behavior.inputConfig.fileLimit || 10}
                  onChange={(e) =>
                    updateInputConfig(behavior.id, { fileLimit: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            )}

            {/* Ask Follow-up Toggle */}
            <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl">
              <div>
                <span className="text-sm font-medium text-[var(--text-primary)] block">
                  Ask follow-up if missing info
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  AI will prompt for required inputs if not provided
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={behavior.inputConfig.askFollowUpIfMissing}
                onClick={() =>
                  updateInputConfig(behavior.id, {
                    askFollowUpIfMissing: !behavior.inputConfig.askFollowUpIfMissing,
                  })
                }
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  behavior.inputConfig.askFollowUpIfMissing
                    ? 'bg-[var(--apple-blue)]'
                    : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    behavior.inputConfig.askFollowUpIfMissing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* OCR Toggle (for extractors) */}
            {behavior.type === 'extractor' && (
              <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl">
                <div>
                  <span className="text-sm font-medium text-[var(--text-primary)] block">
                    OCR Processing
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    Extract text from images and scanned documents
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!behavior.inputConfig.ocrEnabled}
                  onClick={() =>
                    updateInputConfig(behavior.id, {
                      ocrEnabled: !behavior.inputConfig.ocrEnabled,
                    })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    behavior.inputConfig.ocrEnabled
                      ? 'bg-[var(--apple-blue)]'
                      : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      behavior.inputConfig.ocrEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Type-specific hints */}
        <div className="bg-[var(--color-accent-blue)]/10 rounded-2xl p-5 border border-[var(--color-accent-blue)]/20">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-[var(--apple-blue)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">
                Input tips for {behavior.type.replace('-', ' ')} behaviors
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {behavior.type === 'vision-scorer' &&
                  'Image input is typically required. Text can provide context like occasion or style preferences.'}
                {behavior.type === 'extractor' &&
                  'Document or image input is required. Enable OCR for scanned documents. Consider file size limits for large PDFs.'}
                {behavior.type === 'classifier' &&
                  'Text is the primary input. Consider adding image support for multi-modal classification.'}
                {behavior.type === 'generator' &&
                  'Text input is required. Adding context placeholders helps personalize outputs.'}
                {behavior.type === 'tool-use-agent' &&
                  'Enable tool-calls to receive external API results. Text is used for conversation.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

