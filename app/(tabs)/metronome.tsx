import { View, StyleSheet } from "react-native";
import {
    Text as PaperText,
    Button as PaperButton,
    FAB,
    useTheme,
} from "react-native-paper";
import { useState, useRef, useReducer, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ticker } from "@/components/NewTicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { AudioContext } from "react-native-audio-api";
import { useFileSound } from "@/hooks/useFileSound";
import useMetronomePlayer from "@/hooks/usePlayer";

export default function Metronome() {
    const safeInsets = useSafeAreaInsets();
    const activeTheme = useTheme();
    const activeLongPressInterval = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(new AudioContext());
    const downBeatSoundRef = useRef<any>(null);
    const upBeatSoundRef = useRef<any>(null);

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
        120
    );

    downBeatSoundRef.current = useFileSound(
        audioContextRef.current!,
        require("@/assets/sounds/Perc_MetronomeQuartz_hi.wav"),
        0.8
    );

    upBeatSoundRef.current = useFileSound(
        audioContextRef.current!,
        require("@/assets/sounds/Perc_MetronomeQuartz_lo.wav"),
        0.6
    );
    useEffect(() => {
        if (audioContextRef.current) {
            downBeatSoundRef.current.load();
            upBeatSoundRef.current.load();
        }

        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    useEffect(() => {
        downBeatSoundRef.current.load();
        upBeatSoundRef.current.load();
    }, []);

    const { isPlaying, play, stop } = useMetronomePlayer({
        bpm: currentBpm,
        numBeats: 4,
        setup: (audioContext) => {
            return {
                playNote: (beatType, time) => {
                    if (beatType === "downbeat") {
                        downBeatSoundRef.current.play(time);
                    } else {
                        upBeatSoundRef.current.play(time);
                    }
                },
            };
        },
    });

    const toggleMetronome = () => {
        if (isPlaying) {
            stop();
            deactivateKeepAwake();
        } else {
            play();
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
                <Ticker
                    bpm={currentBpm}
                    metronomeStatus={isPlaying}
                    sourceColor={activeTheme.colors.surfaceVariant}
                    targetColor={activeTheme.colors.tertiary}
                />
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
                        style={{
                            borderRadius: 12,
                            width: 50,
                        }}
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
                <FAB
                    icon={isPlaying ? "pause" : "play"}
                    mode="elevated"
                    style={{
                        marginRight: 0,
                        alignSelf: "center",
                        marginBottom: 15,
                    }}
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
    },
});
