'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Send,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  RotateCcw,
  Check,
} from 'lucide-react';
import type { GeneratedDocument, DocumentSection, ChatMessage } from '@/types/documentBuilder';

interface DocumentCanvasProps {
  document: GeneratedDocument;
  onSave: (document: GeneratedDocument) => void;
  onBack: () => void;
  onPublish?: () => void;
}

export function DocumentCanvas({ document, onSave, onBack, onPublish }: DocumentCanvasProps) {
  const [editedDocument, setEditedDocument] = useState<GeneratedDocument>(document);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `I've generated your ${document.type.replace('-', ' ')} based on your answers. You can edit any section directly, or ask me to make changes like:\n\n• "Make the data collection section more detailed"\n• "Add a section about cookies"\n• "Make this stricter for Apple review"`,
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingDiff, setPendingDiff] = useState<ChatMessage['diff'] | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSectionEdit = (sectionId: string, newContent: string) => {
    setEditedDocument(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, content: newContent } : s
      ),
    }));
    setHasUnsavedChanges(true);
  };
  
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isProcessing) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsProcessing(true);
    
    // Simulate AI response (in production, this would call an API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiResponse = generateAIResponse(chatInput, editedDocument);
    setChatMessages(prev => [...prev, aiResponse]);
    
    if (aiResponse.diff) {
      setPendingDiff(aiResponse.diff);
    }
    
    setIsProcessing(false);
  };
  
  const handleApplyDiff = () => {
    if (!pendingDiff) return;
    
    setEditedDocument(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === pendingDiff.sectionId 
          ? { ...s, content: pendingDiff.newContent } 
          : s
      ),
    }));
    
    // Mark the diff as applied in chat
    setChatMessages(prev => prev.map(m => 
      m.diff?.sectionId === pendingDiff.sectionId
        ? { ...m, diff: { ...m.diff, applied: true } }
        : m
    ));
    
    setPendingDiff(null);
    setHasUnsavedChanges(true);
  };
  
  const handleDismissDiff = () => {
    setPendingDiff(null);
  };
  
  const handleSave = () => {
    onSave(editedDocument);
    setHasUnsavedChanges(false);
  };
  
  return (
    <div className="h-full flex bg-black">
      {/* Left: Document Canvas */}
      <div className="flex-1 flex flex-col border-r border-neutral-800">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <div className="h-4 w-px bg-neutral-800" />
            <div>
              <h1 className="font-semibold text-white">{editedDocument.title}</h1>
              <p className="text-xs text-neutral-500">
                Last updated: {new Date(editedDocument.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            {onPublish && (
              <button
                onClick={onPublish}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Publish
              </button>
            )}
          </div>
        </header>
        
        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {/* Legal Disclaimer */}
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-8">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-200">
                <p className="font-medium mb-1">Not Legal Advice</p>
                <p className="text-amber-300/80">
                  This document is generated based on your inputs and templates. 
                  For legal compliance, consult with a qualified attorney.
                </p>
              </div>
            </div>
            
            {/* Sections */}
            <div className="space-y-6">
              {editedDocument.sections.map((section) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  isPendingChange={pendingDiff?.sectionId === section.id}
                  pendingContent={pendingDiff?.sectionId === section.id ? pendingDiff.newContent : undefined}
                  onSelect={() => setSelectedSectionId(section.id)}
                  onChange={(content) => handleSectionEdit(section.id, content)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right: Chat Panel */}
      <div className="w-[400px] flex flex-col bg-neutral-950">
        {/* Chat Header */}
        <header className="px-4 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm">Document Assistant</h2>
              <p className="text-xs text-neutral-500">Ask me to edit your document</p>
            </div>
          </div>
        </header>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              onApplyDiff={message.diff && !message.diff.applied ? handleApplyDiff : undefined}
              onDismissDiff={message.diff && !message.diff.applied ? handleDismissDiff : undefined}
            />
          ))}
          
          {isProcessing && (
            <div className="flex items-center gap-2 text-neutral-500">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-1"
              >
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <div className="w-2 h-2 rounded-full bg-violet-500" />
              </motion.div>
              <span className="text-sm">Thinking...</span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        {/* Pending Change Actions */}
        <AnimatePresence>
          {pendingDiff && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-4 py-3 bg-violet-500/10 border-t border-violet-500/20"
            >
              <p className="text-sm text-violet-300 mb-2">Apply suggested changes?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleApplyDiff}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm text-white font-medium transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Apply Changes
                </button>
                <button
                  onClick={handleDismissDiff}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-neutral-300 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Chat Input */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask me to make changes..."
              className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors text-sm"
              disabled={isProcessing}
            />
            <button
              onClick={handleChatSubmit}
              disabled={!chatInput.trim() || isProcessing}
              className={`p-3 rounded-xl transition-colors ${
                chatInput.trim() && !isProcessing
                  ? 'bg-violet-600 hover:bg-violet-500 text-white'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {['Make stricter for Apple', 'Add more detail', 'Simplify language'].map((action) => (
              <button
                key={action}
                onClick={() => setChatInput(action)}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs text-neutral-400 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Editor Component
interface SectionEditorProps {
  section: DocumentSection;
  isSelected: boolean;
  isPendingChange: boolean;
  pendingContent?: string;
  onSelect: () => void;
  onChange: (content: string) => void;
}

function SectionEditor({ 
  section, 
  isSelected, 
  isPendingChange,
  pendingContent,
  onSelect, 
  onChange 
}: SectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(section.content);
  
  const handleSaveEdit = () => {
    onChange(editContent);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditContent(section.content);
    setIsEditing(false);
  };
  
  return (
    <motion.div
      layout
      className={`rounded-xl border transition-all ${
        isPendingChange
          ? 'border-violet-500 bg-violet-500/5'
          : isSelected
          ? 'border-neutral-600 bg-neutral-900/50'
          : 'border-neutral-800 bg-neutral-900/30 hover:border-neutral-700'
      }`}
      onClick={onSelect}
    >
      {/* Section Header */}
      <div 
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className="text-neutral-500 hover:text-white transition-colors">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        <h3 className="font-medium text-white flex-1">{section.title}</h3>
        
        {/* Tags */}
        <div className="flex items-center gap-2">
          {section.appleTags?.map(tag => (
            <span 
              key={tag}
              className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {section.riskLevel === 'high' && (
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Important
            </span>
          )}
          {isPendingChange && (
            <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full">
              Pending change
            </span>
          )}
        </div>
      </div>
      
      {/* Section Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-40 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-neutral-600 resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="group relative"
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {/* Show pending change diff */}
                  {isPendingChange && pendingContent && (
                    <div className="mb-3 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                      <p className="text-xs text-violet-400 mb-2 font-medium">Suggested change:</p>
                      <p className="text-sm text-violet-200 whitespace-pre-wrap">{pendingContent}</p>
                    </div>
                  )}
                  
                  <div className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {section.content.split('\n').map((line, i) => {
                      // Handle markdown-style bold
                      const parts = line.split(/\*\*(.*?)\*\*/g);
                      return (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {parts.map((part, j) => 
                            j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part
                          )}
                        </p>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-400 hover:text-white transition-all"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Chat Bubble Component
interface ChatBubbleProps {
  message: ChatMessage;
  onApplyDiff?: () => void;
  onDismissDiff?: () => void;
}

function ChatBubble({ message, onApplyDiff, onDismissDiff }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-violet-600 text-white'
            : 'bg-neutral-800 text-neutral-200'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        {/* Show diff preview */}
        {message.diff && (
          <div className={`mt-3 p-3 rounded-lg ${
            message.diff.applied 
              ? 'bg-emerald-500/20 border border-emerald-500/30' 
              : 'bg-violet-500/20 border border-violet-500/30'
          }`}>
            <p className="text-xs font-medium mb-1 flex items-center gap-1">
              {message.diff.applied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Changes applied</span>
                </>
              ) : (
                <span className="text-violet-300">Suggested change:</span>
              )}
            </p>
            <p className="text-xs text-neutral-300 line-clamp-3">
              {message.diff.newContent.substring(0, 150)}...
            </p>
          </div>
        )}
        
        <p className={`text-xs mt-2 ${isUser ? 'text-violet-300' : 'text-neutral-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// Mock AI response generator
function generateAIResponse(userInput: string, document: GeneratedDocument): ChatMessage {
  const input = userInput.toLowerCase();
  
  // Find a relevant section to modify
  let targetSection = document.sections[0];
  let newContent = targetSection.content;
  let responseText = '';
  
  if (input.includes('stricter') || input.includes('apple')) {
    targetSection = document.sections.find(s => s.id === 'data-collection') || document.sections[0];
    newContent = targetSection.content + '\n\nWe implement industry-standard security measures to protect your data. All data transmission is encrypted using TLS 1.3, and we regularly audit our security practices.';
    responseText = `I've strengthened the "${targetSection.title}" section with additional security language that Apple reviewers like to see. This includes encryption details and security audit mentions.`;
  } else if (input.includes('detail') || input.includes('more')) {
    targetSection = document.sections.find(s => s.id === 'data-collection') || document.sections[0];
    newContent = targetSection.content.replace(
      'We may collect',
      'To provide you with the best experience, we may collect'
    ) + '\n\nThis data helps us personalize your experience and improve our services.';
    responseText = `I've added more context to the "${targetSection.title}" section explaining why we collect data and how it benefits users.`;
  } else if (input.includes('simplify') || input.includes('simple')) {
    targetSection = document.sections[0];
    newContent = `${document.schema.companyName} ("we") operates ${document.schema.appName}. This policy explains how we handle your data.`;
    responseText = `I've simplified the introduction to be more concise and user-friendly.`;
  } else {
    responseText = `I understand you want to make changes. Could you be more specific? For example:\n\n• "Make the data collection section more detailed"\n• "Add stronger language about security"\n• "Simplify the introduction"`;
    
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
    };
  }
  
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: responseText,
    timestamp: new Date(),
    diff: {
      sectionId: targetSection.id,
      oldContent: targetSection.content,
      newContent,
      applied: false,
    },
  };
}

export default DocumentCanvas;
