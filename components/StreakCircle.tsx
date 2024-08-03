import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { useState } from "react";
import { Text as PaperText } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const CONSISTBONUS = {
    S0: 1.0,
    S1: 1.15,
    S2: 1.25,
    S3: 1.35,
    S4: 1.5,
    S5: 1.6,
    S6: 1.75,
    S7: 2.0,
};

export default function StreakCircle(props: {
    level: number;
    unfilled: string;
    filled: string;
    flameTop?: number;
    flameLeft?: number;
}) {
    const local_level = props.level >= 7 ? 7 : props.level;
    const bonus = (() => {
        switch (local_level) {
            case 0:
                return 0;
                break;
            case 1:
                return CONSISTBONUS.S1;
                break;
            case 2:
                return CONSISTBONUS.S2;
                break;
            case 3:
                return CONSISTBONUS.S3;
                break;
            case 4:
                return CONSISTBONUS.S4;
                break;
            case 5:
                return CONSISTBONUS.S5;
                break;
            case 6:
                return CONSISTBONUS.S6;
                break;
            case 7:
                return CONSISTBONUS.S7;
                break;
            default:
                break;
        }
    })();
    return (
        <>
            <AnimatedCircularProgress
                size={115}
                lineCap="round"
                rotation={180}
                // // style={{ transform: [{ scaleX: -1 }], margin: 0 }}
                arcSweepAngle={360}
                fill={(100 / 7) * local_level}
                width={5}
                tintColor={props.filled}
                backgroundColor={props.unfilled}
            >
                {(fill) => (
                    <>
                        <PaperText
                            style={{
                                fontSize: 26,
                                fontWeight: "bold",
                            }}
                        >
                            {" "}
                            {`${bonus}x`}{" "}
                        </PaperText>
                        <PaperText style={{ fontSize: 12 }}>
                            Pts bonus
                        </PaperText>
                    </>
                )}
            </AnimatedCircularProgress>
            <Fontisto
                name="fire"
                size={42}
                color={props.level >= 7 ? props.filled : props.unfilled}
                style={{
                    position: "absolute",
                    top: props.flameTop === undefined ? 85 : props.flameTop!,
                    left: props.flameLeft === undefined ? 22 : props.flameLeft!,
                    elevation: 5,
                }}
            ></Fontisto>
            {/* <PaperText
                style={{
                    fontSize: 38,
                    position: "absolute",
                    top: 77,
                    left: 40,
                }}
            >
                🔥
            </PaperText> */}
        </>
    );
}
