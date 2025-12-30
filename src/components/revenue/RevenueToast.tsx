'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';

export default function RevenueToast() {
  const { toastMessage, clearToast } = useRevenueStore();
  
  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-150 border border-gray-125 rounded-xl shadow-2xl">
            <div className="w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-accent-green" />
            </div>
            <p className="text-sm text-white font-medium">{toastMessage}</p>
            <button
              onClick={clearToast}
              className="w-6 h-6 rounded-full bg-gray-125 flex items-center justify-center text-gray-75 hover:text-white transition-colors ml-2"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
