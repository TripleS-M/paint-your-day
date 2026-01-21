// TabIcon component with animated scaling for active tab
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, TextStyle } from 'react-native';

type TabIconProps = {
  name: IconSymbolName;
  focused: boolean;
};

export function TabIcon({ name, focused }: TabIconProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: focused ? 1.2 : 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const scheme = useColorScheme();
  const activeColor = scheme === 'dark' ? 'white' : 'black';
  const color = focused ? activeColor : '#888'; // subtle gray when not active
  const size = focused ? 28 : 24; // slightly larger when active
  const style: StyleProp<TextStyle> = {
    fontWeight: focused ? 'bold' : 'normal',
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <IconSymbol name={name} size={size} color={color} style={style} />
    </Animated.View>
  );
}
