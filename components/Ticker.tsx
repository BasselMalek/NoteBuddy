import {
    View,
    Text,
    Button,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from "react-native";
import {
    PaperProvider,
    Text as PaperText,
    Chip,
    Card,
    Button as PaperButton,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, LightTheme } from "@/constants/Colors";
import React, {
    useState,
    useRef,
    useReducer,
    ComponentPropsWithoutRef,
    Ref,
    Component,
    useEffect,
    createRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Svg, Circle } from "react-native-svg";
import Animated, {
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
    runOnUI,
    useAnimatedStyle,
    interpolateColor,
    StyleProps,
    createAnimatedPropAdapter,
    withDelay,
    cancelAnimation,
} from "react-native-reanimated";

const AnimatedChipBase = Animated.createAnimatedComponent(
    React.forwardRef(Chip)
);
interface TimeSignature {
    beats: number;
    beatValue: number;
}
const AnimatedChip = forwardRef(
    (
        props: {
            sourceColor: string;
            targetColor: string;
            ballStyle: StyleProp<ViewStyle>;
        },
        ref
    ) => {
        const sharedColorValue = useSharedValue(0);
        const animatedChipStyles = useAnimatedStyle(() => {
            // // const backgroundColor = interpolateColor(
            // //     sharedColorValue.value,
            // //     [0, 1],
            // //     [props.sourceColor, props.targetColor]
            // // );
            const backgroundColor =
                sharedColorValue.value === 0
                    ? props.sourceColor
                    : props.targetColor;
            return { backgroundColor };
        });
        useImperativeHandle(ref, () => ({
            animate: (duration: number) => {
                sharedColorValue.value = withSequence(
                    withTiming(1, { duration: duration / 2 }),
                    withTiming(0, { duration: duration / 2 })
                );
            },
            cancelAnimation: () => {
                cancelAnimation(sharedColorValue);
            },
        }));

        return (
            <AnimatedChipBase
                style={[
                    {
                        borderRadius: 100,
                        elevation: 4,
                    },
                    animatedChipStyles,
                ]}
            >
                {""}
            </AnimatedChipBase>
        );
    }
);

function Ticker(props: {
    beats: number;
    metronomeStatus: boolean;
    sourceColor: string;
    targetColor: string;
    bpm: number;
}) {
    const initArray = Array.from({ length: props.beats }, (j, k) => k);
    const noteRefs = Array.from({ length: props.beats }, (j, k) => createRef());

    useEffect(() => {
        if (props.metronomeStatus) {
            noteRefs.forEach((ref) => {
                ref.current.animate(6000 / props.bpm);
            });
        } else {
            noteRefs.forEach((ref) => {
                cancelAnimation(ref.current.cancelAnimation);
            });
        }

        return () => {};
    }, [props.metronomeStatus, props.bpm]);

    return (
        <View
            style={{
                flexDirection: "row",
                gap: 15,
                margin: 20,
                justifyContent: "center",
            }}
        >
            {initArray.map((val, index) => {
                return (
                    <AnimatedChip
                        key={index}
                        ref={noteRefs[index]}
                        sourceColor={props.sourceColor}
                        targetColor={props.targetColor}
                        ballStyle={{}}
                    ></AnimatedChip>
                );
            })}
        </View>
    );
}

export { TimeSignature, Ticker };
