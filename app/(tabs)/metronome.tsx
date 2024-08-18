import { View, StyleSheet } from "react-native";
import {
    PaperProvider,
    Text as PaperText,
    Button as PaperButton,
    FAB,
    useTheme,
} from "react-native-paper";
import { useState, useRef, useReducer } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ticker } from "@/components/NewTicker";
import { Metronome as MetronomeModule } from "rn-metronome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Metronome() {
    const safeInsets = useSafeAreaInsets();
    const activeTheme = useTheme();
    const activeLongPressInterval = useRef<NodeJS.Timeout>();
    const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);

    const globalStart = () => {
        setIsMetronomePlaying(true);
        MetronomeModule.play(currentBpm);
    };
    const globalEnd = () => {
        MetronomeModule.stop();
        setIsMetronomePlaying(false);
    };

    const [currentBpm, setCurrentBpm] = useReducer(
        (state: number, action: number) => {
            globalEnd();
            state += action;
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
