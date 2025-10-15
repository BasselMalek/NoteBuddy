import { AudioContext } from "react-native-audio-api";
import { useSharedValue } from "react-native-reanimated";
import { useRef, useState, useCallback, useLayoutEffect } from "react";
import { Asset } from "expo-asset";

const CLICK_DURATION = 17;

type BeatType = "downbeat" | "upbeat";

interface PlayerOptions {
    bpm: number;
    numBeats: number;
}

interface PlayingBeat {
    downbeat: boolean;
    upbeat: boolean;
}

function getPlayingBeat(beatType?: BeatType): PlayingBeat {
    return {
        downbeat: beatType === "downbeat",
        upbeat: beatType === "upbeat",
    };
}

const loadSoundBuffers = async (audioContext: AudioContext) => {
    try {
        const downBuffer = await Asset.fromModule(
            require("@/assets/sounds/Perc_MetronomeQuartz_hi.wav")
        )
            .downloadAsync()
            .then((asset) => {
                if (!asset.localUri) {
                    throw new Error("Failed to load audio asset");
                }
                return audioContext.decodeAudioDataSource(asset.localUri);
            });
        const upBuffer = await Asset.fromModule(
            require("@/assets/sounds/Perc_MetronomeQuartz_lo.wav")
        )
            .downloadAsync()
            .then((asset) => {
                if (!asset.localUri) {
                    throw new Error("Failed to load audio asset");
                }
                return audioContext.decodeAudioDataSource(asset.localUri);
            });

        console.log(`Audio files loaded`);

        return { downBuffer, upBuffer };
    } catch (error) {
        console.error(`Failed to load audio files: `, error);
        throw error;
    }
};

export default function useMetronomePlayer(options: PlayerOptions) {
    const { bpm, numBeats } = options;

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const bpmRef = useRef(bpm);
    const isPlayingRef = useRef(isPlaying);
    const numBeatsRef = useRef(numBeats);
    const playNote = useRef<
        ((beat: BeatType, scheduledTime: number) => void) | null
    >(null);
    const progressSV = useSharedValue(0);
    const currentBeat = useSharedValue(0);
    const audioContext = useRef<AudioContext | null>(null);

    const playingBeat = useSharedValue<PlayingBeat>(getPlayingBeat());

    useLayoutEffect(() => {
        bpmRef.current = bpm;
        isPlayingRef.current = isPlaying;
        numBeatsRef.current = numBeats;
    }, [bpm, isPlaying, numBeats]);

    useLayoutEffect(() => {
        let frameCount = 0;
        let nextNoteTime = 0;
        let averageFrameTime = 0;

        let startTime = 0;
        let currentTime = 0;
        audioContext.current = new AudioContext();

        function advancePattern() {
            const beatType: BeatType =
                currentBeat.value === 0 ? "downbeat" : "upbeat";
            playingBeat.value = getPlayingBeat(beatType);
            playNote.current!(beatType, nextNoteTime);

            currentBeat.value = (currentBeat.value + 1) % numBeatsRef.current;
        }

        function playerLoop() {
            if (!isLoaded) {
                setIsPlaying(false);
                return;
            }
            if (!audioContext.current) return;

            frameCount += 1;
            const timePerBeat = 60.0 / bpmRef.current;
            const totalLoopTime = timePerBeat * numBeatsRef.current;
            currentTime = audioContext.current.currentTime;
            const timeDiff = currentTime - startTime;
            averageFrameTime = timeDiff / frameCount;
            progressSV.value = (timeDiff % totalLoopTime) / totalLoopTime;
            if (currentTime - (nextNoteTime - timePerBeat) > 0.05) {
                playingBeat.value = getPlayingBeat();
            }
            if (currentTime + averageFrameTime >= nextNoteTime) {
                advancePattern();
                nextNoteTime += timePerBeat;
            }
            if (isPlayingRef.current) {
                requestAnimationFrame(playerLoop);
            }
        }
        if (isPlaying) {
            requestAnimationFrame(() => {
                frameCount = 0;
                averageFrameTime = 0;
                progressSV.value = 0;
                currentBeat.value = 0;
                playingBeat.value = getPlayingBeat("downbeat");
                startTime = audioContext.current!.currentTime;
                currentTime = audioContext.current!.currentTime;
                nextNoteTime = audioContext.current!.currentTime;
                playerLoop();
            });
        } else {
            frameCount = 0;
            averageFrameTime = 0;
            progressSV.value = 0;
            currentBeat.value = 0;
            playingBeat.value = getPlayingBeat("downbeat");
        }
        return () => {
            audioContext.current?.close();
            playingBeat.value = getPlayingBeat("downbeat");
        };
    }, [isPlaying, isLoaded]);

    const play = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const stop = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const load = useCallback(async () => {
        if (!audioContext.current) return;

        const { downBuffer, upBuffer } = await loadSoundBuffers(
            audioContext.current
        );
        playNote.current = (beat: BeatType, scheduledTime: number) => {
            if (beat === "downbeat") {
                const downBeat = audioContext.current!.createBufferSource();
                const gain = audioContext.current!.createGain();
                downBeat.buffer = downBuffer;
                downBeat.connect(gain);
                gain.connect(audioContext.current!.destination);
                gain.gain.value = 5;
                downBeat.start(scheduledTime);
                downBeat.stop(scheduledTime + CLICK_DURATION);
            } else {
                const upBeat = audioContext.current!.createBufferSource();
                upBeat.buffer = upBuffer;
                upBeat.connect(audioContext.current!.destination);
                upBeat.start(scheduledTime);
                upBeat.stop(scheduledTime + CLICK_DURATION);
            }
        };
        setIsLoaded(true);
    }, []);

    return {
        playingBeat,
        progressSV,
        currentBeat,
        isPlaying,
        play,
        stop,
        load,
    };
}
