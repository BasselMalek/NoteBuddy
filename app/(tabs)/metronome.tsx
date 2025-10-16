import { View, StyleSheet } from "react-native";
import { Text, IconButton, FAB, useTheme } from "react-native-paper";
import { useState, useRef, useReducer, useEffect, useCallback } from "react";
import { Pendulum } from "@/components/Pendulum";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import useMetronomePlayer from "@/hooks/useMetronomePlayer";
import { useFocusEffect } from "expo-router";

export default function Metronome() {
    const safeInsets = useSafeAreaInsets();
    const { colors } = useTheme();
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
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
            }}
        >
            <Pendulum
                bpm={currentBpm}
                progress={currentBeat}
                signature={beatsPerBar}
                metronomeStatus={isPlayingOverall}
                sourceColor={colors.surfaceVariant}
                targetColor={colors.primary}
            />

            <View style={style.controlSection}>
                <Text variant="labelLarge" style={style.label}>
                    BPM
                </Text>
                <View style={style.controlRow}>
                    <IconButton
                        icon="minus-thick"
                        mode="contained"
                        size={14}
                        containerColor={colors.elevation.level1}
                        style={style.iconButton}
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
                    />
                    <IconButton
                        icon="minus"
                        mode="contained"
                        size={14}
                        containerColor={colors.elevation.level1}
                        style={style.iconButton}
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
                    />

                    <View
                        style={{
                            backgroundColor: colors.elevation.level1,
                            elevation: 5,
                            borderRadius: 12,
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            justifyContent: "center",
                            alignContent: "center",
                        }}
                    >
                        <Text style={style.valueText}>{currentBpm}</Text>
                    </View>

                    <IconButton
                        icon="plus"
                        mode="contained"
                        size={14}
                        containerColor={colors.elevation.level1}
                        style={style.iconButton}
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
                    />
                    <IconButton
                        icon="plus-thick"
                        mode="contained"
                        size={14}
                        containerColor={colors.elevation.level1}
                        style={style.iconButton}
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
                    />
                </View>
            </View>

            <View style={style.controlSection}>
                <Text variant="labelLarge" style={style.label}>
                    Beats Per Bar
                </Text>
                <View style={style.controlRow}>
                    <IconButton
                        icon="minus"
                        mode="contained"
                        size={14}
                        containerColor={colors.elevation.level1}
                        style={style.iconButton}
                        disabled={beatsPerBar === 2}
                        onPress={() => {
                            setBeatsPerBar(-1);
                        }}
                    />

                    <View
                        style={{
                            backgroundColor: colors.elevation.level1,
                            elevation: 5,
                            borderRadius: 12,
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            justifyContent: "center",
                            alignContent: "center",
                        }}
                    >
                        <Text style={style.valueText}>{beatsPerBar}</Text>
                    </View>

                    <IconButton
                        icon="plus"
                        mode="contained"
                        size={14}
                        containerColor={colors.elevation.level1}
                        style={style.iconButton}
                        disabled={beatsPerBar === 9}
                        onPress={() => {
                            setBeatsPerBar(1);
                        }}
                    />
                </View>
            </View>

            <FAB
                icon={isPlaying ? "pause" : "play"}
                mode="elevated"
                style={style.fab}
                onPress={toggleMetronome}
            />
        </View>
    );
}

const style = StyleSheet.create({
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
    iconButton: {
        width: 50,
        height: "auto",
        borderRadius: 12,
        margin: 0,
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
