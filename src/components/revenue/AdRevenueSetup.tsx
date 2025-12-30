'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Plus, Trash2, DollarSign, Clock, Info, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { 
  Offer, 
  AdConfig, 
  AdNetwork, 
  AdPlacement, 
  AdPlacementConfig,
  AD_NETWORK_LABELS,
  AD_PLACEMENT_LABELS 
} from '@/types/revenue';

const AD_NETWORKS: { id: AdNetwork; name: string; avgECPM: number; logo: string }[] = [
  { id: 'admob', name: 'Google AdMob', avgECPM: 2.50, logo: '🔵' },
  { id: 'meta', name: 'Meta Audience Network', avgECPM: 3.00, logo: '🟦' },
  { id: 'applovin', name: 'AppLovin MAX', avgECPM: 4.00, logo: '🟠' },
  { id: 'unity', name: 'Unity Ads', avgECPM: 2.00, logo: '⬛' },
  { id: 'ironsource', name: 'ironSource', avgECPM: 3.50, logo: '🟣' },
];

const AD_PLACEMENTS: { type: AdPlacement; name: string; description: string; icon: string; recommendedFor: string }[] = [
  { type: 'banner', name: 'Banner', description: 'Small persistent ad at top/bottom', icon: '📏', recommendedFor: 'Constant passive revenue' },
  { type: 'interstitial', name: 'Interstitial', description: 'Full-screen ad between content', icon: '📱', recommendedFor: 'Natural breaks' },
  { type: 'rewarded', name: 'Rewarded Video', description: 'User watches ad for reward', icon: '🎁', recommendedFor: 'In-app currency' },
  { type: 'native', name: 'Native', description: 'Blends with feed content', icon: '📰', recommendedFor: 'Content feeds' },
  { type: 'pre-roll', name: 'Pre-roll', description: 'Before video/stream starts', icon: '▶️', recommendedFor: 'Video content' },
  { type: 'mid-roll', name: 'Mid-roll', description: 'During video/stream', icon: '⏸️', recommendedFor: 'Long-form content' },
];

const defaultAdConfig: AdConfig = {
  enabled: false,
  networks: ['admob'],
  primaryNetwork: 'admob',
  placements: [],
  creatorShare: 55,
  platformShare: 45,
  adFrequency: {
    minSecondsBetweenAds: 300,
    maxAdsPerHour: 4,
    maxAdsPerSession: 10,
  },
  estimatedECPM: 2.50,
};

interface Props {
  offer: Offer;
}

export default function AdRevenueSetup({ offer }: Props) {
  const { updateAdConfig } = useRevenueStore();
  const [expandedSection, setExpandedSection] = useState<'networks' | 'placements' | 'frequency' | 'revenue' | null>('networks');
  const [addingPlacement, setAddingPlacement] = useState(false);
  
  const config = offer.adConfig || defaultAdConfig;
  
  const updateConfig = (updates: Partial<AdConfig>) => {
    updateAdConfig(offer.id, { ...config, ...updates });
  };
  
  const toggleNetwork = (networkId: AdNetwork) => {
    const isEnabled = config.networks.includes(networkId);
    const newNetworks = isEnabled
      ? config.networks.filter(n => n !== networkId)
      : [...config.networks, networkId];
    
    // Update primary if removed
    let newPrimary = config.primaryNetwork;
    if (isEnabled && networkId === config.primaryNetwork && newNetworks.length > 0) {
      newPrimary = newNetworks[0];
    }
    
    // Calculate new estimated eCPM
    const avgECPM = newNetworks.length > 0
      ? newNetworks.reduce((sum, n) => sum + (AD_NETWORKS.find(an => an.id === n)?.avgECPM || 0), 0) / newNetworks.length
      : 0;
    
    updateConfig({ 
      networks: newNetworks, 
      primaryNetwork: newNetworks.includes(newPrimary) ? newPrimary : newNetworks[0],
      estimatedECPM: avgECPM,
    });
  };
  
  const setPrimaryNetwork = (networkId: AdNetwork) => {
    if (config.networks.includes(networkId)) {
      updateConfig({ primaryNetwork: networkId });
    }
  };
  
  const addPlacement = (type: AdPlacement) => {
    const newPlacement: AdPlacementConfig = {
      id: `placement-${Date.now()}`,
      type,
      location: getDefaultLocation(type),
      enabled: true,
      skipAfterSeconds: type === 'pre-roll' || type === 'mid-roll' ? 5 : undefined,
      rewardAmount: type === 'rewarded' ? 100 : undefined,
      rewardType: type === 'rewarded' ? 'coins' : undefined,
    };
    
    updateConfig({ placements: [...config.placements, newPlacement] });
    setAddingPlacement(false);
  };
  
  const updatePlacement = (placementId: string, updates: Partial<AdPlacementConfig>) => {
    updateConfig({
      placements: config.placements.map(p => 
        p.id === placementId ? { ...p, ...updates } : p
      ),
    });
  };
  
  const removePlacement = (placementId: string) => {
    updateConfig({
      placements: config.placements.filter(p => p.id !== placementId),
    });
  };
  
  const updateFrequency = (updates: Partial<AdConfig['adFrequency']>) => {
    updateConfig({ adFrequency: { ...config.adFrequency, ...updates } });
  };
  
  // Estimate daily revenue
  const estimateDailyRevenue = () => {
    if (!config.enabled || config.placements.length === 0) return 0;
    
    // Rough estimate: 1000 DAU * eCPM * placements * impressions per user
    const impressionsPerUser = config.adFrequency.maxAdsPerSession * 0.5; // Assume 50% fill
    const dailyImpressions = 1000 * impressionsPerUser;
    return (dailyImpressions / 1000) * config.estimatedECPM;
  };
  
  return (
    <div className="space-y-6">
      {/* Main toggle */}
      <div className="p-4 rounded-xl bg-gray-150 border border-gray-125 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            config.enabled ? 'bg-accent-green/20' : 'bg-gray-125'
          }`}>
            <Tv className={`w-5 h-5 ${config.enabled ? 'text-accent-green' : 'text-gray-75'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Ad Revenue</p>
            <p className="text-xs text-gray-75">Monetize with ads shared with creators</p>
          </div>
        </div>
        <button
          onClick={() => updateConfig({ enabled: !config.enabled })}
          className={`w-12 h-7 rounded-full transition-colors ${
            config.enabled ? 'bg-accent-green' : 'bg-gray-125'
          }`}
        >
          <motion.div
            animate={{ x: config.enabled ? 22 : 2 }}
            className="w-5 h-5 rounded-full bg-white"
          />
        </button>
      </div>
      
      {config.enabled && (
        <>
          {/* Revenue estimate */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-accent-green/10 to-accent-blue/10 border border-accent-green/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-100 mb-1">Estimated Daily Revenue (1K DAU)</p>
                <p className="text-2xl font-bold text-white">${estimateDailyRevenue().toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-100 mb-1">Avg eCPM</p>
                <p className="text-lg font-medium text-accent-green">${config.estimatedECPM.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Ad Networks Section */}
          <SectionCard
            icon={<div className="text-lg">🌐</div>}
            title="Ad Networks"
            description="Select which networks to use (mediation)"
            expanded={expandedSection === 'networks'}
            onToggle={() => setExpandedSection(expandedSection === 'networks' ? null : 'networks')}
          >
            <div className="space-y-3">
              {AD_NETWORKS.map((network) => {
                const isEnabled = config.networks.includes(network.id);
                const isPrimary = config.primaryNetwork === network.id;
                
                return (
                  <div
                    key={network.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isEnabled
                        ? 'bg-gray-150 border-gray-100'
                        : 'bg-gray-175 border-gray-125 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleNetwork(network.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isEnabled
                            ? 'bg-accent-green border-accent-green'
                            : 'border-gray-100'
                        }`}
                      >
                        {isEnabled && <Check className="w-3 h-3 text-white" />}
                      </button>
                      
                      <span className="text-xl">{network.logo}</span>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{network.name}</p>
                        <p className="text-xs text-gray-75">Avg eCPM: ${network.avgECPM.toFixed(2)}</p>
                      </div>
                      
                      {isEnabled && (
                        <button
                          onClick={() => setPrimaryNetwork(network.id)}
                          className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                            isPrimary
                              ? 'bg-accent-purple/20 text-accent-purple'
                              : 'bg-gray-125 text-gray-75 hover:text-white'
                          }`}
                        >
                          {isPrimary ? 'Primary' : 'Set Primary'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <p className="text-xs text-gray-100 mt-2">
                💡 Using multiple networks with mediation increases fill rates and eCPM
              </p>
            </div>
          </SectionCard>
          
          {/* Ad Placements Section */}
          <SectionCard
            icon={<div className="text-lg">📍</div>}
            title="Ad Placements"
            description="Where ads appear in your app"
            expanded={expandedSection === 'placements'}
            onToggle={() => setExpandedSection(expandedSection === 'placements' ? null : 'placements')}
          >
            <div className="space-y-3">
              {config.placements.map((placement) => {
                const placementInfo = AD_PLACEMENTS.find(p => p.type === placement.type);
                
                return (
                  <div
                    key={placement.id}
                    className={`p-3 rounded-xl border transition-all ${
                      placement.enabled
                        ? 'bg-gray-150 border-gray-100'
                        : 'bg-gray-175 border-gray-125 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => updatePlacement(placement.id, { enabled: !placement.enabled })}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          placement.enabled
                            ? 'bg-accent-green border-accent-green'
                            : 'border-gray-100'
                        }`}
                      >
                        {placement.enabled && <Check className="w-3 h-3 text-white" />}
                      </button>
                      
                      <span className="text-lg">{placementInfo?.icon}</span>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{placementInfo?.name}</p>
                        <p className="text-xs text-gray-75">{placement.location}</p>
                      </div>
                      
                      <button
                        onClick={() => removePlacement(placement.id)}
                        className="p-1.5 rounded-lg text-gray-100 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Placement-specific options */}
                    {(placement.type === 'pre-roll' || placement.type === 'mid-roll') && (
                      <div className="ml-8 mt-2">
                        <label className="block text-xs text-gray-100 mb-1">Skip after (seconds)</label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={placement.skipAfterSeconds || 5}
                          onChange={(e) => updatePlacement(placement.id, { skipAfterSeconds: parseInt(e.target.value) || 5 })}
                          className="w-20 px-2 py-1 rounded bg-gray-175 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-blue"
                        />
                      </div>
                    )}
                    
                    {placement.type === 'rewarded' && (
                      <div className="ml-8 mt-2 flex gap-3">
                        <div>
                          <label className="block text-xs text-gray-100 mb-1">Reward amount</label>
                          <input
                            type="number"
                            min="1"
                            value={placement.rewardAmount || 100}
                            onChange={(e) => updatePlacement(placement.id, { rewardAmount: parseInt(e.target.value) || 100 })}
                            className="w-20 px-2 py-1 rounded bg-gray-175 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-100 mb-1">Reward type</label>
                          <input
                            type="text"
                            value={placement.rewardType || 'coins'}
                            onChange={(e) => updatePlacement(placement.id, { rewardType: e.target.value })}
                            className="w-24 px-2 py-1 rounded bg-gray-175 border border-gray-125 text-white text-sm focus:outline-none focus:border-accent-blue"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Add placement button */}
              {!addingPlacement ? (
                <button
                  onClick={() => setAddingPlacement(true)}
                  className="w-full p-3 rounded-xl border-2 border-dashed border-gray-125 hover:border-gray-100 flex items-center justify-center gap-2 text-gray-75 hover:text-white transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Placement</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-gray-175 border border-gray-125">
                  <p className="text-xs text-gray-100 mb-2">Select placement type:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {AD_PLACEMENTS.map((placement) => (
                      <button
                        key={placement.type}
                        onClick={() => addPlacement(placement.type)}
                        className="p-2 rounded-lg bg-gray-150 border border-gray-125 hover:border-gray-100 text-left transition-all"
                      >
                        <span className="text-sm mr-1">{placement.icon}</span>
                        <span className="text-xs text-white">{placement.name}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setAddingPlacement(false)}
                    className="w-full mt-2 py-1 text-xs text-gray-75 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </SectionCard>
          
          {/* Frequency Caps Section */}
          <SectionCard
            icon={<Clock className="w-5 h-5 text-accent-yellow" />}
            title="Frequency Caps"
            description="Control user ad experience"
            expanded={expandedSection === 'frequency'}
            onToggle={() => setExpandedSection(expandedSection === 'frequency' ? null : 'frequency')}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-100 mb-2">Min seconds between ads</label>
                <div className="flex gap-2">
                  {[60, 120, 180, 300, 600].map((seconds) => (
                    <button
                      key={seconds}
                      onClick={() => updateFrequency({ minSecondsBetweenAds: seconds })}
                      className={`flex-1 py-2 rounded-lg text-xs transition-all border ${
                        config.adFrequency.minSecondsBetweenAds === seconds
                          ? 'bg-accent-yellow/10 border-accent-yellow/30 text-white'
                          : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                      }`}
                    >
                      {seconds >= 60 ? `${seconds / 60}m` : `${seconds}s`}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-100 mb-2">Max ads per hour</label>
                <div className="flex gap-2">
                  {[2, 3, 4, 6, 8].map((count) => (
                    <button
                      key={count}
                      onClick={() => updateFrequency({ maxAdsPerHour: count })}
                      className={`flex-1 py-2 rounded-lg text-xs transition-all border ${
                        config.adFrequency.maxAdsPerHour === count
                          ? 'bg-accent-yellow/10 border-accent-yellow/30 text-white'
                          : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-100 mb-2">Max ads per session</label>
                <div className="flex gap-2">
                  {[5, 8, 10, 15, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => updateFrequency({ maxAdsPerSession: count })}
                      className={`flex-1 py-2 rounded-lg text-xs transition-all border ${
                        config.adFrequency.maxAdsPerSession === count
                          ? 'bg-accent-yellow/10 border-accent-yellow/30 text-white'
                          : 'bg-gray-150 border-gray-125 text-gray-75 hover:text-white'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
          
          {/* Revenue Split Section */}
          <SectionCard
            icon={<DollarSign className="w-5 h-5 text-accent-green" />}
            title="Revenue Split"
            description="How ad revenue is shared"
            expanded={expandedSection === 'revenue'}
            onToggle={() => setExpandedSection(expandedSection === 'revenue' ? null : 'revenue')}
          >
            <div className="space-y-4">
              {offer.linkedToCreator ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎬</span>
                        <span className="text-gray-75">Creator</span>
                      </div>
                      <span className="text-white font-medium">{config.creatorShare}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={config.creatorShare}
                      onChange={(e) => {
                        const creatorShare = parseInt(e.target.value);
                        updateConfig({ creatorShare, platformShare: 100 - creatorShare });
                      }}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        <span className="text-gray-75">Platform</span>
                      </div>
                      <span className="text-white font-medium">{config.platformShare}%</span>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-gray-175 border border-gray-125">
                    <p className="text-xs text-gray-75">
                      <strong className="text-white">Example:</strong> With $100 ad revenue, 
                      creator gets ${(100 * config.creatorShare / 100).toFixed(0)} and 
                      platform gets ${(100 * config.platformShare / 100).toFixed(0)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-gray-175 border border-gray-125 text-center">
                  <p className="text-sm text-white">100% to Platform</p>
                  <p className="text-xs text-gray-75 mt-1">
                    This offer isn't creator-linked, so all ad revenue goes to the platform
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </>
      )}
      
      {/* Disabled state */}
      {!config.enabled && (
        <div className="p-6 rounded-xl bg-gray-175 border border-dashed border-gray-125 text-center">
          <Tv className="w-8 h-8 text-gray-100 mx-auto mb-3" />
          <p className="text-sm text-white mb-2">Ad revenue disabled</p>
          <p className="text-xs text-gray-75">
            Enable ad revenue to monetize with display ads, video ads, and rewarded content.
            Ad revenue can be shared with creators.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper component for section cards
function SectionCard({
  icon,
  title,
  description,
  expanded,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-125 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 bg-gray-150 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {icon}
          <div className="text-left">
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="text-xs text-gray-75">{description}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-75" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-75" />
        )}
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-175">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function
function getDefaultLocation(type: AdPlacement): string {
  switch (type) {
    case 'banner':
      return 'Bottom of screen';
    case 'interstitial':
      return 'Between videos/content';
    case 'rewarded':
      return 'Earn coins button';
    case 'native':
      return 'In feed every 5 items';
    case 'pre-roll':
      return 'Before stream/video starts';
    case 'mid-roll':
      return 'Every 15 minutes';
    default:
      return 'Custom location';
  }
}
