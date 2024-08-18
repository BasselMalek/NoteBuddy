import React, { useEffect, useState } from "react";
import { TouchableRipple, useTheme } from "react-native-paper";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function RatingSelector(props: {
    ratingState: number;
    ratingHandler: Function;
    error?: boolean;
}) {
    const activeTheme = useTheme();
    const [starStates, setStarStates] = useState<
        ("star" | "staro" | undefined)[]
    >([]);

    useEffect(() => {
        const newStarStates = Array.from({ length: 5 }, (_, index) =>
            index + 1 <= props.ratingState ? "star" : "staro"
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
                    <AntDesign
                        name={val}
                        size={32}
                        style={{
                            color:
                                props.error ?? false
                                    ? activeTheme.colors.error
                                    : props.ratingState === 0
                                    ? activeTheme.colors.outline
                                    : activeTheme.colors.onPrimaryContainer,
                        }}
                    ></AntDesign>
                </TouchableRipple>
            ))}
        </View>
    );
}
