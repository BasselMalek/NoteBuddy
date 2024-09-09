import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { PitchDetector } from "react-native-pitch-detector";
import { PERMISSIONS, check, RESULTS, request } from "react-native-permissions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import calcMidi from "@/constants/MidiNotes";
import { FAB, Text as PaperText, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

export default function index() {
    const safeInsets = useSafeAreaInsets();
    const activeTheme = useTheme();
    const [isRecording, setisRecording] = useState<Boolean>();
    const [pitch, setPitch] = useState<string>("\u{266A}\u{266A}");
    const [fill, setFill] = useState<number>(0);

    async function startTuner() {
        let status = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (status != RESULTS.GRANTED) {
            const permReq = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
            status = permReq;
        }
        if (status === RESULTS.GRANTED && !isRecording) {
            PitchDetector.start();
            setisRecording(true);
            PitchDetector.addListener(async (data) => {
                const liveInfo = calcMidi(data.frequency);
                setPitch(liveInfo.note);
                setFill(liveInfo.fill);
                setisRecording(await PitchDetector.isRecording());
            });
            activateKeepAwakeAsync();
        }
    }
    async function stopTuner() {
        PitchDetector.stop();
        setisRecording(await PitchDetector.isRecording());
        PitchDetector.removeAllListeners();
        setFill(0);
        setPitch("\u{266A}\u{266A}");
        activateKeepAwakeAsync();
        deactivateKeepAwake();
    }

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
            <View style={styles.rootContainer}>
                <MaterialCommunityIcons
                    size={32}
                    name="music-note"
                    color={
                        fill > 47 && fill < 53
                            ? activeTheme.colors.tertiary
                            : activeTheme.colors.outlineVariant
                    }
                    style={{
                        paddingBottom: 10,
                        alignSelf: "center",
                        elevation: 5,
                    }}
                />
                <View style={{ marginBottom: 200 }}>
                    <AnimatedCircularProgress
                        size={350}
                        lineCap="round"
                        rotation={-105}
                        style={{
                            marginBottom: 0,
                            height: 230,
                        }}
                        //dashedBackground={{ width: 40, gap: 15 }}
                        arcSweepAngle={210}
                        fill={fill}
                        width={10}
                        tintColor={activeTheme.colors.tertiary}
                        backgroundColor={activeTheme.colors.surfaceVariant}
                    >
                        {(fill) => {
                            return (
                                <>
                                    <PaperText
                                        style={{
                                            fontSize: 60,
                                            paddingBottom: 85,
                                        }}
                                    >
                                        {pitch.length === 3
                                            ? pitch.substring(0, 2)
                                            : pitch.charAt(0)}
                                        <PaperText style={{ fontSize: 24 }}>
                                            {pitch.length === 3
                                                ? pitch.substring(2)
                                                : pitch.substring(1)}
                                        </PaperText>
                                    </PaperText>
                                </>
                            );
                        }}
                    </AnimatedCircularProgress>
                    <MaterialCommunityIcons
                        name="music-accidental-flat"
                        size={32}
                        color={activeTheme.colors.primary}
                        style={{
                            top: 220,
                            left: -20,
                            position: "absolute",
                        }}
                    />
                    <MaterialCommunityIcons
                        name="music-accidental-sharp"
                        color={activeTheme.colors.primary}
                        size={32}
                        style={{
                            position: "absolute",
                            top: 220,
                            left: 340,
                        }}
                    />
                </View>
                <View
                    style={{
                        width: 9,
                        height: 9,
                        borderRadius: 100,
                        backgroundColor: isRecording
                            ? activeTheme.colors.tertiary
                            : activeTheme.colors.outlineVariant,
                        margin: 5,
                        elevation: 3,
                        alignSelf: "center",
                    }}
                ></View>
                <FAB
                    icon={"microphone"}
                    style={{
                        margin: 1,
                        marginRight: 1,
                        alignSelf: "center",
                    }}
                    onPress={async () => {
                        isRecording ? stopTuner() : startTuner();
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 0,
    },
});
