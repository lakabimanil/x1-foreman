'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Check,
  Info,
  Save,
  ArrowLeft,
  CheckCircle,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  X,
} from 'lucide-react';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';

export function TermsEditor() {
  const {
    artifacts,
    updateTerms,
    setTermsStatus,
    setActiveView,
    isPreviewOpen,
    togglePreview,
  } = useWebPresenceStore();
  
  const { data, status } = artifacts.terms;
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [newAcceptableUse, setNewAcceptableUse] = useState('');
  const [newProhibited, setNewProhibited] = useState('');
  const [newDisclaimer, setNewDisclaimer] = useState('');
  
  const handleSaveDraft = () => {
    setTermsStatus('draft');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  const handleMarkReady = () => {
    setTermsStatus('ready');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  const addAcceptableUse = () => {
    if (newAcceptableUse.trim()) {
      updateTerms({ acceptableUse: [...data.acceptableUse, newAcceptableUse.trim()] });
      setNewAcceptableUse('');
    }
  };
  
  const removeAcceptableUse = (index: number) => {
    updateTerms({ acceptableUse: data.acceptableUse.filter((_, i) => i !== index) });
  };
  
  const addProhibited = () => {
    if (newProhibited.trim()) {
      updateTerms({ prohibitedContent: [...data.prohibitedContent, newProhibited.trim()] });
      setNewProhibited('');
    }
  };
  
  const removeProhibited = (index: number) => {
    updateTerms({ prohibitedContent: data.prohibitedContent.filter((_, i) => i !== index) });
  };
  
  const addDisclaimer = () => {
    if (newDisclaimer.trim()) {
      updateTerms({ disclaimers: [...data.disclaimers, newDisclaimer.trim()] });
      setNewDisclaimer('');
    }
  };
  
  const removeDisclaimer = (index: number) => {
    updateTerms({ disclaimers: data.disclaimers.filter((_, i) => i !== index) });
  };
  
  return (
    <div className="h-full flex">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('overview')}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <div className="h-4 w-px bg-neutral-800" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-white">Terms of Service</h1>
                <p className="text-xs text-neutral-500">Required for App Store</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={togglePreview}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              title={isPreviewOpen ? 'Hide Preview' : 'Show Preview'}
            >
              {isPreviewOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            
            <button
              onClick={handleMarkReady}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Ready
            </button>
          </div>
        </header>
        
        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#0a0a0a] to-black">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"
            >
              <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-200">
                <p className="font-medium mb-1">Why this matters</p>
                <p className="text-amber-300/80">
                  Terms of Service protect your app and set expectations for users. While not strictly required 
                  by Apple, they're essential for apps with user accounts, subscriptions, or user-generated content.
                </p>
              </div>
            </motion.div>
            
            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">App Name</label>
                  <input
                    type="text"
                    value={data.appName}
                    onChange={(e) => updateTerms({ appName: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="Your app name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={data.companyName}
                      onChange={(e) => updateTerms({ companyName: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={data.contactEmail}
                      onChange={(e) => updateTerms({ contactEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                      placeholder="legal@yourapp.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Governing Law</label>
                  <input
                    type="text"
                    value={data.governingLaw}
                    onChange={(e) => updateTerms({ governingLaw: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="e.g., State of California, United States"
                  />
                </div>
              </div>
            </section>
            
            {/* Acceptable Use */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-2">Acceptable Use</h2>
              <p className="text-sm text-neutral-500 mb-4">
                Define what users are allowed to do with your app.
              </p>
              
              <div className="space-y-2 mb-4">
                {data.acceptableUse.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="flex-1 text-white text-sm">{item}</span>
                    <button
                      onClick={() => removeAcceptableUse(index)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAcceptableUse}
                  onChange={(e) => setNewAcceptableUse(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAcceptableUse()}
                  className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                  placeholder="Add acceptable use..."
                />
                <button
                  onClick={addAcceptableUse}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </section>
            
            {/* Prohibited Content */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-2">Prohibited Content</h2>
              <p className="text-sm text-neutral-500 mb-4">
                Define what users are NOT allowed to do.
              </p>
              
              <div className="space-y-2 mb-4">
                {data.prohibitedContent.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-neutral-900 border border-red-900/30 rounded-xl">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="flex-1 text-white text-sm">{item}</span>
                    <button
                      onClick={() => removeProhibited(index)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProhibited}
                  onChange={(e) => setNewProhibited(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addProhibited()}
                  className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                  placeholder="Add prohibited content..."
                />
                <button
                  onClick={addProhibited}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </section>
            
            {/* Subscription Terms */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Subscription Terms</h2>
              
              <motion.button
                onClick={() => updateTerms({ 
                  subscriptionTerms: { 
                    ...data.subscriptionTerms, 
                    hasSubscription: !data.subscriptionTerms.hasSubscription 
                  } 
                })}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left mb-4 ${
                  data.subscriptionTerms.hasSubscription
                    ? 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50'
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  data.subscriptionTerms.hasSubscription ? 'bg-purple-500' : 'bg-neutral-700'
                }`}>
                  {data.subscriptionTerms.hasSubscription && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">App has subscriptions</div>
                  <div className="text-sm text-neutral-400">Include subscription-specific terms</div>
                </div>
              </motion.button>
              
              {data.subscriptionTerms.hasSubscription && (
                <div className="space-y-4 pl-4 border-l-2 border-purple-500/30">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Trial Period</label>
                    <input
                      type="text"
                      value={data.subscriptionTerms.trialPeriod}
                      onChange={(e) => updateTerms({ 
                        subscriptionTerms: { ...data.subscriptionTerms, trialPeriod: e.target.value } 
                      })}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                      placeholder="e.g., 7-day free trial"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Refund Policy</label>
                    <textarea
                      value={data.subscriptionTerms.refundPolicy}
                      onChange={(e) => updateTerms({ 
                        subscriptionTerms: { ...data.subscriptionTerms, refundPolicy: e.target.value } 
                      })}
                      rows={3}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                      placeholder="Describe your refund policy..."
                    />
                  </div>
                </div>
              )}
            </section>
            
            {/* Disclaimers */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-2">Disclaimers</h2>
              <p className="text-sm text-neutral-500 mb-4">
                Add legal disclaimers to limit liability.
              </p>
              
              <div className="space-y-2 mb-4">
                {data.disclaimers.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
                    <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="flex-1 text-white text-sm">{item}</span>
                    <button
                      onClick={() => removeDisclaimer(index)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDisclaimer}
                  onChange={(e) => setNewDisclaimer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addDisclaimer()}
                  className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                  placeholder="Add disclaimer..."
                />
                <button
                  onClick={addDisclaimer}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* Preview Panel */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 480, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l border-neutral-800 bg-white overflow-hidden"
          >
            <div className="w-[480px] h-full overflow-y-auto">
              <TermsPreview data={data} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 bg-emerald-500 text-white rounded-xl shadow-lg"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {status === 'ready' ? 'Terms of Service marked as ready!' : 'Draft saved!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Preview Component
function TermsPreview({ data }: { data: typeof useWebPresenceStore extends () => infer R ? R extends { artifacts: { terms: { data: infer D } } } ? D : never : never }) {
  return (
    <div className="p-8 min-h-full">
      <div className="max-w-lg mx-auto">
        {/* Preview Header */}
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Terms of Service</h1>
          <p className="text-sm text-gray-500">{data.appName}</p>
          <p className="text-xs text-gray-400 mt-2">Effective Date: {data.effectiveDate}</p>
        </div>
        
        {/* Content */}
        <div className="prose prose-sm prose-gray max-w-none">
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Agreement to Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              By accessing or using {data.appName}, you agree to be bound by these Terms of Service 
              and our Privacy Policy. If you disagree with any part of these terms, you may not 
              access the application.
            </p>
          </section>
          
          {data.acceptableUse.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Acceptable Use</h2>
              <p className="text-gray-600 text-sm mb-2">You may use {data.appName} to:</p>
              <ul className="space-y-1">
                {data.acceptableUse.map((item, index) => (
                  <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {data.prohibitedContent.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Prohibited Activities</h2>
              <p className="text-gray-600 text-sm mb-2">You may not:</p>
              <ul className="space-y-1">
                {data.prohibitedContent.map((item, index) => (
                  <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {data.subscriptionTerms.hasSubscription && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Subscriptions</h2>
              {data.subscriptionTerms.trialPeriod && (
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Trial Period:</span> {data.subscriptionTerms.trialPeriod}
                </p>
              )}
              {data.subscriptionTerms.refundPolicy && (
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Refund Policy:</span> {data.subscriptionTerms.refundPolicy}
                </p>
              )}
            </section>
          )}
          
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Intellectual Property</h2>
            <p className="text-gray-600 text-sm">
              {data.intellectualProperty || `All content, features, and functionality of ${data.appName} are owned by ${data.companyName} and are protected by intellectual property laws.`}
            </p>
          </section>
          
          {data.disclaimers.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Disclaimers</h2>
              <ul className="space-y-2">
                {data.disclaimers.map((item, index) => (
                  <li key={index} className="text-gray-600 text-sm">• {item}</li>
                ))}
              </ul>
            </section>
          )}
          
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Governing Law</h2>
            <p className="text-gray-600 text-sm">
              These Terms shall be governed by the laws of {data.governingLaw}, without regard 
              to its conflict of law provisions.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h2>
            <p className="text-gray-600 text-sm">
              For questions about these Terms, please contact:{' '}
              <a href={`mailto:${data.contactEmail}`} className="text-amber-600 hover:underline">
                {data.contactEmail}
              </a>
            </p>
          </section>
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {data.companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
