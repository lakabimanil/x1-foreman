import ServiceDetailClient from './ServiceDetailClient';

// Required for static export - must be exported before default export
export async function generateStaticParams() {
  // Return empty array since routes are handled client-side
  return [];
}

export default function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  // In Next.js 15+, params is a Promise
  return <ServiceDetailClient serviceId={(params as any).serviceId} />;
}
