"use client";

import { useState, useEffect } from 'react';

export function useDraftSave() {
  const [draft, setDraft] = useState('');

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem('guest_draft');
    if (saved) {
      setDraft(saved);
    }
  }, []);

  // Save draft whenever it changes
  const saveDraft = (text: string) => {
    setDraft(text);
    localStorage.setItem('guest_draft', text);
  };

  // Clear draft
  const clearDraft = () => {
    setDraft('');
    localStorage.removeItem('guest_draft');
  };

  return { draft, saveDraft, clearDraft };
}