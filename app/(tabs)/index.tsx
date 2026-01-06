import DayStrip from '@/components/DayStrip';
import { useTheme } from '@/constants/theme';
import { Text, View } from 'react-native';


export default function HomeScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: theme.background }}>
      <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: theme.foreground }}>
          Paint Your Day
        </Text>
        <Text style={{ color: theme.foreground, opacity: 0.7, marginTop: 4 }}>
          Tap a block to assign activity
        </Text>
      </View>

      {/*Day Strip*/}
      <DayStrip blocks={24} />
    </View>
  );
}
