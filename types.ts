export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Advanced = 'Advanced',
}

export interface TableColumn {
  columnName: string;
  dataType: string;
  description?: string; // Description can be provided by the AI in the chosen language
}

export interface SampleRow {
  [key: string]: string | number | boolean | null;
}

export interface SQLProblem {
  tableName: string;
  tableSchema: TableColumn[];
  sampleData?: SampleRow[];
  problemStatement: string; // This will be in the language requested from the AI
  expectedSolution: string;
  difficulty: Difficulty;
}

export interface Feedback {
  type: 'success' | 'error' | 'info' | null;
  message: string;
  title?: string; // Optional title for feedback, e.g., "Correct!"
}

export enum Language {
  EN = 'en',
  PT = 'pt',
}

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export interface DailyAttempts {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface UserProgressData {
  points: number;
  dailyAttempts: DailyAttempts;
}

// For authentication
export interface User {
  id: string;
  email: string;
  name?: string;
  // In a real app, you might have a token here or manage it separately
}

export interface HintRequest {
  problemStatement: string;
  // expectedSolution: string; // AI should derive hints without needing the exact solution.
  tableSchema: TableColumn[];
  tableName: string;
  difficulty: Difficulty; // Adding difficulty to help AI tailor the hint
}