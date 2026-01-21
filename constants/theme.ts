/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { useMemo } from 'react';
import { Platform, useColorScheme } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    background: '#F9FAFB',
    foreground: '#252525',
    card: '#FFFFFF', // Changed to pure white to match original design
    cardForeground: '#252525',
    header: '#f5f5f5',
    inputBackground: '#f5f5f5',
    inputBorder: '#E0E0E0',
    buttonBackground: '#1a1a2e',
    buttonText: '#FFFFFF',
    cancelButtonBackground: '#E0E0E0',
    cancelButtonText: '#666666',
    work: '#F5D5D8',
    relax: '#E8D5F2',
    excercise: '#F5E6D3',
    rest: '#C8E6F5',
    personal: '#D5F5E3',
    defaultBlock: '#FFFFFF',
  },

  dark: {
    background: '#121212',
    foreground: '#ffffff',
    card: '#252525',
    cardForeground: '#ffffff',
    header: '#f5f5f5',
    inputBackground: '#333333',
    inputBorder: '#444444',
    buttonBackground: '#FFFFFF',
    buttonText: '#1a1a2e',
    cancelButtonBackground: '#444444',
    cancelButtonText: '#FFFFFF',
    work: '#F5D5D8',
    relax: '#E8D5F2',
    excercise: '#F5E6D3',
    rest: '#C8E6F5',
    personal: '#D5F5E3',
    defaultBlock: '#2C2C2C', // Darkened for dark mode
  }
};

export const CategoryColors = {
  rest: { light: '#D4C5F9', dark: '#D4C5F9', name: 'Rest' },
  work: { light: '#ADD5F7', dark: '#ADD5F7', name: 'Work' },
  movement: { light: '#F5E6D3', dark: '#F5E6D3', name: 'Movement' },
  connection: { light: '#F7D4E0', dark: '#F7D4E0', name: 'Connection' },
  learning: { light: '#D4F7E3', dark: '#D4F7E3', name: 'Learning' },
  creative: { light: '#F7F0D4', dark: '#F7F0D4', name: 'Creative' },
};

export const CategoryColorsDark = {
  rest: '#9B8FD9',
  work: '#7EB7E8',
  movement: '#D9C29F',
  connection: '#E89FAF',
  learning: '#9FD9B8',
  creative: '#D9CE9F',
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return useMemo(() => (colorScheme === 'dark' ? Colors.dark : Colors.light), [colorScheme]);
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
