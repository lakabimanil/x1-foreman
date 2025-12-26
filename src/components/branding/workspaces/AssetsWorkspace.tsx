'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Sparkles,
  Trash2,
  Tag,
  Image as ImageIcon,
  FolderOpen,
  Grid3X3,
  List,
  X,
  Plus,
  Check,
  Wand2,
} from 'lucide-react';
import { useBrandingStore } from '@/store/useBrandingStore';
import type { Asset } from '@/types/branding';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | Asset['type'];

export default function AssetsWorkspace() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [generateType, setGenerateType] = useState<Asset['type']>('image');
  const [editingTags, setEditingTags] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const {
    artifacts,
    uploadAssets,
    generateAsset,
    deleteAsset,
    selectAsset,
    updateAssetTags,
    isGenerating,
  } = useBrandingStore();

  const { assets, selectedAssetId } = artifacts.assets;

  const filteredAssets = filter === 'all' 
    ? assets 
    : assets.filter((a) => a.type === filter);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      await uploadAssets(files);
    }
  }, [uploadAssets]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadAssets(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!generatePrompt.trim()) return;
    await generateAsset(generatePrompt, generateType);
    setShowGenerateModal(false);
    setGeneratePrompt('');
  };

  const handleAddTag = (assetId: string) => {
    if (!tagInput.trim()) return;
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      updateAssetTags(assetId, [...asset.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (assetId: string, tagToRemove: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      updateAssetTags(assetId, asset.tags.filter(t => t !== tagToRemove));
    }
  };

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'image', label: 'Images' },
    { value: 'icon', label: 'Icons' },
    { value: 'logo', label: 'Logos' },
    { value: 'screenshot', label: 'Screenshots' },
    { value: 'background', label: 'Backgrounds' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Controls */}
      <div className="flex-shrink-0 p-4 border-b border-neutral-800/50">
        <div className="flex items-center justify-between gap-4">
          {/* Upload & Generate Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            
            <button
              onClick={() => setShowGenerateModal(true)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-sm font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              Generate
            </button>
          </div>

          {/* Filters & View Toggle */}
          <div className="flex items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    filter === option.value
                      ? 'bg-white text-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Asset Count */}
        <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
          <FolderOpen className="w-4 h-4" />
          <span>{filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}</span>
          {filter !== 'all' && (
            <span className="text-neutral-600">• Showing {filter}s</span>
          )}
        </div>
      </div>

      {/* Drop Zone / Asset Grid */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag Overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-4 z-50 border-2 border-dashed border-violet-500 rounded-2xl bg-violet-500/10 flex items-center justify-center"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-violet-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-white">Drop files here</p>
                <p className="text-sm text-neutral-400 mt-1">Images will be added to your assets</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredAssets.length === 0 && !isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-neutral-900 flex items-center justify-center mb-4">
              <ImageIcon className="w-10 h-10 text-neutral-700" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No assets yet</h3>
            <p className="text-sm text-neutral-500 max-w-sm mb-6">
              Upload your brand assets or generate new ones with AI. These can be used across your icons, screenshots, and more.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 text-white rounded-xl text-sm font-medium hover:bg-neutral-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </button>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-sm font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </button>
            </div>
          </motion.div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredAssets.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => selectAsset(selectedAssetId === asset.id ? null : asset.id)}
                className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${
                  selectedAssetId === asset.id
                    ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0d0d0d]'
                    : 'hover:ring-1 hover:ring-neutral-700'
                }`}
              >
                {/* Image */}
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover bg-neutral-900"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-neutral-400 capitalize px-1.5 py-0.5 bg-neutral-800 rounded">
                        {asset.type}
                      </span>
                      {asset.source === 'generated' && (
                        <span className="text-[10px] text-violet-400 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          AI
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAsset(asset.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-neutral-400 hover:text-red-400 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Tags Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTags(editingTags === asset.id ? null : asset.id);
                  }}
                  className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/60 text-neutral-400 hover:text-white hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Tag className="w-3.5 h-3.5" />
                </button>

                {/* Selection Indicator */}
                {selectedAssetId === asset.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && filteredAssets.length > 0 && (
          <div className="space-y-2">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => selectAsset(selectedAssetId === asset.id ? null : asset.id)}
                className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                  selectedAssetId === asset.id
                    ? 'bg-violet-500/10 ring-1 ring-violet-500/50'
                    : 'bg-neutral-900 hover:bg-neutral-800'
                }`}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-neutral-500 capitalize">{asset.type}</span>
                    {asset.width && asset.height && (
                      <>
                        <span className="text-neutral-700">•</span>
                        <span className="text-[10px] text-neutral-500">{asset.width}×{asset.height}</span>
                      </>
                    )}
                    {asset.source === 'generated' && (
                      <>
                        <span className="text-neutral-700">•</span>
                        <span className="text-[10px] text-violet-400 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          AI Generated
                        </span>
                      </>
                    )}
                  </div>
                  {/* Tags */}
                  {asset.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {asset.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTags(editingTags === asset.id ? null : asset.id);
                    }}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAsset(asset.id);
                    }}
                    className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowGenerateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Generate Asset</h3>
                    <p className="text-xs text-neutral-500">Create with AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Asset Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['icon', 'logo', 'background'] as Asset['type'][]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setGenerateType(type)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          generateType === type
                            ? 'bg-violet-600 text-white'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Describe what you want
                  </label>
                  <textarea
                    value={generatePrompt}
                    onChange={(e) => setGeneratePrompt(e.target.value)}
                    placeholder={`E.g., "A modern gradient ${generateType} with purple and blue colors"`}
                    className="w-full h-24 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-800">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!generatePrompt.trim() || isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tag Editor Modal */}
      <AnimatePresence>
        {editingTags && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingTags(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-neutral-900 rounded-xl border border-neutral-800 p-4"
            >
              <h4 className="text-sm font-medium text-white mb-3">Edit Tags</h4>
              
              {/* Current Tags */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                {assets.find(a => a.id === editingTags)?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-neutral-800 text-neutral-300 rounded-md text-xs"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(editingTags, tag)}
                      className="text-neutral-500 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Tag Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(editingTags);
                    }
                  }}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  onClick={() => handleAddTag(editingTags)}
                  disabled={!tagInput.trim()}
                  className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 disabled:opacity-50 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setEditingTags(null)}
                className="w-full mt-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

