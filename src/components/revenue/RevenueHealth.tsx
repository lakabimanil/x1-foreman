'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle, AlertTriangle, XCircle, ArrowRight, 
  Shield, Zap, ExternalLink 
} from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { HealthIssue, HealthIssueSeverity } from '@/types/revenue';

const severityConfig: Record<HealthIssueSeverity, {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  error: {
    icon: <XCircle className="w-5 h-5" />,
    color: 'text-accent-red',
    bgColor: 'bg-accent-red/10',
    borderColor: 'border-accent-red/20',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'text-accent-yellow',
    bgColor: 'bg-accent-yellow/10',
    borderColor: 'border-accent-yellow/20',
  },
  info: {
    icon: <Shield className="w-5 h-5" />,
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue/10',
    borderColor: 'border-accent-blue/20',
  },
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-accent-green',
    bgColor: 'bg-accent-green/10',
    borderColor: 'border-accent-green/20',
  },
};

function IssueCard({ issue, index }: { issue: HealthIssue; index: number }) {
  const { openOfferEditor } = useRevenueStore();
  const config = severityConfig[issue.severity];
  
  const handleClick = () => {
    if (issue.offerId && issue.section) {
      openOfferEditor(issue.offerId, issue.section);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={issue.offerId ? handleClick : undefined}
      className={`
        p-4 rounded-xl border transition-all
        ${config.bgColor} ${config.borderColor}
        ${issue.offerId ? 'cursor-pointer hover:scale-[1.01]' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={config.color}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white">{issue.message}</p>
          {issue.offerId && (
            <p className="text-xs text-gray-100 mt-1 flex items-center gap-1">
              Click to fix <ArrowRight className="w-3 h-3" />
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function RevenueHealth() {
  const { getHealthIssues, getCurrentScenario, getAppStoreReadiness } = useRevenueStore();
  const issues = getHealthIssues();
  const scenario = getCurrentScenario();
  const readiness = getAppStoreReadiness();
  
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const successes = issues.filter((i) => i.severity === 'success');
  
  const totalOffers = scenario.offers.length;
  const readyOffers = scenario.offers.filter((o) => o.status === 'ready').length;
  const healthScore = totalOffers > 0 ? Math.round((readyOffers / totalOffers) * 100) : 0;
  
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Revenue Health</h1>
          <p className="text-sm text-gray-75">
            Issues that need attention before going live
          </p>
        </motion.div>
        
        {/* Health score card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-gray-150 to-gray-175 border border-gray-125"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Configuration Score</h2>
                <p className="text-sm text-gray-75">
                  {readyOffers} of {totalOffers} offers ready
                </p>
              </div>
            </div>
            <div className="text-4xl font-bold text-white">{healthScore}%</div>
          </div>
          <div className="h-2 bg-gray-125 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-full rounded-full ${
                healthScore === 100 
                  ? 'bg-accent-green' 
                  : healthScore >= 50 
                    ? 'bg-accent-yellow' 
                    : 'bg-accent-red'
              }`}
            />
          </div>
        </motion.div>
        
        {/* Issues section */}
        <div className="space-y-6">
          {/* Errors */}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-accent-red" />
                <h3 className="text-sm font-medium text-accent-red">
                  Errors ({errors.length})
                </h3>
              </div>
              <div className="space-y-2">
                {errors.map((issue, index) => (
                  <IssueCard key={issue.id} issue={issue} index={index} />
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Warnings */}
          {warnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-yellow" />
                <h3 className="text-sm font-medium text-accent-yellow">
                  Warnings ({warnings.length})
                </h3>
              </div>
              <div className="space-y-2">
                {warnings.map((issue, index) => (
                  <IssueCard key={issue.id} issue={issue} index={index} />
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Success */}
          {successes.length > 0 && errors.length === 0 && warnings.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2">
                {successes.map((issue, index) => (
                  <IssueCard key={issue.id} issue={issue} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 grid grid-cols-3 gap-4"
        >
          <div className="p-4 rounded-xl bg-gray-150 border border-gray-125">
            <p className="text-2xl font-bold text-white mb-1">{readiness.subscriptions}</p>
            <p className="text-xs text-gray-75">Subscriptions</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-150 border border-gray-125">
            <p className="text-2xl font-bold text-white mb-1">{readiness.consumables}</p>
            <p className="text-xs text-gray-75">Consumables</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-150 border border-gray-125">
            <p className="text-2xl font-bold text-white mb-1">{readiness.oneTimePurchases}</p>
            <p className="text-xs text-gray-75">One-time</p>
          </div>
        </motion.div>
        
        {/* All clear message */}
        {errors.length === 0 && warnings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 rounded-2xl bg-accent-green/10 border border-accent-green/20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-accent-green" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">All Clear!</h3>
            <p className="text-sm text-gray-75">
              Your revenue configuration is complete and ready for the App Store.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
