import { View } from "react-native";
import { useState } from "react";
import { Text as PaperText } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAdaptaiveTheme } from "@/constants/Colors";
export default function StreakFlame(props: {
    level: number;
    unfilled: string;
    filled: string;
}) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingLeft: 11,
                columnGap: 10,
            }}
        >
            <View
                style={{
                    width: 14,
                    height: 14,
                    borderRadius: 100,
                    backgroundColor:
                        props.level >= 1 ? props.filled : props.unfilled,
                }}
            />
            <View
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 100,
                    backgroundColor:
                        props.level >= 2 ? props.filled : props.unfilled,
                }}
            />
            <View
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 100,
                    backgroundColor:
                        props.level >= 3 ? props.filled : props.unfilled,
                }}
            />
            <MaterialCommunityIcons
                name="fire"
                size={42}
                color={props.level >= 4 ? props.filled : props.unfilled}
                style={{ paddingBottom: 7 }}
            />
            <View
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 100,
                    backgroundColor:
                        props.level >= 5 ? props.filled : props.unfilled,
                }}
            />
            <View
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 100,
                    backgroundColor:
                        props.level >= 6 ? props.filled : props.unfilled,
                }}
            />
            <MaterialCommunityIcons
                name="fire"
                size={48}
                color={props.level >= 7 ? props.filled : props.unfilled}
                style={{ paddingBottom: 10 }}
            />
        </View>
    );
}
