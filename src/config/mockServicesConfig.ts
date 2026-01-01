/**
 * Mock Services Configuration for Services Studio
 * 
 * This file contains all mock data for the Services Studio prototype.
 * 
 * ## How to tweak mock outcomes:
 * 
 * 1. Change verification outcomes:
 *    - Find the provider in `providers` object
 *    - Modify `defaultVerificationOutcome` to: 'success' | 'partial' | 'fail'
 * 
 * 2. Change which providers have quick connectors:
 *    - Modify `hasConnector` boolean on any provider
 * 
 * 3. Add/remove services from templates:
 *    - Modify `livestreamTemplate` or `jobSwipeTemplate` arrays
 * 
 * 4. Adjust cost formulas:
 *    - See `calculateCostForTemplate` function at bottom
 */

import type { Provider, Service, Template, TemplateType, CostScenario } from '@/types/servicesStudio';

// ============================================================================
// PROVIDERS
// ============================================================================

export const providers: Record<string, Provider> = {
  // Video Providers
  'mux': {
    id: 'mux',
    name: 'Mux',
    logo: '🎬',
    hasConnector: true,
    recommended: true,
    defaultVerificationOutcome: 'success',
    costDriverLabel: 'minutes watched',
    riskLevel: 'medium',
    description: 'Developer-first video infrastructure with excellent APIs',
    pros: ['Best-in-class API', 'Automatic quality optimization', 'Built-in analytics'],
    cons: ['Premium pricing', 'Learning curve for advanced features'],
  },
  'aws-ivs': {
    id: 'aws-ivs',
    name: 'AWS IVS',
    logo: '📺',
    hasConnector: false,
    recommended: false,
    defaultVerificationOutcome: 'success',
    costDriverLabel: 'stream hours',
    riskLevel: 'low',
    description: 'Amazon\'s managed live streaming solution',
    pros: ['AWS ecosystem integration', 'Predictable scaling', 'Strong SLA'],
    cons: ['Complex AWS console', 'Less intuitive than alternatives'],
  },
  'agora': {
    id: 'agora',
    name: 'Agora',
    logo: '🔵',
    hasConnector: true,
    recommended: false,
    defaultVerificationOutcome: 'partial',
    costDriverLabel: 'minutes',
    riskLevel: 'medium',
    description: 'Real-time engagement platform for video, voice, and messaging',
    pros: ['Low latency', 'Global edge network', 'Good for interactive features'],
    cons: ['Complex pricing', 'SDK size'],
  },
  'livekit': {
    id: 'livekit',
    name: 'LiveKit',
    logo: '🟢',
    hasConnector: false,
    recommended: false,
    defaultVerificationOutcome: 'success',
    costDriverLabel: 'participant minutes',
    riskLevel: 'low',
    description: 'Open source WebRTC platform for live video',
    pros: ['Open source', 'Self-host option', 'Active community'],
    cons: ['Newer platform', 'Fewer enterprise features'],
  },

  // Auth Providers
  'apple-signin': {
    id: 'apple-signin',
    name: 'Apple Sign-In',
    logo: '🍎',
    hasConnector: true,
    recommended: true,
    defaultVerificationOutcome: 'success',
    costDriverLabel: 'free',
    riskLevel: 'low',
    description: 'Native Apple authentication required for App Store apps',
    pros: ['Required by App Store', 'Users trust it', 'Privacy-focused'],
    cons: ['Apple ecosystem only', 'Limited user data'],
  },

  // Job Data Providers
  'aggregator': {
    id: 'aggregator',
    name: 'Job Aggregator API',
    logo: '📊',
    hasConnector: true,
    recommended: true,
    defaultVerificationOutcome: 'partial',
    costDriverLabel: 'API requests',
    riskLevel: 'high',
    description: 'Aggregates job listings from multiple sources',
    pros: ['Wide coverage', 'Single API', 'Structured data'],
    cons: ['Data freshness varies', 'Compliance considerations', 'Rate limits'],
  },
  'ats-scraping': {
    id: 'ats-scraping',
    name: 'ATS Scraping',
    logo: '🔍',
    hasConnector: false,
    recommended: false,
    defaultVerificationOutcome: 'fail',
    costDriverLabel: 'scrape volume',
    riskLevel: 'high',
    description: 'Direct scraping from applicant tracking systems',
    pros: ['Real-time data', 'Direct source'],
    cons: ['Legal gray area', 'Fragile infrastructure', 'High maintenance'],
  },
  'partnerships': {
    id: 'partnerships',
    name: 'Direct Partnerships',
    logo: '🤝',
    hasConnector: false,
    recommended: false,
    defaultVerificationOutcome: 'success',
    costDriverLabel: 'per agreement',
    riskLevel: 'low',
    description: 'Official data partnerships with job boards',
    pros: ['Legal clarity', 'Reliable data', 'Support included'],
    cons: ['Slower to set up', 'Coverage varies', 'Higher minimum costs'],
  },

  // Analytics Providers
  'firebase': {
    id: 'firebase',
    name: 'Firebase Analytics',
    logo: '🔥',
    hasConnector: true,
    recommended: true,
    defaultVerificationOutcome: 'success',
    costDriverLabel: 'events/month',
    riskLevel: 'low',
    description: 'Google\'s mobile analytics solution',
    pros: ['Free tier generous', 'Google integration', 'Real-time'],
    cons: ['Google dependency', 'Privacy concerns'],
  },
  'posthog': {
    id: 'posthog',
    name: 'PostHog',
    logo: '🦔',
    hasConnector: true,
    recommended: false,
    defaultVerificationOutcome: 'success',
    costDriverLabel: 'events/month',
    riskLevel: 'low',
    description: 'Open source product analytics platform',
    pros: ['Self-host option', 'Session replay', 'Feature flags built-in'],
    cons: ['Newer than alternatives', 'Mobile SDK less mature'],
  },

  // Payment Providers
  'storekit': {
    id: 'storekit',
    name: 'StoreKit',
    logo: '💳',
    hasConnector: true,
    recommended: true,
    defaultVerificationOutcome: 'success',
    costDriverLabel: 'Apple commission',
    riskLevel: 'low',
    description: 'Apple\'s native in-app purchase framework',
    pros: ['Required for IAP', 'Trusted by users', 'Automatic handling'],
    cons: ['30% commission', 'Limited to Apple'],
  },

  // Notification Providers
  'apns': {
    id: 'apns',
    name: 'APNs',
    logo: '🔔',
    hasConnector: true,
    recommended: true,
    defaultVerificationOutcome: 'success',
    costDriverLabel: 'free',
    riskLevel: 'low',
    description: 'Apple Push Notification service',
    pros: ['Native integration', 'Reliable delivery', 'No cost'],
    cons: ['iOS only', 'Certificate management'],
  },
};

// ============================================================================
// SERVICE TEMPLATES
// ============================================================================

const createService = (
  id: string,
  name: string,
  category: 'core' | 'optional',
  selectedProviderId: string,
  providerIds: string[],
  costDriver: string,
  whyPicked: string[],
  whatAffects: string[],
  futureConsiderations: Service['futureConsiderations']
): Service => {
  const availableProviders = providerIds.map(pid => providers[pid]).filter(Boolean);
  const selectedProvider = providers[selectedProviderId];
  
  return {
    id,
    name,
    category,
    selectedProviderId,
    availableProviders,
    status: 'not-connected',
    environment: null,
    lastVerified: null,
    costDriver,
    riskLevel: selectedProvider?.riskLevel || 'medium',
    whyPicked,
    whatAffects,
    futureConsiderations,
  };
};

// Livestream App Template
const livestreamServices: Service[] = [
  createService(
    'auth',
    'Authentication',
    'core',
    'apple-signin',
    ['apple-signin'],
    'Free for all users',
    [
      'Required by App Store for apps with account creation',
      'Users trust Apple\'s privacy-first approach',
      'Frictionless sign-in for iOS users',
    ],
    [
      'User onboarding flow',
      'Account recovery options',
      'Data portability requirements',
    ],
    {
      outgrowProvider: 'Apple Sign-In scales infinitely. Consider adding Google Sign-In if you expand to Android.',
      international: 'Works globally wherever Apple accounts work.',
      adsLater: 'No impact on ad attribution.',
      appStoreQuestions: 'Required. Apple will reject apps that don\'t offer Sign in with Apple.',
    }
  ),
  createService(
    'live-video',
    'Live Video',
    'core',
    'mux',
    ['mux', 'aws-ivs', 'agora', 'livekit'],
    'Minutes watched by viewers',
    [
      'Best developer experience for live streaming',
      'Automatic adaptive bitrate for viewer experience',
      'Built-in moderation tools for UGC content',
    ],
    [
      'Video quality across network conditions',
      'Time-to-live for new streams',
      'Recording and playback capabilities',
    ],
    {
      outgrowProvider: 'Mux scales well but costs grow linearly. Consider negotiating volume discounts above 1M minutes/month.',
      international: 'Mux has global CDN. Consider regional optimization for Asia if that\'s your growth market.',
      adsLater: 'Mux supports ad insertion. Budget 2-3 weeks to integrate.',
      appStoreQuestions: 'Live video apps may face additional review for content moderation policies.',
    }
  ),
  createService(
    'payments',
    'Payments',
    'optional',
    'storekit',
    ['storekit'],
    '30% Apple commission on transactions',
    [
      'Only option for in-app purchases on iOS',
      'Handles all payment infrastructure',
      'Automatic subscription management',
    ],
    [
      'Revenue share with Apple',
      'Subscription pricing strategy',
      'Tipping and creator payouts',
    ],
    {
      outgrowProvider: 'StoreKit is the only option for in-app purchases. For web purchases, consider Stripe.',
      international: 'Apple handles currency conversion and local pricing.',
      adsLater: 'Combining subscriptions with ads is common. Keep ad-free tier for premium subscribers.',
      appStoreQuestions: 'Apple reviews subscription apps carefully. Ensure clear pricing and cancellation.',
    }
  ),
  createService(
    'analytics',
    'Analytics',
    'core',
    'firebase',
    ['firebase', 'posthog'],
    'Events tracked per month',
    [
      'Industry standard for mobile analytics',
      'Free tier handles most early-stage apps',
      'Integrates with Google Ads for attribution',
    ],
    [
      'User behavior tracking accuracy',
      'Funnel analysis capabilities',
      'Real-time vs batch reporting',
    ],
    {
      outgrowProvider: 'Firebase free tier is generous. You\'ll hit limits around 500K MAU.',
      international: 'Works globally. Consider GDPR consent flows for EU users.',
      adsLater: 'Firebase integrates with Google Ads for attribution. Critical for paid UA.',
      appStoreQuestions: 'Disclose analytics in privacy nutrition label.',
    }
  ),
  createService(
    'notifications',
    'Notifications',
    'optional',
    'apns',
    ['apns'],
    'Free (Apple service)',
    [
      'Native iOS push notification service',
      'Reliable delivery with no cost',
      'Required for any push functionality',
    ],
    [
      'Notification permission rates',
      'Engagement timing strategy',
      'Rich notification design',
    ],
    {
      outgrowProvider: 'APNs scales infinitely. Consider adding a notification orchestration layer (OneSignal, Braze) for advanced targeting.',
      international: 'Works globally. Respect local notification preferences and quiet hours.',
      adsLater: 'Push notifications can drive ad engagement. Use sparingly to avoid opt-outs.',
      appStoreQuestions: 'Don\'t use notifications for ads. Apple will reject.',
    }
  ),
];

// Job Swipe App Template
const jobSwipeServices: Service[] = [
  createService(
    'auth',
    'Authentication',
    'core',
    'apple-signin',
    ['apple-signin'],
    'Free for all users',
    [
      'Required by App Store for apps with account creation',
      'Users trust Apple\'s privacy-first approach',
      'Frictionless sign-in for iOS users',
    ],
    [
      'User onboarding flow',
      'Account recovery options',
      'Resume/profile data storage',
    ],
    {
      outgrowProvider: 'Apple Sign-In scales infinitely. Consider adding LinkedIn Sign-In for professional context.',
      international: 'Works globally wherever Apple accounts work.',
      adsLater: 'No impact on ad attribution.',
      appStoreQuestions: 'Required. Apple will reject apps that don\'t offer Sign in with Apple.',
    }
  ),
  createService(
    'job-data',
    'Job Data',
    'core',
    'aggregator',
    ['aggregator', 'ats-scraping', 'partnerships'],
    'API requests per month',
    [
      'Provides access to thousands of job listings',
      'Structured data for matching algorithms',
      'Reasonable compliance posture',
    ],
    [
      'Job listing freshness and accuracy',
      'Geographic coverage',
      'Matching algorithm quality',
    ],
    {
      outgrowProvider: 'Aggregator works to ~50K users. Beyond that, consider direct partnerships for better data quality.',
      international: 'Coverage varies by region. US/EU strong, other regions spotty.',
      adsLater: 'Job data providers often have restrictions on mixing ads with listings. Check ToS.',
      appStoreQuestions: 'Be transparent about data sources. Apple may ask about user data handling.',
    }
  ),
  createService(
    'analytics',
    'Analytics',
    'core',
    'posthog',
    ['posthog', 'firebase'],
    'Events tracked per month',
    [
      'Excellent for understanding swipe behavior',
      'Session replay helps debug UX issues',
      'Self-host option for privacy-sensitive users',
    ],
    [
      'Swipe pattern analysis',
      'Conversion funnel optimization',
      'A/B testing capabilities',
    ],
    {
      outgrowProvider: 'PostHog free tier is generous. Consider upgrading for session replay at scale.',
      international: 'Self-host for EU data residency requirements.',
      adsLater: 'PostHog doesn\'t integrate with ad platforms. May need Firebase for attribution.',
      appStoreQuestions: 'Disclose analytics in privacy nutrition label.',
    }
  ),
  createService(
    'notifications',
    'Notifications',
    'optional',
    'apns',
    ['apns'],
    'Free (Apple service)',
    [
      'Alert users to new matching jobs',
      'Reliable delivery with no cost',
      'Required for any push functionality',
    ],
    [
      'Notification permission rates',
      'Job alert frequency',
      'Personalization quality',
    ],
    {
      outgrowProvider: 'APNs scales infinitely. Consider Braze or Customer.io for job alert orchestration.',
      international: 'Works globally. Respect local notification preferences.',
      adsLater: 'Push notifications can drive engagement. Don\'t spam.',
      appStoreQuestions: 'Don\'t use notifications for ads. Apple will reject.',
    }
  ),
  createService(
    'payments',
    'Payments',
    'optional',
    'storekit',
    ['storekit'],
    '30% Apple commission on transactions',
    [
      'Enable premium features like unlimited swipes',
      'Handles all payment infrastructure',
      'Automatic subscription management',
    ],
    [
      'Revenue share with Apple',
      'Premium feature set',
      'Conversion strategy',
    ],
    {
      outgrowProvider: 'StoreKit is the only option for in-app purchases. For enterprise/B2B, consider web payments.',
      international: 'Apple handles currency conversion and local pricing.',
      adsLater: 'Premium users typically see fewer or no ads.',
      appStoreQuestions: 'Apple reviews subscription apps carefully. Ensure clear value proposition.',
    }
  ),
];

export const templates: Record<TemplateType, Template> = {
  'livestream': {
    id: 'livestream',
    name: 'Livestream App',
    description: 'Build a live video streaming app with real-time viewer interaction',
    icon: '📹',
    services: livestreamServices,
    recommendationReasons: [
      'Optimized for low-latency live video',
      'Built-in moderation for user-generated content',
      'Scalable from 10 to 10,000 concurrent viewers',
    ],
  },
  'job-swipe': {
    id: 'job-swipe',
    name: 'Job Swipe App',
    description: 'Build a Tinder-style job discovery app with swipe mechanics',
    icon: '💼',
    services: jobSwipeServices,
    recommendationReasons: [
      'Comprehensive job data from multiple sources',
      'Analytics optimized for swipe behavior',
      'Privacy-focused with self-host options',
    ],
  },
};

// ============================================================================
// COST CALCULATION
// ============================================================================

/**
 * Calculate estimated monthly cost based on usage scenario
 * 
 * These are simplified formulas for prototype purposes.
 * Real costs would involve more complex tiered pricing.
 */
export function calculateCostForTemplate(
  templateId: TemplateType,
  scenario: CostScenario,
  services: Record<string, Service>
): { min: number; max: number; drivers: string[] } {
  const drivers: string[] = [];
  let min = 0;
  let max = 0;

  if (templateId === 'livestream') {
    // Live Video costs (Mux pricing approximation)
    // ~$0.005 per minute of live video delivered
    const videoMinutes = scenario.mau * scenario.avgUsage * 30; // monthly minutes
    const videoCostMin = videoMinutes * 0.004;
    const videoCostMax = videoMinutes * 0.006;
    min += videoCostMin;
    max += videoCostMax;
    drivers.push(`Live Video: ${(videoMinutes / 1000).toFixed(0)}K minutes watched`);

    // Storage costs for recordings (if applicable)
    const storageCost = scenario.concurrency * 10; // ~$10 per concurrent stream capacity
    min += storageCost * 0.8;
    max += storageCost * 1.2;
    drivers.push(`Concurrent streams: ${scenario.concurrency} capacity`);

    // Analytics (Firebase is free up to limits)
    if (scenario.mau > 50000) {
      min += (scenario.mau - 50000) * 0.001;
      max += (scenario.mau - 50000) * 0.002;
      drivers.push('Analytics: Exceeding free tier');
    }
  } else if (templateId === 'job-swipe') {
    // Job Data API costs
    // ~$0.01 per API request, users make ~10 requests per day
    const apiRequests = scenario.mau * scenario.avgUsage * 30;
    const apiCostMin = apiRequests * 0.008;
    const apiCostMax = apiRequests * 0.015;
    min += apiCostMin;
    max += apiCostMax;
    drivers.push(`Job Data: ${(apiRequests / 1000).toFixed(0)}K requests/month`);

    // Scraping infrastructure (if using that provider)
    if (services['job-data']?.selectedProviderId === 'ats-scraping') {
      const scrapingCost = scenario.concurrency * 50; // infrastructure costs
      min += scrapingCost * 0.8;
      max += scrapingCost * 1.5;
      drivers.push('Scraping infrastructure: Variable costs');
    }

    // Analytics (PostHog)
    if (scenario.mau > 10000) {
      min += (scenario.mau - 10000) * 0.0005;
      max += (scenario.mau - 10000) * 0.001;
      drivers.push('Analytics: PostHog events');
    }
  }

  // Add baseline infrastructure costs
  min += 50; // Minimum baseline
  max += 100;
  
  return {
    min: Math.round(min),
    max: Math.round(max),
    drivers,
  };
}

// ============================================================================
// AGENT ASSIST SIMULATION STEPS
// ============================================================================

export const agentAssistSteps = [
  {
    id: 'create-account',
    label: 'Create account',
    status: 'pending' as const,
  },
  {
    id: 'verify-email',
    label: 'Verify email',
    status: 'pending' as const,
    userAction: {
      type: 'verify-email' as const,
      label: 'I verified my email',
    },
  },
  {
    id: 'complete-2fa',
    label: 'Complete 2FA setup',
    status: 'pending' as const,
    userAction: {
      type: 'complete-2fa' as const,
      label: 'Done with 2FA',
    },
  },
  {
    id: 'find-api-key',
    label: 'Find API key',
    status: 'pending' as const,
  },
  {
    id: 'billing',
    label: 'Billing (optional)',
    status: 'pending' as const,
    userAction: {
      type: 'billing-choice' as const,
      label: 'Choose billing option',
    },
  },
];

// ============================================================================
// RECOMMENDATION COPY VARIATIONS
// ============================================================================

export const recommendationCopy = {
  speed: {
    title: 'Optimized for Speed',
    bullets: [
      'Pre-configured integrations save setup time',
      'Quick connector available for most services',
      'Skip complex manual configurations',
    ],
  },
  cost: {
    title: 'Optimized for Cost',
    bullets: [
      'Free tiers maximize runway',
      'Pay-as-you-grow pricing',
      'No upfront commitments',
    ],
  },
  quality: {
    title: 'Optimized for Quality',
    bullets: [
      'Industry-leading providers',
      'Best-in-class reliability',
      'Premium support options',
    ],
  },
  default: {
    title: 'Balanced Recommendation',
    bullets: [
      'Reliable providers for production use',
      'Reasonable costs for early-stage apps',
      'Easy migration paths if you outgrow',
    ],
  },
};

// ============================================================================
// ARTIFACT TEMPLATES
// ============================================================================

export function generateArtifacts(
  templateId: TemplateType,
  services: Record<string, Service>,
  costScenario: CostScenario
): { id: string; title: string; content: string }[] {
  const template = templates[templateId];
  const connectedServices = Object.values(services).filter(s => 
    s.status === 'connected-sandbox' || s.status === 'connected-production' || s.status === 'locked'
  );

  return [
    {
      id: 'provider-choices',
      title: 'Provider Choices',
      content: connectedServices.map(s => {
        const provider = providers[s.selectedProviderId];
        return `## ${s.name}\n**Provider:** ${provider?.name || 'Unknown'}\n**Status:** ${s.status}\n**Environment:** ${s.environment || 'N/A'}\n`;
      }).join('\n'),
    },
    {
      id: 'service-contract',
      title: 'Service Contract (Intent)',
      content: `# Services Stack for ${template.name}\n\nThis document outlines the intended service integrations for your application.\n\n${connectedServices.map(s => {
        const provider = providers[s.selectedProviderId];
        return `## ${s.name}\n- **Provider:** ${provider?.name}\n- **Purpose:** ${provider?.description}\n- **Cost Driver:** ${provider?.costDriverLabel}`;
      }).join('\n\n')}`,
    },
    {
      id: 'cost-model',
      title: 'Cost Model',
      content: `# Estimated Monthly Costs\n\n**Scenario:**\n- MAU: ${costScenario.mau.toLocaleString()}\n- Avg Usage: ${costScenario.avgUsage}\n- Concurrency: ${costScenario.concurrency}\n\n**Note:** Actual costs may vary based on usage patterns and provider pricing changes.`,
    },
    {
      id: 'risk-notes',
      title: 'Risk Notes',
      content: connectedServices.filter(s => providers[s.selectedProviderId]?.riskLevel !== 'low').map(s => {
        const provider = providers[s.selectedProviderId];
        return `## ${s.name} (${provider?.riskLevel?.toUpperCase()} Risk)\n${s.whyPicked.join('\n')}\n\n**Considerations:**\n${Object.entries(s.futureConsiderations).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`;
      }).join('\n\n') || 'No high-risk services in this stack.',
    },
    {
      id: 'migration-notes',
      title: 'Migration Notes',
      content: connectedServices.map(s => {
        return `## ${s.name}\n${s.futureConsiderations.outgrowProvider}`;
      }).join('\n\n'),
    },
    {
      id: 'app-store-notes',
      title: 'App Store Notes',
      content: connectedServices.map(s => {
        return `## ${s.name}\n${s.futureConsiderations.appStoreQuestions}`;
      }).join('\n\n'),
    },
    {
      id: 'implementation-checklist',
      title: 'Implementation Checklist',
      content: `# Implementation Checklist\n\n${connectedServices.map(s => {
        const provider = providers[s.selectedProviderId];
        return `## ${s.name} (${provider?.name})\n- [ ] Install SDK/Package\n- [ ] Configure credentials\n- [ ] Implement core integration\n- [ ] Test in sandbox\n- [ ] Verify production access\n- [ ] Monitor initial usage`;
      }).join('\n\n')}`,
    },
  ];
}
