'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  Layout,
  ArrowRight,
  Check,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Settings,
  Radio,
  Eye,
  Users,
  Flag,
} from 'lucide-react';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import { useAdminStore } from '@/store/useAdminStore';
import { usePlatformOpsStore } from '@/store/usePlatformOpsStore';
import type { WebArtifactStatus } from '@/types/webPresence';

const StatusBadge = ({ status }: { status: WebArtifactStatus }) => {
  const config = {
    not_created: { label: 'Not Created', color: 'bg-neutral-700 text-neutral-400' },
    draft: { label: 'Draft', color: 'bg-amber-500/20 text-amber-400' },
    ready: { label: 'Ready', color: 'bg-emerald-500/20 text-emerald-400' },
  };
  
  const { label, color } = config[status];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {status === 'ready' && <Check className="w-3 h-3" />}
      {status === 'draft' && <AlertCircle className="w-3 h-3" />}
      {label}
    </span>
  );
};

export function WebPresenceOverview() {
  const router = useRouter();
  const { artifacts, setActiveView, moduleStatus, generatedDocuments } = useWebPresenceStore();
  const { setup: adminSetup, moderationQueue, tickets } = useAdminStore();
  const platformOpsStore = usePlatformOpsStore();
  
  // Derive stats from platform ops store
  const platformStats = {
    liveStreams: platformOpsStore.liveContent.length,
    totalViewers: platformOpsStore.liveContent.reduce((a, c) => a + c.viewerCount, 0),
    pendingReports: platformOpsStore.reports.filter(r => r.status === 'new').length,
    totalUsers: platformOpsStore.users.length,
  };
  
  const pendingReviews = moderationQueue.filter((m) => m.status === 'pending' || m.status === 'escalated').length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;
  
  // Map internal view IDs to the new guided interview document types
  const documentTypeMap: Record<string, string> = {
    'privacy-policy': 'privacy-policy',
    'terms': 'terms-of-service',
  };
  
  const handleCreateDocument = (e: React.MouseEvent, viewId: string) => {
    e.stopPropagation(); // Prevent card click
    const documentType = documentTypeMap[viewId];
    if (documentType) {
      router.push(`/web-presence/create?type=${documentType}`);
    }
  };
  
  const handleEditDocument = (e: React.MouseEvent, viewId: string) => {
    e.stopPropagation(); // Prevent card click
    const documentType = documentTypeMap[viewId];
    if (documentType) {
      // Check if we have a generated document from the new flow
      const hasGeneratedDocument = generatedDocuments[documentType as keyof typeof generatedDocuments];
      
      if (hasGeneratedDocument) {
        // Go to the new canvas editor
        router.push(`/web-presence/edit?type=${documentType}`);
      } else {
        // Fallback to old editor if no generated document exists
        setActiveView(viewId as 'privacy-policy' | 'terms');
      }
    }
  };
  
  const legalItems = [
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      description: 'Describes how your app collects, uses, and shares user data. Required by Apple for App Store submission.',
      icon: Shield,
      status: artifacts.privacyPolicy.status,
      required: true,
      view: 'privacy-policy' as const,
      lastUpdated: artifacts.privacyPolicy.lastUpdated,
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      description: 'Defines the rules and guidelines for using your app. Recommended for all apps, required for apps with user accounts.',
      icon: FileText,
      status: artifacts.terms.status,
      required: true,
      view: 'terms' as const,
      lastUpdated: artifacts.terms.lastUpdated,
    },
  ];
  
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#0a0a0a] to-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Web Presence</h1>
              <p className="text-neutral-400 mt-1">
                Everything your app needs on the web to ship and operate.
              </p>
            </div>
            
            {moduleStatus === 'ready' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Module Ready</span>
              </motion.div>
            )}
          </div>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
        {/* App Store Requirement Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-5"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Why this matters</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Apple requires a Privacy Policy URL for all apps submitted to the App Store. 
                Missing or incomplete legal pages are a common reason for app rejections. 
                Complete these items to ship with confidence.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Legal & Compliance Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
              <Shield className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Legal & Compliance</h2>
              <p className="text-xs text-neutral-500">Required for App Store submission</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            {legalItems.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-all cursor-pointer"
                  onClick={() => {
                    const documentType = documentTypeMap[item.id];
                    if (!documentType) return;
                    
                    if (item.status === 'not_created') {
                      // Check if document was created via new flow
                      const hasGeneratedDocument = generatedDocuments[documentType as keyof typeof generatedDocuments];
                      if (hasGeneratedDocument) {
                        router.push(`/web-presence/edit?type=${documentType}`);
                      } else {
                        router.push(`/web-presence/create?type=${documentType}`);
                      }
                    } else {
                      // Document exists - go to edit
                      router.push(`/web-presence/edit?type=${documentType}`);
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      item.status === 'ready' 
                        ? 'bg-emerald-500/20' 
                        : 'bg-neutral-800 group-hover:bg-neutral-700'
                    }`}>
                      {item.status === 'ready' ? (
                        <Check className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Icon className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <StatusBadge status={item.status} />
                        {item.required && (
                          <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-400 mb-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        {item.lastUpdated && (
                          <span className="text-xs text-neutral-500">
                            Last updated: {formatDate(item.lastUpdated)}
                          </span>
                        )}
                        
                        <div className="flex items-center gap-3 ml-auto">
                          {item.status !== 'not_created' && (
                            <button 
                              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Preview
                            </button>
                          )}
                          <button 
                            onClick={(e) => item.status === 'not_created' 
                              ? handleCreateDocument(e, item.id) 
                              : handleEditDocument(e, item.id)
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors group-hover:bg-white/10"
                          >
                            {item.status === 'not_created' ? 'Create' : 'Edit'}
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
        
        {/* Landing Page Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
              <Layout className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Landing Page</h2>
              <p className="text-xs text-neutral-500">Public page to share and promote your app</p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-all cursor-pointer"
            onClick={() => setActiveView('landing-page')}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                artifacts.landingPage.status === 'ready' 
                  ? 'bg-emerald-500/20' 
                  : 'bg-neutral-800 group-hover:bg-neutral-700'
              }`}>
                {artifacts.landingPage.status === 'ready' ? (
                  <Check className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Layout className="w-6 h-6 text-neutral-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white">App Landing Page</h3>
                  <StatusBadge status={artifacts.landingPage.status} />
                  <span className="text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mb-3">
                  A simple, beautiful page to share on Reddit, Twitter, TikTok, and other platforms. 
                  Includes App Store download link and optional email capture.
                </p>
                
                <div className="flex items-center justify-between">
                  {artifacts.landingPage.lastUpdated && (
                    <span className="text-xs text-neutral-500">
                      Last updated: {formatDate(artifacts.landingPage.lastUpdated)}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-3 ml-auto">
                    {artifacts.landingPage.status !== 'not_created' && (
                      <button className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
                        <ExternalLink className="w-3 h-3" />
                        Preview
                      </button>
                    )}
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors group-hover:bg-white/10">
                      {artifacts.landingPage.status === 'not_created' ? 'Configure' : 'Edit'}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* Admin & Moderation */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
              <Settings className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Admin & Moderation</h2>
              <p className="text-xs text-neutral-500">Operate Cal AI: review, support, billing, experiments</p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-all cursor-pointer"
            onClick={() => setActiveView('admin')}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                adminSetup.completed
                  ? 'bg-emerald-500/20'
                  : 'bg-neutral-800 group-hover:bg-neutral-700'
              }`}>
                {adminSetup.completed ? (
                  <Check className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Settings className="w-6 h-6 text-neutral-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white">Admin Dashboard</h3>
                  {adminSetup.completed ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
                      Configured
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium border border-amber-500/20">
                      Setup required
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-400 mb-3">
                  Review meal/photo edge cases, handle billing issues, and manage support tickets. Everything is hardcoded for demo realism.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span>{pendingReviews} reviews pending</span>
                    <span className="text-neutral-700">•</span>
                    <span>{openTickets} tickets open</span>
                  </div>
                  
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors group-hover:bg-white/10">
                    {adminSetup.completed ? 'Open' : 'Setup'}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* Platform Operations - Livestream Dashboard */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <Radio className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Platform Operations</h2>
              <p className="text-xs text-neutral-500">Full-featured dashboard for livestreaming platform</p>
            </div>
          </div>
          
          <Link href="/ops">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group bg-gradient-to-r from-rose-500/5 to-purple-500/5 hover:from-rose-500/10 hover:to-purple-500/10 border border-rose-500/20 hover:border-rose-500/30 rounded-2xl p-5 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <Radio className="w-6 h-6 text-rose-300" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-white">Platform Operations Dashboard</h3>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500 text-white text-xs font-bold">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      {platformStats.liveStreams} LIVE
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
                      New
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">
                    Complete moderation suite for any content platform. Manage live content, users, reports, moderation queue, 
                    team roles, and platform settings. A real admin dashboard that actually does things.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5 text-rose-300">
                        <Eye className="w-3.5 h-3.5" />
                        {platformStats.totalViewers.toLocaleString()} viewers
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <Flag className="w-3.5 h-3.5" />
                        {platformStats.pendingReports} reports pending
                      </span>
                      <span className="flex items-center gap-1.5 text-neutral-400">
                        <Users className="w-3.5 h-3.5" />
                        {platformStats.totalUsers} users
                      </span>
                    </div>
                  
                  <span className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-sm text-rose-300 font-medium transition-colors group-hover:bg-rose-500/30">
                    Open Dashboard
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          </Link>
        </section>
        
        {/* Ready State Summary */}
        {moduleStatus === 'ready' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Web Presence Complete!</h3>
            <p className="text-neutral-400 max-w-md mx-auto">
              All required web artifacts are ready. This helps reduce App Store rejections 
              and gives you professional web pages to share your app.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
