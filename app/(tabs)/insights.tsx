import { dataService } from '@/constants/dataService';
import { useTheme } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

export default function InsightsScreen() {
  const theme = useTheme();
  const [insights, setInsights] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const lastDataVersion = useRef<number>(0);

  useFocusEffect(
    useCallback(() => {
      loadInsights();
      return () => { };
    }, [])
  );

  const loadInsights = (skipVersionCheck = false) => {
    try {
      const currentVersion = dataService.getVersion();

      // Efficient check: if data hasn't changed, skip reload
      if (!skipVersionCheck && currentVersion === lastDataVersion.current && insights !== null) {
        return;
      }

      const data = dataService.getInsights();
      // New object ref to ensure immediate re-render
      setInsights(data ? { ...data } : data);
      lastDataVersion.current = currentVersion;
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Force reload on pull-to-refresh
    loadInsights(true);
    setRefreshing(false);
  };

  if (!insights) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.foreground }}>Loading insights...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: theme.foreground, opacity: 0.5, letterSpacing: 0.5 }}>
          INSIGHTS
        </Text>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: theme.foreground, marginTop: 4 }}>
          Gentle reflections
        </Text>
      </View>

      {/* Insights Cards */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Days Tracked */}
        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#eee',
          }}
        >
          <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.6, marginBottom: 8 }}>
            Days Reflected On
          </Text>
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: theme.foreground }}>
            {insights.totalDaysTracked}
          </Text>
          <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.5, marginTop: 8 }}>
            Each day is a new pattern
          </Text>
        </View>

        {/* Most Used Category */}
        {insights.mostUsedCategory && (
          <View
            style={{
              backgroundColor: theme.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#eee',
            }}
          >
            <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.6, marginBottom: 12 }}>
              Most Present In Your Days
            </Text>
            <View
              style={{
                backgroundColor: insights.mostUsedCategory.color,
                borderRadius: 12,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#000' }}>
                {insights.mostUsedCategory.name}
              </Text>
            </View>
          </View>
        )}

        {/* Category Usage Breakdown */}
        {insights.categoryUsage.length > 0 && (
          <View
            style={{
              backgroundColor: theme.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#eee',
            }}
          >
            <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.6, marginBottom: 12 }}>
              Your Palette Usage
            </Text>
            {insights.categoryUsage.slice(0, 7).map((item: any, index: number) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.foreground }}>
                    {item.category.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.6 }}>
                    {item.count} hours
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      backgroundColor: item.category.color,
                      width: `${Math.min((item.count / insights.totalBlocksAssigned) * 100, 100)}%`,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Statistics */}
        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#eee',
          }}
        >
          <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.6, marginBottom: 12 }}>
            Overview
          </Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.5 }}>
                Total Hours Tracked
              </Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.foreground, marginTop: 4 }}>
                {insights.totalBlocksAssigned}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.5 }}>
                Categories Used
              </Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.foreground, marginTop: 4 }}>
                {insights.categoryUsage.length}
              </Text>
            </View>
          </View>
        </View>

        {insights.totalDaysTracked === 0 && (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: theme.foreground, opacity: 0.6 }}>
              Start painting your days to see insights
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
