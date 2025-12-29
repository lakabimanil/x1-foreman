'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Info,
  Instagram,
  Palette,
  Plus,
  Save,
  Smartphone,
  Sparkles,
  Twitter,
  Type,
  X,
} from 'lucide-react';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import { useBrandingStore } from '@/store/useBrandingStore';
import type { LandingPageData } from '@/types/webPresence';

// Cal AI screen SVG generator (matching the branding store)
const generateCalAIScreenSvg = (screenType: string): string => {
  const svgs: Record<string, string> = {
    splash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 852" width="393" height="852">
      <rect width="393" height="852" fill="#ffffff"/>
      <text x="196" y="380" font-family="system-ui" font-size="56" fill="#111111" text-anchor="middle" font-weight="700">Cal AI</text>
      <text x="196" y="430" font-family="system-ui" font-size="18" fill="#666666" text-anchor="middle">Calorie tracking made easy</text>
      <circle cx="196" cy="280" r="50" fill="#10B981"/>
      <circle cx="196" cy="280" r="30" fill="white" fill-opacity="0.3"/>
      <rect x="186" y="260" width="20" height="30" rx="4" fill="white"/>
      <rect x="182" y="295" width="28" height="4" rx="2" fill="white"/>
    </svg>`,
    welcome: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 852" width="393" height="852">
      <rect width="393" height="852" fill="#ffffff"/>
      <text x="196" y="200" font-family="system-ui" font-size="28" fill="#111111" text-anchor="middle" font-weight="700">Welcome to Cal AI</text>
      <text x="196" y="240" font-family="system-ui" font-size="16" fill="#666666" text-anchor="middle">Calorie tracking made easy</text>
      <rect x="46" y="300" width="300" height="200" rx="20" fill="#f3f4f6"/>
      <circle cx="196" cy="400" r="40" fill="#EF4444"/>
      <ellipse cx="196" cy="385" rx="5" ry="10" fill="#22C55E"/>
      <rect x="46" y="700" width="300" height="56" rx="28" fill="#10B981"/>
      <text x="196" y="736" font-family="system-ui" font-size="18" fill="white" text-anchor="middle" font-weight="600">Get Started</text>
    </svg>`,
    results: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 852" width="393" height="852">
      <rect width="393" height="852" fill="#ffffff"/>
      <text x="196" y="120" font-family="system-ui" font-size="24" fill="#111111" text-anchor="middle" font-weight="700">Cal AI creates</text>
      <text x="196" y="155" font-family="system-ui" font-size="24" fill="#111111" text-anchor="middle" font-weight="700">long-term results</text>
      <rect x="46" y="200" width="300" height="280" rx="20" fill="#f3f4f6"/>
      <line x1="80" y1="420" x2="310" y2="420" stroke="#e5e7eb" stroke-width="2"/>
      <polyline points="80,380 130,350 180,320 230,280 280,250 310,240" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
      <circle cx="80" cy="380" r="6" fill="#10B981"/>
      <circle cx="130" cy="350" r="6" fill="#10B981"/>
      <circle cx="180" cy="320" r="6" fill="#10B981"/>
      <circle cx="230" cy="280" r="6" fill="#10B981"/>
      <circle cx="280" cy="250" r="6" fill="#10B981"/>
      <circle cx="310" cy="240" r="6" fill="#10B981"/>
      <text x="196" y="460" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">Progress over 6 months</text>
      <rect x="60" y="520" width="130" height="80" rx="12" fill="#ECFDF5"/>
      <text x="125" y="555" font-family="system-ui" font-size="28" fill="#10B981" text-anchor="middle" font-weight="700">80%</text>
      <text x="125" y="580" font-family="system-ui" font-size="11" fill="#666666" text-anchor="middle">maintain results</text>
      <rect x="200" y="520" width="130" height="80" rx="12" fill="#EEF2FF"/>
      <text x="265" y="555" font-family="system-ui" font-size="28" fill="#6366F1" text-anchor="middle" font-weight="700">4.8</text>
      <text x="265" y="580" font-family="system-ui" font-size="11" fill="#666666" text-anchor="middle">App Store rating</text>
      <rect x="46" y="700" width="300" height="56" rx="28" fill="#10B981"/>
      <text x="196" y="736" font-family="system-ui" font-size="18" fill="white" text-anchor="middle" font-weight="600">Continue</text>
    </svg>`,
  };
  const svg = svgs[screenType] || svgs.splash;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Pre-generated Cal AI screenshots
const calAIScreenshots = [
  { id: 'splash', url: generateCalAIScreenSvg('splash'), label: 'Splash' },
  { id: 'welcome', url: generateCalAIScreenSvg('welcome'), label: 'Welcome' },
  { id: 'results', url: generateCalAIScreenSvg('results'), label: 'Results' },
];

export function LandingPageBuilder() {
  const {
    artifacts,
    updateLandingPage,
    toggleEmailCapture,
    setLandingPageStatus,
    setActiveView,
  } = useWebPresenceStore();
  
  // Get assets from branding store
  const brandingArtifacts = useBrandingStore((state) => state.artifacts);
  const brandingAssets = brandingArtifacts?.assets?.assets || [];
  
  const { data, status } = artifacts.landingPage;
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>('hero');
  
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
    { value: '#10B981', label: 'Emerald', gradient: 'from-emerald-400 to-emerald-600' },
    { value: '#3B82F6', label: 'Blue', gradient: 'from-blue-400 to-blue-600' },
    { value: '#8B5CF6', label: 'Purple', gradient: 'from-purple-400 to-purple-600' },
    { value: '#F59E0B', label: 'Amber', gradient: 'from-amber-400 to-amber-600' },
    { value: '#EF4444', label: 'Red', gradient: 'from-red-400 to-red-600' },
    { value: '#EC4899', label: 'Pink', gradient: 'from-pink-400 to-pink-600' },
    { value: '#06B6D4', label: 'Cyan', gradient: 'from-cyan-400 to-cyan-600' },
    { value: '#000000', label: 'Black', gradient: 'from-gray-700 to-gray-900' },
  ];

  // Section accordion
  const Section = ({ 
    id, 
    title, 
    icon: Icon, 
    children,
    badge,
  }: { 
    id: string; 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode;
    badge?: string;
  }) => {
    const isOpen = activeSection === id;
    return (
      <motion.div 
        className="border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.02]"
        initial={false}
      >
        <button
          onClick={() => setActiveSection(isOpen ? null : id)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.03] flex items-center justify-center">
            <Icon className="w-4 h-4 text-white/70" />
          </div>
          <span className="font-medium text-white/90 flex-1 text-left">{title}</span>
          {badge && (
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
              {badge}
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-white/40" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-5 pb-5 pt-2 space-y-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Modern input component
  const Input = ({ 
    label, 
    value, 
    onChange, 
    placeholder,
    multiline = false,
    hint,
    charCount,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    hint?: string;
    charCount?: { current: number; max: number };
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-white/50 font-medium">{label}</label>
        {charCount && (
          <span className={`text-xs ${charCount.current > charCount.max ? 'text-red-400' : 'text-white/30'}`}>
            {charCount.current}/{charCount.max}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-black/60 transition-all resize-none text-[15px]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-black/60 transition-all text-[15px]"
        />
      )}
      {hint && <p className="text-xs text-white/30">{hint}</p>}
    </div>
  );
  
  return (
    <div className="h-full flex bg-[#050505]">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('overview')}
              className="p-2 -ml-2 text-white/40 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#050505] flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-semibold text-white text-lg tracking-tight">Landing Page</h1>
                <p className="text-xs text-white/40">Share your app with the world</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
              className={`p-2.5 rounded-xl transition-all ${
                isPreviewVisible 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/40 hover:text-white hover:bg-white/[0.06]'
              }`}
              title={isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
            >
              {isPreviewVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            
            <div className="w-px h-6 bg-white/10 mx-1" />
            
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white font-medium transition-all"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            
            <button
              onClick={handleMarkReady}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl text-sm text-white font-semibold transition-all shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Ready
            </button>
          </div>
        </header>
        
        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-xl mx-auto p-6 space-y-4">
            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-emerald-300 mb-0.5">Simple by design</p>
                <p className="text-emerald-400/60 leading-relaxed">
                  A focused landing page optimized for sharing on social media. Fill in the copy — the layout handles the rest.
                </p>
              </div>
            </motion.div>
            
            {/* Hero Section */}
            <Section id="hero" title="Hero Content" icon={Type}>
              <Input
                label="App Name"
                value={data.appName}
                onChange={(value) => updateLandingPage({ appName: value })}
                placeholder="Your app name"
              />
              
              <Input
                label="Tagline"
                value={data.tagline}
                onChange={(value) => updateLandingPage({ tagline: value })}
                placeholder="One line that captures what your app does"
                charCount={{ current: data.tagline.length, max: 60 }}
              />
              
              <Input
                label="Description"
                value={data.description}
                onChange={(value) => updateLandingPage({ description: value })}
                placeholder="A brief description of your app's value proposition"
                multiline
              />
            </Section>
            
            {/* App Store Section */}
            <Section id="appstore" title="App Store" icon={ExternalLink} badge={data.appStoreUrl ? 'Live' : 'Coming Soon'}>
              <Input
                label="App Store URL"
                value={data.appStoreUrl}
                onChange={(value) => updateLandingPage({ appStoreUrl: value })}
                placeholder="https://apps.apple.com/app/..."
                hint="Leave empty to show 'Coming Soon' badge"
              />
            </Section>
            
            {/* Screenshots Section */}
            <Section id="screenshots" title="Screenshots" icon={ImageIcon}>
              <p className="text-sm text-white/40 mb-3">
                Drag to reorder. These appear in the scrolling gallery.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {calAIScreenshots.map((screenshot, i) => (
                  <motion.div
                    key={screenshot.id}
                    className="relative aspect-[9/16] rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img 
                      src={screenshot.url} 
                      alt={screenshot.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs text-white/80 font-medium text-center">{screenshot.label}</p>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-md bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-[10px] text-white/80 font-semibold">{i + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-xl text-sm text-white/40 hover:text-white/60 hover:border-white/30 transition-all mt-2">
                <Plus className="w-4 h-4" />
                Add Screenshot
              </button>
            </Section>
            
            {/* Email Capture Section */}
            <Section id="email" title="Email Capture" icon={Sparkles}>
              <motion.button
                onClick={toggleEmailCapture}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  data.showEmailCapture
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  data.showEmailCapture ? 'bg-emerald-500' : 'bg-white/10'
                }`}>
                  {data.showEmailCapture && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">Show email waitlist</div>
                  <div className="text-sm text-white/40">Collect emails before launch</div>
                </div>
              </motion.button>
              
              <AnimatePresence>
                {data.showEmailCapture && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <Input
                        label="Waitlist Headline"
                        value={data.emailCaptureHeadline}
                        onChange={(value) => updateLandingPage({ emailCaptureHeadline: value })}
                        placeholder="Get early access"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>
            
            {/* Accent Color Section */}
            <Section id="color" title="Accent Color" icon={Palette}>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <motion.button
                    key={color.value}
                    onClick={() => updateLandingPage({ accentColor: color.value })}
                    className={`relative aspect-square rounded-2xl transition-all ${
                      data.accentColor === color.value 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#050505] scale-105' 
                        : 'hover:scale-102'
                    }`}
                    whileHover={{ scale: data.accentColor === color.value ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div 
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color.gradient}`}
                    />
                    {data.accentColor === color.value && (
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </Section>
            
            {/* Social Links Section */}
            <Section id="social" title="Social Links" icon={Twitter}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Twitter className="w-4 h-4 text-white/50" />
                  </div>
                  <input
                    type="url"
                    value={data.socialLinks.twitter || ''}
                    onChange={(e) => updateLandingPage({ socialLinks: { ...data.socialLinks, twitter: e.target.value } })}
                    className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all text-[15px]"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-4 h-4 text-white/50" />
                  </div>
                  <input
                    type="url"
                    value={data.socialLinks.instagram || ''}
                    onChange={(e) => updateLandingPage({ socialLinks: { ...data.socialLinks, instagram: e.target.value } })}
                    className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all text-[15px]"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={data.socialLinks.tiktok || ''}
                    onChange={(e) => updateLandingPage({ socialLinks: { ...data.socialLinks, tiktok: e.target.value } })}
                    className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all text-[15px]"
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
      
      {/* Preview Panel */}
      <AnimatePresence>
        {isPreviewVisible && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 440, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="border-l border-white/[0.06] bg-gradient-to-b from-[#0a0a0a] to-[#050505] overflow-hidden flex items-center justify-center"
          >
            <div className="p-6">
              {/* Phone Frame */}
              <div className="relative">
                {/* Phone Shell */}
                <div className="relative w-[280px] h-[570px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-[44px] p-[10px] shadow-2xl shadow-black/50">
                  {/* Side Button */}
                  <div className="absolute -right-[2px] top-[100px] w-[3px] h-[60px] bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] rounded-r-sm" />
                  <div className="absolute -left-[2px] top-[80px] w-[3px] h-[30px] bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] rounded-l-sm" />
                  <div className="absolute -left-[2px] top-[120px] w-[3px] h-[50px] bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] rounded-l-sm" />
                  <div className="absolute -left-[2px] top-[180px] w-[3px] h-[50px] bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] rounded-l-sm" />
                  
                  {/* Screen */}
                  <div className="relative w-full h-full bg-black rounded-[36px] overflow-hidden">
                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-20" />
                    
                    {/* Preview Content */}
                    <LandingPagePreview data={data} />
                  </div>
                </div>
                
                {/* Reflection */}
                <div className="absolute inset-0 rounded-[44px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/30"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="font-medium">
              {status === 'ready' ? 'Landing page marked as ready!' : 'Draft saved!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Preview Component - Sleek, modern phone preview
function LandingPagePreview({ data }: { data: LandingPageData }) {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="min-h-full bg-black flex flex-col pt-14">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-5 py-8">
          {/* App Icon */}
          <motion.div 
            className="w-20 h-20 rounded-[22px] mb-4 flex items-center justify-center shadow-xl"
            style={{ 
              background: `linear-gradient(135deg, ${data.accentColor}, ${data.accentColor}cc)`,
              boxShadow: `0 16px 32px ${data.accentColor}40`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-white font-bold text-3xl">
              {data.appName.charAt(0)}
            </span>
          </motion.div>
          
          {/* App Name */}
          <motion.h1 
            className="text-3xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {data.appName}
          </motion.h1>
          
          {/* Tagline */}
          <motion.p 
            className="text-gray-400 mt-2 text-sm font-medium max-w-[200px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {data.tagline}
          </motion.p>
          
          {/* CTA Button */}
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {data.appStoreUrl ? (
              <div 
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black rounded-full text-xs font-semibold"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download on App Store
              </div>
            ) : (
              <div 
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: data.accentColor }}
              >
                <Smartphone className="w-4 h-4" />
                Coming Soon
              </div>
            )}
          </motion.div>
          
          {/* Description */}
          {data.description && (
            <motion.p 
              className="text-gray-500 mt-4 text-[11px] leading-relaxed max-w-[220px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {data.description}
            </motion.p>
          )}
        </section>
        
        {/* Screenshots Gallery */}
        <section className="px-3 pb-5">
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-3 -mx-3 px-3 scrollbar-hide">
            {calAIScreenshots.map((screenshot, i) => (
              <motion.div 
                key={screenshot.id}
                className="flex-shrink-0 snap-center w-28 h-56 rounded-xl overflow-hidden bg-gray-900 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <img 
                  src={screenshot.url} 
                  alt={screenshot.label}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Email Capture */}
        {data.showEmailCapture && (
          <motion.section 
            className="px-4 py-5 border-t border-gray-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <h2 className="font-semibold text-white text-sm mb-1">
                {data.emailCaptureHeadline}
              </h2>
              <p className="text-gray-500 text-[10px] mb-3">
                Be first to know when we launch.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 text-xs"
                  disabled
                />
                <button
                  className="px-4 py-2 rounded-lg text-white text-xs font-semibold"
                  style={{ backgroundColor: data.accentColor }}
                  disabled
                >
                  Join
                </button>
              </div>
            </div>
          </motion.section>
        )}
        
        {/* Footer */}
        <footer className="px-4 py-4 border-t border-gray-900/50">
          <div className="flex items-center justify-center gap-4 text-[9px] text-gray-600">
            <span>Privacy</span>
            <span className="text-gray-800">·</span>
            <span>Terms</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
