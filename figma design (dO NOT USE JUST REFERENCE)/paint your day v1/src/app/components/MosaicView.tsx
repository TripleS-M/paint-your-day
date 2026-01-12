import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppData, Day } from '../types';
import { getMonthDates, getMonthName, getYearDates } from '../utils/date';
import { generateSampleData } from '../utils/sampleData';

interface MosaicViewProps {
  data: AppData;
}

export function MosaicView({ data }: MosaicViewProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  
  // TEMPORARY: Generate sample data for year view demo
  const displayData = useMemo(() => {
    if (viewMode === 'year') {
      const sampleDays = generateSampleData(data.categories);
      return {
        ...data,
        days: { ...data.days, ...sampleDays },
      };
    }
    return data;
  }, [viewMode, data]);

  const getCategoryColor = (categoryId: string | null): string => {
    if (!categoryId) return '#FFFFFF';
    const category = data.categories.find((c) => c.id === categoryId);
    return category?.color || '#FFFFFF';
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDayColor = (dateStr: string): string => {
    const dayData: Day | undefined = displayData.days[dateStr];
    if (!dayData || dayData.blocks.length === 0) return '#FFFFFF';

    // Get dominant color
    const colorCounts: Record<string, number> = {};
    dayData.blocks.forEach((block) => {
      const color = getCategoryColor(block.categoryId);
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });

    let maxCount = 0;
    let dominantColor = '#FFFFFF';
    Object.entries(colorCounts).forEach(([color, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    });

    return dominantColor;
  };

  // Month view
  if (viewMode === 'month') {
    const dates = getMonthDates(currentYear, currentMonth);

    return (
      <div className="flex flex-col h-full px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Mosaic</h2>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl text-gray-800">
              {getMonthName(currentMonth)} {currentYear}
            </h1>
            <div className="flex gap-2">
              <motion.button
                onClick={goToPreviousMonth}
                className="p-2 rounded-full bg-white border border-gray-200"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                onClick={goToNextMonth}
                className="p-2 rounded-full bg-white border border-gray-200"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
          {/* View toggle */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => setViewMode('month')}
              className="px-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: viewMode === 'month' ? '#000' : '#fff',
                color: viewMode === 'month' ? '#fff' : '#666',
                border: viewMode === 'month' ? 'none' : '1px solid #e5e5e5',
              }}
              whileTap={{ scale: 0.95 }}
            >
              Month
            </motion.button>
            <motion.button
              onClick={() => setViewMode('year')}
              className="px-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: viewMode === 'year' ? '#000' : '#fff',
                color: viewMode === 'year' ? '#fff' : '#666',
                border: viewMode === 'year' ? 'none' : '1px solid #e5e5e5',
              }}
              whileTap={{ scale: 0.95 }}
            >
              Year
            </motion.button>
          </div>
        </div>

        {/* Month mosaic */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {dates.map((dateStr, index) => {
              const dayData: Day | undefined = data.days[dateStr];
              const date = new Date(dateStr);
              const dayNumber = date.getDate();
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <motion.div
                  key={dateStr}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-12 text-right">
                    <div className="text-sm text-gray-800">{dayNumber}</div>
                    <div className="text-xs text-gray-400">{dayName}</div>
                  </div>
                  <div className="flex-1 flex gap-0.5 h-8 rounded-lg overflow-hidden border border-gray-200">
                    {Array.from({ length: 12 }, (_, i) => {
                      const hour = i * 2;
                      const block = dayData?.blocks.find((b) => b.hour === hour);
                      const color = getCategoryColor(block?.categoryId || null);
                      
                      return (
                        <div
                          key={i}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Year view
  const yearDates = getYearDates(currentYear);
  
  // Group dates by month
  const monthGroups: { month: string; dates: string[] }[] = [];
  let currentMonthKey = '';
  let currentGroup: string[] = [];

  yearDates.forEach((dateStr) => {
    const date = new Date(dateStr);
    const monthKey = `${date.getMonth()}-${date.getFullYear()}`;
    
    if (monthKey !== currentMonthKey) {
      if (currentGroup.length > 0) {
        monthGroups.push({
          month: currentMonthKey,
          dates: currentGroup,
        });
      }
      currentMonthKey = monthKey;
      currentGroup = [dateStr];
    } else {
      currentGroup.push(dateStr);
    }
  });

  if (currentGroup.length > 0) {
    monthGroups.push({
      month: currentMonthKey,
      dates: currentGroup,
    });
  }

  return (
    <div className="flex flex-col h-full px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Mosaic</h2>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-gray-800">{currentYear}</h1>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setCurrentYear(currentYear - 1)}
              className="p-2 rounded-full bg-white border border-gray-200"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              onClick={() => setCurrentYear(currentYear + 1)}
              className="p-2 rounded-full bg-white border border-gray-200"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
        {/* View toggle */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => setViewMode('month')}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: viewMode === 'month' ? '#000' : '#fff',
              color: viewMode === 'month' ? '#fff' : '#666',
              border: viewMode === 'month' ? 'none' : '1px solid #e5e5e5',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Month
          </motion.button>
          <motion.button
            onClick={() => setViewMode('year')}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: viewMode === 'year' ? '#000' : '#fff',
              color: viewMode === 'year' ? '#fff' : '#666',
              border: viewMode === 'year' ? 'none' : '1px solid #e5e5e5',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Year
          </motion.button>
        </div>
      </div>

      {/* Year mosaic */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-4">
          {monthGroups.map((group, groupIndex) => {
            const firstDate = new Date(group.dates[0]);
            const monthName = firstDate.toLocaleDateString('en-US', { month: 'short' });

            return (
              <motion.div
                key={group.month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.05 }}
                className="space-y-1"
              >
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  {monthName}
                </div>
                <div className="space-y-0.5">
                  {group.dates.map((dateStr) => {
                    const color = getDayColor(dateStr);
                    
                    return (
                      <div
                        key={dateStr}
                        className="h-1 rounded-full border border-gray-100"
                        style={{ backgroundColor: color }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
