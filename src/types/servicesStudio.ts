// Services Studio Types

export type TemplateType = 'livestream' | 'job-swipe';

export type ConnectionStatus = 
  | 'not-connected'
  | 'needs-action'
  | 'connected-sandbox'
  | 'connected-production'
  | 'error'
  | 'locked';

export type RiskLevel = 'low' | 'medium' | 'high';

export type VerificationOutcome = 'success' | 'partial' | 'fail';

export type ConnectionMethod = 'connector' | 'api-key' | 'agent-assist';

export interface Provider {
  id: string;
  name: string;
  logo: string; // Can be an emoji or URL
  hasConnector: boolean;
  recommended: boolean;
  defaultVerificationOutcome: VerificationOutcome;
  costDriverLabel: string;
  riskLevel: RiskLevel;
  description: string;
  pros: string[];
  cons: string[];
}

export interface Service {
  id: string;
  name: string;
  category: 'core' | 'optional';
  selectedProviderId: string;
  availableProviders: Provider[];
  status: ConnectionStatus;
  environment: 'sandbox' | 'production' | null;
  lastVerified: Date | null;
  verificationMessage?: string;
  costDriver: string;
  riskLevel: RiskLevel;
  whyPicked: string[];
  whatAffects: string[];
  futureConsiderations: {
    outgrowProvider: string;
    international: string;
    adsLater: string;
    appStoreQuestions: string;
  };
}

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  services: Service[];
  recommendationReasons: string[];
}

export interface CostScenario {
  mau: number;
  avgUsage: number;
  concurrency: number;
}

export interface StudioStep {
  id: string;
  label: string;
  completed: boolean;
}

export interface AgentAssistStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'waiting-user' | 'completed';
  userAction?: {
    type: 'verify-email' | 'complete-2fa' | 'billing-choice';
    label: string;
  };
}

export interface ConnectFlowState {
  isOpen: boolean;
  serviceId: string | null;
  step: 'choose-method' | 'connecting' | 'agent-assist' | 'verify' | 'done';
  method: ConnectionMethod | null;
  agentSteps: AgentAssistStep[];
  currentAgentStepIndex: number;
  billingChoice: 'sandbox' | 'production' | null;
  verificationResult: VerificationOutcome | null;
  error: string | null;
}

export interface Artifact {
  id: string;
  title: string;
  content: string;
}

export interface ServicesStudioState {
  // Template selection
  selectedTemplate: TemplateType | null;
  
  // Services state (keyed by service id)
  services: Record<string, Service>;
  
  // Onboarding state
  hasSeenOnboarding: boolean;

  // Current view in the studio
  currentView: 'dashboard' | 'service-detail';

  // The service currently being viewed/configured
  activeServiceId: string | null;
  
  // Cost scenario values
  costScenario: CostScenario;
  
  // Stack state (for final "ready for build" confirmation)
  isReadyForBuild: boolean;
  
  // Connect flow modal state
  connectFlow: ConnectFlowState;
  
  // Recommendation priorities
  priorities: {
    speed: boolean;
    cost: boolean;
    quality: boolean;
  };
  
  // Compare panel state
  comparePanel: {
    isOpen: boolean;
    serviceId: string | null;
  };
  
  // Generated artifacts (after lock)
  artifacts: Artifact[];
}

export interface ServicesStudioActions {
  // Initialization
  initializeFromStorage: () => void;
  completeOnboarding: () => void;
  
  // Template
  selectTemplate: (template: TemplateType) => void;
  resetWithConfirm: () => boolean;
  
  // Navigation
  setCurrentView: (view: ServicesStudioState['currentView']) => void;
  setActiveService: (serviceId: string | null) => void;
  openServiceConfig: (serviceId: string) => void;
  returnToDashboard: () => void;
  
  // Services
  getService: (serviceId: string) => Service | undefined;
  getSelectedProvider: (serviceId: string) => Provider | undefined;
  swapProvider: (serviceId: string, providerId: string) => void;
  
  // Connect flow
  openConnectFlow: (serviceId: string) => void;
  closeConnectFlow: () => void;
  selectConnectionMethod: (method: ConnectionMethod) => void;
  advanceAgentStep: () => void;
  handleAgentUserAction: (action: 'verify-email' | 'complete-2fa', value?: string) => void;
  handleBillingChoice: (choice: 'sandbox' | 'production') => void;
  runVerification: () => Promise<void>;
  completeConnection: () => void;
  
  // Cost
  updateCostScenario: (updates: Partial<CostScenario>) => void;
  calculateEstimatedCost: () => { min: number; max: number; drivers: string[] };
  
  // Compare panel
  openComparePanel: (serviceId: string) => void;
  closeComparePanel: () => void;
  
  // Priorities
  togglePriority: (priority: 'speed' | 'cost' | 'quality') => void;
  
  // Build Readiness
  markReadyForBuild: () => void;
  unmarkReadyForBuild: () => void;
  
  // Progress
  getConnectedCount: () => number;
  getTotalServicesCount: () => number;
  canProceedToReview: () => boolean;
}

export type ServicesStudioStore = ServicesStudioState & ServicesStudioActions;
