import { View, Text, Button, StyleSheet } from "react-native";
import {
    PaperProvider,
    Text as PaperText,
    Chip,
    Card,
    Button as PaperButton,
    FAB,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { useState, useRef, useReducer } from "react";
import { useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Svg, Circle } from "react-native-svg";
import { Ticker, TimeSignature } from "@/components/Ticker";
import { Ticker as NewTicker } from "@/components/NewTicker";
import { Metronome as MetronomeModule } from "rn-metronome";
import Animated, {
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
    runOnUI,
    useAnimatedStyle,
    interpolateColor,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function Metronome() {
    const safeInsets = useSafeAreaInsets();
    const [currentBpm, setCurrentBpm] = useReducer(
        //TODO(1.1): make it so the action obj has exactValue/additiveValue to account for exact/increment
        (state: number, action: number) => {
            MetronomeModule.stop();
            state += action;
            return state;
        },
        120
    );
    const [currentTimeSignature, setCurrentTimeSignature] =
        useState<TimeSignature>({ beats: 4, beatValue: 4 });

    const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);

    const activeLongPressInterval = useRef<NodeJS.Timeout>();

    return (
        <PaperProvider theme={getAdaptaiveTheme()}>
            <StatusBar style="auto"></StatusBar>
            <View
                style={{
                    flex: 1,
                    paddingTop: safeInsets.top + 5,
                    paddingBottom: safeInsets.bottom,
                    paddingRight: safeInsets.right,
                    paddingLeft: safeInsets.left,
                }}
            >
                <View style={style.container}>
                    <View
                        style={{
                            ...style.card,
                            flex: 4,
                            marginBottom: 7,
                            justifyContent: "center",
                            alignContent: "center",
                        }}
                    >
                        <NewTicker
                            bpm={currentBpm}
                            metronomeStatus={isMetronomePlaying}
                            beats={currentTimeSignature.beats}
                            sourceColor={
                                getAdaptaiveTheme().colors.surfaceVariant
                            }
                            targetColor={getAdaptaiveTheme().colors.tertiary}
                        ></NewTicker>
                        <FAB
                            icon={isMetronomePlaying ? "pause" : "play"}
                            mode="elevated"
                            style={{ marginRight: 0, alignSelf: "center" }}
                            onPress={async () => {
                                if (isMetronomePlaying) {
                                    MetronomeModule.stop();
                                    setIsMetronomePlaying(!isMetronomePlaying);
                                } else {
                                    setIsMetronomePlaying(!isMetronomePlaying);
                                    MetronomeModule.play(currentBpm);
                                }
                            }}
                        />
                    </View>
                    <Card
                        style={{
                            ...style.card,
                            flex: 1,
                            alignItems: "center",
                            alignContent: "center",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 15,
                                margin: 20,
                            }}
                        >
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
                                    activeLongPressInterval.current =
                                        setInterval(() => {
                                            setCurrentBpm(-10);
                                        }, 100);
                                }}
                                onPressOut={() => {
                                    clearInterval(
                                        activeLongPressInterval.current
                                    );
                                }}
                            >
                                <MaterialCommunityIcons name="minus"></MaterialCommunityIcons>
                            </PaperButton>
                            <Chip style={{ justifyContent: "center" }}>
                                {/* //TODO(1): turn this into a text input field to
                                enter an exact BPM.*/}
                                {currentBpm}
                            </Chip>
                            <PaperButton
                                mode="outlined"
                                onPress={() => {
                                    setCurrentBpm(1);
                                }}
                                onLongPress={() => {
                                    activeLongPressInterval.current =
                                        setInterval(() => {
                                            setCurrentBpm(10);
                                        }, 100);
                                }}
                                onPressOut={() => {
                                    clearInterval(
                                        activeLongPressInterval.current
                                    );
                                }}
                            >
                                <MaterialCommunityIcons name="plus"></MaterialCommunityIcons>
                            </PaperButton>
                        </View>
                    </Card>
                </View>
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
