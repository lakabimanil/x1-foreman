'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, GripHorizontal, Smartphone, ListChecks, Shield, CreditCard, Sparkles, Video, Edit3, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { BlockRenderer } from './blocks';
import type { OnboardingBlock, BlockType } from '@/types';

const blockTypeConfig: Record<BlockType, { icon: React.ElementType; color: string; label: string }> = {
  auth: { icon: Smartphone, color: 'var(--color-accent-blue)', label: 'Auth' },
  survey: { icon: ListChecks, color: 'var(--color-accent-green)', label: 'Survey' },
  permission: { icon: Shield, color: 'var(--color-accent-yellow)', label: 'Permission' },
  paywall: { icon: CreditCard, color: 'var(--color-accent-purple)', label: 'Paywall' },
  'value-prop': { icon: Sparkles, color: 'var(--color-accent-red)', label: 'Value' },
  video: { icon: Video, color: 'var(--color-accent-purple)', label: 'Video' },
  splash: { icon: Sparkles, color: 'var(--color-accent-yellow)', label: 'Splash' },
};

interface SortableCardProps {
  block: OnboardingBlock;
  isActive: boolean;
  index: number;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableCard({ block, isActive, index, onSelect, onEdit, onDelete }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = blockTypeConfig[block.type];
  const Icon = config.icon;

  // Get display title - prefer block.title, then heading, then type-based default
  const displayTitle = block.title || block.heading || config.label;

  // iPhone 14 Pro dimensions: 393px x 852px (aspect ratio ~0.461)
  // For canvas: 200px width = 434px height for proper iPhone proportions
  const cardWidth = 200;
  const cardHeight = 434;
  const scaleFactor = cardWidth / 393; // Scale from actual iPhone width

  // Handle click - check if it's on an editable element
  const handleClick = (e: React.MouseEvent) => {
    // Check if click originated from an editable text element
    const target = e.target as HTMLElement;
    if (target.closest('[data-editable="true"]') || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      // Don't select the card, let the editable text handle it
      return;
    }
    onSelect();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Check if double click originated from an editable text element
    const target = e.target as HTMLElement;
    if (target.closest('[data-editable="true"]') || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    onEdit();
  };

  return (
    <div className="flex flex-col items-center gap-2 group">
      {/* Title and Number - Outside the frame */}
      <div className="flex items-center gap-2 w-full justify-center">
        <div 
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.color }}
        >
          <span className="text-[10px] font-bold text-white">{index + 1}</span>
        </div>
        <span className="text-xs font-medium text-[var(--color-gray-75)]">{displayTitle}</span>
        {isActive && (
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)] flex-shrink-0" />
        )}
      </div>

      {/* Card Frame */}
      <motion.div
        ref={setNodeRef}
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          ...style,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: isDragging ? 0.5 : 1, 
          scale: 1,
        }}
        className={`relative flex-shrink-0 rounded-[2.5rem] overflow-hidden transition-all duration-200 cursor-pointer ${
          isActive 
            ? 'ring-2 ring-[var(--color-accent-blue)] shadow-lg shadow-[var(--color-accent-blue)]/20' 
            : 'ring-1 ring-[var(--color-gray-125)] hover:ring-[var(--color-gray-100)]'
        }`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        {...attributes}
        {...listeners}
      >
        {/* Drag handle indicator - subtle */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--color-gray-125)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20" />

        {/* Card Content - Proper iPhone dimensions */}
        <div 
          className="w-full h-full overflow-hidden relative"
          style={{ backgroundColor: block.style?.backgroundColor || 'var(--color-base-black)' }}
        >
          <div 
            className="w-full h-full"
            style={{
              transform: `scale(${scaleFactor})`,
              transformOrigin: 'top left',
            }}
          >
            <div className="w-[393px] h-[852px]">
              <BlockRenderer block={block} isPreview={false} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Bar - Outside the frame */}
      <div className="flex items-center justify-between w-full px-1 mt-1">
        {/* Block type badge */}
        <div 
          className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
          <span className="text-xs font-medium" style={{ color: config.color }}>{config.label}</span>
        </div>

        {/* Edit/Delete buttons - visible on hover */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="w-8 h-8 rounded-lg bg-[var(--color-accent-blue)] flex items-center justify-center hover:bg-[#0066DD] transition-colors"
          >
            <Edit3 className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-8 h-8 rounded-lg bg-[var(--color-accent-red)] flex items-center justify-center hover:bg-[#E0342B] transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function AddBlockMenu({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative flex-shrink-0 flex items-center">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          isOpen 
            ? 'bg-[var(--color-accent-blue)] text-white' 
            : 'bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] text-[var(--color-accent-blue)] hover:bg-[var(--color-gray-125)]'
        }`}
      >
        <Plus className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-2xl p-2 shadow-2xl min-w-[180px]"
          >
            <div className="text-xs font-medium text-[var(--color-gray-100)] px-3 py-2">Add Block</div>
            {(Object.entries(blockTypeConfig) as [BlockType, typeof blockTypeConfig[BlockType]][]).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => {
                    onAdd(type);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-gray-125)] transition-colors"
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                  </div>
                  <span className="text-sm text-white font-medium">{config.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CanvasPanel() {
  const { blocks, activeBlockId, setActiveBlock, removeBlock, reorderBlocks, addBlock, addLog, setEditPanelOpen } = useOnboardingStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastPointerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsDraggingCanvas(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.002;
      const newZoom = Math.min(Math.max(zoom + delta, 0.1), 3);
      setZoom(newZoom);
    } else {
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Middle mouse (button 1) or Space pressed
    if (e.button === 1 || isSpacePressed) {
      e.preventDefault();
      setIsDraggingCanvas(true);
      lastPointerPos.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingCanvas) {
      e.preventDefault();
      const dx = e.clientX - lastPointerPos.current.x;
      const dy = e.clientY - lastPointerPos.current.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPointerPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingCanvas) {
      setIsDraggingCanvas(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
      disabled: isSpacePressed,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      disabled: isSpacePressed,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
      addLog({ message: 'Reordered blocks', status: 'info' });
    }
    
    setActiveId(null);
  };

  const handleAddBlock = (type: BlockType) => {
    const config = blockTypeConfig[type];
    const newBlock: OnboardingBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: config.label,
      ctaText: 'Continue',
      style: {
        backgroundColor: 'var(--color-base-black)',
        accentColor: 'var(--color-accent-blue)',
        textColor: 'var(--color-base-white)',
      },
      ...(type === 'auth' && { 
        subtitle: 'Create your account',
        authMethods: ['apple', 'email'] 
      }),
      ...(type === 'survey' && {
        question: 'Your question here?',
        options: [
          { id: '1', text: 'Option 1', selected: false },
          { id: '2', text: 'Option 2', selected: false },
          { id: '3', text: 'Option 3', selected: false },
        ],
      }),
      ...(type === 'permission' && {
        permissionType: 'notifications',
        permissionTitle: '"YourApp" Would Like to Send You Notifications',
        permissionBody: 'Notifications may include alerts, sounds, and icon badges.',
      }),
      ...(type === 'paywall' && {
        subtitle: 'Unlock your full potential',
        monthlyPrice: 9.99,
        yearlyPrice: 59.99,
        features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
        closeDelay: 3,
      }),
      ...(type === 'value-prop' && {
        heading: 'Amazing Feature',
        description: 'Describe the value proposition here.',
      }),
    };
    addBlock(newBlock);
    addLog({ message: `Added ${config.label} block`, status: 'success' });
  };

  const handleSelectAndEdit = (id: string) => {
    setActiveBlock(id);
    setEditPanelOpen(true);
  };

  const activeBlock = blocks.find(b => b.id === activeId);

  return (
    <div className="flex-1 bg-black flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="h-12 border-b border-[var(--color-gray-125)] flex items-center justify-between px-6 flex-shrink-0 bg-black z-10">
        <div>
          <h2 className="text-sm font-semibold text-white">Canvas</h2>
          <p className="text-xs text-[var(--color-gray-100)]">{blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-[var(--color-gray-150)] rounded-lg p-1 border border-[var(--color-gray-125)] mr-2">
            <button 
              onClick={handleZoomOut}
              className="p-1 hover:bg-[var(--color-gray-125)] rounded text-[var(--color-gray-75)] hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-xs w-10 text-center text-[var(--color-gray-75)] font-mono">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={handleZoomIn}
              className="p-1 hover:bg-[var(--color-gray-125)] rounded text-[var(--color-gray-75)] hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <div className="w-px h-3 bg-[var(--color-gray-125)] mx-1" />
            <button 
              onClick={handleResetZoom}
              className="p-1 hover:bg-[var(--color-gray-125)] rounded text-[var(--color-gray-75)] hover:text-white transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw size={14} />
            </button>
          </div>
          <span className="text-xs text-[var(--color-gray-75)]">Drag to reorder • Double-click to edit</span>
        </div>
      </div>

      {/* Carousel - adjusted padding bottom for command bar */}
      <div 
        className={`flex-1 overflow-hidden relative ${isSpacePressed ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div 
          ref={scrollRef}
          className="w-full h-full flex items-center justify-center"
        >
          <div 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out'
            }}
            className="flex items-center gap-6"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map(b => b.id)}
                strategy={horizontalListSortingStrategy}
              >
                {blocks.map((block, index) => (
                  <SortableCard
                    key={block.id}
                    block={block}
                    index={index}
                    isActive={block.id === activeBlockId}
                    onSelect={() => setActiveBlock(block.id)}
                    onEdit={() => handleSelectAndEdit(block.id)}
                    onDelete={() => removeBlock(block.id)}
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeBlock ? (
                  <div 
                    className="rounded-[2.5rem] overflow-hidden ring-2 ring-[var(--color-accent-blue)] shadow-2xl opacity-90"
                    style={{ 
                      width: '200px',
                      height: '434px',
                      backgroundColor: activeBlock.style?.backgroundColor || 'var(--color-base-black)',
                      transform: `scale(${zoom})`, // Apply zoom to drag overlay too if needed, though dnd-kit handles this usually via transforms on the overlay container, let's keep it simple
                    }}
                  >
                    <div className="w-full h-full overflow-hidden relative">
                      <div 
                        className="w-full h-full"
                        style={{
                          transform: `scale(${200 / 393})`,
                          transformOrigin: 'top left',
                        }}
                      >
                        <div className="w-[393px] h-[852px]">
                          <BlockRenderer block={activeBlock} isPreview={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {/* Add New Block */}
            <AddBlockMenu onAdd={handleAddBlock} />
          </div>
        </div>
      </div>

      {/* Flow indicator - positioned above command bar */}
      <div className="absolute bottom-[72px] left-0 right-0 h-10 flex items-center justify-center z-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-gray-150)]/90 backdrop-blur-sm border border-[var(--color-gray-125)]">
          {blocks.map((block, index) => {
            const config = blockTypeConfig[block.type];
            return (
              <div key={block.id} className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setActiveBlock(block.id)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    block.id === activeBlockId 
                      ? 'w-6 ring-1 ring-offset-1 ring-offset-[var(--color-gray-150)]' 
                      : 'hover:opacity-80'
                  }`}
                  style={{ 
                    backgroundColor: block.id === activeBlockId ? config.color : 'var(--color-gray-100)',
                    ['--tw-ring-color' as any]: config.color,
                  }}
                  title={`${config.label}: ${block.title}`}
                />
                {index < blocks.length - 1 && (
                  <div className="w-4 h-px bg-[var(--color-gray-125)]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
