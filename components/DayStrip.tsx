// components/DayStrip.tsx
import type { Day } from "@/constants/types";
import { ScrollView, Text, View } from "react-native";
import TimeBlock from "./TimeBlockNew";

type DayStripProps = {
  day: Day;
  selectedCategory?: string | null;
  onBlockUpdate?: (hour: number, categoryId: string | null) => void;
};

export default function DayStrip({ day, selectedCategory, onBlockUpdate }: DayStripProps) {
  const handleBlockPress = (startHour: number) => {
    onBlockUpdate?.(startHour, selectedCategory || null);
  };

  // Create 2-hour blocks
  const twoHourBlocks = [];
  for (let i = 0; i < 12; i++) {
    const startHour = i * 2;
    const endHour = (i * 2 + 1) % 24;
    const blocks = [day.blocks[startHour], day.blocks[startHour + 1]];
    twoHourBlocks.push({
      startHour,
      endHour,
      blocks,
      categoryId: blocks[0]?.categoryId || null,
    });
  }

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
          {twoHourBlocks.map((block) => (
            <TimeBlock 
              key={block.startHour} 
              block={{
                hour: block.startHour,
                categoryId: block.categoryId,
              }}
              isSelected={selectedCategory !== null && block.categoryId === selectedCategory}
              onPress={() => handleBlockPress(block.startHour)}
            />
          ))}
        </View>
        
        {/* Time labels row */}
        <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
          {twoHourBlocks.map((block) => (
            <View key={block.startHour} style={{ width: 60, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 9, color: '#999', textAlign: 'center' }}>
                {`${String(block.startHour).padStart(2, '0')}:00 - ${String((block.startHour + 2) % 24).padStart(2, '0')}:00`}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

