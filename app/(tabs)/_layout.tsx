import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { TabIcon } from '@/components/tab-icon';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const scheme = useColorScheme();
  const activeTintColor = scheme === 'dark' ? 'white' : 'black';
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: '#888',
      }}>
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => <TabIcon name="sun.max.fill" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="mosaic"
        options={{
          title: 'Mosaic',
          tabBarIcon: ({ focused }) => <TabIcon name="rectangle.split.3x3.fill" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused }) => <TabIcon name="paintpalette.fill" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ focused }) => <TabIcon name="lightbulb.fill" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
