'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Check, Zap, Brain } from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';

export default function RiskCheckWorkspace() {
  const { artifacts, runRiskCheck, applyFix, isGenerating } = useBrandingStore();
  const { result, lastChecked, checkMode } = artifacts.riskCheck;
  
  const getRiskColor = (score: number) => {
    if (score <= 25) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (score <= 50) return { text: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10' };
  };
  
  const getRiskLabel = (score: number) => {
    if (score <= 25) return 'Low Risk';
    if (score <= 50) return 'Medium Risk';
    return 'High Risk';
  };
  
  return (
    <div className="p-6">
      {/* Check Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => runRiskCheck('fast')}
          disabled={isGenerating}
          className={`p-4 rounded-xl text-left transition-all ${
            checkMode === 'fast' && result
              ? 'bg-white/5 ring-1 ring-white/10'
              : 'bg-neutral-900 hover:bg-neutral-800'
          }`}
        >
          <Zap className="w-5 h-5 text-amber-400 mb-2" />
          <p className="text-sm font-medium text-white">Fast Check</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Quick policy scan</p>
        </button>
        
        <button
          onClick={() => runRiskCheck('llm')}
          disabled={isGenerating}
          className={`p-4 rounded-xl text-left transition-all ${
            checkMode === 'llm' && result
              ? 'bg-white/5 ring-1 ring-white/10'
              : 'bg-neutral-900 hover:bg-neutral-800'
          }`}
        >
          <Brain className="w-5 h-5 text-purple-400 mb-2" />
          <p className="text-sm font-medium text-white">Deep Analysis</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">AI-powered review</p>
        </button>
      </div>
      
      {/* Results */}
      {result ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Score */}
          <div className={`p-5 rounded-2xl ${getRiskColor(result.score).bg} mb-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-3xl font-light ${getRiskColor(result.score).text}`}>
                  {result.score}
                  <span className="text-lg text-neutral-500">/100</span>
                </p>
                <p className={`text-sm ${getRiskColor(result.score).text} mt-1`}>
                  {getRiskLabel(result.score)}
                </p>
              </div>
              <Shield className={`w-10 h-10 ${getRiskColor(result.score).text} opacity-50`} />
            </div>
            {lastChecked && (
              <p className="text-[10px] text-neutral-500 mt-3">
                Last checked: {new Date(lastChecked).toLocaleTimeString()}
              </p>
            )}
          </div>
          
          {/* Findings */}
          {result.findings.length > 0 && (
            <div>
              <p className="text-xs text-neutral-500 mb-3">
                {result.findings.filter(f => !f.applied).length} issues found
              </p>
              
              <div className="space-y-3">
                {result.findings.map((finding) => (
                  <motion.div
                    key={finding.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: finding.applied ? 0.4 : 1 }}
                    className={`p-4 rounded-xl bg-neutral-900 ${finding.applied ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        finding.severity === 'high' ? 'text-rose-400' :
                        finding.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white mb-1">
                          "{finding.phrase}"
                        </p>
                        <p className="text-xs text-neutral-500 mb-2">
                          {finding.explanation}
                        </p>
                        
                        {finding.suggestedFix && !finding.applied && (
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-neutral-400">
                              → {finding.suggestedFix}
                            </span>
                            <button
                              onClick={() => applyFix(finding.id)}
                              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] text-white transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                        )}
                        
                        {finding.applied && (
                          <div className="flex items-center gap-1.5 mt-2 text-emerald-400">
                            <Check className="w-3 h-3" />
                            <span className="text-[10px]">Fixed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* No Issues */}
          {result.findings.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm text-emerald-400">No issues found</p>
              <p className="text-xs text-neutral-500 mt-1">Your content looks good!</p>
            </div>
          )}
        </motion.div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400 mb-1">Ready to check</p>
          <p className="text-xs text-neutral-600">Run a check to find policy issues</p>
        </div>
      )}
    </div>
  );
}
