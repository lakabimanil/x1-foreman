'use client';

import { motion } from 'framer-motion';
import { Apple, Mail, Chrome } from 'lucide-react';
import type { OnboardingBlock } from '@/types';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import EditableText from './EditableText';

interface AuthBlockProps {
  block: OnboardingBlock;
  isPreview?: boolean;
}

export default function AuthBlock({ block, isPreview = false }: AuthBlockProps) {
  const { updateBlock } = useOnboardingStore();
  const bgColor = block.style?.backgroundColor || 'var(--color-base-black)';
  const accentColor = block.style?.accentColor || 'var(--color-accent-blue)';
  const textColor = block.style?.textColor || 'var(--color-base-white)';
  const secondaryText = `${textColor}99`;
  const scale = isPreview ? 1 : 0.85;

  // Update handlers for inline editing
  const handleTitleChange = (value: string) => {
    updateBlock(block.id, { title: value });
  };

  const handleSubtitleChange = (value: string) => {
    updateBlock(block.id, { subtitle: value });
  };
  
  return (
    <motion.div 
      className={`w-full h-full flex flex-col items-center justify-center p-6 ${isPreview ? 'px-8' : 'px-4'}`}
      style={{ backgroundColor: bgColor, transform: `scale(${scale})` }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[280px]">
        {/* App Icon Placeholder */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-20 h-20 rounded-[22px] mb-6 shadow-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` }}
        >
          <span className="text-3xl font-bold text-white">x1</span>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-2"
        >
          <EditableText
            value={block.title || 'Welcome'}
            onChange={handleTitleChange}
            placeholder="Enter title..."
            className="text-2xl font-bold"
            style={{ color: textColor }}
            as="h2"
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center mb-8"
        >
          <EditableText
            value={block.subtitle || 'Sign in to continue'}
            onChange={handleSubtitleChange}
            placeholder="Enter subtitle..."
            style={{ color: secondaryText }}
            as="p"
          />
        </motion.div>
        
        <div className="w-full space-y-3">
          {block.authMethods?.includes('apple') && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 bg-white text-black rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <Apple className="w-5 h-5" />
              Sign in with Apple
            </motion.button>
          )}
          
          {block.authMethods?.includes('google') && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 border rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ borderColor: `${textColor}30`, color: textColor }}
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </motion.button>
          )}
          
          {block.authMethods?.includes('email') && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 border rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ borderColor: `${textColor}30`, color: textColor }}
            >
              <Mail className="w-5 h-5" />
              Continue with Email
            </motion.button>
          )}
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs text-center mt-auto"
        style={{ color: `${textColor}60` }}
      >
        By continuing, you agree to our Terms & Privacy Policy
      </motion.p>
    </motion.div>
  );
}
