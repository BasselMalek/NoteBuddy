import { View, StyleSheet } from "react-native";
import {
    Text as PaperText,
    Button as PaperButton,
    FAB,
    useTheme,
} from "react-native-paper";
import { useState, useRef, useReducer } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ticker } from "@/components/NewTicker";
import MetronomeModule from "react-native-metronome-module";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

export default function Metronome() {
    const safeInsets = useSafeAreaInsets();
    const activeTheme = useTheme();
    const activeLongPressInterval = useRef<NodeJS.Timeout>();
    const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
    MetronomeModule.setShouldPauseOnLostFocus(true);
    const globalStart = () => {
        MetronomeModule.setBPM(currentBpm);
        setIsMetronomePlaying(true);
        MetronomeModule.start();
        activateKeepAwakeAsync();
    };
    const globalEnd = () => {
        MetronomeModule.stop();
        setIsMetronomePlaying(false);
        deactivateKeepAwake();
    };

    const [currentBpm, setCurrentBpm] = useReducer(
        (state: number, action: number) => {
            globalEnd();
            if (state + action > 0 && state + action < 241) {
                state += action;
            } else if (state + action <= 0) {
                state = 0;
            } else {
                state = 240;
            }
            return state;
        },
        120
    );

    return (
        <View
            style={{
                flex: 1,
                paddingTop: safeInsets.top + 5,
                paddingBottom: safeInsets.bottom,
                paddingRight: safeInsets.right,
                paddingLeft: safeInsets.left,
            }}
        >
            <View style={style.rootContainer}>
                <Ticker
                    bpm={currentBpm}
                    metronomeStatus={isMetronomePlaying}
                    sourceColor={activeTheme.colors.surfaceVariant}
                    targetColor={activeTheme.colors.tertiary}
                ></Ticker>
                <View
                    style={{
                        margin: 20,
                        flexDirection: "row",
                        alignSelf: "center",
                        justifyContent: "center",
                        paddingHorizontal: 20,
                        gap: 10,
                    }}
                >
                    <PaperButton
                        compact
                        style={{
                            borderRadius: 12,
                            width: 50,
                        }}
                        elevation={5}
                        mode="elevated"
                        onPress={() => {
                            setCurrentBpm(-1);
                        }}
                        onLongPress={() => {
                            activeLongPressInterval.current = setInterval(
                                () => {
                                    setCurrentBpm(-10);
                                },
                                75
                            );
                        }}
                        onPressOut={() => {
                            clearInterval(activeLongPressInterval.current);
                        }}
                    >
                        <MaterialCommunityIcons name="minus"></MaterialCommunityIcons>
                    </PaperButton>
                    <View
                        style={{
                            backgroundColor:
                                activeTheme.colors.elevation.level1,
                            elevation: 5,
                            borderRadius: 12,
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            justifyContent: "center",
                            alignContent: "center",
                        }}
                    >
                        <PaperText
                            style={{
                                textAlign: "center",
                            }}
                        >
                            {currentBpm}
                        </PaperText>
                    </View>
                    <PaperButton
                        compact
                        elevation={5}
                        style={{
                            borderRadius: 12,
                            width: 50,
                        }}
                        mode="elevated"
                        onPress={() => {
                            setCurrentBpm(1);
                        }}
                        onLongPress={() => {
                            activeLongPressInterval.current = setInterval(
                                () => {
                                    setCurrentBpm(10);
                                },
                                75
                            );
                        }}
                        onPressOut={() => {
                            clearInterval(activeLongPressInterval.current);
                        }}
                    >
                        <MaterialCommunityIcons name="plus"></MaterialCommunityIcons>
                    </PaperButton>
                </View>
                <FAB
                    icon={isMetronomePlaying ? "pause" : "play"}
                    mode="elevated"
                    style={{
                        marginRight: 0,
                        alignSelf: "center",
                        marginBottom: 15,
                    }}
                    onPress={async () => {
                        if (isMetronomePlaying) {
                            globalEnd();
                        } else {
                            globalStart();
                        }
                    }}
                />
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 7,
        justifyContent: "center",
        alignItems: "center",
    },
});
