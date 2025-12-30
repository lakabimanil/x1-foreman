'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, ShoppingBag, Heart, Eye, Check, FlaskConical, AlertTriangle
} from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import OffersCanvas from './OffersCanvas';
import OfferEditor from './OfferEditor';
import RevenueHealth from './RevenueHealth';
import MoneyMapPreview from './MoneyMapPreview';
import AppStoreReadiness from './AppStoreReadiness';
import AddOfferModal from './AddOfferModal';
import RevenueToast from './RevenueToast';
import EdgeCaseSimulator from './EdgeCaseSimulator';

// Updated IA with Edge Case Simulator
import type { RevenueView } from '@/types/revenue';

interface NavItemType {
  id: RevenueView;
  label: string;
  icon: typeof ShoppingBag;
  primary?: boolean;
  secondary?: boolean;
  highlight?: boolean;
}

const navItems: NavItemType[] = [
  { id: 'offers', label: 'Offers', icon: ShoppingBag, primary: true },
  { id: 'health', label: 'Revenue Health', icon: Heart },
  { id: 'edge-cases', label: 'Edge Case Simulator', icon: FlaskConical, highlight: true },
  { id: 'money-map', label: 'Money Map', icon: Eye, secondary: true },
  { id: 'app-store', label: 'Ready for App Store', icon: Check, secondary: true },
];

export default function RevenueLayout() {
  const { 
    activeView, 
    setActiveView, 
    currentScenario,
    setScenario,
    getHealthIssues,
    getCurrentScenario,
  } = useRevenueStore();
  
  const scenario = getCurrentScenario();
  const issues = getHealthIssues();
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const totalIssues = errorCount + warningCount;
  
  // Calculate edge case coverage
  const offers = scenario.offers;
  const creatorLinkedOffers = offers.filter(o => o.linkedToCreator);
  const edgeCasesCovered = creatorLinkedOffers.filter(o => 
    o.moderationPolicy?.enabled || o.creatorDeparturePolicy
  ).length;
  const edgeCasesTotal = creatorLinkedOffers.length;
  
  // Editor has its own layout
  if (activeView === 'editor') {
    return (
      <div className="min-h-screen bg-gray-175 flex flex-col">
        <OfferEditor />
        <RevenueToast />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-125 bg-gray-175 flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Back to home */}
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-75 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </Link>
          
          <div className="h-6 w-px bg-gray-125" />
          
          {/* Module title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-green/20 flex items-center justify-center">
              <span className="text-base">💰</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Revenue</h1>
              <p className="text-[10px] text-gray-75">Offers & Monetization</p>
            </div>
          </div>
        </div>
        
        {/* Center: Scenario Switcher */}
        <div className="flex items-center gap-2 p-1 bg-gray-150 rounded-lg border border-gray-125">
          {(['cal-ai', 'livestream'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${currentScenario === s 
                  ? 'bg-white text-black' 
                  : 'text-gray-75 hover:text-white'
                }
              `}
            >
              {s === 'cal-ai' ? '🍎 Cal AI' : '📺 Livestream'}
            </button>
          ))}
        </div>
        
        {/* Right: Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-75">Active Offers</p>
            <p className="text-sm font-medium text-white">
              {scenario.offers.filter((o) => o.status !== 'inactive').length}
            </p>
          </div>
          {currentScenario === 'livestream' && edgeCasesTotal > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-75">Edge Cases</p>
              <p className={`text-sm font-medium ${edgeCasesCovered === edgeCasesTotal ? 'text-accent-green' : 'text-accent-yellow'}`}>
                {edgeCasesCovered}/{edgeCasesTotal} configured
              </p>
            </div>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation */}
        <nav className="w-56 min-w-[224px] bg-gray-175 border-r border-gray-125 flex flex-col">
          <div className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left
                    ${isActive 
                      ? 'bg-white text-black' 
                      : item.highlight
                        ? 'text-accent-purple hover:bg-accent-purple/10 hover:text-accent-purple'
                        : item.secondary
                          ? 'text-gray-100 hover:bg-gray-150 hover:text-white'
                          : 'text-gray-75 hover:bg-gray-150 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  
                  {/* Warning badge for health */}
                  {item.id === 'health' && totalIssues > 0 && !isActive && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                      errorCount > 0 
                        ? 'bg-accent-red/20 text-accent-red' 
                        : 'bg-accent-yellow/20 text-accent-yellow'
                    }`}>
                      {totalIssues}
                    </span>
                  )}
                  
                  {/* NEW badge for edge cases */}
                  {item.id === 'edge-cases' && !isActive && (
                    <span className="px-1.5 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple text-[10px] font-medium">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Edge case quick status */}
          {currentScenario === 'livestream' && (
            <div className="px-4 pb-4">
              <div className="p-3 rounded-xl bg-gray-150 border border-gray-125">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="w-4 h-4 text-accent-purple" />
                  <p className="text-[10px] text-gray-100 uppercase tracking-wide">Edge Cases</p>
                </div>
                
                <div className="space-y-1.5">
                  {[
                    { label: 'User bans', done: creatorLinkedOffers.some(o => o.moderationPolicy?.enabled) },
                    { label: 'Creator departure', done: creatorLinkedOffers.some(o => o.creatorDeparturePolicy) },
                    { label: 'Payment failures', done: offers.some(o => o.subscriptionConfig?.gracePeriod?.enabled) },
                    { label: 'Alt unlock paths', done: offers.some(o => o.unlockConditions && o.unlockConditions.length > 1) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      {item.done ? (
                        <Check className="w-3 h-3 text-accent-green" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-accent-yellow" />
                      )}
                      <span className={`text-xs ${item.done ? 'text-gray-75' : 'text-accent-yellow'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Footer info */}
          <div className="p-4 border-t border-gray-125">
            <div className="p-3 rounded-xl bg-gray-150 border border-gray-125">
              <p className="text-[10px] text-gray-100 uppercase tracking-wide mb-1">Current App</p>
              <p className="text-sm font-medium text-white flex items-center gap-2">
                <span>{scenario.icon}</span>
                {scenario.name}
              </p>
            </div>
          </div>
        </nav>
        
        {/* Main area */}
        <main className="flex-1 flex overflow-hidden bg-gray-175">
          <AnimatePresence mode="wait">
            {activeView === 'offers' && (
              <motion.div
                key="offers"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-1 flex"
              >
                <OffersCanvas />
              </motion.div>
            )}
            
            {activeView === 'health' && (
              <motion.div
                key="health"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-1 flex"
              >
                <RevenueHealth />
              </motion.div>
            )}
            
            {activeView === 'edge-cases' && (
              <motion.div
                key="edge-cases"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-1 flex"
              >
                <EdgeCaseSimulator />
              </motion.div>
            )}
            
            {activeView === 'money-map' && (
              <motion.div
                key="money-map"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-1 flex"
              >
                <MoneyMapPreview />
              </motion.div>
            )}
            
            {activeView === 'app-store' && (
              <motion.div
                key="app-store"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-1 flex"
              >
                <AppStoreReadiness />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      {/* Modals */}
      <AddOfferModal />
      <RevenueToast />
    </div>
  );
}
