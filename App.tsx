import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, SQLProblem, Feedback, UserProgressData, HintRequest } from './types';
import { MAX_DAILY_PROBLEMS, POINTS_MAP, GEMINI_MODEL_NAME, HINT_COST } from './constants';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import DifficultySelector from './components/DifficultySelector';
import ProblemDisplay from './components/ProblemDisplay';
import SolutionInput from './components/SolutionInput';
import FeedbackMessage from './components/FeedbackMessage';
import LanguageSwitcher from './components/LanguageSwitcher';
import AuthControls from './components/auth/AuthControls';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import { generateSqlProblem, generateSqlHint } from './services/geminiService';
import { fetchUserProgress, saveUserProgress, getDefaultUserProgress } from './services/userProgressService';
import AcademicCapIcon from './components/icons/AcademicCapIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import LightbulbIcon from './components/icons/LightbulbIcon';
import QuestionMarkCircleIcon from './components/icons/QuestionMarkCircleIcon';

type AuthView = 'login' | 'register' | null;

const App: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [currentProblem, setCurrentProblem] = useState<SQLProblem | null>(null);
  const [userSolution, setUserSolution] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  
  const [userProgress, setUserProgress] = useState<UserProgressData>(getDefaultUserProgress());
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(false); // Different from auth loading
  const [userDataError, setUserDataError] = useState<string | null>(null);

  const [isProblemLoading, setIsProblemLoading] = useState<boolean>(false);
  const [problemError, setProblemError] = useState<string | null>(null);

  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState<boolean>(false);
  const [hintError, setHintError] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState<boolean>(false);

  const [authView, setAuthView] = useState<AuthView>(null); // 'login', 'register', or null (main app)

  const hasFetchedInitialDataForUser = useRef<string | null>(null); // Store userId for which data was fetched

  // Effect for API Key check
  useEffect(() => {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      setApiKeyAvailable(true);
    } else {
      setProblemError(t('apiKeyErrorMessage')); // Use problemError for API key issues now
      setApiKeyAvailable(false);
    }
  }, [t]);

  // Effect to load user progress when user is authenticated or changes
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) {
      setUserProgress(getDefaultUserProgress()); // Reset progress if logged out
      hasFetchedInitialDataForUser.current = null;
      return;
    }

    // Only fetch if user changed or data hasn't been fetched for this user
    if (currentUser.id && hasFetchedInitialDataForUser.current !== currentUser.id) {
      setIsUserDataLoading(true);
      setUserDataError(null);
      fetchUserProgress(currentUser.id)
        .then(data => {
          if (data) {
            const today = new Date().toISOString().split('T')[0];
            if (data.dailyAttempts.date !== today) {
              setUserProgress({ ...data, dailyAttempts: { date: today, count: 0 } });
            } else {
              setUserProgress(data);
            }
          } else {
            setUserProgress(getDefaultUserProgress());
          }
        })
        .catch(() => {
          setUserDataError(t('errorLoadingUserData'));
          setUserProgress(getDefaultUserProgress());
        })
        .finally(() => {
          setIsUserDataLoading(false);
          hasFetchedInitialDataForUser.current = currentUser.id;
        });
    }
  }, [isAuthenticated, currentUser, t]);

  // Effect to save user progress when it changes and user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser?.id && userProgress && hasFetchedInitialDataForUser.current === currentUser.id && !isUserDataLoading) {
      saveUserProgress(currentUser.id, userProgress)
        .catch(() => {
          setFeedback({ type: 'error', message: t('errorSavingUserData') });
        });
    }
  }, [userProgress, isAuthenticated, currentUser, isUserDataLoading]);

  const dailyProblemsAttempted = userProgress.dailyAttempts.count;
  const points = userProgress.points;

  const handleGenerateProblem = useCallback(async () => {
    if (!apiKeyAvailable) {
        setProblemError(t('apiKeyErrorMessage'));
        return;
    }
    if (!isAuthenticated) {
        setFeedback({ type: 'info', title: t('authenticationRequired'), message: t('authenticationRequired') });
        setAuthView('login');
        return;
    }
    if (dailyProblemsAttempted >= MAX_DAILY_PROBLEMS) {
      setFeedback({ type: 'info', message: t('dailyLimitReachedError') });
      return;
    }

    setIsProblemLoading(true);
    setProblemError(null);
    setFeedback(null);
    setCurrentProblem(null);
    setUserSolution('');
    setCurrentHint(null);
    setHintVisible(false);
    setHintError(null);

    try {
      const problem = await generateSqlProblem(difficulty, language);
      setCurrentProblem(problem);
      setUserProgress(prev => ({
        ...prev,
        dailyAttempts: { date: new Date().toISOString().split('T')[0], count: prev.dailyAttempts.count + 1 }
      }));
    } catch (err: any) {
      console.error("Error in handleGenerateProblem:", err);
      const message = err.message?.includes("API_KEY") ? t('apiKeyErrorMessage') : `${t('feedbackApiError')} ${err.message || 'Please try again.'}`;
      setProblemError(message);
      setFeedback({ type: 'error', message });
    } finally {
      setIsProblemLoading(false);
    }
  }, [difficulty, dailyProblemsAttempted, apiKeyAvailable, language, t, isAuthenticated]);

  const normalizeSql = (sql: string): string => {
    return sql.toLowerCase().trim().replace(/;\s*$/, "").replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',');
  };

  const handleSubmitSolution = () => {
    if (!currentProblem || !isAuthenticated) return;

    const normalizedUserSolution = normalizeSql(userSolution);
    const normalizedExpectedSolution = normalizeSql(currentProblem.expectedSolution);

    if (normalizedUserSolution === normalizedExpectedSolution) {
      const pointsEarned = POINTS_MAP[currentProblem.difficulty];
      setUserProgress(prev => ({ ...prev, points: prev.points + pointsEarned }));
      setFeedback({
        type: 'success',
        title: t('feedbackCorrectTitle'),
        message: t('feedbackCorrectMessage', { pointsEarned }),
      });
    } else {
      setFeedback({ type: 'error', message: t('feedbackIncorrectMessage') });
    }
  };

  const handleGetHint = useCallback(async () => {
    if (!currentProblem || !apiKeyAvailable || currentHint || points < HINT_COST || !isAuthenticated) {
      if (!isAuthenticated) {
        setFeedback({ type: 'info', title: t('authenticationRequired'), message: t('authenticationRequired') });
        setAuthView('login');
        return;
      }
      if (points < HINT_COST) setHintError(t('insufficientPointsForHint'));
      return;
    }

    setIsHintLoading(true);
    setHintError(null);
    setHintVisible(false);

    try {
      setUserProgress(prev => ({ ...prev, points: prev.points - HINT_COST }));
      
      const hintRequestData: HintRequest = {
        problemStatement: currentProblem.problemStatement,
        tableSchema: currentProblem.tableSchema,
        tableName: currentProblem.tableName,
        difficulty: currentProblem.difficulty,
      };
      const hint = await generateSqlHint(hintRequestData, language);
      setCurrentHint(hint);
      setHintVisible(true);
    } catch (err: any) {
      setHintError(err.message || t('errorGeneratingHint'));
      setUserProgress(prev => ({ ...prev, points: prev.points + HINT_COST })); // Revert points
      setFeedback({ type: 'error', message: err.message || t('errorGeneratingHint') });
    } finally {
      setIsHintLoading(false);
    }
  }, [currentProblem, apiKeyAvailable, points, language, t, currentHint, isAuthenticated, difficulty]);
  
  // Render Loading state for Auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        <p className="ml-4 text-slate-600 dark:text-slate-300">{t('checkingAuthStatus')}</p>
      </div>
    );
  }
  
  // Render Auth pages if not authenticated and authView is set
  if (!isAuthenticated) {
    if (authView === 'login' || !authView) { // Default to login if no specific view or explicit login
        return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
    }
    if (authView === 'register') {
        return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }
  }

  // If authenticated, check for API Key. This is the primary gate after authentication.
  if (!apiKeyAvailable) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/50 p-6 text-center">
        <AcademicCapIcon className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />
        <h1 className="text-3xl font-bold text-red-700 dark:text-red-300 mb-2">{t('apiKeyErrorTitle')}</h1>
        <p className="text-red-600 dark:text-red-400 max-w-md">{problemError || t('apiKeyErrorMessage')}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">{t('apiKeyErrorGuidance')}</p>
      </div>
    );
  }
  
  // User Data loading spinner AFTER auth is resolved and API key is confirmed available
  if (isUserDataLoading && currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        <p className="ml-4 text-slate-600 dark:text-slate-300">{t('loadingUserData')}</p>
      </div>
    );
  }

  const canGenerateProblem = dailyProblemsAttempted < MAX_DAILY_PROBLEMS;
  const canGetHint = currentProblem && !currentHint && !isHintLoading && points >= HINT_COST;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center justify-center sm:justify-start">
                <AcademicCapIcon className="w-10 h-10 text-sky-600 dark:text-sky-400 mr-3" />
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    {t('appTitle')}
                </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <LanguageSwitcher />
              <AuthControls 
                points={points} 
                onShowLogin={() => setAuthView('login')}
                onShowRegister={() => setAuthView('register')}
              />
            </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        {userDataError && <FeedbackMessage feedback={{ type: 'error', message: userDataError }} />}

        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 mb-6">
          <DifficultySelector
            selectedDifficulty={difficulty}
            onSelectDifficulty={(d) => {setDifficulty(d); setCurrentHint(null); setHintVisible(false);}}
            disabled={isProblemLoading || isHintLoading}
          />
          <button
            onClick={handleGenerateProblem}
            disabled={isProblemLoading || isHintLoading || !canGenerateProblem}
            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white 
                        ${canGenerateProblem ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed'} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
                        dark:focus:ring-offset-slate-900
                        transition-colors duration-150
                        ${(isProblemLoading || isHintLoading) ? 'opacity-75 cursor-wait' : ''}`}
            aria-live="polite"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            {isProblemLoading ? t('generatingProblemButton') : t('generateProblemButton')}
          </button>
          {!canGenerateProblem && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-3 text-center">
              {t('comeBackTomorrowError')}
            </p>
          )}
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              {t('problemsAttemptedLabel')} {dailyProblemsAttempted} / {MAX_DAILY_PROBLEMS}
            </p>
        </div>
        
        {problemError && !feedback && !problemError.includes(t('apiKeyErrorTitle').substring(0,10)) && (
          // Only show general problem errors here; API key error is handled by the full-screen display
          <FeedbackMessage feedback={{type: 'error', message: problemError}} />
        )}

        {feedback && <FeedbackMessage feedback={feedback} />}

        {isProblemLoading && !currentProblem && (
          <div className="flex justify-center items-center h-40 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6 my-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            <p className="ml-4 text-slate-600 dark:text-slate-300">{t('generatingChallengeMessage')}</p>
          </div>
        )}

        {currentProblem && (
          <>
            <ProblemDisplay problem={currentProblem} />

            <div className="my-6 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
              {hintError && !currentHint && <FeedbackMessage feedback={{ type: 'error', message: hintError }} />}
              {currentHint && hintVisible && (
                <div className="mb-4 p-4 bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-700 rounded-md">
                  <h4 className="text-md font-semibold text-sky-700 dark:text-sky-400 mb-1 flex items-center">
                    <LightbulbIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-300" />
                    {t('hintDisplayTitle')}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{currentHint}</p>
                </div>
              )}

              {!hintVisible && !currentHint && (
                 <button
                    onClick={handleGetHint}
                    disabled={!canGetHint || isProblemLoading}
                    className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-sky-500 dark:border-sky-600 text-sm font-medium rounded-md shadow-sm 
                                ${canGetHint ? 'text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-slate-600' : 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 cursor-not-allowed'}
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400
                                dark:focus:ring-offset-slate-900
                                transition-colors duration-150
                                ${(isHintLoading || isProblemLoading) ? 'opacity-75 cursor-wait' : ''}`}
                  >
                    <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
                    {isHintLoading ? t('gettingHintButton') : t('getHintButton', { hintCost: HINT_COST })}
                  </button>
              )}
               {currentHint && !hintVisible && (
                 <button
                    onClick={() => setHintVisible(true)}
                    className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-sky-500 dark:border-sky-600 text-sm font-medium rounded-md shadow-sm 
                                text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-slate-600
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400
                                dark:focus:ring-offset-slate-900 transition-colors duration-150`}
                  >
                    <LightbulbIcon className="w-5 h-5 mr-2" />
                    {t('hintAvailableButton')}
                  </button>
              )}
               {!canGetHint && !currentHint && points < HINT_COST && currentProblem && (
                 <p className="text-xs text-red-500 dark:text-red-400 mt-2">{t('insufficientPointsForHint')}</p>
               )}
            </div>

            <SolutionInput
              solution={userSolution}
              onSolutionChange={setUserSolution}
              onSubmit={handleSubmitSolution}
              disabled={isProblemLoading || isHintLoading || (feedback?.type === 'success')}
            />
          </>
        )}
      </main>
      <footer className="text-center mt-12 py-4 border-t border-slate-300 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('footerText', { year: new Date().getFullYear() })}
        </p>
      </footer>
    </div>
  );
};

export default App;