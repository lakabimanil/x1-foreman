export type BlockType = 'auth' | 'survey' | 'permission' | 'paywall' | 'video' | 'value-prop' | 'splash';

export interface SurveyOption {
  id: string;
  text: string;
  selected: boolean;
  icon?: string;
  description?: string;
}

export interface BlockStyle {
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export interface BlockAnimation {
  entrance?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'bounce' | 'none';
  entranceDelay?: number;
  entranceDuration?: number;
  exit?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none';
  exitDuration?: number;
  loop?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'icon' | 'lottie';
  url: string;
  thumbnail?: string;
  category?: string;
  isX1Library?: boolean;
}

export interface OnboardingBlock {
  id: string;
  type: BlockType;
  title: string;
  subtitle?: string;
  variant?: 'splash' | 'default' | 'graph' | 'picker' | 'cards' | 'image' | 'slider' | 'hero' | 'minimal' | 'cards-feature';
  // Styling
  style?: BlockStyle;
  // Animation
  animation?: BlockAnimation;
  // Assets
  backgroundImage?: string;
  foregroundImage?: string;
  iconUrl?: string;
  logoUrl?: string;
  // Auth specific
  authMethods?: ('apple' | 'email' | 'google')[];
  // Survey specific
  question?: string;
  options?: SurveyOption[];
  multiSelect?: boolean;
  // Permission specific
  permissionType?: 'notifications' | 'att' | 'location' | 'camera';
  permissionTitle?: string;
  permissionBody?: string;
  // Paywall specific
  monthlyPrice?: number;
  yearlyPrice?: number;
  features?: string[];
  closeDelay?: number;
  showTrialToggle?: boolean;
  badgeText?: string;
  discountPercent?: number;
  // Video specific
  videoUrl?: string;
  // Value prop specific
  heading?: string;
  description?: string;
  imageUrl?: string;
  // CTA Button
  ctaText?: string;
  secondaryCtaText?: string;
}

export interface ForemanStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
  blockTypes: BlockType[];
}

export interface VerificationLog {
  id: string;
  message: string;
  status: 'pending' | 'success' | 'error' | 'info';
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'foreman';
  content: string;
  timestamp: Date;
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  category: 'fitness' | 'finance' | 'social' | 'productivity' | 'ecommerce' | 'custom';
  thumbnail: string;
  blocks: OnboardingBlock[];
}

export interface ScreenTemplate {
  id: string;
  name: string;
  type: BlockType;
  variant?: string;
  thumbnail: string;
  block: Partial<OnboardingBlock>;
}

export interface UIComponent {
  id: string;
  name: string;
  category: 'buttons' | 'inputs' | 'cards' | 'layouts' | 'media' | 'navigation';
  preview: string;
  code?: string;
}

// Preset color themes
export const colorPresets = [
  { name: 'Default', bg: 'var(--color-base-black)', accent: 'var(--color-accent-blue)', text: 'var(--color-base-white)' },
  { name: 'Ocean', bg: '#0A1628', accent: '#00D4FF', text: 'var(--color-base-white)' },
  { name: 'Forest', bg: '#0D1F0D', accent: 'var(--color-accent-green)', text: 'var(--color-base-white)' },
  { name: 'Sunset', bg: '#1A0A0A', accent: '#FF6B35', text: 'var(--color-base-white)' },
  { name: 'Purple', bg: '#0D0A1A', accent: 'var(--color-accent-purple)', text: 'var(--color-base-white)' },
  { name: 'Coral', bg: '#1A0F0F', accent: '#FF6B6B', text: 'var(--color-base-white)' },
  { name: 'Gold', bg: '#1A1508', accent: '#FFD700', text: 'var(--color-base-white)' },
  { name: 'Mint', bg: '#0A1A1A', accent: '#00CED1', text: 'var(--color-base-white)' },
  { name: 'Clean White', bg: 'var(--color-base-white)', accent: 'var(--color-base-black)', text: 'var(--color-base-black)' },
  { name: 'Warm White', bg: '#FFFBF5', accent: '#E07B39', text: '#1A1A1A' },
];

// Animation presets
export const animationPresets: { name: string; animation: BlockAnimation }[] = [
  { name: 'None', animation: { entrance: 'none', exit: 'none' } },
  { name: 'Fade In', animation: { entrance: 'fade', entranceDuration: 0.5, exit: 'fade', exitDuration: 0.3 } },
  { name: 'Slide Up', animation: { entrance: 'slide-up', entranceDuration: 0.4, exit: 'slide-down', exitDuration: 0.3 } },
  { name: 'Bounce', animation: { entrance: 'bounce', entranceDuration: 0.6, exit: 'fade', exitDuration: 0.3 } },
  { name: 'Scale Pop', animation: { entrance: 'scale', entranceDuration: 0.4, exit: 'scale', exitDuration: 0.2 } },
  { name: 'Stagger', animation: { entrance: 'fade', stagger: true, staggerDelay: 0.1, exit: 'fade' } },
];

// X1 Library Assets
export const x1LibraryAssets: Asset[] = [
  // Illustrations
  { id: 'x1-1', name: 'Welcome Hero', type: 'image', url: 'https://illustrations.popsy.co/amber/man-on-a-rocket.svg', category: 'illustrations', isX1Library: true },
  { id: 'x1-2', name: 'Success', type: 'image', url: 'https://illustrations.popsy.co/amber/success.svg', category: 'illustrations', isX1Library: true },
  { id: 'x1-3', name: 'Meditation', type: 'image', url: 'https://illustrations.popsy.co/amber/meditating.svg', category: 'illustrations', isX1Library: true },
  { id: 'x1-4', name: 'Running', type: 'image', url: 'https://illustrations.popsy.co/amber/woman-running.svg', category: 'illustrations', isX1Library: true },
  { id: 'x1-5', name: 'Reading', type: 'image', url: 'https://illustrations.popsy.co/amber/reading-side.svg', category: 'illustrations', isX1Library: true },
  { id: 'x1-6', name: 'Celebrating', type: 'image', url: 'https://illustrations.popsy.co/amber/celebrating-woman.svg', category: 'illustrations', isX1Library: true },
  // Backgrounds
  { id: 'x1-bg-1', name: 'Gradient Mesh Blue', type: 'image', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80', category: 'backgrounds', isX1Library: true },
  { id: 'x1-bg-2', name: 'Gradient Mesh Purple', type: 'image', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80', category: 'backgrounds', isX1Library: true },
  { id: 'x1-bg-3', name: 'Abstract Waves', type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', category: 'backgrounds', isX1Library: true },
  { id: 'x1-bg-4', name: 'Dark Gradient', type: 'image', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80', category: 'backgrounds', isX1Library: true },
  // Photos
  { id: 'x1-photo-1', name: 'Healthy Food', type: 'image', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', category: 'photos', isX1Library: true },
  { id: 'x1-photo-2', name: 'Workout', type: 'image', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', category: 'photos', isX1Library: true },
  { id: 'x1-photo-3', name: 'Yoga', type: 'image', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', category: 'photos', isX1Library: true },
  { id: 'x1-photo-4', name: 'Finance', type: 'image', url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80', category: 'photos', isX1Library: true },
];

// Screen Templates
export const screenTemplates: ScreenTemplate[] = [
  // Splash & Welcome
  { 
    id: 'splash-cal-ai', 
    name: 'Cal AI Splash', 
    type: 'value-prop', 
    variant: 'splash', 
    thumbnail: '/templates/splash-1.png', 
    block: { 
      title: 'Cal AI',
      heading: 'Cal AI',
      variant: 'splash',
      style: { backgroundColor: 'var(--color-base-white)', accentColor: 'var(--color-base-black)', textColor: 'var(--color-base-black)' }
    } 
  },
  { 
    id: 'welcome-cal-ai', 
    name: 'Welcome Scan', 
    type: 'value-prop', 
    variant: 'image', 
    thumbnail: '/templates/welcome-1.png', 
    block: { 
      title: 'Welcome',
      heading: 'Calorie tracking made easy',
      description: 'Scan food using your camera',
      variant: 'image',
      ctaText: 'Get Started',
      style: { backgroundColor: 'var(--color-base-white)', accentColor: 'var(--color-base-black)', textColor: 'var(--color-base-black)' }
    } 
  },
  
  // Surveys
  { 
    id: 'survey-gender', 
    name: 'Gender Selection', 
    type: 'survey', 
    variant: 'cards', 
    thumbnail: '/templates/survey-cards.png', 
    block: { 
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
      style: { backgroundColor: 'var(--color-base-white)', accentColor: 'var(--color-base-black)', textColor: 'var(--color-base-black)' }
    } 
  },
  { 
    id: 'survey-source', 
    name: 'Source Question', 
    type: 'survey', 
    variant: 'cards', 
    thumbnail: '/templates/survey-cards.png', 
    block: { 
      title: 'Source',
      question: 'Where did you hear about us?',
      variant: 'cards',
      options: [
        { id: 'instagram', text: 'Instagram', icon: 'instagram', selected: false },
        { id: 'tiktok', text: 'TikTok', icon: 'music', selected: false },
        { id: 'tv', text: 'TV', icon: 'tv', selected: false },
        { id: 'friend', text: 'Friend or family', icon: 'users', selected: false },
      ],
      multiSelect: false,
      ctaText: 'Continue',
      style: { backgroundColor: 'var(--color-base-white)', accentColor: 'var(--color-base-black)', textColor: 'var(--color-base-black)' }
    } 
  },
  { 
    id: 'survey-measurements', 
    name: 'Measurements', 
    type: 'survey', 
    variant: 'picker', 
    thumbnail: '/templates/survey-picker.png', 
    block: { 
      title: 'Measurements',
      question: 'Height & weight',
      subtitle: 'This will be used to calibrate your custom plan.',
      variant: 'picker',
      options: [
        { id: 'opt1', text: '5 ft 6 in, 120 lb', selected: true },
      ],
      multiSelect: false,
      ctaText: 'Continue',
      style: { backgroundColor: 'var(--color-base-white)', accentColor: 'var(--color-base-black)', textColor: 'var(--color-base-black)' }
    } 
  },
  { 
    id: 'survey-goal-speed', 
    name: 'Goal Speed', 
    type: 'survey', 
    variant: 'slider', 
    thumbnail: '/templates/survey-slider.png', 
    block: { 
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
      style: { backgroundColor: 'var(--color-base-white)', accentColor: 'var(--color-base-black)', textColor: 'var(--color-base-black)' }
    } 
  },

  // Results
  { 
    id: 'results-graph', 
    name: 'Graph Result', 
    type: 'value-prop', 
    variant: 'graph', 
    thumbnail: '/templates/welcome-2.png', 
    block: { 
      title: 'Results',
      heading: 'Cal AI creates long-term results',
      description: '80% of Cal AI users maintain their weight loss even 6 months later',
      variant: 'graph',
      ctaText: 'Continue',
      style: { backgroundColor: 'var(--color-base-white)', accentColor: 'var(--color-base-black)', textColor: 'var(--color-base-black)' }
    } 
  },

  // Paywall
  { 
    id: 'paywall-cal-ai', 
    name: 'One-Time Offer', 
    type: 'paywall', 
    thumbnail: '/templates/paywall-1.png', 
    block: { 
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
      style: { backgroundColor: 'var(--color-base-white)', accentColor: 'var(--color-base-black)', textColor: 'var(--color-base-black)' }
    } 
  },
];

// Onboarding Templates
export const onboardingTemplates: OnboardingTemplate[] = [
  {
    id: 'cal-ai-flow',
    name: 'Cal AI Flow',
    description: 'Complete health & fitness onboarding flow',
    category: 'fitness',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    blocks: screenTemplates.map(template => ({
      id: Math.random().toString(36).substr(2, 9),
      type: template.type,
      ...template.block
    } as OnboardingBlock)),
  },
  {
    id: 'finance-flow',
    name: 'Finance App',
    description: 'Banking & investment app onboarding',
    category: 'finance',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
    blocks: [],
  },
  {
    id: 'social-flow',
    name: 'Social App',
    description: 'Social media & community app onboarding',
    category: 'social',
    thumbnail: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=400&q=80',
    blocks: [],
  },
];
