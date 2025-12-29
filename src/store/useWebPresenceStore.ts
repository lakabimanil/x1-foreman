'use client';

import { create } from 'zustand';
import type {
  WebPresenceState,
  WebArtifactStatus,
  PrivacyPolicyData,
  TermsData,
  LandingPageData,
} from '@/types/webPresence';
import type { GeneratedDocument, DocumentSchema } from '@/types/documentBuilder';

// Cal AI default data
const defaultPrivacyPolicyData: PrivacyPolicyData = {
  appName: 'Cal AI',
  companyName: 'Cal AI Inc.',
  contactEmail: 'privacy@calai.app',
  effectiveDate: new Date().toISOString().split('T')[0],
  dataCollected: [
    { id: 'photos', label: 'Photos & Camera', description: 'Used to scan and analyze food for calorie tracking', enabled: true },
    { id: 'health', label: 'Health & Fitness Data', description: 'Weight, height, activity level for personalized recommendations', enabled: true },
    { id: 'usage', label: 'App Usage Analytics', description: 'Anonymous usage data to improve the app experience', enabled: true },
    { id: 'account', label: 'Account Information', description: 'Email and profile information for account management', enabled: true },
    { id: 'location', label: 'Location Data', description: 'Optional location for local restaurant suggestions', enabled: false },
    { id: 'contacts', label: 'Contacts', description: 'Optional for social features and sharing', enabled: false },
  ],
  thirdPartyServices: [
    { id: 'apple', name: 'Apple HealthKit', purpose: 'Sync health and fitness data', enabled: true },
    { id: 'analytics', name: 'Analytics (Mixpanel)', purpose: 'Anonymous usage analytics', enabled: true },
    { id: 'payments', name: 'Apple In-App Purchases', purpose: 'Subscription payment processing', enabled: true },
    { id: 'crash', name: 'Crash Reporting (Sentry)', purpose: 'App stability monitoring', enabled: true },
    { id: 'ai', name: 'OpenAI API', purpose: 'AI-powered food recognition', enabled: true },
  ],
  dataRetention: '2 years after account deletion',
  childrenPrivacy: false,
  analyticsEnabled: true,
};

const defaultTermsData: TermsData = {
  appName: 'Cal AI',
  companyName: 'Cal AI Inc.',
  contactEmail: 'legal@calai.app',
  effectiveDate: new Date().toISOString().split('T')[0],
  acceptableUse: [
    'Use the app for personal health and fitness tracking',
    'Share progress with friends and family',
    'Provide accurate information for personalized recommendations',
  ],
  prohibitedContent: [
    'Uploading inappropriate or offensive content',
    'Attempting to reverse-engineer the AI food recognition',
    'Sharing account credentials with others',
    'Using the app for commercial purposes without permission',
  ],
  subscriptionTerms: {
    hasSubscription: true,
    refundPolicy: 'Refunds handled through Apple App Store policies. Contact support for assistance.',
    trialPeriod: '3-day free trial for new users',
  },
  intellectualProperty: 'All app content, including AI models, designs, and code are property of Cal AI Inc.',
  disclaimers: [
    'Calorie estimates are approximations and may vary',
    'Not a substitute for professional medical or nutritional advice',
    'Results vary based on individual factors',
  ],
  governingLaw: 'State of California, United States',
};

const defaultLandingPageData: LandingPageData = {
  appName: 'Cal AI',
  tagline: 'Calorie tracking made effortless',
  description: 'Snap a photo of any meal and get instant, accurate calorie counts powered by AI. No more manual logging or guessing portions.',
  heroImageUrl: '',
  screenshots: [],
  appStoreUrl: 'https://apps.apple.com/app/cal-ai',
  showEmailCapture: true,
  emailCaptureHeadline: 'Get early access to Cal AI Pro',
  accentColor: '#10B981',
  features: [
    { id: '1', icon: '📸', title: 'Instant Scanning', description: 'Point your camera at any food and get calories in seconds' },
    { id: '2', icon: '🎯', title: 'Accurate AI', description: '95%+ accuracy powered by advanced machine learning' },
    { id: '3', icon: '📊', title: 'Smart Insights', description: 'Track trends and get personalized recommendations' },
    { id: '4', icon: '🏆', title: 'Achieve Goals', description: 'Stay on track with daily targets and progress tracking' },
  ],
  testimonials: [
    { id: '1', quote: 'Finally, calorie tracking that actually works. Game changer for my fitness journey!', author: 'Sarah M.', rating: 5 },
    { id: '2', quote: 'So much faster than typing everything in. I actually stick to tracking now.', author: 'Mike R.', rating: 5 },
  ],
  socialLinks: {
    twitter: 'https://twitter.com/calai',
    instagram: 'https://instagram.com/calai',
    tiktok: 'https://tiktok.com/@calai',
  },
};

// Store generated documents from the new flow
interface GeneratedDocuments {
  'privacy-policy'?: { document: GeneratedDocument; schema: DocumentSchema };
  'terms-of-service'?: { document: GeneratedDocument; schema: DocumentSchema };
  'faq'?: { document: GeneratedDocument; schema: DocumentSchema };
}

interface WebPresenceStore extends WebPresenceState {
  // Generated documents from new flow
  generatedDocuments: GeneratedDocuments;
  
  // Navigation
  setActiveView: (view: WebPresenceState['activeView']) => void;
  togglePreview: () => void;
  setPreviewOpen: (open: boolean) => void;
  
  // Privacy Policy actions
  updatePrivacyPolicy: (updates: Partial<PrivacyPolicyData>) => void;
  toggleDataCollection: (dataId: string) => void;
  toggleThirdPartyService: (serviceId: string) => void;
  setPrivacyStatus: (status: WebArtifactStatus) => void;
  
  // Terms actions
  updateTerms: (updates: Partial<TermsData>) => void;
  setTermsStatus: (status: WebArtifactStatus) => void;
  
  // Landing Page actions
  updateLandingPage: (updates: Partial<LandingPageData>) => void;
  toggleEmailCapture: () => void;
  setLandingPageStatus: (status: WebArtifactStatus) => void;
  
  // Generated document actions
  saveGeneratedDocument: (type: keyof GeneratedDocuments, document: GeneratedDocument, schema: DocumentSchema) => void;
  getGeneratedDocument: (type: keyof GeneratedDocuments) => { document: GeneratedDocument; schema: DocumentSchema } | undefined;
  
  // Module status
  calculateModuleStatus: () => void;
  
  // Reset
  resetToDefaults: () => void;
}

export const useWebPresenceStore = create<WebPresenceStore>((set, get) => ({
  // Initial state
  moduleStatus: 'not_started',
  
  // Generated documents storage
  generatedDocuments: {},
  
  artifacts: {
    privacyPolicy: {
      id: 'privacy-policy',
      type: 'privacy-policy',
      status: 'not_created',
      lastUpdated: null,
      data: defaultPrivacyPolicyData,
    },
    terms: {
      id: 'terms',
      type: 'terms',
      status: 'not_created',
      lastUpdated: null,
      data: defaultTermsData,
    },
    landingPage: {
      id: 'landing-page',
      type: 'landing-page',
      status: 'not_created',
      lastUpdated: null,
      data: defaultLandingPageData,
    },
  },
  
  activeView: 'overview',
  isPreviewOpen: true,
  
  // Navigation
  setActiveView: (view) => set({ activeView: view }),
  
  togglePreview: () => set((state) => ({ isPreviewOpen: !state.isPreviewOpen })),
  
  setPreviewOpen: (open) => set({ isPreviewOpen: open }),
  
  // Privacy Policy actions
  updatePrivacyPolicy: (updates) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        privacyPolicy: {
          ...state.artifacts.privacyPolicy,
          data: { ...state.artifacts.privacyPolicy.data, ...updates },
          lastUpdated: new Date(),
          status: state.artifacts.privacyPolicy.status === 'not_created' ? 'draft' : state.artifacts.privacyPolicy.status,
        },
      },
    }));
    get().calculateModuleStatus();
  },
  
  toggleDataCollection: (dataId) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        privacyPolicy: {
          ...state.artifacts.privacyPolicy,
          data: {
            ...state.artifacts.privacyPolicy.data,
            dataCollected: state.artifacts.privacyPolicy.data.dataCollected.map((item) =>
              item.id === dataId ? { ...item, enabled: !item.enabled } : item
            ),
          },
          lastUpdated: new Date(),
          status: state.artifacts.privacyPolicy.status === 'not_created' ? 'draft' : state.artifacts.privacyPolicy.status,
        },
      },
    }));
    get().calculateModuleStatus();
  },
  
  toggleThirdPartyService: (serviceId) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        privacyPolicy: {
          ...state.artifacts.privacyPolicy,
          data: {
            ...state.artifacts.privacyPolicy.data,
            thirdPartyServices: state.artifacts.privacyPolicy.data.thirdPartyServices.map((service) =>
              service.id === serviceId ? { ...service, enabled: !service.enabled } : service
            ),
          },
          lastUpdated: new Date(),
          status: state.artifacts.privacyPolicy.status === 'not_created' ? 'draft' : state.artifacts.privacyPolicy.status,
        },
      },
    }));
    get().calculateModuleStatus();
  },
  
  setPrivacyStatus: (status) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        privacyPolicy: {
          ...state.artifacts.privacyPolicy,
          status,
          lastUpdated: new Date(),
        },
      },
    }));
    get().calculateModuleStatus();
  },
  
  // Terms actions
  updateTerms: (updates) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        terms: {
          ...state.artifacts.terms,
          data: { ...state.artifacts.terms.data, ...updates },
          lastUpdated: new Date(),
          status: state.artifacts.terms.status === 'not_created' ? 'draft' : state.artifacts.terms.status,
        },
      },
    }));
    get().calculateModuleStatus();
  },
  
  setTermsStatus: (status) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        terms: {
          ...state.artifacts.terms,
          status,
          lastUpdated: new Date(),
        },
      },
    }));
    get().calculateModuleStatus();
  },
  
  // Landing Page actions
  updateLandingPage: (updates) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        landingPage: {
          ...state.artifacts.landingPage,
          data: { ...state.artifacts.landingPage.data, ...updates },
          lastUpdated: new Date(),
          status: state.artifacts.landingPage.status === 'not_created' ? 'draft' : state.artifacts.landingPage.status,
        },
      },
    }));
    get().calculateModuleStatus();
  },
  
  toggleEmailCapture: () => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        landingPage: {
          ...state.artifacts.landingPage,
          data: {
            ...state.artifacts.landingPage.data,
            showEmailCapture: !state.artifacts.landingPage.data.showEmailCapture,
          },
          lastUpdated: new Date(),
          status: state.artifacts.landingPage.status === 'not_created' ? 'draft' : state.artifacts.landingPage.status,
        },
      },
    }));
    get().calculateModuleStatus();
  },
  
  setLandingPageStatus: (status) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        landingPage: {
          ...state.artifacts.landingPage,
          status,
          lastUpdated: new Date(),
        },
      },
    }));
    get().calculateModuleStatus();
  },
  
  // Generated document actions
  saveGeneratedDocument: (type, document, schema) => {
    set((state) => {
      // Also update the artifact status to 'draft' when a document is generated
      let updatedArtifacts = { ...state.artifacts };
      
      if (type === 'privacy-policy') {
        updatedArtifacts = {
          ...updatedArtifacts,
          privacyPolicy: {
            ...updatedArtifacts.privacyPolicy,
            status: 'draft',
            lastUpdated: new Date(),
          },
        };
      } else if (type === 'terms-of-service') {
        updatedArtifacts = {
          ...updatedArtifacts,
          terms: {
            ...updatedArtifacts.terms,
            status: 'draft',
            lastUpdated: new Date(),
          },
        };
      }
      
      return {
        generatedDocuments: {
          ...state.generatedDocuments,
          [type]: { document, schema },
        },
        artifacts: updatedArtifacts,
      };
    });
    get().calculateModuleStatus();
  },
  
  getGeneratedDocument: (type) => {
    return get().generatedDocuments[type];
  },
  
  // Module status calculation
  calculateModuleStatus: () => {
    const { artifacts } = get();
    
    const allReady = 
      artifacts.privacyPolicy.status === 'ready' &&
      artifacts.terms.status === 'ready';
    
    const anyDraft = 
      artifacts.privacyPolicy.status === 'draft' ||
      artifacts.terms.status === 'draft' ||
      artifacts.landingPage.status === 'draft';
    
    const anyReady =
      artifacts.privacyPolicy.status === 'ready' ||
      artifacts.terms.status === 'ready' ||
      artifacts.landingPage.status === 'ready';
    
    let moduleStatus: WebPresenceState['moduleStatus'] = 'not_started';
    
    if (allReady) {
      moduleStatus = 'ready';
    } else if (anyDraft || anyReady) {
      moduleStatus = 'in_progress';
    }
    
    set({ moduleStatus });
  },
  
  // Reset
  resetToDefaults: () => {
    set({
      moduleStatus: 'not_started',
      generatedDocuments: {},
      artifacts: {
        privacyPolicy: {
          id: 'privacy-policy',
          type: 'privacy-policy',
          status: 'not_created',
          lastUpdated: null,
          data: defaultPrivacyPolicyData,
        },
        terms: {
          id: 'terms',
          type: 'terms',
          status: 'not_created',
          lastUpdated: null,
          data: defaultTermsData,
        },
        landingPage: {
          id: 'landing-page',
          type: 'landing-page',
          status: 'not_created',
          lastUpdated: null,
          data: defaultLandingPageData,
        },
      },
      activeView: 'overview',
      isPreviewOpen: true,
    });
  },
}));
