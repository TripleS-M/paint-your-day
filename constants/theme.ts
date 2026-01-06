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
    background: '#ffffff',
    foreground: '#252525',
    card: '#f9f9f9',
    cardForeground: '#252525',
    header: '#f5f5f5',
    work: '#F5D5D8',
    relax:'#E8D5F2',
    excercise: '#F5E6D3',
    rest: '#C8E6F5',
    personal:'#D5F5E3',
    defaultBlock:'#e0e0e0',
    },
    
    dark: {
    background: '#121212',
    foreground: '#ffffff',
    card: '#252525',
    cardForeground: '#ffffff',
    header: '#f5f5f5',
    work: '#F5D5D8',
    relax:'#E8D5F2',
    excercise: '#F5E6D3',
    rest: '#C8E6F5',
    personal:'#D5F5E3',
    defaultBlock:'#e0e0e0',
    }
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return useMemo( () => (colorScheme === 'dark' ? Colors.dark : Colors.light), [colorScheme]);
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
