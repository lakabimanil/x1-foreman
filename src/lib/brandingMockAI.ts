// Mock AI Layer for Branding Module
// Simulates AI generation with realistic delays and responses

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

// Name generation data
const nameWords = {
  prefixes: ['Snap', 'Flow', 'Pulse', 'Zen', 'Nova', 'Flux', 'Swift', 'Pixel', 'Cloud', 'Core'],
  suffixes: ['ly', 'io', 'fy', 'ize', 'Hub', 'Lab', 'Base', 'Pro', 'AI', 'X'],
  abstract: ['Lumina', 'Aether', 'Prism', 'Vertex', 'Orbit', 'Nexus', 'Cipher', 'Echo', 'Helix', 'Spark'],
  descriptive: ['CalTrack', 'FitLog', 'MealSnap', 'NutriScan', 'HealthMap', 'DietPal', 'FoodScope', 'MacroMate'],
};

const vibeTags = ['Brandable', 'Literal', 'Short', 'Bold', 'Premium', 'Playful', 'Technical'] as const;

// Icon generation mock data (using placeholder patterns)
const iconStyles = ['minimal', 'gradient', 'illustrated', '3d', 'flat'] as const;
const iconColors = [
  { primary: '#FF6B6B', secondary: '#4ECDC4' },
  { primary: '#667EEA', secondary: '#764BA2' },
  { primary: '#11998E', secondary: '#38EF7D' },
  { primary: '#FC466B', secondary: '#3F5EFB' },
  { primary: '#FF9A9E', secondary: '#FECFEF' },
  { primary: '#00C9FF', secondary: '#92FE9D' },
  { primary: '#F093FB', secondary: '#F5576C' },
  { primary: '#4776E6', secondary: '#8E54E9' },
];

// Screenshot feature templates
const screenshotFeatures = [
  { headline: 'Track Everything', supporting: 'Log meals in seconds with AI-powered scanning', feature: 'Food logging' },
  { headline: 'Know Your Macros', supporting: 'Instant breakdown of proteins, carbs, and fats', feature: 'Macro tracking' },
  { headline: 'Personalized Plans', supporting: 'AI-generated meal plans tailored to your goals', feature: 'Meal planning' },
  { headline: 'Progress Insights', supporting: 'Visual charts show your journey over time', feature: 'Analytics' },
  { headline: 'Smart Reminders', supporting: 'Never miss a meal or water intake', feature: 'Notifications' },
  { headline: 'Community Support', supporting: 'Connect with others on the same journey', feature: 'Social features' },
];

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
  count: number = 15,
  style?: 'short' | 'playful' | 'premium' | 'literal'
): Promise<AppNameOption[]> {
  await randomDelay(800, 1500);
  
  const names: AppNameOption[] = [];
  
  for (let i = 0; i < count; i++) {
    await delay(50); // Stagger for visual effect
    
    let name: string;
    let tags: typeof vibeTags[number][] = [];
    let analysis = '';
    let pros: string[] = [];
    let cons: string[] = [];
    
    const rand = Math.random();
    if (style === 'short' || (rand < 0.3 && !style)) {
      // Short abstract names
      name = nameWords.abstract[Math.floor(Math.random() * nameWords.abstract.length)];
      tags = ['Short', 'Brandable'];
      analysis = "A modern, abstract name that's easy to remember and brandable.";
      pros = ['Very memorable', 'Easy to spell', 'Available as a handle'];
      cons = ['Might need explanation', 'Somewhat generic'];
    } else if (style === 'playful' || (rand < 0.5 && !style)) {
      // Combined names
      const prefix = nameWords.prefixes[Math.floor(Math.random() * nameWords.prefixes.length)];
      const suffix = nameWords.suffixes[Math.floor(Math.random() * nameWords.suffixes.length)];
      name = prefix + suffix;
      tags = ['Playful', 'Brandable'];
      analysis = "A catchy compound name that suggests energy and movement.";
      pros = ['Unique sound', 'Suggests action', 'Modern tech feel'];
      cons = ['Might feel too startup-y', 'Spelling variations possible'];
    } else if (style === 'literal' || (rand < 0.7 && !style)) {
      // Descriptive names
      name = nameWords.descriptive[Math.floor(Math.random() * nameWords.descriptive.length)];
      tags = ['Literal', 'Technical'];
      analysis = "A clear, descriptive name that tells users exactly what the app does.";
      pros = ['Instant clarity', 'Good for SEO', 'Trustworthy tone'];
      cons = ['Less unique', 'Harder to trademark', 'Common naming pattern'];
    } else {
      // Premium names
      const prefix = nameWords.prefixes[Math.floor(Math.random() * nameWords.prefixes.length)];
      name = prefix + ' Pro';
      tags = ['Premium', 'Bold'];
      analysis = "A strong, professional name that implies high quality and advanced features.";
      pros = ['Professional appeal', 'Implies authority', 'Short and punchy'];
      cons = ['"Pro" is overused', 'May sound expensive', 'Generic structure'];
    }
    
    // Add random additional tag
    if (Math.random() > 0.5) {
      const extraTag = vibeTags[Math.floor(Math.random() * vibeTags.length)];
      if (!tags.includes(extraTag)) {
        tags.push(extraTag);
      }
    }
    
    names.push({
      id: generateId(),
      name,
      vibeTags: tags,
      scores: {
        memorability: Math.floor(Math.random() * 30) + 70,
        clarity: Math.floor(Math.random() * 40) + 60,
        uniqueness: Math.floor(Math.random() * 50) + 50,
      },
      availability: {
        appStore: Math.random() > 0.3 ? 'available' : Math.random() > 0.5 ? 'taken' : 'unknown',
        domain: Math.random() > 0.5 ? 'available' : Math.random() > 0.5 ? 'taken' : 'unknown',
        social: Math.random() > 0.4 ? 'available' : Math.random() > 0.5 ? 'partial' : 'taken',
      },
      analysis,
      pros,
      cons,
      selected: false,
    });
  }
  
  return names;
}

export async function generateIcons(count: number = 6): Promise<IconConcept[]> {
  await randomDelay(1200, 2000);
  
  const icons: IconConcept[] = [];
  
  for (let i = 0; i < count; i++) {
    await delay(100);
    
    const colors = iconColors[Math.floor(Math.random() * iconColors.length)];
    const style = iconStyles[Math.floor(Math.random() * iconStyles.length)];
    
    // Generate SVG-based placeholder icons
    const iconSvg = generateIconSvg(colors.primary, colors.secondary, style);
    
    const warnings: IconConcept['warnings'] = [];
    
    // Random warnings
    if (Math.random() > 0.8) {
      warnings.push({
        type: 'lowContrast',
        message: 'Consider increasing contrast for visibility',
        severity: 'low',
      });
    }
    if (Math.random() > 0.9) {
      warnings.push({
        type: 'generic',
        message: 'This style may appear similar to existing apps',
        severity: 'medium',
      });
    }
    
    icons.push({
      id: generateId(),
      imageUrl: iconSvg,
      style,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      selected: i === 0, // First one selected by default
      warnings,
    });
  }
  
  return icons;
}

export function generateIconSvg(primary: string, secondary: string, style: string): string {
  const patterns: Record<string, string> = {
    minimal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="${primary}"/>
      <circle cx="60" cy="60" r="30" fill="${secondary}" opacity="0.9"/>
    </svg>`,
    gradient: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary}"/>
          <stop offset="100%" style="stop-color:${secondary}"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#grad)"/>
      <path d="M40 80 L60 40 L80 80 Z" fill="white" opacity="0.9"/>
    </svg>`,
    illustrated: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="${primary}"/>
      <circle cx="45" cy="50" r="15" fill="${secondary}"/>
      <circle cx="75" cy="50" r="15" fill="${secondary}"/>
      <path d="M40 75 Q60 95 80 75" stroke="${secondary}" stroke-width="4" fill="none"/>
    </svg>`,
    '3d': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="${primary}"/>
      <ellipse cx="60" cy="60" rx="35" ry="25" fill="${secondary}"/>
      <ellipse cx="60" cy="55" rx="35" ry="25" fill="white" opacity="0.3"/>
    </svg>`,
    flat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="${primary}"/>
      <rect x="30" y="30" width="60" height="60" rx="8" fill="${secondary}"/>
      <rect x="45" y="45" width="30" height="30" rx="4" fill="white"/>
    </svg>`,
  };
  
  const svg = patterns[style] || patterns.minimal;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export async function generateScreenshots(): Promise<ScreenshotCard[]> {
  await randomDelay(600, 1200);
  
  const cards: ScreenshotCard[] = [];
  const shuffled = [...screenshotFeatures].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < 6; i++) {
    await delay(80);
    const feature = shuffled[i % shuffled.length];
    
    cards.push({
      id: generateId(),
      order: i,
      headline: feature.headline,
      supportingText: feature.supporting,
      featureReferenced: feature.feature,
    });
  }
  
  return cards;
}

export async function generateCopy(
  appContext: { name: string; category: string; description: string }
): Promise<AppStoreCopy> {
  await randomDelay(1000, 1800);
  
  const variants: CopyVariant[] = [
    {
      id: generateId(),
      name: 'Professional',
      tone: 'professional',
      appName: appContext.name || 'CalAI',
      subtitle: 'Smart Nutrition Tracking',
      oneLiner: 'AI-powered calorie counting for the modern health enthusiast.',
      description: `Transform your nutrition journey with ${appContext.name || 'CalAI'}, the intelligent calorie tracking app that makes healthy eating effortless.

**Smart Food Recognition**
Simply snap a photo of your meal and our AI instantly identifies foods and calculates nutritional information with laboratory-grade accuracy.

**Personalized Insights**
Get data-driven recommendations tailored to your unique metabolism, goals, and dietary preferences.

**Seamless Tracking**
Log meals in seconds, not minutes. Our intuitive interface removes the friction from daily nutrition logging.

Join millions who've transformed their relationship with food.`,
    },
    {
      id: generateId(),
      name: 'Casual',
      tone: 'casual',
      appName: appContext.name || 'CalAI',
      subtitle: 'Calorie Counting Made Fun',
      oneLiner: 'Finally, a calorie tracker that doesn\'t feel like homework.',
      description: `Hey there! 👋 Tired of complicated calorie tracking? Same.

That's why we built ${appContext.name || 'CalAI'} – the easiest way to stay on top of your nutrition without the headache.

📸 **Snap & Track**
Point your camera at food. That's it. We handle the rest.

🎯 **Your Goals, Your Way**
Whether you're bulking, cutting, or just trying to eat better – we've got you covered.

📊 **See Your Progress**
Beautiful charts that actually make sense. No PhD required.

Let's make healthy eating simple! 🥗`,
    },
    {
      id: generateId(),
      name: 'Bold',
      tone: 'bold',
      appName: appContext.name || 'CalAI',
      subtitle: 'Dominate Your Nutrition',
      oneLiner: 'The only calorie tracker that keeps up with you.',
      description: `Stop guessing. Start winning.

${appContext.name || 'CalAI'} brings military-grade precision to your nutrition tracking. Every macro. Every calorie. Every advantage.

**INSTANT ANALYSIS**
AI that processes your meals faster than you can eat them.

**ZERO EXCUSES**
Track anywhere, anytime. Restaurant? Travel? Late night snack? We've got it covered.

**RESULTS THAT SPEAK**
Our users see measurable changes within 14 days. Your turn.

This isn't just an app. It's your unfair advantage.`,
    },
  ];
  
  return {
    appName: appContext.name || 'CalAI',
    subtitle: variants[0].subtitle,
    oneLiner: variants[0].oneLiner,
    description: variants[0].description,
    whatsNew: `• Improved AI food recognition accuracy\n• New dark mode design\n• Bug fixes and performance improvements`,
    variants,
    activeVariantId: variants[0].id,
  };
}

export async function generateKeywords(
  appContext: { name: string; category: string; description: string }
): Promise<Keyword[]> {
  await randomDelay(500, 900);
  
  const baseKeywords = [
    'calorie counter', 'nutrition tracker', 'diet app', 'macro calculator',
    'food diary', 'weight loss', 'healthy eating', 'meal planner',
    'fitness tracker', 'AI nutrition', 'food scanner', 'diet tracker',
    'calorie tracker', 'nutrition facts', 'health app', 'meal tracker',
    'food log', 'weight tracker', 'carb counter', 'protein tracker',
  ];
  
  const keywords: Keyword[] = [];
  const shuffled = baseKeywords.sort(() => Math.random() - 0.5).slice(0, 12);
  
  for (const text of shuffled) {
    await delay(30);
    
    const isRisky = text.includes('weight loss') || text.includes('diet');
    
    keywords.push({
      id: generateId(),
      text,
      suggested: true,
      risky: isRisky,
      riskReason: isRisky ? 'May trigger additional App Store review' : undefined,
      volume: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
    });
  }
  
  return keywords;
}

export async function runRiskCheck(
  copy: AppStoreCopy,
  keywords: Keyword[],
  mode: 'fast' | 'llm' = 'fast'
): Promise<RiskCheckResult> {
  await randomDelay(mode === 'fast' ? 800 : 2500, mode === 'fast' ? 1500 : 4000);
  
  const findings: RiskFinding[] = [];
  
  // Check all text sources
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
  
  // Check keywords
  for (const keyword of keywords) {
    if (keyword.risky) {
      findings.push({
        id: generateId(),
        category: 'medical',
        severity: 'warning',
        phrase: keyword.text,
        location: 'keywords',
        explanation: 'This keyword may trigger additional App Store scrutiny',
        suggestedRewrite: keyword.text.replace('weight loss', 'wellness').replace('diet', 'nutrition'),
        applied: false,
      });
    }
  }
  
  // LLM mode adds more nuanced findings
  if (mode === 'llm' && findings.length < 3) {
    findings.push({
      id: generateId(),
      category: 'misleading',
      severity: 'warning',
      phrase: 'instantly',
      location: 'description',
      explanation: 'Claims of instant results may be seen as misleading',
      suggestedRewrite: 'quickly',
      applied: false,
    });
  }
  
  // Calculate score
  let score = 0;
  for (const finding of findings) {
    if (finding.severity === 'critical') score += 30;
    else if (finding.severity === 'error') score += 20;
    else if (finding.severity === 'warning') score += 10;
  }
  score = Math.min(score, 100);
  
  // Determine label
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
  // Generate all in parallel with progress updates
  onProgress({ artifact: 'name', message: 'Generating name ideas...', progress: 0 });
  onProgress({ artifact: 'icon', message: 'Creating icon concepts...', progress: 0 });
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
  
  onProgress({ artifact: 'name', message: 'Generated 15 name options', progress: 100 });
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
  
  const newNames = await generateNames({ name: '', category: '', description: '' }, 8, style);
  
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
  
  // Simulate refinement by modifying existing copy
  return {
    ...currentCopy,
    subtitle: modifier ? modifier + currentCopy.subtitle.slice(0, 20) + '...' : currentCopy.subtitle,
  };
}
