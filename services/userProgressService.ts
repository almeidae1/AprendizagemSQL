import { UserProgressData, DailyAttempts, User } from '../types';
// import { MOCK_USER_ID } from '../constants'; // No longer using a single mock user ID

const getLocalStorageKeyForUser = (userId: string) => `userProgress_${userId}`;

// Simulate API call delay
const apiCallDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates fetching user progress from a backend for a specific user.
 * In a real app, 'token' would be used for backend authentication.
 */
export const fetchUserProgress = async (userId: string /*, token: string */): Promise<UserProgressData | null> => {
  if (!userId) {
    console.warn("fetchUserProgress called without userId.");
    return null; 
  }
  
  // Simulate API call delay
  await apiCallDelay(300);

  // --- SIMULATED BACKEND CALL ---
  // console.log(`Simulating: GET /api/users/${userId}/progress`);
  // const response = await fetch(`/api/users/${userId}/progress`, {
  //   headers: { 'Authorization': `Bearer ${token}` }
  // });
  // if (!response.ok) {
  //   if (response.status === 404) return null; // User has no progress yet
  //   throw new Error('Failed to fetch user progress from server');
  // }
  // const data: UserProgressData = await response.json();
  // return data;
  // --- END SIMULATED BACKEND CALL ---

  // Mock implementation using localStorage, keyed by userId:
  const key = getLocalStorageKeyForUser(userId);
  const data = localStorage.getItem(key);

  if (data) {
    try {
      const parsedData: UserProgressData = JSON.parse(data);
      if (typeof parsedData.points === 'number' &&
          parsedData.dailyAttempts &&
          typeof parsedData.dailyAttempts.date === 'string' &&
          typeof parsedData.dailyAttempts.count === 'number') {
        return parsedData;
      } else {
        console.warn('Invalid user progress data found in localStorage for user:', userId);
        localStorage.removeItem(key);
        return null;
      }
    } catch (error) {
      console.error('Error parsing user progress data for user:', userId, error);
      localStorage.removeItem(key);
      return null;
    }
  }
  return null;
};

/**
 * Simulates saving user progress to a backend for a specific user.
 */
export const saveUserProgress = async (userId: string, progressData: UserProgressData /*, token: string */): Promise<void> => {
  if (!userId) {
    console.warn("saveUserProgress called without userId.");
    return;
  }
  
  await apiCallDelay(300);

  // --- SIMULATED BACKEND CALL ---
  // console.log(`Simulating: PUT /api/users/${userId}/progress with data:`, progressData);
  // const response = await fetch(`/api/users/${userId}/progress`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   },
  //   body: JSON.stringify(progressData)
  // });
  // if (!response.ok) {
  //   throw new Error('Failed to save user progress to server');
  // }
  // --- END SIMULATED BACKEND CALL ---
  
  // Mock implementation using localStorage, keyed by userId:
  const key = getLocalStorageKeyForUser(userId);
  try {
    localStorage.setItem(key, JSON.stringify(progressData));
  } catch (error) {
    console.error('Error saving user progress data for user:', userId, error);
    throw new Error('Failed to save user progress (localStorage mock).');
  }
};

/**
 * Gets default progress for a new user or if data is missing/corrupted.
 */
export const getDefaultUserProgress = (): UserProgressData => {
  return {
    points: 0,
    dailyAttempts: {
      date: new Date().toISOString().split('T')[0],
      count: 0,
    },
  };
};
