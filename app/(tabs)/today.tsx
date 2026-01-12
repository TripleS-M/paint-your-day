import DayStrip from '@/components/DayStrip';
import { dataService } from '@/constants/dataService';
import { CategoryColors, useTheme } from '@/constants/theme';
import type { Day } from '@/constants/types';
import { getTodayString } from '@/constants/types';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View, useColorScheme } from 'react-native';

const CATEGORIES = Object.entries(CategoryColors).map(([key, value]) => ({ key, ...value }));

export default function TodayScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [todayData, setTodayData] = useState<Day | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const todayDateStr = getTodayString();

  // Load data on component focus
  useFocusEffect(
    useCallback(() => {
      loadTodayData();
      return () => {};
    }, [])
  );

  const loadTodayData = async () => {
    try {
      const day = await dataService.getOrCreateDay(todayDateStr);
      setTodayData(day);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading today data:', error);
      setIsLoaded(true);
    }
  };

  const handleBlockUpdate = async (hour: number, categoryId: string | null) => {
    try {
      await dataService.updateBlock(todayDateStr, hour, categoryId);
      // Reload today's data and create new object reference for React to detect change
      const updated = await dataService.getOrCreateDay(todayDateStr);
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
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: theme.foreground, opacity: 0.5, letterSpacing: 0.5 }}>
          TODAY
        </Text>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: theme.foreground, marginTop: 4 }}>
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
            {CATEGORIES.map((category) => (
              <Pressable
                key={category.key}
                onPress={() => setSelectedCategory(category.key)}
                style={({ pressed }) => {
                  const isSelected = selectedCategory === category.key;
                  const outlineColor = isSelected
                    ? (colorScheme === 'dark' ? '#ffffff' : '#000000')
                    : category.light;
                  
                  return {
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 12,
                    backgroundColor: category.light,
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
      <View style={{ flex: 1, justifyContent: 'center' }}>
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
    </View>
  );
}
