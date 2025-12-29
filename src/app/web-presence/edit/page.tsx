'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DocumentCanvas } from '@/components/web-presence';
import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import { ArrowLeft } from 'lucide-react';

function EditDocumentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentType = searchParams.get('type') as 'privacy-policy' | 'terms-of-service' | 'faq' | null;
  
  const { generatedDocuments, saveGeneratedDocument, setPrivacyStatus, setTermsStatus } = useWebPresenceStore();
  
  // Get the stored document
  const storedData = documentType ? generatedDocuments[documentType] : undefined;
  
  // If no document type or no stored document, show error
  if (!documentType) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">No document type specified</p>
          <button
            onClick={() => router.push('/web-presence')}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            ← Back to Web Presence
          </button>
        </div>
      </div>
    );
  }
  
  if (!storedData) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">No Document Found</h2>
          <p className="text-neutral-400 mb-4">
            This document hasn't been created yet.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/web-presence')}
            className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => router.push(`/web-presence/create?type=${documentType}`)}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Create {documentType === 'privacy-policy' ? 'Privacy Policy' : documentType === 'terms-of-service' ? 'Terms of Service' : 'Document'}
          </button>
        </div>
      </div>
    );
  }
  
  const handleSave = (updatedDocument: typeof storedData.document) => {
    // Save the updated document back to the store
    saveGeneratedDocument(documentType, updatedDocument, storedData.schema);
    console.log('Document saved:', updatedDocument);
  };
  
  const handlePublish = () => {
    // Mark the artifact as ready
    if (documentType === 'privacy-policy') {
      setPrivacyStatus('ready');
    } else if (documentType === 'terms-of-service') {
      setTermsStatus('ready');
    }
    
    console.log('Document published');
    router.push('/web-presence');
  };
  
  return (
    <div className="h-screen">
      <DocumentCanvas
        document={storedData.document}
        onSave={handleSave}
        onBack={() => router.push('/web-presence')}
        onPublish={handlePublish}
      />
    </div>
  );
}

export default function EditDocumentPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <EditDocumentPageContent />
    </Suspense>
  );
}
