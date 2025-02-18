import React, { createContext, useState, useCallback } from 'react';

interface KeywordMappingContextType {
  keywordToIdMap: Record<string, string>;
  addMapping: (keyword: string, id: string | number) => void;
  addMappings: (mappings: Array<{ keyword: string; id: string | number }>) => void;
}

const KeywordMappingContext = createContext<KeywordMappingContextType>({
  keywordToIdMap: {},
  addMapping: () => {},
  addMappings: () => {},
});

export const KeywordMappingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keywordToIdMap, setKeywordToIdMap] = useState<Record<string, string>>({});

  const addMapping = useCallback((keyword: string, id: string | number) => {
    setKeywordToIdMap(prev => {
      const stringId = String(id);
      if (prev[keyword] === stringId) return prev; // Prevent unnecessary updates
      return { ...prev, [keyword]: stringId };
    });
  }, []);

  const addMappings = useCallback((mappings: Array<{ keyword: string; id: string | number }>) => {
    setKeywordToIdMap(prev => {
      const updates: Record<string, string> = {};
      let hasChanges = false;

      mappings.forEach(({ keyword, id }) => {
        const stringId = String(id);
        if (prev[keyword] !== stringId) {
          updates[keyword] = stringId;
          hasChanges = true;
        }
      });

      return hasChanges ? { ...prev, ...updates } : prev;
    });
  }, []);

  return (
    <KeywordMappingContext.Provider value={{ keywordToIdMap, addMapping, addMappings }}>
      {children}
    </KeywordMappingContext.Provider>
  );
};

export { KeywordMappingContext };