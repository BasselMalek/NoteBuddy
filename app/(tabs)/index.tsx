import { useState } from "react";
import {
    View,
    ScrollView,
    Text,
    Button,
    StyleSheet,
    Platform,
    Pressable,
    Appearance,
    useColorScheme,
    TouchableOpacity,
} from "react-native";
import { PitchDetector } from "react-native-pitch-detector";
import { StatusBar } from "expo-status-bar";
import { PERMISSIONS, check, RESULTS, request } from "react-native-permissions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import calcMidi from "@/constants/MidiNotes";
import {
    PaperProvider,
    Button as PaperButton,
    FAB,
    Text as PaperText,
    Switch,
    Card,
    MD3DarkTheme as DefaultDark,
    MD3LightTheme as DefaultLight,
} from "react-native-paper";
import { Svg, Circle } from "react-native-svg";
import { LightTheme, DarkTheme } from "@/constants/Colors";

export default function index() {
    const currentTheme = useColorScheme() ?? "light";
    const [activeTheme, setActiveTheme] = useState(
        currentTheme === "light" ? LightTheme : DarkTheme
    );
    const [isRecording, setisRecording] = useState<Boolean>();
    const [pitch, setPitch] = useState<string>("Nothing Yet");
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
            console.log("started");
            PitchDetector.addListener(async (data) => {
                const liveInfo = calcMidi(data.frequency);
                setPitch(liveInfo.note);
                setFill(liveInfo.fill);
                console.log(liveInfo);
                setisRecording(await PitchDetector.isRecording());
            });
        }
    }
    async function stopTuner() {
        PitchDetector.stop();
        setisRecording(await PitchDetector.isRecording());
        PitchDetector.removeAllListeners();
    }

    return (
        <PaperProvider theme={activeTheme}>
            <View style={styles.container}>
                <StatusBar style="auto"></StatusBar>
                <MaterialCommunityIcons
                    size={32}
                    name="music-note"
                    color={
                        fill > 45 && fill < 55
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
                        backgroundColor={activeTheme.colors.primaryContainer}
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
                <TouchableOpacity
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
                ></TouchableOpacity>
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
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 0,
    },
});
