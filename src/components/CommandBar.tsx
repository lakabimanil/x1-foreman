'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export default function CommandBar() {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isTyping, processCommand } = useOnboardingStore();

  useEffect(() => {
    if (messagesEndRef.current && isExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const command = input;
    setInput('');
    setShowSuggestions(false);
    await processCommand(command);
  };

  const suggestions = [
    "Add quiz",
    "Add paywall",
    "Add notifications",
    "Add auth",
  ];

  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-xl mx-auto pointer-events-auto"
      >
        {/* Chat History */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 280 }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 bg-[var(--color-gray-150)] backdrop-blur-xl rounded-xl border border-[var(--color-gray-125)] overflow-hidden shadow-2xl"
            >
              <div className="h-full overflow-y-auto p-3 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <Sparkles className="w-8 h-8 text-[var(--color-accent-blue)] mb-3" />
                    <p className="text-sm text-[var(--color-gray-75)]">Start a conversation with the Foreman</p>
                    <p className="text-xs text-[var(--color-gray-100)] mt-1">Ask to add blocks, customize screens, etc.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                          message.role === 'user'
                            ? 'bg-[var(--color-accent-blue)] text-white rounded-br-sm'
                            : 'bg-[var(--color-gray-125)] text-white rounded-bl-sm'
                        }`}
                      >
                        {message.role === 'foreman' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles className="w-3 h-3 text-[var(--color-accent-yellow)]" />
                            <span className="text-[10px] font-medium text-[var(--color-gray-75)]">Foreman</span>
                          </div>
                        )}
                        <p className="leading-relaxed">{message.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className="bg-[var(--color-gray-125)] px-3 py-2 rounded-xl rounded-bl-sm">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[var(--color-accent-yellow)]" />
                          <div className="flex gap-1">
                            <motion.span
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                              className="w-1.5 h-1.5 bg-[var(--color-gray-75)] rounded-full"
                            />
                            <motion.span
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                              className="w-1.5 h-1.5 bg-[var(--color-gray-75)] rounded-full"
                            />
                            <motion.span
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                              className="w-1.5 h-1.5 bg-[var(--color-gray-75)] rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <form onSubmit={handleSubmit}>
          <div className="relative bg-[var(--color-gray-150)] backdrop-blur-xl rounded-xl border border-[var(--color-gray-125)] shadow-2xl overflow-hidden">
            {/* Main Input Row */}
            <div className="flex items-center gap-2 px-3 py-2.5">
              {/* Expand Toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 rounded-lg bg-[var(--color-gray-125)] flex items-center justify-center hover:bg-[var(--color-gray-125)] transition-colors flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-[var(--color-gray-75)]" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-[var(--color-gray-75)]" />
                )}
              </button>

              {/* Sparkle Icon */}
              <Sparkles className="w-4 h-4 text-[var(--color-accent-blue)] flex-shrink-0" />
              
              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the Foreman..."
                className="flex-1 bg-transparent text-white placeholder-[var(--color-gray-100)] outline-none text-sm min-w-0"
                disabled={isTyping}
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                  input.trim() && !isTyping
                    ? 'bg-[var(--color-accent-blue)] text-white'
                    : 'bg-[var(--color-gray-125)] text-[var(--color-gray-100)]'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Quick Suggestions - Compact inline */}
            <AnimatePresence>
              {!isExpanded && showSuggestions && input === '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-[var(--color-gray-125)]"
                >
                  <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    <span className="text-[10px] text-[var(--color-gray-100)] flex-shrink-0">Try:</span>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="flex-shrink-0 px-2.5 py-1 bg-[var(--color-gray-125)] rounded-md text-xs text-[var(--color-gray-75)] hover:text-white hover:bg-[var(--color-gray-125)] transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[var(--color-gray-100)] hover:text-white hover:bg-[var(--color-gray-125)] transition-all ml-auto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

