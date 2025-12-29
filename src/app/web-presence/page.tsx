'use client';

import { useWebPresenceStore } from '@/store/useWebPresenceStore';
import { WebPresenceOverview } from '@/components/web-presence/WebPresenceOverview';
import { PrivacyPolicyEditor } from '@/components/web-presence/PrivacyPolicyEditor';
import { TermsEditor } from '@/components/web-presence/TermsEditor';
import { LandingPageBuilder } from '@/components/web-presence/LandingPageBuilder';
import { AdminDashboard } from '@/components/web-presence/AdminDashboard';
import { WebPresenceSidebar } from '@/components/web-presence/WebPresenceSidebar';

export default function WebPresencePage() {
  const { activeView } = useWebPresenceStore();
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <WebPresenceOverview />;
      case 'privacy-policy':
        return <PrivacyPolicyEditor />;
      case 'terms':
        return <TermsEditor />;
      case 'landing-page':
        return <LandingPageBuilder />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <WebPresenceOverview />;
    }
  };
  
  return (
    <main className="h-screen w-screen flex overflow-hidden bg-black">
      {/* Left Sidebar */}
      <WebPresenceSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderActiveView()}
      </div>
    </main>
  );
}
