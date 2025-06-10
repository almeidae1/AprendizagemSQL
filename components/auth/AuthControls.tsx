import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LightbulbIcon from '../icons/LightbulbIcon'; // Re-using for points display continuity

interface AuthControlsProps {
  points: number;
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const AuthControls: React.FC<AuthControlsProps> = ({ points, onShowLogin, onShowRegister }) => {
  const { currentUser, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const pointsRef = React.useRef<HTMLSpanElement>(null); // For points animation

  // Animate points when they change
  React.useEffect(() => {
    if (pointsRef.current) {
        pointsRef.current.classList.add('points-animate');
        setTimeout(() => pointsRef.current?.classList.remove('points-animate'), 500);
      }
  }, [points]);


  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onShowLogin}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-md text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-800/50 hover:bg-sky-200 dark:hover:bg-sky-700/70 transition-colors"
          disabled={authLoading}
        >
          {t('signInLink')}
        </button>
        <button
          onClick={onShowRegister}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 transition-colors"
          disabled={authLoading}
        >
          {t('signUpLink')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
      <div className="flex items-center bg-white dark:bg-slate-800 shadow-md rounded-lg px-3 py-1.5">
        <LightbulbIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 dark:text-yellow-300 mr-1.5 sm:mr-2" />
        <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('pointsLabel')}: </span>
        <span ref={pointsRef} className="text-md sm:text-lg font-bold text-sky-600 dark:text-sky-400 ml-1">
          {points}
        </span>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:inline">
          {currentUser?.name || currentUser?.email}
        </span>
        <button
          onClick={logout}
          disabled={authLoading}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800/70 transition-colors"
        >
          {t('logoutButton')}
        </button>
      </div>
    </div>
  );
};

export default AuthControls;
