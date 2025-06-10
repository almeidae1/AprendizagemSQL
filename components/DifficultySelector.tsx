
import React from 'react';
import { Difficulty as DifficultyEnum } from '../types'; // Renamed to avoid conflict
import { useLanguage } from '../contexts/LanguageContext';

interface DifficultySelectorProps {
  selectedDifficulty: DifficultyEnum;
  onSelectDifficulty: (difficulty: DifficultyEnum) => void;
  disabled?: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  disabled = false,
}) => {
  const { t } = useLanguage();
  const difficulties = Object.values(DifficultyEnum);

  const difficultyTranslations: Record<DifficultyEnum, string> = {
    [DifficultyEnum.Easy]: t('difficultyEasy'),
    [DifficultyEnum.Medium]: t('difficultyMedium'),
    [DifficultyEnum.Advanced]: t('difficultyAdvanced'),
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 self-center mr-2">{t('difficultyLabel')}</label>
      {difficulties.map((level) => (
        <button
          key={level}
          onClick={() => onSelectDifficulty(level)}
          disabled={disabled}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${
              selectedDifficulty === level
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          aria-label={`${t('difficultyLabel')} ${difficultyTranslations[level]}`}
          aria-pressed={selectedDifficulty === level}
        >
          {difficultyTranslations[level]}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
