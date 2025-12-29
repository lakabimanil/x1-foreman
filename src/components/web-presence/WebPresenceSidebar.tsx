'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Globe,
  Shield,
  FileText,
  Layout,
  Settings,
  Check,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import type { WebPresenceState } from '@/types/webPresence';

type ViewType = WebPresenceState['activeView'];
type ArtifactView = Exclude<ViewType, 'overview' | 'admin'>;

const viewConfig: Record<ArtifactView, {
  icon: React.ElementType;
  label: string;
  shortLabel: string;
  required: boolean;
  description: string;
}> = {
  'privacy-policy': { 
    icon: Shield, 
    label: 'Privacy Policy', 
    shortLabel: 'Privacy P...', 
    required: true,
    description: 'User data & privacy terms'
  },
  'terms': { 
    icon: FileText, 
    label: 'Terms of Service', 
    shortLabel: 'Terms of...', 
    required: true,
    description: 'Legal terms & conditions'
  },
  'landing-page': { 
    icon: Layout, 
    label: 'Landing Page', 
    shortLabel: 'Landing Page', 
    required: false,
    description: 'Share your app with the world'
  },
};

// Map view keys to document types for the new flow
const documentTypeMap: Record<string, string> = {
  'privacy-policy': 'privacy-policy',
  'terms': 'terms-of-service',
};

export function WebPresenceSidebar() {
  const router = useRouter();
  const { 
    artifacts, 
    activeView, 
    setActiveView,
    moduleStatus,
    generatedDocuments,
  } = useWebPresenceStore();
  
  const getStatusForView = (view: ArtifactView) => {
    switch (view) {
      case 'privacy-policy':
        return artifacts.privacyPolicy.status;
      case 'terms':
        return artifacts.terms.status;
      case 'landing-page':
        return artifacts.landingPage.status;
    }
  };
  
  const completedCount = [
    artifacts.privacyPolicy.status === 'ready',
    artifacts.terms.status === 'ready',
    artifacts.landingPage.status === 'ready',
  ].filter(Boolean).length;
  
  const requiredCount = [
    artifacts.privacyPolicy.status === 'ready',
    artifacts.terms.status === 'ready',
  ].filter(Boolean).length;

  const progress = (completedCount / 3) * 100;
  
  return (
    <div className="w-[240px] min-w-[240px] bg-[#050505] flex flex-col h-full border-r border-white/[0.06]">
      {/* Back Button */}
      <div className="px-4 pt-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-medium">Back to Milestones</span>
        </Link>
      </div>
      
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-pink-500 rounded-full border-2 border-[#050505] flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <span className="font-semibold text-white text-lg tracking-tight">Web Presence</span>
          </div>
        </div>
        
        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="4"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 150.8' }}
                animate={{ strokeDasharray: `${progress * 1.508} 150.8` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{completedCount}</span>
        </div>
      </div>
          <div>
            <p className="text-sm text-white/80 font-medium">{completedCount} of 3</p>
            <p className="text-xs text-white/40">artifacts ready</p>
          </div>
        </div>
      </div>
      
      {/* Required Badge */}
      <div className="mx-4 mb-4">
        <motion.div 
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
          requiredCount === 2 
              ? 'bg-emerald-500/10 border border-emerald-500/20' 
              : 'bg-amber-500/10 border border-amber-500/20'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {requiredCount === 2 ? (
            <>
              <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-emerald-400">All required items complete</span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-amber-400" />
              </div>
              <span className="text-amber-400">{2 - requiredCount} required item{2 - requiredCount !== 1 ? 's' : ''} left</span>
            </>
          )}
        </motion.div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {/* Overview */}
        <button
          onClick={() => setActiveView('overview')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all relative group ${
            activeView === 'overview'
              ? 'bg-white/[0.08]'
              : 'hover:bg-white/[0.04]'
          }`}
        >
          {activeView === 'overview' && (
            <motion.div
              layoutId="active-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-rose-400 to-pink-500 rounded-r-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            activeView === 'overview' 
              ? 'bg-gradient-to-br from-white/10 to-white/[0.03]' 
              : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
          }`}>
            <Globe className={`w-4 h-4 ${activeView === 'overview' ? 'text-white' : 'text-white/50'}`} />
          </div>
          <span className={`text-sm transition-colors ${
            activeView === 'overview' ? 'text-white font-medium' : 'text-white/50 group-hover:text-white/70'
          }`}>
            Overview
          </span>
        </button>
        
        {/* Divider */}
        <div className="my-3 mx-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 mb-2">
          Artifacts
        </p>
        
        {/* Artifact Items */}
        {(Object.keys(viewConfig) as ArtifactView[]).map((viewKey, index) => {
          const config = viewConfig[viewKey];
          const Icon = config.icon;
          const isActive = activeView === viewKey;
          const status = getStatusForView(viewKey);
          const documentType = documentTypeMap[viewKey];
          
          const handleClick = () => {
            // For landing page, use the old flow (for now)
            if (viewKey === 'landing-page') {
              setActiveView(viewKey);
              return;
            }
            
            // For privacy policy and terms, use the new flow
            if (documentType) {
              const hasGeneratedDocument = generatedDocuments[documentType as keyof typeof generatedDocuments];
              
              if (status === 'not_created' && !hasGeneratedDocument) {
                // New document - go to guided interview
                router.push(`/web-presence/create?type=${documentType}`);
              } else {
                // Existing document - go to edit canvas
                router.push(`/web-presence/edit?type=${documentType}`);
              }
            }
          };
          
          return (
            <motion.button
              key={viewKey}
              onClick={handleClick}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all relative group ${
                isActive
                  ? 'bg-white/[0.08]'
                  : 'hover:bg-white/[0.04]'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-rose-400 to-pink-500 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                status === 'ready'
                  ? 'bg-emerald-500/20'
                  : isActive 
                    ? 'bg-gradient-to-br from-white/10 to-white/[0.03]' 
                    : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
              }`}>
                {status === 'ready' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/50'}`} />
                )}
                
                {/* Draft indicator dot */}
                {status === 'draft' && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#050505]" />
                )}
              </div>
              
              {/* Label and badges */}
              <div className="flex-1 flex flex-col items-start min-w-0">
                <span className={`text-sm transition-colors truncate ${
                  isActive ? 'text-white font-medium' : 'text-white/50 group-hover:text-white/70'
                }`}>
                  {config.label}
                </span>
                {config.required && status !== 'ready' && (
                  <span className="text-[9px] text-rose-400/80 font-medium">
                      Required
                    </span>
                  )}
              </div>
              
              {/* Chevron */}
              <ChevronRight className={`w-4 h-4 transition-all ${
                isActive ? 'text-white/40' : 'text-white/20 group-hover:text-white/30'
              } ${isActive ? '' : 'group-hover:translate-x-0.5'}`} />
            </motion.button>
          );
        })}
        
        {/* Divider */}
        <div className="my-3 mx-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 mb-2">
          Operations
        </p>
        
        {/* Admin */}
        <button
          onClick={() => setActiveView('admin')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all relative group ${
            activeView === 'admin'
              ? 'bg-white/[0.08]'
              : 'hover:bg-white/[0.04]'
          }`}
        >
          {activeView === 'admin' && (
            <motion.div
              layoutId="active-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-rose-400 to-pink-500 rounded-r-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            activeView === 'admin' 
              ? 'bg-gradient-to-br from-white/10 to-white/[0.03]' 
              : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
          }`}>
            <Settings className={`w-4 h-4 ${activeView === 'admin' ? 'text-white' : 'text-white/50'}`} />
          </div>
          
          <div className="flex-1 flex flex-col items-start min-w-0">
            <span className={`text-sm transition-colors truncate ${
              activeView === 'admin' ? 'text-white font-medium' : 'text-white/50 group-hover:text-white/70'
            }`}>
              Admin & Moderation
            </span>
            <span className="text-[10px] text-white/30">
              Review + support + billing ops
            </span>
          </div>
          
          <ChevronRight className={`w-4 h-4 transition-all ${
            activeView === 'admin' ? 'text-white/40' : 'text-white/20 group-hover:text-white/30'
          } ${activeView === 'admin' ? '' : 'group-hover:translate-x-0.5'}`} />
        </button>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        {moduleStatus === 'ready' ? (
          <motion.div 
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-500/10 rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-400" />
          </div>
            <span className="text-xs text-emerald-400 font-medium">Ready for App Store</span>
          </motion.div>
        ) : (
          <div className="text-[11px] text-white/30 text-center leading-relaxed">
            <p>Complete required items to reduce</p>
            <p>App Store rejections</p>
          </div>
        )}
      </div>
    </div>
  );
}
