'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Lock, RefreshCw, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';
import AssetPicker from '../AssetPicker';
import type { Asset } from '@/types/branding';

export default function ScreenshotsWorkspace() {
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  const { artifacts, updateScreenshot, updateScreenshotImage } = useBrandingStore();
  const { cards, status } = artifacts.screenshots;
  const isLocked = status === 'locked';

  const handleSelectAsset = (asset: Asset) => {
    if (selectedCardId) {
      updateScreenshotImage(selectedCardId, asset.id);
    }
    setShowAssetPicker(false);
    setSelectedCardId(null);
  };

  const openAssetPicker = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowAssetPicker(true);
  };
  
  return (
    <div className="p-6">
      {/* Locked State */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
        >
          <p className="text-xs text-emerald-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Screenshots Locked
          </p>
        </motion.div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">{cards.length} screenshots</p>
      </div>
      
      {/* Screenshot Cards */}
      <div className="space-y-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3 p-4 bg-neutral-900 rounded-xl group"
          >
            {/* Drag Handle */}
            {!isLocked && (
              <div className="flex items-center text-neutral-700 cursor-grab">
                <GripVertical className="w-4 h-4" />
              </div>
            )}
            
            {/* Order Number */}
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-neutral-400">{index + 1}</span>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={card.headline}
                onChange={(e) => updateScreenshot(card.id, { headline: e.target.value })}
                disabled={isLocked}
                className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder-neutral-600 mb-1"
                placeholder="Headline..."
              />
              <input
                type="text"
                value={card.supportingText}
                onChange={(e) => updateScreenshot(card.id, { supportingText: e.target.value })}
                disabled={isLocked}
                className="w-full bg-transparent text-xs text-neutral-500 outline-none placeholder-neutral-700"
                placeholder="Supporting text..."
              />
            </div>
            
            {/* Preview Thumbnail */}
            <button
              onClick={() => !isLocked && openAssetPicker(card.id)}
              disabled={isLocked}
              className={`w-12 h-20 rounded-lg flex-shrink-0 overflow-hidden transition-all ${
                !isLocked ? 'hover:ring-2 hover:ring-violet-500 cursor-pointer' : 'cursor-default'
              }`}
            >
              {card.imageUrl ? (
                <img 
                  src={card.imageUrl} 
                  alt={card.headline}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  {!isLocked && (
                    <FolderOpen className="w-4 h-4 text-white/60" />
                  )}
                </div>
              )}
            </button>
          </motion.div>
        ))}
      </div>
      
      {/* Empty State */}
      {cards.length === 0 && (
        <div className="text-center py-12">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-20 rounded-lg bg-neutral-800 mx-auto mb-4"
          />
          <p className="text-sm text-neutral-500">Generating screenshots...</p>
        </div>
      )}

      {/* Asset Picker Modal */}
      <AssetPicker
        isOpen={showAssetPicker}
        onClose={() => {
          setShowAssetPicker(false);
          setSelectedCardId(null);
        }}
        onSelect={handleSelectAsset}
        filterType="all"
        title="Choose Screenshot Image"
        allowUpload={true}
        allowGenerate={true}
      />
    </div>
  );
}
