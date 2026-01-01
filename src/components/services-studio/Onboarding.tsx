'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight,
  Video,
  Database,
  Globe,
  Check,
  Zap,
  Shield,
  Bot,
  Key
} from 'lucide-react';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import { providers } from '@/config/mockServicesConfig';

type OnboardingStep = 
  | 'intro'
  | 'understand-video'
  | 'pick-video-provider'
  | 'connect-video'
  | 'complete';

export default function Onboarding() {
  const { 
    completeOnboarding, 
    services, 
    swapProvider,
    selectConnectionMethod,
    connectFlow,
    handleBillingChoice
  } = useServicesStudioStore();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro');
  const [selectedVideoProvider, setSelectedVideoProvider] = useState<string>('mux');
  const [isConnecting, setIsConnecting] = useState(false);

  const videoService = Object.values(services).find(s => s.name === 'Live Video');

  const handleContinueFromIntro = () => {
    setCurrentStep('understand-video');
  };

  const handleUnderstandVideo = () => {
    setCurrentStep('pick-video-provider');
  };

  const handlePickProvider = () => {
    if (videoService && selectedVideoProvider !== videoService.selectedProviderId) {
      swapProvider(videoService.id, selectedVideoProvider);
    }
    setCurrentStep('connect-video');
  };

  const handleConnect = () => {
    if (!videoService) return;
    
    setIsConnecting(true);
    
    // Simulate agent connection
    setTimeout(() => {
      // Simulate connection steps
      const agentSteps = [
        { delay: 1000, action: () => {} },
        { delay: 2000, action: () => {} },
        { delay: 3000, action: () => {
          // Mark as connected sandbox
          useServicesStudioStore.setState((state) => ({
            services: {
              ...state.services,
              [videoService.id]: {
                ...state.services[videoService.id],
                status: 'connected-sandbox',
                environment: 'sandbox'
              }
            }
          }));
          
          setTimeout(() => {
            setCurrentStep('complete');
            setIsConnecting(false);
          }, 1000);
        }}
      ];

      agentSteps.forEach(({ delay, action }) => {
        setTimeout(action, delay);
      });
    }, 500);
  };

  const handleFinish = () => {
    completeOnboarding();
  };

  const handleManualApiKey = () => {
    // For now, just show an alert that this feature is coming soon
    // In a real implementation, this would open a modal to paste API credentials
    alert('Manual API key entry is coming soon! For now, please use the automated connection.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex">
      {/* Left Panel - Interaction */}
      <div className="w-full lg:w-[45%] flex flex-col p-8 lg:p-12 overflow-y-auto border-r border-neutral-800">
        <AnimatePresence mode="wait">
          {/* Step 1: Introduction */}
          {currentStep === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-8">
                <div className="px-2 py-1 rounded bg-neutral-800 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-6 inline-block">
                  Step 1 of 4
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                  Welcome to Services Studio
                </h1>
                <p className="text-lg text-neutral-400 leading-relaxed">
                  Services Studio lets you tap into proven infrastructure—video, authentication, billing—without wiring it up yourself. We'll walk you through configuring your first core service so you can focus on your product.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 mb-8">
                <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  What you'll do
                </h3>
                <ul className="space-y-3">
                  {[
                    'Understand why video infrastructure is complex',
                    'Pick the best provider for your use case',
                    'Let x1 connect it for you (or do it manually)',
                    'See your services dashboard'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-400 text-sm">
                      <Check className="w-4 h-4 text-neutral-600 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleContinueFromIntro}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all"
                >
                  <span>Let's get started</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Understand Video */}
          {currentStep === 'understand-video' && (
            <motion.div
              key="understand"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col"
            >
                <div className="mb-8">
                  <div className="px-2 py-1 rounded bg-neutral-800 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-6 inline-block">
                    Step 2 of 4 • Live Video
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                    Why video infrastructure is hard
                  </h1>
                  <p className="text-lg text-neutral-400 leading-relaxed">
                    Live video is a chain: capture the feed, convert it, send it to every viewer, and keep a recording. Every link must succeed or the whole experience breaks.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { title: 'Ingestion', desc: 'Accept live camera or screen streams. RTMP is the protocol these streams use to upload to a server.' },
                    { title: 'Transcoding', desc: 'Convert that feed into HLS/DASH slices so phones, tablets, and desktops can play it without buffering.' },
                    { title: 'Delivery', desc: 'Push those slices through a global CDN so viewers start within 2 seconds no matter where they are.' },
                    { title: 'Recording', desc: 'Keep on-demand replays ready without building a storage pipeline from scratch.' }
                  ].map((step, i) => (
                    <div key={i} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                          {i + 1}
                        </div>
                        <h3 className="font-semibold text-white">{step.title}</h3>
                      </div>
                      <p className="text-sm text-neutral-500 pl-9">{step.desc}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-neutral-500 mb-6">
                  Building all this yourself could take months of infrastructure work. Managed services handle it in days.
                </p>

              <div className="mt-auto">
                <button
                  onClick={handleUnderstandVideo}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all"
                >
                  <span>Got it, show me the options</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pick Provider */}
          {currentStep === 'pick-video-provider' && (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-8">
                <div className="px-2 py-1 rounded bg-neutral-800 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-6 inline-block">
                  Step 3 of 4 • Pick Provider
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                  Choose your video provider
                </h1>
                <p className="text-lg text-neutral-400 leading-relaxed">
                  For most apps, Mux is the best choice. It's built for developers and handles recording automatically.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {['mux', 'agora'].map((providerId) => {
                  const provider = providers[providerId];
                  if (!provider) return null;

                  const isSelected = selectedVideoProvider === providerId;

                  return (
                    <button
                      key={providerId}
                      onClick={() => setSelectedVideoProvider(providerId)}
                      className={`w-full text-left p-5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-white border-white'
                          : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                          isSelected ? 'bg-black/5' : 'bg-neutral-800'
                        }`}>
                          {provider.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${isSelected ? 'text-black' : 'text-white'}`}>
                              {provider.name}
                            </h3>
                            {provider.recommended && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                isSelected ? 'bg-black/10 text-black' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mb-3 ${isSelected ? 'text-black/60' : 'text-neutral-500'}`}>
                            {provider.description}
                          </p>
                          <div className="space-y-1">
                            {provider.pros.slice(0, 2).map((pro, i) => (
                              <div key={i} className={`flex items-center gap-2 text-xs ${
                                isSelected ? 'text-black/70' : 'text-neutral-400'
                              }`}>
                                <Check className="w-3 h-3" />
                                {pro}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto">
                <button
                  onClick={handlePickProvider}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all"
                >
                  <span>Use {providers[selectedVideoProvider]?.name}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Connect */}
          {currentStep === 'connect-video' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-8">
                <div className="px-2 py-1 rounded bg-neutral-800 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-6 inline-block">
                  Step 4 of 4 • Connect
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                  Let x1 connect {providers[selectedVideoProvider]?.name}
                </h1>
                <p className="text-lg text-neutral-400 leading-relaxed">
                  x1 can create the account and get your API keys automatically. Or you can do it manually.
                </p>
              </div>

              {!isConnecting ? (
                <>
                  <button
                    onClick={handleConnect}
                    className="w-full p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all mb-4 text-left group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Let x1 do it (Recommended)</h3>
                        <p className="text-sm text-neutral-400">Takes ~30 seconds</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start Agent <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </button>

                  <button 
                    onClick={handleManualApiKey}
                    className="w-full p-5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-neutral-500" />
                      <div>
                        <h3 className="font-medium text-white">I have an API key</h3>
                        <p className="text-sm text-neutral-500">Paste your credentials</p>
                      </div>
                    </div>
                  </button>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-2">Connecting...</h3>
                    <p className="text-neutral-400">x1 is setting up your account</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                You're all set!
              </h1>
              <p className="text-lg text-neutral-400 mb-8 max-w-md">
                {providers[selectedVideoProvider]?.name} is connected in Sandbox mode. You can configure more services from your dashboard.
              </p>
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel - Visual Context */}
      <div className="hidden lg:flex flex-1 bg-neutral-900/30 items-center justify-center p-12">
        <div className="w-full max-w-lg aspect-[4/5] bg-black border border-neutral-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-black pointer-events-none" />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {currentStep === 'intro' && (
                <motion.div
                  key="intro-visual"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">First-Time Setup</h3>
                  <p className="text-sm text-neutral-500 max-w-xs">
                    We'll walk you through connecting your first service
                  </p>
                </motion.div>
              )}

              {currentStep === 'understand-video' && (
                <motion.div
                  key="pipeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <div className="flex flex-col gap-4">
                    {['Stream', 'Transcode', 'Deliver', 'Store'].map((label, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                          {i + 1}
                        </div>
                        <div className="flex-1 h-12 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center px-4">
                          <span className="text-sm text-neutral-300">{label}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-700" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {(currentStep === 'pick-video-provider' || currentStep === 'connect-video') && (
                <motion.div
                  key="provider-preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-6xl mx-auto mb-6">
                    {providers[selectedVideoProvider]?.logo}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {providers[selectedVideoProvider]?.name}
                  </h3>
                  <p className="text-sm text-neutral-400 max-w-xs">
                    {providers[selectedVideoProvider]?.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
