import ServiceDetailClientPage from '@/components/services-studio/ServiceDetailClientPage';

// Hardcoded list of all possible service IDs from mockServicesConfig.ts
// This is required for 'output: export' to generate static pages for dynamic routes.
export function generateStaticParams() {
  return [
    { serviceId: 'auth' },
    { serviceId: 'live-video' },
    { serviceId: 'payments' },
    { serviceId: 'analytics' },
    { serviceId: 'notifications' },
    { serviceId: 'job-data' },
  ];
}

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { serviceId } = await params;
  return <ServiceDetailClientPage serviceId={serviceId} />;
}
