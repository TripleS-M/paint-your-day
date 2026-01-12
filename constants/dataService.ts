/**
 * Data service for managing all app data with AsyncStorage persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    AppData,
    Category,
    Day,
    initializeAppData,
    initializeEmptyDay
} from './types';

const DATA_STORAGE_KEY = 'paint_your_day_data';

class DataService {
  private cache: AppData | null = null;

  /**
   * Initialize app data - loads from storage or creates new
   */
  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(DATA_STORAGE_KEY);
      if (stored) {
        this.cache = JSON.parse(stored);
        return;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }

    this.cache = initializeAppData();
    await this.save();
  }

  /**
   * Get current cached data
   */
  get data(): AppData {
    if (!this.cache) {
      throw new Error('Data not initialized. Call initialize() first.');
    }
    return this.cache;
  }

  /**
   * Persist data to AsyncStorage
   */
  private async save(): Promise<void> {
    if (!this.cache) return;
    try {
      await AsyncStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  /**
   * Get or create a day's data
   */
  async getOrCreateDay(dateString: string): Promise<Day> {
    if (!this.cache) throw new Error('Data not initialized');

    if (!this.cache.days[dateString]) {
      this.cache.days[dateString] = initializeEmptyDay(dateString);
      await this.save();
    }

    return this.cache.days[dateString];
  }

  /**
   * Update a specific time block in a day
   */
  async updateBlock(
    dateString: string,
    hour: number,
    categoryId: string | null
  ): Promise<void> {
    if (!this.cache) throw new Error('Data not initialized');

    const day = await this.getOrCreateDay(dateString);
    const block = day.blocks.find((b) => b.hour === hour);

    if (block) {
      block.categoryId = categoryId;
      await this.save();
    }
  }

  /**
   * Get a category by ID
   */
  getCategory(categoryId: string): Category | undefined {
    if (!this.cache) return undefined;
    return this.cache.categories.find((c) => c.id === categoryId);
  }

  /**
   * Add a new category
   */
  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    if (!this.cache) throw new Error('Data not initialized');

    const newCategory: Category = {
      ...category,
      id: `custom_${Date.now()}`,
    };

    this.cache.categories.push(newCategory);
    await this.save();
    return newCategory;
  }

  /**
   * Update an existing category
   */
  async updateCategory(
    categoryId: string,
    updates: Partial<Omit<Category, 'id'>>
  ): Promise<void> {
    if (!this.cache) throw new Error('Data not initialized');

    const category = this.cache.categories.find((c) => c.id === categoryId);
    if (category) {
      Object.assign(category, updates);
      await this.save();
    }
  }

  /**
   * Delete a category and remove it from all blocks
   */
  async deleteCategory(categoryId: string): Promise<void> {
    if (!this.cache) throw new Error('Data not initialized');

    // Remove category from list
    this.cache.categories = this.cache.categories.filter((c) => c.id !== categoryId);

    // Remove from all blocks
    Object.values(this.cache.days).forEach((day) => {
      day.blocks.forEach((block) => {
        if (block.categoryId === categoryId) {
          block.categoryId = null;
        }
      });
    });

    await this.save();
  }

  /**
   * Get all days with data
   */
  getDays(): Record<string, Day> {
    if (!this.cache) return {};
    return this.cache.days;
  }

  /**
   * Calculate statistics for insights
   */
  getInsights() {
    if (!this.cache) return null;

    const categoryUsage: Record<string, number> = {};
    let totalBlocksAssigned = 0;

    Object.values(this.cache.days).forEach((day) => {
      day.blocks.forEach((block) => {
        if (block.categoryId) {
          categoryUsage[block.categoryId] =
            (categoryUsage[block.categoryId] || 0) + 1;
          totalBlocksAssigned++;
        }
      });
    });

    const sortedCategories = Object.entries(categoryUsage)
      .sort(([, a], [, b]) => b - a)
      .map(([id, count]) => {
        const category = this.cache!.categories.find((c) => c.id === id);
        return { category, count };
      })
      .filter(({ category }) => category !== undefined);

    return {
      totalDaysTracked: Object.keys(this.cache.days).length,
      totalBlocksAssigned,
      mostUsedCategory: sortedCategories[0]?.category,
      categoryUsage: sortedCategories,
    };
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAll(): Promise<void> {
    this.cache = initializeAppData();
    await AsyncStorage.removeItem(DATA_STORAGE_KEY);
  }
}

// Export singleton instance
export const dataService = new DataService();
