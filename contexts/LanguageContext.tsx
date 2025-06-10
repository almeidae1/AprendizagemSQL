
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { LOCAL_STORAGE_KEYS, DEFAULT_LANGUAGE, MAX_DAILY_PROBLEMS } from '../constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) as Language;
    return storedLang || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, language);
    document.documentElement.lang = language; // Set lang attribute on HTML element
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    const translationSet = translations[key];
    if (!translationSet) {
      console.warn(`Translation key "${key}" not found.`);
      return key; // Return key if not found
    }
    let text = translationSet[language] || translations[key][DEFAULT_LANGUAGE]; // Fallback to default lang
    
    // Automatically add MAX_DAILY_PROBLEMS if the key is dailyLimitReachedError
    const autoReplacements: Record<string, string | number> = { ...replacements };
    if (key === 'dailyLimitReachedError') {
        autoReplacements.maxProblems = MAX_DAILY_PROBLEMS;
    }

    if (autoReplacements) {
      Object.keys(autoReplacements).forEach(placeholder => {
        text = text.replace(`{${placeholder}}`, String(autoReplacements[placeholder]));
      });
    }
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
