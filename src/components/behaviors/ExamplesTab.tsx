'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Tag,
  Star,
  Image,
  FileText,
  Trash2,
  Eye,
  X,
  Check,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior, BehaviorExample } from '@/types/behaviors';

interface ExamplesTabProps {
  behavior: Behavior;
}

export function ExamplesTab({ behavior }: ExamplesTabProps) {
  const { getExamplesForBehavior, addExample, removeExample } = useBehaviorStore();
  const examples = getExamplesForBehavior(behavior.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewingExample, setViewingExample] = useState<BehaviorExample | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Get unique tags
  const allTags = [...new Set(examples.flatMap((e) => e.tags))];

  // Filter examples
  const filteredExamples = examples.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !selectedTag || ex.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const goldenExamples = filteredExamples.filter((e) => e.isGolden);
  const regularExamples = filteredExamples.filter((e) => !e.isGolden);

  const handleAddExample = () => {
    const newExample: BehaviorExample = {
      id: Math.random().toString(36).substr(2, 9),
      behaviorId: behavior.id,
      name: 'New Example',
      input: { text: '' },
      expectedOutput: {},
      tags: [],
      isGolden: false,
    };
    addExample(newExample);
    setShowAddModal(false);
  };

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
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Examples</h2>
            <p className="text-[var(--text-secondary)]">
              Few-shot examples and golden test cases to guide the AI's behavior.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--apple-blue)] text-white text-sm font-medium hover:bg-[var(--apple-blue)]/90 transition-colors"
          >
            <Plus size={16} />
            Add Example
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <input
                type="text"
                placeholder="Search examples..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--apple-blue)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-colors border ${
                  !selectedTag
                    ? 'bg-[var(--apple-blue)] text-white border-[var(--apple-blue)]/30'
                    : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                }`}
              >
                All
              </button>
              {allTags.slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold transition-colors border ${
                    selectedTag === tag
                      ? 'bg-[var(--apple-purple)] text-white border-[var(--apple-purple)]/30'
                      : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {allTags.length > 6 && (
                <span className="text-xs text-[var(--text-tertiary)] px-2">
                  +{allTags.length - 6} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--surface-card)] rounded-2xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Total</span>
              <FileText size={16} className="text-[var(--text-tertiary)]" />
            </div>
            <div className="mt-2 text-3xl font-semibold text-[var(--text-primary)] tabular-nums">
              {examples.length}
            </div>
          </div>
          <div className="bg-[var(--surface-card)] rounded-2xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Golden</span>
              <Star size={16} className="text-[var(--color-accent-yellow)] fill-[var(--color-accent-yellow)]" />
            </div>
            <div className="mt-2 text-3xl font-semibold text-[var(--text-primary)] tabular-nums">
              {goldenExamples.length}
            </div>
          </div>
          <div className="bg-[var(--surface-card)] rounded-2xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Tags</span>
              <Tag size={16} className="text-[var(--text-tertiary)]" />
            </div>
            <div className="mt-2 text-3xl font-semibold text-[var(--text-primary)] tabular-nums">
              {allTags.length}
            </div>
          </div>
        </div>

        {/* Golden Examples Section */}
        {goldenExamples.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-[var(--color-accent-yellow)] fill-[var(--color-accent-yellow)]" />
              <h3 className="font-medium text-[var(--text-primary)]">Golden Examples</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goldenExamples.map((example) => (
                <ExampleCard
                  key={example.id}
                  example={example}
                  onView={() => setViewingExample(example)}
                  onDelete={() => removeExample(example.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Examples */}
        <div>
          <h3 className="font-medium text-[var(--text-primary)] mb-3">All Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {regularExamples.map((example) => (
                <ExampleCard
                  key={example.id}
                  example={example}
                  onView={() => setViewingExample(example)}
                  onDelete={() => removeExample(example.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Empty State */}
        {filteredExamples.length === 0 && (
          <div className="text-center py-12 bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)]">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              No examples found
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {searchQuery || selectedTag
                ? 'Try adjusting your search or filters.'
                : 'Add examples to help guide the AI behavior.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-[var(--apple-blue)] text-white text-sm font-medium hover:bg-[var(--apple-blue)]/90 transition-colors"
            >
              Add First Example
            </button>
          </div>
        )}
      </motion.div>

      {/* View Example Modal */}
      <AnimatePresence>
        {viewingExample && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewingExample(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
                className="bg-black/35 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {viewingExample.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {viewingExample.isGolden && (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-accent-yellow)]">
                        <Star size={12} className="fill-current" />
                        Golden
                      </span>
                    )}
                    {viewingExample.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-[var(--surface-elevated)] rounded text-xs text-[var(--text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setViewingExample(null)}
                  className="p-2 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--text-tertiary)]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[var(--text-tertiary)] mb-2 block">
                    Input
                  </label>
                  {viewingExample.input.imageUrl && (
                    <div className="w-full h-40 bg-[var(--surface-elevated)] rounded-xl mb-2 flex items-center justify-center">
                      <Image size={32} className="text-[var(--text-tertiary)]" />
                    </div>
                  )}
                  {viewingExample.input.text && (
                    <div className="bg-[var(--surface-elevated)] rounded-xl p-4 text-sm text-[var(--text-primary)]">
                      {viewingExample.input.text}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-tertiary)] mb-2 block">
                    Expected Output
                  </label>
                  <pre className="bg-[var(--surface-elevated)] rounded-xl p-4 text-xs text-[var(--color-accent-green)] font-mono overflow-x-auto">
                    {JSON.stringify(viewingExample.expectedOutput, null, 2)}
                  </pre>
                </div>

                {viewingExample.expectedRange && (
                  <div className="bg-[var(--color-accent-blue)]/10 rounded-xl p-4 border border-[var(--color-accent-blue)]/20">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      Expected Range:{' '}
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {viewingExample.expectedRange.field}: {viewingExample.expectedRange.min} -{' '}
                      {viewingExample.expectedRange.max}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Example Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/35 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Add New Example
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Create a new example to help guide the AI's behavior. You can add input data and expected output.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExample}
                  className="px-4 py-2 rounded-lg bg-[var(--apple-blue)] text-white font-medium hover:bg-[var(--apple-blue)]/90 transition-colors"
                >
                  Create Example
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExampleCard({
  example,
  onView,
  onDelete,
}: {
  example: BehaviorExample;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group bg-[var(--surface-card)] rounded-2xl border overflow-hidden transition-all hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]/30 ${
        example.isGolden ? 'border-[var(--color-accent-yellow)]/30' : 'border-[var(--border-subtle)]'
      }`}
    >
      {example.isGolden && (
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-accent-yellow)] to-[var(--apple-purple)]/70" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {example.isGolden && (
              <Star
                size={14}
                className="text-[var(--color-accent-yellow)] fill-[var(--color-accent-yellow)]"
              />
            )}
            <h4 className="font-medium text-[var(--text-primary)] text-sm">{example.name}</h4>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onView}
              className="p-2 rounded-xl hover:bg-white/5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors opacity-80 group-hover:opacity-100"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-xl hover:bg-[var(--color-accent-red)]/10 text-[var(--text-tertiary)] hover:text-[var(--color-accent-red)] transition-colors opacity-80 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Input preview */}
        <div className="flex items-center gap-2 mb-3">
          {example.input.imageUrl && (
            <div className="w-12 h-12 bg-black/20 border border-white/10 rounded-xl flex items-center justify-center">
              <Image size={16} className="text-[var(--text-tertiary)]" />
            </div>
          )}
          {example.input.text && (
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 flex-1">
              {example.input.text}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {example.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 bg-black/20 border border-white/10 rounded-full text-[10px] text-[var(--text-tertiary)]"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {example.tags.length > 4 && (
            <span className="px-2 py-0.5 text-[10px] text-[var(--text-tertiary)]">
              +{example.tags.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

