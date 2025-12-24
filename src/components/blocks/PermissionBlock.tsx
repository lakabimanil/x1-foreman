'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, MapPin, Camera } from 'lucide-react';
import type { OnboardingBlock } from '@/types';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import EditableText from './EditableText';

interface PermissionBlockProps {
  block: OnboardingBlock;
  isPreview?: boolean;
}

const permissionIcons = {
  notifications: Bell,
  att: Shield,
  location: MapPin,
  camera: Camera,
};

export default function PermissionBlock({ block, isPreview = false }: PermissionBlockProps) {
  const { updateBlock } = useOnboardingStore();
  const [showSystemDialog, setShowSystemDialog] = useState(false);
  
  const bgColor = block.style?.backgroundColor || 'var(--color-base-black)';
  const accentColor = block.style?.accentColor || 'var(--color-accent-red)';
  const textColor = block.style?.textColor || 'var(--color-base-white)';
  const secondaryText = `${textColor}99`;
  
  const Icon = permissionIcons[block.permissionType || 'notifications'];

  // Update handlers for inline editing
  const handleTitleChange = (value: string) => {
    updateBlock(block.id, { title: value });
  };

  const handleCtaChange = (value: string) => {
    updateBlock(block.id, { ctaText: value });
  };

  const handleSecondaryCtaChange = (value: string) => {
    updateBlock(block.id, { secondaryCtaText: value });
  };

  return (
    <motion.div 
      className={`w-full h-full flex flex-col items-center justify-center p-6 ${isPreview ? 'px-8' : 'px-4'}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex-1 flex flex-col items-center justify-center max-w-[280px] text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full mb-8 flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <Icon className="w-12 h-12" style={{ color: accentColor }} />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-3"
        >
          <EditableText
            value={block.title || 'Stay Updated'}
            onChange={handleTitleChange}
            placeholder="Enter title..."
            className="text-2xl font-bold"
            style={{ color: textColor }}
            as="h2"
          />
        </motion.div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 leading-relaxed"
          style={{ color: secondaryText }}
        >
          Get personalized reminders and updates to help you stay on track with your goals.
        </motion.p>
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowSystemDialog(true)}
          className="w-full h-14 text-white rounded-2xl font-semibold text-lg flex items-center justify-center"
          style={{ backgroundColor: accentColor }}
        >
          <EditableText
            value={block.ctaText || `Enable ${block.permissionType === 'att' ? 'Tracking' : 'Notifications'}`}
            onChange={handleCtaChange}
            placeholder="Button text..."
            className="text-white font-semibold text-lg"
          />
        </motion.button>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-4"
        >
          <EditableText
            value={block.secondaryCtaText || 'Maybe Later'}
            onChange={handleSecondaryCtaChange}
            placeholder="Secondary button..."
            className="text-sm transition-colors"
            style={{ color: secondaryText }}
          />
        </motion.div>
      </div>

      {/* Native iOS Dialog Simulation */}
      <AnimatePresence>
        {showSystemDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowSystemDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[270px] bg-[var(--color-gray-150)]/95 backdrop-blur-xl rounded-2xl overflow-hidden"
            >
              <div className="p-5 text-center">
                <h3 className="text-[17px] font-semibold text-white mb-1">
                  {block.permissionTitle || '"YourApp" Would Like to Send You Notifications'}
                </h3>
                <p className="text-[13px] text-[var(--color-gray-75)]">
                  {block.permissionBody || 'Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.'}
                </p>
              </div>
              
              <div className="border-t border-[var(--color-gray-125)]">
                <button 
                  onClick={() => setShowSystemDialog(false)}
                  className="w-full py-3 text-[17px] text-[var(--color-accent-blue)] font-normal border-b border-[var(--color-gray-125)] hover:bg-[var(--color-gray-125)]/30 transition-colors"
                >
                  Don't Allow
                </button>
                <button 
                  onClick={() => setShowSystemDialog(false)}
                  className="w-full py-3 text-[17px] text-[var(--color-accent-blue)] font-semibold hover:bg-[var(--color-gray-125)]/30 transition-colors"
                >
                  Allow
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
