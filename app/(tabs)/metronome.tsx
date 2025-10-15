import { View, StyleSheet } from "react-native";
import {
    Text as PaperText,
    Button as PaperButton,
    FAB,
    useTheme,
} from "react-native-paper";
import { useState, useRef, useReducer, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pendulum } from "@/components/Pendulum";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import useMetronomePlayer from "@/hooks/useMetronomePlayer";

export default function Metronome() {
    const safeInsets = useSafeAreaInsets();
    const activeTheme = useTheme();
    const activeLongPressInterval = useRef<any>(null);
    const [isPlayingOverall, setIsPlayingOverall] = useState(false);

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

    const { isPlaying, play, stop, load, currentBeat, progressSV } =
        useMetronomePlayer({
            bpm: currentBpm,
            numBeats: 4,
        });

    useEffect(() => {
        if (load) {
            load();
        }

        return () => {};
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
                    metronomeStatus={isPlayingOverall}
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
