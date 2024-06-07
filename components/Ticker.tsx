import { View, Text, Button, StyleSheet } from "react-native";
import {
    PaperProvider,
    Text as PaperText,
    Chip,
    Card,
    Button as PaperButton,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, LightTheme } from "@/constants/Colors";
import { useState, useRef, useReducer, ComponentPropsWithoutRef } from "react";
import { useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Svg, Circle } from "react-native-svg";

interface TimeSignature {
    beats: number;
    beatValue: number;
}

function Ticker(props: { beats: number }) {
    const tickerBalls = Array.from({ length: props.beats }, (j, k) => k);
    return (
        <View
            style={{
                flexDirection: "row",
                gap: 15,
                margin: 20,
                justifyContent: "center",
            }}
        >
            {tickerBalls.map((val, index) => {
                return (
                    <Chip
                        key={index.toString()}
                        style={{ borderRadius: 100, elevation: 4 }}
                    >
                        {""}
                    </Chip>
                );
            })}
        </View>
    );
}

export { TimeSignature, Ticker };
