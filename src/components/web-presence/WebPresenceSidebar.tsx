'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Globe,
  Shield,
  FileText,
  Layout,
  Check,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import type { WebPresenceState } from '@/types/webPresence';

type ViewType = WebPresenceState['activeView'];

const viewConfig: Record<Exclude<ViewType, 'overview'>, {
  icon: React.ElementType;
  label: string;
  required: boolean;
}> = {
  'privacy-policy': { icon: Shield, label: 'Privacy Policy', required: true },
  'terms': { icon: FileText, label: 'Terms of Service', required: true },
  'landing-page': { icon: Layout, label: 'Landing Page', required: false },
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
  
  const getStatusForView = (view: Exclude<ViewType, 'overview'>) => {
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
  
  return (
    <div className="w-[220px] min-w-[220px] bg-[#0a0a0a] flex flex-col h-full border-r border-gray-125">
      {/* Back Button */}
      <div className="p-4 pb-0">
        <Link 
          href="/"
          className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs">Back to Milestones</span>
        </Link>
      </div>
      
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">Web Presence</span>
        </div>
        <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-1">
          Progress
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light text-white">{completedCount}</span>
          <span className="text-sm text-neutral-600">/ 3 artifacts</span>
        </div>
      </div>
      
      {/* Progress Line */}
      <div className="mx-5 mb-4">
        <div className="h-[2px] bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
      
      {/* Required Badge */}
      <div className="mx-5 mb-4">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
          requiredCount === 2 
            ? 'bg-green-500/10 text-green-400' 
            : 'bg-amber-500/10 text-amber-400'
        }`}>
          {requiredCount === 2 ? (
            <>
              <Check className="w-3 h-3" />
              <span>Required items complete</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3" />
              <span>{2 - requiredCount} required item{2 - requiredCount !== 1 ? 's' : ''} remaining</span>
            </>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3">
        {/* Overview */}
        <button
          onClick={() => setActiveView('overview')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all relative ${
            activeView === 'overview'
              ? 'bg-white/[0.06]'
              : 'hover:bg-white/[0.03]'
          }`}
        >
          {activeView === 'overview' && (
            <motion.div
              layoutId="active-web-view"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-r-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            activeView === 'overview' ? 'bg-white/10' : 'bg-transparent'
          }`}>
            <Globe className={`w-4 h-4 ${activeView === 'overview' ? 'text-white' : 'text-neutral-500'}`} />
          </div>
          <span className={`text-sm transition-colors ${
            activeView === 'overview' ? 'text-white font-medium' : 'text-neutral-500'
          }`}>
            Overview
          </span>
        </button>
        
        {/* Divider */}
        <div className="h-px bg-neutral-800 my-3 mx-3" />
        <p className="text-[10px] font-medium text-neutral-600 uppercase tracking-widest px-3 mb-2">
          Artifacts
        </p>
        
        {/* Artifact Items */}
        {(Object.keys(viewConfig) as Exclude<ViewType, 'overview'>[]).map((viewKey) => {
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
            <button
              key={viewKey}
              onClick={handleClick}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all relative ${
                isActive
                  ? 'bg-white/[0.06]'
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-web-view"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isActive ? 'bg-white/10' : 'bg-transparent'
              }`}>
                {status === 'ready' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                )}
              </div>
              
              {/* Label and badges */}
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className={`text-sm transition-colors truncate ${
                  isActive ? 'text-white font-medium' : 'text-neutral-500'
                }`}>
                  {config.label}
                </span>
                
                <div className="flex items-center gap-1.5">
                  {config.required && (
                    <span className="text-[9px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Required
                    </span>
                  )}
                  {status === 'draft' && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-neutral-800">
        {moduleStatus === 'ready' ? (
          <div className="text-[11px] text-emerald-400 text-center flex items-center justify-center gap-1.5">
            <Check className="w-3 h-3" />
            <span>Ready for App Store</span>
          </div>
        ) : (
          <div className="text-[10px] text-neutral-500 text-center">
            <p>Complete required items to reduce</p>
            <p>App Store rejections</p>
          </div>
        )}
      </div>
    </div>
  );
}
