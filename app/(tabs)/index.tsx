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
            <TouchableOpacity
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: 100,
                    backgroundColor:
                        fill > 45 && fill < 55 ? "#00FF00" : "#FF0000",
                    margin: 5,
                }}
            ></TouchableOpacity>
            <AnimatedCircularProgress
                size={350}
                lineCap="square"
                rotation={-90}
                dashedBackground={{ width: 40, gap: 15 }}
                arcSweepAngle={180}
                fill={fill}
                width={10}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
            >
                {(fill) => {
                    return (
                        <Text style={{ fontSize: 60 }}>
                            {pitch.length === 3
                                ? pitch.substring(0, 2)
                                : pitch.charAt(0)}
                            <Text style={{ fontSize: 24 }}>
                                {pitch.length === 3
                                    ? pitch.substring(2)
                                    : pitch.substring(1)}
                            </Text>
                        </Text>
                    );
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
                    isRecording ? stopTuner() : startTuner();
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
