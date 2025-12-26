// Branding Module Types

export type ArtifactType = 'assets' | 'name' | 'icon' | 'screenshots' | 'copy' | 'keywords' | 'riskCheck';

// Asset Types
export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'logo' | 'screenshot' | 'background' | 'other';
  url: string; // base64 or URL
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType?: string;
  tags: string[];
  createdAt: Date;
  source: 'uploaded' | 'generated' | 'imported';
  metadata?: {
    originalName?: string;
    prompt?: string; // if AI generated
    style?: string;
  };
}

export interface AssetsArtifact {
  type: 'assets';
  status: ArtifactStatus;
  assets: Asset[];
  selectedAssetId: string | null;
  categories: string[];
}

export type ArtifactStatus = 'generating' | 'draft' | 'locked' | 'needsAttention';

// App Name Types
export interface AppNameOption {
  id: string;
  name: string;
  vibeTags: ('Brandable' | 'Literal' | 'Short' | 'Bold' | 'Premium' | 'Playful' | 'Technical')[];
  scores: {
    memorability: number;
    clarity: number;
    uniqueness: number;
  };
  availability: {
    appStore: 'available' | 'taken' | 'unknown';
    domain: 'available' | 'taken' | 'unknown';
    social: 'available' | 'partial' | 'taken' | 'unknown';
  };
  analysis: string;
  pros: string[];
  cons: string[];
  selected: boolean;
}

// App Icon Types
export interface IconConcept {
  id: string;
  imageUrl: string;
  style: 'minimal' | 'gradient' | 'illustrated' | '3d' | 'flat';
  primaryColor: string;
  secondaryColor: string;
  selected: boolean;
  warnings: IconWarning[];
}

export interface IconWarning {
  type: 'transparency' | 'lowContrast' | 'generic' | 'complexity';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

// Screenshot Types
export interface ScreenshotCard {
  id: string;
  order: number;
  headline: string;
  supportingText: string;
  featureReferenced: string;
  imageUrl?: string;
}

// App Store Copy Types
export interface AppStoreCopy {
  appName: string;
  subtitle: string;
  oneLiner: string;
  description: string;
  whatsNew: string;
  variants: CopyVariant[];
  activeVariantId: string;
}

export interface CopyVariant {
  id: string;
  name: string;
  tone: 'professional' | 'casual' | 'bold' | 'safe';
  appName: string;
  subtitle: string;
  oneLiner: string;
  description: string;
}

// Keywords Types
export interface Keyword {
  id: string;
  text: string;
  suggested: boolean;
  risky: boolean;
  riskReason?: string;
  volume?: 'high' | 'medium' | 'low';
}

// Risk Check Types
export interface RiskCheckResult {
  score: number; // 0-100, lower is better
  label: 'Safe' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical';
  findings: RiskFinding[];
  lastChecked: Date;
}

export interface RiskFinding {
  id: string;
  category: 'medical' | 'financial' | 'privacy' | 'misleading' | 'trademark' | 'restricted';
  severity: 'warning' | 'error' | 'critical';
  phrase: string;
  location: 'name' | 'subtitle' | 'description' | 'keywords';
  explanation: string;
  suggestedRewrite: string;
  applied: boolean;
}

// Artifact State Types
export interface NameArtifact {
  type: 'name';
  status: ArtifactStatus;
  options: AppNameOption[];
  lockedName: AppNameOption | null;
}

export interface IconArtifact {
  type: 'icon';
  status: ArtifactStatus;
  concepts: IconConcept[];
  primaryIcon: IconConcept | null;
}

export interface ScreenshotsArtifact {
  type: 'screenshots';
  status: ArtifactStatus;
  cards: ScreenshotCard[];
  deviceSize: 'iPhone 15 Pro Max' | 'iPhone 15 Pro' | 'iPhone 15' | 'iPad Pro';
}

export interface CopyArtifact {
  type: 'copy';
  status: ArtifactStatus;
  copy: AppStoreCopy;
}

export interface KeywordsArtifact {
  type: 'keywords';
  status: ArtifactStatus;
  keywords: Keyword[];
  maxCharacters: number;
  currentCharacters: number;
}

export interface RiskCheckArtifact {
  type: 'riskCheck';
  status: ArtifactStatus;
  result: RiskCheckResult | null;
  mode: 'fast' | 'llm';
}

export type Artifact = 
  | AssetsArtifact
  | NameArtifact 
  | IconArtifact 
  | ScreenshotsArtifact 
  | CopyArtifact 
  | KeywordsArtifact 
  | RiskCheckArtifact;

// AI Activity Types
export interface AIActivity {
  id: string;
  type: 'generating' | 'analyzing' | 'checking' | 'refining';
  artifact: ArtifactType;
  message: string;
  progress: number; // 0-100
  completed: boolean;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  relatedArtifact?: ArtifactType;
}

// Branding State
export interface BrandingState {
  // App context (from main x1 flow)
  appContext: {
    name: string;
    category: string;
    description: string;
  };
  
  // Artifacts
  artifacts: {
    assets: AssetsArtifact;
    name: NameArtifact;
    icon: IconArtifact;
    screenshots: ScreenshotsArtifact;
    copy: CopyArtifact;
    keywords: KeywordsArtifact;
    riskCheck: RiskCheckArtifact;
  };
  
  // Progress tracking
  progress: {
    completedCount: number;
    totalCount: number;
  };
  
  // Active state
  activeArtifact: ArtifactType;
  
  // AI activity
  activities: AIActivity[];
  isGenerating: boolean;
  
  // Chat
  messages: ChatMessage[];
}

// Artifact metadata for UI
export const artifactMetadata: Record<ArtifactType, {
  label: string;
  icon: string;
  description: string;
}> = {
  assets: {
    label: 'Assets',
    icon: 'FolderOpen',
    description: 'Upload and manage your brand assets',
  },
  name: {
    label: 'App Name',
    icon: 'Type',
    description: 'Your app\'s identity on the App Store',
  },
  icon: {
    label: 'App Icon',
    icon: 'Image',
    description: 'The visual mark that represents your app',
  },
  screenshots: {
    label: 'Screenshots',
    icon: 'Images',
    description: 'Visual stories that convert downloads',
  },
  copy: {
    label: 'App Store Copy',
    icon: 'FileText',
    description: 'Compelling text that sells your app',
  },
  keywords: {
    label: 'Keywords',
    icon: 'Hash',
    description: 'Terms that help users find your app',
  },
  riskCheck: {
    label: 'Risk Check',
    icon: 'Shield',
    description: 'Apple policy compliance review',
  },
};

