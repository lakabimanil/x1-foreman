// Mock AI Layer for Branding Module
// Cal AI specific data and generation

import type {
  AppNameOption,
  IconConcept,
  ScreenshotCard,
  AppStoreCopy,
  CopyVariant,
  Keyword,
  RiskCheckResult,
  RiskFinding,
} from '@/types/branding';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = (min: number, max: number) => delay(Math.random() * (max - min) + min);
const generateId = () => Math.random().toString(36).substr(2, 9);

// Cal AI specific name options
const calAINameOptions: Omit<AppNameOption, 'id'>[] = [
  {
    name: 'Cal AI',
    vibeTags: ['Short', 'Brandable', 'Technical'],
    scores: { memorability: 95, clarity: 92, uniqueness: 88 },
    availability: { appStore: 'available', domain: 'available', social: 'available' },
    analysis: "Clean, memorable name that clearly communicates AI-powered calorie tracking. The 'Cal' abbreviation is universally understood.",
    pros: ['Instantly memorable', 'Clear value proposition', 'Modern tech feel', 'Easy to spell'],
    cons: ['Similar to "Cal" apps exist', 'May need trademark verification'],
    selected: true,
  },
  {
    name: 'SnapCal',
    vibeTags: ['Playful', 'Literal', 'Short'],
    scores: { memorability: 88, clarity: 90, uniqueness: 75 },
    availability: { appStore: 'available', domain: 'taken', social: 'partial' },
    analysis: "Action-oriented name that emphasizes the snap-to-scan feature. Friendly and approachable.",
    pros: ['Describes core feature', 'Easy to remember', 'Fun sound'],
    cons: ['Domain taken', '"Snap" associated with Snapchat'],
    selected: false,
  },
  {
    name: 'NutriScan',
    vibeTags: ['Literal', 'Technical', 'Premium'],
    scores: { memorability: 82, clarity: 95, uniqueness: 70 },
    availability: { appStore: 'available', domain: 'available', social: 'available' },
    analysis: "Highly descriptive name that tells users exactly what the app does. Professional tone.",
    pros: ['Crystal clear purpose', 'Professional appeal', 'Good for SEO'],
    cons: ['Common naming pattern', 'Less unique'],
    selected: false,
  },
  {
    name: 'Foodie AI',
    vibeTags: ['Playful', 'Brandable', 'Bold'],
    scores: { memorability: 85, clarity: 80, uniqueness: 78 },
    availability: { appStore: 'available', domain: 'taken', social: 'partial' },
    analysis: "Friendly, approachable name that appeals to food enthusiasts. The AI suffix adds modern tech credibility.",
    pros: ['Warm and inviting', 'Appeals to food lovers', 'Modern feel'],
    cons: ['Foodie is overused', 'Domain unavailable'],
    selected: false,
  },
  {
    name: 'MacroMind',
    vibeTags: ['Premium', 'Technical', 'Brandable'],
    scores: { memorability: 80, clarity: 75, uniqueness: 85 },
    availability: { appStore: 'available', domain: 'available', social: 'available' },
    analysis: "Sophisticated name targeting fitness enthusiasts who track macros. The 'Mind' suggests intelligent insights.",
    pros: ['Appeals to fitness crowd', 'Suggests intelligence', 'Unique'],
    cons: ['May exclude casual users', 'Macro is niche term'],
    selected: false,
  },
  {
    name: 'CalorieSnap',
    vibeTags: ['Literal', 'Short', 'Technical'],
    scores: { memorability: 78, clarity: 98, uniqueness: 65 },
    availability: { appStore: 'taken', domain: 'taken', social: 'taken' },
    analysis: "Extremely clear and descriptive. Users know exactly what to expect.",
    pros: ['Maximum clarity', 'No confusion about purpose'],
    cons: ['Very common pattern', 'Low availability'],
    selected: false,
  },
  {
    name: 'Biteful',
    vibeTags: ['Playful', 'Brandable', 'Short'],
    scores: { memorability: 90, clarity: 70, uniqueness: 92 },
    availability: { appStore: 'available', domain: 'available', social: 'available' },
    analysis: "Creative wordplay on 'bite' with a warm, friendly feel. Highly brandable and unique.",
    pros: ['Very memorable', 'Unique sound', 'Positive connotation'],
    cons: ['Purpose less clear', 'May need tagline'],
    selected: false,
  },
  {
    name: 'Calorie Cam',
    vibeTags: ['Literal', 'Playful', 'Short'],
    scores: { memorability: 85, clarity: 92, uniqueness: 72 },
    availability: { appStore: 'available', domain: 'taken', social: 'available' },
    analysis: "Emphasizes the camera-based scanning feature. Simple and effective.",
    pros: ['Clear feature highlight', 'Easy to understand', 'Catchy alliteration'],
    cons: ['Common naming pattern'],
    selected: false,
  },
  {
    name: 'FitFuel',
    vibeTags: ['Bold', 'Brandable', 'Premium'],
    scores: { memorability: 88, clarity: 75, uniqueness: 80 },
    availability: { appStore: 'available', domain: 'taken', social: 'partial' },
    analysis: "Energetic name that positions food as fuel for fitness. Appeals to active users.",
    pros: ['Strong branding potential', 'Motivational tone'],
    cons: ['Fitness-focused may exclude others'],
    selected: false,
  },
  {
    name: 'Nutri AI',
    vibeTags: ['Technical', 'Premium', 'Short'],
    scores: { memorability: 82, clarity: 88, uniqueness: 75 },
    availability: { appStore: 'available', domain: 'available', social: 'available' },
    analysis: "Professional name that emphasizes nutrition expertise powered by AI.",
    pros: ['Clear category', 'Professional tone', 'Good availability'],
    cons: ['Similar to other nutrition apps'],
    selected: false,
  },
  {
    name: 'MealMate AI',
    vibeTags: ['Playful', 'Brandable', 'Technical'],
    scores: { memorability: 85, clarity: 85, uniqueness: 78 },
    availability: { appStore: 'available', domain: 'available', social: 'available' },
    analysis: "Friendly companion-style name. Suggests the app is a helpful partner in meal tracking.",
    pros: ['Warm and approachable', 'Clear purpose', 'Good availability'],
    cons: ['"Mate" suffix common'],
    selected: false,
  },
  {
    name: 'ScanEat',
    vibeTags: ['Short', 'Literal', 'Bold'],
    scores: { memorability: 80, clarity: 90, uniqueness: 82 },
    availability: { appStore: 'available', domain: 'available', social: 'available' },
    analysis: "Action-oriented name with clear instruction. Scan, then eat!",
    pros: ['Very direct', 'Memorable action words'],
    cons: ['May sound too simple'],
    selected: false,
  },
];

// Cal AI icon styles - food/health themed colors
const calAIIconColors = [
  { primary: '#000000', secondary: '#FFFFFF' }, // Classic black/white (current Cal AI)
  { primary: '#4ADE80', secondary: '#166534' }, // Fresh green
  { primary: '#F97316', secondary: '#FDBA74' }, // Warm orange (appetite colors)
  { primary: '#EF4444', secondary: '#FCA5A5' }, // Apple red
  { primary: '#3B82F6', secondary: '#93C5FD' }, // Trust blue
  { primary: '#8B5CF6', secondary: '#C4B5FD' }, // Premium purple
];

// Cal AI screenshot features based on actual onboarding screens
const calAIScreenshotFeatures = [
  {
    headline: 'Scan Any Food Instantly',
    supporting: 'Point your camera at any meal and get instant calorie counts with AI accuracy',
    feature: 'AI Food Scanner',
    screenRef: 'splash-1', // References the Cal AI splash screen
  },
  {
    headline: 'Calorie Tracking Made Easy',
    supporting: 'No more manual logging. Just snap a photo and we handle the rest.',
    feature: 'Effortless Tracking',
    screenRef: 'welcome-1',
  },
  {
    headline: 'Personalized to You',
    supporting: 'Custom calorie goals based on your gender, height, weight, and activity level',
    feature: 'Custom Plans',
    screenRef: 'gender-select',
  },
  {
    headline: 'Track Your Macros',
    supporting: 'Proteins, carbs, and fats - all calculated automatically for every meal',
    feature: 'Macro Breakdown',
    screenRef: 'height-weight',
  },
  {
    headline: 'Reach Your Goals Faster',
    supporting: 'Choose your pace - slow and steady or fast results with our guided plans',
    feature: 'Goal Setting',
    screenRef: 'goal-speed',
  },
  {
    headline: 'See Real Results',
    supporting: '80% of Cal AI users maintain their weight loss even 6 months later',
    feature: 'Proven Results',
    screenRef: 'results-graph',
  },
];

const vibeTags = ['Brandable', 'Literal', 'Short', 'Bold', 'Premium', 'Playful', 'Technical'] as const;
const iconStyles = ['minimal', 'gradient', 'illustrated', '3d', 'flat'] as const;

// Risk keywords and patterns
const riskPatterns = {
  medical: {
    phrases: ['diagnose', 'treat', 'cure', 'prevent disease', 'medical advice', 'doctor recommended', 'clinically proven'],
    severity: 'critical' as const,
  },
  financial: {
    phrases: ['guaranteed results', 'money back', 'save money', 'lose weight fast', 'instant results'],
    severity: 'error' as const,
  },
  privacy: {
    phrases: ['100% anonymous', '100% private', 'completely secure', 'no data collected', 'fully encrypted'],
    severity: 'warning' as const,
  },
  misleading: {
    phrases: ['#1 app', 'best app', 'official', 'approved by Apple', 'featured by Apple', 'award winning'],
    severity: 'error' as const,
  },
  trademark: {
    phrases: ['Apple', 'iOS', 'iPhone', 'App Store', 'Google', 'Android'],
    severity: 'warning' as const,
  },
};

// ============ GENERATION FUNCTIONS ============

export async function generateNames(
  appContext: { name: string; category: string; description: string },
  count: number = 12,
  style?: 'short' | 'playful' | 'premium' | 'literal'
): Promise<AppNameOption[]> {
  await randomDelay(800, 1500);
  
  // Return Cal AI specific names
  let filteredNames = [...calAINameOptions];
  
  if (style) {
    const styleTagMap: Record<string, string[]> = {
      short: ['Short'],
      playful: ['Playful'],
      premium: ['Premium', 'Bold'],
      literal: ['Literal', 'Technical'],
    };
    const targetTags = styleTagMap[style] || [];
    filteredNames = filteredNames.filter(n => 
      n.vibeTags.some(tag => targetTags.includes(tag))
    );
  }
  
  // Add IDs to the names
  return filteredNames.slice(0, count).map(n => ({
    ...n,
    id: generateId(),
  }));
}

export async function generateIcons(count: number = 6): Promise<IconConcept[]> {
  await randomDelay(1200, 2000);
  
  const icons: IconConcept[] = [];
  
  for (let i = 0; i < count; i++) {
    await delay(100);
    
    const colors = calAIIconColors[i % calAIIconColors.length];
    const style = iconStyles[Math.floor(Math.random() * iconStyles.length)];
    
    // Generate Cal AI themed SVG icons
    const iconSvg = generateCalAIIconSvg(colors.primary, colors.secondary, style, i);
    
    const warnings: IconConcept['warnings'] = [];
    
    if (Math.random() > 0.85) {
      warnings.push({
        type: 'lowContrast',
        message: 'Consider increasing contrast for visibility',
        severity: 'low',
      });
    }
    
    icons.push({
      id: generateId(),
      imageUrl: iconSvg,
      style,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      selected: i === 0,
      warnings,
    });
  }
  
  return icons;
}

function generateCalAIIconSvg(primary: string, secondary: string, style: string, variant: number): string {
  // Cal AI themed icons - food/camera/health symbols
  const patterns: Record<number, string> = {
    // Classic Cal AI - minimalist text
    0: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="${primary}"/>
      <text x="60" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="${secondary}" text-anchor="middle">Cal AI</text>
    </svg>`,
    // Apple/food icon
    1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="${primary}"/>
      <path d="M60 25 Q65 20 70 25 L70 35 Q70 38 67 38 L53 38 Q50 38 50 35 L50 25 Q55 20 60 25" fill="${secondary}"/>
      <ellipse cx="60" cy="70" rx="28" ry="32" fill="${secondary}"/>
      <ellipse cx="52" cy="60" rx="8" ry="10" fill="${primary}" opacity="0.3"/>
    </svg>`,
    // Camera/scan icon
    2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="${primary}"/>
      <rect x="25" y="40" width="70" height="50" rx="8" fill="${secondary}"/>
      <circle cx="60" cy="65" r="18" fill="${primary}"/>
      <circle cx="60" cy="65" r="12" fill="${secondary}"/>
      <rect x="45" y="32" width="30" height="12" rx="4" fill="${secondary}"/>
    </svg>`,
    // Chart/progress icon  
    3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="${primary}"/>
      <rect x="25" y="70" width="15" height="25" rx="3" fill="${secondary}"/>
      <rect x="52" y="50" width="15" height="45" rx="3" fill="${secondary}"/>
      <rect x="79" y="30" width="15" height="65" rx="3" fill="${secondary}"/>
      <circle cx="32" cy="62" r="5" fill="${secondary}"/>
      <circle cx="60" cy="42" r="5" fill="${secondary}"/>
      <circle cx="87" cy="22" r="5" fill="${secondary}"/>
      <path d="M32 62 L60 42 L87 22" stroke="${secondary}" stroke-width="2" fill="none"/>
    </svg>`,
    // Plate/nutrition icon
    4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="${primary}"/>
      <circle cx="60" cy="60" r="38" fill="none" stroke="${secondary}" stroke-width="4"/>
      <circle cx="60" cy="60" r="28" fill="none" stroke="${secondary}" stroke-width="2"/>
      <path d="M40 50 Q50 40 60 50 T80 50" fill="none" stroke="${secondary}" stroke-width="3"/>
      <circle cx="45" cy="65" r="8" fill="${secondary}"/>
      <circle cx="70" cy="68" r="6" fill="${secondary}"/>
    </svg>`,
    // Lightning/energy icon
    5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="grad${variant}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary}"/>
          <stop offset="100%" style="stop-color:${secondary}"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#grad${variant})"/>
      <path d="M70 20 L45 55 L58 55 L50 100 L75 60 L62 60 Z" fill="white"/>
    </svg>`,
  };
  
  const svg = patterns[variant] || patterns[0];
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function generateIconSvg(primary: string, secondary: string, style: string): string {
  return generateCalAIIconSvg(primary, secondary, style, 0);
}

// Generate Cal AI screen SVGs for use in screenshots
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
  };
  // Use data URI with URL encoding to handle all characters
  const svg = svgs[screenType] || svgs.splash;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Map screenshot features to Cal AI screen types
const screenshotScreenMapping = [
  'splash',      // Scan Any Food Instantly
  'welcome',     // Calorie Tracking Made Easy  
  'gender',      // Personalized to You
  'heightWeight', // Track Your Macros
  'goalSpeed',   // Reach Your Goals Faster
  'results',     // See Real Results
];

export async function generateScreenshots(): Promise<ScreenshotCard[]> {
  await randomDelay(600, 1200);
  
  const cards: ScreenshotCard[] = [];
  
  for (let i = 0; i < 6; i++) {
    await delay(80);
    const feature = calAIScreenshotFeatures[i];
    const screenType = screenshotScreenMapping[i];
    
    cards.push({
      id: generateId(),
      order: i,
      headline: feature.headline,
      supportingText: feature.supporting,
      featureReferenced: feature.feature,
      imageUrl: generateCalAIScreenSvg(screenType),
    });
  }
  
  return cards;
}

export async function generateCopy(
  appContext: { name: string; category: string; description: string }
): Promise<AppStoreCopy> {
  await randomDelay(1000, 1800);
  
  const appName = appContext.name || 'Cal AI';
  
  const variants: CopyVariant[] = [
    {
      id: generateId(),
      name: 'Professional',
      tone: 'professional',
      appName,
      subtitle: 'AI-Powered Calorie Tracking',
      oneLiner: 'Scan any food, get instant calories. Powered by AI.',
      description: `Transform your nutrition with ${appName}, the intelligent calorie tracking app that makes healthy eating effortless.

**Instant Food Recognition**
Simply point your camera at any meal and our AI instantly identifies foods and calculates calories with remarkable accuracy. No more manual entry or guessing portions.

**Personalized to Your Goals**
Tell us your gender, height, weight, and goals. ${appName} creates a custom calorie plan tailored specifically to you - whether you're looking to lose weight, gain muscle, or maintain.

**Track Macros Automatically**
Every scan gives you a complete breakdown of proteins, carbs, and fats. Watch your daily macros fill up in real-time.

**Proven Results**
80% of ${appName} users maintain their results even 6 months later. Join the community of people who've transformed their relationship with food.

Start your journey today with a free trial.`,
    },
    {
      id: generateId(),
      name: 'Casual',
      tone: 'casual',
      appName,
      subtitle: 'Calorie Tracking Made Easy',
      oneLiner: "Finally, a calorie tracker that doesn't feel like homework.",
      description: `Hey there! 👋 Tired of complicated calorie counting? Same.

That's why we built ${appName} - the easiest way to track what you eat without the headache.

📸 **Just Snap a Photo**
Point your camera at food. That's literally it. Our AI does all the work.

🎯 **Made for YOU**
Tell us about yourself and we'll create a plan that actually fits your life. No cookie-cutter diets here.

📊 **See What You're Eating**
Proteins, carbs, fats - all broken down beautifully. Finally understand your food!

💪 **Real Results**
Most of our users stick with it (80% are still going strong after 6 months!). 

Ready to make healthy eating simple? Let's go! 🥗`,
    },
    {
      id: generateId(),
      name: 'Bold',
      tone: 'bold',
      appName,
      subtitle: 'Dominate Your Nutrition',
      oneLiner: 'The smartest way to track calories. Period.',
      description: `Stop guessing. Start knowing.

${appName} brings AI precision to your nutrition. Every calorie. Every macro. Every meal.

**SCAN ANYTHING**
Our AI recognizes thousands of foods instantly. Restaurant meals? Home cooking? That mystery office snack? We've got it covered.

**YOUR PLAN, YOUR RULES**
We don't do one-size-fits-all. Your custom plan adapts to YOUR body, YOUR goals, YOUR pace.

**NUMBERS THAT MATTER**
Clean, beautiful tracking that shows exactly where you stand. No clutter. No confusion.

**JOIN THE 80%**
That's how many users maintain their results long-term. Be one of them.

This isn't just another calorie counter. It's your unfair advantage.`,
    },
  ];
  
  return {
    appName,
    subtitle: variants[0].subtitle,
    oneLiner: variants[0].oneLiner,
    description: variants[0].description,
    whatsNew: `• Enhanced AI food recognition - now even more accurate
• New personalized meal suggestions
• Improved macro tracking dashboard
• Dark mode refinements
• Bug fixes and performance improvements`,
    variants,
    activeVariantId: variants[0].id,
  };
}

export async function generateKeywords(
  appContext: { name: string; category: string; description: string }
): Promise<Keyword[]> {
  await randomDelay(500, 900);
  
  // Cal AI specific keywords
  const calAIKeywords = [
    { text: 'calorie counter', volume: 'high' as const, risky: false },
    { text: 'calorie tracker', volume: 'high' as const, risky: false },
    { text: 'food scanner', volume: 'high' as const, risky: false },
    { text: 'AI nutrition', volume: 'medium' as const, risky: false },
    { text: 'macro tracker', volume: 'high' as const, risky: false },
    { text: 'diet app', volume: 'high' as const, risky: true, riskReason: 'May trigger additional App Store review' },
    { text: 'weight loss', volume: 'high' as const, risky: true, riskReason: 'Health claims require scrutiny' },
    { text: 'food diary', volume: 'medium' as const, risky: false },
    { text: 'nutrition tracker', volume: 'medium' as const, risky: false },
    { text: 'meal planner', volume: 'medium' as const, risky: false },
    { text: 'photo food log', volume: 'low' as const, risky: false },
    { text: 'calorie camera', volume: 'low' as const, risky: false },
  ];
  
  const keywords: Keyword[] = calAIKeywords.map(k => ({
    id: generateId(),
    text: k.text,
    suggested: true,
    risky: k.risky,
    riskReason: k.riskReason,
    volume: k.volume,
  }));
  
  return keywords;
}

export async function runRiskCheck(
  copy: AppStoreCopy,
  keywords: Keyword[],
  mode: 'fast' | 'llm' = 'fast'
): Promise<RiskCheckResult> {
  await randomDelay(mode === 'fast' ? 800 : 2500, mode === 'fast' ? 1500 : 4000);
  
  const findings: RiskFinding[] = [];
  
  const textSources = [
    { text: copy.appName, location: 'name' as const },
    { text: copy.subtitle, location: 'subtitle' as const },
    { text: copy.description, location: 'description' as const },
  ];
  
  for (const source of textSources) {
    for (const [category, pattern] of Object.entries(riskPatterns)) {
      for (const phrase of pattern.phrases) {
        if (source.text.toLowerCase().includes(phrase.toLowerCase())) {
          findings.push({
            id: generateId(),
            category: category as RiskFinding['category'],
            severity: pattern.severity,
            phrase,
            location: source.location,
            explanation: getExplanation(category, phrase),
            suggestedRewrite: getSuggestedRewrite(phrase),
            applied: false,
          });
        }
      }
    }
  }
  
  for (const keyword of keywords) {
    if (keyword.risky) {
      findings.push({
        id: generateId(),
        category: 'medical',
        severity: 'warning',
        phrase: keyword.text,
        location: 'keywords',
        explanation: 'This keyword may trigger additional App Store scrutiny for health-related apps',
        suggestedRewrite: keyword.text.replace('weight loss', 'wellness journey').replace('diet', 'nutrition'),
        applied: false,
      });
    }
  }
  
  if (mode === 'llm' && findings.length < 2) {
    if (copy.description.toLowerCase().includes('transform')) {
      findings.push({
        id: generateId(),
        category: 'misleading',
        severity: 'warning',
        phrase: 'transform',
        location: 'description',
        explanation: 'Strong transformation claims may be flagged as potentially misleading',
        suggestedRewrite: 'improve',
        applied: false,
      });
    }
  }
  
  let score = 0;
  for (const finding of findings) {
    if (finding.severity === 'critical') score += 30;
    else if (finding.severity === 'error') score += 20;
    else if (finding.severity === 'warning') score += 10;
  }
  score = Math.min(score, 100);
  
  let label: RiskCheckResult['label'];
  if (score === 0) label = 'Safe';
  else if (score <= 20) label = 'Low Risk';
  else if (score <= 50) label = 'Medium Risk';
  else if (score <= 80) label = 'High Risk';
  else label = 'Critical';
  
  return {
    score,
    label,
    findings,
    lastChecked: new Date(),
  };
}

function getExplanation(category: string, phrase: string): string {
  const explanations: Record<string, string> = {
    medical: `The phrase "${phrase}" may be interpreted as a medical claim, which requires FDA approval and App Store review.`,
    financial: `The phrase "${phrase}" could be seen as an unrealistic guarantee, which violates App Store guidelines.`,
    privacy: `Absolute privacy claims like "${phrase}" are difficult to verify and may mislead users.`,
    misleading: `The phrase "${phrase}" may be considered misleading or unsubstantiated unless you have proof.`,
    trademark: `Using "${phrase}" may infringe on trademark rights and violate App Store guidelines.`,
    restricted: `The phrase "${phrase}" is associated with restricted content categories.`,
  };
  return explanations[category] || `The phrase "${phrase}" may violate App Store guidelines.`;
}

function getSuggestedRewrite(phrase: string): string {
  const rewrites: Record<string, string> = {
    'diagnose': 'help understand',
    'treat': 'support',
    'cure': 'assist with',
    'prevent disease': 'promote wellness',
    'medical advice': 'health information',
    'guaranteed results': 'designed to help you achieve',
    'money back': 'satisfaction focused',
    'lose weight fast': 'support your wellness goals',
    'instant results': 'see your progress',
    '#1 app': 'popular app',
    'best app': 'highly-rated app',
    'official': 'dedicated',
    'approved by Apple': 'available on the App Store',
    '100% anonymous': 'privacy-focused',
    '100% private': 'designed with privacy in mind',
  };
  return rewrites[phrase.toLowerCase()] || phrase;
}

// ============ INITIAL GENERATION ============

export async function generateInitialBranding(
  appContext: { name: string; category: string; description: string },
  onProgress: (activity: { artifact: string; message: string; progress: number }) => void
): Promise<{
  names: AppNameOption[];
  icons: IconConcept[];
  screenshots: ScreenshotCard[];
  copy: AppStoreCopy;
  keywords: Keyword[];
}> {
  onProgress({ artifact: 'name', message: 'Generating Cal AI name options...', progress: 0 });
  onProgress({ artifact: 'icon', message: 'Creating Cal AI icon concepts...', progress: 0 });
  onProgress({ artifact: 'copy', message: 'Drafting App Store copy...', progress: 0 });
  
  await delay(500);
  onProgress({ artifact: 'name', message: 'Analyzing brand positioning...', progress: 30 });
  
  const [names, icons, screenshots, copy, keywords] = await Promise.all([
    generateNames(appContext),
    generateIcons(),
    generateScreenshots(),
    generateCopy(appContext),
    generateKeywords(appContext),
  ]);
  
  onProgress({ artifact: 'name', message: 'Generated 12 name options', progress: 100 });
  onProgress({ artifact: 'icon', message: 'Created 6 icon concepts', progress: 100 });
  onProgress({ artifact: 'screenshots', message: 'Built screenshot storyboard', progress: 100 });
  onProgress({ artifact: 'copy', message: 'Drafted 3 copy variants', progress: 100 });
  onProgress({ artifact: 'keywords', message: 'Suggested 12 keywords', progress: 100 });
  
  return { names, icons, screenshots, copy, keywords };
}

// ============ REFINEMENT FUNCTIONS ============

export async function refineNames(
  currentNames: AppNameOption[],
  instruction: string
): Promise<AppNameOption[]> {
  await randomDelay(600, 1200);
  
  let style: 'short' | 'playful' | 'premium' | 'literal' | undefined;
  
  const lowerInstruction = instruction.toLowerCase();
  if (lowerInstruction.includes('short')) style = 'short';
  else if (lowerInstruction.includes('playful') || lowerInstruction.includes('fun')) style = 'playful';
  else if (lowerInstruction.includes('premium') || lowerInstruction.includes('professional')) style = 'premium';
  else if (lowerInstruction.includes('literal') || lowerInstruction.includes('descriptive')) style = 'literal';
  
  const newNames = await generateNames({ name: 'Cal AI', category: 'Health & Fitness', description: 'AI calorie tracker' }, 8, style);
  
  return [...currentNames, ...newNames];
}

export async function refineCopy(
  currentCopy: AppStoreCopy,
  instruction: string
): Promise<AppStoreCopy> {
  await randomDelay(800, 1500);
  
  const lowerInstruction = instruction.toLowerCase();
  
  let modifier = '';
  if (lowerInstruction.includes('shorter')) modifier = 'SHORTER: ';
  else if (lowerInstruction.includes('aggressive') || lowerInstruction.includes('bold')) modifier = 'BOLD: ';
  else if (lowerInstruction.includes('safe') || lowerInstruction.includes('conservative')) modifier = 'SAFE: ';
  else if (lowerInstruction.includes('casual')) modifier = 'CASUAL: ';
  
  return {
    ...currentCopy,
    subtitle: modifier ? modifier + currentCopy.subtitle.slice(0, 20) + '...' : currentCopy.subtitle,
  };
}
