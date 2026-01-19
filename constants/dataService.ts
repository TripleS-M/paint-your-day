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

// Create a slightly darker shade for overlays/borders
const getDarkColor = (hex: string): string => {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return '#c0c0c0';

  const factor = 0.78;
  const toChannel = (idx: number) => parseInt(normalized.slice(idx, idx + 2), 16);
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

  const r = clamp(toChannel(0) * factor);
  const g = clamp(toChannel(2) * factor);
  const b = clamp(toChannel(4) * factor);

  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

class DataService {
  private cache: AppData | null = null;
  private dataVersion: number = 0;

  /**
   * Get the current data version number
   * Increments automatically on every mutation
   */
  getVersion(): number {
    return this.dataVersion;
  }

  /**
   * Increment data version (called internally on mutations)
   */
  private incrementVersion(): void {
    this.dataVersion++;
  }

  /**
   * Initialize app data - loads from storage or creates new
   */
  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(DATA_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppData;
        let updated = false;

        // Ensure any previously stored categories have dark colors
        parsed.categories = parsed.categories.map((category) => {
          if (category.darkColor) return category;
          updated = true;
          return { ...category, darkColor: getDarkColor(category.color) };
        });

        this.cache = parsed;
        if (updated) {
          await this.save();
        }
        return;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }

    this.cache = initializeAppData();
    this.dataVersion = 0;
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
      this.incrementVersion();
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
      darkColor: getDarkColor(category.color),
    };

    this.cache.categories.push(newCategory);
    this.incrementVersion();
    await this.save();
    return newCategory;
  }

  /**
   * Update an existing category
   * Automatically updates darkColor if color is changed
   */
  async updateCategory(
    categoryId: string,
    updates: Partial<Omit<Category, 'id'>>
  ): Promise<void> {
    if (!this.cache) throw new Error('Data not initialized');

    const category = this.cache.categories.find((c) => c.id === categoryId);
    if (category) {
      // If color is being updated, automatically update darkColor
      if (updates.color && updates.color !== category.color) {
        updates.darkColor = getDarkColor(updates.color);
      }
      
      Object.assign(category, updates);
      this.incrementVersion();
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

    this.incrementVersion();
    await this.save();
  }

  /**
   * Get all days with data
   */
  getDays(): Record<string, Day> {
    if (!this.cache) return {};
    // Return a shallow copy so callers get a new reference and React can re-render
    // (Days/blocks inside are still shared; screens only need a top-level ref change.)
    return { ...this.cache.days };
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
