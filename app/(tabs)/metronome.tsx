import { View, StyleSheet } from "react-native";
import {
    Text as PaperText,
    Button as PaperButton,
    FAB,
    useTheme,
} from "react-native-paper";
import { useState, useRef, useReducer, useEffect, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pendulum } from "@/components/Pendulum";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import useMetronomePlayer from "@/hooks/useMetronomePlayer";
import { useFocusEffect } from "expo-router";

export default function Metronome() {
    const safeInsets = useSafeAreaInsets();
    const activeTheme = useTheme();
    const activeLongPressInterval = useRef<any>(null);
    const [isPlayingOverall, setIsPlayingOverall] = useState(false);

    useFocusEffect(
        useCallback(() => {
            () => {
                return () => {
                    stop();
                    setIsPlayingOverall(false);
                    deactivateKeepAwake();
                };
            };
        }, [])
    );

    const [currentBpm, setCurrentBpm] = useReducer(
        (state: number, action: number) => {
            if (state + action > 0 && state + action < 241) {
                state += action;
            } else if (state + action <= 0) {
                state = 0;
            } else {
                state = 240;
            }
            return state;
        },
        90
    );

    const [beatsPerBar, setBeatsPerBar] = useReducer(
        (state: number, action: number) => {
            const newValue = state + action;
            if (newValue >= 2 && newValue <= 9) {
                return newValue;
            } else if (newValue < 2) {
                return 2;
            } else {
                return 9;
            }
        },
        2
    );

    const { isPlaying, play, stop, load, currentBeat } = useMetronomePlayer({
        bpm: currentBpm,
        numBeats: beatsPerBar,
    });

    useEffect(() => {
        if (load) {
            load();
        }
    }, [load]);

    const toggleMetronome = () => {
        if (isPlaying) {
            stop();
            setIsPlayingOverall(false);
            deactivateKeepAwake();
        } else {
            play();
            setIsPlayingOverall(true);
            activateKeepAwakeAsync();
        }
    };

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
                <Pendulum
                    bpm={currentBpm}
                    progress={currentBeat}
                    signature={beatsPerBar}
                    metronomeStatus={isPlayingOverall}
                    sourceColor={activeTheme.colors.surfaceVariant}
                    targetColor={activeTheme.colors.tertiary}
                />

                <View style={style.controlSection}>
                    <PaperText variant="labelLarge" style={style.label}>
                        BPM
                    </PaperText>
                    <View style={style.controlRow}>
                        <PaperButton
                            compact
                            style={style.button}
                            elevation={5}
                            mode="elevated"
                            onPress={() => {
                                setCurrentBpm(-10);
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
                            <MaterialCommunityIcons name="minus-thick" />
                        </PaperButton>
                        <PaperButton
                            compact
                            style={style.button}
                            elevation={5}
                            mode="elevated"
                            onPress={() => {
                                setCurrentBpm(-1);
                            }}
                            onLongPress={() => {
                                activeLongPressInterval.current = setInterval(
                                    () => {
                                        setCurrentBpm(-1);
                                    },
                                    75
                                );
                            }}
                            onPressOut={() => {
                                clearInterval(activeLongPressInterval.current);
                            }}
                        >
                            <MaterialCommunityIcons name="minus" />
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
                            <PaperText style={style.valueText}>
                                {currentBpm}
                            </PaperText>
                        </View>

                        <PaperButton
                            compact
                            elevation={5}
                            style={style.button}
                            mode="elevated"
                            onPress={() => {
                                setCurrentBpm(1);
                            }}
                            onLongPress={() => {
                                activeLongPressInterval.current = setInterval(
                                    () => {
                                        setCurrentBpm(1);
                                    },
                                    75
                                );
                            }}
                            onPressOut={() => {
                                clearInterval(activeLongPressInterval.current);
                            }}
                        >
                            <MaterialCommunityIcons name="plus" />
                        </PaperButton>
                        <PaperButton
                            compact
                            elevation={5}
                            style={style.button}
                            mode="elevated"
                            onPress={() => {
                                setCurrentBpm(10);
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
                            <MaterialCommunityIcons name="plus-thick" />
                        </PaperButton>
                    </View>
                </View>

                <View style={style.controlSection}>
                    <PaperText variant="labelLarge" style={style.label}>
                        Beats Per Bar
                    </PaperText>
                    <View style={style.controlRow}>
                        <PaperButton
                            compact
                            style={style.button}
                            disabled={beatsPerBar === 2}
                            elevation={5}
                            mode="elevated"
                            onPress={() => {
                                setBeatsPerBar(-1);
                            }}
                        >
                            <MaterialCommunityIcons name="minus" />
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
                            <PaperText style={style.valueText}>
                                {beatsPerBar}
                            </PaperText>
                        </View>

                        <PaperButton
                            compact
                            elevation={5}
                            style={style.button}
                            disabled={beatsPerBar === 9}
                            mode="elevated"
                            onPress={() => {
                                setBeatsPerBar(1);
                            }}
                        >
                            <MaterialCommunityIcons name="plus" />
                        </PaperButton>
                    </View>
                </View>

                <FAB
                    icon={isPlaying ? "pause" : "play"}
                    mode="elevated"
                    style={style.fab}
                    onPress={toggleMetronome}
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
        gap: 24,
    },
    controlSection: {
        alignItems: "center",
        gap: 12,
    },
    label: {
        opacity: 0.7,
    },
    controlRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    button: {
        borderRadius: 12,
        width: 50,
    },
    valueDisplay: {
        elevation: 5,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 25,
        justifyContent: "center",
        alignContent: "center",
    },
    valueText: {
        textAlign: "center",
    },
    fab: {
        marginTop: 8,
    },
});
