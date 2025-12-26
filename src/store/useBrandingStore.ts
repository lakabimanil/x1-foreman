'use client';

import { create } from 'zustand';
import type {
  ArtifactType,
  ArtifactStatus,
  BrandingState,
  AIActivity,
  ChatMessage,
  AppNameOption,
  IconConcept,
  ScreenshotCard,
  AppStoreCopy,
  Keyword,
  RiskCheckResult,
  NameArtifact,
  IconArtifact,
  ScreenshotsArtifact,
  CopyArtifact,
  KeywordsArtifact,
  RiskCheckArtifact,
  Asset,
  AssetsArtifact,
} from '@/types/branding';
import {
  generateInitialBranding,
  generateNames,
  generateIcons,
  generateScreenshots,
  generateCopy,
  generateKeywords,
  runRiskCheck,
  refineNames,
  refineCopy,
  generateIconSvg,
} from '@/lib/brandingMockAI';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Cal AI Screen SVG Assets - representing the onboarding flow screens
// Using encodeURIComponent instead of btoa to handle Unicode characters properly
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
    gender: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 852" width="393" height="852">
      <rect width="393" height="852" fill="#ffffff"/>
      <text x="196" y="150" font-family="system-ui" font-size="24" fill="#111111" text-anchor="middle" font-weight="700">What is your gender?</text>
      <text x="196" y="185" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">This helps us calculate your daily needs</text>
      <rect x="46" y="250" width="300" height="80" rx="16" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2"/>
      <circle cx="90" cy="290" r="20" fill="#3B82F6"/>
      <text x="160" y="296" font-family="system-ui" font-size="18" fill="#111111" font-weight="500">Male</text>
      <rect x="46" y="350" width="300" height="80" rx="16" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2"/>
      <circle cx="90" cy="390" r="20" fill="#EC4899"/>
      <text x="160" y="396" font-family="system-ui" font-size="18" fill="#111111" font-weight="500">Female</text>
      <rect x="46" y="450" width="300" height="80" rx="16" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2"/>
      <circle cx="90" cy="490" r="20" fill="#8B5CF6"/>
      <text x="160" y="496" font-family="system-ui" font-size="18" fill="#111111" font-weight="500">Other</text>
      <rect x="46" y="700" width="300" height="56" rx="28" fill="#10B981"/>
      <text x="196" y="736" font-family="system-ui" font-size="18" fill="white" text-anchor="middle" font-weight="600">Continue</text>
    </svg>`,
    source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 852" width="393" height="852">
      <rect width="393" height="852" fill="#ffffff"/>
      <text x="196" y="150" font-family="system-ui" font-size="22" fill="#111111" text-anchor="middle" font-weight="700">Where did you hear</text>
      <text x="196" y="180" font-family="system-ui" font-size="22" fill="#111111" text-anchor="middle" font-weight="700">about us?</text>
      <rect x="46" y="230" width="300" height="60" rx="12" fill="#f3f4f6"/>
      <text x="196" y="268" font-family="system-ui" font-size="16" fill="#111111" text-anchor="middle">TikTok</text>
      <rect x="46" y="310" width="300" height="60" rx="12" fill="#f3f4f6"/>
      <text x="196" y="348" font-family="system-ui" font-size="16" fill="#111111" text-anchor="middle">Instagram</text>
      <rect x="46" y="390" width="300" height="60" rx="12" fill="#f3f4f6"/>
      <text x="196" y="428" font-family="system-ui" font-size="16" fill="#111111" text-anchor="middle">YouTube</text>
      <rect x="46" y="470" width="300" height="60" rx="12" fill="#f3f4f6"/>
      <text x="196" y="508" font-family="system-ui" font-size="16" fill="#111111" text-anchor="middle">Friend or Family</text>
      <rect x="46" y="550" width="300" height="60" rx="12" fill="#f3f4f6"/>
      <text x="196" y="588" font-family="system-ui" font-size="16" fill="#111111" text-anchor="middle">App Store</text>
      <rect x="46" y="700" width="300" height="56" rx="28" fill="#10B981"/>
      <text x="196" y="736" font-family="system-ui" font-size="18" fill="white" text-anchor="middle" font-weight="600">Continue</text>
    </svg>`,
    heightWeight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 852" width="393" height="852">
      <rect width="393" height="852" fill="#ffffff"/>
      <text x="196" y="150" font-family="system-ui" font-size="24" fill="#111111" text-anchor="middle" font-weight="700">Your measurements</text>
      <text x="196" y="185" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">Help us personalize your calorie goal</text>
      <text x="100" y="280" font-family="system-ui" font-size="16" fill="#666666" text-anchor="middle">Height</text>
      <rect x="50" y="300" width="100" height="200" rx="16" fill="#f3f4f6"/>
      <text x="100" y="400" font-family="system-ui" font-size="32" fill="#111111" text-anchor="middle" font-weight="700">5ft 10</text>
      <text x="290" y="280" font-family="system-ui" font-size="16" fill="#666666" text-anchor="middle">Weight</text>
      <rect x="240" y="300" width="100" height="200" rx="16" fill="#f3f4f6"/>
      <text x="290" y="400" font-family="system-ui" font-size="32" fill="#111111" text-anchor="middle" font-weight="700">165</text>
      <text x="290" y="435" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">lbs</text>
      <rect x="46" y="700" width="300" height="56" rx="28" fill="#10B981"/>
      <text x="196" y="736" font-family="system-ui" font-size="18" fill="white" text-anchor="middle" font-weight="600">Continue</text>
    </svg>`,
    goalSpeed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 852" width="393" height="852">
      <rect width="393" height="852" fill="#ffffff"/>
      <text x="196" y="150" font-family="system-ui" font-size="24" fill="#111111" text-anchor="middle" font-weight="700">Choose your pace</text>
      <text x="196" y="185" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">How fast do you want results?</text>
      <rect x="46" y="280" width="300" height="120" rx="20" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
      <text x="196" y="330" font-family="system-ui" font-size="18" fill="#111111" text-anchor="middle" font-weight="600">Slow and Steady</text>
      <text x="196" y="360" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">0.5 lb per week</text>
      <text x="196" y="385" font-family="system-ui" font-size="12" fill="#10B981" text-anchor="middle">Recommended</text>
      <rect x="46" y="420" width="300" height="100" rx="20" fill="#f3f4f6"/>
      <text x="196" y="465" font-family="system-ui" font-size="18" fill="#111111" text-anchor="middle" font-weight="600">Moderate</text>
      <text x="196" y="495" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">1 lb per week</text>
      <rect x="46" y="540" width="300" height="100" rx="20" fill="#f3f4f6"/>
      <text x="196" y="585" font-family="system-ui" font-size="18" fill="#111111" text-anchor="middle" font-weight="600">Fast</text>
      <text x="196" y="615" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">1.5 lbs per week</text>
      <rect x="46" y="700" width="300" height="56" rx="28" fill="#10B981"/>
      <text x="196" y="736" font-family="system-ui" font-size="18" fill="white" text-anchor="middle" font-weight="600">Continue</text>
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
    paywall: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 852" width="393" height="852">
      <defs>
        <linearGradient id="paywallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10B981"/>
          <stop offset="100%" style="stop-color:#059669"/>
        </linearGradient>
      </defs>
      <rect width="393" height="852" fill="#ffffff"/>
      <rect x="0" y="0" width="393" height="200" fill="url(#paywallGrad)"/>
      <text x="196" y="100" font-family="system-ui" font-size="28" fill="white" text-anchor="middle" font-weight="700">Unlock Cal AI Pro</text>
      <text x="196" y="135" font-family="system-ui" font-size="14" fill="white" text-anchor="middle" opacity="0.9">Unlimited scans and personalized plans</text>
      <rect x="46" y="240" width="300" height="100" rx="16" fill="#f3f4f6" stroke="#10B981" stroke-width="2"/>
      <text x="196" y="280" font-family="system-ui" font-size="20" fill="#111111" text-anchor="middle" font-weight="700">Yearly</text>
      <text x="196" y="310" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">$59.99/year - Best value</text>
      <text x="196" y="330" font-family="system-ui" font-size="12" fill="#10B981" text-anchor="middle">Save 50%</text>
      <rect x="46" y="360" width="300" height="80" rx="16" fill="#f3f4f6"/>
      <text x="196" y="395" font-family="system-ui" font-size="18" fill="#111111" text-anchor="middle" font-weight="600">Monthly</text>
      <text x="196" y="420" font-family="system-ui" font-size="14" fill="#666666" text-anchor="middle">$9.99/month</text>
      <text x="70" y="500" font-family="system-ui" font-size="14" fill="#111111">* Unlimited food scans</text>
      <text x="70" y="530" font-family="system-ui" font-size="14" fill="#111111">* Personalized meal plans</text>
      <text x="70" y="560" font-family="system-ui" font-size="14" fill="#111111">* Detailed macro tracking</text>
      <text x="70" y="590" font-family="system-ui" font-size="14" fill="#111111">* Progress insights</text>
      <rect x="46" y="700" width="300" height="56" rx="28" fill="#10B981"/>
      <text x="196" y="736" font-family="system-ui" font-size="18" fill="white" text-anchor="middle" font-weight="600">Start Free Trial</text>
      <text x="196" y="780" font-family="system-ui" font-size="12" fill="#666666" text-anchor="middle">3-day free trial, cancel anytime</text>
    </svg>`,
  };
  // Use data URI with URL encoding to handle all characters
  const svg = svgs[screenType] || svgs.splash;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Pre-populate Cal AI screen assets
const calAIScreenAssets: Asset[] = [
  {
    id: 'cal-ai-splash',
    name: 'Cal AI Splash Screen',
    type: 'screenshot',
    url: generateCalAIScreenSvg('splash'),
    width: 393,
    height: 852,
    tags: ['screen', 'onboarding', 'splash'],
    createdAt: new Date(),
    source: 'generated',
  },
  {
    id: 'cal-ai-welcome',
    name: 'Cal AI Welcome Screen',
    type: 'screenshot',
    url: generateCalAIScreenSvg('welcome'),
    width: 393,
    height: 852,
    tags: ['screen', 'onboarding', 'welcome'],
    createdAt: new Date(),
    source: 'generated',
  },
  {
    id: 'cal-ai-gender',
    name: 'Cal AI Gender Selection',
    type: 'screenshot',
    url: generateCalAIScreenSvg('gender'),
    width: 393,
    height: 852,
    tags: ['screen', 'onboarding', 'survey'],
    createdAt: new Date(),
    source: 'generated',
  },
  {
    id: 'cal-ai-source',
    name: 'Cal AI Source Survey',
    type: 'screenshot',
    url: generateCalAIScreenSvg('source'),
    width: 393,
    height: 852,
    tags: ['screen', 'onboarding', 'survey'],
    createdAt: new Date(),
    source: 'generated',
  },
  {
    id: 'cal-ai-height-weight',
    name: 'Cal AI Height & Weight',
    type: 'screenshot',
    url: generateCalAIScreenSvg('heightWeight'),
    width: 393,
    height: 852,
    tags: ['screen', 'onboarding', 'input'],
    createdAt: new Date(),
    source: 'generated',
  },
  {
    id: 'cal-ai-goal-speed',
    name: 'Cal AI Goal Speed',
    type: 'screenshot',
    url: generateCalAIScreenSvg('goalSpeed'),
    width: 393,
    height: 852,
    tags: ['screen', 'onboarding', 'selection'],
    createdAt: new Date(),
    source: 'generated',
  },
  {
    id: 'cal-ai-results',
    name: 'Cal AI Results Graph',
    type: 'screenshot',
    url: generateCalAIScreenSvg('results'),
    width: 393,
    height: 852,
    tags: ['screen', 'onboarding', 'value-prop'],
    createdAt: new Date(),
    source: 'generated',
  },
  {
    id: 'cal-ai-paywall',
    name: 'Cal AI Paywall',
    type: 'screenshot',
    url: generateCalAIScreenSvg('paywall'),
    width: 393,
    height: 852,
    tags: ['screen', 'onboarding', 'paywall'],
    createdAt: new Date(),
    source: 'generated',
  },
];

interface BrandingStore extends BrandingState {
  // Initialization
  initializeBranding: () => Promise<void>;
  isInitialized: boolean;
  
  // Artifact navigation
  setActiveArtifact: (artifact: ArtifactType) => void;
  
  // Asset actions
  uploadAsset: (file: File) => Promise<void>;
  uploadAssets: (files: File[]) => Promise<void>;
  generateAsset: (prompt: string, type: Asset['type']) => Promise<void>;
  deleteAsset: (assetId: string) => void;
  selectAsset: (assetId: string | null) => void;
  updateAssetTags: (assetId: string, tags: string[]) => void;
  getAssetsByType: (type: Asset['type']) => Asset[];
  
  // Name actions
  selectName: (nameId: string) => void;
  lockName: (nameId: string) => void;
  generateMoreNames: (instruction?: string) => Promise<void>;
  addCustomName: (name: string) => void; // New action
  
  // Icon actions
  selectIcon: (iconId: string) => void;
  lockIcon: (iconId: string) => void;
  regenerateIcons: () => Promise<void>;
  addCustomIcon: (imageUrl: string) => void;
  addIconFromAsset: (assetId: string) => void;
  updateIconColors: (primary: string, secondary: string) => void;
  
  // Screenshot actions
  updateScreenshot: (cardId: string, updates: Partial<ScreenshotCard>) => void;
  updateScreenshotImage: (cardId: string, assetId: string) => void;
  reorderScreenshots: (fromIndex: number, toIndex: number) => void;
  
  // Copy actions
  updateCopy: (updates: Partial<AppStoreCopy>) => void;
  switchVariant: (variantId: string) => void;
  refineCopy: (instruction: string) => Promise<void>;
  lockCopy: () => void;
  
  // Keyword actions
  addKeyword: (text: string) => void;
  removeKeyword: (keywordId: string) => void;
  lockKeywords: () => void;
  
  // Risk check actions
  runRiskCheck: (mode: 'fast' | 'llm') => Promise<void>;
  applyFix: (findingId: string) => void;
  
  // Chat actions
  addMessage: (content: string, role: 'user' | 'ai', relatedArtifact?: ArtifactType) => void;
  processUserInput: (input: string) => Promise<void>;
  
  // Activity management
  addActivity: (activity: Omit<AIActivity, 'id' | 'timestamp'>) => void;
  updateActivity: (activityId: string, updates: Partial<AIActivity>) => void;
  completeActivity: (activityId: string) => void;
  
  // Progress calculation
  calculateProgress: () => void;
}

const initialArtifacts: BrandingState['artifacts'] = {
  assets: {
    type: 'assets',
    status: 'draft',
    assets: calAIScreenAssets,
    selectedAssetId: null,
    categories: ['logo', 'icon', 'screenshot', 'background', 'other'],
  },
  name: {
    type: 'name',
    status: 'draft',
    options: [],
    lockedName: null,
  },
  icon: {
    type: 'icon',
    status: 'draft',
    concepts: [],
    primaryIcon: null,
  },
  screenshots: {
    type: 'screenshots',
    status: 'draft',
    cards: [],
    deviceSize: 'iPhone 15 Pro Max',
  },
  copy: {
    type: 'copy',
    status: 'draft',
    copy: {
      appName: '',
      subtitle: '',
      oneLiner: '',
      description: '',
      whatsNew: '',
      variants: [],
      activeVariantId: '',
    },
  },
  keywords: {
    type: 'keywords',
    status: 'draft',
    keywords: [],
    maxCharacters: 100,
    currentCharacters: 0,
  },
  riskCheck: {
    type: 'riskCheck',
    status: 'draft',
    result: null,
    mode: 'fast',
  },
};

export const useBrandingStore = create<BrandingStore>((set, get) => ({
  // Initial state
  appContext: {
    name: 'CalAI',
    category: 'Health & Fitness',
    description: 'AI-powered calorie tracking app',
  },
  artifacts: initialArtifacts,
  progress: {
    completedCount: 0,
    totalCount: 6,
  },
  activeArtifact: 'name',
  activities: [],
  isGenerating: false,
  messages: [
    {
      id: '1',
      role: 'ai',
      content: 'Welcome to Branding Studio! I\'m generating your initial App Store assets based on your app. Watch the progress above — you can select, lock, and refine anything as it appears.',
      timestamp: new Date(),
    },
  ],
  isInitialized: false,

  // Initialization
  initializeBranding: async () => {
    const { appContext, addActivity, updateActivity, completeActivity, addMessage } = get();
    
    if (get().isInitialized) return;
    
    set({ isGenerating: true });
    
    // Add initial activities
    const nameActivityId = generateId();
    const iconActivityId = generateId();
    const screenshotsActivityId = generateId();
    const copyActivityId = generateId();
    const keywordsActivityId = generateId();
    
    addActivity({
      type: 'generating',
      artifact: 'name',
      message: 'Generating name ideas...',
      progress: 0,
      completed: false,
    });
    
    addActivity({
      type: 'generating',
      artifact: 'icon',
      message: 'Creating icon concepts...',
      progress: 0,
      completed: false,
    });
    
    addActivity({
      type: 'generating',
      artifact: 'copy',
      message: 'Drafting App Store copy...',
      progress: 0,
      completed: false,
    });
    
    try {
      const result = await generateInitialBranding(appContext, (progress) => {
        // Update activities based on progress
        set((state) => ({
          activities: state.activities.map((a) => {
            if (a.artifact === progress.artifact) {
              return { ...a, message: progress.message, progress: progress.progress };
            }
            return a;
          }),
        }));
      });
      
      // Update state with generated content
      set((state) => ({
        artifacts: {
          ...state.artifacts,
          name: {
            ...state.artifacts.name,
            options: result.names,
            status: 'draft',
          },
          icon: {
            ...state.artifacts.icon,
            concepts: result.icons,
            status: 'draft',
          },
          screenshots: {
            ...state.artifacts.screenshots,
            cards: result.screenshots,
            status: 'draft',
          },
          copy: {
            ...state.artifacts.copy,
            copy: result.copy,
            status: 'draft',
          },
          keywords: {
            ...state.artifacts.keywords,
            keywords: result.keywords,
            currentCharacters: result.keywords.reduce((acc, k) => acc + k.text.length + 1, 0),
            status: 'draft',
          },
        },
        activities: state.activities.map((a) => ({ ...a, completed: true, progress: 100 })),
        isGenerating: false,
        isInitialized: true,
      }));
      
      // Add completion message
      addMessage(
        'Your initial brand assets are ready! I\'ve generated 15 name options, 6 icon concepts, and drafted your App Store copy. Select what resonates and lock it in — or tell me how to refine anything.',
        'ai'
      );
      
      get().calculateProgress();
    } catch (error) {
      set({ isGenerating: false });
      addMessage('Something went wrong generating your assets. Let me try again...', 'ai');
    }
  },

  // Navigation
  setActiveArtifact: (artifact) => {
    set({ activeArtifact: artifact });
  },

  // Asset actions
  uploadAsset: async (file: File) => {
    const { addMessage } = get();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const newAsset: Asset = {
            id: generateId(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            type: file.type.includes('image') ? 'image' : 'other',
            url: reader.result as string,
            width: img.width,
            height: img.height,
            fileSize: file.size,
            mimeType: file.type,
            tags: [],
            createdAt: new Date(),
            source: 'uploaded',
            metadata: {
              originalName: file.name,
            },
          };
          
          set((state) => ({
            artifacts: {
              ...state.artifacts,
              assets: {
                ...state.artifacts.assets,
                assets: [newAsset, ...state.artifacts.assets.assets],
              },
            },
          }));
          
          addMessage(`Uploaded "${file.name}" to your assets.`, 'ai');
          resolve();
        };
        img.onerror = () => {
          // Handle non-image files
          const newAsset: Asset = {
            id: generateId(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            type: 'other',
            url: reader.result as string,
            fileSize: file.size,
            mimeType: file.type,
            tags: [],
            createdAt: new Date(),
            source: 'uploaded',
            metadata: {
              originalName: file.name,
            },
          };
          
          set((state) => ({
            artifacts: {
              ...state.artifacts,
              assets: {
                ...state.artifacts.assets,
                assets: [newAsset, ...state.artifacts.assets.assets],
              },
            },
          }));
          
          addMessage(`Uploaded "${file.name}" to your assets.`, 'ai');
          resolve();
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  },

  uploadAssets: async (files: File[]) => {
    const { uploadAsset, addMessage } = get();
    
    for (const file of files) {
      await uploadAsset(file);
    }
    
    if (files.length > 1) {
      addMessage(`Uploaded ${files.length} assets successfully.`, 'ai');
    }
  },

  generateAsset: async (prompt: string, type: Asset['type']) => {
    const { addActivity, addMessage } = get();
    
    set({ isGenerating: true });
    
    addActivity({
      type: 'generating',
      artifact: 'assets',
      message: `Generating ${type}: ${prompt}`,
      progress: 0,
      completed: false,
    });
    
    // Simulate AI generation with a placeholder
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Generate a placeholder gradient image
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
    
    const svgContent = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#grad)" rx="64"/>
        <text x="256" y="280" font-family="system-ui" font-size="48" fill="white" text-anchor="middle" opacity="0.8">AI Generated</text>
      </svg>
    `;
    
    const newAsset: Asset = {
      id: generateId(),
      name: prompt.slice(0, 30),
      type,
      url: `data:image/svg+xml;base64,${btoa(svgContent)}`,
      width: 512,
      height: 512,
      tags: ['ai-generated'],
      createdAt: new Date(),
      source: 'generated',
      metadata: {
        prompt,
        style: 'gradient',
      },
    };
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        assets: {
          ...state.artifacts.assets,
          assets: [newAsset, ...state.artifacts.assets.assets],
        },
      },
      activities: state.activities.map((a) =>
        a.artifact === 'assets' ? { ...a, completed: true, progress: 100 } : a
      ),
      isGenerating: false,
    }));
    
    addMessage(`Generated new ${type} based on "${prompt}".`, 'ai');
  },

  deleteAsset: (assetId: string) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        assets: {
          ...state.artifacts.assets,
          assets: state.artifacts.assets.assets.filter((a) => a.id !== assetId),
          selectedAssetId: state.artifacts.assets.selectedAssetId === assetId ? null : state.artifacts.assets.selectedAssetId,
        },
      },
    }));
  },

  selectAsset: (assetId: string | null) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        assets: {
          ...state.artifacts.assets,
          selectedAssetId: assetId,
        },
      },
    }));
  },

  updateAssetTags: (assetId: string, tags: string[]) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        assets: {
          ...state.artifacts.assets,
          assets: state.artifacts.assets.assets.map((a) =>
            a.id === assetId ? { ...a, tags } : a
          ),
        },
      },
    }));
  },

  getAssetsByType: (type: Asset['type']) => {
    return get().artifacts.assets.assets.filter((a) => a.type === type);
  },

  // Name actions
  selectName: (nameId) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        name: {
          ...state.artifacts.name,
          options: state.artifacts.name.options.map((n) => ({
            ...n,
            selected: n.id === nameId,
          })),
        },
      },
    }));
  },

  lockName: (nameId) => {
    const { artifacts, addMessage, calculateProgress } = get();
    const selectedName = artifacts.name.options.find((n) => n.id === nameId);
    
    if (!selectedName) return;
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        name: {
          ...state.artifacts.name,
          lockedName: selectedName,
          status: 'locked',
        },
        // Also update copy with the new name
        copy: {
          ...state.artifacts.copy,
          copy: {
            ...state.artifacts.copy.copy,
            appName: selectedName.name,
          },
        },
      },
    }));
    
    addMessage(`Locked "${selectedName.name}" as your app name. I've updated your App Store copy to reflect this.`, 'ai');
    calculateProgress();
  },

  generateMoreNames: async (instruction) => {
    const { artifacts, appContext, addActivity, addMessage } = get();
    
    set({ isGenerating: true });
    
    addActivity({
      type: 'generating',
      artifact: 'name',
      message: instruction ? `Generating names: ${instruction}` : 'Generating more name ideas...',
      progress: 0,
      completed: false,
    });
    
    try {
      const newNames = instruction
        ? await refineNames(artifacts.name.options, instruction)
        : await generateNames(appContext, 8);
      
      set((state) => ({
        artifacts: {
          ...state.artifacts,
          name: {
            ...state.artifacts.name,
            options: instruction ? newNames : [...state.artifacts.name.options, ...newNames],
          },
        },
        activities: state.activities.map((a) => 
          a.artifact === 'name' ? { ...a, completed: true, progress: 100 } : a
        ),
        isGenerating: false,
      }));
      
      addMessage(`Generated ${instruction ? 'refined' : '8 more'} name options. ${instruction ? 'These match your preference for ' + instruction + '.' : ''}`, 'ai');
    } catch (error) {
      set({ isGenerating: false });
    }
  },

  addCustomName: (name) => {
    const id = generateId();
    const newNameOption: AppNameOption = {
      id,
      name,
      vibeTags: ['Brandable'], // Default tag
      scores: {
        memorability: 80, // Optimistic default
        clarity: 80,
        uniqueness: 80,
      },
      availability: {
        appStore: 'unknown',
        domain: 'unknown',
        social: 'unknown',
      },
      analysis: "A custom name you provided. It's unique to your vision.",
      pros: ['Aligned with your specific idea', 'Personal meaning'],
      cons: ['May need availability checks'],
      selected: true, // Auto-select the custom name
    };

    set((state) => ({
      artifacts: {
        ...state.artifacts,
        name: {
          ...state.artifacts.name,
          options: [
             newNameOption,
             ...state.artifacts.name.options.map(n => ({ ...n, selected: false }))
          ],
        },
      },
    }));
    
    get().addMessage(`Added custom name "${name}".`, 'ai');
  },

  // Icon actions
  selectIcon: (iconId) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        icon: {
          ...state.artifacts.icon,
          concepts: state.artifacts.icon.concepts.map((i) => ({
            ...i,
            selected: i.id === iconId,
          })),
        },
      },
    }));
  },

  lockIcon: (iconId) => {
    const { artifacts, addMessage, calculateProgress } = get();
    const selectedIcon = artifacts.icon.concepts.find((i) => i.id === iconId);
    
    if (!selectedIcon) return;
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        icon: {
          ...state.artifacts.icon,
          primaryIcon: selectedIcon,
          status: 'locked',
        },
      },
    }));
    
    addMessage('Icon locked as your primary app icon. It will appear in all your App Store previews.', 'ai');
    calculateProgress();
  },

  regenerateIcons: async () => {
    const { addActivity, addMessage } = get();
    
    set({ isGenerating: true });
    
    addActivity({
      type: 'generating',
      artifact: 'icon',
      message: 'Creating new icon concepts...',
      progress: 0,
      completed: false,
    });
    
    const newIcons = await generateIcons(6);
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        icon: {
          ...state.artifacts.icon,
          concepts: newIcons,
          status: 'draft',
          primaryIcon: null,
        },
      },
      activities: state.activities.map((a) =>
        a.artifact === 'icon' ? { ...a, completed: true, progress: 100 } : a
      ),
      isGenerating: false,
    }));
    
    addMessage('Generated 6 fresh icon concepts. Select one to make it your primary.', 'ai');
  },

  addCustomIcon: (imageUrl) => {
    const { addMessage } = get();
    const newIcon: IconConcept = {
      id: generateId(),
      imageUrl,
      style: 'flat', // Default style for uploaded icons
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      selected: true,
      warnings: [],
    };

    set((state) => ({
      artifacts: {
        ...state.artifacts,
        icon: {
          ...state.artifacts.icon,
          concepts: [
            newIcon,
            ...state.artifacts.icon.concepts.map((i) => ({ ...i, selected: false })),
          ],
        },
      },
    }));

    addMessage('Custom icon uploaded and selected.', 'ai');
  },

  addIconFromAsset: (assetId: string) => {
    const { artifacts, addMessage } = get();
    const asset = artifacts.assets.assets.find((a) => a.id === assetId);
    
    if (!asset) return;
    
    const newIcon: IconConcept = {
      id: generateId(),
      imageUrl: asset.url,
      style: 'flat',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      selected: true,
      warnings: [],
    };

    set((state) => ({
      artifacts: {
        ...state.artifacts,
        icon: {
          ...state.artifacts.icon,
          concepts: [
            newIcon,
            ...state.artifacts.icon.concepts.map((i) => ({ ...i, selected: false })),
          ],
        },
      },
    }));

    addMessage(`Added "${asset.name}" from assets as an icon option.`, 'ai');
  },

  updateIconColors: (primary, secondary) => {
    set((state) => {
      const selectedIcon = state.artifacts.icon.concepts.find((i) => i.selected);
      if (!selectedIcon) return state;

      // Don't update custom uploaded images (heuristic: check if it's not our SVG format)
      // Our SVGs start with "data:image/svg+xml"
      if (!selectedIcon.imageUrl.startsWith('data:image/svg+xml')) {
        return state;
      }

      const newImageUrl = generateIconSvg(primary, secondary, selectedIcon.style);

      return {
        artifacts: {
          ...state.artifacts,
          icon: {
            ...state.artifacts.icon,
            concepts: state.artifacts.icon.concepts.map((i) =>
              i.id === selectedIcon.id
                ? {
                    ...i,
                    primaryColor: primary,
                    secondaryColor: secondary,
                    imageUrl: newImageUrl,
                  }
                : i
            ),
            // Update primary icon if it's the one being edited
            primaryIcon:
              state.artifacts.icon.primaryIcon?.id === selectedIcon.id
                ? {
                    ...state.artifacts.icon.primaryIcon,
                    primaryColor: primary,
                    secondaryColor: secondary,
                    imageUrl: newImageUrl,
                  }
                : state.artifacts.icon.primaryIcon,
          },
        },
      };
    });
  },

  // Screenshot actions
  updateScreenshot: (cardId, updates) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        screenshots: {
          ...state.artifacts.screenshots,
          cards: state.artifacts.screenshots.cards.map((c) =>
            c.id === cardId ? { ...c, ...updates } : c
          ),
        },
      },
    }));
  },

  updateScreenshotImage: (cardId: string, assetId: string) => {
    const { artifacts, addMessage } = get();
    const asset = artifacts.assets.assets.find((a) => a.id === assetId);
    
    if (!asset) return;
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        screenshots: {
          ...state.artifacts.screenshots,
          cards: state.artifacts.screenshots.cards.map((c) =>
            c.id === cardId ? { ...c, imageUrl: asset.url } : c
          ),
        },
      },
    }));
    
    addMessage(`Updated screenshot with "${asset.name}" from assets.`, 'ai');
  },

  reorderScreenshots: (fromIndex, toIndex) => {
    set((state) => {
      const cards = [...state.artifacts.screenshots.cards];
      const [removed] = cards.splice(fromIndex, 1);
      cards.splice(toIndex, 0, removed);
      
      return {
        artifacts: {
          ...state.artifacts,
          screenshots: {
            ...state.artifacts.screenshots,
            cards: cards.map((c, i) => ({ ...c, order: i })),
          },
        },
      };
    });
  },

  // Copy actions
  updateCopy: (updates) => {
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        copy: {
          ...state.artifacts.copy,
          copy: {
            ...state.artifacts.copy.copy,
            ...updates,
          },
        },
      },
    }));
  },

  switchVariant: (variantId) => {
    const { artifacts } = get();
    const variant = artifacts.copy.copy.variants.find((v) => v.id === variantId);
    
    if (!variant) return;
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        copy: {
          ...state.artifacts.copy,
          copy: {
            ...state.artifacts.copy.copy,
            activeVariantId: variantId,
            subtitle: variant.subtitle,
            oneLiner: variant.oneLiner,
            description: variant.description,
          },
        },
      },
    }));
  },

  refineCopy: async (instruction) => {
    const { artifacts, addActivity, addMessage } = get();
    
    set({ isGenerating: true });
    
    addActivity({
      type: 'refining',
      artifact: 'copy',
      message: `Refining copy: ${instruction}`,
      progress: 0,
      completed: false,
    });
    
    const refinedCopy = await refineCopy(artifacts.copy.copy, instruction);
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        copy: {
          ...state.artifacts.copy,
          copy: refinedCopy,
        },
      },
      activities: state.activities.map((a) =>
        a.artifact === 'copy' ? { ...a, completed: true, progress: 100 } : a
      ),
      isGenerating: false,
    }));
    
    addMessage(`Refined your copy to be ${instruction}. Check the preview to see the changes.`, 'ai');
  },

  lockCopy: () => {
    const { addMessage, calculateProgress } = get();
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        copy: {
          ...state.artifacts.copy,
          status: 'locked',
        },
      },
    }));
    
    addMessage('App Store copy locked. Your messaging is ready for submission.', 'ai');
    calculateProgress();
  },

  // Keyword actions
  addKeyword: (text) => {
    const { artifacts } = get();
    const newKeyword: Keyword = {
      id: generateId(),
      text: text.toLowerCase().trim(),
      suggested: false,
      risky: false,
    };
    
    const newCharCount = artifacts.keywords.currentCharacters + text.length + 1;
    
    if (newCharCount > artifacts.keywords.maxCharacters) {
      get().addMessage('Character limit reached. Remove some keywords first.', 'ai');
      return;
    }
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        keywords: {
          ...state.artifacts.keywords,
          keywords: [...state.artifacts.keywords.keywords, newKeyword],
          currentCharacters: newCharCount,
        },
      },
    }));
  },

  removeKeyword: (keywordId) => {
    set((state) => {
      const keyword = state.artifacts.keywords.keywords.find((k) => k.id === keywordId);
      const charReduction = keyword ? keyword.text.length + 1 : 0;
      
      return {
        artifacts: {
          ...state.artifacts,
          keywords: {
            ...state.artifacts.keywords,
            keywords: state.artifacts.keywords.keywords.filter((k) => k.id !== keywordId),
            currentCharacters: state.artifacts.keywords.currentCharacters - charReduction,
          },
        },
      };
    });
  },

  lockKeywords: () => {
    const { addMessage, calculateProgress } = get();
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        keywords: {
          ...state.artifacts.keywords,
          status: 'locked',
        },
      },
    }));
    
    addMessage('Keywords locked. Ready for App Store Connect.', 'ai');
    calculateProgress();
  },

  // Risk check actions
  runRiskCheck: async (mode) => {
    const { artifacts, addActivity, addMessage, calculateProgress } = get();
    
    set({ isGenerating: true });
    
    addActivity({
      type: 'checking',
      artifact: 'riskCheck',
      message: mode === 'fast' ? 'Running fast policy check...' : 'Running deep LLM analysis...',
      progress: 0,
      completed: false,
    });
    
    const result = await runRiskCheck(artifacts.copy.copy, artifacts.keywords.keywords, mode);
    
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        riskCheck: {
          ...state.artifacts.riskCheck,
          result,
          mode,
          status: result.findings.length === 0 ? 'locked' : result.score > 50 ? 'needsAttention' : 'draft',
        },
      },
      activities: state.activities.map((a) =>
        a.artifact === 'riskCheck' ? { ...a, completed: true, progress: 100 } : a
      ),
      isGenerating: false,
    }));
    
    if (result.findings.length === 0) {
      addMessage('✓ No policy issues found! Your content looks ready for App Store review.', 'ai');
    } else {
      addMessage(
        `Found ${result.findings.length} potential ${result.findings.length === 1 ? 'issue' : 'issues'}. Risk score: ${result.score}/100 (${result.label}). Review the findings and apply fixes as needed.`,
        'ai',
        'riskCheck'
      );
    }
    
    calculateProgress();
  },

  applyFix: (findingId) => {
    set((state) => {
      if (!state.artifacts.riskCheck.result) return state;
      
      const finding = state.artifacts.riskCheck.result.findings.find((f) => f.id === findingId);
      if (!finding) return state;
      
      // Apply the fix to the copy
      let newCopy = { ...state.artifacts.copy.copy };
      
      if (finding.location === 'description') {
        newCopy.description = newCopy.description.replace(finding.phrase, finding.suggestedRewrite);
      } else if (finding.location === 'subtitle') {
        newCopy.subtitle = newCopy.subtitle.replace(finding.phrase, finding.suggestedRewrite);
      } else if (finding.location === 'name') {
        newCopy.appName = newCopy.appName.replace(finding.phrase, finding.suggestedRewrite);
      }
      
      return {
        artifacts: {
          ...state.artifacts,
          copy: {
            ...state.artifacts.copy,
            copy: newCopy,
          },
          riskCheck: {
            ...state.artifacts.riskCheck,
            result: {
              ...state.artifacts.riskCheck.result,
              findings: state.artifacts.riskCheck.result.findings.map((f) =>
                f.id === findingId ? { ...f, applied: true } : f
              ),
            },
          },
        },
      };
    });
    
    get().addMessage('Fix applied. Run the check again to verify.', 'ai');
  },

  // Chat actions
  addMessage: (content, role, relatedArtifact) => {
    const message: ChatMessage = {
      id: generateId(),
      role,
      content,
      timestamp: new Date(),
      relatedArtifact,
    };
    
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  processUserInput: async (input) => {
    const { addMessage, activeArtifact, generateMoreNames, refineCopy, regenerateIcons, runRiskCheck } = get();
    
    addMessage(input, 'user');
    
    const lowerInput = input.toLowerCase();
    
    // Name-related commands
    if (activeArtifact === 'name' || lowerInput.includes('name')) {
      if (lowerInput.includes('more') || lowerInput.includes('generate') || lowerInput.includes('shorter') || lowerInput.includes('playful') || lowerInput.includes('premium')) {
        await generateMoreNames(input);
        return;
      }
    }
    
    // Copy-related commands
    if (activeArtifact === 'copy' || lowerInput.includes('copy') || lowerInput.includes('description')) {
      if (lowerInput.includes('shorter') || lowerInput.includes('longer') || lowerInput.includes('aggressive') || lowerInput.includes('safe') || lowerInput.includes('casual')) {
        await refineCopy(input);
        return;
      }
    }
    
    // Icon-related commands
    if (activeArtifact === 'icon' || lowerInput.includes('icon')) {
      if (lowerInput.includes('regenerate') || lowerInput.includes('new') || lowerInput.includes('different')) {
        await regenerateIcons();
        return;
      }
    }
    
    // Risk check commands
    if (lowerInput.includes('check') || lowerInput.includes('risk') || lowerInput.includes('policy')) {
      const mode = lowerInput.includes('deep') || lowerInput.includes('llm') ? 'llm' : 'fast';
      await runRiskCheck(mode);
      return;
    }
    
    // Default response
    addMessage(
      `I can help you refine this. Try commands like:\n• "Generate shorter names"\n• "Make copy more aggressive"\n• "Run policy check"\n• "Regenerate icons"`,
      'ai'
    );
  },

  // Activity management
  addActivity: (activity) => {
    const newActivity: AIActivity = {
      ...activity,
      id: generateId(),
      timestamp: new Date(),
    };

    set((state) => ({
      activities: [...state.activities, newActivity],
    }));
  },

  updateActivity: (activityId, updates) => {
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === activityId ? { ...a, ...updates } : a
      ),
    }));
  },

  completeActivity: (activityId) => {
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === activityId ? { ...a, completed: true, progress: 100 } : a
      ),
    }));
  },

  // Progress calculation
  calculateProgress: () => {
    const { artifacts } = get();
    
    let completed = 0;
    if (artifacts.name.status === 'locked') completed++;
    if (artifacts.icon.status === 'locked') completed++;
    if (artifacts.screenshots.status === 'locked') completed++;
    if (artifacts.copy.status === 'locked') completed++;
    if (artifacts.keywords.status === 'locked') completed++;
    if (artifacts.riskCheck.status === 'locked') completed++;
    
    set({
      progress: {
        completedCount: completed,
        totalCount: 6,
      },
    });
  },
}));
