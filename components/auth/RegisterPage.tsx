import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AuthFormContainer from './AuthFormContainer';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { registerWithEmail, isLoading, authError, clearAuthError } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearAuthError();
    try {
      await registerWithEmail(email, password, name);
      // Successful registration will be handled by AuthContext redirecting in App.tsx
    } catch (error) {
      // Error is set in AuthContext
    }
  };

  return (
    <AuthFormContainer title={t('registerTitle')}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {authError && (
          <div className="p-3 bg-red-100 dark:bg-red-900/70 border border-red-400 dark:border-red-600 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-200">{authError}</p>
          </div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('nameLabel')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('emailLabel')}
          </label>
          <input
            id="email-register"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('passwordLabel')}
          </label>
          <input
            id="password-register"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            disabled={isLoading}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 disabled:opacity-50"
          >
            {isLoading ? t('registeringStatus') : t('registerButton')}
          </button>
        </div>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        {t('alreadyHaveAccountPrompt')}{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 focus:outline-none focus:underline">
          {t('signInLink')}
        </button>
      </p>
    </AuthFormContainer>
  );
};

export default RegisterPage;
