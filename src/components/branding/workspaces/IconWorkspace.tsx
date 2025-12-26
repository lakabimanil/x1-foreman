'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, RefreshCw, Upload, FolderOpen } from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';
import AssetPicker from '../AssetPicker';
import type { Asset } from '@/types/branding';

export default function IconWorkspace() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  
  const { 
    artifacts, 
    selectIcon, 
    lockIcon, 
    regenerateIcons, 
    addCustomIcon,
    addIconFromAsset,
    updateIconColors,
    isGenerating 
  } = useBrandingStore();
  
  const { concepts, primaryIcon } = artifacts.icon;
  const selectedConcept = concepts.find(c => c.selected);

  const handleSelectAsset = (asset: Asset) => {
    addIconFromAsset(asset.id);
    setShowAssetPicker(false);
  };

  // Sync state with selected icon
  const [colors, setColors] = useState({ primary: '#000000', secondary: '#ffffff' });

  useEffect(() => {
    if (selectedConcept) {
      setColors({
        primary: selectedConcept.primaryColor,
        secondary: selectedConcept.secondaryColor
      });
    }
  }, [selectedConcept?.id, selectedConcept?.primaryColor, selectedConcept?.secondaryColor]);

  const handleColorChange = (type: 'primary' | 'secondary', value: string) => {
    const newColors = { ...colors, [type]: value };
    setColors(newColors);
    if (selectedConcept) {
      updateIconColors(newColors.primary, newColors.secondary);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addCustomIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="p-6">
      {/* Locked Icon */}
      {primaryIcon && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
        >
          <div className="w-16 h-16 rounded-2xl overflow-hidden">
            <img src={primaryIcon.imageUrl} alt="Primary icon" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Primary Icon
            </p>
            <p className="text-sm text-neutral-400 mt-0.5 capitalize">{primaryIcon.style}</p>
          </div>
        </motion.div>
      )}
      
      {/* Tools Section */}
      <div className="flex items-center justify-between mb-6 p-1">
        <div className="flex items-center gap-4">
           {/* Color Pickers */}
           <div className="flex items-center gap-2">
            {[
              { label: 'Background', value: colors.primary, type: 'primary' as const },
              { label: 'Logo', value: colors.secondary, type: 'secondary' as const }
            ].map((picker) => (
              <div key={picker.type} className="flex items-center gap-3 bg-neutral-900/50 p-1.5 rounded-xl border border-neutral-800/50 pr-4">
                <div className="relative group">
                  <input
                    type="color"
                    value={picker.value}
                    onChange={(e) => handleColorChange(picker.type, e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    disabled={selectedConcept && !selectedConcept.imageUrl.startsWith('data:image/svg+xml')}
                  />
                  <div 
                    className="w-8 h-8 rounded-lg border border-white/10 shadow-sm transition-transform group-hover:scale-105"
                    style={{ backgroundColor: picker.value }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">{picker.label}</span>
                  <span className="text-xs font-mono text-neutral-300">{picker.value.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all border border-transparent hover:border-neutral-800"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />

          {/* From Assets Button */}
          <button
            onClick={() => setShowAssetPicker(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all border border-transparent hover:border-neutral-800"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            From Assets
          </button>
        </div>

        <button
          onClick={() => regenerateIcons()}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all disabled:opacity-50 border border-transparent hover:border-neutral-800"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-neutral-400">
          {concepts.length} concepts • Select one
        </p>
      </div>
      
      {/* Icon Grid - Clean */}
      <div className="grid grid-cols-3 gap-4">
        {concepts.map((concept, index) => (
          <motion.button
            key={concept.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => selectIcon(concept.id)}
            className={`relative aspect-square rounded-2xl overflow-hidden transition-all group ${
              concept.selected
                ? 'ring-2 ring-white ring-offset-4 ring-offset-[#0d0d0d]'
                : 'hover:ring-1 hover:ring-neutral-700 hover:ring-offset-2 hover:ring-offset-[#0d0d0d]'
            }`}
          >
            <img 
              src={concept.imageUrl} 
              alt={concept.style}
              className="w-full h-full object-cover"
            />
            
            {/* Style Label */}
            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[10px] text-white/70 capitalize">{concept.style}</p>
            </div>
            
            {/* Lock Button */}
            {concept.selected && !primaryIcon && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  lockIcon(concept.id);
                }}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-white rounded-md text-[10px] font-medium text-black"
              >
                <Lock className="w-2.5 h-2.5" />
                Lock
              </motion.button>
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Empty State */}
      {concepts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl bg-neutral-800 mb-4"
          />
          <p className="text-sm text-neutral-500">Generating icons...</p>
        </div>
      )}

      {/* Asset Picker Modal */}
      <AssetPicker
        isOpen={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        onSelect={handleSelectAsset}
        filterType="all"
        title="Choose Icon from Assets"
        allowUpload={true}
        allowGenerate={true}
      />
    </div>
  );
}
