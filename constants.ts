import { Difficulty, Language } from './types';

export const MAX_DAILY_PROBLEMS = 10;
export const HINT_COST = 5; // Points cost for a hint
// export const MOCK_USER_ID = 'mockUser123'; // Replaced by authenticated user's ID

export const POINTS_MAP: Record<Difficulty, number> = {
  [Difficulty.Easy]: 10,
  [Difficulty.Medium]: 20,
  [Difficulty.Advanced]: 30,
};

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const LOCAL_STORAGE_KEYS = {
  API_KEY: 'sqlPracticeApp_apiKey', // This is an environment variable, not stored by the app itself
  LANGUAGE: 'sqlPracticeApp_language',
  AUTH_TOKEN: 'sqlPracticeApp_authToken', // For simulating session persistence
  // User progress will be keyed by user ID on a simulated backend (or localStorage for full offline mock)
};

export const DEFAULT_LANGUAGE = Language.EN;