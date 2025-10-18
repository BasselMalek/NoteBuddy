import React, { useEffect, useState } from "react";
import { Icon, TouchableRipple, useTheme } from "react-native-paper";
import { View } from "react-native";

export default function RatingSelector(props: {
    ratingState: number;
    ratingHandler: (rating: number) => void;
    error?: boolean;
}) {
    const activeTheme = useTheme();
    const [starStates, setStarStates] = useState<("star" | "star-outline")[]>(
        []
    );

    useEffect(() => {
        const newStarStates = Array.from({ length: 5 }, (_, index) =>
            index + 1 <= props.ratingState ? "star" : "star-outline"
        );
        setStarStates(newStarStates);
    }, [props.ratingState]);

    return (
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
            {starStates.map((val, index) => (
                <TouchableRipple
                    key={index}
                    onPress={() => {
                        props.ratingHandler(index + 1);
                    }}
                >
                    <Icon
                        source={val}
                        size={32}
                        color={
                            props.error
                                ? activeTheme.colors.error
                                : props.ratingState === 0
                                ? activeTheme.colors.outline
                                : activeTheme.colors.onPrimaryContainer
                        }
                    />
                </TouchableRipple>
            ))}
        </View>
    );
}
