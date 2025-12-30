'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Play, ChevronRight, AlertTriangle, Check, DollarSign, User, Clock } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { EdgeCaseScenario } from '@/types/revenue';

const CATEGORY_COLORS = {
  'user-action': { bg: 'bg-accent-blue/10', border: 'border-accent-blue/30', text: 'text-accent-blue' },
  'system-event': { bg: 'bg-accent-purple/10', border: 'border-accent-purple/30', text: 'text-accent-purple' },
  'creator-event': { bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/30', text: 'text-accent-yellow' },
  'payment-issue': { bg: 'bg-accent-red/10', border: 'border-accent-red/30', text: 'text-accent-red' },
};

const CATEGORY_ICONS = {
  'user-action': '👤',
  'system-event': '⚙️',
  'creator-event': '🎬',
  'payment-issue': '💳',
};

export default function EdgeCaseSimulator() {
  const { 
    edgeCaseScenarios, 
    selectedEdgeCaseId, 
    selectEdgeCase,
    simulateEdgeCase,
    getCurrentScenario,
    openOfferEditor,
  } = useRevenueStore();
  
  const [simulationResult, setSimulationResult] = useState<{
    outcome: string;
    actions: string[];
  } | null>(null);
  
  const scenario = getCurrentScenario();
  
  const handleSelectScenario = (scenarioId: string) => {
    selectEdgeCase(scenarioId);
    setSimulationResult(null);
  };
  
  const handleSimulate = () => {
    if (!selectedEdgeCaseId) return;
    const result = simulateEdgeCase(selectedEdgeCaseId);
    setSimulationResult(result);
  };
  
  const selectedScenario = edgeCaseScenarios.find(s => s.id === selectedEdgeCaseId);
  
  // Group scenarios by category
  const groupedScenarios = edgeCaseScenarios.reduce((acc, scenario) => {
    if (!acc[scenario.category]) acc[scenario.category] = [];
    acc[scenario.category].push(scenario);
    return acc;
  }, {} as Record<string, EdgeCaseScenario[]>);
  
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Scenario List */}
      <div className="w-80 border-r border-gray-125 bg-gray-175 overflow-y-auto">
        <div className="p-4 border-b border-gray-125">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-5 h-5 text-accent-purple" />
            <h2 className="text-sm font-semibold text-white">Edge Case Simulator</h2>
          </div>
          <p className="text-xs text-gray-75">
            Test how your configuration handles real-world scenarios
          </p>
        </div>
        
        <div className="p-2">
          {Object.entries(groupedScenarios).map(([category, scenarios]) => (
            <div key={category} className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1">
                <span>{CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}</span>
                <span className="text-xs font-medium text-gray-100 uppercase tracking-wide">
                  {category.replace('-', ' ')}
                </span>
              </div>
              
              {scenarios.map((scenario) => {
                const colors = CATEGORY_COLORS[scenario.category];
                const isSelected = selectedEdgeCaseId === scenario.id;
                
                return (
                  <button
                    key={scenario.id}
                    onClick={() => handleSelectScenario(scenario.id)}
                    className={`w-full p-3 rounded-xl mb-1 text-left transition-all ${
                      isSelected
                        ? `${colors.bg} ${colors.border} border`
                        : 'hover:bg-gray-150'
                    }`}
                  >
                    <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-75'}`}>
                      {scenario.name}
                    </p>
                    <p className="text-xs text-gray-100 mt-0.5 line-clamp-2">
                      {scenario.description}
                    </p>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Scenario Details */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedScenario ? (
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                CATEGORY_COLORS[selectedScenario.category].bg
              } ${CATEGORY_COLORS[selectedScenario.category].text}`}>
                <span>{CATEGORY_ICONS[selectedScenario.category]}</span>
                {selectedScenario.category.replace('-', ' ')}
              </div>
              <h1 className="text-xl font-bold text-white mb-2">{selectedScenario.name}</h1>
              <p className="text-sm text-gray-75">{selectedScenario.description}</p>
            </div>
            
            {/* Setup */}
            <div className="mb-6 p-4 rounded-xl bg-gray-150 border border-gray-125">
              <h3 className="text-xs font-medium text-gray-100 uppercase tracking-wide mb-3">
                Scenario Setup
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-125 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-75" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-100">User Type</p>
                    <p className="text-sm text-white capitalize">
                      {selectedScenario.setup.userType.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-125 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-gray-75" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-100">Related Offers</p>
                    <div className="flex gap-1 mt-1">
                      {selectedScenario.setup.offerIds.map((offerId) => {
                        const offer = scenario.offers.find(o => o.id === offerId);
                        return (
                          <button
                            key={offerId}
                            onClick={() => openOfferEditor(offerId)}
                            className="px-2 py-1 rounded bg-gray-125 text-xs text-white hover:bg-gray-100 transition-colors"
                          >
                            {offer?.icon} {offer?.name || offerId}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-125 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-75" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-100">Timeline</p>
                    <p className="text-sm text-white">{selectedScenario.setup.timeline}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Event */}
            <div className="mb-6 p-4 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20">
              <h3 className="text-xs font-medium text-accent-yellow uppercase tracking-wide mb-2">
                ⚡ Event Occurs
              </h3>
              <p className="text-sm text-white">{selectedScenario.event.description}</p>
            </div>
            
            {/* Simulate Button */}
            <button
              onClick={handleSimulate}
              className="w-full py-3 rounded-xl bg-accent-purple text-white font-medium flex items-center justify-center gap-2 hover:bg-accent-purple/90 transition-colors mb-6"
            >
              <Play className="w-4 h-4" />
              Simulate with Current Config
            </button>
            
            {/* Simulation Result */}
            <AnimatePresence>
              {simulationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Outcome */}
                  <div className="p-4 rounded-xl bg-gray-150 border border-gray-125">
                    <h3 className="text-xs font-medium text-gray-100 uppercase tracking-wide mb-2">
                      📋 Outcome
                    </h3>
                    <p className="text-sm text-white">{simulationResult.outcome}</p>
                  </div>
                  
                  {/* Actions */}
                  {simulationResult.actions.length > 0 && (
                    <div className="p-4 rounded-xl bg-gray-150 border border-gray-125">
                      <h3 className="text-xs font-medium text-gray-100 uppercase tracking-wide mb-3">
                        ⚡ System Actions
                      </h3>
                      <div className="space-y-2">
                        {simulationResult.actions.map((action, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-white">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recommendations */}
                  {simulationResult.outcome.includes('Configure') && (
                    <div className="p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-white mb-1">Configuration Needed</p>
                          <p className="text-xs text-gray-75 mb-3">
                            Configure the relevant offer settings to see how this scenario would be handled.
                          </p>
                          <div className="flex gap-2">
                            {selectedScenario.setup.offerIds.map((offerId) => {
                              const offer = scenario.offers.find(o => o.id === offerId);
                              return (
                                <button
                                  key={offerId}
                                  onClick={() => openOfferEditor(offerId, 'moderation')}
                                  className="px-3 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-medium hover:bg-accent-blue/90 transition-colors"
                                >
                                  Configure {offer?.name || offerId}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FlaskConical className="w-12 h-12 text-gray-125 mx-auto mb-4" />
              <p className="text-sm text-gray-75 mb-2">Select a scenario to simulate</p>
              <p className="text-xs text-gray-100">
                Test how your revenue configuration handles edge cases
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
