'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  Check,
  Info,
  Save,
  ArrowLeft,
  CheckCircle,
  PanelRightClose,
  PanelRightOpen,
  Smartphone,
  Monitor,
  ExternalLink,
  Twitter,
  Instagram,
} from 'lucide-react';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import type { LandingPageData } from '@/types/webPresence';

export function LandingPageBuilder() {
  const {
    artifacts,
    updateLandingPage,
    toggleEmailCapture,
    setLandingPageStatus,
    setActiveView,
    isPreviewOpen,
    togglePreview,
  } = useWebPresenceStore();
  
  const { data, status } = artifacts.landingPage;
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  
  const handleSaveDraft = () => {
    setLandingPageStatus('draft');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  const handleMarkReady = () => {
    setLandingPageStatus('ready');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  const colorOptions = [
    { value: '#10B981', label: 'Emerald' },
    { value: '#3B82F6', label: 'Blue' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#EF4444', label: 'Red' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#14B8A6', label: 'Teal' },
    { value: '#000000', label: 'Black' },
  ];
  
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Layout className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-white">Landing Page</h1>
                <p className="text-xs text-neutral-500">Share your app with the world</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Device Toggle */}
            <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg">
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-md transition-colors ${
                  previewDevice === 'mobile' ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-md transition-colors ${
                  previewDevice === 'desktop' ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
            
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
              className="flex items-start gap-3 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl"
            >
              <Info className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-violet-200">
                <p className="font-medium mb-1">Simple by design</p>
                <p className="text-violet-300/80">
                  This isn't Webflow. It's a focused landing page to share on Reddit, Twitter, and TikTok. 
                  Just fill in the copy — the layout is already optimized for conversions.
                </p>
              </div>
            </motion.div>
            
            {/* Hero Content */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Hero Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">App Name</label>
                  <input
                    type="text"
                    value={data.appName}
                    onChange={(e) => updateLandingPage({ appName: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="Your app name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={data.tagline}
                    onChange={(e) => updateLandingPage({ tagline: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="One line that captures what your app does"
                  />
                  <p className="text-xs text-neutral-500 mt-1">{data.tagline.length}/60 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Description</label>
                  <textarea
                    value={data.description}
                    onChange={(e) => updateLandingPage({ description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                    placeholder="A brief description of your app's value proposition"
                  />
                </div>
              </div>
            </section>
            
            {/* App Store Link */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">App Store</h2>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">App Store URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={data.appStoreUrl}
                    onChange={(e) => updateLandingPage({ appStoreUrl: e.target.value })}
                    className="w-full px-4 py-3 pr-12 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="https://apps.apple.com/app/..."
                  />
                  <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                </div>
                <p className="text-xs text-neutral-500 mt-1">Leave empty to show "Coming Soon" badge</p>
              </div>
            </section>
            
            {/* Email Capture */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Email Capture</h2>
              
              <motion.button
                onClick={toggleEmailCapture}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left mb-4 ${
                  data.showEmailCapture
                    ? 'bg-violet-500/10 border-violet-500/30 hover:border-violet-500/50'
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  data.showEmailCapture ? 'bg-violet-500' : 'bg-neutral-700'
                }`}>
                  {data.showEmailCapture && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">Show email waitlist</div>
                  <div className="text-sm text-neutral-400">Collect emails before your app launches</div>
                </div>
              </motion.button>
              
              {data.showEmailCapture && (
                <div className="pl-4 border-l-2 border-violet-500/30">
                  <label className="block text-sm text-neutral-400 mb-2">Waitlist Headline</label>
                  <input
                    type="text"
                    value={data.emailCaptureHeadline}
                    onChange={(e) => updateLandingPage({ emailCaptureHeadline: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="Get early access"
                  />
                </div>
              )}
            </section>
            
            {/* Accent Color */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Accent Color</h2>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateLandingPage({ accentColor: color.value })}
                    className={`w-10 h-10 rounded-xl transition-all ${
                      data.accentColor === color.value 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </section>
            
            {/* Social Links */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Social Links</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Twitter className="w-4 h-4 text-neutral-400" />
                  </div>
                  <input
                    type="url"
                    value={data.socialLinks.twitter || ''}
                    onChange={(e) => updateLandingPage({ socialLinks: { ...data.socialLinks, twitter: e.target.value } })}
                    className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-4 h-4 text-neutral-400" />
                  </div>
                  <input
                    type="url"
                    value={data.socialLinks.instagram || ''}
                    onChange={(e) => updateLandingPage({ socialLinks: { ...data.socialLinks, instagram: e.target.value } })}
                    className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={data.socialLinks.tiktok || ''}
                    onChange={(e) => updateLandingPage({ socialLinks: { ...data.socialLinks, tiktok: e.target.value } })}
                    className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="https://tiktok.com/@yourusername"
                  />
                </div>
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
            animate={{ width: previewDevice === 'mobile' ? 400 : 600, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l border-neutral-800 bg-neutral-950 overflow-hidden flex items-center justify-center p-4"
          >
            <div 
              className={`overflow-y-auto rounded-2xl shadow-2xl transition-all duration-300 ${
                previewDevice === 'mobile' 
                  ? 'w-[375px] h-[700px] border-8 border-neutral-800' 
                  : 'w-full h-full'
              }`}
              style={{ backgroundColor: '#ffffff' }}
            >
              <LandingPagePreview data={data} isMobile={previewDevice === 'mobile'} />
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
              {status === 'ready' ? 'Landing page marked as ready!' : 'Draft saved!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Preview Component - BeReal/Locket style: minimal, download-focused
function LandingPagePreview({ 
  data, 
  isMobile 
}: { 
  data: LandingPageData;
  isMobile: boolean;
}) {
  return (
    <div className="min-h-full bg-black flex flex-col">
      {/* Hero - Single screen, no scroll needed */}
      <section className={`flex-1 flex flex-col items-center justify-center text-center ${isMobile ? 'px-6 py-12' : 'px-12 py-20'}`}>
        {/* App Icon */}
        <div 
          className={`rounded-[28%] shadow-2xl mb-6 flex items-center justify-center ${isMobile ? 'w-24 h-24' : 'w-32 h-32'}`}
          style={{ 
            background: `linear-gradient(135deg, ${data.accentColor}, ${data.accentColor}dd)`,
            boxShadow: `0 20px 40px ${data.accentColor}40`,
          }}
        >
          <span className={`text-white font-bold ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
            {data.appName.charAt(0)}
          </span>
        </div>
        
        {/* App Name */}
        <h1 className={`font-bold text-white tracking-tight ${isMobile ? 'text-4xl' : 'text-6xl'}`}>
          {data.appName}
        </h1>
        
        {/* Tagline - The one sentence */}
        <p className={`text-gray-400 mt-4 max-w-md mx-auto font-medium ${isMobile ? 'text-lg' : 'text-xl'}`}>
          {data.tagline}
        </p>
        
        {/* Primary CTA - App Store Button */}
        <div className="mt-10">
          {data.appStoreUrl ? (
            <a 
              href={data.appStoreUrl}
              className={`inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-gray-100 transition-all hover:scale-105 ${isMobile ? 'text-base' : 'text-lg'}`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on App Store
            </a>
          ) : (
            <div 
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}
              style={{ 
                backgroundColor: data.accentColor,
                color: 'white',
              }}
            >
              <Smartphone className="w-6 h-6" />
              Coming Soon
            </div>
          )}
        </div>
        
        {/* Optional: Very short description below CTA */}
        {data.description && (
          <p className={`text-gray-500 mt-6 max-w-sm mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
            {data.description}
          </p>
        )}
      </section>
      
      {/* Optional Screenshots - horizontal scroll on mobile */}
      <section className={`${isMobile ? 'px-4 pb-8' : 'px-12 pb-16'}`}>
        <div className={`flex gap-4 ${isMobile ? 'overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4' : 'justify-center'}`}>
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`flex-shrink-0 snap-center rounded-2xl overflow-hidden bg-gray-900 ${
                isMobile ? 'w-48 h-96' : 'w-56 h-[420px]'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center text-gray-700 text-sm">
                Screenshot {i}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Optional Email Capture - only if toggled */}
      {data.showEmailCapture && (
        <section className={`${isMobile ? 'px-6 py-10' : 'px-12 py-16'} border-t border-gray-800`}>
          <div className="text-center max-w-md mx-auto">
            <h2 className={`font-bold text-white mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              {data.emailCaptureHeadline}
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Be first to know when we launch.
            </p>
            
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700"
                disabled
              />
              <button
                className="px-6 py-3 rounded-xl text-black font-semibold"
                style={{ backgroundColor: data.accentColor }}
                disabled
              >
                Join
              </button>
            </div>
          </div>
        </section>
      )}
      
      {/* Minimal Footer - just legal links */}
      <footer className={`${isMobile ? 'px-6 py-6' : 'px-12 py-8'} border-t border-gray-900`}>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <span className="hover:text-gray-400 cursor-pointer">Privacy</span>
          <span>·</span>
          <span className="hover:text-gray-400 cursor-pointer">Terms</span>
        </div>
      </footer>
    </div>
  );
}
