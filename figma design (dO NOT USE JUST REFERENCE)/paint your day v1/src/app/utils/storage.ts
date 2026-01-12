import { AppData, Category } from '../types';

const STORAGE_KEY = 'time-reflection-data';

const defaultCategories: Category[] = [
  { id: '1', name: 'Rest', color: '#E8D5F2' },
  { id: '2', name: 'Work', color: '#C8E6F5' },
  { id: '3', name: 'Movement', color: '#F5E6D3' },
  { id: '4', name: 'Connection', color: '#F5D5D8' },
  { id: '5', name: 'Learning', color: '#D5F5E3' },
  { id: '6', name: 'Creative', color: '#F5F0D5' },
];

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  
  return {
    categories: defaultCategories,
    days: {},
  };
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
