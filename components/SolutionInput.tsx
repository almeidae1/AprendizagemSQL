
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SolutionInputProps {
  solution: string;
  onSolutionChange: (solution: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const SolutionInput: React.FC<SolutionInputProps> = ({
  solution,
  onSolutionChange,
  onSubmit,
  disabled = false,
}) => {
  const { t } = useLanguage();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (!disabled) onSubmit();
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
      <label htmlFor="sqlSolution" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
        {t('solutionInputLabel')}
      </label>
      <textarea
        id="sqlSolution"
        value={solution}
        onChange={(e) => onSolutionChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('solutionInputPlaceholder')}
        rows={8}
        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono text-sm resize-y"
        disabled={disabled}
        aria-label={t('solutionInputLabel')}
      />
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('solutionInputProTip')}</p>
      <button
        onClick={onSubmit}
        disabled={disabled || solution.trim() === ''}
        className={`mt-4 w-full sm:w-auto px-6 py-3 bg-sky-600 text-white font-semibold rounded-md shadow-md
                    hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
                    dark:focus:ring-offset-slate-900
                    transition-colors duration-150
                    ${(disabled || solution.trim() === '') ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {t('submitSolutionButton')}
      </button>
    </div>
  );
};

export default SolutionInput;
