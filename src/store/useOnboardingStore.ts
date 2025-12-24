'use client';

import { create } from 'zustand';
import type { OnboardingBlock, ForemanStep, VerificationLog, ChatMessage } from '@/types';

interface OnboardingState {
  // Onboarding flow
  blocks: OnboardingBlock[];
  activeBlockId: string | null;
  isEditPanelOpen: boolean;
  
  // Foreman steps
  steps: ForemanStep[];
  
  // Verification logs
  logs: VerificationLog[];
  
  // Chat messages
  messages: ChatMessage[];
  isTyping: boolean;
  
  // Actions
  setBlocks: (blocks: OnboardingBlock[]) => void;
  addBlock: (block: OnboardingBlock, afterId?: string) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<OnboardingBlock>) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  setActiveBlock: (id: string | null) => void;
  setEditPanelOpen: (open: boolean) => void;
  
  // Step actions
  completeStep: (stepId: string) => void;
  setActiveStep: (stepId: string) => void;
  
  // Log actions
  addLog: (log: Omit<VerificationLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  
  // Chat actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setIsTyping: (typing: boolean) => void;
  
  // AI command processing
  processCommand: (command: string) => Promise<void>;
}

const initialSteps: ForemanStep[] = [
  {
    id: 'core-identity',
    title: 'Core Identity',
    description: 'Set up your app branding',
    completed: true,
    active: false,
    blockTypes: ['value-prop'],
  },
  {
    id: 'user-auth',
    title: 'User Authentication',
    description: 'Configure sign-in methods',
    completed: false,
    active: true,
    blockTypes: ['auth'],
  },
  {
    id: 'user-profiling',
    title: 'User Profiling',
    description: 'Personalize the experience',
    completed: false,
    active: false,
    blockTypes: ['survey'],
  },
  {
    id: 'permissions',
    title: 'Permission Requests',
    description: 'Enable key features',
    completed: false,
    active: false,
    blockTypes: ['permission'],
  },
  {
    id: 'paywall',
    title: 'Paywall Strategy',
    description: 'Monetization setup',
    completed: false,
    active: false,
    blockTypes: ['paywall'],
  },
];

const initialBlocks: OnboardingBlock[] = [
  {
    id: 'splash-1',
    type: 'value-prop',
    title: 'Cal AI',
    heading: 'Cal AI',
    variant: 'splash',
    description: '',
    ctaText: '',
    style: {
      backgroundColor: 'var(--color-base-white)',
      accentColor: 'var(--color-base-black)',
      textColor: 'var(--color-base-black)',
    },
  },
  {
    id: 'welcome-1',
    type: 'value-prop',
    title: 'Welcome',
    heading: 'Calorie tracking made easy',
    description: 'Scan food using your camera',
    variant: 'image',
    ctaText: 'Get Started',
    style: {
      backgroundColor: 'var(--color-base-white)',
      accentColor: 'var(--color-base-black)',
      textColor: 'var(--color-base-black)',
    },
  },
  {
    id: 'gender-select',
    type: 'survey',
    title: 'Gender',
    question: 'Choose your Gender',
    subtitle: 'This will be used to calibrate your custom plan.',
    variant: 'cards',
    options: [
      { id: 'male', text: 'Male', selected: false },
      { id: 'female', text: 'Female', selected: false },
      { id: 'other', text: 'Other', selected: false },
    ],
    multiSelect: false,
    ctaText: 'Continue',
    style: {
      backgroundColor: 'var(--color-base-white)',
      accentColor: 'var(--color-base-black)',
      textColor: 'var(--color-base-black)',
    },
  },
  {
    id: 'source-select',
    type: 'survey',
    title: 'Source',
    question: 'Where did you hear about us?',
    variant: 'cards',
    options: [
      { id: 'instagram', text: 'Instagram', icon: 'instagram', selected: false },
      { id: 'tiktok', text: 'TikTok', icon: 'music', selected: false }, // using music note for tiktok
      { id: 'tv', text: 'TV', icon: 'tv', selected: false },
      { id: 'friend', text: 'Friend or family', icon: 'users', selected: false },
      { id: 'facebook', text: 'Facebook', icon: 'facebook', selected: false },
      { id: 'youtube', text: 'Youtube', icon: 'youtube', selected: false },
    ],
    multiSelect: false,
    ctaText: 'Continue',
    style: {
      backgroundColor: 'var(--color-base-white)',
      accentColor: 'var(--color-base-black)',
      textColor: 'var(--color-base-black)',
    },
  },
  {
    id: 'height-weight',
    type: 'survey',
    title: 'Measurements',
    question: 'Height & weight',
    subtitle: 'This will be used to calibrate your custom plan.',
    variant: 'picker',
    options: [
      { id: 'opt1', text: '5 ft 6 in, 120 lb', selected: true },
    ],
    multiSelect: false,
    ctaText: 'Continue',
    style: {
      backgroundColor: 'var(--color-base-white)',
      accentColor: 'var(--color-base-black)',
      textColor: 'var(--color-base-black)',
    },
  },
  {
    id: 'goal-speed',
    type: 'survey',
    title: 'Goal Speed',
    question: 'How fast do you want to reach your goal?',
    subtitle: 'Gain weight speed per week',
    variant: 'slider',
    options: [
      { id: 'slow', text: '0.1 kg', description: 'Slow', icon: 'turtle', selected: false },
      { id: 'med', text: '0.8 kg', description: 'Recommended', icon: 'rabbit', selected: true },
      { id: 'fast', text: '1.5 kg', description: 'Fast', icon: 'zap', selected: false },
    ],
    multiSelect: false,
    ctaText: 'Continue',
    style: {
      backgroundColor: 'var(--color-base-white)',
      accentColor: 'var(--color-base-black)',
      textColor: 'var(--color-base-black)',
    },
  },
  {
    id: 'results-graph',
    type: 'value-prop',
    title: 'Results',
    heading: 'Cal AI creates long-term results',
    description: '80% of Cal AI users maintain their weight loss even 6 months later',
    variant: 'graph',
    ctaText: 'Continue',
    style: {
      backgroundColor: 'var(--color-base-white)',
      accentColor: 'var(--color-base-black)',
      textColor: 'var(--color-base-black)',
    },
  },
  {
    id: 'paywall-1',
    type: 'paywall',
    title: 'Your one-time offer',
    subtitle: '80% OFF FOREVER',
    monthlyPrice: 1.66,
    yearlyPrice: 19.99,
    features: [
      'Unlimited food scanning',
      'Personalized diet plan',
      'Progress tracking',
      'No ads',
    ],
    closeDelay: 3,
    ctaText: 'Start Free Trial',
    style: {
      backgroundColor: 'var(--color-base-white)',
      accentColor: 'var(--color-base-black)',
      textColor: 'var(--color-base-black)',
    },
  },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  blocks: initialBlocks,
  activeBlockId: initialBlocks[0]?.id || null,
  isEditPanelOpen: false,
  steps: initialSteps,
  logs: [],
  messages: [
    {
      id: '1',
      role: 'foreman',
      content: "Welcome to x1! I'm your Foreman. I'll guide you through building your onboarding flow. Click any block to edit it, or ask me to add new screens!",
      timestamp: new Date(),
    },
  ],
  isTyping: false,

  setBlocks: (blocks) => set({ blocks }),
  
  addBlock: (block, afterId) => {
    set((state) => {
      const newBlock = {
        ...block,
        style: block.style || {
          backgroundColor: 'var(--color-base-black)',
          accentColor: 'var(--color-accent-blue)',
          textColor: 'var(--color-base-white)',
        },
      };
      
      if (afterId) {
        const index = state.blocks.findIndex((b) => b.id === afterId);
        const newBlocks = [...state.blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        return { blocks: newBlocks, activeBlockId: newBlock.id };
      }
      return { blocks: [...state.blocks, newBlock], activeBlockId: newBlock.id };
    });
  },
  
  removeBlock: (id) => {
    set((state) => {
      const newBlocks = state.blocks.filter((b) => b.id !== id);
      const newActiveId = state.activeBlockId === id 
        ? (newBlocks[0]?.id || null) 
        : state.activeBlockId;
      return { 
        blocks: newBlocks, 
        activeBlockId: newActiveId,
        isEditPanelOpen: newBlocks.length === 0 ? false : state.isEditPanelOpen,
      };
    });
  },
  
  updateBlock: (id, updates) => {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  },
  
  reorderBlocks: (activeId, overId) => {
    set((state) => {
      const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
      const newIndex = state.blocks.findIndex((b) => b.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return state;
      
      const newBlocks = [...state.blocks];
      const [removed] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, removed);
      
      return { blocks: newBlocks };
    });
  },
  
  setActiveBlock: (id) => set({ activeBlockId: id }),
  
  setEditPanelOpen: (open) => set({ isEditPanelOpen: open }),
  
  completeStep: (stepId) => {
    set((state) => ({
      steps: state.steps.map((s) => (s.id === stepId ? { ...s, completed: true } : s)),
    }));
  },
  
  setActiveStep: (stepId) => {
    set((state) => ({
      steps: state.steps.map((s) => ({ ...s, active: s.id === stepId })),
    }));
  },
  
  addLog: (log) => {
    const newLog: VerificationLog = {
      ...log,
      id: generateId(),
      timestamp: new Date(),
    };
    set((state) => ({ logs: [...state.logs.slice(-9), newLog] }));
  },
  
  clearLogs: () => set({ logs: [] }),
  
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },
  
  setIsTyping: (typing) => set({ isTyping: typing }),
  
  processCommand: async (command) => {
    const { addMessage, addBlock, addLog, setIsTyping, setActiveBlock, completeStep } = get();
    
    addMessage({ role: 'user', content: command });
    setIsTyping(true);
    
    await new Promise((r) => setTimeout(r, 800));
    
    const lowerCommand = command.toLowerCase();
    
    // Quiz/Survey detection
    if (lowerCommand.includes('quiz') || lowerCommand.includes('survey') || lowerCommand.includes('question')) {
      const match = lowerCommand.match(/(\d+)/);
      const count = match ? parseInt(match[1]) : 3;
      
      addLog({ message: `Creating ${count} survey blocks...`, status: 'pending' });
      
      const topics = ['fitness', 'goals', 'experience', 'schedule', 'motivation'];
      
      for (let i = 0; i < count; i++) {
        await new Promise((r) => setTimeout(r, 300));
        const surveyBlock: OnboardingBlock = {
          id: generateId(),
          type: 'survey',
          title: `Question ${i + 1}`,
          question: `What's your ${topics[i % topics.length]} level?`,
          options: [
            { id: generateId(), text: 'Beginner', selected: false },
            { id: generateId(), text: 'Intermediate', selected: false },
            { id: generateId(), text: 'Advanced', selected: false },
          ],
          multiSelect: false,
          ctaText: 'Continue',
          style: {
            backgroundColor: 'var(--color-base-black)',
            accentColor: 'var(--color-accent-blue)',
            textColor: 'var(--color-base-white)',
          },
        };
        addBlock(surveyBlock);
        if (i === 0) setActiveBlock(surveyBlock.id);
      }
      
      addLog({ message: `✓ Added ${count} survey blocks`, status: 'success' });
      completeStep('user-profiling');
      
      setIsTyping(false);
      addMessage({
        role: 'foreman',
        content: `I've added your ${count}-question quiz! Click any block to edit the questions, options, or colors. Should we insert a Paywall next?`,
      });
      return;
    }
    
    // Paywall detection
    if (lowerCommand.includes('paywall')) {
      addLog({ message: 'Configuring paywall strategy...', status: 'pending' });
      
      await new Promise((r) => setTimeout(r, 500));
      
      const paywallBlock: OnboardingBlock = {
        id: generateId(),
        type: 'paywall',
        title: 'Premium Access',
        subtitle: 'Unlock your full potential',
        monthlyPrice: 9.99,
        yearlyPrice: 59.99,
        features: [
          'Unlimited access to all features',
          'Personalized workout plans',
          'Progress tracking & analytics',
          'Ad-free experience',
        ],
        closeDelay: 3,
        ctaText: 'Start Free Trial',
        style: {
          backgroundColor: 'var(--color-base-black)',
          accentColor: 'var(--color-accent-blue)',
          textColor: 'var(--color-base-white)',
        },
      };
      
      addBlock(paywallBlock);
      setActiveBlock(paywallBlock.id);
      addLog({ message: '✓ Paywall configured with 3s close delay', status: 'success' });
      completeStep('paywall');
      
      setIsTyping(false);
      addMessage({
        role: 'foreman',
        content: "I've added a high-converting paywall! Click it to customize pricing, features, and colors. The 3-second close delay is set to maximize conversions.",
      });
      return;
    }
    
    // Permissions detection
    if (lowerCommand.includes('notification') || lowerCommand.includes('permission')) {
      addLog({ message: 'Setting up notification permissions...', status: 'pending' });
      
      await new Promise((r) => setTimeout(r, 400));
      
      const permBlock: OnboardingBlock = {
        id: generateId(),
        type: 'permission',
        title: 'Stay Updated',
        permissionType: 'notifications',
        permissionTitle: '"YourApp" Would Like to Send You Notifications',
        permissionBody: 'Notifications may include alerts, sounds, and icon badges.',
        ctaText: 'Enable Notifications',
        style: {
          backgroundColor: 'var(--color-base-black)',
          accentColor: 'var(--color-accent-red)',
          textColor: 'var(--color-base-white)',
        },
      };
      
      addBlock(permBlock);
      setActiveBlock(permBlock.id);
      addLog({ message: '✓ Notification permission configured', status: 'success' });
      completeStep('permissions');
      
      setIsTyping(false);
      addMessage({
        role: 'foreman',
        content: "I've added a notification permission screen. Click it to customize the pre-prompt message and styling!",
      });
      return;
    }
    
    // Auth detection
    if (lowerCommand.includes('auth') || lowerCommand.includes('sign in') || lowerCommand.includes('login')) {
      addLog({ message: 'Verifying Apple Sign-In eligibility...', status: 'pending' });
      
      await new Promise((r) => setTimeout(r, 600));
      
      addLog({ message: '✓ Apple Sign-In configured', status: 'success' });
      completeStep('user-auth');
      
      setIsTyping(false);
      addMessage({
        role: 'foreman',
        content: "Your authentication block is already set up! Click it to customize the sign-in methods or styling.",
      });
      return;
    }
    
    // Default response
    setIsTyping(false);
    addMessage({
      role: 'foreman',
      content: "I can help you add surveys, paywalls, permissions, or authentication blocks. Try saying 'Add a 3-question quiz' or 'Add a paywall'. You can also click any block to edit it directly!",
    });
  },
}));
