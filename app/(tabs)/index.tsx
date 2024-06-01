import { useState } from "react";
import {
    View,
    ScrollView,
    Text,
    Button,
    StyleSheet,
    Platform,
} from "react-native";
import { PitchDetector } from "react-native-pitch-detector";
import { PERMISSIONS, check, RESULTS, request } from "react-native-permissions";

export default function index() {
    const [sound, setSound] = useState();
    const [pitch, setPitch] = useState<string>();
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
            PitchDetector.addListener(console.log);
        }
    }
    async function stopTuner() {
        PitchDetector.stop();
    }

    return (
        <ScrollView>
            <Text>
                Hi! Press on the record/playback button to start playing audio
                recorded after delay
            </Text>
            <Text>Current Pitch: {test}</Text>
            <Button title="Start record/playback" onPress={startTuner} />
            <Button title="Stop" onPress={stopTuner} />
        </ScrollView>
    );
}
