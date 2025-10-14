import { AudioContext } from "react-native-audio-api";
import { useSharedValue } from "react-native-reanimated";
import { useRef, useState, useCallback, useLayoutEffect } from "react";

type BeatType = "downbeat" | "upbeat";

type PlayNoteMethod = (beatType: BeatType, time: number) => void;

interface SetupResponse {
    playNote: PlayNoteMethod;
}

interface PlayerOptions {
    bpm: number;
    numBeats: number;
    setup: (audioContext: AudioContext) => SetupResponse;
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

export default function useMetronomePlayer(options: PlayerOptions) {
    const { bpm, numBeats, setup } = options;

    const [isPlaying, setIsPlaying] = useState(false);

    const bpmRef = useRef(bpm);
    const isPlayingRef = useRef(isPlaying);
    const numBeatsRef = useRef(numBeats);

    const progressSV = useSharedValue(0);
    const currentBeat = useSharedValue(0);

    const playingBeat = useSharedValue<PlayingBeat>(getPlayingBeat());

    useLayoutEffect(() => {
        bpmRef.current = bpm;
        isPlayingRef.current = isPlaying;
        numBeatsRef.current = numBeats;
    }, [bpm, isPlaying, numBeats]);

    useLayoutEffect(() => {
        const audioContext = new AudioContext();

        const { playNote } = setup(audioContext);

        let frameCount = 0;
        let nextNoteTime = 0;
        let averageFrameTime = 0;

        let startTime = 0;
        let currentTime = 0;

        function advancePattern() {
            const beatType: BeatType =
                currentBeat.value === 0 ? "downbeat" : "upbeat";
            playingBeat.value = getPlayingBeat(beatType);
            playNote(beatType, nextNoteTime);

            currentBeat.value = (currentBeat.value + 1) % numBeatsRef.current;
        }

        function playerLoop() {
            frameCount += 1;
            const timePerBeat = 60.0 / bpmRef.current;
            const totalLoopTime = timePerBeat * numBeatsRef.current;
            currentTime = audioContext.currentTime;
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
                playingBeat.value = getPlayingBeat();
                startTime = audioContext.currentTime;
                currentTime = audioContext.currentTime;
                nextNoteTime = audioContext.currentTime;
                playerLoop();
            });
        } else {
            frameCount = 0;
            averageFrameTime = 0;
            progressSV.value = 0;
            currentBeat.value = 0;
            playingBeat.value = getPlayingBeat();
        }
        return () => {
            playingBeat.value = getPlayingBeat();
            audioContext.close();
        };
    }, [isPlaying, setup]);

    const play = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const stop = useCallback(() => {
        setIsPlaying(false);
    }, []);

    return {
        playingBeat,
        progressSV,
        currentBeat,
        isPlaying,
        play,
        stop,
    };
}
