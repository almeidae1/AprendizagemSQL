import React from 'react';
import AcademicCapIcon from '../icons/AcademicCapIcon';
import { useLanguage } from '../../contexts/LanguageContext';

interface AuthFormContainerProps {
  title: string;
  children: React.ReactNode;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ title, children }) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <AcademicCapIcon className="mx-auto h-12 w-auto text-sky-600 dark:text-sky-400" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
        </div>
        <div className="mt-8 bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 sm:p-10">
          {children}
        </div>
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          {t('footerText', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
};

export default AuthFormContainer;
