import { Text as PaperText, Card, PaperProvider } from "react-native-paper";
import { ThemeableChart, lineDataItem } from "@/components/ThemeableChart";
import { View, StyleSheet } from "react-native";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StreakCircle from "@/components/StreakCircle";
import { useCRUDService, readUser, MusicianUser } from "@/hooks/useCRUD";
import { unixIntToString } from "@/components/Entry";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";

const currentDay = new Date();
const sevenBack = new Date(currentDay.getTime() - 6 * 24 * 60 * 60 * 1000);
const thirtyBack = new Date(currentDay.getTime() - 29 * 24 * 60 * 60 * 1000);

export default function Account() {
    const [activeUser, setActiveUser] = useState<MusicianUser>({
        name: "",
        longestStreak: 0,
        currentStreak: 0,
        points: 0,
        ownedEquipmentIds: [],
    });
    const [totalDays, setTotalDays] = useState(0);
    const [dataDiff, setDataDiff] = useState<lineDataItem[]>([]);
    const [dataDur, setDataDur] = useState<lineDataItem[]>([]);
    const [chartHeight, setChartHeight] = useState(0);
    const [chartWidth, setChartWidth] = useState(0);
    const [highlightedDiff, setHighlightedDiff] =
        useState("Press to highlight");
    const [highlightedDur, setHighlightedDur] = useState("Press to highlight");
    const [durationGraphScale, setDurationGraphScale] = useState("7D");
    const [difficultyGraphScale, setdifficultyGraphScale] = useState("7D");

    const LiveCRUD = useCRUDService();
    const safeInsets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const count = await LiveCRUD!.countDays();
                setTotalDays(count!.days);
                const act = await readUser();
                setActiveUser(act!);
                let durSet = [];
                if (
                    durationGraphScale === "7D" ||
                    durationGraphScale === "30D"
                ) {
                    const aggDur = await LiveCRUD!.aggregateDur(
                        durationGraphScale === "7D" ? sevenBack : thirtyBack,
                        currentDay
                    );
                    for (const dur of aggDur) {
                        durSet.push({
                            dataPointText: `${dur.date}\n${
                                Number.isNaN(dur.duration)
                                    ? "0hrs 0m"
                                    : unixIntToString(dur.duration)
                            }`,
                            value: Math.floor(dur.duration / 1000 / 60),
                        });
                    }
                    setDataDur(durSet);
                    let diffSet = [];
                    if (
                        difficultyGraphScale === "7D" ||
                        difficultyGraphScale === "30D"
                    ) {
                        const aggDif = await LiveCRUD!.aggregateDiff(
                            difficultyGraphScale === "7D"
                                ? sevenBack
                                : thirtyBack,
                            currentDay
                        );
                        for (const diff of aggDif) {
                            diffSet.push({
                                dataPointText: `${diff.date}\n★${diff.rating}`,
                                value: diff.rating,
                            });
                        }
                        setDataDiff(diffSet);
                    }
                }
            })();
        }, [LiveCRUD])
    );

    // useEffect(() => {
    //     (async () => {
    //         let durSet = [];
    //         if (durationGraphScale === "7D" || durationGraphScale === "30D") {
    //             const aggDur = await LiveCRUD!.aggregateDur(
    //                 durationGraphScale === "7D" ? sevenBack : thirtyBack,
    //                 currentDay
    //             );
    //             for (const dur of aggDur) {
    //                 durSet.push({
    //                     dataPointText: `${dur.date}\n${
    //                         Number.isNaN(dur.duration)
    //                             ? "0hrs 0m"
    //                             : unixIntToString(dur.duration)
    //                     }`,
    //                     value: Math.floor(dur.duration / 1000 / 60),
    //                 });
    //             }
    //             setDataDur(durSet);
    //         }
    //     })();
    // }, [LiveCRUD, durationGraphScale]);

    // useEffect(() => {
    //     if (LiveCRUD != null) {
    //         (async () => {
    //             let diffSet = [];
    //             if (
    //                 difficultyGraphScale === "7D" ||
    //                 difficultyGraphScale === "30D"
    //             ) {
    //                 const aggDif = await LiveCRUD!.aggregateDiff(
    //                     difficultyGraphScale === "7D" ? sevenBack : thirtyBack,
    //                     currentDay
    //                 );
    //                 for (const diff of aggDif) {
    //                     diffSet.push({
    //                         dataPointText: `${diff.date}\n★${diff.rating}`,
    //                         value: diff.rating,
    //                     });
    //                 }
    //                 setDataDiff(diffSet);
    //             }
    //         })();
    //     }
    // }, [LiveCRUD, difficultyGraphScale]);
    console.log(dataDiff);

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
                    <View style={{ flex: 4, flexDirection: "row", gap: 5 }}>
                        <Card
                            style={{
                                ...styles.card,
                                flex: 6,
                            }}
                        >
                            <PaperText
                                style={{
                                    color: getAdaptaiveTheme().colors
                                        .onTertiaryContainer,
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
                                    level={activeUser?.currentStreak}
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
                                </View>
                                <View style={{ flexDirection: "row", gap: 5 }}>
                                    <PaperText style={styles.item}>
                                        {"Longest Streak\n"}
                                        <PaperText
                                            style={{
                                                alignSelf: "center",
                                                lineHeight: 28,
                                            }}
                                        >
                                            {activeUser?.longestStreak ===
                                            undefined
                                                ? 0
                                                : activeUser!.longestStreak}
                                        </PaperText>
                                    </PaperText>
                                </View>
                            </View>
                        </Card>
                    </View>
                    <Card
                        style={{
                            ...styles.card,
                            flex: 7,
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
                                marginBottom: 10,
                            }}
                        >
                            {"Duration"}
                        </PaperText>
                        {/* <SegmentedButtons
                            value={durationGraphScale}
                            onValueChange={(value) => {
                                setDurationGraphScale(value);
                            }}
                            theme={{
                                colors: {
                                    secondaryContainer:
                                        "rgba(106, 219, 167, 0.3)",
                                },
                            }}
                            style={{
                                marginBottom: 15,
                            }}
                            density="high"
                            buttons={[
                                {
                                    value: "7D",
                                    label: "7D",
                                    labelStyle: { fontWeight: "bold" },
                                },
                                {
                                    value: "30D",
                                    label: "30D",
                                    labelStyle: { fontWeight: "bold" },
                                },
                                {
                                    value: "360D",
                                    label: "360D",
                                    labelStyle: { fontWeight: "bold" },
                                },
                            ]}
                        /> */}
                        <View>
                            <View style={styles.chartHighlight}>
                                <PaperText style={styles.chartHighlightText}>
                                    {dataDur.length! < 3
                                        ? "Log more entires to acccess stats"
                                        : highlightedDur}
                                </PaperText>
                            </View>
                            <ThemeableChart
                                hidden={dataDur.length < 3}
                                data={dataDur!}
                                width={chartWidth + 1}
                                highlightFunction={(item: any) => {
                                    setHighlightedDur(item.dataPointText);
                                }}
                                //* Change it to 85 when seg buttons are used.
                                height={chartHeight - 48}
                                lineColor={getAdaptaiveTheme().colors.tertiary}
                                startColor={getAdaptaiveTheme().colors.tertiary}
                                endColor={getAdaptaiveTheme().colors.tertiary}
                            />
                        </View>
                    </Card>
                    <Card
                        style={{
                            ...styles.card,
                            flex: 7,
                        }}
                    >
                        <PaperText
                            style={{
                                color: getAdaptaiveTheme().colors
                                    .onTertiaryContainer,
                                marginBottom: 10,
                            }}
                        >
                            {"Difficulty"}
                        </PaperText>
                        {/* <SegmentedButtons
                            value={difficultyGraphScale}
                            onValueChange={(value) => {
                                setdifficultyGraphScale(value);
                            }}
                            theme={{
                                colors: {
                                    secondaryContainer:
                                        "rgba(106, 219, 167, 0.3)",
                                },
                            }}
                            style={{
                                marginBottom: 15,
                            }}
                            density="high"
                            buttons={[
                                {
                                    value: "7D",
                                    label: "7D",
                                    labelStyle: { fontWeight: "bold" },
                                },
                                {
                                    value: "30D",
                                    label: "30D",
                                    labelStyle: { fontWeight: "bold" },
                                },
                                {
                                    value: "360D",
                                    label: "360D",
                                    labelStyle: { fontWeight: "bold" },
                                },
                            ]}
                        /> */}
                        <View>
                            <View style={styles.chartHighlight}>
                                <PaperText style={styles.chartHighlightText}>
                                    {dataDur.length! < 3
                                        ? "Log more entires to acccess stats"
                                        : highlightedDiff}
                                </PaperText>
                            </View>
                            <ThemeableChart
                                hidden={dataDiff.length < 3}
                                data={dataDiff!}
                                width={chartWidth + 1}
                                highlightFunction={(item: any) => {
                                    setHighlightedDiff(item.dataPointText);
                                }}
                                height={chartHeight - 48}
                                lineColor={getAdaptaiveTheme().colors.tertiary}
                                startColor={getAdaptaiveTheme().colors.tertiary}
                                endColor={getAdaptaiveTheme().colors.tertiary}
                            />
                        </View>
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
        overflow: "hidden",
    },
    cardTitle: {
        marginBottom: 5,
    },
    row: {
        flexDirection: "row",
        marginBottom: 8,
        justifyContent: "center",
    },
    item: {
        flex: 1,
        textAlign: "center",
    },
    chartHighlight: {
        borderRadius: 10,
        backgroundColor: "rgba(10,10,10,0.2)",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        position: "absolute",
        alignSelf: "flex-end",
    },
    chartHighlightText: {
        textAlign: "center",
        lineHeight: 20,
    },
});
