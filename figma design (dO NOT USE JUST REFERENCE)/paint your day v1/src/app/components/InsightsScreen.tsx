import { motion } from 'motion/react';
import { AppData } from '../types';

interface InsightsScreenProps {
  data: AppData;
}

export function InsightsScreen({ data }: InsightsScreenProps) {
  // Calculate insights
  const categoryUsage: Record<string, number> = {};
  
  Object.values(data.days).forEach((day) => {
    day.blocks.forEach((block) => {
      if (block.categoryId) {
        categoryUsage[block.categoryId] = (categoryUsage[block.categoryId] || 0) + 1;
      }
    });
  });

  const sortedCategories = Object.entries(categoryUsage)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => data.categories.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const mostUsedCategory = sortedCategories[0];
  const totalDaysTracked = Object.keys(data.days).length;

  return (
    <div className="flex flex-col h-full px-6 py-8">
      <div className="mb-8">
        <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Insights</h2>
        <h1 className="text-2xl text-gray-800">Gentle reflections</h1>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Days tracked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="text-sm text-gray-500 mb-2">You've reflected on</div>
          <div className="text-3xl text-gray-800 mb-1">
            {totalDaysTracked > 0 ? `${totalDaysTracked}` : 'No'} day{totalDaysTracked !== 1 ? 's' : ''}
          </div>
          <div className="text-sm text-gray-400">
            Each day is a new pattern
          </div>
        </motion.div>

        {/* Most used category */}
        {mostUsedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="text-sm text-gray-500 mb-4">Most present in your days</div>
            <div
              className="p-6 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: mostUsedCategory.color }}
            >
              <span className="text-xl text-gray-800">{mostUsedCategory.name}</span>
            </div>
          </motion.div>
        )}

        {/* Color palette */}
        {sortedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="text-sm text-gray-500 mb-4">Your palette</div>
            <div className="space-y-2">
              {sortedCategories.slice(0, 5).map((category, index) => (
                <div key={category.id} className="flex items-center gap-3">
                  <div
                    className="w-12 h-8 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-700">{category.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {totalDaysTracked === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-sm text-center"
          >
            <div className="text-gray-400 mb-2">No reflections yet</div>
            <div className="text-sm text-gray-500">
              Start by coloring your day in the Today screen
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}