import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { PitchDetector } from "react-native-pitch-detector";
import { StatusBar } from "expo-status-bar";
import { PERMISSIONS, check, RESULTS, request } from "react-native-permissions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import calcMidi from "@/constants/MidiNotes";
import { PaperProvider, FAB, Text as PaperText } from "react-native-paper";
import { getAdaptaiveTheme, LightTheme, DarkTheme } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function index() {
    const safeInsets = useSafeAreaInsets();
    const [isRecording, setisRecording] = useState<Boolean>();
    const [pitch, setPitch] = useState<string>("Nothing Yet");
    const [fill, setFill] = useState<number>(0);

    async function startTuner() {
        {
            //TODO(2): Add some sort of buffering and averaging to avoid noise or the occasional harmonic making the tuner spazm
        }
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
        }
    }
    async function stopTuner() {
        PitchDetector.stop();
        setisRecording(await PitchDetector.isRecording());
        PitchDetector.removeAllListeners();
        setFill(0);
    }

    return (
        <PaperProvider theme={getAdaptaiveTheme()}>
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
                    <StatusBar style="auto"></StatusBar>
                    <MaterialCommunityIcons
                        size={32}
                        name="music-note"
                        color={
                            fill > 47 && fill < 53
                                ? getAdaptaiveTheme().colors.tertiary
                                : getAdaptaiveTheme().colors.outlineVariant
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
                            tintColor={getAdaptaiveTheme().colors.tertiary}
                            backgroundColor={
                                getAdaptaiveTheme().colors.primaryContainer
                            }
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
                            color={getAdaptaiveTheme().colors.primary}
                            style={{
                                top: 220,
                                left: -20,
                                position: "absolute",
                            }}
                        />
                        <MaterialCommunityIcons
                            name="music-accidental-sharp"
                            color={getAdaptaiveTheme().colors.primary}
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
                                ? getAdaptaiveTheme().colors.tertiary
                                : getAdaptaiveTheme().colors.outlineVariant,
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
        </PaperProvider>
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
