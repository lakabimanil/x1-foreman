'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Check,
  X,
  Info,
  Save,
  Eye,
  ArrowLeft,
  CheckCircle,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import type { PrivacyPolicyData } from '@/types/webPresence';

export function PrivacyPolicyEditor() {
  const {
    artifacts,
    updatePrivacyPolicy,
    toggleDataCollection,
    toggleThirdPartyService,
    setPrivacyStatus,
    setActiveView,
    isPreviewOpen,
    togglePreview,
  } = useWebPresenceStore();
  
  const { data, status } = artifacts.privacyPolicy;
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const handleSaveDraft = () => {
    setPrivacyStatus('draft');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  const handleMarkReady = () => {
    setPrivacyStatus('ready');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-white">Privacy Policy</h1>
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
              className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
            >
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Why this matters</p>
                <p className="text-blue-300/80">
                  Apple requires all apps to have a Privacy Policy URL. This policy will be automatically 
                  formatted and hosted. You'll get a URL to paste into App Store Connect.
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
                    onChange={(e) => updatePrivacyPolicy({ appName: e.target.value })}
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
                      onChange={(e) => updatePrivacyPolicy({ companyName: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={data.contactEmail}
                      onChange={(e) => updatePrivacyPolicy({ contactEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                      placeholder="privacy@yourapp.com"
                    />
                  </div>
                </div>
              </div>
            </section>
            
            {/* Data Collection */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-2">Data Collection</h2>
              <p className="text-sm text-neutral-500 mb-4">
                Select the types of data your app collects from users.
              </p>
              
              <div className="space-y-2">
                {data.dataCollected.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => toggleDataCollection(item.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      item.enabled
                        ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      item.enabled ? 'bg-emerald-500' : 'bg-neutral-700'
                    }`}>
                      {item.enabled && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-sm text-neutral-400">{item.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
            
            {/* Third-Party Services */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-2">Third-Party Services</h2>
              <p className="text-sm text-neutral-500 mb-4">
                Select the third-party services integrated with your app.
              </p>
              
              <div className="space-y-2">
                {data.thirdPartyServices.map((service) => (
                  <motion.button
                    key={service.id}
                    onClick={() => toggleThirdPartyService(service.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      service.enabled
                        ? 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      service.enabled ? 'bg-blue-500' : 'bg-neutral-700'
                    }`}>
                      {service.enabled && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white">{service.name}</div>
                      <div className="text-sm text-neutral-400">{service.purpose}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
            
            {/* Additional Settings */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Additional Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Data Retention Period</label>
                  <input
                    type="text"
                    value={data.dataRetention}
                    onChange={(e) => updatePrivacyPolicy({ dataRetention: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="e.g., 2 years after account deletion"
                  />
                </div>
                
                <motion.button
                  onClick={() => updatePrivacyPolicy({ childrenPrivacy: !data.childrenPrivacy })}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    data.childrenPrivacy
                      ? 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    data.childrenPrivacy ? 'bg-purple-500' : 'bg-neutral-700'
                  }`}>
                    {data.childrenPrivacy && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">Children's Privacy (COPPA)</div>
                    <div className="text-sm text-neutral-400">App is designed for or may collect data from children under 13</div>
                  </div>
                </motion.button>
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
              <PrivacyPolicyPreview data={data} />
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
              {status === 'ready' ? 'Privacy Policy marked as ready!' : 'Draft saved!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Preview Component
function PrivacyPolicyPreview({ data }: { data: PrivacyPolicyData }) {
  const enabledData = data.dataCollected.filter(d => d.enabled);
  const enabledServices = data.thirdPartyServices.filter(s => s.enabled);
  
  return (
    <div className="p-8 min-h-full">
      <div className="max-w-lg mx-auto">
        {/* Preview Header */}
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Privacy Policy</h1>
          <p className="text-sm text-gray-500">{data.appName}</p>
          <p className="text-xs text-gray-400 mt-2">Effective Date: {data.effectiveDate}</p>
        </div>
        
        {/* Content */}
        <div className="prose prose-sm prose-gray max-w-none">
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Introduction</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {data.companyName} ("we," "us," or "our") operates the {data.appName} mobile application. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our application.
            </p>
          </section>
          
          {enabledData.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Information We Collect</h2>
              <ul className="space-y-2">
                {enabledData.map((item) => (
                  <li key={item.id} className="text-gray-600 text-sm">
                    <span className="font-medium text-gray-800">{item.label}:</span> {item.description}
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {enabledServices.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Services</h2>
              <p className="text-gray-600 text-sm mb-3">
                We may use third-party service providers to facilitate our application:
              </p>
              <ul className="space-y-2">
                {enabledServices.map((service) => (
                  <li key={service.id} className="text-gray-600 text-sm">
                    <span className="font-medium text-gray-800">{service.name}:</span> {service.purpose}
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Retention</h2>
            <p className="text-gray-600 text-sm">
              We will retain your personal data for as long as necessary: {data.dataRetention}.
            </p>
          </section>
          
          {data.childrenPrivacy && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Children's Privacy</h2>
              <p className="text-gray-600 text-sm">
                Our application complies with the Children's Online Privacy Protection Act (COPPA). 
                We do not knowingly collect personal information from children under 13 without 
                verifiable parental consent.
              </p>
            </section>
          )}
          
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Rights</h2>
            <p className="text-gray-600 text-sm">
              You have the right to access, update, or delete your personal information. 
              You may also opt out of certain data collection practices.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h2>
            <p className="text-gray-600 text-sm">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a href={`mailto:${data.contactEmail}`} className="text-blue-600 hover:underline">
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
