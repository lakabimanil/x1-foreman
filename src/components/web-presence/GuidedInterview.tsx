'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  Info,
  Sparkles,
} from 'lucide-react';
import type { 
  DocumentTemplate, 
  InterviewStep, 
  InterviewQuestion,
  DocumentSchema,
} from '@/types/documentBuilder';

interface GuidedInterviewProps {
  template: DocumentTemplate;
  initialSchema?: Partial<DocumentSchema>;
  onComplete: (schema: DocumentSchema, document: ReturnType<DocumentTemplate['generateDocument']>) => void;
  onCancel: () => void;
}

export function GuidedInterview({ 
  template, 
  initialSchema,
  onComplete, 
  onCancel 
}: GuidedInterviewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  const currentStep = template.steps[currentStepIndex];
  const totalSteps = template.steps.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;
  
  // Filter questions based on dependencies
  const visibleQuestions = useMemo(() => {
    return currentStep.questions.filter(q => {
      if (!q.dependsOn) return true;
      const dependentValue = answers[q.dependsOn.questionId];
      return dependentValue === q.dependsOn.value;
    });
  }, [currentStep.questions, answers]);
  
  const handleAnswer = (questionId: string, value: string | string[] | boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      onCancel();
    }
  };
  
  const handleComplete = async () => {
    setIsGenerating(true);
    
    // Build schema from answers
    const schema = buildSchemaFromAnswers(answers, initialSchema);
    
    // Simulate generation delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate document
    const document = template.generateDocument(schema);
    
    setIsGenerating(false);
    onComplete(schema, document);
  };
  
  const isStepComplete = useMemo(() => {
    // Check if all required questions have answers
    return visibleQuestions.every(q => {
      const answer = answers[q.id];
      if (answer === undefined || answer === null) return false;
      if (typeof answer === 'string' && answer.trim() === '') return false;
      if (Array.isArray(answer) && answer.length === 0) return false;
      return true;
    });
  }, [visibleQuestions, answers]);
  
  if (isGenerating) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Generating your {template.name}</h2>
          <p className="text-neutral-400">Building from your answers...</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{currentStepIndex === 0 ? 'Cancel' : 'Back'}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>
      </header>
      
      {/* Progress Bar */}
      <div className="h-1 bg-neutral-900">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step Header */}
              <div className="text-center mb-10">
                <div className="text-4xl mb-4">{currentStep.icon}</div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {currentStep.title}
                </h1>
                <p className="text-neutral-400">
                  {currentStep.description}
                </p>
              </div>
              
              {/* Questions */}
              <div className="space-y-6">
                {visibleQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <QuestionCard
                      question={question}
                      value={answers[question.id]}
                      onChange={(value) => handleAnswer(question.id, value)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="px-6 py-4 border-t border-neutral-800 bg-neutral-950">
        <div className="max-w-2xl mx-auto flex justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 text-neutral-400 hover:text-white transition-colors"
          >
            {currentStepIndex === 0 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isStepComplete}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
              isStepComplete
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {currentStepIndex === totalSteps - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Generate {template.name}
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

// Question Card Component
interface QuestionCardProps {
  question: InterviewQuestion;
  value: string | string[] | boolean | undefined;
  onChange: (value: string | string[] | boolean) => void;
}

function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
      {/* Question Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium text-white pr-4">
            {question.question}
          </h3>
          {question.riskLevel === 'high' && (
            <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-lg flex-shrink-0">
              <AlertTriangle className="w-3 h-3" />
              Important
            </span>
          )}
        </div>
        {question.description && (
          <p className="text-sm text-neutral-500 mt-1">
            {question.description}
          </p>
        )}
      </div>
      
      {/* Apple Tip */}
      {question.appleTip && (
        <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-300">
            <span className="font-medium">Apple Tip:</span> {question.appleTip}
          </p>
        </div>
      )}
      
      {/* Input based on question type */}
      {question.type === 'confirm' && (
        <ConfirmInput
          value={value as boolean | undefined}
          onChange={onChange}
        />
      )}
      
      {question.type === 'select-one' && question.options && (
        <SelectOneInput
          options={question.options}
          value={value as string | undefined}
          onChange={onChange}
        />
      )}
      
      {question.type === 'select-many' && question.options && (
        <SelectManyInput
          options={question.options}
          value={value as string[] | undefined}
          onChange={onChange}
        />
      )}
      
      {question.type === 'text' && (
        <TextInput
          value={value as string | undefined}
          onChange={onChange}
          placeholder={question.defaultValue as string}
        />
      )}
      
      {question.type === 'text-long' && (
        <TextLongInput
          value={value as string | undefined}
          onChange={onChange}
          placeholder={question.defaultValue as string}
        />
      )}
    </div>
  );
}

// Input Components
function ConfirmInput({ 
  value, 
  onChange 
}: { 
  value: boolean | undefined; 
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange(true)}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
          value === true
            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
        }`}
      >
        {value === true && <Check className="w-4 h-4" />}
        Yes
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
          value === false
            ? 'bg-neutral-700/50 border-neutral-600 text-white'
            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
        }`}
      >
        {value === false && <Check className="w-4 h-4" />}
        No
      </button>
    </div>
  );
}

function SelectOneInput({
  options,
  value,
  onChange,
}: {
  options: NonNullable<InterviewQuestion['options']>;
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
            value === option.value
              ? 'bg-emerald-500/10 border-emerald-500'
              : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            value === option.value ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-600'
          }`}>
            {value === option.value && <Check className="w-3 h-3 text-white" />}
          </div>
          <div className="flex-1">
            <div className={`font-medium ${value === option.value ? 'text-white' : 'text-neutral-300'}`}>
              {option.label}
            </div>
            {option.description && (
              <div className="text-sm text-neutral-500 mt-0.5">
                {option.description}
              </div>
            )}
            {option.riskFlag && value === option.value && (
              <div className="flex items-center gap-1 mt-2 text-amber-400 text-sm">
                <AlertTriangle className="w-3 h-3" />
                {option.riskFlag}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

function SelectManyInput({
  options,
  value = [],
  onChange,
}: {
  options: NonNullable<InterviewQuestion['options']>;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}) {
  const selectedValues = value || [];
  
  const handleToggle = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter(v => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };
  
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              isSelected
                ? 'bg-emerald-500/10 border-emerald-500'
                : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
            }`}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
              isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-600'
            }`}>
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm truncate ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                {option.label}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
    />
  );
}

function TextLongInput({
  value,
  onChange,
  placeholder,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
    />
  );
}

// Helper to build schema from answers
function buildSchemaFromAnswers(
  answers: Record<string, string | string[] | boolean>,
  initialSchema?: Partial<DocumentSchema>
): DocumentSchema {
  const schema: DocumentSchema = {
    appName: initialSchema?.appName || 'Cal AI',
    companyName: initialSchema?.companyName || 'Cal AI Inc.',
    contactEmail: initialSchema?.contactEmail || 'privacy@calai.app',
    effectiveDate: new Date().toISOString(),
    dataTypes: [],
    thirdParties: [],
    features: {
      hasUserGeneratedContent: answers['has-ugc'] as boolean || false,
      hasLivestreaming: answers['has-livestream'] as boolean || false,
      hasDirectMessaging: answers['has-dms'] as boolean || false,
      hasPublicProfiles: answers['has-public-profiles'] as boolean || false,
      hasInAppPurchases: answers['has-iap'] as boolean || false,
      hasSubscriptions: answers['has-subscriptions'] as boolean || false,
      hasHealthData: answers['collects-health'] as boolean || false,
      usesCamera: answers['uses-camera'] as boolean || false,
      usesLocation: answers['uses-location'] as boolean || false,
      usesAnalytics: answers['uses-analytics'] as boolean || false,
      usesCrashReporting: true,
      usesAI: true,
    },
    compliance: {
      ageGating: (answers['age-rating'] as '4+' | '9+' | '12+' | '17+') || '4+',
      gdprCompliant: answers['has-eu-users'] as boolean || false,
      ccpaCompliant: false,
      coppaCompliant: answers['targets-children'] as boolean || false,
      hipaaRelevant: false,
    },
    userControls: {
      canDeleteAccount: answers['can-delete-account'] as boolean || true,
      canExportData: answers['can-export-data'] as boolean || false,
      canOptOutAnalytics: true,
      canReportContent: answers['has-ugc'] as boolean || false,
      canBlockUsers: answers['has-dms'] as boolean || false,
    },
    customAnswers: { ...answers },
  };
  
  // Build data types from health data selection
  if (answers['collects-health'] && answers['health-data-types']) {
    const healthTypes = answers['health-data-types'] as string[];
    healthTypes.forEach(type => {
      schema.dataTypes.push({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        purpose: 'Health and fitness tracking',
        retention: answers['data-retention'] as string || '90-days',
        userControl: 'deletable',
        isRequired: false,
      });
    });
  }
  
  // Build third parties from selection
  if (answers['third-party-services']) {
    const services = answers['third-party-services'] as string[];
    const serviceInfo: Record<string, { name: string; purpose: string }> = {
      'apple-healthkit': { name: 'Apple HealthKit', purpose: 'Sync health and fitness data' },
      'apple-sign-in': { name: 'Sign in with Apple', purpose: 'User authentication' },
      'mixpanel': { name: 'Mixpanel', purpose: 'Product analytics' },
      'amplitude': { name: 'Amplitude', purpose: 'Product analytics' },
      'firebase': { name: 'Firebase', purpose: 'Analytics and infrastructure' },
      'sentry': { name: 'Sentry', purpose: 'Crash reporting and monitoring' },
      'openai': { name: 'OpenAI', purpose: 'AI-powered features' },
      'stripe': { name: 'Stripe', purpose: 'Payment processing' },
      'revenuecat': { name: 'RevenueCat', purpose: 'Subscription management' },
    };
    
    services.forEach(service => {
      if (serviceInfo[service]) {
        schema.thirdParties.push({
          name: serviceInfo[service].name,
          purpose: serviceInfo[service].purpose,
          dataShared: [],
        });
      }
    });
  }
  
  return schema;
}

export default GuidedInterview;
