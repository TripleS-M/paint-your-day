import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { dataService } from "../constants/dataService";
import { useTheme } from "../constants/theme";
import type { TimeBlock as TimeBlockType } from "../constants/types";

type TimeBlockProps = {
    block: TimeBlockType;
    isSelected?: boolean;
    onPress?: () => void;
};

export default function TimeBlock({ 
    block,
    isSelected = false,
    onPress
}: TimeBlockProps) {
    const theme = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Fade animation when color changes
    useEffect(() => {
        const targetValue = block.categoryId ? 1 : 0;
        Animated.timing(fadeAnim, {
            toValue: targetValue,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [block.categoryId, fadeAnim]);

    const getColorForCategory = (categoryId: string | null) => {
        if (!categoryId) return theme.defaultBlock;
        const category = dataService.getCategory(categoryId);
        return category?.color || theme.defaultBlock;
    };

    const getDarkenedColor = (categoryId: string | null) => {
        if (!categoryId) return '#c0c0c0';
        const category = dataService.getCategory(categoryId);
        return category?.darkColor || '#c0c0c0';
    };

    // Get outline color - matches category color
    const getOutlineColor = () => {
        return getColorForCategory(block.categoryId);
    };

    const currentColor = getColorForCategory(block.categoryId);
    const darkenedColor = getDarkenedColor(block.categoryId);
    const outlineColor = getOutlineColor();

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
                    borderColor: outlineColor,
                }}
            >
                {block.categoryId && (
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
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
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
                                borderWidth: 2,
                                borderColor: darkenedColor,
                                opacity: 0.4,
                            }}
                        />
                    </>
                )}
            </View>
        </Pressable>
    );
}
