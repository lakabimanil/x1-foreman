'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Instagram, Tv, Users, Facebook, Youtube, Music, Rabbit, Zap, Turtle } from 'lucide-react';
import type { OnboardingBlock, SurveyOption } from '@/types';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import EditableText from './EditableText';

interface SurveyBlockProps {
  block: OnboardingBlock;
  isPreview?: boolean;
}

const iconMap: Record<string, any> = {
  instagram: Instagram,
  tv: Tv,
  friend: Users,
  users: Users,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Music,
  music: Music,
  rabbit: Rabbit,
  turtle: Turtle,
  zap: Zap,
};

export default function SurveyBlock({ block, isPreview = false }: SurveyBlockProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const { updateBlock } = useOnboardingStore();
  const [sliderValue, setSliderValue] = useState(0.8);

  // Update handlers for inline editing
  const handleQuestionChange = (value: string) => {
    updateBlock(block.id, { question: value });
  };

  const handleSubtitleChange = (value: string) => {
    updateBlock(block.id, { subtitle: value });
  };

  const handleCtaChange = (value: string) => {
    updateBlock(block.id, { ctaText: value });
  };

  const handleOptionTextChange = (optionId: string, newText: string) => {
    const newOptions = block.options?.map((opt: SurveyOption) => 
      opt.id === optionId ? { ...opt, text: newText } : opt
    );
    updateBlock(block.id, { options: newOptions });
  };

  const bgColor = block.style?.backgroundColor || 'var(--color-base-white)';
  const accentColor = block.style?.accentColor || 'var(--color-base-black)';
  const textColor = block.style?.textColor || 'var(--color-base-black)';

  const handleSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSet = new Set(prev);
      if (block.multiSelect) {
        if (newSet.has(optionId)) {
          newSet.delete(optionId);
        } else {
          newSet.add(optionId);
        }
      } else {
        newSet.clear();
        newSet.add(optionId);
      }
      return newSet;
    });
  };

  // Slider Variant (Goal Speed)
  if (block.variant === 'slider') {
    return (
      <div 
        className="w-full h-full flex flex-col p-6 bg-white"
        style={{ backgroundColor: bgColor }}
      >
        <div className="mt-4 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <EditableText
              value={block.question || ''}
              onChange={handleQuestionChange}
              placeholder="Enter question..."
              className="text-3xl font-bold mb-3 block"
              style={{ color: textColor }}
              as="h2"
            />
          </motion.div>
          <EditableText
            value={block.subtitle || ''}
            onChange={handleSubtitleChange}
            placeholder="Enter subtitle..."
            className="text-gray-500 font-medium block"
            as="p"
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          {/* Dynamic Value Display */}
          <motion.div 
            className="text-6xl font-extrabold mb-12 tracking-tight"
            key={sliderValue}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {sliderValue.toFixed(1)} kg
          </motion.div>

          {/* Icons Row */}
          <div className="flex justify-between w-full px-4 mb-8">
            <Turtle className={`w-8 h-8 ${sliderValue <= 0.4 ? 'text-black' : 'text-gray-300'} transition-colors duration-300`} />
            <Rabbit className={`w-8 h-8 ${sliderValue > 0.4 && sliderValue < 1.2 ? 'text-black' : 'text-gray-300'} transition-colors duration-300`} />
            <Zap className={`w-8 h-8 ${sliderValue >= 1.2 ? 'text-black' : 'text-gray-300'} transition-colors duration-300`} />
          </div>

          {/* Slider Component */}
          <div className="relative w-full h-12 flex items-center">
            {/* Track */}
            <div className="absolute inset-x-0 h-2 bg-gray-100 rounded-full overflow-hidden">
               <motion.div 
                  className="h-full bg-black rounded-full"
                  style={{ width: `${(sliderValue / 1.6) * 100}%` }}
               />
            </div>
            
            {/* Thumb - Using native input for simplicity + interactivity */}
            <input 
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            
            {/* Visual Thumb */}
            <motion.div 
              className="absolute h-8 w-8 bg-white border-4 border-black rounded-full shadow-lg pointer-events-none"
              style={{ left: `calc(${(sliderValue / 1.6) * 100}% - 16px)` }}
              animate={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>

          {/* Labels */}
          <div className="flex justify-between w-full mt-4 px-1 text-sm font-medium text-gray-400">
            <span>0.1 kg</span>
            <span className="text-black">0.8 kg</span>
            <span>1.5 kg</span>
          </div>
          
          <div className="mt-8 px-6 py-2 bg-gray-50 rounded-full text-sm text-gray-500 font-medium">
             {sliderValue === 0.8 ? 'Recommended' : sliderValue < 0.5 ? 'Slow & Steady' : 'Aggressive'}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-14 bg-black text-white rounded-full font-bold text-lg mt-auto shadow-lg flex items-center justify-center"
        >
          <EditableText
            value={block.ctaText || 'Continue'}
            onChange={handleCtaChange}
            placeholder="Button text..."
            className="text-white font-bold text-lg"
          />
        </motion.button>
      </div>
    );
  }

  // Picker Variant (Height/Weight)
  if (block.variant === 'picker') {
    return (
        <div 
          className="w-full h-full flex flex-col p-6 bg-white"
          style={{ backgroundColor: bgColor }}
        >
            <div className="mt-4 mb-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <EditableText
                        value={block.question || (block.title === 'Measurements' ? 'Height & weight' : '')}
                        onChange={handleQuestionChange}
                        placeholder="Enter question..."
                        className="text-3xl font-bold mb-3 block"
                        style={{ color: textColor }}
                        as="h2"
                    />
                </motion.div>
                <EditableText
                    value={block.subtitle || ''}
                    onChange={handleSubtitleChange}
                    placeholder="Enter subtitle..."
                    className="text-gray-500 font-medium block"
                    as="p"
                />
            </div>

            {/* Toggle Switch */}
            <div className="flex justify-center mb-12">
                <div className="bg-gray-100 p-1 rounded-full flex gap-1 relative">
                    <motion.div 
                        layoutId="active-toggle"
                        className="absolute left-1 top-1 bottom-1 w-[88px] bg-white rounded-full shadow-sm z-0" 
                    />
                    <button className="relative z-10 w-[88px] py-2 rounded-full font-bold text-black text-sm">Imperial</button>
                    <button className="relative z-10 w-[88px] py-2 rounded-full font-medium text-gray-400 text-sm">Metric</button>
                </div>
            </div>

            {/* Picker Columns */}
            <div className="flex-1 flex gap-8 justify-center items-center relative">
                {/* Gradient Masks */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
                
                {/* Selection Highlight */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-14 bg-gray-50 rounded-xl -z-10" />

                {/* Height Column */}
                <div className="w-24 h-64 overflow-hidden relative text-center">
                    <div className="flex flex-col items-center gap-5 py-24 opacity-30">
                        <div className="text-2xl font-medium">4 ft</div>
                        <div className="text-2xl font-medium">5 ft</div>
                        <div className="text-2xl font-medium">6 ft</div>
                        <div className="text-2xl font-medium">7 ft</div>
                    </div>
                    {/* Active Item Overlay */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 text-3xl font-bold text-black">
                        5 ft
                    </div>
                </div>
                
                {/* Weight Column */}
                <div className="w-24 h-64 overflow-hidden relative text-center">
                    <div className="flex flex-col items-center gap-5 py-24">
                        <div className="text-2xl font-medium text-gray-300">118 lb</div>
                        <div className="text-2xl font-medium text-gray-300">119 lb</div>
                        {/* Spacer for active item */}
                        <div className="h-8" />
                        <div className="text-2xl font-medium text-gray-300">121 lb</div>
                        <div className="text-2xl font-medium text-gray-300">122 lb</div>
                    </div>
                     {/* Active Item Overlay */}
                     <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 text-3xl font-bold text-black">
                        120 lb
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 bg-black text-white rounded-full font-bold text-lg mt-auto shadow-lg flex items-center justify-center gap-2"
            >
                {/* Small Survey Icon */}
                <div className="w-5 h-5 bg-green-900 rounded-sm flex items-center justify-center">
                    <span className="text-[10px] text-green-400 font-bold">S</span>
                </div>
                <EditableText
                    value={block.ctaText || 'Continue'}
                    onChange={handleCtaChange}
                    placeholder="Button text..."
                    className="text-white font-bold text-lg"
                />
            </motion.button>
        </div>
    );
  }

  // Cards Variant (Default)
  return (
    <div 
      className="w-full h-full flex flex-col p-6 bg-white"
      style={{ backgroundColor: bgColor }}
    >
      <div className="mt-4 mb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <EditableText
            value={block.question || ''}
            onChange={handleQuestionChange}
            placeholder="Enter question..."
            className="text-3xl font-bold mb-3 leading-tight block"
            style={{ color: textColor }}
            as="h2"
          />
        </motion.div>
        <EditableText
          value={block.subtitle || ''}
          onChange={handleSubtitleChange}
          placeholder="Enter subtitle..."
          className="text-gray-500 font-medium block"
          as="p"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {block.options?.map((option, index) => {
          const isSelected = selectedOptions.has(option.id) || option.selected;
          const Icon = option.icon ? iconMap[option.icon] : null;

          return (
            <motion.div
              key={option.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(option.id)}
              className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all duration-200 border-2 cursor-pointer ${
                  isSelected 
                    ? 'bg-black text-white border-black shadow-lg' 
                    : 'bg-white text-black border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:bg-gray-50'
              }`}
            >
                {Icon && (
                    <div className={`p-2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-gray-100'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <EditableText
                  value={option.text}
                  onChange={(newText) => handleOptionTextChange(option.id, newText)}
                  placeholder="Option text..."
                  className="text-lg font-bold flex-1"
                />
                {isSelected && !Icon && <Check className="w-5 h-5 ml-auto" />}
            </motion.div>
          );
        })}
      </div>
      
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-14 bg-black text-white rounded-full font-bold text-lg shadow-xl flex items-center justify-center gap-2"
      >
        {/* Footer Icon simulation (Survey) */}
        <div className="w-6 h-6 bg-green-900 rounded-md flex items-center justify-center mr-2">
             <span className="text-[10px] text-green-400 font-bold">S</span>
        </div>
        <EditableText
          value={block.ctaText || 'Continue'}
          onChange={handleCtaChange}
          placeholder="Button text..."
          className="text-white font-bold text-lg"
        />
      </motion.button>
    </div>
  );
}
