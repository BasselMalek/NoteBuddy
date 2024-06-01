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
import { Colors } from "@/constants/Colors";
import IconButton from "@/components/IconButton";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import calcMidi from "@/constants/MidiNotes";
import { Svg, Circle } from "react-native-svg";

export default function index() {
    const currentTheme = useColorScheme() ?? "light";
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
        <View style={styles.container}>
            <StatusBar style="dark"></StatusBar>
            <AnimatedCircularProgress
                size={350}
                lineCap="butt"
                rotation={-90}
                arcSweepAngle={180}
                fill={fill}
                width={10}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
            >
                {(fill) => {
                    if (pitch.length === 3) {
                        // const rege = new RegExp(/!([A-Z]#{0, 1})([0-9])/);
                        // const x = rege.exec(pitch);
                        const localNote = pitch.substring(0, 2);
                        const localOctave = pitch.substring(2);
                        return (
                            <Text style={{ fontSize: 60 }}>
                                {localNote}
                                <Text style={{ fontSize: 7, lineHeight: 37 }}>
                                    {localOctave}
                                </Text>
                            </Text>
                        );
                    } else if (pitch.length === 2) {
                        const localNote = pitch.charAt(0);
                        const localOctave = pitch.substring(1);
                        return (
                            <Text style={{ fontSize: 60, zIndex: 9 }}>
                                {localNote}
                                <Text style={{ fontSize: 7, lineHeight: 37 }}>
                                    {localOctave}
                                </Text>
                            </Text>
                        );
                    } else {
                        return <Text>{pitch}</Text>;
                    }
                }}
            </AnimatedCircularProgress>
            <TouchableOpacity
                style={{
                    width: 9,
                    height: 9,
                    borderRadius: 100,
                    backgroundColor: isRecording ? "#00FF00" : "#FF0000",
                    margin: 5,
                }}
            ></TouchableOpacity>
            <IconButton
                onPress={async () => {
                    if (isRecording) {
                        stopTuner();
                    } else {
                        startTuner();
                    }
                }}
                icon={"microphone"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        paddingHorizontal: 90,
    },
    startButton: {
        backgroundColor: Colors.dark.tint,
    },
});
