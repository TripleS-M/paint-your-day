import DayStrip from '@/components/DayStrip';
import { CategoryColors, useTheme } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const CATEGORIES = Object.entries(CategoryColors).map(([key, value]) => ({ key, ...value }));

export default function HomeScreen() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blockData, setBlockData] = useState<Record<number, string | null>>({});

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    loadBlockData();
  }, []);

  const loadBlockData = async () => {
    try {
      const saved = await AsyncStorage.getItem('blockData');
      if (saved) {
        setBlockData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading block data:', error);
    }
  };

  const updateBlockData = async (newData: Record<number, string | null>) => {
    setBlockData(newData);
    try {
      await AsyncStorage.setItem('blockData', JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving block data:', error);
    }
  };

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
                style={({ pressed }) => ({
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 12,
                  backgroundColor: category.light,
                  borderWidth: 1.5,
                  borderColor: selectedCategory === category.key ? '#000' : '#ddd',
                  opacity: pressed ? 0.8 : 1,
                })}
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
          blocks={12}
          selectedCategory={selectedCategory}
          blockData={blockData}
          onBlockUpdate={updateBlockData}
        />
      </View>

      {/* Clear Button at bottom */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 28, flexDirection: 'row', justifyContent: 'center' }}>
        <Pressable
          onPress={() => setSelectedCategory(null)}
          style={({ pressed }) => ({
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 12,
            backgroundColor: '#f0f0f0',
            opacity: pressed ? 0.8 : 1,
          })}
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
