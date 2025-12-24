'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Apple, Activity, Camera } from 'lucide-react';
import type { OnboardingBlock } from '@/types';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import EditableText from './EditableText';

interface ValuePropBlockProps {
  block: OnboardingBlock;
  isPreview?: boolean;
}

export default function ValuePropBlock({ block, isPreview = false }: ValuePropBlockProps) {
  const { updateBlock } = useOnboardingStore();
  const bgColor = block.style?.backgroundColor || 'var(--color-base-white)';
  const accentColor = block.style?.accentColor || 'var(--color-base-black)';
  const textColor = block.style?.textColor || 'var(--color-base-black)';

  // Update handlers for inline editing
  const handleHeadingChange = (value: string) => {
    updateBlock(block.id, { heading: value });
  };

  const handleDescriptionChange = (value: string) => {
    updateBlock(block.id, { description: value });
  };

  const handleCtaChange = (value: string) => {
    updateBlock(block.id, { ctaText: value });
  };

  const handleTitleChange = (value: string) => {
    updateBlock(block.id, { title: value });
  };

  // Splash Screen Variant
  if (block.variant === 'splash') {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center p-6 bg-white"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <Apple className="w-16 h-16 fill-black text-black" />
          <EditableText
            value={block.heading || block.title || 'Cal AI'}
            onChange={handleHeadingChange}
            placeholder="App name..."
            className="text-5xl font-bold tracking-tight text-black"
          />
        </motion.div>
      </div>
    );
  }

  // Graph Variant
  if (block.variant === 'graph') {
    return (
      <div className="w-full h-full flex flex-col p-6 bg-white">
        <div className="mt-8 mb-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <EditableText
              value={block.heading || ''}
              onChange={handleHeadingChange}
              placeholder="Enter heading..."
              className="text-3xl font-bold mb-4 leading-tight text-black block"
              as="h1"
            />
          </motion.div>
        </div>

        <motion.div 
          className="flex-1 w-full bg-gray-50 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-2 absolute top-6 left-6">Your weight</h3>
          
          <div className="relative h-64 w-full">
            {/* Graph Lines (SVG) */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150" preserveAspectRatio="none">
              {/* Traditional Diet (Red) - Starts flat/dip then up */}
              <motion.path
                d="M0,50 C60,50 100,50 150,80 C200,110 250,30 300,20"
                fill="none"
                stroke="var(--color-accent-red)"
                strokeWidth="3"
                strokeDasharray="400"
                initial={{ strokeDashoffset: 400 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              {/* Cal AI (Black) - Starts with red then goes down */}
              <motion.path
                d="M0,50 C60,50 100,60 150,90 C200,130 250,140 300,140"
                fill="none"
                stroke="var(--color-base-black)"
                strokeWidth="3"
                strokeDasharray="400"
                initial={{ strokeDashoffset: 400 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
            
            {/* Labels */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-[15%] right-[5%] text-xs text-[var(--color-accent-red)] font-medium bg-white/90 px-2 py-1 rounded-md shadow-sm"
            >
              Traditional diet
            </motion.div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-[10%] left-[30%] text-xs text-white font-medium bg-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md"
            >
              <Apple className="w-3 h-3 fill-white" /> Cal AI
            </motion.div>
            
            {/* Axis Dots */}
            <div className="absolute left-0 top-[33%] w-3 h-3 bg-white border-2 border-black rounded-full z-10" />
            <div className="absolute right-0 bottom-[6%] w-3 h-3 bg-white border-2 border-black rounded-full z-10" />
          </div>
          
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            <span>Month 1</span>
            <span>Month 6</span>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600 font-medium leading-relaxed px-4">
            <EditableText
              value={block.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Enter description..."
              className="text-sm text-gray-600 font-medium leading-relaxed"
              multiline
            />
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full h-14 bg-black text-white rounded-full font-bold text-lg mt-6 shadow-lg flex items-center justify-center"
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

  // Default / Image Variant (Welcome)
  return (
    <motion.div 
      className="w-full h-full flex flex-col bg-white relative"
    >
      {/* Image Placeholder Area - Taller */}
      <div className="absolute inset-x-0 top-0 h-[75%] z-0">
        <div className="w-full h-full bg-gray-100 relative">
            {/* Simulating the camera view/food scan */}
            <div className="relative w-full h-full overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" 
                    alt="Food" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
                
                {/* Camera UI Overlay - Specific Corners */}
                <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-center items-center">
                    <div className="w-64 h-64 relative">
                        {/* Top Left */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl shadow-sm" />
                        {/* Top Right */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl shadow-sm" />
                        {/* Bottom Left */}
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl shadow-sm" />
                        {/* Bottom Right */}
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl shadow-sm" />
                        
                        {/* Scanning Bar Animation */}
                        <motion.div 
                            className="absolute left-0 right-0 h-0.5 bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            animate={{ top: ['10%', '90%', '10%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    
                    {/* Floating pill */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                    >
                        <Activity className="w-4 h-4 text-black" />
                        <span className="text-xs font-bold text-black">Scan Food</span>
                    </motion.div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 z-10" /> {/* Spacer */}

      {/* Bottom Sheet Content - Compact */}
      <div className="bg-white rounded-t-[32px] p-6 pb-12 z-10 relative">
        {/* Gradient fade from image to white */}
        <div className="absolute -top-24 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent" />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <EditableText
            value={block.heading || ''}
            onChange={handleHeadingChange}
            placeholder="Enter heading..."
            className="text-3xl font-extrabold leading-tight tracking-tight text-black block"
            as="h1"
          />
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full h-14 bg-black text-white rounded-full font-bold text-lg mb-6 shadow-xl flex items-center justify-center"
        >
          <EditableText
            value={block.ctaText || 'Get Started'}
            onChange={handleCtaChange}
            placeholder="Button text..."
            className="text-white font-bold text-lg"
          />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm font-medium flex items-center justify-center gap-1"
        >
          <span className="text-gray-500">Already have an account?</span>
          <button className="text-black font-bold hover:underline">Sign In</button>
        </motion.div>
      </div>
    </motion.div>
  );
}
