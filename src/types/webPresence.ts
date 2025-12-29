// Web Presence Module Types

export type WebArtifactStatus = 'not_created' | 'draft' | 'ready';

export interface PrivacyPolicyData {
  appName: string;
  companyName: string;
  contactEmail: string;
  effectiveDate: string;
  dataCollected: {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
  }[];
  thirdPartyServices: {
    id: string;
    name: string;
    purpose: string;
    enabled: boolean;
  }[];
  dataRetention: string;
  childrenPrivacy: boolean;
  analyticsEnabled: boolean;
}

export interface TermsData {
  appName: string;
  companyName: string;
  contactEmail: string;
  effectiveDate: string;
  acceptableUse: string[];
  prohibitedContent: string[];
  subscriptionTerms: {
    hasSubscription: boolean;
    refundPolicy: string;
    trialPeriod: string;
  };
  intellectualProperty: string;
  disclaimers: string[];
  governingLaw: string;
}

export interface LandingPageData {
  appName: string;
  tagline: string;
  description: string;
  heroImageUrl: string;
  screenshots: string[];
  appStoreUrl: string;
  showEmailCapture: boolean;
  emailCaptureHeadline: string;
  accentColor: string;
  features: {
    id: string;
    icon: string;
    title: string;
    description: string;
  }[];
  testimonials: {
    id: string;
    quote: string;
    author: string;
    rating: number;
  }[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export interface WebArtifact {
  id: string;
  type: 'privacy-policy' | 'terms' | 'landing-page';
  status: WebArtifactStatus;
  lastUpdated: Date | null;
}

export interface WebPresenceState {
  // Overall module status
  moduleStatus: 'not_started' | 'in_progress' | 'ready';
  
  // Artifacts
  artifacts: {
    privacyPolicy: WebArtifact & { data: PrivacyPolicyData };
    terms: WebArtifact & { data: TermsData };
    landingPage: WebArtifact & { data: LandingPageData };
  };
  
  // Active view
  activeView: 'overview' | 'privacy-policy' | 'terms' | 'landing-page';
  
  // Preview mode
  isPreviewOpen: boolean;
}
