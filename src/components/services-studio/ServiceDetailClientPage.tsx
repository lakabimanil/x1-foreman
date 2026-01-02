'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import ServiceDetail from '@/components/services-studio/ServiceDetail';
import ServicesStudioLayout from '@/components/services-studio/ServicesStudioLayout';
import ComparePanel from '@/components/services-studio/ComparePanel';

interface ServiceDetailClientPageProps {
  serviceId: string;
}

export default function ServiceDetailClientPage({ serviceId }: ServiceDetailClientPageProps) {
  const router = useRouter();
  
  const { 
    getService, 
    initializeFromStorage, 
    selectedTemplate,
    comparePanel,
  } = useServicesStudioStore();

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    // Redirect to main page if no template selected
    if (selectedTemplate === null) {
      router.push('/services-studio');
    }
  }, [selectedTemplate, router]);

  const service = getService(serviceId);

  // We can't really validate 'service' here during SSG or initial load easily 
  // because store is client-side. We rely on the store hydration.
  // But we can show a loader or fallback if needed.
  // For now, we will render the layout and let ServiceDetail handle the "not found" or loading state internally if possible,
  // or just show the layout.

  // Note: getService depends on the store being initialized. 
  // If we are checking !service immediately, it might be false positive before hydration.
  // However, useServicesStudioStore uses 'persist' middleware which hydrates synchronously in some versions 
  // or asynchronously in others. 
  
  // Let's assume for now that if we are on this page, we expect the service to exist in the template.
  
  return (
    <ServicesStudioLayout>
      <ServiceDetail serviceId={serviceId} />
      {comparePanel.isOpen && <ComparePanel />}
    </ServicesStudioLayout>
  );
}
