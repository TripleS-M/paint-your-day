import DayStrip from '@/components/DayStrip';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { dataService } from '@/constants/dataService';
import { useTheme } from '@/constants/theme';
import type { Category, Day } from '@/constants/types';
import { formatDate, getTodayString } from '@/constants/types';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View, useColorScheme } from 'react-native';

export default function TodayScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [todayData, setTodayData] = useState<Day | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const lastDataVersion = useRef<number>(0);

  // Dev toggle: Set to true to allow unlimited past navigation
  const DEV_UNRESTRICTED_NAVIGATION = false;

  // Helper to check if viewing today
  const isToday = formatDate(currentDate) === getTodayString();

  // Back navigation is allowed if we're in dev mode OR if we're currently on today (allowing 1 step back)
  const canGoBack = DEV_UNRESTRICTED_NAVIGATION || isToday;

  const dateString = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const currentDateStr = formatDate(currentDate);

  const navigateDate = (days: number) => {
    // Prevent going back if not allowed
    if (days < 0 && !canGoBack) return;

    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);

    // Prevent going into future
    if (days > 0 && isToday) return;

    setCurrentDate(newDate);
    setIsLoaded(false); // Trigger loading state for new date
  };

  // Load data on component focus
  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => { };
    }, [currentDate]) // Reload when date changes
  );

  const loadData = async (skipVersionCheck = false) => {
    try {
      const currentVersion = dataService.getVersion();

      // Efficient check: if data hasn't changed, skip reload
      if (!skipVersionCheck && currentVersion === lastDataVersion.current && isLoaded) {
        return;
      }

      const allCategories = dataService.data.categories;
      // Copy array so React always receives a new reference
      setCategories([...allCategories]);

      const day = await dataService.getOrCreateDay(currentDateStr);
      setTodayData(day);
      lastDataVersion.current = currentVersion;
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading today data:', error);
      setIsLoaded(true);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(true); // Force reload on pull-to-refresh
    setRefreshing(false);
  };

  const handleBlockUpdate = async (hour: number, categoryId: string | null) => {
    try {
      await dataService.updateBlock(currentDateStr, hour, categoryId);
      // Reload today's data and create new object reference for React to detect change
      const updated = await dataService.getOrCreateDay(currentDateStr);
      // Create a new copy of the day object to force React to detect the change
      setTodayData({
        ...updated,
        blocks: [...updated.blocks],
      });
    } catch (error) {
      console.error('Error updating block:', error);
    }
  };

  if (!isLoaded || !todayData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.foreground }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ flexGrow: 1, paddingTop: 60 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: theme.foreground, opacity: 0.5, letterSpacing: 0.5 }}>
            {isToday ? 'TODAY' : 'HISTORY'}
          </Text>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Pressable
              onPress={() => navigateDate(-1)}
              hitSlop={10}
              disabled={!canGoBack}
              style={{ opacity: canGoBack ? 1 : 0.3 }}
            >
              <IconSymbol name="chevron.left" size={24} color={theme.foreground} />
            </Pressable>

            <Pressable
              onPress={() => navigateDate(1)}
              hitSlop={10}
              disabled={isToday}
              style={{ opacity: isToday ? 0.3 : 1 }}
            >
              <IconSymbol name="chevron.right" size={24} color={theme.foreground} />
            </Pressable>
          </View>
        </View>

        <Text style={{ fontSize: 28, fontWeight: "bold", color: theme.foreground }}>
          {dateString}
        </Text>
      </View>

      {/* Category Selector - Horizontal */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 32, paddingTop: 8 }}>
        <Text style={{ fontSize: 11, fontWeight: '600', color: theme.foreground, opacity: 0.5, letterSpacing: 0.5, marginBottom: 12 }}>
          SELECT CATEGORY
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={({ pressed }) => {
                  const isSelected = selectedCategory === category.id;
                  const outlineColor = isSelected
                    ? (colorScheme === 'dark' ? '#ffffff' : '#000000')
                    : category.color;

                  return {
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 12,
                    backgroundColor: category.color,
                    borderWidth: 1.5,
                    borderColor: outlineColor,
                    opacity: pressed ? 0.8 : 1,
                  };
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#000',
                }}>
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Day Strip with pinned time labels */}
      <View style={{ flex: 1, justifyContent: 'center', minHeight: 400 }}>
        <DayStrip
          day={todayData}
          selectedCategory={selectedCategory}
          onBlockUpdate={handleBlockUpdate}
        />
      </View>

      {/* Clear Button at bottom */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 28, flexDirection: 'row', justifyContent: 'center' }}>
        <Pressable
          onPress={() => setSelectedCategory(null)}
          style={({ pressed }) => {
            const isClearPressed = selectedCategory === null;
            const outlineColor = isClearPressed
              ? (colorScheme === 'dark' ? '#ffffff' : '#000000')
              : theme.defaultBlock;

            return {
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
              backgroundColor: '#f0f0f0',
              borderWidth: 1.5,
              borderColor: outlineColor,
              opacity: pressed ? 0.8 : 1,
            };
          }}
        >
          <Text style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#666',
            textAlign: 'center'
          }}>
            Clear
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
