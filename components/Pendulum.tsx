import { View } from "react-native";
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
interface TimeSignature {
    beats: number;
    beatValue: number;
}

function Pendulum(props: {
    metronomeStatus: boolean;
    progress: SharedValue<number>;
    sourceColor: string;
    targetColor: string;
    bpm: number;
    signature: number;
}) {
    const translateX = useSharedValue<number>(0);
    const tickerSpringConfig = {
        stiffness: 1825,
        damping: 120,
        mass: 6,
        overshootClamping: false,
    };

    const tickerAnimatedStyle = useAnimatedStyle(() => {
        const toVal =
            translateX.value +
            props.progress.value * (220 / (props.signature - 1)) -
            110;
        return {
            transform: [
                {
                    translateX: props.metronomeStatus
                        ? withSpring(toVal, tickerSpringConfig)
                        : withSpring(0),
                },
            ],
        };
    });

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
