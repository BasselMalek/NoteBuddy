import { StyleSheet, View } from "react-native";
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
                justifyContent: "space-between",
                paddingHorizontal: 60,
                paddingVertical: 10,
                marginBottom: 8,
                elevation: 5,
            }}
        >
            <MaterialCommunityIcons
                name="circle"
                size={24}
                color={props.level >= 1 ? props.filled : props.unfilled}
            />
            <MaterialCommunityIcons
                name="circle"
                size={16}
                color={props.level >= 2 ? props.filled : props.unfilled}
            />
            <MaterialCommunityIcons
                name="circle"
                size={16}
                color={props.level >= 3 ? props.filled : props.unfilled}
            />
            <MaterialCommunityIcons
                name="circle"
                size={24}
                color={props.level >= 4 ? props.filled : props.unfilled}
            />
            <MaterialCommunityIcons
                name="circle"
                size={16}
                color={props.level >= 5 ? props.filled : props.unfilled}
            />
            <MaterialCommunityIcons
                name="circle"
                size={16}
                color={props.level >= 6 ? props.filled : props.unfilled}
            />
            <MaterialCommunityIcons
                name="fire"
                size={24}
                color={props.level >= 7 ? props.filled : props.unfilled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    dot: {
        width: 8,
        height: 8,
        borderRadius: 100,
    },
});
