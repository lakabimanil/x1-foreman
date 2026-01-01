'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Check,
  Shuffle,
  AlertTriangle,
  TrendingUp,
  Globe,
  Megaphone,
  Apple,
  RefreshCw,
  Power,
  Shield,
  Calendar,
  Info,
  Zap,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import { providers } from '@/config/mockServicesConfig';

interface ServiceDetailProps {
  serviceId: string;
}

type TabType = 'overview' | 'manage' | 'insights';

export default function ServiceDetail({ serviceId }: ServiceDetailProps) {
  const { 
    services, 
    openConnectFlow, 
    openComparePanel, 
    returnToDashboard, 
    isReadyForBuild 
  } = useServicesStudioStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showCredentials, setShowCredentials] = useState(false);

  const service = services[serviceId];
  const provider = service ? providers[service.selectedProviderId] : null;

  if (!service || !provider) {
    return null;
  }

  const isConnected = service.status.includes('connected');

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-neutral-800">
        <div className="px-8 py-6">
          {/* Back Button */}
          <button
            onClick={returnToDashboard}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          {/* Header Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              {/* Provider Logo */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-3xl border border-neutral-700">
                {provider.logo}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white">{provider.name}</h1>
                  {provider.recommended && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-neutral-400 text-sm mb-3">{service.name}</p>
                
                {/* Status Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusPill status={service.status} />
                  {service.environment && (
                    <EnvironmentPill environment={service.environment} />
                  )}
                  <RiskPill level={service.riskLevel} />
                  {service.lastVerified && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      {new Date(service.lastVerified).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <QuickConnectButton 
              isConnected={isConnected}
              isReadyForBuild={isReadyForBuild}
              onConnect={() => openConnectFlow(serviceId)}
              providerName={provider.name}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-neutral-800">
            <TabButton 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
              label="Overview"
            />
            <TabButton 
              active={activeTab === 'manage'} 
              onClick={() => setActiveTab('manage')}
              label="Manage"
              disabled={!isConnected}
            />
            <TabButton 
              active={activeTab === 'insights'} 
              onClick={() => setActiveTab('insights')}
              label="Insights"
            />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <OverviewTab 
                key="overview"
                service={service}
                provider={provider}
                onCompare={() => openComparePanel(serviceId)}
                isReadyForBuild={isReadyForBuild}
              />
            )}
            {activeTab === 'manage' && (
              <ManageTab 
                key="manage"
                service={service}
                serviceId={serviceId}
                onUpdateCredentials={() => openConnectFlow(serviceId)}
                isReadyForBuild={isReadyForBuild}
                showCredentials={showCredentials}
                onToggleCredentials={() => setShowCredentials(!showCredentials)}
              />
            )}
            {activeTab === 'insights' && (
              <InsightsTab 
                key="insights"
                service={service}
                provider={provider}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Tab Components
// ============================================================================

function OverviewTab({ 
  service, 
  provider, 
  onCompare, 
  isReadyForBuild 
}: { 
  service: any; 
  provider: any; 
  onCompare: () => void;
  isReadyForBuild: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Main Content - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* Description */}
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">{provider.description}</p>
        </div>

        {/* Why x1 picked this */}
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Why x1 picked this</h2>
          <div className="space-y-3">
            {service.whyPicked.map((reason: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-400" />
                </div>
                <p className="text-neutral-300 text-sm">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What this affects */}
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">What this affects</h2>
          <div className="space-y-3">
            {service.whatAffects.map((effect: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3 h-3 text-amber-400" />
                </div>
                <p className="text-neutral-300 text-sm">{effect}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-emerald-400">Strengths</h3>
            </div>
            <ul className="space-y-2.5">
              {provider.pros.map((pro: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-neutral-300">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              </div>
              <h3 className="text-sm font-semibold text-red-400">Tradeoffs</h3>
            </div>
            <ul className="space-y-2.5">
              {provider.cons.map((con: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-neutral-300">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar - 1/3 width */}
      <div className="space-y-6">
        {/* Compare Alternatives */}
        <button
          onClick={onCompare}
          disabled={isReadyForBuild}
          className="w-full p-4 rounded-xl bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shuffle className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            <h3 className="font-medium text-white">Compare Alternatives</h3>
          </div>
          <p className="text-sm text-neutral-400">Explore other providers for this service</p>
        </button>

        {/* Cost Driver */}
        <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Cost Driver</div>
          <div className="text-sm text-neutral-300">{service.costDriver}</div>
        </div>

        {/* Documentation */}
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-blue-400">Documentation</h3>
          </div>
          <p className="text-xs text-neutral-400 mb-3">Learn how to integrate {provider.name}</p>
          <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
            View docs →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ManageTab({ 
  service, 
  serviceId,
  onUpdateCredentials,
  isReadyForBuild,
  showCredentials,
  onToggleCredentials
}: { 
  service: any; 
  serviceId: string;
  onUpdateCredentials: () => void;
  isReadyForBuild: boolean;
  showCredentials: boolean;
  onToggleCredentials: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-3xl space-y-6"
    >
      {/* Connection Status */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Connection Active</h2>
            <p className="text-sm text-neutral-400">Your service is connected and operational</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        
        {service.lastVerified && (
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last verified {new Date(service.lastVerified).toLocaleDateString()} at {new Date(service.lastVerified).toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Credentials (masked) */}
      <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">API Credentials</h3>
          <button
            onClick={onToggleCredentials}
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            {showCredentials ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Show
              </>
            )}
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">API Key</label>
            <div className="flex items-center gap-2">
              <input
                type={showCredentials ? "text" : "password"}
                value="sk_live_••••••••••••••••••••"
                readOnly
                className="flex-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm font-mono"
              />
              <button className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-colors">
                <Copy className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onUpdateCredentials}
          className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 transition-all text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <RefreshCw className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-medium text-white">Update Credentials</h3>
          </div>
          <p className="text-xs text-neutral-400">Rotate API keys or update settings</p>
        </button>

        <button
          onClick={() => {
            const newEnv = service.environment === 'sandbox' ? 'production' : 'sandbox';
            const newStatus = newEnv === 'production' ? 'connected-production' : 'connected-sandbox';
            
            useServicesStudioStore.setState((state) => ({
              services: {
                ...state.services,
                [serviceId]: {
                  ...state.services[serviceId],
                  environment: newEnv,
                  status: newStatus as any,
                },
              },
            }));
          }}
          disabled={isReadyForBuild}
          className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="font-medium text-white">
              Switch to {service.environment === 'sandbox' ? 'Production' : 'Sandbox'}
            </h3>
          </div>
          <p className="text-xs text-neutral-400">
            {service.environment === 'sandbox' 
              ? 'Promote to live environment' 
              : 'Revert to test environment'}
          </p>
        </button>

        <button
          onClick={() => {
            alert('Testing connection...\n\n✓ API endpoint reachable\n✓ Credentials valid\n✓ Service quota available\n✓ All systems operational');
          }}
          className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 transition-all text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-medium text-white">Test Connection</h3>
          </div>
          <p className="text-xs text-neutral-400">Verify connection is working</p>
        </button>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to disconnect this service? You can reconnect it later.')) {
              useServicesStudioStore.setState((state) => ({
                services: {
                  ...state.services,
                  [serviceId]: {
                    ...state.services[serviceId],
                    status: 'not-connected',
                    environment: null,
                    lastVerified: null,
                  },
                },
              }));
            }
          }}
          disabled={isReadyForBuild}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
              <Power className="w-4 h-4 text-red-400" />
            </div>
            <h3 className="font-medium text-red-300">Disconnect</h3>
          </div>
          <p className="text-xs text-neutral-400">Remove this service connection</p>
        </button>
      </div>

      {/* Warning Banner */}
      {isReadyForBuild && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-400 mb-1">Stack is locked</h4>
              <p className="text-xs text-neutral-400">
                Some actions are disabled because your stack is ready for build. Unlock to make changes.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function InsightsTab({ 
  service, 
  provider 
}: { 
  service: any; 
  provider: any;
}) {
  const futureItems = [
    { 
      id: 'outgrow', 
      icon: TrendingUp, 
      label: 'Outgrowing this provider', 
      content: service.futureConsiderations.outgrowProvider,
      severity: 'medium'
    },
    { 
      id: 'international', 
      icon: Globe, 
      label: 'International expansion', 
      content: service.futureConsiderations.international,
      severity: 'high'
    },
    { 
      id: 'ads', 
      icon: Megaphone, 
      label: 'Adding ads later', 
      content: service.futureConsiderations.adsLater,
      severity: 'low'
    },
    { 
      id: 'appstore', 
      icon: Apple, 
      label: 'App Store review', 
      content: service.futureConsiderations.appStoreQuestions,
      severity: 'high'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl space-y-6"
    >
      {/* Future Considerations */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Future Considerations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {futureItems.map((item) => {
            const Icon = item.icon;
            const severityColors = {
              low: 'border-neutral-700 bg-neutral-900/50',
              medium: 'border-amber-500/20 bg-amber-500/5',
              high: 'border-blue-500/20 bg-blue-500/5',
            };
            
            return (
              <div 
                key={item.id} 
                className={`p-5 rounded-xl border ${severityColors[item.severity as keyof typeof severityColors]}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white mb-1">{item.label}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function StatusPill({ status }: { status: any }) {
  const configs: Record<string, { label: string; className: string }> = {
    'not-connected': { label: 'Not Connected', className: 'bg-neutral-800 text-neutral-400' },
    'needs-action': { label: 'Needs Action', className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    'connected-sandbox': { label: 'Connected', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    'connected-production': { label: 'Connected', className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    'error': { label: 'Error', className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
    'locked': { label: 'Locked', className: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  };

  const config = configs[status] || configs['not-connected'];

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}

function EnvironmentPill({ environment }: { environment: string }) {
  const isProd = environment === 'production';
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
      isProd 
        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }`}>
      {environment.charAt(0).toUpperCase() + environment.slice(1)}
    </span>
  );
}

function RiskPill({ level }: { level: string }) {
  const configs: Record<string, { className: string }> = {
    low: { className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    medium: { className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    high: { className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };

  const config = configs[level] || configs['low'];

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.className}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
    </span>
  );
}

function TabButton({ 
  active, 
  onClick, 
  label,
  disabled = false
}: { 
  active: boolean; 
  onClick: () => void; 
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        active
          ? 'text-white border-white'
          : 'text-neutral-400 border-transparent hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function QuickConnectButton({ 
  isConnected, 
  isReadyForBuild, 
  onConnect, 
  providerName 
}: { 
  isConnected: boolean; 
  isReadyForBuild: boolean; 
  onConnect: () => void;
  providerName: string;
}) {
  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <Check className="w-4 h-4" />
        <span className="text-sm font-medium">Connected</span>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isReadyForBuild}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black hover:bg-neutral-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="text-sm">Connect {providerName}</span>
      <Zap className="w-4 h-4" />
    </button>
  );
}
