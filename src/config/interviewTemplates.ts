import type { DocumentTemplate, InterviewStep, DocumentSchema, GeneratedDocument } from '@/types/documentBuilder';

// ============================================
// PRIVACY POLICY INTERVIEW TEMPLATE
// ============================================

const privacyPolicySteps: InterviewStep[] = [
  {
    id: 'app-classification',
    title: 'App Classification',
    description: 'Let\'s understand what your app does',
    icon: '🔍',
    questions: [
      {
        id: 'has-ugc',
        type: 'confirm',
        question: 'Does your app have user-generated content?',
        description: 'Users can post, upload, or share content that others can see',
        appleTip: 'UGC apps require content moderation policies and often need 17+ rating',
        riskLevel: 'high',
        schemaKey: 'features.hasUserGeneratedContent',
      },
      {
        id: 'has-livestream',
        type: 'confirm',
        question: 'Does your app include livestreaming?',
        description: 'Real-time video or audio broadcasting between users',
        appleTip: 'Livestream apps almost always require 17+ rating and robust safety controls',
        riskLevel: 'high',
        dependsOn: { questionId: 'has-ugc', value: true },
        schemaKey: 'features.hasLivestreaming',
      },
      {
        id: 'has-dms',
        type: 'confirm',
        question: 'Can users send direct messages to each other?',
        description: 'Private messaging between users',
        appleTip: 'Apple expects block/mute/report functionality for DMs',
        riskLevel: 'medium',
        schemaKey: 'features.hasDirectMessaging',
      },
      {
        id: 'has-public-profiles',
        type: 'confirm',
        question: 'Do users have public profiles?',
        description: 'Profile information visible to other users',
        schemaKey: 'features.hasPublicProfiles',
      },
      {
        id: 'has-iap',
        type: 'confirm',
        question: 'Does your app include in-app purchases or subscriptions?',
        description: 'Users can buy things or subscribe within the app',
        schemaKey: 'features.hasInAppPurchases',
      },
    ],
  },
  {
    id: 'data-collection',
    title: 'Data Collection',
    description: 'What data does your app collect?',
    icon: '📊',
    questions: [
      {
        id: 'collects-health',
        type: 'confirm',
        question: 'Do you collect health or fitness data?',
        description: 'Weight, calories, exercise, heart rate, sleep, etc.',
        appleTip: 'Health data is considered sensitive. Be explicit about what\'s collected and why.',
        riskLevel: 'medium',
        schemaKey: 'features.hasHealthData',
      },
      {
        id: 'health-data-types',
        type: 'select-many',
        question: 'What health data do you collect?',
        dependsOn: { questionId: 'collects-health', value: true },
        options: [
          { value: 'weight', label: 'Weight', description: 'Body weight measurements' },
          { value: 'calories', label: 'Calories', description: 'Calorie intake or burn' },
          { value: 'exercise', label: 'Exercise', description: 'Workouts, steps, activity' },
          { value: 'heart-rate', label: 'Heart Rate', description: 'Heart rate measurements' },
          { value: 'sleep', label: 'Sleep', description: 'Sleep patterns and duration' },
          { value: 'nutrition', label: 'Nutrition', description: 'Macros, meals, diet' },
        ],
        schemaKey: 'customAnswers.healthDataTypes',
      },
      {
        id: 'uses-camera',
        type: 'confirm',
        question: 'Does your app use the camera?',
        description: 'Taking photos or videos within the app',
        schemaKey: 'features.usesCamera',
      },
      {
        id: 'camera-storage',
        type: 'select-one',
        question: 'Are photos/videos stored on your servers?',
        dependsOn: { questionId: 'uses-camera', value: true },
        appleTip: 'If images are stored, you must disclose this in App Store privacy labels',
        options: [
          { value: 'stored-permanently', label: 'Yes, stored permanently', riskFlag: 'Requires clear data retention policy' },
          { value: 'stored-temporary', label: 'Yes, stored temporarily', description: 'Deleted after processing' },
          { value: 'not-stored', label: 'No, processed and discarded', description: 'Never leaves device or deleted immediately' },
          { value: 'user-choice', label: 'User can choose', description: 'Optional cloud backup' },
        ],
        schemaKey: 'customAnswers.cameraStorage',
      },
      {
        id: 'uses-location',
        type: 'confirm',
        question: 'Does your app use location data?',
        description: 'GPS, city, or approximate location',
        schemaKey: 'features.usesLocation',
      },
      {
        id: 'uses-analytics',
        type: 'confirm',
        question: 'Do you use analytics or crash reporting?',
        description: 'Mixpanel, Amplitude, Firebase, Sentry, etc.',
        schemaKey: 'features.usesAnalytics',
      },
    ],
  },
  {
    id: 'third-parties',
    title: 'Third-Party Services',
    description: 'What services does your app integrate with?',
    icon: '🔗',
    questions: [
      {
        id: 'third-party-services',
        type: 'select-many',
        question: 'Select the third-party services you use:',
        options: [
          { value: 'apple-healthkit', label: 'Apple HealthKit', description: 'Sync health and fitness data' },
          { value: 'apple-sign-in', label: 'Sign in with Apple', description: 'Apple authentication' },
          { value: 'google-sign-in', label: 'Sign in with Google', description: 'Google authentication' },
          { value: 'stripe', label: 'Stripe', description: 'Payment processing' },
          { value: 'revenuecat', label: 'RevenueCat', description: 'Subscription management' },
          { value: 'mixpanel', label: 'Mixpanel', description: 'Product analytics' },
          { value: 'amplitude', label: 'Amplitude', description: 'Product analytics' },
          { value: 'firebase', label: 'Firebase', description: 'Analytics, auth, database' },
          { value: 'sentry', label: 'Sentry', description: 'Crash reporting' },
          { value: 'openai', label: 'OpenAI API', description: 'AI/ML features' },
          { value: 'cloudflare', label: 'Cloudflare', description: 'CDN and security' },
          { value: 'aws', label: 'AWS', description: 'Cloud infrastructure' },
        ],
        schemaKey: 'customAnswers.thirdPartyServices',
      },
      {
        id: 'shares-data-advertising',
        type: 'confirm',
        question: 'Do you share user data for advertising purposes?',
        description: 'Ad networks, retargeting, etc.',
        appleTip: 'If yes, you must ask for App Tracking Transparency permission',
        riskLevel: 'high',
        schemaKey: 'customAnswers.sharesDataAdvertising',
      },
    ],
  },
  {
    id: 'user-controls',
    title: 'User Controls',
    description: 'What controls do users have over their data?',
    icon: '⚙️',
    questions: [
      {
        id: 'can-delete-account',
        type: 'confirm',
        question: 'Can users delete their account?',
        description: 'Full account deletion, not just deactivation',
        appleTip: 'Apple REQUIRES account deletion for apps with account creation (as of 2022)',
        riskLevel: 'high',
        defaultValue: true,
        schemaKey: 'userControls.canDeleteAccount',
      },
      {
        id: 'can-export-data',
        type: 'confirm',
        question: 'Can users export their data?',
        description: 'Download a copy of their data',
        appleTip: 'Required for GDPR compliance if you have EU users',
        schemaKey: 'userControls.canExportData',
      },
      {
        id: 'data-retention',
        type: 'select-one',
        question: 'How long do you retain user data after account deletion?',
        options: [
          { value: 'immediate', label: 'Deleted immediately', description: 'No retention after deletion' },
          { value: '30-days', label: '30 days', description: 'Grace period for recovery' },
          { value: '90-days', label: '90 days', description: 'Standard retention period' },
          { value: '1-year', label: '1 year', description: 'Extended retention' },
          { value: '2-years', label: '2 years', description: 'Long-term retention' },
        ],
        schemaKey: 'customAnswers.dataRetention',
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance & Age Rating',
    description: 'Legal requirements and age restrictions',
    icon: '🛡️',
    questions: [
      {
        id: 'age-rating',
        type: 'select-one',
        question: 'What age rating is appropriate for your app?',
        appleTip: 'UGC and social apps typically require 12+ or 17+',
        options: [
          { value: '4+', label: '4+ (Everyone)', description: 'No objectionable content' },
          { value: '9+', label: '9+', description: 'Mild cartoon violence, mild language' },
          { value: '12+', label: '12+', description: 'Infrequent mature themes, simulated gambling' },
          { value: '17+', label: '17+ (Mature)', description: 'Frequent mature themes, UGC, dating' },
        ],
        schemaKey: 'compliance.ageGating',
      },
      {
        id: 'targets-children',
        type: 'confirm',
        question: 'Is your app designed for or likely to attract children under 13?',
        appleTip: 'If yes, you must comply with COPPA (Children\'s Online Privacy Protection Act)',
        riskLevel: 'high',
        schemaKey: 'compliance.coppaCompliant',
      },
      {
        id: 'has-eu-users',
        type: 'confirm',
        question: 'Will your app be available to users in the EU?',
        description: 'European Union users have GDPR rights',
        schemaKey: 'compliance.gdprCompliant',
      },
    ],
  },
];

// Generate Privacy Policy document from schema
function generatePrivacyPolicy(schema: DocumentSchema): GeneratedDocument {
  const sections: GeneratedDocument['sections'] = [];
  
  // Introduction
  sections.push({
    id: 'introduction',
    title: 'Introduction',
    content: `${schema.companyName} ("we," "us," or "our") operates the ${schema.appName} mobile application (the "App"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our App.`,
    schemaKeys: ['appName', 'companyName'],
    isRequired: true,
  });
  
  // Information We Collect
  const dataTypesContent = schema.dataTypes.length > 0
    ? schema.dataTypes.map(d => `• **${d.type}**: ${d.purpose}`).join('\n')
    : '• Basic account information (email, username)';
  
  sections.push({
    id: 'data-collection',
    title: 'Information We Collect',
    content: `We may collect the following types of information:\n\n${dataTypesContent}`,
    schemaKeys: ['dataTypes'],
    isRequired: true,
    appleTags: schema.features.hasHealthData ? ['Health Data', 'Sensitive'] : undefined,
  });
  
  // Camera/Photos (if applicable)
  if (schema.features.usesCamera) {
    const storagePolicy = schema.customAnswers.cameraStorage as string;
    let cameraContent = 'Our App uses your device camera to ';
    
    if (schema.features.hasHealthData) {
      cameraContent += 'scan and analyze food for calorie tracking. ';
    } else {
      cameraContent += 'capture photos and videos. ';
    }
    
    if (storagePolicy === 'stored-permanently') {
      cameraContent += 'Images are stored on our servers and retained as part of your account data.';
    } else if (storagePolicy === 'stored-temporary') {
      cameraContent += 'Images are temporarily processed on our servers and deleted after analysis.';
    } else if (storagePolicy === 'not-stored') {
      cameraContent += 'Images are processed locally on your device and are not stored on our servers.';
    } else {
      cameraContent += 'You can choose whether to store images in the cloud or keep them on your device only.';
    }
    
    sections.push({
      id: 'camera-usage',
      title: 'Camera and Photos',
      content: cameraContent,
      schemaKeys: ['features.usesCamera', 'customAnswers.cameraStorage'],
      isRequired: true,
      appleTags: ['Camera', 'Photos'],
    });
  }
  
  // Third-Party Services
  if (schema.thirdParties.length > 0) {
    const thirdPartyContent = schema.thirdParties
      .map(tp => `• **${tp.name}**: ${tp.purpose}`)
      .join('\n');
    
    sections.push({
      id: 'third-parties',
      title: 'Third-Party Services',
      content: `We use the following third-party services:\n\n${thirdPartyContent}\n\nEach of these services has their own privacy policy governing their use of your data.`,
      schemaKeys: ['thirdParties'],
      isRequired: true,
      appleTags: ['Third-Party'],
    });
  }
  
  // Data Retention
  const retention = schema.customAnswers.dataRetention as string || '90-days';
  const retentionMap: Record<string, string> = {
    'immediate': 'immediately upon account deletion',
    '30-days': '30 days after account deletion',
    '90-days': '90 days after account deletion',
    '1-year': '1 year after account deletion',
    '2-years': '2 years after account deletion',
  };
  
  sections.push({
    id: 'data-retention',
    title: 'Data Retention',
    content: `We retain your personal data for as long as your account is active. After account deletion, your data is deleted ${retentionMap[retention] || 'within 90 days'}, except where we are required to retain it for legal or regulatory purposes.`,
    schemaKeys: ['customAnswers.dataRetention'],
    isRequired: true,
    appleTags: ['Data Retention'],
  });
  
  // User Rights
  const rightsContent = [];
  if (schema.userControls.canDeleteAccount) {
    rightsContent.push('• **Delete your account**: You can permanently delete your account and all associated data from within the App settings.');
  }
  if (schema.userControls.canExportData) {
    rightsContent.push('• **Export your data**: You can request a copy of your personal data in a portable format.');
  }
  if (schema.userControls.canOptOutAnalytics) {
    rightsContent.push('• **Opt out of analytics**: You can disable analytics collection in the App settings.');
  }
  
  sections.push({
    id: 'user-rights',
    title: 'Your Rights',
    content: `You have the following rights regarding your personal data:\n\n${rightsContent.join('\n')}\n\nTo exercise any of these rights, please contact us at ${schema.contactEmail}.`,
    schemaKeys: ['userControls', 'contactEmail'],
    isRequired: true,
    appleTags: schema.userControls.canDeleteAccount ? ['Account Deletion'] : undefined,
  });
  
  // Children's Privacy (if applicable)
  if (schema.compliance.coppaCompliant) {
    sections.push({
      id: 'children-privacy',
      title: 'Children\'s Privacy',
      content: `Our App is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at ${schema.contactEmail} so we can delete such information.`,
      schemaKeys: ['compliance.coppaCompliant', 'contactEmail'],
      isRequired: true,
      riskLevel: 'high',
      appleTags: ['COPPA', 'Children'],
    });
  }
  
  // Contact
  sections.push({
    id: 'contact',
    title: 'Contact Us',
    content: `If you have questions about this Privacy Policy, please contact us at:\n\n**Email**: ${schema.contactEmail}\n**Company**: ${schema.companyName}`,
    schemaKeys: ['contactEmail', 'companyName'],
    isRequired: true,
  });
  
  return {
    type: 'privacy-policy',
    title: `${schema.appName} Privacy Policy`,
    lastUpdated: new Date().toISOString(),
    sections,
    schema,
  };
}

export const privacyPolicyTemplate: DocumentTemplate = {
  type: 'privacy-policy',
  name: 'Privacy Policy',
  description: 'Required by Apple for App Store submission',
  steps: privacyPolicySteps,
  generateDocument: generatePrivacyPolicy,
};

// ============================================
// TERMS OF SERVICE INTERVIEW TEMPLATE
// ============================================

const termsOfServiceSteps: InterviewStep[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Let\'s set up your Terms of Service',
    icon: '📋',
    questions: [
      {
        id: 'governing-law',
        type: 'text',
        question: 'What jurisdiction governs these terms?',
        description: 'Usually your company\'s state/country',
        defaultValue: 'State of California, United States',
        schemaKey: 'customAnswers.governingLaw',
      },
    ],
  },
  {
    id: 'user-conduct',
    title: 'User Conduct',
    description: 'Define acceptable and prohibited behavior',
    icon: '⚖️',
    questions: [
      {
        id: 'prohibited-content',
        type: 'select-many',
        question: 'What content is prohibited?',
        options: [
          { value: 'illegal', label: 'Illegal content', description: 'Content that violates laws' },
          { value: 'harassment', label: 'Harassment', description: 'Bullying, threats, hate speech' },
          { value: 'spam', label: 'Spam', description: 'Unsolicited promotions' },
          { value: 'impersonation', label: 'Impersonation', description: 'Pretending to be someone else' },
          { value: 'malware', label: 'Malware', description: 'Viruses, harmful code' },
          { value: 'adult', label: 'Adult content', description: 'Explicit sexual content' },
          { value: 'violence', label: 'Violence', description: 'Graphic violence or gore' },
        ],
        schemaKey: 'customAnswers.prohibitedContent',
      },
    ],
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    description: 'Define subscription terms if applicable',
    icon: '💳',
    questions: [
      {
        id: 'has-subscriptions',
        type: 'confirm',
        question: 'Does your app have paid subscriptions?',
        schemaKey: 'features.hasSubscriptions',
      },
      {
        id: 'trial-period',
        type: 'text',
        question: 'What is your free trial period?',
        dependsOn: { questionId: 'has-subscriptions', value: true },
        defaultValue: '7-day free trial',
        schemaKey: 'customAnswers.trialPeriod',
      },
      {
        id: 'refund-policy',
        type: 'text-long',
        question: 'What is your refund policy?',
        dependsOn: { questionId: 'has-subscriptions', value: true },
        defaultValue: 'Refunds are handled through Apple App Store policies. Contact support for assistance.',
        schemaKey: 'customAnswers.refundPolicy',
      },
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    description: 'Add necessary legal disclaimers',
    icon: '⚠️',
    questions: [
      {
        id: 'health-disclaimer',
        type: 'confirm',
        question: 'Add health/fitness disclaimer?',
        description: 'Recommended if your app provides health-related information',
        appleTip: 'Health apps should clarify they don\'t provide medical advice',
        schemaKey: 'customAnswers.hasHealthDisclaimer',
      },
      {
        id: 'ai-disclaimer',
        type: 'confirm',
        question: 'Add AI/accuracy disclaimer?',
        description: 'Recommended if your app uses AI for estimates or predictions',
        schemaKey: 'customAnswers.hasAIDisclaimer',
      },
    ],
  },
];

function generateTermsOfService(schema: DocumentSchema): GeneratedDocument {
  const sections: GeneratedDocument['sections'] = [];
  
  sections.push({
    id: 'agreement',
    title: 'Agreement to Terms',
    content: `By accessing or using ${schema.appName}, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access the application.`,
    schemaKeys: ['appName'],
    isRequired: true,
  });
  
  // Add more sections based on schema...
  
  sections.push({
    id: 'contact',
    title: 'Contact Us',
    content: `For questions about these Terms, please contact: ${schema.contactEmail}`,
    schemaKeys: ['contactEmail'],
    isRequired: true,
  });
  
  return {
    type: 'terms-of-service',
    title: `${schema.appName} Terms of Service`,
    lastUpdated: new Date().toISOString(),
    sections,
    schema,
  };
}

export const termsOfServiceTemplate: DocumentTemplate = {
  type: 'terms-of-service',
  name: 'Terms of Service',
  description: 'Recommended for all apps, required for apps with user accounts',
  steps: termsOfServiceSteps,
  generateDocument: generateTermsOfService,
};

// ============================================
// FAQ TEMPLATE
// ============================================

const faqSteps: InterviewStep[] = [
  {
    id: 'app-basics',
    title: 'App Basics',
    description: 'Common questions about your app',
    icon: '❓',
    questions: [
      {
        id: 'app-purpose',
        type: 'text-long',
        question: 'What does your app do in one sentence?',
        schemaKey: 'customAnswers.appPurpose',
      },
      {
        id: 'is-free',
        type: 'confirm',
        question: 'Is your app free to download?',
        schemaKey: 'customAnswers.isFree',
      },
    ],
  },
];

function generateFAQ(schema: DocumentSchema): GeneratedDocument {
  return {
    type: 'faq',
    title: `${schema.appName} FAQ`,
    lastUpdated: new Date().toISOString(),
    sections: [
      {
        id: 'what-is',
        title: `What is ${schema.appName}?`,
        content: schema.customAnswers.appPurpose as string || `${schema.appName} is a mobile application.`,
        schemaKeys: ['appName', 'customAnswers.appPurpose'],
        isRequired: true,
      },
    ],
    schema,
  };
}

export const faqTemplate: DocumentTemplate = {
  type: 'faq',
  name: 'FAQ',
  description: 'Frequently asked questions for your users',
  steps: faqSteps,
  generateDocument: generateFAQ,
};

// Export all templates
export const documentTemplates: Record<string, DocumentTemplate> = {
  'privacy-policy': privacyPolicyTemplate,
  'terms-of-service': termsOfServiceTemplate,
  'faq': faqTemplate,
};

export function getTemplate(type: string): DocumentTemplate | undefined {
  return documentTemplates[type];
}
