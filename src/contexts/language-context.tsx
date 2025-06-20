
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import zhCNTranslations from '@/locales/zh-CN.json';
import enUSTranslations from '@/locales/en-US.json';

export type SupportedLanguage = 'zh-CN' | 'en-US';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: Dispatch<SetStateAction<SupportedLanguage>>;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLabel: (key: string) => string; // For dynamic labels like tool options
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<SupportedLanguage, Record<string, string>> = {
  'zh-CN': zhCNTranslations,
  'en-US': enUSTranslations,
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('zh-CN');

  useEffect(() => {
    const storedLang = localStorage.getItem('appLanguage') as SupportedLanguage | null;
    if (storedLang && translations[storedLang]) {
      setLanguage(storedLang);
    } else {
      const browserLang = navigator.language;
      if (browserLang.startsWith('en')) {
        setLanguage('en-US');
      } else {
        setLanguage('zh-CN'); // Default to Chinese
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params: Record<string, string | number> = {}): string => {
    let translation = translations[language][key] || translations['en-US'][key] || key; // Fallback to English then key
    Object.keys(params).forEach(paramKey => {
      translation = translation.replace(`{${paramKey}}`, String(params[paramKey]));
    });
    return translation;
  };

  const getLabel = (key: string): string => {
    // This function assumes labels are simple strings and directly available
    // For AIToolOptions and TargetStyleOptions, the key will be like "aiTool.styleTransformer"
    return translations[language][key] || translations['en-US'][key] || key.split('.').pop() || key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLabel }}>
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
