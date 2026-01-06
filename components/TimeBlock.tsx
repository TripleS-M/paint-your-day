import { useState } from "react";
import { Pressable } from "react-native";
import { useTheme } from "../constants/theme";

type TimeBlockProps = {
    size?: { width: number; height: number };
};

export default function TimeBlock({ size = {width: 24, height:24}}: TimeBlockProps) {
    const theme = useTheme();
    const [color, setColor] = useState(theme.defaultBlock);

    const colorCycle = [
        theme.work,
        theme.relax,
        theme.excercise,
        theme.rest,
        theme.personal,
        theme.defaultBlock
    ];

    const handlePress = () => {
        const currentIndex = colorCycle.indexOf(color);
        const nextIndex = (currentIndex + 1) % colorCycle.length;
        setColor(colorCycle[nextIndex]);
    };

    return (
        <Pressable
            style={{
                width: size.width,
                height: size.height,
                marginRight: 4,
                borderRadius: 6,
                backgroundColor: color,
            }}
            onPress={handlePress}
        />
    );
}