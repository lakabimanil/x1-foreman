'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  AlertTriangle, 
  XCircle,
  Plus,
  ArrowRight,
  Settings,
  Zap,
  Shield,
  Search,
  Filter,
  Lock,
  Unlock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import { providers } from '@/config/mockServicesConfig';
import type { Service, ConnectionStatus } from '@/types/servicesStudio';

const statusConfig: Record<ConnectionStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: typeof Check;
}> = {
  'not-connected': {
    label: 'Not configured',
    color: 'text-neutral-400',
    bgColor: 'bg-neutral-800/50',
    icon: Settings,
  },
  'needs-action': {
    label: 'Needs action',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    icon: AlertTriangle,
  },
  'connected-sandbox': {
    label: 'Sandbox',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: Check,
  },
  'connected-production': {
    label: 'Production',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    icon: Check,
  },
  'error': {
    label: 'Error',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    icon: XCircle,
  },
  'locked': {
    label: 'Locked',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    icon: Shield,
  },
};

type FilterType = 'all' | 'connected' | 'not-connected' | 'needs-action';

export default function ServicesDashboard() {
  const {
    services,
    openServiceConfig,
    isReadyForBuild,
    markReadyForBuild,
    unmarkReadyForBuild,
    getConnectedCount,
    getTotalServicesCount
  } = useServicesStudioStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const servicesList = Object.values(services);
  const connectedCount = getConnectedCount();
  const totalCount = getTotalServicesCount();

  // Filter services
  const filteredServices = servicesList.filter(service => {
    // Search filter
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      providers[service.selectedProviderId]?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'connected' && service.status.includes('connected')) ||
      (activeFilter === 'not-connected' && service.status === 'not-connected') ||
      (activeFilter === 'needs-action' && (service.status === 'needs-action' || service.status === 'error'));

    return matchesSearch && matchesFilter;
  });

  const coreServices = filteredServices.filter((s) => s.category === 'core');
  const optionalServices = filteredServices.filter((s) => s.category === 'optional');

  const handleMarkReady = () => {
    markReadyForBuild();
  };

  const handleUnlock = () => {
    unmarkReadyForBuild();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Services Studio</h1>
              <p className="text-neutral-400 text-base">
                Connect the services your app needs to work
              </p>
            </div>
            
            {/* Progress & Action */}
            <div className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-1 font-medium uppercase tracking-wider">Services Ready</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{connectedCount}</span>
                  <span className="text-base text-neutral-600">of {totalCount}</span>
                </div>
              </div>
              
              {!isReadyForBuild && connectedCount >= 1 && (
                <div className="relative group">
                  <button
                    onClick={handleMarkReady}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/25"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Ready to Build</span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute top-full right-0 mt-2 w-64 p-3 rounded-lg bg-neutral-800 border border-neutral-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Mark your setup as complete. This generates configuration files and prevents accidental changes.
                    </p>
                  </div>
                </div>
              )}
              
              {isReadyForBuild && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span className="font-semibold">Ready to Build</span>
                  </div>
                  <button
                    onClick={handleUnlock}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit Setup</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <FilterButton 
                  active={activeFilter === 'all'} 
                  onClick={() => setActiveFilter('all')}
                  label="All"
                  count={servicesList.length}
                />
                <FilterButton 
                  active={activeFilter === 'connected'} 
                  onClick={() => setActiveFilter('connected')}
                  label="Connected"
                  count={connectedCount}
                />
                <FilterButton 
                  active={activeFilter === 'not-connected'} 
                  onClick={() => setActiveFilter('not-connected')}
                  label="To Do"
                  count={servicesList.filter(s => s.status === 'not-connected').length}
                />
              </div>
            </div>
          </div>

          {/* Workflow Guide */}
          {!isReadyForBuild && connectedCount === 0 && (
            <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-400 mb-1">Get Started</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Connect the services below to set up your app. Start with core services like Authentication and Live Video, then add optional features when ready.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isReadyForBuild && connectedCount > 0 && connectedCount < totalCount && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-400 mb-1">Almost There!</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    You have {totalCount - connectedCount} service{totalCount - connectedCount !== 1 ? 's' : ''} left to configure. Once all core services are connected, click "Ready to Build" to generate your configuration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isReadyForBuild && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-emerald-400 mb-1">Setup Complete!</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Your services are configured and ready. Configuration files have been generated. To make changes, click "Edit Setup" above.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Core Services */}
        {coreServices.length > 0 && (
          <div className="mb-8">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                  Core Services
                </h2>
                <span className="text-xs text-neutral-500">{coreServices.length} services</span>
              </div>
              <p className="text-sm text-neutral-500">Required for your app to function</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coreServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onClick={() => openServiceConfig(service.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Optional Services */}
        {optionalServices.length > 0 && (
          <div className="mb-8">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                  Optional Services
                </h2>
                <span className="text-xs text-neutral-500">{optionalServices.length} services</span>
              </div>
              <p className="text-sm text-neutral-500">Add when you need extra features</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {optionalServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onClick={() => openServiceConfig(service.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No services found</h3>
            <p className="text-neutral-400 text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Add Service */}
        <button className="w-full p-8 rounded-2xl border-2 border-dashed border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 transition-all group">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-neutral-800 group-hover:border-neutral-700 transition-all">
              <Plus className="w-7 h-7 text-neutral-500 group-hover:text-neutral-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-neutral-400 group-hover:text-neutral-300 transition-colors mb-1">Add Service</p>
              <p className="text-sm text-neutral-600">Extend your stack with more capabilities</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function FilterButton({ 
  active, 
  onClick, 
  label, 
  count 
}: { 
  active: boolean; 
  onClick: () => void; 
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-white text-black'
          : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
      }`}
    >
      {label} {count > 0 && <span className={active ? 'text-neutral-600' : 'text-neutral-600'}>({count})</span>}
    </button>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  trend: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  };

  return (
    <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold text-neutral-500">{trend}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}

function ServiceCard({ service, onClick }: { service: Service; onClick: () => void }) {
  const provider = providers[service.selectedProviderId];
  const statusInfo = statusConfig[service.status];
  const StatusIcon = statusInfo.icon;

  const isConnected = service.status === 'connected-sandbox' || service.status === 'connected-production';
  const needsAction = service.status === 'needs-action' || service.status === 'error' || service.status === 'not-connected';

  // Determine action text
  let actionText = 'View Details';
  if (service.status === 'not-connected') {
    actionText = 'Connect Service';
  } else if (service.status === 'needs-action') {
    actionText = 'Fix Issues';
  } else if (isConnected) {
    actionText = 'Manage';
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="group relative w-full text-left p-6 rounded-xl border transition-all hover:border-neutral-700 hover:shadow-xl hover:shadow-black/20 bg-neutral-900/50 border-neutral-800 hover:-translate-y-1"
    >
      {/* Status Indicator Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${statusInfo.bgColor}`} />

      {/* Header */}
      <div className="flex items-start gap-4 mb-4 mt-2">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-2xl border border-neutral-700 group-hover:border-neutral-600 transition-colors">
          {provider?.logo || '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white mb-1 truncate">{service.name}</h3>
          <p className="text-sm text-neutral-400 truncate">{provider?.name || 'Not selected'}</p>
        </div>

      </div>

      {/* Status & Environment */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
          <StatusIcon className="w-3 h-3" />
          {statusInfo.label}
        </div>
        
        {service.environment && (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
            service.environment === 'production'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {service.environment.charAt(0).toUpperCase() + service.environment.slice(1)}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
        <span className={`text-sm font-medium transition-colors ${
          needsAction 
            ? 'text-amber-400 group-hover:text-amber-300' 
            : 'text-neutral-400 group-hover:text-white'
        }`}>
          {actionText}
        </span>
        
        <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
    </motion.button>
  );
}
