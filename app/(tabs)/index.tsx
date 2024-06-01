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
} from "react-native";
import { PitchDetector } from "react-native-pitch-detector";
import { StatusBar } from "expo-status-bar";
import { PERMISSIONS, check, RESULTS, request } from "react-native-permissions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import IconButton from "@/components/IconButton";

export default function index() {
    const currentTheme = useColorScheme() ?? "light";
    console.log(currentTheme);
    const [sound, setSound] = useState();
    const [pitch, setPitch] = useState<string>("Nothing Yet");
    const [test, setTest] = useState();

    async function startTuner() {
        let status = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (status != RESULTS.GRANTED) {
            const permReq = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
            status = permReq;
        }
        if (
            status === RESULTS.GRANTED &&
            !(await PitchDetector.isRecording()).valueOf()
        ) {
            PitchDetector.start();
            PitchDetector.addListener((data) => {
                setPitch(data.tone);
            });
        }
    }
    async function stopTuner() {
        PitchDetector.stop();
        PitchDetector.removeAllListeners();
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark"></StatusBar>
            <Text>{pitch}</Text>
            <IconButton
                onPress={async () => {
                    if (await PitchDetector.isRecording()) {
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
