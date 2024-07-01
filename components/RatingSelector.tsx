import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useEffect, useState } from "react";
import { TouchableRipple } from "react-native-paper";
import { View } from "react-native";

export default function RatingSelector(props: {
    ratingState: number;
    ratingHandler: Function;
    starColor: string;
}) {
    const [starStates, setStarStates] = useState<
        ("star" | "star-outline" | undefined)[]
    >([]);

    useEffect(() => {
        const newStarStates = Array.from({ length: 5 }, (_, index) =>
            index + 1 <= props.ratingState ? "star" : "star-outline"
        );
        setStarStates(newStarStates);

        return () => {
            // // starRefs.map((val, index) => {
            // //     val.current = "star-outline";
            // // });
        };
    }, [props.ratingState]);

    return (
        <View style={{ flexDirection: "row" }}>
            {starStates.map((val, index) => (
                <TouchableRipple
                    key={index}
                    // // onPress={props.ratingStateAction(index)}
                    onPress={() => {
                        props.ratingHandler(index + 1);
                    }}
                >
                    <MaterialCommunityIcons
                        name={val}
                        size={40}
                        style={{ color: props.starColor }}
                    ></MaterialCommunityIcons>
                </TouchableRipple>
            ))}
        </View>
    );
}
