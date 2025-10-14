import { AudioContext, AudioBuffer } from "react-native-audio-api";
import { useRef, useCallback } from "react";
import { Asset } from "expo-asset";

interface FileSoundState {
    audioBuffer: AudioBuffer | null;
    isLoaded: boolean;
}

export const useFileSound = (
    audioContext: AudioContext,
    fileName: string,
    initialVolume: number = 1.0
): {
    audioContext: AudioContext;
    volume: number;
    play: (time: number) => void;
    load: () => Promise<void>;
} => {
    const stateRef = useRef<FileSoundState>({
        audioBuffer: null,
        isLoaded: false,
    });

    const volumeRef = useRef(initialVolume);

    const load = useCallback(async (): Promise<void> => {
        if (stateRef.current.isLoaded) {
            return;
        }

        try {
            const buffer = await Asset.fromModule(
                require("@/assets/sounds/Perc_MetronomeQuartz_lo.wav")
            )
                .downloadAsync()
                .then((asset) => {
                    if (!asset.localUri) {
                        throw new Error("Failed to load audio asset");
                    }
                    return audioContext.decodeAudioDataSource(asset.localUri);
                });

            stateRef.current.audioBuffer = buffer;
            stateRef.current.isLoaded = true;

            console.log(`Audio file loaded: ${fileName}`);
        } catch (error) {
            console.error(`Failed to load audio file: ${fileName}`, error);
            throw error;
        }
    }, [audioContext, fileName]);

    const play = useCallback((): void => {
        if (!stateRef.current.isLoaded || !stateRef.current.audioBuffer) {
            console.warn(
                `Audio file not loaded: ${fileName}. Call load() first.`
            );
            return;
        }

        const source = audioContext.createBufferSource();
        source.buffer = stateRef.current.audioBuffer;
        const gain = audioContext.createGain();
        source.connect(gain);
        gain.connect(audioContext.destination);
        gain.gain.exponentialRampToValueAtTime(
            2.3,
            audioContext.currentTime + 7
        );
        gain.gain.exponentialRampToValueAtTime(
            0,
            audioContext.currentTime + 13
        );
        source.start(audioContext.currentTime);
        source.stop(audioContext.currentTime + 17);
    }, [audioContext, fileName]);

    return {
        audioContext,
        volume: volumeRef.current,
        play,
        load,
    };
};
