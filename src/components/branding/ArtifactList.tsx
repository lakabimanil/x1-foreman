'use client';

import { motion } from 'framer-motion';
import { 
  Type, 
  Image, 
  Images, 
  FileText, 
  Hash, 
  Shield,
  Check,
  ArrowLeft,
  FolderOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useBrandingStore } from '@/store/useBrandingStore';
import type { ArtifactType, ArtifactStatus } from '@/types/branding';

const artifactConfig: Record<ArtifactType, {
  icon: React.ElementType;
  label: string;
}> = {
  assets: { icon: FolderOpen, label: 'Assets' },
  name: { icon: Type, label: 'Name' },
  icon: { icon: Image, label: 'Icon' },
  screenshots: { icon: Images, label: 'Screenshots' },
  copy: { icon: FileText, label: 'Copy' },
  keywords: { icon: Hash, label: 'Keywords' },
  riskCheck: { icon: Shield, label: 'Review' },
};

export default function ArtifactList() {
  const { 
    artifacts, 
    activeArtifact, 
    setActiveArtifact, 
    progress, 
  } = useBrandingStore();
  
  const artifactOrder: ArtifactType[] = ['name', 'assets', 'icon', 'screenshots', 'copy', 'keywords', 'riskCheck'];
  
  return (
    <div className="w-[200px] min-w-[200px] bg-[#0a0a0a] flex flex-col h-full">
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
      
      {/* Minimal Header */}
      <div className="p-5 pb-4">
        <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-1">
          Brand Studio
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light text-white">{progress.completedCount}</span>
          <span className="text-sm text-neutral-600">/ {progress.totalCount}</span>
        </div>
      </div>
      
      {/* Simple Progress Line */}
      <div className="mx-5 mb-6">
        <div className="h-[2px] bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${(progress.completedCount / progress.totalCount) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
      
      {/* Artifact List */}
      <nav className="flex-1 px-3">
        {artifactOrder.map((artifactKey) => {
          const artifact = artifacts[artifactKey];
          const config = artifactConfig[artifactKey];
          const Icon = config.icon;
          const isActive = activeArtifact === artifactKey;
          const isLocked = artifact.status === 'locked';
          
          return (
            <button
              key={artifactKey}
              onClick={() => setActiveArtifact(artifactKey)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all relative ${
                isActive
                  ? 'bg-white/[0.06]'
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-artifact"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isActive ? 'bg-white/10' : 'bg-transparent'
              }`}>
                {isLocked ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                )}
              </div>
              
              {/* Label */}
              <span className={`text-sm transition-colors ${
                isActive ? 'text-white font-medium' : 'text-neutral-500'
              }`}>
                {config.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      {/* Minimal Footer */}
      <div className="p-4 mt-auto">
        <div className="text-[10px] text-neutral-600 text-center">
          {progress.completedCount === progress.totalCount ? (
            <span className="text-emerald-400">Ready to export</span>
          ) : (
            <span>{progress.totalCount - progress.completedCount} remaining</span>
          )}
        </div>
      </div>
    </div>
  );
}
