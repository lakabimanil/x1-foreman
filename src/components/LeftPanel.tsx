'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Image, Boxes, Sparkles, Upload, Search, 
  ChevronRight, FolderOpen, Layers, Grid3X3, 
  Square, CircleDot, Type, MousePointer, Play,
  Smartphone, ListChecks, Shield, CreditCard, Video,
  Check, X, Plus, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { 
  x1LibraryAssets, 
  onboardingTemplates, 
  screenTemplates,
  type Asset,
  type ScreenTemplate,
  type OnboardingBlock,
  type BlockType 
} from '@/types';
import { BlockRenderer } from './blocks';

type TabType = 'templates' | 'assets' | 'components';

const blockTypeConfig: Record<BlockType, { icon: React.ElementType; color: string; label: string }> = {
  auth: { icon: Smartphone, color: 'var(--color-accent-blue)', label: 'Auth' },
  survey: { icon: ListChecks, color: 'var(--color-accent-green)', label: 'Survey' },
  permission: { icon: Shield, color: 'var(--color-accent-yellow)', label: 'Permission' },
  paywall: { icon: CreditCard, color: 'var(--color-accent-purple)', label: 'Paywall' },
  'value-prop': { icon: Sparkles, color: 'var(--color-accent-red)', label: 'Value Prop' },
  video: { icon: Video, color: 'var(--color-accent-purple)', label: 'Video' },
  splash: { icon: Sparkles, color: 'var(--color-accent-yellow)', label: 'Splash' },
};

export default function LeftPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [assetCategory, setAssetCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedAssets, setUploadedAssets] = useState<Asset[]>([]);
  const [templateFilter, setTemplateFilter] = useState<'all' | 'screens' | 'flows'>('screens');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addBlock, setBlocks, addLog } = useOnboardingStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAsset: Asset = {
          id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name.split('.')[0],
          type: file.type.startsWith('video') ? 'video' : 'image',
          url: event.target?.result as string,
          category: 'uploads',
          isX1Library: false,
        };
        setUploadedAssets((prev) => [...prev, newAsset]);
        addLog({ message: `Uploaded ${file.name}`, status: 'success' });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddScreenTemplate = (template: ScreenTemplate) => {
    const newBlock: OnboardingBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: template.type,
      title: template.name,
      ctaText: 'Continue',
      style: {
        backgroundColor: 'var(--color-base-white)',
        accentColor: 'var(--color-base-black)',
        textColor: 'var(--color-base-black)',
      },
      ...template.block,
    };
    addBlock(newBlock);
    addLog({ message: `Added ${template.name} screen`, status: 'success' });
  };

  const filteredAssets = [...x1LibraryAssets, ...uploadedAssets].filter((asset) => {
    const matchesCategory = assetCategory === 'all' || asset.category === assetCategory;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const assetCategories = ['all', 'illustrations', 'backgrounds', 'photos', 'uploads'];

  const componentCategories = [
    { id: 'buttons', name: 'Buttons', icon: Square, items: ['Primary CTA', 'Secondary', 'Text Link', 'Icon Button'] },
    { id: 'inputs', name: 'Inputs', icon: Type, items: ['Text Field', 'Slider', 'Toggle', 'Picker'] },
    { id: 'cards', name: 'Cards', icon: Layers, items: ['Option Card', 'Feature Card', 'Price Card', 'Testimonial'] },
    { id: 'media', name: 'Media', icon: Image, items: ['Hero Image', 'Background', 'Icon Grid', 'Video Player'] },
    { id: 'layouts', name: 'Layouts', icon: Grid3X3, items: ['Header', 'Footer', 'Card Grid', 'List'] },
  ];

  const tabs = [
    { id: 'templates' as TabType, label: 'Templates', icon: Layout },
    { id: 'assets' as TabType, label: 'Assets', icon: Image },
    { id: 'components' as TabType, label: 'Components', icon: Boxes },
  ];

  return (
    <div className="w-[300px] min-w-[300px] bg-[var(--color-gray-175)] border-r border-[var(--color-gray-125)] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-gray-125)] flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <Link 
            href="/"
            className="w-9 h-9 rounded-xl bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] flex items-center justify-center flex-shrink-0 hover:bg-[var(--color-gray-125)] transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--color-gray-75)]" />
          </Link>
          
          <div className="w-9 h-9 rounded-xl bg-[var(--color-base-white)] flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6L8 18" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6L16 18" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white tracking-tight">x1</h1>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[var(--color-gray-125)] flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative ${
                activeTab === tab.id ? 'text-white' : 'text-[var(--color-gray-100)] hover:text-[var(--color-gray-75)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--color-accent-blue)] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <>
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="p-3 space-y-4">
              {/* Filter Tabs */}
              <div className="flex gap-1 p-1 bg-[var(--color-gray-150)] rounded-lg">
                {(['screens', 'flows'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTemplateFilter(filter)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      templateFilter === filter
                        ? 'bg-[var(--color-accent-blue)] text-white'
                        : 'text-[var(--color-gray-75)] hover:text-white'
                    }`}
                  >
                    {filter === 'screens' ? 'Screen Templates' : 'Full Flows'}
                  </button>
                ))}
              </div>

              {templateFilter === 'screens' ? (
                <>
                  {/* Screen Templates by Type */}
                  {Object.entries(blockTypeConfig).map(([type, config]) => {
                    const Icon = config.icon;
                    const templatesForType = screenTemplates.filter((t) => t.type === type);
                    if (templatesForType.length === 0) return null;

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center gap-2 px-1">
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center"
                            style={{ backgroundColor: `${config.color}20` }}
                          >
                            <Icon className="w-3 h-3" style={{ color: config.color }} />
                          </div>
                          <span className="text-xs font-medium text-[var(--color-gray-75)]">{config.label}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {templatesForType.map((template) => {
                            // Create a temporary block for preview
                            const previewBlock: OnboardingBlock = {
                              id: 'preview',
                              type: template.type,
                              title: template.name,
                              ...template.block,
                            } as OnboardingBlock;

                            return (
                              <motion.div
                                role="button"
                                tabIndex={0}
                                key={template.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAddScreenTemplate(template)}
                                className="group relative aspect-[9/16] bg-[var(--color-gray-150)] rounded-xl overflow-hidden border border-[var(--color-gray-125)] hover:border-[var(--color-accent-blue)] transition-colors cursor-pointer"
                              >
                                {/* Live Preview */}
                                <div className="absolute inset-0 w-full h-full pointer-events-none">
                                  <div 
                                    className="w-[393px] h-[852px] origin-top-left transform scale-[0.33]"
                                  >
                                    <BlockRenderer block={previewBlock} isPreview={true} />
                                  </div>
                                </div>

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors" />
                                
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                  <p className="text-[10px] font-medium text-white truncate">{template.name}</p>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent-blue)] flex items-center justify-center shadow-lg">
                                    <Plus className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {/* Full Onboarding Flow Templates */}
                  <div className="space-y-3">
                    {onboardingTemplates.map((template) => (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full bg-[var(--color-gray-150)] rounded-xl overflow-hidden border border-[var(--color-gray-125)] hover:border-[var(--color-accent-blue)] transition-colors text-left"
                      >
                        <div
                          className="h-24 bg-cover bg-center"
                          style={{ backgroundImage: `url(${template.thumbnail})` }}
                        />
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-white">{template.name}</h3>
                            <span className="text-[10px] px-2 py-0.5 bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)] rounded-full">
                              {template.category}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--color-gray-100)]">{template.description}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div className="p-3 space-y-4">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-20 border-2 border-dashed border-[var(--color-gray-125)] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/5 transition-colors group"
              >
                <Upload className="w-6 h-6 text-[var(--color-gray-100)] group-hover:text-[var(--color-accent-blue)]" />
                <span className="text-xs text-[var(--color-gray-100)] group-hover:text-[var(--color-accent-blue)]">Upload Image or Video</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gray-100)]" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-sm text-white placeholder-[var(--color-gray-100)] focus:outline-none focus:border-[var(--color-accent-blue)]"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {assetCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setAssetCategory(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      assetCategory === cat
                        ? 'bg-[var(--color-accent-blue)] text-white'
                        : 'bg-[var(--color-gray-150)] text-[var(--color-gray-75)] hover:text-white'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Assets Grid */}
              <div className="grid grid-cols-2 gap-2">
                {filteredAssets.map((asset) => (
                  <motion.button
                    key={asset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    draggable
                    onDragStart={(e) => {
                      (e as any).dataTransfer?.setData('asset', JSON.stringify(asset));
                    }}
                    className="group relative aspect-square bg-[var(--color-gray-150)] rounded-xl overflow-hidden border border-[var(--color-gray-125)] hover:border-[var(--color-accent-blue)] transition-colors"
                  >
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] font-medium text-white truncate">{asset.name}</p>
                    </div>
                    {asset.isX1Library && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-[var(--color-accent-blue)] rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">x1</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {filteredAssets.length === 0 && (
                <div className="text-center py-8">
                  <FolderOpen className="w-8 h-8 text-[var(--color-gray-100)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--color-gray-100)]">No assets found</p>
                </div>
              )}
            </div>
          )}

          {/* Components Tab */}
          {activeTab === 'components' && (
            <div className="p-3 space-y-3">
              {componentCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Icon className="w-4 h-4 text-[var(--color-gray-100)]" />
                      <span className="text-xs font-medium text-[var(--color-gray-75)]">{category.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {category.items.map((item) => (
                        <motion.button
                          key={item}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          draggable
                          className="p-3 bg-[var(--color-gray-150)] rounded-lg border border-[var(--color-gray-125)] hover:border-[var(--color-accent-blue)] transition-colors text-left"
                        >
                          <div className="w-full h-10 bg-[var(--color-gray-125)] rounded mb-2 flex items-center justify-center">
                            {category.id === 'buttons' && (
                              <div className="px-3 py-1 bg-[var(--color-accent-blue)] rounded-md text-[8px] text-white font-medium">
                                Button
                              </div>
                            )}
                            {category.id === 'inputs' && (
                              <div className="w-16 h-4 bg-[var(--color-gray-125)] rounded" />
                            )}
                            {category.id === 'cards' && (
                              <div className="w-12 h-6 bg-[var(--color-gray-125)] rounded" />
                            )}
                            {category.id === 'media' && (
                              <Image className="w-4 h-4 text-[var(--color-gray-100)]" />
                            )}
                            {category.id === 'layouts' && (
                              <Grid3X3 className="w-4 h-4 text-[var(--color-gray-100)]" />
                            )}
                          </div>
                          <p className="text-[10px] font-medium text-[var(--color-gray-75)] truncate">{item}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      </div>

      {/* Footer Hint */}
      <div className="p-3 bg-[var(--color-gray-150)]/50 border-t border-[var(--color-gray-125)] flex-shrink-0">
        <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--color-gray-100)]">
          <MousePointer className="w-3 h-3" />
          <span>Drag to canvas or click to add</span>
        </div>
      </div>
    </div>
  );
}

