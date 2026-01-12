import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { AppData, Category, Day, TimeBlock } from '../types';
import { formatDate } from '../utils/date';

interface TodayScreenProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
}

export function TodayScreen({ data, onUpdateData }: TodayScreenProps) {
  const today = formatDate(new Date());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  
  // Ensure we always have exactly 12 blocks (2-hour intervals)
  const existingDay = data.days[today];
  const todayData: Day = {
    date: today,
    blocks: Array.from({ length: 12 }, (_, i) => {
      const hour = i * 2; // 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22
      // Try to find existing block for this hour
      const existingBlock = existingDay?.blocks.find((b) => b.hour === hour);
      return existingBlock || { hour, categoryId: null };
    }),
  };

  const handleBlockClick = (hour: number) => {
    setSelectedHour(selectedHour === hour ? null : hour);
  };

  const handleCategorySelect = (categoryId: string) => {
    if (selectedHour === null) return;

    const updatedBlocks = todayData.blocks.map((block) =>
      block.hour === selectedHour ? { ...block, categoryId } : block
    );

    const updatedDay: Day = {
      ...todayData,
      blocks: updatedBlocks,
    };

    const updatedData: AppData = {
      ...data,
      days: {
        ...data.days,
        [today]: updatedDay,
      },
    };

    onUpdateData(updatedData);
    // Removed setSelectedHour(null) to keep selector open
  };

  const getCategoryColor = (categoryId: string | null): string => {
    if (!categoryId) return '#FFFFFF';
    const category = data.categories.find((c) => c.id === categoryId);
    return category?.color || '#FFFFFF';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current!.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current!.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Adjust sensitivity
    scrollContainerRef.current!.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current!.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Adjust sensitivity
    scrollContainerRef.current!.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="flex flex-col h-full px-6 py-8">
      <div className="mb-8">
        <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Today</h2>
        <h1 className="text-2xl text-gray-800">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h1>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Time blocks */}
        <div className="mb-8">
          <div
            ref={scrollContainerRef}
            className="flex gap-1 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {todayData.blocks.map((block) => {
              const isSelected = selectedHour === block.hour;
              const color = getCategoryColor(block.categoryId);
              
              return (
                <motion.button
                  key={block.hour}
                  onClick={() => handleBlockClick(block.hour)}
                  className="relative flex-shrink-0 w-10 h-32 rounded-lg transition-all border border-gray-200"
                  style={{ backgroundColor: color }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: isSelected ? 1.05 : 1,
                    boxShadow: isSelected 
                      ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
                      : '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500"
                    >
                      {block.hour}:00
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Category selector */}
        {selectedHour !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-sm text-gray-500 mb-4 text-center">
              Select a category for {selectedHour}:00-{selectedHour + 2}:00
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="p-4 rounded-xl flex flex-col items-center gap-2"
                  style={{ backgroundColor: category.color }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm text-gray-700">{category.name}</span>
                </motion.button>
              ))}
              <motion.button
                onClick={() => handleCategorySelect('')}
                className="p-4 rounded-xl flex flex-col items-center gap-2 bg-gray-100"
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm text-gray-500">Clear</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}