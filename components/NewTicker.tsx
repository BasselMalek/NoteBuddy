import { View, StyleSheet } from "react-native";
import Animated, {
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
    beats: number;
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
                              translateX.value + 100,
                              tickerSpringConfig
                          ),
                          withRepeat(
                              withSequence(
                                  withSpring(
                                      translateX.value - 100,
                                      tickerSpringConfig
                                  ),
                                  withSpring(
                                      translateX.value + 100,
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
                        height: 50,
                        width: 50,
                        backgroundColor: props.targetColor,
                        borderRadius: 200,
                        marginVertical: 50,
                        alignSelf: "center",
                        elevation: 5,
                    },
                    tickerAnimatedStyle,
                ]}
            />
        </View>
    );
}

// // const styles = StyleSheet.create({
// //     ticker: {
// //         borderRadius: 100,
// //         height: 30,
// //         width: 30,
// //     },
// // });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    box: {
        height: 45,
        width: 45,
        backgroundColor: "#b58df1",
        borderRadius: 200,
        marginVertical: 50,
        alignSelf: "center",
    },
});

export { Ticker, TimeSignature };

//! old ball ticker
// const xval = useSharedValue(0);
// const animatedStyles = useAnimatedStyle(() => ({
//     height: 40,
//     width: 40,
//     backgroundColor: "red",
//     transform: [{ translateX: xval.value }],
// }));

// const colorVals = Array.from({ length: props.beats }, (v, i) =>
//     useSharedValue(0)
// );
// const tickerStyles = Array.from({ length: props.beats }, (v, i) =>
//     useAnimatedStyle(() => {
//         return {
//             backgroundColor:
//                 colorVals[i].value === 0
//                     ? props.sourceColor
//                     : props.targetColor,
//         };
//     })
// );
// const interval = useRef<NodeJS.Timeout | null>(null);

// // // useEffect(() => {
// // //     const timeouts: NodeJS.Timeout[] = []; // Array to store timeout IDs
// // //     if (props.metronomeStatus) {
// // //         const beatDuration = Math.floor(60000 / props.bpm); // duration of one beat in milliseconds
// // //         const toggleValues = () => {
// // //             colorVals.forEach((v, i) => {
// // //                 const timeoutId1 = setTimeout(() => {
// // //                     v.value = v.value === 1 ? 0 : 1;
// // //                 }, i * beatDuration);
// // //                 timeouts.push(timeoutId1);
// // //                 const timeoutId2 = setTimeout(() => {
// // //                     v.value = v.value === 1 ? 0 : 1;
// // //                 }, (i + 1) * beatDuration);
// // //                 timeouts.push(timeoutId2);
// // //             });
// // //         };
// // //         // Start the first sequence immediately
// // //         // Continue the sequence in intervals
// // //         interval.current = setInterval(
// // //             toggleValues,
// // //             colorVals.length * beatDuration
// // //         );
// // //     } else {
// // //         clearInterval(interval.current!);
// // //         timeouts.forEach((timeoutId) => clearTimeout(timeoutId)); // Clear all timeouts
// // //         colorVals.forEach((v, i) => {
// // //             v.value = 0;
// // //         });
// // //     }
// // //     return () => {
// // //         clearInterval(interval.current!);
// // //         timeouts.forEach((timeoutId) => clearTimeout(timeoutId)); // Clear all timeouts
// // //         colorVals.forEach((v, i) => {
// // //             v.value = 0;
// // //         });
// // //     };
// // // }, [props.metronomeStatus]);

// return (
//     <View
//         style={{
//             flexDirection: "column",
//             alignSelf: "center",
//             gap: 15,
//             margin: 20,
//         }}
//     >
//         {/* {Array.from({ length: props.beats }, (v, i) => i).map((v, i) => (
//             <Animated.View
//                 style={[styles.ticker, tickerStyles[i]]}
//                 key={i}
//             ></Animated.View>
//         ))} */}
//         <Animated.View
//             style={{
//                 ...animatedStyles,
//             }}
//         ></Animated.View>
//         <FAB
//             icon={"check"}
//             onPress={() => {
//                 xval.value = withTiming(withSpring(xval.value + 50), {
//                     duration: 1000,
//                 });
//             }}
//         ></FAB>
//     </View>
// );
