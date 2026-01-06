// components/DayStrip.tsx
import { ScrollView } from "react-native";
import TimeBlock from "./TimeBlock";

type DayStripProps = {
  blocks?: number; // number of blocks in the strip
};

export default function DayStrip({ blocks = 24 }: DayStripProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16, paddingHorizontal: 16 }}>
      {Array.from({ length: blocks }).map((_, i) => (
        <TimeBlock key={i} />
      ))}
    </ScrollView>
  );
}
