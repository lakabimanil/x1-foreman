'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, ChevronDown, ChevronUp, Package, 
  FileText, Tag, Copy, Check, ExternalLink
} from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';

export default function AppStoreReadiness() {
  const { getAppStoreReadiness, getCurrentScenario } = useRevenueStore();
  const readiness = getAppStoreReadiness();
  const scenario = getCurrentScenario();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const allReady = readiness.pricingMapped && readiness.reviewNotesGenerated;
  
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Ready for App Store</h1>
          <p className="text-sm text-gray-75">
            x1 will handle App Store submission on your behalf.
          </p>
        </motion.div>
        
        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-8 p-6 rounded-2xl border ${
            allReady 
              ? 'bg-accent-green/10 border-accent-green/20' 
              : 'bg-gray-150 border-gray-125'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              allReady ? 'bg-accent-green/20' : 'bg-gray-125'
            }`}>
              <Package className={`w-6 h-6 ${allReady ? 'text-accent-green' : 'text-gray-75'}`} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white mb-3">
                {allReady ? 'Ready for submission' : 'Configuration Summary'}
              </h2>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-green" />
                  <span className="text-sm text-gray-75">
                    {readiness.subscriptions} subscription{readiness.subscriptions !== 1 ? 's' : ''}
                  </span>
                </div>
                {readiness.consumables > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-green" />
                    <span className="text-sm text-gray-75">
                      {readiness.consumables} consumable{readiness.consumables !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {readiness.oneTimePurchases > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-green" />
                    <span className="text-sm text-gray-75">
                      {readiness.oneTimePurchases} one-time purchase{readiness.oneTimePurchases !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${readiness.pricingMapped ? 'text-accent-green' : 'text-gray-100'}`} />
                  <span className="text-sm text-gray-75">Pricing mapped</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${readiness.reviewNotesGenerated ? 'text-accent-green' : 'text-gray-100'}`} />
                  <span className="text-sm text-gray-75">Review notes generated</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Expandable details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-150 border border-gray-125 hover:bg-gray-125 transition-colors"
          >
            <span className="text-sm font-medium text-white">
              Technical Details (for power users)
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-75" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-75" />
            )}
          </button>
        </motion.div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
                {readiness.products.map((product, index) => (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 rounded-xl bg-gray-150 border border-gray-125"
                  >
                    {/* Product header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{product.displayName}</h3>
                        <p className="text-xs text-gray-100">{product.productType}</p>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-accent-green/10 text-accent-green text-[10px] font-medium">
                        Mapped
                      </div>
                    </div>
                    
                    {/* Product ID */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-100">Product ID</span>
                        <button
                          onClick={() => copyToClipboard(product.productId, product.productId)}
                          className="text-gray-100 hover:text-white transition-colors"
                        >
                          {copiedId === product.productId ? (
                            <Check className="w-3 h-3 text-accent-green" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <code className="block px-3 py-2 rounded-lg bg-gray-175 text-xs text-accent-blue font-mono">
                        {product.productId}
                      </code>
                    </div>
                    
                    {/* Price tiers */}
                    <div className="mb-3">
                      <span className="text-xs text-gray-100 block mb-1">Price Tiers</span>
                      <div className="flex flex-wrap gap-1">
                        {product.priceTiers.map((tier, i) => (
                          <span 
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-gray-175 text-xs text-gray-75"
                          >
                            {tier}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Subscription group */}
                    {product.subscriptionGroup && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-100 block mb-1">Subscription Group</span>
                        <code className="px-2 py-1 rounded-md bg-gray-175 text-xs text-gray-75 font-mono">
                          {product.subscriptionGroup}
                        </code>
                      </div>
                    )}
                    
                    {/* Review notes */}
                    <div>
                      <span className="text-xs text-gray-100 block mb-1">Review Notes</span>
                      <p className="text-xs text-gray-75 p-2 rounded-lg bg-gray-175 leading-relaxed">
                        {product.reviewNotes}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 rounded-xl bg-gray-175 border border-gray-125"
        >
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-100 flex-shrink-0" />
            <div>
              <p className="text-sm text-white mb-1">Automatic submission</p>
              <p className="text-xs text-gray-75 leading-relaxed">
                When you're ready to publish, x1 will configure your App Store Connect 
                account with these in-app purchases. You'll just need to approve the final submission.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
