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
import { useState, useRef, useReducer } from "react";
import { useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Svg, Circle } from "react-native-svg";
import { Ticker, TimeSignature } from "@/components/Ticker";

export default function Metronome() {
    const [activeTheme, setActiveTheme] = useState(
        useColorScheme() === "light" ? LightTheme : DarkTheme
    );
    const [currentBpm, setCurrentBpm] = useReducer(
        //TODO1.1: make it so the action obj has exactValue/additiveValue to account for exact/increment
        (state: number, action: number) => (state += action),
        90
    );
    const [currentTimeSignature, setCurrentTimeSignature] =
        useState<TimeSignature>({ beats: 4, beatValue: 4 });
    const activeInterval = useRef<NodeJS.Timeout>();

    return (
        <PaperProvider theme={activeTheme}>
            <StatusBar style="auto"></StatusBar>
            <View style={style.container}>
                <Card
                    style={{
                        ...style.card,
                        flex: 4,
                        marginBottom: 7,
                    }}
                >
                    <Ticker beats={currentTimeSignature.beats}></Ticker>
                </Card>
                <Card
                    style={{
                        ...style.card,
                        flex: 1,
                        alignItems: "center",
                        alignContent: "center",
                    }}
                >
                    <View style={{ flexDirection: "row", gap: 15, margin: 20 }}>
                        <Chip
                            onPress={() => {
                                setCurrentTimeSignature({
                                    beats: 2,
                                    beatValue: 4,
                                });
                            }}
                        >
                            2/4
                        </Chip>
                        <Chip
                            onPress={() => {
                                setCurrentTimeSignature({
                                    beats: 3,
                                    beatValue: 4,
                                });
                            }}
                        >
                            3/4
                        </Chip>
                        <Chip
                            onPress={() => {
                                setCurrentTimeSignature({
                                    beats: 4,
                                    beatValue: 4,
                                });
                            }}
                        >
                            4/4
                        </Chip>
                        <Chip
                            onPress={() => {
                                setCurrentTimeSignature({
                                    beats: 6,
                                    beatValue: 8,
                                });
                            }}
                        >
                            6/8
                        </Chip>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 15,
                            justifyContent: "center",
                        }}
                    >
                        <PaperButton
                            mode="outlined"
                            onPress={() => {
                                setCurrentBpm(-1);
                            }}
                            onLongPress={() => {
                                activeInterval.current = setInterval(() => {
                                    setCurrentBpm(-10);
                                }, 100);
                            }}
                            onPressOut={() => {
                                clearInterval(activeInterval.current);
                            }}
                        >
                            <MaterialCommunityIcons name="minus"></MaterialCommunityIcons>
                        </PaperButton>
                        <Chip style={{ justifyContent: "center" }}>
                            {/* //TODO1: turn this into a text input field to
                                enter an exact BPM.*/}

                            {currentBpm}
                        </Chip>
                        <PaperButton
                            mode="outlined"
                            onPress={() => {
                                setCurrentBpm(1);
                            }}
                            onLongPress={() => {
                                activeInterval.current = setInterval(() => {
                                    setCurrentBpm(10);
                                }, 100);
                            }}
                            onPressOut={() => {
                                clearInterval(activeInterval.current);
                            }}
                        >
                            <MaterialCommunityIcons name="plus"></MaterialCommunityIcons>
                        </PaperButton>
                    </View>
                </Card>
            </View>
        </PaperProvider>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 7,
    },
    card: {
        padding: 10,
    },
});
