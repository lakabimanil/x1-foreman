'use client';

import { create } from 'zustand';
import type {
  ServicesStudioStore,
  ServicesStudioState,
  Service,
  ConnectionMethod,
  CostScenario,
  TemplateType,
  VerificationOutcome,
} from '@/types/servicesStudio';
import {
  templates,
  providers,
  agentAssistSteps,
  calculateCostForTemplate,
  generateArtifacts,
} from '@/config/mockServicesConfig';

const STORAGE_KEY = 'x1-services-studio-v3';

// Initial state
const initialState: ServicesStudioState = {
  hasSeenOnboarding: false,
  selectedTemplate: 'livestream', // Default to livestream for this flow
  services: {},
  currentView: 'dashboard',
  activeServiceId: null,
  costScenario: {
    mau: 5000,
    avgUsage: 10,
    concurrency: 5,
  },
  isReadyForBuild: false,
  connectFlow: {
    isOpen: false,
    serviceId: null,
    step: 'choose-method',
    method: null,
    agentSteps: [],
    currentAgentStepIndex: 0,
    billingChoice: null,
    verificationResult: null,
    error: null,
  },
  priorities: {
    speed: true,
    cost: false,
    quality: false,
  },
  comparePanel: {
    isOpen: false,
    serviceId: null,
  },
  artifacts: [],
};

// Helper to save state to localStorage
const saveToStorage = (state: Partial<ServicesStudioState>) => {
  if (typeof window === 'undefined') return;
  
  const toSave = {
    hasSeenOnboarding: state.hasSeenOnboarding,
    selectedTemplate: state.selectedTemplate,
    services: state.services,
    currentView: state.currentView,
    activeServiceId: state.activeServiceId,
    costScenario: state.costScenario,
    isReadyForBuild: state.isReadyForBuild,
    priorities: state.priorities,
    artifacts: state.artifacts,
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

// Helper to load state from localStorage
const loadFromStorage = (): Partial<ServicesStudioState> | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      if (parsed.services) {
        Object.values(parsed.services).forEach((service: unknown) => {
          const s = service as Service;
          if (s.lastVerified) {
            s.lastVerified = new Date(s.lastVerified);
          }
        });
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return null;
};

export const useServicesStudioStore = create<ServicesStudioStore>((set, get) => ({
  ...initialState,

  // Initialization
  initializeFromStorage: () => {
    const saved = loadFromStorage();
    if (saved) {
      set({
        ...saved,
        // Keep transient state at initial values
        connectFlow: initialState.connectFlow,
        comparePanel: initialState.comparePanel,
      });
    }
  },

  completeOnboarding: () => {
    set({ hasSeenOnboarding: true });
    saveToStorage(get());
  },

  // Template selection
  selectTemplate: (templateId: TemplateType) => {
    const template = templates[templateId];
    if (!template) return;

    // Convert services array to record keyed by id
    const servicesRecord: Record<string, Service> = {};
    template.services.forEach((service) => {
      servicesRecord[service.id] = { ...service };
    });

    set({
      selectedTemplate: templateId,
      services: servicesRecord,
      currentView: 'dashboard',
      isReadyForBuild: false,
      artifacts: [],
    });

    saveToStorage(get());
  },

  resetWithConfirm: () => {
    // In a real app, this would show a confirm dialog
    // For prototype, we'll just reset
    set({
      ...initialState,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    
    return true;
  },

  // Navigation
  setCurrentView: (view) => {
    set({ currentView: view });
    saveToStorage(get());
  },

  setActiveService: (serviceId) => {
    set({ activeServiceId: serviceId });
    saveToStorage(get());
  },

  openServiceConfig: (serviceId) => {
    set({ 
      activeServiceId: serviceId,
      currentView: 'service-detail'
    });
    saveToStorage(get());
  },

  returnToDashboard: () => {
    set({ 
      currentView: 'dashboard',
      activeServiceId: null
    });
    saveToStorage(get());
  },

  // Services
  getService: (serviceId) => {
    return get().services[serviceId];
  },

  getSelectedProvider: (serviceId) => {
    const service = get().services[serviceId];
    if (!service) return undefined;
    return providers[service.selectedProviderId];
  },

  swapProvider: (serviceId, providerId) => {
    const service = get().services[serviceId];
    if (!service) return;

    const provider = providers[providerId];
    if (!provider) return;

    set((state) => ({
      services: {
        ...state.services,
        [serviceId]: {
          ...service,
          selectedProviderId: providerId,
          riskLevel: provider.riskLevel,
          // Reset connection status when swapping
          status: 'not-connected',
          environment: null,
          lastVerified: null,
        },
      },
    }));

    saveToStorage(get());
  },

  // Connect flow
  openConnectFlow: (serviceId) => {
    set({
      connectFlow: {
        isOpen: true,
        serviceId,
        step: 'choose-method',
        method: null,
        agentSteps: agentAssistSteps.map((s) => ({ ...s, status: 'pending' })),
        currentAgentStepIndex: 0,
        billingChoice: null,
        verificationResult: null,
        error: null,
      },
    });
  },

  closeConnectFlow: () => {
    set({
      connectFlow: initialState.connectFlow,
    });
  },

  selectConnectionMethod: (method: ConnectionMethod) => {
    const { connectFlow, services } = get();
    const service = services[connectFlow.serviceId || ''];
    const provider = service ? providers[service.selectedProviderId] : null;

    if (method === 'connector' && provider?.hasConnector) {
      // Quick connect simulation
      set((state) => ({
        connectFlow: {
          ...state.connectFlow,
          method,
          step: 'connecting',
        },
      }));

      // Simulate connection delay
      setTimeout(() => {
        set((state) => ({
          services: {
            ...state.services,
            [connectFlow.serviceId!]: {
              ...state.services[connectFlow.serviceId!],
              status: 'connected-sandbox',
              environment: 'sandbox',
            },
          },
          connectFlow: {
            ...state.connectFlow,
            step: 'verify',
          },
        }));
      }, 1500);
    } else if (method === 'api-key') {
      set((state) => ({
        connectFlow: {
          ...state.connectFlow,
          method,
          step: 'connecting',
        },
      }));
    } else if (method === 'agent-assist') {
      // Start agent assist flow
      set((state) => ({
        connectFlow: {
          ...state.connectFlow,
          method,
          step: 'agent-assist',
          agentSteps: agentAssistSteps.map((s, i) => ({
            ...s,
            status: i === 0 ? 'in-progress' : 'pending',
          })),
          currentAgentStepIndex: 0,
        },
      }));

      // Auto-advance first step after delay
      setTimeout(() => {
        get().advanceAgentStep();
      }, 2000);
    }
  },

  advanceAgentStep: () => {
    const { connectFlow } = get();
    const currentIndex = connectFlow.currentAgentStepIndex;
    const steps = connectFlow.agentSteps;

    if (currentIndex >= steps.length - 1) return;

    const currentStep = steps[currentIndex];
    const nextIndex = currentIndex + 1;
    const nextStep = steps[nextIndex];

    // Mark current as completed
    const updatedSteps = steps.map((s, i) => {
      if (i === currentIndex) {
        return { ...s, status: 'completed' as const };
      }
      if (i === nextIndex) {
        // Check if next step needs user action
        if (s.userAction) {
          return { ...s, status: 'waiting-user' as const };
        }
        return { ...s, status: 'in-progress' as const };
      }
      return s;
    });

    set((state) => ({
      connectFlow: {
        ...state.connectFlow,
        agentSteps: updatedSteps,
        currentAgentStepIndex: nextIndex,
      },
    }));

    // If next step doesn't need user action, auto-advance after delay
    if (!nextStep.userAction) {
      setTimeout(() => {
        // Check if we're at the last step
        if (nextIndex >= steps.length - 1) {
          // Complete the agent flow
          set((state) => ({
            connectFlow: {
              ...state.connectFlow,
              agentSteps: state.connectFlow.agentSteps.map((s, i) =>
                i === nextIndex ? { ...s, status: 'completed' as const } : s
              ),
            },
          }));
        } else {
          get().advanceAgentStep();
        }
      }, 1500);
    }
  },

  handleAgentUserAction: (action) => {
    const { connectFlow } = get();
    const steps = connectFlow.agentSteps;
    const currentIndex = connectFlow.currentAgentStepIndex;

    // Mark current step as completed and advance
    const updatedSteps = steps.map((s, i) => {
      if (i === currentIndex) {
        return { ...s, status: 'completed' as const };
      }
      return s;
    });

    set((state) => ({
      connectFlow: {
        ...state.connectFlow,
        agentSteps: updatedSteps,
      },
    }));

    // Continue advancing
    setTimeout(() => {
      get().advanceAgentStep();
    }, 500);
  },

  handleBillingChoice: (choice) => {
    const { connectFlow } = get();
    
    // Mark billing step as completed
    const updatedSteps = connectFlow.agentSteps.map((s) => {
      if (s.id === 'billing') {
        return { ...s, status: 'completed' as const };
      }
      return s;
    });

    // Update service status and environment
    set((state) => ({
      services: {
        ...state.services,
        [connectFlow.serviceId!]: {
          ...state.services[connectFlow.serviceId!],
          status: choice === 'production' ? 'connected-production' : 'connected-sandbox',
          environment: choice,
        },
      },
      connectFlow: {
        ...state.connectFlow,
        billingChoice: choice,
        agentSteps: updatedSteps,
        step: 'verify',
      },
    }));
  },

  runVerification: async () => {
    const { connectFlow, services } = get();
    const service = services[connectFlow.serviceId || ''];
    const provider = service ? providers[service.selectedProviderId] : null;

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const outcome = provider?.defaultVerificationOutcome || 'success';

    let newStatus = service.status;
    let verificationMessage = '';

    if (outcome === 'success') {
      // Status stays the same (connected-sandbox or connected-production)
      verificationMessage = 'Connection verified successfully';
    } else if (outcome === 'partial') {
      newStatus = 'needs-action';
      verificationMessage = 'Missing recording permission. Please enable in provider dashboard.';
    } else if (outcome === 'fail') {
      newStatus = 'error';
      verificationMessage = 'Connection failed. Please check your credentials.';
    }

    set((state) => ({
      services: {
        ...state.services,
        [connectFlow.serviceId!]: {
          ...state.services[connectFlow.serviceId!],
          status: newStatus,
          lastVerified: new Date(),
          verificationMessage,
        },
      },
      connectFlow: {
        ...state.connectFlow,
        verificationResult: outcome,
        step: 'done',
      },
    }));

    saveToStorage(get());
  },

  completeConnection: () => {
    set({
      connectFlow: initialState.connectFlow,
    });
    saveToStorage(get());
  },

  // Cost
  updateCostScenario: (updates) => {
    set((state) => ({
      costScenario: {
        ...state.costScenario,
        ...updates,
      },
    }));
    saveToStorage(get());
  },

  calculateEstimatedCost: () => {
    const { selectedTemplate, costScenario, services } = get();
    if (!selectedTemplate) {
      return { min: 0, max: 0, drivers: [] };
    }
    return calculateCostForTemplate(selectedTemplate, costScenario, services);
  },

  // Compare panel
  openComparePanel: (serviceId) => {
    set({
      comparePanel: {
        isOpen: true,
        serviceId,
      },
    });
  },

  closeComparePanel: () => {
    set({
      comparePanel: {
        isOpen: false,
        serviceId: null,
      },
    });
  },

  // Priorities
  togglePriority: (priority) => {
    set((state) => ({
      priorities: {
        ...state.priorities,
        [priority]: !state.priorities[priority],
      },
    }));
    saveToStorage(get());
  },

  // Build Readiness
  markReadyForBuild: () => {
    const { selectedTemplate, services, costScenario } = get();
    if (!selectedTemplate) return;

    // Generate artifacts for connected services
    const artifacts = generateArtifacts(selectedTemplate, services, costScenario);

    set({
      isReadyForBuild: true,
      artifacts,
    });

    saveToStorage(get());
  },

  unmarkReadyForBuild: () => {
    set({
      isReadyForBuild: false,
      artifacts: [],
    });

    saveToStorage(get());
  },

  // Progress
  getConnectedCount: () => {
    const { services } = get();
    return Object.values(services).filter(
      (s) =>
        s.status === 'connected-sandbox' ||
        s.status === 'connected-production'
    ).length;
  },

  getTotalServicesCount: () => {
    const { services } = get();
    return Object.keys(services).length;
  },

  canProceedToReview: () => {
    const { services } = get();
    const connectedCount = Object.values(services).filter(
      (s) =>
        s.status === 'connected-sandbox' ||
        s.status === 'connected-production'
    ).length;
    return connectedCount >= 1; // At least one service connected
  },
}));
