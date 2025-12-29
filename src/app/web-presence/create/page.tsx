'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuidedInterview, DocumentCanvas } from '@/components/web-presence';
import { documentTemplates, getTemplate } from '@/config/interviewTemplates';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import type { GeneratedDocument, DocumentSchema } from '@/types/documentBuilder';

type FlowState = 
  | { step: 'select' }
  | { step: 'interview'; templateType: string }
  | { step: 'canvas'; document: GeneratedDocument; schema: DocumentSchema; templateType: string };

function CreateDocumentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateType = searchParams.get('type');
  
  const { saveGeneratedDocument, setPrivacyStatus, setTermsStatus } = useWebPresenceStore();
  
  const [flowState, setFlowState] = useState<FlowState>(() => {
    if (templateType && documentTemplates[templateType]) {
      return { step: 'interview', templateType };
    }
    return { step: 'select' };
  });
  
  // Update flow state when URL params change (handles hydration timing)
  useEffect(() => {
    if (templateType && documentTemplates[templateType] && flowState.step === 'select') {
      setFlowState({ step: 'interview', templateType });
    }
  }, [templateType, flowState.step]);
  
  // Document type selection
  if (flowState.step === 'select') {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3">
              What would you like to create?
            </h1>
            <p className="text-neutral-400">
              Choose a document type and we'll guide you through the process
            </p>
          </div>
          
          <div className="grid gap-4">
            {Object.values(documentTemplates).map((template) => (
              <button
                key={template.type}
                onClick={() => setFlowState({ step: 'interview', templateType: template.type })}
                className="flex items-start gap-4 p-6 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-2xl transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl flex-shrink-0">
                  {template.type === 'privacy-policy' && '🔒'}
                  {template.type === 'terms-of-service' && '📋'}
                  {template.type === 'faq' && '❓'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    {template.description}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    {template.steps.length} steps • ~{template.steps.reduce((acc, s) => acc + s.questions.length, 0)} questions
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => router.push('/web-presence')}
            className="w-full mt-6 py-3 text-neutral-500 hover:text-white transition-colors text-sm"
          >
            ← Back to Web Presence
          </button>
        </div>
      </div>
    );
  }
  
  // Guided Interview
  if (flowState.step === 'interview') {
    const template = getTemplate(flowState.templateType);
    
    if (!template) {
      return (
        <div className="h-screen bg-black flex items-center justify-center">
          <p className="text-red-400">Template not found</p>
        </div>
      );
    }
    
    return (
      <div className="h-screen">
        <GuidedInterview
          template={template}
          initialSchema={{
            appName: 'Cal AI',
            companyName: 'Cal AI Inc.',
            contactEmail: 'privacy@calai.app',
          }}
          onComplete={(schema, document) => {
            // Save the document to the store immediately after interview
            const docType = flowState.templateType as 'privacy-policy' | 'terms-of-service' | 'faq';
            saveGeneratedDocument(docType, document, schema);
            setFlowState({ step: 'canvas', document, schema, templateType: flowState.templateType });
          }}
          onCancel={() => router.push('/web-presence')}
        />
      </div>
    );
  }
  
  // Canvas + Chat Editor
  if (flowState.step === 'canvas') {
    const handleSave = (doc: GeneratedDocument) => {
      // Save the updated document to the store
      const docType = flowState.templateType as 'privacy-policy' | 'terms-of-service' | 'faq';
      saveGeneratedDocument(docType, doc, flowState.schema);
      console.log('Document saved to store');
    };
    
    const handlePublish = () => {
      // Mark the artifact as ready
      if (flowState.templateType === 'privacy-policy') {
        setPrivacyStatus('ready');
      } else if (flowState.templateType === 'terms-of-service') {
        setTermsStatus('ready');
      }
      
      console.log('Document published');
      router.push('/web-presence');
    };
    
    return (
      <div className="h-screen">
        <DocumentCanvas
          document={flowState.document}
          onSave={handleSave}
          onBack={() => router.push('/web-presence')}
          onPublish={handlePublish}
        />
      </div>
    );
  }
  
  return null;
}

export default function CreateDocumentPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <CreateDocumentPageContent />
    </Suspense>
  );
}
