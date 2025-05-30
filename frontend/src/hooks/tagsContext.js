'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './authcontext';

const TagsContext = createContext();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function TagsProvider({ children }) {
  const [tags, setTags] = useState([]);
  const { accessToken } = useAuth();

  const fetchTags = useCallback(async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/tags`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTags(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch tags");
        setTags([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setTags([]);
    }
  }, [accessToken]);

  return (
    <TagsContext.Provider value={{ tags, fetchTags }}>
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
}