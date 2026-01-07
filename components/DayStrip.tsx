// components/DayStrip.tsx
import { ScrollView, View } from "react-native";
import TimeBlock from "./TimeBlock";

type DayStripProps = {
  blocks?: number;
  selectedCategory?: string | null;
  blockData?: Record<number, string | null>;
  onBlockUpdate?: (data: Record<number, string | null>) => void;
};

export default function DayStrip({ blocks = 12, selectedCategory, blockData = {}, onBlockUpdate }: DayStripProps) {
  const handleBlockPress = (index: number) => {
    const newData = { ...blockData };
    
    if (selectedCategory === null) {
      // Clear mode - remove the color
      delete newData[index];
    } else if (selectedCategory) {
      // Set color mode - fill with selected category
      newData[index] = selectedCategory;
    }
    
    onBlockUpdate?.(newData);
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
        {/* Time blocks row */}
        <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
          {Array.from({ length: blocks }).map((_, i) => (
            <TimeBlock 
              key={i} 
              index={i}
              color={blockData[i] || null}
              onPress={() => handleBlockPress(i)}
            />
          ))}
        </View>
        
        {/* Time labels row */}
        <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
          {Array.from({ length: blocks }).map((_, i) => {
            const start = i * 2;
            const end = ((i + 1) * 2) % 24;
            return (
              <View key={i} style={{ width: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 9, color: '#999', textAlign: 'center' }}>
                  {`${start}:00`}
                </Text>
                <Text style={{ fontSize: 9, color: '#999', textAlign: 'center' }}>
                  {`${end}:00`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

import { Text } from "react-native";

