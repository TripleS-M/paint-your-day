import { AppData, Day } from '../types';
import { formatDate } from './date';

// Generate sample data for demonstration
export const generateSampleData = (categories: AppData['categories']): Record<string, Day> => {
  const sampleDays: Record<string, Day> = {};
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Generate data for the past 4 months
  for (let monthOffset = 0; monthOffset < 4; monthOffset++) {
    const targetMonth = currentMonth - monthOffset;
    const targetYear = targetMonth < 0 ? currentYear - 1 : currentYear;
    const adjustedMonth = targetMonth < 0 ? 12 + targetMonth : targetMonth;
    
    const daysInMonth = new Date(targetYear, adjustedMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(targetYear, adjustedMonth, day);
      const dateStr = formatDate(date);
      
      // Randomly skip some days (70% chance of having data)
      if (Math.random() > 0.7) continue;
      
      // Create 12 blocks with random categories
      const blocks = Array.from({ length: 12 }, (_, i) => {
        const hour = i * 2;
        
        // 60% chance a block has a category assigned
        if (Math.random() > 0.6) {
          return { hour, categoryId: null };
        }
        
        // Randomly select a category
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        return { hour, categoryId: randomCategory.id };
      });
      
      sampleDays[dateStr] = {
        date: dateStr,
        blocks,
      };
    }
  }
  
  return sampleDays;
};
