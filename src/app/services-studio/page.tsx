'use client';

import { useEffect, useState } from 'react';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import ServicesStudioLayout from '@/components/services-studio/ServicesStudioLayout';
import ServicesDashboard from '@/components/services-studio/ServicesDashboard';
import ServiceDetail from '@/components/services-studio/ServiceDetail';
import ComparePanel from '@/components/services-studio/ComparePanel';
import Onboarding from '@/components/services-studio/Onboarding';
import ConnectFlowModal from '@/components/services-studio/ConnectFlowModal';

export default function ServicesStudioPage() {
  const { 
    currentView,
    initializeFromStorage, 
    comparePanel, 
    selectTemplate, 
    hasSeenOnboarding,
    services
  } = useServicesStudioStore();
  
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeFromStorage();
    
    const state = useServicesStudioStore.getState();
    if (!state.selectedTemplate || Object.keys(state.services).length === 0) {
      selectTemplate('livestream');
    }
    
    setIsInitialized(true);
  }, [initializeFromStorage, selectTemplate]);

  // Don't render until services are properly initialized
  if (!isInitialized || Object.keys(services).length === 0) return null;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <ServicesDashboard />;
      case 'service-detail':
        return <ServiceDetail serviceId={useServicesStudioStore.getState().activeServiceId || ''} />;
      default:
        return <ServicesDashboard />;
    }
  };

  return (
    <>
      {!hasSeenOnboarding && <Onboarding />}
      <ServicesStudioLayout>
        {renderCurrentView()}
        {comparePanel.isOpen && <ComparePanel />}
        <ConnectFlowModal />
      </ServicesStudioLayout>
    </>
  );
}
