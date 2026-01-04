"use client";

import { useState, useEffect, useRef } from 'react';
import { useDraftSave } from '../hooks/useDraftSave';

interface GuestChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export default function GuestChatInput({ onSend, isLoading = false }: GuestChatInputProps) {
  const { draft, saveDraft, clearDraft } = useDraftSave();
  const [input, setInput] = useState(draft);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync with hook draft
  useEffect(() => {
    setInput(draft);
  }, [draft]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    saveDraft(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSend(input.trim());
    clearDraft();
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Auto-saved for guests)"
          className="w-full min-h-[60px] max-h-[200px] resize-none rounded-lg border p-4 pr-12"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-3 bottom-3 rounded bg-blue-500 p-2 text-white disabled:bg-gray-400"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
      
      {draft && (
        <div className="mt-2 text-sm text-gray-500 flex justify-between items-center">
          <span>💾 Draft saved locally</span>
          <button
            type="button"
            onClick={clearDraft}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Clear draft
          </button>
        </div>
      )}
    </form>
  );
}