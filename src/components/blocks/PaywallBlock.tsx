'use client';

import { useState, useEffect } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import type { OnboardingBlock } from '@/types';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import EditableText from './EditableText';

interface PaywallBlockProps {
  block: OnboardingBlock;
  isPreview?: boolean;
}

export default function PaywallBlock({ block, isPreview = false }: PaywallBlockProps) {
  const { updateBlock } = useOnboardingStore();
  const [canClose, setCanClose] = useState(false);
  const [isYearly, setIsYearly] = useState(true);
  const [trialEnabled, setTrialEnabled] = useState(true);
  const [countdown, setCountdown] = useState(block.closeDelay || 3);

  // Update handlers for inline editing
  const handleTitleChange = (value: string) => {
    updateBlock(block.id, { title: value });
  };

  const handleSubtitleChange = (value: string) => {
    updateBlock(block.id, { subtitle: value });
  };

  const handleCtaChange = (value: string) => {
    updateBlock(block.id, { ctaText: value });
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanClose(true);
    }
  }, [countdown]);

  const monthlyPrice = block.monthlyPrice || 9.99;
  const yearlyPrice = block.yearlyPrice || 19.99;
  const originalPrice = 29.99;

  return (
    <div className="w-full h-full flex flex-col bg-white p-6 relative">
      {/* Close Button */}
      <div className="absolute top-4 left-4 z-10">
        <button className="w-8 h-8 flex items-center justify-center text-black">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-12 mb-6 text-center">
        <div className="mb-8">
          <EditableText
            value={block.title || 'Your one-time offer'}
            onChange={handleTitleChange}
            placeholder="Enter title..."
            className="text-3xl font-bold text-black"
            as="h1"
          />
        </div>
        
        {/* Main Offer Card */}
        <div className="relative">
          {/* Sparkles decoration */}
          <Sparkles className="absolute -left-2 -top-4 w-8 h-8 text-black fill-current opacity-80" />
          <Sparkles className="absolute -right-2 top-8 w-6 h-6 text-gray-400 fill-current" />
          
          <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-3xl p-8 shadow-xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
            
            <div className="text-center space-y-2">
                <EditableText
                  value={block.subtitle || '80% OFF'}
                  onChange={handleSubtitleChange}
                  placeholder="Offer text..."
                  className="text-5xl font-extrabold tracking-tight text-white"
                  as="h2"
                />
                <h3 className="text-3xl font-bold tracking-widest text-gray-200">FOREVER</h3>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="flex items-center justify-center gap-3 mb-12">
            <span className="text-2xl font-bold text-gray-400 line-through decoration-2 decoration-black/20">${originalPrice}</span>
            <span className="text-2xl font-bold">${monthlyPrice} /mo</span>
        </div>

        <p className="text-gray-400 text-xs mb-8">
            Once you close your one-time offer, it's gone!<br/>
            Save 80% with yearly plan
        </p>
      </div>

      <div className="mt-auto">
        {/* Trial Toggle */}
        <div className="flex items-center justify-between mb-4 px-1">
            <span className="font-medium text-lg">Free Trial Enabled</span>
            <button 
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ${trialEnabled ? 'bg-black' : 'bg-gray-200'}`}
                onClick={() => setTrialEnabled(!trialEnabled)}
            >
                <div 
                    className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ${trialEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                />
            </button>
        </div>

        {/* Plan Selection Card */}
        <div className="border-2 border-black rounded-2xl p-4 mb-4 relative bg-white">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                3-DAY FREE TRIAL
            </div>
            <div className="flex justify-between items-center">
                <div className="text-left">
                    <div className="font-bold text-lg">Yearly Plan</div>
                    <div className="text-gray-500 text-sm">12mo • ${yearlyPrice}</div>
                </div>
                <div className="font-bold text-lg">${monthlyPrice} /mo</div>
            </div>
        </div>

        {/* CTA Button */}
        <button className="w-full h-14 bg-black text-white rounded-full font-bold text-lg shadow-lg mb-4 flex items-center justify-center">
            <EditableText
              value={block.ctaText || 'Start Free Trial'}
              onChange={handleCtaChange}
              placeholder="Button text..."
              className="text-white font-bold text-lg"
            />
        </button>

        <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Check className="w-4 h-4" />
            <span>No Commitment - Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
}
