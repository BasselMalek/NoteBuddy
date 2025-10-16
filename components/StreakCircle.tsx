import { Text as PaperText } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function StreakCircle(props: {
    level: number;
    unfilled: string;
    filled: string;
    flameTop?: number;
    flameLeft?: number;
}) {
    return (
        <>
            <AnimatedCircularProgress
                size={100}
                lineCap="round"
                rotation={180}
                arcSweepAngle={360}
                fill={(100 / 7) * props.level}
                width={5}
                tintColor={props.filled}
                backgroundColor={props.unfilled}
            >
                {() => (
                    <>
                        <PaperText
                            style={{
                                fontSize: 26,
                                fontWeight: "bold",
                            }}
                        >
                            {props.level}
                        </PaperText>
                        <PaperText style={{ fontSize: 12 }}>{"Days"}</PaperText>
                    </>
                )}
            </AnimatedCircularProgress>
        </>
    );
}
