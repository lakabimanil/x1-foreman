'use client';

import { useState, useRef, useEffect, KeyboardEvent, PointerEvent } from 'react';
import { motion } from 'framer-motion';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  multiline?: boolean;
  disabled?: boolean;
}

export default function EditableText({
  value,
  onChange,
  placeholder = 'Click to edit...',
  className = '',
  style = {},
  as: Component = 'span',
  multiline = false,
  disabled = false,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with external value changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handlePointerDown = (e: PointerEvent) => {
    if (disabled) return;
    // Stop propagation at the pointer level to prevent parent drag/click handlers
    e.stopPropagation();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue.trim() !== value) {
      onChange(editValue.trim() || placeholder);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };

  // Input styling to match text display
  const inputStyle: React.CSSProperties = {
    ...style,
    background: 'rgba(255,255,255,0.95)',
    border: '2px solid var(--color-accent-blue)',
    borderRadius: '6px',
    outline: 'none',
    width: '100%',
    resize: 'none',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
    textAlign: 'inherit',
    color: '#000',
    padding: '4px 8px',
    margin: '-4px -8px',
    boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
  };

  if (isEditing) {
    return (
      <div 
        ref={containerRef}
        className={`relative ${className}`}
        style={{ ...style, zIndex: 100 }}
        onPointerDown={handlePointerDown}
        onClick={(e) => e.stopPropagation()}
      >
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={inputStyle}
            className="min-h-[60px]"
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={inputStyle}
          />
        )}
      </div>
    );
  }

  return (
    <Component
      ref={containerRef as any}
      data-editable="true"
      className={`cursor-text hover:ring-2 hover:ring-[var(--color-accent-blue)]/50 hover:ring-offset-1 transition-all rounded px-1 -mx-1 ${className}`}
      style={{ ...style, position: 'relative' }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      title="Click to edit"
    >
      {value || <span className="opacity-50 italic">{placeholder}</span>}
    </Component>
  );
}

