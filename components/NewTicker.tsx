import { View, StyleSheet } from "react-native";
import { useEffect } from "react";
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
} from "react-native-reanimated";
interface TimeSignature {
    beats: number;
    beatValue: number;
}

function Ticker(props: {
    // beats: number;
    metronomeStatus: boolean;
    sourceColor: string;
    targetColor: string;
    bpm: number;
}) {
    const translateX = useSharedValue<number>(0);
    const tickerSpringConfig = {
        duration: 60000 / props.bpm,
        dampingRatio: 0.5,
        stiffness: 500,
        restDisplacementThreshold: 100,
        overshootClamping: true,
    };
    const tickerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: props.metronomeStatus
                    ? withSequence(
                          withSpring(
                              translateX.value + 110,
                              tickerSpringConfig
                          ),
                          withRepeat(
                              withSequence(
                                  withSpring(
                                      translateX.value - 110,
                                      tickerSpringConfig
                                  ),
                                  withSpring(
                                      translateX.value + 110,
                                      tickerSpringConfig
                                  )
                              ),
                              0
                          )
                      )
                    : withSpring(0),
            },
        ],
    }));

    return (
        <View
            style={{
                alignSelf: "center",
                width: 250,
                height: 15,
                justifyContent: "center",
                borderColor: props.sourceColor,
                borderWidth: 5,
                borderRadius: 200,
                margin: 50,
            }}
        >
            <Animated.View
                style={[
                    {
                        height: 40,
                        width: 40,
                        borderRadius: 200,
                        marginVertical: 50,
                        backgroundColor: props.targetColor,
                        alignSelf: "center",
                        elevation: 5,
                    },
                    tickerAnimatedStyle,
                ]}
            />
        </View>
    );
}

export { Ticker, TimeSignature };
