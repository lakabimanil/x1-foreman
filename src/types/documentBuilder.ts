// Generic Document Builder Types
// Works for Privacy Policy, Terms, FAQ, Support pages, etc.

export type DocumentType = 
  | 'privacy-policy' 
  | 'terms-of-service' 
  | 'faq' 
  | 'support' 
  | 'cookie-policy'
  | 'refund-policy'
  | 'community-guidelines';

export type QuestionType = 
  | 'confirm'           // Yes/No confirmation
  | 'select-one'        // Single choice
  | 'select-many'       // Multiple choice
  | 'text'              // Short text input
  | 'text-long'         // Long text input
  | 'conditional';      // Shows based on previous answers

export interface InterviewQuestion {
  id: string;
  type: QuestionType;
  question: string;
  description?: string;
  appleTip?: string;           // Apple-specific guidance
  riskLevel?: 'low' | 'medium' | 'high';
  options?: {
    value: string;
    label: string;
    description?: string;
    riskFlag?: string;         // Warning if selected
  }[];
  defaultValue?: string | string[] | boolean;
  dependsOn?: {                // Conditional logic
    questionId: string;
    value: string | string[] | boolean;
  };
  schemaKey: string;           // Maps to structured schema
}

export interface InterviewStep {
  id: string;
  title: string;
  description: string;
  icon: string;                // Emoji or icon name
  questions: InterviewQuestion[];
}

export interface DocumentTemplate {
  type: DocumentType;
  name: string;
  description: string;
  steps: InterviewStep[];
  generateDocument: (schema: DocumentSchema) => GeneratedDocument;
}

// The structured schema built from interview answers
export interface DocumentSchema {
  // App Info
  appName: string;
  companyName: string;
  contactEmail: string;
  effectiveDate: string;
  
  // Data Collection
  dataTypes: {
    type: string;
    purpose: string;
    retention: string;
    userControl: 'deletable' | 'exportable' | 'opt-out' | 'none';
    isRequired: boolean;
  }[];
  
  // Third Parties
  thirdParties: {
    name: string;
    purpose: string;
    dataShared: string[];
    privacyUrl?: string;
  }[];
  
  // App Features (for context-aware generation)
  features: {
    hasUserGeneratedContent: boolean;
    hasLivestreaming: boolean;
    hasDirectMessaging: boolean;
    hasPublicProfiles: boolean;
    hasInAppPurchases: boolean;
    hasSubscriptions: boolean;
    hasHealthData: boolean;
    usesCamera: boolean;
    usesLocation: boolean;
    usesAnalytics: boolean;
    usesCrashReporting: boolean;
    usesAI: boolean;
  };
  
  // Compliance
  compliance: {
    ageGating: '4+' | '9+' | '12+' | '17+' | 'none';
    gdprCompliant: boolean;
    ccpaCompliant: boolean;
    coppaCompliant: boolean;
    hipaaRelevant: boolean;
  };
  
  // User Controls
  userControls: {
    canDeleteAccount: boolean;
    canExportData: boolean;
    canOptOutAnalytics: boolean;
    canReportContent: boolean;
    canBlockUsers: boolean;
  };
  
  // Moderation (for UGC apps)
  moderation?: {
    level: 'none' | 'basic' | 'advanced';
    hasReportButton: boolean;
    hasBlockMute: boolean;
    contentReviewProcess: string;
    responseTime: string;
  };
  
  // Custom answers (for document-specific questions)
  customAnswers: Record<string, string | string[] | boolean>;
}

// The generated document structure
export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  schemaKeys: string[];        // Which schema fields this section uses
  isRequired: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  appleTags?: string[];        // Tags like "Age Gate", "Data Retention", etc.
}

export interface GeneratedDocument {
  type: DocumentType;
  title: string;
  lastUpdated: string;
  sections: DocumentSection[];
  schema: DocumentSchema;      // Keep schema for conflict detection
}

// Chat message for Canvas + Chat UI
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  diff?: {
    sectionId: string;
    oldContent: string;
    newContent: string;
    applied: boolean;
  };
}

// Interview state
export interface InterviewState {
  documentType: DocumentType | null;
  currentStepIndex: number;
  answers: Record<string, string | string[] | boolean>;
  isComplete: boolean;
  schema: DocumentSchema | null;
}

// Document editor state
export interface DocumentEditorState {
  document: GeneratedDocument | null;
  selectedSectionId: string | null;
  chatMessages: ChatMessage[];
  hasUnsavedChanges: boolean;
  conflicts: {
    sectionId: string;
    message: string;
    schemaKey: string;
  }[];
}
