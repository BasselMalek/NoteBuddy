import { View, StyleSheet } from "react-native";
import { useEffect, useLayoutEffect } from "react";
import Animated, {
    SharedValue,
    SnappySpringConfig,
    useAnimatedReaction,
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

function Pendulum(props: {
    metronomeStatus: boolean;
    progress?: SharedValue<number>;
    sourceColor: string;
    targetColor: string;
    bpm: number;
}) {
    const translateX = useSharedValue<number>(0);
    const tickerSpringConfig = {
        duration: 60000 / props.bpm - (60000 / props.bpm) * 0.2,
        dampingRatio: 0.7,
        overshootClamping: false,
    };
    useAnimatedReaction(
        () => props.progress?.value,
        (prev, now) => {
            console.log(now);
        },
        []
    );

    const tickerAnimatedStyle = useAnimatedStyle(() =>
        props.progress
            ? {
                  transform: [
                      {
                          translateX: props.metronomeStatus
                              ? withSpring(
                                    (props.progress.value + 1) % 2 == 0
                                        ? translateX.value + 110
                                        : translateX.value - 110,
                                    {
                                        stiffness: 1825,
                                        damping: 120,
                                        mass: 5,
                                        overshootClamping: false,
                                        energyThreshold: 6e-9,
                                    }
                                )
                              : withSpring(0),
                      },
                  ],
              }
            : {
                  transform: [
                      {
                          translateX: props.metronomeStatus
                              ? withSequence(
                                    withSpring(translateX.value + 110, {
                                        ...tickerSpringConfig,
                                        duration:
                                            (60000 / props.bpm -
                                                (60000 / props.bpm) * 0.3) *
                                            0.5,
                                    }),
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
                                        -1
                                    )
                                )
                              : withSpring(0, tickerSpringConfig),
                      },
                  ],
              }
    );

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

export { Pendulum, TimeSignature };
