'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Zap,
  Key,
  Bot,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import { providers } from '@/config/mockServicesConfig';

export default function ConnectFlowModal() {
  const {
    connectFlow,
    services,
    closeConnectFlow,
    selectConnectionMethod,
    advanceAgentStep,
    handleAgentUserAction,
    handleBillingChoice,
    runVerification,
    completeConnection,
  } = useServicesStudioStore();

  const [apiCredentials, setApiCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
  });
  const [showSecrets, setShowSecrets] = useState({
    apiKey: false,
    apiSecret: false,
    accessToken: false,
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const service = connectFlow.serviceId ? services[connectFlow.serviceId] : null;
  const provider = service ? providers[service.selectedProviderId] : null;

  useEffect(() => {
    // Reset form when modal opens
    if (connectFlow.isOpen) {
      setApiCredentials({ apiKey: '', apiSecret: '', accessToken: '' });
      setValidationError(null);
    }
  }, [connectFlow.isOpen]);

  if (!connectFlow.isOpen || !service || !provider) return null;

  const hasConnector = provider.hasConnector;

  const handleApiKeySubmit = async () => {
    setValidationError(null);

    // Basic validation
    if (!apiCredentials.apiKey.trim()) {
      setValidationError('API Key is required');
      return;
    }

    // Provider-specific validation (mock)
    if (provider.id === 'mux' && !apiCredentials.apiSecret.trim()) {
      setValidationError('Mux requires both API Key and Secret Key');
      return;
    }

    setIsValidating(true);

    // Simulate API validation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock validation logic based on credential format
    const isValid = validateCredentialFormat(provider.id, apiCredentials);

    if (isValid) {
      // Update service status
      useServicesStudioStore.setState((state) => ({
        services: {
          ...state.services,
          [connectFlow.serviceId!]: {
            ...state.services[connectFlow.serviceId!],
            status: 'connected-sandbox',
            environment: 'sandbox',
            lastVerified: new Date(),
          },
        },
        connectFlow: {
          ...state.connectFlow,
          step: 'verify',
          verificationResult: provider.defaultVerificationOutcome,
        },
      }));
    } else {
      setValidationError('Invalid credentials. Please check and try again.');
    }

    setIsValidating(false);
  };

  const handlePromoteToProduction = () => {
    if (!connectFlow.serviceId) return;

    useServicesStudioStore.setState((state) => ({
      services: {
        ...state.services,
        [connectFlow.serviceId!]: {
          ...state.services[connectFlow.serviceId!],
          status: 'connected-production',
          environment: 'production',
          lastVerified: new Date(),
        },
      },
    }));

    completeConnection();
  };

  const handleCopyExampleKey = () => {
    // Copy a mock API key to clipboard for testing
    const mockKey = provider.id === 'mux' 
      ? 'mux_test_1234567890abcdef'
      : `${provider.id}_test_key_abc123`;
    
    navigator.clipboard.writeText(mockKey);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeConnectFlow}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-b from-neutral-900 to-neutral-900/95 backdrop-blur-xl border-b border-neutral-800 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-3xl border border-neutral-700 shadow-lg">
                {provider.logo}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-0.5">Connect {provider.name}</h2>
                <p className="text-sm text-neutral-400">{service.name}</p>
              </div>
            </div>
            <button
              onClick={closeConnectFlow}
              className="p-2.5 hover:bg-neutral-800 rounded-lg transition-colors group"
            >
              <X className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Progress Indicator */}
          {connectFlow.step !== 'choose-method' && (
            <div className="px-6 py-3 bg-neutral-900/50 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                {['choose-method', 'connecting', 'verify', 'done'].map((step, index, arr) => {
                  const currentIndex = arr.indexOf(connectFlow.step);
                  const stepIndex = index;
                  const isActive = stepIndex === currentIndex;
                  const isCompleted = stepIndex < currentIndex;
                  
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`h-1 rounded-full flex-1 ${
                        isCompleted ? 'bg-blue-500' : isActive ? 'bg-blue-500/50' : 'bg-neutral-800'
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Choose Connection Method */}
                {connectFlow.step === 'choose-method' && (
                  <ChooseMethodStep
                    hasConnector={hasConnector}
                    providerName={provider.name}
                    onSelectMethod={selectConnectionMethod}
                  />
                )}

                {/* Step 2: API Key Entry */}
                {connectFlow.step === 'connecting' && connectFlow.method === 'api-key' && (
                  <ApiKeyEntryStep
                    provider={provider}
                    credentials={apiCredentials}
                    onCredentialsChange={setApiCredentials}
                    showSecrets={showSecrets}
                    onToggleSecret={(field) =>
                      setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }))
                    }
                    isValidating={isValidating}
                    validationError={validationError}
                    onSubmit={handleApiKeySubmit}
                    onCancel={closeConnectFlow}
                    onCopyExample={handleCopyExampleKey}
                  />
                )}

                {/* Step 3: Agent Assist */}
                {connectFlow.step === 'agent-assist' && (
                  <AgentAssistStep
                    steps={connectFlow.agentSteps}
                    currentStepIndex={connectFlow.currentAgentStepIndex}
                    onUserAction={handleAgentUserAction}
                    onBillingChoice={handleBillingChoice}
                  />
                )}

                {/* Step 4: Connector (Quick Connect) */}
                {connectFlow.step === 'connecting' && connectFlow.method === 'connector' && (
                  <ConnectorStep providerName={provider.name} />
                )}

                {/* Step 5: Verification Results */}
                {connectFlow.step === 'verify' && (
                  <VerificationStep
                    outcome={connectFlow.verificationResult || 'success'}
                    providerName={provider.name}
                    environment={service.environment || 'sandbox'}
                    onPromoteToProduction={handlePromoteToProduction}
                    onDone={completeConnection}
                  />
                )}

                {/* Step 6: Done */}
                {connectFlow.step === 'done' && (
                  <DoneStep
                    providerName={provider.name}
                    onClose={closeConnectFlow}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function ChooseMethodStep({
  hasConnector,
  providerName,
  onSelectMethod,
}: {
  hasConnector: boolean;
  providerName: string;
  onSelectMethod: (method: 'connector' | 'api-key' | 'agent-assist') => void;
}) {
  return (
    <motion.div
      key="choose-method"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Choose your connection method</h3>
        <p className="text-neutral-400">
          Select the best way to integrate {providerName} with your app
        </p>
      </div>

      {/* Quick Connector (if available) */}
      {hasConnector && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectMethod('connector')}
          className="w-full p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all text-left group relative overflow-hidden"
        >
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
              Recommended
            </span>
          </div>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-500/30">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 pt-1">
              <h4 className="font-bold text-white mb-1.5 text-lg">Quick Connect</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">One-click OAuth integration with automatic setup</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              2 minutes
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              No manual config
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Secure OAuth
            </span>
          </div>
          <div className="flex items-center text-sm text-blue-400 font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            Get started <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </motion.button>
      )}

      {/* Agent Assist */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelectMethod('agent-assist')}
        className="w-full p-5 rounded-xl bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 transition-all text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-700 flex items-center justify-center">
            <Bot className="w-5 h-5 text-neutral-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white mb-1">Let x1 Agent help me</h4>
            <p className="text-sm text-neutral-400">Guided setup with automated account creation</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.button>

      {/* Manual API Key */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelectMethod('api-key')}
        className="w-full p-5 rounded-xl bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 transition-all text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-700 flex items-center justify-center">
            <Key className="w-5 h-5 text-neutral-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white mb-1">I have API credentials</h4>
            <p className="text-sm text-neutral-400">Enter your existing API keys manually</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.button>
    </motion.div>
  );
}

function ApiKeyEntryStep({
  provider,
  credentials,
  onCredentialsChange,
  showSecrets,
  onToggleSecret,
  isValidating,
  validationError,
  onSubmit,
  onCancel,
  onCopyExample,
}: {
  provider: any;
  credentials: { apiKey: string; apiSecret: string; accessToken: string };
  onCredentialsChange: (creds: any) => void;
  showSecrets: { apiKey: boolean; apiSecret: boolean; accessToken: boolean };
  onToggleSecret: (field: 'apiKey' | 'apiSecret' | 'accessToken') => void;
  isValidating: boolean;
  validationError: string | null;
  onSubmit: () => void;
  onCancel: () => void;
  onCopyExample: () => void;
}) {
  const getProviderFields = () => {
    // Define which fields each provider needs
    switch (provider.id) {
      case 'mux':
        return [
          { key: 'apiKey' as const, label: 'API Access Token ID', placeholder: 'mux_token_id_abc123...' },
          { key: 'apiSecret' as const, label: 'API Secret Key', placeholder: 'mux_secret_abc123...' },
        ];
      case 'agora':
        return [
          { key: 'apiKey' as const, label: 'App ID', placeholder: 'agora_app_id...' },
          { key: 'apiSecret' as const, label: 'App Certificate', placeholder: 'agora_cert...' },
        ];
      default:
        return [
          { key: 'apiKey' as const, label: 'API Key', placeholder: `${provider.id}_key...` },
        ];
    }
  };

  const fields = getProviderFields();

  return (
    <motion.div
      key="api-key-entry"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Enter your API credentials</h3>
        <p className="text-neutral-400 text-sm mb-4">
          Get your API credentials from the {provider.name} dashboard
        </p>
        
        {/* Help link */}
        <a
          href={`https://${provider.id}.com/dashboard/api-keys`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open {provider.name} Dashboard
        </a>
      </div>

      {/* Demo Helper */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Copy className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-300 mb-2">
              <strong>For demo/testing:</strong> Click to copy a mock API key
            </p>
            <button
              onClick={onCopyExample}
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Copy example credentials
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              {field.label}
            </label>
            <div className="relative">
              <input
                type={showSecrets[field.key] ? 'text' : 'password'}
                value={credentials[field.key]}
                onChange={(e) =>
                  onCredentialsChange({ ...credentials, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
                className="w-full px-4 py-3 pr-12 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => onToggleSecret(field.key)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white transition-colors"
              >
                {showSecrets[field.key] ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Validation Error */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300 font-medium mb-1">Connection failed</p>
            <p className="text-sm text-red-400">{validationError}</p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          disabled={isValidating}
          className="flex-1 px-6 py-3 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={isValidating || !credentials.apiKey.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Validating...</span>
            </>
          ) : (
            <>
              <span>Connect</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Security Note */}
      <p className="text-xs text-neutral-500 text-center">
        Your credentials are encrypted and stored securely. x1 never logs or shares your API keys.
      </p>
    </motion.div>
  );
}

function AgentAssistStep({
  steps,
  currentStepIndex,
  onUserAction,
  onBillingChoice,
}: {
  steps: any[];
  currentStepIndex: number;
  onUserAction: (action: any) => void;
  onBillingChoice: (choice: 'sandbox' | 'production') => void;
}) {
  return (
    <motion.div
      key="agent-assist"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">x1 Agent is setting up your connection</h3>
        <p className="text-neutral-400 text-sm">
          Follow the prompts below to complete the setup process
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = step.status === 'completed';
          const isWaiting = step.status === 'waiting-user';
          const isPending = step.status === 'pending';

          return (
            <div
              key={step.id}
              className={`p-4 rounded-lg border transition-all ${
                isActive || isWaiting
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-neutral-800/50 border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20'
                      : isActive || isWaiting
                      ? 'bg-blue-500/20'
                      : 'bg-neutral-700'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : (
                    <span className="text-sm text-neutral-400">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isCompleted
                        ? 'text-emerald-400'
                        : isActive || isWaiting
                        ? 'text-blue-300'
                        : 'text-neutral-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* User Action Button */}
                {isWaiting && step.userAction && (
                  <div className="ml-auto">
                    {step.userAction.type === 'billing-choice' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onBillingChoice('sandbox')}
                          className="px-4 py-2 rounded-lg bg-neutral-700 text-white text-sm hover:bg-neutral-600 transition-colors"
                        >
                          Sandbox
                        </button>
                        <button
                          onClick={() => onBillingChoice('production')}
                          className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
                        >
                          Production
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onUserAction(step.userAction.type)}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
                      >
                        {step.userAction.label}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ConnectorStep({ providerName }: { providerName: string }) {
  return (
    <motion.div
      key="connector"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-6" />
      <h3 className="text-xl font-semibold text-white mb-2">Connecting to {providerName}...</h3>
      <p className="text-neutral-400 text-center">
        Opening authorization window. Please approve the connection.
      </p>
    </motion.div>
  );
}

function VerificationStep({
  outcome,
  providerName,
  environment,
  onPromoteToProduction,
  onDone,
}: {
  outcome: 'success' | 'partial' | 'fail';
  providerName: string;
  environment: 'sandbox' | 'production';
  onPromoteToProduction: () => void;
  onDone: () => void;
}) {
  const getOutcomeConfig = () => {
    switch (outcome) {
      case 'success':
        return {
          icon: Check,
          iconBg: 'bg-emerald-500/20',
          iconColor: 'text-emerald-400',
          title: 'Connection successful!',
          message: `${providerName} is now connected in ${environment} mode. All systems verified and ready to use.`,
          borderColor: 'border-emerald-500/30',
        };
      case 'partial':
        return {
          icon: AlertCircle,
          iconBg: 'bg-amber-500/20',
          iconColor: 'text-amber-400',
          title: 'Partial connection',
          message: `${providerName} is connected, but some features may require additional configuration. Check the dashboard for details.`,
          borderColor: 'border-amber-500/30',
        };
      case 'fail':
        return {
          icon: AlertCircle,
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-400',
          title: 'Connection failed',
          message: `Unable to verify connection to ${providerName}. Please check your credentials and try again.`,
          borderColor: 'border-red-500/30',
        };
    }
  };

  const config = getOutcomeConfig();
  const Icon = config.icon;

  return (
    <motion.div
      key="verify"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Status Card */}
      <div className={`p-6 rounded-xl border ${config.borderColor} text-center`}>
        <div className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{config.title}</h3>
        <p className="text-neutral-400">{config.message}</p>
      </div>

      {/* Environment Info */}
      {outcome === 'success' && (
        <div className="p-4 rounded-lg bg-neutral-800 border border-neutral-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-300">Current Environment</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
              {environment.charAt(0).toUpperCase() + environment.slice(1)}
            </span>
          </div>
          {environment === 'sandbox' && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-400">
                You're currently connected to the sandbox environment. This is perfect for development and testing.
              </p>
              <button
                onClick={onPromoteToProduction}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Promote to Production</span>
              </button>
              <p className="text-xs text-neutral-500 text-center">
                Make sure you've tested thoroughly before going live
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {outcome === 'fail' ? (
          <>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-3 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onDone}
              className="flex-1 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
            >
              Close
            </button>
          </>
        ) : (
          <button
            onClick={onDone}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function DoneStep({ providerName, onClose }: { providerName: string; onClose: () => void }) {
  return (
    <motion.div
      key="done"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-8"
    >
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-emerald-400" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">All set!</h3>
      <p className="text-neutral-400 mb-8 max-w-md mx-auto">
        {providerName} is now fully configured and ready to use in your application.
      </p>
      <button
        onClick={onClose}
        className="px-8 py-3 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
      >
        Back to Dashboard
      </button>
    </motion.div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function validateCredentialFormat(providerId: string, credentials: any): boolean {
  // Mock validation - in reality, you'd check actual format requirements
  const { apiKey, apiSecret } = credentials;

  // Simple format checks (mock)
  if (!apiKey || apiKey.length < 10) return false;

  switch (providerId) {
    case 'mux':
      // Mux requires both token ID and secret
      return apiSecret && apiSecret.length >= 10;
    case 'agora':
      return apiSecret && apiSecret.length >= 10;
    default:
      return true;
  }
}
