import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { CategoryColors, CategoryColorsDark, useTheme } from "../constants/theme";

type TimeBlockProps = {
    index?: number;
    color?: string | null;
    onPress?: () => void;
};

export default function TimeBlock({ 
    index = 0,
    color = null,
    onPress
}: TimeBlockProps) {
    const theme = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Fade animation when color changes
    useEffect(() => {
        if (color) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [color]);

    const getColorForCategory = (category: string | null) => {
        if (!category) return theme.defaultBlock;
        const categoryData = CategoryColors[category as keyof typeof CategoryColors];
        return categoryData?.light || theme.defaultBlock;
    };

    const getDarkenedColor = (category: string | null) => {
        if (!category) return '#c0c0c0';
        return CategoryColorsDark[category as keyof typeof CategoryColorsDark] || '#c0c0c0';
    };

    const currentColor = getColorForCategory(color);
    const darkenedColor = getDarkenedColor(color);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
            })}
        >
            <View
                style={{
                    width: 60,
                    height: 180,
                    borderRadius: 14,
                    overflow: 'hidden',
                    backgroundColor: theme.defaultBlock,
                    borderWidth: 1.5,
                    borderColor: '#ddd',
                }}
            >
                {color && (
                    <>
                        {/* Fade in color background */}
                        <Animated.View
                            style={[
                                {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: currentColor,
                                },
                                {
                                    opacity: fadeAnim,
                                },
                            ]}
                        />

                        {/* Darkening overlay */}
                        <View
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor: darkenedColor,
                                opacity: 0.2,
                            }}
                        />

                        {/* Border highlight */}
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: 14,
                                borderWidth: 1.5,
                                borderColor: darkenedColor,
                                opacity: 0.35,
                            }}
                        />
                    </>
                )}
            </View>
        </Pressable>
    );
}

const StyleSheet = {
    absoluteFillObject: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
};