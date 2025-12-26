'use client';

import { useState, useEffect } from 'react';
import { ArtifactList, AIWorkspace, LivePreview } from '@/components/branding';
import { useBrandingStore } from '@/store/useBrandingStore';
import { ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react';

export default function BrandingPage() {
  const { initializeBranding, isInitialized } = useBrandingStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  
  useEffect(() => {
    if (!isInitialized) {
      initializeBranding();
    }
  }, [isInitialized, initializeBranding]);
  
  return (
    <main className="h-screen w-screen flex overflow-hidden bg-black">
      {/* Left - Artifact Navigation */}
      <ArtifactList />
      
      {/* Center - Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 h-full overflow-hidden">
           <AIWorkspace />
        </div>

        {/* Toggle Button for Preview Panel */}
        <button
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          className="absolute top-6 right-6 z-50 p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shadow-lg"
          title={isPreviewOpen ? "Collapse Preview" : "Expand Preview"}
        >
          {isPreviewOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Right - Preview */}
      <div 
        className={`bg-neutral-900/50 border-l border-neutral-800 transition-all duration-300 ease-in-out overflow-hidden ${
          isPreviewOpen ? 'w-[400px] opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div className="w-[400px] h-full">
           <LivePreview />
        </div>
      </div>
    </main>
  );
}
