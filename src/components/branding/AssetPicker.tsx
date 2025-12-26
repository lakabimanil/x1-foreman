'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Sparkles,
  Check,
  FolderOpen,
  Image as ImageIcon,
  Wand2,
} from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';
import type { Asset } from '@/types/branding';

interface AssetPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  filterType?: Asset['type'] | 'all';
  title?: string;
  allowUpload?: boolean;
  allowGenerate?: boolean;
}

export default function AssetPicker({
  isOpen,
  onClose,
  onSelect,
  filterType = 'all',
  title = 'Select Asset',
  allowUpload = true,
  allowGenerate = true,
}: AssetPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localFilter, setLocalFilter] = useState<Asset['type'] | 'all'>(filterType);
  const [showGenerateInput, setShowGenerateInput] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [generateType, setGenerateType] = useState<Asset['type']>('image');

  const {
    artifacts,
    uploadAsset,
    generateAsset,
    isGenerating,
  } = useBrandingStore();

  const { assets } = artifacts.assets;

  const filteredAssets = localFilter === 'all'
    ? assets
    : assets.filter((a) => a.type === localFilter);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAsset(file);
      // After upload, the new asset will be at the front of the list
      // We'll auto-select it
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!generatePrompt.trim()) return;
    await generateAsset(generatePrompt, generateType);
    setShowGenerateInput(false);
    setGeneratePrompt('');
  };

  const handleConfirm = () => {
    const selectedAsset = assets.find((a) => a.id === selectedId);
    if (selectedAsset) {
      onSelect(selectedAsset);
      onClose();
    }
  };

  const filterOptions: { value: Asset['type'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'image', label: 'Images' },
    { value: 'icon', label: 'Icons' },
    { value: 'logo', label: 'Logos' },
    { value: 'screenshot', label: 'Screenshots' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[80vh] bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="text-xs text-neutral-500">{filteredAssets.length} assets available</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between p-3 border-b border-neutral-800/50 flex-shrink-0">
              {/* Filters */}
              <div className="flex items-center gap-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLocalFilter(option.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      localFilter === option.value
                        ? 'bg-white text-black'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Upload & Generate */}
              <div className="flex items-center gap-2">
                {allowUpload && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </>
                )}
                {allowGenerate && (
                  <button
                    onClick={() => setShowGenerateInput(!showGenerateInput)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate
                  </button>
                )}
              </div>
            </div>

            {/* Generate Input */}
            <AnimatePresence>
              {showGenerateInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-neutral-800/50 overflow-hidden flex-shrink-0"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {(['icon', 'logo', 'background'] as Asset['type'][]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setGenerateType(type)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                            generateType === type
                              ? 'bg-violet-600 text-white'
                              : 'bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={generatePrompt}
                        onChange={(e) => setGeneratePrompt(e.target.value)}
                        placeholder={`Describe the ${generateType} you want...`}
                        className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 outline-none focus:ring-1 focus:ring-violet-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleGenerate();
                        }}
                      />
                      <button
                        onClick={handleGenerate}
                        disabled={!generatePrompt.trim() || isGenerating}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50"
                      >
                        <Wand2 className="w-4 h-4" />
                        {isGenerating ? 'Generating...' : 'Create'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Asset Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-neutral-600" />
                  </div>
                  <p className="text-sm text-neutral-500 mb-2">No assets found</p>
                  <p className="text-xs text-neutral-600">Upload or generate assets to use them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {filteredAssets.map((asset, index) => (
                    <motion.button
                      key={asset.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => setSelectedId(asset.id)}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all group ${
                        selectedId === asset.id
                          ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-neutral-900'
                          : 'hover:ring-1 hover:ring-neutral-700'
                      }`}
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover bg-neutral-800"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-[10px] font-medium text-white truncate">{asset.name}</p>
                        </div>
                      </div>

                      {/* Selection Check */}
                      {selectedId === asset.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}

                      {/* AI Badge */}
                      {asset.source === 'generated' && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-violet-400 flex items-center gap-0.5">
                          <Sparkles className="w-2 h-2" />
                          AI
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-neutral-800 flex-shrink-0">
              <p className="text-xs text-neutral-500">
                {selectedId ? 'Asset selected' : 'Click an asset to select it'}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedId}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  Use Asset
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

