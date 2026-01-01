'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useServicesStudioStore } from '@/store/useServicesStudioStore';
import ServiceDetail from '@/components/services-studio/ServiceDetail';
import ServicesStudioLayout from '@/components/services-studio/ServicesStudioLayout';
import ComparePanel from '@/components/services-studio/ComparePanel';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.serviceId as string;
  
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
    if (selectedTemplate === null) {
      router.push('/services-studio');
    }
  }, [selectedTemplate, router]);

  const service = getService(serviceId);

  if (!service) {
    return (
      <ServicesStudioLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-neutral-400 text-lg">Service not found</p>
            <button
              onClick={() => router.push('/services-studio')}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Back to Services Studio
            </button>
          </div>
        </div>
      </ServicesStudioLayout>
    );
  }

  return (
    <ServicesStudioLayout>
      <ServiceDetail serviceId={serviceId} />
      {comparePanel.isOpen && <ComparePanel />}
    </ServicesStudioLayout>
  );
}
