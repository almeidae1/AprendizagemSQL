
import React from 'react';
import { Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: Language.EN, label: 'EN' },
    { code: Language.PT, label: 'PT' },
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('languageSwitcherLabel')}</span>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-150 ease-in-out
            ${
              language === lang.code
                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-500 ring-offset-1 dark:ring-offset-slate-900'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }
          `}
          aria-pressed={language === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
