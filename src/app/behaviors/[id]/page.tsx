import BehaviorDetailClient from '@/components/behaviors/BehaviorDetailClient';

// Generate static params for all behavior IDs
export function generateStaticParams() {
  return [
    { id: 'food-recognition-ai' },
    { id: 'meal-support-assistant' },
    { id: 'nutrition-label-extractor' },
    { id: 'user-feedback-classifier' },
    { id: 'onboarding-optimizer' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BehaviorDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <BehaviorDetailClient behaviorId={id} />;
}
