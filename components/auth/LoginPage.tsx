import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AuthFormContainer from './AuthFormContainer';
import GoogleIcon from '../icons/GoogleIcon';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { loginWithEmail, loginWithGoogle, isLoading, authError, clearAuthError } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearAuthError();
    try {
      await loginWithEmail(email, password);
      // Successful login will be handled by AuthContext redirecting in App.tsx
    } catch (error) {
      // Error is set in AuthContext and displayed below
    }
  };

  const handleGoogleSignIn = async () => {
    clearAuthError();
    try {
      await loginWithGoogle();
    } catch (error) {
      // Error is set in AuthContext
    }
  };

  return (
    <AuthFormContainer title={t('loginTitle')}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {authError && (
          <div className="p-3 bg-red-100 dark:bg-red-900/70 border border-red-400 dark:border-red-600 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-200">{authError}</p>
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('emailLabel')}
          </label>
          <input
            id="email"
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
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('passwordLabel')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
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
            {isLoading ? t('loggingInStatus') : t('loginButton')}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">{t('orSeparator')}</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 disabled:opacity-50"
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            {t('loginWithGoogleButton')}
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        {t('noAccountPrompt')}{' '}
        <button onClick={onSwitchToRegister} className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 focus:outline-none focus:underline">
          {t('signUpLink')}
        </button>
      </p>
    </AuthFormContainer>
  );
};

export default LoginPage;
