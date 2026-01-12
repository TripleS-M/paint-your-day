import { dataService } from '@/constants/dataService';
import { useTheme } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function MosaicScreen() {
  const theme = useTheme();
  const [days, setDays] = useState<Record<string, any>>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  useFocusEffect(
    useCallback(() => {
      loadDays();
      return () => {};
    }, [])
  );

  const loadDays = () => {
    try {
      const allDays = dataService.getDays();
      setDays(allDays);
    } catch (error) {
      console.error('Error loading days:', error);
    }
  };

  const getDayColor = (dateStr: string): string => {
    const day = days[dateStr];
    if (!day || day.blocks.length === 0) return theme.defaultBlock;

    // Find dominant color
    const colorCounts: Record<string, number> = {};
    day.blocks.forEach((block: any) => {
      if (block.categoryId) {
        const category = dataService.getCategory(block.categoryId);
        if (category) {
          colorCounts[block.categoryId] = (colorCounts[block.categoryId] || 0) + 1;
        }
      }
    });

    if (Object.keys(colorCounts).length === 0) return theme.defaultBlock;

    let maxCategoryId = Object.entries(colorCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    const category = dataService.getCategory(maxCategoryId);
    return category?.color || theme.defaultBlock;
  };

  const get2HourBlockColors = (dateStr: string): string[] => {
    const day = days[dateStr];
    if (!day || day.blocks.length === 0) {
      return Array(12).fill(theme.defaultBlock);
    }

    const colors: string[] = [];
    // Group hours into 2-hour blocks (12 blocks for 24 hours)
    for (let blockIndex = 0; blockIndex < 12; blockIndex++) {
      const hour1 = blockIndex * 2;
      const hour2 = blockIndex * 2 + 1;
      
      const block1 = day.blocks[hour1];
      const block2 = day.blocks[hour2];
      
      let blockColor = theme.defaultBlock;
      
      // Prefer the first hour's category, if not found use second hour
      if (block1?.categoryId) {
        const category = dataService.getCategory(block1.categoryId);
        blockColor = category?.color || theme.defaultBlock;
      } else if (block2?.categoryId) {
        const category = dataService.getCategory(block2.categoryId);
        blockColor = category?.color || theme.defaultBlock;
      }
      
      colors.push(blockColor);
    }
    return colors;
  };

  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const weeks: any[] = [];
    let currentWeek: any[] = Array(startingDayOfWeek).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentWeek.push({ day, dateStr });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      currentWeek.push(...Array(7 - currentWeek.length).fill(null));
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weeks = getMonthDates();
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: theme.foreground, opacity: 0.5, letterSpacing: 0.5 }}>
          MOSAIC
        </Text>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: theme.foreground, marginTop: 4 }}>
          {monthName} {year}
        </Text>
      </View>

      {/* View Toggle */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 24, paddingBottom: 16, gap: 8 }}>
        <Pressable
          onPress={() => setViewMode('month')}
          style={({ pressed }) => ({
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: viewMode === 'month' ? theme.foreground : 'transparent',
            borderWidth: viewMode === 'month' ? 0 : 1,
            borderColor: theme.foreground,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: viewMode === 'month' ? theme.background : theme.foreground,
          }}>
            Month
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setViewMode('year')}
          style={({ pressed }) => ({
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: viewMode === 'year' ? theme.foreground : 'transparent',
            borderWidth: viewMode === 'year' ? 0 : 1,
            borderColor: theme.foreground,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: viewMode === 'year' ? theme.background : theme.foreground,
          }}>
            Year
          </Text>
        </Pressable>
      </View>

      {/* Month Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 20 }}>
        <Pressable
          onPress={() => {
            const prev = new Date(currentDate);
            prev.setMonth(prev.getMonth() - 1);
            // Only allow going back to January 2026
            if (prev.getFullYear() > 2026 || (prev.getFullYear() === 2026 && prev.getMonth() >= 0)) {
              setCurrentDate(prev);
            }
          }}
          style={({ pressed }) => {
            const canGoBack = currentDate.getFullYear() > 2026 || (currentDate.getFullYear() === 2026 && currentDate.getMonth() > 0);
            return { opacity: canGoBack ? (pressed ? 0.6 : 1) : 0.3 };
          }}
          disabled={currentDate.getFullYear() === 2026 && currentDate.getMonth() === 0}
        >
          <Text style={{ fontSize: 20, color: theme.foreground }}>←</Text>
        </Pressable>

        <Pressable
          onPress={() => setCurrentDate(new Date())}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.6 }}>Today</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            const next = new Date(currentDate);
            next.setMonth(next.getMonth() + 1);
            const today = new Date();
            // Only allow going forward to current month
            if (next <= today) {
              setCurrentDate(next);
            }
          }}
          style={({ pressed }) => {
            const today = new Date();
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const canGoForward = nextMonth <= today;
            return { opacity: canGoForward ? (pressed ? 0.6 : 1) : 0.3 };
          }}
          disabled={(() => {
            const today = new Date();
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return nextMonth > today;
          })()}
        >
          <Text style={{ fontSize: 20, color: theme.foreground }}>→</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {viewMode === 'month' ? (
          <>
            {/* Month Day List View - each day shows 12 colored blocks */}
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex}>
                {week.map((dayObj: any, dayIndex: number) => (
                  dayObj ? (
                    <View key={dayIndex} style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 40 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.foreground }}>
                          {dayObj.day}
                        </Text>
                        <Text style={{ fontSize: 11, color: theme.foreground, opacity: 0.6, marginTop: 2 }}>
                          {new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day).toLocaleDateString('en-US', { weekday: 'short' })}
                        </Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row', gap: 0, height: 32 }}>
                        {get2HourBlockColors(dayObj.dateStr).map((color, blockIndex, array) => {
                          const isFirst = blockIndex === 0;
                          const isLast = blockIndex === array.length - 1;
                          
                          return (
                            <View
                              key={blockIndex}
                              style={{
                                flex: 1,
                                backgroundColor: color,
                                borderWidth: 0.5,
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderTopLeftRadius: isFirst ? 8 : 0,
                                borderBottomLeftRadius: isFirst ? 8 : 0,
                                borderTopRightRadius: isLast ? 8 : 0,
                                borderBottomRightRadius: isLast ? 8 : 0,
                              }}
                            />
                          );
                        })}
                      </View>
                    </View>
                  ) : null
                ))}
              </View>
            ))}
          </>
        ) : (
          <>
            {/* Year View - Grid of days */}
            {/* Day labels */}
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <View key={day} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.5, marginBottom: 8 }}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Days grid */}
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={{ flexDirection: 'row', marginBottom: 8 }}>
                {week.map((dayObj: any, dayIndex: number) => (
                  <View
                    key={dayIndex}
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      padding: 4,
                    }}
                  >
                    {dayObj ? (
                      <Pressable
                        style={{
                          flex: 1,
                          backgroundColor: getDayColor(dayObj.dateStr),
                          borderRadius: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: '#ddd',
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#333' }}>
                          {dayObj.day}
                        </Text>
                      </Pressable>
                    ) : (
                      <View style={{ flex: 1 }} />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
