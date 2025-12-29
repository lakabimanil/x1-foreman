'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Apple,
  BadgeCheck,
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  ListChecks,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useBehaviorStore } from '@/store/useBehaviorStore';
import type { Behavior, OutputField } from '@/types/behaviors';

interface OutputsTabProps {
  behavior: Behavior;
}

type ResultSuggestion = {
  id: string;
  title: string;
  description: string;
  recommended?: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  // These are the hidden “data points” we store internally.
  fields: Array<Omit<OutputField, 'id'>>;
  // This is what a non-technical user sees as an example.
  exampleLines: string[];
};

const storageKeys = {
  tipsCollapsed: 'x1.results.tips.collapsed',
};

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function titleCaseFromKey(key: string) {
  return key
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function toSnakeCase(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

function dedupeKey(baseKey: string, existing: Set<string>) {
  if (!existing.has(baseKey)) return baseKey;
  let i = 2;
  while (existing.has(`${baseKey}_${i}`)) i += 1;
  return `${baseKey}_${i}`;
}

function sampleForType(type: OutputField['type']): string {
  switch (type) {
    case 'number':
      return '123';
    case 'boolean':
      return 'Yes';
    case 'array':
      return 'A, B, C';
    case 'object':
      return 'A breakdown (multiple values)';
    default:
      return 'Some text';
  }
}

const purposeByType: Record<Behavior['type'], { title: string; subtitle: string }> = {
  'vision-scorer': {
    title: 'What should appear on the meal result screen?',
    subtitle: 'Pick what you want the AI to return after a food photo. These results power what the user sees and what gets saved.',
  },
  extractor: {
    title: 'What should be filled in from the label?',
    subtitle: 'Pick what you want extracted so your app can save it into structured fields automatically.',
  },
  classifier: {
    title: 'How should feedback be categorized?',
    subtitle: 'Pick the categories your app needs so it can route feedback to the right place.',
  },
  generator: {
    title: 'What should the assistant produce?',
    subtitle: 'Pick what your UI needs to show or do after the assistant responds.',
  },
  'tool-use-agent': {
    title: 'What should happen next?',
    subtitle: 'Pick the pieces of information your app needs to move to the next step safely.',
  },
};

const suggestionsByType: Record<Behavior['type'], ResultSuggestion[]> = {
  'vision-scorer': [
    {
      id: 'foods',
      title: 'Foods detected',
      description: 'A simple list of foods in the photo.',
      recommended: true,
      icon: Apple,
      fields: [
        {
          name: 'food_items',
          label: 'Foods detected',
          type: 'array',
          required: true,
          description: 'List of identified foods',
        },
      ],
      exampleLines: ['Example: salmon, quinoa, roasted vegetables'],
    },
    {
      id: 'calories',
      title: 'Total calories',
      description: 'One number for the entire meal.',
      recommended: true,
      icon: Flame,
      fields: [
        {
          name: 'total_calories',
          label: 'Total calories',
          type: 'number',
          required: true,
          description: 'Total calories for the meal',
        },
      ],
      exampleLines: ['Example: 580 kcal'],
    },
    {
      id: 'macros',
      title: 'Macros (protein / carbs / fat)',
      description: 'A breakdown the app can show as a macro chart.',
      recommended: true,
      icon: BarChart3,
      fields: [
        {
          name: 'macros',
          label: 'Macros',
          type: 'object',
          required: true,
          description: 'Protein, carbs, fats breakdown',
        },
      ],
      exampleLines: ['Example: Protein 42g • Carbs 55g • Fat 18g'],
    },
    {
      id: 'portions',
      title: 'Portion sizes',
      description: 'Helpful serving-size guesses.',
      recommended: true,
      icon: ListChecks,
      fields: [
        {
          name: 'portion_estimates',
          label: 'Portion sizes',
          type: 'array',
          required: true,
          description: 'Estimated serving sizes',
        },
      ],
      exampleLines: ['Example: 5 oz • 3/4 cup • 1 cup'],
    },
    {
      id: 'confidence',
      title: 'Confidence',
      description: 'How sure the AI is (helps decide when to ask for another photo).',
      recommended: true,
      icon: BadgeCheck,
      fields: [
        {
          name: 'confidence',
          label: 'Confidence',
          type: 'number',
          required: true,
          description: 'Confidence score 0–1',
        },
      ],
      exampleLines: ['Example: High (91%)'],
    },
  ],

  extractor: [
    {
      id: 'product',
      title: 'Product name',
      description: 'What the product is called.',
      recommended: true,
      icon: Apple,
      fields: [{ name: 'product_name', label: 'Product name', type: 'string', required: true }],
      exampleLines: ['Example: Greek Yogurt'],
    },
    {
      id: 'serving',
      title: 'Serving size',
      description: 'The serving size text from the label.',
      recommended: true,
      icon: ListChecks,
      fields: [{ name: 'serving_size', label: 'Serving size', type: 'string', required: true }],
      exampleLines: ['Example: 1 cup (227g)'],
    },
    {
      id: 'calories',
      title: 'Calories per serving',
      description: 'The calories number from the label.',
      recommended: true,
      icon: Flame,
      fields: [{ name: 'calories_per_serving', label: 'Calories per serving', type: 'number', required: true }],
      exampleLines: ['Example: 150 kcal'],
    },
    {
      id: 'macros',
      title: 'Macros (fat / carbs / protein)',
      description: 'The three macro numbers.',
      recommended: true,
      icon: BarChart3,
      fields: [
        { name: 'total_fat', label: 'Total fat (g)', type: 'number', required: true },
        { name: 'carbohydrates', label: 'Carbohydrates (g)', type: 'number', required: true },
        { name: 'protein', label: 'Protein (g)', type: 'number', required: true },
      ],
      exampleLines: ['Example: Fat 4g • Carbs 8g • Protein 20g'],
    },
    {
      id: 'ingredients',
      title: 'Ingredients (optional)',
      description: 'A list of ingredients, if present.',
      icon: ListChecks,
      fields: [{ name: 'ingredients', label: 'Ingredients', type: 'array', required: false }],
      exampleLines: ['Example: milk, live cultures, sugar'],
    },
  ],

  classifier: [
    {
      id: 'category',
      title: 'Category',
      description: 'What type of feedback it is.',
      recommended: true,
      icon: ListChecks,
      fields: [{ name: 'label', label: 'Category', type: 'string', required: true }],
      exampleLines: ['Example: bug'],
    },
    {
      id: 'priority',
      title: 'Priority',
      description: 'How urgent it is.',
      recommended: true,
      icon: ShieldAlert,
      fields: [{ name: 'priority', label: 'Priority', type: 'string', required: true }],
      exampleLines: ['Example: P1 (urgent)'],
    },
    {
      id: 'themes',
      title: 'Key themes (optional)',
      description: 'A short list of topics mentioned.',
      icon: ListChecks,
      fields: [{ name: 'key_themes', label: 'Key themes', type: 'array', required: false }],
      exampleLines: ['Example: recognition, accuracy'],
    },
  ],

  generator: [
    {
      id: 'message',
      title: 'Message to show the user',
      description: 'The main response text.',
      recommended: true,
      icon: Sparkles,
      fields: [{ name: 'response', label: 'Message', type: 'string', required: true }],
      exampleLines: ['Example: Here’s what I found in your meal…'],
    },
    {
      id: 'next',
      title: 'Suggested next step (optional)',
      description: 'A short action your UI can show.',
      icon: ListChecks,
      fields: [{ name: 'suggested_action', label: 'Suggested next step', type: 'string', required: false }],
      exampleLines: ['Example: Try taking the photo from above'],
    },
    {
      id: 'escalation',
      title: 'Needs help from support?',
      description: 'Whether to route to a human or safety flow.',
      recommended: true,
      icon: ShieldAlert,
      fields: [{ name: 'requires_escalation', label: 'Needs support?', type: 'boolean', required: true }],
      exampleLines: ['Example: No'],
    },
  ],

  'tool-use-agent': [
    {
      id: 'message',
      title: 'Message to show the user',
      description: 'The main text response.',
      recommended: true,
      icon: Sparkles,
      fields: [{ name: 'response', label: 'Message', type: 'string', required: true }],
      exampleLines: ['Example: Based on your details, here’s a safe calorie goal…'],
    },
    {
      id: 'recommended',
      title: 'Recommended calories (optional)',
      description: 'A number your app can store and use.',
      icon: Flame,
      fields: [{ name: 'recommended_calories', label: 'Recommended calories', type: 'number', required: false }],
      exampleLines: ['Example: 1950'],
    },
    {
      id: 'next',
      title: 'Next step',
      description: 'Where the app should go next.',
      recommended: true,
      icon: ListChecks,
      fields: [{ name: 'next_step', label: 'Next step', type: 'string', required: true }],
      exampleLines: ['Example: Review daily macros'],
    },
  ],
};

export function OutputsTab({ behavior }: OutputsTabProps) {
  const { updateOutputSchema } = useBehaviorStore();

  const [tipsOpen, setTipsOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return window.localStorage.getItem(storageKeys.tipsCollapsed) !== '1';
    } catch {
      return true;
    }
  });

  const [customTitle, setCustomTitle] = useState('');
  const [customAlways, setCustomAlways] = useState(true);
  const [customStyle, setCustomStyle] = useState<OutputField['type']>('string');

  const purpose = purposeByType[behavior.type];
  const suggestions = useMemo(() => suggestionsByType[behavior.type] ?? [], [behavior.type]);

  const existingNames = useMemo(
    () => new Set(behavior.outputSchema.fields.map((f) => f.name)),
    [behavior.outputSchema.fields]
  );

  const suggestionFieldNames = useMemo(() => {
    const set = new Set<string>();
    suggestions.forEach((s) => s.fields.forEach((f) => set.add(f.name)));
    return set;
  }, [suggestions]);

  const hasAny = behavior.outputSchema.fields.length > 0;

  const setTips = (open: boolean) => {
    setTipsOpen(open);
    try {
      window.localStorage.setItem(storageKeys.tipsCollapsed, open ? '0' : '1');
    } catch {
      // ignore
    }
  };

  const groupStatus = (s: ResultSuggestion): 'off' | 'on' | 'partial' => {
    const present = s.fields.filter((f) => existingNames.has(f.name)).length;
    if (present === 0) return 'off';
    if (present === s.fields.length) return 'on';
    return 'partial';
  };

  const applySuggested = (s: ResultSuggestion) => {
    const status = groupStatus(s);
    const current = behavior.outputSchema.fields;

    if (status === 'on') {
      // Remove all internal fields for this suggestion
      updateOutputSchema(behavior.id, {
        mode: 'simple',
        fields: current.filter((f) => !s.fields.some((sf) => sf.name === f.name)),
      });
      return;
    }

    // Add missing internal fields (or complete partial)
    const byName = new Map(current.map((f) => [f.name, f]));
    const additions: OutputField[] = [];

    for (const sf of s.fields) {
      if (!byName.has(sf.name)) {
        additions.push({ id: generateId(), ...sf });
      }
    }

    updateOutputSchema(behavior.id, {
      mode: 'simple',
      fields: [...current, ...additions],
    });
  };

  const turnOnRecommended = () => {
    const current = behavior.outputSchema.fields;
    const byName = new Map(current.map((f) => [f.name, f]));
    const additions: OutputField[] = [];

    suggestions
      .filter((s) => s.recommended)
      .forEach((s) => {
        s.fields.forEach((sf) => {
          if (!byName.has(sf.name)) additions.push({ id: generateId(), ...sf });
        });
      });

    if (additions.length === 0) return;

    updateOutputSchema(behavior.id, {
      mode: 'simple',
      fields: [...current, ...additions],
    });
  };

  const removeAll = () => {
    updateOutputSchema(behavior.id, { mode: 'simple', fields: [] });
  };

  const setAlwaysForSuggestion = (s: ResultSuggestion, always: boolean) => {
    const names = new Set(s.fields.map((f) => f.name));
    updateOutputSchema(behavior.id, {
      mode: 'simple',
      fields: behavior.outputSchema.fields.map((f) => (names.has(f.name) ? { ...f, required: always } : f)),
    });
  };

  const removeSuggestion = (s: ResultSuggestion) => {
    updateOutputSchema(behavior.id, {
      mode: 'simple',
      fields: behavior.outputSchema.fields.filter((f) => !s.fields.some((sf) => sf.name === f.name)),
    });
  };

  const addCustom = () => {
    const title = customTitle.trim();
    if (!title) return;

    const baseKey = toSnakeCase(title) || 'result';
    const key = dedupeKey(baseKey, existingNames);

    const newField: OutputField = {
      id: generateId(),
      name: key,
      label: title,
      type: customStyle,
      required: customAlways,
      description: undefined,
    };

    updateOutputSchema(behavior.id, {
      mode: 'simple',
      fields: [...behavior.outputSchema.fields, newField],
    });

    setCustomTitle('');
    setCustomAlways(true);
    setCustomStyle('string');
  };

  const removeCustomField = (fieldId: string) => {
    updateOutputSchema(behavior.id, {
      mode: 'simple',
      fields: behavior.outputSchema.fields.filter((f) => f.id !== fieldId),
    });
  };

  const toggleCustomRequired = (fieldId: string) => {
    updateOutputSchema(behavior.id, {
      mode: 'simple',
      fields: behavior.outputSchema.fields.map((f) => (f.id === fieldId ? { ...f, required: !f.required } : f)),
    });
  };

  const customFields = useMemo(
    () => behavior.outputSchema.fields.filter((f) => !suggestionFieldNames.has(f.name)),
    [behavior.outputSchema.fields, suggestionFieldNames]
  );

  const selectedSuggestions = useMemo(() => {
    return suggestions.filter((s) => groupStatus(s) !== 'off');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions, behavior.outputSchema.fields]);

  return (
    <div className="p-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Results</h2>
          <p className="text-[var(--text-secondary)]">{purpose.title}</p>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">{purpose.subtitle}</p>
        </div>

        {/* Tips (no code, no JSON) */}
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl">
          <button
            onClick={() => setTips(!tipsOpen)}
            className="w-full flex items-center justify-between px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--apple-blue)]/10 flex items-center justify-center">
                <Sparkles size={18} className="text-[var(--apple-blue)]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-[var(--text-primary)]">How to set this up</div>
                <div className="text-xs text-[var(--text-secondary)]">3 steps — no technical knowledge needed</div>
              </div>
            </div>
            {tipsOpen ? (
              <ChevronUp size={18} className="text-[var(--text-tertiary)]" />
            ) : (
              <ChevronDown size={18} className="text-[var(--text-tertiary)]" />
            )}
          </button>

          <AnimatePresence>
            {tipsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5"
              >
                <ol className="text-sm text-[var(--text-secondary)] space-y-2">
                  <li>
                    <span className="font-semibold text-[var(--text-primary)]">1.</span> Click the results you want in
                    <span className="font-semibold text-[var(--text-primary)]"> Quick pick</span>.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--text-primary)]">2.</span> (Optional) Mark a result as
                    <span className="font-semibold text-[var(--text-primary)]"> Always include</span>.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--text-primary)]">3.</span> Scroll to the Playground and hit
                    <span className="font-semibold text-[var(--text-primary)]"> Run</span> to see it in action.
                  </li>
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick pick */}
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)]">Quick pick</div>
              <div className="text-xs text-[var(--text-secondary)]">Choose what you want your results screen to show.</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={turnOnRecommended}
                className="px-3 py-2 rounded-xl bg-[var(--apple-blue)] text-white text-xs font-semibold hover:bg-[var(--apple-blue)]/90 transition-colors"
              >
                Use recommended
              </button>
              {hasAny && (
                <button
                  onClick={removeAll}
                  className="px-3 py-2 rounded-xl bg-[var(--surface-elevated)] text-[var(--text-secondary)] text-xs font-semibold hover:text-[var(--text-primary)] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((s) => {
              const status = groupStatus(s);
              const enabled = status === 'on';
              const partial = status === 'partial';
              const Icon = s.icon;

              return (
                <button
                  key={s.id}
                  onClick={() => applySuggested(s)}
                  className={`text-left rounded-2xl border p-4 transition-all ${
                    enabled
                      ? 'border-[var(--apple-blue)] bg-[var(--apple-blue)]/5'
                      : partial
                      ? 'border-[var(--color-accent-yellow)]/40 bg-[var(--color-accent-yellow)]/5'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--color-gray-75)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          enabled
                            ? 'bg-[var(--apple-blue)]/15 text-[var(--apple-blue)]'
                            : partial
                            ? 'bg-[var(--color-accent-yellow)]/15 text-[var(--color-accent-yellow)]'
                            : 'bg-[var(--surface-card)] text-[var(--text-tertiary)]'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</span>
                          {s.recommended && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] font-semibold">
                              Recommended
                            </span>
                          )}
                          {partial && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent-yellow)]/15 text-[var(--color-accent-yellow)] font-semibold">
                              Partly on
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">{s.description}</div>
                      </div>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                        enabled
                          ? 'bg-[var(--apple-blue)] text-white border-[var(--apple-blue)]'
                          : 'bg-transparent text-[var(--text-tertiary)] border-[var(--border-subtle)]'
                      }`}
                    >
                      {enabled ? <Check size={16} /> : <Plus size={16} />}
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-[var(--text-tertiary)]">
                    {s.exampleLines.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Your chosen results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Your chosen results</h3>
            {!hasAny && <span className="text-xs text-[var(--text-tertiary)]">Pick at least one above</span>}
          </div>

          {selectedSuggestions.length === 0 && customFields.length === 0 ? (
            <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-6 text-center">
              <div className="text-sm text-[var(--text-secondary)]">Nothing selected yet</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">Use Quick pick to choose what to show.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Suggested groups */}
              {selectedSuggestions.map((s) => {
                const status = groupStatus(s);
                const enabled = status === 'on';
                const always = s.fields.every((f) => {
                  const found = behavior.outputSchema.fields.find((x) => x.name === f.name);
                  return found ? found.required : f.required;
                });

                return (
                  <div key={s.id} className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">{s.description}</div>
                        {!enabled && (
                          <div className="text-xs text-[var(--color-accent-yellow)] mt-2">
                            Some parts are missing — click it in Quick pick to complete.
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeSuggestion(s)}
                        className="p-2 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--color-accent-red)]/10 hover:text-[var(--color-accent-red)] transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-xs text-[var(--text-tertiary)]">Always include this?</div>
                      <button
                        onClick={() => setAlwaysForSuggestion(s, !always)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                          always
                            ? 'bg-[var(--apple-blue)]/10 border-[var(--apple-blue)]/20 text-[var(--apple-blue)]'
                            : 'bg-[var(--surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {always ? 'Yes (always)' : 'No (optional)'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Custom fields (one-by-one, still non-technical) */}
              {customFields.length > 0 && (
                <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-5">
                  <div className="text-sm font-semibold text-[var(--text-primary)] mb-3">Custom results</div>
                  <div className="space-y-3">
                    {customFields.map((f) => {
                      const display = f.label || titleCaseFromKey(f.name);
                      return (
                        <div key={f.id} className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-sm font-semibold text-[var(--text-primary)]">{display}</div>
                              <div className="text-xs text-[var(--text-tertiary)] mt-1">Example: {sampleForType(f.type)}</div>
                            </div>
                            <button
                              onClick={() => removeCustomField(f.id)}
                              className="p-2 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--color-accent-red)]/10 hover:text-[var(--color-accent-red)] transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="text-xs text-[var(--text-tertiary)]">Always include this?</div>
                            <button
                              onClick={() => toggleCustomRequired(f.id)}
                              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                                f.required
                                  ? 'bg-[var(--apple-blue)]/10 border-[var(--apple-blue)]/20 text-[var(--apple-blue)]'
                                  : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              {f.required ? 'Yes (always)' : 'No (optional)'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add custom (no keys, no schema words) */}
        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">Add another result</div>
          <div className="text-xs text-[var(--text-secondary)] mb-4">Example: Meal category, Allergens, Spiciness level</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="What do you want the AI to tell you?"
                className="w-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--apple-blue)]"
              />
              <div className="mt-2 text-[10px] text-[var(--text-tertiary)]">
                Don’t worry about the technical name — we handle that automatically.
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value as OutputField['type'])}
                className="flex-1 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--apple-blue)]"
              >
                <option value="string">Short text</option>
                <option value="number">A number</option>
                <option value="boolean">Yes / No</option>
                <option value="array">A list</option>
                <option value="object">A breakdown</option>
              </select>
              <button
                onClick={addCustom}
                disabled={!customTitle.trim()}
                className="px-4 py-3 rounded-xl bg-[var(--apple-blue)] text-white text-sm font-semibold hover:bg-[var(--apple-blue)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-[var(--text-tertiary)]">Always include this new result?</div>
            <button
              onClick={() => setCustomAlways((v) => !v)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                customAlways
                  ? 'bg-[var(--apple-blue)]/10 border-[var(--apple-blue)]/20 text-[var(--apple-blue)]'
                  : 'bg-[var(--surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {customAlways ? 'Yes (always)' : 'No (optional)'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
