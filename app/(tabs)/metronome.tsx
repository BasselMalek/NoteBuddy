import { View, StyleSheet } from "react-native";
import { Text, IconButton, FAB, useTheme } from "react-native-paper";
import { useState, useRef, useReducer, useEffect, useCallback } from "react";
import { Pendulum } from "@/components/Pendulum";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import useMetronomePlayer from "@/hooks/useMetronomePlayer";
import { useFocusEffect } from "expo-router";

export default function Metronome() {
    const { colors } = useTheme();
    const activeLongPressInterval = useRef<any>(null);
    const [isPlayingOverall, setIsPlayingOverall] = useState(false);
    const [currentBpm, setCurrentBpm] = useReducer(
        (state: number, action: number) => {
            const newValue = state + action;
            if (newValue >= 1 && newValue <= 240) {
                return newValue;
            } else if (newValue < 1) {
                return 1;
            } else {
                return 240;
            }
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

    const toggleMetronome = useCallback(
        (enable: boolean) => {
            if (enable) {
                play();
                setIsPlayingOverall(true);
                activateKeepAwakeAsync();
            } else {
                stop();
                setIsPlayingOverall(false);
                deactivateKeepAwake();
            }
        },
        [stop, play]
    );

    useFocusEffect(
        useCallback(() => {
            return () => toggleMetronome(false);
        }, [toggleMetronome])
    );

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
                    {"BPM"}
                </Text>
                <View style={style.controlRow}>
                    <IconButton
                        icon="minus-thick"
                        mode="contained"
                        size={14}
                        containerColor={colors.elevation.level1}
                        style={style.iconButton}
                        // UPDATED: Disabled if already at minimum
                        disabled={currentBpm <= 1}
                        onPress={() => {
                            toggleMetronome(false);
                            setCurrentBpm(-10);
                        }}
                        onLongPress={() => {
                            toggleMetronome(false);
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
                        // UPDATED: Disabled if already at minimum
                        disabled={currentBpm <= 1}
                        onPress={() => {
                            toggleMetronome(false);
                            setCurrentBpm(-1);
                        }}
                        onLongPress={() => {
                            toggleMetronome(false);
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
                        disabled={currentBpm >= 240}
                        onPress={() => {
                            toggleMetronome(false);
                            setCurrentBpm(1);
                        }}
                        onLongPress={() => {
                            toggleMetronome(false);
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
                        disabled={currentBpm >= 240}
                        onPress={() => {
                            toggleMetronome(false);
                            setCurrentBpm(10);
                        }}
                        onLongPress={() => {
                            toggleMetronome(false);
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
                    {"Beats Per Bar"}
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
                            toggleMetronome(false);
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
                            toggleMetronome(false);
                            setBeatsPerBar(1);
                        }}
                    />
                </View>
            </View>
            <FAB
                icon={isPlaying ? "pause" : "play"}
                mode="elevated"
                style={style.fab}
                onPress={() => toggleMetronome(!isPlaying)}
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
