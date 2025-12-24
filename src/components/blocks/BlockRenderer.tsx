'use client';

import type { OnboardingBlock } from '@/types';
import AuthBlock from './AuthBlock';
import SurveyBlock from './SurveyBlock';
import PermissionBlock from './PermissionBlock';
import PaywallBlock from './PaywallBlock';
import ValuePropBlock from './ValuePropBlock';

interface BlockRendererProps {
  block: OnboardingBlock;
  isPreview?: boolean;
}

export default function BlockRenderer({ block, isPreview = false }: BlockRendererProps) {
  switch (block.type) {
    case 'auth':
      return <AuthBlock block={block} isPreview={isPreview} />;
    case 'survey':
      return <SurveyBlock block={block} isPreview={isPreview} />;
    case 'permission':
      return <PermissionBlock block={block} isPreview={isPreview} />;
    case 'paywall':
      return <PaywallBlock block={block} isPreview={isPreview} />;
    case 'value-prop':
    case 'splash':
      return <ValuePropBlock block={block} isPreview={isPreview} />;
    default:
      return (
        <div className="w-full h-full flex items-center justify-center text-[var(--color-gray-75)]">
          Unknown block type: {block.type}
        </div>
      );
  }
}

