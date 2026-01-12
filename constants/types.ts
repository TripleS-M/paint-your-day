/**
 * Core data types for Paint Your Day
 */

export interface Category {
  id: string;
  name: string;
  color: string;
  darkColor?: string;
}

export interface TimeBlock {
  hour: number; // 0-23
  categoryId: string | null;
}

export interface Day {
  date: string; // YYYY-MM-DD format
  blocks: TimeBlock[];
}

export interface AppData {
  categories: Category[];
  days: Record<string, Day>;
}

/**
 * Default categories bundled with the app
 */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'rest', name: 'Rest', color: '#D4C5F9', darkColor: '#9B8FD9' },
  { id: 'work', name: 'Work', color: '#ADD5F7', darkColor: '#7EB7E8' },
  { id: 'movement', name: 'Movement', color: '#F5E6D3', darkColor: '#D9C29F' },
  { id: 'connection', name: 'Connection', color: '#F7D4E0', darkColor: '#E89FAF' },
  { id: 'learning', name: 'Learning', color: '#D4F7E3', darkColor: '#9FD9B8' },
  { id: 'creative', name: 'Creative', color: '#F7F0D4', darkColor: '#D9CE9F' },
];

/**
 * Initialize an empty day with 24 blocks (one per hour)
 */
export const initializeEmptyDay = (date: string): Day => ({
  date,
  blocks: Array.from({ length: 24 }, (_, hour) => ({
    hour,
    categoryId: null,
  })),
});

/**
 * Initialize default app data
 */
export const initializeAppData = (): AppData => ({
  categories: DEFAULT_CATEGORIES,
  days: {},
});

/**
 * Format date as YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date as string
 */
export const getTodayString = (): string => formatDate(new Date());

/**
 * Get a date string for offset days from today
 */
export const getDateString = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return formatDate(date);
};
