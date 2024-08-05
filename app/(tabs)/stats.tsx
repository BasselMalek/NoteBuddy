import { Text as PaperText, Card, PaperProvider } from "react-native-paper";
import { ThemeableChart } from "@/components/ThemeableChart";
import { View, StyleSheet } from "react-native";
import EquipmentWall from "@/components/EquipmentWall";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StreakCircle from "@/components/StreakCircle";
import { useCRUDService } from "@/hooks/useCRUD";
import { unixIntToString } from "@/components/Entry";
import { useEffect, useState } from "react";
const currentDay = new Date();
const sevenBack = new Date(currentDay.getTime() - 6 * 24 * 60 * 60 * 1000);
export default function Account() {
    const [totalDays, setTotalDays] = useState(0);
    const [avgDiff, setAvgDiff] = useState("");
    const [dataDiff, setDataDiff] = useState<any>();
    const [dataDur, setDataDur] = useState<any>();
    const [avgDur, setAvgDur] = useState("");
    const [chartHeight, setChartHeight] = useState(0);
    const [chartWidth, setChartWidth] = useState(0);
    const LiveCRUD = useCRUDService();
    const safeInsets = useSafeAreaInsets();
    useEffect(() => {
        if (LiveCRUD != null) {
            (async () => {
                const count = await LiveCRUD!.countDays();
                setTotalDays(count!.days);
                const aggDiff = await LiveCRUD!.aggregateDiff(
                    sevenBack,
                    currentDay
                );
                const aggDur = await LiveCRUD!.aggregateDur(
                    sevenBack,
                    currentDay
                );
                let diffs = 0,
                    durs = 0,
                    days = 0,
                    diffSet = [],
                    durSet = [];
                for (const diff of aggDiff) {
                    diffs += diff.rating;
                    days++;
                }
                for (const dur of aggDur) {
                    durSet.push({
                        dataPointText: Number.isNaN(dur.duration)
                            ? "0hrs 0m"
                            : unixIntToString(dur.duration),
                        value: dur.duration,
                    });
                    durs += dur.duration;
                }
                durs /= days;
                diffs /= days;
                setAvgDiff(Number.isNaN(diffs) ? "0" : diffs.toFixed(2));
                console.log(durSet);

                setDataDur(durSet);
                setAvgDur(
                    Number.isNaN(durs) ? "0hrs 0m" : unixIntToString(durs)
                );
            })();
        }
    }, [LiveCRUD]);

    return (
        <PaperProvider theme={getAdaptaiveTheme()}>
            <View
                style={{
                    flex: 1,
                    paddingTop: safeInsets.top + 5,
                    paddingBottom: safeInsets.bottom,
                    paddingRight: safeInsets.right,
                    paddingLeft: safeInsets.left,
                }}
            >
                <View style={styles.rootContainer}>
                    <View style={{ flex: 3, flexDirection: "row", gap: 5 }}>
                        <Card
                            style={{
                                ...styles.card,
                                flex: 6,
                            }}
                        >
                            <PaperText
                                style={{
                                    color: "rgba(60,60,60,0.3)",
                                    // color: getAdaptaiveTheme().colors
                                    //     .onTertiaryContainer,
                                    marginBottom: 5,
                                }}
                            >
                                {"Streak"}
                            </PaperText>
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <StreakCircle
                                    level={1}
                                    filled={getAdaptaiveTheme().colors.tertiary}
                                    unfilled={
                                        getAdaptaiveTheme().colors
                                            .surfaceVariant
                                    }
                                />
                            </View>
                        </Card>
                        <Card
                            style={{
                                ...styles.card,
                                paddingHorizontal: 10,
                                flex: 13,
                            }}
                        >
                            <PaperText
                                style={{
                                    color: getAdaptaiveTheme().colors
                                        .onTertiaryContainer,
                                    marginBottom: 5,
                                }}
                            >
                                {"Stats"}
                            </PaperText>
                            <View
                                style={{
                                    borderRadius: 10,
                                    backgroundColor: "rgba(10,10,10,0.3)",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 5,
                                }}
                            >
                                <View style={{ flexDirection: "row", gap: 5 }}>
                                    <PaperText style={styles.item}>
                                        {"Days Practiced\n"}
                                        <PaperText
                                            style={{
                                                alignSelf: "center",
                                                lineHeight: 28,
                                            }}
                                        >
                                            {totalDays}
                                        </PaperText>
                                    </PaperText>
                                    <PaperText style={styles.item}>
                                        {"Avg. Duration\n"}
                                        <PaperText
                                            style={{
                                                alignSelf: "center",
                                                lineHeight: 28,
                                            }}
                                        >
                                            {avgDur}
                                        </PaperText>
                                    </PaperText>
                                </View>
                                <View style={{ flexDirection: "row", gap: 5 }}>
                                    <PaperText style={styles.item}>
                                        {"Longest Streak"}
                                    </PaperText>
                                    <PaperText style={styles.item}>
                                        {"Avg. Difficulty\n"}
                                        <PaperText
                                            style={{
                                                alignSelf: "center",
                                                lineHeight: 28,
                                            }}
                                        >
                                            {avgDiff}
                                        </PaperText>
                                    </PaperText>
                                </View>
                            </View>
                        </Card>
                    </View>
                    <View style={{ flex: 4, flexDirection: "row", gap: 5 }}>
                        <Card
                            style={{
                                ...styles.card,
                                flex: 1,
                                overflow: "hidden",
                            }}
                            onLayout={(e) => {
                                setChartHeight(e.nativeEvent.layout.height);
                                setChartWidth(e.nativeEvent.layout.width);
                            }}
                        >
                            <PaperText
                                style={{
                                    color: getAdaptaiveTheme().colors
                                        .onTertiaryContainer,
                                    marginBottom: 5,
                                }}
                            >
                                {"Duration"}
                            </PaperText>
                            <ThemeableChart
                                data={dataDur}
                                width={chartWidth}
                                height={chartHeight}
                                lineColor="rgba(106, 219, 167,1)"
                                startColor="rgba(106, 219, 167,1)"
                                endColor="rgba(106, 219, 167,1)"
                            />
                        </Card>
                        <Card style={{ ...styles.card, flex: 1 }}>
                            <PaperText
                                style={{
                                    color: getAdaptaiveTheme().colors
                                        .onTertiaryContainer,
                                    marginBottom: 5,
                                }}
                            >
                                {"Difficulty"}
                            </PaperText>
                        </Card>
                    </View>
                    <Card style={{ ...styles.card, flex: 7 }}>
                        <EquipmentWall
                            resource={require("../../assets/images/Melamine-wood-004.png")}
                        ></EquipmentWall>
                    </Card>
                </View>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 5,
        rowGap: 5,
    },
    card: {
        padding: 7,
    },
    cardTitle: {
        // color: getAdaptaiveTheme().colors.onTertiaryContainer,
        marginBottom: 5,
    },
    row: {
        flexDirection: "row",
        marginBottom: 8,
        justifyContent: "center",
    },
    item: {
        // marginHorizontal: 5,
        flex: 1,
        textAlign: "center",
    },
});
