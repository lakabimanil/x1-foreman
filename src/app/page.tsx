'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LeftPanel, CanvasPanel, CommandBar, EditPanel } from '@/components';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export default function Home() {
  const { blocks, activeBlockId, setActiveBlock, isEditPanelOpen, setEditPanelOpen } = useOnboardingStore();

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { blocks, activeBlockId, setActiveBlock, setEditPanelOpen } = useOnboardingStore.getState();
      const currentIndex = blocks.findIndex(b => b.id === activeBlockId);
      
      // Close edit panel on Escape
      if (e.key === 'Escape') {
        setEditPanelOpen(false);
        return;
      }
      
      // Arrow navigation
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setActiveBlock(blocks[currentIndex - 1].id);
      } else if (e.key === 'ArrowRight' && currentIndex < blocks.length - 1) {
        setActiveBlock(blocks[currentIndex + 1].id);
      }
      
      // E to edit
      if (e.key === 'e' && !e.metaKey && !e.ctrlKey && activeBlockId) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          setEditPanelOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set first block as active on load
  useEffect(() => {
    if (blocks.length > 0 && !activeBlockId) {
      setActiveBlock(blocks[0].id);
    }
  }, [blocks, activeBlockId, setActiveBlock]);

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-black">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - Templates, Assets, Components */}
        <LeftPanel />
        
        {/* Center Panel with Command Bar */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <CanvasPanel />
          {/* Command Bar positioned within Canvas */}
          <CommandBar />
        </div>
      </div>

      {/* Edit Panel Overlay */}
      <AnimatePresence>
        {isEditPanelOpen && activeBlock && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setEditPanelOpen(false)}
            />
            <EditPanel 
              block={activeBlock} 
              onClose={() => setEditPanelOpen(false)} 
            />
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
