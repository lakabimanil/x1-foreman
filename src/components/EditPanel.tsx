'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Palette, Type, Settings, Plus, Trash2, Image, Play, 
  Upload, ChevronDown, Sparkles, DollarSign, Bell, Shield,
  Camera, MapPin, Smartphone, Lock, ToggleLeft, Sliders,
  Move, Clock, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  RotateCcw, Repeat, Layers
} from 'lucide-react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { colorPresets, animationPresets, x1LibraryAssets, type Asset } from '@/types';
import type { OnboardingBlock, SurveyOption, BlockAnimation } from '@/types';

interface EditPanelProps {
  block: OnboardingBlock;
  onClose: () => void;
}

type TabType = 'content' | 'style' | 'animation' | 'assets';

// Paywall Edit Content
function PaywallEditContent({ block, handleChange, updateFeature, addFeature, removeFeature }: {
  block: OnboardingBlock;
  handleChange: (field: string, value: unknown) => void;
  updateFeature: (index: number, text: string) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Screen Name */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Screen Name
        </label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          placeholder="e.g., Paywall, Premium Offer"
        />
      </div>

      {/* Offer Badge */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Offer Badge
        </label>
        <input
          type="text"
          value={block.badgeText || '80% OFF FOREVER'}
          onChange={(e) => handleChange('badgeText', e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          placeholder="e.g., 80% OFF FOREVER"
        />
      </div>

      {/* Discount Percentage */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-3 h-3" />
          Discount Percentage
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={block.discountPercent || 80}
            onChange={(e) => handleChange('discountPercent', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-white w-12">{block.discountPercent || 80}%</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
            Monthly ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={block.monthlyPrice || 9.99}
            onChange={(e) => handleChange('monthlyPrice', parseFloat(e.target.value))}
            className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
            Yearly ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={block.yearlyPrice || 59.99}
            onChange={(e) => handleChange('yearlyPrice', parseFloat(e.target.value))}
            className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          />
        </div>
      </div>

      {/* Trial Toggle */}
      <div className="flex items-center justify-between p-3 bg-[var(--color-gray-150)] rounded-lg">
        <div className="flex items-center gap-2">
          <ToggleLeft className="w-4 h-4 text-[var(--color-accent-green)]" />
          <span className="text-sm text-white">Show Trial Toggle</span>
        </div>
        <button
          onClick={() => handleChange('showTrialToggle', !block.showTrialToggle)}
          className={`w-10 h-6 rounded-full transition-colors ${
            block.showTrialToggle !== false ? 'bg-[var(--color-accent-green)]' : 'bg-[var(--color-gray-125)]'
          }`}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full shadow-sm mx-0.5"
            animate={{ x: block.showTrialToggle !== false ? 16 : 0 }}
          />
        </button>
      </div>

      {/* Close Delay */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Close Button Delay (seconds)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={block.closeDelay || 3}
            onChange={(e) => handleChange('closeDelay', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-white w-8">{block.closeDelay || 3}s</span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
            Features
          </label>
          <button
            onClick={addFeature}
            className="text-xs text-[var(--color-accent-blue)] hover:text-[#0066DD] flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {block.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 h-9 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
              />
              <button
                onClick={() => removeFeature(index)}
                className="w-8 h-8 rounded-lg bg-[var(--color-accent-red)]/20 flex items-center justify-center hover:bg-[var(--color-accent-red)]/30 transition-colors"
              >
                <Trash2 className="w-3 h-3 text-[var(--color-accent-red)]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Splash/Value Prop Edit Content
function SplashEditContent({ block, handleChange }: {
  block: OnboardingBlock;
  handleChange: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Screen Name */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Screen Name
        </label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          placeholder="e.g., Splash, Welcome"
        />
      </div>

      {/* Variant Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Screen Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['splash', 'image', 'graph'].map((variant) => (
            <button
              key={variant}
              onClick={() => handleChange('variant', variant)}
              className={`p-3 rounded-lg border transition-colors text-center ${
                block.variant === variant
                  ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-white'
                  : 'border-[var(--color-gray-125)] bg-[var(--color-gray-150)] text-[var(--color-gray-75)] hover:text-white'
              }`}
            >
              <span className="text-xs font-medium capitalize">{variant}</span>
            </button>
          ))}
        </div>
      </div>

      {block.variant === 'splash' ? (
        <>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
              App Name / Logo Text
            </label>
            <input
              type="text"
              value={block.heading || block.title || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
              className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
              placeholder="Your App Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
              Logo Image (optional)
            </label>
            <div className="h-24 border-2 border-dashed border-[var(--color-gray-125)] rounded-xl flex items-center justify-center hover:border-[var(--color-accent-blue)] transition-colors cursor-pointer">
              <div className="text-center">
                <Upload className="w-6 h-6 text-[var(--color-gray-100)] mx-auto mb-1" />
                <span className="text-xs text-[var(--color-gray-100)]">Drop logo or click to upload</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
              Heading
            </label>
            <input
              type="text"
              value={block.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
              className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={block.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors resize-none"
            />
          </div>
        </>
      )}
    </div>
  );
}

// Survey Edit Content
function SurveyEditContent({ block, handleChange, handleOptionChange, addOption, removeOption }: {
  block: OnboardingBlock;
  handleChange: (field: string, value: unknown) => void;
  handleOptionChange: (optionId: string, text: string) => void;
  addOption: () => void;
  removeOption: (optionId: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Screen Name */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Screen Name
        </label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          placeholder="e.g., Gender, Goals, Preferences"
        />
      </div>

      {/* Variant Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Survey Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['cards', 'slider', 'picker'].map((variant) => (
            <button
              key={variant}
              onClick={() => handleChange('variant', variant)}
              className={`p-3 rounded-lg border transition-colors text-center ${
                block.variant === variant
                  ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-white'
                  : 'border-[var(--color-gray-125)] bg-[var(--color-gray-150)] text-[var(--color-gray-75)] hover:text-white'
              }`}
            >
              <span className="text-xs font-medium capitalize">{variant}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Question
        </label>
        <input
          type="text"
          value={block.question || ''}
          onChange={(e) => handleChange('question', e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Subtitle
        </label>
        <input
          type="text"
          value={block.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          placeholder="Optional helper text"
        />
      </div>

      {/* Multi-select toggle */}
      <div className="flex items-center justify-between p-3 bg-[var(--color-gray-150)] rounded-lg">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--color-accent-blue)]" />
          <span className="text-sm text-white">Allow Multiple Selection</span>
        </div>
        <button
          onClick={() => handleChange('multiSelect', !block.multiSelect)}
          className={`w-10 h-6 rounded-full transition-colors ${
            block.multiSelect ? 'bg-[var(--color-accent-green)]' : 'bg-[var(--color-gray-125)]'
          }`}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full shadow-sm mx-0.5"
            animate={{ x: block.multiSelect ? 16 : 0 }}
          />
        </button>
      </div>

      {/* Options */}
      {block.variant !== 'slider' && block.variant !== 'picker' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
              Options
            </label>
            <button
              onClick={addOption}
              className="text-xs text-[var(--color-accent-blue)] hover:text-[#0066DD] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {block.options?.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="flex-1 h-9 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
                <button
                  onClick={() => removeOption(option.id)}
                  className="w-8 h-8 rounded-lg bg-[var(--color-accent-red)]/20 flex items-center justify-center hover:bg-[var(--color-accent-red)]/30 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-[var(--color-accent-red)]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Permission Edit Content  
function PermissionEditContent({ block, handleChange }: {
  block: OnboardingBlock;
  handleChange: (field: string, value: unknown) => void;
}) {
  const permissionTypes = [
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'var(--color-accent-red)' },
    { id: 'att', label: 'App Tracking', icon: Shield, color: 'var(--color-accent-yellow)' },
    { id: 'location', label: 'Location', icon: MapPin, color: 'var(--color-accent-blue)' },
    { id: 'camera', label: 'Camera', icon: Camera, color: 'var(--color-accent-purple)' },
  ];

  return (
    <div className="space-y-6">
      {/* Screen Name */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Screen Name
        </label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          placeholder="e.g., Notifications, Permissions"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Permission Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {permissionTypes.map((perm) => {
            const Icon = perm.icon;
            return (
              <button
                key={perm.id}
                onClick={() => handleChange('permissionType', perm.id)}
                className={`p-3 rounded-lg border transition-colors flex items-center gap-2 ${
                  block.permissionType === perm.id
                    ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10'
                    : 'border-[var(--color-gray-125)] bg-[var(--color-gray-150)] hover:bg-[var(--color-gray-125)]'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${perm.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: perm.color }} />
                </div>
                <span className="text-xs font-medium text-white">{perm.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Pre-prompt Title
        </label>
        <input
          type="text"
          value={block.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          placeholder="Stay Updated"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Dialog Title
        </label>
        <input
          type="text"
          value={block.permissionTitle || ''}
          onChange={(e) => handleChange('permissionTitle', e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Dialog Body
        </label>
        <textarea
          value={block.permissionBody || ''}
          onChange={(e) => handleChange('permissionBody', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors resize-none"
        />
      </div>
    </div>
  );
}

// Animation Tab Content
function AnimationEditContent({ block, handleAnimationChange }: {
  block: OnboardingBlock;
  handleAnimationChange: (animation: Partial<BlockAnimation>) => void;
}) {
  const currentAnimation = block.animation || { entrance: 'fade', exit: 'fade' };
  
  const entranceAnimations = [
    { id: 'none', label: 'None', icon: X },
    { id: 'fade', label: 'Fade', icon: Sparkles },
    { id: 'slide-up', label: 'Slide Up', icon: ArrowUp },
    { id: 'slide-down', label: 'Slide Down', icon: ArrowDown },
    { id: 'slide-left', label: 'Slide Left', icon: ArrowLeft },
    { id: 'slide-right', label: 'Slide Right', icon: ArrowRight },
    { id: 'scale', label: 'Scale', icon: Zap },
    { id: 'bounce', label: 'Bounce', icon: Move },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Animation Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {animationPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleAnimationChange(preset.animation)}
              className={`p-2 rounded-lg border transition-colors text-center ${
                currentAnimation.entrance === preset.animation.entrance
                  ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-white'
                  : 'border-[var(--color-gray-125)] bg-[var(--color-gray-150)] text-[var(--color-gray-75)] hover:text-white'
              }`}
            >
              <span className="text-[10px] font-medium">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entrance Animation */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider flex items-center gap-2">
          <Play className="w-3 h-3" />
          Entrance Animation
        </label>
        <div className="grid grid-cols-4 gap-2">
          {entranceAnimations.map((anim) => {
            const Icon = anim.icon;
            return (
              <button
                key={anim.id}
                onClick={() => handleAnimationChange({ entrance: anim.id as any })}
                className={`p-2 rounded-lg border transition-colors flex flex-col items-center gap-1 ${
                  currentAnimation.entrance === anim.id
                    ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-white'
                    : 'border-[var(--color-gray-125)] bg-[var(--color-gray-150)] text-[var(--color-gray-75)] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px]">{anim.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Duration
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={currentAnimation.entranceDuration || 0.5}
            onChange={(e) => handleAnimationChange({ entranceDuration: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm text-white w-12">{currentAnimation.entranceDuration || 0.5}s</span>
        </div>
      </div>

      {/* Delay */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Delay
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={currentAnimation.entranceDelay || 0}
            onChange={(e) => handleAnimationChange({ entranceDelay: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm text-white w-12">{currentAnimation.entranceDelay || 0}s</span>
        </div>
      </div>

      {/* Stagger */}
      <div className="flex items-center justify-between p-3 bg-[var(--color-gray-150)] rounded-lg">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--color-accent-blue)]" />
          <span className="text-sm text-white">Stagger Children</span>
        </div>
        <button
          onClick={() => handleAnimationChange({ stagger: !currentAnimation.stagger })}
          className={`w-10 h-6 rounded-full transition-colors ${
            currentAnimation.stagger ? 'bg-[var(--color-accent-green)]' : 'bg-[var(--color-gray-125)]'
          }`}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full shadow-sm mx-0.5"
            animate={{ x: currentAnimation.stagger ? 16 : 0 }}
          />
        </button>
      </div>

      {currentAnimation.stagger && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
            Stagger Delay
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={currentAnimation.staggerDelay || 0.1}
              onChange={(e) => handleAnimationChange({ staggerDelay: parseFloat(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-white w-12">{currentAnimation.staggerDelay || 0.1}s</span>
          </div>
        </div>
      )}

      {/* Preview Button */}
      <button className="w-full h-10 rounded-lg bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)] text-sm font-medium hover:bg-[var(--color-accent-blue)]/30 transition-colors flex items-center justify-center gap-2">
        <Play className="w-4 h-4" />
        Preview Animation
      </button>
    </div>
  );
}

// Assets Tab Content
function AssetsEditContent({ block, handleChange }: {
  block: OnboardingBlock;
  handleChange: (field: string, value: unknown) => void;
}) {
  const [selectedField, setSelectedField] = useState<'backgroundImage' | 'foregroundImage' | 'logoUrl'>('backgroundImage');

  const assetFields = [
    { id: 'backgroundImage', label: 'Background Image' },
    { id: 'foregroundImage', label: 'Foreground Image' },
    { id: 'logoUrl', label: 'Logo' },
  ];

  return (
    <div className="space-y-6">
      {/* Asset Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Asset Type
        </label>
        <div className="flex gap-1 p-1 bg-[var(--color-gray-150)] rounded-lg">
          {assetFields.map((field) => (
            <button
              key={field.id}
              onClick={() => setSelectedField(field.id as any)}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                selectedField === field.id
                  ? 'bg-[var(--color-accent-blue)] text-white'
                  : 'text-[var(--color-gray-75)] hover:text-white'
              }`}
            >
              {field.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Asset Preview */}
      {block[selectedField] && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
            Current
          </label>
          <div className="relative aspect-video bg-[var(--color-gray-150)] rounded-xl overflow-hidden">
            <img
              src={block[selectedField] as string}
              alt="Current asset"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleChange(selectedField, undefined)}
              className="absolute top-2 right-2 w-6 h-6 bg-[var(--color-accent-red)] rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Upload */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Upload New
        </label>
        <div className="h-24 border-2 border-dashed border-[var(--color-gray-125)] rounded-xl flex items-center justify-center hover:border-[var(--color-accent-blue)] transition-colors cursor-pointer">
          <div className="text-center">
            <Upload className="w-6 h-6 text-[var(--color-gray-100)] mx-auto mb-1" />
            <span className="text-xs text-[var(--color-gray-100)]">Drop image or click to upload</span>
          </div>
        </div>
      </div>

      {/* X1 Library Quick Access */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          x1 Library
        </label>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {x1LibraryAssets.slice(0, 9).map((asset) => (
            <button
              key={asset.id}
              onClick={() => handleChange(selectedField, asset.url)}
              className="aspect-square bg-[var(--color-gray-150)] rounded-lg overflow-hidden border border-[var(--color-gray-125)] hover:border-[var(--color-accent-blue)] transition-colors"
            >
              <img
                src={asset.url}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
          Or paste URL
        </label>
        <input
          type="text"
          value={(block[selectedField] as string) || ''}
          onChange={(e) => handleChange(selectedField, e.target.value)}
          className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          placeholder="https://..."
        />
      </div>
    </div>
  );
}

export default function EditPanel({ block, onClose }: EditPanelProps) {
  const { updateBlock, removeBlock } = useOnboardingStore();
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const handleChange = (field: string, value: unknown) => {
    updateBlock(block.id, { [field]: value });
  };

  const handleStyleChange = (field: string, value: string) => {
    updateBlock(block.id, {
      style: { ...block.style, [field]: value },
    });
  };

  const handleAnimationChange = (animation: Partial<BlockAnimation>) => {
    updateBlock(block.id, {
      animation: { ...block.animation, ...animation },
    });
  };

  const applyColorPreset = (bg: string, accent: string, text: string) => {
    updateBlock(block.id, {
      style: {
        ...block.style,
        backgroundColor: bg,
        accentColor: accent,
        textColor: text,
      },
    });
  };

  const handleOptionChange = (optionId: string, text: string) => {
    if (block.options) {
      const newOptions = block.options.map((opt) =>
        opt.id === optionId ? { ...opt, text } : opt
      );
      updateBlock(block.id, { options: newOptions });
    }
  };

  const addOption = () => {
    if (block.options) {
      const newOption: SurveyOption = {
        id: Math.random().toString(36).substr(2, 9),
        text: `Option ${block.options.length + 1}`,
        selected: false,
      };
      updateBlock(block.id, { options: [...block.options, newOption] });
    }
  };

  const removeOption = (optionId: string) => {
    if (block.options && block.options.length > 2) {
      updateBlock(block.id, {
        options: block.options.filter((opt) => opt.id !== optionId),
      });
    }
  };

  const addFeature = () => {
    if (block.features) {
      updateBlock(block.id, {
        features: [...block.features, 'New feature'],
      });
    } else {
      updateBlock(block.id, {
        features: ['New feature'],
      });
    }
  };

  const removeFeature = (index: number) => {
    if (block.features && block.features.length > 1) {
      const newFeatures = [...block.features];
      newFeatures.splice(index, 1);
      updateBlock(block.id, { features: newFeatures });
    }
  };

  const updateFeature = (index: number, text: string) => {
    if (block.features) {
      const newFeatures = [...block.features];
      newFeatures[index] = text;
      updateBlock(block.id, { features: newFeatures });
    }
  };

  // Determine available tabs based on block type
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'animation', label: 'Animation', icon: Play },
    { id: 'assets', label: 'Assets', icon: Image },
  ];

  // Get block type label for header
  const getBlockTypeLabel = () => {
    switch (block.type) {
      case 'paywall': return 'Paywall';
      case 'value-prop': return block.variant === 'splash' ? 'Splash Screen' : 'Value Prop';
      case 'survey': return 'Survey';
      case 'permission': return 'Permission';
      case 'auth': return 'Authentication';
      default: return block.type;
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 bottom-0 w-[380px] bg-[var(--color-gray-175)] border-l border-[var(--color-gray-125)] z-50 flex flex-col"
    >
      {/* Header */}
      <div className="h-14 border-b border-[var(--color-gray-125)] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white">Edit {getBlockTypeLabel()}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-[var(--color-gray-150)] flex items-center justify-center hover:bg-[var(--color-gray-125)] transition-colors"
        >
          <X className="w-4 h-4 text-[var(--color-gray-75)]" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-gray-125)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 h-11 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-[var(--color-gray-75)] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="edit-tab-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--color-accent-blue)] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Type-specific content */}
              {block.type === 'paywall' && (
                <PaywallEditContent
                  block={block}
                  handleChange={handleChange}
                  updateFeature={updateFeature}
                  addFeature={addFeature}
                  removeFeature={removeFeature}
                />
              )}
              {block.type === 'value-prop' && (
                <SplashEditContent block={block} handleChange={handleChange} />
              )}
              {block.type === 'survey' && (
                <SurveyEditContent
                  block={block}
                  handleChange={handleChange}
                  handleOptionChange={handleOptionChange}
                  addOption={addOption}
                  removeOption={removeOption}
                />
              )}
              {block.type === 'permission' && (
                <PermissionEditContent block={block} handleChange={handleChange} />
              )}

              {/* Common: CTA Button */}
              <div className="space-y-2 mt-6 pt-6 border-t border-[var(--color-gray-125)]">
                <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
                  Button Text
                </label>
                <input
                  type="text"
                  value={block.ctaText || 'Continue'}
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                  className="w-full h-10 px-3 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'style' && (
            <motion.div
              key="style"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Color Presets */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
                  Color Theme
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyColorPreset(preset.bg, preset.accent, preset.text)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        block.style?.accentColor === preset.accent
                          ? 'border-white scale-105'
                          : 'border-transparent hover:border-[var(--color-gray-125)]'
                      }`}
                      title={preset.name}
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          background: `linear-gradient(135deg, ${preset.bg} 0%, ${preset.bg} 60%, ${preset.accent} 100%)`,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="space-y-4">
                <label className="text-xs font-medium text-[var(--color-gray-75)] uppercase tracking-wider">
                  Custom Colors
                </label>
                
                {[
                  { field: 'backgroundColor', label: 'Background', default: 'var(--color-base-black)' },
                  { field: 'accentColor', label: 'Accent', default: 'var(--color-accent-blue)' },
                  { field: 'textColor', label: 'Text', default: 'var(--color-base-white)' },
                ].map(({ field, label, default: defaultValue }) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-gray-75)]">{label}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(block.style as any)?.[field] || defaultValue}
                        onChange={(e) => handleStyleChange(field, e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={(block.style as any)?.[field] || defaultValue}
                        onChange={(e) => handleStyleChange(field, e.target.value)}
                        className="w-20 h-8 px-2 bg-[var(--color-gray-150)] border border-[var(--color-gray-125)] rounded text-white text-xs font-mono focus:outline-none focus:border-[var(--color-accent-blue)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'animation' && (
            <motion.div
              key="animation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AnimationEditContent block={block} handleAnimationChange={handleAnimationChange} />
            </motion.div>
          )}

          {activeTab === 'assets' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AssetsEditContent block={block} handleChange={handleChange} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--color-gray-125)]">
        <button
          onClick={() => {
            removeBlock(block.id);
            onClose();
          }}
          className="w-full h-10 rounded-lg bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)] text-sm font-medium hover:bg-[var(--color-accent-red)]/30 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Block
        </button>
      </div>
    </motion.div>
  );
}
