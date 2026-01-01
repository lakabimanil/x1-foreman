'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, DollarSign, ChevronDown } from 'lucide-react';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import CostPanel from './CostPanel';

interface ServicesStudioLayoutProps {
  children: ReactNode;
}

export default function ServicesStudioLayout({ children }: ServicesStudioLayoutProps) {
  const {
    currentView,
    returnToDashboard,
    isReadyForBuild,
    getConnectedCount,
    getTotalServicesCount,
  } = useServicesStudioStore();

  const [isCostPanelOpen, setIsCostPanelOpen] = useState(false);

  const connectedCount = getConnectedCount();
  const totalCount = getTotalServicesCount();

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Top Bar */}
      <header className="flex-shrink-0 h-14 border-b border-neutral-800/50 flex items-center px-4">
        {/* Left - Back button */}
        <div className="flex-1 flex items-center">
          {currentView === 'service-detail' ? (
            <button
              onClick={returnToDashboard}
              className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm">Dashboard</span>
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm">Home</span>
            </Link>
          )}
        </div>

        {/* Center - Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-white">
            x1<span className="text-neutral-500">.new</span>
          </span>
        </div>

        {/* Right - Actions */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <button 
            onClick={() => setIsCostPanelOpen(!isCostPanelOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
              isCostPanelOpen 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Cost</span>
          </button>

          <div className="w-px h-6 bg-neutral-800 mx-1" />

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="text-sm text-neutral-300">User</span>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex relative">
          {children}
        </div>

        {/* Cost Panel */}
        <CostPanel isOpen={isCostPanelOpen} onClose={() => setIsCostPanelOpen(false)} />
      </div>
    </main>
  );
}
