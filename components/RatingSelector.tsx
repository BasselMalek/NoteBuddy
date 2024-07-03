import React, { useEffect, useState } from "react";
import { TouchableRipple } from "react-native-paper";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function RatingSelector(props: {
    ratingState: number;
    ratingHandler: Function;
    starColor: string;
}) {
    const [starStates, setStarStates] = useState<
        ("star" | "staro" | undefined)[]
    >([]);

    useEffect(() => {
        const newStarStates = Array.from({ length: 5 }, (_, index) =>
            index + 1 <= props.ratingState ? "star" : "staro"
        );
        setStarStates(newStarStates);

        return () => {
            // // starRefs.map((val, index) => {
            // //     val.current = "staro";
            // // });
        };
    }, [props.ratingState]);

    return (
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
            {starStates.map((val, index) => (
                <TouchableRipple
                    key={index}
                    // // onPress={props.ratingStateAction(index)}
                    onPress={() => {
                        props.ratingHandler(index + 1);
                    }}
                >
                    <AntDesign
                        name={val}
                        size={32}
                        style={{ color: props.starColor }}
                    ></AntDesign>
                </TouchableRipple>
            ))}
        </View>
    );
}
